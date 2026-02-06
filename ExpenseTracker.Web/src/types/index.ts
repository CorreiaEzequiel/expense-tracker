// Types based on backend DTOs
// API Response wrapper
export interface ApiResult<T = unknown> {
  isSuccess: boolean
  data: T
  message: string
  type: number // 0 = Success, 1 = Warning, 2 = Error
}

// Enums
export enum CategoryPurpose {
  Expense = 0,
  Revenue = 1,
  Both = 2
}

export enum TransactionType {
  Expense = 0,
  Revenue = 1
}

export interface CategoryResponse {
  id: string
  description: string
  purpose: CategoryPurpose
}

export interface CreateCategoryRequest {
  description: string
  purpose: CategoryPurpose
}

export interface PersonResponse {
  id: string
  name: string
  birthDate: string
  age: number
}

export interface CreatePersonRequest {
  name: string
  dateOfBirth: string
}

export interface TransactionResponse {
  id: string
  amount: number
  description: string
  date: string
  categoryId: string
  personId: string
}

export interface CreateTransactionRequest {
  description: string
  value: number
  type: TransactionType
  categoryId: string
  personId: string
}

export interface CategorySummaryResponse {
  categoryId: string
  categoryDescription: string
  totalRevenue: number
  totalExpense: number
  balance: number
}

export interface PersonSummaryResponse {
  personId: string
  personName: string
  totalRevenue: number
  totalExpense: number
  balance: number
}

export interface ReportSummaryResponse {
  totalRevenue: number
  totalExpense: number
  netBalance: number
}

export interface CategoriesReportResponse {
  categorySummaries: CategorySummaryResponse[]
  totalRevenue: number
  totalExpense: number
  netBalance: number
}

export interface PeopleReportResponse {
  peopleSummaries: PersonSummaryResponse[]
  totalRevenue: number
  totalExpense: number
  netBalance: number
}

export interface TransactionDetail {
  date: string
  category: string
  description: string
  value: number
  type: number // 0 = Expense, 1 = Revenue
}

export interface MonthlyGroup {
  year: number
  month: number
  totalRevenue: number
  totalExpense: number
  balance: number
  transactions: TransactionDetail[]
}

export interface DetailedReportResponse {
  personName: string
  netBalance: number
  monthlyGroups: MonthlyGroup[]
}
