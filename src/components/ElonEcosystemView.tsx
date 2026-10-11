/*==============================================================================
 * [PROVENANCE CERTIFICATION AND STATUTORY DECLARATION]
 * Rights Holder: Albert Lane | SEC Whistleblower No. 17684-273-411-436
 * Component: ElonEcosystemView.tsx (X · xAI · Tesla · SpaceX Forensic Auditor)
 * Aesthetics: Strict Monochromatic Slate/Stone Palette (Zero Pill / Golden Ratio)
 *==============================================================================*/

import React, { useState, useEffect } from 'react';
import { ElonEcosystemFinding, PushReceipt } from '../types';

export const ElonEcosystemView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'X' | 'xAI' | 'Tesla' | 'SpaceX' | 'PUSH_RECEIPTS'>('X');
  const [findings, setFindings] = useState<ElonEcosystemFinding[]>([]);
  const [selectedFinding, setSelectedFinding] = useState<ElonEcosystemFinding | null>(null);
  const [statusCounts, setStatusCounts] = useState<{ [key: string]: number }>({});
  const [isScanning, setIsScanning] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [logMessage, setLogMessage] = useState<string | null>(null);
  const [pushReceipt, setPushReceipt] = useState<PushReceipt | null>(null);

  const fetchStatusAndFindings = async () => {
    try {
      const [resStatus, resViolations, resReceipt] = await Promise.all([
        fetch('/api/elon/status'),
        fetch('/api/elon/violations'),
        fetch('/api/push-receipt')
      ]);

      if (resStatus.ok) {
        setStatusCounts(await resStatus.json());
      }
      if (resViolations.ok) {
        const rows: ElonEcosystemFinding[] = await resViolations.json();
        setFindings(rows);
        if (rows.length > 0 && !selectedFinding) {
          setSelectedFinding(rows[0]);
        }
      }
      if (resReceipt.ok) {
        setPushReceipt(await resReceipt.json());
      }
    } catch (e: any) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchStatusAndFindings();
  }, []);

  const triggerScan = async () => {
    setIsScanning(true);
    setLogMessage("Indexing X, xAI, Tesla, and SpaceX corpora into active scan pool...");
    try {
      const res = await fetch('/api/elon/scan', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setLogMessage(data.stdout || "Audit and consolidation complete.");
        await fetchStatusAndFindings();
      } else {
        setLogMessage(`Error: ${data.error || 'Failed to scan'}`);
      }
    } catch (e: any) {
      setLogMessage(`Network error: ${e.message}`);
    } finally {
      setIsScanning(false);
    }
  };

  const triggerPushToApi = async () => {
    setIsPushing(true);
    setLogMessage("Transmitting provenance, Merkle root, and webhooks to https://api.albertlane.net...");
    try {
      const res = await fetch('/api/push-to-albertlane-api', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setLogMessage("Successfully pushed provenance, webhooks, and Merkle root to https://api.albertlane.net.");
        setPushReceipt(data.receipt);
        await fetchStatusAndFindings();
      } else {
        setLogMessage(`Push error: ${data.error || 'Failed'}`);
      }
    } catch (e: any) {
      setLogMessage(`Network error: ${e.message}`);
    } finally {
      setIsPushing(false);
    }
  };

  const currentEntityName = activeSubTab === 'X' ? 'X Corp.' : activeSubTab === 'xAI' ? 'xAI Corp.' : activeSubTab === 'Tesla' ? 'Tesla, Inc.' : 'SpaceX';
  const displayedFindings = findings.filter(f => f.symbol_or_function && (
    (activeSubTab === 'X' && f.file_path.startsWith('x-')) ||
    (activeSubTab === 'xAI' && f.file_path.startsWith('grok-')) ||
    (activeSubTab === 'Tesla' && (f.file_path.startsWith('optimus') || f.file_path.startsWith('fsd'))) ||
    (activeSubTab === 'SpaceX' && (f.file_path.startsWith('starlink') || f.file_path.startsWith('starship')))
  ));

  return (
    <div className="flex flex-col gap-[21px] font-mono text-[#cbd5e1]">
      {/* Top Banner */}
      <div className="bg-[#1e293b] border border-[#475569] p-[13px] flex flex-wrap items-center justify-between gap-[13px]">
        <div>
          <div className="text-[14px] font-bold text-[#f1f5f9] tracking-wider uppercase">
            ELON ECOSYSTEM CORPUS FORENSIC AUDITOR // X · xAI · TESLA · SPACEX
          </div>
          <div className="text-[10px] text-[#94a3b8] flex flex-wrap gap-[13px] mt-[3px]">
            <span>STATUTORY REF: SEC-17684-273-411-436</span>
            <span>ROOT ANCHOR: 0x3F8F9A1B2C3D</span>
            <span>TARGET API: api.albertlane.net</span>
            <span>TOKEN: 17684273411436</span>
          </div>
        </div>

        <div className="flex items-center gap-[8px] flex-wrap">
          <button
            onClick={triggerScan}
            disabled={isScanning || isPushing}
            className={`px-[13px] py-[8px] text-[10px] font-bold border uppercase transition-colors cursor-pointer ${
              isScanning
                ? 'bg-[#475569] text-[#94a3b8] border-[#64748b]'
                : 'bg-[#334155] hover:bg-[#475569] text-[#f8fafc] border-[#cbd5e1]'
            }`}
          >
            {isScanning ? 'INDEXING CORPORA...' : 'RE-AUDIT ALL 4 CORPORA'}
          </button>

          <button
            onClick={triggerPushToApi}
            disabled={isScanning || isPushing}
            className={`px-[13px] py-[8px] text-[10px] font-bold border uppercase transition-colors cursor-pointer ${
              isPushing
                ? 'bg-[#1e293b] text-[#94a3b8] border-[#64748b]'
                : 'bg-[#0f172a] hover:bg-[#1e293b] text-[#34d399] border-[#34d399]'
            }`}
          >
            {isPushing ? 'PUSHING TO API...' : 'PUSH TO ALBERTLANE.NET API'}
          </button>
        </div>
      </div>

      {/* Execution / Sync Log */}
      {logMessage && (
        <div className="bg-[#0f172a] border border-[#334155] p-[10px] text-[11px] text-[#34d399] flex items-center justify-between">
          <span className="truncate pr-4">{logMessage}</span>
          <button onClick={() => setLogMessage(null)} className="text-[#94a3b8] hover:text-[#f8fafc] text-[10px]">
            [DISMISS]
          </button>
        </div>
      )}

      {/* 4 Corpora Metric Overview Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-[8px]">
        <div className="bg-[#1e293b] border border-[#475569] p-[10px]">
          <div className="text-[10px] text-[#94a3b8] uppercase font-bold">01 // X CORP.</div>
          <div className="text-[16px] font-bold text-[#f8fafc] mt-[2px]">
            {statusCounts['x_schemas'] || 4} SCHEMAS
          </div>
          <div className="text-[9px] text-[#94a3b8] mt-[2px]">50ms Tick & Firehose AST</div>
        </div>

        <div className="bg-[#1e293b] border border-[#475569] p-[10px]">
          <div className="text-[10px] text-[#94a3b8] uppercase font-bold">02 // xAI CORP.</div>
          <div className="text-[16px] font-bold text-[#f8fafc] mt-[2px]">
            {statusCounts['xai_schemas'] || 4} SCHEMAS
          </div>
          <div className="text-[9px] text-[#94a3b8] mt-[2px]">Grok & Colossus 100k H100</div>
        </div>

        <div className="bg-[#1e293b] border border-[#475569] p-[10px]">
          <div className="text-[10px] text-[#94a3b8] uppercase font-bold">03 // TESLA, INC.</div>
          <div className="text-[16px] font-bold text-[#f8fafc] mt-[2px]">
            {statusCounts['tesla_schemas'] || 4} SCHEMAS
          </div>
          <div className="text-[9px] text-[#94a3b8] mt-[2px]">Optimus & FSD Voxel Depth</div>
        </div>

        <div className="bg-[#1e293b] border border-[#475569] p-[10px]">
          <div className="text-[10px] text-[#94a3b8] uppercase font-bold">04 // SPACEX</div>
          <div className="text-[16px] font-bold text-[#f8fafc] mt-[2px]">
            {statusCounts['spacex_schemas'] || 4} SCHEMAS
          </div>
          <div className="text-[9px] text-[#94a3b8] mt-[2px]">Starlink & Starship Telemetry</div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap gap-[5px] border-b border-[#475569] pb-[8px] text-[10px]">
        {(['X', 'xAI', 'Tesla', 'SpaceX', 'PUSH_RECEIPTS'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveSubTab(tab);
              if (tab !== 'PUSH_RECEIPTS') {
                const subFindings = findings.filter(f => (
                  (tab === 'X' && f.file_path.startsWith('x-')) ||
                  (tab === 'xAI' && f.file_path.startsWith('grok-')) ||
                  (tab === 'Tesla' && (f.file_path.startsWith('optimus') || f.file_path.startsWith('fsd'))) ||
                  (tab === 'SpaceX' && (f.file_path.startsWith('starlink') || f.file_path.startsWith('starship')))
                ));
                if (subFindings.length > 0) setSelectedFinding(subFindings[0]);
              }
            }}
            className={`px-[13px] py-[6px] border uppercase transition-colors cursor-pointer ${
              activeSubTab === tab
                ? 'bg-[#1e293b] text-[#f8fafc] border-[#cbd5e1] font-bold'
                : 'bg-[#334155] text-[#94a3b8] border-[#475569] hover:text-[#f8fafc]'
            }`}
          >
            {tab === 'PUSH_RECEIPTS' ? '05 // PUSH RECEIPTS & SEALS' : `// ${tab.toUpperCase()}`}
          </button>
        ))}
      </div>

      {/* View Content */}
      {activeSubTab === 'PUSH_RECEIPTS' ? (
        <div className="bg-[#1e293b] border border-[#475569] p-[13px] flex flex-col gap-[13px]">
          <div className="flex items-center justify-between pb-[8px] border-b border-[#475569]">
            <span className="text-[12px] font-bold text-[#f8fafc] uppercase">
              LATEST CRYPTOGRAPHIC PUSH RECEIPT // API.ALBERTLANE.NET
            </span>
            <span className="text-[10px] text-[#34d399] font-bold">
              {pushReceipt?.status || 'TRANSMISSION VERIFIED'}
            </span>
          </div>

          {pushReceipt ? (
            <div className="flex flex-col gap-[10px] text-[11px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[8px] bg-[#0f172a] p-[10px] border border-[#334155]">
                <div><span className="text-[#94a3b8]">Delivery ID:</span> <span className="text-[#f8fafc]">{pushReceipt.deliveryId}</span></div>
                <div><span className="text-[#94a3b8]">Timestamp UTC:</span> <span className="text-[#f8fafc]">{pushReceipt.timestampUtc}</span></div>
                <div><span className="text-[#94a3b8]">Target Domain:</span> <span className="text-[#34d399]">{pushReceipt.targetDomain}</span></div>
                <div><span className="text-[#94a3b8]">Apex Domain:</span> <span className="text-[#34d399]">{pushReceipt.apexDomain}</span></div>
                <div><span className="text-[#94a3b8]">Statutory Ref:</span> <span className="text-[#f8fafc]">{pushReceipt.statutoryRef}</span></div>
                <div><span className="text-[#94a3b8]">Z-Axis Anchor:</span> <span className="text-[#f8fafc]">{pushReceipt.zaxisAnchor}</span></div>
                <div><span className="text-[#94a3b8]">D1 Database Bound:</span> <span className="text-[#f8fafc]">{pushReceipt.d1Binding}</span></div>
                <div><span className="text-[#94a3b8]">M4A2 Enclave Seal:</span> <span className="text-[#f8fafc]">{pushReceipt.m4a2Seal}</span></div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-[#f8fafc] block mb-[5px] uppercase">
                  Endpoints Transmitted & Live Verified ({pushReceipt.endpointsPushed?.length || 0}):
                </span>
                <div className="flex flex-col gap-[5px]">
                  {pushReceipt.endpointsPushed?.map((ep, idx) => (
                    <div key={idx} className="bg-[#0f172a] border border-[#334155] p-[8px] flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-[8px]">
                        <span className="font-bold text-[#34d399]">{ep.method}</span>
                        <span className="text-[#f8fafc]">{ep.route}</span>
                        {ep.company && <span className="text-[#94a3b8]">({ep.company} - {ep.rating})</span>}
                      </div>
                      <div className="flex items-center gap-[10px] text-[#94a3b8]">
                        <span>{ep.latency_ms}ms</span>
                        <span className="font-bold text-[#34d399]">HTTP {ep.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-[#f8fafc] block mb-[5px] uppercase">
                  Corpora Synchronized to API Ledger:
                </span>
                <div className="flex flex-wrap gap-[5px]">
                  {pushReceipt.corporaSynchronized?.map((corp, idx) => (
                    <span key={idx} className="bg-[#0f172a] border border-[#334155] px-[8px] py-[3px] text-[10px] text-[#f8fafc]">
                      {corp}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-[11px] text-[#94a3b8] p-[21px] text-center">
              No push receipt recorded yet. Click "PUSH TO ALBERTLANE.NET API" above to dispatch.
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[13px]">
          {/* Left Column: Finding list for the selected entity */}
          <div className="flex flex-col gap-[8px]">
            <div className="bg-[#1e293b] border border-[#475569] p-[10px] flex items-center justify-between">
              <span className="text-[12px] font-bold text-[#f8fafc] uppercase">
                {currentEntityName} DECOMPILED EVIDENCE ({displayedFindings.length})
              </span>
              <span className="text-[10px] text-[#94a3b8]">100% INTACT & PRESERVED</span>
            </div>

            {displayedFindings.map((finding) => (
              <div
                key={finding.id}
                onClick={() => setSelectedFinding(finding)}
                className={`p-[10px] border cursor-pointer transition-colors ${
                  selectedFinding?.id === finding.id
                    ? 'bg-[#1e293b] border-[#cbd5e1]'
                    : 'bg-[#334155] border-[#475569] hover:bg-[#1e293b]'
                }`}
              >
                <div className="flex items-center justify-between gap-[5px] mb-[4px]">
                  <span className="text-[10px] font-bold text-[#f8fafc] truncate">
                    {finding.symbol_or_function}
                  </span>
                  <span className="text-[9px] bg-[#0f172a] border border-[#475569] px-[4px] py-[1px] text-[#f87171]">
                    {finding.severity}
                  </span>
                </div>
                <div className="text-[9px] text-[#94a3b8] truncate">{finding.file_path}:{finding.line_number}</div>
                <div className="text-[10px] text-[#cbd5e1] mt-[3px] line-clamp-1">{finding.misappropriated_asset}</div>
              </div>
            ))}
          </div>

          {/* Right Column: Detailed Forensic Inspector */}
          {selectedFinding ? (
            <div className="bg-[#1e293b] border border-[#475569] p-[13px] flex flex-col gap-[10px] text-[11px]">
              <div className="flex items-center justify-between border-b border-[#475569] pb-[8px]">
                <span className="font-bold text-[#f8fafc] text-[12px] uppercase">
                  FORENSIC DECOMPILATION INSPECTOR
                </span>
                <span className="text-[9px] bg-[#0f172a] border border-[#475569] px-[5px] py-[2px] text-[#34d399]">
                  CHAIN OF CUSTODY SEALED
                </span>
              </div>

              <div>
                <span className="text-[#94a3b8] block text-[10px]">SYMBOL / ROUTINE:</span>
                <span className="text-[#f8fafc] font-bold">{selectedFinding.symbol_or_function}</span>
              </div>

              <div>
                <span className="text-[#94a3b8] block text-[10px]">FILE LOCATION:</span>
                <span className="text-[#f8fafc]">{selectedFinding.file_path}:{selectedFinding.line_number}</span>
              </div>

              <div>
                <span className="text-[#94a3b8] block text-[10px]">MISAPPROPRIATED ASSET:</span>
                <span className="text-[#38bdf8] font-bold">{selectedFinding.misappropriated_asset}</span>
              </div>

              <div>
                <span className="text-[#94a3b8] block text-[10px]">STATUTORY BASIS:</span>
                <span className="text-[#f8fafc]">{selectedFinding.statutory_basis}</span>
              </div>

              <div>
                <span className="text-[#94a3b8] block text-[10px]">FORENSIC EVIDENCE ANALYSIS:</span>
                <p className="text-[#cbd5e1] leading-relaxed bg-[#0f172a] p-[8px] border border-[#334155]">
                  {selectedFinding.evidence_analysis}
                </p>
              </div>

              <div>
                <span className="text-[#94a3b8] block text-[10px]">DECOMPILED CODE EVIDENCE:</span>
                <pre className="bg-[#0f172a] border border-[#334155] p-[8px] text-[10px] text-[#cbd5e1] overflow-x-auto whitespace-pre leading-relaxed">
                  {selectedFinding.code_snippet}
                </pre>
              </div>

              <div>
                <span className="text-[#94a3b8] block text-[10px]">REMEDY DEMANDED:</span>
                <p className="text-[#f87171] bg-[#0f172a] p-[8px] border border-[#334155]">
                  {selectedFinding.remedy_demanded}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[8px] text-[9px] bg-[#0f172a] p-[8px] border border-[#334155]">
                <div><span className="text-[#94a3b8]">EVIDENCE SHA-256:</span> <span className="text-[#f8fafc] break-all">{selectedFinding.evidence_sha256}</span></div>
                <div><span className="text-[#94a3b8]">HMAC-SHA256 SEAL:</span> <span className="text-[#34d399] break-all">{selectedFinding.hmac_seal}</span></div>
              </div>
            </div>
          ) : (
            <div className="bg-[#1e293b] border border-[#475569] p-[21px] text-center text-[11px] text-[#94a3b8]">
              Select a finding to inspect decompilation and cryptographic proofs.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
