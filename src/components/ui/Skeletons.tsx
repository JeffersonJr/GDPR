'use client'

import { clsx } from 'clsx'

// ---- Base shimmer animation ----
function Shimmer({ className }: { className?: string }) {
  return (
    <div className={clsx(
      'relative overflow-hidden bg-slate-800/60 rounded-xl',
      'before:absolute before:inset-0 before:-translate-x-full',
      'before:bg-gradient-to-r before:from-transparent before:via-slate-700/30 before:to-transparent',
      'before:animate-[shimmer_1.5s_infinite]',
      className
    )} />
  )
}

// ---- Dashboard skeleton ----
export function DashboardSkeleton() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <Shimmer className="h-8 w-52 rounded-xl" />
        <Shimmer className="h-4 w-72 rounded-lg" />
      </div>

      {/* Top grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Score card */}
        <div className="glass-card p-6 flex flex-col items-center gap-4">
          <Shimmer className="h-4 w-32 rounded-lg" />
          <Shimmer className="w-28 h-28 rounded-full" />
          <Shimmer className="h-4 w-20 rounded-lg" />
          <div className="w-full space-y-1.5">
            <div className="flex justify-between">
              <Shimmer className="h-3 w-16 rounded" />
              <Shimmer className="h-3 w-10 rounded" />
            </div>
            <Shimmer className="h-1.5 w-full rounded-full" />
          </div>
        </div>

        {/* Stat cards */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass-card p-5 flex items-start gap-4">
              <Shimmer className="w-10 h-10 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <Shimmer className="h-7 w-12 rounded-lg" />
                <Shimmer className="h-3 w-full rounded" />
                <Shimmer className="h-3 w-3/4 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[...Array(2)].map((_, i) => (
          <Shimmer key={i} className="h-20 rounded-2xl" />
        ))}
      </div>

      {/* Documents table */}
      <div className="glass-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/60">
          <div className="space-y-2">
            <Shimmer className="h-5 w-52 rounded-lg" />
            <Shimmer className="h-3 w-40 rounded" />
          </div>
          <Shimmer className="h-8 w-28 rounded-xl" />
        </div>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-slate-800/50 last:border-0">
            <Shimmer className="w-9 h-9 rounded-xl shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Shimmer className="h-4 w-48 rounded-lg" />
              <Shimmer className="h-3 w-24 rounded" />
            </div>
            <Shimmer className="h-6 w-24 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

// ---- Document page skeleton ----
export function DocumentSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center gap-3">
        <Shimmer className="h-8 w-8 rounded-xl" />
        <Shimmer className="h-6 w-56 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="glass-card p-6 space-y-4">
            <Shimmer className="h-5 w-32 rounded-lg" />
            <div className="space-y-2">
              {[...Array(8)].map((_, j) => (
                <Shimmer key={j} className={`h-3 rounded ${j % 3 === 2 ? 'w-3/4' : 'w-full'}`} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---- Onboarding skeleton ----
export function OnboardingSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <Shimmer className="w-8 h-8 rounded-full shrink-0" />
              {i < 4 && <Shimmer className="flex-1 h-0.5 rounded-full" />}
            </div>
          ))}
        </div>
        <Shimmer className="h-1.5 w-full rounded-full" />
        <div className="space-y-1">
          <Shimmer className="h-6 w-40 rounded-xl" />
          <Shimmer className="h-4 w-56 rounded-lg" />
        </div>
      </div>
      <div className="glass-card p-7 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-1.5">
            <Shimmer className="h-4 w-28 rounded-lg" />
            <Shimmer className="h-12 w-full rounded-xl" />
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <Shimmer className="h-12 flex-1 rounded-xl" />
      </div>
    </div>
  )
}

// ---- Settings skeleton ----
export function SettingsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse max-w-2xl">
      <div className="space-y-1">
        <Shimmer className="h-7 w-48 rounded-xl" />
        <Shimmer className="h-4 w-72 rounded-lg" />
      </div>
      <div className="glass-card p-6 space-y-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-1.5">
            <Shimmer className="h-4 w-24 rounded-lg" />
            <Shimmer className="h-11 w-full rounded-xl" />
          </div>
        ))}
        <Shimmer className="h-11 w-36 rounded-xl" />
      </div>
    </div>
  )
}

// ---- Inline table row skeleton ----
export function TableRowSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <>
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-slate-800/50 last:border-0 animate-pulse">
          <Shimmer className="w-9 h-9 rounded-xl shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Shimmer className={`h-4 rounded-lg ${i % 2 === 0 ? 'w-44' : 'w-56'}`} />
            <Shimmer className="h-3 w-20 rounded" />
          </div>
          <Shimmer className="h-6 w-24 rounded-full" />
        </div>
      ))}
    </>
  )
}
