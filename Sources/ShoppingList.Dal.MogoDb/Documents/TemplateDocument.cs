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

		[BsonElement("items")]
		public IList<TemplateItemDocument> Items { get; set; }

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
