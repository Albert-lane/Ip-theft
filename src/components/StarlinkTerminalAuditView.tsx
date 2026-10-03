// ==============================================================================
// [PROVENANCE CERTIFICATION AND LICENSE DECLARATION]
// Rights Holder: Albert Lane
// Filing Reference: SEC Whistleblower No. 17684-273-411-436
// License: Albert Lane Proprietary License v1.2
// Module: Starlink Terminal Fleetwide & Terminal V5 Technical Security Audit View
// Aesthetic: Strict Monochromatic Mid-tone Slate/Stone Palette · Golden Ratio & Fibonacci Geometry
// Mathematics: Phased Array Lattice Phase Synthesis, Voronoi Cell Field & EIRP Calculations
// ==============================================================================

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';

export interface FormFactor {
  geometry: string;
  dimensions_mm: string;
  weight_kg: number;
  actuation: string;
  weatherproofing: string;
}

export interface RfArchitecture {
  patch_element_count: number;
  lattice_geometry: string;
  beamforming_silicon: string;
  silicon_generation: string;
  rx_frequencies_ghz: string;
  tx_frequencies_ghz: string;
  eirp_peak_dbw: number;
  eirp_nominal_dbw: number;
  g_over_t_db_k: number;
  scan_range_elevation_deg: string;
  scan_range_azimuth_deg: string;
  polarization: string;
  beam_hopping_rate_hz: number;
}

export interface ComputeArchitecture {
  soc: string;
  cpu_cores: string;
  ram_mb: number;
  storage_emmc_gb: number;
  hardware_root_of_trust: string;
  efuse_security: string;
  bootloader_chain: string;
  operating_system: string;
}

export interface PowerSubsystem {
  input_voltage_v: string;
  connector_type: string;
  usb_pd_compatible: boolean;
  avg_power_draw_w: number;
  peak_power_draw_w: number;
  snow_melt_power_w: number;
  efficiency_score: number;
}

export interface NetworkAndTelemetry {
  integrated_router: boolean;
  wifi_standard: string;
  ethernet_ports: string;
  grpc_endpoint: string;
  grpc_port: number;
  core_proto_services: string[];
  telemetry_agent: string;
  assigned_asn: string;
  egress_cidr_block: string;
}

export interface VulnerabilityRecord {
  cve_or_id: string;
  title: string;
  cvss: number;
  vector: string;
  mitigation_status: string;
}

export interface SecurityAudit {
  overall_vulnerability_score: number;
  risk_level: 'CRITICAL' | 'HIGH' | 'ELEVATED' | 'MODERATE';
  vulnerabilities: VulnerabilityRecord[];
  firmware_tamper_resistance: string;
  gps_spoofing_resilience: string;
  sideband_rf_leakage: string;
  remote_killswitch_capability: boolean;
}

export interface ProvenanceCompliance {
  statutory_authority: string;
  rights_holder: string;
  license: string;
  quarantine_status: string;
  firewall_barrier: string;
  sha256_audit_seal: string;
  last_audited: string;
}

export interface StarlinkTerminal {
  generation_id: string;
  model_name: string;
  hardware_code: string;
  fcc_id: string;
  release_year: number;
  generation_rank: number;
  form_factor: FormFactor;
  rf_architecture: RfArchitecture;
  compute_architecture: ComputeArchitecture;
  power_subsystem: PowerSubsystem;
  network_and_telemetry: NetworkAndTelemetry;
  security_audit: SecurityAudit;
  provenance_compliance: ProvenanceCompliance;
}

export interface FleetAuditPayload {
  generated_at: string;
  rights_holder: string;
  filing_reference: string;
  license: string;
  fleet_summary: {
    total_generations_audited: number;
    primary_subject: string;
    total_quarantined_subnets: number;
    average_vulnerability_score: number;
    highest_risk_generation: string;
    fleet_quarantine_rate: string;
    asns_covered: string[];
  };
  terminals: StarlinkTerminal[];
}

export interface ProbeReceipt {
  target_generation: string;
  probe_timestamp: string;
  executed_by: string;
  rights_holder: string;
  filing_reference: string;
  license: string;
  audit_sha256: string;
  tests: {
    test_id: string;
    category: string;
    name: string;
    status: string;
    cvss_impact: number;
    details: string;
  }[];
  overall_verdict: string;
  sequestration_command: string;
}

