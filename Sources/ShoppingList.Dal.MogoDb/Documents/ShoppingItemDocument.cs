using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using ShoppingList.Dal.MogoDb.Extensions;
using ShoppingList.Logic.Models;

namespace ShoppingList.Dal.MogoDb.Documents
{
	internal class ShoppingItemDocument
	{
		[BsonElement("id")]
		public ObjectId Id { get; set; }

		[BsonElement("title")]
		public string Title { get; set; }

		[BsonElement("quantity")]
		public string Quantity { get; set; }

		[BsonElement("comment")]
		public string Comment { get; set; }

		public ShoppingItemDocument(ShoppingItemModel item)
		{
			if (item.Id != null)
			{
				Id = item.Id.ToObjectId();
			}

			Title = item.Title;
			Quantity = item.Quantity;
			Comment = item.Comment;
		}

		public ShoppingItemModel ToModel()
		{
			return new ShoppingItemModel
			{
				Id = Id.ToIdModel(),
				Title = Title,
				Quantity = Quantity,
				Comment = Comment,
			};
		}
	}
}
