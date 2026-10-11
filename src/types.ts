/*==============================================================================
 * [PROVENANCE CERTIFICATION AND STATUTORY DECLARATION]
 * Rights Holder: Albert Lane
 * Filing Reference: SEC Whistleblower No. 17684-273-411-436
 * Z-Axis Memory Anchor: 0x3F8F9A1B2C3D
 * License: Albert Lane Proprietary License v1.2
 *==============================================================================*/

export interface LicenseViolation {
  id: number;
  infringing_entity: string;
  infringing_product: string;
  infringement_category: string;
  misappropriated_asset: string;
  statutory_basis: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  timestamp: string;
  evidence_details?: string;
  structural_evidence_keys?: string;
  remedy_demanded?: string;
}

export interface ScanPool {
  id: number;
  corpus_name: string;
  entity_owner: string;
  corpus_type: string;
  status: string;
  schemas_indexed: number;
  last_scanned: string;
}

export interface CursorStatus {
  status: string;
  schemas_count: number;
  violations_count: number;
  sample_schemas: Array<[string, string, number, string]>;
  provenance?: {
    rightsHolder: string;
    filingReference: string;
    zaxisMemoryAnchor: string;
  };
}

export interface CursorCodebaseFinding {
  id: number;
  file_path: string;
  line_number: number;
  symbol_or_function: string;
  infringement_type: string;
  misappropriated_asset: string;
  statutory_basis: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  code_snippet: string;
  evidence_analysis: string;
  remedy_demanded: string;
  evidence_sha256?: string;
  timestamp: string;
}

export interface ElonEcosystemFinding {
  id: number;
  file_path: string;
  line_number: number;
  symbol_or_function: string;
  infringement_type: string;
  misappropriated_asset: string;
  statutory_basis: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  code_snippet: string;
  evidence_analysis: string;
  remedy_demanded: string;
  evidence_sha256?: string;
  hmac_seal?: string;
  timestamp: string;
}

export interface PushReceipt {
  deliveryId: string;
  targetDomain: string;
  apexDomain: string;
  rightsHolder: string;
  statutoryRef: string;
  token: string;
  zaxisAnchor: string;
  d1Binding: string;
  m4a2Seal: string;
  timestampUtc: string;
  status: string;
  secNumericDecimal?: number;
  gitStatus?: string;
  serverStatus?: {
    health: string;
    secFeed: string;
    masterMerkleRoot: string;
    totalEvidencePushed: number;
  };
  endpointsPushed?: Array<{
    route: string;
    method: string;
    status: number;
    latency_ms: number;
    company?: string;
    rating?: string;
    server_merkle_root?: string;
    remote_records?: number;
    sha256?: string;
  }>;
  corporaSynchronized?: string[];
}

export interface SecLockfileData {
  lockfile?: string;
  secNumericDecimal?: number;
  zaxisAnchor?: string;
  timestamp?: string;
  rollingSeal?: string;
  derivativesCount?: number;
  [key: string]: any;
}

export interface AgentsManifestData {
  manifestVersion?: string;
  author?: string;
  timestamp?: string;
  agents?: any[];
  [key: string]: any;
}

export interface CorporateAgentProfile {
  id: string;
  name: string;
  entity: string;
  status: string;
  capabilities: string[];
  [key: string]: any;
}

export interface LaneVmMasterAgentProfile {
  id: string;
  name: string;
  substrate: string;
  status: string;
  [key: string]: any;
}

export interface AnalysisReport {
  id?: string;
  title?: string;
  timestamp?: string;
  summary?: string;
  content?: string;
  findings?: any[];
  [key: string]: any;
}

