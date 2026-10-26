import React from 'react';
import { FileText } from 'lucide-react';
import { DemoBadge } from '../components/DemoBadge';
import { ReportViewer } from '../components/ReportViewer';

export const ReportsPage: React.FC = () => {
  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e7ebf2] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <FileText className="h-6 w-6 text-[#9a7547]" />
              Court-Admissible Forensic Reports
            </h1>
            <DemoBadge />
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Generate and export cryptographically signed 14-section investigation packages for law enforcement prosecution.
          </p>
        </div>
      </div>

      {/* Main Report Viewer */}
      <ReportViewer investigationId="i1111111-1111-1111-1111-111111111111" />
    </div>
  );
};
