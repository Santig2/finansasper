import { useState, useEffect } from 'react'
import { useStore, CATEGORIES } from '../../store/useStore'
import { format } from 'date-fns'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function TransactionModal({ isOpen, onClose }: Props) {
  const store = useStore()
  
  const [type, setType] = useState<'expense' | 'income'>('expense')
  const [amount, setAmount] = useState('')
  const [cat, setCat] = useState('')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    if (isOpen) {
      setType('expense')
      setAmount('')
      setCat('')
      setNote('')
      setDate(new Date().toISOString().split('T')[0])
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSave = () => {
    const amt = parseFloat(amount)
    if (isNaN(amt) || amt <= 0) return alert('Monto inválido')

    store.addTransaction({
      id: 'id_' + Date.now(),
      date,
      type,
      cat: cat || 'otro',
      label: CATEGORIES.find(c => c.id === cat)?.label || 'Otro',
      amount: amt,
      note
    })

    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-end md:items-center p-4 pb-12 md:pb-4 animate-in fade-in">
      <div className="bg-[var(--bg2)] border border-[var(--border2)] rounded-[var(--r-xl)] p-5 w-full max-w-[440px] mx-auto flex flex-col gap-4 animate-in slide-in-from-bottom-10">
        
        <div className="flex items-center justify-between">
          <div className="text-[16px] font-bold">Nueva transacción</div>
          <button onClick={onClose} className="w-8 h-8 rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--bg3)] text-[var(--muted)] flex items-center justify-center hover:text-[var(--text)] hover:border-[var(--border2)] transition-colors">×</button>
        </div>

        <div className="toggle-group">
          <div className={`toggle-opt expense ${type === 'expense' ? 'active' : ''}`} onClick={() => setType('expense')}>Gasto</div>
          <div className={`toggle-opt income ${type === 'income' ? 'active' : ''}`} onClick={() => setType('income')}>Ingreso</div>
        </div>

        <div className="input-wrap">
          <div className="input-label">Monto</div>
          <input 
            type="number" 
            className="input input-mono text-[24px] font-bold text-center h-[54px]" 
            placeholder="$0.00"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
        </div>

        <div>
          <div className="input-label mb-2">Categoría</div>
          <div className="grid grid-cols-4 gap-1.5">
            {CATEGORIES.filter(c => type === 'expense' ? true : ['trabajo', 'adstrategic', 'otro'].includes(c.id)).map(c => (
              <div 
                key={c.id} 
                className={`flex flex-col items-center gap-1 p-2.5 rounded-[var(--r-md)] border bg-[var(--bg3)] cursor-pointer text-[10px] transition-all hover:border-[var(--border2)] hover:text-[var(--text)] ${
                  cat === c.id ? '!border-[var(--green-b)] !bg-[var(--green-bg)] !text-[var(--green)]' : 'border-[var(--border)] text-[var(--muted)]'
                }`}
                onClick={() => setCat(c.id)}
              >
                <span className="text-[20px]">{c.icon}</span>
                <span className="truncate w-full text-center">{c.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="input-wrap">
          <div className="input-label">Nota (opcional)</div>
          <input type="text" className="input" placeholder="Describe el gasto..." value={note} onChange={e => setNote(e.target.value)} />
        </div>

        <div className="input-wrap">
          <div className="input-label">Fecha</div>
          <input type="date" className="input" value={date} onChange={e => setDate(e.target.value)} />
        </div>

        <div className="flex gap-2.5 mt-2">
          <button className="btn btn-secondary flex-1" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary flex-[2]" onClick={handleSave}>Guardar</button>
        </div>

      </div>
    </div>
  )
}
