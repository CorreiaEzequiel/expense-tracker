namespace ExpenseTracker.Application.DTOs;

using System;

public record PersonResponse(Guid Id, string Name, int Age);

// Future update: Compute Age from DateOfBirth in service
