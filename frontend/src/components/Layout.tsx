import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Activity,
  FolderGit2,
  FileText,
  Cpu,
  Building2,
  Network,
  Brain,
  User,
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

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
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md py-2.5 px-4 sm:px-6 lg:px-8 flex justify-between items-center border-b border-[#e7ebf2] shadow-xs gap-3">
        {/* Brand Header */}
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/dashboard" className="flex flex-col group">
            <span className="font-extrabold text-base tracking-wider text-[#9a7547] uppercase leading-tight">
              TRACE-X
            </span>
            <p className="text-[11px] text-slate-500 font-medium">Explainable Cross-Chain VASP Attribution</p>
          </Link>
        </div>

        {/* Central Navigation Pills with Active Styling */}
        <nav className="hidden xl:flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.exact
              ? location.pathname === item.path || location.pathname === '/'
              : location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);

            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all shrink-0 border ${
                  active
                    ? 'bg-[#fbf7f1] text-[#9a7547] border-[#9a7547]/35 shadow-2xs'
                    : 'bg-white hover:bg-slate-50 text-slate-600 border-[#e7ebf2] hover:border-slate-300'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${active ? 'text-[#9a7547]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {active && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9a7547] ml-0.5" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right User Profile Section */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 text-xs">
          {/* Law Enforcement Avatar Display */}
          <div
            className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl bg-white border border-[#e7ebf2] shadow-2xs cursor-default select-none"
            title="Law Enforcement Admin Desk"
          >
            <div className="w-8 h-8 rounded-full bg-white border border-slate-300 flex items-center justify-center font-bold relative shadow-2xs shrink-0">
              <User className="w-4 h-4 text-slate-700" />
              <span className="absolute -bottom-1 -right-1 text-xs leading-none" title="India">
                🇮🇳
              </span>
            </div>

            <div className="hidden md:flex flex-col text-left">
              <div className="flex items-center gap-1 leading-tight">
                <span className="text-xs font-bold text-slate-900">LE Admin</span>
                <span className="text-xs">🇮🇳</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Inspector Sharma &bull; {timeStr}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sub-Navigation Bar */}
      <div className="xl:hidden flex items-center gap-1.5 overflow-x-auto px-4 py-2 bg-slate-50 border-b border-[#e7ebf2] no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.exact
            ? location.pathname === item.path || location.pathname === '/'
            : location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 flex items-center gap-1.5 border whitespace-nowrap transition-all ${
                active
                  ? 'bg-[#fbf7f1] text-[#9a7547] border-[#9a7547]/35 shadow-2xs'
                  : 'bg-white text-slate-600 border-[#e7ebf2] hover:bg-slate-100'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Main Content Area - Full Width Canvas */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
};
