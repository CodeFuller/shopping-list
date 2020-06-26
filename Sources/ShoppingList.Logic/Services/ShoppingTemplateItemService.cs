using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ShoppingList.Logic.Exceptions;
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

		public async Task<IReadOnlyCollection<ShoppingItemModel>> ReorderItems(IdModel templateId, IEnumerable<IdModel> newItemsOrder, CancellationToken cancellationToken)
		{
			var currentItems = await repository.GetItems(templateId, cancellationToken);
			var existingIds = currentItems.Select(x => x.Id).ToList();

			var newOrdersList = newItemsOrder.ToList();

			var missingIds = existingIds.Except(newOrdersList).ToList();
			var unknownIds = newOrdersList.Except(existingIds).ToList();

			if (missingIds.Any())
			{
				throw new DataConflictException($"Missing item id(s) in re-order list: {String.Join(", ", missingIds)}");
			}

			if (unknownIds.Any())
			{
				throw new DataConflictException($"Unknown item id(s) in re-order list: {String.Join(", ", unknownIds)}");
			}

			var newItems = newOrdersList
				.Select(id => currentItems.Single(x => x.Id == id))
				.ToList();

			await repository.SetItems(templateId, newItems, cancellationToken);

			return newItems;
		}

		public Task DeleteItem(IdModel templateId, IdModel itemId, CancellationToken cancellationToken)
		{
			return repository.DeleteItem(templateId, itemId, cancellationToken);
		}
	}
}
