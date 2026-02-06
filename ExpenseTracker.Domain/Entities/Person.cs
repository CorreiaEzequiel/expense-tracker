namespace ExpenseTracker.Domain.Entities;

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

    public static Person Create(string name, int age)
    {
        throw new NotSupportedException("Use Create(string name, DateTime dateOfBirth) instead.");
    }

    public static Person Create(string name, DateTime dateOfBirth)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Nome n�o pode ser vazio", nameof(name));

        if (name.Length > 200)
            throw new ArgumentException("Nome n�o pode exceder 200 caracteres", nameof(name));

        if (dateOfBirth > DateTime.Today)
            throw new ArgumentException("Data de nascimento n�o pode ser no futuro", nameof(dateOfBirth));

        return new Person
        {
            Id = Guid.NewGuid(),
            Name = name,
            DateOfBirth = dateOfBirth,
            Transactions = new List<Transaction>()
        };
    }

    public void UpdateName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Nome n�o pode ser vazio", nameof(name));

        if (name.Length > 200)
            throw new ArgumentException("Nome n�o pode exceder 200 caracteres", nameof(name));

        Name = name;
    }

    public void UpdateDateOfBirth(DateTime dateOfBirth)
    {
        if (dateOfBirth > DateTime.Today)
            throw new ArgumentException("Data de nascimento n�o pode ser no futuro", nameof(dateOfBirth));

        DateOfBirth = dateOfBirth;
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
