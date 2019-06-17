using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;
using ShoppingList.Abstractions.Objects;

namespace ShoppingList.Web.Dto.TemplateItemDto
{
	[DataContract]
	public class BasicTemplateItemData
	{
		[Required]
		[DataMember(Name = "title")]
		public string Title { get; set; }

		[DataMember(Name = "quantity")]
		public int? Quantity { get; set; }

		[DataMember(Name = "comment")]
		public string Comment { get; set; }

		protected BasicTemplateItemData()
		{
		}

		protected BasicTemplateItemData(TemplateItem item)
		{
			Title = item.Title;
			Quantity = item.Quantity;
			Comment = item.Comment;
		}
	}
}
