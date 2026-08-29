import React, { useState } from 'react'
import { X, Plus, Car, Home, ShoppingCart, Fuel, PartyPopper, Briefcase, Building, BookOpen, Wrench, CheckCircle2 } from 'lucide-react'
import { useStore, CATEGORIES } from '../../store/useStore'
import type { CategoryId } from '../../store/useStore'

interface TransactionModalProps {
  isOpen: boolean
  onClose: () => void
}

const iconMap: Record<string, React.ReactNode> = {
  Car: <Car className="w-5 h-5" />,
  Home: <Home className="w-5 h-5" />,
  ShoppingCart: <ShoppingCart className="w-5 h-5" />,
  Fuel: <Fuel className="w-5 h-5" />,
  PartyPopper: <PartyPopper className="w-5 h-5" />,
  Briefcase: <Briefcase className="w-5 h-5" />,
  Building: <Building className="w-5 h-5" />,
  BookOpen: <BookOpen className="w-5 h-5" />,
  Wrench: <Wrench className="w-5 h-5" />,
  Plus: <Plus className="w-5 h-5" />
}

export function TransactionModal({ isOpen, onClose }: TransactionModalProps) {
  const addTransaction = useStore(state => state.addTransaction)
  const accounts = useStore(state => state.accounts)
  
  const [type, setType] = useState<'expense' | 'income'>('expense')
  const [categoryId, setCategoryId] = useState<CategoryId>('mercado')
  const [amount, setAmount] = useState('')
  const [accountId, setAccountId] = useState('acc_1')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || isNaN(Number(amount))) return

    addTransaction({
      type,
      categoryId,
      amount: Number(amount),
      accountId,
      note,
      date: new Date(date).toISOString(),
      description: note || CATEGORIES[categoryId].name
    })
    
    // Reset and close
    setAmount('')
    setNote('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-bg/80 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full sm:w-[500px] bg-bg2 sm:border sm:border-border2 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-4 duration-300 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-border2 flex justify-between items-center bg-bg/50 sticky top-0 z-10">
          <h2 className="text-xl font-display font-bold text-text">Nueva Transacción</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-bg3 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-muted" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Type Toggle */}
          <div className="flex bg-bg3 p-1 rounded-xl">
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${type === 'expense' ? 'bg-bg2 text-text shadow' : 'text-muted hover:text-text'}`}
              onClick={() => setType('expense')}
            >
              Gasto
            </button>
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${type === 'income' ? 'bg-bg2 text-text shadow' : 'text-muted hover:text-text'}`}
              onClick={() => setType('income')}
            >
              Ingreso
            </button>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-mono text-muted mb-2 uppercase tracking-wider">Monto</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">$</span>
              <input 
                type="number"
                step="0.01"
                required
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="input-base w-full pl-8 text-lg font-mono"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-mono text-muted mb-2 uppercase tracking-wider">Categoría</label>
            <div className="grid grid-cols-5 gap-2">
              {Object.values(CATEGORIES).map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  title={cat.name}
                  onClick={() => setCategoryId(cat.id)}
                  className={`p-3 rounded-xl flex items-center justify-center transition-all ${
                    categoryId === cat.id 
                      ? 'bg-accent/20 border-accent/50 text-accent' 
                      : 'bg-bg3 border-transparent text-muted hover:text-text hover:bg-border2'
                  } border`}
                >
                  {iconMap[cat.icon]}
                </button>
              ))}
            </div>
            <div className="text-center mt-2 text-sm font-medium text-text">
              {CATEGORIES[categoryId].name}
            </div>
          </div>

          {/* Account */}
          <div>
            <label className="block text-xs font-mono text-muted mb-2 uppercase tracking-wider">Cuenta</label>
            <select
              value={accountId}
              onChange={e => setAccountId(e.target.value)}
              className="input-base w-full appearance-none cursor-pointer"
            >
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>{acc.name} - ${acc.balance.toLocaleString()}</option>
              ))}
            </select>
          </div>

          {/* Date & Note */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-muted mb-2 uppercase tracking-wider">Fecha</label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="input-base w-full text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-muted mb-2 uppercase tracking-wider">Nota (Op)</label>
              <input
                type="text"
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Opcional"
                className="input-base w-full text-sm"
              />
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className="btn-primary w-full mt-4 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            Registrar {type === 'expense' ? 'Gasto' : 'Ingreso'}
          </button>
        </form>
      </div>
    </div>
  )
}
