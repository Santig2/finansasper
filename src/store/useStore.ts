import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CategoryId = 'seguro_carro' | 'servicios' | 'mercado' | 'gasolina' | 'ocio' | 'trabajo' | 'adstrategic' | 'educacion' | 'reparaciones' | 'otro' | 'tarjeta_credito' | 'buffer'
export type GoalCategory = 'Trabajo' | 'Adstrategic' | 'Académico' | 'Personal'
export type GoalStatus = 'Por hacer' | 'En progreso' | 'Completado' | 'Vencido'
export type ClientStage = 'Contactado' | 'Demo dada' | 'Negociando' | 'Cliente'

export interface Category {
  id: CategoryId
  name: string
  icon: string
  color: string
}

export interface Account {
  id: string
  name: string
  type: string
  balance: number
  status: 'activa' | 'bloqueada' | 'reservada'
  blocked: boolean
  color: string
  note?: string
}

export interface Transaction {
  id: string
  date: string
  amount: number
  description: string
  type: 'income' | 'expense'
  categoryId: CategoryId
  accountId: string
  note?: string
}

export interface Budget {
  categoryId: CategoryId
  amount: number
}

export interface Subtask {
  id: string
  title: string
  completed: boolean
}

export interface Goal {
  id: string
  title: string
  target: string
  category: GoalCategory
  progress: number
  status: GoalStatus
  deadline?: string
  notes?: string
  subtasks: Subtask[]
}

export interface Client {
  id: string
  name: string
  product: string
  lastContact: string
  potentialAmount: number
  stage: ClientStage
  notes?: string
}

export interface UserProfile {
  name: string
  minThreshold: number
  estimatedIncome: number
  showCarAccountInTotal: boolean
}

export interface RecurringExpense {
  id: string
  title: string
  amount: number
}

export interface StoreState {
  hasCompletedOnboarding: boolean
  profile: UserProfile
  availableToday: number
  monthlySpend: number
  monthlyBudget: number
  runwayDays: number
  monthlyIncome: number
  goals: Goal[]
  transactions: Transaction[]
  accounts: Account[]
  budgets: Budget[]
  clients: Client[]
  recurringExpenses: RecurringExpense[]
  // Actions
  completeOnboarding: (useDefaults?: boolean) => void
  updateProfile: (profile: Partial<UserProfile>) => void
  addTransaction: (tx: Omit<Transaction, 'id'>) => void
  updateGoalProgress: (id: string, progress: number) => void
  updateGoalSubtask: (goalId: string, subtaskId: string, completed: boolean) => void
  moveClientStage: (clientId: string, newStage: ClientStage) => void
  addRecurringExpense: (expense: Omit<RecurringExpense, 'id'>) => void
  removeRecurringExpense: (id: string) => void
  updateRecurringExpense: (id: string, title: string, amount: number) => void
  importData: (data: any) => void
  resetData: () => void
}

export const CATEGORIES: Record<CategoryId, Category> = {
  seguro_carro: { id: 'seguro_carro', name: 'Seguro carro', icon: 'Car', color: 'text-sky' },
  servicios: { id: 'servicios', name: 'Servicios/utilities', icon: 'Home', color: 'text-accent' },
  mercado: { id: 'mercado', name: 'Mercado', icon: 'ShoppingCart', color: 'text-teal' },
  gasolina: { id: 'gasolina', name: 'Gasolina', icon: 'Fuel', color: 'text-orange-500' },
  ocio: { id: 'ocio', name: 'Salidas/ocio', icon: 'PartyPopper', color: 'text-accent2' },
  trabajo: { id: 'trabajo', name: 'Trabajo/ingreso banco', icon: 'Briefcase', color: 'text-green' },
  adstrategic: { id: 'adstrategic', name: 'Adstrategic', icon: 'Building', color: 'text-gold' },
  educacion: { id: 'educacion', name: 'Educación/tuition', icon: 'BookOpen', color: 'text-sky' },
  reparaciones: { id: 'reparaciones', name: 'Reparaciones', icon: 'Wrench', color: 'text-coral' },
  tarjeta_credito: { id: 'tarjeta_credito', name: 'Pago tarjeta de crédito', icon: 'CreditCard', color: 'text-coral' },
  buffer: { id: 'buffer', name: 'Buffer / imprevistos', icon: 'ShieldAlert', color: 'text-gold' },
  otro: { id: 'otro', name: 'Otro', icon: 'Plus', color: 'text-muted' },
}

