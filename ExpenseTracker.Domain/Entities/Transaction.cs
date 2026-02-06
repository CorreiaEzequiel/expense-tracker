namespace ExpenseTracker.Domain.Entities;

using ExpenseTracker.Domain.Common;
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

    public static Result<Transaction> Create(
        string description,
        decimal value,
        TransactionType type,
        Guid categoryId,
        Guid personId,
        Category category,
        Person person)
    {
        if (string.IsNullOrWhiteSpace(description))
            return Result<Transaction>.Error("Descrição não pode ser vazia");

        if (description.Length > 400)
            return Result<Transaction>.Error("Descrição não pode exceder 400 caracteres");

        if (value <= 0)
            return Result<Transaction>.Error("Valor da transação deve ser maior que zero");

        if (!Enum.IsDefined(typeof(TransactionType), type))
            return Result<Transaction>.Error("Tipo de transação inválido");

        if (type == TransactionType.Revenue && !person.IsAdult())
            return Result<Transaction>.Warning(default, "Menores de 18 anos não podem registrar transações de receita");

        if (type == TransactionType.Expense && !category.SupportsExpense())
            return Result<Transaction>.Error("A categoria selecionada não suporta transações de despesa");

        if (type == TransactionType.Revenue && !category.SupportsRevenue())
            return Result<Transaction>.Error("A categoria selecionada não suporta transações de receita");

        var transaction = new Transaction
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

        return Result<Transaction>.Success(transaction);
    }

    public Result<bool> UpdateDescription(string description)
    {
        if (string.IsNullOrWhiteSpace(description))
            return Result<bool>.Error("Descrição não pode ser vazia");

        if (description.Length > 400)
            return Result<bool>.Error("Descrição não pode exceder 400 caracteres");

        Description = description;
        return Result<bool>.Success(true);
    }

    public Result<bool> UpdateValue(decimal value)
    {
        if (value <= 0)
            return Result<bool>.Error("Valor da transação deve ser maior que zero");

        Value = value;
        return Result<bool>.Success(true);
    }

    public Result<bool> UpdateCategory(Category category)
    {
        if (category == null)
            return Result<bool>.Error("Categoria não pode ser nula");

        if (Type == TransactionType.Expense && !category.SupportsExpense())
            return Result<bool>.Error("A categoria selecionada não suporta transações de despesa");

        if (Type == TransactionType.Revenue && !category.SupportsRevenue())
            return Result<bool>.Error("A categoria selecionada não suporta transações de receita");

        Category = category;
        CategoryId = category.Id;
        return Result<bool>.Success(true);
    }

    public bool IsRecent() => (DateTime.UtcNow - CreatedAt).TotalHours <= 24;
}
