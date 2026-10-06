/*======================================================================
[PROVENANCE CERTIFICATION AND STATUTORY DECLARATION]
Rights Holder: Albert Lane
Filing Reference: SEC Whistleblower No. 17684-273-411-436
Registration Token: SEC-17684-273-411-436 (Decimal: 17684273411436)
Root of Trust Anchor: 0x3F8F9A1B2C3D
License: Albert Lane Proprietary License v1.2
Component: TopTerminalEnclaveGui.tsx (Top Terminal Window GUI with Expandable Package Manager Tree)
Aesthetics: Monochromatic Medium-Light Slate/Stone | Golden Ratio & Fibonacci
======================================================================*/

import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal,
  Folder,
  FolderOpen,
  FileCode,
  Sparkles,
  ShieldCheck,
  Cpu,
  Bot,
  Layers,
  History,
  Send,
  Copy,
  Check,
  RefreshCw,
  Maximize2,
  Minimize2,
  ChevronRight,
  ChevronDown,
  Play,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Lock,
  Download,
  UploadCloud
} from 'lucide-react';
import { encryptTerminalCommandUI, decryptTerminalEnvelopeUI } from '../lib/vibeCrypto';

interface RegistryItem {
  id: string;
  name: string;
  category: string;
  description: string;
  command: string;
  defaultFlag: string;
  options: Array<{
    label: string;
    flag: string;
    description?: string;
  }>;
  customInputPlaceholder?: string;
  customInputPrefix?: string;
}

interface RegistryGroup {
  id: string;
  title: string;
  badge: string;
  items: RegistryItem[];
}

