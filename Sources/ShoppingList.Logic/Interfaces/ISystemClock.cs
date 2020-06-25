using System;

namespace ShoppingList.Logic.Interfaces
{
	internal interface ISystemClock
	{
		DateTimeOffset UtcNow { get; }
	}
}
