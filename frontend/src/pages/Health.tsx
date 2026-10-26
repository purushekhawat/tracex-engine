import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchHealth, fetchDependencies } from '../api/client';
import { CheckCircle2, XCircle, RefreshCw, Cpu, Server, Database, HardDrive, Network } from 'lucide-react';
import SpecularButton from '../components/SpecularButton';

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
        return <Database className="h-4 w-4 text-[#9a7547]" />;
      case 'neo4j':
        return <Network className="h-4 w-4 text-[#9a7547]" />;
      case 'redis':
        return <HardDrive className="h-4 w-4 text-[#9a7547]" />;
      case 'analytics-service':
        return <Cpu className="h-4 w-4 text-[#9a7547]" />;
      default:
        return <Server className="h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e7ebf2] pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Cpu className="h-6 w-6 text-[#9a7547]" />
            System Infrastructure Health
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Real-time status monitor for Go Backend (`/api/v1/health`) and backing services.
          </p>
        </div>
        <SpecularButton
          onClick={handleRefresh}
          size="xs"
          radius={10}
          tint="#9a7547"
          tintOpacity={1}
          textColor="#ffffff"
          lineColor="#ffffff"
          baseColor="#b48c58"
          intensity={1.5}
          idleIntensity={0.5}
          glow={1.4}
          speed={0.4}
          autoAnimate={true}
          followMouse={true}
          className="font-bold cursor-pointer hover:brightness-110 shadow-xs"
          title="Refresh System Health Status"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh Status</span>
        </SpecularButton>
      </div>

      {/* Backend API Health Card */}
      <div className="glass-card ai-card-bg p-6 space-y-4 !border-[#e7ebf2]">
        <h2 className="text-sm font-bold text-slate-800 tracking-wide uppercase flex items-center gap-2 border-b border-slate-100 pb-2">
          <Server className="h-4 w-4 text-[#9a7547]" /> Core Backend Service (`tracex-backend`)
        </h2>

        {loadingHealth ? (
          <div className="flex items-center gap-2 text-xs text-slate-400 animate-pulse font-medium">
            <RefreshCw className="h-4 w-4 animate-spin text-[#9a7547]" /> Querying /api/v1/health...
          </div>
        ) : healthError ? (
          <div className="p-4 rounded-xl bg-[#fbf7f1] border border-[#9a7547]/30 text-[#9a7547] text-xs flex items-center gap-2 font-medium">
            <XCircle className="h-4 w-4 shrink-0 text-[#9a7547]" />
            <span>Backend unreachable or returned an error: {(healthError as Error).message}</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-[#e7ebf2]">
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Status</div>
              <div className="text-sm font-black text-[#9a7547] flex items-center gap-1.5 mt-1">
                <CheckCircle2 className="h-4 w-4 text-[#9a7547]" /> {health?.status}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-[#e7ebf2]">
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Service Name</div>
              <div className="text-xs font-bold text-slate-800 mt-1">{health?.service}</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-[#e7ebf2]">
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Engine Version</div>
              <div className="text-xs font-bold text-[#9a7547] mt-1">{health?.version}</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-[#e7ebf2]">
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Last Timestamp</div>
              <div className="text-xs text-slate-600 mt-1 truncate font-medium">
                {health?.timestamp}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Backing Dependencies Health Grid */}
      <div className="glass-card ai-card-bg p-6 space-y-4 !border-[#e7ebf2]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
          <h2 className="text-sm font-bold text-slate-800 tracking-wide uppercase flex items-center gap-2">
            <Database className="h-4 w-4 text-[#9a7547]" /> Backing Infrastructure Dependencies (`/api/v1/health/dependencies`)
          </h2>
          {dependencies && (
            <span
              className={`px-3 py-1 rounded-full text-xs uppercase font-bold ${
                dependencies.status === 'healthy'
                  ? 'bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/30'
                  : 'bg-[#fbf7f1] text-[#9a7547] border border-[#9a7547]/30'
              }`}
            >
              Overall: {dependencies.status} (In-Memory Fallback Active)
            </span>
          )}
        </div>

        {loadingDeps ? (
          <div className="flex items-center gap-2 text-xs text-slate-400 animate-pulse font-medium">
            <RefreshCw className="h-4 w-4 animate-spin text-[#9a7547]" /> Probing PostgreSQL, Neo4j, Redis &amp; Analytics...
          </div>
        ) : depsError ? (
          <div className="p-4 rounded-xl bg-[#fbf7f1] border border-[#9a7547]/30 text-[#9a7547] text-xs flex items-center gap-2 font-medium">
            <XCircle className="h-4 w-4 shrink-0 text-[#9a7547]" />
            <span>Failed to check dependencies: {(depsError as Error).message}</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dependencies?.dependencies.map((dep) => (
              <div
                key={dep.name}
                className="p-4 rounded-xl bg-slate-50 border border-[#e7ebf2] flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-white border border-[#e7ebf2] mt-0.5 shadow-2xs">
                    {getDepIcon(dep.name)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 capitalize">
                      {dep.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                      {dep.details || 'No details reported'}
                    </p>
                  </div>
                </div>
                <div>
                  {dep.status === 'healthy' ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#d1fae5] text-[#065f46] text-xs font-bold">
                      <CheckCircle2 className="h-3 w-3" /> Healthy
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-xs font-bold">
                      Standby
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
