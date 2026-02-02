namespace ExpenseTracker.Application.Interfaces;

using ExpenseTracker.Application.DTOs;
using ExpenseTracker.Domain.Common;

public interface IPersonService
{
    Task<Result<PersonResponse>> CreateAsync(CreatePersonRequest request);
    Task<Result<PersonResponse>> GetByIdAsync(Guid id);
    Task<Result<IEnumerable<PersonResponse>>> GetAllAsync();
    Task<Result<PersonResponse>> UpdateAsync(Guid id, CreatePersonRequest request);
    Task<Result<bool>> DeleteAsync(Guid id);

    Task<Result<PeopleReportResponse>> GetPeopleSummaryAsync();
}
