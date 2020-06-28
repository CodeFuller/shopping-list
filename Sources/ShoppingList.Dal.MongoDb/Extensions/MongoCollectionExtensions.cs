using System.Threading;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;
using ShoppingList.Dal.MongoDb.Interfaces;
using ShoppingList.Logic.Exceptions;

namespace ShoppingList.Dal.MongoDb.Extensions
{
	internal static class MongoCollectionExtensions
	{
		public static async Task<TDocument> FindDocument<TDocument>(this IMongoCollection<TDocument> collection,  ObjectId documentId, CancellationToken cancellationToken)
			where TDocument : IDocumentWithId
		{
			var filter = documentId.BuildDocumentFilter<TDocument>();

			var options = new FindOptions<TDocument>
			{
				Limit = 1,
			};

			using var cursor = await collection.FindAsync(filter, options, cancellationToken);
			var document = await cursor.FirstOrDefaultAsync(cancellationToken);
			if (document == null)
			{
				throw new NotFoundException($"The document with id of {documentId} was not found");
			}

			return document;
		}
	}
}
