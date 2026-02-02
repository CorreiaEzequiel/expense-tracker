namespace ExpenseTracker.Application.DTOs;

using System.Collections.Generic;

public record PeopleReportResponse(IEnumerable<PersonSummaryResponse> PeopleSummaries, decimal TotalRevenue, decimal TotalExpense, decimal NetBalance);
