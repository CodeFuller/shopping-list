using System;
using AspNetCore.Identity.Mongo;
using AspNetCore.Identity.Mongo.Model;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using ShoppingList.Dal.MongoDb.Extensions;
using ShoppingList.Logic.Extensions;
using ShoppingList.Web.Internal;

namespace ShoppingList.Web
{
	public class Startup
	{
		public IConfiguration Configuration { get; }

		public Startup(IConfiguration configuration)
		{
			Configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
		}

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

			services.AddIdentityMongoDbProvider<MongoUser>(mongoIdentityOptions => mongoIdentityOptions.ConnectionString = connectionString);
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

			if (env.IsDevelopment())
			{
				app.UseTestRequestCircuit();
			}

			app.UseRouting();

			app.UseAuthentication();
			app.UseAuthorization();

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
