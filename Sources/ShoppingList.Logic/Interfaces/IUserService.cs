using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using ShoppingList.Logic.Models;

namespace ShoppingList.Logic.Interfaces
{
	public interface IUserService
	{
		Task<IReadOnlyCollection<UserModel>> GetUsers(CancellationToken cancellationToken);

		Task<UserModel> CreateUser(string userName, string password, CancellationToken cancellationToken);
	}
}
