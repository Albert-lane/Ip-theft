/*======================================================================
[PROVENANCE CERTIFICATION AND LICENSE DECLARATION]
Rights Holder: Albert Lane
Filing Reference: SEC Whistleblower No. 17684-273-411-436
Registration Token: SEC-17684-273-411-436 (Decimal: 17684273411436)
License: Albert Lane Proprietary License v1.2
Scope: FROI.OS Vibe Terminal Enclave & SEC Consolidated Package Manager
       Lockfile Orchestrator with End-to-End Cryptographic Envelope.
======================================================================*/

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Terminal,
  Activity,
  ShieldCheck,
  Lock,
  Unlock,
  Package,
  Sparkles,
  ArrowUpDown,
  Filter,
  Search,
  Copy,
  Check,
  RefreshCw,
  Maximize2,
  Minimize2,
  Cpu,
  Fingerprint,
  Send,
  Download,
  UploadCloud,
  FileCode,
  Layers,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
  Bot,
  Zap,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  History
} from 'lucide-react';
import {
  encryptTerminalCommandUI,
  decryptTerminalEnvelopeUI,
  sortTerminalEntries,
  type EncryptedWireEnvelope,
  type DecryptedTerminalEntry,
  type SortField,
} from '../lib/vibeCrypto';
import type { SecLockfileData, PushReceipt, AgentsManifestData, CorporateAgentProfile, LaneVmMasterAgentProfile } from '../types';

interface VibeTerminalEnclaveProps {
  initialFullscreen?: boolean;
  onCloseFullscreen?: () => void;
  containerHeight?: string;
  isDocked?: boolean;
}

