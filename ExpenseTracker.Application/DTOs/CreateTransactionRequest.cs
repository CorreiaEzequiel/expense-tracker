namespace ExpenseTracker.Application.DTOs;

using System;
using ExpenseTracker.Domain.Entities.Enums;

public record CreateTransactionRequest(string Description, decimal Value, TransactionType Type, Guid CategoryId, Guid PersonId);
