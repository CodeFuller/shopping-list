using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using ShoppingList.Abstractions.Objects;

namespace ShoppingList.Dal.MogoDb.Documents
{
	internal class TemplateDocument
	{
		public ObjectId Id { get; set; }

		[BsonElement("title")]
		public string Title { get; set; }

		// Array property to empty list, not null.
		// Otherwise property will be set to null on document creation,
		// and later $push will fail with error "The field must be an array but is of type null in document".
		[BsonElement("items")]
		public IList<TemplateItemDocument> Items { get; set; } = new List<TemplateItemDocument>();

		public TemplateDocument(ListTemplate listTemplate)
		{
			if (listTemplate.Id != null)
			{
				Id = ObjectId.Parse(listTemplate.Id);
			}

			Title = listTemplate.Title;
		}

		public ListTemplate ToObject()
		{
			return new ListTemplate
			{
				Id = Id.ToString(),
				Title = Title,
			};
		}
	}
}
