﻿using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using ShoppingList.Logic.Models;

namespace ShoppingList.Logic.Interfaces
{
	public interface IShoppingListRepository
	{
		Task CreateShoppingList(ShoppingListModel shoppingList, CancellationToken cancellationToken);

		Task<IReadOnlyCollection<ShoppingListInfo>> GetShoppingListsInfo(CancellationToken cancellationToken);

		Task<ShoppingListModel> GetShoppingList(IdModel shoppingListId, CancellationToken cancellationToken);

		Task DeleteShoppingList(IdModel shoppingListId, CancellationToken cancellationToken);
	}
}
