using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;

namespace ShoppingList.Web.Dto
{
	[DataContract]
	public class ShoppingItemDto
	{
		[Required]
		[DataMember(Name = "title")]
		public string Title { get; set; }

		[DataMember(Name = "quantity")]
		public int Quantity { get; set; }

		[DataMember(Name = "comment")]
		public string Comment { get; set; }
	}
}
