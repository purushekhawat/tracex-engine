import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { VASPIntelligenceDashboard } from './pages/VASPIntelligenceDashboard';
import { CrossChainTracePage } from './pages/CrossChainTracePage';
import { MLAlgorithmResearch } from './pages/MLAlgorithmResearch';
import { CasesList } from './pages/CasesList';
import { CaseDetail } from './pages/CaseDetail';
import { InvestigationView } from './pages/InvestigationView';
import { ReportsPage } from './pages/ReportsPage';
import { HealthPage } from './pages/Health';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* Primary Requested Permalinks */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/vasp-intelligence" element={<VASPIntelligenceDashboard />} />
            <Route path="/dashboard/cross-chain-trace" element={<CrossChainTracePage />} />
            <Route path="/research/ml-algorithm" element={<MLAlgorithmResearch />} />

            {/* Root Route -> Command Center */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Case Management & Investigation Views */}
            <Route path="/cases" element={<CasesList />} />
            <Route path="/cases/:id" element={<CaseDetail />} />
            <Route path="/investigations/:id" element={<InvestigationView />} />
            <Route path="/investigations/:id/graph" element={<InvestigationView />} />
            <Route path="/investigations/:id/evidence" element={<InvestigationView />} />
            <Route path="/investigations/:id/attribution" element={<InvestigationView />} />
            <Route path="/investigations/:id/risk" element={<InvestigationView />} />
            <Route path="/investigations/:id/copilot" element={<InvestigationView />} />
            <Route path="/investigations/:id/reports" element={<InvestigationView />} />
            <Route path="/investigations/:id/sahyog" element={<InvestigationView />} />

            {/* Reports & System Health */}
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/health" element={<HealthPage />} />

            {/* Catch-all redirect to /dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
