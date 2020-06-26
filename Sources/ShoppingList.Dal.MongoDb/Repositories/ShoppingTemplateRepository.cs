using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using MongoDB.Driver;
using ShoppingList.Dal.MongoDb.Documents;
using ShoppingList.Dal.MongoDb.Extensions;
using ShoppingList.Logic.Exceptions;
using ShoppingList.Logic.Interfaces;
using ShoppingList.Logic.Models;

namespace ShoppingList.Dal.MongoDb.Repositories
{
	internal class ShoppingTemplateRepository : IShoppingTemplateRepository, IShoppingTemplateItemRepository
	{
		private readonly IMongoCollection<ShoppingTemplateDocument> templatesCollection;
		private readonly ILogger<ShoppingTemplateRepository> logger;

		public ShoppingTemplateRepository(IMongoCollection<ShoppingTemplateDocument> templatesCollection, ILogger<ShoppingTemplateRepository> logger)
		{
			this.templatesCollection = templatesCollection ?? throw new ArgumentNullException(nameof(templatesCollection));
			this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
		}

		public async Task<IdModel> CreateTemplate(ShoppingTemplateModel shoppingTemplate, CancellationToken cancellationToken)
		{
			var document = new ShoppingTemplateDocument(shoppingTemplate);
			await templatesCollection.InsertOneAsync(document, cancellationToken: cancellationToken);

			return document.Id.ToIdModel();
		}

		public async Task<IReadOnlyCollection<ShoppingTemplateInfo>> GetTemplatesInfo(CancellationToken cancellationToken)
		{
			using var cursor = await templatesCollection
				.FindAsync(FilterDefinition<ShoppingTemplateDocument>.Empty, cancellationToken: cancellationToken);

			var templatesList = await cursor.ToListAsync(cancellationToken);

			return templatesList
				.Select(x => x.ToShoppingTemplateInfo())
				.ToList();
		}

		public async Task<ShoppingTemplateModel> GetTemplate(IdModel templateId, CancellationToken cancellationToken)
		{
			var shoppingTemplate = await FindTemplate(templateId, cancellationToken);
			return shoppingTemplate.ToShoppingTemplateModel();
		}

		public async Task DeleteTemplate(IdModel templateId, CancellationToken cancellationToken)
		{
			var filter = GetTemplateFilter(templateId);
			var deleteResult = await templatesCollection.DeleteOneAsync(filter, cancellationToken);

			if (deleteResult.DeletedCount != 1)
			{
				throw new NotFoundException($"The template with id {templateId} was not found");
			}
		}

		public async Task<IdModel> CreateItem(IdModel templateId, ShoppingItemModel item, CancellationToken cancellationToken)
		{
			var newItem = new ShoppingItemDocument(item)
			{
				Id = ObjectId.GenerateNewId(),
			};

			var update = Builders<ShoppingTemplateDocument>.Update.Push(e => e.Items, newItem);
			await UpdateTemplate(templateId, update, cancellationToken);

			return newItem.Id.ToIdModel();
		}

		public async Task<IReadOnlyCollection<ShoppingItemModel>> GetItems(IdModel templateId, CancellationToken cancellationToken)
		{
			var shoppingTemplate = await FindTemplate(templateId, cancellationToken);

			return shoppingTemplate.Items
				.Select(x => x.ToModel())
				.ToList();
		}

		public async Task UpdateItem(IdModel templateId, ShoppingItemModel item, CancellationToken cancellationToken)
		{
			var newItem = new ShoppingItemDocument(item);
			var templateItemFilter = GetTemplateItemFilter(templateId, item.Id);
			var update = Builders<ShoppingTemplateDocument>.Update.Set(doc => doc.Items[-1], newItem);

			await UpdateTemplate(templateId, templateItemFilter, update, cancellationToken);
		}

		public async Task ReorderItems(IdModel templateId, IEnumerable<IdModel> newItemsOrder, CancellationToken cancellationToken)
		{
			var shoppingTemplate = await FindTemplate(templateId, cancellationToken);
			var reorderedItems = GetReorderedTemplateItems(shoppingTemplate, newItemsOrder.ToList());

			var update = Builders<ShoppingTemplateDocument>.Update.Set(doc => doc.Items, reorderedItems.ToList());

			await UpdateTemplate(templateId, update, cancellationToken);
		}

		public async Task DeleteItem(IdModel templateId, IdModel itemId, CancellationToken cancellationToken)
		{
			var itemFilter = Builders<ShoppingItemDocument>.Filter.Eq(x => x.Id, itemId.ToObjectId());
			var update = Builders<ShoppingTemplateDocument>.Update.PullFilter(x => x.Items, itemFilter);

			await UpdateTemplate(templateId, update, cancellationToken);
		}

		private Task UpdateTemplate(IdModel templateId, UpdateDefinition<ShoppingTemplateDocument> update, CancellationToken cancellationToken)
		{
			var templateFilter = GetTemplateFilter(templateId);
			return UpdateTemplate(templateId, templateFilter, update, cancellationToken);
		}

		private async Task UpdateTemplate(IdModel templateId, FilterDefinition<ShoppingTemplateDocument> filter, UpdateDefinition<ShoppingTemplateDocument> update, CancellationToken cancellationToken)
		{
			var updateResult = await templatesCollection.UpdateOneAsync(filter, update, cancellationToken: cancellationToken);

			if (updateResult.MatchedCount < 1)
			{
				throw new NotFoundException($"The template with id of {templateId} was not found");
			}

			if (updateResult.MatchedCount > 1)
			{
				logger.LogError("Multiple ({MatchedCount}) templates are matched for {TemplateId}", updateResult.MatchedCount, templateId);
			}
		}

		private static IEnumerable<ShoppingItemDocument> GetReorderedTemplateItems(ShoppingTemplateDocument shoppingTemplate, IReadOnlyCollection<IdModel> orderedItemIds)
		{
			var existingIds = shoppingTemplate.Items.Select(x => x.Id)
				.Select(id => id.ToIdModel())
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
				.Select((id, i) => new { Id = id.ToObjectId(), Index = i })
				.ToDictionary(x => x.Id, x => x.Index);

			return shoppingTemplate.Items.OrderBy(x => itemsOrder[x.Id]);
		}

		private static FilterDefinition<ShoppingTemplateDocument> GetTemplateFilter(IdModel templateId)
		{
			var templateObjectId = templateId.ToObjectId();
			return Builders<ShoppingTemplateDocument>.Filter.Where(d => d.Id == templateObjectId);
		}

		private static FilterDefinition<ShoppingTemplateDocument> GetTemplateItemFilter(IdModel templateId, IdModel itemId)
		{
			var templateFilter = GetTemplateFilter(templateId);

			var itemObjectId = itemId.ToObjectId();
			var itemFilter = Builders<ShoppingTemplateDocument>.Filter.ElemMatch(x => x.Items, x => x.Id == itemObjectId);
			return Builders<ShoppingTemplateDocument>.Filter.And(templateFilter, itemFilter);
		}

		private async Task<ShoppingTemplateDocument> FindTemplate(IdModel templateId, CancellationToken cancellationToken)
		{
			var filter = GetTemplateFilter(templateId);

			var options = new FindOptions<ShoppingTemplateDocument>
			{
				Limit = 1,
			};

			using var cursor = await templatesCollection.FindAsync(filter, options, cancellationToken);
			var shoppingTemplate = await cursor.FirstOrDefaultAsync(cancellationToken);
			if (shoppingTemplate == null)
			{
				throw new NotFoundException($"The template with id of {templateId} was not found");
			}

			return shoppingTemplate;
		}
	}
}
