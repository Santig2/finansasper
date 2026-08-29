import { useState } from 'react'
import { AppLayout } from './components/layout/AppLayout'
import { Dashboard } from './pages/Dashboard'
import { Finances } from './pages/Finances'
import { Calculator } from './pages/Calculator'
import { Projects } from './pages/Projects'
import { Schedule } from './pages/Schedule'
import { Settings } from './pages/Settings'
import { Onboarding } from './components/Onboarding'
import { useStore } from './store/useStore'

function App() {
  const hasCompletedOnboarding = useStore(state => state.hasCompletedOnboarding)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'finances' | 'calculator' | 'projects' | 'schedule' | 'settings'>('dashboard')

  if (!hasCompletedOnboarding) {
    return <Onboarding />
  }

  return (
    <AppLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'finances' && <Finances />}
      {activeTab === 'calculator' && <Calculator />}
      {activeTab === 'projects' && <Projects />}
      {activeTab === 'schedule' && <Schedule />}
      {activeTab === 'settings' && <Settings />}
    </AppLayout>
  )
}

export default App
