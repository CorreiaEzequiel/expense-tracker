namespace ExpenseTracker.Application.DTOs;

public record ReportSummaryResponse(decimal TotalRevenue, decimal TotalExpense, decimal NetBalance);
