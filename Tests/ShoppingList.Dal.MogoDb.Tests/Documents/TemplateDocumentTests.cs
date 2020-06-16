using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using ShoppingList.Abstractions.Objects;
using ShoppingList.Dal.MogoDb.Documents;

namespace ShoppingList.Dal.MogoDb.Tests.Documents
{
	[TestClass]
	public class TemplateDocumentTests
	{
		// Array property must be set to empty list, not null.
		// Otherwise property will be set to null on document creation,
		// and later $push will fail with error "The field must be an array but is of type null in document".
		// TODO: Remove this UT after we have integration tests.
		[TestMethod]
		public void ItemsProperty_ForNewDocument_IsInitializedWithEmptyList()
		{
			// Arrange

			var template = new ListTemplate
			{
				Title = "Test title",
			};

			var target = new TemplateDocument(template);

			// Act

			// Assert

			Assert.IsNotNull(target.Items);
			Assert.IsFalse(target.Items.Any());
		}
	}
}
