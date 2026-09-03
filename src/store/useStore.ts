import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type AccountId = 'operativa' | 'carro' | 'invest'
export type TransactionType = 'income' | 'expense'

export interface Category {
  id: string
  icon: string
  label: string
  color: string
}

export const CATEGORIES: Category[] = [
  { id: 'mercado', icon: '🛒', label: 'Mercado', color: 'var(--green)' },
  { id: 'gasolina', icon: '⛽', label: 'Gasolina', color: 'var(--gold)' },
  { id: 'seguro', icon: '🚗', label: 'Seguro', color: 'var(--blue)' },
  { id: 'servicios', icon: '🏠', label: 'Servicios', color: 'var(--cyan)' },
  { id: 'salidas', icon: '🎉', label: 'Salidas', color: 'var(--purple)' },
  { id: 'trabajo', icon: '💼', label: 'Trabajo', color: 'var(--green)' },
  { id: 'adstrategic', icon: '🏢', label: 'Adstrat.', color: 'var(--blue)' },
  { id: 'educacion', icon: '📚', label: 'Educación', color: 'var(--teal)' },
  { id: 'tarjeta', icon: '💳', label: 'Tarjeta', color: 'var(--red)' },
  { id: 'otro', icon: '📝', label: 'Otro', color: 'var(--muted)' },
]

export interface Account {
  name: string
  balance: number
  blocked: boolean
}

export interface Transaction {
  id: string
  date: string
  type: TransactionType
  cat: string
  label: string
  amount: number | null
  note?: string
  hidden?: boolean
}

export interface Budget {
  label: string
  amount: number
}

export interface Goal {
  id: string
  title: string
  cat: string
  deadline: string
  progress: number
  done: boolean
}

export interface Config {
  minBalance: number
  warnBalance: number
  rentStart: string
  rentAmt: number
}

export interface AppState {
  accounts: Record<AccountId, Account>
  transactions: Transaction[]
  budget: Record<string, Budget>
  goals: Goal[]
  config: Config
}

const DEFAULT_STATE: AppState = {
  accounts: {
    operativa: { name: 'Cuenta de Ahorros', balance: 3828, blocked: false },
    carro: { name: 'Cuenta Carro', balance: 6640, blocked: true },
    invest: { name: 'Inversiones', balance: 1814, blocked: false }
  },
  transactions: [
    { id: 't1', date: '2026-08-22', type: 'expense', cat: 'mercado', label: 'Mercado', amount: 25, note: 'Huevos y leche' },
    { id: 't2', date: '2026-08-24', type: 'expense', cat: 'educacion', label: 'Tuition MDC Fall 2026', amount: 4400, note: '4 clases' },
    { id: 't3', date: '2026-08-21', type: 'expense', cat: 'tarjeta', label: 'Pago tarjeta crédito', amount: null, note: 'Agosto 2026', hidden: true }
  ],
  budget: {
    seguro: { label: '🚗 Seguro carro', amount: 250 },
    servicios: { label: '🏠 Servicios', amount: 200 },
    mercado: { label: '🛒 Mercado', amount: 200 },
    gasolina: { label: '⛽ Gasolina', amount: 100 },
    salidas: { label: '🎉 Salidas', amount: 100 },
    buffer: { label: '🛡 Buffer', amount: 100 }
  },
  goals: [
    { id: 'g1', title: 'Trabajo part-time banco/finanzas', cat: 'trabajo', deadline: '2026-10-01', progress: 0, done: false },
    { id: 'g2', title: '1 cliente AddNexo pago', cat: 'adstrategic', deadline: '2026-12-01', progress: 0, done: false },
    { id: 'g3', title: '3 clientes web Adstrategic $97', cat: 'adstrategic', deadline: '2026-12-01', progress: 0, done: false },
    { id: 'g4', title: '5 operadores valet (ADDSPOT)', cat: 'adstrategic', deadline: '2026-10-31', progress: 0, done: false },
    { id: 'g5', title: 'Prototipo ADDSPOT funcional', cat: 'adstrategic', deadline: '2026-12-01', progress: 0, done: false },
    { id: 'g6', title: 'MAC 1105 — A o B', cat: 'academico', deadline: '2026-12-15', progress: 0, done: false },
    { id: 'g7', title: 'COP 1334 — A o B', cat: 'academico', deadline: '2026-12-15', progress: 0, done: false },
  ],
  config: { minBalance: 5000, warnBalance: 6000, rentStart: '2026-12-01', rentAmt: 0 }
}

