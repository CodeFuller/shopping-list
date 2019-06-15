using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using ShoppingList.Abstractions.Objects;

namespace ShoppingList.Web.Dto.TemplateDto
{
	[DataContract]
	public class OutputTemplateData : BasicTemplateData, IOutputDto
	{
		private readonly List<LinkDto> links = new List<LinkDto>();

		[DataMember(Name = "links")]
		public IReadOnlyCollection<LinkDto> Links => links;

		public OutputTemplateData(ListTemplate listTemplate, Uri selfUri)
			: base(listTemplate)
		{
			links.Add(LinkDto.Self(selfUri));
		}
	}
}
