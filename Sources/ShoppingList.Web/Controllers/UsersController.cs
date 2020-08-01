using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ShoppingList.Logic.Interfaces;
using ShoppingList.Web.Contracts.ShoppingTemplateContracts;
using ShoppingList.Web.Contracts.UserContracts;

namespace ShoppingList.Web.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class UsersController : ControllerBase
	{
		private readonly IUserService userService;

		public UsersController(IUserService userService)
		{
			this.userService = userService ?? throw new ArgumentNullException(nameof(userService));
		}

		[HttpGet]
		public async Task<ActionResult<IEnumerable<UserData>>> GetUsers(CancellationToken cancellationToken)
		{
			var users = await userService.GetUsers(cancellationToken);

			return Ok(users.Select(x => new UserData(x)));
		}
	}
}
