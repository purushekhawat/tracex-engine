import React from 'react';
import { Tag } from 'lucide-react';

interface DemoBadgeProps {
  label?: string;
}

export const DemoBadge: React.FC<DemoBadgeProps> = ({ label = 'DEMO - SYNTHETIC DATASET' }) => {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#fbf7f1] border border-[#9a7547]/30 text-[#9a7547] text-[10px] font-mono tracking-wider uppercase font-semibold">
      <Tag className="h-3 w-3" />
      {label}
    </span>
  );
};