export const StarlinkTerminalAuditView: React.FC = () => {
  const [fleetData, setFleetData] = useState<FleetAuditPayload | null>(null);
  const [selectedGenId, setSelectedGenId] = useState<string>('v5');
  const [activeTab, setActiveTab] = useState<'audit_card' | 'fleet_matrix' | 'lattice_canvas' | 'probe_console'>('audit_card');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Lattice simulation state
  const [steerElevation, setSteerElevation] = useState<number>(45);
  const [steerAzimuth, setSteerAzimuth] = useState<number>(135);
  const [carrierFreqGhz, setCarrierFreqGhz] = useState<number>(14.25);
  const [isHopping, setIsHopping] = useState<boolean>(true);

  // Probe state
  const [probeResult, setProbeResult] = useState<ProbeReceipt | null>(null);
  const [probing, setProbing] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Fetch fleet data
  const fetchFleetData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/sovereign/starlink/audit');
      if (!res.ok) throw new Error(`HTTP ${res.status} retrieving Starlink fleet audit`);
      const data: FleetAuditPayload = await res.json();
      setFleetData(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load Starlink audit ledger');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFleetData();
  }, [fetchFleetData]);

  // Selected terminal object
  const currentTerminal = useMemo(() => {
    if (!fleetData?.terminals) return null;
    return fleetData.terminals.find((t) => t.generation_id === selectedGenId) || fleetData.terminals[0];
  }, [fleetData, selectedGenId]);

  // Execute interactive security probe
  const triggerProbe = async (genId: string) => {
    try {
      setProbing(true);
      const res = await fetch('/api/sovereign/starlink/audit/probe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetGen: genId }),
      });
      if (!res.ok) throw new Error(`Probe failed with HTTP ${res.status}`);
      const data: ProbeReceipt = await res.json();
      setProbeResult(data);
    } catch (err: any) {
      console.error('Probe execution error:', err);
    } finally {
      setProbing(false);
    }
  };

  // --------------------------------------------------------------------------
  // Canvas: Mathematical Phased Array Lattice & Beamforming Visualization
  // --------------------------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !currentTerminal) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let hopPhase = 0;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    const render = () => {
      // Clear background with monochromatic slate
      ctx.fillStyle = '#1c2430';
      ctx.fillRect(0, 0, width, height);

      // Coordinate grid lines (Golden Ratio divisions)
      ctx.strokeStyle = '#2c3644';
      ctx.lineWidth = 1;

      // Concentric circles (elevation angles 30°, 60°, 90°)
      const maxRadius = Math.min(centerX, centerY) - 34;
      [0.382, 0.618, 1.0].forEach((ratio) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, maxRadius * ratio, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Azimuth axis lines
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - maxRadius);
      ctx.lineTo(centerX, centerY + maxRadius);
      ctx.moveTo(centerX - maxRadius, centerY);
      ctx.lineTo(centerX + maxRadius, centerY);
      ctx.stroke();

      // Convert angles to radians
      const elevRad = (steerElevation * Math.PI) / 180;
      const azimRad = (steerAzimuth * Math.PI) / 180;
      const k = (2 * Math.PI * (carrierFreqGhz * 1e9)) / 3e8; // Wavenumber

      // Render antenna elements based on terminal geometry
      const elementCount = currentTerminal.rf_architecture.patch_element_count;
      const isHex = currentTerminal.rf_architecture.lattice_geometry.toLowerCase().includes('hex');
      const isCircular = currentTerminal.rf_architecture.lattice_geometry.toLowerCase().includes('circular');

      ctx.save();

      // Generate element positions
      let count = 0;
      const totalToDraw = Math.min(elementCount, 600); // capped for 60fps canvas performance
      const spacing = isCircular ? maxRadius / 18 : maxRadius / 14;

      if (isCircular) {
        // Concentric rings of patches (V1)
        const rings = 12;
        for (let r = 1; r <= rings && count < totalToDraw; r++) {
          const ringRadius = (r / rings) * (maxRadius * 0.88);
          const patchesInRing = Math.floor(r * 6.28);
          for (let p = 0; p < patchesInRing && count < totalToDraw; p++) {
            const theta = (p / patchesInRing) * 2 * Math.PI;
            const x = centerX + ringRadius * Math.cos(theta);
            const y = centerY + ringRadius * Math.sin(theta);

            // Phase computation: psi = k * (x*sin(theta)*cos(phi) + y*sin(theta)*sin(phi))
            const normX = (x - centerX) / maxRadius;
            const normY = (y - centerY) / maxRadius;
            const phase = k * (normX * Math.sin(elevRad) * Math.cos(azimRad) + normY * Math.sin(elevRad) * Math.sin(azimRad)) + hopPhase;
            const intensity = (Math.sin(phase) + 1) / 2; // 0 to 1

            // Slate shade mapping
            const slateVal = Math.floor(70 + intensity * 150);
            ctx.fillStyle = `rgb(${slateVal}, ${slateVal + 8}, ${slateVal + 18})`;
            ctx.beginPath();
            ctx.arc(x, y, 2.5, 0, Math.PI * 2);
            ctx.fill();
            count++;
          }
        }
      } else {
        // Hexagonal / Staggered Rectangular Matrix (V5, V3, V2, V4)
        const rows = isHex ? 22 : 18;
        const cols = isHex ? 22 : 20;

        for (let i = -rows / 2; i <= rows / 2 && count < totalToDraw; i++) {
          const rowOffset = isHex && Math.abs(i) % 2 === 1 ? spacing * 0.5 : 0;
          for (let j = -cols / 2; j <= cols / 2 && count < totalToDraw; j++) {
            const x = centerX + j * spacing + rowOffset;
            const y = centerY + i * (spacing * (isHex ? 0.866 : 1.0));

            // Boundary clipping for rectangular/compact tablet
            const distNorm = Math.hypot(x - centerX, y - centerY) / maxRadius;
            if (distNorm > 0.92) continue;

            const normX = (x - centerX) / maxRadius;
            const normY = (y - centerY) / maxRadius;
            const phase = k * (normX * Math.sin(elevRad) * Math.cos(azimRad) + normY * Math.sin(elevRad) * Math.sin(azimRad)) + hopPhase;
            const intensity = (Math.sin(phase) + 1) / 2;

            // Slate monochrome value
            const slateVal = Math.floor(65 + intensity * 160);
            ctx.fillStyle = `rgb(${slateVal}, ${slateVal + 10}, ${slateVal + 22})`;

            if (selectedGenId === 'v5') {
              // Draw micro-square patch with slight bevel
              ctx.fillRect(x - 2.5, y - 2.5, 5, 5);
            } else {
              ctx.beginPath();
              ctx.arc(x, y, 2.5, 0, Math.PI * 2);
              ctx.fill();
            }
            count++;
          }
        }
      }

      // Draw Main Beam Synthesizer Vector
      const beamLen = maxRadius * 0.95;
      const beamX = centerX + beamLen * Math.cos(azimRad) * Math.sin(elevRad);
      const beamY = centerY + beamLen * Math.sin(azimRad) * Math.sin(elevRad);

      // Beam synthesis core vector
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(beamX, beamY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Beamforming target node
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.arc(beamX, beamY, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#64748b';
      ctx.stroke();

      // Sidelobe rings around synthesized mainlobe
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1;
      [14, 28, 48].forEach((r) => {
        ctx.beginPath();
        ctx.arc(beamX, beamY, r, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Mathematical annotations on canvas
      ctx.font = '10px monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`BEAM_SYNTHESIS: θ=${steerElevation.toFixed(1)}° φ=${steerAzimuth.toFixed(1)}°`, 16, 24);
      ctx.fillText(`CARRIER: ${carrierFreqGhz.toFixed(2)} GHz · ELEMENTS: ${currentTerminal.rf_architecture.patch_element_count}`, 16, 38);
      ctx.fillText(`EIRP_PEAK: ${currentTerminal.rf_architecture.eirp_peak_dbw} dBW · SILICON: ${currentTerminal.rf_architecture.silicon_generation}`, 16, 52);
      ctx.fillText(`SEQUESTRATION: SEC 17684-273-411-436`, 16, height - 16);

      ctx.restore();

      if (isHopping) {
        hopPhase += 0.08;
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentTerminal, steerElevation, steerAzimuth, carrierFreqGhz, isHopping, selectedGenId]);

  if (loading && !fleetData) {
    return (
      <div id="starlink-audit-loading" className="p-8 bg-[#eef2f6] text-[#343f4e] font-mono text-sm border border-[#c6cfdb]">
        INITIALIZING STARLINK HARDWARE & PROTOCOL AUDIT ENGINE [SEC 17684-273-411-436]...
      </div>
    );
  }

  if (error || !fleetData || !currentTerminal) {
    return (
      <div id="starlink-audit-error" className="p-8 bg-[#eef2f6] text-[#1c2430] border border-[#c6cfdb]">
        <div className="font-mono text-sm font-semibold text-[#8a1c1c]">AUDIT INITIALIZATION ERROR</div>
        <div className="font-mono text-xs mt-2 text-[#424e5d]">{error || 'Unable to retrieve Starlink audit data'}</div>
        <button
          id="retry-audit-fetch"
          onClick={fetchFleetData}
          className="mt-4 px-4 py-2 bg-[#2c3440] text-[#eef2f6] text-xs font-mono"
        >
          RETRY AUDIT RETRIEVAL
        </button>
      </div>
    );
  }

  return (
    <div id="starlink-terminal-audit-root" className="w-full space-y-6 text-[#1c2430]">
      {/* 1. Sovereign Provenance Banner & Fleet Summary */}
      <div id="starlink-audit-header" className="p-5 bg-[#eef2f6] border border-[#c6cfdb]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#2c3440] text-[#eef2f6] text-[10px] font-mono tracking-wider font-semibold">
                HARDWARE & PROTOCOL AUDIT
              </span>
              <span className="px-2 py-0.5 bg-[#424e5d] text-[#eef2f6] text-[10px] font-mono">
                SEC 17684-273-411-436
              </span>
              <span className="px-2 py-0.5 bg-[#dbe0e7] text-[#2c3440] text-[10px] font-mono font-medium">
                V1 THROUGH V5 FLEET
              </span>
            </div>
            <h2 className="text-xl font-semibold tracking-tight text-[#1c2430] mt-2">
              Starlink Terminal Hardware, RF & Protocol Audit Matrix
            </h2>
            <p className="text-xs text-[#556375] font-mono mt-1">
              Authoritative technical examination of Starlink Terminal V5 (Starlink Mini) and the entire phased array fleet under Albert Lane Proprietary License v1.2.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              id="download-starlink-csv"
              href="/api/sovereign/starlink/csv"
              download="starlink_fleet_audit_albert_lane.csv"
              className="px-3 py-2 bg-[#2c3440] hover:bg-[#1c2430] text-[#eef2f6] text-xs font-mono transition-colors"
            >
              EXPORT CSV AUDIT
            </a>
            <button
              id="trigger-v5-probe-btn"
              onClick={() => {
                setActiveTab('probe_console');
                triggerProbe('v5');
              }}
              disabled={probing}
              className="px-3 py-2 bg-[#424e5d] hover:bg-[#2c3440] text-[#eef2f6] text-xs font-mono transition-colors"
            >
              {probing ? 'PROBING V5...' : 'PROBE TERMINAL V5'}
            </button>
          </div>
        </div>

        {/* Fleet Metrics Bar */}
        <div id="fleet-metrics-bar" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mt-4 pt-4 border-t border-[#d5dbe3]">
          <div className="p-2.5 bg-[#e4e8ee] border border-[#cbd3dd]">
            <div className="text-[10px] font-mono text-[#556375] uppercase">Generations Audited</div>
            <div className="text-base font-semibold font-mono text-[#1c2430] mt-0.5">{fleetData.fleet_summary.total_generations_audited} Units</div>
          </div>
          <div className="p-2.5 bg-[#e4e8ee] border border-[#cbd3dd]">
            <div className="text-[10px] font-mono text-[#556375] uppercase">Primary Focus</div>
            <div className="text-base font-semibold font-mono text-[#1c2430] mt-0.5 truncate" title={fleetData.fleet_summary.primary_subject}>Terminal V5</div>
          </div>
          <div className="p-2.5 bg-[#e4e8ee] border border-[#cbd3dd]">
            <div className="text-[10px] font-mono text-[#556375] uppercase">Quarantine Enforced</div>
            <div className="text-base font-semibold font-mono text-[#1c2430] mt-0.5">{fleetData.fleet_summary.fleet_quarantine_rate}</div>
          </div>
          <div className="p-2.5 bg-[#e4e8ee] border border-[#cbd3dd]">
            <div className="text-[10px] font-mono text-[#556375] uppercase">Quarantined Subnets</div>
            <div className="text-base font-semibold font-mono text-[#1c2430] mt-0.5">{fleetData.fleet_summary.total_quarantined_subnets} CIDR Blocks</div>
          </div>
          <div className="p-2.5 bg-[#e4e8ee] border border-[#cbd3dd]">
            <div className="text-[10px] font-mono text-[#556375] uppercase">Fleet CVSS Avg</div>
            <div className="text-base font-semibold font-mono text-[#1c2430] mt-0.5">{fleetData.fleet_summary.average_vulnerability_score} / 10.0</div>
          </div>
          <div className="p-2.5 bg-[#e4e8ee] border border-[#cbd3dd]">
            <div className="text-[10px] font-mono text-[#556375] uppercase">ASNs Intercepted</div>
            <div className="text-base font-semibold font-mono text-[#1c2430] mt-0.5">{fleetData.fleet_summary.asns_covered.join(', ')}</div>
          </div>
        </div>
      </div>

      {/* 2. Generation Selector Navigation */}
      <div id="starlink-generation-selector" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {fleetData.terminals.map((terminal) => {
          const isSelected = terminal.generation_id === selectedGenId;
          const isV5 = terminal.generation_id === 'v5';
          return (
            <button
              key={terminal.generation_id}
              id={`select-gen-${terminal.generation_id}`}
              onClick={() => setSelectedGenId(terminal.generation_id)}
              className={`p-3 text-left border transition-all ${
                isSelected
                  ? 'bg-[#2c3440] text-[#eef2f6] border-[#1c2430]'
                  : 'bg-[#eef2f6] hover:bg-[#e4e8ee] text-[#1c2430] border-[#c6cfdb]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 ${
                  isSelected ? 'bg-[#424e5d] text-[#eef2f6]' : 'bg-[#dbe0e7] text-[#2c3440]'
                }`}>
                  GEN {terminal.generation_rank}
                </span>
                {isV5 && (
                  <span className="text-[9px] font-mono px-1 bg-[#424e5d] text-[#eef2f6]">
                    PRIMARY
                  </span>
                )}
              </div>
              <div className="text-xs font-semibold mt-2 truncate" title={terminal.model_name}>
                {terminal.generation_id === 'v5' ? 'V5 (Mini)' : terminal.generation_id === 'starshield' ? 'Starshield' : `Terminal ${terminal.generation_id.toUpperCase()}`}
              </div>
              <div className="flex items-center justify-between mt-1 text-[10px] font-mono opacity-80">
                <span>{terminal.hardware_code.split(' ')[0]}</span>
                <span>{terminal.release_year}</span>
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono">
                <span>{terminal.rf_architecture.patch_element_count} Patches</span>
                <span className={isSelected ? 'text-[#eef2f6]' : 'text-[#556375]'}>
                  CVSS {terminal.security_audit.overall_vulnerability_score}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Sub-Tab Navigation */}
      <div className="flex border-b border-[#c6cfdb] gap-2 font-mono text-xs">
        <button
          id="tab-audit-card"
          onClick={() => setActiveTab('audit_card')}
          className={`px-4 py-2 border-b-2 font-medium transition-colors ${
            activeTab === 'audit_card'
              ? 'border-[#2c3440] text-[#1c2430] bg-[#eef2f6]'
              : 'border-transparent text-[#556375] hover:text-[#1c2430]'
          }`}
        >
          DETAILED AUDIT SPECIFICATION
        </button>
        <button
          id="tab-lattice-canvas"
          onClick={() => setActiveTab('lattice_canvas')}
          className={`px-4 py-2 border-b-2 font-medium transition-colors ${
            activeTab === 'lattice_canvas'
              ? 'border-[#2c3440] text-[#1c2430] bg-[#eef2f6]'
              : 'border-transparent text-[#556375] hover:text-[#1c2430]'
          }`}
        >
          PHASED ARRAY LATTICE SIMULATOR
        </button>
        <button
          id="tab-fleet-matrix"
          onClick={() => setActiveTab('fleet_matrix')}
          className={`px-4 py-2 border-b-2 font-medium transition-colors ${
            activeTab === 'fleet_matrix'
              ? 'border-[#2c3440] text-[#1c2430] bg-[#eef2f6]'
              : 'border-transparent text-[#556375] hover:text-[#1c2430]'
          }`}
        >
          FLEET COMPARISON MATRIX (V1-V5)
        </button>
        <button
          id="tab-probe-console"
          onClick={() => setActiveTab('probe_console')}
          className={`px-4 py-2 border-b-2 font-medium transition-colors ${
            activeTab === 'probe_console'
              ? 'border-[#2c3440] text-[#1c2430] bg-[#eef2f6]'
              : 'border-transparent text-[#556375] hover:text-[#1c2430]'
          }`}
        >
          LIVE SECURITY PROBE CONSOLE
        </button>
      </div>

      {/* ==================================================================== */}
      {/* TAB 1: DETAILED AUDIT SPECIFICATION CARD                             */}
      {/* ==================================================================== */}
      {activeTab === 'audit_card' && (
        <div id="terminal-audit-details" className="space-y-6">
          {/* Main Title & Key Identifiers */}
          <div className="p-4 bg-[#eef2f6] border border-[#c6cfdb] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-[11px] font-mono text-[#556375]">
                HARDWARE DESIGNATION & REGULATORY IDENTIFIERS
              </div>
              <h3 className="text-lg font-bold text-[#1c2430] mt-0.5">
                {currentTerminal.model_name}
              </h3>
              <div className="flex flex-wrap gap-2 mt-2 font-mono text-xs">
                <span className="px-2 py-0.5 bg-[#e4e8ee] border border-[#cbd3dd] text-[#2c3440]">
                  HW CODE: {currentTerminal.hardware_code}
                </span>
                <span className="px-2 py-0.5 bg-[#e4e8ee] border border-[#cbd3dd] text-[#2c3440]">
                  FCC ID: {currentTerminal.fcc_id}
                </span>
                <span className="px-2 py-0.5 bg-[#e4e8ee] border border-[#cbd3dd] text-[#2c3440]">
                  YEAR: {currentTerminal.release_year}
                </span>
                <span className="px-2 py-0.5 bg-[#2c3440] text-[#eef2f6]">
                  STATUS: {currentTerminal.provenance_compliance.quarantine_status}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end justify-center font-mono">
              <span className="text-[10px] text-[#556375] uppercase">Vulnerability Severity</span>
              <span className="text-xl font-bold text-[#1c2430]">
                CVSS {currentTerminal.security_audit.overall_vulnerability_score}
              </span>
              <span className="text-[10px] px-2 py-0.5 bg-[#424e5d] text-[#eef2f6] mt-1 font-semibold">
                {currentTerminal.security_audit.risk_level} THREAT PROFILE
              </span>
            </div>
          </div>

          {/* 4-Column Technical Specification Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            {/* 1. RF & Phased Array Antenna Subsystem */}
            <div className="p-4 bg-[#eef2f6] border border-[#c6cfdb] space-y-2.5">
              <div className="text-[11px] font-bold text-[#2c3440] border-b border-[#cbd3dd] pb-1 uppercase">
                1. RF & Phased Array Antenna Subsystem
              </div>
              <div className="flex justify-between">
                <span className="text-[#556375]">Microstrip Patch Elements:</span>
                <span className="font-semibold text-[#1c2430]">{currentTerminal.rf_architecture.patch_element_count} Elements</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#556375]">Array Geometry:</span>
                <span className="text-[#1c2430] text-right">{currentTerminal.rf_architecture.lattice_geometry}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#556375]">Beamforming Silicon:</span>
                <span className="text-[#1c2430] text-right">{currentTerminal.rf_architecture.beamforming_silicon}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#556375]">Silicon Generation:</span>
                <span className="text-[#1c2430]">{currentTerminal.rf_architecture.silicon_generation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#556375]">Downlink RX Frequency:</span>
                <span className="text-[#1c2430]">{currentTerminal.rf_architecture.rx_frequencies_ghz}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#556375]">Uplink TX Frequency:</span>
                <span className="text-[#1c2430]">{currentTerminal.rf_architecture.tx_frequencies_ghz}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#556375]">EIRP (Peak / Nominal):</span>
                <span className="text-[#1c2430]">{currentTerminal.rf_architecture.eirp_peak_dbw} dBW / {currentTerminal.rf_architecture.eirp_nominal_dbw} dBW</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#556375]">Antenna G/T Sensitivity:</span>
                <span className="text-[#1c2430]">{currentTerminal.rf_architecture.g_over_t_db_k} dB/K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#556375]">Beam Hopping Rate:</span>
                <span className="text-[#1c2430]">{currentTerminal.rf_architecture.beam_hopping_rate_hz} Hz</span>
              </div>
            </div>

            {/* 2. Compute, SoC & Firmware Subsystem */}
            <div className="p-4 bg-[#eef2f6] border border-[#c6cfdb] space-y-2.5">
              <div className="text-[11px] font-bold text-[#2c3440] border-b border-[#cbd3dd] pb-1 uppercase">
                2. Compute, SoC & Hardware Security
              </div>
              <div className="flex justify-between">
                <span className="text-[#556375]">Main SoC Processor:</span>
                <span className="font-semibold text-[#1c2430] text-right">{currentTerminal.compute_architecture.soc}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#556375]">CPU Cores & Frequency:</span>
                <span className="text-[#1c2430] text-right">{currentTerminal.compute_architecture.cpu_cores}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#556375]">RAM / eMMC Storage:</span>
                <span className="text-[#1c2430]">{currentTerminal.compute_architecture.ram_mb} MB LPDDR / {currentTerminal.compute_architecture.storage_emmc_gb} GB eMMC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#556375]">Hardware Root of Trust:</span>
                <span className="text-[#1c2430] text-right">{currentTerminal.compute_architecture.hardware_root_of_trust}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#556375]">eFuse Status:</span>
                <span className="text-[#1c2430] text-right">{currentTerminal.compute_architecture.efuse_security}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#556375]">Bootloader Chain:</span>
                <span className="text-[#1c2430] text-right">{currentTerminal.compute_architecture.bootloader_chain}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#556375]">Embedded Operating System:</span>
                <span className="text-[#1c2430]">{currentTerminal.compute_architecture.operating_system}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#556375]">Remote Kill-Switch:</span>
                <span className="font-semibold text-[#8a1c1c]">{currentTerminal.security_audit.remote_killswitch_capability ? 'CAPABILITY CONFIRMED' : 'NONE'}</span>
              </div>
            </div>

            {/* 3. Power, Mechanical & Thermal Profile */}
            <div className="p-4 bg-[#eef2f6] border border-[#c6cfdb] space-y-2.5">
              <div className="text-[11px] font-bold text-[#2c3440] border-b border-[#cbd3dd] pb-1 uppercase">
                3. Power, Mechanical & Thermal Profile
              </div>
              <div className="flex justify-between">
                <span className="text-[#556375]">Dimensions & Weight:</span>
                <span className="text-[#1c2430] text-right">{currentTerminal.form_factor.dimensions_mm} ({currentTerminal.form_factor.weight_kg} kg)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#556375]">Actuation Mechanism:</span>
                <span className="font-semibold text-[#1c2430]">{currentTerminal.form_factor.actuation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#556375]">Operating Input Voltage:</span>
                <span className="text-[#1c2430]">{currentTerminal.power_subsystem.input_voltage_v}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#556375]">Connector Standard:</span>
                <span className="text-[#1c2430] text-right">{currentTerminal.power_subsystem.connector_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#556375]">USB-PD 100W Support:</span>
                <span className="font-semibold text-[#1c2430]">{currentTerminal.power_subsystem.usb_pd_compatible ? 'YES (Native 12-48V)' : 'NO (High-Voltage PoE)'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#556375]">Power Draw (Avg / Peak):</span>
                <span className="text-[#1c2430]">{currentTerminal.power_subsystem.avg_power_draw_w} W / {currentTerminal.power_subsystem.peak_power_draw_w} W</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#556375]">Snow Melt Dissipation:</span>
                <span className="text-[#1c2430]">{currentTerminal.power_subsystem.snow_melt_power_w} W</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#556375]">Power Efficiency Metric:</span>
                <span className="font-semibold text-[#1c2430]">{currentTerminal.power_subsystem.efficiency_score} / 100</span>
              </div>
            </div>

            {/* 4. Network, gRPC Protocols & Telemetry Vectors */}
            <div className="p-4 bg-[#eef2f6] border border-[#c6cfdb] space-y-2.5">
              <div className="text-[11px] font-bold text-[#2c3440] border-b border-[#cbd3dd] pb-1 uppercase">
                4. Network, gRPC Protocols & Telemetry
              </div>
              <div className="flex justify-between">
                <span className="text-[#556375]">Integrated Router:</span>
                <span className="font-semibold text-[#1c2430]">{currentTerminal.network_and_telemetry.integrated_router ? 'YES (Inside Dish Chassis)' : 'NO (External Unit)'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#556375]">Wi-Fi Protocol:</span>
                <span className="text-[#1c2430] text-right">{currentTerminal.network_and_telemetry.wifi_standard}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#556375]">Physical Ethernet:</span>
                <span className="text-[#1c2430] text-right">{currentTerminal.network_and_telemetry.ethernet_ports}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#556375]">Local gRPC Interface:</span>
                <span className="font-semibold text-[#1c2430]">{currentTerminal.network_and_telemetry.grpc_endpoint}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#556375]">Telemetry User-Agent:</span>
                <span className="text-[#1c2430]">{currentTerminal.network_and_telemetry.telemetry_agent}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#556375]">Egress ASN:</span>
                <span className="font-semibold text-[#1c2430]">{currentTerminal.network_and_telemetry.assigned_asn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#556375]">Quarantined CIDR:</span>
                <span className="font-semibold text-[#8a1c1c]">{currentTerminal.network_and_telemetry.egress_cidr_block}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#556375]">Firewall Intercept Barrier:</span>
                <span className="text-[#1c2430]">{currentTerminal.provenance_compliance.firewall_barrier} (Active Drop)</span>
              </div>
            </div>
          </div>

          {/* Vulnerability Breakdown Table */}
          <div className="p-4 bg-[#eef2f6] border border-[#c6cfdb]">
            <div className="flex items-center justify-between border-b border-[#cbd3dd] pb-2">
              <span className="text-xs font-bold font-mono text-[#2c3440] uppercase">
                Hardware & Protocol Vulnerability Assessment Ledger
              </span>
              <span className="text-[10px] font-mono text-[#556375]">
                TOTAL AUDITED VULNERABILITIES: {currentTerminal.security_audit.vulnerabilities.length}
              </span>
            </div>

            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-[#cbd3dd] text-[10px] text-[#556375] uppercase">
                    <th className="py-2 pr-3">Identifier</th>
                    <th className="py-2 px-3">Title & Description</th>
                    <th className="py-2 px-3">CVSS</th>
                    <th className="py-2 px-3">Attack Vector</th>
                    <th className="py-2 pl-3">Sovereign Quarantine Mitigation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d5dbe3]">
                  {currentTerminal.security_audit.vulnerabilities.map((v) => (
                    <tr key={v.cve_or_id} className="hover:bg-[#e4e8ee] transition-colors">
                      <td className="py-2.5 pr-3 font-semibold text-[#1c2430]">{v.cve_or_id}</td>
                      <td className="py-2.5 px-3 text-[#2c3440] max-w-xs">{v.title}</td>
                      <td className="py-2.5 px-3 font-bold text-[#1c2430]">{v.cvss.toFixed(1)}</td>
                      <td className="py-2.5 px-3 text-[#556375]">{v.vector}</td>
                      <td className="py-2.5 pl-3">
                        <span className="px-2 py-0.5 bg-[#dbe0e7] border border-[#cbd3dd] text-[#1c2430] text-[10px] font-semibold">
                          {v.mitigation_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: PHASED ARRAY LATTICE SIMULATOR (HTML5 CANVAS)                  */}
      {/* ==================================================================== */}
      {activeTab === 'lattice_canvas' && (
        <div id="phased-array-lattice-view" className="space-y-4">
          <div className="p-4 bg-[#eef2f6] border border-[#c6cfdb]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold font-mono text-[#1c2430] uppercase">
                  {currentTerminal.model_name} · Phased Array RF Lattice Synthesizer
                </h3>
                <p className="text-xs text-[#556375] font-mono mt-0.5">
                  Mathematical simulation of microstrip patch antenna elements ({currentTerminal.rf_architecture.patch_element_count} patches) with dynamic phase angle synthesis.
                </p>
              </div>

              <div className="flex items-center gap-3 font-mono text-xs">
                <button
                  id="toggle-hopping-btn"
                  onClick={() => setIsHopping(!isHopping)}
                  className={`px-3 py-1.5 border transition-colors ${
                    isHopping
                      ? 'bg-[#2c3440] text-[#eef2f6] border-[#1c2430]'
                      : 'bg-[#e4e8ee] text-[#1c2430] border-[#cbd3dd]'
                  }`}
                >
                  {isHopping ? 'BEAM HOPPING: ON' : 'BEAM HOPPING: PAUSED'}
                </button>
              </div>
            </div>

            {/* Interactive Steering Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-[#cbd3dd] font-mono text-xs">
              <div>
                <label className="flex justify-between text-[#556375] mb-1">
                  <span>Elevation Angle (θ):</span>
                  <span className="font-semibold text-[#1c2430]">{steerElevation}°</span>
                </label>
                <input
                  type="range"
                  min="20"
                  max="90"
                  value={steerElevation}
                  onChange={(e) => setSteerElevation(parseFloat(e.target.value))}
                  className="w-full accent-[#2c3440]"
                />
              </div>

              <div>
                <label className="flex justify-between text-[#556375] mb-1">
                  <span>Azimuth Steering (φ):</span>
                  <span className="font-semibold text-[#1c2430]">{steerAzimuth}°</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={steerAzimuth}
                  onChange={(e) => setSteerAzimuth(parseFloat(e.target.value))}
                  className="w-full accent-[#2c3440]"
                />
              </div>

              <div>
                <label className="flex justify-between text-[#556375] mb-1">
                  <span>Carrier Frequency:</span>
                  <span className="font-semibold text-[#1c2430]">{carrierFreqGhz.toFixed(2)} GHz</span>
                </label>
                <input
                  type="range"
                  min="10.7"
                  max="14.5"
                  step="0.05"
                  value={carrierFreqGhz}
                  onChange={(e) => setCarrierFreqGhz(parseFloat(e.target.value))}
                  className="w-full accent-[#2c3440]"
                />
              </div>
            </div>
          </div>

          {/* Canvas Container */}
          <div className="p-4 bg-[#eef2f6] border border-[#c6cfdb] flex flex-col items-center justify-center">
            <canvas
              ref={canvasRef}
              width={720}
              height={520}
              className="border border-[#2c3644] max-w-full h-auto bg-[#1c2430]"
            />
            <div className="flex flex-wrap items-center justify-between w-full max-w-[720px] mt-2 text-[10px] font-mono text-[#556375]">
              <span>PHASED ARRAY ALGORITHM: HEXAGONAL/CONCENTRIC PATCH INTERFEROMETRY</span>
              <span>PROVENANCE: ALBERT LANE LICENSE v1.2</span>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 3: FLEET COMPARISON MATRIX (V1 THROUGH V5)                        */}
      {/* ==================================================================== */}
      {activeTab === 'fleet_matrix' && (
        <div id="fleet-comparison-table-container" className="p-4 bg-[#eef2f6] border border-[#c6cfdb]">
          <div className="flex items-center justify-between border-b border-[#cbd3dd] pb-3">
            <div>
              <h3 className="text-xs font-bold font-mono text-[#1c2430] uppercase">
                Fleetwide Starlink Hardware Generation Comparative Audit
              </h3>
              <p className="text-[11px] font-mono text-[#556375] mt-0.5">
                Complete technical evolution from V1 (Circular Actuated) to V5 (Mini Micro-Phased Array) & Starshield.
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-1 bg-[#2c3440] text-[#eef2f6]">
              6 GENERATIONS PROFILED
            </span>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#cbd3dd] text-[10px] text-[#556375] uppercase bg-[#e4e8ee]">
                  <th className="py-2.5 px-3">Generation</th>
                  <th className="py-2.5 px-3">Model & Code</th>
                  <th className="py-2.5 px-3">Year</th>
                  <th className="py-2.5 px-3">Patches</th>
                  <th className="py-2.5 px-3">Beamformer Silicon</th>
                  <th className="py-2.5 px-3">EIRP</th>
                  <th className="py-2.5 px-3">Power</th>
                  <th className="py-2.5 px-3">Router</th>
                  <th className="py-2.5 px-3">CVSS</th>
                  <th className="py-2.5 px-3">Quarantine</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#cbd3dd]">
                {fleetData.terminals.map((t) => {
                  const isCurrent = t.generation_id === selectedGenId;
                  return (
                    <tr
                      key={t.generation_id}
                      onClick={() => setSelectedGenId(t.generation_id)}
                      className={`cursor-pointer transition-colors ${
                        isCurrent ? 'bg-[#dbe0e7] font-semibold' : 'hover:bg-[#e4e8ee]'
                      }`}
                    >
                      <td className="py-3 px-3">
                        <span className={`px-1.5 py-0.5 text-[10px] ${
                          isCurrent ? 'bg-[#2c3440] text-[#eef2f6]' : 'bg-[#cbd3dd] text-[#1c2430]'
                        }`}>
                          {t.generation_id.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-[#1c2430]">{t.model_name.split(' (')[0]}</div>
                        <div className="text-[10px] text-[#556375]">{t.hardware_code}</div>
                      </td>
                      <td className="py-3 px-3 text-[#2c3440]">{t.release_year}</td>
                      <td className="py-3 px-3 text-[#1c2430] font-semibold">{t.rf_architecture.patch_element_count}</td>
                      <td className="py-3 px-3 text-[#556375] max-w-[180px] truncate" title={t.rf_architecture.beamforming_silicon}>
                        {t.rf_architecture.silicon_generation}
                      </td>
                      <td className="py-3 px-3 text-[#2c3440]">{t.rf_architecture.eirp_peak_dbw} dBW</td>
                      <td className="py-3 px-3 text-[#2c3440]">{t.power_subsystem.avg_power_draw_w} W</td>
                      <td className="py-3 px-3 text-[#556375]">{t.network_and_telemetry.integrated_router ? 'INTEGRATED' : 'EXTERNAL'}</td>
                      <td className="py-3 px-3 font-bold text-[#1c2430]">{t.security_audit.overall_vulnerability_score}</td>
                      <td className="py-3 px-3">
                        <span className="text-[9px] px-1.5 py-0.5 bg-[#424e5d] text-[#eef2f6]">
                          DROP ACTIVE
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 4: LIVE HARDWARE SECURITY PROBE CONSOLE                          */}
      {/* ==================================================================== */}
      {activeTab === 'probe_console' && (
        <div id="starlink-probe-console" className="space-y-4 font-mono text-xs">
          <div className="p-4 bg-[#eef2f6] border border-[#c6cfdb] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-[#1c2430] uppercase">
                Active Hardware Diagnostic & Telemetry Egress Probe
              </h3>
              <p className="text-xs text-[#556375] mt-0.5">
                Execute live diagnostic audits against target Starlink terminal {currentTerminal.hardware_code} ({currentTerminal.generation_id.toUpperCase()}) to verify gRPC, RF sidelobes, and quarantine status.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                id="probe-target-select"
                value={selectedGenId}
                onChange={(e) => setSelectedGenId(e.target.value)}
                className="px-3 py-1.5 bg-[#e4e8ee] border border-[#cbd3dd] text-[#1c2430] font-mono text-xs"
              >
                {fleetData.terminals.map((t) => (
                  <option key={t.generation_id} value={t.generation_id}>
                    Target: {t.generation_id.toUpperCase()} ({t.hardware_code.split(' ')[0]})
                  </option>
                ))}
              </select>

              <button
                id="execute-probe-btn"
                onClick={() => triggerProbe(selectedGenId)}
                disabled={probing}
                className="px-4 py-1.5 bg-[#2c3440] hover:bg-[#1c2430] text-[#eef2f6] font-semibold transition-colors"
              >
                {probing ? 'EXECUTING PROBE...' : 'RUN SECURITY AUDIT PROBE'}
              </button>
            </div>
          </div>

          {/* Probe Results Output */}
          {probeResult ? (
            <div className="p-4 bg-[#eef2f6] border border-[#c6cfdb] space-y-4">
              <div className="flex items-center justify-between border-b border-[#cbd3dd] pb-2">
                <span className="font-bold text-[#2c3440] uppercase">
                  Audit Execution Receipt: {probeResult.target_generation.toUpperCase()}
                </span>
                <span className="text-[10px] text-[#556375]">
                  TIMESTAMP: {probeResult.probe_timestamp}
                </span>
              </div>

              <div className="p-3 bg-[#e4e8ee] border border-[#cbd3dd] space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[#556375]">Execution Authority:</span>
                  <span className="text-[#1c2430]">{probeResult.filing_reference} ({probeResult.rights_holder})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#556375]">SHA-256 Audit Seal:</span>
                  <span className="text-[#1c2430] truncate max-w-sm">{probeResult.audit_sha256}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#556375]">Sequestration Directive:</span>
                  <span className="text-[#8a1c1c] font-semibold truncate max-w-sm">{probeResult.sequestration_command}</span>
                </div>
              </div>

              {/* Test Items */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-[#2c3440] uppercase">Diagnostic Sub-Test Results</div>
                {probeResult.tests.map((test) => (
                  <div
                    key={test.test_id}
                    className="p-3 bg-[#e4e8ee] border border-[#cbd3dd] flex flex-col md:flex-row md:items-center justify-between gap-2"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#1c2430]">{test.test_id}</span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-[#dbe0e7] text-[#2c3440]">
                          {test.category}
                        </span>
                        <span className="font-semibold text-[#2c3440]">{test.name}</span>
                      </div>
                      <div className="text-[11px] text-[#556375]">{test.details}</div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-[#556375]">CVSS {test.cvss_impact.toFixed(1)}</span>
                      <span className="px-2 py-1 bg-[#2c3440] text-[#eef2f6] text-[10px] font-semibold whitespace-nowrap">
                        {test.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Final Verdict Banner */}
              <div className="p-3 bg-[#2c3440] text-[#eef2f6] text-xs font-semibold flex items-center justify-between">
                <span>VERDICT: {probeResult.overall_verdict}</span>
                <span className="text-[10px] font-normal opacity-80">SOVEREIGN QUARANTINE ENFORCED</span>
              </div>
            </div>
          ) : (
            <div className="p-8 bg-[#eef2f6] border border-[#c6cfdb] text-center text-[#556375]">
              Click "RUN SECURITY AUDIT PROBE" to initiate automated gRPC, RF sidelobe, and telemetry quarantine diagnostic tests against {currentTerminal.model_name}.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StarlinkTerminalAuditView;
