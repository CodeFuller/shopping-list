using System.Runtime.Serialization;
using ShoppingList.Logic.Models;

namespace ShoppingList.Web.Contracts.ShoppingTemplateContracts
{
	[DataContract]
	public class OutputTemplateData : BasicTemplateData
	{
		[DataMember(Name = "id")]
		public string Id { get; }

		public OutputTemplateData(ShoppingTemplateInfo templateInfo)
			: base(templateInfo)
		{
			Id = templateInfo.Id.Value;
		}
	}
}
