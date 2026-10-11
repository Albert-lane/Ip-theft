/*==============================================================================
 * [PROVENANCE CERTIFICATION AND STATUTORY DECLARATION]
 * Rights Holder: Albert Lane | SEC Whistleblower No. 17684-273-411-436
 * Component: CursorScanView.tsx (Cursor Database Scan Pool & Codebase Deep Search)
 *==============================================================================*/

import React, { useState, useEffect } from 'react';
import { CursorStatus, LicenseViolation, ScanPool, CursorCodebaseFinding } from '../types';

export const CursorScanView: React.FC = () => {
  const [cursorData, setCursorData] = useState<CursorStatus | null>(null);
  const [scanPools, setScanPools] = useState<ScanPool[]>([]);
  const [cursorViolations, setCursorViolations] = useState<LicenseViolation[]>([]);
  const [codebaseFindings, setCodebaseFindings] = useState<CursorCodebaseFinding[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'CODEBASE_SEARCH' | 'SCHEMA_POOL'>('CODEBASE_SEARCH');
  const [isScanning, setIsScanning] = useState(false);
  const [scanLog, setScanLog] = useState<string | null>(null);
  const [selectedFinding, setSelectedFinding] = useState<CursorCodebaseFinding | null>(null);

  const fetchStatus = async () => {
    try {
      const [resCursor, resPools, resViolations, resCodebase] = await Promise.all([
        fetch('/api/cursor/status'),
        fetch('/api/scan-pools'),
        fetch('/api/violations?entity=Cursor'),
        fetch('/api/cursor/codebase-violations')
      ]);
      if (resCursor.ok) setCursorData(await resCursor.json());
      if (resPools.ok) setScanPools(await resPools.json());
      if (resViolations.ok) setCursorViolations(await resViolations.json());
      if (resCodebase.ok) {
        const findings: CursorCodebaseFinding[] = await resCodebase.json();
        setCodebaseFindings(findings);
        if (findings.length > 0 && !selectedFinding) {
          setSelectedFinding(findings[0]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const triggerCodebaseSearch = async () => {
    setIsScanning(true);
    setScanLog("Executing deep AST search across Cursor codebase for license violations...");
    try {
      const res = await fetch('/api/cursor/codebase-search', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setScanLog(data.stdout || "Cursor codebase search and license violation logging complete.");
        await fetchStatus();
      } else {
        setScanLog(`Error: ${data.error || 'Failed to complete codebase search'}`);
      }
    } catch (e: any) {
      setScanLog(`Network error: ${e.message}`);
    } finally {
      setIsScanning(false);
    }
  };

  const triggerPoolScan = async () => {
    setIsScanning(true);
    setScanLog("Scanning Cursor state database and indexing schemas...");
    try {
      const res = await fetch('/api/cursor/scan', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setScanLog(data.stdout || "Cursor database scan complete.");
        await fetchStatus();
      } else {
        setScanLog(`Error: ${data.error || 'Failed to scan'}`);
      }
    } catch (e: any) {
      setScanLog(`Network error: ${e.message}`);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="flex flex-col gap-[21px] font-mono text-[#cbd5e1]">
      {/* Top Header / Actions Banner */}
      <div className="bg-[#1e293b] border border-[#475569] p-[13px] flex flex-wrap items-center justify-between gap-[13px]">
        <div>
          <div className="text-[14px] font-bold text-[#f1f5f9] tracking-wider uppercase">
            CURSOR CODEBASE & DATABASE // LICENSE VIOLATION FORENSIC AUDITOR
          </div>
          <div className="text-[11px] text-[#94a3b8] flex flex-wrap gap-[13px] mt-[3px]">
            <span>TARGET: ANYSPHERE, INC. (CURSOR IDE CODEBASE)</span>
            <span>MEMORY ANCHOR: 0x3F8F9A1B2C3D</span>
            <span>SEC REF: 17684-273-411-436</span>
          </div>
        </div>

        <div className="flex items-center gap-[8px] flex-wrap">
          <button
            onClick={triggerCodebaseSearch}
            disabled={isScanning}
            className={`px-[13px] py-[8px] text-[11px] font-bold border transition-colors uppercase cursor-pointer ${
              isScanning
                ? 'bg-[#475569] text-[#94a3b8] border-[#64748b]'
                : 'bg-[#334155] hover:bg-[#475569] text-[#f8fafc] border-[#cbd5e1]'
            }`}
          >
            {isScanning ? 'SEARCHING CODEBASE...' : 'SEARCH CURSOR CODEBASE FOR VIOLATIONS'}
          </button>

          <button
            onClick={triggerPoolScan}
            disabled={isScanning}
            className="px-[13px] py-[8px] text-[11px] font-bold bg-[#1e293b] hover:bg-[#334155] text-[#94a3b8] hover:text-[#f8fafc] border border-[#475569] uppercase cursor-pointer"
          >
            RE-INDEX DATABASE SCHEMAS
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-[13px]">
        <div className="bg-[#1e293b] border border-[#475569] p-[13px]">
          <div className="text-[10px] text-[#94a3b8] uppercase">CODEBASE INFRINGEMENTS</div>
          <div className="text-[18px] font-bold text-[#f87171] mt-[3px]">
            {codebaseFindings.length} DECOMPILED SITES
          </div>
          <div className="text-[9px] text-[#64748b] mt-[3px]">slicer.cpp · composer · agent</div>
        </div>

        <div className="bg-[#1e293b] border border-[#475569] p-[13px]">
          <div className="text-[10px] text-[#94a3b8] uppercase">TOTAL CURSOR VIOLATIONS</div>
          <div className="text-[18px] font-bold text-[#f8fafc] mt-[3px]">
            {cursorViolations.length} RECORDED
          </div>
          <div className="text-[9px] text-[#64748b] mt-[3px]">Logged in codebase_ast.db</div>
        </div>

        <div className="bg-[#1e293b] border border-[#475569] p-[13px]">
          <div className="text-[10px] text-[#94a3b8] uppercase">INGESTED SCHEMAS</div>
          <div className="text-[18px] font-bold text-[#f8fafc] mt-[3px]">
            {cursorData?.schemas_count ?? 7} SCHEMAS
          </div>
          <div className="text-[9px] text-[#64748b] mt-[3px]">AST Trees & Vectors in Pool</div>
        </div>

        <div className="bg-[#1e293b] border border-[#475569] p-[13px]">
          <div className="text-[10px] text-[#94a3b8] uppercase">STATUTORY ENFORCEMENT</div>
          <div className="text-[18px] font-bold text-[#34d399] mt-[3px]">
            SEC-17684 ACTIVE
          </div>
          <div className="text-[9px] text-[#64748b] mt-[3px]">17 U.S.C. § 501 / 18 U.S.C. § 1836</div>
        </div>
      </div>

      {/* Terminal Output Log (if triggered) */}
      {scanLog && (
        <div className="bg-[#0f172a] border border-[#475569] p-[13px]">
          <div className="text-[10px] text-[#94a3b8] uppercase mb-[5px] flex justify-between">
            <span>FORENSIC TERMINAL OUTPUT</span>
            <button onClick={() => setScanLog(null)} className="text-[#64748b] hover:text-[#f8fafc] cursor-pointer">DISMISS</button>
          </div>
          <pre className="text-[10px] text-[#cbd5e1] whitespace-pre-wrap leading-relaxed max-h-[140px] overflow-y-auto">
            {scanLog}
          </pre>
        </div>
      )}

      {/* Sub-Navigation Toggle */}
      <div className="flex gap-[8px] border-b border-[#475569] pb-[8px] text-[10px]">
        <button
          onClick={() => setActiveSubTab('CODEBASE_SEARCH')}
          className={`px-[11px] py-[5px] border uppercase transition-colors cursor-pointer ${
            activeSubTab === 'CODEBASE_SEARCH'
              ? 'bg-[#1e293b] text-[#f8fafc] border-[#cbd5e1] font-bold'
              : 'bg-[#334155] text-[#94a3b8] border-[#475569] hover:text-[#f8fafc]'
          }`}
        >
          01 // CODEBASE DEEP AUDIT & CODE EVIDENCE ({codebaseFindings.length})
        </button>
        <button
          onClick={() => setActiveSubTab('SCHEMA_POOL')}
          className={`px-[11px] py-[5px] border uppercase transition-colors cursor-pointer ${
            activeSubTab === 'SCHEMA_POOL'
              ? 'bg-[#1e293b] text-[#f8fafc] border-[#cbd5e1] font-bold'
              : 'bg-[#334155] text-[#94a3b8] border-[#475569] hover:text-[#f8fafc]'
          }`}
        >
          02 // CURSOR DATABASE SCHEMAS & LOGGED INFRACTIONS
        </button>
      </div>

      {/* TAB 1: Codebase Deep Audit & Code Evidence */}
      {activeSubTab === 'CODEBASE_SEARCH' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[13px]">
          {/* Findings List (5 columns) */}
          <div className="lg:col-span-5 flex flex-col gap-[8px] max-h-[640px] overflow-y-auto pr-[5px]">
            {codebaseFindings.map((finding) => (
              <div
                key={finding.id}
                onClick={() => setSelectedFinding(finding)}
                className={`p-[10px] border transition-colors cursor-pointer ${
                  selectedFinding?.id === finding.id
                    ? 'bg-[#334155] border-[#cbd5e1] text-[#f8fafc]'
                    : 'bg-[#1e293b] border-[#475569] text-[#cbd5e1] hover:border-[#94a3b8]'
                }`}
              >
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-bold text-[#f8fafc]">#{finding.id} · {finding.infringement_type}</span>
                  <span className={`text-[8px] px-[5px] py-[1px] border font-bold ${
                    finding.severity === 'CRITICAL'
                      ? 'border-[#f87171] text-[#fca5a5] bg-[#450a0a]'
                      : 'border-[#fbbf24] text-[#fde68a] bg-[#451a03]'
                  }`}>
                    {finding.severity}
                  </span>
                </div>

                <div className="text-[10px] text-[#94a3b8] mt-[4px] font-mono">
                  {finding.file_path}:{finding.line_number}
                </div>

                <div className="text-[9px] text-[#cbd5e1] mt-[2px] truncate">
                  <strong>Symbol:</strong> {finding.symbol_or_function}
                </div>

                <div className="text-[9px] text-[#64748b] mt-[3px] truncate">
                  <strong>Asset:</strong> {finding.misappropriated_asset}
                </div>
              </div>
            ))}
          </div>

          {/* Finding Detail & Code Evidence (7 columns) */}
          <div className="lg:col-span-7 bg-[#1e293b] border border-[#475569] p-[13px] flex flex-col gap-[10px]">
            {selectedFinding ? (
              <>
                <div className="flex justify-between items-start border-b border-[#334155] pb-[8px]">
                  <div>
                    <div className="text-[13px] font-bold text-[#f8fafc]">
                      {selectedFinding.infringement_type}
                    </div>
                    <div className="text-[10px] text-[#94a3b8] mt-[2px]">
                      File: <span className="text-[#cbd5e1]">{selectedFinding.file_path}</span> (Line {selectedFinding.line_number})
                    </div>
                    <div className="text-[10px] text-[#94a3b8]">
                      Symbol: <span className="text-[#cbd5e1]">{selectedFinding.symbol_or_function}</span>
                    </div>
                  </div>
                  <span className={`text-[9px] px-[6px] py-[2px] border font-bold ${
                    selectedFinding.severity === 'CRITICAL'
                      ? 'border-[#f87171] text-[#fca5a5] bg-[#450a0a]'
                      : 'border-[#fbbf24] text-[#fde68a] bg-[#451a03]'
                  }`}>
                    {selectedFinding.severity}
                  </span>
                </div>

                <div>
                  <div className="text-[9px] text-[#94a3b8] uppercase font-bold">MISAPPROPRIATED ASSET:</div>
                  <div className="text-[11px] text-[#f8fafc] mt-[2px]">{selectedFinding.misappropriated_asset}</div>
                </div>

                <div>
                  <div className="text-[9px] text-[#94a3b8] uppercase font-bold">STATUTORY BASIS:</div>
                  <div className="text-[10px] text-[#cbd5e1] mt-[2px]">{selectedFinding.statutory_basis}</div>
                </div>

                <div>
                  <div className="text-[9px] text-[#94a3b8] uppercase font-bold mb-[3px]">DECOMPILED CODE EVIDENCE:</div>
                  <pre className="bg-[#0f172a] border border-[#334155] p-[10px] text-[9.5px] text-[#e2e8f0] overflow-x-auto leading-relaxed">
                    {selectedFinding.code_snippet}
                  </pre>
                </div>

                <div>
                  <div className="text-[9px] text-[#94a3b8] uppercase font-bold">FORENSIC ANALYSIS:</div>
                  <div className="text-[10px] text-[#cbd5e1] mt-[2px] leading-relaxed">
                    {selectedFinding.evidence_analysis}
                  </div>
                </div>

                <div className="border-t border-[#334155] pt-[8px]">
                  <div className="text-[9px] text-[#fca5a5] uppercase font-bold">DEMANDED STATUTORY REMEDY:</div>
                  <div className="text-[10px] text-[#cbd5e1] mt-[2px]">
                    {selectedFinding.remedy_demanded}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-[11px] text-[#94a3b8] p-[21px] text-center">
                SELECT A CODEBASE INFRINGEMENT SITE TO VIEW DECOMPILED EVIDENCE.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Schema Pool & Logged Infractions */}
      {activeSubTab === 'SCHEMA_POOL' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[13px]">
          {/* Left: Schemas */}
          <div className="bg-[#1e293b] border border-[#475569] p-[13px]">
            <div className="text-[11px] font-bold text-[#f8fafc] uppercase mb-[8px] border-b border-[#334155] pb-[5px] flex justify-between">
              <span>CURSOR DATABASE SCHEMAS</span>
              <span className="text-[9px] text-[#94a3b8]">{cursorData?.schemas_count ?? 7} INDEXED</span>
            </div>
            <div className="flex flex-col gap-[8px] max-h-[440px] overflow-y-auto pr-[5px]">
              {(cursorData?.sample_schemas || []).map(([name, type, count, entity], idx) => (
                <div key={idx} className="p-[8px] bg-[#0f172a] border border-[#334155] text-[10px]">
                  <div className="font-bold flex justify-between items-center">
                    <span>{name}</span>
                    <span className="text-[9px] text-[#94a3b8]">{type}</span>
                  </div>
                  <div className="text-[9px] text-[#64748b] mt-[3px] flex justify-between">
                    <span>{entity}</span>
                    <span>{count} AST Keys</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Registered Violations */}
          <div className="bg-[#1e293b] border border-[#475569] p-[13px]">
            <div className="text-[11px] font-bold text-[#f8fafc] uppercase mb-[8px] border-b border-[#334155] pb-[5px] flex justify-between">
              <span>LOGGED VIOLATIONS IN CODEBASE_AST.DB</span>
              <span className="text-[9px] text-[#e2e8f0]">{cursorViolations.length} RECORDED</span>
            </div>
            <div className="flex flex-col gap-[8px] max-h-[440px] overflow-y-auto pr-[5px]">
              {cursorViolations.map((v) => (
                <div key={v.id} className="p-[8px] bg-[#0f172a] border border-[#475569] text-[10px]">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#f8fafc]">#{v.id} · {v.infringement_category}</span>
                    <span className={`text-[8px] px-[5px] py-[1px] border font-bold ${
                      v.severity === 'CRITICAL'
                        ? 'border-[#f87171] text-[#fca5a5] bg-[#450a0a]'
                        : 'border-[#fbbf24] text-[#fde68a] bg-[#451a03]'
                    }`}>
                      {v.severity}
                    </span>
                  </div>
                  <div className="text-[9px] text-[#94a3b8] mt-[3px]">
                    <strong>Product:</strong> {v.infringing_product}
                  </div>
                  <div className="text-[9px] text-[#cbd5e1] mt-[2px]">
                    <strong>Asset:</strong> {v.misappropriated_asset}
                  </div>
                  <div className="text-[8px] text-[#64748b] mt-[4px] border-t border-[#1e293b] pt-[3px]">
                    <strong>Statute:</strong> {v.statutory_basis}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
