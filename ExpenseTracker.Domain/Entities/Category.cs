namespace ExpenseTracker.Domain.Entities;

using ExpenseTracker.Domain.Entities.Enums;

public class Category
{
    public Guid Id { get; private set; }
    public string Description { get; private set; }
    public CategoryPurpose Purpose { get; private set; }

    protected Category()
    {
    }

   
    public static Category Create(string description, CategoryPurpose purpose)
    {
        if (string.IsNullOrWhiteSpace(description))
            throw new ArgumentException("Descrição não pode ser vazia", nameof(description));

        if (description.Length > 400)
            throw new ArgumentException("Descrição não pode exceder 400 caracteres", nameof(description));

        if (!Enum.IsDefined(typeof(CategoryPurpose), purpose))
            throw new ArgumentException("Propósito de categoria inválido", nameof(purpose));

        return new Category
        {
            Id = Guid.NewGuid(),
            Description = description,
            Purpose = purpose
        };
    }

   
    public void UpdateDescription(string description)
    {
        if (string.IsNullOrWhiteSpace(description))
            throw new ArgumentException("Descrição não pode ser vazia", nameof(description));

        if (description.Length > 400)
            throw new ArgumentException("Descrição não pode exceder 400 caracteres", nameof(description));

        Description = description;
    }

    public void UpdatePurpose(CategoryPurpose purpose)
    {
        if (!Enum.IsDefined(typeof(CategoryPurpose), purpose))
            throw new ArgumentException("Propósito de categoria inválido", nameof(purpose));

        Purpose = purpose;
    }

   
    public bool SupportsExpense() => Purpose == CategoryPurpose.Expense || Purpose == CategoryPurpose.Both;

   
    public bool SupportsRevenue() => Purpose == CategoryPurpose.Revenue || Purpose == CategoryPurpose.Both;
}
