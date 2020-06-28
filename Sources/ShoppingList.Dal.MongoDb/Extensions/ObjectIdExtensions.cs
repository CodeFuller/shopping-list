using MongoDB.Bson;
using MongoDB.Driver;
using ShoppingList.Dal.MongoDb.Interfaces;

namespace ShoppingList.Dal.MongoDb.Extensions
{
	internal static class ObjectIdExtensions
	{
		public static FilterDefinition<TDocument> BuildDocumentFilter<TDocument>(this ObjectId documentId)
			where TDocument : IDocumentWithId
		{
			return Builders<TDocument>.Filter.Where(d => d.Id == documentId);
		}
	}
}
