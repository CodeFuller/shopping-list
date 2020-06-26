using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using ShoppingList.Logic.Models;

namespace ShoppingList.Web.Contracts.ShoppingTemplateContracts
{
	[DataContract]
	public class OutputShoppingTemplateData : OutputShoppingTemplateInfoData
	{
		[DataMember(Name = "items")]
		public IReadOnlyCollection<ShoppingItemData> Items { get; set; }

		public OutputShoppingTemplateData(ShoppingTemplateModel shoppingTemplate)
			: base(shoppingTemplate)
		{
			Items = shoppingTemplate.Items.Select(x => new ShoppingItemData(x)).ToList();
		}
	}
}
