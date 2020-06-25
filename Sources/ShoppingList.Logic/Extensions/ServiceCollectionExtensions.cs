﻿using Microsoft.Extensions.DependencyInjection;
using ShoppingList.Logic.Interfaces;
using ShoppingList.Logic.Services;

namespace ShoppingList.Logic.Extensions
{
	public static class ServiceCollectionExtensions
	{
		public static IServiceCollection AddShoppingListServices(this IServiceCollection services)
		{
			services.AddSingleton<IShoppingTemplateService, ShoppingTemplateService>();
			services.AddSingleton<IShoppingTemplateItemService, ShoppingTemplateItemService>();
			services.AddSingleton<IShoppingListService, ShoppingListService>();

			return services;
		}
	}
}
