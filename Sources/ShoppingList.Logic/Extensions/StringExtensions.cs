using ShoppingList.Logic.Models;

namespace ShoppingList.Logic.Extensions
{
	public static class StringExtensions
	{
		public static IdModel ToId(this string id)
		{
			return new IdModel(id);
		}
	}
}
