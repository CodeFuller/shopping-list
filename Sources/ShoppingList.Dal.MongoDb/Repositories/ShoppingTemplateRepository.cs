using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;
using ShoppingList.Dal.MongoDb.Documents;
using ShoppingList.Dal.MongoDb.Extensions;
using ShoppingList.Dal.MongoDb.Interfaces;
using ShoppingList.Logic.Exceptions;
using ShoppingList.Logic.Interfaces;
using ShoppingList.Logic.Models;

namespace ShoppingList.Dal.MongoDb.Repositories
{
	internal class ShoppingTemplateRepository : IShoppingTemplateRepository, IShoppingTemplateItemRepository
	{
		private readonly IMongoCollection<ShoppingTemplateDocument> templatesCollection;

		private readonly IShoppingItemsRepository<ShoppingTemplateDocument, ShoppingItemDocument> itemsRepository;

		public ShoppingTemplateRepository(IMongoCollection<ShoppingTemplateDocument> templatesCollection, IShoppingItemsRepository<ShoppingTemplateDocument, ShoppingItemDocument> itemsRepository)
		{
			this.templatesCollection = templatesCollection ?? throw new ArgumentNullException(nameof(templatesCollection));
			this.itemsRepository = itemsRepository ?? throw new ArgumentNullException(nameof(itemsRepository));
		}

		public async Task<IdModel> CreateTemplate(ShoppingTemplateModel shoppingTemplate, CancellationToken cancellationToken)
		{
			var document = new ShoppingTemplateDocument(shoppingTemplate);
			await templatesCollection.InsertOneAsync(document, cancellationToken: cancellationToken);

			return document.Id.ToIdModel();
		}

		public async Task<IReadOnlyCollection<ShoppingTemplateInfo>> GetTemplatesInfo(CancellationToken cancellationToken)
		{
			var projection = Builders<ShoppingTemplateDocument>.Projection.Exclude(x => x.Items);
			var options = new FindOptions<ShoppingTemplateDocument, ShoppingTemplateDocument> { Projection = projection };

			using var cursor = await templatesCollection
				.FindAsync(FilterDefinition<ShoppingTemplateDocument>.Empty, options, cancellationToken);

			var templatesList = await cursor.ToListAsync(cancellationToken);

			return templatesList
				.Select(x => x.ToShoppingTemplateInfo())
				.ToList();
		}

		public async Task<ShoppingTemplateModel> GetTemplate(IdModel templateId, CancellationToken cancellationToken)
		{
			var shoppingTemplate = await templatesCollection.FindDocument(templateId.ToObjectId(), cancellationToken);
			return shoppingTemplate.ToShoppingTemplateModel();
		}

		public async Task DeleteTemplate(IdModel templateId, CancellationToken cancellationToken)
		{
			var filter = templateId.ToObjectId().BuildDocumentFilter<ShoppingTemplateDocument>();
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

			await itemsRepository.CreateItem(templateId.ToObjectId(), newItem, cancellationToken);

			return newItem.Id.ToIdModel();
		}

		public async Task<IReadOnlyCollection<ShoppingItemModel>> GetItems(IdModel templateId, CancellationToken cancellationToken)
		{
			var items = await itemsRepository.GetItems(templateId.ToObjectId(), cancellationToken);

			return items.Select(x => x.ToModel()).ToList();
		}

		public Task SetItems(IdModel templateId, IEnumerable<ShoppingItemModel> items, CancellationToken cancellationToken)
		{
			var documentItems = items.Select(x => new ShoppingItemDocument(x));
			return itemsRepository.SetItems(templateId.ToObjectId(), documentItems, cancellationToken);
		}

		public Task UpdateItem(IdModel templateId, ShoppingItemModel item, CancellationToken cancellationToken)
		{
			return itemsRepository.UpdateItem(templateId.ToObjectId(), new ShoppingItemDocument(item), cancellationToken);
		}

		public Task DeleteItem(IdModel templateId, IdModel itemId, CancellationToken cancellationToken)
		{
			return itemsRepository.DeleteItem(templateId.ToObjectId(), itemId.ToObjectId(), cancellationToken);
		}
	}
}
