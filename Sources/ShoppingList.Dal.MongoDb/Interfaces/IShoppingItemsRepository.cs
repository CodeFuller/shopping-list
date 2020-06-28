using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MongoDB.Bson;

namespace ShoppingList.Dal.MongoDb.Interfaces
{
	internal interface IShoppingItemsRepository<TDocument, TItem>
	{
		Task CreateItem(ObjectId documentId, TItem item, CancellationToken cancellationToken);

		Task<IReadOnlyCollection<TItem>> GetItems(ObjectId documentId, CancellationToken cancellationToken);

		Task SetItems(ObjectId documentId, IEnumerable<TItem> items, CancellationToken cancellationToken);

		Task UpdateItem(ObjectId documentId, TItem item, CancellationToken cancellationToken);

		Task DeleteItem(ObjectId documentId, ObjectId itemId, CancellationToken cancellationToken);
	}
}
