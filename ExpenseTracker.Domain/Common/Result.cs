namespace ExpenseTracker.Domain.Common;

using ExpenseTracker.Domain.Entities.Enums;

/// <summary>
/// Result Pattern: Alternativa ao uso de exceções para controle de fluxo.
/// Permite retornar sucesso, avisos ou erros de forma estruturada, facilitando
/// o tratamento no frontend e evitando try-catch excessivos.
/// O campo 'Type' permite ao frontend exibir notificações visuais adequadas (toast).
/// </summary>
public class Result<T>
{
    public bool IsSuccess { get; private set; }
    public T? Data { get; private set; }
    public string Message { get; private set; }
    public ResultType Type { get; private set; }

    private Result(bool isSuccess, T? data, string message, ResultType type)
    {
        IsSuccess = isSuccess;
        Data = data;
        Message = message;
        Type = type;
    }

    /// <summary>
    /// Cria um resultado de sucesso
    /// </summary>
    public static Result<T> Success(T? data = default, string message = "Operação realizada com sucesso")
    {
        return new Result<T>(true, data, message, ResultType.Success);
    }

    /// <summary>
    /// Cria um resultado de aviso
    /// </summary>
    public static Result<T> Warning(T? data = default, string message = "Operaçãoo realizada com aviso")
    {
        return new Result<T>(true, data, message, ResultType.Warning);
    }

    /// <summary>
    /// Cria um resultado de erro
    /// </summary>
    public static Result<T> Error(string message = "Uma erro ocorreu durante a operação")
    {
        return new Result<T>(false, default, message, ResultType.Error);
    }

    /// <summary>
    /// Cria um resultado de erro com dados
    /// </summary>
    public static Result<T> Error(T? data, string message = "Uma erro ocorreu durante a operação")
    {
        return new Result<T>(false, data, message, ResultType.Error);
    }
}
