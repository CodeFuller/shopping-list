using System.Collections.Generic;
using System.Linq;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using ShoppingList.Dal.MongoDb.Extensions;
using ShoppingList.Logic.Models;

namespace ShoppingList.Dal.MongoDb.Documents
{
	internal class ShoppingListDocument
	{
		public ObjectId Id { get; set; }

		[BsonElement("title")]
		public string Title { get; set; }

		[BsonElement("items")]
		public IList<ShoppingItemDocument> Items { get; set; }

		public ShoppingListDocument(ShoppingListModel shoppingList)
		{
			Id = shoppingList.Id?.ToObjectId() ?? default;
			Title = shoppingList.Title;
			Items = shoppingList.Items.Select(x => new ShoppingItemDocument(x)).ToList();
		}
	}
}
