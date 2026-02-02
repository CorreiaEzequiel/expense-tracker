namespace ExpenseTracker.Application.DTOs;

using ExpenseTracker.Domain.Entities.Enums;

public record CreateCategoryRequest(string Description, CategoryPurpose Purpose);
