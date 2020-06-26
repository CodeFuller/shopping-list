using System.Runtime.Serialization;
using ShoppingList.Logic.Models;

namespace ShoppingList.Web.Contracts.ShoppingTemplateContracts
{
	[DataContract]
	public class OutputShoppingTemplateInfoData : BasicShoppingTemplateInfoData
	{
		[DataMember(Name = "id")]
		public string Id { get; }

		public OutputShoppingTemplateInfoData(ShoppingTemplateInfo templateInfo)
		{
			Id = templateInfo.Id.Value;
			Title = templateInfo.Title;
		}
	}
}
