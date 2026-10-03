// ==============================================================================
// [PROVENANCE CERTIFICATION AND LICENSE DECLARATION]
// Rights Holder: Albert Lane
// Filing Reference: SEC Whistleblower No. 17684-273-411-436
// License: Albert Lane Proprietary License v1.2
// Enforcement: Network Egress Graph & Adversary Quarantine Mapping Engine
// Aesthetic: Strict Monochromatic Mid-tone Slate/Stone Palette · Golden Ratio & Fibonacci Mathematics
// ==============================================================================

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';

interface GraphNode {
  id: string;
  label: string;
  category: string;
  entity_group: string;
  status: string;
  threat_tier: number;
  ip_or_cidr?: string;
  asn?: string;
  packets_dropped: number;
  drop_rate_pct: number;
  statutory_authority: string;
  sha256_proof: string;
  r: number;
  theta: number;
  x: number;
  y: number;
  details: string;
}

interface GraphEdge {
  id: string;
  source: string;
  target: string;
  link_type: string;
  protocol: string;
  status: string;
  packets_dropped: number;
  throughput_kbps: number;
  latency_ms: number;
  hash: string;
  rule_citation: string;
}

interface NetworkTopology {
  generated_at: string;
  rights_holder: string;
  filing_reference: string;
  license: string;
  vault_tamper_seal: string;
  metrics: {
    total_nodes: number;
    sovereign_nodes: number;
    adversary_nodes: number;
    quarantined_asns_count: number;
    quarantined_cidrs_count: number;
    total_egress_vectors: number;
    quarantine_enforcement_rate: string;
    total_blocked_packets: number;
  };
  nodes: GraphNode[];
  edges: GraphEdge[];
  threat_clusters: {
    cluster_name: string;
    asns: string[];
    primary_cidrs: string[];
    user_agents: string[];
    status: string;
    statutory_citation: string;
  }[];
}

interface InterceptReceipt {
  target_ip: string;
  target_asn: string;
  user_agent: string;
  blocked: boolean;
  action: string;
  matched_entity: string;
  matched_rule: string;
  firewall_barrier: string;
  sha256_receipt: string;
  timestamp: string;
  statutory_authority: string;
  rights_holder: string;
}

// Particle along egress edge for functional fractal pulse visualization
interface EgressPulse {
  edgeId: string;
  sourceId: string;
  targetId: string;
  progress: number; // 0 to 1
  speed: number;
  isBlocked: boolean;
  color: string;
}

