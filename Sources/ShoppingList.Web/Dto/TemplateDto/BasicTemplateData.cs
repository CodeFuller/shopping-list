using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;
using ShoppingList.Abstractions.Objects;

namespace ShoppingList.Web.Dto.TemplateDto
{
	[DataContract]
	public abstract class BasicTemplateData
	{
		[Required]
		[DataMember(Name = "title")]
		public string Title { get; set; }

		protected BasicTemplateData()
		{
		}

		protected BasicTemplateData(ListTemplate listTemplate)
		{
			Title = listTemplate.Title;
		}
	}
}
