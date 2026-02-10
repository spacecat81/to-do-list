import type { CSSProperties } from 'react'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'rectangular' | 'circular'
  width?: string | number
  height?: string | number
}

export function Skeleton({ className = '', variant = 'text', width, height }: SkeletonProps) {
  const baseClasses = 'relative overflow-hidden bg-md-on-surface/[0.08]'
  
  const variantClasses = {
    text: 'rounded-sm',
    rectangular: 'rounded-md',
    circular: 'rounded-full',
  }

  const style: CSSProperties = {}
  if (width) style.width = typeof width === 'number' ? `${width}px` : width
  if (height) style.height = typeof height === 'number' ? `${height}px` : height
  if (variant === 'text' && !height) style.height = '1em'

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    >
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-md-on-surface/[0.06] to-transparent" />
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="card-outlined p-4 space-y-3">
      <Skeleton variant="text" className="h-5 w-3/4" />
      <Skeleton variant="text" className="h-4 w-full" />
      <Skeleton variant="text" className="h-4 w-1/2" />
      <div className="flex items-center gap-2 pt-1">
        <Skeleton variant="circular" width={14} height={14} />
        <Skeleton variant="text" className="h-3 w-16" />
      </div>
    </div>
  )
}

export function ColumnSkeleton() {
  return (
    <div className="flex flex-col min-w-[320px] max-w-[380px] w-full">
      <div className="flex items-center gap-3 h-14 px-4 rounded-t-lg" style={{ backgroundColor: 'var(--md-surface-container)' }}>
        <Skeleton variant="circular" width={24} height={24} />
        <Skeleton variant="text" className="h-5 w-24" />
        <Skeleton variant="circular" width={24} height={24} />
      </div>
      <div className="p-3 space-y-3 rounded-b-lg min-h-[200px]" style={{ backgroundColor: 'var(--md-surface-container-low)' }}>
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  )
}
