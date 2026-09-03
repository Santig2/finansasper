import { useState } from 'react'
import { useStore, getTotalBudget } from '../store/useStore'

export function Calcular() {
  const store = useStore()
  
  const [calcAmount, setCalcAmount] = useState('')
  const [calcFreq, setCalcFreq] = useState<'once' | 'monthly' | 'yearly'>('once')

  const raw = parseFloat(calcAmount) || 0
  let effective = raw
  if (calcFreq === 'yearly') effective = raw / 12

  const bal = store.accounts.operativa.balance
  const monthly = getTotalBudget(store)
  const saldoPost = bal - raw
  const pctBudget = (effective / monthly) * 100

  let verdict = null
  if (raw > 0) {
    if (saldoPost < store.config.minBalance) {
      verdict = { emoji: '🚨', cls: 'red', title: 'No recomendado', desc: `Quedarías con $${saldoPost.toLocaleString()}, por debajo de tu mínimo de $${store.config.minBalance.toLocaleString()}.` }
    } else if (saldoPost < store.config.warnBalance || pctBudget > 30) {
      verdict = { emoji: '⚠️', cls: 'gold', title: 'Con cuidado', desc: `Representa el ${pctBudget.toFixed(0)}% de tu presupuesto mensual. Quedarías con $${saldoPost.toLocaleString()}.` }
    } else {
      verdict = { emoji: '✅', cls: 'green', title: 'Sí puedes', desc: `Tienes margen. Quedarías con $${saldoPost.toLocaleString()} disponibles.` }
    }
  }

  const runwayBefore = Math.floor((bal / monthly) * 30) || 0
  const runwayAfter = Math.floor((saldoPost / monthly) * 30) || 0

  return (
    <div className="animate-in fade-in duration-300">
      
      {/* HEADER */}
      <div className="sticky top-0 bg-[var(--bg)] z-50 border-b border-[var(--border)] pt-5 px-4 pb-3">
        <div className="text-[18px] font-bold text-[var(--text)]">¿Puedo gastar esto?</div>
        <div className="text-[12px] text-[var(--muted)] font-mono mt-0.5">Calculadora de decisiones</div>
      </div>

      <div className="p-4 flex flex-col gap-4">
        
        <div className="card">
          <div className="card-body">
            <div className="input-wrap">
              <div className="input-label">¿Cuánto quieres gastar?</div>
              <input 
                type="number" 
                className="input input-mono text-[32px] font-bold text-center !p-[18px]" 
                placeholder="$0" 
                value={calcAmount}
                onChange={e => setCalcAmount(e.target.value)}
              />
            </div>
            
            <div className="input-wrap mt-[22px]">
              <div className="input-label mb-1">Frecuencia</div>
              <div className="toggle-group">
                <div className={`toggle-opt ${calcFreq === 'once' ? 'active' : ''}`} onClick={() => setCalcFreq('once')}>Único</div>
                <div className={`toggle-opt ${calcFreq === 'monthly' ? 'active' : ''}`} onClick={() => setCalcFreq('monthly')}>Mensual</div>
                <div className={`toggle-opt ${calcFreq === 'yearly' ? 'active' : ''}`} onClick={() => setCalcFreq('yearly')}>Anual</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          {verdict ? (
            <div className={`rounded-[var(--r-xl)] p-6 text-center transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] bg-[var(--${verdict.cls}-bg)] border-2 border-[var(--${verdict.cls}-b)]`}>
              <div className="text-[48px] leading-none mb-2.5">{verdict.emoji}</div>
              <div className="text-[22px] font-bold mb-1.5 text-[var(--text)]">{verdict.title}</div>
              <div className="text-[13px] text-[var(--muted)] leading-relaxed max-w-[260px] mx-auto">{verdict.desc}</div>
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--r-md)] py-2.5 px-2 text-center">
                  <div className="font-mono text-[14px] font-bold text-[var(--text)]">{pctBudget.toFixed(0)}%</div>
                  <div className="text-[10px] text-[var(--muted)] mt-0.5">del presupuesto</div>
                </div>
                <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--r-md)] py-2.5 px-2 text-center">
                  <div className="font-mono text-[14px] font-bold text-[var(--text)]">${saldoPost.toLocaleString()}</div>
                  <div className="text-[10px] text-[var(--muted)] mt-0.5">saldo post-gasto</div>
                </div>
                <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--r-md)] py-2.5 px-2 text-center">
                  <div className="font-mono text-[14px] font-bold text-[var(--text)]">{runwayBefore - runwayAfter}d</div>
                  <div className="text-[10px] text-[var(--muted)] mt-0.5">días de runway</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-[var(--r-xl)] p-6 text-center transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] bg-[var(--bg3)] border-2 border-[var(--border)]">
              <div className="text-[48px] leading-none mb-2.5">🧮</div>
              <div className="text-[22px] font-bold mb-1.5 text-[var(--text)]">Ingresa un monto</div>
              <div className="text-[13px] text-[var(--muted)] leading-relaxed max-w-[260px] mx-auto">El veredicto aparece automáticamente mientras escribes</div>
            </div>
          )}
        </div>

        {/* QUICK SCENARIOS */}
        <div className="section-label mt-1">Escenarios rápidos</div>
        <div className="grid grid-cols-2 gap-2">
          <button className="btn btn-secondary" onClick={() => { setCalcAmount('50'); setCalcFreq('once') }}>$50 — salida</button>
          <button className="btn btn-secondary" onClick={() => { setCalcAmount('100'); setCalcFreq('once') }}>$100 — mercado</button>
          <button className="btn btn-secondary" onClick={() => { setCalcAmount('250'); setCalcFreq('once') }}>$250 — seguro</button>
          <button className="btn btn-secondary" onClick={() => { setCalcAmount('500'); setCalcFreq('once') }}>$500 — gasto grande</button>
        </div>

        {/* RUNWAY IMPACT */}
        {raw > 0 && (
          <div className="card mt-2 animate-in fade-in">
            <div className="card-header"><div className="card-title">Impacto en tu runway</div></div>
            <div className="card-body">
              <div className="flex items-center gap-2.5 py-2.5 border-b border-[var(--border)]">
                <div className="text-[13px] font-medium flex-1">Runway antes</div>
                <div className="font-mono text-[13px] font-semibold">{runwayBefore} días</div>
              </div>
              <div className="flex items-center gap-2.5 py-2.5 border-b border-[var(--border)]">
                <div className="text-[13px] font-medium flex-1">Runway después</div>
                <div className={`font-mono text-[13px] font-semibold ${runwayAfter < 90 ? 'text-[var(--red)]' : 'text-[var(--green)]'}`}>{Math.max(0, runwayAfter)} días</div>
              </div>
              <div className="flex items-center gap-2.5 pt-2.5 pb-1">
                <div className="text-[13px] font-medium flex-1">% del saldo total</div>
                <div className="font-mono text-[13px] font-semibold">{((raw / bal) * 100).toFixed(1)}%</div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
