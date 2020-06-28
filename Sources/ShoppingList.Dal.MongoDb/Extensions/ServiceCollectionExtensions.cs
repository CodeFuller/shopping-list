using Microsoft.Extensions.DependencyInjection;
using MongoDB.Driver;
using ShoppingList.Dal.MongoDb.Documents;
using ShoppingList.Dal.MongoDb.Interfaces;
using ShoppingList.Dal.MongoDb.Repositories;
using ShoppingList.Logic.Interfaces;

namespace ShoppingList.Dal.MongoDb.Extensions
{
	public static class ServiceCollectionExtensions
	{
		public static IServiceCollection AddMongoDbDal(this IServiceCollection services, string connectionString)
		{
			// It's recommended to use single instance of MongoClient.
			// (http://mongodb.github.io/mongo-csharp-driver/2.0/reference/driver/connecting/#re-use)
			services.AddSingleton<IMongoClient>(sp => new MongoClient(connectionString));

			// The implementation of IMongoDatabase provided by a MongoClient is thread-safe and is safe to be stored globally or in an IoC container.
			// (http://mongodb.github.io/mongo-csharp-driver/2.0/reference/driver/connecting/)
			var mongoUrl = new MongoUrl(connectionString);
			services.AddSingleton<IMongoDatabase>(sp =>
			{
				var mongoClient = sp.GetService<IMongoClient>();
				return mongoClient.GetDatabase(mongoUrl.DatabaseName);
			});

			services.AddMongoCollection<ShoppingTemplateDocument>("shoppingTemplates");
			services.AddMongoCollection<ShoppingListDocument>("shoppingLists");

			services.AddSingleton<ShoppingTemplateRepository>();
			services.AddSingleton<IShoppingTemplateRepository>(sp => sp.GetRequiredService<ShoppingTemplateRepository>());
			services.AddSingleton<IShoppingTemplateItemRepository>(sp => sp.GetRequiredService<ShoppingTemplateRepository>());

			services.AddSingleton<ShoppingListRepository>();
			services.AddSingleton<IShoppingListRepository>(sp => sp.GetRequiredService<ShoppingListRepository>());
			services.AddSingleton<IShoppingListItemRepository>(sp => sp.GetRequiredService<ShoppingListRepository>());

			services.AddSingleton<IShoppingItemsRepository<ShoppingTemplateDocument, ShoppingItemDocument>, ShoppingItemsRepository<ShoppingTemplateDocument, ShoppingItemDocument>>();
			services.AddSingleton<IShoppingItemsRepository<ShoppingListDocument, ShoppingItemDocument>, ShoppingItemsRepository<ShoppingListDocument, ShoppingItemDocument>>();

			return services;
		}

		private static void AddMongoCollection<TDocument>(this IServiceCollection services, string collectionName)
		{
			// The implementation of IMongoCollection<TDocument> ultimately provided by a MongoClient is thread-safe and is safe to be stored globally or in an IoC container.
			// http://mongodb.github.io/mongo-csharp-driver/2.0/reference/driver/connecting/
			services.AddSingleton<IMongoCollection<TDocument>>(sp =>
			{
				var database = sp.GetService<IMongoDatabase>();
				return database.GetCollection<TDocument>(collectionName);
			});
		}
	}
}
