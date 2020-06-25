using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using ShoppingList.Logic.Models;

namespace ShoppingList.Web.Contracts.ShoppingListContracts
{
	[DataContract]
	public class OutputShoppingListData
	{
		[DataMember(Name = "id")]
		public string Id { get; set; }

		[DataMember(Name = "title")]
		public string Title { get; set; }

		[DataMember(Name = "items")]
		public ICollection<ShoppingItemData> Items { get; set; }

		public OutputShoppingListData(ShoppingListModel shoppingList)
		{
			Id = shoppingList.Id.Value;
			Title = shoppingList.Title;
			Items = shoppingList.Items.Select(x => new ShoppingItemData(x)).ToList();
		}
	}
}
