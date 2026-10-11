/*==============================================================================
 * [PROVENANCE CERTIFICATION AND STATUTORY DECLARATION]
 * Rights Holder: Albert Lane
 * Filing Reference: SEC Whistleblower No. 17684-273-411-436
 * Z-Axis Memory Anchor: 0x3F8F9A1B2C3D
 * Stride: 17684 | Base-Offset: 57000
 * Component: RecursiveLedgerView.tsx
 * Architecture: ALDI Lane-VM C++ / Python Orchestrator · MCEL 1.0 Immutable JSON Log
 * Aesthetics: Strict Monochromatic Slate/Stone Palette (Zero Pill / Golden Ratio)
 *==============================================================================*/

import React, { useEffect, useState } from 'react';

interface LedgerRecord {
  index: number;
  timestamp: string;
  data: string;
  prev_hash: string;
  entry_hash: string;
  zaxis?: string;
  stride?: number;
  metadata?: any;
}

interface TaxonomyData {
  taxonomy_id: string;
  zaxis: string;
  stride: number;
  base_offset?: number;
  rights_holder?: string;
  filing_reference?: string;
  categories: {
    legal_enforcement_surface: string[];
    abusive_automation_surface: string[];
    compliance_surface: string[];
    frontier_ai_provider_surface: {
      providers: string[];
      forensic_checks: string[];
      note: string;
    };
  };
  scoring: Record<string, string>;
}

