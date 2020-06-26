﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ShoppingList.Logic.Interfaces;
using ShoppingList.Logic.Models;

namespace ShoppingList.Logic.Services
{
	internal class ShoppingListService : IShoppingListService
	{
		private readonly IShoppingTemplateRepository shoppingTemplateRepository;

		private readonly IShoppingTemplateItemRepository shoppingTemplateItemRepository;

		private readonly IShoppingListRepository shoppingListRepository;

		private readonly ISystemClock clock;

		public ShoppingListService(IShoppingTemplateRepository shoppingTemplateRepository, IShoppingTemplateItemRepository shoppingTemplateItemRepository,
			IShoppingListRepository shoppingListRepository, ISystemClock clock)
		{
			this.shoppingTemplateRepository = shoppingTemplateRepository ?? throw new ArgumentNullException(nameof(shoppingTemplateRepository));
			this.shoppingTemplateItemRepository = shoppingTemplateItemRepository ?? throw new ArgumentNullException(nameof(shoppingTemplateItemRepository));
			this.shoppingListRepository = shoppingListRepository ?? throw new ArgumentNullException(nameof(shoppingListRepository));
			this.clock = clock ?? throw new ArgumentNullException(nameof(clock));
		}

		public async Task<ShoppingListModel> CreateShoppingListFromTemplate(IdModel templateId, CancellationToken cancellationToken)
		{
			var shoppingTemplate = await shoppingTemplateRepository.GetTemplate(templateId, cancellationToken);
			var templateItems = await shoppingTemplateItemRepository.GetItems(templateId, cancellationToken);

			var shoppingList = new ShoppingListModel
			{
				Title = $"{shoppingTemplate.Title} - {clock.UtcNow:yyyy.MM.dd}",
				Items = templateItems.Select(x => new ShoppingItemModel
				{
					Title = x.Title,
					Quantity = x.Quantity,
					Comment = x.Comment,
				}).ToList(),
			};

			await shoppingListRepository.CreateShoppingList(shoppingList, cancellationToken);

			return shoppingList;
		}

		public Task<IReadOnlyCollection<ShoppingListInfo>> GetShoppingListsInfo(CancellationToken cancellationToken)
		{
			return shoppingListRepository.GetShoppingListsInfo(cancellationToken);
		}

		public Task<ShoppingListModel> GetShoppingList(IdModel listId, CancellationToken cancellationToken)
		{
			return shoppingListRepository.GetShoppingList(listId, cancellationToken);
		}
	}
}