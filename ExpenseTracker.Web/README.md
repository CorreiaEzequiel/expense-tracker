# Expense Tracker - Frontend

Aplicação frontend construída com React + TypeScript + Vite para gerenciamento de despesas.

## Tecnologias Utilizadas

### Core
- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server

### Gerenciamento de Estado e Dados
- **@tanstack/react-query** - Cache e sincronização de dados do servidor
- **@tanstack/react-query-devtools** - DevTools para React Query
- **axios** - Cliente HTTP

### Roteamento
- **react-router-dom** - Roteamento client-side

### Formulários e Validação
- **react-hook-form** - Gerenciamento de formulários
- **zod** - Validação de schemas
- **react-select** - Componente de select aprimorado

### Utilitários
- **clsx** - Utilitário para classes condicionais
- **dayjs** - Manipulação e formatação de datas

### Estilo
- **Tailwind CSS** - Framework CSS utility-first
- **PostCSS** - Processamento CSS
- **Autoprefixer** - Prefixos CSS automáticos

## Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn

## Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure a URL da API:
```
VITE_API_URL=http://localhost:5000/api
```

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento (porta 3000)
- `npm run build` - Gera build de produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa o linter

## Estrutura do Projeto

```
src/
├── api/              # Configuração do cliente HTTP
│   └── apiClient.ts
├── hooks/            # React Query hooks customizados
│   ├── useCategories.ts
│   ├── usePeople.ts
│   ├── useTransactions.ts
│   └── useReports.ts
├── pages/            # Componentes de páginas
│   ├── HomePage.tsx
│   ├── CategoriesPage.tsx
│   ├── PeoplePage.tsx
│   ├── TransactionsPage.tsx
│   └── ReportsPage.tsx
├── types/            # Definições de tipos TypeScript
│   └── index.ts
├── App.tsx           # Componente raiz com roteamento
├── main.tsx          # Ponto de entrada da aplicação
└── index.css         # Estilos globais e Tailwind
```

## Funcionalidades

### Páginas
- **Home** - Dashboard principal
- **Transações** - Listagem e gerenciamento de transações
- **Categorias** - CRUD de categorias
- **Pessoas** - CRUD de pessoas
- **Relatórios** - Visualização de relatórios e análises

### React Query
O projeto utiliza React Query para:
- Cache automático de requisições
- Invalidação e refetch inteligente
- Estados de loading e erro
- DevTools para debug

### Formulários
- Integração react-hook-form + zod
- Validação client-side
- Componentes de select aprimorados

## Desenvolvimento

### Configuração do QueryClient

O QueryClient está configurado em `src/main.tsx` com:
- Retry: 1 tentativa em caso de erro
- RefetchOnWindowFocus: desabilitado
- StaleTime: 5 minutos

### Proxy de Desenvolvimento

O Vite está configurado para fazer proxy de requisições `/api` para o backend em `http://localhost:5000`.

### Tailwind CSS

O Tailwind está configurado para processar todos os arquivos `.tsx` e `.jsx` em `src/`.

## Próximos Passos

1. Instalar Node.js se ainda não estiver instalado
2. Executar `npm install` no diretório ExpenseTracker.Web
3. Configurar a variável de ambiente VITE_API_URL
4. Executar `npm run dev` para iniciar o servidor de desenvolvimento
5. Implementar formulários completos para CRUD
6. Adicionar validações com zod
7. Implementar componentes reutilizáveis
8. Adicionar tratamento de erros global
9. Implementar autenticação (se necessário)

## Observações

- Este projeto foi configurado manualmente com todas as dependências recomendadas
- Certifique-se de que a API backend está rodando na porta 5000
- O frontend será executado na porta 3000 por padrão
