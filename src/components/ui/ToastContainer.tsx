import { useToast } from '../../store/useToast'
import { X } from 'lucide-react'

export function ToastContainer() {
  const { toasts, removeToast } = useToast()

  const icons = {
    success: '✅',
    warning: '⚠️',
    error: '❌'
  }

  const borderColors = {
    success: 'border-[var(--green-b)]',
    warning: 'border-[var(--gold-b)]',
    error: 'border-[var(--red-b)]'
  }

  return (
    <div className="fixed bottom-[90px] left-4 right-4 md:left-auto md:right-6 md:w-[320px] z-[300] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div 
          key={t.id} 
          className={`bg-[var(--bg2)] border ${borderColors[t.type]} rounded-[var(--r-lg)] p-3 px-4 flex items-center gap-2.5 text-[13px] font-medium animate-in slide-in-from-bottom-5 pointer-events-auto shadow-lg`}
        >
          <div className="text-[18px] shrink-0">{icons[t.type]}</div>
          <div className="flex-1">
            <div className="text-[13px] font-semibold text-[var(--text)]">{t.title}</div>
            {t.sub && <div className="text-[11px] text-[var(--muted)] mt-0.5 font-mono">{t.sub}</div>}
          </div>
          <button 
            onClick={() => removeToast(t.id)}
            className="text-[var(--muted)] hover:text-[var(--text)] transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
