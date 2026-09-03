import { useEffect, useState } from 'react'
import { useStore, getMonthlySpent, getTotalBudget, getTotalSpentMonth, CATEGORIES } from '../store/useStore'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export function Dashboard() {
  const store = useStore()
  const { accounts, budget, config } = store

  const today = new Date()
  const dateStr = format(today, "EEEE, d 'de' MMMM yyyy", { locale: es })
  const monthStr = format(today, "MMM yyyy", { locale: es })

  const monthly = getTotalBudget(store)
  const spentMap = getMonthlySpent(store)
  const totSpent = getTotalSpentMonth(store)
  
  const runwayDays = Math.floor((accounts.operativa.balance / monthly) * 30) || 0
  const runwayColor = runwayDays > 90 ? 'green' : runwayDays > 60 ? 'gold' : 'red'

  const [incomeVal, setIncomeVal] = useState(0)

  // Quick Add
  const [quickType, setQuickType] = useState<'expense' | 'income'>('expense')
  const [quickAmount, setQuickAmount] = useState('')
  const [quickCat, setQuickCat] = useState('')
  const [quickNote, setQuickNote] = useState('')

  const handleQuickAdd = () => {
    const amt = parseFloat(quickAmount)
    if (isNaN(amt) || amt <= 0) return alert('Monto inválido')
    
    store.addTransaction({
      id: 'id_' + Date.now(),
      date: today.toISOString().split('T')[0],
      type: quickType,
      cat: quickCat || 'otro',
      label: quickCat ? quickCat : 'Otro',
      amount: amt,
      note: quickNote
    })
    
    setQuickAmount('')
    setQuickNote('')
    setQuickCat('')
  }

  // Edit Balance Modal
  const [isEditBalanceOpen, setIsEditBalanceOpen] = useState(false)
  const [editingAcct, setEditingAcct] = useState<any>(null)
  const [newBalance, setNewBalance] = useState('')

  return (
    <div className="animate-in fade-in duration-300">
      
      {/* HEADER */}
      <div className="sticky top-0 bg-[var(--bg)] z-50 border-b border-[var(--border)] pt-5 px-4 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[18px] font-bold text-[var(--text)]">Buenos días, Santi 👋</div>
            <div className="text-[12px] text-[var(--muted)] font-mono mt-0.5 capitalize">{dateStr}</div>
          </div>
          <div className={`chip ${runwayColor}`}>
            {runwayDays} días
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3">
        
        {/* ACCOUNTS */}
        <div className="section-label">Cuentas</div>
        <div className="card !bg-gradient-to-br from-[#1a2d1a] to-[#0d1f0d] !border-[var(--green-b)] relative overflow-hidden p-[18px]">
          <div className="absolute -top-[30px] -right-[30px] w-[100px] h-[100px] rounded-full bg-[var(--green)] opacity-[0.08]" />
          <div className="flex items-center justify-between text-[11px] font-semibold text-[var(--muted)] uppercase tracking-[0.08em] font-mono mb-2">
            Disponible
            <button 
              onClick={() => { setEditingAcct('operativa'); setNewBalance(accounts.operativa.balance.toString()); setIsEditBalanceOpen(true) }}
              className="btn-ghost btn btn-sm z-10"
            >
              Editar
            </button>
          </div>
          <div className="text-[28px] font-bold tracking-tight leading-none mb-1.5 text-[var(--green)]">
            ${accounts.operativa.balance.toLocaleString()}
          </div>
          <div className="text-[11px] text-[var(--muted)] font-mono">{accounts.operativa.name}</div>
        </div>
        
        <div className="grid grid-cols-2 gap-2.5">
          <div className="card !bg-gradient-to-br from-[#2d2a1a] to-[#1f1c0d] !border-[var(--gold-b)] relative overflow-hidden p-[18px]">
            <div className="absolute -top-[30px] -right-[30px] w-[100px] h-[100px] rounded-full bg-[var(--gold)] opacity-[0.08]" />
            <div className="text-[11px] font-semibold text-[var(--muted)] uppercase tracking-[0.08em] font-mono mb-2">🔒 Carro</div>
            <div className="text-[22px] font-bold tracking-tight leading-none mb-1.5 text-[var(--gold)]">
              ${accounts.carro.balance.toLocaleString()}
            </div>
            <div className="text-[11px] text-[var(--muted)] font-mono">{accounts.carro.name}</div>
          </div>
          <div className="card !bg-gradient-to-br from-[#1a1a2d] to-[#0d0d1f] !border-[var(--purple-b)] relative overflow-hidden p-[18px]">
            <div className="absolute -top-[30px] -right-[30px] w-[100px] h-[100px] rounded-full bg-[var(--purple)] opacity-[0.08]" />
            <div className="text-[11px] font-semibold text-[var(--muted)] uppercase tracking-[0.08em] font-mono mb-2">📈 Inversiones</div>
            <div className="text-[22px] font-bold tracking-tight leading-none mb-1.5 text-[var(--purple)]">
              ${accounts.invest.balance.toLocaleString()}
            </div>
            <div className="text-[11px] text-[var(--muted)] font-mono">{accounts.invest.name}</div>
          </div>
        </div>

        {/* ALLOCATION */}
        <div className="card mt-1">
          <div className="card-header">
            <div className="card-title">Distribución de los ${accounts.operativa.balance + accounts.invest.balance}</div>
          </div>
          <div className="card-body flex flex-col">
            {/* Hardcoded visualization from HTML logic */}
            <div className="flex items-center gap-2.5 py-2.5 border-b border-[var(--border)]">
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--green)] shrink-0"></div>
              <div className="text-[13px] font-medium flex-1">Líquido disponible</div>
              <div className="font-mono text-[13px] font-semibold text-[var(--green)]">${accounts.operativa.balance.toLocaleString()}</div>
            </div>
            <div className="flex items-center gap-2.5 py-2.5 border-b border-[var(--border)]">
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--purple)] shrink-0"></div>
              <div className="text-[13px] font-medium flex-1">Inversiones</div>
              <div className="font-mono text-[13px] font-semibold text-[var(--purple)]">${accounts.invest.balance.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* PRESUPUESTO MES */}
        <div className="card mt-1">
          <div className="card-header">
            <div className="card-title">Presupuesto — <span className="capitalize">{monthStr}</span></div>
          </div>
          <div className="card-body">
            <div className="progress-wrap">
              <div className="progress-track !h-2">
                <div className={`progress-fill ${totSpent / monthly * 100 > 90 ? 'red' : 'green'}`} style={{ width: `${Math.min(100, (totSpent / monthly) * 100)}%` }}></div>
              </div>
              <div className="flex justify-between text-[11px] text-[var(--muted)] mt-1.5 font-mono">
                <span>Gastado ${totSpent}</span>
                <span>Presupuesto ${monthly}</span>
              </div>
            </div>
            
            <div className="mt-2.5 flex flex-col gap-1.5">
              {Object.entries(budget).map(([k, v]) => {
                const s = spentMap[k] || 0
                const p = Math.min(100, (s / v.amount) * 100)
                const c = p < 70 ? 'green' : p < 90 ? 'gold' : 'red'
                return (
                  <div key={k} className="flex items-center gap-2">
                    <span className="text-[11px] text-[var(--muted)] w-20 font-mono truncate">{v.label.slice(3)}</span>
                    <div className="flex-1">
                      <div className="progress-track">
                        <div className={`progress-fill ${c}`} style={{ width: `${p}%` }}></div>
                      </div>
                    </div>
                    <span className="font-mono text-[11px] text-[var(--muted)] w-[70px] text-right">${s} / ${v.amount}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* RUNWAY PROYECTADO */}
        <div className="card mt-1">
          <div className="card-header">
            <div className="card-title">Runway proyectado</div>
          </div>
          <div className="pt-3">
            <div className="flex items-end gap-1 h-20 px-4">
              {[0, 1, 2, 3, 4, 5].map(i => {
                const d = new Date()
                d.setMonth(d.getMonth() + i)
                const isRent = d >= new Date(config.rentStart)
                let b = accounts.operativa.balance - (monthly * i) - (isRent ? config.rentAmt * i : 0) + (incomeVal * i)
                b = Math.max(0, b)
                const h = Math.max(4, (b / Math.max(accounts.operativa.balance, 1)) * 72)
                const color = b < config.minBalance ? 'var(--red)' : b < config.warnBalance ? 'var(--gold)' : 'var(--green)'
                
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full group">
                    <div 
                      className="w-full rounded-t relative transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]" 
                      style={{ height: h, background: color, opacity: 0.8 }}
                    >
                      <div className="absolute bottom-[calc(100%+6px)] left-1/2 -translate-x-1/2 bg-[var(--bg4)] border border-[var(--border2)] rounded-[var(--r-sm)] px-2 py-1 text-[11px] whitespace-nowrap font-mono opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        {format(d, 'MMM', { locale: es })}: ${b.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-[9px] text-[var(--muted)] font-mono text-center capitalize">
                      {format(d, 'MMM', { locale: es })} {isRent ? '🏠' : ''}
                    </div>
                  </div>
                )
              })}
            </div>
            
            <div className="flex gap-2 px-4 py-2 flex-wrap">
              <div className="flex items-center gap-1 text-[10px] text-[var(--muted)] font-mono"><div className="w-2 h-2 rounded-[2px] shrink-0 bg-[var(--green)]"></div> Seguro ({`>`}${config.warnBalance})</div>
              <div className="flex items-center gap-1 text-[10px] text-[var(--muted)] font-mono"><div className="w-2 h-2 rounded-[2px] shrink-0 bg-[var(--gold)]"></div> Cuidado ({`<`}${config.warnBalance})</div>
              <div className="flex items-center gap-1 text-[10px] text-[var(--muted)] font-mono"><div className="w-2 h-2 rounded-[2px] shrink-0 bg-[var(--red)]"></div> Crítico ({`<`}${config.minBalance})</div>
            </div>
          </div>
          <div className="card-body pt-2">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs">
                <span className="text-[var(--muted)]">Ingreso mensual estimado</span>
                <span className="font-mono font-semibold text-[var(--green)]">${incomeVal}</span>
              </div>
              <input 
                type="range" 
                min="0" max="2000" step="50" 
                value={incomeVal}
                onChange={e => setIncomeVal(Number(e.target.value))}
                className="w-full h-1 bg-[var(--bg4)] rounded-full appearance-none cursor-pointer outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--green)] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[var(--bg2)] [&::-webkit-slider-thumb]:shadow-[0_0_0_2px_var(--green-b)] hover:[&::-webkit-slider-thumb]:scale-110 transition-transform"
              />
            </div>
          </div>
        </div>

        {/* QUICK ADD */}
        <div className="card mt-1 !border-[var(--green-b)]">
          <div className="card-header">
            <div className="card-title">Registrar rápido</div>
          </div>
          <div className="card-body">
            <div className="flex gap-2 mb-2.5">
              <div className="toggle-group flex-1">
                <div className={`toggle-opt expense ${quickType === 'expense' ? 'active' : ''}`} onClick={() => setQuickType('expense')}>Gasto</div>
                <div className={`toggle-opt income ${quickType === 'income' ? 'active' : ''}`} onClick={() => setQuickType('income')}>Ingreso</div>
              </div>
            </div>
            <input 
              type="number" 
              className="input input-mono mb-2.5 text-[22px] font-bold text-center h-[54px]" 
              placeholder="$0.00" 
              value={quickAmount}
              onChange={e => setQuickAmount(e.target.value)}
            />
            <div className="grid grid-cols-4 gap-1.5">
              {CATEGORIES.filter(c => quickType === 'expense' ? true : ['trabajo', 'adstrategic', 'otro'].includes(c.id)).map(c => (
                <div 
                  key={c.id} 
                  className={`flex flex-col items-center gap-1 p-2.5 rounded-[var(--r-md)] border bg-[var(--bg3)] cursor-pointer text-[10px] transition-all hover:border-[var(--border2)] hover:text-[var(--text)] ${
                    quickCat === c.id ? '!border-[var(--green-b)] !bg-[var(--green-bg)] !text-[var(--green)]' : 'border-[var(--border)] text-[var(--muted)]'
                  }`}
                  onClick={() => setQuickCat(c.id)}
                >
                  <span className="text-[20px]">{c.icon}</span>
                  <span className="truncate w-full text-center">{c.label}</span>
                </div>
              ))}
            </div>
            <input 
              type="text" 
              className="input mt-2.5" 
              placeholder="Nota (opcional)" 
              value={quickNote}
              onChange={e => setQuickNote(e.target.value)}
            />
            <button className="btn btn-primary btn-full mt-3" onClick={handleQuickAdd}>
              ✓ Registrar
            </button>
          </div>
        </div>

        {/* ÚLTIMAS TRANSACCIONES */}
        <div className="card mt-1">
          <div className="card-header">
            <div className="card-title">Últimas transacciones</div>
            <button className="btn-ghost btn btn-sm">Ver todas</button>
          </div>
          <div className="card-body px-0 pb-0">
            {(store.transactions || []).filter(t => !t.hidden).slice(0, 5).length === 0 ? (
              <div className="empty-state">
                <div className="text-[40px] mb-3 opacity-50">📋</div>
                <div className="text-[14px] font-semibold text-[var(--text)] mb-1.5">Sin transacciones</div>
                <div className="text-[12px] leading-[1.5]">Registra tu primer gasto abajo</div>
              </div>
            ) : (
              <div>
                {(store.transactions || []).filter(t => !t.hidden).slice(0, 5).map(t => {
                  const c = CATEGORIES.find(x => x.id === t.cat) || CATEGORIES[CATEGORIES.length - 1]
                  const isExp = t.type === 'expense'
                  return (
                    <div key={t.id} className="list-item group px-4">
                      <div className="list-icon" style={{ background: `${c.color}22` }}>{c.icon}</div>
                      <div className="list-info">
                        <div className="list-name truncate">{t.label || c.label}{t.note ? ` · ${t.note}` : ''}</div>
                        <div className="list-sub">{t.date} · <span className={`chip ${isExp ? 'red' : 'green'} !py-px !px-1.5 !text-[10px]`}>{isExp ? 'Gasto' : 'Ingreso'}</span></div>
                      </div>
                      <div>
                        <div className={`list-amount ${t.hidden ? 'text-[var(--muted)]' : isExp ? 'text-[var(--red)]' : 'text-[var(--green)]'}`}>
                          {t.hidden ? '—' : (isExp ? '-' : '+') + (t.amount ? `$${t.amount.toLocaleString()}` : '?')}
                        </div>
                        <div className="list-actions mt-1 justify-end hidden">
                          <button className="btn btn-ghost btn-sm !px-1.5 !py-0.5">✏</button>
                          <button className="btn btn-danger btn-sm !px-1.5 !py-0.5" onClick={() => store.deleteTransaction(t.id)}>✕</button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* METAS RÁPIDAS */}
        <div className="card mt-1">
          <div className="card-header">
            <div className="card-title">Metas urgentes</div>
            <button className="btn-ghost btn btn-sm">Ver todas</button>
          </div>
          <div className="card-body px-0 pb-0">
            {(() => {
              const urgent = (store.goals || []).filter(g => !g.done).sort((a,b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()).slice(0, 3)
              if (!urgent.length) return <div className="text-[var(--muted)] text-sm px-4 pb-4">Todas las metas completadas 🎉</div>
              
              return (
                <div>
                  {urgent.map(g => {
                    const now = new Date(); now.setHours(0,0,0,0);
                    const target = new Date(g.deadline); target.setHours(0,0,0,0);
                    const days = Math.ceil((target.getTime() - now.getTime()) / 86400000)
                    const dayColor = days < 7 ? 'text-[var(--red)]' : days < 30 ? 'text-[var(--gold)]' : 'text-[var(--muted)]'
                    const c = CATEGORIES.find(x => x.id === g.cat) || { icon: '⭐' }
                    
                    return (
                      <div key={g.id} className="list-item px-4">
                        <div className="list-icon bg-[var(--bg3)]">{c.icon}</div>
                        <div className="list-info">
                          <div className="list-name truncate">{g.title}</div>
                          <div className={`list-sub ${dayColor}`}>{days < 0 ? '⚠ Vencida' : days === 0 ? 'Hoy' : `${days} días`}</div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className={`font-mono text-[12px] font-bold ${g.progress >= 100 ? 'text-[var(--green)]' : 'text-[var(--muted)]'}`}>{g.progress}%</span>
                          <div className="w-[60px]">
                            <div className="progress-track !h-1">
                              <div className={`progress-fill ${g.progress >= 100 ? 'green' : g.progress > 50 ? 'blue' : 'muted'}`} style={{ width: `${g.progress}%` }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })()}
          </div>
        </div>

      </div>

      {/* MODAL EDIT BALANCE */}
      {isEditBalanceOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center p-4">
          <div className="bg-[var(--bg2)] border border-[var(--border2)] rounded-[var(--r-xl)] p-5 w-full max-w-[440px] mx-auto flex flex-col gap-4 animate-in slide-in-from-bottom-10">
            <div className="flex items-center justify-between">
              <div className="text-[16px] font-bold">Editar saldo</div>
              <button onClick={() => setIsEditBalanceOpen(false)} className="w-8 h-8 rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--bg3)] text-[var(--muted)] flex items-center justify-center hover:text-[var(--text)] hover:border-[var(--border2)] transition-colors">×</button>
            </div>
            <div className="input-wrap">
              <div className="input-label">Nuevo saldo</div>
              <input 
                type="number" 
                className="input input-mono text-[24px] font-bold text-center" 
                value={newBalance}
                onChange={e => setNewBalance(e.target.value)}
              />
            </div>
            <div className="flex gap-2.5 mt-2">
              <button className="btn btn-secondary flex-1" onClick={() => setIsEditBalanceOpen(false)}>Cancelar</button>
              <button className="btn btn-primary flex-[2]" onClick={() => {
                store.updateAccountBalance(editingAcct, Number(newBalance))
                setIsEditBalanceOpen(false)
              }}>Actualizar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
