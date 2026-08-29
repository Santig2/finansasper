import { useState } from 'react'
import { useStore } from '../store/useStore'
import { Settings as SettingsIcon, Download, Upload, Trash2, User, DollarSign, Save, Pencil, Check, X } from 'lucide-react'

export function Settings() {
  const { profile, updateProfile, resetData, importData, ...storeState } = useStore()
  
  const [name, setName] = useState(profile.name)
  const [minThreshold, setMinThreshold] = useState(profile.minThreshold.toString())
  const [estimatedIncome, setEstimatedIncome] = useState(profile.estimatedIncome.toString())
  const [showCarAccount, setShowCarAccount] = useState(profile.showCarAccountInTotal)
  
  const [importJson, setImportJson] = useState('')
  const [importError, setImportError] = useState('')

  const [newExpenseTitle, setNewExpenseTitle] = useState('')
  const [newExpenseAmount, setNewExpenseAmount] = useState('')
  
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null)
  const [editExpenseTitle, setEditExpenseTitle] = useState('')
  const [editExpenseAmount, setEditExpenseAmount] = useState('')

  const handleAddExpense = () => {
    if (newExpenseTitle.trim() && newExpenseAmount) {
      storeState.addRecurringExpense({ title: newExpenseTitle, amount: Number(newExpenseAmount) })
      setNewExpenseTitle('')
      setNewExpenseAmount('')
    }
  }

  const startEditing = (exp: any) => {
    setEditingExpenseId(exp.id)
    setEditExpenseTitle(exp.title)
    setEditExpenseAmount(exp.amount.toString())
  }

  const saveEditing = () => {
    if (editingExpenseId && editExpenseTitle.trim() && editExpenseAmount) {
      storeState.updateRecurringExpense(editingExpenseId, editExpenseTitle, Number(editExpenseAmount))
      setEditingExpenseId(null)
    }
  }

  const cancelEditing = () => {
    setEditingExpenseId(null)
  }

  const handleSaveProfile = () => {
    updateProfile({
      name,
      minThreshold: Number(minThreshold) || 5000,
      estimatedIncome: Number(estimatedIncome) || 0,
      showCarAccountInTotal: showCarAccount
    })
    alert('Perfil actualizado')
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(storeState, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `santi-os-export-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    try {
      const parsed = JSON.parse(importJson)
      if (parsed) {
        importData(parsed)
        alert('Datos importados con éxito')
        setImportJson('')
        setImportError('')
      }
    } catch (e) {
      setImportError('JSON inválido')
    }
  }

  const handleReset = () => {
    if (window.confirm('¿Estás seguro? Esto borrará toda tu configuración local.')) {
      resetData()
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12 max-w-3xl">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-text flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-muted" /> Configuración
        </h1>
        <p className="text-muted mt-2">Ajusta tu perfil y administra tus datos locales.</p>
      </div>

      <div className="space-y-8">
        
        {/* Profile Settings */}
        <section className="card p-6">
          <h2 className="text-xl font-display text-text mb-6 flex items-center gap-2 border-b border-border2 pb-4">
            <User className="w-5 h-5 text-accent" /> Perfil y Finanzas
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-muted mb-2 uppercase">Nombre</label>
              <input type="text" className="input-base w-full" value={name} onChange={e => setName(e.target.value)} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-muted mb-2 uppercase">Umbral Mínimo Runway</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">$</span>
                  <input type="number" className="input-base w-full pl-7" value={minThreshold} onChange={e => setMinThreshold(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono text-muted mb-2 uppercase">Ingreso Mensual Estimado</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">$</span>
                  <input type="number" className="input-base w-full pl-7" value={estimatedIncome} onChange={e => setEstimatedIncome(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 py-2">
              <input 
                type="checkbox" 
                id="showCar" 
                className="w-4 h-4 rounded accent-accent bg-bg3 border-border2" 
                checked={showCarAccount}
                onChange={e => setShowCarAccount(e.target.checked)}
              />
              <label htmlFor="showCar" className="text-sm text-text">Incluir "Cuenta Carro" en el Disponible Hoy total (No recomendado)</label>
            </div>

            <button onClick={handleSaveProfile} className="btn-primary mt-4 flex items-center gap-2">
              <Save className="w-4 h-4" /> Guardar Cambios
            </button>
          </div>
        </section>

        {/* Recurring Expenses */}
        <section className="card p-6 border-teal/20">
          <h2 className="text-xl font-display text-text mb-6 flex items-center gap-2 border-b border-border2 pb-4">
            <DollarSign className="w-5 h-5 text-teal" /> Gastos Fijos Recurrentes
          </h2>
          <div className="space-y-4">
            <p className="text-sm text-muted">Añade tus gastos fijos (renta, seguro, suscripciones). Esto calculará dinámicamente tu Gasto Promedio Real.</p>
            
            <div className="flex gap-2">
              <input 
                type="text" 
                className="input-base flex-1" 
                placeholder="Título (Ej. Seguro Carro)"
                value={newExpenseTitle}
                onChange={e => setNewExpenseTitle(e.target.value)}
              />
              <div className="relative w-32">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">$</span>
                <input 
                  type="number" 
                  className="input-base w-full pl-7" 
                  placeholder="Monto"
                  value={newExpenseAmount}
                  onChange={e => setNewExpenseAmount(e.target.value)}
                />
              </div>
              <button 
                onClick={handleAddExpense}
                className="btn-primary py-2 px-4 shrink-0"
              >
                Añadir
              </button>
            </div>

            <div className="mt-4 bg-bg3/50 rounded-xl overflow-hidden divide-y divide-border2">
              {storeState.recurringExpenses.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted">No hay gastos recurrentes configurados.</div>
              ) : (
                storeState.recurringExpenses.map(exp => (
                  <div key={exp.id} className="p-4 flex justify-between items-center group hover:bg-bg3 transition-colors">
                    {editingExpenseId === exp.id ? (
                      <div className="flex gap-2 w-full">
                        <input type="text" className="input-base flex-1 py-1" value={editExpenseTitle} onChange={e => setEditExpenseTitle(e.target.value)} />
                        <input type="number" className="input-base w-24 py-1" value={editExpenseAmount} onChange={e => setEditExpenseAmount(e.target.value)} />
                        <button onClick={saveEditing} className="text-green hover:text-green/80 transition-colors px-1">
                          <Check className="w-5 h-5" />
                        </button>
                        <button onClick={cancelEditing} className="text-coral hover:text-coral/80 transition-colors px-1">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="text-sm text-text font-medium">{exp.title}</span>
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-teal">${exp.amount.toFixed(2)}</span>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => startEditing(exp)} className="text-muted hover:text-teal transition-colors">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => storeState.removeRecurringExpense(exp.id)} className="text-muted hover:text-coral transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
            
            <div className="flex justify-between items-center pt-4 px-2 border-t border-border2">
              <span className="text-sm text-muted uppercase font-mono tracking-wider">Total Mensual</span>
              <span className="text-2xl font-display text-text">
                ${storeState.recurringExpenses.reduce((acc, e) => acc + e.amount, 0).toFixed(2)}
              </span>
            </div>
          </div>
        </section>

        {/* Data Management */}
        <section className="card p-6 border-gold/20">
          <h2 className="text-xl font-display text-text mb-6 flex items-center gap-2 border-b border-border2 pb-4">
            <DollarSign className="w-5 h-5 text-gold" /> Gestión de Datos
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-sm text-muted">Santi OS no usa base de datos. Exporta tu información frecuentemente para tener respaldos.</p>
              <button onClick={handleExport} className="w-full btn-secondary flex items-center justify-center gap-2">
                <Download className="w-4 h-4" /> Exportar JSON
              </button>

              <div className="pt-8 mt-4 border-t border-border2">
                <p className="text-sm text-coral mb-2">Zona de Peligro</p>
                <button onClick={handleReset} className="w-full py-2 px-4 rounded-lg border border-coral text-coral hover:bg-coral hover:text-white transition-colors flex items-center justify-center gap-2 font-medium">
                  <Trash2 className="w-4 h-4" /> Resetear Todo (Factory Reset)
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-muted">Pega un archivo JSON previamente exportado para restaurar tu estado.</p>
              <textarea 
                className="input-base w-full h-32 font-mono text-xs" 
                placeholder="{ ...json state }"
                value={importJson}
                onChange={e => setImportJson(e.target.value)}
              />
              {importError && <p className="text-xs text-coral">{importError}</p>}
              <button onClick={handleImport} className="w-full btn-secondary flex items-center justify-center gap-2 border-accent text-accent hover:bg-accent hover:text-white">
                <Upload className="w-4 h-4" /> Importar JSON
              </button>
            </div>
          </div>

        </section>

      </div>
    </div>
  )
}
