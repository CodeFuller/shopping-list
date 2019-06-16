using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using ShoppingList.Abstractions.Objects;

namespace ShoppingList.Abstractions.Interfaces
{
	public interface ITemplatesRepository
	{
		Task<string> CreateTemplate(ListTemplate listTemplate, CancellationToken cancellationToken);

		Task<IEnumerable<ListTemplate>> GetTemplates(CancellationToken cancellationToken);

		Task<ListTemplate> GetTemplate(string templateId, CancellationToken cancellationToken);

		Task UpdateTemplate(ListTemplate listTemplate, CancellationToken cancellationToken);

		Task DeleteTemplate(string templateId, CancellationToken cancellationToken);
	}
}
