using System.Runtime.Serialization;
using ShoppingList.Abstractions.Objects;

namespace ShoppingList.Web.Dto.TemplateItemDto
{
	[DataContract]
	public class InputTemplateItemData : BasicTemplateItemData
	{
		public TemplateItem ToObject()
		{
			return new TemplateItem
			{
				Title = Title,
				Quantity = Quantity,
				Comment = Comment,
			};
		}
	}
}
