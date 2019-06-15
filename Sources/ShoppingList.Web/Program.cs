using CF.Library.Logging;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

namespace ShoppingList.Web
{
	public static class Program
	{
		public static void Main(string[] args)
		{
			CreateWebHostBuilder(args).Build().Run();
		}

		public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
			WebHost.CreateDefaultBuilder(args)
				.UseConfiguration(new ConfigurationBuilder().AddJsonFile("HostingSettings.json", optional: true).Build())
				.ConfigureAppConfiguration(configBuilder =>
				{
					configBuilder.AddJsonFile("config/AppSettings.json", optional: false);
				})
				.ConfigureLogging((hostingContext, loggingBuilder) =>
				{
					var loggingSettings = new LoggingSettings();
					hostingContext.Configuration.GetSection("logging").Bind(loggingSettings);

					var loggingConfiguration = new LoggingConfiguration();
					loggingConfiguration.LoadSettings(loggingSettings);
					loggingConfiguration.AddLogging(loggingBuilder);
				})
				.UseStartup<Startup>();
	}
}
