using System.Collections.Generic;

namespace ShoppingList.Logic.Models
{
	public class ShoppingListModel
	{
		public IdModel Id { get; set; }

		public string Title { get; set; }

		public IReadOnlyCollection<ShoppingItemModel> Items { get; set; }
	}
}
