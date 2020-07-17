using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using ShoppingList.Logic.Interfaces;
using ShoppingList.Logic.Models;

namespace ShoppingList.Logic.Services
{
	internal class ShoppingListService : IShoppingListService
	{
		private readonly IShoppingTemplateRepository shoppingTemplateRepository;

		private readonly IShoppingListRepository shoppingListRepository;

		private readonly ISystemClock clock;

		private readonly ILogger<ShoppingListService> logger;

		public ShoppingListService(IShoppingTemplateRepository shoppingTemplateRepository, IShoppingListRepository shoppingListRepository,
			ISystemClock clock, ILogger<ShoppingListService> logger)
		{
			this.shoppingTemplateRepository = shoppingTemplateRepository ?? throw new ArgumentNullException(nameof(shoppingTemplateRepository));
			this.shoppingListRepository = shoppingListRepository ?? throw new ArgumentNullException(nameof(shoppingListRepository));
			this.clock = clock ?? throw new ArgumentNullException(nameof(clock));
			this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
		}

		public async Task<ShoppingListModel> CreateShoppingListFromTemplate(IdModel templateId, CancellationToken cancellationToken)
		{
			var shoppingTemplate = await shoppingTemplateRepository.GetTemplate(templateId, cancellationToken);

			var shoppingList = new ShoppingListModel
			{
				Title = $"{shoppingTemplate.Title} - {clock.UtcNow:yyyy.MM.dd}",
				Items = shoppingTemplate.Items.Select(x => new ShoppingItemModel
				{
					Id = x.Id,
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

		public Task<ShoppingListModel> GetShoppingList(IdModel shoppingListId, CancellationToken cancellationToken)
		{
			return shoppingListRepository.GetShoppingList(shoppingListId, cancellationToken);
		}

		public Task DeleteShoppingList(IdModel shoppingListId, CancellationToken cancellationToken)
		{
			logger.LogInformation("Deleting shopping list {ShoppingListId} ...", shoppingListId);

			return shoppingListRepository.DeleteShoppingList(shoppingListId, cancellationToken);
		}
	}
}
