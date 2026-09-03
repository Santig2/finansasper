import { useState } from 'react'
import { 
  Home, DollarSign, Calculator, Target, Settings, 
  Plus 
} from 'lucide-react'
import { Dashboard } from './pages/Dashboard'
import { Finanzas } from './pages/Finanzas'
import { Calcular } from './pages/Calcular'
import { Metas } from './pages/Metas'
import { Config } from './pages/Config'
import { TransactionModal } from './components/Finances/TransactionModal'
import { ToastContainer } from './components/ui/ToastContainer'

export type Screen = 'dashboard' | 'finanzas' | 'calcular' | 'metas' | 'config'

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard')
  const [isTxnModalOpen, setIsTxnModalOpen] = useState(false)

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard': return <Dashboard />
      case 'finanzas': return <Finanzas />
      case 'calcular': return <Calcular />
      case 'metas': return <Metas />
      case 'config': return <Config />
      default: return <Dashboard />
    }
  }

  const NavItems = [
    { id: 'dashboard', icon: Home, label: 'Inicio', emoji: '🏠' },
    { id: 'finanzas', icon: DollarSign, label: 'Finanzas', emoji: '💰' },
    { id: 'calcular', icon: Calculator, label: 'Calcular', emoji: '🧮' },
    { id: 'metas', icon: Target, label: 'Metas', emoji: '🎯' },
    { id: 'config', icon: Settings, label: 'Config', emoji: '⚙️' },
  ] as const

  return (
    <div className="relative max-w-[480px] md:max-w-[900px] mx-auto md:pb-[100px] md:pt-6 md:px-6">
      
      {/* SIDEBAR (Desktop) */}
      <nav className="hidden md:flex fixed top-0 left-0 w-[220px] h-screen bg-[var(--bg2)] border-r border-[var(--border)] flex-col p-6 px-4 gap-1 z-[100]">
        <div className="font-mono text-[13px] font-medium text-[var(--text)] px-3 mb-4 flex items-center gap-2">
          💹 <span className="text-[var(--green)]">SANTI</span>&nbsp;OS
        </div>
        {NavItems.map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentScreen(item.id)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-[var(--r-md)] text-[13px] font-medium transition-all border border-transparent ${
              currentScreen === item.id 
                ? 'bg-[var(--green-bg)] text-[var(--green)] border-[var(--green-b)]' 
                : 'text-[var(--muted)] hover:bg-[var(--bg3)] hover:text-[var(--text)]'
            }`}
          >
            <span className="text-[16px] w-5 text-center leading-none">{item.emoji}</span> {item.label}
          </button>
        ))}
      </nav>

      {/* MAIN CONTENT */}
      <div className="md:ml-[220px] min-h-screen">
        {renderScreen()}
      </div>

      {/* BOTTOM NAV (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--bg2)] border-t border-[var(--border)] flex z-[100] pb-[env(safe-area-inset-bottom)]">
        {NavItems.map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentScreen(item.id)}
            className={`flex-1 flex flex-col items-center gap-1 pt-2.5 px-1 pb-2 text-[10px] font-medium transition-colors relative ${
              currentScreen === item.id ? 'text-[var(--green)]' : 'text-[var(--muted)]'
            }`}
          >
            {currentScreen === item.id && (
              <div className="absolute top-0 left-[20%] right-[20%] h-[2px] bg-[var(--green)] rounded-b-[2px]"></div>
            )}
            <span className="text-xl leading-none">{item.emoji}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* FAB */}
      <button 
        onClick={() => setIsTxnModalOpen(true)}
        className="fixed bottom-[72px] md:bottom-6 right-4 md:right-6 w-[52px] h-[52px] rounded-full bg-[var(--green2)] border-2 border-[var(--green)] text-white text-2xl flex items-center justify-center shadow-[0_4px_20px_rgba(63,185,80,0.3)] hover:scale-110 active:scale-95 transition-all z-[90]"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* GLOBAL MODALS */}
      <TransactionModal 
        isOpen={isTxnModalOpen} 
        onClose={() => setIsTxnModalOpen(false)} 
      />
      <ToastContainer />

    </div>
  )
}

export default App
