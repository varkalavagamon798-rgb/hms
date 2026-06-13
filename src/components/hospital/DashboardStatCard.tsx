import { cn } from '@/src/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  label: string;
  value: string | number;
  icon: LucideIcon;
  delta?: number; // positive = up, negative = down
  deltaLabel?: string;
  accent?: boolean;
  subtext?: string;
}

export function DashboardStatCard({ label, value, icon: Icon, delta, deltaLabel, accent, subtext }: Props) {
  const isPositive = delta !== undefined && delta >= 0;

  return (
    <div className={cn('rounded-xl border bg-white p-5 shadow-sm', accent && 'border-transparent text-white')}
      style={accent ? { backgroundColor: 'var(--color-primary, #33ABC3)' } : undefined}>
      <div className="flex items-start justify-between">
        <div>
          <p className={cn('text-xs font-medium uppercase tracking-wide', accent ? 'text-white/70' : 'text-gray-500')}>{label}</p>
          <p className={cn('mt-1 text-2xl font-bold', accent ? 'text-white' : 'text-gray-900')}>{value}</p>
          {subtext && <p className={cn('text-xs mt-0.5', accent ? 'text-white/60' : 'text-gray-400')}>{subtext}</p>}
        </div>
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', accent ? 'bg-white/20' : 'bg-gray-50')}>
          <Icon className={cn('h-5 w-5', accent ? 'text-white' : 'text-gray-600')} style={!accent ? { color: 'var(--color-primary, #33ABC3)' } : undefined} />
        </div>
      </div>
      {delta !== undefined && (
        <div className={cn('mt-3 flex items-center gap-1 text-xs font-medium', accent ? 'text-white/80' : isPositive ? 'text-emerald-600' : 'text-red-500')}>
          {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          <span>{Math.abs(delta)}% {deltaLabel ?? 'vs yesterday'}</span>
        </div>
      )}
    </div>
  );
}