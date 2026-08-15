import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, AlertTriangle, ShieldCheck, Terminal, CreditCard, LogIn } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Sidebar: React.FC = () => {
  const navItems = [
    { to: '/', label: 'Monitors', icon: <Activity size={18} /> },
    { to: '/incidents', label: 'Incidents', icon: <AlertTriangle size={18} /> },
    { to: '/status-pages', label: 'Status Pages', icon: <ShieldCheck size={18} /> },
    { to: '/logs', label: 'Log Explorer', icon: <Terminal size={18} /> },
    { to: '/billing', label: 'Billing', icon: <CreditCard size={18} /> },
  ];

  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col justify-between p-4 selection:bg-zinc-800">
      <div>
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="h-9 w-9 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-950 shadow">
            <Activity size={20} strokeWidth={2.5} />
          </div>
          <div>
            <span className="font-bold text-base text-zinc-100 tracking-tight block">BetterPulse</span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Uptime Suite</span>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all',
                  isActive
                    ? 'bg-zinc-900 text-zinc-100 border border-zinc-800 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50'
                )
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="pt-4 border-t border-zinc-900 px-2">
        <NavLink
          to="/login"
          className="flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-100 transition-colors py-2"
        >
          <LogIn size={15} />
          <span>Switch Account / Sign In</span>
        </NavLink>
      </div>
    </aside>
  );
};