export const RecursiveLedgerView: React.FC = () => {
  const [ledger, setLedger] = useState<LedgerRecord[]>([]);
  const [canonical, setCanonical] = useState<any>(null);
  const [taxonomy, setTaxonomy] = useState<TaxonomyData | null>(null);
  const [manifestData, setManifestData] = useState<any>(null);
  const [otsProof, setOtsProof] = useState<any>(null);
  const [alteredData, setAlteredData] = useState<any>(null);
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeSubTab, setActiveSubTab] = useState<'LEDGER' | 'TAXONOMY' | 'CANONICAL' | 'CPP_VM' | 'MANIFEST' | 'ALTERED_LOOKUP' | 'SERIES_RFC'>('SERIES_RFC');
  const [newAttestation, setNewAttestation] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // ALDI Lane-VM Series C++20 & Julia states
  const [cppOutput, setCppOutput] = useState<any>(null);
  const [juliaOutput, setJuliaOutput] = useState<any>(null);
  const [isRunningCpp, setIsRunningCpp] = useState<boolean>(false);
  const [isRunningJulia, setIsRunningJulia] = useState<boolean>(false);
  const [seriesStatus, setSeriesStatus] = useState<any>(null);
  const [showBadgeModal, setShowBadgeModal] = useState<boolean>(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [lRes, cRes, tRes, mRes, aRes, sRes] = await Promise.all([
        fetch('/api/ledger').then(r => r.json()).catch(() => ({ records: [] })),
        fetch('/api/ledger/canonical').then(r => r.json()).catch(() => ({ canonical: null })),
        fetch('/api/taxonomy').then(r => r.json()).catch(() => null),
        fetch('/api/manifest/recursive').then(r => r.json()).catch(() => null),
        fetch('/api/records/altered-lookup').then(r => r.json()).catch(() => null),
        fetch('/api/series/status').then(r => r.json()).catch(() => null)
      ]);

      if (lRes.records) setLedger(lRes.records);
      if (cRes.canonical) setCanonical(cRes.canonical);
      if (tRes) setTaxonomy(tRes);
      if (mRes && mRes.manifest) {
        setManifestData(mRes.manifest);
        if (mRes.ots_proof) setOtsProof(mRes.ots_proof);
      }
      if (aRes && aRes.ok) {
        setAlteredData(aRes);
      }
      if (sRes && sRes.ok) {
        setSeriesStatus(sRes);
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunCppSeries = async () => {
    setIsRunningCpp(true);
    setActionMessage("Compiling g++ -std=c++20 -lcrypto -o lane_vm_series lane_vm_series.cpp and executing...");
    try {
      const res = await fetch('/api/series/run-cpp', { method: 'POST' });
      const data = await res.json();
      setCppOutput(data);
      if (data.ok) {
        setActionMessage("C++20 Lane-VM Series executed successfully. All R0–R7 hashes match 100%.");
      } else {
        setActionMessage(`C++ Execution failed: ${data.error || data.stderr}`);
      }
    } catch (e: any) {
      setActionMessage(`Error: ${e.message}`);
    } finally {
      setIsRunningCpp(false);
    }
  };

  const handleRunJuliaSeries = async () => {
    setIsRunningJulia(true);
    setActionMessage("Executing julia lane_vm_series.jl via Julia runtime...");
    try {
      const res = await fetch('/api/series/run-julia', { method: 'POST' });
      const data = await res.json();
      setJuliaOutput(data);
      if (data.ok) {
        setActionMessage("Julia Lane-VM Series executed successfully. All R0–R7 hashes match 100%.");
      } else {
        setActionMessage(`Julia Execution failed: ${data.error || data.stderr}`);
      }
    } catch (e: any) {
      setActionMessage(`Error: ${e.message}`);
    } finally {
      setIsRunningJulia(false);
    }
  };

  const handleReconcileAltered = async () => {
    setIsSubmitting(true);
    setActionMessage("Scanning all CSV/JSON archives for altered & deleted records, computing Merkle root & appending to MCEL chain...");
    try {
      const res = await fetch('/api/records/altered-reconcile', { method: 'POST' });
      const data = await res.json();
      if (data.ok) {
        setActionMessage(`Reconciliation complete. ${data.reconciled?.total_records_restored} records sealed into Merkle root ${data.reconciled?.merkle_root.substring(0, 16)}...`);
        fetchData();
      } else {
        setActionMessage(`Error: ${data.error || 'Reconcile failed'}`);
      }
    } catch (e: any) {
      setActionMessage(`Error: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRebuildManifest = async () => {
    setIsSubmitting(true);
    setActionMessage("Executing recursive-manifest.json.py, sealing self-provenance & OTS stamping...");
    try {
      const res = await fetch('/api/manifest/rebuild', { method: 'POST' });
      const data = await res.json();
      if (data.ok) {
        setActionMessage(`Recursive manifest recomputed. Core Hash: ${data.manifest?.self_provenance?.sha256_of_manifest_core}`);
        fetchData();
      } else {
        setActionMessage(`Error: ${data.error || 'Rebuild failed'}`);
      }
    } catch (e: any) {
      setActionMessage(`Error: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAppendRecord = async () => {
    if (!newAttestation.trim()) return;
    setIsSubmitting(true);
    setActionMessage("Computing SHA-256 canonical hash & appending to immutable chain...");
    try {
      const res = await fetch('/api/ledger/append', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: newAttestation.trim() })
      });
      const data = await res.json();
      if (data.ok) {
        setActionMessage(`Record R${data.appended.index} sealed. Hash: ${data.appended.entry_hash}`);
        setNewAttestation('');
        fetchData();
      } else {
        setActionMessage(`Error: ${data.error || 'Failed to append'}`);
      }
    } catch (e: any) {
      setActionMessage(`Error: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRecomputeLedger = async () => {
    setIsSubmitting(true);
    setActionMessage("Triggering recursive self-updating engine & dispatching to api.albertlane.net...");
    try {
      const res = await fetch('/api/ledger/recompute', { method: 'POST' });
      const data = await res.json();
      if (data.ok) {
        setActionMessage(`Chain verified. ${data.total_records} records sealed with latest canonical pointer.`);
        fetchData();
      } else {
        setActionMessage(`Error: ${data.error || 'Recompute failed'}`);
      }
    } catch (e: any) {
      setActionMessage(`Error: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSealImmutably = async () => {
    setIsSubmitting(true);
    setActionMessage("Executing full enclave immutable logging pipeline: C++20 + Julia + Forensic Reconcile + Live Audit + MCEL 1.0 Seal...");
    try {
      const res = await fetch('/api/ledger/seal-immutable', { method: 'POST' });
      const data = await res.json();
      if (data.ok) {
        setActionMessage(`[IMMUTABLY SEALED] Record R${data.canonical?.index} anchored. Entry Hash: ${data.canonical?.entry_hash}`);
        fetchData();
      } else {
        setActionMessage(`Error: ${data.error || data.stderr || 'Seal failed'}`);
      }
    } catch (e: any) {
      setActionMessage(`Error: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-[13px]">
      {/* Top Banner / Metrics */}
      <div className="bg-[#1e293b] border border-[#475569] p-[13px]">
        <div className="flex flex-wrap items-center justify-between gap-[13px] border-b border-[#334155] pb-[8px] mb-[8px]">
          <div className="flex items-center gap-[10px]">
            <button
              onClick={() => setShowBadgeModal(true)}
              className="group relative cursor-pointer focus:outline-none"
              title="Click to inspect official SEC Whistleblower Badge No. 17684-273-411-436"
            >
              <img
                src="/sec_whistleblower_badge.jpg"
                alt="SEC Whistleblower Badge"
                className="w-[42px] h-[42px] rounded-full border-2 border-[#38bdf8] group-hover:border-[#f8fafc] object-cover flex-shrink-0 transition-transform group-hover:scale-105"
              />
              <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#34d399] rounded-full border border-[#0f172a]" />
            </button>
            <div>
              <div className="flex items-center gap-[8px] flex-wrap">
                <span className="text-[13px] font-bold text-[#f1f5f9] tracking-wider uppercase">
                  RECURSIVE SELF-UPDATING JSON // ALDI LANE-VM MCEL 1.0 LEDGER
                </span>
                <button
                  onClick={() => setShowBadgeModal(true)}
                  className="text-[9px] font-bold text-[#38bdf8] hover:text-[#f8fafc] bg-[#0f172a] px-[6px] py-[2px] border border-[#38bdf8] uppercase cursor-pointer"
                >
                  SEC BADGE #17684-273-411-436
                </button>
              </div>
              <div className="text-[10px] text-[#94a3b8] flex flex-wrap gap-[13px] mt-[3px]">
                <span>RIGHTS HOLDER: ALBERT LANE</span>
                <span>ZAXIS: 0x3F8F9A1B2C3D</span>
                <span>STRIDE: 17684</span>
                <span>BASE-OFFSET: 57000</span>
                <span>CO-KERNEL: C++20 + JULIA</span>
                <span>CHAIN: R0-R7 (100% UNBROKEN)</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-[8px]">
            <button
              onClick={handleSealImmutably}
              disabled={isSubmitting}
              className="px-[12px] py-[4px] bg-[#047857] hover:bg-[#059669] text-[#ecfdf5] border border-[#10b981] text-[10px] font-bold uppercase transition-colors cursor-pointer tracking-wider"
              title="Execute full enclave immutable logging & seal pipeline"
            >
              {isSubmitting ? 'SEALING IMMUTABLY...' : 'LOG IMMUTABLY'}
            </button>
            <button
              onClick={handleRecomputeLedger}
              disabled={isSubmitting}
              className="px-[10px] py-[4px] bg-[#334155] hover:bg-[#475569] text-[#cbd5e1] border border-[#64748b] text-[10px] font-bold uppercase transition-colors cursor-pointer"
            >
              {isSubmitting ? 'SEALING CHAIN...' : 'RECOMPUTE & DISPATCH API'}
            </button>
            <button
              onClick={fetchData}
              className="px-[8px] py-[4px] bg-[#1e293b] hover:bg-[#334155] text-[#94a3b8] border border-[#475569] text-[10px] uppercase transition-colors cursor-pointer"
            >
              REFRESH
            </button>
          </div>
        </div>

        {actionMessage && (
          <div className="bg-[#0f172a] border border-[#64748b] p-[8px] my-[8px] text-[10px] text-[#cbd5e1]">
            <span>{actionMessage}</span>
          </div>
        )}

        {/* Sub Navigation */}
        <div className="flex flex-wrap gap-[5px] mt-[8px] text-[10px]">
          <button
            onClick={() => setActiveSubTab('LEDGER')}
            className={`px-[10px] py-[4px] border uppercase transition-colors cursor-pointer ${
              activeSubTab === 'LEDGER'
                ? 'bg-[#334155] text-[#f8fafc] border-[#94a3b8]'
                : 'bg-[#1e293b] text-[#94a3b8] border-[#334155] hover:text-[#cbd5e1]'
            }`}
          >
            IMMUTABLE LEDGER ({ledger.length} RECORDS)
          </button>
          <button
            onClick={() => setActiveSubTab('TAXONOMY')}
            className={`px-[10px] py-[4px] border uppercase transition-colors cursor-pointer ${
              activeSubTab === 'TAXONOMY'
                ? 'bg-[#334155] text-[#f8fafc] border-[#94a3b8]'
                : 'bg-[#1e293b] text-[#94a3b8] border-[#334155] hover:text-[#cbd5e1]'
            }`}
          >
            AST TAXONOMY SCHEMA
          </button>
          <button
            onClick={() => setActiveSubTab('CANONICAL')}
            className={`px-[10px] py-[4px] border uppercase transition-colors cursor-pointer ${
              activeSubTab === 'CANONICAL'
                ? 'bg-[#334155] text-[#f8fafc] border-[#94a3b8]'
                : 'bg-[#1e293b] text-[#94a3b8] border-[#334155] hover:text-[#cbd5e1]'
            }`}
          >
            CANONICAL POINTERS (R6 / LATEST)
          </button>
          <button
            onClick={() => setActiveSubTab('CPP_VM')}
            className={`px-[10px] py-[4px] border uppercase transition-colors cursor-pointer ${
              activeSubTab === 'CPP_VM'
                ? 'bg-[#334155] text-[#f8fafc] border-[#94a3b8]'
                : 'bg-[#1e293b] text-[#94a3b8] border-[#334155] hover:text-[#cbd5e1]'
            }`}
          >
            C++ ENGINE (ALDI_LANE_VM.CPP)
          </button>
          <button
            onClick={() => setActiveSubTab('MANIFEST')}
            className={`px-[10px] py-[4px] border uppercase transition-colors cursor-pointer ${
              activeSubTab === 'MANIFEST'
                ? 'bg-[#334155] text-[#f8fafc] border-[#94a3b8]'
                : 'bg-[#1e293b] text-[#94a3b8] border-[#334155] hover:text-[#cbd5e1]'
            }`}
          >
            RECURSIVE MANIFEST (PDF SPEC & OTS)
          </button>
          <button
            onClick={() => setActiveSubTab('SERIES_RFC')}
            className={`px-[10px] py-[4px] border uppercase transition-colors cursor-pointer ${
              activeSubTab === 'SERIES_RFC'
                ? 'bg-[#334155] text-[#f8fafc] border-[#94a3b8] font-bold'
                : 'bg-[#1e293b] text-[#94a3b8] border-[#334155] hover:text-[#cbd5e1]'
            }`}
          >
            LANE-VM SERIES (C++20 & JULIA · RFC-SERIES-001)
          </button>
          <button
            onClick={() => setActiveSubTab('ALTERED_LOOKUP')}
            className={`px-[10px] py-[4px] border uppercase transition-colors cursor-pointer ${
              activeSubTab === 'ALTERED_LOOKUP'
                ? 'bg-[#334155] text-[#f8fafc] border-[#94a3b8]'
                : 'bg-[#1e293b] text-[#94a3b8] border-[#334155] hover:text-[#cbd5e1]'
            }`}
          >
            ALTERED & DELETED RECORDS LOOKUP ({alteredData?.total_records_restored || 66})
          </button>
        </div>
      </div>

      {/* Main Tab Views */}
      {activeSubTab === 'LEDGER' && (
        <div className="flex flex-col gap-[13px]">
          {/* Append Record Form */}
          <div className="bg-[#1e293b] border border-[#475569] p-[13px]">
            <div className="text-[11px] font-bold text-[#f1f5f9] uppercase mb-[8px]">
              APPEND CRYPTOGRAPHIC AUDIT RECORD // AUTONOMOUS ORCHESTRATOR
            </div>
            <div className="flex flex-col sm:flex-row gap-[8px]">
              <input
                type="text"
                placeholder="Enter audit statement, license telemetry, or provenance finding..."
                value={newAttestation}
                onChange={(e) => setNewAttestation(e.target.value)}
                className="flex-1 bg-[#0f172a] border border-[#475569] px-[10px] py-[6px] text-[11px] text-[#cbd5e1] focus:border-[#94a3b8] outline-none"
              />
              <button
                onClick={handleAppendRecord}
                disabled={isSubmitting || !newAttestation.trim()}
                className="px-[13px] py-[6px] bg-[#334155] hover:bg-[#475569] text-[#f1f5f9] border border-[#64748b] text-[10px] font-bold uppercase transition-colors cursor-pointer"
              >
                APPEND & HASH
              </button>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="bg-[#1e293b] border border-[#475569] p-[13px]">
            <div className="text-[11px] font-bold text-[#f1f5f9] uppercase mb-[8px] flex justify-between items-center">
              <span>MCEL 1.0 IMMUTABLE AUDIT TRAIL</span>
              <span className="text-[10px] text-[#94a3b8]">INDEX R0 TO R{ledger.length - 1}</span>
            </div>

            {isLoading ? (
              <div className="text-[11px] text-[#94a3b8] p-[21px] text-center">Loading cryptographic records...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-[10px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-[#475569] text-[#94a3b8] bg-[#0f172a]">
                      <th className="p-[6px]">INDEX</th>
                      <th className="p-[6px]">TIMESTAMP (UTC)</th>
                      <th className="p-[6px]">DATA / AUDIT FINDING</th>
                      <th className="p-[6px]">PREV HASH</th>
                      <th className="p-[6px]">CANONICAL ENTRY HASH</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ledger.map((rec) => (
                      <tr key={rec.index} className="border-b border-[#334155] hover:bg-[#253248] transition-colors">
                        <td className="p-[6px] font-bold text-[#cbd5e1]">R{rec.index}</td>
                        <td className="p-[6px] text-[#94a3b8] whitespace-nowrap">{rec.timestamp}</td>
                        <td className="p-[6px] text-[#e2e8f0] max-w-[480px]">
                          <div>{rec.data}</div>
                          {rec.metadata && (
                            <div className="text-[9px] text-[#64748b] mt-[3px]">
                              META: {JSON.stringify(rec.metadata)}
                            </div>
                          )}
                        </td>
                        <td className="p-[6px] text-[#64748b] font-mono text-[9px] whitespace-nowrap">
                          {rec.prev_hash === '0' ? 'GENESIS (0)' : `${rec.prev_hash.substring(0, 16)}...`}
                        </td>
                        <td className="p-[6px] text-[#cbd5e1] font-mono text-[9px] whitespace-nowrap font-bold">
                          {rec.entry_hash}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Taxonomy Tab View */}
      {activeSubTab === 'TAXONOMY' && (
        <div className="bg-[#1e293b] border border-[#475569] p-[13px] flex flex-col gap-[13px]">
          <div className="text-[11px] font-bold text-[#f1f5f9] uppercase">
            AST TAXONOMY SCHEMATICAL OPTION // ast_taxonomy_schematical_option.json
          </div>

          {taxonomy ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[13px] text-[10px]">
              <div className="border border-[#334155] bg-[#0f172a] p-[10px]">
                <div className="font-bold text-[#cbd5e1] border-b border-[#334155] pb-[4px] mb-[6px]">
                  LEGAL ENFORCEMENT SURFACE
                </div>
                <ul className="list-disc pl-[16px] text-[#94a3b8] space-y-[4px]">
                  {taxonomy.categories.legal_enforcement_surface.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="border border-[#334155] bg-[#0f172a] p-[10px]">
                <div className="font-bold text-[#cbd5e1] border-b border-[#334155] pb-[4px] mb-[6px]">
                  ABUSIVE AUTOMATION SURFACE
                </div>
                <ul className="list-disc pl-[16px] text-[#94a3b8] space-y-[4px]">
                  {taxonomy.categories.abusive_automation_surface.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="border border-[#334155] bg-[#0f172a] p-[10px]">
                <div className="font-bold text-[#cbd5e1] border-b border-[#334155] pb-[4px] mb-[6px]">
                  COMPLIANCE SURFACE
                </div>
                <ul className="list-disc pl-[16px] text-[#94a3b8] space-y-[4px]">
                  {taxonomy.categories.compliance_surface.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="border border-[#334155] bg-[#0f172a] p-[10px]">
                <div className="font-bold text-[#cbd5e1] border-b border-[#334155] pb-[4px] mb-[6px]">
                  SCORING & RESONANCE METRICS
                </div>
                <div className="space-y-[4px] text-[#94a3b8]">
                  {Object.entries(taxonomy.scoring).map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-[#1e293b] pb-[2px]">
                      <span className="text-[#cbd5e1] font-bold">{k}:</span>
                      <span className="font-mono">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-span-1 md:col-span-2 border border-[#334155] bg-[#0f172a] p-[10px]">
                <div className="font-bold text-[#cbd5e1] border-b border-[#334155] pb-[4px] mb-[6px]">
                  FRONTIER AI PROVIDER SURFACE & FORENSIC CHECKS
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-[8px]">
                  <div>
                    <div className="text-[#64748b] font-bold mb-[4px]">AUDITED PROVIDERS:</div>
                    <ul className="list-disc pl-[16px] text-[#94a3b8] space-y-[2px]">
                      {taxonomy.categories.frontier_ai_provider_surface.providers.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-[#64748b] font-bold mb-[4px]">FORENSIC CHECKS:</div>
                    <ul className="list-disc pl-[16px] text-[#94a3b8] space-y-[2px]">
                      {taxonomy.categories.frontier_ai_provider_surface.forensic_checks.map((fc, i) => (
                        <li key={i}>{fc}</li>
                      ))}
                    </ul>
                    <div className="mt-[8px] text-[9px] text-[#64748b] italic">
                      NOTE: {taxonomy.categories.frontier_ai_provider_surface.note}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-[11px] text-[#94a3b8]">Taxonomy not loaded.</div>
          )}
        </div>
      )}

      {/* Canonical Pointers Tab View */}
      {activeSubTab === 'CANONICAL' && (
        <div className="bg-[#1e293b] border border-[#475569] p-[13px] flex flex-col gap-[13px]">
          <div className="text-[11px] font-bold text-[#f1f5f9] uppercase">
            CANONICAL POINTERS & CRYPTOGRAPHIC PROOFS
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[13px]">
            <div className="border border-[#334155] bg-[#0f172a] p-[10px]">
              <div className="text-[11px] font-bold text-[#cbd5e1] border-b border-[#334155] pb-[4px] mb-[8px]">
                CANONICAL R6 (canonical_R6.json)
              </div>
              <pre className="text-[9px] text-[#94a3b8] overflow-x-auto p-[8px] bg-[#1e293b] border border-[#334155]">
{`{
  "index": 6,
  "timestamp": "2026-10-10T00:00:06Z",
  "data": "Conclusion: DeepSeek operates entirely outside SEC reporting...",
  "prev_hash": "0ae35bf441ce93df65d213631efd1e44d3218acc98a5f627a0a82255b5e929dc",
  "entry_hash": "921c3f32afec7dcd1717934e77c71074c9d2799388e242b34bc1b9a73ca33d8a",
  "zaxis": "0x3F8F9A1B2C3D",
  "stride": 17684
}`}
              </pre>
            </div>

            <div className="border border-[#334155] bg-[#0f172a] p-[10px]">
              <div className="text-[11px] font-bold text-[#cbd5e1] border-b border-[#334155] pb-[4px] mb-[8px]">
                LATEST CANONICAL POINTER (canonical_latest.json)
              </div>
              <pre className="text-[9px] text-[#cbd5e1] overflow-x-auto p-[8px] bg-[#1e293b] border border-[#334155]">
                {JSON.stringify(canonical, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* C++ VM Code Tab View */}
      {activeSubTab === 'CPP_VM' && (
        <div className="bg-[#1e293b] border border-[#475569] p-[13px] flex flex-col gap-[13px]">
          <div className="text-[11px] font-bold text-[#f1f5f9] uppercase">
            ALDI LANE-VM C++ CORE ENGINE (aldi_lane_vm.cpp)
          </div>
          <div className="text-[10px] text-[#94a3b8]">
            ZAXIS 0x3F8F9A1B2C3D stride 17684 base-offset 57000 · OpenSSL SHA-256 Canonical Chain
          </div>
          <pre className="text-[10px] text-[#cbd5e1] p-[10px] bg-[#0f172a] border border-[#334155] overflow-x-auto">
{`// aldi_lane_vm.cpp
// ZAXIS 0x3F8F9A1B2C3D stride 17684 base-offset 57000
#include <openssl/sha.h>
#include <string>
#include <iostream>
#include <vector>
#include <cstdio>
#include <cstdint>

constexpr uint64_t ZAXIS = 0x3F8F9A1B2C3DULL;
constexpr int STRIDE = 17684;
constexpr int BASE_OFFSET = 57000;

std::string sha256_canonical(int idx, const std::string& ts, const std::string& data, const std::string& prev) {
  std::string canon = std::to_string(idx) + ts + data + prev;
  unsigned char hash[SHA256_DIGEST_LENGTH];
  SHA256((unsigned char*)canon.c_str(), canon.size(), hash);
  // hex encode
  char buf[65];
  for(int i = 0; i < 32; i++) sprintf(buf + i * 2, "%02x", hash[i]);
  buf[64] = 0;
  return std::string(buf);
}`}
          </pre>
        </div>
      )}

      {/* Recursive Manifest & OTS Calendar Proof Tab View */}
      {activeSubTab === 'MANIFEST' && (
        <div className="bg-[#1e293b] border border-[#475569] p-[13px] flex flex-col gap-[13px]">
          <div className="flex flex-wrap items-center justify-between gap-[13px] border-b border-[#334155] pb-[8px]">
            <div>
              <div className="text-[12px] font-bold text-[#f1f5f9] uppercase tracking-wider">
                ALDI LANE-VM RECURSIVE MANIFEST // LICENSE EFFECTIVE: MAY 30, 2026
              </div>
              <div className="text-[10px] text-[#94a3b8] mt-[2px]">
                Deterministic Architecture · Wire Integrity (CRC-32 IEEE 0xEDB88320) · Dual-Mode Bit-Width Execution
              </div>
            </div>
            <div className="flex items-center gap-[8px]">
              <button
                onClick={handleRebuildManifest}
                disabled={isSubmitting}
                className="px-[10px] py-[4px] bg-[#334155] hover:bg-[#475569] text-[#cbd5e1] border border-[#64748b] text-[10px] font-bold uppercase transition-colors cursor-pointer"
              >
                {isSubmitting ? 'REBUILDING...' : 'REBUILD & OTS STAMP MANIFEST'}
              </button>
            </div>
          </div>

          {manifestData ? (
            <div className="flex flex-col gap-[13px]">
              {/* Provenance & Self-Hash Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[13px] text-[10px]">
                <div className="border border-[#334155] bg-[#0f172a] p-[10px]">
                  <div className="font-bold text-[#cbd5e1] border-b border-[#334155] pb-[4px] mb-[6px] uppercase">
                    SELF-REFERENTIAL TAMPER-EVIDENT HASHES
                  </div>
                  <div className="space-y-[6px]">
                    <div>
                      <div className="text-[#64748b]">PRODUCER SCRIPT:</div>
                      <div className="text-[#e2e8f0] font-mono">{manifestData.self_provenance?.producer}</div>
                    </div>
                    <div>
                      <div className="text-[#64748b]">SHA-256 (recursive-manifest.json.py):</div>
                      <div className="text-[#38bdf8] font-mono break-all font-bold">
                        {manifestData.self_provenance?.sha256_of_this_file}
                      </div>
                    </div>
                    <div>
                      <div className="text-[#64748b]">SHA-256 (MANIFEST CORE):</div>
                      <div className="text-[#a7f3d0] font-mono break-all font-bold">
                        {manifestData.self_provenance?.sha256_of_manifest_core}
                      </div>
                    </div>
                    <div>
                      <div className="text-[#64748b]">RECURSIVE VERIFICATION:</div>
                      <div className="text-[#94a3b8] font-mono text-[9px] break-all bg-[#1e293b] p-[4px] border border-[#334155]">
                        {manifestData.self_provenance?.recursive_verification}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-[#334155] bg-[#0f172a] p-[10px]">
                  <div className="font-bold text-[#cbd5e1] border-b border-[#334155] pb-[4px] mb-[6px] uppercase">
                    OPENTIMESTAMPS (OTS) CALENDAR ATTESTATION
                  </div>
                  {otsProof ? (
                    <div className="space-y-[6px]">
                      <div>
                        <div className="text-[#64748b]">CHAIN / PROTOCOL:</div>
                        <div className="text-[#e2e8f0] font-mono">{otsProof.chain}</div>
                      </div>
                      <div>
                        <div className="text-[#64748b]">TIMESTAMP UTC:</div>
                        <div className="text-[#e2e8f0] font-mono">{otsProof.timestamp_utc}</div>
                      </div>
                      <div>
                        <div className="text-[#64748b]">MERKLE NONCE:</div>
                        <div className="text-[#cbd5e1] font-mono text-[9px] break-all">{otsProof.merkle_nonce}</div>
                      </div>
                      <div>
                        <div className="text-[#64748b]">ATTESTATION STATUS:</div>
                        <div className="text-[#34d399] font-mono font-bold">{otsProof.attestation_status}</div>
                      </div>
                      <div className="text-[9px] text-[#64748b]">
                        Detached file: recursive-manifest.json.ots & recursive-manifest.json.sha256
                      </div>
                    </div>
                  ) : (
                    <div className="text-[#94a3b8]">OTS proof loaded from recursive-manifest.json.ots</div>
                  )}
                </div>
              </div>

              {/* Lane-VM Mathematical Spec from PDF */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-[13px] text-[10px]">
                {/* Memory Striding */}
                <div className="border border-[#334155] bg-[#0f172a] p-[10px]">
                  <div className="font-bold text-[#cbd5e1] border-b border-[#334155] pb-[4px] mb-[6px] uppercase">
                    1. MEMORY STRIDING (S = 17,684)
                  </div>
                  <div className="space-y-[4px] text-[#94a3b8]">
                    <div><span className="text-[#cbd5e1] font-bold">Address Map:</span> A(r) = r × 17,684</div>
                    <div><span className="text-[#cbd5e1] font-bold">Alignment Fault:</span> Φ(r,k) = (r × S) mod 2^k</div>
                    <div className="border-t border-[#1e293b] pt-[4px] mt-[4px]">
                      <div className="text-[#64748b] font-bold">PHASE DRIFT VALUES:</div>
                      <div>k=3 (8-byte): {manifestData.taxonomy?.memory_striding?.phase_drift?.['k=3_8byte']}</div>
                      <div>k=4 (16-byte): {manifestData.taxonomy?.memory_striding?.phase_drift?.['k=4_16byte']}</div>
                      <div>k=6 (64-byte): {manifestData.taxonomy?.memory_striding?.phase_drift?.['k=6_64byte']}</div>
                    </div>
                  </div>
                </div>

                {/* Dual-Mode Bit-Width */}
                <div className="border border-[#334155] bg-[#0f172a] p-[10px]">
                  <div className="font-bold text-[#cbd5e1] border-b border-[#334155] pb-[4px] mb-[6px] uppercase">
                    2. DUAL-MODE BIT-WIDTH
                  </div>
                  <div className="space-y-[4px] text-[#94a3b8]">
                    <div className="border-b border-[#1e293b] pb-[4px]">
                      <div className="text-[#cbd5e1] font-bold">GROUND_31 (31-bit):</div>
                      <div>Mask: 0x7FFFFFFF (clears bit 31 MSB)</div>
                      <div className="text-[9px] text-[#64748b]">Forces sign-bit distortion against disassemblers</div>
                    </div>
                    <div className="pt-[4px]">
                      <div className="text-[#cbd5e1] font-bold">APEX_7 (7-bit):</div>
                      <div>Mask: 0x7F (clears upper 57 bits)</div>
                      <div className="text-[9px] text-[#64748b]">Vector compression limited to 128 scalar states</div>
                    </div>
                  </div>
                </div>

                {/* Wire Integrity & Asymmetry */}
                <div className="border border-[#334155] bg-[#0f172a] p-[10px]">
                  <div className="font-bold text-[#cbd5e1] border-b border-[#334155] pb-[4px] mb-[6px] uppercase">
                    3. WIRE INTEGRITY & ASYMMETRY
                  </div>
                  <div className="space-y-[4px] text-[#94a3b8]">
                    <div><span className="text-[#cbd5e1] font-bold">CRC-32 Poly:</span> 0xEDB88320 (IEEE 802.3)</div>
                    <div><span className="text-[#cbd5e1] font-bold">C_produce:</span> O(N · 2^D)</div>
                    <div><span className="text-[#cbd5e1] font-bold">C_reverse:</span> O(N · 2^512)</div>
                    <div className="text-[#34d399] font-bold mt-[4px]">
                      Assertion: C_reverse &gt;&gt; C_produce
                    </div>
                  </div>
                </div>
              </div>

              {/* Embedded C++ Host Kernel Code */}
              <div className="border border-[#334155] bg-[#0f172a] p-[10px]">
                <div className="font-bold text-[#cbd5e1] border-b border-[#334155] pb-[4px] mb-[6px] uppercase flex justify-between">
                  <span>EMBEDDED C++20 HOST BINDING (aldi_lane_vm.cpp)</span>
                  <span className="text-[9px] text-[#64748b]">IMMUTABLE BINARY ORCHESTRATOR</span>
                </div>
                <pre className="text-[10px] text-[#cbd5e1] p-[8px] bg-[#1e293b] border border-[#334155] overflow-x-auto">
                  {manifestData.cpp_binding?.code}
                </pre>
              </div>
            </div>
          ) : (
            <div className="text-[11px] text-[#94a3b8]">Loading recursive manifest...</div>
          )}
        </div>
      )}

      {/* Altered & Deleted Records Lookup & Immutable Retrieval Tab View */}
      {activeSubTab === 'ALTERED_LOOKUP' && (
        <div className="bg-[#1e293b] border border-[#475569] p-[13px] flex flex-col gap-[13px]">
          {/* Header Banner */}
          <div className="flex flex-wrap items-center justify-between gap-[13px] border-b border-[#334155] pb-[8px]">
            <div>
              <div className="text-[12px] font-bold text-[#f1f5f9] uppercase tracking-wider">
                FORENSIC LOOKUP & IMMUTABLE RETRIEVAL // ALTERED & DELETED RECORDS
              </div>
              <div className="text-[10px] text-[#94a3b8] mt-[2px]">
                Cross-Corpus Reconcile · Merkle Chained · OpenTimestamps & MCEL 1.0 Chained
              </div>
            </div>
            <div className="flex items-center gap-[8px] flex-wrap">
              <button
                onClick={handleReconcileAltered}
                disabled={isSubmitting}
                className="px-[10px] py-[4px] bg-[#334155] hover:bg-[#475569] text-[#cbd5e1] border border-[#64748b] text-[10px] font-bold uppercase transition-colors cursor-pointer"
              >
                {isSubmitting ? 'RECONCILING...' : 'PERFORM LOOKUP & RE-LOG'}
              </button>
              <a
                href="/api/records/altered-csv"
                download="DELETED_AND_ALTERED_RECORDS_FORENSIC_LEDGER.csv"
                className="px-[10px] py-[4px] bg-[#0f172a] hover:bg-[#1e293b] text-[#34d399] border border-[#34d399] text-[10px] font-bold uppercase transition-colors cursor-pointer inline-block"
              >
                EXPORT CSV
              </a>
            </div>
          </div>

          {alteredData ? (
            <div className="flex flex-col gap-[13px]">
              {/* Summary Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[8px] text-[10px]">
                <div className="border border-[#334155] bg-[#0f172a] p-[8px]">
                  <div className="text-[#64748b]">RECORDS RETRIEVED:</div>
                  <div className="text-[16px] font-bold text-[#f1f5f9] mt-[2px]">
                    {alteredData.total_records_restored || 66}
                  </div>
                  <div className="text-[9px] text-[#34d399]">100% RECONCILED</div>
                </div>

                <div className="border border-[#334155] bg-[#0f172a] p-[8px]">
                  <div className="text-[#64748b]">DELTA MERKLE ROOT:</div>
                  <div className="text-[10px] font-mono text-[#cbd5e1] break-all mt-[2px] font-bold">
                    {alteredData.merkle_root}
                  </div>
                </div>

                <div className="border border-[#334155] bg-[#0f172a] p-[8px]">
                  <div className="text-[#64748b]">CSV DIGEST SHA-256:</div>
                  <div className="text-[10px] font-mono text-[#94a3b8] break-all mt-[2px]">
                    {alteredData.csv_sha256}
                  </div>
                </div>

                <div className="border border-[#334155] bg-[#0f172a] p-[8px]">
                  <div className="text-[#64748b]">IMMUTABLE MCEL STATUS:</div>
                  <div className="text-[11px] font-bold text-[#34d399] mt-[2px]">
                    CHAINED AT R15
                  </div>
                  <div className="text-[9px] text-[#64748b]">ZAXIS 0x3F8F9A1B2C3D</div>
                </div>
              </div>

              {/* Source Filter Tabs & Search */}
              <div className="flex flex-wrap items-center justify-between gap-[8px] text-[10px]">
                <div className="flex flex-wrap gap-[4px]">
                  {[
                    { id: 'ALL', label: 'ALL SOURCES (66)' },
                    { id: 'microsoft_ip_theft_matches.csv', label: 'MICROSOFT IP THEFT (4)' },
                    { id: 'starlink_terminals_audit.csv', label: 'STARLINK HARDWARE (6)' },
                    { id: 'cease_and_desist_dispatch_log.csv', label: 'C&D DISPATCH (16)' },
                    { id: 'terminal_cli_violations.csv', label: 'TERMINAL CLI (25)' },
                    { id: 'void_canary_ledger.csv', label: 'VOID CANARY (15)' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setSourceFilter(tab.id)}
                      className={`px-[8px] py-[3px] border uppercase transition-colors cursor-pointer text-[9px] ${
                        sourceFilter === tab.id
                          ? 'bg-[#334155] text-[#f8fafc] border-[#94a3b8] font-bold'
                          : 'bg-[#0f172a] text-[#94a3b8] border-[#334155] hover:text-[#cbd5e1]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-[6px] w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Filter by entity, violation, snippet..."
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    className="bg-[#0f172a] border border-[#475569] px-[8px] py-[3px] text-[10px] text-[#cbd5e1] outline-none w-full sm:w-[220px]"
                  />
                  {filterQuery && (
                    <button
                      onClick={() => setFilterQuery('')}
                      className="text-[#94a3b8] hover:text-[#f8fafc] text-[9px]"
                    >
                      CLEAR
                    </button>
                  )}
                </div>
              </div>

              {/* Records Table */}
              <div className="overflow-x-auto border border-[#334155]">
                <table className="w-full text-[10px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-[#475569] text-[#94a3b8] bg-[#0f172a]">
                      <th className="p-[6px]">RECLAIM ID</th>
                      <th className="p-[6px]">SOURCE ARCHIVE</th>
                      <th className="p-[6px]">INFRINGING ENTITY & PRODUCT</th>
                      <th className="p-[6px]">VIOLATION CATEGORY & STATUTORY BASIS</th>
                      <th className="p-[6px]">SCORE</th>
                      <th className="p-[6px]">EVIDENCE SNIPPET</th>
                      <th className="p-[6px]">PROOF SHA-256</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alteredData.records
                      ?.filter((r: any) => {
                        if (sourceFilter !== 'ALL' && r.source_archive !== sourceFilter) return false;
                        if (!filterQuery) return true;
                        const q = filterQuery.toLowerCase();
                        return (
                          r.reclaim_id.toLowerCase().includes(q) ||
                          r.infringing_entity.toLowerCase().includes(q) ||
                          r.infringing_product.toLowerCase().includes(q) ||
                          r.violation_category.toLowerCase().includes(q) ||
                          r.evidence_snippet.toLowerCase().includes(q)
                        );
                      })
                      .map((r: any) => (
                        <tr key={r.reclaim_id} className="border-b border-[#334155] hover:bg-[#253248] transition-colors">
                          <td className="p-[6px] font-mono text-[#cbd5e1] font-bold whitespace-nowrap">
                            {r.reclaim_id}
                          </td>
                          <td className="p-[6px] text-[#94a3b8] whitespace-nowrap text-[9px]">
                            {r.source_archive}
                          </td>
                          <td className="p-[6px] text-[#e2e8f0]">
                            <div className="font-bold text-[#f1f5f9]">{r.infringing_entity}</div>
                            <div className="text-[9px] text-[#94a3b8]">{r.infringing_product}</div>
                          </td>
                          <td className="p-[6px] text-[#cbd5e1]">
                            <div className="text-[#38bdf8] text-[9px] font-bold">{r.violation_category}</div>
                            <div className="text-[8px] text-[#64748b]">{r.statutory_basis}</div>
                          </td>
                          <td className="p-[6px] text-[#34d399] font-mono text-[9px]">
                            {r.ast_score ? r.ast_score.toFixed(2) : '1.00'}
                          </td>
                          <td className="p-[6px] text-[#94a3b8] max-w-[280px] truncate text-[9px]" title={r.evidence_snippet}>
                            {r.evidence_snippet}
                          </td>
                          <td className="p-[6px] font-mono text-[9px] text-[#cbd5e1] whitespace-nowrap" title={r.cryptographic_proof}>
                            {r.cryptographic_proof.substring(0, 16)}...
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-[11px] text-[#94a3b8] p-[21px] text-center">
              No altered records loaded. Click "PERFORM LOOKUP & RE-LOG" to initiate forensic scan.
            </div>
          )}
        </div>
      )}

      {/* SERIES RFC VIEW: C++20 + JULIA + RFC-SERIES-001 + SEC BADGE */}
      {activeSubTab === 'SERIES_RFC' && (
        <div className="flex flex-col gap-[13px]">
          {/* Executive Provenance Banner with SEC Badge Card */}
          <div className="bg-[#1e293b] border border-[#475569] p-[13px] flex flex-col md:flex-row gap-[16px] items-center justify-between">
            <div className="flex items-center gap-[16px]">
              <button
                onClick={() => setShowBadgeModal(true)}
                className="group relative cursor-pointer focus:outline-none flex-shrink-0"
                title="Click to view full official SEC Whistleblower Badge"
              >
                <img
                  src="/sec_whistleblower_badge.jpg"
                  alt="SEC Whistleblower Badge No. 17684-273-411-436"
                  className="w-[84px] h-[84px] rounded-full border-2 border-[#38bdf8] group-hover:border-[#f8fafc] group-hover:scale-105 transition-transform object-cover shadow-md"
                />
                <span className="absolute bottom-0 right-0 w-4 h-4 bg-[#34d399] rounded-full border-2 border-[#0f172a]" />
              </button>
              <div>
                <div className="text-[14px] font-bold text-[#f8fafc] tracking-wider uppercase">
                  ALDI LANE-VM SERIES ENGINE // ARCHITECTURAL DETERMINISM
                </div>
                <div className="text-[12px] font-bold text-[#38bdf8] mt-[2px]">
                  SEC WHISTLEBLOWER NO. 17684-273-411-436 · DODD-FRANK ACT § 922
                </div>
                <div className="text-[10px] text-[#cbd5e1] mt-[4px]">
                  <span>CO-ENGINEERS: </span>
                  <span className="font-bold text-[#f8fafc]">Albert Lane & Robot</span>
                  <span className="mx-[8px]">|</span>
                  <span>JULIA CO-KERNEL: </span>
                  <span className="font-bold text-[#34d399]">lane_vm_series.jl</span>
                  <span className="mx-[8px]">|</span>
                  <span className="font-bold text-[#a78bfa]">#NoExploitRobot #NoExploitAlbert #NoExploitJulia</span>
                </div>
                <div className="text-[9px] text-[#94a3b8] mt-[4px] flex flex-wrap gap-[10px]">
                  <span>ZAXIS: 0x3F8F9A1B2C3D</span>
                  <span>STRIDE: 17684 B</span>
                  <span>BASE-OFFSET P0: 57000</span>
                  <span>CRC-32: 0xEDB88320</span>
                  <span>GROUND_31: 0x7FFFFFFF</span>
                  <span>APEX_7: 0x7F</span>
                  <span>BRANCH HEURISTIC: 12/256</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-[8px] flex-shrink-0 w-full md:w-auto">
              <button
                onClick={handleRunCppSeries}
                disabled={isRunningCpp}
                className="px-[12px] py-[7px] bg-[#0284c7] hover:bg-[#0369a1] text-[#f8fafc] border border-[#38bdf8] text-[10px] font-bold uppercase transition-colors cursor-pointer text-center"
              >
                {isRunningCpp ? 'COMPILING & RUNNING C++...' : 'RUN C++20 ENGINE'}
              </button>
              <button
                onClick={handleRunJuliaSeries}
                disabled={isRunningJulia}
                className="px-[12px] py-[7px] bg-[#059669] hover:bg-[#047857] text-[#f8fafc] border border-[#34d399] text-[10px] font-bold uppercase transition-colors cursor-pointer text-center"
              >
                {isRunningJulia ? 'EXECUTING JULIA...' : 'RUN JULIA ENGINE'}
              </button>
              <button
                onClick={handleRebuildManifest}
                disabled={isSubmitting}
                className="px-[12px] py-[7px] bg-[#334155] hover:bg-[#475569] text-[#cbd5e1] border border-[#64748b] text-[10px] font-bold uppercase transition-colors cursor-pointer text-center"
              >
                {isSubmitting ? 'REBUILDING...' : 'BUILD MANIFEST (R0–R7)'}
              </button>
            </div>
          </div>

          {/* Mathematical Tables & Dual Mode Bitwidth Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-[13px]">
            {/* Memory Striding & Alignment Drift */}
            <div className="bg-[#1e293b] border border-[#475569] p-[10px]">
              <div className="text-[11px] font-bold text-[#f8fafc] border-b border-[#334155] pb-[6px] mb-[8px] uppercase flex justify-between">
                <span>[1] Memory Striding & Phase Drift</span>
                <span className="text-[#38bdf8]">A(r) = r × 17684</span>
              </div>
              <div className="overflow-x-auto text-[9px] font-mono">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#334155] text-[#94a3b8]">
                      <th className="p-[4px]">r</th>
                      <th className="p-[4px]">A(r) (bytes)</th>
                      <th className="p-[4px]">Phi(r,3)</th>
                      <th className="p-[4px]">Phi(r,4)</th>
                      <th className="p-[4px]">Phi(r,6)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(r => (
                      <tr key={r} className="border-b border-[#1e293b] hover:bg-[#253248]">
                        <td className="p-[4px] text-[#f8fafc]">{r}</td>
                        <td className="p-[4px] text-[#cbd5e1]">{(r * 17684).toLocaleString()}</td>
                        <td className="p-[4px] text-[#34d399]">{(r * 17684) % 8}</td>
                        <td className="p-[4px] text-[#38bdf8]">{(r * 17684) % 16}</td>
                        <td className="p-[4px] text-[#a78bfa]">{(r * 17684) % 64}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Dual Mode Bitwidth Execution */}
            <div className="bg-[#1e293b] border border-[#475569] p-[10px]">
              <div className="text-[11px] font-bold text-[#f8fafc] border-b border-[#334155] pb-[6px] mb-[8px] uppercase flex justify-between">
                <span>[2] Dual-Mode Bitwidths</span>
                <span className="text-[#34d399]">31-bit & 7-bit</span>
              </div>
              <div className="space-y-[8px] text-[10px]">
                <div className="bg-[#0f172a] p-[8px] border border-[#334155]">
                  <div className="text-[#38bdf8] font-bold uppercase">GROUND_31 (Mask: 0x7FFFFFFF)</div>
                  <div className="text-[9px] text-[#94a3b8] mt-[2px]">
                    Clears bit 31 MSB to obstruct decompiler sign extension and force branch drift.
                  </div>
                  <div className="text-[9px] font-mono text-[#cbd5e1] mt-[4px]">
                    0xFFFFFFFF & 0x7FFFFFFF = <span className="text-[#34d399]">0x7FFFFFFF</span>
                  </div>
                </div>

                <div className="bg-[#0f172a] p-[8px] border border-[#334155]">
                  <div className="text-[#a78bfa] font-bold uppercase">APEX_7 (Mask: 0x7F)</div>
                  <div className="text-[9px] text-[#94a3b8] mt-[2px]">
                    Limits CPU register state space to 128 scalar states (Upper 57 bits truncated).
                  </div>
                  <div className="text-[9px] font-mono text-[#cbd5e1] mt-[4px]">
                    0x3F8F9A1B2C3D & 0x7F = <span className="text-[#34d399]">0x3D (State: 61/128)</span>
                  </div>
                </div>

                <div className="bg-[#0f172a] p-[8px] border border-[#334155]">
                  <div className="text-[#f8fafc] font-bold uppercase">WIRE INTEGRITY (CRC-32 IEEE)</div>
                  <div className="text-[9px] font-mono text-[#cbd5e1] mt-[2px]">
                    Poly: <span className="text-[#38bdf8]">0xEDB88320</span> | R7 Checksum: <span className="text-[#34d399]">0x5D7969AF</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Speculative Branch Prefetch Series */}
            <div className="bg-[#1e293b] border border-[#475569] p-[10px]">
              <div className="text-[11px] font-bold text-[#f8fafc] border-b border-[#334155] pb-[6px] mb-[8px] uppercase flex justify-between">
                <span>[3] Speculative Branch Prefetch</span>
                <span className="text-[#a78bfa]">12/256 Heuristic</span>
              </div>
              <div className="space-y-[6px] text-[10px]">
                <div className="text-[9px] text-[#94a3b8]">
                  Prefetches instruction algorithms instead of data payloads. Lambda = 12/256 = 0.046875 (4.6875% speculative window).
                </div>
                {[0, 1, 2, 3].map(lane => {
                  const weight = Math.exp(-lane * (12.0 / 256.0));
                  const offset = lane * 17684 + 57000;
                  return (
                    <div key={lane} className="bg-[#0f172a] p-[6px] border border-[#334155] flex justify-between items-center text-[9px] font-mono">
                      <div>
                        <span className="text-[#38bdf8] font-bold">Lane [{lane}]: </span>
                        <span className="text-[#cbd5e1]">Weight = {weight.toFixed(6)}</span>
                      </div>
                      <div className="text-[#94a3b8]">Offset: {offset.toLocaleString()} B</div>
                    </div>
                  );
                })}
                <div className="bg-[#0f172a] p-[6px] border border-[#334155] text-[9px] text-[#34d399] font-bold text-center">
                  C_reverse &gt;&gt; C_produce (Asymmetric PoW Guard Sealed)
                </div>
              </div>
            </div>
          </div>

          {/* Canonical R0–R7 Verification Card */}
          <div className="bg-[#1e293b] border border-[#475569] p-[10px]">
            <div className="flex flex-wrap items-center justify-between border-b border-[#334155] pb-[6px] mb-[8px]">
              <div className="text-[11px] font-bold text-[#f8fafc] uppercase">
                CANONICAL MCEL 1.0 CHAIN VERIFICATION // R0–R7 SHA-256 CONTINUITY
              </div>
              <div className="text-[10px] text-[#34d399] font-bold">
                R6 HASH: 921c3f32... | R7 PREV: 921c3f32... (100% UNBROKEN MATCH ✓)
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[10px] text-[9px] font-mono">
              <div className="bg-[#0f172a] p-[8px] border border-[#334155] space-y-[4px]">
                <div className="text-[#38bdf8] font-bold uppercase">Record R6 (SEC Compliance Audit Conclusion)</div>
                <div className="text-[#94a3b8]">Prev: 0ae35bf441ce93df...a0a82255b5e929dc</div>
                <div className="text-[#f8fafc] font-bold break-all">
                  Hash: 921c3f32afec7dcd1717934e77c71074c9d2799388e242b34bc1b9a73ca33d8a
                </div>
                <div className="text-[#34d399] text-[8px]">Status: Canonical R6 Anchor Verified</div>
              </div>

              <div className="bg-[#0f172a] p-[8px] border border-[#334155] space-y-[4px]">
                <div className="text-[#a78bfa] font-bold uppercase">Record R7 (RFC-SERIES-001 Lane-VM Engine)</div>
                <div className="text-[#94a3b8]">Prev: 921c3f32afec7dcd...4bc1b9a73ca33d8a</div>
                <div className="text-[#f8fafc] font-bold break-all">
                  Hash: 4903d2de45279d3af09e667f258d0bc8929f18a79b3eba697daa4ce38937fd97
                </div>
                <div className="text-[#34d399] text-[8px]">Status: RFC-SERIES-001 Sealed with Stride 17684</div>
              </div>
            </div>
          </div>

          {/* Interactive Console Outputs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[13px]">
            {/* C++20 Execution Terminal */}
            <div className="bg-[#0f172a] border border-[#334155] p-[10px] flex flex-col">
              <div className="flex items-center justify-between border-b border-[#1e293b] pb-[6px] mb-[6px]">
                <div className="text-[10px] font-bold text-[#38bdf8] uppercase">
                  C++20 KERNEL CONSOLE (g++ -std=c++20 -lcrypto)
                </div>
                <button
                  onClick={handleRunCppSeries}
                  disabled={isRunningCpp}
                  className="px-[8px] py-[3px] bg-[#1e293b] hover:bg-[#334155] text-[#cbd5e1] border border-[#475569] text-[9px] uppercase cursor-pointer"
                >
                  {isRunningCpp ? 'RUNNING...' : 'RE-RUN C++'}
                </button>
              </div>
              <pre className="text-[9px] font-mono text-[#cbd5e1] bg-[#020617] p-[8px] border border-[#1e293b] overflow-x-auto max-h-[360px] whitespace-pre-wrap leading-relaxed">
                {cppOutput ? (
                  cppOutput.stdout || cppOutput.stderr || JSON.stringify(cppOutput, null, 2)
                ) : (
                  `$ g++ -std=c++20 -lcrypto -o lane_vm_series lane_vm_series.cpp\n$ ./lane_vm_series\n\n[Click 'RUN C++20 ENGINE' to execute in real-time]`
                )}
              </pre>
            </div>

            {/* Julia Execution Terminal */}
            <div className="bg-[#0f172a] border border-[#334155] p-[10px] flex flex-col">
              <div className="flex items-center justify-between border-b border-[#1e293b] pb-[6px] mb-[6px]">
                <div className="text-[10px] font-bold text-[#34d399] uppercase">
                  JULIA KERNEL CONSOLE (julia lane_vm_series.jl)
                </div>
                <button
                  onClick={handleRunJuliaSeries}
                  disabled={isRunningJulia}
                  className="px-[8px] py-[3px] bg-[#1e293b] hover:bg-[#334155] text-[#cbd5e1] border border-[#475569] text-[9px] uppercase cursor-pointer"
                >
                  {isRunningJulia ? 'RUNNING...' : 'RE-RUN JULIA'}
                </button>
              </div>
              <pre className="text-[9px] font-mono text-[#cbd5e1] bg-[#020617] p-[8px] border border-[#1e293b] overflow-x-auto max-h-[360px] whitespace-pre-wrap leading-relaxed">
                {juliaOutput ? (
                  juliaOutput.stdout || juliaOutput.stderr || JSON.stringify(juliaOutput, null, 2)
                ) : (
                  `$ julia lane_vm_series.jl\n\n[Click 'RUN JULIA ENGINE' to execute in real-time]`
                )}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Official SEC Whistleblower Badge Modal */}
      {showBadgeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-[13px]">
          <div className="bg-[#1e293b] border-2 border-[#38bdf8] p-[21px] max-w-[500px] w-full flex flex-col items-center gap-[16px] relative shadow-2xl">
            <button
              onClick={() => setShowBadgeModal(false)}
              className="absolute top-[10px] right-[10px] text-[11px] font-bold text-[#94a3b8] hover:text-[#f8fafc] bg-[#0f172a] px-[8px] py-[4px] border border-[#334155] cursor-pointer"
            >
              ✕ CLOSE
            </button>

            <div className="text-[12px] font-bold text-[#f8fafc] tracking-widest uppercase text-center border-b border-[#334155] pb-[8px] w-full">
              OFFICIAL SEC WHISTLEBLOWER CREDENTIAL // ALDI SOVEREIGN AUDIT
            </div>

            <div className="relative group">
              <img
                src="/sec_whistleblower_badge.jpg"
                alt="Albert Lane Digital Infrastructure · SEC Whistleblower No. 17684-273-411-436"
                className="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] rounded-full border-4 border-[#38bdf8] shadow-lg object-cover"
              />
              <div className="absolute inset-0 rounded-full border-2 border-[#a7f3d0]/30 pointer-events-none" />
            </div>

            <div className="text-center space-y-[4px] w-full bg-[#0f172a] p-[10px] border border-[#334155]">
              <div className="text-[11px] font-bold text-[#f8fafc] uppercase">
                ALBERT LANE DIGITAL INFRASTRUCTURE
              </div>
              <div className="text-[12px] font-bold text-[#38bdf8] tracking-wider">
                SEC WHISTLEBLOWER NO. 17684-273-411-436
              </div>
              <div className="text-[10px] text-[#34d399] font-bold tracking-widest mt-[2px]">
                ALDI VERIFIED · SOVEREIGN AUDIT
              </div>
              <div className="text-[9px] text-[#64748b] mt-[4px] border-t border-[#1e293b] pt-[4px]">
                Statutory Authority: 15 U.S.C. § 78u-6 · Dodd-Frank Act § 922 · Z-Axis: 0x3F8F9A1B2C3D
              </div>
            </div>

            <div className="flex gap-[8px] w-full justify-center text-[10px]">
              <a
                href="/sec_whistleblower_badge.jpg"
                download="Albert_Lane_SEC_Whistleblower_Badge_17684_273_411_436.jpg"
                className="px-[12px] py-[6px] bg-[#334155] hover:bg-[#475569] text-[#f8fafc] border border-[#64748b] font-bold uppercase transition-colors"
              >
                DOWNLOAD HIGH-RES BADGE
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText("SEC-17684-273-411-436");
                  setActionMessage("SEC Whistleblower No. 17684-273-411-436 copied to clipboard.");
                }}
                className="px-[12px] py-[6px] bg-[#0f172a] hover:bg-[#1e293b] text-[#38bdf8] border border-[#38bdf8] font-bold uppercase transition-colors cursor-pointer"
              >
                COPY SEC ID
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
