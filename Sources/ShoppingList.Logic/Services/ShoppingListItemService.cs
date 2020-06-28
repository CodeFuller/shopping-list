using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ShoppingList.Logic.Interfaces;
using ShoppingList.Logic.Models;

namespace ShoppingList.Logic.Services
{
	internal class ShoppingListItemService : IShoppingListItemService
	{
		private readonly IShoppingListItemRepository repository;

		private readonly IItemsOrderingHelper itemsOrderingHelper;

		public ShoppingListItemService(IShoppingListItemRepository repository, IItemsOrderingHelper itemsOrderingHelper)
		{
			this.repository = repository ?? throw new ArgumentNullException(nameof(repository));
			this.itemsOrderingHelper = itemsOrderingHelper ?? throw new ArgumentNullException(nameof(itemsOrderingHelper));
		}

		public async Task<ShoppingItemModel> CreateShoppingListItem(IdModel shoppingListId, ShoppingItemModel item, CancellationToken cancellationToken)
		{
			var newItemId = await repository.CreateItem(shoppingListId, item, cancellationToken);
			item.Id = newItemId;

			return item;
		}

		public Task<IReadOnlyCollection<ShoppingItemModel>> GetShoppingListItems(IdModel shoppingListId, CancellationToken cancellationToken)
		{
			return repository.GetItems(shoppingListId, cancellationToken);
		}

		public Task UpdateShoppingListItem(IdModel shoppingListId, ShoppingItemModel item, CancellationToken cancellationToken)
		{
			return repository.UpdateItem(shoppingListId, item, cancellationToken);
		}

		public async Task<IReadOnlyCollection<ShoppingItemModel>> ReorderShoppingListItems(IdModel shoppingListId, IEnumerable<IdModel> newItemsOrder, CancellationToken cancellationToken)
		{
			var currentItems = await repository.GetItems(shoppingListId, cancellationToken);
			var newItems = itemsOrderingHelper.ReorderItems(currentItems, newItemsOrder).ToList();

			await repository.SetItems(shoppingListId, newItems, cancellationToken);

			return newItems;
		}

		public Task DeleteShoppingListItem(IdModel shoppingListId, IdModel itemId, CancellationToken cancellationToken)
		{
			return repository.DeleteItem(shoppingListId, itemId, cancellationToken);
		}
	}
}
