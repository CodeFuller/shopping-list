using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using ShoppingList.Logic.Interfaces;
using ShoppingList.Logic.Models;

namespace ShoppingList.Logic.Services
{
	internal class ShoppingTemplateItemService : IShoppingTemplateItemService
	{
		private readonly IShoppingTemplateItemRepository repository;

		public ShoppingTemplateItemService(IShoppingTemplateItemRepository repository)
		{
			this.repository = repository ?? throw new ArgumentNullException(nameof(repository));
		}

		public async Task<ShoppingItemModel> CreateTemplateItem(IdModel templateId, ShoppingItemModel item, CancellationToken cancellationToken)
		{
			var newItemId = await repository.CreateItem(templateId, item, cancellationToken);
			item.Id = newItemId;

			return item;
		}

		public Task<IReadOnlyCollection<ShoppingItemModel>> GetTemplateItems(IdModel templateId, CancellationToken cancellationToken)
		{
			return repository.GetItems(templateId, cancellationToken);
		}

		public Task UpdateTemplateItem(IdModel templateId, ShoppingItemModel item, CancellationToken cancellationToken)
		{
			return repository.UpdateItem(templateId, item, cancellationToken);
		}

		public Task ReorderItems(IdModel templateId, IEnumerable<IdModel> newItemsOrder, CancellationToken cancellationToken)
		{
			return repository.ReorderItems(templateId, newItemsOrder, cancellationToken);
		}

		public Task DeleteItem(IdModel templateId, IdModel itemId, CancellationToken cancellationToken)
		{
			return repository.DeleteItem(templateId, itemId, cancellationToken);
		}
	}
}
