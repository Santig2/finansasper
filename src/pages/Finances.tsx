import { useState } from 'react'
import { format } from 'date-fns'
import { useStore, CATEGORIES } from '../store/useStore'
import { TransactionModal } from '../components/Finances/TransactionModal'
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts'
import { Plus, Wallet, ShieldCheck, Lock, ChevronRight, TrendingUp, TrendingDown, Target, Activity } from 'lucide-react'

export function Finances() {
  const { accounts, transactions, budgets, monthlyIncome } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)

  // 2B - Resumen Mensual calculations
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0)
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0)
  const netBalance = totalIncome - totalExpense

  // 2D - Runway Projection Data Logic
  // Generate 12 months of projection data
  const projectionData = []
  let currentBalanceWithoutIncome = accounts[0].balance // Start with operative account
  let currentBalanceWithIncome = accounts[0].balance
  const averageMonthlySpend = 850 // Updated to reflect real monthly operational budget

  for (let i = 0; i < 12; i++) {
    const d = new Date()
    d.setMonth(d.getMonth() + i)
    
    projectionData.push({
      month: format(d, 'MMM yy'),
      isDec: d.getMonth() === 11 && d.getFullYear() === 2026,
      sinIngreso: Math.max(0, currentBalanceWithoutIncome),
      conIngreso: Math.max(0, currentBalanceWithIncome)
    })
    
    currentBalanceWithoutIncome -= averageMonthlySpend
    currentBalanceWithIncome += (monthlyIncome - averageMonthlySpend)
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text">Finanzas Personales</h1>
          <p className="text-muted">Gestión de cuentas, presupuesto y proyecciones.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Registrar
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 2A - Cuentas */}
          <section>
            <h2 className="text-xl mb-4 flex items-center gap-2 text-text font-display">
              <Wallet className="w-5 h-5 text-accent" />
              Cuentas y Saldos
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {accounts.map(acc => (
                <div key={acc.id} className="card p-5 group hover:border-accent/50 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-text">{acc.name}</h3>
                      <p className="text-xs text-muted">{acc.type}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-md text-xs font-medium border flex items-center gap-1
                      ${!acc.blocked ? 'bg-green/10 text-green border-green/20' : 'bg-gold/10 text-gold border-gold/20'}`}>
                      {!acc.blocked ? <ShieldCheck className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                      <span className="capitalize">{!acc.blocked ? 'Activa' : 'Bloqueada'}</span>
                    </div>
                  </div>
                  <p className="text-3xl font-display text-text">{formatCurrency(acc.balance)}</p>
                  {acc.note && <p className="text-xs text-muted mt-3 leading-relaxed border-t border-border2 pt-3">{acc.note}</p>}
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-sm text-muted bg-bg3/50 p-3 rounded-lg border border-border2">
              <span className="font-medium text-text">Total general: {formatCurrency(accounts.reduce((sum, a) => sum + a.balance, 0))}</span>
              {accounts.some(a => a.blocked) && (
                <span> (Incluye {formatCurrency(accounts.filter(a => a.blocked).reduce((sum, a) => sum + a.balance, 0))} en cuentas bloqueadas)</span>
              )}
            </div>
          </section>

          {/* 2C - Presupuesto */}
          <section>
            <h2 className="text-xl mb-4 flex items-center gap-2 text-text font-display">
              <Target className="w-5 h-5 text-teal" />
              Presupuesto Mensual
            </h2>
            <div className="card p-5 space-y-6">
              {budgets.map(budget => {
                const category = CATEGORIES[budget.categoryId]
                // Calculate actual spend for this category
                const spent = transactions
                  .filter(t => t.type === 'expense' && t.categoryId === budget.categoryId)
                  .reduce((acc, t) => acc + t.amount, 0)
                
                const percentage = Math.min((spent / budget.amount) * 100, 100)
                const isWarning = percentage > 70 && percentage <= 90
                const isCritical = percentage > 90

                return (
                  <div key={budget.categoryId} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-text font-medium">{category.name}</span>
                      <div className="font-mono">
                        <span className="text-text">{formatCurrency(spent)}</span>
                        <span className="text-muted"> / {formatCurrency(budget.amount)}</span>
                      </div>
                    </div>
                    <div className="w-full bg-bg3 rounded-full h-2">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${
                          isCritical ? 'bg-coral shadow-[0_0_8px_rgba(251,113,133,0.6)]' : 
                          isWarning ? 'bg-gold shadow-[0_0_8px_rgba(240,180,41,0.6)]' : 
                          'bg-green'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* 2D - Proyección Runway */}
          <section>
            <h2 className="text-xl mb-4 flex items-center gap-2 text-text font-display">
              <Activity className="w-5 h-5 text-accent2" />
              Proyección de Runway
            </h2>
            <div className="card p-5">
              <p className="text-sm text-muted mb-6">
                Con tu gasto actual, tu runway crítico ({"<"}$5k) sin ingresos llegará en aproximadamente 2-3 meses.
              </p>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={projectionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border2)" vertical={false} />
                    <XAxis dataKey="month" stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: 'var(--bg2)', borderColor: 'var(--border2)', borderRadius: '8px' }}
                      itemStyle={{ fontFamily: '"DM Mono", monospace' }}
                    />
                    <ReferenceLine y={5000} stroke="var(--coral)" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Umbral $5k', fill: 'var(--coral)', fontSize: 12 }} />
                    <Line type="monotone" dataKey="sinIngreso" name="Sin Ingreso" stroke="var(--muted)" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="conIngreso" name="Con Ingreso" stroke="var(--accent)" strokeWidth={3} dot={{ fill: 'var(--bg)', stroke: 'var(--accent)', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          
          {/* 2B - Resumen Mensual */}
          <section>
            <h2 className="text-xl mb-4 text-text font-display">Resumen del Mes</h2>
            <div className="card p-5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted flex items-center gap-2"><TrendingUp className="w-4 h-4 text-green"/> Ingresos</span>
                <span className="font-mono text-green">{formatCurrency(totalIncome)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted flex items-center gap-2"><TrendingDown className="w-4 h-4 text-coral"/> Gastos</span>
                <span className="font-mono text-coral">{formatCurrency(totalExpense)}</span>
              </div>
              <div className="pt-4 border-t border-border2 flex justify-between items-center">
                <span className="font-medium text-text">Neto</span>
                <span className={`font-mono text-lg ${netBalance >= 0 ? 'text-text' : 'text-coral'}`}>
                  {netBalance >= 0 ? '+' : ''}{formatCurrency(netBalance)}
                </span>
              </div>
            </div>
          </section>

          {/* 2B - Transacciones */}
          <section>
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-xl text-text font-display">Transacciones</h2>
              <button className="text-sm text-accent hover:text-accent2 transition-colors flex items-center">
                Ver todo <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="card p-0 overflow-hidden divide-y divide-border2">
              {transactions.length === 0 && (
                <div className="p-6 text-center text-muted text-sm">No hay transacciones aún.</div>
              )}
              {transactions.slice(0, 10).map(tx => {
                const category = CATEGORIES[tx.categoryId] || CATEGORIES.otro
                return (
                  <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-bg3/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-bg3 border border-border2 ${category.color}`}>
                        {/* Placeholder logic since iconMap is not imported here, we'll just use a generic icon or rely on the transaction type */}
                        {tx.type === 'income' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-text">{tx.description}</p>
                        <p className="text-xs text-muted flex gap-2">
                          <span>{category.name}</span>
                          <span>•</span>
                          <span className="font-mono">{format(new Date(tx.date), 'MMM d')}</span>
                        </p>
                      </div>
                    </div>
                    <p className={`font-mono text-sm ${tx.type === 'income' ? 'text-green' : 'text-text'}`}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </p>
                  </div>
                )
              })}
            </div>
          </section>

        </div>
      </div>

      <TransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
