'use client'

import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts'
import { TrendingUp, Shield, AlertTriangle } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

interface Props {
  score: number
  orgName: string
}

function getScoreColor(score: number) {
  if (score >= 80) return '#22c55e'
  if (score >= 50) return '#f59e0b'
  return '#f43f5e'
}

function getScoreLabel(score: number) {
  if (score >= 80) return { text: 'Conforme', icon: Shield, color: 'text-success-600 dark:text-success-500' }
  if (score >= 50) return { text: 'Em Progresso', icon: TrendingUp, color: 'text-warning-600 dark:text-warning-500' }
  return { text: 'Atenção Requerida', icon: AlertTriangle, color: 'text-danger-600 dark:text-danger-500' }
}

export default function ComplianceScoreCard({ score, orgName }: Props) {
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const currentTheme = theme === 'system' ? systemTheme : theme

  useEffect(() => {
    setMounted(true)
  }, [])

  const color = getScoreColor(score)
  const { text, icon: Icon, color: textColor } = getScoreLabel(score)

  const chartData = [{ name: 'score', value: score, fill: color }]
  
  // RadialBarChart relies on string values for fill. We wait until mount for accurate theme
  const chartBgFill = mounted && currentTheme === 'light' ? '#e2e8f0' : '#1e293b'

  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Score de Conformidade</h2>
        <span className={`flex items-center gap-1.5 text-xs font-medium ${textColor}`}>
          <Icon size={14} />
          {text}
        </span>
      </div>

      {/* Radial Chart */}
      <div className="flex-1 flex items-center justify-center min-h-[200px] relative">
        <ResponsiveContainer width="100%" height={200}>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="70%"
            outerRadius="90%"
            barSize={12}
            data={chartData}
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              background={{ fill: chartBgFill }}
              dataKey="value"
              cornerRadius={6}
              angleAxisId={0}
            />
          </RadialBarChart>
        </ResponsiveContainer>

        {/* Center text overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-4xl font-black" style={{ color }}>
            {score}
          </span>
          <span className="text-xs text-slate-600 dark:text-slate-500 font-medium mt-0.5">de 100 pts</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800/60">
        <p className="text-xs text-slate-600 dark:text-slate-500 text-center">
          Score calculado com base nas respostas do onboarding e documentos enviados.
        </p>
      </div>
    </div>
  )
}
