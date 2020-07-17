using Microsoft.AspNetCore.Builder;

namespace ShoppingList.Web.Internal
{
	public static class TestRequestCircuitExtensions
	{
		public static IApplicationBuilder UseTestRequestCircuit(this IApplicationBuilder app)
		{
			return app.UseMiddleware<TestRequestCircuitMiddleware>();
		}
	}
}
