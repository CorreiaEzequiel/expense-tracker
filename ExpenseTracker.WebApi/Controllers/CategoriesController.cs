namespace ExpenseTracker.WebApi.Controllers;

using Microsoft.AspNetCore.Mvc;
using ExpenseTracker.Application.Interfaces;
using ExpenseTracker.Application.DTOs;
using ExpenseTracker.Domain.Common;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : BaseController
{
    private readonly ICategoryService _categoryService;
    private readonly ITransactionService _transactionService;

    public CategoriesController(ICategoryService categoryService, ITransactionService transactionService)
    {
        _categoryService = categoryService;
        _transactionService = transactionService;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCategoryRequest request)
    {
        var result = await _categoryService.CreateAsync(request);
        return ProcessResult(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _categoryService.GetAllAsync();
        return ProcessResult(result);
    }

    [HttpGet("totals")]
    public async Task<IActionResult> TotalsByCategory()
    {
        var result = await _transactionService.GetSummaryByCategoryAsync();
        return ProcessResult(result);
    }

    
}
