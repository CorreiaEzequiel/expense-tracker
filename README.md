# 💰 ExpenseTracker

Sistema completo de controle de gastos residenciais desenvolvido para gerenciar receitas, despesas e gerar relatórios detalhados por pessoa.

---

## 📋 Resumo do Projeto

O **ExpenseTracker** é uma aplicação web fullstack que permite o controle financeiro doméstico através do cadastro de pessoas, categorias e transações. O sistema oferece relatórios detalhados com agrupamento mensal, validações de regras de negócio e uma interface moderna e intuitiva.

### Principais Funcionalidades

- ✅ Gestão de Pessoas (com validação de idade)
- ✅ Gestão de Categorias (Despesa, Receita ou Ambos)
- ✅ Registro de Transações financeiras
- ✅ Relatórios detalhados por pessoa com agrupamento mensal
- ✅ Dashboard com resumo financeiro
- ✅ Validações de regras de negócio (ex: menores de 18 anos não podem ter receitas)
- ✅ Formatação de valores em Real Brasileiro (R$)

---

## 🚀 Stack Tecnológica

### **Backend**
- **.NET 9.0** - Framework principal
- **ASP.NET Core Web API** - API RESTful
- **Entity Framework Core 9.0** - ORM
- **SQLite** - Banco de dados local
- **Swagger/OpenAPI** - Documentação interativa da API

### **Frontend**
- **React 18.2** - Biblioteca UI
- **TypeScript 5.3** - Tipagem estática
- **Vite 5.0** - Build tool e dev server
- **TanStack React Query** - Gerenciamento de estado servidor
- **Axios** - Cliente HTTP
- **Tailwind CSS 3.4** - Framework CSS utilitário
- **React Router DOM** - Roteamento
- **React Hook Form + Zod** - Validação de formulários
- **Day.js** - Manipulação de datas

---

## 🏗️ Arquitetura

### **Clean Architecture**

O projeto backend segue os princípios da Clean Architecture, separado em 4 camadas:

```
ExpenseTracker/
├── ExpenseTracker.Domain/          # Entidades, Enums, Result Pattern
├── ExpenseTracker.Application/     # Services, DTOs, Interfaces (lógica de negócio)
├── ExpenseTracker.Infrastructure/  # EF Core, Repositories, Migrations
└── ExpenseTracker.WebApi/          # Controllers, Program.cs (API REST)
```

#### **Result Pattern**

Em vez de lançar exceções, o sistema utiliza o **Result Pattern** para retornar resultados estruturados:

```csharp
public class Result<T>
{
    public bool IsSuccess { get; }
    public T? Data { get; }
    public string Message { get; }
    public ResultType Type { get; } // Success=0, Warning=1, Error=2
}
```

**Benefícios:**
- Controle de fluxo mais previsível
- Melhor tratamento de erros
- Mensagens padronizadas para o frontend
- Notificações automáticas via toast

---

## ⚙️ Como Rodar o Projeto

### **Pré-requisitos**
- .NET SDK 9.0 ou superior
- Node.js 18+ e npm
- Git (opcional)

### **1️⃣ Clonar o Repositório**
```bash
git clone <url-do-repositorio>
cd ExpenseTracker/ExpenseTracker
```

### **2️⃣ Configurar e Rodar o Backend**

```powershell
# Navegar até o diretório da WebApi
cd ExpenseTracker.WebApi

# Restaurar dependências
dotnet restore

# Aplicar migrations (cria o banco SQLite automaticamente)
dotnet ef database update

# Executar a API
dotnet run
```

A API estará disponível em:
- **HTTPS:** https://localhost:7207
- **Swagger:** https://localhost:7207/swagger

> 💡 **Nota:** O banco de dados `expense_tracker.db` será criado automaticamente na primeira execução.

### **3️⃣ Configurar e Rodar o Frontend**

```powershell
# Em outro terminal, navegar até o diretório do frontend
cd ExpenseTracker.Web

# Instalar dependências
npm install

# Executar o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em:
- **Frontend:** http://localhost:3000

### **4️⃣ Acessar a Aplicação**

1. Abra o navegador em `http://localhost:3000`
2. Navegue pelas páginas: Categorias, Pessoas, Transações, Relatórios
3. Teste a criação de dados e visualize os relatórios

---

## 📡 Principais Endpoints da API

### **Categories**
- `GET /api/categories` - Lista todas as categorias
- `POST /api/categories` - Cria nova categoria

### **People**
- `GET /api/people` - Lista todas as pessoas
- `POST /api/people` - Cria nova pessoa
- `PUT /api/people/{id}` - Atualiza pessoa
- `DELETE /api/people/{id}` - Remove pessoa

### **Transactions**
- `GET /api/transactions/summary` - Retorna resumo financeiro (receita, despesa, saldo)
- `POST /api/transactions` - Cria nova transação


### **⭐ Relatório Detalhado por Pessoa**
```
GET /api/transactions/person-report/{personId}?startDate={data}&endDate={data}
```

**Destaque:** Este endpoint retorna um relatório completo com:
- Informações da pessoa
- Totais gerais (receita, despesa, saldo)
- Agrupamento mensal com:
  - Mês/Ano
  - Receita total do mês
  - Despesa total do mês
  - Saldo do mês
  - Lista de transações detalhadas

**Exemplo de resposta:**
```json
{
  "isSuccess": true,
  "data": {
    "personName": "João Silva",
    "totalRevenue": 5000.00,
    "totalExpense": 3200.00,
    "netBalance": 1800.00,
    "monthlyGroups": [
      {
        "month": 2,
        "year": 2026,
        "totalRevenue": 2500.00,
        "totalExpense": 1600.00,
        "balance": 900.00,
        "transactions": [...]
      }
    ]
  },
  "message": "Relatório gerado com sucesso",
  "type": 0
}
```

