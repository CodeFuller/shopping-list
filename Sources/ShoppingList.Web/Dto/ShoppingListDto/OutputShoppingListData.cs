using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;

namespace ShoppingList.Web.Dto.ShoppingListDto
{
	[DataContract]
	public class OutputShoppingListData : BasicShoppingListData, IOutputDto
	{
		[Required]
		[DataMember(Name = "title")]
		public string Title { get; set; }

		[DataMember(Name = "shoppingDate")]
		public DateTimeOffset? ShoppingDate { get; set; }

		[DataMember(Name = "items")]
		public ICollection<ShoppingItemDto> Items { get; set; }

		[DataMember(Name = "links")]
		public ICollection<LinkDto> Links { get; set; }
	}
}
