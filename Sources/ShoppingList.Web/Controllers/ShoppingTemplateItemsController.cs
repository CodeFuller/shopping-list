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
using ShoppingList.Web.Contracts.ShoppingItemContracts;

namespace ShoppingList.Web.Controllers
{
	[ApiController]
	[Route("api/templates/{templateId}/items")]
	public class ShoppingTemplateItemsController : ControllerBase
	{
		private readonly IShoppingTemplateItemService templateItemService;

		private readonly ILogger<ShoppingTemplateItemsController> logger;

		public ShoppingTemplateItemsController(IShoppingTemplateItemService templateItemService, ILogger<ShoppingTemplateItemsController> logger)
		{
			this.templateItemService = templateItemService ?? throw new ArgumentNullException(nameof(templateItemService));
			this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
		}

		[HttpGet]
		public async Task<ActionResult<IEnumerable<OutputShoppingItemData>>> GetTemplateItems([FromRoute] string templateId, CancellationToken cancellationToken)
		{
			try
			{
				var items = await templateItemService.GetTemplateItems(templateId.ToId(), cancellationToken);

				return Ok(items.Select(x => new OutputShoppingItemData(x)));
			}
			catch (NotFoundException e)
			{
				logger.LogError(e, "Failed to find template {TemplateId}", templateId);
				return NotFound();
			}
		}

		[HttpPost]
		public async Task<ActionResult<OutputShoppingItemData>> CreateTemplateItem([FromRoute] string templateId, [FromBody] InputShoppingItemData itemData, CancellationToken cancellationToken)
		{
			try
			{
				var newItem = await templateItemService.CreateTemplateItem(templateId.ToId(), itemData.ToModel(), cancellationToken);

				return Ok(new OutputShoppingItemData(newItem));
			}
			catch (NotFoundException e)
			{
				logger.LogError(e, "Failed to find template {TemplateId}", templateId);
				return NotFound();
			}
		}

		[HttpPut("{itemId}")]
		public async Task<ActionResult<OutputShoppingItemData>> UpdateTemplateItem([FromRoute] string templateId, [FromRoute] string itemId, [FromBody] InputShoppingItemData itemData, CancellationToken cancellationToken)
		{
			try
			{
				var item = itemData.ToModel();
				item.Id = itemId.ToId();
				await templateItemService.UpdateTemplateItem(templateId.ToId(), item, cancellationToken);

				return Ok(new OutputShoppingItemData(item));
			}
			catch (NotFoundException e)
			{
				logger.LogError(e, "Failed to find item {TemplateItemId} in template {TemplateId}", itemId, templateId);
				return NotFound();
			}
		}

		[HttpPatch]
		public async Task<ActionResult<IEnumerable<OutputShoppingItemData>>> ReorderTemplateItems([FromRoute] string templateId, [FromBody] IReadOnlyCollection<string> newItemsOrder, CancellationToken cancellationToken)
		{
			try
			{
				var newItems = await templateItemService.ReorderTemplateItems(templateId.ToId(), newItemsOrder.Select(x => x.ToId()), cancellationToken);

				return Ok(newItems.Select(x => new OutputShoppingItemData(x)));
			}
			catch (NotFoundException e)
			{
				logger.LogError(e, "Failed to reorder items for template {TemplateId}", templateId);
				return NotFound();
			}
			catch (DataConflictException e)
			{
				logger.LogError(e, "Failed to reorder items for template {TemplateId}", templateId);
				return Conflict();
			}
		}

		[HttpDelete("{itemId}")]
		public async Task<ActionResult> DeleteTemplateItem([FromRoute] string templateId, [FromRoute] string itemId, CancellationToken cancellationToken)
		{
			try
			{
				await templateItemService.DeleteTemplateItem(templateId.ToId(), itemId.ToId(), cancellationToken);
				return NoContent();
			}
			catch (NotFoundException e)
			{
				logger.LogError(e, "Failed to reorder items for template {TemplateId}", templateId);
				return NotFound();
			}
		}
	}
}
