using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;

namespace ShoppingList.Web.Contracts.UserContracts
{
	[DataContract]
	public class CreateUserRequest
	{
		[Required]
		[DataMember(Name = "userName")]
		public string UserName { get; set; }

		[Required]
		[DataMember(Name = "password")]
		public string Password { get; set; }
	}
}
