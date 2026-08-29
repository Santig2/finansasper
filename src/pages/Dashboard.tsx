import { format } from 'date-fns'
import { useStore } from '../store/useStore'
import { TrendingUp, TrendingDown, AlertTriangle, Calendar, Activity } from 'lucide-react'

export function Dashboard() {
  const {
    availableToday,
    monthlySpend,
    monthlyBudget,
    runwayDays,
    monthlyIncome,
    goals,
    transactions
  } = useStore()

  const today = new Date()
  const hour = today.getHours()
  const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches'
  const dateStr = format(today, 'EEEE, d MMMM yyyy')

  const spendPercentage = (monthlySpend / monthlyBudget) * 100

  // Alert Logic
  let alert = null
  if (runwayDays < 90) {
    alert = { type: 'red', message: 'Alerta Roja: Runway por debajo de 90 días. Revisa gastos inmediatamente.' }
  } else if (spendPercentage > 85) {
    alert = { type: 'yellow', message: 'Alerta Amarilla: Gasto mensual superó el 85% del presupuesto.' }
  } else {
    // Check if any goal is overdue (for demo, just check if we have any overdue mock logic)
    const hasOverdue = goals.some(g => g.deadline && new Date(g.deadline) < today && g.progress < 100)
    if (hasOverdue) {
      alert = { type: 'orange', message: 'Alerta Naranja: Tienes metas vencidas sin completar.' }
    }
  }

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl mb-2 text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent2">Santi OS</h1>
          <p className="text-xl text-text font-medium">{greeting}, Santiago.</p>
        </div>
        <div className="flex items-center text-muted">
          <Calendar className="w-5 h-5 mr-2" />
          <span className="font-mono text-sm uppercase tracking-wider">{dateStr}</span>
        </div>
      </header>

      {/* Weekly Alert */}
      {alert && (
        <div className={`glass-card p-4 flex items-start gap-3 border-l-4 ${
          alert.type === 'red' ? 'border-l-coral bg-coral/10' : 
          alert.type === 'yellow' ? 'border-l-gold bg-gold/10' : 
          'border-l-orange-500 bg-orange-500/10'
        }`}>
          <AlertTriangle className={`w-6 h-6 flex-shrink-0 ${
            alert.type === 'red' ? 'text-coral' : 
            alert.type === 'yellow' ? 'text-gold' : 
            'text-orange-500'
          }`} />
          <div>
            <h3 className="font-semibold text-text">Atención Requerida</h3>
            <p className="text-sm text-muted mt-1">{alert.message}</p>
          </div>
        </div>
      )}

      {/* Financial Snapshot */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-mono text-muted uppercase tracking-wider">Snapshot Financiero</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="card p-5 border-t-2 border-t-accent">
            <p className="text-xs text-muted uppercase font-mono">Disponible Hoy</p>
            <p className="text-3xl font-display font-bold text-text mt-1">{formatCurrency(availableToday)}</p>
            <p className="text-xs text-muted mt-2">Cuenta Operativa</p>
          </div>
          
          <div className="card p-5 border-t-2 border-t-coral">
            <p className="text-xs text-muted uppercase font-mono">Gasto Mensual</p>
            <p className="text-3xl font-display font-bold text-text mt-1">{formatCurrency(monthlySpend)}</p>
            <p className="text-xs text-muted mt-2 flex items-center gap-1">
              <TrendingDown className="w-3 h-3 text-coral" /> de {formatCurrency(monthlyBudget)} ({spendPercentage.toFixed(1)}%)
            </p>
          </div>

          <div className="card p-5 border-t-2 border-t-gold">
            <p className="text-xs text-muted uppercase font-mono">Runway</p>
            <p className="text-3xl font-display font-bold text-text mt-1">{runwayDays} días</p>
            <p className="text-xs text-muted mt-2">Si los ingresos paran hoy</p>
          </div>

          <div className="card p-5 border-t-2 border-t-teal">
            <p className="text-xs text-muted uppercase font-mono">Ingreso Proyectado</p>
            <p className="text-3xl font-display font-bold text-text mt-1">{formatCurrency(monthlyIncome)}</p>
            <p className="text-xs text-muted mt-2">Este mes</p>
          </div>

        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Metas Activas */}
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-mono text-muted uppercase tracking-wider">Metas Activas ({goals.filter(g => g.progress === 100).length}/{goals.length} completadas)</h2>
            <button className="text-xs text-accent hover:text-accent2 transition-colors">Ver todas &rarr;</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {goals.slice(0, 4).map(goal => (
              <div key={goal.id} className="card p-4 flex flex-col gap-3 group hover:border-accent2/50 transition-colors">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-text">{goal.title}</h3>
                  <span className="font-mono text-xs text-accent2 bg-accent2/10 px-2 py-1 rounded">{goal.progress}%</span>
                </div>
                <p className="text-sm text-muted">{goal.target}</p>
                <div className="w-full bg-bg3 rounded-full h-1.5 mt-auto">
                  <div 
                    className="bg-accent2 h-full rounded-full transition-all duration-1000 group-hover:shadow-[0_0_8px_rgba(167,139,250,0.6)]"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <h2 className="text-2xl mb-4 flex items-center gap-2">
            <Activity className="w-6 h-6 text-teal" />
            Actividad
          </h2>
          <div className="card p-0 overflow-hidden">
            <div className="divide-y divide-border2">
              {transactions.slice(0, 5).map(tx => (
                <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-bg3/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${tx.type === 'income' ? 'bg-green/10 text-green' : 'bg-coral/10 text-coral'}`}>
                      {tx.type === 'income' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-text">{tx.description}</p>
                      <p className="text-xs text-muted font-mono">{format(new Date(tx.date), 'MMM d, h:mm a')}</p>
                    </div>
                  </div>
                  <p className={`font-mono text-sm ${tx.type === 'income' ? 'text-green' : 'text-text'}`}>
                    {tx.categoryId === 'tarjeta_credito' ? '' : `${tx.type === 'income' ? '+' : '-'}${formatCurrency(tx.amount)}`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
