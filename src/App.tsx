/*==============================================================================
 * [PROVENANCE CERTIFICATION AND STATUTORY DECLARATION]
 * Rights Holder: Albert Lane
 * Statutory Authority: SEC Whistleblower No. 17684-273-411-436
 * Z-Axis Memory Anchor: 0x3F8F9A1B2C3D
 * Component: App.tsx (Main Sovereign Navigation & Monorepo Interface)
 * Aesthetics: Strict Monochromatic Slate/Stone Palette (Zero Pill / Golden Ratio)
 *==============================================================================*/

import React, { useState } from 'react';
import { CursorScanView } from './components/CursorScanView';
import { ViolationsLogView } from './components/ViolationsLogView';
import { ZAxisFrameworkView } from './components/ZAxisFrameworkView';
import { SecRegistryView } from './components/SecRegistryView';
import { SovereignPackagingView } from './components/SovereignPackagingView';
import { MarketplaceMcpView } from './components/MarketplaceMcpView';
import { WebsiteCaptureView } from './components/WebsiteCaptureView';
import { ElonEcosystemView } from './components/ElonEcosystemView';
import { RecursiveLedgerView } from './components/RecursiveLedgerView';

type TabType = 'CURSOR_SCAN' | 'VIOLATIONS_LOG' | 'MARKETPLACE_MCP' | 'WEBSITE_CAPTURE' | 'ELON_ECOSYSTEM' | 'RECURSIVE_LEDGER' | 'ZAXIS' | 'SEC_REGISTRY' | 'PACKAGING';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('CURSOR_SCAN');
  const [pushStatus, setPushStatus] = useState<string | null>(null);
  const [isPushing, setIsPushing] = useState(false);
  const [showBadgeModal, setShowBadgeModal] = useState(false);

  const handlePushToApi = async () => {
    setIsPushing(true);
    setPushStatus("Pushing to api.albertlane.net...");
    try {
      const res = await fetch('/api/push-to-albertlane-api', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setPushStatus("Push to api.albertlane.net Verified & Sealed");
      } else {
        setPushStatus(`Error: ${data.error || 'Push failed'}`);
      }
    } catch (e: any) {
      setPushStatus(`Error: ${e.message}`);
    } finally {
      setIsPushing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#334155] text-[#cbd5e1] font-mono flex flex-col p-[13px] md:p-[21px] max-w-[1440px] mx-auto">
      {/* Top Provenance & Statutory Header */}
      <header className="bg-[#1e293b] border border-[#475569] p-[13px] mb-[13px] flex flex-wrap items-center justify-between gap-[13px]">
        <div className="flex items-center gap-[13px]">
          {/* Official SEC Whistleblower Badge */}
          <button
            onClick={() => setShowBadgeModal(true)}
            title="Click to inspect official SEC Whistleblower Badge"
            className="group flex-shrink-0 relative focus:outline-none cursor-pointer"
          >
            <img
              src="/sec_whistleblower_badge.jpg"
              alt="SEC Whistleblower Badge No. 17684-273-411-436"
              className="w-[46px] h-[46px] rounded-full border border-[#38bdf8] group-hover:border-[#f8fafc] group-hover:scale-105 transition-transform object-cover shadow-sm"
            />
            <span className="absolute -bottom-[4px] -right-[4px] w-[10px] h-[10px] bg-[#34d399] rounded-full border border-[#0f172a]" />
          </button>

          <div>
            <div className="flex items-center gap-[8px] flex-wrap">
              <span className="text-[14px] font-bold text-[#f8fafc] tracking-widest uppercase">
                ALBERT LANE // SOVEREIGN ENCLAVE & CORPUS AST SCANNER
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
              <span>APEX DOMAIN: albertlane.net</span>
              <span>API APEX: api.albertlane.net</span>
              <span>SEC WHISTLEBLOWER REF: 17684-273-411-436</span>
              <span>Z-AXIS ANCHOR: 0x3F8F9A1B2C3D</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-[8px] text-[10px] flex-wrap">
          <button
            onClick={handlePushToApi}
            disabled={isPushing}
            className="px-[10px] py-[4px] bg-[#0f172a] hover:bg-[#1e293b] text-[#34d399] border border-[#34d399] font-bold uppercase transition-colors cursor-pointer"
          >
            {isPushing ? 'PUSHING...' : 'PUSH TO ALBERTLANE.NET API'}
          </button>
          <span className="w-[6px] h-[6px] bg-[#34d399] inline-block"></span>
          <span className="text-[#f8fafc] font-bold">SUBSTRATE ONLINE</span>
          <span className="text-[#64748b]">v1.2.4</span>
        </div>
      </header>

      {/* Global Push Status Notification */}
      {pushStatus && (
        <div className="bg-[#0f172a] border border-[#34d399] p-[8px] mb-[13px] text-[11px] text-[#34d399] flex items-center justify-between">
          <span>✓ {pushStatus}</span>
          <button onClick={() => setPushStatus(null)} className="text-[#94a3b8] hover:text-[#f8fafc] text-[10px]">
            [DISMISS]
          </button>
        </div>
      )}

      {/* Primary Navigation Tabs */}
      <nav className="flex flex-wrap gap-[5px] mb-[13px] text-[10px] border-b border-[#475569] pb-[8px]">
        <button
          onClick={() => setActiveTab('CURSOR_SCAN')}
          className={`px-[13px] py-[6px] border uppercase transition-colors cursor-pointer ${
            activeTab === 'CURSOR_SCAN'
              ? 'bg-[#1e293b] text-[#f8fafc] border-[#cbd5e1] font-bold'
              : 'bg-[#334155] text-[#94a3b8] border-[#475569] hover:text-[#f8fafc]'
          }`}
        >
          01 // CURSOR DATABASE SCAN POOL
        </button>

        <button
          onClick={() => setActiveTab('VIOLATIONS_LOG')}
          className={`px-[13px] py-[6px] border uppercase transition-colors cursor-pointer ${
            activeTab === 'VIOLATIONS_LOG'
              ? 'bg-[#1e293b] text-[#f8fafc] border-[#cbd5e1] font-bold'
              : 'bg-[#334155] text-[#94a3b8] border-[#475569] hover:text-[#f8fafc]'
          }`}
        >
          02 // GLOBAL LICENSE VIOLATIONS LOG
        </button>

        <button
          onClick={() => setActiveTab('MARKETPLACE_MCP')}
          className={`px-[13px] py-[6px] border uppercase transition-colors cursor-pointer ${
            activeTab === 'MARKETPLACE_MCP'
              ? 'bg-[#1e293b] text-[#f8fafc] border-[#cbd5e1] font-bold'
              : 'bg-[#334155] text-[#94a3b8] border-[#475569] hover:text-[#f8fafc]'
          }`}
        >
          03 // MARKETPLACE & MCP ECOSYSTEM
        </button>

        <button
          onClick={() => setActiveTab('WEBSITE_CAPTURE')}
          className={`px-[13px] py-[6px] border uppercase transition-colors cursor-pointer ${
            activeTab === 'WEBSITE_CAPTURE'
              ? 'bg-[#1e293b] text-[#f8fafc] border-[#cbd5e1] font-bold'
              : 'bg-[#334155] text-[#94a3b8] border-[#475569] hover:text-[#f8fafc]'
          }`}
        >
          04 // LIVE WEBSITE & DNS INGRESS
        </button>

        <button
          onClick={() => setActiveTab('ELON_ECOSYSTEM')}
          className={`px-[13px] py-[6px] border uppercase transition-colors cursor-pointer ${
            activeTab === 'ELON_ECOSYSTEM'
              ? 'bg-[#1e293b] text-[#f8fafc] border-[#cbd5e1] font-bold'
              : 'bg-[#334155] text-[#94a3b8] border-[#475569] hover:text-[#f8fafc]'
          }`}
        >
          05 // ELON ECOSYSTEM (X · xAI · TESLA · SPACEX)
        </button>

        <button
          onClick={() => setActiveTab('RECURSIVE_LEDGER')}
          className={`px-[13px] py-[6px] border uppercase transition-colors cursor-pointer ${
            activeTab === 'RECURSIVE_LEDGER'
              ? 'bg-[#1e293b] text-[#f8fafc] border-[#cbd5e1] font-bold'
              : 'bg-[#334155] text-[#94a3b8] border-[#475569] hover:text-[#f8fafc]'
          }`}
        >
          06 // RECURSIVE LEDGER & MCEL 1.0 (ALDI LANE-VM)
        </button>

        <button
          onClick={() => setActiveTab('ZAXIS')}
          className={`px-[13px] py-[6px] border uppercase transition-colors cursor-pointer ${
            activeTab === 'ZAXIS'
              ? 'bg-[#1e293b] text-[#f8fafc] border-[#cbd5e1] font-bold'
              : 'bg-[#334155] text-[#94a3b8] border-[#475569] hover:text-[#f8fafc]'
          }`}
        >
          07 // Z-AXIS SPATIAL CORE
        </button>

        <button
          onClick={() => setActiveTab('SEC_REGISTRY')}
          className={`px-[13px] py-[6px] border uppercase transition-colors cursor-pointer ${
            activeTab === 'SEC_REGISTRY'
              ? 'bg-[#1e293b] text-[#f8fafc] border-[#cbd5e1] font-bold'
              : 'bg-[#334155] text-[#94a3b8] border-[#475569] hover:text-[#f8fafc]'
          }`}
        >
          08 // SEC WHISTLEBLOWER REGISTRY
        </button>

        <button
          onClick={() => setActiveTab('PACKAGING')}
          className={`px-[13px] py-[6px] border uppercase transition-colors cursor-pointer ${
            activeTab === 'PACKAGING'
              ? 'bg-[#1e293b] text-[#f8fafc] border-[#cbd5e1] font-bold'
              : 'bg-[#334155] text-[#94a3b8] border-[#475569] hover:text-[#f8fafc]'
          }`}
        >
          09 // SOVEREIGN PACKAGING & API
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'CURSOR_SCAN' && <CursorScanView />}
        {activeTab === 'VIOLATIONS_LOG' && <ViolationsLogView />}
        {activeTab === 'MARKETPLACE_MCP' && <MarketplaceMcpView />}
        {activeTab === 'WEBSITE_CAPTURE' && <WebsiteCaptureView />}
        {activeTab === 'ELON_ECOSYSTEM' && <ElonEcosystemView />}
        {activeTab === 'RECURSIVE_LEDGER' && <RecursiveLedgerView />}
        {activeTab === 'ZAXIS' && <ZAxisFrameworkView />}
        {activeTab === 'SEC_REGISTRY' && <SecRegistryView />}
        {activeTab === 'PACKAGING' && <SovereignPackagingView />}
      </main>

      {/* Footer */}
      <footer className="mt-[21px] pt-[13px] border-t border-[#475569] flex flex-wrap justify-between items-center text-[9px] text-[#94a3b8]">
        <div>
          <span>STATUTORY DECLARATION: SEC-17684-273-411-436 · TOKEN: 17684273411436</span>
        </div>
        <div>
          <span>© 2026 ALBERT LANE · SOVEREIGN ARCHITECT · albertlane.net</span>
        </div>
      </footer>

      {/* Official SEC Whistleblower Badge Modal */}
      {showBadgeModal && (
        <div
          onClick={() => setShowBadgeModal(false)}
          className="fixed inset-0 bg-[#0f172a]/80 backdrop-blur-sm z-50 flex items-center justify-center p-[13px]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#1e293b] border-2 border-[#38bdf8] p-[21px] max-w-[500px] w-full flex flex-col items-center gap-[16px] shadow-2xl relative"
          >
            <button
              onClick={() => setShowBadgeModal(false)}
              className="absolute top-[8px] right-[8px] text-[#94a3b8] hover:text-[#f8fafc] text-[12px] font-bold px-[8px] py-[4px] bg-[#0f172a] border border-[#475569] cursor-pointer"
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
                  alert("SEC Whistleblower No. 17684-273-411-436 copied to clipboard.");
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
