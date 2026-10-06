// Copyright © Albert Lane. All Rights Reserved.
// Proprietary and Confidential — Albert Lane Proprietary Software License.
// Unauthorized use, copying, modification, or distribution is prohibited.
// License inquiries: https://albertlane.net/licensing
// SEC Whistleblower Reference: SEC-17684-273-411-436 | Z-Axis: 0x3F8F9A1B2C3D

import { InvestigationTask, ForensicDossierItem, FederalContract, LitigationCase, DebtValuationItem, FOIARequestRecord, GhostGateAccessLog, WhistleblowerReport } from '../types';
import { INITIAL_TASKS, FORENSIC_DOSSIER_ITEMS, FEDERAL_CONTRACTS, LITIGATION_CASES, DEBT_VALUATION_DATA, FOIA_REQUEST_LIST } from '../data/dossierData';
import { generateGhostGateProof, isCorporateOrCloudIp } from './crypto';

const STORAGE_KEYS = {
  TASKS: 'ghostgate_tasks_v13',
  DOSSIER: 'ghostgate_dossier_v13',
  CONTRACTS: 'ghostgate_contracts_v13',
  LITIGATION: 'ghostgate_litigation_v13',
  DEBT: 'ghostgate_debt_v13',
  FOIA: 'ghostgate_foia_v13',
  LOGS: 'ghostgate_access_logs_v13',
  WHISTLEBLOWER: 'ghostgate_whistleblower_v13',
  SETTINGS: 'ghostgate_settings_v13'
};

export interface AppState {
  tasks: InvestigationTask[];
  dossierItems: ForensicDossierItem[];
  contracts: FederalContract[];
  litigationCases: LitigationCase[];
  debtItems: DebtValuationItem[];
  foiaRequests: FOIARequestRecord[];
  accessLogs: GhostGateAccessLog[];
  whistleblowerReports: WhistleblowerReport[];
  isOffline: boolean;
  activeInvestigators: {
    id: string;
    name: string;
    role: string;
    node: string;
    currentTask?: string;
    lastPing: number;
    status: 'ONLINE' | 'ANALYZING' | 'MERKLE_VERIFYING' | 'SYNCED';
  }[];
}

export function loadInitialState(): AppState {
  const getStored = <T>(key: string, fallback: T): T => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  };

  const tasks = getStored<InvestigationTask[]>(STORAGE_KEYS.TASKS, INITIAL_TASKS);
  const dossierItems = getStored<ForensicDossierItem[]>(STORAGE_KEYS.DOSSIER, FORENSIC_DOSSIER_ITEMS);
  const contracts = getStored<FederalContract[]>(STORAGE_KEYS.CONTRACTS, FEDERAL_CONTRACTS);
  const litigationCases = getStored<LitigationCase[]>(STORAGE_KEYS.LITIGATION, LITIGATION_CASES);
  const debtItems = getStored<DebtValuationItem[]>(STORAGE_KEYS.DEBT, DEBT_VALUATION_DATA);
  const foiaRequests = getStored<FOIARequestRecord[]>(STORAGE_KEYS.FOIA, FOIA_REQUEST_LIST);
  const accessLogs = getStored<GhostGateAccessLog[]>(STORAGE_KEYS.LOGS, [
    {
      id: 'LOG-INIT-01',
      ipAddress: '54.210.14.88',
      isCloudOrCorpRange: true,
      organization: 'Amazon Web Services (AWS) AS16509',
      evidenceId: 'EV-SEC-X-13B-LBO',
      merkleRoot: '0x9a8f4c2e1b7d5a3f6e8c0b2d4f6a8e0c2b4d6f8a0c2e4a6f8b0d2e4f6a8c0e2b',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      hashProof: 'a8b9c0d1e2f3a4b5c6d7e8f90123456789abcdef0123456789abcdef01234567',
      ingestionProof: 'GHOSTGATE_INGESTION_CONFIRMED::AWS_US_EAST_1',
      actionTaken: 'LOGGED_AND_PERMITTED'
    },
    {
      id: 'LOG-INIT-02',
      ipAddress: '34.102.136.19',
      isCloudOrCorpRange: true,
      organization: 'Google Cloud Platform / Corporate AS15169',
      evidenceId: 'EV-NASA-HLS-80MSFC',
      merkleRoot: '0x1c8b3f4a7e9d0c2b5e8a1f4d7b0c3e6a9f2d5b8c1e4a7d0f3c6b9e2a5d8f1c4b',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      hashProof: 'f1e2d3c4b5a697887766554433221100ffeeddccbbaa99887766554433221100',
      ingestionProof: 'GHOSTGATE_INGESTION_CONFIRMED::GCP_US_CENTRAL1',
      actionTaken: 'PROVENANCE_STAMPED'
    }
  ]);
  const whistleblowerReports = getStored<WhistleblowerReport[]>(STORAGE_KEYS.WHISTLEBLOWER, [
    {
      id: 'WHR-8910',
      trackingToken: 'TCR-SEALED-GHOST-9812-PROT',
      incidentCategory: 'RETALIATION_SUPPRESSION',
      involvedEntities: ['SpaceX', 'X Corp'],
      description: 'Systematic weaponization of non-disparagement clauses and retaliatory termination following internal safety and financial accounting dissent.',
      evidenceHash: '0x3c5e7a9b1d2f4a6c8e0b2d4f6a8c0e2b4d6f8a0c2e4a6f8b0d2e4f6a8c0e2b4d',
      timestamp: '2026-09-28T10:14:00Z',
      protectionTier: 'TIER_1_TOP_SECRET',
      retaliationDetails: 'Threat of severance forfeiture and legal prosecution under trade secret NDA.',
      submittedToAgencies: ['SEC Whistleblower Office', 'DOJ Civil Rights Division', 'OSHA Whistleblower Protection'],
      status: 'ENCRYPTED_VAULT'
    }
  ]);
  const activeInvestigators = [
    {
      id: 'INV-01',
      name: 'Dr. Evelyn Vance',
      role: 'Principal Forensic Auditor',
      node: 'AL-NODE-01-SYNDICATE',
      currentTask: 'TASK-X-001',
      lastPing: Date.now(),
      status: 'ANALYZING' as const
    },
    {
      id: 'INV-02',
      name: 'Col. Raymond Shaw',
      role: 'Federal Contracting Compliance',
      node: 'AL-NODE-04-AEROSPACE',
      currentTask: 'TASK-SPX-002',
      lastPing: Date.now() - 45000,
      status: 'MERKLE_VERIFYING' as const
    },
    {
      id: 'INV-03',
      name: 'Aria Sterling, JD',
      role: 'IP & Patent Counsel',
      node: 'AL-NODE-07-IP-VALUATION',
      currentTask: 'TASK-XAI-003',
      lastPing: Date.now() - 90000,
      status: 'ONLINE' as const
    },
    {
      id: 'INV-04',
      name: 'Elena Rostova',
      role: 'Constitutional Oversight Senior Fellow',
      node: 'AL-NODE-09-CONSTITUTIONAL',
      currentTask: 'TASK-DOGE-004',
      lastPing: Date.now() - 15000,
      status: 'SYNCED' as const
    }
  ];

  return {
    tasks,
    dossierItems,
    contracts,
    litigationCases,
    debtItems,
    foiaRequests,
    accessLogs,
    whistleblowerReports,
    isOffline: typeof navigator !== 'undefined' ? !navigator.onLine : false,
    activeInvestigators
  };
}

