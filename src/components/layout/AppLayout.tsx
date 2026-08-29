import React from 'react'
import { LayoutDashboard, Wallet, Lightbulb, Target, Calendar, Settings } from 'lucide-react'

interface AppLayoutProps {
  children: React.ReactNode
  activeTab: 'dashboard' | 'finances' | 'calculator' | 'projects' | 'schedule' | 'settings'
  onTabChange: (tab: 'dashboard' | 'finances' | 'calculator' | 'projects' | 'schedule' | 'settings') => void
}

export function AppLayout({ children, activeTab, onTabChange }: AppLayoutProps) {
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'finances', label: 'Finanzas', icon: <Wallet className="w-5 h-5" /> },
    { id: 'calculator', label: 'Calcular', icon: <Lightbulb className="w-5 h-5" /> },
    { id: 'projects', label: 'Metas', icon: <Target className="w-5 h-5" /> },
    { id: 'schedule', label: 'Horario', icon: <Calendar className="w-5 h-5" /> },
  ] as const

  return (
    <div className="min-h-screen flex bg-bg relative z-0">
      
      {/* Desktop Sidebar (hidden on mobile) */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border2 bg-bg2/50 backdrop-blur-md fixed inset-y-0 z-50">
        <div className="p-6 flex items-center justify-between">
          <div className="text-2xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-accent to-teal">
            SANTI OS
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id 
                  ? 'bg-accent/10 text-accent font-semibold' 
                  : 'text-muted hover:text-text hover:bg-bg3'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <button
            onClick={() => onTabChange('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'settings' 
                ? 'bg-bg3 text-text font-semibold border border-border2' 
                : 'text-muted hover:text-text hover:bg-bg3'
            }`}
          >
            <Settings className="w-5 h-5" />
            Configuración
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 overflow-x-hidden pb-20 md:pb-0">
        
        {/* Mobile Top Header (only visible on mobile, since nav is at bottom) */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-border2 bg-bg/80 backdrop-blur-md sticky top-0 z-40">
          <div className="text-xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-accent to-teal">
            SANTI OS
          </div>
          <button onClick={() => onTabChange('settings')} className="text-muted hover:text-text p-2">
            <Settings className="w-5 h-5" />
          </button>
        </header>

        <div className="container mx-auto px-4 py-6 max-w-6xl">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation (hidden on desktop) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-bg2/90 backdrop-blur-lg border-t border-border2 z-50 px-2 py-2 pb-safe flex justify-around items-center">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-all ${
              activeTab === item.id 
                ? 'text-accent' 
                : 'text-muted hover:text-text'
            }`}
          >
            <div className={`mb-1 transition-transform ${activeTab === item.id ? 'scale-110' : ''}`}>
              {item.icon}
            </div>
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      
    </div>
  )
}
