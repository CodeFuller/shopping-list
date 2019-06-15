using System.Collections.Generic;
using System.Runtime.Serialization;

namespace ShoppingList.Web.Dto
{
	public interface IOutputDto
	{
		[DataMember(Name = "links")]
		ICollection<LinkDto> Links { get; set; }
	}
}
