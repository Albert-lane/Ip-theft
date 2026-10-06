/*======================================================================
[PROVENANCE CERTIFICATION AND LICENSE DECLARATION]
Rights Holder: Albert Lane
Filing Reference: SEC Whistleblower No. 17684-273-411-436
Registration Token: SEC-17684-273-411-436 (Decimal: 17684273411436)
License: Albert Lane Proprietary License v1.2
Component: App.tsx (Principal Edge Architect & Visual-Mathematical Platform)
Aesthetics: Monochromatic Medium-Light Slate/Stone | Golden Ratio (Phi) & Fibonacci
======================================================================*/

import React, { useState } from 'react';
import { EdgeFractalInstrument } from './components/EdgeFractalInstrument';
import { DeploymentPipelineDashboard } from './components/DeploymentPipelineDashboard';
import { CloudflareZoneManager } from './components/CloudflareZoneManager';
import { MonorepoOrchestration } from './components/MonorepoOrchestration';
import { AgenticWorkflowsView } from './components/AgenticWorkflowsView';
import { SecurityAuditRbac } from './components/SecurityAuditRbac';
import { AskAboutYourData } from './components/AskAboutYourData';
import { VibeTerminalEnclave } from './components/VibeTerminalEnclave';
import { TopTerminalEnclaveGui } from './components/TopTerminalEnclaveGui';


type ActiveViewTab =
  | 'COCKPIT'
  | 'ASK_ABOUT_DATA'
  | 'FRACTAL_TOPOLOGY'
  | 'DEPLOYMENT_PIPELINE'
  | 'CLOUDFLARE_ZONE'
  | 'MONOREPO_ORCHESTRATION'
  | 'AGENTIC_WORKFLOWS'
  | 'SECURITY_RBAC';