---

## 📝 Regras de Negócio

### **1. Validação de Idade**
- ✅ Pessoas menores de 18 anos **NÃO PODEM** ter transações do tipo "Receita"
- ✅ Apenas despesas são permitidas para menores de idade
- ✅ O frontend filtra automaticamente a lista de pessoas ao selecionar tipo "Receita"

### **2. Tipos de Categoria**
- **Despesa (0):** Categoria exclusiva para despesas
- **Receita (1):** Categoria exclusiva para receitas
- **Ambos (2):** Categoria que aceita tanto despesas quanto receitas

### **3. Validações de Transação**
- ✅ Valor deve ser maior que zero
- ✅ Descrição é obrigatória
- ✅ Categoria e Pessoa devem existir no banco
- ✅ Data da transação é registrada automaticamente

### **4. Persistência de Dados**
- ✅ Banco SQLite local (`expense_tracker.db`)
- ✅ Migrations aplicadas automaticamente ao iniciar a API
- ✅ Dados persistem entre execuções

### **5. Formatação de Moeda**
- ✅ Todos os valores são exibidos no formato Real Brasileiro: **R$ 1.234,56**
- ✅ Formatação é apenas visual, valores numéricos são enviados normalmente para a API

---

## 🎨 Funcionalidades do Frontend

### **Dashboard/Relatórios**
- Seleção de pessoa por dropdown
- Filtro por período (data inicial e final)
- Resumo financeiro com cards visuais (receita, despesa, saldo)
- Agrupamento mensal com tabelas de transações
- Formatação automática de valores em BRL

### **Notificações**
- Sistema de **toast notifications** profissional
- Feedback visual para todas as operações (sucesso, erro, aviso)
- Substituição de alerts/confirms nativos por modais customizados

### **Formulários**
- Validação em tempo real com React Hook Form + Zod
- Máscaras e formatações adequadas
- Conversão automática de datas para ISO 8601
- Dropdowns customizados com react-select

### **Responsividade**
- Design responsivo com Tailwind CSS
- Adaptação automática para mobile, tablet e desktop
- Grid system para organização de cards e tabelas

---

## 📂 Estrutura de Pastas

### **Backend**
```
ExpenseTracker.WebApi/
├── Controllers/           # Endpoints da API
├── Program.cs            # Configuração da aplicação
└── appsettings.json      # Configurações (CORS, DB)

ExpenseTracker.Application/
├── DTOs/                 # Request/Response objects
├── Interfaces/           # Contratos dos services
└── Services/             # Lógica de negócio

ExpenseTracker.Infrastructure/
├── Data/                 # DbContext
├── Mappings/             # Configurações EF Core
├── Migrations/           # Scripts de migração
└── Repositories/         # Acesso a dados

ExpenseTracker.Domain/
├── Entities/             # Modelos de domínio
├── Common/               # Result Pattern
└── Enums/                # Enumeradores
```

### **Frontend**
```
ExpenseTracker.Web/src/
├── api/                  # Cliente Axios, interceptors
├── components/           # Componentes reutilizáveis
├── contexts/             # Context API (Toast, etc)
├── hooks/                # React Query hooks customizados
├── pages/                # Páginas da aplicação
├── types/                # TypeScript interfaces
└── utils/                # Funções utilitárias (formatação, etc)
```

---

## 🧪 Testando a Aplicação

### **Fluxo Sugerido:**

1. **Criar Categorias**
   - Acesse "Categorias"
   - Crie categorias de Despesa (ex: Alimentação, Transporte)
   - Crie categorias de Receita (ex: Salário, Freelance)

2. **Cadastrar Pessoas**
   - Acesse "Pessoas"
   - Adicione pessoas com data de nascimento
   - Note que a idade é calculada automaticamente

3. **Registrar Transações**
   - Acesse "Transações"
   - Crie receitas (apenas para maiores de 18)
   - Crie despesas
   - Visualize o resumo financeiro

4. **Visualizar Relatórios**
   - Acesse "Relatórios"
   - Selecione uma pessoa
   - Defina o período (opcional)
   - Analise os totais e agrupamentos mensais

---

## 🛠️ Comandos Úteis

### **Backend**
```bash
# Criar nova migration
dotnet ef migrations add NomeDaMigration -p ExpenseTracker.Infrastructure -s ExpenseTracker.WebApi

# Atualizar banco de dados
dotnet ef database update -s ExpenseTracker.WebApi

# Limpar e compilar
dotnet clean
dotnet build

# Executar testes (se houver)
dotnet test
```

### **Frontend**
```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Linting
npm run lint
```

---

## 🔒 CORS e Segurança

O backend está configurado para aceitar requisições apenas de:
- `http://localhost:3000` (porta padrão do Vite)
- `http://localhost:5173` (porta alternativa do Vite)

Para adicionar outras origens, edite o arquivo `Program.cs`:
```csharp
policy.WithOrigins("http://localhost:3000", "http://localhost:5173", "https://seudominio.com")
```

---

## 📄 Licença

Este projeto foi desenvolvido como parte de um teste técnico e é de uso educacional.

---

## 👨‍💻 Desenvolvedor

Projeto desenvolvido seguindo as melhores práticas de Clean Architecture, SOLID e padrões de mercado.

**Stack:** .NET 9 + React + TypeScript  
**Padrões:** Clean Architecture, Result Pattern, Repository Pattern, Dependency Injection

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique se a API está rodando em `https://localhost:7207`
2. Verifique se o frontend está rodando em `http://localhost:3000`
3. Consulte o Swagger em `https://localhost:7207/swagger` para testar os endpoints
4. Verifique os logs no console do navegador (F12)

---

**Desenvolvido com ❤️ para controle financeiro residencial eficiente**
