using System.Collections.Generic;
using System.Linq;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using ShoppingList.Dal.MongoDb.Extensions;
using ShoppingList.Dal.MongoDb.Interfaces;
using ShoppingList.Logic.Models;

namespace ShoppingList.Dal.MongoDb.Documents
{
	internal class ShoppingListDocument : IDocumentWithId, IDocumentWithShoppingItems<ShoppingItemDocument>
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

		public ShoppingListInfo ToShoppingListInfo()
		{
			return new ShoppingListInfo
			{
				Id = Id.ToIdModel(),
				Title = Title,
			};
		}

		public ShoppingListModel ToShoppingListModel()
		{
			return new ShoppingListModel
			{
				Id = Id.ToIdModel(),
				Title = Title,
				Items = Items.Select(x => x.ToModel()).ToList(),
			};
		}
	}
}
