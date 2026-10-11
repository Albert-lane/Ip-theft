/*==============================================================================
 * [PROVENANCE CERTIFICATION AND STATUTORY DECLARATION]
 * Rights Holder: Albert Lane | SEC Whistleblower No. 17684-273-411-436
 * Component: MarketplaceMcpView.tsx (Marketplace & MCP Ecosystem Explorer)
 *==============================================================================*/

import React, { useState, useEffect } from 'react';

interface MarketplaceItem {
  id: number;
  ecosystem: string;
  tool_or_extension_name: string;
  provider_entity: string;
  mcp_server_id: string;
  category: string;
  tool_description: string;
  schema_parameters_json: string;
  ast_keys_json: string;
  provenance_violation_status: string;
  misappropriated_asset: string;
  statutory_basis: string;
  severity: string;
  evidence_details: string;
  code_snippet: string;
  remedy_demanded: string;
  sha256_seal: string;
  ingested_at: string;
}

export const MarketplaceMcpView: React.FC = () => {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [selectedEcosystem, setSelectedEcosystem] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  const fetchCatalog = async () => {
    try {
      const ecoParam = selectedEcosystem !== 'ALL' ? `?ecosystem=${selectedEcosystem}` : '';
      const res = await fetch(`/api/marketplace/mcp-catalog${ecoParam}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data);
        if (data.length > 0 && !selectedItem) {
          setSelectedItem(data[0]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, [selectedEcosystem]);

  const triggerScan = async () => {
    setScanning(true);
    setScanMessage("Scanning Grok, Meta, Claude, Claude Code & GitHub MCP marketplaces...");
    try {
      const res = await fetch('/api/marketplace/scan', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setScanMessage(data.stdout || "Marketplace scan complete.");
        await fetchCatalog();
      } else {
        setScanMessage(`Scan error: ${data.error || 'Failed'}`);
      }
    } catch (e: any) {
      setScanMessage(`Network error: ${e.message}`);
    } finally {
      setScanning(false);
    }
  };

  const filtered = items.filter(it => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      it.tool_or_extension_name.toLowerCase().includes(q) ||
      it.ecosystem.toLowerCase().includes(q) ||
      it.provider_entity.toLowerCase().includes(q) ||
      it.misappropriated_asset.toLowerCase().includes(q) ||
      it.statutory_basis.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col gap-[21px] font-mono text-[#cbd5e1]">
      {/* Top Header */}
      <div className="bg-[#1e293b] border border-[#475569] p-[13px] flex flex-wrap items-center justify-between gap-[13px]">
        <div>
          <div className="text-[14px] font-bold text-[#f1f5f9] tracking-wider uppercase">
            MARKETPLACE & MCP ECOSYSTEM // GROK · META · CLAUDE · GITHUB
          </div>
          <div className="text-[10px] text-[#94a3b8] flex flex-wrap gap-[13px] mt-[3px]">
            <span>STATUTORY REF: SEC-17684-273-411-436</span>
            <span>CATALOG SIZE: {items.length} MCP TOOLS</span>
            <span>CANONICAL ENFORCEMENT: 17 U.S.C. § 501</span>
          </div>
        </div>

        <button
          onClick={triggerScan}
          disabled={scanning}
          className={`px-[13px] py-[8px] text-[10px] font-bold border uppercase transition-colors cursor-pointer ${
            scanning
              ? 'bg-[#475569] text-[#94a3b8] border-[#64748b]'
              : 'bg-[#334155] hover:bg-[#475569] text-[#f8fafc] border-[#cbd5e1]'
          }`}
        >
          {scanning ? 'SCANNING ECOSYSTEMS...' : 'RE-AUDIT ALL MARKETPLACES & MCP'}
        </button>
      </div>

      {/* Ecosystem Filter & Search Bar */}
      <div className="bg-[#1e293b] border border-[#475569] p-[10px] flex flex-wrap items-center justify-between gap-[10px]">
        <div className="flex items-center gap-[5px] flex-wrap text-[10px]">
          {['ALL', 'Grok', 'Meta', 'Claude', 'GitHub'].map((eco) => (
            <button
              key={eco}
              onClick={() => setSelectedEcosystem(eco)}
              className={`px-[10px] py-[5px] border uppercase transition-colors cursor-pointer ${
                selectedEcosystem === eco
                  ? 'bg-[#475569] text-[#f8fafc] border-[#cbd5e1] font-bold'
                  : 'bg-[#334155] text-[#94a3b8] border-[#475569] hover:text-[#f8fafc]'
              }`}
            >
              {eco}
            </button>
          ))}
        </div>

        <div className="flex-1 min-w-[220px]">
          <input
            type="text"
            placeholder="Search by tool name, MCP server, asset, or statute..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0f172a] border border-[#334155] px-[8px] py-[5px] text-[10px] text-[#f8fafc] font-mono focus:outline-none focus:border-[#94a3b8]"
          />
        </div>
      </div>

      {scanMessage && (
        <div className="bg-[#0f172a] border border-[#475569] p-[10px] text-[10px] text-[#cbd5e1]">
          {scanMessage}
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[13px]">
        {/* Left Column: Tool List (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-[8px] max-h-[640px] overflow-y-auto pr-[5px]">
          {filtered.length === 0 ? (
            <div className="p-[21px] bg-[#1e293b] text-center text-[10px] text-[#94a3b8]">
              NO MARKETPLACE OR MCP TOOLS FOUND.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`p-[10px] border transition-colors cursor-pointer ${
                  selectedItem?.id === item.id
                    ? 'bg-[#334155] border-[#cbd5e1] text-[#f8fafc]'
                    : 'bg-[#1e293b] border-[#475569] text-[#cbd5e1] hover:border-[#94a3b8]'
                }`}
              >
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-bold text-[#f8fafc]">{item.tool_or_extension_name}</span>
                  <span className={`text-[8px] px-[5px] py-[1px] border font-bold ${
                    item.severity === 'CRITICAL'
                      ? 'border-[#f87171] text-[#fca5a5] bg-[#450a0a]'
                      : 'border-[#fbbf24] text-[#fde68a] bg-[#451a03]'
                  }`}>
                    {item.severity}
                  </span>
                </div>

                <div className="text-[9px] text-[#94a3b8] mt-[3px] flex justify-between">
                  <span>{item.ecosystem}</span>
                  <span>{item.provider_entity}</span>
                </div>

                <div className="text-[9px] text-[#e2e8f0] mt-[3px] truncate">
                  <strong>Asset:</strong> {item.misappropriated_asset}
                </div>

                <div className="text-[8px] text-[#64748b] mt-[3px]">
                  Server: <code className="text-[#94a3b8]">{item.mcp_server_id}</code>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Column: Detail & Decompiled Schema (7 cols) */}
        <div className="lg:col-span-7 bg-[#1e293b] border border-[#475569] p-[13px] flex flex-col gap-[10px]">
          {selectedItem ? (
            <>
              <div className="flex justify-between items-start border-b border-[#334155] pb-[8px]">
                <div>
                  <div className="text-[13px] font-bold text-[#f8fafc]">
                    {selectedItem.tool_or_extension_name}
                  </div>
                  <div className="text-[10px] text-[#94a3b8] mt-[2px]">
                    Ecosystem: <span className="text-[#cbd5e1]">{selectedItem.ecosystem}</span> · Provider: <span className="text-[#cbd5e1]">{selectedItem.provider_entity}</span>
                  </div>
                  <div className="text-[10px] text-[#94a3b8]">
                    MCP Server ID: <span className="text-[#34d399] font-mono">{selectedItem.mcp_server_id}</span>
                  </div>
                </div>
                <span className={`text-[9px] px-[6px] py-[2px] border font-bold ${
                  selectedItem.severity === 'CRITICAL'
                    ? 'border-[#f87171] text-[#fca5a5] bg-[#450a0a]'
                    : 'border-[#fbbf24] text-[#fde68a] bg-[#451a03]'
                }`}>
                  {selectedItem.severity}
                </span>
              </div>

              <div>
                <div className="text-[9px] text-[#94a3b8] uppercase font-bold">TOOL DESCRIPTION:</div>
                <div className="text-[10px] text-[#cbd5e1] mt-[2px]">{selectedItem.tool_description}</div>
              </div>

              <div>
                <div className="text-[9px] text-[#94a3b8] uppercase font-bold">MISAPPROPRIATED ALBERT LANE ASSET:</div>
                <div className="text-[11px] text-[#f8fafc] mt-[2px] font-bold">{selectedItem.misappropriated_asset}</div>
              </div>

              <div>
                <div className="text-[9px] text-[#94a3b8] uppercase font-bold">STATUTORY BASIS:</div>
                <div className="text-[10px] text-[#cbd5e1] mt-[2px]">{selectedItem.statutory_basis}</div>
              </div>

              <div>
                <div className="text-[9px] text-[#94a3b8] uppercase font-bold mb-[3px]">DECOMPILED MCP / EXTENSION SNIPPET:</div>
                <pre className="bg-[#0f172a] border border-[#334155] p-[10px] text-[9.5px] text-[#e2e8f0] overflow-x-auto leading-relaxed">
                  {selectedItem.code_snippet}
                </pre>
              </div>

              <div>
                <div className="text-[9px] text-[#94a3b8] uppercase font-bold">FORENSIC ANALYSIS:</div>
                <div className="text-[10px] text-[#cbd5e1] mt-[2px] leading-relaxed">
                  {selectedItem.evidence_details}
                </div>
              </div>

              <div className="border-t border-[#334155] pt-[8px]">
                <div className="text-[9px] text-[#fca5a5] uppercase font-bold">DEMANDED STATUTORY REMEDY:</div>
                <div className="text-[10px] text-[#cbd5e1] mt-[2px]">
                  {selectedItem.remedy_demanded}
                </div>
              </div>

              <div className="text-[8px] text-[#64748b] font-mono break-all mt-[5px]">
                SHA-256 SEAL: {selectedItem.sha256_seal}
              </div>
            </>
          ) : (
            <div className="text-[11px] text-[#94a3b8] p-[21px] text-center">
              SELECT AN MCP OR MARKETPLACE TOOL TO INSPECT DECOMPILED EVIDENCE.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
