namespace ExpenseTracker.Application.DTOs;

using System;
using System.Collections.Generic;

public record DetailedReportResponse(string PersonName, decimal NetBalance, IEnumerable<MonthlyGroup> MonthlyGroups);