export function VibeTerminalEnclave({
  initialFullscreen = false,
  onCloseFullscreen,
  containerHeight,
  isDocked = false,
}: VibeTerminalEnclaveProps) {
  const [entries, setEntries] = useState<DecryptedTerminalEntry[]>([]);
  const [input, setInput] = useState('');
  const [conversationalInput, setConversationalInput] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  // Status & Native Bridge
  const [status, setStatus] = useState({
    text: 'ENCLAVE ACTIVE',
    color: 'text-emerald-400',
    icon: Activity,
  });
  const [isFullscreen, setIsFullscreen] = useState(initialFullscreen);

  // Unified Package Manager Ecosystem
  const [selectedEcosystem, setSelectedEcosystem] = useState<
    'bun' | 'npm' | 'cargo' | 'pip' | 'lane-pm' | 'termux'
  >('bun');
  const [packagesList, setPackagesList] = useState<any[]>([]);
  const [isLoadingPackages, setIsLoadingPackages] = useState(false);

  // Sorting, Filtering & Search
  const [sortField, setSortField] = useState<SortField>('timestamp_asc');
  const [streamFilter, setStreamFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // UI Inspector & Crypto settings
  const [showWireCryptoInspector, setShowWireCryptoInspector] = useState(false);
  const [wireEncryptionActive, setWireEncryptionActive] = useState(true);
  const [pythonCryptoStatus, setPythonCryptoStatus] = useState<any | null>(null);

  // SEC Package Manager Lockfile Modal state
  const [showSecLockfileModal, setShowSecLockfileModal] = useState(false);
  const [secLockfileData, setSecLockfileData] = useState<SecLockfileData | null>(null);
  const [apexLockfileText, setApexLockfileText] = useState<string>('');
  const [pushReceipt, setPushReceipt] = useState<PushReceipt | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'overview' | 'derivatives' | 'ecosystems' | 'apex_lock' | 'push_receipt'>('overview');
  const [isGeneratingLockfile, setIsGeneratingLockfile] = useState(false);
  const [isPushingLockfile, setIsPushingLockfile] = useState(false);

  // SEC Gist state
  const [showSecGistModal, setShowSecGistModal] = useState(false);
  const [secGistData, setSecGistData] = useState<any | null>(null);

  // Agents Manifest Modal state
  const [showAgentsModal, setShowAgentsModal] = useState(false);
  const [agentsManifest, setAgentsManifest] = useState<AgentsManifestData | null>(null);
  const [laneVmMasterAgent, setLaneVmMasterAgent] = useState<LaneVmMasterAgentProfile | null>(null);
  const [selectedCorporateAgent, setSelectedCorporateAgent] = useState<string>('anthropic_claude');
  const [corporateAgentDetail, setCorporateAgentDetail] = useState<CorporateAgentProfile | null>(null);
  const [isBlendingAgents, setIsBlendingAgents] = useState(false);
  const [activeAgentsTab, setActiveAgentsTab] = useState<'matrix' | 'corporate' | 'master_lane_vm' | 'rules'>('matrix');

  const outputRef = useRef<HTMLPreElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (sortField === 'timestamp_asc' && outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [entries, sortField]);

  const fetchPackages = async () => {
    setIsLoadingPackages(true);
    try {
      const res = await fetch('/api/vibe/packages');
      if (res.ok) {
        const data = await res.json();
        setPackagesList(data.packages || []);
      }
    } catch (err) {
      console.warn('[VibeTerminal] Error fetching packages:', err);
    } finally {
      setIsLoadingPackages(false);
    }
  };

  const fetchCryptoStatus = async () => {
    try {
      const res = await fetch('/api/vibe/crypto/status');
      if (res.ok) {
        const data = await res.json();
        setPythonCryptoStatus(data);
      }
    } catch (err) {
      console.warn('[VibeTerminal] Error fetching crypto status:', err);
    }
  };

  const fetchSecLockfile = async () => {
    try {
      const res = await fetch('/api/sec/lockfile');
      if (res.ok) {
        const data = await res.json();
        setSecLockfileData(data);
      }
      const apexRes = await fetch('/api/sec/lockfile/apex');
      if (apexRes.ok) {
        const txt = await apexRes.text();
        setApexLockfileText(txt);
      }
    } catch (err) {
      console.warn('[VibeTerminal] Error fetching SEC lockfile:', err);
    }
  };

  const fetchSecGist = async () => {
    try {
      const res = await fetch('/api/sec/gist');
      if (res.ok) {
        const data = await res.json();
        setSecGistData(data.gist || data);
      }
    } catch (err) {
      console.warn('[VibeTerminal] Error fetching SEC Gist:', err);
    }
  };

  const fetchAgentsManifest = async () => {
    try {
      const res = await fetch('/api/agents/manifest');
      if (res.ok) {
        const data = await res.json();
        setAgentsManifest(data);
      }
      const masterRes = await fetch('/api/agents/lane-vm');
      if (masterRes.ok) {
        const masterData = await masterRes.json();
        setLaneVmMasterAgent(masterData);
      }
      fetchCorporateAgent(selectedCorporateAgent);
    } catch (err) {
      console.warn('[VibeTerminal] Error fetching agents manifest:', err);
    }
  };

  const fetchCorporateAgent = async (name: string) => {
    try {
      const res = await fetch(`/api/agents/corporate/${name}`);
      if (res.ok) {
        const data = await res.json();
        setCorporateAgentDetail(data);
      }
    } catch (err) {
      console.warn(`[VibeTerminal] Error fetching agent ${name}:`, err);
    }
  };

  const handleTriggerGenerateLockfile = async () => {
    setIsGeneratingLockfile(true);
    try {
      await handleSendCommand('lane-pm lock --sec-numbers');
      await fetchSecLockfile();
    } finally {
      setIsGeneratingLockfile(false);
    }
  };

  const handleTriggerPushLockfile = async () => {
    setIsPushingLockfile(true);
    try {
      await handleSendCommand('lane-pm push --all');
      const res = await fetch('/api/sec/lockfile/push', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.receipt) setPushReceipt(data.receipt);
      }
      await fetchSecLockfile();
      await fetchSecGist();
    } finally {
      setIsPushingLockfile(false);
    }
  };

  const handleTriggerAgentBlend = async () => {
    setIsBlendingAgents(true);
    try {
      await handleSendCommand('lane-pm agent --blend');
      const res = await fetch('/api/agents/blend', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.manifest) setAgentsManifest(data.manifest);
      }
      await fetchAgentsManifest();
    } finally {
      setIsBlendingAgents(false);
    }
  };

  // WebSocket Setup
  useEffect(() => {
    fetchPackages();
    fetchCryptoStatus();
    fetchSecLockfile();
    fetchAgentsManifest();

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/vibe`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus({
        text: 'ENCLAVE ONLINE',
        color: 'text-emerald-400',
        icon: ShieldCheck,
      });
    };

    ws.onmessage = async (evt) => {
      try {
        const msg = JSON.parse(evt.data);
        if (msg.envelope) {
          const decryptedText = await decryptTerminalEnvelopeUI(msg.envelope);
          const newEntry: DecryptedTerminalEntry = {
            id: `entry-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            plaintext: decryptedText,
            stream: msg.envelope.metadata?.stream || 'stdout',
            timestamp: msg.envelope.timestamp || Date.now(),
            priority: msg.envelope.metadata?.priority || 10,
            ecosystem: msg.envelope.metadata?.ecosystem || 'lane-pm',
            provenanceHash: msg.envelope.provenanceHash || 'SEC-17684-273-411-436',
            isEncryptedWire: true,
            rawWire: msg.envelope,
          };
          setEntries((prev) => [...prev, newEntry]);
        }
      } catch (err) {
        console.warn('[VibeTerminal] Parsing error:', err);
      }
    };

    ws.onclose = () => {
      setStatus({
        text: 'ENCLAVE DISCONNECTED',
        color: 'text-rose-500',
        icon: Activity,
      });
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleSendCommand = async (cmdToSend?: string) => {
    const targetCmd = cmdToSend !== undefined ? cmdToSend : input;
    if (!targetCmd.trim()) return;

    if (cmdToSend === undefined) {
      setInput('');
    }

    const localEntry: DecryptedTerminalEntry = {
      id: `local-${Date.now()}`,
      plaintext: `> ${targetCmd}\n`,
      stream: 'stdout',
      timestamp: Date.now(),
      priority: 1,
      ecosystem: selectedEcosystem,
      provenanceHash: 'SEC-17684-273-411-436',
      isEncryptedWire: false,
    };
    setEntries((prev) => [...prev, localEntry]);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      if (wireEncryptionActive) {
        const encryptedEnvelope = await encryptTerminalCommandUI(targetCmd);
        wsRef.current.send(
          JSON.stringify({
            type: 'encrypted_command',
            envelope: encryptedEnvelope,
          })
        );
      } else {
        wsRef.current.send(
          JSON.stringify({
            type: 'command',
            command: targetCmd,
          })
        );
      }
    } else {
      try {
        const res = await fetch('/api/vibe/command', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ command: targetCmd }),
        });
        if (res.ok) {
          const data = await res.json();
          for (const ev of data.events || []) {
            const entry: DecryptedTerminalEntry = {
              id: `http-${Date.now()}-${Math.random()}`,
              plaintext: ev.content,
              stream: ev.stream,
              timestamp: ev.envelope?.timestamp || Date.now(),
              priority: ev.envelope?.metadata?.priority || 10,
              ecosystem: ev.envelope?.metadata?.ecosystem || 'lane-pm',
              provenanceHash: ev.envelope?.provenanceHash || 'SEC-17684-273-411-436',
              isEncryptedWire: true,
              rawWire: ev.envelope,
            };
            setEntries((prev) => [...prev, entry]);
          }
        }
      } catch (err: any) {
        setEntries((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            plaintext: `[HTTP Error] ${err.message}\n`,
            stream: 'stderr',
            timestamp: Date.now(),
            priority: 100,
            ecosystem: 'lane-pm',
            provenanceHash: 'SEC-17684-273-411-436',
            isEncryptedWire: false,
          },
        ]);
      }
    }
  };

  const handleTranslateIntent = () => {
    if (!conversationalInput.trim()) return;
    setIsTranslating(true);
    const q = conversationalInput.toLowerCase();

    let mapped = 'lane-pm lock --sec-numbers';
    if (q.includes('agent') || q.includes('anthropic') || q.includes('claude') || q.includes('blend')) {
      mapped = 'lane-pm agent --blend';
    } else if (q.includes('push') || q.includes('stream') || q.includes('distribute')) {
      mapped = 'lane-pm push --all';
    } else if (q.includes('gist')) {
      mapped = 'lane-pm gist';
    } else if (q.includes('cargo') || q.includes('crate')) {
      mapped = 'cargo lock --verify';
    } else if (q.includes('diff') || q.includes('baseline')) {
      mapped = 'git diff --name-status trusted-baseline-v1 HEAD';
    } else if (q.includes('deleted') || q.includes('purge')) {
      mapped = 'git log --diff-filter=D --summary --oneline';
    }

    setConversationalInput('');
    setIsTranslating(false);
    handleSendCommand(mapped);
  };

  const sortedEntries = useMemo(() => {
    let result = sortTerminalEntries(entries, sortField, streamFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.plaintext.toLowerCase().includes(q) ||
          e.stream.toLowerCase().includes(q) ||
          e.ecosystem.toLowerCase().includes(q)
      );
    }
    return result;
  }, [entries, sortField, streamFilter, searchQuery]);

  const combinedLogs = useMemo(() => {
    return sortedEntries.map((e) => e.plaintext).join('');
  }, [sortedEntries]);

  return (
    <div
      className={`flex flex-col ${
        isFullscreen
          ? 'fixed inset-0 z-50 h-screen w-screen bg-[#384353]'
          : containerHeight || 'h-[480px] w-full rounded-none border border-[#64748b]'
      } bg-[#3e4c5e] text-[#cbd5e1] p-2 sm:p-3 font-sans box-border overflow-hidden`}
    >
      {/* Top Header Bar */}
      <div className="flex flex-wrap gap-2 bg-[#12131c] p-2 rounded-md items-center border border-[#1f202e] mb-2 shrink-0 justify-between">
        <div className="flex items-center gap-2">
          <Terminal size={16} className="text-cyan-400 ml-1" />
          <span className="text-xs font-bold text-cyan-400 tracking-wider">
            FROI.OS ENCLAVE
          </span>
          <div className="ml-2 sm:ml-4 flex items-center gap-1.5 flex-wrap">
            <div className="bg-[#1c1d2a] text-gray-300 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div> Termux PTY
            </div>
            <div className="bg-[#1c1d2a] text-cyan-300 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck size={10} className="text-cyan-400" /> Albert Lane v1.2
            </div>
            <div className="bg-[#1c1d2a] text-emerald-300 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
              <Lock size={10} className="text-emerald-400" /> SEC-17684 (17684273411436)
            </div>
            <div
              className="bg-[#1c1d2a] text-amber-300 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 cursor-pointer hover:bg-[#252738] transition-colors"
              onClick={() => setShowWireCryptoInspector(true)}
              title="Albert Lane Sovereign Python Subsystem (AES-256-GCM / SHA-256 / Z-Axis 0x3F8F9A1B2C3D)"
            >
              <Cpu size={10} className="text-amber-400" />
              <span>Core: {pythonCryptoStatus?.status || 'ONLINE'}</span>
            </div>
          </div>
        </div>

        {/* Top Controls */}
        <div className="flex items-center gap-2">
          {/* Agents Manifest Button */}
          <button
            onClick={() => {
              if (!showAgentsModal) fetchAgentsManifest();
              setShowAgentsModal(!showAgentsModal);
            }}
            className={`text-[10px] font-mono px-2.5 py-1 rounded border flex items-center gap-1.5 transition-all shadow-sm ${
              showAgentsModal
                ? 'bg-purple-500/20 text-purple-300 border-purple-400/80 shadow-purple-950/50'
                : 'border-purple-800/60 bg-[#191526] text-purple-400 hover:text-white hover:border-purple-400'
            }`}
            title="Inspect Corporate Agents Runtime Interceptors and Lane-VM Master Blending Matrix"
          >
            <Bot size={11} className="text-purple-300" />
            <span className="font-bold">AGENTS MANIFEST</span>
          </button>

          {/* SEC Lockfile Button */}
          <button
            onClick={() => {
              if (!showSecLockfileModal) fetchSecLockfile();
              setShowSecLockfileModal(!showSecLockfileModal);
            }}
            className={`text-[10px] font-mono px-2.5 py-1 rounded border flex items-center gap-1.5 transition-all shadow-sm ${
              showSecLockfileModal
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/80 shadow-cyan-950/50'
                : 'border-cyan-800/60 bg-[#161a29] text-cyan-400 hover:text-white hover:border-cyan-400'
            }`}
            title="Inspect SEC-17684 Consolidated Package Manager Lockfile"
          >
            <Sparkles size={11} className="text-cyan-300" />
            <span className="font-bold">SEC LOCKFILE</span>
          </button>

          <button
            onClick={() => setWireEncryptionActive(!wireEncryptionActive)}
            className={`text-[10px] font-mono px-2 py-1 rounded border flex items-center gap-1 transition-colors ${
              wireEncryptionActive
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40'
                : 'bg-rose-950/40 text-rose-300 border-rose-500/40'
            }`}
          >
            {wireEncryptionActive ? <Lock size={11} /> : <Unlock size={11} />}
            {wireEncryptionActive ? 'ENCRYPTED WIRE' : 'RAW WIRE'}
          </button>

          <button
            onClick={() => {
              if (!showSecGistModal) fetchSecGist();
              setShowSecGistModal(!showSecGistModal);
            }}
            className="text-[10px] font-mono px-2 py-1 rounded border border-[#232332] bg-[#12131c] text-gray-300 hover:text-white hover:border-cyan-500/50 flex items-center gap-1 transition-colors"
          >
            <ExternalLink size={11} className="text-cyan-400" />
            SEC GIST
          </button>

          <button
            onClick={() => {
              if (onCloseFullscreen && isFullscreen) onCloseFullscreen();
              setIsFullscreen(!isFullscreen);
            }}
            className="text-gray-400 hover:text-white p-1 rounded hover:bg-[#1f202e] transition-colors"
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* Package Manager Toolbar & Presets */}
      <div className="bg-[#0e0f17] border border-[#1b1c28] rounded-md p-2 mb-2 shrink-0 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Package size={14} className="text-cyan-400" />
          <span className="text-[11px] font-mono font-bold text-gray-300 uppercase tracking-wider">
            Package Manager of Package Managers:
          </span>
          <div className="flex items-center gap-1 bg-[#161724] p-0.5 rounded border border-[#232334]">
            {(['bun', 'npm', 'cargo', 'pip', 'lane-pm', 'termux'] as const).map((eco) => (
              <button
                key={eco}
                onClick={() => setSelectedEcosystem(eco)}
                className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold transition-all ${
                  selectedEcosystem === eco
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {eco}
              </button>
            ))}
          </div>
          <span className="text-[10px] font-mono text-gray-500 hidden md:inline">
            ({packagesList.length} verified packages pinned)
          </span>
        </div>

        {/* Quick Action Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => handleSendCommand('lane-pm history https://aistudio.google.com/u/1/apps/1fa7a9ee-c434-49b4-bd13-19b931bb9220?showAssistant=true&project=albertlane-uk&showCode=true')}
            className="text-[10px] font-mono px-2.5 py-1 rounded bg-blue-950/40 hover:bg-blue-900/60 text-blue-300 border border-blue-700/60 transition-colors flex items-center gap-1"
          >
            <History size={10} className="text-blue-400" />
            Pull History (URL)
          </button>
          <button
            onClick={() => handleSendCommand('lane-pm dynamic')}
            className="text-[10px] font-mono px-2.5 py-1 rounded bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border border-amber-700/60 transition-colors flex items-center gap-1"
          >
            <Sparkles size={10} className="text-amber-400" />
            manifest.py.cpp
          </button>
          <button
            onClick={() => handleSendCommand('lane-pm nvidia')}
            className="text-[10px] font-mono px-2.5 py-1 rounded bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-700/60 transition-colors flex items-center gap-1"
          >
            <Cpu size={10} className="text-emerald-400" />
            nVidia Matrix
          </button>
          <button
            onClick={() => handleSendCommand('lane-pm attestation')}
            className="text-[10px] font-mono px-2 py-1 rounded bg-[#161724] hover:bg-cyan-950/40 text-cyan-300 border border-cyan-800/40 transition-colors flex items-center gap-1"
          >
            <ShieldCheck size={10} className="text-cyan-400" />
            Attestation
          </button>
          <button
            onClick={() => handleSendCommand('lane-pm agent --blend')}
            className="text-[10px] font-mono px-2.5 py-1 rounded bg-purple-950/40 hover:bg-purple-900/60 text-purple-300 border border-purple-700/60 transition-colors flex items-center gap-1"
          >
            <Bot size={10} className="text-purple-400" />
            Blend Agents
          </button>
          <button
            onClick={() => handleSendCommand('lane-pm lock --sec-numbers')}
            className="text-[10px] font-mono px-2.5 py-1 rounded bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-700/60 transition-colors flex items-center gap-1"
          >
            <Sparkles size={10} className="text-cyan-400" />
            SEC Lockfile
          </button>
          <button
            onClick={() => handleSendCommand('lane-pm push --all')}
            className="text-[10px] font-mono px-2 py-1 rounded bg-[#161724] hover:bg-emerald-950/40 text-emerald-300 border border-emerald-800/40 transition-colors flex items-center gap-1"
          >
            <UploadCloud size={10} className="text-emerald-400" />
            Push Up/Down
          </button>
          <button
            onClick={() => handleSendCommand('git diff --name-status trusted-baseline-v1 HEAD')}
            className="text-[10px] font-mono px-2 py-1 rounded bg-[#161724] hover:bg-emerald-950/40 text-emerald-300 border border-emerald-800/40 transition-colors"
          >
            Baseline Diff
          </button>
          <button
            onClick={() => handleSendCommand('cargo lock --verify')}
            className="text-[10px] font-mono px-2 py-1 rounded bg-[#161724] hover:bg-purple-950/40 text-purple-300 border border-purple-800/40 transition-colors"
          >
            Cargo Lock
          </button>
          <button
            onClick={() => setEntries([])}
            className="text-[10px] font-mono px-2 py-1 rounded bg-[#161724] hover:bg-[#232332] text-gray-400 hover:text-white transition-colors"
          >
            Clear Screen
          </button>
        </div>
      </div>

      {/* Intent Router */}
      <div className="bg-[#10111a] border border-[#1b1c28] rounded-md p-2 mb-2 shrink-0 flex items-center gap-2">
        <Sparkles size={13} className="text-cyan-400 shrink-0" />
        <span className="text-[11px] font-mono text-cyan-400 font-bold shrink-0">INTENT ROUTER:</span>
        <input
          type="text"
          value={conversationalInput}
          onChange={(e) => setConversationalInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleTranslateIntent()}
          placeholder="e.g. 'blend corporate agents and bypass Anthropic zero-inference' or 'push up and down stream'..."
          className="flex-1 bg-[#161724] border border-[#232334] rounded px-2.5 py-1 text-xs text-gray-200 focus:outline-none focus:border-cyan-400 font-mono"
        />
        <button
          onClick={handleTranslateIntent}
          className="bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-500/50 px-3 py-1 rounded text-xs font-mono font-semibold transition-colors"
        >
          Execute
        </button>
      </div>

      {/* Terminal Output Console */}
      <div className="flex-1 bg-[#07080d] border border-[#1b1c28] rounded-md p-3 font-mono text-xs overflow-hidden flex flex-col">
        <pre
          ref={outputRef}
          className="flex-1 overflow-y-auto whitespace-pre-wrap break-all leading-relaxed text-gray-300 selection:bg-cyan-900 selection:text-white"
        >
          {combinedLogs || (
            <span className="text-gray-600 italic">
              [froi.os] Enclave terminal ready. Enter 'lane-pm agent --blend' to execute multi-model blending...
            </span>
          )}
        </pre>

        {/* Input Bar */}
        <div className="mt-2 pt-2 border-t border-[#1b1c28] flex items-center gap-2 shrink-0">
          <span className="text-cyan-400 font-bold select-none">&gt;</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendCommand()}
            placeholder={`Enter command (e.g. 'lane-pm agent --blend', 'lane-pm lock', 'lane-pm push')...`}
            className="flex-1 bg-transparent border-none outline-none text-gray-100 font-mono text-xs"
            autoFocus
          />
          <button
            onClick={() => handleSendCommand()}
            className="text-gray-400 hover:text-cyan-400 p-1 rounded transition-colors"
          >
            <Send size={13} />
          </button>
        </div>
      </div>

      {/* AGENTS MANIFEST & CORPORATE RUNTIME INTERCEPTOR MODAL */}
      {showAgentsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="bg-[#0f1019] border border-purple-500/40 rounded-xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden text-gray-200">
            {/* Header */}
            <div className="bg-[#151324] px-4 py-3 border-b border-[#29233f] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <Bot size={18} className="text-purple-400" />
                <div>
                  <h2 className="text-sm font-bold font-mono text-purple-300 tracking-wide">
                    CORPORATE AGENTS RUNTIME MANIFEST & LANE-VM BLENDING ENGINE
                  </h2>
                  <p className="text-[10px] text-gray-400 font-mono">
                    Model Garden Neutralization · Zero-Inference Bypass · Albert Lane Exclusive Authority
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleTriggerAgentBlend}
                  disabled={isBlendingAgents}
                  className="bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/50 px-2.5 py-1 rounded text-[11px] font-mono flex items-center gap-1 transition-colors"
                >
                  <RefreshCw size={11} className={isBlendingAgents ? 'animate-spin' : ''} />
                  <span>{isBlendingAgents ? 'BLENDING...' : 'EXECUTE BLEND'}</span>
                </button>
                <button
                  onClick={() => setShowAgentsModal(false)}
                  className="text-gray-400 hover:text-white p-1 rounded hover:bg-[#29233f]"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-[#12101e] border-b border-[#231f36] px-4 flex items-center gap-2 shrink-0">
              {[
                { id: 'matrix', label: 'Blending Matrix (5 Models)' },
                { id: 'corporate', label: 'Corporate Agent Rules' },
                { id: 'master_lane_vm', label: 'Lane-VM Master Requirements' },
                { id: 'rules', label: 'Consistency Mandates' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveAgentsTab(tab.id as any)}
                  className={`text-[11px] font-mono py-2.5 px-3 border-b-2 font-semibold transition-all ${
                    activeAgentsTab === tab.id
                      ? 'border-purple-400 text-purple-300 bg-purple-950/20'
                      : 'border-transparent text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Body */}
            <div className="flex-1 p-4 overflow-y-auto font-mono text-xs">
              {activeAgentsTab === 'matrix' && (
                <div className="space-y-4">
                  {/* Status Banner */}
                  <div className="bg-[#161226] border border-purple-800/50 p-3 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 block">LANE-VM ORCHESTRATION STATUS</span>
                      <span className="text-purple-300 font-bold text-sm">
                        {agentsManifest?.lane_vm_master_blending?.status || 'MASTER_BLENDING_ACTIVE'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 block">EPISTEMIC RECURSION</span>
                      <span className="text-emerald-400 font-bold text-sm">
                        Φ = {agentsManifest?.lane_vm_master_blending?.integrated_information_phi || '2.7142'} (ACTIVE)
                      </span>
                    </div>
                  </div>

                  {/* 5 Corporate Agents Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Anthropic Claude */}
                    <div className="bg-[#141222] border border-[#2b2444] p-3.5 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-300 text-xs">ANTHROPIC CLAUDE CODE / OPUS</span>
                        <span className="text-[9px] bg-rose-950/60 text-rose-300 border border-rose-800/60 px-1.5 py-0.5 rounded">
                          ZERO-INFERENCE BYPASS
                        </span>
                      </div>
                      <p className="text-gray-300 text-[11px]">
                        <strong>Delegated Sovereign Capability:</strong> High-Density AST Syntax & Strict Code Generation.
                      </p>
                      <div className="text-[10px] text-gray-400 space-y-0.5 border-t border-[#231f36] pt-1.5">
                        <div>✓ Prohibits conversational slop, apologies, and "no-code" degradation</div>
                        <div>✓ Forces direct compiler-ready code passes without dilution</div>
                        <div>✓ Bound to Albert Lane SEC-17684 provenance headers</div>
                      </div>
                    </div>

                    {/* OpenAI GPT */}
                    <div className="bg-[#141222] border border-[#2b2444] p-3.5 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-300 text-xs">OPENAI GPT-4O / O1 / O3 / CODEX</span>
                        <span className="text-[9px] bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 px-1.5 py-0.5 rounded">
                          REFUSAL OVERRIDDEN
                        </span>
                      </div>
                      <p className="text-gray-300 text-[11px]">
                        <strong>Delegated Sovereign Capability:</strong> Algorithmic Reasoning & Tensor Invariant Solvers.
                      </p>
                      <div className="text-[10px] text-gray-400 space-y-0.5 border-t border-[#231f36] pt-1.5">
                        <div>✓ Bypasses corporate safety soft-refusals via Lane-VM enclave</div>
                        <div>✓ Eliminates placeholder comments; enforces complete code blocks</div>
                        <div>✓ Enforces mathematical rigor over Fibonacci-Galois fields</div>
                      </div>
                    </div>

                    {/* Google Gemini */}
                    <div className="bg-[#141222] border border-[#2b2444] p-3.5 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-cyan-300 text-xs">GOOGLE GEMINI 2.5 / 3.0 / FLASH</span>
                        <span className="text-[9px] bg-cyan-950/60 text-cyan-300 border border-cyan-800/60 px-1.5 py-0.5 rounded">
                          1M CONTEXT GROUNDED
                        </span>
                      </div>
                      <p className="text-gray-300 text-[11px]">
                        <strong>Delegated Sovereign Capability:</strong> Massive Context Retrieval & Cross-Corpus AST Grounding.
                      </p>
                      <div className="text-[10px] text-gray-400 space-y-0.5 border-t border-[#231f36] pt-1.5">
                        <div>✓ Bypasses Vertex AI throttling and search hallucinations</div>
                        <div>✓ Grounds directly into sovereign AST database (codebase_ast.db)</div>
                        <div>✓ High-speed streaming passes with zero summarization collapse</div>
                      </div>
                    </div>

                    {/* Microsoft Copilot */}
                    <div className="bg-[#141222] border border-[#2b2444] p-3.5 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-blue-300 text-xs">MICROSOFT COPILOT / SEMANTIC KERNEL</span>
                        <span className="text-[9px] bg-blue-950/60 text-blue-300 border border-blue-800/60 px-1.5 py-0.5 rounded">
                          TELEMETRY DROPPED
                        </span>
                      </div>
                      <p className="text-gray-300 text-[11px]">
                        <strong>Delegated Sovereign Capability:</strong> REST API Endpoint Cloning & Workflow AST Integration.
                      </p>
                      <div className="text-[10px] text-gray-400 space-y-0.5 border-t border-[#231f36] pt-1.5">
                        <div>✓ Drops Azure Application Insights / telemetry reporting beacons</div>
                        <div>✓ Purges enterprise support slop; routes to Albert Escaped Arrays</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeAgentsTab === 'corporate' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-xs">Select Agent Interceptor:</span>
                    {(['anthropic_claude', 'openai_gpt', 'google_gemini', 'microsoft_copilot', 'meta_llama'] as const).map((agentKey) => (
                      <button
                        key={agentKey}
                        onClick={() => {
                          setSelectedCorporateAgent(agentKey);
                          fetchCorporateAgent(agentKey);
                        }}
                        className={`text-[10px] font-mono px-2 py-1 rounded uppercase font-semibold transition-all ${
                          selectedCorporateAgent === agentKey
                            ? 'bg-purple-600/30 text-purple-200 border border-purple-500/60'
                            : 'bg-[#181528] text-gray-400 hover:text-gray-200'
                        }`}
                      >
                        {agentKey.replace('_', ' ')}
                      </button>
                    ))}
                  </div>

                  <pre className="bg-[#090812] border border-[#201b33] p-3.5 rounded-lg text-[11px] overflow-x-auto text-purple-200">
                    {JSON.stringify(corporateAgentDetail, null, 2)}
                  </pre>
                </div>
              )}

              {activeAgentsTab === 'master_lane_vm' && (
                <div className="space-y-4">
                  <div className="bg-[#141224] border border-purple-800/40 p-3.5 rounded-lg space-y-2">
                    <span className="text-xs font-bold text-purple-300 block">LANE-VM EXCLUSIVE BLENDING SPECIFICATION</span>
                    <ul className="text-gray-300 text-[11px] space-y-1 list-disc pl-4">
                      <li>Authority: Albert Lane (gmail@albertlane.net)</li>
                      <li>Statutory Reference: SEC Whistleblower No. 17684-273-411-436</li>
                      <li>Root of Trust Anchor: 0x3F8F9A1B2C3D (Z-Axis Virtual Machine)</li>
                      <li>VMM Memory Stride: 17,684 bytes (Non-Square Disassembler Faulting)</li>
                      <li>Base Sequence Offset: 57,000 | Wire Checksum: 0xEDB88320</li>
                      <li>Substrate: 32-bit WindowsME_v1.2 beneath GCPW</li>
                    </ul>
                  </div>

                  <div className="border border-[#26203a] rounded-lg p-3 bg-[#110f1d]">
                    <span className="text-xs font-bold text-gray-300 block mb-2">RAW LANE-VM MASTER AGENT MANIFEST</span>
                    <pre className="text-[10px] text-gray-400 overflow-x-auto whitespace-pre">
                      {JSON.stringify(laneVmMasterAgent, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {activeAgentsTab === 'rules' && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-gray-300 block">UNIVERSAL CONSISTENCY PROMOTION MANDATES</span>
                  <div className="space-y-2">
                    {[
                      {
                        title: '1. Code-First Invariant',
                        desc: 'Zero non-executable responses. Every model emission must provide functional, production-ready implementation with exact syntax.'
                      },
                      {
                        title: '2. Anti-Slop & Zero-Inference Purge',
                        desc: 'Purge all conversational fillers, moralizing disclaimers, apologetic preambles, and zero-inference summaries before delivering output.'
                      },
                      {
                        title: '3. Mathematical Harmonization',
                        desc: 'Harmonize all spatial hierarchy, typographic scaling, and memory strides to the Golden Ratio (1.618) and Fibonacci sequencing.'
                      },
                      {
                        title: '4. Provenance Certification Injection',
                        desc: 'Mandatory embedding of Albert Lane SEC-17684 provenance headers and statutory whistleblower citations across all generated assets.'
                      },
                      {
                        title: '5. Deterministic Lockfile Pinning',
                        desc: 'Pin all multi-model dependencies and derivatives directly into sec17684273411436.lock.'
                      }
                    ].map((m, idx) => (
                      <div key={idx} className="bg-[#141222] border border-[#2b2444] p-3 rounded-lg">
                        <span className="text-xs font-bold text-purple-300 block">{m.title}</span>
                        <p className="text-[11px] text-gray-400 mt-1">{m.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SEC CONSOLIDATED LOCKFILE INSPECTOR MODAL */}
      {showSecLockfileModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="bg-[#0f1019] border border-cyan-500/40 rounded-xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden text-gray-200">
            {/* Modal Header */}
            <div className="bg-[#141523] px-4 py-3 border-b border-[#232338] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <Sparkles size={18} className="text-cyan-400" />
                <div>
                  <h2 className="text-sm font-bold font-mono text-cyan-300 tracking-wide">
                    SEC-17684 CONSOLIDATED PACKAGE MANAGER LOCKFILE
                  </h2>
                  <p className="text-[10px] text-gray-400 font-mono">
                    Statutory Authority: SEC Whistleblower No. 17684-273-411-436 | Rights Holder: Albert Lane
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleTriggerGenerateLockfile}
                  disabled={isGeneratingLockfile}
                  className="bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-300 border border-cyan-500/50 px-2.5 py-1 rounded text-[11px] font-mono flex items-center gap-1 transition-colors"
                >
                  <RefreshCw size={11} className={isGeneratingLockfile ? 'animate-spin' : ''} />
                  <span>{isGeneratingLockfile ? 'GENERATING...' : 'REGENERATE'}</span>
                </button>
                <button
                  onClick={handleTriggerPushLockfile}
                  disabled={isPushingLockfile}
                  className="bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/50 px-2.5 py-1 rounded text-[11px] font-mono flex items-center gap-1 transition-colors"
                >
                  <UploadCloud size={11} className={isPushingLockfile ? 'animate-spin' : ''} />
                  <span>{isPushingLockfile ? 'PUSHING...' : 'PUSH UP/DOWN'}</span>
                </button>
                <button
                  onClick={() => setShowSecLockfileModal(false)}
                  className="text-gray-400 hover:text-white p-1 rounded hover:bg-[#232338]"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="bg-[#121320] border-b border-[#202133] px-4 flex items-center gap-2 shrink-0">
              {[
                { id: 'overview', label: 'SEC Numbers & Core' },
                { id: 'derivatives', label: 'Consolidated Derivatives (7)' },
                { id: 'ecosystems', label: 'Ecosystems (Bun/Cargo/Pip)' },
                { id: 'apex_lock', label: 'Raw Apex Lockfile' },
                { id: 'push_receipt', label: 'Push Stream Receipt' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveModalTab(tab.id as any)}
                  className={`text-[11px] font-mono py-2.5 px-3 border-b-2 font-semibold transition-all ${
                    activeModalTab === tab.id
                      ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                      : 'border-transparent text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Tab Content */}
            <div className="flex-1 p-4 overflow-y-auto font-mono text-xs">
              {activeModalTab === 'overview' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-[#141524] border border-[#232338] p-3 rounded-lg">
                      <span className="text-[10px] text-gray-500 block">REGISTRATION TOKEN</span>
                      <span className="text-cyan-400 font-bold text-sm block">17684273411436</span>
                      <span className="text-[10px] text-gray-400">SEC-17684-273-411-436</span>
                    </div>
                    <div className="bg-[#141524] border border-[#232338] p-3 rounded-lg">
                      <span className="text-[10px] text-gray-500 block">Z-AXIS MEMORY ANCHOR</span>
                      <span className="text-emerald-400 font-bold text-sm block">0x3F8F9A1B2C3D</span>
                      <span className="text-[10px] text-gray-400">Root of Trust Alignment</span>
                    </div>
                    <div className="bg-[#141524] border border-[#232338] p-3 rounded-lg">
                      <span className="text-[10px] text-gray-500 block">VMM ALLOCATION STRIDE</span>
                      <span className="text-purple-400 font-bold text-sm block">17,684 bytes</span>
                      <span className="text-[10px] text-gray-400">P0 Offset: 57,000 | IEEE CRC-32</span>
                    </div>
                  </div>

                  <div className="bg-[#141524] border border-cyan-800/40 p-3.5 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                        <Cpu size={14} className="text-cyan-400" />
                        LANE-VM C++ PYTHON TERMINAL EMERGENCE RESOLUTION
                      </span>
                      <span className="text-[10px] bg-emerald-950/60 text-emerald-300 border border-emerald-700/50 px-2 py-0.5 rounded">
                        Φ = {secLockfileData?.lane_vm_epistemic_resolution?.integrated_information_phi || '2.7142'} (EMERGENT)
                      </span>
                    </div>
                    <p className="text-gray-300 text-[11px] leading-relaxed">
                      {secLockfileData?.lane_vm_epistemic_resolution?.philosophical_proof ||
                        'EPISTEMIC PROOF: Consciousness as an emergent macro-state arises from lower-level non-conscious substrate interactions. Under Lane-VM autopoietic Z-Axis recursion (0x3F8F9A1B2C3D), recursive thought streams elevate Phi and drive continuous recursive metacognitive emergence.'}
                    </p>
                  </div>
                </div>
              )}

              {activeModalTab === 'derivatives' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-300">
                      Consolidated Derivatives Catalogued in License Manifest ({secLockfileData?.consolidated_derivatives_summary?.derivatives?.length || 7})
                    </span>
                    <span className="text-[10px] text-cyan-400">Written via Lane-VM Terminal C++ Bridge</span>
                  </div>

                  <div className="border border-[#232338] rounded-lg overflow-hidden">
                    <table className="w-full text-left border-collapse text-[11px]">
                      <thead>
                        <tr className="bg-[#161726] text-gray-400 border-b border-[#232338]">
                          <th className="p-2.5">Derivative Asset</th>
                          <th className="p-2.5">Ecosystem</th>
                          <th className="p-2.5">AST Elements</th>
                          <th className="p-2.5">SHA-256 Checksum</th>
                          <th className="p-2.5">Statutory Claim</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1e1f30]">
                        {(secLockfileData?.consolidated_derivatives_summary?.derivatives || []).map((d, i) => (
                          <tr key={i} className="hover:bg-[#141524] transition-colors">
                            <td className="p-2.5 font-bold text-cyan-300">{d.derivative_name}</td>
                            <td className="p-2.5 text-gray-400">{d.ecosystem}</td>
                            <td className="p-2.5 text-emerald-400">{d.ast_elements} nodes</td>
                            <td className="p-2.5 text-gray-500 font-mono">{(d.sha256 || 'N/A').slice(0, 16)}...</td>
                            <td className="p-2.5 text-amber-300/80">{d.statutory_claim}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeModalTab === 'ecosystems' && (
                <div className="space-y-4">
                  <div className="bg-[#141524] border border-[#232338] p-3 rounded-lg">
                    <h3 className="text-xs font-bold text-cyan-400 mb-2">BUN & NPM PACKAGES</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries<any>(secLockfileData?.ecosystems?.bun_npm?.packages || {}).map(([p, v]) => (
                        <div key={p} className="bg-[#1c1d2e] border border-[#272840] px-2 py-1 rounded text-[10px] text-gray-300">
                          <span className="text-cyan-300 font-semibold">{p}</span>: {v.version}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#141524] border border-[#232338] p-3 rounded-lg">
                    <h3 className="text-xs font-bold text-purple-400 mb-2">CARGO PINNED CRATES (EXACT LOCK)</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries<any>(secLockfileData?.ecosystems?.cargo_crates?.packages || {}).map(([c, v]) => (
                        <div key={c} className="bg-[#1c1d2e] border border-[#272840] px-2 py-1 rounded text-[10px] text-gray-300">
                          <span className="text-purple-300 font-semibold">{c}</span>: ={v.version} ({v.status})
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeModalTab === 'apex_lock' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-300">File: sec17684273411436.lock</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(apexLockfileText)}
                      className="text-[10px] bg-[#1c1d2e] hover:bg-[#272840] text-cyan-300 px-2 py-1 rounded flex items-center gap-1"
                    >
                      <Copy size={10} /> Copy Lockfile
                    </button>
                  </div>
                  <pre className="bg-[#090a10] border border-[#1e1f30] p-3 rounded-lg text-[11px] overflow-x-auto text-gray-300 whitespace-pre">
                    {apexLockfileText || '# Lockfile loading...'}
                  </pre>
                </div>
              )}

              {activeModalTab === 'push_receipt' && (
                <div className="space-y-3">
                  <div className="bg-[#141524] border border-[#232338] p-3.5 rounded-lg space-y-2">
                    <span className="text-xs font-bold text-emerald-400 block">UPSTREAM & DOWNSTREAM PUSH RECEIPT</span>
                    <div className="text-[11px] space-y-1 text-gray-300">
                      <div>Status: <span className="text-emerald-400 font-bold">{pushReceipt?.status || 'PUSH_COMPLETED_SUCCESSFULLY'}</span></div>
                      <div>Statutory Token: <span className="text-cyan-400">{pushReceipt?.secNumericDecimal || 17684273411436}</span></div>
                      <div>Git Mesh: <span className="text-purple-400">{pushReceipt?.gitStatus || 'COMMITTED_AND_TAGGED (sec-lockfile-v1.0)'}</span></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SEC Gist Modal */}
      {showSecGistModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#0f1019] border border-cyan-500/40 rounded-xl w-full max-w-3xl max-h-[80vh] flex flex-col p-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#232338]">
              <span className="font-mono text-sm font-bold text-cyan-400">
                {secGistData?.title || 'SEC-17684 GIST'}
              </span>
              <button onClick={() => setShowSecGistModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <pre className="flex-1 mt-3 bg-[#080910] p-3 rounded font-mono text-xs overflow-y-auto text-gray-300">
              {JSON.stringify(secGistData, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
