using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using MongoDB.Driver;
using ShoppingList.Dal.MongoDb.Extensions;
using ShoppingList.Dal.MongoDb.Interfaces;
using ShoppingList.Logic.Exceptions;

namespace ShoppingList.Dal.MongoDb.Repositories
{
	internal class ShoppingItemsRepository<TDocument, TItem> : IShoppingItemsRepository<TDocument, TItem>
		where TDocument : IDocumentWithShoppingItems<TItem>, IDocumentWithId
		where TItem : IDocumentWithId
	{
		private readonly IMongoCollection<TDocument> documentsCollection;

		private readonly ILogger<ShoppingItemsRepository<TDocument, TItem>> logger;

		public ShoppingItemsRepository(IMongoCollection<TDocument> documentsCollection, ILogger<ShoppingItemsRepository<TDocument, TItem>> logger)
		{
			this.documentsCollection = documentsCollection ?? throw new ArgumentNullException(nameof(documentsCollection));
			this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
		}

		public async Task CreateItem(ObjectId documentId, TItem item, CancellationToken cancellationToken)
		{
			var update = Builders<TDocument>.Update.Push(e => e.Items, item);
			await UpdateDocument(documentId, update, cancellationToken);
		}

		public async Task<IReadOnlyCollection<TItem>> GetItems(ObjectId documentId, CancellationToken cancellationToken)
		{
			var document = await documentsCollection.FindDocument(documentId, cancellationToken);
			return document.Items.ToList();
		}

		public async Task SetItems(ObjectId documentId, IEnumerable<TItem> items, CancellationToken cancellationToken)
		{
			var update = Builders<TDocument>.Update.Set(doc => doc.Items, items.ToList());
			await UpdateDocument(documentId, update, cancellationToken);
		}

		public async Task UpdateItem(ObjectId documentId, TItem item, CancellationToken cancellationToken)
		{
			var itemFilter = GetItemFilter(documentId, item.Id);
			var update = Builders<TDocument>.Update.Set(doc => doc.Items[-1], item);

			await UpdateDocument(documentId, itemFilter, update, cancellationToken);
		}

		public async Task DeleteItem(ObjectId documentId, ObjectId itemId, CancellationToken cancellationToken)
		{
			var itemFilter = Builders<TItem>.Filter.Eq(x => x.Id, itemId);
			var update = Builders<TDocument>.Update.PullFilter(x => x.Items, itemFilter);

			await UpdateDocument(documentId, update, cancellationToken);
		}

		private Task UpdateDocument(ObjectId documentId, UpdateDefinition<TDocument> update, CancellationToken cancellationToken)
		{
			var documentFilter = documentId.BuildDocumentFilter<TDocument>();
			return UpdateDocument(documentId, documentFilter, update, cancellationToken);
		}

		private async Task UpdateDocument(ObjectId documentId, FilterDefinition<TDocument> filter, UpdateDefinition<TDocument> update, CancellationToken cancellationToken)
		{
			var updateResult = await documentsCollection.UpdateOneAsync(filter, update, cancellationToken: cancellationToken);

			if (updateResult.MatchedCount < 1)
			{
				throw new NotFoundException($"The document with id of {documentId} was not found");
			}

			if (updateResult.MatchedCount > 1)
			{
				logger.LogError("Multiple ({MatchedCount}) document are matched for {DocumentId}", updateResult.MatchedCount, documentId);
			}
		}

		private static FilterDefinition<TDocument> GetItemFilter(ObjectId documentId, ObjectId itemId)
		{
			var documentFilter = documentId.BuildDocumentFilter<TDocument>();
			var itemFilter = Builders<TDocument>.Filter.ElemMatch(x => x.Items, x => x.Id == itemId);

			return Builders<TDocument>.Filter.And(documentFilter, itemFilter);
		}
	}
}
