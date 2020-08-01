using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;
using ShoppingList.Logic.Models;

namespace ShoppingList.Web.Contracts.UserContracts
{
	[DataContract]
	public class UserData
	{
		[DataMember(Name = "id")]
		public string Id { get; }

		[Required]
		[DataMember(Name = "name")]
		public string Name { get; set; }

		public UserData(UserModel user)
		{
			Id = user.Id.Value;
			Name = user.Name;
		}
	}
}
