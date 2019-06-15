using System.Runtime.Serialization;
using ShoppingList.Abstractions.Objects;

namespace ShoppingList.Web.Dto.TemplateDto
{
	[DataContract]
	public class InputTemplateData : BasicTemplateData
	{
		public ListTemplate ToObject()
		{
			return new ListTemplate
			{
				Title = Title,
			};
		}
	}
}
