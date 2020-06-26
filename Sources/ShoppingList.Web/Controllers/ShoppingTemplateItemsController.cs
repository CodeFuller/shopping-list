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
using ShoppingList.Logic.Models;
using ShoppingList.Web.Contracts.ShoppingItemContracts;

namespace ShoppingList.Web.Controllers
{
	[Route("api/templates/{templateId}/items")]
	[ApiController]
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
		public async Task<ActionResult<IEnumerable<OutputTemplateItemData>>> GetTemplateItems([FromRoute] string templateId, CancellationToken cancellationToken)
		{
			try
			{
				var items = await templateItemService.GetTemplateItems(templateId.ToId(), cancellationToken);

				return Ok(items.Select(x => new OutputTemplateItemData(x)));
			}
			catch (NotFoundException e)
			{
				logger.LogWarning(e, "Failed to find template {TemplateId}", templateId);
				return NotFound();
			}
		}

		[HttpGet("{itemId}")]
		public async Task<ActionResult<OutputTemplateItemData>> GetTemplateItem([FromRoute] string templateId, [FromRoute] string itemId, CancellationToken cancellationToken)
		{
			try
			{
				var item = await templateItemService.GetTemplateItem(templateId.ToId(), itemId.ToId(), cancellationToken);

				return Ok(new OutputTemplateItemData(item));
			}
			catch (NotFoundException e)
			{
				logger.LogWarning(e, "Failed to find template {TemplateId}", templateId);
				return NotFound();
			}
		}

		[HttpPost]
		public async Task<ActionResult<OutputTemplateItemData>> CreateTemplateItem([FromRoute] string templateId, [FromBody] InputTemplateItemData itemData, CancellationToken cancellationToken)
		{
			try
			{
				var templateIdModel = templateId.ToId();
				var newItemId = await templateItemService.CreateTemplateItem(templateIdModel, itemData.ToModel(), cancellationToken);

				return Created(GetTemplateItemUri(templateIdModel, newItemId), null);
			}
			catch (NotFoundException e)
			{
				logger.LogWarning(e, "Failed to find template {TemplateId}", templateId);
				return NotFound();
			}
		}

		[HttpPut("{itemId}")]
		public async Task<ActionResult> UpdateTemplateItem([FromRoute] string templateId, [FromRoute] string itemId, [FromBody] InputTemplateItemData itemData, CancellationToken cancellationToken)
		{
			try
			{
				var item = itemData.ToModel();
				item.Id = itemId.ToId();
				await templateItemService.UpdateTemplateItem(templateId.ToId(), item, cancellationToken);
			}
			catch (NotFoundException e)
			{
				logger.LogWarning(e, "Failed to find item {TemplateItemId} in template {TemplateId}", itemId, templateId);
				return NotFound();
			}

			return NoContent();
		}

		[HttpPatch]
		public async Task<ActionResult> ReorderTemplateItems([FromRoute] string templateId, [FromBody] IReadOnlyCollection<string> newItemsOrder, CancellationToken cancellationToken)
		{
			try
			{
				await templateItemService.ReorderItems(templateId.ToId(), newItemsOrder.Select(x => x.ToId()), cancellationToken);
			}
			catch (NotFoundException e)
			{
				logger.LogWarning(e, "Failed to reorder items for template {TemplateId}", templateId);
				return NotFound();
			}
			catch (DataConflictException e)
			{
				logger.LogWarning(e, "Failed to reorder items for template {TemplateId}", templateId);
				return Conflict();
			}

			return NoContent();
		}

		[HttpDelete("{itemId}")]
		public async Task<ActionResult> DeleteTemplateItem([FromRoute] string templateId, [FromRoute] string itemId, CancellationToken cancellationToken)
		{
			try
			{
				await templateItemService.DeleteItem(templateId.ToId(), itemId.ToId(), cancellationToken);
			}
			catch (NotFoundException e)
			{
				logger.LogWarning(e, "Failed to reorder items for template {TemplateId}", templateId);
				return NotFound();
			}

			return NoContent();
		}

		private Uri GetTemplateItemUri(IdModel templateId, IdModel itemId)
		{
			var actionUrl = Url.Action(nameof(GetTemplateItem), null, new { templateId, itemId }, Request.Scheme, Request.Host.ToUriComponent());
			return new Uri(actionUrl, UriKind.RelativeOrAbsolute);
		}
	}
}
