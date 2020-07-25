using System;
using System.Threading.Tasks;
using AspNetCore.Identity.Mongo.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ShoppingList.Web.Contracts.AuthContracts;

namespace ShoppingList.Web.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class AuthController : ControllerBase
	{
		private readonly SignInManager<MongoUser> signInManager;

		public AuthController(SignInManager<MongoUser> signInManager)
		{
			this.signInManager = signInManager ?? throw new ArgumentNullException(nameof(signInManager));
		}

		[HttpGet]
		public OkObjectResult IsSignedIn()
		{
			var response = new IsSignedInResponse
			{
				IsSignedIn = signInManager.IsSignedIn(User),
			};

			return Ok(response);
		}

		[HttpPost]
		public async Task<ActionResult> SignIn([FromBody] LoginRequest request)
		{
			var signInResult = await signInManager.PasswordSignInAsync(request.UserName, request.Password, isPersistent: true, lockoutOnFailure: false);
			if (signInResult.Succeeded)
			{
				return Ok();
			}

			return Unauthorized("Invalid user name or password");
		}
	}
}
