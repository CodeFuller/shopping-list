using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;

namespace ShoppingList.Web.Contracts.ShoppingListContracts
{
	[DataContract]
	public class CreateShoppingListRequest
	{
		[Required]
		[DataMember]
		public string TemplateId { get; set; }
	}
}
