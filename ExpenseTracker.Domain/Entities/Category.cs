namespace ExpenseTracker.Domain.Entities;

using ExpenseTracker.Domain.Common;
using System;
using ExpenseTracker.Domain.Entities.Enums;

public class Category
{
    public Guid Id { get; private set; }
    public string Description { get; private set; }
    public CategoryPurpose Purpose { get; private set; }

    protected Category()
    {
    }

   
    public static Result<Category> Create(string description, CategoryPurpose purpose)
    {
        if (string.IsNullOrWhiteSpace(description))
            return Result<Category>.Error("Descrição não pode ser vazia");

        if (description.Length > 400)
            return Result<Category>.Error("Descrição não pode exceder 400 caracteres");

        if (!Enum.IsDefined(typeof(CategoryPurpose), purpose))
            return Result<Category>.Error("Propósito de categoria inválido");

        var category = new Category
        {
            Id = Guid.NewGuid(),
            Description = description,
            Purpose = purpose
        };

        return Result<Category>.Success(category);
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

    public Result<bool> UpdatePurpose(CategoryPurpose purpose)
    {
        if (!Enum.IsDefined(typeof(CategoryPurpose), purpose))
            return Result<bool>.Error("Propósito de categoria inválido");

        Purpose = purpose;
        return Result<bool>.Success(true);
    }

    /// <summary>
    /// Verifica se a categoria pode ser usada em transações de despesa.
    /// Categorias do tipo 'Expense' ou 'Both' suportam despesas.
    /// </summary>
    public bool SupportsExpense() => Purpose == CategoryPurpose.Expense || Purpose == CategoryPurpose.Both;

    /// <summary>
    /// Verifica se a categoria pode ser usada em transações de receita.
    /// Categorias do tipo 'Revenue' ou 'Both' suportam receitas.
    /// </summary>
    public bool SupportsRevenue() => Purpose == CategoryPurpose.Revenue || Purpose == CategoryPurpose.Both;
}
