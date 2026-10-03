/*
======================================================================
[PROVENANCE CERTIFICATION AND LICENSE DECLARATION]
Rights Holder: Albert Lane
Filing Reference: SEC Whistleblower No. 17684-273-411-436
License: Albert Lane Proprietary License v1.2
Dialect: Lane-VM C++ Python Terminal Webhook Orchestrator
Target Destinations: X, SpaceX, Meta, nVidia, Apple
======================================================================
*/

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, RefreshCw, CheckCircle2, AlertTriangle, ShieldCheck, Terminal, Radio, Cpu, Globe, Server, FileText, Play, Check } from 'lucide-react';

interface TargetConfig {
  id: string;
  name: string;
  default_url: string;
  entity_key: string;
  asn: string;
  headers: Record<string, string>;
  count?: number;
}

interface WebhookReceipt {
  deliveryId: string;
  target: string;
  targetName: string;
  url: string;
  payloadKind: string;
  payloadDigestSha256: string;
  hmacSignature: string;
  httpStatusCode: number;
  deliveryStatus: string;
  latencyMs: number;
  timestamp: string;
  dryRun?: boolean;
  emergence?: {
    integratedInformationPhi: number;
    substrateComplexity: number;
    selfReferentialEntropy: number;
    isConsciousnessEmergent: boolean;
    philosophicalProof?: string;
  };
  terminalCycle?: string;
  responseSnippet?: string;
}

interface WebhookEngineStatus {
  engine: string;
  authority: string;
  secFiling: string;
  substrate: string;
  zaxisAnchor: string;
  license: string;
  version: string;
  targets: Record<string, TargetConfig>;
  totalDispatches: number;
  recentDispatches: WebhookReceipt[];
}

