import { useState, useRef } from 'react'
import { useStore } from '../store/useStore'

export function Config() {
  const store = useStore()
  const { config } = store

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    const state = store
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `santios_backup_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string)
        if (confirm('¿Reemplazar todos los datos actuales con el archivo importado?')) {
          store.importData(data)
          alert('Datos importados correctamente')
        }
      } catch (err) {
        alert('Error al importar: Archivo inválido')
      }
    }
    reader.readAsText(file)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleReset = () => {
    if (confirm('¿Resetear TODOS los datos? Esta acción no se puede deshacer.')) {
      store.resetData()
      alert('Datos restaurados al inicio')
    }
  }

  return (
    <div className="animate-in fade-in duration-300">
      
      {/* HEADER */}
      <div className="sticky top-0 bg-[var(--bg)] z-50 border-b border-[var(--border)] pt-5 px-4 pb-3">
        <div className="text-[18px] font-bold text-[var(--text)]">Configuración</div>
        <div className="text-[12px] text-[var(--muted)] font-mono mt-0.5">Ajustar cuentas y umbrales</div>
      </div>

      <div className="p-4 flex flex-col gap-4">
        
        <div className="section-label mt-1">Umbrales de alerta</div>
        <div className="card">
          <div className="card-body flex flex-col gap-3">
            <div className="input-wrap">
              <div className="input-label">Saldo mínimo (zona roja)</div>
              <input 
                type="number" 
                className="input input-mono" 
                value={config.minBalance}
                onChange={e => store.updateConfig({ minBalance: Number(e.target.value) })}
              />
            </div>
            <div className="input-wrap">
              <div className="input-label">Saldo de advertencia (zona amarilla)</div>
              <input 
                type="number" 
                className="input input-mono" 
                value={config.warnBalance}
                onChange={e => store.updateConfig({ warnBalance: Number(e.target.value) })}
              />
            </div>
            <div className="input-wrap">
              <div className="input-label">Inicio de renta (fecha)</div>
              <input 
                type="date" 
                className="input" 
                value={config.rentStart}
                onChange={e => store.updateConfig({ rentStart: e.target.value })}
              />
            </div>
            <div className="input-wrap">
              <div className="input-label">Monto de renta mensual</div>
              <input 
                type="number" 
                className="input input-mono" 
                value={config.rentAmt}
                onChange={e => store.updateConfig({ rentAmt: Number(e.target.value) })}
              />
            </div>
          </div>
        </div>

        <div className="section-label mt-2">Datos</div>
        <div className="card">
          <div className="card-body flex flex-col gap-2.5">
            <button className="btn btn-secondary btn-full" onClick={handleExport}>
              📤 Exportar datos (JSON)
            </button>
            <button className="btn btn-secondary btn-full" onClick={() => fileInputRef.current?.click()}>
              📥 Importar datos
            </button>
            <input 
              type="file" 
              accept=".json" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleImport}
            />
            <button className="btn btn-danger btn-full" onClick={handleReset}>
              🗑 Resetear todos los datos
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