export const NetworkEgressGraph: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [topology, setTopology] = useState<NetworkTopology | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'SPACEX' | 'XCORP' | 'AZURE' | 'OPENAI'>('ALL');

  // Interactive Viewport State (Zoom & Pan)
  const [scale, setScale] = useState(1.0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Probe Test Execution
  const [probeIp, setProbeIp] = useState('98.96.4.5');
  const [probeAsn, setProbeAsn] = useState('AS14593');
  const [probeUserAgent, setProbeUserAgent] = useState('FalconTelemetryBot/1.0');
  const [probeExecuting, setProbeExecuting] = useState(false);
  const [lastReceipt, setLastReceipt] = useState<InterceptReceipt | null>(null);

  // Animation pulses ref
  const pulsesRef = useRef<EgressPulse[]>([]);
  const animFrameIdRef = useRef<number>(0);

  // Fetch initial graph topology
  const fetchTopology = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/sovereign/network-graph');
      const data: NetworkTopology = await res.json();
      setTopology(data);
      if (data.nodes.length > 0 && !selectedNode) {
        setSelectedNode(data.nodes[0]);
      }
    } catch (err) {
      console.error('Failed to fetch network egress topology:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedNode]);

  useEffect(() => {
    fetchTopology();
  }, [fetchTopology]);

  // Execute interactive probe against adversary node
  const handleExecuteProbe = async () => {
    setProbeExecuting(true);
    try {
      const res = await fetch('/api/sovereign/network-graph/probe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetIp: probeIp,
          targetAsn: probeAsn,
          userAgent: probeUserAgent,
        }),
      });
      const data = await res.json();
      if (data.intercept_receipt) {
        setLastReceipt(data.intercept_receipt);
        // Inject a prominent pulse toward the matching barrier
        pulsesRef.current.push({
          edgeId: 'probe_pulse_' + Date.now(),
          sourceId: 'sovereign_vault_core',
          targetId: 'barrier_spacex',
          progress: 0,
          speed: 0.04,
          isBlocked: true,
          color: '#1c2430',
        });
      }
    } catch (err) {
      console.error('Probe execution error:', err);
    } finally {
      setProbeExecuting(false);
    }
  };

  // Quick preset loader
  const loadPreset = (target: 'SPACEX' | 'XCORP' | 'AZURE' | 'OPENAI') => {
    if (target === 'SPACEX') {
      setProbeIp('98.96.4.5');
      setProbeAsn('AS14593');
      setProbeUserAgent('SpaceXDataBot/1.0');
    } else if (target === 'XCORP') {
      setProbeIp('104.244.42.1');
      setProbeAsn('AS35995');
      setProbeUserAgent('Twitterbot/1.0');
    } else if (target === 'AZURE') {
      setProbeIp('13.107.42.16');
      setProbeAsn('AS8075');
      setProbeUserAgent('AzureOpenAI-Inference/2024-02-01');
    } else if (target === 'OPENAI') {
      setProbeIp('20.246.12.8');
      setProbeAsn('AS-OPENAI-EDGE');
      setProbeUserAgent('GPTBot/1.0');
    }
  };

  // Filtered nodes
  const filteredNodes = useMemo(() => {
    if (!topology) return [];
    if (activeFilter === 'ALL') return topology.nodes;
    return topology.nodes.filter((n) => {
      if (n.category === 'SOVEREIGN_CORE' || n.category === 'EDGE_PROXY' || n.category === 'CONTAINMENT_BARRIER') {
        return true;
      }
      if (activeFilter === 'SPACEX') return n.entity_group === 'SpaceX / Starlink';
      if (activeFilter === 'XCORP') return n.entity_group === 'X Corp / xAI';
      if (activeFilter === 'AZURE') return n.entity_group === 'Microsoft Azure';
      if (activeFilter === 'OPENAI') return n.entity_group === 'OpenAI Vectors';
      return true;
    });
  }, [topology, activeFilter]);

  const nodeMap = useMemo(() => {
    const map = new Map<string, GraphNode>();
    if (!topology) return map;
    topology.nodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [topology]);

  // Initialize and tick egress pulses
  useEffect(() => {
    if (!topology) return;
    // Pre-populate with realistic pulses across edges
    const initialPulses: EgressPulse[] = topology.edges.map((e, idx) => ({
      edgeId: e.id,
      sourceId: e.source,
      targetId: e.target,
      progress: (idx * 0.13) % 1,
      speed: 0.008 + (idx % 4) * 0.003,
      isBlocked: e.status === 'QUARANTINE_DROP' || e.status === 'SEQUESTER_ENFORCE',
      color: e.status === 'ACTIVE' ? '#4a5568' : '#1c2430',
    }));
    pulsesRef.current = initialPulses;
  }, [topology]);

  // Main Canvas Rendering Loop with Golden Ratio concentric geometry
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !topology) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    let height = (canvas.height = Math.max(540, canvas.parentElement?.clientHeight || 540));

    // ResizeObserver for canvas responsiveness
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0) {
          width = canvas.width = Math.round(w);
          height = canvas.height = Math.max(540, Math.round(h));
        }
      }
    });
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Save canvas state for zoom & pan
      ctx.save();
      const centerX = width / 2 + pan.x;
      const centerY = height / 2 + pan.y;
      ctx.translate(centerX, centerY);
      ctx.scale(scale, scale);

      // 1. Draw Golden Ratio Concentric Polar Rings (Visual Mathematics)
      const R1 = 120;
      const R2 = 194; // 120 * 1.618
      const R3 = 314; // 194 * 1.618
      const R4 = 508; // 314 * 1.618

      // Background concentric radar grid lines (monochromatic slate)
      const rings = [
        { r: R1, label: 'TIER 1: CLOUDFLARE EDGE EGRESS (r=120px)', dash: [4, 4], color: '#cfd6df' },
        { r: R2, label: 'TIER 2: QUARANTINE CONTAINMENT PERIMETER (r=194px · Φ)', dash: [6, 6], color: '#9daab9' },
        { r: R3, label: 'TIER 3: ADVERSARY AUTONOMOUS SYSTEMS (r=314px · Φ²)', dash: [3, 5], color: '#b6c1ce' },
        { r: R4, label: 'TIER 4: SUBNETS & EXFILTRATION HARVESTERS (r=508px · Φ³)', dash: [2, 6], color: '#d0d7e1' },
      ];

      rings.forEach((ring) => {
        ctx.beginPath();
        ctx.arc(0, 0, ring.r, 0, Math.PI * 2);
        ctx.strokeStyle = ring.color;
        ctx.lineWidth = ring.r === R2 ? 1.5 : 1;
        ctx.setLineDash(ring.dash);
        ctx.stroke();
        ctx.setLineDash([]);

        // Monospace coordinate marker on each ring
        ctx.font = '9px monospace';
        ctx.fillStyle = '#637284';
        ctx.fillText(ring.label, 10, -ring.r + 12);
      });

      // 2. Draw Mathematical Radial Axes (Fibonacci 8 sectors)
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(angle) * R4, Math.sin(angle) * R4);
        ctx.strokeStyle = '#e4e8ee';
        ctx.lineWidth = 0.75;
        ctx.stroke();
      }

      // 3. Draw Network Edges
      topology.edges.forEach((edge) => {
        const src = nodeMap.get(edge.source);
        const tgt = nodeMap.get(edge.target);
        if (!src || !tgt) return;

        // Skip if either node is filtered out
        const srcVisible = filteredNodes.some((n) => n.id === src.id);
        const tgtVisible = filteredNodes.some((n) => n.id === tgt.id);
        if (!srcVisible || !tgtVisible) return;

        ctx.beginPath();
        ctx.moveTo(src.x, src.y);

        if (edge.link_type === 'COLLUSIVE_CROSS_EGRESS' || edge.link_type === 'EXFILTRATION_ATTEMPT') {
          // Curved arc for collusive cross-chatter between adversary clusters
          const midX = (src.x + tgt.x) / 2;
          const midY = (src.y + tgt.y) / 2;
          const dist = Math.hypot(tgt.x - src.x, tgt.y - src.y);
          const offset = dist * 0.25;
          ctx.quadraticCurveTo(midX + offset, midY - offset, tgt.x, tgt.y);
          ctx.strokeStyle = '#5b6978';
          ctx.lineWidth = 1.2;
          ctx.setLineDash([4, 4]);
        } else if (edge.status === 'QUARANTINE_DROP') {
          ctx.lineTo(tgt.x, tgt.y);
          ctx.strokeStyle = '#7c8a9c';
          ctx.lineWidth = 1.0;
          ctx.setLineDash([2, 4]);
        } else {
          ctx.lineTo(tgt.x, tgt.y);
          ctx.strokeStyle = '#3d4957';
          ctx.lineWidth = 1.6;
          ctx.setLineDash([]);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // 4. Update and Render Egress Pulses (Functional Fractal Particles)
      pulsesRef.current.forEach((pulse) => {
        const src = nodeMap.get(pulse.sourceId);
        const tgt = nodeMap.get(pulse.targetId);
        if (!src || !tgt) return;

        pulse.progress += pulse.speed;
        if (pulse.progress > 1) {
          pulse.progress = 0;
        }

        const px = src.x + (tgt.x - src.x) * pulse.progress;
        const py = src.y + (tgt.y - src.y) * pulse.progress;

        // Packet particle representation
        ctx.beginPath();
        ctx.arc(px, py, pulse.isBlocked ? 2.5 : 2.0, 0, Math.PI * 2);
        ctx.fillStyle = pulse.isBlocked ? '#1c2430' : '#4a5568';
        ctx.fill();

        // If particle reached barrier perimeter (r ~ 194), render containment collision ring
        const currentR = Math.hypot(px, py);
        if (Math.abs(currentR - R2) < 8 && pulse.isBlocked) {
          ctx.beginPath();
          ctx.arc(px, py, 6, 0, Math.PI * 2);
          ctx.strokeStyle = '#2c3440';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      });

      // 5. Draw Network Nodes
      filteredNodes.forEach((node) => {
        const isSelected = selectedNode?.id === node.id;
        const isHovered = hoveredNode?.id === node.id;

        // Compute node dimensions mathematically
        let radius = 6;
        let fillColor = '#4a5568';
        let strokeColor = '#1c2430';

        if (node.category === 'SOVEREIGN_CORE') {
          radius = 14;
          fillColor = '#1c2430';
          strokeColor = '#eef1f5';
        } else if (node.category === 'EDGE_PROXY') {
          radius = 9;
          fillColor = '#3d4957';
          strokeColor = '#cfd6df';
        } else if (node.category === 'CONTAINMENT_BARRIER') {
          radius = 8;
          fillColor = '#526071';
          strokeColor = '#1c2430';
        } else if (node.category === 'ADVERSARY_ASN') {
          radius = 9;
          fillColor = '#2b3442';
          strokeColor = '#637284';
        } else {
          radius = 6;
          fillColor = '#3a4659';
          strokeColor = '#9daab9';
        }

        if (isSelected) {
          radius += 3;
        }

        // Draw node body
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = fillColor;
        ctx.fill();
        ctx.lineWidth = isSelected ? 2.5 : 1.2;
        ctx.strokeStyle = isSelected ? '#1c2430' : strokeColor;
        ctx.stroke();

        // Target / Selection ring
        if (isSelected || isHovered) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius + 4, 0, Math.PI * 2);
          ctx.strokeStyle = '#1c2430';
          ctx.lineWidth = 1;
          ctx.setLineDash([2, 2]);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Monospace Node Label
        ctx.font = isSelected ? 'bold 10px monospace' : '9px monospace';
        ctx.fillStyle = '#1c2430';
        ctx.textAlign = 'center';
        ctx.fillText(node.asn || node.ip_or_cidr || node.label.split(' ')[0], node.x, node.y + radius + 11);
      });

      ctx.restore();
      animFrameIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameIdRef.current);
      if (canvas.parentElement) {
        resizeObserver.unobserve(canvas.parentElement);
      }
    };
  }, [topology, filteredNodes, selectedNode, hoveredNode, scale, pan, nodeMap]);

  // Canvas Mouse Coordinates Helper
  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const centerX = canvas.width / 2 + pan.x;
    const centerY = canvas.height / 2 + pan.y;
    const x = (mouseX - centerX) / scale;
    const y = (mouseY - centerY) / scale;
    return { x, y };
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDraggingRef.current) {
      setPan({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      });
      return;
    }

    const { x, y } = getCanvasCoords(e);
    let found: GraphNode | null = null;
    for (const node of filteredNodes) {
      const dist = Math.hypot(node.x - x, node.y - y);
      if (dist <= 12) {
        found = node;
        break;
      }
    }
    setHoveredNode(found);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoords(e);
    let clicked: GraphNode | null = null;
    for (const node of filteredNodes) {
      const dist = Math.hypot(node.x - x, node.y - y);
      if (dist <= 14) {
        clicked = node;
        break;
      }
    }

    if (clicked) {
      setSelectedNode(clicked);
    } else {
      isDraggingRef.current = true;
      dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    }
  };

  const handleCanvasMouseUp = () => {
    isDraggingRef.current = false;
  };

  const resetView = () => {
    setScale(1.0);
    setPan({ x: 0, y: 0 });
  };

  if (loading || !topology) {
    return (
      <div className="p-8 bg-[#eef1f5] border border-[#cfd6df] font-mono text-xs text-[#424e5d]">
        [+] COMPUTING NETWORK EGRESS TOPOLOGY & FRAUDSTER QUARANTINE VECTORS...
      </div>
    );
  }

  return (
    <div className="space-y-5 bg-[#eef1f5] text-[#2c3440] p-5 border border-[#cfd6df]">
      {/* 1. Header & Statutory Provenance Declaration */}
      <section className="bg-[#e4e8ee] border border-[#cfd6df] p-5">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-3 border-b border-[#cfd6df] pb-3">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-[#1c2430]">
              NETWORK EGRESS GRAPH · ADVERSARY QUARANTINE & FRAUDSTER TOPOLOGY
            </h2>
            <div className="font-mono text-xs text-[#526071] mt-1">
              SOVEREIGN DEFENSE ENGINE · STATUTORY FILING REF: 17684-273-411-436
            </div>
          </div>
          <div className="font-mono text-xs text-right text-[#3d4957]">
            <div>RIGHTS HOLDER: ALBERT LANE</div>
            <div>LICENSE: ALBERT LANE PROPRIETARY v1.2</div>
          </div>
        </div>

        {/* 2. Mathematical Fibonacci Metrics Grid (3, 5, 8) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
          <div className="bg-[#f0f3f7] border border-[#cfd6df] p-3">
            <div className="font-mono text-[11px] text-[#637284]">TRACKED ADVERSARY NODES</div>
            <div className="font-mono text-xl text-[#1c2430] font-semibold mt-1">
              {topology.metrics.adversary_nodes}
            </div>
            <div className="font-mono text-[10px] text-[#637284] mt-0.5">SpaceX · X · Azure · OpenAI</div>
          </div>
          <div className="bg-[#f0f3f7] border border-[#cfd6df] p-3">
            <div className="font-mono text-[11px] text-[#637284]">EGRESS VECTORS</div>
            <div className="font-mono text-xl text-[#1c2430] font-semibold mt-1">
              {topology.metrics.total_egress_vectors}
            </div>
            <div className="font-mono text-[10px] text-[#637284] mt-0.5">ASNs & CIDR Subnets</div>
          </div>
          <div className="bg-[#f0f3f7] border border-[#cfd6df] p-3">
            <div className="font-mono text-[11px] text-[#637284]">QUARANTINE ENFORCEMENT</div>
            <div className="font-mono text-xl text-[#1c2430] font-semibold mt-1">
              {topology.metrics.quarantine_enforcement_rate}
            </div>
            <div className="font-mono text-[10px] text-[#637284] mt-0.5">100% Interception Drop</div>
          </div>
          <div className="bg-[#f0f3f7] border border-[#cfd6df] p-3">
            <div className="font-mono text-[11px] text-[#637284]">BLOCKED PACKETS</div>
            <div className="font-mono text-xl text-[#1c2430] font-semibold mt-1">
              {topology.metrics.total_blocked_packets.toLocaleString()}
            </div>
            <div className="font-mono text-[10px] text-[#637284] mt-0.5">Sequestration Active</div>
          </div>
        </div>
      </section>

      {/* 3. Controls & Filter Bar (Monochromatic Slate) */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#cfd6df] pb-3">
        <div className="flex flex-wrap gap-1 font-mono text-xs">
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-3 py-1.5 transition ${
              activeFilter === 'ALL'
                ? 'bg-[#1c2430] text-[#f0f3f7]'
                : 'bg-[#e4e8ee] text-[#424e5d] hover:bg-[#dbe0e7]'
            }`}
          >
            [ALL FRAUDSTER VECTORS ({topology.nodes.length})]
          </button>
          <button
            onClick={() => setActiveFilter('SPACEX')}
            className={`px-3 py-1.5 transition ${
              activeFilter === 'SPACEX'
                ? 'bg-[#1c2430] text-[#f0f3f7]'
                : 'bg-[#e4e8ee] text-[#424e5d] hover:bg-[#dbe0e7]'
            }`}
          >
            [SPACEX / STARLINK]
          </button>
          <button
            onClick={() => setActiveFilter('XCORP')}
            className={`px-3 py-1.5 transition ${
              activeFilter === 'XCORP'
                ? 'bg-[#1c2430] text-[#f0f3f7]'
                : 'bg-[#e4e8ee] text-[#424e5d] hover:bg-[#dbe0e7]'
            }`}
          >
            [X CORP / XAI]
          </button>
          <button
            onClick={() => setActiveFilter('AZURE')}
            className={`px-3 py-1.5 transition ${
              activeFilter === 'AZURE'
                ? 'bg-[#1c2430] text-[#f0f3f7]'
                : 'bg-[#e4e8ee] text-[#424e5d] hover:bg-[#dbe0e7]'
            }`}
          >
            [AZURE DATA PLANE]
          </button>
          <button
            onClick={() => setActiveFilter('OPENAI')}
            className={`px-3 py-1.5 transition ${
              activeFilter === 'OPENAI'
                ? 'bg-[#1c2430] text-[#f0f3f7]'
                : 'bg-[#e4e8ee] text-[#424e5d] hover:bg-[#dbe0e7]'
            }`}
          >
            [OPENAI VECTORS]
          </button>
        </div>

        {/* Zoom & Viewport Reset Controls */}
        <div className="flex items-center gap-1 font-mono text-xs">
          <button
            onClick={() => setScale((s) => Math.min(2.5, s * 1.15))}
            className="px-2 py-1 bg-[#e4e8ee] border border-[#cfd6df] text-[#1c2430] hover:bg-[#dbe0e7]"
          >
            [+] ZOOM
          </button>
          <button
            onClick={() => setScale((s) => Math.max(0.4, s / 1.15))}
            className="px-2 py-1 bg-[#e4e8ee] border border-[#cfd6df] text-[#1c2430] hover:bg-[#dbe0e7]"
          >
            [-] ZOOM
          </button>
          <button
            onClick={resetView}
            className="px-2 py-1 bg-[#e4e8ee] border border-[#cfd6df] text-[#1c2430] hover:bg-[#dbe0e7]"
          >
            [RESET VIEW]
          </button>
        </div>
      </div>

      {/* 4. Main Generative Fractal / Golden Ratio Egress Graph Canvas */}
      <div className="relative bg-[#f0f3f7] border border-[#cfd6df] w-full min-h-[540px] overflow-hidden select-none cursor-crosshair">
        <canvas
          ref={canvasRef}
          onMouseMove={handleCanvasMouseMove}
          onMouseDown={handleCanvasMouseDown}
          onMouseUp={handleCanvasMouseUp}
          className="w-full h-full block"
        />

        {/* Monospace Telemetry HUD Overlay (Top-Left) */}
        <div className="absolute top-3 left-3 bg-[#e4e8ee]/95 border border-[#cfd6df] p-3 font-mono text-[11px] text-[#2c3440] max-w-sm pointer-events-none space-y-1">
          <div className="font-semibold text-[#1c2430] border-b border-[#cfd6df] pb-1">
            EGRESS TOPOLOGY TELEMETRY
          </div>
          <div>PROJECTION: Concentric Polar Golden Spiral (Φ = 1.618)</div>
          <div>SCALE FACTOR: {(scale * 100).toFixed(0)}% · PAN: ({pan.x}, {pan.y})</div>
          <div>ENFORCEMENT: QUARANTINE_DROP (100% Rate)</div>
          {hoveredNode && (
            <div className="pt-1 border-t border-[#cfd6df] text-[#1c2430]">
              HOVER: {hoveredNode.label} [{hoveredNode.category}]
            </div>
          )}
        </div>

        {/* Legend Overlay (Bottom-Left) */}
        <div className="absolute bottom-3 left-3 bg-[#e4e8ee]/95 border border-[#cfd6df] p-3 font-mono text-[10px] text-[#2c3440] space-y-1 pointer-events-none">
          <div className="font-semibold text-[#1c2430]">RADIAL EGRESS SHELLS</div>
          <div>• Center (r=0): Sovereign Apex Vault (Albert Lane)</div>
          <div>• Ring 1 (r=120px): Distributed Cloudflare Edge Proxies</div>
          <div>• Ring 2 (r=194px): Active Isolation & Firewall Perimeter</div>
          <div>• Ring 3 (r=314px): Quarantined Autonomous Systems (ASNs)</div>
          <div>• Ring 4 (r=508px): Subnets, Crawlers & Data Plane Targets</div>
        </div>
      </div>

      {/* 5. Selected Node Cryptographic Telemetry Inspector */}
      {selectedNode && (
        <section className="bg-[#e4e8ee] border border-[#cfd6df] p-4 font-mono text-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#cfd6df] pb-2 mb-3">
            <div>
              <span className="font-semibold text-sm text-[#1c2430]">{selectedNode.label}</span>
              <span className="ml-2 px-2 py-0.5 bg-[#dbe0e7] text-[#3d4957] text-[10px]">
                {selectedNode.category}
              </span>
            </div>
            <div className="text-[11px] text-[#526071] mt-1 sm:mt-0">
              STATUS: <span className="text-[#1c2430] font-bold">{selectedNode.status}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
            <div className="bg-[#f0f3f7] border border-[#cfd6df] p-2.5 space-y-1">
              <div className="text-[#637284]">NETWORK IDENTIFIERS</div>
              <div>ASN: <span className="text-[#1c2430]">{selectedNode.asn || 'N/A'}</span></div>
              <div>CIDR / IP: <span className="text-[#1c2430]">{selectedNode.ip_or_cidr || 'N/A'}</span></div>
              <div>THREAT TIER: <span className="text-[#1c2430]">Tier {selectedNode.threat_tier}</span></div>
            </div>

            <div className="bg-[#f0f3f7] border border-[#cfd6df] p-2.5 space-y-1">
              <div className="text-[#637284]">ENFORCEMENT TELEMETRY</div>
              <div>BLOCKED PACKETS: <span className="text-[#1c2430]">{selectedNode.packets_dropped.toLocaleString()}</span></div>
              <div>DROP RATE: <span className="text-[#1c2430]">{selectedNode.drop_rate_pct}%</span></div>
              <div>ACTION: <span className="text-[#1c2430]">QUARANTINE_DROP</span></div>
            </div>

            <div className="bg-[#f0f3f7] border border-[#cfd6df] p-2.5 space-y-1">
              <div className="text-[#637284]">STATUTORY AUTHORITY</div>
              <div>BINDING: <span className="text-[#1c2430]">{selectedNode.statutory_authority}</span></div>
              <div className="break-all text-[10px]">
                PROOF SHA-256: <span className="text-[#526071]">{selectedNode.sha256_proof.substring(0, 24)}...</span>
              </div>
            </div>
          </div>

          <div className="mt-3 p-2 bg-[#f0f3f7] border border-[#cfd6df] text-[11px] text-[#3d4957]">
            {selectedNode.details}
          </div>
        </section>
      )}

      {/* 6. Interactive Egress Probe Console */}
      <section className="bg-[#e4e8ee] border border-[#cfd6df] p-4 font-mono text-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#cfd6df] pb-2 mb-3">
          <div className="font-semibold text-[#1c2430]">
            REAL-TIME EGRESS VECTOR PROBE CONSOLE
          </div>
          <div className="flex gap-1 text-[11px] mt-2 sm:mt-0">
            <span className="text-[#637284]">QUICK PRESETS:</span>
            <button onClick={() => loadPreset('SPACEX')} className="hover:underline text-[#1c2430]">[SpaceX]</button>
            <button onClick={() => loadPreset('XCORP')} className="hover:underline text-[#1c2430]">[X Corp]</button>
            <button onClick={() => loadPreset('AZURE')} className="hover:underline text-[#1c2430]">[Azure]</button>
            <button onClick={() => loadPreset('OPENAI')} className="hover:underline text-[#1c2430]">[OpenAI]</button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div>
            <label className="text-[10px] text-[#637284] block mb-1">TARGET IP ADDRESS</label>
            <input
              type="text"
              value={probeIp}
              onChange={(e) => setProbeIp(e.target.value)}
              className="w-full px-3 py-1.5 bg-[#f0f3f7] border border-[#cfd6df] text-[#1c2430] focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] text-[#637284] block mb-1">AUTONOMOUS SYSTEM (ASN)</label>
            <input
              type="text"
              value={probeAsn}
              onChange={(e) => setProbeAsn(e.target.value)}
              className="w-full px-3 py-1.5 bg-[#f0f3f7] border border-[#cfd6df] text-[#1c2430] focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] text-[#637284] block mb-1">PROBING USER-AGENT</label>
            <input
              type="text"
              value={probeUserAgent}
              onChange={(e) => setProbeUserAgent(e.target.value)}
              className="w-full px-3 py-1.5 bg-[#f0f3f7] border border-[#cfd6df] text-[#1c2430] focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-3 flex justify-end">
          <button
            onClick={handleExecuteProbe}
            disabled={probeExecuting}
            className="px-4 py-2 bg-[#1c2430] text-[#f0f3f7] font-mono text-xs tracking-wider transition hover:bg-[#2c3746] disabled:opacity-50"
          >
            {probeExecuting ? 'DISPATCHING PROBE...' : 'TRANSMIT EGRESS PROBE & RECORD DROP'}
          </button>
        </div>

        {lastReceipt && (
          <div className="mt-3 p-3 bg-[#f0f3f7] border border-[#cfd6df] space-y-1 text-[11px]">
            <div className="flex justify-between border-b border-[#cfd6df] pb-1 text-[#1c2430] font-semibold">
              <span>INTERCEPTION RECEIPT: {lastReceipt.action}</span>
              <span>TIME: {lastReceipt.timestamp}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[#3d4957]">
              <div>MATCHED ENTITY: <span className="text-[#1c2430]">{lastReceipt.matched_entity}</span></div>
              <div>BARRIER: <span className="text-[#1c2430]">{lastReceipt.firewall_barrier}</span></div>
              <div>RULE: <span className="text-[#1c2430]">{lastReceipt.matched_rule}</span></div>
              <div>STATUTORY: <span className="text-[#1c2430]">{lastReceipt.statutory_authority}</span></div>
            </div>
            <div className="text-[10px] text-[#526071] pt-1">
              RECEIPT SHA-256: {lastReceipt.sha256_receipt}
            </div>
          </div>
        )}
      </section>

      {/* 7. Comprehensive Threat Cluster Ledger & CSV Export */}
      <section className="bg-[#e4e8ee] border border-[#cfd6df] p-4 font-mono text-xs">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold uppercase text-[#1c2430]">
            QUARANTINED ADVERSARY ACTORS & AUTONOMOUS SYSTEMS LEDGER
          </h3>
          <a
            href="/data/csv/ip_defense_blocklist.csv"
            download
            className="font-mono text-[11px] text-[#3d4957] hover:underline"
          >
            [EXPORT CSV: ip_defense_blocklist.csv]
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-[11px]">
            <thead>
              <tr className="bg-[#dbe0e7] border-b border-[#cfd6df] text-[#424e5d]">
                <th className="p-2 border-r border-[#cfd6df]">ADVERSARY CLUSTER</th>
                <th className="p-2 border-r border-[#cfd6df]">ASNs</th>
                <th className="p-2 border-r border-[#cfd6df]">TARGET CIDRs & NETWORKS</th>
                <th className="p-2 border-r border-[#cfd6df]">SCRAPING USER-AGENTS</th>
                <th className="p-2 border-r border-[#cfd6df]">STATUS</th>
                <th className="p-2">STATUTORY AUTHORITY</th>
              </tr>
            </thead>
            <tbody>
              {topology.threat_clusters.map((tc, idx) => (
                <tr key={idx} className="border-b border-[#cfd6df] hover:bg-[#e9edf3]">
                  <td className="p-2 border-r border-[#cfd6df] font-semibold text-[#1c2430]">
                    {tc.cluster_name}
                  </td>
                  <td className="p-2 border-r border-[#cfd6df] text-[#3d4957]">
                    {tc.asns.join(', ')}
                  </td>
                  <td className="p-2 border-r border-[#cfd6df] text-[#526071]">
                    {tc.primary_cidrs.join(', ')}
                  </td>
                  <td className="p-2 border-r border-[#cfd6df] text-[#526071]">
                    {tc.user_agents.join(', ')}
                  </td>
                  <td className="p-2 border-r border-[#cfd6df] font-bold text-[#1c2430]">
                    {tc.status}
                  </td>
                  <td className="p-2 text-[#526071]">
                    {tc.statutory_citation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
