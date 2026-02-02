namespace ExpenseTracker.Application.DTOs;

using System;
using ExpenseTracker.Domain.Entities.Enums;

public record TransactionResponse(Guid Id, string Description, decimal Value, TransactionType Type, Guid CategoryId, Guid PersonId, DateTime CreatedAt);
