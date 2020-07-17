using System;
using System.Globalization;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace ShoppingList.Web.Internal
{
	public class TestRequestCircuitMiddleware
	{
		private readonly RequestDelegate next;

		public TestRequestCircuitMiddleware(RequestDelegate next)
		{
			this.next = next ?? throw new ArgumentNullException(nameof(next));
		}

		public async Task Invoke(HttpContext context)
		{
			if (context.Request.Path.StartsWithSegments("/api", StringComparison.OrdinalIgnoreCase))
			{
				const string failFlagFile = @"d:\temp\ShoppingList\Fail.txt";
				const string sleepFlagFile = @"d:\temp\ShoppingList\Sleep.txt";

				var fail = File.Exists(failFlagFile);

				if (File.Exists(sleepFlagFile))
				{
					var delay = Int32.Parse(await File.ReadAllTextAsync(sleepFlagFile, CancellationToken.None), NumberStyles.None, CultureInfo.InvariantCulture);
					await Task.Delay(TimeSpan.FromMilliseconds(delay), CancellationToken.None);
				}

				if (fail)
				{
					context.Response.StatusCode = 500;

					await using var writer = new StreamWriter(context.Response.Body);
					await writer.WriteAsync($"Synthetic error from {nameof(TestRequestCircuitMiddleware)}");
				}
			}

			await next(context);
		}
	}
}