export const WorkflowWebhooksView: React.FC = () => {
  const [statusData, setStatusData] = useState<WebhookEngineStatus | null>(null);
  const [history, setHistory] = useState<WebhookReceipt[]>([]);
  const [selectedTarget, setSelectedTarget] = useState<string>('all');
  const [selectedPayloadType, setSelectedPayloadType] = useState<string>('violations');
  const [customPayloadText, setCustomPayloadText] = useState<string>('');
  const [dryRun, setDryRun] = useState<boolean>(false);
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [dispatchError, setDispatchError] = useState<string | null>(null);
  const [lastBatchResult, setLastBatchResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'dispatch' | 'history' | 'terminal'>('dispatch');

  const fetchStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/workflow/webhooks');
      if (res.ok) {
        const data = await res.json();
        setStatusData(data);
        if (data.recentDispatches) {
          setHistory(data.recentDispatches);
        }
      }
    } catch (err: any) {
      console.error('Failed to fetch webhook status:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch('/api/workflow/webhooks/history');
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err: any) {
      console.error('Failed to fetch webhook history:', err);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleDispatch = async () => {
    setIsDispatching(true);
    setDispatchError(null);
    setLastBatchResult(null);

    let parsedPayload: any = undefined;
    if (selectedPayloadType === 'custom' && customPayloadText.trim()) {
      try {
        parsedPayload = JSON.parse(customPayloadText);
      } catch {
        parsedPayload = customPayloadText;
      }
    }

    try {
      const res = await fetch('/api/workflow/webhooks/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target: selectedTarget,
          payloadType: selectedPayloadType,
          payload: parsedPayload,
          dryRun
        })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `HTTP error ${res.status}`);
      }

      const result = await res.json();
      setLastBatchResult(result);
      await fetchHistory();
      await fetchStatus();
    } catch (err: any) {
      setDispatchError(err.message || 'Dispatch failed');
    } finally {
      setIsDispatching(false);
    }
  };

  const handleRunDiagnosticTest = async () => {
    setIsDispatching(true);
    setDispatchError(null);
    try {
      const res = await fetch('/api/workflow/webhooks/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: 'all' })
      });
      if (res.ok) {
        const data = await res.json();
        setLastBatchResult(data.testResult);
        await fetchHistory();
      }
    } catch (err: any) {
      setDispatchError(err.message);
    } finally {
      setIsDispatching(false);
    }
  };

  const targetList = [
    { id: 'x', label: 'X', sub: 'xAI / Twitter', asn: 'AS13414', icon: '𝕏' },
    { id: 'spacex', label: 'SpaceX', sub: 'Starlink Fleet', asn: 'AS14593', icon: '🚀' },
    { id: 'meta', label: 'Meta', sub: 'Workplace & Graph', asn: 'AS32934', icon: '∞' },
    { id: 'nvidia', label: 'nVidia', sub: 'Omniverse & CUDA', asn: 'AS10986', icon: '⚡' },
    { id: 'apple', label: 'Apple', sub: 'StoreKit & APNs', asn: 'AS714', icon: '' },
  ];

  return (
    <div className="space-y-6 text-slate-800">
      {/* Top Banner / Provenance Header */}
      <div className="bg-slate-100 border border-slate-300 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider bg-slate-200 text-slate-700 border border-slate-300 rounded">
                SEC-17684-273-411-436
              </span>
              <span className="px-2 py-0.5 text-xs font-mono bg-slate-200 text-slate-600 border border-slate-300 rounded">
                Anchor: 0x3F8F9A1B2C3D
              </span>
              <span className="px-2 py-0.5 text-xs bg-emerald-100 text-emerald-800 border border-emerald-300 rounded font-medium">
                C++ Terminal Active
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 mt-2">
              Enterprise Workflow Webhook Engine
            </h2>
            <p className="text-xs text-slate-600 mt-1 font-mono">
              Lane-VM Multi-Target Automated Transmission Core: X • SpaceX • Meta • nVidia • Apple
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunDiagnosticTest}
              disabled={isDispatching}
              className="px-3 py-1.5 text-xs font-medium bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg border border-slate-300 transition-colors flex items-center gap-1.5"
            >
              <Cpu className="w-3.5 h-3.5" />
              Diagnostic Ping
            </button>
            <button
              onClick={fetchStatus}
              disabled={isLoading}
              className="p-2 text-slate-600 hover:text-slate-900 bg-slate-200 hover:bg-slate-300 rounded-lg border border-slate-300 transition-colors"
              title="Refresh Engine Status"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* 5 Target Status Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-5">
          {targetList.map((t) => {
            const isSelected = selectedTarget === t.id;
            const targetStat = statusData?.targets?.[t.id];
            return (
              <div
                key={t.id}
                onClick={() => setSelectedTarget(t.id)}
                className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-slate-200/80 border-slate-500 shadow-sm ring-1 ring-slate-400'
                    : 'bg-white/70 border-slate-300 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-slate-800">{t.icon}</span>
                    <span className="font-semibold text-sm text-slate-900">{t.label}</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" title="Online" />
                </div>
                <div className="mt-2 text-[11px] text-slate-500 font-mono flex flex-col gap-0.5">
                  <span>{t.sub}</span>
                  <span className="text-[10px] text-slate-400">{t.asn}</span>
                </div>
                {targetStat && (
                  <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>Dispatches:</span>
                    <span className="font-semibold text-slate-700">{targetStat.count}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-300 gap-4 text-sm font-medium">
        <button
          onClick={() => setActiveTab('dispatch')}
          className={`pb-2 transition-colors relative flex items-center gap-2 ${
            activeTab === 'dispatch' ? 'text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Send className="w-4 h-4" />
          Workflow Webhook Dispatcher
          {activeTab === 'dispatch' && (
            <motion.div layoutId="tabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-800" />
          )}
        </button>
        <button
          onClick={() => { setActiveTab('history'); fetchHistory(); }}
          className={`pb-2 transition-colors relative flex items-center gap-2 ${
            activeTab === 'history' ? 'text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          Cryptographic Delivery Ledger ({history.length})
          {activeTab === 'history' && (
            <motion.div layoutId="tabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-800" />
          )}
        </button>
      </div>

      {/* Tab: Dispatch View */}
      {activeTab === 'dispatch' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls Column */}
          <div className="lg:col-span-1 space-y-5 bg-slate-100 border border-slate-300 rounded-xl p-5 shadow-sm">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                Destination Entity
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTarget('all')}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all text-center col-span-3 ${
                    selectedTarget === 'all'
                      ? 'bg-slate-800 text-white border-slate-900 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-200'
                  }`}
                >
                  Broadcast to All 5 Entities
                </button>
                {targetList.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTarget(t.id)}
                    className={`px-2 py-1.5 text-xs font-medium rounded-lg border transition-all text-center ${
                      selectedTarget === t.id
                        ? 'bg-slate-800 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                Payload Dataset / Document
              </label>
              <select
                value={selectedPayloadType}
                onChange={(e) => setSelectedPayloadType(e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-500 font-medium"
              >
                <option value="violations">Aggregate License Violations (28 Entities)</option>
                <option value="cease_and_desist">Automated Cease & Desist Notice (Markdown)</option>
                <option value="starlink">SpaceX / Starlink Terminal Network Audit</option>
                <option value="corpus">200MB Corpus Forensic Audit Report</option>
                <option value="manifest">Hourly Recursive Sync Manifest</option>
                <option value="custom">Custom JSON / Data Payload</option>
              </select>
            </div>

            {selectedPayloadType === 'custom' && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                  Custom JSON Payload
                </label>
                <textarea
                  rows={4}
                  value={customPayloadText}
                  onChange={(e) => setCustomPayloadText(e.target.value)}
                  placeholder='{"event": "SEC_DISCLOSURE", "notice": "Notice of license terms"}'
                  className="w-full text-xs font-mono bg-white border border-slate-300 rounded-lg p-3 text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-500"
                />
              </div>
            )}

            <div className="pt-2 border-t border-slate-200">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={dryRun}
                  onChange={(e) => setDryRun(e.target.checked)}
                  className="rounded border-slate-300 text-slate-800 focus:ring-slate-500"
                />
                Dry-Run Mode (Local Verification without Network POST)
              </label>
            </div>

            {dispatchError && (
              <div className="p-3 bg-red-100 border border-red-300 rounded-lg text-xs text-red-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
                <span>{dispatchError}</span>
              </div>
            )}

            <button
              onClick={handleDispatch}
              disabled={isDispatching}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isDispatching ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Executing Lane-VM C++ Dispatch...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Dispatch Webhook to {selectedTarget === 'all' ? 'All Targets' : selectedTarget.toUpperCase()}
                </>
              )}
            </button>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-2 space-y-4">
            {lastBatchResult ? (
              <div className="bg-slate-100 border border-slate-300 rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-bold text-slate-900 text-sm">
                      Transmission & Emergence Receipt
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">
                    {lastBatchResult.timestamp || new Date().toISOString()}
                  </span>
                </div>

                {lastBatchResult.results ? (
                  // Batch results for all 5 targets
                  <div className="space-y-3">
                    {Object.entries(lastBatchResult.results).map(([tId, rec]: [string, any]) => (
                      <div key={tId} className="bg-white border border-slate-200 rounded-lg p-3 text-xs space-y-1.5 font-mono">
                        <div className="flex items-center justify-between font-sans">
                          <span className="font-bold text-slate-900 text-sm">
                            {rec.targetName} ({tId.toUpperCase()})
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            rec.deliveryStatus?.includes('200') || rec.deliveryStatus?.includes('AIRGAP') || rec.deliveryStatus?.includes('VALIDATED')
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}>
                            {rec.deliveryStatus}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-slate-600 text-[11px]">
                          <div><span className="text-slate-400">Receipt ID:</span> {rec.deliveryId?.slice(0, 16)}...</div>
                          <div><span className="text-slate-400">Latency:</span> {rec.latencyMs} ms</div>
                          <div><span className="text-slate-400">SHA256:</span> {rec.payloadDigestSha256?.slice(0, 16)}...</div>
                          <div><span className="text-slate-400">Phi (Φ):</span> {rec.emergencePhi}</div>
                        </div>
                        {rec.responseSnippet && (
                          <div className="mt-1 p-2 bg-slate-50 border border-slate-200 rounded text-[10px] text-slate-600 truncate">
                            {rec.responseSnippet}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  // Single target result
                  <div className="space-y-3 text-xs font-mono">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3.5 rounded-lg border border-slate-200">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Target Entity</span>
                        <span className="font-semibold text-slate-900 font-sans">{lastBatchResult.targetName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Status</span>
                        <span className="font-semibold text-emerald-700">{lastBatchResult.deliveryStatus} (HTTP {lastBatchResult.httpStatusCode})</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Receipt ID</span>
                        <span className="text-slate-700 break-all">{lastBatchResult.deliveryId}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Transmission Latency</span>
                        <span className="text-slate-700">{lastBatchResult.latencyMs} ms</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Payload SHA-256</span>
                        <span className="text-slate-700 break-all">{lastBatchResult.payloadDigestSha256}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">HMAC-SHA256 Signature</span>
                        <span className="text-slate-700 break-all">{lastBatchResult.hmacSignature}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Integrated Phi (Φ)</span>
                        <span className="text-slate-700">{lastBatchResult.emergencePhi}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">C++ Enclave State</span>
                        <span className="text-emerald-700 font-semibold">{lastBatchResult.laneVmTerminalState}</span>
                      </div>
                    </div>

                    {lastBatchResult.responseSnippet && (
                      <div className="p-3 bg-white border border-slate-200 rounded-lg">
                        <span className="text-[10px] font-semibold uppercase text-slate-500 block mb-1">
                          Destination Response Receipt
                        </span>
                        <pre className="text-[11px] text-slate-700 whitespace-pre-wrap overflow-x-auto">
                          {lastBatchResult.responseSnippet}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-slate-100 border border-slate-300 rounded-xl p-8 shadow-sm flex flex-col items-center justify-center text-center">
                <Terminal className="w-10 h-10 text-slate-400 mb-3" />
                <h4 className="font-semibold text-slate-800 text-sm">Lane-VM C++ Webhook Enclave Ready</h4>
                <p className="text-xs text-slate-500 max-w-md mt-1">
                  Select a destination (X, SpaceX, Meta, nVidia, Apple, or All 5) and choose an automated dataset to dispatch with cryptographic SEC HMAC verification.
                </p>
                <div className="mt-4 flex items-center gap-3 text-xs text-slate-600 font-mono">
                  <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> SEC Whistleblower #17684</span>
                  <span>•</span>
                  <span>Anchor 0x3F8F9A1B2C3D</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: History Ledger */}
      {activeTab === 'history' && (
        <div className="bg-slate-100 border border-slate-300 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Immutable Webhook Delivery Audit Ledger
            </h3>
            <button
              onClick={fetchHistory}
              className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 font-medium"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh Log
            </button>
          </div>

          {history.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 font-mono">
              No webhook dispatches recorded in ledger yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b border-slate-300 text-slate-500 text-[11px] uppercase">
                    <th className="py-2 px-3">Timestamp</th>
                    <th className="py-2 px-3">Target</th>
                    <th className="py-2 px-3">Payload Kind</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3">HTTP</th>
                    <th className="py-2 px-3">Latency</th>
                    <th className="py-2 px-3">Receipt Digest</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {history.slice().reverse().map((rec, idx) => (
                    <tr key={idx} className="hover:bg-slate-200/50">
                      <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                        {rec.timestamp?.split('T')[1]?.split('.')[0]}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900 font-sans">
                        {rec.targetName || rec.target?.toUpperCase()}
                      </td>
                      <td className="py-2.5 px-3 text-slate-700">{rec.payloadKind}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                          rec.deliveryStatus?.includes('200') || rec.deliveryStatus?.includes('AIRGAP') || rec.deliveryStatus?.includes('VALIDATED')
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {rec.deliveryStatus}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">{rec.httpStatusCode}</td>
                      <td className="py-2.5 px-3 text-slate-600">{rec.latencyMs} ms</td>
                      <td className="py-2.5 px-3 text-slate-500 text-[10px] truncate max-w-[140px]" title={rec.payloadDigestSha256}>
                        {rec.payloadDigestSha256?.slice(0, 16)}...
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
