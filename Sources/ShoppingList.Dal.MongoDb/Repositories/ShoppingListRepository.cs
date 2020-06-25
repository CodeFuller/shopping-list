using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MongoDB.Driver;
using ShoppingList.Dal.MongoDb.Documents;
using ShoppingList.Dal.MongoDb.Extensions;
using ShoppingList.Logic.Interfaces;
using ShoppingList.Logic.Models;

namespace ShoppingList.Dal.MongoDb.Repositories
{
	internal class ShoppingListRepository : IShoppingListRepository
	{
		private readonly IMongoCollection<ShoppingListDocument> shoppingListCollection;

		public ShoppingListRepository(IMongoCollection<ShoppingListDocument> shoppingListCollection)
		{
			this.shoppingListCollection = shoppingListCollection ?? throw new ArgumentNullException(nameof(shoppingListCollection));
		}

		public async Task CreateShoppingList(ShoppingListModel shoppingList, CancellationToken cancellationToken)
		{
			var document = new ShoppingListDocument(shoppingList);
			await shoppingListCollection.InsertOneAsync(document, cancellationToken: cancellationToken);

			shoppingList.Id = document.Id.ToIdModel();
		}

		public async Task<IReadOnlyCollection<ShoppingListInfo>> GetShoppingListsInfo(CancellationToken cancellationToken)
		{
			using var cursor = await shoppingListCollection
				.FindAsync(FilterDefinition<ShoppingListDocument>.Empty, cancellationToken: cancellationToken);

			var shoppingLists = await cursor.ToListAsync(cancellationToken);

			return shoppingLists
				.Select(x => x.ToShoppingListInfo())
				.ToList();
		}

		public Task<ShoppingListModel> GetShoppingList(IdModel listId, CancellationToken cancellationToken)
		{
			throw new NotImplementedException();
		}
	}
}
