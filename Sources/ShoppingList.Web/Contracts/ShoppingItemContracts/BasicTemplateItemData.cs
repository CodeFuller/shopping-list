using System.Runtime.Serialization;
using ShoppingList.Logic.Models;

namespace ShoppingList.Web.Contracts.ShoppingItemContracts
{
	[DataContract]
	public class BasicTemplateItemData
	{
		[DataMember(Name = "title")]
		public string Title { get; set; }

		[DataMember(Name = "quantity")]
		public string Quantity { get; set; }

		[DataMember(Name = "comment")]
		public string Comment { get; set; }

		protected BasicTemplateItemData()
		{
		}

		protected BasicTemplateItemData(ShoppingItemModel item)
		{
			Title = item.Title;
			Quantity = item.Quantity;
			Comment = item.Comment;
		}
	}
}
