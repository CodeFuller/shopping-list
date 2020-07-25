using System.Runtime.Serialization;

namespace ShoppingList.Web.Contracts.AuthContracts
{
	[DataContract]
	public class IsLoggedInResponse
	{
		[DataMember(Name = "isLoggedIn")]
		public bool IsLoggedIn { get; set; }
	}
}
