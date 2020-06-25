using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using ShoppingList.Logic.Models;

namespace ShoppingList.Logic.Interfaces
{
	public interface IShoppingTemplateItemRepository
	{
		Task<IdModel> CreateItem(IdModel templateId, ShoppingItemModel item, CancellationToken cancellationToken);

		Task<IReadOnlyCollection<ShoppingItemModel>> GetItems(IdModel templateId, CancellationToken cancellationToken);

		Task<ShoppingItemModel> GetItem(IdModel templateId, IdModel itemId, CancellationToken cancellationToken);

		Task UpdateItem(IdModel templateId, ShoppingItemModel item, CancellationToken cancellationToken);

		Task ReorderItems(IdModel templateId, IEnumerable<IdModel> newItemsOrder, CancellationToken cancellationToken);

		Task DeleteItem(IdModel templateId, IdModel itemId, CancellationToken cancellationToken);
	}
}
