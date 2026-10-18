import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchHealth, fetchDependencies } from '../api/client';
import { CheckCircle2, XCircle, RefreshCw, Cpu, Server, Database, HardDrive, Network } from 'lucide-react';

export const HealthPage: React.FC = () => {
  const {
    data: health,
    isLoading: loadingHealth,
    error: healthError,
    refetch: refetchHealth,
  } = useQuery({
    queryKey: ['health'],
    queryFn: fetchHealth,
    refetchInterval: 10000,
  });

  const {
    data: dependencies,
    isLoading: loadingDeps,
    error: depsError,
    refetch: refetchDeps,
  } = useQuery({
    queryKey: ['dependencies'],
    queryFn: fetchDependencies,
    refetchInterval: 10000,
  });

  const handleRefresh = () => {
    refetchHealth();
    refetchDeps();
  };

  const getDepIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'postgresql':
        return <Database className="h-4 w-4 text-blue-500" />;
      case 'neo4j':
        return <Network className="h-4 w-4 text-cyan-500" />;
      case 'redis':
        return <HardDrive className="h-4 w-4 text-rose-500" />;
      case 'analytics-service':
        return <Cpu className="h-4 w-4 text-emerald-500" />;
      default:
        return <Server className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Cpu className="h-6 w-6 text-blue-500" />
            System Infrastructure Health
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time status monitor for Go Backend (`/api/v1/health`) and backing services.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-700 transition border border-slate-200"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh Status
        </button>
      </div>

      {/* Backend API Health Card */}
      <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-6 space-y-4">
        <h2 className="text-sm font-semibold text-slate-700 tracking-wide uppercase font-mono flex items-center gap-2">
          <Server className="h-4 w-4 text-blue-500" /> Core Backend Service (`tracex-backend`)
        </h2>

        {loadingHealth ? (
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 animate-pulse">
            <RefreshCw className="h-4 w-4 animate-spin" /> Querying /api/v1/health...
          </div>
        ) : healthError ? (
          <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-xs font-mono flex items-center gap-2">
            <XCircle className="h-4 w-4 shrink-0" />
            <span>Backend unreachable or returned an error: {(healthError as Error).message}</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-400 font-mono uppercase">Status</div>
              <div className="text-sm font-bold text-emerald-600 flex items-center gap-1.5 mt-0.5">
                <CheckCircle2 className="h-4 w-4" /> {health?.status}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-400 font-mono uppercase">Service Name</div>
              <div className="text-xs font-mono text-slate-700 mt-1">{health?.service}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-400 font-mono uppercase">Engine Version</div>
              <div className="text-xs font-mono text-blue-600 mt-1">{health?.version}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-400 font-mono uppercase">Last Timestamp</div>
              <div className="text-[10px] font-mono text-slate-500 mt-1 truncate">
                {health?.timestamp}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Backing Dependencies Health Grid */}
      <div className="rounded-xl bg-white border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700 tracking-wide uppercase font-mono flex items-center gap-2">
            <Database className="h-4 w-4 text-cyan-500" /> Backing Infrastructure Dependencies (`/api/v1/health/dependencies`)
          </h2>
          {dependencies && (
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-mono uppercase border ${
                dependencies.status === 'healthy'
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                  : 'bg-amber-50 text-amber-600 border-amber-200'
              }`}
            >
              Overall: {dependencies.status}
            </span>
          )}
        </div>

        {loadingDeps ? (
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 animate-pulse">
            <RefreshCw className="h-4 w-4 animate-spin" /> Probing PostgreSQL, Neo4j, Redis &amp; Analytics...
          </div>
        ) : depsError ? (
          <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-600 text-xs font-mono flex items-center gap-2">
            <XCircle className="h-4 w-4 shrink-0" />
            <span>Failed to check dependencies: {(depsError as Error).message}</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dependencies?.dependencies.map((dep) => (
              <div
                key={dep.name}
                className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-md bg-white border border-slate-200 mt-0.5">
                    {getDepIcon(dep.name)}
                  </div>
                  <div>
                    <h4 className="text-xs font-mono font-semibold text-slate-700 capitalize">
                      {dep.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {dep.details || 'No details reported'}
                    </p>
                  </div>
                </div>
                <div>
                  {dep.status === 'healthy' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-mono">
                      <CheckCircle2 className="h-3 w-3" /> Healthy
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-200 text-[10px] font-mono">
                      <XCircle className="h-3 w-3" /> Offline / Standby
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
