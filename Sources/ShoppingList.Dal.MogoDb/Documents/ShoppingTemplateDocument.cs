using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using ShoppingList.Dal.MogoDb.Extensions;
using ShoppingList.Logic.Models;

namespace ShoppingList.Dal.MogoDb.Documents
{
	internal class ShoppingTemplateDocument
	{
		public ObjectId Id { get; set; }

		[BsonElement("title")]
		public string Title { get; set; }

		// Array property to empty list, not null.
		// Otherwise property will be set to null on document creation,
		// and later $push will fail with error "The field must be an array but is of type null in document".
		[BsonElement("items")]
		public IList<ShoppingItemDocument> Items { get; set; } = new List<ShoppingItemDocument>();

		public ShoppingTemplateDocument(ShoppingTemplateInfo templateInfo)
		{
			if (templateInfo.Id != null)
			{
				Id = templateInfo.Id.ToObjectId();
			}

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
