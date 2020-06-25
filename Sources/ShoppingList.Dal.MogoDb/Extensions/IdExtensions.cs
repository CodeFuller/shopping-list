using MongoDB.Bson;
using ShoppingList.Logic.Models;

namespace ShoppingList.Dal.MogoDb.Extensions
{
	internal static class IdExtensions
	{
		public static IdModel ToIdModel(this ObjectId objectId)
		{
			return new IdModel(objectId.ToString());
		}

		public static ObjectId ToObjectId(this IdModel id)
		{
			return ObjectId.Parse(id.Value);
		}
	}
}
