using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ShoppingList.Logic.Exceptions;
using ShoppingList.Logic.Extensions;
using ShoppingList.Logic.Interfaces;
using ShoppingList.Web.Contracts.ShoppingListContracts;

namespace ShoppingList.Web.Controllers
{
	[ApiController]
	[Route("api/shopping-lists")]
	public class ShoppingListsController : ControllerBase
	{
		private readonly IShoppingListService shoppingListService;

		private readonly ILogger<ShoppingListsController> logger;

		public ShoppingListsController(IShoppingListService shoppingListService, ILogger<ShoppingListsController> logger)
		{
			this.shoppingListService = shoppingListService ?? throw new ArgumentNullException(nameof(shoppingListService));
			this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
		}

		[HttpPost]
		public async Task<ActionResult<OutputShoppingListData>> CreateShoppingList([FromBody] CreateShoppingListRequest request, CancellationToken cancellationToken)
		{
			var shoppingList = await shoppingListService.CreateShoppingListFromTemplate(request.TemplateId.ToId(), cancellationToken);
			return Ok(new OutputShoppingListData(shoppingList));
		}

		[HttpGet]
		public async Task<ActionResult<IEnumerable<ShoppingListInfoData>>> GetShoppingLists(CancellationToken cancellationToken)
		{
			var shoppingLists = await shoppingListService.GetShoppingListsInfo(cancellationToken);

			return Ok(shoppingLists.Select(x => new ShoppingListInfoData(x)));
		}

		[HttpGet("{shoppingListId}")]
		public async Task<ActionResult<OutputShoppingListData>> GetShoppingList([FromRoute] string shoppingListId, CancellationToken cancellationToken)
		{
			try
			{
				var list = await shoppingListService.GetShoppingList(shoppingListId.ToId(), cancellationToken);

				return Ok(new OutputShoppingListData(list));
			}
			catch (NotFoundException e)
			{
				logger.LogError(e, "Failed to find shopping list {ShoppingListId}", shoppingListId);
				return NotFound();
			}
		}
	}
}
