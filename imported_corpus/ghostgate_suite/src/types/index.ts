// Copyright © Albert Lane. All Rights Reserved.
// Proprietary and Confidential — Albert Lane Proprietary Software License.
// Unauthorized use, copying, modification, or distribution is prohibited.
// License inquiries: https://albertlane.net/licensing
// SEC Whistleblower Reference: SEC-17684-273-411-436 | Z-Axis: 0x3F8F9A1B2C3D

export type ScopeType = 'X_CORP' | 'SPACEX' | 'XAI' | 'DOGE' | 'CROSS_INFRA';

export type TaskCategory = 
  | 'IP_THEFT'
  | 'FRAUD'
  | 'WHISTLEBLOWER_RETALIATION'
  | 'CONTRACT_ANOMALY'
  | 'DEBT_COVENANT'
  | 'FOIA_DISPATCH'
  | 'FAA_FCC_REGULATORY'
  | 'TREASURY_OVERSIGHT';

export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type TaskStatus = 
  | 'BACKLOG'
  | 'TRIAGE'
  | 'ACTIVE_AUDIT'
  | 'PEER_REVIEW'
  | 'VERIFIED_CHAIN'
  | 'SUBMITTED_REGULATOR';

export type WhistleblowerProtection = 
  | 'ANONYMOUS_ENCRYPTED'
  | 'PROTECTED_WITNESS'
  | 'PUBLIC_INTEREST'
  | 'TCR_SEALED';

export interface SourceDocument {
  id: string;
  title: string;
  type: 'SEC_EDGAR' | 'PACER' | 'SAM_GOV' | 'GAO' | 'FOIA' | 'TREASURY' | 'FAA' | 'FCC' | 'OIG' | 'COURT_SEALED';
  url: string;
  docketNumber?: string;
  awardId?: string;
  exhibitId?: string;
  isSealed?: boolean;
  dateFiled: string;
  notes?: string;
}

export interface AlbertLaneProvenance {
  hash: string;
  timestamp: string;
  node: string;
  ghostGateVersion: string;
  signatureAlgorithm: string;
  merkleRoot: string;
}

export interface TaskComment {
  id: string;
  author: string;
  role: string;
  text: string;
  timestamp: string;
  verified: boolean;
}

export interface InvestigationTask {
  id: string;
  title: string;
  description: string;
  scope: ScopeType;
  category: TaskCategory;
  priority: PriorityLevel;
  status: TaskStatus;
  assignee: {
    name: string;
    role: string;
    avatar: string;
    nodeId: string;
  };
  evidenceIds: string[];
  merkleProof: string;
  provenance: AlbertLaneProvenance;
  confidenceScore: number; // 0 - 100
  dollarImpact: number;
  sourceDocs: SourceDocument[];
  whistleblowerProtection: WhistleblowerProtection;
  timelineDate: string;
  regulatoryChannels: ('SEC_TCR' | 'FINRA' | 'DOJ_CIVIL' | 'GAO' | 'FAA_OIG' | 'FCC_ECFS' | 'HOUSE_OVERSIGHT')[];
  findingsSummary: string;
  contradictoryEvidence?: string;
  comments: TaskComment[];
  createdAt: string;
  updatedAt: string;
}

export interface ForensicDossierItem {
  id: string;
  scope: ScopeType;
  entity: string;
  action: string;
  dollarAmount: number;
  sourceDoc: string;
  sourceType: SourceDocument['type'];
  exhibitId: string;
  pacerDocket?: string;
  awardId?: string;
  date: string;
  status: 'Audited' | 'Filed' | 'Settled' | 'Dismissed' | 'Alleged' | 'Court_Sealed';
  confidenceScore: number;
  provenanceHash: string;
  contradictoryEvidence?: string;
  verifiedByAgent: string;
  regulatoryChannel: string;
  details: string;
  isPubliclyDisclosed: boolean;
  undocumentedExploitFlag: boolean;
}

export interface FederalContract {
  awardId: string;
  entity: string;
  agency: string;
  subAgency?: string;
  amount: number;
  date: string;
  description: string;
  solicitationNumber: string;
  naicsCode: string;
  status: 'ACTIVE' | 'COMPLETED' | 'PROTESTED' | 'UNDER_AUDIT';
  anomalyRisk: 'HIGH' | 'MEDIUM' | 'LOW';
  anomalyDescription?: string;
  samGovUrl: string;
}

export interface LitigationCase {
  docketNumber: string;
  court: string;
  entity: string;
  plaintiff: string;
  defendant: string;
  filingDate: string;
  status: 'ACTIVE' | 'SETTLED' | 'DISMISSED' | 'APPEAL' | 'SEALED_PROCEEDING';
  causeOfAction: string;
  sealedDocsCount: number;
  pacerUrl: string;
  keyExhibits: string[];
  claimSummary: string;
  whistleblowerInvolved: boolean;
}

export interface DebtValuationItem {
  id: string;
  entity: string;
  instrument: string;
  nominalValue: number;
  carryingValuation: number;
  discountPct: number;
  holdingFund: string;
  covenantStatus: 'COMPLIANT' | 'FLAGGED' | 'TECHNICAL_DEFAULT' | 'RESTRUCTURED';
  primaryFilingRef: string;
  interestRate: string;
  maturityDate: string;
  quarterlyTrend: {
    quarter: string;
    markdownPct: number;
  }[];
}

export interface FOIARequestRecord {
  id: string;
  trackingNumber: string;
  agency: string;
  targetEntity: string;
  requestSubject: string;
  expeditedStatus: boolean;
  filingDate: string;
  status: 'DRAFT' | 'DISPATCHED' | 'IN_REVIEW' | 'APPEAL_PENDING' | 'RECORDS_RECEIVED';
  estimatedFulfillment: string;
  webhookSyncUrl: string;
  s3PayloadRef: string;
  generatedLetterText: string;
  gapsTargeted: string;
}

export interface GhostGateAccessLog {
  id: string;
  ipAddress: string;
  isCloudOrCorpRange: boolean;
  organization: string;
  evidenceId: string;
  merkleRoot: string;
  timestamp: string;
  hashProof: string;
  ingestionProof: string;
  actionTaken: 'LOGGED_AND_PERMITTED' | 'PROVENANCE_STAMPED' | 'MERKLE_ANCHORED';
}

export interface WhistleblowerReport {
  id: string;
  trackingToken: string;
  incidentCategory: 'IP_THEFT' | 'FINANCIAL_FRAUD' | 'RETALIATION_SUPPRESSION' | 'GOV_CONTRACT_FRAUD' | 'SECURITY_VIOLATION';
  involvedEntities: string[];
  description: string;
  evidenceHash: string;
  timestamp: string;
  protectionTier: 'TIER_1_TOP_SECRET' | 'TIER_2_ANONYMOUS_PROXY' | 'TIER_3_FORMAL_TCR';
  retaliationDetails?: string;
  submittedToAgencies: string[];
  status: 'ENCRYPTED_VAULT' | 'UNDER_VERIFICATION' | 'TRANSMITTED_DOJ_SEC';
}
