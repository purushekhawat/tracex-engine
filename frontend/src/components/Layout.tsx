import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ShieldAlert,
  Activity,
  FolderGit2,
  FileText,
  Cpu,
  CheckCircle2,
  Building2,
  Network,
  Brain,
} from 'lucide-react';
import { DemoLoaderModal } from './DemoLoaderModal';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { label: 'Command Center', path: '/dashboard', icon: Activity, exact: true },
    { label: 'VASP Intelligence', path: '/dashboard/vasp-intelligence', icon: Building2 },
    { label: 'Cross-Chain Trace', path: '/dashboard/cross-chain-trace', icon: Network },
    { label: 'ML Algorithm', path: '/research/ml-algorithm', icon: Brain },
    { label: 'Cases', path: '/cases', icon: FolderGit2 },
    { label: 'Reports', path: '/reports', icon: FileText },
    { label: 'Health', path: '/health', icon: Cpu },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800">
      {/* Top Header */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur sticky top-0 z-50 px-6 py-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-wider text-slate-800">TRACE-X</span>
                <span className="px-2 py-0.5 text-xs font-mono bg-blue-50 text-blue-600 border border-blue-200 rounded">
                  SIH 26182
                </span>
              </div>
              <p className="text-xs text-slate-500">Explainable Cross-Chain VASP Attribution Engine</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.exact
              ? location.pathname === item.path || location.pathname === '/'
              : location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);

            return (
              <Link
                key={item.label}
                to={item.path}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                  active
                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Badges */}
        <div className="flex items-center gap-3">
          <DemoLoaderModal buttonStyle="header" />
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-mono">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>LEA Investigator Ready</span>
          </div>
          <div className="text-xs font-mono text-slate-400 border-l border-slate-200 pl-3 hidden sm:block">
            LEA Auth: <span className="text-blue-600 font-semibold">INSPECTOR_SHARMA</span>
          </div>
        </div>
      </header>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden flex items-center gap-1 overflow-x-auto px-4 py-2 bg-slate-50 border-b border-slate-200">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.exact
            ? location.pathname === item.path || location.pathname === '/'
            : location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`px-2.5 py-1 rounded text-[11px] font-mono shrink-0 flex items-center gap-1 ${
                active ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <Icon className="h-3 w-3" />
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-400">
        TRACE-X Forensic Platform &copy; 2026 SIH 26182 &bull; Law Enforcement Lawful Intelligence System &bull; Read-Only / Non-Custodial
      </footer>
    </div>
  );
};
