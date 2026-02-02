namespace ExpenseTracker.Domain.Entities;

public class Person
{
    public Guid Id { get; private set; }
    public string Name { get; private set; }
    public int Age { get; private set; }

    public ICollection<Transaction> Transactions { get; private set; }

    protected Person()
    {
        Transactions = new List<Transaction>();
    }

    public static Person Create(string name, int age)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Nome não pode ser vazio", nameof(name));

        if (name.Length > 200)
            throw new ArgumentException("Nome não pode exceder 200 caracteres", nameof(name));

        if (age < 0)
            throw new ArgumentException("Idade não pode ser negativa", nameof(age));

        return new Person
        {
            Id = Guid.NewGuid(),
            Name = name,
            Age = age,
            Transactions = new List<Transaction>()
        };
    }

    public void UpdateName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Nome não pode ser vazio", nameof(name));

        if (name.Length > 200)
            throw new ArgumentException("Nome não pode exceder 200 caracteres", nameof(name));

        Name = name;
    }

    public void UpdateAge(int age)
    {
        if (age < 0)
            throw new ArgumentException("Idade não pode ser negativa", nameof(age));

        Age = age;
    }

    public bool IsAdult() => Age >= 18;
}
