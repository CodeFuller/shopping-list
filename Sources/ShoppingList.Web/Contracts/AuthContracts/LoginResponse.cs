using System.Runtime.Serialization;

namespace ShoppingList.Web.Contracts.AuthContracts
{
	[DataContract]
	public class LoginResponse
	{
		[DataMember(Name = "succeeded")]
		public bool Succeeded { get; set; }
	}
}