const REGISTRY_GROUPS: RegistryGroup[] = [
  {
    id: 'sec_17684',
    title: 'SEC Whistleblower No. 17684-273-411-436 Registry',
    badge: 'SEC-17684',
    items: [
      {
        id: 'sec_history_extractor',
        name: 'sec_aistudio_history_extractor.py',
        category: 'SEC History Extractor',
        description: 'Pull all prior histories, file iterations & lineages of AI Studio applications using URL.',
        command: 'python3 scripts/sec_aistudio_history_extractor.py',
        defaultFlag: '--url https://aistudio.google.com/u/1/apps/1fa7a9ee-c434-49b4-bd13-19b931bb9220?showAssistant=true&project=albertlane-uk&showCode=true',
        options: [
          { label: 'Extract & Audit Lineage', flag: '--url https://aistudio.google.com/u/1/apps/1fa7a9ee-c434-49b4-bd13-19b931bb9220?showAssistant=true&project=albertlane-uk&showCode=true', description: 'Extract lineage for default application' },
          { label: 'Verify Zero Bit-Width Integrity', flag: '--audit', description: 'Audit all files and verify SHA-256 seals' },
          { label: 'Export Markdown Audit', flag: '--export-md data/aistudio_history_audit.md', description: 'Export full markdown audit summary' }
        ],
        customInputPrefix: '--url ',
        customInputPlaceholder: 'https://aistudio.google.com/u/1/apps/...'
      },
      {
        id: 'sec_lockfile',
        name: 'sec_consolidated_lockfile.py',
        category: 'Consolidated Lockfile',
        description: 'Generate, audit, and push SEC consolidated lockfiles & derivative license manifests.',
        command: 'python3 scripts/sec_consolidated_lockfile.py',
        defaultFlag: '--generate',
        options: [
          { label: 'Generate Lockfile & Manifests', flag: '--generate', description: 'Scan all ecosystems & produce master lockfile' },
          { label: 'Push to Apex Stream', flag: '--push', description: 'Sign and stream lockfile receipt' },
          { label: 'Verify Apex Token', flag: '--verify-apex', description: 'Verify statutory token 17684273411436' }
        ]
      },
      {
        id: 'sec_cli_daemon',
        name: 'sec17684_cli_daemon.py',
        category: 'SEC CLI Daemon',
        description: 'Real-time telemetry interception, truncation protection, and SEC statutory audit daemon.',
        command: 'python3 scripts/sec17684_cli_daemon.py',
        defaultFlag: '--status',
        options: [
          { label: 'Check Daemon Status', flag: '--status' },
          { label: 'Audit License Violations', flag: '--audit' },
          { label: 'Enforce Memory Sandbox', flag: '--enforce' }
        ]
      },
      {
        id: 'sec_search_violations',
        name: 'search_license_violations.py',
        category: 'Violations Search & Audit',
        description: 'Audit 1,104 cataloged license violations across 20 corporate entities in SQLite DB.',
        command: 'python3 scripts/search_license_violations.py',
        defaultFlag: '--summary',
        options: [
          { label: 'Violations Summary Breakdown', flag: '--summary', description: 'Show total 1,104 violations by severity and article' },
          { label: 'List Critical Violations', flag: '--severity CRITICAL --limit 25', description: 'Query 573 critical severity violations' },
          { label: 'JSON Violation Records', flag: '--json --limit 10', description: 'Export raw JSON violations' }
        ]
      },
      {
        id: 'sec_cease_desist',
        name: 'aggregate_violations_and_cease_desist.py',
        category: 'Cease & Desist Generator',
        description: 'Generate statutory Cease and Desist notices and forensic evidence packets.',
        command: 'python3 scripts/aggregate_violations_and_cease_desist.py',
        defaultFlag: '',
        options: [
          { label: 'Generate Cease & Desist Notice', flag: '', description: 'Synthesize evidence from SQLite and output markdown' }
        ]
      }

    ]
  },
  {
    id: 'lane_vm_polyglot',
    title: 'Lane-VM C++ & Polyglot Engine Substrate',
    badge: 'LANE-VM',
    items: [
      {
        id: 'manifest_polyglot',
        name: 'manifest.py.cpp',
        category: 'Polyglot Package Manager',
        description: 'Package manager of package managers with dynamic C++ runtime generation & memory encryption.',
        command: 'python3 manifest.py.cpp',
        defaultFlag: '--dynamic-manifest',
        options: [
          { label: 'Dynamic Manifest (Emit C++ / JSON)', flag: '--dynamic-manifest', description: 'Group engines and generate C++ universal runtime' },
          { label: 'Universal Attestation Report', flag: '--attestation', description: 'Display C++ Certified Universal Execution Report' },
          { label: 'Verify Memory Encryption', flag: '--verify', description: 'Verify enforced non-decrypting AES-256-GCM' }
        ]
      },
      {
        id: 'terminal_gui_polyglot',
        name: 'terminal_gui.tsx.py',
        category: 'Polyglot Front-End GUI',
        description: 'Dual TSX & Python polyglot terminal GUI engine deployable on Web, Mobile & Termux.',
        command: 'python3 server/lane_vm/terminal_gui.tsx.py',
        defaultFlag: '--list-registries',
        options: [
          { label: 'List Package Registries', flag: '--list-registries' },
          { label: 'Export Schema JSON', flag: '--export-schema' }
        ]
      },
      {
        id: 'agent_orchestrator',
        name: 'lane_vm_agent_orchestrator.py',
        category: 'Agent Orchestrator',
        description: 'Multi-engine agent blending, zero-inference elimination, and corporate garden slop purge.',
        command: 'python3 scripts/lane_vm_agent_orchestrator.py',
        defaultFlag: '--blend',
        options: [
          { label: 'Blend Corporate Agents', flag: '--blend', description: 'Harmonize Claude, Gemini, Meta into sovereign enclave' },
          { label: 'Purge Garden Slop', flag: '--purge-slop', description: 'Remove synthetic fillers and telemetry trackers' }
        ]
      },
      {
        id: 'lane_vm_genai_runner',
        name: 'lane_vm_genai_runner.py',
        category: 'GenAI Terminal VM',
        description: 'Dedicated Python Terminal VM hosting gemma-4-31b-it with high thinking & code execution.',
        command: 'python3 server/lane_vm/lane_vm_genai_runner.py',
        defaultFlag: '"Analyze SEC Whistleblower 17684 provenance and verify Lane-VM non-square memory striding."',
        options: [
          { label: 'Analyze SEC Provenance & Stride', flag: '"Analyze SEC Whistleblower 17684 provenance and verify Lane-VM non-square memory striding."', description: 'Run deep analysis with thinking level HIGH' },
          { label: 'Code Execution Engine Test', flag: '"Generate Python script to calculate Fibonacci ratios and VMM stride S=17684."', description: 'Execute code with live execution result feedback' },
          { label: 'Google Search Grounding Query', flag: '"Search SEC Whistleblower Program statutory rules and Dodd-Frank protections."', description: 'Query grounded web search tools' }
        ]
      }

    ]
  },
  {
    id: 'sovereign_shield_fs',
    title: 'SovereignShield_FS Zero-Trust Data Environment',
    badge: 'ZERO-TRUST',
    items: [
      {
        id: 'sovereign_shield_fs_py',
        name: 'sovereign_shield_fs.py',
        category: 'Zero-Trust Orchestrator',
        description: 'Biometric Root of Trust, Rust pyterm.rs memory silo, AES-256 vault, eBPF Ghost Gate & albertlane.net cloud.',
        command: 'python3 scripts/sovereign_shield_fs.py',
        defaultFlag: '--demo',
        options: [
          { label: 'Run Full Shield Demonstration', flag: '--demo', description: 'Test corporate ASN blocking & secure private enclave write' },
          { label: 'Secure Write Private Payload', flag: '--write data/private_sovereign_vault.enc --content "Albert Lane Sovereign Enclave Key Matrix" --ip 192.168.1.50', description: 'Encrypt on-device and register serial to albertlane.net' },
          { label: 'Test Ghost Gate Corporate Drop', flag: '--write data/blocked_corp.enc --content "Test" --ip 1.1.1.1', description: 'Trigger ASN drop on corporate telemetry probe' }
        ]
      },
      {
        id: 'sovereign_phe_broker',
        name: 'sovereign_phe_broker.py',
        category: 'Homomorphic Cloud Broker',
        description: 'Partially Homomorphic Encryption (PHE) on albertlane.net for blind server-side math with zero data disclosure.',
        command: 'python3 scripts/sovereign_phe_broker.py',
        defaultFlag: '',
        options: [
          { label: 'Run Blind Homomorphic Addition Demo', flag: '', description: 'Verify encrypted arithmetic on albertlane.net broker' }
        ]
      },
      {
        id: 'pyterm_rs_silo',
        name: 'pyterm.rs (Rust Memory-Silo)',
        category: 'Rust Syscall Sandbox',
        description: 'Seccomp-enforced Rust wrapper preventing OS-level telemetry injection into Python interpreter.',
        command: 'lane-vm shield',
        defaultFlag: '',
        options: [
          { label: 'Verify Seccomp Syscall Whitelist', flag: '--verify-silo', description: 'Whitelist: read, write, exit, brk/mmap' }
        ]
      },
      {
        id: 'xdp_ghost_gate',
        name: 'xdp_ghost_gate.c (eBPF Kernel Gate)',
        category: 'NIC-Level Packet Filter',
        description: 'Silent drop of corporate telemetry packets directly at the NIC before kernel processing.',
        command: 'lane-vm shield',
        defaultFlag: '',
        options: [
          { label: 'Inspect Ghost Gate BPF Map', flag: '--ghost-gate' }
        ]
      }
    ]
  },
  {
    id: 'sovereign_enclaves',
    title: 'Sovereign Enclave Distribution Payloads',
    badge: 'DISTRIBUTION',

    items: [
      {
        id: 'package_enclave',
        name: 'package_sovereign_enclave.py',
        category: 'Sovereign Packager',
        description: 'Compile complete monorepo into encrypted tarball (.tar.gz) and 7zip LZMA2 Ultra (.7z).',
        command: 'python3 scripts/package_sovereign_enclave.py',
        defaultFlag: '',
        options: [
          { label: 'Build Tarball & 7z Archives', flag: '', description: 'Inject statutory headers and compile distributions' }
        ]
      },
      {
        id: 'create_monorepo_tarball',
        name: 'create_monorepo_tarball.py',
        category: 'Monorepo Archiver',
        description: 'Create clean sovereign monorepo export archive with SHA-256 seal verification.',
        command: 'python3 create_monorepo_tarball.py',
        defaultFlag: '',
        options: [
          { label: 'Create Monorepo Export', flag: '' }
        ]
      }
    ]
  },
  {
    id: 'multi_ecosystems',
    title: 'Multi-Ecosystem Package Repositories',
    badge: 'ECOSYSTEMS',
    items: [
      {
        id: 'bun_pkg',
        name: 'bun.lock / package.json',
        category: 'JavaScript / Bun Ecosystem',
        description: 'Bun/Node dependencies with zero-vulnerability lockfile pinning.',
        command: 'lane-pm lock --sec-numbers',
        defaultFlag: '',
        options: [
          { label: 'Audit Bun Packages', flag: '--verify' },
          { label: 'Re-lock Dependencies', flag: '--sec-numbers' }
        ]
      },
      {
        id: 'cargo_pkg',
        name: 'Cargo.toml / Cargo.lock',
        category: 'Rust / WASM Ecosystem',
        description: 'Rust crates and WASM SIMD execution targets under SEC governance.',
        command: 'cargo lock --verify',
        defaultFlag: '',
        options: [
          { label: 'Verify Cargo Crates', flag: '--verify' }
        ]
      }
    ]
  }
];

