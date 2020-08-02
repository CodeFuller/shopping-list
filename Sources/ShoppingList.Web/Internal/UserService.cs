using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AspNetCore.Identity.Mongo.Model;
using Microsoft.AspNetCore.Identity;
using ShoppingList.Logic.Interfaces;
using ShoppingList.Logic.Models;

namespace ShoppingList.Web.Internal
{
	internal class UserService : IUserService
	{
		private readonly UserManager<MongoUser> userManager;

		public UserService(UserManager<MongoUser> userManager)
		{
			this.userManager = userManager ?? throw new ArgumentNullException(nameof(userManager));
		}

		public Task<IReadOnlyCollection<UserModel>> GetUsers(CancellationToken cancellationToken)
		{
			var users = userManager.Users
				.ToList();

			var models = users.Select(x => new UserModel
			{
				Id = new IdModel(x.Id.ToString()),
				Name = x.UserName,
			});

			return Task.FromResult<IReadOnlyCollection<UserModel>>(models.ToList());
		}

		public async Task<UserModel> CreateUser(string userName, string password, CancellationToken cancellationToken)
		{
			var newUser = new MongoUser(userName);

			var result = await userManager.CreateAsync(newUser, password);
			if (!result.Succeeded)
			{
				throw new InvalidOperationException($"Failed to create the user. {result}");
			}

			return new UserModel
			{
				Id = new IdModel(newUser.Id.ToString()),
				Name = userName,
			};
		}
	}
}
