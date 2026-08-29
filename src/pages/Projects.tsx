import { useState } from 'react'
import { useStore } from '../store/useStore'
import type { ClientStage } from '../store/useStore'
import { Target, CheckCircle2, Circle, Users, ChevronRight, ChevronLeft, Calendar } from 'lucide-react'

export function Projects() {
  const { goals, clients, updateGoalProgress, updateGoalSubtask, moveClientStage } = useStore()
  
  // 4A Local State (for expanding goals)
  const [expandedGoalId, setExpandedGoalId] = useState<string | null>(null)

  // 4B Calculations
  const totalLeads = clients.length
  const clientsWon = clients.filter(c => c.stage === 'Cliente').length
  const conversionRate = totalLeads > 0 ? ((clientsWon / totalLeads) * 100).toFixed(0) : '0'
  const potentialRevenue = clients.filter(c => c.stage !== 'Cliente').reduce((acc, c) => acc + c.potentialAmount, 0)
  
  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)

  const stages: ClientStage[] = ['Contactado', 'Demo dada', 'Negociando', 'Cliente']

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-text">Metas y Proyectos</h1>
        <p className="text-muted mt-2">Seguimiento de metas personales y pipeline de clientes.</p>
      </div>

      {/* 4A: Metas Personales */}
      <section>
        <h2 className="text-2xl font-display text-text mb-6 flex items-center gap-2">
          <Target className="w-6 h-6 text-accent2" />
          Metas Personales
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map(goal => {
            const isExpanded = expandedGoalId === goal.id
            const isCompleted = goal.status === 'Completado'
            
            return (
              <div key={goal.id} className={`card p-5 transition-all ${isCompleted ? 'opacity-75 bg-bg3/50' : ''}`}>
                <div 
                  className="flex justify-between items-start cursor-pointer"
                  onClick={() => setExpandedGoalId(isExpanded ? null : goal.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border ${
                        goal.category === 'Adstrategic' ? 'bg-gold/10 text-gold border-gold/20' :
                        goal.category === 'Trabajo' ? 'bg-green/10 text-green border-green/20' :
                        'bg-sky/10 text-sky border-sky/20'
                      }`}>
                        {goal.category}
                      </span>
                      <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded ${
                        isCompleted ? 'bg-green text-bg' : 'bg-bg3 text-muted'
                      }`}>
                        {goal.status}
                      </span>
                    </div>
                    <h3 className={`font-semibold ${isCompleted ? 'line-through text-muted' : 'text-text'}`}>
                      {goal.title}
                    </h3>
                    <p className="text-xs text-muted mt-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {goal.deadline} • Objetivo: {goal.target}
                    </p>
                  </div>
                  <div className="font-mono text-sm font-bold text-accent2 bg-accent2/10 px-2 py-1 rounded ml-4">
                    {goal.progress}%
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-6 pt-4 border-t border-border2 space-y-4 animate-in slide-in-from-top-2">
                    
                    {/* Slider */}
                    <div>
                      <div className="flex justify-between text-xs text-muted mb-2 uppercase font-mono">
                        <span>Progreso General</span>
                        <span>{goal.progress}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" max="100" 
                        value={goal.progress}
                        onChange={(e) => updateGoalProgress(goal.id, Number(e.target.value))}
                        className="w-full accent-accent2 h-2 bg-bg3 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Subtasks */}
                    {goal.subtasks && goal.subtasks.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs text-muted uppercase font-mono">Sub-tareas</p>
                        {goal.subtasks.map(task => (
                          <button
                            key={task.id}
                            onClick={() => updateGoalSubtask(goal.id, task.id, !task.completed)}
                            className="flex items-center gap-2 w-full text-left group"
                          >
                            {task.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-green" />
                            ) : (
                              <Circle className="w-4 h-4 text-muted group-hover:text-accent2 transition-colors" />
                            )}
                            <span className={`text-sm ${task.completed ? 'text-muted line-through' : 'text-text'}`}>
                              {task.title}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* 4B: Tracker de Clientes */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-display text-text flex items-center gap-2">
            <Users className="w-6 h-6 text-gold" />
            Tracker de Clientes (CRM)
          </h2>
        </div>

        {/* CRM Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="card p-4 flex flex-col justify-center border-gold/20">
            <span className="text-xs text-muted uppercase font-mono">Pipeline (Potencial)</span>
            <span className="text-2xl font-display text-gold">{formatCurrency(potentialRevenue)}</span>
          </div>
          <div className="card p-4 flex flex-col justify-center">
            <span className="text-xs text-muted uppercase font-mono">Total Leads</span>
            <span className="text-2xl font-display text-text">{totalLeads}</span>
          </div>
          <div className="card p-4 flex flex-col justify-center">
            <span className="text-xs text-muted uppercase font-mono">Conversión</span>
            <span className="text-2xl font-display text-green">{conversionRate}%</span>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stages.map((stage, stageIndex) => (
            <div key={stage} className="bg-bg3/50 rounded-2xl p-3 border border-border2 flex flex-col min-h-[400px]">
              
              {/* Column Header */}
              <div className="flex justify-between items-center mb-4 px-1">
                <h3 className="font-semibold text-sm text-text uppercase tracking-wider">{stage}</h3>
                <span className="bg-bg2 text-muted text-xs px-2 py-0.5 rounded-full font-mono">
                  {clients.filter(c => c.stage === stage).length}
                </span>
              </div>

              {/* Column Cards */}
              <div className="space-y-3 flex-1">
                {clients.filter(c => c.stage === stage).map(client => (
                  <div key={client.id} className="bg-bg2 p-4 rounded-xl shadow-sm border border-border2 hover:border-gold/50 transition-colors group">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-text leading-tight">{client.name}</h4>
                      <span className="text-[10px] font-mono uppercase bg-accent/10 text-accent px-1.5 py-0.5 rounded">
                        {client.product}
                      </span>
                    </div>
                    
                    <p className="text-xs text-muted mb-3 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {client.lastContact}
                    </p>
                    
                    <div className="flex justify-between items-center pt-3 border-t border-border2">
                      <span className="font-mono text-sm text-green font-medium">
                        {formatCurrency(client.potentialAmount)}
                      </span>
                      
                      {/* Movement Actions */}
                      <div className="flex gap-1">
                        {stageIndex > 0 && (
                          <button 
                            onClick={() => moveClientStage(client.id, stages[stageIndex - 1])}
                            className="p-1 rounded bg-bg3 text-muted hover:text-text hover:bg-border2 transition-colors"
                            title="Mover atrás"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                        )}
                        {stageIndex < stages.length - 1 && (
                          <button 
                            onClick={() => moveClientStage(client.id, stages[stageIndex + 1])}
                            className="p-1 rounded bg-gold/10 text-gold hover:bg-gold hover:text-bg transition-colors"
                            title="Avanzar"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
