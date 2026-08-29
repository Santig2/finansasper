import { Clock, BookOpen, Briefcase, Zap, Target } from 'lucide-react'

// Dummy data for the weekly grid
const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
const hours = ['8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM']

const classes = [
  { day: 0, hour: 4, duration: 2, title: 'MAC 1105', type: 'class', color: 'bg-sky/20 border-sky/50 text-sky' }, // Mon ~3:30PM (mapped to 4PM block for simplicity in this MVP grid)
  { day: 1, hour: 0, duration: 2, title: 'COP 1334', type: 'class', color: 'bg-sky/20 border-sky/50 text-sky' }, // Tue ~8:50AM
  { day: 2, hour: 4, duration: 2, title: 'MAC 1105', type: 'class', color: 'bg-sky/20 border-sky/50 text-sky' }, // Wed ~3:30PM
  { day: 3, hour: 0, duration: 2, title: 'COP 1334', type: 'class', color: 'bg-sky/20 border-sky/50 text-sky' }, // Thu ~8:50AM
  
  // Example blocks for routine
  { day: 1, hour: 5, duration: 2, title: 'AddNexo Ventas', type: 'work', color: 'bg-gold/20 border-gold/50 text-gold' },
  { day: 3, hour: 4, duration: 2, title: 'Valet Field Sales', type: 'work', color: 'bg-gold/20 border-gold/50 text-gold' },
  { day: 2, hour: 6, duration: 2, title: 'Refresh Miami', type: 'networking', color: 'bg-accent/20 border-accent/50 text-accent' },
]

export function Schedule() {
  
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-text">Horario y Rutina</h1>
        <p className="text-muted mt-2">Tu distribución de tiempo semanal y bloques de productividad.</p>
      </div>

      {/* 5B: Free Time Calculation Banner */}
      <div className="bg-gradient-to-r from-accent/20 to-teal/20 border border-border2 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display text-text flex items-center gap-2 mb-1">
            <Clock className="w-5 h-5 text-accent" />
            Capacidad Semanal
          </h2>
          <p className="text-sm text-muted">Excluyendo tus 4 clases (MAC 1105, COP 1334, ENC 1101 online, SLS 1106 online) y sueño.</p>
        </div>
        <div className="text-center md:text-right shrink-0">
          <p className="text-3xl font-display text-teal">58 horas</p>
          <p className="text-xs text-muted uppercase font-mono tracking-wider">Disponibles p/ Trabajo y Estudio</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 5A: Weekly Grid */}
        <section className="lg:col-span-2 card p-1 sm:p-4 overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Grid Header */}
            <div className="grid grid-cols-8 gap-2 mb-2">
              <div className="text-center text-xs text-muted font-mono py-2">Hora</div>
              {days.map(day => (
                <div key={day} className="text-center text-sm font-medium text-text bg-bg3 rounded-lg py-2">
                  {day.slice(0,3)}
                </div>
              ))}
            </div>

            {/* Grid Body */}
            <div className="space-y-2 relative">
              {hours.map((hour, hourIdx) => (
                <div key={hour} className="grid grid-cols-8 gap-2 h-16">
                  <div className="text-center text-xs text-muted font-mono flex items-center justify-center border-r border-border2 pr-2">
                    {hour}
                  </div>
                  {/* Empty slots */}
                  {days.map((_, dayIdx) => (
                    <div key={`${dayIdx}-${hourIdx}`} className="bg-bg3/30 border border-border2/50 rounded-lg hover:bg-bg3 transition-colors cursor-crosshair relative group">
                      <div className="absolute inset-0 hidden group-hover:flex items-center justify-center text-muted opacity-50">
                        <Zap className="w-4 h-4" />
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              {/* Render Blocks (Absolute positioned in a real app, here we fake it with absolute positioning over the grid rows based on indexes) */}
              {classes.map((cls, idx) => {
                const top = `${cls.hour * (4 * 16 /* 64px h-16 */ + 8 /* gap-2 */)}px`
                const left = `calc(${(cls.day + 1) * 12.5}% + 4px)`
                const width = `calc(12.5% - 8px)`
                const height = `${(cls.duration / 2) * 72 - 8}px`

                return (
                  <div 
                    key={idx} 
                    className={`absolute p-2 rounded-lg border flex flex-col justify-center items-center text-center shadow-lg ${cls.color}`}
                    style={{ top, left, width, height }}
                  >
                    <span className="text-xs font-bold leading-tight">{cls.title}</span>
                    <span className="text-[9px] uppercase mt-1 opacity-80 font-mono">{cls.type}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* 5C: Rutina Recomendada */}
        <section className="space-y-4">
          <h2 className="text-xl font-display text-text flex items-center gap-2 mb-4">
            <Briefcase className="w-5 h-5 text-gold" />
            Rutina Óptima
          </h2>
          
          <div className="card p-5 border-gold/20 hover:border-gold/50 transition-colors">
            <h3 className="font-semibold text-text mb-1 flex items-center gap-2">
              <Zap className="w-4 h-4 text-gold" /> Ventas AddNexo
            </h3>
            <p className="text-sm text-muted mb-2">Martes y Jueves • 6:00 AM - 8:00 AM</p>
            <p className="text-xs text-text bg-bg3 p-2 rounded-lg border border-border2">
              Prospección a mayoristas aprovechando horas de inicio de jornada comercial.
            </p>
          </div>

          <div className="card p-5 border-accent/20 hover:border-accent/50 transition-colors">
            <h3 className="font-semibold text-text mb-1 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-accent" /> Clases Online (ENC/SLS)
            </h3>
            <p className="text-sm text-muted mb-2">Viernes • 9:00 AM - 1:00 PM</p>
            <p className="text-xs text-text bg-bg3 p-2 rounded-lg border border-border2">
              Bloquear la mañana del viernes para completar tareas semanales de clases online de MDC.
            </p>
          </div>

          <div className="card p-5 border-sky/20 hover:border-sky/50 transition-colors">
            <h3 className="font-semibold text-text mb-1 flex items-center gap-2">
              <Target className="w-4 h-4 text-sky" /> Valet Field Sales
            </h3>
            <p className="text-sm text-muted mb-2">Jueves • 2:00 PM - 5:00 PM</p>
            <p className="text-xs text-text bg-bg3 p-2 rounded-lg border border-border2">
              Visitas presenciales post-clase a locaciones de valet en Brickell/Downtown.
            </p>
          </div>

        </section>

      </div>
    </div>
  )
}
