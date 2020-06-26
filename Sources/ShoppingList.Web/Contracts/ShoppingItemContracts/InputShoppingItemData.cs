using System.Runtime.Serialization;
using ShoppingList.Logic.Models;

namespace ShoppingList.Web.Contracts.ShoppingItemContracts
{
	[DataContract]
	public class InputShoppingItemData : BasicShoppingItemData
	{
		public ShoppingItemModel ToModel()
		{
			return new ShoppingItemModel
			{
				Title = Title,
				Quantity = Quantity,
				Comment = Comment,
			};
		}
	}
}
