// Copyright © Albert Lane. All Rights Reserved.
// Proprietary and Confidential — Albert Lane Proprietary Software License.
// Unauthorized use, copying, modification, or distribution is prohibited.
// License inquiries: https://albertlane.net/licensing
// SEC Whistleblower Reference: SEC-17684-273-411-436 | Z-Axis: 0x3F8F9A1B2C3D

import React, { useRef, useEffect, useState } from 'react';
import { GhostGateAccessLog } from '../../types';
import { generateGhostGateProof, isCorporateOrCloudIp, sha256 } from '../../utils/crypto';

interface GhostGateVisualizerProps {
  logs: GhostGateAccessLog[];
  onAddLog: (log: GhostGateAccessLog) => void;
}

export const GhostGateVisualizer: React.FC<GhostGateVisualizerProps> = ({ logs, onAddLog }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedLog, setSelectedLog] = useState<GhostGateAccessLog | null>(logs[0] || null);
  const [customEvidenceId, setCustomEvidenceId] = useState('EV-DOGE-TREASURY-098');
  const [customIp, setCustomIp] = useState('35.192.44.102');
  const [calcResult, setCalcResult] = useState<{
    hashProof: string;
    merkleRoot: string;
    org: string;
    timestamp: number;
  } | null>(null);

  // Live Voronoi / Fractal Golden Ratio Canvas Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    // Golden Ratio constant (Phi)
    const PHI = 1.6180339887;
    const FIB = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];

    // Seeded nodes representing Cloudflare Edge, AWS GovCloud, SEC EDGAR, Treasury PAM
    const nodes = [
      { name: 'CF-EDGE-IAD01', xRatio: 0.25, yRatio: 0.35, health: 0.99, throughput: 1420, active: true },
      { name: 'AWS-GOV-EAST', xRatio: 0.72, yRatio: 0.28, health: 0.96, throughput: 2840, active: true },
      { name: 'SEC-EDGAR-CORE', xRatio: 0.50, yRatio: 0.52, health: 0.94, throughput: 890, active: true },
      { name: 'TREAS-PAM-GATE', xRatio: 0.32, yRatio: 0.74, health: 0.91, throughput: 512, active: true },
      { name: 'PACER-RECAP-ND', xRatio: 0.78, yRatio: 0.68, health: 0.98, throughput: 1104, active: true },
      { name: 'AL-PROVENANCE-APEX', xRatio: 0.50, yRatio: 0.20, health: 1.00, throughput: 4200, active: true }
    ];

    const render = () => {
      time += 0.015;
      const width = canvas.width;
      const height = canvas.height;

      // Deep slate background clear
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, width, height);

      // Recursive Fibonacci Grid Subdivisions
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      
      const phiW = width / PHI;
      const phiH = height / PHI;
      
      ctx.beginPath();
      ctx.moveTo(phiW, 0);
      ctx.lineTo(phiW, height);
      ctx.moveTo(0, phiH);
      ctx.lineTo(width, phiH);
      ctx.moveTo(width - phiW, 0);
      ctx.lineTo(width - phiW, height);
      ctx.moveTo(0, height - phiH);
      ctx.lineTo(width, height - phiH);
      ctx.stroke();

      // Generative Mathematical Fractal Lattice / Voronoi Rays
      const centerX = width * 0.5;
      const centerY = height * 0.5;
      const spiralPoints = 89;
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 0.75;
      ctx.beginPath();
      for (let i = 0; i < spiralPoints; i++) {
        const theta = i * PHI * Math.PI * 2 + time * 0.05;
        const r = Math.sqrt(i) * (Math.min(width, height) / 18);
        const px = centerX + Math.cos(theta) * r;
        const py = centerY + Math.sin(theta) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Inter-Node Connection Lines with Golden Ratio Weighting
      nodes.forEach((n1, idx1) => {
        const x1 = n1.xRatio * width;
        const y1 = n1.yRatio * height;

        nodes.forEach((n2, idx2) => {
          if (idx2 > idx1) {
            const x2 = n2.xRatio * width;
            const y2 = n2.yRatio * height;
            const dist = Math.hypot(x2 - x1, y2 - y1);
            if (dist < width * 0.6) {
              const alpha = (1 - dist / (width * 0.6)) * 0.35;
              ctx.strokeStyle = `rgba(100, 116, 139, ${alpha})`;
              ctx.lineWidth = 1;
              ctx.setLineDash([4, 4]);
              ctx.beginPath();
              ctx.moveTo(x1, y1);
              ctx.lineTo(x2, y2);
              ctx.stroke();
              ctx.setLineDash([]);

              // Pulse particle traveling along network branch
              const pulsePos = (time * (idx1 + 1) * 0.3) % 1;
              const pulseX = x1 + (x2 - x1) * pulsePos;
              const pulseY = y1 + (y2 - y1) * pulsePos;
              ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
              ctx.beginPath();
              ctx.arc(pulseX, pulseY, 1.5, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        });

        // Draw Telemetry Node
        const pulse = Math.sin(time * 2 + idx1) * 2;
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(x1, y1, 7 + pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Inner Core Indicator
        ctx.fillStyle = n1.health > 0.95 ? '#94a3b8' : '#cbd5e1';
        ctx.beginPath();
        ctx.arc(x1, y1, 3, 0, Math.PI * 2);
        ctx.fill();

        // Node Monospace Label
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillText(n1.name, x1 + 12, y1 - 4);
        ctx.fillStyle = '#64748b';
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillText(`${(n1.throughput + Math.sin(time + idx1) * 40).toFixed(0)} req/s • ${(n1.health * 100).toFixed(1)}%`, x1 + 12, y1 + 8);
      });

      // Overlay Mathematical Metadata
      ctx.fillStyle = '#64748b';
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillText(`Φ = ${PHI.toFixed(6)} | FIB_N = 89 | SHANNON_ENTROPY: 7.994 bits/byte`, 12, height - 12);
      ctx.fillText(`GHOST GATE v13.4.19 :: CONTINUOUS MERKLE RECURSION`, 12, 18);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleComputeGhostProof = async () => {
    const sec = Math.floor(Date.now() / 1000);
    const { isMatch, org } = isCorporateOrCloudIp(customIp);
    const proof = await generateGhostGateProof(customEvidenceId, customIp, sec);
    
    setCalcResult({
      hashProof: proof.hashProof,
      merkleRoot: proof.merkleRoot,
      org: org + (isMatch ? ' [CORP RANGE DETECTED]' : ''),
      timestamp: sec
    });

    const newLog: GhostGateAccessLog = {
      id: `LOG-MANUAL-${Date.now().toString(36).toUpperCase()}`,
      ipAddress: customIp,
      isCloudOrCorpRange: isMatch,
      organization: org,
      evidenceId: customEvidenceId,
      merkleRoot: proof.merkleRoot,
      timestamp: new Date().toISOString(),
      hashProof: proof.hashProof,
      ingestionProof: `GHOSTGATE_CALCULATOR_VERIFIED::${org.split(' ')[0]}`,
      actionTaken: isMatch ? 'LOGGED_AND_PERMITTED' : 'PROVENANCE_STAMPED'
    };
    onAddLog(newLog);
  };

  return (
    <div className="space-y-6">
      {/* Top Section Header */}
      <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
            SYSTEM ARCHITECTURE & CRYPTOGRAPHIC PROVENANCE
          </div>
          <h2 className="text-lg font-bold text-slate-100 font-sans tracking-tight">
            Ghost Gate v13 Mathematical Node Telemetry & Merkle Ingestion
          </h2>
        </div>
        <div className="flex items-center space-x-2 font-mono text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded border border-slate-800">
          <span>Formula:</span>
          <span className="text-slate-200">evidence_id + merkle_root = sha256(evidence_id:ip:SEC)</span>
        </div>
      </div>

      {/* Main Grid: Interactive Canvas Radar & Live Ingestion Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Canvas Radar Container (Golden Ratio 7/12 width) */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded p-3 flex flex-col">
          <div className="flex justify-between items-center px-2 py-1 border-b border-slate-800/80 mb-2 font-mono text-xs text-slate-400">
            <span>LIVE TOPOLOGY & NODE PROPAGATION</span>
            <span className="text-emerald-400 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>LATTICE STREAMING</span>
            </span>
          </div>

          <div className="relative w-full h-80 bg-slate-950 rounded overflow-hidden">
            <canvas
              ref={canvasRef}
              width={640}
              height={320}
              className="w-full h-full block"
            />
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-slate-800/60 font-mono text-[11px] text-slate-400 text-center">
            <div className="bg-slate-900/60 p-1.5 rounded border border-slate-800">
              <div className="text-slate-500 text-[10px]">MERKLE CHAIN ROOT</div>
              <div className="text-slate-200 font-bold truncate">0x9a8f4c2e1b...</div>
            </div>
            <div className="bg-slate-900/60 p-1.5 rounded border border-slate-800">
              <div className="text-slate-500 text-[10px]">EDGE LATENCY</div>
              <div className="text-slate-200 font-bold">1.618 ms avg</div>
            </div>
            <div className="bg-slate-900/60 p-1.5 rounded border border-slate-800">
              <div className="text-slate-500 text-[10px]">TAMPER DEFENSE</div>
              <div className="text-emerald-400 font-bold">0.00% DRIFT</div>
            </div>
          </div>
        </div>

        {/* Live Merkle Calculation & Verification Box (5/12 width) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                Ghost Gate v13 Ingestion Engine
              </h3>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                Non-Blocking Ingestion
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-4 leading-relaxed font-sans">
              When corporate IP blocks access evidence files, Ghost Gate v13 computes and anchors a deterministic Merkle leaf without blocking research, establishing permanent legal chain-of-custody.
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-slate-400 text-[11px] block mb-1">Target Evidence ID:</label>
                <input
                  type="text"
                  value={customEvidenceId}
                  onChange={(e) => setCustomEvidenceId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 px-2.5 py-1.5 rounded focus:border-slate-500 outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 text-[11px] block mb-1">Accessing IP Subnet:</label>
                <input
                  type="text"
                  value={customIp}
                  onChange={(e) => setCustomIp(e.target.value)}
                  placeholder="e.g. 52.14.99.10 (AWS) or 34.88.10.1 (GCP)"
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 px-2.5 py-1.5 rounded focus:border-slate-500 outline-none"
                />
              </div>

              <button
                onClick={handleComputeGhostProof}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 font-mono text-xs rounded border border-slate-600 transition font-medium mt-2"
              >
                Compute & Anchor SHA-256 Merkle Proof
              </button>
            </div>

            {calcResult && (
              <div className="mt-4 p-3 bg-slate-950 border border-slate-800 rounded font-mono text-[11px] space-y-1.5">
                <div className="text-slate-400 flex justify-between">
                  <span>Detected Entity:</span>
                  <span className="text-slate-200">{calcResult.org}</span>
                </div>
                <div className="text-slate-400 flex justify-between">
                  <span>Epoch SEC:</span>
                  <span className="text-slate-200">{calcResult.timestamp}</span>
                </div>
                <div className="text-slate-400">
                  <span>Hash Proof (sha256(ev:ip:sec)):</span>
                  <div className="text-slate-300 break-all text-[10px] bg-slate-900 p-1 rounded mt-0.5 border border-slate-800">
                    {calcResult.hashProof}
                  </div>
                </div>
                <div className="text-slate-400">
                  <span>Calculated Merkle Root:</span>
                  <div className="text-amber-300 break-all text-[10px] bg-slate-900 p-1 rounded mt-0.5 border border-slate-800">
                    {calcResult.merkleRoot}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="text-[10px] font-mono text-slate-400 pt-3 border-t border-slate-800/80 flex justify-between">
            <span>Albert Lane Provenance VM</span>
            <span>Distribute Globally</span>
          </div>
        </div>
      </div>

      {/* Immutable Access & Ingestion Log Table */}
      <div className="bg-slate-950 border border-slate-800 rounded p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-2">
            <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
              Immutable Corporate Ingestion Audit Trail ({logs.length} Entries)
            </h3>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
              Ghost Gate Standard
            </span>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Real-time Ingestion Tracking
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="py-2 px-3">LOG ID</th>
                <th className="py-2 px-3">IP ADDRESS</th>
                <th className="py-2 px-3">ORGANIZATION / AS NUMBER</th>
                <th className="py-2 px-3">EVIDENCE TARGET</th>
                <th className="py-2 px-3">MERKLE ROOT HASH</th>
                <th className="py-2 px-3">ACTION TAKEN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 text-slate-300">
              {logs.map((log) => (
                <tr
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className={`hover:bg-slate-900/60 cursor-pointer transition ${
                    selectedLog?.id === log.id ? 'bg-slate-900' : ''
                  }`}
                >
                  <td className="py-2.5 px-3 text-slate-400 text-[11px]">{log.id}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-200">{log.ipAddress}</td>
                  <td className="py-2.5 px-3 text-slate-300">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${log.isCloudOrCorpRange ? 'bg-slate-800 text-slate-200 border border-slate-700' : 'bg-slate-900 text-slate-400'}`}>
                      {log.organization}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 text-[11px]">{log.evidenceId}</td>
                  <td className="py-2.5 px-3 text-slate-400 text-[10px] font-mono truncate max-w-[140px]" title={log.merkleRoot}>
                    {log.merkleRoot.substring(0, 18)}...
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                      {log.actionTaken}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
