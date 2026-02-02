namespace ExpenseTracker.Application.DTOs;

using System;
using System.Collections.Generic;

public record MonthlyGroup(int Year, int Month, decimal TotalRevenue, decimal TotalExpense, decimal Balance, IEnumerable<TransactionDetail> Transactions);
