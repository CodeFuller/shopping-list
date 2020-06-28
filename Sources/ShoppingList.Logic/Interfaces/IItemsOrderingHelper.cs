using System.Collections.Generic;
using ShoppingList.Logic.Models;

namespace ShoppingList.Logic.Interfaces
{
	internal interface IItemsOrderingHelper
	{
		IEnumerable<ShoppingItemModel> ReorderItems(IReadOnlyCollection<ShoppingItemModel> currentItems, IEnumerable<IdModel> newItemsOrder);
	}
}
