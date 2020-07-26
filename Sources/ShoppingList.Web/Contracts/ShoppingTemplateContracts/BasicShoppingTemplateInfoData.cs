using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;
using ShoppingList.Logic.Models;

namespace ShoppingList.Web.Contracts.ShoppingTemplateContracts
{
	[DataContract]
	public abstract class BasicShoppingTemplateInfoData
	{
		[Required]
		[DataMember(Name = "title")]
		public string Title { get; set; }

		protected BasicShoppingTemplateInfoData()
		{
		}

		protected BasicShoppingTemplateInfoData(ShoppingTemplateInfo templateInfo)
		{
			Title = templateInfo.Title;
		}
	}
}
