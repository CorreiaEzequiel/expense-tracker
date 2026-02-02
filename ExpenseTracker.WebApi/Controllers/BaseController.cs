namespace ExpenseTracker.WebApi.Controllers;

using Microsoft.AspNetCore.Mvc;
using ExpenseTracker.Domain.Common;
using ExpenseTracker.Domain.Entities.Enums;
using System;

[ApiController]
public abstract class BaseController : ControllerBase
{
    protected IActionResult ProcessResult<T>(Result<T> result)
    {
        if (result.IsSuccess)
            return Ok(result);

        if (result.Type == ResultType.Warning)
            return Conflict(result);

        if (result.Type == ResultType.Error && !string.IsNullOrWhiteSpace(result.Message) &&
            result.Message.Contains("não encontrado", StringComparison.OrdinalIgnoreCase))
        {
            return NotFound(result);
        }

        return BadRequest(result);
    }
}
