using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ShoppingList.Web.Dto;
using ShoppingList.Web.Dto.ShoppingListDto;

namespace ShoppingList.Web.Controllers
{
	[Route("api/shopping-lists")]
	[ApiController]
	public class ShoppingListsController : ControllerBase
	{
		[HttpGet("{listId:int}")]
		public async Task<ActionResult<OutputShoppingListData>> GetShoppingList(int listId, CancellationToken cancellationToken)
		{
			await Task.CompletedTask;

			var data = new OutputShoppingListData
			{
				Title = "Test List #1",
				ShoppingDate = new DateTimeOffset(2019, 06, 15, 10, 13, 12, TimeSpan.Zero),
				Items = new List<ShoppingItemDto>
				{
					new ShoppingItemDto
					{
						Title = "Tomatoes",
						Comment = "Red",
					},

					new ShoppingItemDto
					{
						Title = "Cucumbers",
						Quantity = 3,
					}
				}
			};

			return Ok(data);
		}
	}
}
