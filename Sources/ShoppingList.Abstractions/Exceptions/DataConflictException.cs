using System;
using System.Runtime.Serialization;

namespace ShoppingList.Abstractions.Exceptions
{
	[Serializable]
	public class DataConflictException : Exception
	{
		public DataConflictException()
		{
		}

		public DataConflictException(string message)
			: base(message)
		{
		}

		public DataConflictException(string message, Exception innerException)
			: base(message, innerException)
		{
		}

		protected DataConflictException(SerializationInfo serializationInfo, StreamingContext streamingContext)
			: base(serializationInfo, streamingContext)
		{
		}
	}
}
