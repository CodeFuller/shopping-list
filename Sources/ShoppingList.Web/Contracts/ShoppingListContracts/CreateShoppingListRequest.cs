using System.Runtime.Serialization;

namespace ShoppingList.Web.Contracts.ShoppingListContracts
{
	[DataContract]
	public class CreateShoppingListRequest
	{
		[DataMember]
		public string TemplateId { get; set; }
	}
}
