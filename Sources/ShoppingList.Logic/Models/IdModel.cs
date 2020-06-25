using System;

namespace ShoppingList.Logic.Models
{
	public class IdModel
	{
		public string Value { get; }

		public IdModel(string id)
		{
			this.Value = id ?? throw new ArgumentNullException(nameof(id));
		}

		public static bool operator ==(IdModel v1, IdModel v2)
		{
			if (Object.ReferenceEquals(v1, null) || Object.ReferenceEquals(v2, null))
			{
				return Object.ReferenceEquals(v1, null) && Object.ReferenceEquals(v2, null);
			}

			return v1.Equals(v2);
		}

		public static bool operator !=(IdModel v1, IdModel v2)
		{
			return !(v1 == v2);
		}

		public override bool Equals(object obj)
		{
			return obj is IdModel cmp && Equals(cmp);
		}

		protected bool Equals(IdModel other)
		{
			return String.Equals(Value, other.Value, StringComparison.Ordinal);
		}

		public override int GetHashCode()
		{
			return Value?.GetHashCode() ?? 0;
		}

		public override string ToString()
		{
			return Value;
		}
	}
}
