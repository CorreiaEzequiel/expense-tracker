namespace ExpenseTracker.Domain.Entities;

using ExpenseTracker.Domain.Common;

public class Person
{
    public Guid Id { get; private set; }
    public string Name { get; private set; }
    public DateTime DateOfBirth { get; private set; }

    public ICollection<Transaction> Transactions { get; private set; }

    protected Person()
    {
        Transactions = new List<Transaction>();
    }

    public static Result<Person> Create(string name, int age)
    {
        return Result<Person>.Error("Use Create(string name, DateTime dateOfBirth) instead.");
    }

    public static Result<Person> Create(string name, DateTime dateOfBirth)
    {
        if (string.IsNullOrWhiteSpace(name))
            return Result<Person>.Error("Nome não pode ser vazio");

        if (name.Length > 200)
            return Result<Person>.Error("Nome não pode exceder 200 caracteres");

        if (dateOfBirth.Date > DateTime.Today)
            return Result<Person>.Error("Data de nascimento não pode ser no futuro");

        var person = new Person
        {
            Id = Guid.NewGuid(),
            Name = name,
            DateOfBirth = dateOfBirth,
            Transactions = new List<Transaction>()
        };

        return Result<Person>.Success(person);
    }

    public Result<bool> UpdateName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            return Result<bool>.Error("Nome não pode ser vazio");

        if (name.Length > 200)
            return Result<bool>.Error("Nome não pode exceder 200 caracteres");

        Name = name;
        return Result<bool>.Success(true);
    }

    public Result<bool> UpdateDateOfBirth(DateTime dateOfBirth)
    {
        if (dateOfBirth.Date > DateTime.Today)
            return Result<bool>.Error("Data de nascimento não pode ser no futuro");

        DateOfBirth = dateOfBirth;
        return Result<bool>.Success(true);
    }

    /// <summary>
    /// Calcula a idade atual da pessoa com base na data de nascimento.
    /// Considera se o aniversário já ocorreu no ano corrente.
    /// </summary>
    public int GetAge()
    {
        var today = DateTime.Today;
        var age = today.Year - DateOfBirth.Year;
        if (DateOfBirth.Date > today.AddYears(-age)) age--;
        return age;
    }

    /// <summary>
    /// Regra de negócio crítica: apenas maiores de 18 anos podem registrar receitas.
    /// Este método é usado nas validações de transações.
    /// </summary>
    public bool IsAdult() => GetAge() >= 18;
}
