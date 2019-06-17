using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using ShoppingList.Abstractions.Objects;

namespace ShoppingList.Dal.MogoDb.Documents
{
	public class TemplateItemDocument
	{
		[BsonElement("id")]
		public ObjectId Id { get; set; }

		[BsonElement("title")]
		public string Title { get; set; }

		[BsonElement("quantity")]
		public int? Quantity { get; set; }

		[BsonElement("comment")]
		public string Comment { get; set; }

		public TemplateItemDocument(TemplateItem item)
		{
			if (item.Id != null)
			{
				Id = ObjectId.Parse(item.Id);
			}

			Title = item.Title;
			Quantity = item.Quantity;
			Comment = item.Comment;
		}

		public TemplateItem ToObject()
		{
			return new TemplateItem
			{
				Id = Id.ToString(),
				Title = Title,
				Quantity = Quantity,
				Comment = Comment,
			};
		}
	}
}
