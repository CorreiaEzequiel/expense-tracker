namespace ExpenseTracker.Application.DTOs;

using System;
using ExpenseTracker.Domain.Entities.Enums;

public record TransactionDetail(DateTime Date, string Category, string Description, decimal Value, TransactionType Type);
