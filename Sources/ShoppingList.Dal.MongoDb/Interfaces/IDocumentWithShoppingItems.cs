using System.Collections.Generic;

namespace ShoppingList.Dal.MongoDb.Interfaces
{
	internal interface IDocumentWithShoppingItems<TItem>
	{
		IList<TItem> Items { get; set; }
	}
}
