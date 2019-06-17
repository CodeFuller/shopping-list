﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using ShoppingList.Abstractions.Exceptions;
using ShoppingList.Abstractions.Interfaces;
using ShoppingList.Abstractions.Objects;
using ShoppingList.Dal.MogoDb.Documents;

namespace ShoppingList.Dal.MogoDb.Repositories
{
	public class TemplatesRepository : ITemplatesRepository, ITemplateItemsRepository
	{
		private const string TemplatesCollectionName = "templates";

		private readonly IMongoCollection<TemplateDocument> templatesCollection;
		private readonly ILogger<TemplatesRepository> logger;

		public TemplatesRepository(IMongoClient mongoClient, ILogger<TemplatesRepository> logger, IOptions<MongoDbSettings> options)
		{
			if (mongoClient == null)
			{
				throw new ArgumentNullException(nameof(mongoClient));
			}

			var settings = options?.Value ?? throw new ArgumentNullException(nameof(options));

			// It's ok for constructor because neither GetDatabase() nor GetCollection() perform real communication with MongoDB.
			var database = mongoClient.GetDatabase(settings.DatabaseName);
			templatesCollection = database.GetCollection<TemplateDocument>(TemplatesCollectionName);

			this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
		}

		public async Task<string> CreateTemplate(ListTemplate listTemplate, CancellationToken cancellationToken)
		{
			logger.LogInformation("Creating template {@Template} ...", listTemplate);

			var document = new TemplateDocument(listTemplate);

			await templatesCollection.InsertOneAsync(document, cancellationToken: cancellationToken).ConfigureAwait(false);

			var id = document.Id;
			logger.LogInformation("Created template with id {TemplateId} ...", id);

			return id.ToString();
		}

		public async Task<IEnumerable<ListTemplate>> GetTemplates(CancellationToken cancellationToken)
		{
			var cursor = await templatesCollection
				.FindAsync(FilterDefinition<TemplateDocument>.Empty, cancellationToken: cancellationToken)
				.ConfigureAwait(false);

			using (cursor)
			{
				return (await cursor.ToListAsync(cancellationToken).ConfigureAwait(false))
					.Select(x => x.ToObject());
			}
		}

		public async Task<ListTemplate> GetTemplate(string templateId, CancellationToken cancellationToken)
		{
			var templateDoc = await FindTemplate(templateId, cancellationToken).ConfigureAwait(false);
			return templateDoc.ToObject();
		}

		public Task UpdateTemplate(ListTemplate listTemplate, CancellationToken cancellationToken)
		{
			throw new NotImplementedException();
		}

		public Task DeleteTemplate(string templateId, CancellationToken cancellationToken)
		{
			throw new NotImplementedException();
		}

		public async Task<string> CreateItem(string templateId, TemplateItem item, CancellationToken cancellationToken)
		{
			var newItemId = ObjectId.GenerateNewId();

			var newItem = new TemplateItemDocument(item)
			{
				Id = newItemId,
			};

			var filter = GetTemplateFilter(templateId);
			var update = Builders<TemplateDocument>.Update
				.Push(e => e.Items, newItem);

			var updateResult = await templatesCollection.UpdateOneAsync(filter, update, cancellationToken: cancellationToken)
				.ConfigureAwait(false);

			if (updateResult.MatchedCount < 1)
			{
				throw new NotFoundException($"The template with id of {templateId} was not found");
			}

			if (updateResult.MatchedCount > 1)
			{
				logger.LogError("Multiple ({MatchedCount}) template items are matched for {TemplateId}", updateResult.MatchedCount, templateId);
			}

			return newItemId.ToString();
		}

		public async Task<IEnumerable<TemplateItem>> GetItems(string templateId, CancellationToken cancellationToken)
		{
			var templateDoc = await FindTemplate(templateId, cancellationToken).ConfigureAwait(false);

			return templateDoc.Items.Select(x => x.ToObject());
		}

		public async Task<TemplateItem> GetItem(string templateId, string itemId, CancellationToken cancellationToken)
		{
			var templateDoc = await FindTemplate(templateId, cancellationToken).ConfigureAwait(false);
			var matchedItems = templateDoc.Items.Where(x => x.Id == ObjectId.Parse(itemId)).ToList();

			if (matchedItems.Count < 1)
			{
				throw new NotFoundException($"The item with id of {itemId} was not found in template {templateId}");
			}

			if (matchedItems.Count > 1)
			{
				logger.LogError("Multiple ({MatchedCount}) template items are matched for {TemplateId} {TemplateItemId}", matchedItems.Count, templateId, itemId);
			}

			return matchedItems.First().ToObject();
		}

