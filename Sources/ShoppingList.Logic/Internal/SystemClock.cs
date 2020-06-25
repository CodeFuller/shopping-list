using System;
using ShoppingList.Logic.Interfaces;

namespace ShoppingList.Logic.Internal
{
	internal class SystemClock : ISystemClock
	{
		public DateTimeOffset UtcNow => DateTimeOffset.UtcNow;
	}
}
