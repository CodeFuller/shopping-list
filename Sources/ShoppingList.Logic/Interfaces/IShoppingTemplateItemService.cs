﻿using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using ShoppingList.Logic.Models;

namespace ShoppingList.Logic.Interfaces
{
	public interface IShoppingTemplateItemService
	{
		Task<ShoppingItemModel> CreateTemplateItem(IdModel templateId, ShoppingItemModel item, CancellationToken cancellationToken);

		Task<IReadOnlyCollection<ShoppingItemModel>> GetTemplateItems(IdModel templateId, CancellationToken cancellationToken);

		Task UpdateTemplateItem(IdModel templateId, ShoppingItemModel item, CancellationToken cancellationToken);

		Task<IReadOnlyCollection<ShoppingItemModel>> ReorderItems(IdModel templateId, IEnumerable<IdModel> newItemsOrder, CancellationToken cancellationToken);

		Task DeleteItem(IdModel templateId, IdModel itemId, CancellationToken cancellationToken);
	}
}
