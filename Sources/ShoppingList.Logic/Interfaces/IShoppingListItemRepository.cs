using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using ShoppingList.Logic.Models;

namespace ShoppingList.Logic.Interfaces
{
	public interface IShoppingListItemRepository
	{
		Task<IdModel> CreateItem(IdModel shoppingListId, ShoppingItemModel item, CancellationToken cancellationToken);

		Task<IReadOnlyCollection<ShoppingItemModel>> GetItems(IdModel shoppingListId, CancellationToken cancellationToken);

		Task SetItems(IdModel shoppingListId, IEnumerable<ShoppingItemModel> items, CancellationToken cancellationToken);

		Task UpdateItem(IdModel shoppingListId, ShoppingItemModel item, CancellationToken cancellationToken);

		Task DeleteItem(IdModel shoppingListId, IdModel itemId, CancellationToken cancellationToken);
	}
}
