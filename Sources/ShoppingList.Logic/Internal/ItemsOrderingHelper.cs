using System;
using System.Collections.Generic;
using System.Linq;
using ShoppingList.Logic.Exceptions;
using ShoppingList.Logic.Interfaces;
using ShoppingList.Logic.Models;

namespace ShoppingList.Logic.Internal
{
	internal class ItemsOrderingHelper : IItemsOrderingHelper
	{
		public IEnumerable<ShoppingItemModel> ReorderItems(IReadOnlyCollection<ShoppingItemModel> currentItems, IEnumerable<IdModel> newItemsOrder)
		{
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

			return newOrdersList
				.Select(id => currentItems.Single(x => x.Id == id));
		}
	}
}
