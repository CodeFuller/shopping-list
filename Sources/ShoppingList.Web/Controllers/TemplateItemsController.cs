using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ShoppingList.Abstractions.Exceptions;
using ShoppingList.Abstractions.Interfaces;
using ShoppingList.Abstractions.Objects;
using ShoppingList.Web.Dto.TemplateItemDto;

namespace ShoppingList.Web.Controllers
{
	[Route("api/templates/{templateId}/items")]
	[ApiController]
	public class TemplateItemsController : ControllerBase
	{
		private readonly ITemplateItemsRepository repository;

		private readonly ILogger<TemplatesController> logger;

		public TemplateItemsController(ITemplateItemsRepository repository, ILogger<TemplatesController> logger)
		{
			this.repository = repository ?? throw new ArgumentNullException(nameof(repository));
			this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
		}

		[HttpGet]
		public async Task<ActionResult<IEnumerable<OutputTemplateItemData>>> GetTemplateItems(string templateId, CancellationToken cancellationToken)
		{
			try
			{
				var items = await repository.GetItems(templateId, cancellationToken).ConfigureAwait(false);

				return Ok(items.Select(x => CreateTemplateItemDto(templateId, x)));
			}
			catch (NotFoundException e)
			{
				logger.LogWarning(e, "Failed to find template {TemplateId}", templateId);
				return NotFound();
			}
		}

		[HttpGet("{itemId}")]
		public async Task<ActionResult<IEnumerable<OutputTemplateItemData>>> GetTemplateItem(string templateId, string itemId, CancellationToken cancellationToken)
		{
			try
			{
				var item = await repository.GetItem(templateId, itemId, cancellationToken).ConfigureAwait(false);

				return Ok(CreateTemplateItemDto(templateId, item));
			}
			catch (NotFoundException e)
			{
				logger.LogWarning(e, "Failed to find template {TemplateId}", templateId);
				return NotFound();
			}
		}

		[HttpPost]
		public async Task<ActionResult<OutputTemplateItemData>> CreateTemplateItem(string templateId, [FromBody] InputTemplateItemData itemData, CancellationToken cancellationToken)
		{
			try
			{
				var item = itemData.ToObject();
				var newItemId = await repository.CreateItem(templateId, item, cancellationToken).ConfigureAwait(false);

				return Created(GetTemplateItemUri(templateId, newItemId), null);
			}
			catch (NotFoundException e)
			{
				logger.LogWarning(e, "Failed to find template {TemplateId}", templateId);
				return NotFound();
			}
		}

		[HttpPut("{itemId}")]
		public async Task<ActionResult> UpdateTemplateItem(string templateId, string itemId, [FromBody] InputTemplateItemData itemData, CancellationToken cancellationToken)
		{
			try
			{
				var item = itemData.ToObject();
				item.Id = itemId;
				await repository.UpdateItem(templateId, item, cancellationToken).ConfigureAwait(false);
			}
			catch (NotFoundException e)
			{
				logger.LogWarning(e, "Failed to find item {TemplateItemId} in template {TemplateId}", itemId, templateId);
				return NotFound();
			}

			return NoContent();
		}

		[HttpPatch]
		public async Task<ActionResult> ReorderTemplateItems(string templateId, [FromBody] IReadOnlyCollection<string> newItemsOrder, CancellationToken cancellationToken)
		{
			try
			{
				await repository.ReorderItems(templateId, newItemsOrder, cancellationToken).ConfigureAwait(false);
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
		public async Task<ActionResult> DeleteTemplateItem(string templateId, string itemId, CancellationToken cancellationToken)
		{
			try
			{
				await repository.DeleteItem(templateId, itemId, cancellationToken).ConfigureAwait(false);
			}
			catch (NotFoundException e)
			{
				logger.LogWarning(e, "Failed to reorder items for template {TemplateId}", templateId);
				return NotFound();
			}

			return NoContent();
		}

		private OutputTemplateItemData CreateTemplateItemDto(string templateId, TemplateItem item)
		{
			return new OutputTemplateItemData(item, GetTemplateItemUri(templateId, item.Id));
		}

		private Uri GetTemplateItemUri(string templateId, string itemId)
		{
			var actionUrl = Url.Action(nameof(GetTemplateItem), null, new { templateId, itemId }, Request.Scheme, Request.Host.ToUriComponent());
			return new Uri(actionUrl, UriKind.RelativeOrAbsolute);
		}
	}
}
