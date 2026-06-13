'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  BedDouble,
  FlaskConical,
  Pill,
  Receipt,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Stethoscope,
  Menu,
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import Image from 'next/image';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/patients', label: 'Patients', icon: Users },
  { href: '/dashboard/appointments', label: 'Appointments', icon: CalendarDays },
  { href: '/dashboard/ipd', label: 'IPD', icon: BedDouble },
  { href: '/dashboard/lab', label: 'Laboratory', icon: FlaskConical },
  { href: '/dashboard/pharmacy', label: 'Pharmacy', icon: Pill },
  { href: '/dashboard/billing', label: 'Billing', icon: Receipt },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

interface Props {
  hospitalName?: string;
  userName?: string;
  userRole?: string;
}

export function HospitalSidebar({ hospitalName = 'City General Hospital', userName = 'Admin', userRole = 'Hospital Admin' }: Props) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile overlay toggle — handled by parent */}
      <aside
        className={cn(
          'relative flex h-screen flex-col bg-white border-r border-gray-200 transition-all duration-200',
          collapsed ? 'w-16' : 'w-64',
        )}
      >
        {/* Logo */}
        <div className={cn('flex items-center border-b border-gray-200 py-4', collapsed ? 'justify-center px-2' : 'px-4 gap-3')}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg shrink-0" style={{ backgroundColor: 'var(--color-primary, #33ABC3)' }}>
            <Stethoscope className="h-4 w-4 text-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="truncate text-sm font-semibold text-gray-900">{hospitalName}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">HMS</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                title={collapsed ? label : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  collapsed && 'justify-center',
                )}
                style={isActive ? { backgroundColor: 'var(--color-primary, #33ABC3)' } : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="truncate">{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className={cn('border-t border-gray-200 p-3', collapsed ? 'flex flex-col items-center gap-2' : '')}>
          {!collapsed && (
            <div className="mb-2 px-1">
              <p className="truncate text-sm font-medium text-gray-900">{userName}</p>
              <p className="text-xs text-gray-400">{userRole}</p>
            </div>
          )}
          <button
            onClick={() => { /* call auth logout */ }}
            title="Logout"
            className={cn(
              'flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors w-full',
              collapsed && 'justify-center',
            )}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="absolute -right-3 top-[72px] z-10 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </aside>
    </>
  );
}