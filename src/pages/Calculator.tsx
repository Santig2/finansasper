import { useState } from 'react'
import { useStore, CATEGORIES } from '../store/useStore'
import type { CategoryId } from '../store/useStore'
import { Target, HelpCircle, XCircle, Car, CheckCircle } from 'lucide-react'

export function Calculator() {
  const { accounts, monthlyBudget, budgets, recurringExpenses } = useStore()
  
  // Operativa account is index 0
  const operativeBalance = accounts[0]?.balance || 0
  const averageMonthlySpend = recurringExpenses.reduce((acc, exp) => acc + exp.amount, 0)

  // --- 3A State: ¿Puedo gastar esto? ---
  const [expenseAmount, setExpenseAmount] = useState<string>('')
  const [expenseCategory, setExpenseCategory] = useState<CategoryId>('ocio')
  const [expenseFreq, setExpenseFreq] = useState<'unico' | 'mensual' | 'anual'>('unico')

  const calc3A = () => {
    const amount = Number(expenseAmount) || 0
    if (amount <= 0) return null

    const monthlyAmount = expenseFreq === 'unico' ? amount : expenseFreq === 'mensual' ? amount : amount / 12
    const postSpendBalance = operativeBalance - monthlyAmount
    
    // Total budget is $850 pre-configured (using monthlyBudget)
    const percentOfMonthlyBudget = (monthlyAmount / monthlyBudget) * 100
    const percentOfBalance = (monthlyAmount / operativeBalance) * 100
    
    // Runway lost (days)
    const dailySpend = averageMonthlySpend / 30
    const runwayDaysLost = monthlyAmount / dailySpend

    // Category budget check
    const catBudget = budgets.find(b => b.categoryId === expenseCategory)?.amount || 0
    const catAvailable = monthlyAmount <= catBudget

    let verdict = 'green'
    let emoji = '✅'
    let title = 'Sí puedes'
    let message = `Tienes margen. Quedarías con $${postSpendBalance.toFixed(0)} disponibles.`

    if (postSpendBalance < 5000) {
      verdict = 'red'
      emoji = '🚨'
      title = 'No recomendado'
      message = `Bajarías a $${postSpendBalance.toFixed(0)} — por debajo de tu mínimo de $5,000.`
    } else if (postSpendBalance < 6000 || percentOfMonthlyBudget > 30) {
      verdict = 'yellow'
      emoji = '⚠️'
      title = 'Cuidado'
      message = `Representa el ${percentOfMonthlyBudget.toFixed(0)}% de tu presupuesto mensual. Quedas con $${postSpendBalance.toFixed(0)}.`
    }

    return { percentOfMonthlyBudget, percentOfBalance, runwayDaysLost, catAvailable, verdict, emoji, title, message }
  }

  const result3A = calc3A()

  // --- 3B State: Compra vs Lease ---
  const [purchasePrice, setPurchasePrice] = useState<string>('25000')
  const [leasePrice, setLeasePrice] = useState<string>('300')
  const [leaseDownPayment, setLeaseDownPayment] = useState<string>('2000')
  const [insurancePurchase, setInsurancePurchase] = useState<string>('150')
  const [insuranceLease, setInsuranceLease] = useState<string>('200') // Typically higher
  const [termMonths, setTermMonths] = useState<string>('36')

  const calc3B = () => {
    const pp = Number(purchasePrice) || 0
    const lp = Number(leasePrice) || 0
    const dp = Number(leaseDownPayment) || 0
    const ip = Number(insurancePurchase) || 0
    const il = Number(insuranceLease) || 0
    const term = Number(termMonths) || 1

    // Purchase Math (Simplified: cash purchase assumed or ignore interest for baseline comparison)
    // Residual value rule of thumb: ~50% after 3 years
    const purchaseResidualValue = pp * 0.5 
    const purchaseTotalCost = pp + (ip * term) - purchaseResidualValue
    const purchaseMonthlyCost = purchaseTotalCost / term

    // Lease Math
    const leaseTotalCost = dp + (lp * term) + (il * term)
    const leaseMonthlyCost = leaseTotalCost / term
    const leaseResidualValue = 0 // You don't own it

    return {
      purchase: { total: purchaseTotalCost, monthly: purchaseMonthlyCost, residual: purchaseResidualValue },
      lease: { total: leaseTotalCost, monthly: leaseMonthlyCost, residual: leaseResidualValue }
    }
  }
  const result3B = calc3B()

  // --- 3C State: Meta de Ingreso ---
  const [targetBalance, setTargetBalance] = useState<string>('20000')
  const [targetMonths, setTargetMonths] = useState<string>('12')
  const [hourlyRate] = useState<string>('20')

  const calc3C = () => {
    const target = Number(targetBalance) || 0
    const months = Number(targetMonths) || 1
    const rate = Number(hourlyRate) || 20

    const shortfall = Math.max(0, target - operativeBalance)
    const requiredSavingsPerMonth = shortfall / months
    
    // To save X per month, you need to earn X + your expenses
    const requiredMonthlyIncome = requiredSavingsPerMonth + averageMonthlySpend
    
    // Adstrategic Clients @ $97/mo, taking 10% = $9.70 per client
    const clientRevenue = 9.70
    const neededClients = Math.ceil(requiredMonthlyIncome / clientRevenue)
    
    // Part-time hours needed per month
    const neededHours = Math.ceil(requiredMonthlyIncome / rate)

    return { requiredMonthlyIncome, neededClients, neededHours }
  }
  const result3C = calc3C()

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-text">Calculadora de Decisiones</h1>
        <p className="text-muted mt-2">Evalúa el impacto financiero antes de ejecutar un gasto o establecer metas.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 3A: ¿Puedo gastar esto? */}
        <section className="card p-6 border-accent/20">
          <h2 className="text-xl font-display text-text mb-6 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-accent" />
            ¿Puedo gastar esto?
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-muted mb-2 uppercase">Monto</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">$</span>
                  <input type="number" className="input-base w-full pl-7" placeholder="0.00" value={expenseAmount} onChange={e => setExpenseAmount(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono text-muted mb-2 uppercase">Frecuencia</label>
                <select className="input-base w-full" value={expenseFreq} onChange={e => setExpenseFreq(e.target.value as any)}>
                  <option value="unico">Pago Único</option>
                  <option value="mensual">Mensual</option>
                  <option value="anual">Anual</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono text-muted mb-2 uppercase">Categoría</label>
              <select className="input-base w-full" value={expenseCategory} onChange={e => setExpenseCategory(e.target.value as CategoryId)}>
                {Object.values(CATEGORIES).map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Result 3A */}
            {result3A && (
              <div className="mt-6 space-y-4 pt-4 border-t border-border2">
                <div className={`p-4 rounded-xl border ${
                  result3A.verdict === 'green' ? 'bg-green/10 border-green/30 text-green' :
                  result3A.verdict === 'yellow' ? 'bg-gold/10 border-gold/30 text-gold' :
                  'bg-coral/10 border-coral/30 text-coral'
                }`}>
                  <p className="font-semibold text-lg flex items-center gap-2">
                    <span>{result3A.emoji}</span> {result3A.title}
                  </p>
                  <p className="text-sm mt-1 opacity-90">{result3A.message}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-bg3 p-3 rounded-lg">
                    <p className="text-xs text-muted font-mono uppercase mb-1">Impacto Budget</p>
                    <p className="text-lg text-text font-medium">{result3A.percentOfMonthlyBudget.toFixed(1)}%</p>
                  </div>
                  <div className="bg-bg3 p-3 rounded-lg">
                    <p className="text-xs text-muted font-mono uppercase mb-1">Impacto Saldo</p>
                    <p className="text-lg text-text font-medium">{result3A.percentOfBalance.toFixed(1)}%</p>
                  </div>
                  <div className="bg-bg3 p-3 rounded-lg">
                    <p className="text-xs text-muted font-mono uppercase mb-1">Runway Perdido</p>
                    <p className="text-lg text-text font-medium">{result3A.runwayDaysLost.toFixed(0)} días</p>
                  </div>
                  <div className="bg-bg3 p-3 rounded-lg">
                    <p className="text-xs text-muted font-mono uppercase mb-1">Budget Cat.</p>
                    <p className="text-sm text-text font-medium flex items-center gap-1 mt-1">
                      {result3A.catAvailable ? <CheckCircle className="w-4 h-4 text-green" /> : <XCircle className="w-4 h-4 text-coral" />}
                      {result3A.catAvailable ? 'Disponible' : 'Excedido'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 3C: Meta de Ingreso */}
        <section className="card p-6 border-teal/20">
          <h2 className="text-xl font-display text-text mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-teal" />
            Calculadora de Meta de Ingreso
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-muted mb-2 uppercase">Meta Saldo Final</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">$</span>
                  <input type="number" className="input-base w-full pl-7" value={targetBalance} onChange={e => setTargetBalance(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono text-muted mb-2 uppercase">En Cuántos Meses</label>
                <input type="number" className="input-base w-full" value={targetMonths} onChange={e => setTargetMonths(e.target.value)} />
              </div>
            </div>
            
            <div className="bg-bg3 p-4 rounded-xl mt-4 space-y-4">
              <p className="text-sm text-muted">Ingreso Mensual Necesario (asumiendo gasto fijo de {formatCurrency(averageMonthlySpend)}/mo):</p>
              <p className="text-3xl font-display text-teal">{formatCurrency(result3C.requiredMonthlyIncome)}</p>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border2">
                <div>
                  <p className="text-xs text-muted font-mono mb-1 uppercase">Clientes Adstrategic</p>
                  <p className="text-lg font-medium text-text">{result3C.neededClients} <span className="text-xs text-muted">@ 10%</span></p>
                </div>
                <div>
                  <p className="text-xs text-muted font-mono mb-1 uppercase">Horas Part-Time</p>
                  <p className="text-lg font-medium text-text">{result3C.neededHours} <span className="text-xs text-muted">@ ${hourlyRate}/hr</span></p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3B: Compra vs Lease */}
        <section className="card p-6 border-accent2/20 lg:col-span-2">
          <h2 className="text-xl font-display text-text mb-6 flex items-center gap-2">
            <Car className="w-5 h-5 text-accent2" />
            Comparador Compra vs Lease
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-muted mb-2 uppercase">Precio Compra</label>
                  <input type="number" className="input-base w-full" value={purchasePrice} onChange={e => setPurchasePrice(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-mono text-muted mb-2 uppercase">Seguro Compra/mo</label>
                  <input type="number" className="input-base w-full" value={insurancePurchase} onChange={e => setInsurancePurchase(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 border-t border-border2 pt-4">
                <div>
                  <label className="block text-xs font-mono text-muted mb-2 uppercase">Lease /mo</label>
                  <input type="number" className="input-base w-full" value={leasePrice} onChange={e => setLeasePrice(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-mono text-muted mb-2 uppercase">Down Payment</label>
                  <input type="number" className="input-base w-full" value={leaseDownPayment} onChange={e => setLeaseDownPayment(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-mono text-muted mb-2 uppercase">Seguro Lease/mo</label>
                  <input type="number" className="input-base w-full" value={insuranceLease} onChange={e => setInsuranceLease(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono text-muted mb-2 uppercase">Plazo Evaluado (Meses)</label>
                <input type="number" className="input-base w-full" value={termMonths} onChange={e => setTermMonths(e.target.value)} />
              </div>
            </div>

            {/* Comparison Table */}
            <div className="bg-bg3 rounded-xl overflow-x-auto border border-border2">
              <div className="min-w-[400px]">
                <table className="w-full text-left text-sm">
                  <thead className="bg-bg2 border-b border-border2">
                    <tr>
                      <th className="p-3 text-muted font-mono uppercase">Métrica ({termMonths}m)</th>
                      <th className="p-3 text-accent font-medium">Compra</th>
                      <th className="p-3 text-accent2 font-medium">Lease</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border2">
                    <tr className="hover:bg-bg/50 transition-colors">
                      <td className="p-3 font-medium text-text">Costo Total Real</td>
                      <td className="p-3 font-mono">{formatCurrency(result3B.purchase.total)}</td>
                      <td className="p-3 font-mono">{formatCurrency(result3B.lease.total)}</td>
                    </tr>
                    <tr className="hover:bg-bg/50 transition-colors">
                      <td className="p-3 font-medium text-text">Costo Mensual Efectivo</td>
                      <td className="p-3 font-mono">{formatCurrency(result3B.purchase.monthly)}</td>
                      <td className="p-3 font-mono">{formatCurrency(result3B.lease.monthly)}</td>
                    </tr>
                    <tr className="hover:bg-bg/50 transition-colors">
                      <td className="p-3 font-medium text-text">Valor Residual (Tuyo)</td>
                      <td className="p-3 font-mono text-green">{formatCurrency(result3B.purchase.residual)}</td>
                      <td className="p-3 font-mono text-muted">{formatCurrency(result3B.lease.residual)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="p-4 bg-bg/50 text-xs text-muted border-t border-border2">
                * Costo Total Real de Compra = Precio + (Seguro × Meses) - Valor Residual (asumido 50%).
                No incluye intereses de préstamo para mantener el baseline simple.
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
