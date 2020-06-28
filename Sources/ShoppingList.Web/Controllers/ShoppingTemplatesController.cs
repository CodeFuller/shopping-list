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
using ShoppingList.Web.Contracts.ShoppingTemplateContracts;

namespace ShoppingList.Web.Controllers
{
	[ApiController]
	[Route("api/templates")]
	public class ShoppingTemplatesController : ControllerBase
	{
		private readonly IShoppingTemplateService templateService;

		private readonly ILogger<ShoppingTemplatesController> logger;

		public ShoppingTemplatesController(IShoppingTemplateService templateService, ILogger<ShoppingTemplatesController> logger)
		{
			this.templateService = templateService ?? throw new ArgumentNullException(nameof(templateService));
			this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
		}

		[HttpGet]
		public async Task<ActionResult<IEnumerable<OutputShoppingTemplateInfoData>>> GetTemplates(CancellationToken cancellationToken)
		{
			var templates = await templateService.GetTemplatesInfo(cancellationToken);

			return Ok(templates.Select(x => new OutputShoppingTemplateInfoData(x)));
		}

		[HttpPost]
		public async Task<ActionResult<OutputShoppingTemplateData>> CreateTemplate([FromBody] InputShoppingTemplateInfoData templateInfoData, CancellationToken cancellationToken)
		{
			var templateInfo = templateInfoData.ToModel();
			var newTemplate = await templateService.CreateTemplate(templateInfo, cancellationToken);

			return Ok(new OutputShoppingTemplateData(newTemplate));
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
				logger.LogError(e, "Template with id {TemplateId} does not exist", templateId);
				return NotFound();
			}
		}
	}
}
