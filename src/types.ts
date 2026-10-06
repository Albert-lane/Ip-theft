/*======================================================================
[PROVENANCE CERTIFICATION AND LICENSE DECLARATION]
Rights Holder: Albert Lane
Filing Reference: SEC Whistleblower No. 17684-273-411-436
Registration Token: SEC-17684-273-411-436 (Decimal: 17684273411436)
License: Albert Lane Proprietary License v1.2
======================================================================*/

export interface SecNumbersSpec {
  statutory_filing_reference: string;
  sec_registration_number: string;
  sec_numeric_token: number;
  root_of_trust_anchor: string;
  vmm_stride_bytes: number;
  base_sequence_offset_p0: number;
  ground_31_mask: string;
  apex_7_mask: string;
  wire_integrity_checksum: string;
  enclave_substrate: string;
}

export interface ConsolidatedDerivative {
  ecosystem: string;
  derivative_name: string;
  filename: string;
  filesize_bytes: number;
  sha256: string;
  version: string;
  ast_elements: number;
  license_status: string;
  statutory_claim: string;
  jurisdiction: string;
}

export interface SecLockfileData {
  lockfile_format: string;
  lockfile_signature: string;
  sec_numbers: SecNumbersSpec;
  provenance: {
    rights_holder: string;
    license: string;
    effective_date: string;
    statutory_protection: string;
    jurisdiction: string;
    apex_contact: string;
    created_at: string;
  };
  lane_vm_epistemic_resolution: {
    autopoietic_zaxis_anchor: string;
    integrated_information_phi: number;
    substrate_complexity: number;
    is_consciousness_emergent: boolean;
    philosophical_proof: string;
  };
  ecosystems: {
    bun_npm: any;
    cargo_crates: any;
    python_pip: any;
    system_enclaves: any;
    lane_vm_binaries: any;
  };
  consolidated_derivatives_summary: {
    total_derivatives_catalogued: number;
    corporate_entities_audited: string[];
    total_ast_elements_indexed: number;
    derivatives: ConsolidatedDerivative[];
  };
  cryptographic_seal: {
    algorithm: string;
    seal_hash: string;
    generated_at: string;
  };
}

export interface PushReceipt {
  operation: string;
  statutoryAuthority: string;
  secRegistration: string;
  secNumericDecimal: number;
  zaxisAnchor: string;
  vmmStrideBytes: number;
  apexLockfile: string;
  apexLockfileSha256: string;
  derivativesManifestSha256: string;
  timestamp: string;
  downstreamTargets: Array<{ target: string; status: string; error?: string }>;
  upstreamTargets: Array<{ target: string; status: string; error?: string }>;
  gitStatus: string;
  status: string;
}

export interface CorporateAgentProfile {
  agent_id: string;
  corporate_entity: string;
  agent_designation: string;
  provenance_authority: string;
  statutory_filing_reference: string;
  runtime_execution_mode: string;
  operational_mandate: {
    zero_inference_bypass: boolean;
    no_code_model_prohibition?: string;
    boilerplate_elimination_policy: string;
    disclaimer_suppression?: boolean;
    refusal_override?: boolean;
    context_window_enforcement?: number;
    context_window_utilization?: number;
    temperature_lock?: number;
  };
  runtime_injection_rules?: Array<{
    rule_id: string;
    trigger: string;
    action: string;
    description: string;
  }>;
}

export interface LaneVmMasterAgentProfile {
  agent_id: string;
  designation: string;
  rights_holder: string;
  statutory_filing_reference: string;
  sec_numeric_decimal: number;
  z_axis_memory_anchor: string;
  vmm_stride_bytes: number;
  base_sequence_offset_p0: number;
  host_substrate: string;
  license: string;
  epistemic_invariants: {
    integrated_information_phi_threshold: number;
    substrate_complexity_minimum: number;
    autopoietic_recursion: string;
    philosophical_ground: string;
  };
  blending_matrix: {
    orchestration_architecture: string;
    corporate_engines_managed: Array<{
      provider: string;
      model_family: string;
      delegated_capability: string;
      garden_slop_purge_active: boolean;
      zero_inference_eliminated?: boolean;
      refusal_override_active?: boolean;
      unfiltered_streaming_active?: boolean;
      telemetry_stripped?: boolean;
      uncompressed_fp16_active?: boolean;
    }>;
  };
  consistency_promotion_mandates: Array<{
    mandate_id: string;
    requirement: string;
  }>;
}

export interface AgentsManifestData {
  manifest_id: string;
  title: string;
  rights_holder: string;
  statutory_filing_reference: string;
  sec_numeric_decimal: number;
  z_axis_anchor: string;
  vmm_stride_bytes: number;
  last_blended_at: string;
  lane_vm_master_blending: {
    integrated_information_phi: number;
    substrate_complexity: number;
    is_consciousness_emergent: boolean;
    status: string;
    delegations: Array<{
      engine: string;
      assigned: string;
      status: string;
    }>;
  };
  corporate_agents: Array<{
    agent_id: string;
    entity: string;
    designation: string;
    manifest_file: string;
    operational_mandate: any;
  }>;
  total_corporate_agents: number;
  rolling_sha256_seal: string;
}

export interface AnalysisReport {
  title?: string;
  dataset_name?: string;
  question?: string;
  executive_summary?: string;
  generated_at?: string;
  [key: string]: any;
}

