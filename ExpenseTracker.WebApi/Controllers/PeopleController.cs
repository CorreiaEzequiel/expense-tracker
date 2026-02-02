namespace ExpenseTracker.WebApi.Controllers;

using Microsoft.AspNetCore.Mvc;
using ExpenseTracker.Application.Interfaces;
using ExpenseTracker.Application.DTOs;
using ExpenseTracker.Domain.Common;

[ApiController]
[Route("api/[controller]")]
public class PeopleController : BaseController
{
    private readonly IPersonService _personService;

    public PeopleController(IPersonService personService)
    {
        _personService = personService;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePersonRequest request)
    {
        var result = await _personService.CreateAsync(request);
        return ProcessResult(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById([FromRoute] Guid id)
    {
        var result = await _personService.GetByIdAsync(id);
        return ProcessResult(result);
    }

    [HttpGet("totals")]
    public async Task<IActionResult> TotalsByPerson()
    {
        var result = await _personService.GetPeopleSummaryAsync();
        return ProcessResult(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _personService.GetAllAsync();
        return ProcessResult(result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update([FromRoute] Guid id, [FromBody] CreatePersonRequest request)
    {
        var result = await _personService.UpdateAsync(id, request);
        return ProcessResult(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete([FromRoute] Guid id)
    {
        var result = await _personService.DeleteAsync(id);
        return ProcessResult(result);
    }

    
}
