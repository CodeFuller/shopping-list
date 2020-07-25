using System.Runtime.Serialization;

namespace ShoppingList.Web.Contracts.AuthContracts
{
	[DataContract]
	public class IsSignedInResponse
	{
		[DataMember(Name = "isSignedIn")]
		public bool IsSignedIn { get; set; }
	}
}
