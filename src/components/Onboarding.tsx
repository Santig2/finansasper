import { useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { ArrowRight, Settings, LayoutDashboard, Wallet, Calculator, Briefcase } from 'lucide-react'

export function Onboarding() {
  const completeOnboarding = useStore(state => state.completeOnboarding)
  const [showSplash, setShowSplash] = useState(true)
  const [step, setStep] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const handleNext = () => setStep(s => Math.min(4, s + 1))

  const slides = [
    {
      title: "Control Total",
      subtitle: "Dashboard & Metas",
      desc: "Ten un resumen instantáneo de tus finanzas y el progreso de tus metas personales y académicas.",
      icon: <LayoutDashboard className="w-16 h-16 text-accent mx-auto mb-4" />
    },
    {
      title: "Dinero Inteligente",
      subtitle: "Finanzas & Presupuesto",
      desc: "Registra cada movimiento. SANTI OS calculará tu 'Runway' y te dirá exactamente cuánto tienes hoy.",
      icon: <Wallet className="w-16 h-16 text-teal mx-auto mb-4" />
    },
    {
      title: "Decisiones 100% Lógicas",
      subtitle: "La Calculadora",
      desc: "¿Puedes gastar en eso? La calculadora te dará luz verde, amarilla o roja basándose en tus límites.",
      icon: <Calculator className="w-16 h-16 text-gold mx-auto mb-4" />
    },
    {
      title: "Modo Hustle",
      subtitle: "CRM & Horarios",
      desc: "Lleva el control de tus clientes en el pipeline y optimiza tus horas libres para vender más.",
      icon: <Briefcase className="w-16 h-16 text-coral mx-auto mb-4" />
    }
  ]

  if (showSplash) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(167,139,250,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(167,139,250,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="z-10 animate-in fade-in zoom-in duration-1000 flex flex-col items-center">
          <h1 className="text-6xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-accent via-accent2 to-teal tracking-tighter mb-4">
            SANTI OS
          </h1>
          <p className="text-muted font-mono tracking-widest text-sm uppercase">Tu sistema operativo personal</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-bg relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(167,139,250,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(167,139,250,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      <div className="z-10 w-full max-w-md animate-in slide-in-from-bottom-8 fade-in duration-500">
        
        {step < slides.length ? (
          // CAROUSEL SLIDES
          <div className="card p-8 text-center flex flex-col h-[400px]">
            <div className="flex-1 flex flex-col justify-center">
              {slides[step].icon}
              <h2 className="text-3xl font-display font-bold text-text mb-1">{slides[step].title}</h2>
              <h3 className="text-sm font-mono text-accent2 uppercase mb-4 tracking-wider">{slides[step].subtitle}</h3>
              <p className="text-muted leading-relaxed">{slides[step].desc}</p>
            </div>
            
            <div className="mt-8 flex items-center justify-between">
              <div className="flex gap-2">
                {slides.map((_, i) => (
                  <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-6 bg-accent' : 'w-2 bg-border2'}`} />
                ))}
              </div>
              <button onClick={handleNext} className="btn-primary py-2 px-4 flex items-center gap-2">
                Siguiente <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          // FINAL SELECTION
          <div className="animate-in fade-in duration-500">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-display font-bold text-text mb-2">Todo Listo</h2>
              <p className="text-muted">¿Cómo quieres configurar tu espacio?</p>
            </div>

            <div className="space-y-4">
              <button 
                onClick={() => completeOnboarding(true)}
                className="w-full card p-6 text-left group hover:border-accent hover:shadow-[0_0_20px_rgba(108,99,255,0.15)] transition-all flex items-center justify-between"
              >
                <div>
                  <h3 className="text-lg font-semibold text-text group-hover:text-accent transition-colors">Cargar mi configuración</h3>
                  <p className="text-sm text-muted mt-1">Restaura tus saldos, gastos fijos y clientes.</p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted group-hover:text-accent transition-colors" />
              </button>

              <button 
                onClick={() => completeOnboarding(false)}
                className="w-full card p-6 text-left group hover:border-text transition-all flex items-center justify-between"
              >
                <div>
                  <h3 className="text-lg font-semibold text-text">Empezar desde cero</h3>
                  <p className="text-sm text-muted mt-1">El espacio estará completamente en blanco.</p>
                </div>
                <Settings className="w-5 h-5 text-muted group-hover:text-text transition-colors" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
