using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using ShoppingList.Logic.Interfaces;
using ShoppingList.Logic.Models;

namespace ShoppingList.Logic.Services
{
	internal class ShoppingTemplateService : IShoppingTemplateService
	{
		private readonly IShoppingTemplateRepository repository;

		private readonly ILogger<ShoppingTemplateService> logger;

		public ShoppingTemplateService(IShoppingTemplateRepository repository, ILogger<ShoppingTemplateService> logger)
		{
			this.repository = repository ?? throw new ArgumentNullException(nameof(repository));
			this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
		}

		public async Task<ShoppingTemplateModel> CreateTemplate(ShoppingTemplateInfo templateInfo, CancellationToken cancellationToken)
		{
			logger.LogInformation("Creating template {@TemplateInfo} ...", templateInfo);

			var shoppingTemplate = new ShoppingTemplateModel
			{
				Title = templateInfo.Title,
				Items = new List<ShoppingItemModel>(),
			};

			var templateId = await repository.CreateTemplate(shoppingTemplate, cancellationToken);
			shoppingTemplate.Id = templateId;

			logger.LogInformation("Created template with id {TemplateId}", templateId);

			return shoppingTemplate;
		}

		public Task<IReadOnlyCollection<ShoppingTemplateInfo>> GetAllTemplates(CancellationToken cancellationToken)
		{
			return repository.GetAllTemplates(cancellationToken);
		}

		public Task DeleteTemplate(IdModel templateId, CancellationToken cancellationToken)
		{
			logger.LogInformation("Deleting template {TemplateId} ...", templateId);

			return repository.DeleteTemplate(templateId, cancellationToken);
		}
	}
}
