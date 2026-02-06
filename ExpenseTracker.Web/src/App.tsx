import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import HomePage from './pages/HomePage'
import TransactionsPage from './pages/TransactionsPage'
import CategoriesPage from './pages/CategoriesPage'
import PeoplePage from './pages/PeoplePage'
import ReportsPage from './pages/ReportsPage'
import ToastContainer from './components/ToastContainer'
import { useToast } from './contexts/ToastContext'
import { setupApiNotifications } from './api/apiClient'
import clsx from 'clsx'

function App() {
  const location = useLocation()
  const { showToast } = useToast()

  // Configurar notificações automáticas da API ao carregar a aplicação
  // Isso conecta o sistema de toast com o interceptor do axios,
  // permitindo que todas as respostas da API exibam notificações apropriadas
  useEffect(() => {
    setupApiNotifications(showToast)
  }, [showToast])

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Expense Tracker</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link 
                  to="/" 
                  className={clsx(
                    "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
                    location.pathname === "/" 
                      ? "border-indigo-500 text-gray-900" 
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  )}
                >
                  Home
                </Link>
                <Link 
                  to="/transactions" 
                  className={clsx(
                    "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
                    location.pathname === "/transactions" 
                      ? "border-indigo-500 text-gray-900" 
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  )}
                >
                  Transações
                </Link>
                <Link 
                  to="/categories" 
                  className={clsx(
                    "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
                    location.pathname === "/categories" 
                      ? "border-indigo-500 text-gray-900" 
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  )}
                >
                  Categorias
                </Link>
                <Link 
                  to="/people" 
                  className={clsx(
                    "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
                    location.pathname === "/people" 
                      ? "border-indigo-500 text-gray-900" 
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  )}
                >
                  Pessoas
                </Link>
                <Link 
                  to="/reports" 
                  className={clsx(
                    "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
                    location.pathname === "/reports" 
                      ? "border-indigo-500 text-gray-900" 
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  )}
                >
                  Relatórios
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/people" element={<PeoplePage />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