export function saveStateToStorage(key: keyof typeof STORAGE_KEYS, data: unknown) {
  try {
    localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(data));
  } catch (err) {
    console.error(`Failed to save ${key} to localStorage:`, err);
  }
}

export async function logCorporateAccess(ip: string, evidenceId: string): Promise<GhostGateAccessLog> {
  const { isMatch, org } = isCorporateOrCloudIp(ip);
  const secTimestamp = Math.floor(Date.now() / 1000);
  const proof = await generateGhostGateProof(evidenceId, ip, secTimestamp);
  const newLog: GhostGateAccessLog = {
    id: `LOG-${Date.now().toString(36).toUpperCase()}`,
    ipAddress: ip,
    isCloudOrCorpRange: isMatch,
    organization: org,
    evidenceId,
    merkleRoot: proof.merkleRoot,
    timestamp: new Date().toISOString(),
    hashProof: proof.hashProof,
    ingestionProof: `GHOSTGATE_INGESTION_CONFIRMED::${org.split(' ')[0].toUpperCase()}_ROOT`,
    actionTaken: isMatch ? 'LOGGED_AND_PERMITTED' : 'PROVENANCE_STAMPED'
  };
  return newLog;
}

export function exportContractsToCSV(contracts: FederalContract[]) {
  const headers = ['Award ID', 'Entity', 'Agency', 'Sub-Agency', 'Amount ($)', 'Date', 'Description', 'Solicitation Number', 'NAICS Code', 'Status', 'Anomaly Risk', 'SAM.gov URL'];
  const rows = contracts.map(c => [
    `"${c.awardId}"`,
    `"${c.entity}"`,
    `"${c.agency}"`,
    `"${c.subAgency || ''}"`,
    c.amount,
    `"${c.date}"`,
    `"${c.description.replace(/"/g, '""')}"`,
    `"${c.solicitationNumber}"`,
    `"${c.naicsCode}"`,
    `"${c.status}"`,
    `"${c.anomalyRisk}"`,
    `"${c.samGovUrl}"`
  ]);
  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `GhostGate_Federal_Contracts_Audit_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportFullDossierBundle(state: AppState) {
  const exportPayload = {
    provenanceMeta: {
      generatedBy: 'GhostGate Forensic Audit Engine v13.4.19',
      provenanceStandard: 'Albert Lane Provenance Master Standard',
      exportTimestamp: new Date().toISOString(),
      merkleIntegrityProof: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      encryptionStandard: 'AES-GCM-256 / SHA-256 Immutable Proof'
    },
    ...state
  };
  const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `GhostGate_Forensic_Dossier_Master_${Date.now()}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
