import { useState } from 'react'
import { useStore, getMonthlySpent, CATEGORIES } from '../store/useStore'

export function Finanzas() {
  const store = useStore()
  const spentMap = getMonthlySpent(store)

  const inc = (store.transactions || []).filter(t => t.type === 'income' && !t.hidden).reduce((a, t) => a + (t.amount || 0), 0)
  const exp = (store.transactions || []).filter(t => t.type === 'expense' && !t.hidden).reduce((a, t) => a + (t.amount || 0), 0)

  const [filterCat, setFilterCat] = useState('')

  const handleEditBudget = (key: string) => {
    const current = store.budget[key]
    const val = prompt(`Nuevo presupuesto para "${current.label}":`, current.amount.toString())
    if (val === null) return
    const num = parseFloat(val)
    if (isNaN(num) || num < 0) return alert('Valor inválido')
    store.updateBudget(key, num)
  }

  let txns = (store.transactions || []).filter(t => !t.hidden)
  if (filterCat) txns = txns.filter(t => t.cat === filterCat)

  return (
    <div className="animate-in fade-in duration-300">
      
      {/* HEADER */}
      <div className="sticky top-0 bg-[var(--bg)] z-50 border-b border-[var(--border)] pt-5 px-4 pb-3">
        <div className="text-[18px] font-bold text-[var(--text)]">Finanzas</div>
        <div className="text-[12px] text-[var(--muted)] font-mono mt-0.5">Ingresos ${inc.toLocaleString()} · Gastos ${exp.toLocaleString()}</div>
      </div>

      <div className="p-4 flex flex-col gap-3">
        
        {/* BUDGET CATEGORIES */}
        <div className="section-label mt-1">Presupuesto mensual</div>
        <div className="card">
          <div className="card-body flex flex-col px-4 pt-1 pb-1">
            {Object.entries(store.budget).map(([k, v]) => {
              const s = spentMap[k] || 0
              const p = Math.min(100, (s / v.amount) * 100)
              const c = p < 70 ? 'green' : p < 90 ? 'gold' : 'red'
              const left = Math.max(0, v.amount - s)
              
              return (
                <div key={k} className="py-3 border-b border-[var(--border)] last:border-none">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[13px] font-medium flex items-center gap-1.5">
                      {v.label} <span className="text-[11px] text-[var(--muted)] font-mono ml-1">${s}/${v.amount}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`font-mono text-[11px] ${left > 0 ? 'text-[var(--green)]' : 'text-[var(--red)]'}`}>
                        {left > 0 ? `Quedan $${left}` : 'Excedido'}
                      </span>
                      <button 
                        className="text-[12px] text-[var(--muted)] bg-transparent hover:bg-[var(--bg3)] hover:text-[var(--text)] px-1.5 py-0.5 rounded transition-colors"
                        onClick={() => handleEditBudget(k)}
                      >
                        ✏
                      </button>
                    </div>
                  </div>
                  <div className="progress-track">
                    <div className={`progress-fill ${c}`} style={{ width: `${p}%` }}></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* TRANSACTIONS */}
        <div className="flex items-center justify-between px-1 mt-3">
          <div className="section-label !px-0 !mt-0">Transacciones</div>
          <select 
            className="input !py-1.5 !px-2.5 !text-[12px] !w-auto !font-mono"
            value={filterCat}
            onChange={e => setFilterCat(e.target.value)}
          >
            <option value="">Todas</option>
            {CATEGORIES.map(c => (
              <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
            ))}
          </select>
        </div>

        <div className="card">
          <div className="card-body px-0 py-2">
            {!txns.length ? (
              <div className="empty-state">
                <div className="text-[40px] mb-3 opacity-50">💳</div>
                <div className="text-[14px] font-semibold text-[var(--text)] mb-1.5">Sin transacciones</div>
                <div className="text-[12px] leading-[1.5]">Filtra por otra categoría o agrega una nueva</div>
              </div>
            ) : (
              <div className="px-4">
                <div className="font-mono text-[11px] text-[var(--muted)] pb-2.5 border-b border-[var(--border)] mb-1">
                  {txns.length} transacciones
                </div>
                {txns.map(t => {
                  const c = CATEGORIES.find(x => x.id === t.cat) || CATEGORIES[CATEGORIES.length - 1]
                  const isExp = t.type === 'expense'
                  return (
                    <div key={t.id} className="list-item group">
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

      </div>
    </div>
  )
}