type TerminalHeightMode = 'COLLAPSED' | 'COMPACT' | 'EXPANDED';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveViewTab>('COCKPIT');
  const [terminalMode, setTerminalMode] = useState<TerminalHeightMode>('COMPACT');
  const [selectedColoId, setSelectedColoId] = useState<string>('colo-sfo');

  return (
    <div className="min-h-screen bg-[#3b4758] text-[#e2e8f0] flex flex-col font-sans selection:bg-[#64748b] selection:text-[#f1f5f9]">
      {/* 1. TOP PROVENANCE & ARCHITECTURAL STATUTORY HEADER (Fibonacci spacing) */}
      <header className="bg-[#333e4e] border-b border-[#5b6c82] px-[13px] py-[8px] flex flex-wrap items-center justify-between gap-[8px] shrink-0">
        <div className="flex items-center gap-[8px]">
          <div className="w-[8px] h-[8px] bg-[#cbd5e1] border border-[#74859d]"></div>
          <div>
            <h1 className="text-[12px] font-mono font-bold text-[#f1f5f9] tracking-wider uppercase">
              ALBERT LANE // PRINCIPAL EDGE ARCHITECT & VISUAL-MATHEMATICAL PLATFORM
            </h1>
            <div className="text-[9px] font-mono text-[#94a3b8] flex items-center gap-[8px]">
              <span>SEC WHISTLEBLOWER NO. 17684-273-411-436</span>
              <span>TOKEN: 17684273411436</span>
              <span>ROOT OF TRUST: 0x3F8F9A1B2C3D</span>
            </div>
          </div>
        </div>

        {/* Mathematical Invariants Telemetry Badges */}
        <div className="flex items-center gap-[5px] text-[9px] font-mono flex-wrap">
          <span className="bg-[#3e4c5e] border border-[#64748b] px-[5px] py-[2px] text-[#cbd5e1]">
            PHI = 1.618034
          </span>
          <span className="bg-[#3e4c5e] border border-[#64748b] px-[5px] py-[2px] text-[#cbd5e1]">
            STRIDE: 17,684 BYTES
          </span>
          <span className="bg-[#3e4c5e] border border-[#64748b] px-[5px] py-[2px] text-[#cbd5e1]">
            P0 = 57,000
          </span>
          <span className="bg-[#3e4c5e] border border-[#64748b] px-[5px] py-[2px] text-[#cbd5e1]">
            CRC-32: 0xEDB88320
          </span>
          <span className="bg-[#475569] border border-[#74859d] px-[5px] py-[2px] text-[#f1f5f9] font-bold">
            TLS 1.3 STRICT // 310 COLOS
          </span>
        </div>
      </header>

      {/* 2. MATHEMATICAL NAVIGATION BAR (Golden Ratio hierarchy, Monochromatic Mid-Tone) */}
      <nav className="bg-[#3a4655] border-b border-[#5b6c82] px-[13px] py-[5px] flex items-center justify-between flex-wrap gap-[5px] shrink-0">
        <div className="flex items-center gap-[3px] overflow-x-auto text-[9px] font-mono">
          <button
            onClick={() => setActiveTab('COCKPIT')}
            className={`px-[8px] py-[3px] border transition-colors ${
              activeTab === 'COCKPIT'
                ? 'bg-[#5b6b80] text-[#f1f5f9] border-[#cbd5e1] font-bold'
                : 'bg-[#475569] text-[#cbd5e1] border-[#64748b] hover:bg-[#526277]'
            }`}
          >
            00 // UNIFIED COCKPIT
          </button>
          <button
            onClick={() => setActiveTab('ASK_ABOUT_DATA')}
            className={`px-[8px] py-[3px] border transition-colors ${
              activeTab === 'ASK_ABOUT_DATA'
                ? 'bg-[#5b6b80] text-[#f1f5f9] border-[#cbd5e1] font-bold'
                : 'bg-[#475569] text-[#cbd5e1] border-[#64748b] hover:bg-[#526277]'
            }`}
          >
            01 // ASK ABOUT YOUR DATA
          </button>
          <button
            onClick={() => setActiveTab('FRACTAL_TOPOLOGY')}
            className={`px-[8px] py-[3px] border transition-colors ${
              activeTab === 'FRACTAL_TOPOLOGY'
                ? 'bg-[#5b6b80] text-[#f1f5f9] border-[#cbd5e1] font-bold'
                : 'bg-[#475569] text-[#cbd5e1] border-[#64748b] hover:bg-[#526277]'
            }`}
          >
            01 // FRACTAL TOPOLOGY
          </button>
          <button
            onClick={() => setActiveTab('DEPLOYMENT_PIPELINE')}
            className={`px-[8px] py-[3px] border transition-colors ${
              activeTab === 'DEPLOYMENT_PIPELINE'
                ? 'bg-[#5b6b80] text-[#f1f5f9] border-[#cbd5e1] font-bold'
                : 'bg-[#475569] text-[#cbd5e1] border-[#64748b] hover:bg-[#526277]'
            }`}
          >
            02 // CI/CD PIPELINE
          </button>
          <button
            onClick={() => setActiveTab('CLOUDFLARE_ZONE')}
            className={`px-[8px] py-[3px] border transition-colors ${
              activeTab === 'CLOUDFLARE_ZONE'
                ? 'bg-[#5b6b80] text-[#f1f5f9] border-[#cbd5e1] font-bold'
                : 'bg-[#475569] text-[#cbd5e1] border-[#64748b] hover:bg-[#526277]'
            }`}
          >
            03 // CLOUDFLARE ZONE & SSL
          </button>
          <button
            onClick={() => setActiveTab('MONOREPO_ORCHESTRATION')}
            className={`px-[8px] py-[3px] border transition-colors ${
              activeTab === 'MONOREPO_ORCHESTRATION'
                ? 'bg-[#5b6b80] text-[#f1f5f9] border-[#cbd5e1] font-bold'
                : 'bg-[#475569] text-[#cbd5e1] border-[#64748b] hover:bg-[#526277]'
            }`}
          >
            04 // APEX MONOREPO
          </button>
          <button
            onClick={() => setActiveTab('AGENTIC_WORKFLOWS')}
            className={`px-[8px] py-[3px] border transition-colors ${
              activeTab === 'AGENTIC_WORKFLOWS'
                ? 'bg-[#5b6b80] text-[#f1f5f9] border-[#cbd5e1] font-bold'
                : 'bg-[#475569] text-[#cbd5e1] border-[#64748b] hover:bg-[#526277]'
            }`}
          >
            05 // AGENTIC WORKFLOWS
          </button>
          <button
            onClick={() => setActiveTab('SECURITY_RBAC')}
            className={`px-[8px] py-[3px] border transition-colors ${
              activeTab === 'SECURITY_RBAC'
                ? 'bg-[#5b6b80] text-[#f1f5f9] border-[#cbd5e1] font-bold'
                : 'bg-[#475569] text-[#cbd5e1] border-[#64748b] hover:bg-[#526277]'
            }`}
          >
            06 // SECURITY & RBAC
          </button>
        </div>

        {/* Status Invariant Flag */}
        <div className="text-[9px] font-mono text-[#94a3b8]">
          SUBSTRATE: GCPW 32-bit WindowsME_v1.2 // ZERO-INFERENCE PURGED
        </div>
      </nav>

      {/* 2.5 TOP TERMINAL WINDOW GUI // PACKAGE MANAGER FILE SYSTEM & WORKFLOW ORCHESTRATOR */}
      <TopTerminalEnclaveGui />

      {/* 3. MAIN DASHBOARD VIEWPORT (Scrollable, Golden-Ratio spatial padding) */}
      <main className="flex-1 p-[8px] sm:p-[13px] space-y-[13px] overflow-y-auto">
        {/* VIEW: 00 // UNIFIED COCKPIT */}
        {activeTab === 'COCKPIT' && (
          <div className="space-y-[13px]">
            {/* Ask About Your Data Natural Language Query Box */}
            <AskAboutYourData />

            {/* Top Instrument: Generative Fractal Canvas */}
            <EdgeFractalInstrument
              selectedNodeId={selectedColoId}
              onSelectNode={(node) => setSelectedColoId(node.id)}
            />

            {/* Middle Split Grid: CI/CD Pipeline + Cloudflare DNS/SSL */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[13px]">
              <DeploymentPipelineDashboard />
              <CloudflareZoneManager />
            </div>

            {/* Bottom Split Grid: Monorepo Orchestration + Agentic Workflows */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[13px]">
              <MonorepoOrchestration />
              <AgenticWorkflowsView />
            </div>
          </div>
        )}

        {/* VIEW: 01 // ASK ABOUT YOUR DATA (FULL VIEW) */}
        {activeTab === 'ASK_ABOUT_DATA' && (
          <div className="space-y-[13px]">
            <AskAboutYourData />
          </div>
        )}

        {/* VIEW: 01 // FRACTAL TOPOLOGY */}
        {activeTab === 'FRACTAL_TOPOLOGY' && (
          <div className="space-y-[13px]">
            <EdgeFractalInstrument
              selectedNodeId={selectedColoId}
              onSelectNode={(node) => setSelectedColoId(node.id)}
            />
            <div className="bg-[#475569] border border-[#64748b] p-[13px] font-mono text-[10px] text-[#cbd5e1]">
              <div className="text-[#f1f5f9] font-bold mb-[5px]">MATHEMATICAL SPECIFICATION // DELAUNAY-VORONOI DYNAMICS</div>
              <p className="text-[#94a3b8] leading-relaxed mb-[8px]">
                The visual instrument above renders non-Euclidean recursive branch topologies mapped directly to real-time Cloudflare edge colos.
                Each packet pulse reflects instantaneous transmission across inter-colo mesh paths, with golden sections (1.618034) governing spatial harmonics.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-[8px] text-[9px] border-t border-[#64748b] pt-[8px]">
                <div>GLOBAL COLO AVAILABILITY: 100%</div>
                <div>DNS PROPAGATION COEFF: 99.88%</div>
                <div>PACKET SEED CRC: 0xEDB88320</div>
                <div>SEC WHISTLEBLOWER REF: 17684</div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: 02 // CI/CD PIPELINE */}
        {activeTab === 'DEPLOYMENT_PIPELINE' && <DeploymentPipelineDashboard />}

        {/* VIEW: 03 // CLOUDFLARE ZONE & SSL */}
        {activeTab === 'CLOUDFLARE_ZONE' && <CloudflareZoneManager />}

        {/* VIEW: 04 // APEX MONOREPO */}
        {activeTab === 'MONOREPO_ORCHESTRATION' && <MonorepoOrchestration />}

        {/* VIEW: 05 // AGENTIC WORKFLOWS */}
        {activeTab === 'AGENTIC_WORKFLOWS' && <AgenticWorkflowsView />}

        {/* VIEW: 06 // SECURITY & RBAC */}
        {activeTab === 'SECURITY_RBAC' && <SecurityAuditRbac />}
      </main>

      {/* 4. DOCKED VIBE TERMINAL ENCLAVE (Docked at the bottom of the page) */}
      <section className="border-t border-[#5b6c82] bg-[#333e4e] shrink-0">
        {/* Terminal Dock Header & Height Controls */}
        <div className="px-[13px] py-[5px] bg-[#2d3745] border-b border-[#526277] flex items-center justify-between flex-wrap gap-[8px]">
          <div className="flex items-center gap-[8px]">
            <span className="font-mono text-[10px] text-[#f1f5f9] font-bold tracking-wider uppercase">
              TERMINAL ENCLAVE // LANE-VM PYTHON C++ ENGINE [SEC-17684-273-411-436]
            </span>
            <span className="font-mono text-[8px] bg-[#3e4c5e] text-[#cbd5e1] border border-[#64748b] px-[4px] py-[1px]">
              NON-DECRYPTING AES-256-GCM
            </span>
            <span className="font-mono text-[8px] bg-[#3e4c5e] text-[#cbd5e1] border border-[#64748b] px-[4px] py-[1px]">
              APEX LOCKFILE: sec17684273411436.lock
            </span>
          </div>

          {/* Terminal Viewport Height Toggle Controls */}
          <div className="flex items-center gap-[5px] font-mono text-[9px]">
            <span className="text-[#94a3b8] pr-[4px]">DOCK MODE:</span>
            <button
              onClick={() => setTerminalMode('COLLAPSED')}
              className={`px-[6px] py-[2px] border ${
                terminalMode === 'COLLAPSED'
                  ? 'bg-[#5b6b80] text-[#f1f5f9] border-[#cbd5e1]'
                  : 'bg-[#3e4c5e] text-[#cbd5e1] border-[#64748b] hover:bg-[#4a586d]'
              }`}
            >
              MINIMIZED
            </button>
            <button
              onClick={() => setTerminalMode('COMPACT')}
              className={`px-[6px] py-[2px] border ${
                terminalMode === 'COMPACT'
                  ? 'bg-[#5b6b80] text-[#f1f5f9] border-[#cbd5e1]'
                  : 'bg-[#3e4c5e] text-[#cbd5e1] border-[#64748b] hover:bg-[#4a586d]'
              }`}
            >
              COMPACT (340px)
            </button>
            <button
              onClick={() => setTerminalMode('EXPANDED')}
              className={`px-[6px] py-[2px] border ${
                terminalMode === 'EXPANDED'
                  ? 'bg-[#5b6b80] text-[#f1f5f9] border-[#cbd5e1]'
                  : 'bg-[#3e4c5e] text-[#cbd5e1] border-[#64748b] hover:bg-[#4a586d]'
              }`}
            >
              EXPANDED (550px)
            </button>
          </div>
        </div>

        {/* Terminal Content Body */}
        {terminalMode !== 'COLLAPSED' && (
          <div className="p-[8px] sm:p-[13px] bg-[#384353]">
            <VibeTerminalEnclave
              isDocked={true}
              containerHeight={
                terminalMode === 'COMPACT'
                  ? 'h-[340px]'
                  : 'h-[550px]'
              }
            />
          </div>
        )}
      </section>

      {/* 5. STATUTORY FOOTER */}
      <footer className="bg-[#2a3341] border-t border-[#4f5f73] px-[13px] py-[6px] text-[9px] font-mono text-[#94a3b8] flex flex-wrap items-center justify-between gap-[5px] shrink-0">
        <div>
          <span>STATUTORY GOVERNANCE: Dodd-Frank 15 U.S.C. § 78u-6 & 17 U.S.C. § 501. Rights Holder: Albert Lane.</span>
        </div>
        <div className="flex items-center gap-[8px]">
          <span>SOVEREIGN PACKAGE MANAGERS: bun · npm · cargo · pip · termux · lane-pm</span>
          <span className="text-[#cbd5e1] font-bold">ALL OS // ALL BROWSERS // ALL CORE PROCESSORS</span>
        </div>
      </footer>
    </div>
  );
}
