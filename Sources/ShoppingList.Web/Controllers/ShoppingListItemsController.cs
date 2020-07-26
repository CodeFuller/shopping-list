using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ShoppingList.Logic.Exceptions;
using ShoppingList.Logic.Extensions;
using ShoppingList.Logic.Interfaces;
using ShoppingList.Web.Contracts.ShoppingItemContracts;

namespace ShoppingList.Web.Controllers
{
	[Authorize]
	[ApiController]
	[Route("api/shopping-lists/{shoppingListId}/items")]
	public class ShoppingListItemsController : ControllerBase
	{
		private readonly IShoppingListItemService shoppingListItemService;

		private readonly ILogger<ShoppingListItemsController> logger;

		public ShoppingListItemsController(IShoppingListItemService shoppingListItemService, ILogger<ShoppingListItemsController> logger)
		{
			this.shoppingListItemService = shoppingListItemService ?? throw new ArgumentNullException(nameof(shoppingListItemService));
			this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
		}

		[HttpPost]
		public async Task<ActionResult<OutputShoppingItemData>> CreateShoppingListItem([FromRoute] string shoppingListId, [FromBody] InputShoppingItemData itemData, CancellationToken cancellationToken)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			try
			{
				var newItem = await shoppingListItemService.CreateShoppingListItem(shoppingListId.ToId(), itemData.ToModel(), cancellationToken);

				return Ok(new OutputShoppingItemData(newItem));
			}
			catch (NotFoundException e)
			{
				logger.LogError(e, "Failed to find shopping list {ShoppingListId}", shoppingListId);
				return NotFound();
			}
		}

		[HttpPut("{itemId}")]
		public async Task<ActionResult<OutputShoppingItemData>> UpdateShoppingListItem([FromRoute] string shoppingListId, [FromRoute] string itemId, [FromBody] InputShoppingItemData itemData, CancellationToken cancellationToken)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			try
			{
				var item = itemData.ToModel();
				item.Id = itemId.ToId();
				await shoppingListItemService.UpdateShoppingListItem(shoppingListId.ToId(), item, cancellationToken);

				return Ok(new OutputShoppingItemData(item));
			}
			catch (NotFoundException e)
			{
				logger.LogError(e, "Failed to find item {ShoppingListItemId} in shopping list {ShoppingListId}", itemId, shoppingListId);
				return NotFound();
			}
		}

		[HttpPatch]
		public async Task<ActionResult<IEnumerable<OutputShoppingItemData>>> ReorderShoppingListItems([FromRoute] string shoppingListId, [FromBody] IReadOnlyCollection<string> newItemsOrder, CancellationToken cancellationToken)
		{
			try
			{
				var newItems = await shoppingListItemService.ReorderShoppingListItems(shoppingListId.ToId(), newItemsOrder.Select(x => x.ToId()), cancellationToken);

				return Ok(newItems.Select(x => new OutputShoppingItemData(x)));
			}
			catch (NotFoundException e)
			{
				logger.LogError(e, "Failed to reorder items for shopping list {ShoppingListId}", shoppingListId);
				return NotFound();
			}
			catch (DataConflictException e)
			{
				logger.LogError(e, "Failed to reorder items for shopping list {ShoppingListId}", shoppingListId);
				return Conflict();
			}
		}

		[HttpDelete("{itemId}")]
		public async Task<ActionResult> DeleteShoppingListItem([FromRoute] string shoppingListId, [FromRoute] string itemId, CancellationToken cancellationToken)
		{
			try
			{
				await shoppingListItemService.DeleteShoppingListItem(shoppingListId.ToId(), itemId.ToId(), cancellationToken);
				return NoContent();
			}
			catch (NotFoundException e)
			{
				logger.LogError(e, "Failed to reorder items for shopping list {ShoppingListId}", shoppingListId);
				return NotFound();
			}
		}
	}
}
