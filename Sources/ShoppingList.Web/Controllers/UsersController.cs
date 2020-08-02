using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShoppingList.Logic.Interfaces;
using ShoppingList.Web.Contracts.UserContracts;

namespace ShoppingList.Web.Controllers
{
	[Authorize]
	[ApiController]
	[Route("api/[controller]")]
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

		[HttpPost]
		public async Task<ActionResult<UserData>> CreateUser([FromBody] CreateUserRequest request, CancellationToken cancellationToken)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			var newUser = await userService.CreateUser(request.UserName, request.Password, cancellationToken);
			return Ok(newUser);
		}
	}
}
