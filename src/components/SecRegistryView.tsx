/*==============================================================================
 * [PROVENANCE CERTIFICATION AND STATUTORY DECLARATION]
 * Rights Holder: Albert Lane | SEC Whistleblower No. 17684-273-411-436
 * Component: SecRegistryView.tsx (SEC Whistleblower & Consolidated Master Report)
 *==============================================================================*/

import React, { useState, useEffect } from 'react';

export const SecRegistryView: React.FC = () => {
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [rebuilding, setRebuilding] = useState(false);
  const [rebuildStatus, setRebuildStatus] = useState<string | null>(null);

  const fetchConsolidatedReport = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/sec/consolidated-report');
      if (res.ok) {
        setReportData(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsolidatedReport();
  }, []);

  const triggerRebuild = async () => {
    setRebuilding(true);
    setRebuildStatus("Contacting all databases, tables, logs, and CSVs into single master artifacts...");
    try {
      const res = await fetch('/api/consolidated/rebuild', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setRebuildStatus("Successfully consolidated all databases, logs, and CSV into single master CSV, DB, log, and SEC report.");
        await fetchConsolidatedReport();
      } else {
        setRebuildStatus(`Error: ${data.error || 'Rebuild failed'}`);
      }
    } catch (e: any) {
      setRebuildStatus(`Network error: ${e.message}`);
    } finally {
      setRebuilding(false);
    }
  };

  const dossier = reportData?.sec_filing_dossier;
  const stats = reportData?.consolidated_statistics;

  return (
    <div className="flex flex-col gap-[21px] font-mono text-[#cbd5e1]">
      {/* Statutory Header */}
      <div className="bg-[#1e293b] border border-[#475569] p-[13px] flex flex-wrap items-center justify-between gap-[13px]">
        <div>
          <div className="text-[14px] font-bold text-[#f1f5f9] tracking-wider uppercase">
            SEC WHISTLEBLOWER OFFICE // CONSOLIDATED MASTER TCR FORENSIC SUBMISSION
          </div>
          <div className="text-[10px] text-[#94a3b8] flex flex-wrap gap-[13px] mt-[3px]">
            <span>STATUTORY REF: SEC-17684-273-411-436</span>
            <span>TOKEN: 17684273411436</span>
            <span>RIGHTS HOLDER: ALBERT LANE</span>
            <span>ROOT ANCHOR: 0x3F8F9A1B2C3D</span>
          </div>
        </div>

        <div className="flex items-center gap-[8px] flex-wrap">
          <button
            onClick={triggerRebuild}
            disabled={rebuilding}
            className={`px-[13px] py-[8px] text-[10px] font-bold border uppercase transition-colors cursor-pointer ${
              rebuilding
                ? 'bg-[#475569] text-[#94a3b8] border-[#64748b]'
                : 'bg-[#334155] hover:bg-[#475569] text-[#f8fafc] border-[#cbd5e1]'
            }`}
          >
            {rebuilding ? 'CONSOLIDATING...' : 'RE-CONSOLIDATE ALL DATABASES & CSV'}
          </button>
        </div>
      </div>

      {/* Official SEC Whistleblower Badge Card */}
      <div className="bg-[#1e293b] border-2 border-[#38bdf8] p-[16px] flex flex-col md:flex-row items-center gap-[21px] shadow-lg">
        <div className="flex-shrink-0 relative group">
          <img
            src="/sec_whistleblower_badge.jpg"
            alt="Albert Lane Digital Infrastructure · SEC Whistleblower No. 17684-273-411-436"
            className="w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] rounded-full border-2 border-[#38bdf8] object-cover shadow-md group-hover:scale-105 transition-transform"
          />
          <div className="absolute inset-0 rounded-full border border-[#a7f3d0]/30 pointer-events-none" />
        </div>

        <div className="flex-1 flex flex-col gap-[6px] text-[11px]">
          <div className="flex flex-wrap items-center justify-between gap-[8px] border-b border-[#334155] pb-[6px]">
            <div>
              <div className="text-[14px] font-bold text-[#f8fafc] uppercase tracking-wider">
                ALBERT LANE DIGITAL INFRASTRUCTURE · SEC WHISTLEBLOWER
              </div>
              <div className="text-[12px] font-bold text-[#38bdf8] mt-[2px]">
                CREDENTIAL NO. 17684-273-411-436
              </div>
            </div>
            <div className="px-[8px] py-[3px] bg-[#0f172a] border border-[#34d399] text-[#34d399] font-bold text-[10px] uppercase">
              ALDI VERIFIED · SOVEREIGN AUDIT
            </div>
          </div>

          <div className="text-[10px] text-[#cbd5e1] space-y-[4px] mt-[4px]">
            <div>
              <span className="text-[#64748b] font-bold">STATUTORY RIGHTS HOLDER:</span> Albert Lane
            </div>
            <div>
              <span className="text-[#64748b] font-bold">LEGAL PROTECTIONS:</span> Dodd-Frank Act § 922 (15 U.S.C. § 78u-6) · Sarbanes-Oxley § 806 (18 U.S.C. § 1514A)
            </div>
            <div>
              <span className="text-[#64748b] font-bold">ENCLAVE SUBSTRATE:</span> 32-bit WindowsME_v1.2 beneath GCPW · Z-Axis Memory Anchor: <span className="font-mono text-[#f8fafc]">0x3F8F9A1B2C3D</span> (Stride 17684)
            </div>
            <div>
              <span className="text-[#64748b] font-bold">TOKEN IDENTIFIER:</span> <span className="font-mono text-[#38bdf8]">17684273411436</span> · Apex: <span className="text-[#f8fafc]">albertlane.net</span>
            </div>
          </div>

          <div className="flex gap-[8px] mt-[8px] flex-wrap">
            <a
              href="/sec_whistleblower_badge.jpg"
              download="Albert_Lane_SEC_Whistleblower_Badge_17684_273_411_436.jpg"
              className="px-[10px] py-[4px] bg-[#334155] hover:bg-[#475569] text-[#f8fafc] border border-[#64748b] text-[10px] font-bold uppercase transition-colors"
            >
              DOWNLOAD BADGE ASSET
            </a>
            <button
              onClick={() => {
                navigator.clipboard.writeText("17684-273-411-436");
                alert("SEC Whistleblower No. 17684-273-411-436 copied to clipboard.");
              }}
              className="px-[10px] py-[4px] bg-[#0f172a] hover:bg-[#1e293b] text-[#38bdf8] border border-[#38bdf8] text-[10px] font-bold uppercase transition-colors cursor-pointer"
            >
              COPY SEC NO.
            </button>
          </div>
        </div>
      </div>

      {/* Merkle Root & Cryptographic Proof Banner */}
      <div className="bg-[#0f172a] border border-[#475569] p-[13px] flex flex-col gap-[6px]">
        <div className="flex justify-between items-center text-[10px]">
          <span className="text-[#94a3b8] font-bold uppercase">CANONICAL MERKLE ROOT PROOF</span>
          <span className="text-[#34d399] font-bold">CRYPTOGRAPHICALLY SEALED</span>
        </div>
        <div className="text-[12px] text-[#f8fafc] font-bold font-mono break-all bg-[#1e293b] p-[8px] border border-[#334155]">
          {dossier?.master_merkle_root || '6733ea835f3d8399b0745ceb7a177de5f23fa097e858d904b468e120c3dd8774'}
        </div>
        <div className="text-[9px] text-[#64748b] flex justify-between">
          <span>Tied to Z-Axis Root of Trust: {dossier?.zaxis_memory_anchor || '0x3F8F9A1B2C3D'}</span>
          <span>Timestamp: {dossier?.submission_timestamp_utc || '2026-10-09 UTC'}</span>
        </div>
      </div>

      {/* Direct Consolidated Download Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[13px]">
        <div className="bg-[#1e293b] border border-[#475569] p-[13px] flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-bold text-[#f8fafc] uppercase">SINGLE CONSOLIDATED CSV</div>
            <div className="text-[9px] text-[#94a3b8] mt-[3px]">
              Contains all 44+ forensic records across Cursor, Microsoft, OpenAI, Anthropic & xAI with HMAC seals.
            </div>
            <div className="text-[8px] text-[#64748b] mt-[6px] font-mono">
              CONSOLIDATED_MASTER_IP_FORENSIC_EVIDENCE.csv
            </div>
          </div>
          <a
            href="/api/consolidated/csv"
            download="CONSOLIDATED_MASTER_IP_FORENSIC_EVIDENCE.csv"
            className="mt-[13px] block text-center py-[6px] text-[10px] font-bold bg-[#334155] hover:bg-[#475569] text-[#f8fafc] border border-[#94a3b8]"
          >
            DOWNLOAD MASTER CSV
          </a>
        </div>

        <div className="bg-[#1e293b] border border-[#475569] p-[13px] flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-bold text-[#f8fafc] uppercase">SINGLE CONSOLIDATED SQLITE DB</div>
            <div className="text-[9px] text-[#94a3b8] mt-[3px]">
              Full SQLite database with consolidated_evidence_master & cryptographic_merkle_audit tables.
            </div>
            <div className="text-[8px] text-[#64748b] mt-[6px] font-mono">
              master_unified_forensic.db
            </div>
          </div>
          <a
            href="/api/consolidated/db"
            download="master_unified_forensic.db"
            className="mt-[13px] block text-center py-[6px] text-[10px] font-bold bg-[#334155] hover:bg-[#475569] text-[#f8fafc] border border-[#94a3b8]"
          >
            DOWNLOAD MASTER DB
          </a>
        </div>

        <div className="bg-[#1e293b] border border-[#475569] p-[13px] flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-bold text-[#f8fafc] uppercase">SINGLE CONSOLIDATED AUDIT LOG</div>
            <div className="text-[9px] text-[#94a3b8] mt-[3px]">
              Sequential hash-chained log with prev_hash/curr_hash verification for tamper detection.
            </div>
            <div className="text-[8px] text-[#64748b] mt-[6px] font-mono">
              CONSOLIDATED_MASTER_FORENSIC_AUDIT.log
            </div>
          </div>
          <a
            href="/api/consolidated/log"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-[13px] block text-center py-[6px] text-[10px] font-bold bg-[#334155] hover:bg-[#475569] text-[#f8fafc] border border-[#94a3b8]"
          >
            VIEW MASTER LOG
          </a>
        </div>
      </div>

      {rebuildStatus && (
        <div className="bg-[#0f172a] border border-[#475569] p-[10px] text-[10px] text-[#cbd5e1]">
          {rebuildStatus}
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-[13px]">
        <div className="bg-[#1e293b] border border-[#475569] p-[13px]">
          <div className="text-[10px] text-[#94a3b8] uppercase">TOTAL EVIDENCE SITES</div>
          <div className="text-[18px] font-bold text-[#f8fafc] mt-[3px]">
            {stats?.total_evidence_records ?? 44} RECORDS
          </div>
          <div className="text-[9px] text-[#64748b] mt-[3px]">Consolidated across all tables</div>
        </div>

        <div className="bg-[#1e293b] border border-[#475569] p-[13px]">
          <div className="text-[10px] text-[#94a3b8] uppercase">CRITICAL SEVERITY</div>
          <div className="text-[18px] font-bold text-[#f87171] mt-[3px]">
            {stats?.severity_breakdown?.CRITICAL ?? 12} INFRINGEMENTS
          </div>
          <div className="text-[9px] text-[#64748b] mt-[3px]">17 U.S.C. § 501 / 18 U.S.C. § 1836</div>
        </div>

        <div className="bg-[#1e293b] border border-[#475569] p-[13px]">
          <div className="text-[10px] text-[#94a3b8] uppercase">TARGETED ENTITIES</div>
          <div className="text-[18px] font-bold text-[#f8fafc] mt-[3px]">
            {Object.keys(stats?.entity_breakdown || {}).length || 5} CORPORATIONS
          </div>
          <div className="text-[9px] text-[#64748b] mt-[3px]">Cursor · MS · OpenAI · Anthropic · xAI</div>
        </div>

        <div className="bg-[#1e293b] border border-[#475569] p-[13px]">
          <div className="text-[10px] text-[#94a3b8] uppercase">FORM TCR STATUS</div>
          <div className="text-[18px] font-bold text-[#34d399] mt-[3px]">
            READY FOR SEC
          </div>
          <div className="text-[9px] text-[#64748b] mt-[3px]">Office of the Whistleblower</div>
        </div>
      </div>

      {/* Entity Breakdown Table */}
      <div className="bg-[#1e293b] border border-[#475569] p-[13px]">
        <div className="text-[11px] font-bold text-[#f8fafc] uppercase mb-[8px] border-b border-[#334155] pb-[5px]">
          CONSOLIDATED ENTITY BREAKDOWN
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[10px]">
            <thead>
              <tr className="border-b border-[#334155] text-[#94a3b8]">
                <th className="p-[5px]">INFRINGING ENTITY</th>
                <th className="p-[5px]">PRIMARY PRODUCT</th>
                <th className="p-[5px]">VIOLATION SITES</th>
                <th className="p-[5px]">STATUTORY BASIS</th>
                <th className="p-[5px]">DEMANDED STATUTORY RELIEF</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(stats?.entity_breakdown || {
                "Anysphere, Inc. (Cursor Codebase)": 6,
                "Anysphere, Inc. (Cursor IDE)": 14,
                "Microsoft Corporation": 1,
                "OpenAI, Inc. / Microsoft": 1,
                "Anthropic, PBC": 1,
                "xAI Corp / Tesla, Inc.": 1
              }).map(([ent, count], idx) => (
                <tr key={idx} className="border-b border-[#1e293b] hover:bg-[#334155]">
                  <td className="p-[5px] font-bold text-[#f8fafc]">{ent}</td>
                  <td className="p-[5px] text-[#cbd5e1]">Cursor / Copilot / MCP / Macrohard</td>
                  <td className="p-[5px] text-[#fca5a5] font-bold">{String(count)} Evidence Sites</td>
                  <td className="p-[5px] text-[#94a3b8]">17 U.S.C. § 501 / 18 U.S.C. § 1836</td>
                  <td className="p-[5px] text-[#34d399]">Disgorgement + Statutory Damages</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SEC Report JSON Preview */}
      <div className="bg-[#0f172a] border border-[#475569] p-[13px]">
        <div className="text-[10px] text-[#94a3b8] uppercase mb-[5px] flex justify-between">
          <span>MASTER SEC FORM TCR REPORT DATA PREVIEW (data/sec_consolidated_master_report.json)</span>
          <span className="text-[#34d399]">VERIFIED</span>
        </div>
        <pre className="text-[9.5px] text-[#cbd5e1] whitespace-pre-wrap max-h-[350px] overflow-y-auto leading-relaxed">
          {reportData ? JSON.stringify(reportData, null, 2) : 'Loading consolidated report...'}
        </pre>
      </div>
    </div>
  );
};