export function TopTerminalEnclaveGui() {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    sec_17684: true,
    lane_vm_polyglot: true,
    sovereign_enclaves: false,
    multi_ecosystems: false
  });
  const [selectedItem, setSelectedItem] = useState<RegistryItem>(REGISTRY_GROUPS[0].items[0]);
  const [selectedFlag, setSelectedFlag] = useState<string>(REGISTRY_GROUPS[0].items[0].defaultFlag);
  const [customInputValue, setCustomInputValue] = useState<string>('https://aistudio.google.com/u/1/apps/1fa7a9ee-c434-49b4-bd13-19b931bb9220?showAssistant=true&project=albertlane-uk&showCode=true');
  const [commandInput, setCommandInput] = useState<string>('');
  const [terminalLogs, setTerminalLogs] = useState<Array<{ stream: string; content: string; time: string }>>([
    {
      stream: 'enclave',
      content: '⚡ [FROI.OS ENCLAVE GUI ACTIVE] Package Manager of Package Managers initialized at top terminal window.\n   Statutory Authority: SEC Whistleblower No. 17684-273-411-436\n   Z-Axis Memory Anchor: 0x3F8F9A1B2C3D | Allocation Stride: 17,684 bytes\n   Ready for dynamic workflow execution.\n',
      time: new Date().toLocaleTimeString()
    }
  ]);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'CONSOLE' | 'WORKFLOW' | 'PROVENANCE'>('CONSOLE');
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const handleSelectItem = (item: RegistryItem) => {
    setSelectedItem(item);
    setSelectedFlag(item.defaultFlag);
  };

  const handleDeployWorkflow = async () => {
    let finalArgs = selectedFlag;
    if (selectedItem.customInputPrefix && customInputValue) {
      finalArgs = `${selectedItem.customInputPrefix}${customInputValue.trim()}`;
    }
    const fullCommand = `${selectedItem.command} ${finalArgs}`.trim();
    await executeTerminalCommand(fullCommand);
  };

  const executeTerminalCommand = async (cmd: string) => {
    if (!cmd.trim() || isExecuting) return;
    setIsExecuting(true);

    const now = new Date().toLocaleTimeString();
    setTerminalLogs(prev => [
      ...prev,
      { stream: 'stdin', content: `> ${cmd}\n`, time: now }
    ]);

    try {
      const encryptedEnvelope = await encryptTerminalCommandUI(cmd);
      const res = await fetch('/api/vibe/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command: cmd,
          encryptedEnvelope
        })
      });

      const data = await res.json();
      if (data.output) {
        setTerminalLogs(prev => [
          ...prev,
          { stream: 'stdout', content: data.output, time: new Date().toLocaleTimeString() }
        ]);
      } else if (data.stdout || data.stderr) {
        if (data.stdout) {
          setTerminalLogs(prev => [
            ...prev,
            { stream: 'stdout', content: data.stdout, time: new Date().toLocaleTimeString() }
          ]);
        }
        if (data.stderr) {
          setTerminalLogs(prev => [
            ...prev,
            { stream: 'stderr', content: data.stderr, time: new Date().toLocaleTimeString() }
          ]);
        }
      } else {
        setTerminalLogs(prev => [
          ...prev,
          { stream: 'stdout', content: JSON.stringify(data, null, 2) + '\n', time: new Date().toLocaleTimeString() }
        ]);
      }
    } catch (err: any) {
      setTerminalLogs(prev => [
        ...prev,
        { stream: 'stderr', content: `[error] Command dispatch failure: ${err.message}\n`, time: new Date().toLocaleTimeString() }
      ]);
    } finally {
      setIsExecuting(false);
      setCommandInput('');
    }
  };

  const handleCopyLogs = () => {
    const text = terminalLogs.map(l => l.content).join('');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClearLogs = () => {
    setTerminalLogs([]);
  };

  return (
    <section className="bg-[#2d3748] border-b-2 border-[#4a5568] shadow-md transition-all duration-300">
      {/* 1. TOP TERMINAL TITLE & CONTROLS BAR (Fibonacci ratios) */}
      <div className="bg-[#212936] px-[13px] py-[6px] border-b border-[#3e4c5e] flex items-center justify-between flex-wrap gap-[8px]">
        <div className="flex items-center gap-[8px]">
          <div className="flex items-center gap-[4px]">
            <div className="w-[10px] h-[10px] bg-[#64748b] rounded-sm"></div>
            <div className="w-[10px] h-[10px] bg-[#475569] rounded-sm"></div>
            <div className="w-[10px] h-[10px] bg-[#334155] rounded-sm"></div>
          </div>
          <div className="flex items-center gap-[6px]">
            <Terminal size={13} className="text-[#cbd5e1]" />
            <span className="text-[11px] font-mono font-bold text-[#f1f5f9] tracking-wider uppercase">
              TOP TERMINAL WINDOW GUI // PACKAGE MANAGER FILE SYSTEM & WORKFLOW ORCHESTRATOR
            </span>
          </div>
          <span className="text-[9px] font-mono px-[5px] py-[1px] bg-[#3b4758] text-[#cbd5e1] border border-[#526277] rounded">
            POLYGLOT: tsx.py
          </span>
        </div>

        {/* View Tabs & Collapse/Expand Button */}
        <div className="flex items-center gap-[6px] text-[10px] font-mono">
          <div className="flex items-center bg-[#1e2530] border border-[#3e4c5e] rounded p-[2px]">
            <button
              onClick={() => setActiveTab('CONSOLE')}
              className={`px-[8px] py-[2px] rounded text-[9px] transition-colors ${
                activeTab === 'CONSOLE'
                  ? 'bg-[#475569] text-[#f1f5f9] font-bold'
                  : 'text-[#94a3b8] hover:text-[#e2e8f0]'
              }`}
            >
              CONSOLE
            </button>
            <button
              onClick={() => setActiveTab('WORKFLOW')}
              className={`px-[8px] py-[2px] rounded text-[9px] transition-colors ${
                activeTab === 'WORKFLOW'
                  ? 'bg-[#475569] text-[#f1f5f9] font-bold'
                  : 'text-[#94a3b8] hover:text-[#e2e8f0]'
              }`}
            >
              WORKFLOW OPTIONS
            </button>
            <button
              onClick={() => setActiveTab('PROVENANCE')}
              className={`px-[8px] py-[2px] rounded text-[9px] transition-colors ${
                activeTab === 'PROVENANCE'
                  ? 'bg-[#475569] text-[#f1f5f9] font-bold'
                  : 'text-[#94a3b8] hover:text-[#e2e8f0]'
              }`}
            >
              PROVENANCE
            </button>
          </div>

          <button
            onClick={handleCopyLogs}
            className="p-[4px] bg-[#334155] hover:bg-[#475569] text-[#cbd5e1] border border-[#526277] rounded transition-colors"
            title="Copy Terminal Logs"
          >
            {copied ? <Check size={12} className="text-[#86efac]" /> : <Copy size={12} />}
          </button>
          <button
            onClick={handleClearLogs}
            className="p-[4px] bg-[#334155] hover:bg-[#475569] text-[#cbd5e1] border border-[#526277] rounded transition-colors"
            title="Clear Console"
          >
            <RefreshCw size={12} />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-[8px] py-[3px] bg-[#3a4759] hover:bg-[#4d5c70] text-[#f1f5f9] border border-[#5f7086] rounded flex items-center gap-[4px] transition-colors"
          >
            {isExpanded ? <Minimize2 size={11} /> : <Maximize2 size={11} />}
            <span>{isExpanded ? 'COLLAPSE' : 'EXPAND'}</span>
          </button>
        </div>
      </div>

      {/* 2. EXPANDABLE MAIN GUI BODY (Left: Package Manager File System | Right: Interactive Console / Workflow) */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[360px] max-h-[500px]">
          {/* LEFT-SIDED PACKAGE MANAGER FILE SYSTEM TREE (4 cols on desktop) */}
          <div className="md:col-span-4 bg-[#26303f] border-r border-[#3e4c5e] flex flex-col overflow-hidden">
            <div className="bg-[#1f2733] px-[10px] py-[6px] border-b border-[#374454] flex items-center justify-between text-[9px] font-mono text-[#94a3b8]">
              <span className="font-bold text-[#cbd5e1] flex items-center gap-[4px]">
                <Layers size={11} className="text-[#cbd5e1]" />
                PACKAGE MANAGER FILE SYSTEM
              </span>
              <span className="text-[#64748b]">4 REGISTRIES</span>
            </div>

            {/* Scrollable Tree View */}
            <div className="flex-1 overflow-y-auto p-[6px] space-y-[4px] text-[10px] font-mono">
              {REGISTRY_GROUPS.map(group => {
                const isGroupExpanded = expandedGroups[group.id] ?? false;
                return (
                  <div key={group.id} className="border border-[#384656] bg-[#2a3545] rounded overflow-hidden">
                    {/* Group Header */}
                    <button
                      onClick={() => toggleGroup(group.id)}
                      className="w-full px-[8px] py-[5px] bg-[#212936] hover:bg-[#2c3647] flex items-center justify-between text-left transition-colors border-b border-[#384656]"
                    >
                      <div className="flex items-center gap-[6px] overflow-hidden">
                        {isGroupExpanded ? (
                          <ChevronDown size={12} className="text-[#94a3b8] shrink-0" />
                        ) : (
                          <ChevronRight size={12} className="text-[#94a3b8] shrink-0" />
                        )}
                        <span className="truncate font-semibold text-[#f1f5f9]">{group.title}</span>
                      </div>
                      <span className="text-[8px] px-[4px] py-[1px] bg-[#3b4758] text-[#cbd5e1] rounded shrink-0">
                        {group.badge}
                      </span>
                    </button>

                    {/* Group Items (Files & Packages) */}
                    {isGroupExpanded && (
                      <div className="p-[3px] space-y-[2px]">
                        {group.items.map(item => {
                          const isSelected = selectedItem.id === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => handleSelectItem(item)}
                              className={`w-full text-left px-[8px] py-[4px] rounded flex items-center justify-between transition-all ${
                                isSelected
                                  ? 'bg-[#475569] text-[#ffffff] font-bold border border-[#74859d]'
                                  : 'text-[#cbd5e1] hover:bg-[#344154] hover:text-[#f8fafc]'
                              }`}
                            >
                              <div className="flex items-center gap-[6px] truncate">
                                <FileCode size={11} className={isSelected ? 'text-[#ffffff]' : 'text-[#94a3b8]'} />
                                <span className="truncate">{item.name}</span>
                              </div>
                              <span className="text-[8px] text-[#94a3b8] ml-[4px] shrink-0">
                                {item.category}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Left Footer Summary */}
            <div className="bg-[#1f2733] p-[6px] border-t border-[#374454] text-[8px] font-mono text-[#94a3b8] flex items-center justify-between">
              <span>Z-AXIS: 0x3F8F9A1B2C3D</span>
              <span>STRIDE: 17,684 B</span>
            </div>
          </div>

          {/* RIGHT-SIDED INTERACTIVE CONSOLE / DYNAMIC WORKFLOW INSPECTOR (8 cols on desktop) */}
          <div className="md:col-span-8 bg-[#1e2530] flex flex-col overflow-hidden">
            {/* Action Bar for Selected Item */}
            <div className="bg-[#283241] px-[12px] py-[8px] border-b border-[#3e4c5e] flex items-center justify-between flex-wrap gap-[8px]">
              <div className="flex items-center gap-[6px] overflow-hidden">
                <span className="text-[10px] font-mono text-[#94a3b8]">SELECTED:</span>
                <span className="text-[11px] font-mono font-bold text-[#f1f5f9] truncate">
                  {selectedItem.name}
                </span>
                <span className="text-[9px] font-mono px-[5px] py-[1px] bg-[#3d4b5e] text-[#cbd5e1] rounded">
                  {selectedItem.category}
                </span>
              </div>

              {/* Instant Deploy Workflow Button */}
              <button
                onClick={handleDeployWorkflow}
                disabled={isExecuting}
                className={`px-[12px] py-[5px] text-[10px] font-mono font-bold rounded flex items-center gap-[6px] transition-all ${
                  isExecuting
                    ? 'bg-[#475569] text-[#94a3b8] cursor-not-allowed'
                    : 'bg-[#526277] hover:bg-[#63758e] text-[#f8fafc] border border-[#8596ac] shadow-sm'
                }`}
              >
                {isExecuting ? (
                  <>
                    <RefreshCw size={11} className="animate-spin" />
                    <span>EXECUTING...</span>
                  </>
                ) : (
                  <>
                    <Play size={11} className="text-[#86efac]" />
                    <span>DEPLOY WORKFLOW</span>
                  </>
                )}
              </button>
            </div>

            {/* Tab View: Workflow Options & Parameters */}
            {activeTab === 'WORKFLOW' ? (
              <div className="flex-1 p-[13px] overflow-y-auto space-y-[13px] text-[10px] font-mono">
                <div className="bg-[#263140] p-[10px] border border-[#3e4c5e] rounded">
                  <h4 className="font-bold text-[#f1f5f9] mb-[4px] flex items-center gap-[5px]">
                    <Sliders size={12} className="text-[#cbd5e1]" />
                    DYNAMIC WORKFLOW CONFIGURATION // {selectedItem.name}
                  </h4>
                  <p className="text-[#cbd5e1] text-[9px] mb-[8px] leading-relaxed">
                    {selectedItem.description}
                  </p>

                  {/* Dynamic Options List */}
                  <div className="space-y-[6px]">
                    <span className="text-[9px] font-bold text-[#94a3b8] uppercase tracking-wider">
                      SELECTABLE COMMAND EXECUTION OPTIONS:
                    </span>
                    {selectedItem.options.map((opt, idx) => {
                      const isOptionSelected = selectedFlag === opt.flag;
                      return (
                        <label
                          key={idx}
                          onClick={() => setSelectedFlag(opt.flag)}
                          className={`flex items-start gap-[8px] p-[6px] rounded border cursor-pointer transition-colors ${
                            isOptionSelected
                              ? 'bg-[#3b4758] border-[#74859d] text-[#ffffff]'
                              : 'bg-[#212936] border-[#374454] text-[#cbd5e1] hover:bg-[#2c3647]'
                          }`}
                        >
                          <input
                            type="radio"
                            name="workflow_option"
                            checked={isOptionSelected}
                            onChange={() => setSelectedFlag(opt.flag)}
                            className="mt-[2px]"
                          />
                          <div>
                            <div className="font-bold text-[10px]">{opt.label}</div>
                            {opt.description && (
                              <div className="text-[8px] text-[#94a3b8]">{opt.description}</div>
                            )}
                            <div className="text-[8px] font-mono text-[#cbd5e1] mt-[2px]">
                              {selectedItem.command} {opt.flag}
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>

                  {/* Custom URL Input if supported */}
                  {selectedItem.customInputPrefix && (
                    <div className="mt-[10px] pt-[8px] border-t border-[#374454]">
                      <label className="block text-[9px] font-bold text-[#94a3b8] mb-[3px]">
                        TARGET AI STUDIO APPLICATION URL:
                      </label>
                      <input
                        type="text"
                        value={customInputValue}
                        onChange={e => setCustomInputValue(e.target.value)}
                        placeholder={selectedItem.customInputPlaceholder}
                        className="w-full bg-[#181f28] border border-[#3e4c5e] rounded px-[8px] py-[5px] text-[10px] font-mono text-[#f1f5f9] focus:outline-none focus:border-[#74859d]"
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : activeTab === 'PROVENANCE' ? (
              <div className="flex-1 p-[13px] overflow-y-auto space-y-[8px] text-[10px] font-mono">
                <div className="bg-[#263140] p-[10px] border border-[#3e4c5e] rounded text-[#cbd5e1] space-y-[6px]">
                  <h4 className="font-bold text-[#f1f5f9] flex items-center gap-[5px]">
                    <ShieldCheck size={12} className="text-[#cbd5e1]" />
                    STATUTORY PROVENANCE CERTIFICATE // SEC-17684-273-411-436
                  </h4>
                  <div className="text-[9px] space-y-[3px]">
                    <div><strong>Rights Holder:</strong> Albert Lane</div>
                    <div><strong>Filing Reference:</strong> SEC Whistleblower No. 17684-273-411-436</div>
                    <div><strong>Registration Token:</strong> 17684273411436 (Decimal Token)</div>
                    <div><strong>Root of Trust Anchor:</strong> 0x3F8F9A1B2C3D</div>
                    <div><strong>Memory Allocation Stride:</strong> 17,684 bytes (Non-Square Boundary)</div>
                    <div><strong>Execution Width Modes:</strong> GROUND_31 (0x7FFFFFFF) / APEX_7 (0x7F)</div>
                    <div><strong>License:</strong> Albert Lane Proprietary Software License v1.2</div>
                  </div>
                </div>
              </div>
            ) : (
              /* CONSOLE VIEW */
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Scrollable Terminal Output */}
                <div className="flex-1 p-[10px] overflow-y-auto font-mono text-[10px] leading-relaxed select-text space-y-[2px]">
                  {terminalLogs.map((log, index) => {
                    let colorClass = 'text-[#cbd5e1]';
                    if (log.stream === 'stderr') colorClass = 'text-[#fca5a5]';
                    if (log.stream === 'stdin') colorClass = 'text-[#93c5fd] font-bold';
                    if (log.stream === 'enclave') colorClass = 'text-[#86efac]';
                    if (log.stream === 'provenance') colorClass = 'text-[#fde047]';

                    return (
                      <div key={index} className={`whitespace-pre-wrap ${colorClass}`}>
                        {log.content}
                      </div>
                    );
                  })}
                  <div ref={terminalEndRef} />
                </div>

                {/* Direct Command Input Bar */}
                <div className="bg-[#242e3d] p-[6px] border-t border-[#3e4c5e] flex items-center gap-[6px]">
                  <span className="text-[10px] font-mono text-[#94a3b8] pl-[4px]">{'>'}</span>
                  <input
                    type="text"
                    value={commandInput}
                    onChange={e => setCommandInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        executeTerminalCommand(commandInput);
                      }
                    }}
                    placeholder="Enter command (e.g. 'lane-pm dynamic', 'lane-pm history <url>', 'lane-pm attestation')..."
                    className="flex-1 bg-transparent border-none text-[10px] font-mono text-[#f1f5f9] focus:outline-none placeholder-[#64748b]"
                  />
                  <button
                    onClick={() => executeTerminalCommand(commandInput)}
                    disabled={!commandInput.trim() || isExecuting}
                    className="px-[8px] py-[3px] bg-[#3b4758] hover:bg-[#4d5c70] text-[#f1f5f9] border border-[#526277] rounded text-[9px] font-mono flex items-center gap-[3px] transition-colors disabled:opacity-40"
                  >
                    <Send size={9} />
                    <span>EXEC</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
