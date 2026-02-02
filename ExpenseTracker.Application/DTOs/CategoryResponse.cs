namespace ExpenseTracker.Application.DTOs;

using System;
using ExpenseTracker.Domain.Entities.Enums;

public record CategoryResponse(Guid Id, string Description, CategoryPurpose Purpose);
