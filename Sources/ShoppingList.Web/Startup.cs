using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using ShoppingList.Dal.MogoDb.Extensions;
using ShoppingList.Logic.Extensions;

namespace ShoppingList.Web
{
	public class Startup
	{
		public Startup(IConfiguration configuration)
		{
			Configuration = configuration;
		}

		public IConfiguration Configuration { get; }

		public void ConfigureServices(IServiceCollection services)
		{
			services.AddControllersWithViews();

			services.AddSpaStaticFiles(configuration =>
			{
				// In production, the Angular files will be served from this directory.
				configuration.RootPath = "ClientApp/dist";
			});

			services.AddShoppingListServices();

			var connectionString = GetConnectionString();
			services.AddMongoDbDal(connectionString);
		}

		public static void Configure(IApplicationBuilder app, IWebHostEnvironment env)
		{
			if (env.IsDevelopment())
			{
				app.UseDeveloperExceptionPage();
			}
			else
			{
				app.UseExceptionHandler("/Error");
			}

			app.UseStaticFiles();
			if (!env.IsDevelopment())
			{
				app.UseSpaStaticFiles();
			}

			app.UseRouting();
			app.UseEndpoints(endpoints =>
			{
				endpoints.MapControllerRoute(
					name: "default",
					pattern: "{controller}/{action=Index}/{id?}");
			});

			app.UseSpa(spa =>
			{
				spa.Options.SourcePath = "ClientApp";

				if (env.IsDevelopment())
				{
					spa.UseProxyToSpaDevelopmentServer("http://localhost:4200");
				}
			});
		}

		private string GetConnectionString()
		{
			var connectionString = Configuration.GetConnectionString("shoppingListDatabase");
			if (String.IsNullOrEmpty(connectionString))
			{
				throw new InvalidOperationException("Connection string 'shoppingListDatabase' is not set");
			}

			return connectionString;
		}
	}
}
