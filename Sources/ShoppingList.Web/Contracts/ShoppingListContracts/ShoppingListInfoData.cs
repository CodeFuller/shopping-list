using System.Runtime.Serialization;
using ShoppingList.Logic.Models;

namespace ShoppingList.Web.Contracts.ShoppingListContracts
{
	[DataContract]
	public class ShoppingListInfoData
	{
		[DataMember(Name = "id")]
		public string Id { get; set; }

		[DataMember(Name = "title")]
		public string Title { get; set; }

		public ShoppingListInfoData(ShoppingListInfo shoppingListInfo)
		{
			Id = shoppingListInfo.Id.Value;
			Title = shoppingListInfo.Title;
		}
	}
}
