using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ShoppingList.Logic.Interfaces;
using ShoppingList.Logic.Models;

namespace ShoppingList.Logic.Services
{
	internal class ShoppingTemplateItemService : IShoppingTemplateItemService
	{
		private readonly IShoppingTemplateItemRepository repository;

		private readonly IItemsOrderingHelper itemsOrderingHelper;

		public ShoppingTemplateItemService(IShoppingTemplateItemRepository repository, IItemsOrderingHelper itemsOrderingHelper)
		{
			this.repository = repository ?? throw new ArgumentNullException(nameof(repository));
			this.itemsOrderingHelper = itemsOrderingHelper ?? throw new ArgumentNullException(nameof(itemsOrderingHelper));
		}

		public async Task<ShoppingItemModel> CreateTemplateItem(IdModel templateId, ShoppingItemModel item, CancellationToken cancellationToken)
		{
			var newItemId = await repository.CreateItem(templateId, item, cancellationToken);
			item.Id = newItemId;

			return item;
		}

		public Task UpdateTemplateItem(IdModel templateId, ShoppingItemModel item, CancellationToken cancellationToken)
		{
			return repository.UpdateItem(templateId, item, cancellationToken);
		}

		public async Task<IReadOnlyCollection<ShoppingItemModel>> ReorderTemplateItems(IdModel templateId, IEnumerable<IdModel> newItemsOrder, CancellationToken cancellationToken)
		{
			var currentItems = await repository.GetItems(templateId, cancellationToken);
			var newItems = itemsOrderingHelper.ReorderItems(currentItems, newItemsOrder).ToList();

			await repository.SetItems(templateId, newItems, cancellationToken);

			return newItems;
		}

		public Task DeleteTemplateItem(IdModel templateId, IdModel itemId, CancellationToken cancellationToken)
		{
			return repository.DeleteItem(templateId, itemId, cancellationToken);
		}
	}
}
