using System.Runtime.Serialization;
using ShoppingList.Logic.Models;

namespace ShoppingList.Web.Contracts.ShoppingItemContracts
{
	public class OutputTemplateItemData : BasicTemplateItemData
	{
		[DataMember(Name = "id")]
		public string Id { get; }

		public OutputTemplateItemData(ShoppingItemModel item)
			: base(item)
		{
			Id = item.Id.Value;
		}
	}
}
