using System.Runtime.Serialization;
using ShoppingList.Logic.Models;

namespace ShoppingList.Web.Contracts.ShoppingTemplateContracts
{
	[DataContract]
	public abstract class BasicTemplateData
	{
		[DataMember(Name = "title")]
		public string Title { get; set; }

		protected BasicTemplateData()
		{
		}

		protected BasicTemplateData(ShoppingTemplateInfo templateInfo)
		{
			Title = templateInfo.Title;
		}
	}
}
