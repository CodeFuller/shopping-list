using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using ShoppingList.Abstractions.Objects;

namespace ShoppingList.Web.Dto.TemplateItemDto
{
	public class OutputTemplateItemData : BasicTemplateItemData, IOutputDto
	{
		private readonly List<LinkDto> links = new List<LinkDto>();

		[DataMember(Name = "id")]
		public string Id { get; }

		[DataMember(Name = "links")]
		public IReadOnlyCollection<LinkDto> Links => links;

		public OutputTemplateItemData(TemplateItem item, Uri selfUri)
			: base(item)
		{
			Id = item.Id;
			links.Add(LinkDto.Self(selfUri));
		}
	}
}