		public async Task UpdateItem(string templateId, TemplateItem item, CancellationToken cancellationToken)
		{
			var newItem = new TemplateItemDocument(item);

			var templateItemFilter = GetTemplateItemFilter(templateId, item.Id);
			var itemUpdate = Builders<TemplateDocument>.Update.Set(doc => doc.Items[-1], newItem);

			var updateResult = await templatesCollection.UpdateOneAsync(templateItemFilter, itemUpdate, cancellationToken: cancellationToken).ConfigureAwait(false);

			if (updateResult.MatchedCount < 1)
			{
				throw new NotFoundException($"The template with id of {templateId} was not found");
			}

			if (updateResult.MatchedCount > 1)
			{
				logger.LogError("Multiple ({MatchedCount}) template items are matched for {TemplateId} {TemplateItemId}", updateResult.MatchedCount, templateId, item.Id);
			}
		}

		public async Task ReorderItems(string templateId, IReadOnlyCollection<string> newItemsOrder, CancellationToken cancellationToken)
		{
			var templateDoc = await FindTemplate(templateId, cancellationToken).ConfigureAwait(false);

			var reorderedItems = GetReorderedTemplateItems(templateDoc, newItemsOrder);
			var itemsUpdate = Builders<TemplateDocument>.Update.Set(doc => doc.Items, reorderedItems.ToList());

			var templateFilter = GetTemplateFilter(templateId);
			var updateResult = await templatesCollection.UpdateOneAsync(templateFilter, itemsUpdate, cancellationToken: cancellationToken).ConfigureAwait(false);

			if (updateResult.MatchedCount < 1)
			{
				throw new NotFoundException($"The template with id of {templateId} was not found");
			}

			if (updateResult.MatchedCount > 1)
			{
				logger.LogError("Multiple ({MatchedCount}) templates are matched for {TemplateId}", updateResult.MatchedCount, templateId);
			}
		}

		private static IEnumerable<TemplateItemDocument> GetReorderedTemplateItems(TemplateDocument templateDoc, IReadOnlyCollection<string> orderedItemIds)
		{
			var existingIds = templateDoc.Items.Select(x => x.Id)
				.Select(id => id.ToString())
				.ToList();

			var missingIds = existingIds.Except(orderedItemIds).ToList();
			var unknownIds = orderedItemIds.Except(existingIds).ToList();

			if (missingIds.Any())
			{
				throw new DataConflictException($"Missing item id(s) in re-order list: {String.Join(", ", missingIds)}");
			}

			if (unknownIds.Any())
			{
				throw new DataConflictException($"Unknown item id(s) in re-order list: {String.Join(", ", unknownIds)}");
			}

			var itemsOrder = orderedItemIds
				.Select((id, i) => new { Id = ObjectId.Parse(id), Index = i })
				.ToDictionary(x => x.Id, x => x.Index);

			return templateDoc.Items.OrderBy(x => itemsOrder[x.Id]);
		}

		private static FilterDefinition<TemplateDocument> GetTemplateFilter(string templateId)
		{
			var id = ObjectId.Parse(templateId);

			return Builders<TemplateDocument>.Filter
				.Where(d => d.Id == id);
		}

		private static FilterDefinition<TemplateDocument> GetTemplateItemFilter(string templateId, string itemId)
		{
			var id = ObjectId.Parse(itemId);

			var templateFilter = GetTemplateFilter(templateId);
			var itemFilter = Builders<TemplateDocument>.Filter.ElemMatch(x => x.Items, x => x.Id == id);
			return Builders<TemplateDocument>.Filter.And(templateFilter, itemFilter);
		}

		private async Task<TemplateDocument> FindTemplate(string templateId, CancellationToken cancellationToken)
		{
			var filter = GetTemplateFilter(templateId);

			var options = new FindOptions<TemplateDocument>
			{
				Limit = 1,
			};

			var cursor = await templatesCollection.FindAsync(filter, options, cancellationToken).ConfigureAwait(false);
			using (cursor)
			{
				var templateDoc = await cursor.FirstOrDefaultAsync(cancellationToken).ConfigureAwait(false);
				if (templateDoc == null)
				{
					throw new NotFoundException($"The template with id of {templateId} was not found");
				}

				return templateDoc;
			}
		}
	}
}
