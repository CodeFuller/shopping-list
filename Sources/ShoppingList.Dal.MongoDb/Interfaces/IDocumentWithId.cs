using MongoDB.Bson;

namespace ShoppingList.Dal.MongoDb.Interfaces
{
	internal interface IDocumentWithId
	{
		public ObjectId Id { get; set; }
	}
}
