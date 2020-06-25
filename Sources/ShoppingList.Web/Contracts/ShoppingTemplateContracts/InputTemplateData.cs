using System.Runtime.Serialization;
using ShoppingList.Logic.Models;

namespace ShoppingList.Web.Contracts.ShoppingTemplateContracts
{
	[DataContract]
	public class InputTemplateData : BasicTemplateData
	{
		public ShoppingTemplateInfo ToModel()
		{
			return new ShoppingTemplateInfo
			{
				Title = Title,
			};
		}
	}
}
