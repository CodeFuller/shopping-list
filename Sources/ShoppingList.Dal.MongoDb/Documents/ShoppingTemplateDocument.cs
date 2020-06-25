using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using ShoppingList.Dal.MongoDb.Extensions;
using ShoppingList.Logic.Models;

namespace ShoppingList.Dal.MongoDb.Documents
{
	internal class ShoppingTemplateDocument
	{
		public ObjectId Id { get; set; }

		[BsonElement("title")]
		public string Title { get; set; }

		// Array property must be set to empty list, not null.
		// Otherwise property will be set to null on document creation,
		// and later $push will fail with error "The field must be an array but is of type null in document".
		[BsonElement("items")]
		public IList<ShoppingItemDocument> Items { get; set; } = new List<ShoppingItemDocument>();

		public ShoppingTemplateDocument(ShoppingTemplateInfo templateInfo)
		{
			Id = templateInfo.Id?.ToObjectId() ?? default;
			Title = templateInfo.Title;
		}

		public ShoppingTemplateInfo ToModel()
		{
			return new ShoppingTemplateInfo
			{
				Id = Id.ToIdModel(),
				Title = Title,
			};
		}
	}
}
