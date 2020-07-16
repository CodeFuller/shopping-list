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
using ShoppingList.Logic.Interfaces;
using ShoppingList.Logic.Models;

namespace ShoppingList.Dal.MongoDb.Repositories
{
	internal class ShoppingListRepository : IShoppingListRepository, IShoppingListItemRepository
	{
		private readonly IMongoCollection<ShoppingListDocument> shoppingListCollection;

		private readonly IShoppingItemsRepository<ShoppingListDocument, ShoppingItemDocument> itemsRepository;

		public ShoppingListRepository(IMongoCollection<ShoppingListDocument> shoppingListCollection, IShoppingItemsRepository<ShoppingListDocument, ShoppingItemDocument> itemsRepository)
		{
			this.shoppingListCollection = shoppingListCollection ?? throw new ArgumentNullException(nameof(shoppingListCollection));
			this.itemsRepository = itemsRepository ?? throw new ArgumentNullException(nameof(itemsRepository));
		}

		public async Task CreateShoppingList(ShoppingListModel shoppingList, CancellationToken cancellationToken)
		{
			var document = new ShoppingListDocument(shoppingList);
			await shoppingListCollection.InsertOneAsync(document, cancellationToken: cancellationToken);

			shoppingList.Id = document.Id.ToIdModel();
		}

		public async Task<IReadOnlyCollection<ShoppingListInfo>> GetShoppingListsInfo(CancellationToken cancellationToken)
		{
			var projection = Builders<ShoppingListDocument>.Projection.Exclude(x => x.Items);
			var options = new FindOptions<ShoppingListDocument, ShoppingListDocument> { Projection = projection };

			using var cursor = await shoppingListCollection
				.FindAsync(FilterDefinition<ShoppingListDocument>.Empty, options, cancellationToken);

			var shoppingLists = await cursor.ToListAsync(cancellationToken);

			return shoppingLists
				.Select(x => x.ToShoppingListInfo())
				.ToList();
		}

		public async Task<IdModel> CreateItem(IdModel shoppingListId, ShoppingItemModel item, CancellationToken cancellationToken)
		{
			var newItem = new ShoppingItemDocument(item)
			{
				Id = ObjectId.GenerateNewId(),
			};

			await itemsRepository.CreateItem(shoppingListId.ToObjectId(), newItem, cancellationToken);

			return newItem.Id.ToIdModel();
		}

		public async Task<IReadOnlyCollection<ShoppingItemModel>> GetItems(IdModel shoppingListId, CancellationToken cancellationToken)
		{
			var items = await itemsRepository.GetItems(shoppingListId.ToObjectId(), cancellationToken);

			return items.Select(x => x.ToModel()).ToList();
		}

		public Task SetItems(IdModel shoppingListId, IEnumerable<ShoppingItemModel> items, CancellationToken cancellationToken)
		{
			var documentItems = items.Select(x => new ShoppingItemDocument(x));
			return itemsRepository.SetItems(shoppingListId.ToObjectId(), documentItems, cancellationToken);
		}

		public Task UpdateItem(IdModel shoppingListId, ShoppingItemModel item, CancellationToken cancellationToken)
		{
			return itemsRepository.UpdateItem(shoppingListId.ToObjectId(), new ShoppingItemDocument(item), cancellationToken);
		}

		public Task DeleteItem(IdModel shoppingListId, IdModel itemId, CancellationToken cancellationToken)
		{
			return itemsRepository.DeleteItem(shoppingListId.ToObjectId(), itemId.ToObjectId(), cancellationToken);
		}
	}
}
