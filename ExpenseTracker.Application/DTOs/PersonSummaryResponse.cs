namespace ExpenseTracker.Application.DTOs;

using System;

public record PersonSummaryResponse(Guid PersonId, string PersonName, decimal TotalRevenue, decimal TotalExpense, decimal Balance);
