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
using ShoppingList.Web.Contracts.ShoppingTemplateContracts;

namespace ShoppingList.Web.Controllers
{
	[Route("api/templates")]
	[ApiController]
	public class TemplatesController : ControllerBase
	{
		private readonly IShoppingTemplateService templateService;

		private readonly ILogger<TemplatesController> logger;

		public TemplatesController(IShoppingTemplateService templateService, ILogger<TemplatesController> logger)
		{
			this.templateService = templateService ?? throw new ArgumentNullException(nameof(templateService));
			this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
		}

		[HttpGet]
		public async Task<ActionResult<IEnumerable<OutputTemplateData>>> GetTemplates(CancellationToken cancellationToken)
		{
			var templates = await templateService.GetAllTemplates(cancellationToken);

			return Ok(templates.Select(CreateTemplateDto));
		}

		[HttpGet("{templateId}")]
		public async Task<ActionResult<OutputTemplateData>> GetTemplate([FromRoute] string templateId, CancellationToken cancellationToken)
		{
			try
			{
				var template = await templateService.GetTemplate(templateId.ToId(), cancellationToken);
				return Ok(CreateTemplateDto(template));
			}
			catch (NotFoundException e)
			{
				logger.LogWarning(e, "Failed to find template {TemplateId}", templateId);
				return NotFound();
			}
		}

		[HttpPost]
		public async Task<ActionResult> CreateTemplate([FromBody] InputTemplateData templateData, CancellationToken cancellationToken)
		{
			var template = templateData.ToModel();
			var newTemplateId = await templateService.CreateTemplate(template, cancellationToken);

			return Created(GetTemplateUri(newTemplateId), null);
		}

		[HttpDelete("{templateId}")]
		public async Task<ActionResult> DeleteTemplate([FromRoute] string templateId, CancellationToken cancellationToken)
		{
			try
			{
				await templateService.DeleteTemplate(templateId.ToId(), cancellationToken);
				return NoContent();
			}
			catch (NotFoundException e)
			{
				logger.LogWarning(e, "Template with id {TemplateId} does not exist", templateId);
				return NotFound();
			}
		}

		private static OutputTemplateData CreateTemplateDto(ShoppingTemplateInfo templateInfo)
		{
			return new OutputTemplateData(templateInfo);
		}

		private Uri GetTemplateUri(IdModel templateId)
		{
			var actionUrl = Url.Action(nameof(GetTemplate), null, new { templateId.Value }, Request.Scheme, Request.Host.ToUriComponent());
			return new Uri(actionUrl, UriKind.RelativeOrAbsolute);
		}
	}
}
