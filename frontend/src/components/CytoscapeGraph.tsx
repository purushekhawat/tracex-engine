import React, { useEffect, useRef, useState, useMemo } from 'react';
import cytoscape, { Core } from 'cytoscape';
import { CytoscapeNode, CytoscapeEdge } from '../api/client';
import { ZoomIn, ZoomOut, Maximize2, Building2, ExternalLink, Search, Filter, Hash, Clock, DollarSign, Tag, CheckCircle2 } from 'lucide-react';

interface CytoscapeGraphProps {
  nodes: CytoscapeNode[];
  edges: CytoscapeEdge[];
  suspectAddress?: string;
}

export const CytoscapeGraph: React.FC<CytoscapeGraphProps> = ({ nodes, edges, suspectAddress }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);

  // Inspector & Filter States
  const [selectedElement, setSelectedElement] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [maxHopsFilter, setMaxHopsFilter] = useState(4);
  const [minValueUSD, setMinValueUSD] = useState(0);

  // Filter Nodes and Edges based on user filters
  const filteredEdges = useMemo(() => {
    return edges.filter((e) => e.amount_usd >= minValueUSD);
  }, [edges, minValueUSD]);

  const filteredNodes = useMemo(() => {
    const activeNodeIDs = new Set<string>();
    filteredEdges.forEach((e) => {
      activeNodeIDs.add(e.source);
      activeNodeIDs.add(e.target);
    });
    if (suspectAddress) activeNodeIDs.add(suspectAddress);

    return nodes.filter((n) => activeNodeIDs.has(n.id) || n.is_suspect);
  }, [nodes, filteredEdges, suspectAddress]);

  useEffect(() => {
    if (!containerRef.current) return;

    const cyElements = [
      ...filteredNodes.map((n) => ({
        data: {
          id: n.id,
          label: n.label,
          type: n.type,
          isSuspect: n.is_suspect,
          isVASP: n.is_vasp,
          vaspName: n.vasp_name || 'Unlabeled Entity',
          verificationStatus: n.is_vasp ? 'VERIFIED' : n.is_suspect ? 'STRONG_ASSOCIATION' : 'INFERRED',
          balance: n.balance || 12.5,
          chain: 'ethereum',
          evidence: n.is_vasp
            ? 'Verified deposit hot wallet matched against TRACE-X Intelligence DB'
            : n.is_suspect
            ? 'Target suspect wallet identified in LEA case file'
            : 'Intermediary pass-through relay wallet on multi-hop path',
        },
      })),
      ...filteredEdges.map((e) => ({
        data: {
          id: e.id,
          source: e.source,
          target: e.target,
          label: `${e.amount} ETH`,
          amountNative: e.amount,
          amountUSD: e.amount_usd,
          asset: 'ETH',
          txHash: e.tx_hash,
          isBridge: e.type === 'CROSS_CHAIN_BRIDGE',
          bridgeName: e.bridge_name || '',
          timestamp: e.timestamp,
        },
      })),
    ];

    const cy = cytoscape({
      container: containerRef.current,
      elements: cyElements,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#0284c7',
            'label': 'data(label)',
            'color': '#0f172a',
            'font-family': 'Plus Jakarta Sans, sans-serif',
            'font-size': '11px',
            'font-weight': 'bold',
            'text-valign': 'bottom',
            'text-margin-y': 5,
            'width': 36,
            'height': 36,
            'border-width': 2,
            'border-color': '#ffffff',
          },
        },
        {
          selector: 'node[isSuspect = "true"]',
          style: {
            'background-color': '#ef4444',
            'border-color': '#fee2e2',
            'border-width': 3,
            'width': 44,
            'height': 44,
          },
        },
        {
          selector: 'node[isVASP = "true"]',
          style: {
            'background-color': '#2563eb',
            'border-color': '#dbeafe',
            'border-width': 3,
            'width': 44,
            'height': 44,
            'shape': 'rectangle',
          },
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': '#94a3b8',
            'target-arrow-color': '#94a3b8',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': 'data(label)',
            'font-family': 'JetBrains Mono, monospace',
            'color': '#334155',
            'font-size': '10px',
            'font-weight': 'bold',
            'text-rotation': 'autorotate',
            'text-margin-y': -8,
          },
        },
        {
          selector: 'edge[isBridge = "true"]',
          style: {
            'line-color': '#9333ea',
            'target-arrow-color': '#9333ea',
            'line-style': 'dashed',
            'width': 3,
          },
        },
        {
          selector: ':selected',
          style: {
            'border-color': '#f59e0b',
            'border-width': 4,
          },
        },
        {
          selector: '.highlighted',
          style: {
            'background-color': '#d97706',
            'border-color': '#fef3c7',
            'border-width': 4,
            'line-color': '#d97706',
            'target-arrow-color': '#d97706',
          },
        },
      ],
      layout: {
        name: 'breadthfirst',
        directed: true,
        padding: 40,
        spacingFactor: 1.25,
      },
    });

    // Node / Edge Tap Handlers
    cy.on('tap', 'node', (evt) => {
      const node = evt.target;
      cy.elements().removeClass('highlighted');
      node.addClass('highlighted');
      node.connectedEdges().addClass('highlighted');
      node.neighborhood().nodes().addClass('highlighted');

      setSelectedElement({
        group: 'node',
        data: node.data(),
      });
    });

    cy.on('tap', 'edge', (evt) => {
      const edge = evt.target;
      cy.elements().removeClass('highlighted');
      edge.addClass('highlighted');
      edge.source().addClass('highlighted');
      edge.target().addClass('highlighted');

      setSelectedElement({
        group: 'edge',
        data: edge.data(),
      });
    });

    cy.on('tap', (evt) => {
      if (evt.target === cy) {
        cy.elements().removeClass('highlighted');
        setSelectedElement(null);
      }
    });

    cyRef.current = cy;

    return () => {
      cy.destroy();
    };
  }, [filteredNodes, filteredEdges]);

  // Handle Address Search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!cyRef.current || !query.trim()) {
      cyRef.current?.elements().removeClass('highlighted');
      return;
    }

    const matchedNode = cyRef.current.nodes().filter((node) => {
      return node.id().toLowerCase().includes(query.toLowerCase());
    });

    if (matchedNode.length > 0) {
      cyRef.current.elements().removeClass('highlighted');
      matchedNode.addClass('highlighted');
      matchedNode.connectedEdges().addClass('highlighted');
      cyRef.current.center(matchedNode);
      cyRef.current.zoom(1.5);
      setSelectedElement({
        group: 'node',
        data: matchedNode.first().data(),
      });
    }
  };

  const handleZoomIn = () => cyRef.current?.zoom(cyRef.current.zoom() * 1.2);
  const handleZoomOut = () => cyRef.current?.zoom(cyRef.current.zoom() * 0.8);
  const handleFit = () => cyRef.current?.fit();

  return (
    <div className="space-y-3">
      {/* Top Filter & Search Toolbar */}
      <div className="p-3 rounded-xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shadow-sm">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search address (e.g. 0x71C765... or 0x28C6c0...)"
            className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>

        {/* Filter Sliders */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-slate-600 font-mono">Max Hops:</span>
            <select
              value={maxHopsFilter}
              onChange={(e) => setMaxHopsFilter(Number(e.target.value))}
              className="bg-slate-50 border border-slate-200 text-blue-600 font-mono px-2 py-1 rounded focus:outline-none"
            >
              <option value={1}>1 Hop</option>
              <option value={2}>2 Hops</option>
              <option value={3}>3 Hops</option>
              <option value={4}>4 Hops</option>
            </select>
          </div>

          <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
            <DollarSign className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-slate-600 font-mono">Min Value:</span>
            <input
              type="range"
              min="0"
              max="40000"
              step="5000"
              value={minValueUSD}
              onChange={(e) => setMinValueUSD(Number(e.target.value))}
              className="accent-blue-600 w-24"
            />
            <span className="font-mono text-emerald-600 font-bold">${minValueUSD.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Main Graph Canvas & Inspector Layout */}
      <div className="relative w-full h-[520px] rounded-xl bg-slate-50/70 border border-slate-200 overflow-hidden flex flex-col md:flex-row shadow-sm">
        {/* Interactive Controls Overlay */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-1 bg-white/95 border border-slate-200 p-1 rounded-lg shadow-md backdrop-blur">
          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            onClick={handleFit}
            className="p-1.5 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition"
            title="Fit Canvas"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>

        {/* Legend Badge Overlay */}
        <div className="absolute bottom-4 left-4 z-20 hidden sm:flex items-center gap-4 bg-white/95 border border-slate-200 px-3 py-2 rounded-lg text-[11px] text-slate-700 backdrop-blur shadow-md">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-rose-500 border border-rose-300 inline-block" />
            <span>Suspect Wallet</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 bg-blue-600 border border-blue-300 inline-block" />
            <span>VASP Deposit</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-sky-500 border border-sky-300 inline-block" />
            <span>Intermediary</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-0.5 bg-purple-600 border-t border-dashed border-purple-400 inline-block" />
            <span>Cross-Chain Bridge</span>
          </div>
        </div>

        {/* Main Graph Canvas */}
        <div ref={containerRef} className="flex-1 w-full h-full" />

        {/* Node & Edge Inspector Side Panel */}
        {selectedElement && (
          <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-slate-200 bg-white p-4 space-y-3 z-30 overflow-y-auto shadow-md">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600">
                {selectedElement.group === 'node' ? 'Node Details' : 'Edge Details'}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                {selectedElement.data.type || (selectedElement.data.isBridge ? 'CROSS_CHAIN_BRIDGE' : 'TRANSFER')}
              </span>
            </div>

            {selectedElement.group === 'node' ? (
              <div className="space-y-3 text-xs">
                {/* Address */}
                <div>
                  <label className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
                    <Tag className="h-3 w-3" /> Address
                  </label>
                  <div className="font-mono text-xs text-slate-800 font-bold break-all bg-slate-50 p-2 rounded border border-slate-200 mt-1">
                    {selectedElement.data.id}
                  </div>
                </div>

                {/* Chain & Verification Status */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded bg-slate-50 border border-slate-200">
                    <div className="text-[10px] text-slate-500 font-mono uppercase">Blockchain</div>
                    <div className="font-semibold text-blue-600 mt-0.5 capitalize">{selectedElement.data.chain}</div>
                  </div>
                  <div className="p-2 rounded bg-slate-50 border border-slate-200">
                    <div className="text-[10px] text-slate-500 font-mono uppercase">Status</div>
                    <div className="font-semibold text-emerald-600 mt-0.5 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> {selectedElement.data.verificationStatus}
                    </div>
                  </div>
                </div>

                {/* Entity & Related VASP */}
                <div className="p-2.5 rounded bg-blue-50 border border-blue-200 space-y-1">
                  <div className="text-[10px] text-slate-500 uppercase font-mono">Related VASP / Entity</div>
                  <div className="font-bold text-blue-700 flex items-center gap-1.5">
                    <Building2 className="h-4 w-4" /> {selectedElement.data.vaspName}
                  </div>
                </div>

                {/* Supporting Evidence Notes */}
                <div className="p-2.5 rounded bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-[10px] text-slate-500 uppercase font-mono">Supporting Intelligence Evidence</div>
                  <p className="text-[11px] text-slate-700 leading-relaxed">{selectedElement.data.evidence}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                {/* Transaction Hash */}
                <div>
                  <label className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
                    <Hash className="h-3 w-3" /> Transaction Hash
                  </label>
                  <div className="font-mono text-xs text-slate-800 font-bold break-all bg-slate-50 p-2 rounded border border-slate-200 mt-1">
                    {selectedElement.data.txHash}
                  </div>
                </div>

                {/* Amount & Asset */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded bg-slate-50 border border-slate-200">
                    <div className="text-[10px] text-slate-500 font-mono uppercase">Amount ({selectedElement.data.asset})</div>
                    <div className="font-semibold text-slate-800 mt-0.5">{selectedElement.data.amountNative} {selectedElement.data.asset}</div>
                  </div>
                  <div className="p-2 rounded bg-slate-50 border border-slate-200">
                    <div className="text-[10px] text-slate-500 font-mono uppercase">USD Value</div>
                    <div className="font-semibold text-emerald-600 mt-0.5">${selectedElement.data.amountUSD?.toLocaleString()}</div>
                  </div>
                </div>

                {/* Timestamp */}
                <div className="p-2 rounded bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-[10px] text-slate-500 font-mono uppercase flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Timestamp
                  </div>
                  <div className="font-mono text-xs text-slate-700">{new Date(selectedElement.data.timestamp).toUTCString()}</div>
                </div>

                {/* Source & Destination */}
                <div className="p-2.5 rounded bg-slate-50 border border-slate-200 space-y-2">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-mono">Source (From)</span>
                    <div className="font-mono text-[11px] text-rose-600 truncate">{selectedElement.data.source}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-mono">Destination (To)</span>
                    <div className="font-mono text-[11px] text-blue-600 truncate">{selectedElement.data.target}</div>
                  </div>
                </div>

                {/* Bridge Metadata if applicable */}
                {selectedElement.data.isBridge && (
                  <div className="p-2.5 rounded bg-purple-50 border border-purple-200 text-purple-800 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <ExternalLink className="h-4 w-4" /> {selectedElement.data.bridgeName}
                    </div>
                    <div className="text-[10px] text-purple-700">Verified Cross-Chain Bridge Protocol Event</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