const defaultState = {
  hasCompletedOnboarding: false,
  profile: {
    name: 'Santi',
    minThreshold: 5000,
    estimatedIncome: 6500,
    showCarAccountInTotal: false,
  },
  accounts: [
    { id: 'operativa', name: 'Cuenta Operativa', type: 'Checking', balance: 0, status: 'activa' as const, blocked: false, color: 'green' },
    { id: 'carro', name: 'Cuenta Carro', type: 'Savings', balance: 0, status: 'bloqueada' as const, blocked: true, color: 'gold' },
  ],
  budgets: [],
  recurringExpenses: [],
  availableToday: 0,
  monthlySpend: 0,
  monthlyBudget: 0,
  runwayDays: 0,
  monthlyIncome: 0,
  goals: [],
  clients: [],
  transactions: []
}

const santiDefaults = {
  profile: {
    name: 'Santi',
    minThreshold: 5000,
    estimatedIncome: 6500,
    showCarAccountInTotal: false,
  },
  accounts: [
    { id: 'operativa', name: 'Cuenta de Ahorros', type: 'Checking', balance: 7073, status: 'activa' as const, blocked: false, color: 'green', note: 'Disponible para gastos y operación. Ya descontó pago de tarjeta de crédito.' },
    { id: 'carro', name: 'Cuenta Carro', type: 'Savings', balance: 6764, status: 'bloqueada' as const, blocked: true, color: 'gold', note: 'Bloqueada. Exclusiva para compra del carro. No aparece en el total disponible del dashboard.' },
  ],
  budgets: [
    { categoryId: 'seguro_carro' as CategoryId, amount: 250 },
    { categoryId: 'servicios' as CategoryId, amount: 200 },
    { categoryId: 'mercado' as CategoryId, amount: 200 },
    { categoryId: 'gasolina' as CategoryId, amount: 100 },
    { categoryId: 'ocio' as CategoryId, amount: 100 },
    { categoryId: 'buffer' as CategoryId, amount: 100 },
  ],
  recurringExpenses: [
    { id: 're_1', title: 'Seguro carro', amount: 250 },
    { id: 're_2', title: 'Servicios/utilities', amount: 200 },
    { id: 're_3', title: 'Mercado', amount: 200 },
    { id: 're_4', title: 'Gasolina', amount: 100 },
    { id: 're_5', title: 'Salidas/ocio', amount: 100 },
    { id: 're_6', title: 'Buffer / imprevistos', amount: 100 },
  ],
  availableToday: 7073,
  monthlySpend: 25, // Only Mercado counts for this month's daily operating spend initially
  monthlyBudget: 850,
  runwayDays: 249, // 7073 / (850 / 30)
  monthlyIncome: 6500,
  goals: [
    { id: '1', title: 'Conseguir trabajo part-time', target: 'banco/finanzas', category: 'Trabajo' as GoalCategory, progress: 0, status: 'Por hacer' as GoalStatus, deadline: '2026-10-01', subtasks: [{ id: 's1', title: 'Actualizar CV', completed: false }, { id: 's2', title: 'Aplicar a 5 bancos', completed: false }] },
    { id: '2', title: '1 cliente AddNexo pago', target: 'MRR', category: 'Adstrategic' as GoalCategory, progress: 0, status: 'Por hacer' as GoalStatus, deadline: '2026-12-01', subtasks: [{ id: 's1', title: 'Prospectar 10 leads', completed: false }] },
    { id: '3', title: '3 clientes web Adstrategic', target: '$97/mes', category: 'Adstrategic' as GoalCategory, progress: 0, status: 'Por hacer' as GoalStatus, deadline: '2026-12-01', subtasks: [{ id: 's1', title: 'Cerrar cliente 1', completed: false }, { id: 's2', title: 'Cerrar cliente 2', completed: false }] },
    { id: '4', title: '5 operadores valet ADDSPOT', target: 'contactados', category: 'Adstrategic' as GoalCategory, progress: 0, status: 'Por hacer' as GoalStatus, deadline: '2026-10-31', subtasks: [{ id: 's1', title: 'Llamar a 2 operadores', completed: false }] },
    { id: '5', title: 'Prototipo ADDSPOT funcional', target: 'MVP', category: 'Adstrategic' as GoalCategory, progress: 0, status: 'Por hacer' as GoalStatus, deadline: '2026-12-01', subtasks: [{ id: 's1', title: 'Diseño UI', completed: false }] },
    { id: '6', title: 'Pasar MAC 1105 (A o B)', target: 'MDC', category: 'Académico' as GoalCategory, progress: 0, status: 'Por hacer' as GoalStatus, deadline: '2026-12-15', subtasks: [{ id: 's1', title: 'Midterm', completed: false }] },
    { id: '7', title: 'Pasar COP 1334 (A o B)', target: 'MDC', category: 'Académico' as GoalCategory, progress: 0, status: 'Por hacer' as GoalStatus, deadline: '2026-12-15', subtasks: [{ id: 's1', title: 'Midterm', completed: false }] },
  ],
  clients: [
    { id: 'c1', name: 'Miami Valet Co', product: 'ADDSPOT', lastContact: '2026-08-25', potentialAmount: 500, stage: 'Contactado' as ClientStage },
    { id: 'c2', name: 'AutoRepair LLC', product: 'AddNexo', lastContact: '2026-08-28', potentialAmount: 299, stage: 'Demo dada' as ClientStage },
    { id: 'c3', name: 'Dental Care Miami', product: 'Web', lastContact: '2026-08-29', potentialAmount: 97, stage: 'Negociando' as ClientStage },
  ],
  transactions: [
    { id: 'txn_001', date: '2026-08-21T12:00:00.000Z', amount: 0, description: '💳 Pago tarjeta de crédito', type: 'expense' as const, categoryId: 'tarjeta_credito' as CategoryId, accountId: 'operativa', note: 'Pago agosto 2026' },
    { id: 'txn_002', date: '2026-08-22T14:30:00.000Z', amount: 25, description: '🛒 Mercado', type: 'expense' as const, categoryId: 'mercado' as CategoryId, accountId: 'operativa', note: 'Huevos y leche' },
    { id: 'txn_003', date: '2026-08-24T09:15:00.000Z', amount: 4400, description: '📚 Tuition MDC — Fall 2026', type: 'expense' as const, categoryId: 'educacion' as CategoryId, accountId: 'operativa', note: '5 clases: MAC 1105, COP 1334, ENC 1101, AMH 2020 (drop), SLS 1106' },
  ],
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      ...defaultState,

      completeOnboarding: (useDefaults?: boolean) => {
        if (useDefaults) {
          set({ ...santiDefaults, hasCompletedOnboarding: true })
        } else {
          set({ hasCompletedOnboarding: true })
        }
      },

      updateProfile: (profile) => set((state) => ({ profile: { ...state.profile, ...profile } })),

      addTransaction: (tx) => set((state) => {
        const newTx = { ...tx, id: Math.random().toString(36).substr(2, 9) }
        const updatedAccounts = state.accounts.map(acc => {
          if (acc.id === tx.accountId) {
            return { ...acc, balance: tx.type === 'income' ? acc.balance + tx.amount : acc.balance - tx.amount }
          }
          return acc
        })
        const newAvailableToday = updatedAccounts.filter(a => !a.blocked).reduce((acc, a) => acc + a.balance, 0)

        const excludedFromMonthly = ['educacion', 'tarjeta_credito']
        const newMonthlySpend = (tx.type === 'expense' && !excludedFromMonthly.includes(tx.categoryId)) 
            ? state.monthlySpend + tx.amount 
            : state.monthlySpend

        return {
          transactions: [newTx, ...state.transactions].slice(0, 100),
          accounts: updatedAccounts,
          monthlySpend: newMonthlySpend,
          monthlyIncome: tx.type === 'income' ? state.monthlyIncome + tx.amount : state.monthlyIncome,
          availableToday: newAvailableToday,
        }
      }),
      
      updateGoalProgress: (id, progress) => set((state) => ({
        goals: state.goals.map(g => {
          if (g.id === id) {
            let status = g.status
            if (progress === 100) status = 'Completado'
            else if (progress > 0) status = 'En progreso'
            else status = 'Por hacer'
            return { ...g, progress, status }
          }
          return g
        })
      })),

      updateGoalSubtask: (goalId, subtaskId, completed) => set((state) => ({
        goals: state.goals.map(g => g.id === goalId ? {
          ...g,
          subtasks: g.subtasks.map(s => s.id === subtaskId ? { ...s, completed } : s)
        } : g)
      })),

      moveClientStage: (clientId, newStage) => {
        const state = get()
        const client = state.clients.find(c => c.id === clientId)
        if (!client) return

        if (newStage === 'Cliente' && client.stage !== 'Cliente') {
          state.addTransaction({
            date: new Date().toISOString(),
            amount: client.potentialAmount,
            description: `Nuevo cliente: ${client.name} (${client.product})`,
            type: 'income',
            categoryId: 'adstrategic',
            accountId: 'acc_1'
          })
        }

        set((state) => ({
          clients: state.clients.map(c => c.id === clientId ? { ...c, stage: newStage, lastContact: new Date().toISOString().split('T')[0] } : c)
        }))
      },

      addRecurringExpense: (expense) => set((state) => ({
        recurringExpenses: [...state.recurringExpenses, { ...expense, id: Math.random().toString(36).substr(2, 9) }]
      })),

      removeRecurringExpense: (id) => set((state) => ({
        recurringExpenses: state.recurringExpenses.filter(e => e.id !== id)
      })),
      
      updateRecurringExpense: (id, title, amount) => set((state) => ({
        recurringExpenses: state.recurringExpenses.map(e => e.id === id ? { ...e, title, amount } : e)
      })),

      importData: (data) => set({ ...data }),
      
      resetData: () => set({ ...defaultState })
    }),
    {
      name: 'santi-os-storage-v3',
    }
  )
)
