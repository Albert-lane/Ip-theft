/*======================================================================
[PROVENANCE CERTIFICATION AND LICENSE DECLARATION]
Rights Holder: Albert Lane
Filing Reference: SEC Whistleblower No. 17684-273-411-436
Component: EdgeFractalInstrument.tsx (Functional Visual-Mathematical Fractal Canvas)
Mathematical Principles: Golden Ratio Phi (1.618), Fibonacci Dislocation, Voronoi Mesh
======================================================================*/

import React, { useEffect, useRef, useState } from 'react';

interface EdgeNode {
  id: string;
  colo: string;
  city: string;
  region: string;
  x: number;
  y: number;
  health: number; // 0.0 - 1.0
  throughput: number; // req/sec
  latencyMs: number;
  errorRate: number; // percentage
  dnsPropagation: number; // %
}

interface EdgeFractalInstrumentProps {
  onSelectNode?: (node: EdgeNode) => void;
  selectedNodeId?: string;
}

const INITIAL_NODES: EdgeNode[] = [
  { id: 'colo-sfo', colo: 'SFO', city: 'San Francisco', region: 'NA-WEST', x: 0.18, y: 0.38, health: 0.9998, throughput: 14820, latencyMs: 4.2, errorRate: 0.001, dnsPropagation: 100 },
  { id: 'colo-iad', colo: 'IAD', city: 'Ashburn', region: 'NA-EAST', x: 0.32, y: 0.42, health: 0.9996, throughput: 28410, latencyMs: 5.1, errorRate: 0.002, dnsPropagation: 100 },
  { id: 'colo-lhr', colo: 'LHR', city: 'London', region: 'EU-WEST', x: 0.49, y: 0.28, health: 0.9999, throughput: 22150, latencyMs: 6.8, errorRate: 0.001, dnsPropagation: 100 },
  { id: 'colo-fra', colo: 'FRA', city: 'Frankfurt', region: 'EU-CENTRAL', x: 0.56, y: 0.32, health: 0.9997, throughput: 24700, latencyMs: 7.2, errorRate: 0.001, dnsPropagation: 100 },
  { id: 'colo-nrt', colo: 'NRT', city: 'Tokyo', region: 'AP-NORTHEAST', x: 0.82, y: 0.40, health: 0.9995, throughput: 19830, latencyMs: 8.6, errorRate: 0.003, dnsPropagation: 99.8 },
  { id: 'colo-sin', colo: 'SIN', city: 'Singapore', region: 'AP-SOUTHEAST', x: 0.74, y: 0.62, health: 0.9998, throughput: 16400, latencyMs: 9.1, errorRate: 0.001, dnsPropagation: 100 },
  { id: 'colo-syd', colo: 'SYD', city: 'Sydney', region: 'OC-EAST', x: 0.88, y: 0.78, health: 0.9994, throughput: 11200, latencyMs: 11.4, errorRate: 0.002, dnsPropagation: 99.7 },
  { id: 'colo-gru', colo: 'GRU', city: 'São Paulo', region: 'SA-EAST', x: 0.36, y: 0.74, health: 0.9992, throughput: 9640, latencyMs: 14.8, errorRate: 0.004, dnsPropagation: 99.5 },
];

