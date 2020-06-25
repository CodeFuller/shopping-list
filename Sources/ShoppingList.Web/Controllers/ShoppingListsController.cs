using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ShoppingList.Logic.Extensions;
using ShoppingList.Logic.Interfaces;
using ShoppingList.Logic.Models;
using ShoppingList.Web.Contracts.ShoppingListContracts;

namespace ShoppingList.Web.Controllers
{
	[Route("api/shopping-lists")]
	[ApiController]
	public class ShoppingListsController : ControllerBase
	{
		private readonly IShoppingListService shoppingListService;

		public ShoppingListsController(IShoppingListService shoppingListService)
		{
			this.shoppingListService = shoppingListService ?? throw new ArgumentNullException(nameof(shoppingListService));
		}

		[HttpPost]
		public async Task<ActionResult<OutputShoppingListData>> CreateShoppingList([FromBody] CreateShoppingListRequest request, CancellationToken cancellationToken)
		{
			var shoppingList = await shoppingListService.CreateShoppingListFromTemplate(request.TemplateId.ToId(), cancellationToken);
			var shoppingListData = new OutputShoppingListData(shoppingList);
			return Created(GetShoppingListUri(shoppingList.Id), shoppingListData);
		}

		[HttpGet]
		public async Task<ActionResult<IEnumerable<ShoppingListInfoData>>> GetShoppingLists(CancellationToken cancellationToken)
		{
			var shoppingLists = await shoppingListService.GetShoppingListsInfo(cancellationToken);

			return Ok(shoppingLists.Select(x => new ShoppingListInfoData(x)));
		}

		[HttpGet("{listId}")]
		public async Task<ActionResult<OutputShoppingListData>> GetShoppingList([FromRoute] string listId, CancellationToken cancellationToken)
		{
			var shoppingList = await shoppingListService.GetShoppingList(listId.ToId(), cancellationToken);

			return Ok(new OutputShoppingListData(shoppingList));
		}

		private Uri GetShoppingListUri(IdModel id)
		{
			var actionUrl = Url.Action(nameof(GetShoppingList), null, new { id.Value }, Request.Scheme, Request.Host.ToUriComponent());
			return new Uri(actionUrl, UriKind.RelativeOrAbsolute);
		}
	}
}
