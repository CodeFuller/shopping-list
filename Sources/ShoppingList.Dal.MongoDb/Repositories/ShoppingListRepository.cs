using System;
using System.Threading;
using System.Threading.Tasks;
using ShoppingList.Logic.Interfaces;
using ShoppingList.Logic.Models;

namespace ShoppingList.Dal.MongoDb.Repositories
{
	internal class ShoppingListRepository : IShoppingListRepository
	{
		public Task CreateShoppingList(ShoppingListModel shoppingList, CancellationToken cancellationToken)
		{
			throw new NotImplementedException();
		}

		public Task<ShoppingListModel> GetShoppingList(IdModel listId, CancellationToken cancellationToken)
		{
			throw new NotImplementedException();
		}
	}
}
