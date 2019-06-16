using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using ShoppingList.Abstractions.Exceptions;
using ShoppingList.Abstractions.Interfaces;
using ShoppingList.Abstractions.Objects;
using ShoppingList.Dal.MogoDb.Documents;

namespace ShoppingList.Dal.MogoDb.Repositories
{
	public class TemplatesRepository : ITemplatesRepository
	{
		private const string TemplatesCollectionName = "templates";

		private readonly IMongoCollection<TemplateDocument> templatesCollection;
		private readonly ILogger<TemplatesRepository> logger;

		public TemplatesRepository(IMongoClient mongoClient, ILogger<TemplatesRepository> logger, IOptions<MongoDbSettings> options)
		{
			if (mongoClient == null)
			{
				throw new ArgumentNullException(nameof(mongoClient));
			}

			var settings = options?.Value ?? throw new ArgumentNullException(nameof(options));

			// It's ok for constructor because neither GetDatabase() nor GetCollection() perform real communication with MongoDB.
			var database = mongoClient.GetDatabase(settings.DatabaseName);
			templatesCollection = database.GetCollection<TemplateDocument>(TemplatesCollectionName);

			this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
		}

		public async Task<string> CreateTemplate(ListTemplate listTemplate, CancellationToken cancellationToken)
		{
			logger.LogInformation("Creating template {@Template} ...", listTemplate);

			var document = new TemplateDocument(listTemplate);

			await templatesCollection.InsertOneAsync(document, cancellationToken: cancellationToken).ConfigureAwait(false);

			var id = document.Id;
			logger.LogInformation("Created template with id {TemplateId} ...", id);

			return id.ToString();
		}

		public async Task<IEnumerable<ListTemplate>> GetTemplates(CancellationToken cancellationToken)
		{
			var cursor = await templatesCollection
				.FindAsync(FilterDefinition<TemplateDocument>.Empty, cancellationToken: cancellationToken)
				.ConfigureAwait(false);

			using (cursor)
			{
				return (await cursor.ToListAsync(cancellationToken).ConfigureAwait(false))
					.Select(x => x.ToObject());
			}
		}

		public async Task<ListTemplate> GetTemplate(string templateId, CancellationToken cancellationToken)
		{
			var id = ObjectId.Parse(templateId);

			var filter = new FilterDefinitionBuilder<TemplateDocument>()
				.Where(d => d.Id == id);

			var options = new FindOptions<TemplateDocument>
			{
				Limit = 1,
			};

			var cursor = await templatesCollection.FindAsync(filter, options, cancellationToken).ConfigureAwait(false);
			using (cursor)
			{
				var templateDoc = await cursor.FirstOrDefaultAsync(cancellationToken).ConfigureAwait(false);
				if (templateDoc == null)
				{
					throw new NotFoundException($"The template with id of {templateId} was not found");
				}

				return templateDoc.ToObject();
			}
		}

		public Task UpdateTemplate(ListTemplate listTemplate, CancellationToken cancellationToken)
		{
			throw new NotImplementedException();
		}

		public Task DeleteTemplate(string templateId, CancellationToken cancellationToken)
		{
			throw new NotImplementedException();
		}
	}
}
