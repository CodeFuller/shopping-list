using System.Collections.Generic;
using System.Linq;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using ShoppingList.Dal.MongoDb.Extensions;
using ShoppingList.Dal.MongoDb.Interfaces;
using ShoppingList.Logic.Models;

namespace ShoppingList.Dal.MongoDb.Documents
{
	internal class ShoppingTemplateDocument : IDocumentWithId, IDocumentWithShoppingItems<ShoppingItemDocument>
	{
		public ObjectId Id { get; set; }

		[BsonElement("title")]
		public string Title { get; set; }

		[BsonElement("items")]
		public IList<ShoppingItemDocument> Items { get; set; }

		public ShoppingTemplateDocument(ShoppingTemplateModel shoppingTemplate)
		{
			Id = shoppingTemplate.Id?.ToObjectId() ?? default;
			Title = shoppingTemplate.Title;
			Items = shoppingTemplate.Items.Select(x => new ShoppingItemDocument(x)).ToList();
		}

		public ShoppingTemplateInfo ToShoppingTemplateInfo()
		{
			return new ShoppingTemplateInfo
			{
				Id = Id.ToIdModel(),
				Title = Title,
			};
		}

		public ShoppingTemplateModel ToShoppingTemplateModel()
		{
			return new ShoppingTemplateModel
			{
				Id = Id.ToIdModel(),
				Title = Title,
				Items = Items.Select(x => x.ToModel()).ToList(),
			};
		}
	}
}
