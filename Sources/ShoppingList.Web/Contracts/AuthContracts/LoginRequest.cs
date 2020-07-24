using System.Runtime.Serialization;

namespace ShoppingList.Web.Contracts.AuthContracts
{
	[DataContract]
	public class LoginRequest
	{
		[DataMember(Name = "userName")]
		public string UserName { get; set; }

		[DataMember(Name = "password")]
		public string Password { get; set; }
	}
}