export interface StoreActions {
  addTransaction: (txn: Transaction) => void
  updateTransaction: (id: string, txn: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
  updateAccountBalance: (id: AccountId, balance: number) => void
  updateBudget: (key: string, amount: number) => void
  addGoal: (goal: Goal) => void
  updateGoalProgress: (id: string, progress: number) => void
  toggleGoalDone: (id: string) => void
  deleteGoal: (id: string) => void
  updateConfig: (config: Partial<Config>) => void
  resetData: () => void
  importData: (data: AppState) => void
}

type Store = AppState & StoreActions

export const useStore = create<Store>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,
      
      addTransaction: (txn) => set(state => {
        const newTransactions = [txn, ...state.transactions]
        const accounts = { ...state.accounts }
        
        // Auto-update operativa balance
        if (txn.amount && !txn.hidden) {
          if (txn.type === 'expense') {
            accounts.operativa.balance -= txn.amount
          } else {
            accounts.operativa.balance += txn.amount
          }
        }
        
        return { transactions: newTransactions, accounts }
      }),
      
      updateTransaction: (id, updatedTxn) => set(state => {
        const oldTxn = state.transactions.find(t => t.id === id)
        if (!oldTxn) return state
        
        const accounts = { ...state.accounts }
        
        // Revert old amount
        if (oldTxn.amount && !oldTxn.hidden) {
          if (oldTxn.type === 'expense') accounts.operativa.balance += oldTxn.amount
          else accounts.operativa.balance -= oldTxn.amount
        }
        
        // Apply new amount
        const newTxn = { ...oldTxn, ...updatedTxn }
        if (newTxn.amount && !newTxn.hidden) {
          if (newTxn.type === 'expense') accounts.operativa.balance -= newTxn.amount
          else accounts.operativa.balance += newTxn.amount
        }
        
        return {
          transactions: state.transactions.map(t => t.id === id ? newTxn : t),
          accounts
        }
      }),
      
      deleteTransaction: (id) => set(state => {
        const txn = state.transactions.find(t => t.id === id)
        if (!txn) return state
        
        const accounts = { ...state.accounts }
        if (txn.amount && !txn.hidden) {
          if (txn.type === 'expense') accounts.operativa.balance += txn.amount
          else accounts.operativa.balance -= txn.amount
        }
        
        return {
          transactions: state.transactions.filter(t => t.id !== id),
          accounts
        }
      }),
      
      updateAccountBalance: (id, balance) => set(state => ({
        accounts: {
          ...state.accounts,
          [id]: { ...state.accounts[id], balance }
        }
      })),
      
      updateBudget: (key, amount) => set(state => ({
        budget: {
          ...state.budget,
          [key]: { ...state.budget[key], amount }
        }
      })),
      
      addGoal: (goal) => set(state => ({
        goals: [...state.goals, goal]
      })),
      
      updateGoalProgress: (id, progress) => set(state => {
        const goals = state.goals.map(g => {
          if (g.id !== id) return g
          const done = progress >= 100
          return { ...g, progress, done: done ? true : g.done }
        })
        return { goals }
      }),
      
      toggleGoalDone: (id) => set(state => {
        const goals = state.goals.map(g => {
          if (g.id !== id) return g
          const done = !g.done
          return { ...g, done, progress: done ? 100 : g.progress }
        })
        return { goals }
      }),
      
      deleteGoal: (id) => set(state => ({
        goals: state.goals.filter(g => g.id !== id)
      })),
      
      updateConfig: (config) => set(state => ({
        config: { ...state.config, ...config }
      })),
      
      resetData: () => set(DEFAULT_STATE),
      
      importData: (data) => set(data)
    }),
    {
      name: 'santios_v3',
    }
  )
)

// Helper selectors
export const getMonthlySpent = (state: Store) => {
  const now = new Date()
  const mo = now.getMonth()
  const yr = now.getFullYear()
  const spent: Record<string, number> = {}
  
  Object.keys(state.budget).forEach(k => spent[k] = 0)
  
  ;(state.transactions || []).forEach(t => {
    if (!t.amount || t.hidden) return
    const d = new Date(t.date + 'T12:00:00Z') // prevent timezone shift
    if (d.getMonth() === mo && d.getFullYear() === yr && t.type === 'expense') {
      const map: Record<string, string> = { mercado: 'mercado', gasolina: 'gasolina', seguro: 'seguro', servicios: 'servicios', salidas: 'salidas' }
      const key = map[t.cat] || 'buffer'
      if (spent[key] !== undefined) spent[key] += t.amount
      else spent['buffer'] = (spent['buffer'] || 0) + t.amount
    }
  })
  
  return spent
}

export const getTotalBudget = (state: Store) => {
  return Object.values(state.budget).reduce((a, b) => a + b.amount, 0)
}

export const getTotalSpentMonth = (state: Store) => {
  const spent = getMonthlySpent(state)
  return Object.values(spent).reduce((a, b) => a + b, 0)
}
