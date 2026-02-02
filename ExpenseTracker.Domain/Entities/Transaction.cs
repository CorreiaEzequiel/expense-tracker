namespace ExpenseTracker.Domain.Entities;

using ExpenseTracker.Domain.Entities.Enums;

/// <summary>
/// Entidade que representa uma transação de uma pessoa
/// Implementa regras de negócio específicas para validação
/// </summary>
public class Transaction
{
    public Guid Id { get; private set; }
    public string Description { get; private set; }
    public decimal Value { get; private set; }
    public TransactionType Type { get; private set; }
    public Guid CategoryId { get; private set; }
    public Guid PersonId { get; private set; }
    public DateTime CreatedAt { get; private set; }

    public Person? Person { get; private set; }
    public Category? Category { get; private set; }

        protected Transaction()
    {
    }

    public static Transaction Create(
        string description,
        decimal value,
        TransactionType type,
        Guid categoryId,
        Guid personId,
        Category category,
        Person person)
    {
        if (string.IsNullOrWhiteSpace(description))
            throw new ArgumentException("Descrição não pode ser vazia", nameof(description));

        if (description.Length > 400)
            throw new ArgumentException("Descrição não pode exceder 400 caracteres", nameof(description));

        if (value <= 0)
            throw new ArgumentException("Valor da transação deve ser maior que zero", nameof(value));

        if (!Enum.IsDefined(typeof(TransactionType), type))
            throw new ArgumentException("Tipo de transação inválido", nameof(type));

        if (type == TransactionType.Revenue && person.Age < 18)
            throw new InvalidOperationException(
                "Menores de 18 anos não podem registrar transações de receita");

        if (type == TransactionType.Expense && !category.SupportsExpense())
            throw new InvalidOperationException(
                "A categoria selecionada não suporta transações de despesa");

        if (type == TransactionType.Revenue && !category.SupportsRevenue())
            throw new InvalidOperationException(
                "A categoria selecionada não suporta transações de receita");

        return new Transaction
        {
            Id = Guid.NewGuid(),
            Description = description,
            Value = value,
            Type = type,
            CategoryId = categoryId,
            PersonId = personId,
            CreatedAt = DateTime.UtcNow,
            Category = category,
            Person = person
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

    
    public void UpdateValue(decimal value)
    {
        if (value <= 0)
            throw new ArgumentException("Valor da transação deve ser maior que zero", nameof(value));

        Value = value;
    }

    public void UpdateCategory(Category category)
    {
        if (category == null)
            throw new ArgumentNullException(nameof(category), "Categoria não pode ser nula");

        if (Type == TransactionType.Expense && !category.SupportsExpense())
            throw new InvalidOperationException(
                "A categoria selecionada não suporta transações de despesa");

        if (Type == TransactionType.Revenue && !category.SupportsRevenue())
            throw new InvalidOperationException(
                "A categoria selecionada não suporta transações de receita");

        Category = category;
        CategoryId = category.Id;
    }

    public bool IsRecent() => (DateTime.UtcNow - CreatedAt).TotalHours <= 24;
}
