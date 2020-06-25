using System.Runtime.Serialization;
using ShoppingList.Logic.Models;

namespace ShoppingList.Web.Contracts
{
	[DataContract]
	public class ShoppingItemData
	{
		[DataMember(Name = "title")]
		public string Title { get; set; }

		[DataMember(Name = "quantity")]
		public string Quantity { get; set; }

		[DataMember(Name = "comment")]
		public string Comment { get; set; }

		public ShoppingItemData(ShoppingItemModel item)
		{
			Title = item.Title;
			Quantity = item.Quantity;
			Comment = item.Comment;
		}
	}
}
