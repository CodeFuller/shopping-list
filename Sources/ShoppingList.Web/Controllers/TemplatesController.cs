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
using ShoppingList.Web.Dto.TemplateDto;

namespace ShoppingList.Web.Controllers
{
	[Route("api/templates")]
	[ApiController]
	public class TemplatesController : ControllerBase
	{
		private readonly ITemplatesRepository repository;

		private readonly ILogger<TemplatesController> logger;

		public TemplatesController(ITemplatesRepository repository, ILogger<TemplatesController> logger)
		{
			this.repository = repository ?? throw new ArgumentNullException(nameof(repository));
			this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
		}

		[HttpGet]
		public async Task<ActionResult<IEnumerable<OutputTemplateData>>> GetTemplates(CancellationToken cancellationToken)
		{
			var templates = await repository.GetTemplates(cancellationToken).ConfigureAwait(false);

			return Ok(templates.Select(CreateTemplateDto));
		}

		[HttpGet("{templateId}")]
		public async Task<ActionResult<OutputTemplateData>> GetTemplate(string templateId, CancellationToken cancellationToken)
		{
			try
			{
				var template = await repository.GetTemplate(templateId, cancellationToken).ConfigureAwait(false);
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
			var template = templateData.ToObject();
			var newTemplateId = await repository.CreateTemplate(template, cancellationToken).ConfigureAwait(false);

			return Created(GetTemplateUri(newTemplateId), null);
		}

		private OutputTemplateData CreateTemplateDto(ListTemplate template)
		{
			return new OutputTemplateData(template, GetTemplateUri(template.Id));
		}

		private Uri GetTemplateUri(string templateId)
		{
			var actionUrl = Url.Action(nameof(GetTemplate), null, new { templateId }, Request.Scheme, Request.Host.ToUriComponent());
			return new Uri(actionUrl, UriKind.RelativeOrAbsolute);
		}
	}
}
