using System.Runtime.Serialization;
using ShoppingList.Logic.Models;

namespace ShoppingList.Web.Contracts.ShoppingItemContracts
{
	public class OutputShoppingItemData : BasicShoppingItemData
	{
		[DataMember(Name = "id")]
		public string Id { get; }

		public OutputShoppingItemData(ShoppingItemModel item)
			: base(item)
		{
			Id = item.Id.Value;
		}
	}
}
