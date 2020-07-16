using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using ShoppingList.Logic.Models;

namespace ShoppingList.Logic.Interfaces
{
	public interface IShoppingListItemService
	{
		Task<ShoppingItemModel> CreateShoppingListItem(IdModel shoppingListId, ShoppingItemModel item, CancellationToken cancellationToken);

		Task UpdateShoppingListItem(IdModel shoppingListId, ShoppingItemModel item, CancellationToken cancellationToken);

		Task<IReadOnlyCollection<ShoppingItemModel>> ReorderShoppingListItems(IdModel shoppingListId, IEnumerable<IdModel> newItemsOrder, CancellationToken cancellationToken);

		Task DeleteShoppingListItem(IdModel shoppingListId, IdModel itemId, CancellationToken cancellationToken);
	}
}