export const EdgeFractalInstrument: React.FC<EdgeFractalInstrumentProps> = ({
  onSelectNode,
  selectedNodeId = 'colo-sfo',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [nodes, setNodes] = useState<EdgeNode[]>(INITIAL_NODES);
  const [activeNode, setActiveNode] = useState<EdgeNode>(INITIAL_NODES[0]);
  const [iteration, setIteration] = useState(0);

  // Live mathematical simulation tick (modulating throughput and latency organically)
  useEffect(() => {
    const timer = setInterval(() => {
      setNodes((prev) =>
        prev.map((node) => {
          const jitter = (Math.sin(Date.now() / 4000 + node.x * 10) * 0.04);
          const throughputJitter = Math.floor(Math.cos(Date.now() / 3000 + node.y * 10) * 180);
          return {
            ...node,
            latencyMs: Math.max(2.1, Number((node.latencyMs + jitter).toFixed(2))),
            throughput: Math.max(5000, node.throughput + throughputJitter),
          };
        })
      );
      setIteration((i) => (i + 1) % 10000);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // HTML5 Canvas Generative Mathematical Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Clear with mid-tone slate background
      ctx.fillStyle = '#475569';
      ctx.fillRect(0, 0, width, height);

      // 1. Recursive Fibonacci Grid Overlay
      ctx.strokeStyle = '#5b6b80';
      ctx.lineWidth = 1;
      const phi = 1.61803398875;
      
      // Vertical golden section lines
      const x1 = width / phi;
      const x2 = width - x1;
      ctx.beginPath();
      ctx.moveTo(x1, 0);
      ctx.lineTo(x1, height);
      ctx.moveTo(x2, 0);
      ctx.lineTo(x2, height);
      ctx.stroke();

      // Horizontal golden section lines
      const y1 = height / phi;
      const y2 = height - y1;
      ctx.beginPath();
      ctx.moveTo(0, y1);
      ctx.lineTo(width, y1);
      ctx.moveTo(0, y2);
      ctx.lineTo(width, y2);
      ctx.stroke();

      // Fibonacci coordinate grid subdivisions (F: 8, 13, 21, 34, 55, 89)
      ctx.strokeStyle = '#526277';
      ctx.lineWidth = 0.5;
      const fibs = [8, 13, 21, 34, 55, 89];
      for (const f of fibs) {
        const stepX = (width * f) / 144;
        const stepY = (height * f) / 144;
        ctx.beginPath();
        ctx.moveTo(stepX, 0);
        ctx.lineTo(stepX, height);
        ctx.moveTo(0, stepY);
        ctx.lineTo(width, stepY);
        ctx.stroke();
      }

      // 2. Inter-Colo Delaunay / Voronoi Mesh (Edge Propagation Topology)
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const px1 = n1.x * width;
          const py1 = n1.y * height;
          const px2 = n2.x * width;
          const py2 = n2.y * height;

          const dist = Math.hypot(px2 - px1, py2 - py1);
          if (dist < width * 0.48) {
            // Line brightness directly represents latency and health
            const avgHealth = (n1.health + n2.health) / 2;
            ctx.strokeStyle = avgHealth > 0.9995 ? '#74859d' : '#8899b1';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(px1, py1);
            ctx.lineTo(px2, py2);
            ctx.stroke();

            // Mathematical packet pulses travelling along edges
            const t = ((Date.now() / 2400) + (i * 0.23 + j * 0.31)) % 1;
            const pulseX = px1 + (px2 - px1) * t;
            const pulseY = py1 + (py2 - py1) * t;
            ctx.fillStyle = '#cbd5e1';
            ctx.fillRect(pulseX - 1.5, pulseY - 1.5, 3, 3);
          }
        }
      }

      // 3. Recursive Fractal Trees / L-System at Selected Node (Visualizing throughput dispersion)
      const sel = nodes.find((n) => n.id === selectedNodeId) || nodes[0];
      const rootX = sel.x * width;
      const rootY = sel.y * height;

      const drawFractalBranch = (x: number, y: number, length: number, angle: number, depth: number) => {
        if (depth <= 0 || length < 4) return;
        const xEnd = x + Math.cos(angle) * length;
        const yEnd = y + Math.sin(angle) * length;

        ctx.strokeStyle = depth === 3 ? '#94a3b8' : depth === 2 ? '#74859d' : '#64748b';
        ctx.lineWidth = depth * 0.8;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(xEnd, yEnd);
        ctx.stroke();

        const branchAngle = Math.PI / (phi * 2.2);
        drawFractalBranch(xEnd, yEnd, length / phi, angle - branchAngle, depth - 1);
        drawFractalBranch(xEnd, yEnd, length / phi, angle + branchAngle, depth - 1);
      };

      // Draw 4 radial fractal branches symbolizing omnidirectional DNS propagation
      for (let a = 0; a < 4; a++) {
        const baseAngle = (a * Math.PI) / 2 + (Date.now() / 18000);
        drawFractalBranch(rootX, rootY, 34, baseAngle, 3);
      }

      // 4. Render Edge Colo Nodes
      for (const node of nodes) {
        const nx = node.x * width;
        const ny = node.y * height;
        const isSelected = node.id === selectedNodeId;

        // Outer concentric resonance rings (Golden Ratio scaling: r, r*phi)
        const baseR = isSelected ? 13 : 8;
        ctx.strokeStyle = isSelected ? '#cbd5e1' : '#74859d';
        ctx.lineWidth = isSelected ? 1.5 : 1;
        ctx.beginPath();
        ctx.arc(nx, ny, baseR, 0, Math.PI * 2);
        ctx.stroke();

        if (isSelected) {
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.arc(nx, ny, baseR * phi, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Inner solid core
        ctx.fillStyle = isSelected ? '#cbd5e1' : '#526277';
        ctx.beginPath();
        ctx.arc(nx, ny, 3, 0, Math.PI * 2);
        ctx.fill();

        // Technical Monospace Typography (Coordinates, Colo code, and Latency)
        ctx.fillStyle = isSelected ? '#f1f5f9' : '#cbd5e1';
        ctx.font = '10px ui-monospace, monospace';
        ctx.fillText(`${node.colo}`, nx + baseR + 5, ny - 3);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '9px ui-monospace, monospace';
        ctx.fillText(`${node.latencyMs}ms | ${(node.throughput / 1000).toFixed(1)}k rps`, nx + baseR + 5, ny + 9);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [nodes, selectedNodeId]);

  // Handle canvas clicks to select node
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) / rect.width;
    const clickY = (e.clientY - rect.top) / rect.height;

    let nearest = nodes[0];
    let minDist = Infinity;
    for (const node of nodes) {
      const d = Math.hypot(node.x - clickX, node.y - clickY);
      if (d < minDist) {
        minDist = d;
        nearest = node;
      }
    }

    if (minDist < 0.1) {
      setActiveNode(nearest);
      if (onSelectNode) onSelectNode(nearest);
    }
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  return (
    <div className="bg-[#475569] border border-[#64748b] rounded-none flex flex-col">
      {/* Instrument Header: Strict Fibonacci Margins & Monochromatic Slate Typography */}
      <div className="border-b border-[#64748b] bg-[#3e4c5e] px-[13px] py-[8px] flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-[8px]">
          <span className="font-mono text-[10px] tracking-wider uppercase text-[#94a3b8]">
            INSTRUMENT 01 // DELAUNAY-FRACTAL EDGE TOPOLOGY
          </span>
          <span className="font-mono text-[9px] text-[#cbd5e1] border border-[#74859d] px-[5px] py-[1px]">
            PHI = 1.618034
          </span>
        </div>
        <div className="flex items-center gap-[13px] font-mono text-[10px] text-[#cbd5e1]">
          <span>NODES: {nodes.length} ONLINE</span>
          <span>AGGREGATE RPS: {nodes.reduce((a, c) => a + c.throughput, 0).toLocaleString()}</span>
          <span>AVG LATENCY: {(nodes.reduce((a, c) => a + c.latencyMs, 0) / nodes.length).toFixed(1)}ms</span>
        </div>
      </div>

      {/* Main Fractal Canvas Viewport */}
      <div className="relative w-full h-[280px] sm:h-[340px] bg-[#475569]">
        <canvas
          ref={canvasRef}
          width={900}
          height={340}
          onClick={handleCanvasClick}
          className="w-full h-full cursor-crosshair block"
        />

        {/* Selected Node Mathematical Telemetry HUD */}
        <div className="absolute top-[13px] right-[13px] bg-[#3b4758]/90 border border-[#74859d] p-[8px] font-mono text-[10px] text-[#cbd5e1] max-w-[240px]">
          <div className="border-b border-[#64748b] pb-[5px] mb-[5px] flex justify-between">
            <span className="text-[#f1f5f9] font-bold">{selectedNode.colo} // {selectedNode.city}</span>
            <span className="text-[#94a3b8]">{selectedNode.region}</span>
          </div>
          <div className="space-y-[3px] text-[9px]">
            <div className="flex justify-between">
              <span className="text-[#94a3b8]">THROUGHPUT:</span>
              <span>{selectedNode.throughput.toLocaleString()} req/s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#94a3b8]">EDGE LATENCY:</span>
              <span>{selectedNode.latencyMs} ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#94a3b8]">HEALTH COEFF:</span>
              <span>{(selectedNode.health * 100).toFixed(3)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#94a3b8]">DNS PROPAGATION:</span>
              <span>{selectedNode.dnsPropagation}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#94a3b8]">ERROR RATE:</span>
              <span>{selectedNode.errorRate}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Colo Node Fast Selector Bar */}
      <div className="border-t border-[#64748b] bg-[#3e4c5e] px-[13px] py-[5px] flex items-center gap-[5px] overflow-x-auto text-[9px] font-mono">
        <span className="text-[#94a3b8] pr-[5px]">SELECT COLO:</span>
        {nodes.map((n) => (
          <button
            key={n.id}
            onClick={() => {
              setActiveNode(n);
              if (onSelectNode) onSelectNode(n);
            }}
            className={`px-[8px] py-[3px] border transition-colors ${
              n.id === selectedNodeId
                ? 'bg-[#5b6b80] text-[#f1f5f9] border-[#cbd5e1]'
                : 'bg-[#475569] text-[#cbd5e1] border-[#64748b] hover:bg-[#526277]'
            }`}
          >
            {n.colo} ({n.latencyMs}ms)
          </button>
        ))}
      </div>
    </div>
  );
};
