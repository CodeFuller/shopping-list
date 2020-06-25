using System.Collections.Generic;

namespace ShoppingList.Logic.Models
{
	public class ShoppingTemplateModel : ShoppingTemplateInfo
	{
		public IReadOnlyCollection<ShoppingItemModel> Items { get; set; }
	}
}
