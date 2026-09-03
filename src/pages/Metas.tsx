import { useState } from 'react'
import { useStore } from '../store/useStore'

export function Metas() {
  const store = useStore()
  
  const active = (store.goals || []).filter(g => !g.done)
  const done = (store.goals || []).filter(g => g.done)
  
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newCat, setNewCat] = useState('personal')
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0])

  const handleAddGoal = () => {
    if (!newTitle.trim()) return alert('Ingresa un título')
    store.addGoal({
      id: 'g_' + Date.now(),
      title: newTitle,
      cat: newCat,
      deadline: newDate,
      progress: 0,
      done: false
    })
    setNewTitle('')
    setIsAddOpen(false)
  }

  const catIcon: Record<string, string> = { trabajo: '💼', adstrategic: '🏢', academico: '📚', personal: '⭐' }

  return (
    <div className="animate-in fade-in duration-300">
      
      {/* HEADER */}
      <div className="sticky top-0 bg-[var(--bg)] z-50 border-b border-[var(--border)] pt-5 px-4 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[18px] font-bold text-[var(--text)]">Metas</div>
            <div className="text-[12px] text-[var(--muted)] font-mono mt-0.5">{active.length} activas · {done.length} completadas</div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setIsAddOpen(true)}>+ Nueva</button>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-4">
        
        {/* ACTIVE GOALS */}
        <div>
          {active.length === 0 ? (
            <div className="empty-state">
              <div className="text-[40px] mb-3 opacity-50">🎯</div>
              <div className="text-[14px] font-semibold text-[var(--text)] mb-1.5">Sin metas activas</div>
              <div className="text-[12px] leading-[1.5]">Crea tu primera meta</div>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {active.map(g => {
                const now = new Date(); now.setHours(0,0,0,0);
                const target = new Date(g.deadline); target.setHours(0,0,0,0);
                const days = Math.ceil((target.getTime() - now.getTime()) / 86400000)
                const dayColor = days < 7 ? 'text-[var(--red)]' : days < 30 ? 'text-[var(--gold)]' : 'text-[var(--muted)]'
                const pColor = g.progress >= 100 ? 'green' : g.progress > 50 ? 'blue' : 'muted'

                return (
                  <div key={g.id} className="bg-[var(--bg3)] border border-[var(--border)] rounded-[var(--r-lg)] p-3.5 flex flex-col gap-2.5 transition-colors hover:border-[var(--border2)]">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-[13px] font-semibold text-[var(--text)]">{catIcon[g.cat] || '⭐'} {g.title}</div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className={`font-mono text-[11px] ${dayColor}`}>{days < 0 ? 'Vencida' : days === 0 ? 'Hoy' : `${days} días`}</span>
                          <span className="chip muted !text-[10px] !py-0">{g.cat}</span>
                        </div>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <button className="btn btn-ghost btn-sm !px-2 !py-1" onClick={() => store.toggleGoalDone(g.id)}>✓</button>
                        <button className="btn btn-danger btn-sm !px-2 !py-1" onClick={() => { if(confirm('¿Eliminar?')) store.deleteGoal(g.id) }}>✕</button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <input 
                        type="range" 
                        min="0" max="100" 
                        value={g.progress}
                        onChange={e => store.updateGoalProgress(g.id, Number(e.target.value))}
                        className="flex-1 h-1 bg-[var(--bg4)] rounded-full appearance-none cursor-pointer outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[14px] [&::-webkit-slider-thumb]:h-[14px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--text)]"
                      />
                      <span className={`font-mono text-[12px] font-bold min-w-[36px] text-right ${g.progress >= 100 ? 'text-[var(--green)]' : 'text-[var(--muted)]'}`}>{g.progress}%</span>
                    </div>
                    
                    <div className="progress-track">
                      <div className={`progress-fill ${pColor}`} style={{ width: `${g.progress}%` }}></div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* COMPLETED GOALS */}
        <div className="section-label mt-2">Completadas</div>
        <div>
          {done.length === 0 ? (
            <div className="text-[var(--muted)] text-sm p-3">Sin metas completadas aún</div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {done.map(g => (
                <div key={g.id} className="bg-[var(--bg3)] border border-[var(--border)] rounded-[var(--r-lg)] p-3.5 opacity-50 flex items-center justify-between">
                  <div className="text-[13px] font-semibold text-[var(--text)] line-through">✓ {g.title}</div>
                  <button className="btn btn-ghost btn-sm !px-2 !py-1" onClick={() => store.toggleGoalDone(g.id)}>↩</button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* MODAL ADD GOAL */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center p-4">
          <div className="bg-[var(--bg2)] border border-[var(--border2)] rounded-[var(--r-xl)] p-5 w-full max-w-[440px] mx-auto flex flex-col gap-4 animate-in slide-in-from-bottom-10">
            <div className="flex items-center justify-between">
              <div className="text-[16px] font-bold">Nueva meta</div>
              <button onClick={() => setIsAddOpen(false)} className="w-8 h-8 rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--bg3)] text-[var(--muted)] flex items-center justify-center hover:text-[var(--text)] hover:border-[var(--border2)] transition-colors">×</button>
            </div>
            
            <div className="input-wrap">
              <div className="input-label">Título</div>
              <input type="text" className="input" placeholder="Ej: Conseguir trabajo en banco" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
            </div>
            
            <div className="input-wrap">
              <div className="input-label">Categoría</div>
              <select className="input cursor-pointer" value={newCat} onChange={e => setNewCat(e.target.value)}>
                <option value="trabajo">💼 Trabajo</option>
                <option value="adstrategic">🏢 Adstrategic</option>
                <option value="academico">📚 Académico</option>
                <option value="personal">⭐ Personal</option>
              </select>
            </div>
            
            <div className="input-wrap">
              <div className="input-label">Fecha límite</div>
              <input type="date" className="input" value={newDate} onChange={e => setNewDate(e.target.value)} />
            </div>
            
            <div className="flex gap-2.5 mt-2">
              <button className="btn btn-secondary flex-1" onClick={() => setIsAddOpen(false)}>Cancelar</button>
              <button className="btn btn-primary flex-[2]" onClick={handleAddGoal}>Crear meta</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
