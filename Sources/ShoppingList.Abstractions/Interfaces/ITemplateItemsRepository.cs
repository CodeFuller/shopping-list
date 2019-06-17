using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using ShoppingList.Abstractions.Objects;

namespace ShoppingList.Abstractions.Interfaces
{
	public interface ITemplateItemsRepository
	{
		Task<string> CreateItem(string templateId, TemplateItem item, CancellationToken cancellationToken);

		Task<IEnumerable<TemplateItem>> GetItems(string templateId, CancellationToken cancellationToken);

		Task<TemplateItem> GetItem(string templateId, string itemId, CancellationToken cancellationToken);

		Task UpdateItem(string templateId, TemplateItem item, CancellationToken cancellationToken);

		Task ReorderItems(string templateId, IReadOnlyCollection<string> newItemsOrder, CancellationToken cancellationToken);
	}
}
