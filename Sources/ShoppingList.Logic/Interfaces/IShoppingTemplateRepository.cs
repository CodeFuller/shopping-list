using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using ShoppingList.Logic.Models;

namespace ShoppingList.Logic.Interfaces
{
	public interface IShoppingTemplateRepository
	{
		Task<IdModel> CreateTemplate(ShoppingTemplateModel shoppingModel, CancellationToken cancellationToken);

		Task<IReadOnlyCollection<ShoppingTemplateInfo>> GetAllTemplates(CancellationToken cancellationToken);

		Task<ShoppingTemplateModel> GetTemplate(IdModel templateId, CancellationToken cancellationToken);

		Task DeleteTemplate(IdModel templateId, CancellationToken cancellationToken);
	}
}
