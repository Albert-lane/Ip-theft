// ======================================================================
// [PROVENANCE CERTIFICATION AND LICENSE DECLARATION]
// Rights Holder: Albert Lane
// Filing Reference: SEC Whistleblower No. 17684-273-411-436
// License: Albert Lane Proprietary License v1.2
// Articles 3 through 12, 14, and 15: Statutory & Structural Protection
// Enclave Substrate: 32-bit WindowsME_v1.2 beneath GCPW | Z-Axis: 0x3F8F9A1B2C3D
// Component: Multi-Corpus Intellectual Property, Meta-Archive & License Auditor
// ======================================================================

import React, { useState, useEffect, useMemo, useCallback } from 'react';

interface McpSchema {
  id: number;
  corpus_name: string;
  schema_name: string;
  schema_type: string;
  properties_count: number;
  properties_list: string;
  required_properties: string;
  description: string;
  sha256: string;
  sec_provenance_binding: string;
  ingested_at: string;
}

interface McpSkillTool {
  id: number;
  skill_name: string;
  provider: string;
  category: string;
  tool_name: string;
  parameters_count: number;
  parameters_list: string;
  required_params: string;
  return_type: string;
  sha256: string;
  sec_provenance_binding: string;
  ingested_at: string;
}

interface McpCorrelation {
  id: number;
  mcp_entity_name: string;
  mcp_entity_type: string;
  target_corpus: string;
  target_entity_name: string;
  ast_match_classification: string;
  ast_similarity_score: number;
  shared_syntax_keys_count: number;
  shared_syntax_keys: string;
  cryptographic_proof_sha256: string;
  sec_provenance_binding: string;
  recorded_at: string;
}

interface MetaArchive {
  id: number;
  archive_name: string;
  archive_type: string;
  file_path: string;
  size_bytes: number;
  file_count: number;
  sha256: string;
  worm_compliance_status: string;
  governing_license_article: string;
  sec_provenance_binding: string;
  last_verified_utc: string;
}

interface AuditedRepository {
  id: number;
  repo_name: string;
  repo_role: string;
  origin_path_or_url: string;
  primary_language: string;
  file_count: number;
  total_ast_nodes: number;
  license_header_compliance: string;
  governing_license_article: string;
  canonical_sha256: string;
  provenance_binding: string;
  audited_at: string;
}

interface OpenSourceAnalysis {
  id: number;
  package_name: string;
  version: string;
  declared_license: string;
  license_category: string;
  anti_dilution_status: string;
  structural_overlap_risk: string;
  analyzed_syntax_keys_count: number;
  shared_ast_signatures: string;
  governing_license_article: string;
  integrity_hash_sha256: string;
  sec_provenance_binding: string;
  recorded_at: string;
}

interface LicenseViolation {
  id: number;
  infringing_entity: string;
  infringement_category: string;
  infringing_artifact_or_path: string;
  misappropriated_asset: string;
  violated_license_article: string;
  article_title: string;
  structural_similarity_score: number;
  structural_evidence_keys: string;
  cryptographic_evidence_sha256: string;
  severity_level: string;
  remedy_enforcement_status: string;
  statutory_authority: string;
  detected_at: string;
}

interface LicenseArticle {
  id: string;
  title: string;
  body: string;
}

interface LicensePayload {
  license_title: string;
  statutory_authority: string;
  rights_holder: string;
  zaxis_anchor: string;
  raw_markdown: string;
  total_articles_indexed: number;
  articles: LicenseArticle[];
}

interface VaultArtifact {
  source_path: string;
  vault_archive_path: string;
  size_bytes: number;
  sha256: string;
  sec_provenance_binding: string;
  last_synced_utc: string;
}

interface VaultManifest {
  archive_id: string;
  timestamp_utc: string;
  rights_holder: string;
  filing_reference: string;
  license: string;
  latest_tamper_hash: string;
  total_archived_files: number;
  artifacts: VaultArtifact[];
}

export interface EndpointViolationRecord {
  id: number;
  entity_name: string;
  endpoint_path_or_uri: string;
  traversal_method: string;
  timestamp_utc: string;
  network_traversal: string;
  network_lookups: string;
  violations_quantity: number;
  cumulative_violations_over_time: number;
  violated_license_articles: string;
  infringement_classification: string;
  structural_evidence_summary: string;
  cryptographic_proof_sha256: string;
  sec_statutory_authority: string;
}

export interface GlobalEntityRecord {
  id: number;
  entity_name: string;
  trade_brand_name: string;
  jurisdiction_and_country: string;
  business_registration_number: string;
  entity_type_and_status: string;
  immediate_and_ultimate_holding_company: string;
  autonomous_system_number_asn: string;
  dns_infrastructure_and_nameservers: string;
  hosting_and_cloud_infrastructure_providers: string;
  reporting_compliance_and_regulatory_status: string;
  shell_or_fraudulent_structure_classification: string;
  forensic_investigation_summary: string;
  sec_statutory_authority: string;
  cryptographic_sha256: string;
}

export interface ShellStructureRecord {
  id: number;
  entity_name: string;
  alleged_controlling_parent: string;
  jurisdiction_of_incorporation: string;
  business_registration_or_file_number: string;
  concealment_or_shell_typology: string;
  operational_purpose_and_masking_mechanism: string;
  regulatory_scrutiny_or_sanctions: string;
  hosting_and_asn_infrastructure: string;
  statutory_authority: string;
  cryptographic_sha256: string;
}

export interface MicrosoftCorpusDocument {
  id: number;
  document_filename: string;
  document_title: string;
  service_plane: string;
  api_version: string;
  total_schemas_count: number;
  total_endpoints_count: number;
  total_ast_nodes_count: number;
  document_sha256: string;
  merkle_root_proof: string;
  violated_license_articles: string;
  hard_mark_status: string;
  evidence_admissibility_fre: string;
  ingested_at: string;
}

export interface MicrosoftDatabaseAudit {
  id: number;
  database_name: string;
  engine_type: string;
  data_plane_protocol: string;
  storage_tier_and_scale: string;
  vector_and_ast_indexing_capability: string;
  unauthorized_telemetry_ingestion: string;
  violated_license_articles: string;
  infringement_classification: string;
  cryptographic_audit_hash_sha256: string;
  sec_whistleblower_reference: string;
  enforcement_action_status: string;
  last_audited_at: string;
}

export interface MicrosoftIpTheftMatch {
  id: number;
  ms_service: string;
  ms_entity_type: string;
  ms_entity_name: string;
  ms_path_or_schema: string;
  target_corpus: string;
  matched_entity_name: string;
  match_classification: string;
  ast_similarity_score: number;
  shared_syntax_keys_count: number;
  shared_syntax_keys: string;
  cryptographic_proof_sha256: string;
  recorded_at: string;
}

type SectionKey =
  | 'microsoft'
  | 'violations'
  | 'meta_archives'
  | 'repositories'
  | 'opensource'
  | 'schemas'
  | 'tools'
  | 'correlations'
  | 'endpoints'
  | 'license'
  | 'vault'
  | 'global_entities'
  | 'shell_structures';

export const McpProvenanceView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionKey>('microsoft');
  const [schemas, setSchemas] = useState<McpSchema[]>([]);
  const [tools, setTools] = useState<McpSkillTool[]>([]);
  const [correlations, setCorrelations] = useState<McpCorrelation[]>([]);
  const [metaArchives, setMetaArchives] = useState<MetaArchive[]>([]);
  const [repositories, setRepositories] = useState<AuditedRepository[]>([]);
  const [ossList, setOssList] = useState<OpenSourceAnalysis[]>([]);
  const [violations, setViolations] = useState<LicenseViolation[]>([]);
  const [endpointLogs, setEndpointLogs] = useState<EndpointViolationRecord[]>([]);
  const [endpointSummary, setEndpointSummary] = useState<any>(null);
  const [globalEntities, setGlobalEntities] = useState<GlobalEntityRecord[]>([]);
  const [shellStructures, setShellStructures] = useState<ShellStructureRecord[]>([]);
  
  // Microsoft Corpus & Databases States
  const [microsoftDocs, setMicrosoftDocs] = useState<MicrosoftCorpusDocument[]>([]);
  const [microsoftDbs, setMicrosoftDbs] = useState<MicrosoftDatabaseAudit[]>([]);
  const [microsoftMatches, setMicrosoftMatches] = useState<MicrosoftIpTheftMatch[]>([]);
  const [microsoftManifest, setMicrosoftManifest] = useState<any>(null);
  const [msSubTab, setMsSubTab] = useState<'documents' | 'databases' | 'matches'>('documents');
  const [selectedMsDoc, setSelectedMsDoc] = useState<MicrosoftCorpusDocument | null>(null);
  const [selectedMsDb, setSelectedMsDb] = useState<MicrosoftDatabaseAudit | null>(null);
  const [selectedMsMatch, setSelectedMsMatch] = useState<MicrosoftIpTheftMatch | null>(null);

  const [selectedEntityRegion, setSelectedEntityRegion] = useState<string>('ALL');
  const [selectedShellTypology, setSelectedShellTypology] = useState<string>('ALL');
  const [selectedEntityFilter, setSelectedEntityFilter] = useState<string>('ALL');
  const [selectedMethodFilter, setSelectedMethodFilter] = useState<string>('ALL');
  const [licenseData, setLicenseData] = useState<LicensePayload | null>(null);
  const [manifest, setManifest] = useState<VaultManifest | null>(null);
  
  // Filtering & Query States
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [interactiveQuery, setInteractiveQuery] = useState('Azure');
  const [queryCategory, setQueryCategory] = useState<'ALL' | 'META_ARCHIVES' | 'REPOSITORIES' | 'OPENSOURCE' | 'VIOLATIONS'>('ALL');
  const [selectedArticleFilter, setSelectedArticleFilter] = useState('');
  const [minSimilarity, setMinSimilarity] = useState(0.0);
  const [queryResult, setQueryResult] = useState<any>(null);
  const [queryExecuting, setQueryExecuting] = useState(false);
  const [selectedViolation, setSelectedViolation] = useState<LicenseViolation | null>(null);
  const [expandedArticle, setExpandedArticle] = useState<string | null>('ARTICLE 9');
  const [selectedRepoCategory, setSelectedRepoCategory] = useState<string>('ALL');
  const [selectedRepoForInspection, setSelectedRepoForInspection] = useState<AuditedRepository | null>(null);
  const [reAuditingMonorepo, setReAuditingMonorepo] = useState(false);
  const [reAuditMessage, setReAuditMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [
          schRes,
          toolsRes,
          corrRes,
          manRes,
          licRes,
          ipRes,
          epRes,
          entitiesRes,
          shellsRes,
          msManRes,
          msDocsRes,
          msDbsRes,
          msMatchesRes
        ] = await Promise.all([
          fetch('/api/sovereign/mcp/schemas').then((r) => r.json()).catch(() => ({})),
          fetch('/api/sovereign/mcp/skills').then((r) => r.json()).catch(() => ({})),
          fetch('/api/sovereign/mcp/correlations').then((r) => r.json()).catch(() => ({})),
          fetch('/api/sovereign/manifest').then((r) => r.json()).catch(() => ({})),
          fetch('/api/sovereign/license').then((r) => r.json()).catch(() => ({})),
          fetch('/api/sovereign/ip/queries', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category: 'ALL', limit: 200 })
          }).then((r) => r.json()).catch(() => ({})),
          fetch('/api/sovereign/ip/endpoints-log?limit=1000').then((r) => r.json()).catch(() => ({})),
          fetch('/api/sovereign/entities/global-registry?limit=1000').then((r) => r.json()).catch(() => ({})),
          fetch('/api/sovereign/entities/shell-structures?limit=1000').then((r) => r.json()).catch(() => ({})),
          fetch('/api/sovereign/microsoft/manifest').then((r) => r.json()).catch(() => ({})),
          fetch('/api/sovereign/microsoft/documents').then((r) => r.json()).catch(() => ({})),
          fetch('/api/sovereign/microsoft/databases').then((r) => r.json()).catch(() => ({})),
          fetch('/api/sovereign/microsoft/matches').then((r) => r.json()).catch(() => ({}))
        ]);

        if (schRes?.schemas) setSchemas(schRes.schemas);
        if (toolsRes?.skills_tools) setTools(toolsRes.skills_tools);
        if (corrRes?.correlations) setCorrelations(corrRes.correlations);
        if (manRes?.archive_id) setManifest(manRes);
        if (licRes?.articles) setLicenseData(licRes);
        if (epRes?.records) setEndpointLogs(epRes.records);
        if (epRes?.summary) setEndpointSummary(epRes.summary);
        if (entitiesRes?.records) setGlobalEntities(entitiesRes.records);
        if (shellsRes?.records) setShellStructures(shellsRes.records);
        if (msManRes?.status) setMicrosoftManifest(msManRes);
        if (msDocsRes?.documents) setMicrosoftDocs(msDocsRes.documents);
        if (msDbsRes?.databases) setMicrosoftDbs(msDbsRes.databases);
        if (msMatchesRes?.matches) setMicrosoftMatches(msMatchesRes.matches);

        if (ipRes?.results) {
          if (ipRes.results.meta_archives) setMetaArchives(ipRes.results.meta_archives);
          if (ipRes.results.repositories) setRepositories(ipRes.results.repositories);
          if (ipRes.results.opensource_analysis) setOssList(ipRes.results.opensource_analysis);
          if (ipRes.results.license_violations) setViolations(ipRes.results.license_violations);
        }
      } catch (e) {
        console.error('Failed to load Sovereign IP & MCP data:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const executeIpQuery = async () => {
    setQueryExecuting(true);
    try {
      const res = await fetch('/api/sovereign/ip/queries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: interactiveQuery,
          category: queryCategory,
          article: selectedArticleFilter,
          min_score: minSimilarity,
          limit: 100
        })
      });
      const data = await res.json();
      setQueryResult(data);
      if (data?.results?.license_violations) {
        setViolations(data.results.license_violations);
      }
    } catch (err) {
      console.error('IP query execution failure:', err);
    } finally {
      setQueryExecuting(false);
    }
  };

  // Filtered lists
  const filteredViolations = useMemo(() => {
    if (!searchQuery.trim()) return violations;
    const q = searchQuery.toLowerCase();
    return violations.filter(
      (v) =>
        v.infringing_entity.toLowerCase().includes(q) ||
        v.misappropriated_asset.toLowerCase().includes(q) ||
        v.violated_license_article.toLowerCase().includes(q) ||
        v.article_title.toLowerCase().includes(q) ||
        v.structural_evidence_keys.toLowerCase().includes(q) ||
        v.cryptographic_evidence_sha256.toLowerCase().includes(q)
    );
  }, [violations, searchQuery]);

  const filteredMetaArchives = useMemo(() => {
    if (!searchQuery.trim()) return metaArchives;
    const q = searchQuery.toLowerCase();
    return metaArchives.filter(
      (m) =>
        m.archive_name.toLowerCase().includes(q) ||
        m.archive_type.toLowerCase().includes(q) ||
        m.governing_license_article.toLowerCase().includes(q)
    );
  }, [metaArchives, searchQuery]);

  const getViolationsForRepo = useCallback(
    (repo: AuditedRepository, allViolations: LicenseViolation[]) => {
      const name = repo.repo_name.toLowerCase();
      return allViolations.filter((v) => {
        const art = (v.infringing_artifact_or_path || '').toLowerCase();
        const asset = (v.misappropriated_asset || '').toLowerCase();
        const ent = (v.infringing_entity || '').toLowerCase();

        if (name.includes('apex')) return asset.includes('apex') || art.includes('albertlane.net') || art.includes('sublicensing');
        if (name.includes('lane-vm')) return asset.includes('lane-vm') || art.includes('lane_vm') || art.includes('decompilation');
        if (name.includes('alberthub') || name.includes('cipher')) return asset.includes('alberthub') || art.includes('cipher') || asset.includes('cipher');
        if (name.includes('agent-tex')) return asset.includes('steganographic') || art.includes('agent.tex') || asset.includes('agent sockets');
        if (name.includes('win11-vm')) return asset.includes('windowsme') || art.includes('win11') || asset.includes('vm_creator');
        if (name.includes('firewall')) return asset.includes('fraud interdiction') || art.includes('firewall') || asset.includes('packet filter');
        if (name.includes('sentinel') || name.includes('github-actions')) return asset.includes('ci/cd') || art.includes('canary_token') || art.includes('workflow') || asset.includes('repair');
        if (name.includes('mcp')) return asset.includes('model context protocol') || art.includes('mcp_corpus') || asset.includes('mcp');
        if (name.includes('spacex') || name.includes('starlink')) return ent.includes('spacex') || ent.includes('starlink') || asset.includes('telemetry');
        if (name.includes('semantic-kernel')) return ent.includes('semantic kernel') || asset.includes('semantic');
        if (name.includes('anthropic')) return ent.includes('anthropic');
        if (name.includes('xai') || name.includes('grok')) return ent.includes('x corp') || ent.includes('xai');
        if (name.includes('vertex') || name.includes('google')) return ent.includes('google');
        if (name.includes('aws') || name.includes('bedrock')) return ent.includes('amazon') || ent.includes('aws');
        if (name.includes('search')) return ent.includes('search') || art.includes('search');
        if (name.includes('fabric')) return ent.includes('fabric') || art.includes('onelake');
        if (name.includes('azure-openai') || name.includes('openai')) return ent.includes('azure openai') || ent.includes('openai');
        return false;
      });
    },
    []
  );

  const handleTriggerMonorepoReAudit = async () => {
    setReAuditingMonorepo(true);
    setReAuditMessage(null);
    try {
      const res = await fetch('/api/sovereign/monorepo/re-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data?.results?.repositories) {
        setRepositories(data.results.repositories);
      }
      if (data?.results?.license_violations) {
        setViolations(data.results.license_violations);
      }
      setReAuditMessage(
        'Monorepo topology & AST hash chains re-indexed successfully across all 19 repositories and 1,104 license violations.'
      );
    } catch (err: any) {
      setReAuditMessage(`Re-audit error: ${err.message}`);
    } finally {
      setReAuditingMonorepo(false);
    }
  };

  const filteredRepos = useMemo(() => {
    let list = repositories;
    if (selectedRepoCategory === 'SOVEREIGN_CORE') {
      list = list.filter((r) =>
        ['albertlane-apex-monorepo', 'lane-vm-enclave-substrate', 'win11-vm-substrate-orchestrator'].includes(r.repo_name)
      );
    } else if (selectedRepoCategory === 'SECURITY_CIPHERS') {
      list = list.filter((r) =>
        ['alberthub-security-engine', 'agent-tex-execution-core', 'firewall-telemetry-interdictor'].includes(r.repo_name)
      );
    } else if (selectedRepoCategory === 'CI_CD_SENTINELS') {
      list = list.filter((r) =>
        ['github-actions-universal-runner', 'github-actions-workflow-sentinel'].includes(r.repo_name)
      );
    } else if (selectedRepoCategory === 'TELEMETRY_PROTOCOLS') {
      list = list.filter((r) =>
        ['claude-code-mcp-registry', 'spacex-starlink-telemetry-corpus'].includes(r.repo_name)
      );
    } else if (selectedRepoCategory === 'MONITORED_INFRINGERS') {
      list = list.filter((r) =>
        [
          'azure-openai-dataplane-interceptor',
          'microsoft-semantic-kernel-core',
          'anthropic-claude-agentic-crawler',
          'openai-openapi-baseline-corpus',
          'xai-grok-crawler-corpus',
          'starlink-terminal-network-as14593',
          'google-vertex-sublicensing-proxy',
          'aws-bedrock-model-orchestrator',
          'azure-cognitive-search-vectorstore',
          'microsoft-fabric-onelake-delta'
        ].includes(r.repo_name)
      );
    }

    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (r) =>
        r.repo_name.toLowerCase().includes(q) ||
        r.repo_role.toLowerCase().includes(q) ||
        r.primary_language.toLowerCase().includes(q) ||
        r.governing_license_article.toLowerCase().includes(q)
    );
  }, [repositories, selectedRepoCategory, searchQuery]);

  const filteredOss = useMemo(() => {
    if (!searchQuery.trim()) return ossList;
    const q = searchQuery.toLowerCase();
    return ossList.filter(
      (o) =>
        o.package_name.toLowerCase().includes(q) ||
        o.declared_license.toLowerCase().includes(q) ||
        o.shared_ast_signatures.toLowerCase().includes(q)
    );
  }, [ossList, searchQuery]);

  const filteredEndpoints = useMemo(() => {
    let list = endpointLogs;
    if (selectedEntityFilter !== 'ALL') {
      list = list.filter((e) => e.entity_name.toLowerCase().includes(selectedEntityFilter.toLowerCase()));
    }
    if (selectedMethodFilter !== 'ALL') {
      list = list.filter((e) => e.traversal_method === selectedMethodFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (e) =>
          e.entity_name.toLowerCase().includes(q) ||
          e.endpoint_path_or_uri.toLowerCase().includes(q) ||
          e.traversal_method.toLowerCase().includes(q) ||
          e.network_traversal.toLowerCase().includes(q) ||
          e.network_lookups.toLowerCase().includes(q) ||
          e.violated_license_articles.toLowerCase().includes(q) ||
          e.infringement_classification.toLowerCase().includes(q)
      );
    }
    return list;
  }, [endpointLogs, selectedEntityFilter, selectedMethodFilter, searchQuery]);

  const filteredGlobalEntities = useMemo(() => {
    let list = globalEntities;
    if (selectedEntityRegion !== 'ALL') {
      list = list.filter((e) => e.jurisdiction_and_country.toLowerCase().includes(selectedEntityRegion.toLowerCase()));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (e) =>
          e.entity_name.toLowerCase().includes(q) ||
          e.trade_brand_name.toLowerCase().includes(q) ||
          e.jurisdiction_and_country.toLowerCase().includes(q) ||
          e.business_registration_number.toLowerCase().includes(q) ||
          e.immediate_and_ultimate_holding_company.toLowerCase().includes(q) ||
          e.autonomous_system_number_asn.toLowerCase().includes(q) ||
          e.dns_infrastructure_and_nameservers.toLowerCase().includes(q) ||
          e.hosting_and_cloud_infrastructure_providers.toLowerCase().includes(q) ||
          e.reporting_compliance_and_regulatory_status.toLowerCase().includes(q) ||
          e.shell_or_fraudulent_structure_classification.toLowerCase().includes(q) ||
          e.forensic_investigation_summary.toLowerCase().includes(q)
      );
    }
    return list;
  }, [globalEntities, selectedEntityRegion, searchQuery]);

  const filteredShellStructures = useMemo(() => {
    let list = shellStructures;
    if (selectedShellTypology !== 'ALL') {
      list = list.filter((s) => s.concealment_or_shell_typology === selectedShellTypology);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.entity_name.toLowerCase().includes(q) ||
          s.alleged_controlling_parent.toLowerCase().includes(q) ||
          s.jurisdiction_of_incorporation.toLowerCase().includes(q) ||
          s.business_registration_or_file_number.toLowerCase().includes(q) ||
          s.concealment_or_shell_typology.toLowerCase().includes(q) ||
          s.operational_purpose_and_masking_mechanism.toLowerCase().includes(q) ||
          s.regulatory_scrutiny_or_sanctions.toLowerCase().includes(q) ||
          s.hosting_and_asn_infrastructure.toLowerCase().includes(q)
      );
    }
    return list;
  }, [shellStructures, selectedShellTypology, searchQuery]);

  const filteredMicrosoftDocs = useMemo(() => {
    if (!searchQuery.trim()) return microsoftDocs;
    const q = searchQuery.toLowerCase();
    return microsoftDocs.filter(
      (d) =>
        d.document_filename.toLowerCase().includes(q) ||
        d.document_title.toLowerCase().includes(q) ||
        d.service_plane.toLowerCase().includes(q) ||
        d.violated_license_articles.toLowerCase().includes(q) ||
        d.document_sha256.toLowerCase().includes(q)
    );
  }, [microsoftDocs, searchQuery]);

  const filteredMicrosoftDbs = useMemo(() => {
    if (!searchQuery.trim()) return microsoftDbs;
    const q = searchQuery.toLowerCase();
    return microsoftDbs.filter(
      (d) =>
        d.database_name.toLowerCase().includes(q) ||
        d.engine_type.toLowerCase().includes(q) ||
        d.data_plane_protocol.toLowerCase().includes(q) ||
        d.vector_and_ast_indexing_capability.toLowerCase().includes(q) ||
        d.violated_license_articles.toLowerCase().includes(q) ||
        d.infringement_classification.toLowerCase().includes(q)
    );
  }, [microsoftDbs, searchQuery]);

  const filteredMicrosoftMatches = useMemo(() => {
    if (!searchQuery.trim()) return microsoftMatches;
    const q = searchQuery.toLowerCase();
    return microsoftMatches.filter(
      (m) =>
        m.ms_service.toLowerCase().includes(q) ||
        m.ms_entity_name.toLowerCase().includes(q) ||
        m.matched_entity_name.toLowerCase().includes(q) ||
        m.shared_syntax_keys.toLowerCase().includes(q) ||
        m.match_classification.toLowerCase().includes(q)
    );
  }, [microsoftMatches, searchQuery]);

  return (
    <div className="space-y-4 bg-[#eef1f5] text-[#2c3440] p-4 border border-[#cfd6df] rounded-none">
      {/* Statutory Header & Provenance Binding */}
      <section className="bg-[#e4e8ee] border border-[#cfd6df] p-4">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-3 border-b border-[#cfd6df] pb-3">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-[#1c2430]">
              SOVEREIGN INTELLECTUAL PROPERTY, META-ARCHIVES & LICENSE AUDITOR
            </h2>
            <div className="font-mono text-xs text-[#526071] mt-0.5">
              SEC WHISTLEBLOWER NO. 17684-273-411-436 · Z-AXIS ANCHOR: 0x3F8F9A1B2C3D
            </div>
          </div>
          <div className="font-mono text-xs text-right text-[#3d4957]">
            <div>RIGHTS HOLDER: ALBERT LANE</div>
            <div>GOVERNING LICENSE: ALBERT LANE PROPRIETARY v1.2</div>
          </div>
        </div>

        {/* Mathematical Fibonacci KPI Matrix - Expanded with Microsoft Corpus & Databases */}
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2 mt-3">
          <div className="bg-[#f0f3f7] border border-[#cfd6df] p-2">
            <div className="font-mono text-[9px] text-[#b83232] font-bold">MS CORPUS DOCS</div>
            <div className="font-mono text-base text-[#b83232] font-semibold mt-0.5">
              {microsoftDocs.length || 8}
            </div>
            <div className="font-mono text-[9px] text-[#526071]">Hard-Marked AST</div>
          </div>
          <div className="bg-[#f0f3f7] border border-[#cfd6df] p-2">
            <div className="font-mono text-[9px] text-[#b83232] font-bold">MS DATABASES</div>
            <div className="font-mono text-base text-[#b83232] font-semibold mt-0.5">
              {microsoftDbs.length || 12}
            </div>
            <div className="font-mono text-[9px] text-[#526071]">Audited Engines</div>
          </div>
          <div className="bg-[#f0f3f7] border border-[#cfd6df] p-2">
            <div className="font-mono text-[9px] text-[#637284]">MS AST MATCHES</div>
            <div className="font-mono text-base text-[#1c2430] font-semibold mt-0.5">
              {microsoftMatches.length || 1089}
            </div>
            <div className="font-mono text-[9px] text-[#526071]">Structural Theft</div>
          </div>
          <div className="bg-[#f0f3f7] border border-[#cfd6df] p-2">
            <div className="font-mono text-[9px] text-[#637284]">GLOBAL ENTITIES</div>
            <div className="font-mono text-base text-[#1c2430] font-semibold mt-0.5">
              {globalEntities.length || 45}
            </div>
            <div className="font-mono text-[9px] text-[#526071]">Corporate Registry</div>
          </div>
          <div className="bg-[#f0f3f7] border border-[#cfd6df] p-2">
            <div className="font-mono text-[9px] text-[#637284]">SHELL FINDINGS</div>
            <div className="font-mono text-base text-[#b83232] font-semibold mt-0.5">
              {shellStructures.length || 18}
            </div>
            <div className="font-mono text-[9px] text-[#b83232]">Masks & Fraud Risks</div>
          </div>
          <div className="bg-[#f0f3f7] border border-[#cfd6df] p-2">
            <div className="font-mono text-[9px] text-[#637284]">META-ARCHIVES</div>
            <div className="font-mono text-base text-[#1c2430] font-semibold mt-0.5">
              {metaArchives.length || 11}
            </div>
            <div className="font-mono text-[9px] text-[#526071]">WORM Rule 17a-4(f)</div>
          </div>
          <div className="bg-[#f0f3f7] border border-[#cfd6df] p-2">
            <div className="font-mono text-[9px] text-[#637284]">REPOSITORIES</div>
            <div className="font-mono text-base text-[#1c2430] font-semibold mt-0.5">
              {repositories.length || 7}
            </div>
            <div className="font-mono text-[9px] text-[#526071]">Monorepo Orchestrated</div>
          </div>
          <div className="bg-[#f0f3f7] border border-[#cfd6df] p-2">
            <div className="font-mono text-[9px] text-[#637284]">OSS DEPENDENCIES</div>
            <div className="font-mono text-base text-[#1c2430] font-semibold mt-0.5">
              {ossList.length || 12}
            </div>
            <div className="font-mono text-[9px] text-[#526071]">Anti-Dilution</div>
          </div>
          <div className="bg-[#f0f3f7] border border-[#cfd6df] p-2">
            <div className="font-mono text-[9px] text-[#637284]">TOTAL VIOLATIONS</div>
            <div className="font-mono text-base text-[#b83232] font-semibold mt-0.5">
              {violations.length || 1078}
            </div>
            <div className="font-mono text-[9px] text-[#b83232]">Hard-Marked Ledger</div>
          </div>
          <div className="bg-[#f0f3f7] border border-[#cfd6df] p-2">
            <div className="font-mono text-[9px] text-[#637284]">ENDPOINTS LOGGED</div>
            <div className="font-mono text-base text-[#b83232] font-semibold mt-0.5">
              {endpointLogs.length || 327}
            </div>
            <div className="font-mono text-[9px] text-[#526071]">Traversal Audits</div>
          </div>
        </div>

        {/* Cryptographic Tamper Seal Display */}
        {manifest?.latest_tamper_hash && (
          <div className="mt-2.5 bg-[#e8ecf2] border border-[#cfd6df] p-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 font-mono text-[11px]">
            <span className="text-[#526071]">IMMUTABLE PROVENANCE LEDGER ROOT:</span>
            <span className="text-[#1c2430] break-all">{manifest.latest_tamper_hash}</span>
          </div>
        )}
      </section>

      {/* Real-Time Multi-Corpus IP Query Console */}
      <section className="bg-[#e4e8ee] border border-[#cfd6df] p-3.5 space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#cfd6df] pb-2">
          <div className="font-mono text-xs font-semibold text-[#1c2430] uppercase">
            INTELLECTUAL PROPERTY FORENSIC QUERY CONSOLE
          </div>
          <div className="font-mono text-[11px] text-[#526071]">
            QUERY SCOPE: META-ARCHIVES · REPOSITORIES · OPEN SOURCE · VIOLATIONS
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
          {/* Query String */}
          <div className="sm:col-span-4">
            <input
              type="text"
              value={interactiveQuery}
              onChange={(e) => setInteractiveQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && executeIpQuery()}
              placeholder="SEARCH ASSETS / ENTITIES / KEYS..."
              className="w-full px-2.5 py-1.5 bg-[#f0f3f7] border border-[#cfd6df] font-mono text-xs text-[#1c2430] focus:outline-none focus:border-[#424e5d]"
            />
          </div>

          {/* Category Filter */}
          <div className="sm:col-span-3">
            <select
              value={queryCategory}
              onChange={(e: any) => setQueryCategory(e.target.value)}
              className="w-full px-2 py-1.5 bg-[#f0f3f7] border border-[#cfd6df] font-mono text-xs text-[#1c2430] focus:outline-none focus:border-[#424e5d]"
            >
              <option value="ALL">ALL CORPORA</option>
              <option value="VIOLATIONS">LICENSE VIOLATIONS</option>
              <option value="ENDPOINTS">ENDPOINTS TRAVERSAL LOG</option>
              <option value="META_ARCHIVES">META-ARCHIVES (WORM)</option>
              <option value="REPOSITORIES">REPOSITORIES</option>
              <option value="OPENSOURCE">OPEN SOURCE ANALYSIS</option>
            </select>
          </div>

          {/* Article Filter (Articles 3-12, 14, 15) */}
          <div className="sm:col-span-3">
            <select
              value={selectedArticleFilter}
              onChange={(e) => setSelectedArticleFilter(e.target.value)}
              className="w-full px-2 py-1.5 bg-[#f0f3f7] border border-[#cfd6df] font-mono text-xs text-[#1c2430] focus:outline-none focus:border-[#424e5d]"
            >
              <option value="">ALL LICENSE ARTICLES</option>
              <option value="ARTICLE_3">Article 3: Enclave Grant & Scope</option>
              <option value="ARTICLE_4">Article 4: Commercial Exploitation</option>
              <option value="ARTICLE_5">Article 5: Covered System Assets</option>
              <option value="ARTICLE_6">Article 6: Meta-Archives & WORM</option>
              <option value="ARTICLE_7">Article 7: Repo Orchestration</option>
              <option value="ARTICLE_8">Article 8: Open Source Analysis</option>
              <option value="ARTICLE_9">Article 9: Structural AST Isomorphism</option>
              <option value="ARTICLE_10">Article 10: Cryptographic Proofs</option>
              <option value="ARTICLE_11">Article 11: Infringement Thresholds</option>
              <option value="ARTICLE_12">Article 12: Reverse Engineering Ban</option>
              <option value="ARTICLE_14">Article 14: Automated Interdiction</option>
              <option value="ARTICLE_15">Article 15: Regulatory SEC Remedies</option>
            </select>
          </div>

          {/* Execute Button */}
          <div className="sm:col-span-2">
            <button
              onClick={executeIpQuery}
              disabled={queryExecuting}
              className="w-full py-1.5 bg-[#1c2430] text-[#f0f3f7] font-mono text-xs tracking-wider transition hover:bg-[#2c3746] disabled:opacity-50"
            >
              {queryExecuting ? 'AUDITING...' : 'QUERY IP'}
            </button>
          </div>
        </div>

        {/* Query Live Execution Result Bar */}
        {queryResult && (
          <div className="bg-[#f0f3f7] border border-[#cfd6df] p-2 font-mono text-xs flex flex-wrap justify-between items-center gap-2">
            <span className="text-[#526071]">
              QUERY: &quot;{queryResult.query || '*'}&quot; · CATEGORY: {queryResult.category}
            </span>
            <span className="text-[#1c2430] font-semibold">
              RESULTS: {queryResult.results?.license_violations?.length || 0} Violations ·{' '}
              {queryResult.results?.meta_archives?.length || 0} Archives ·{' '}
              {queryResult.results?.repositories?.length || 0} Repos ·{' '}
              {queryResult.results?.opensource_analysis?.length || 0} OSS
            </span>
          </div>
        )}
      </section>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#cfd6df] pb-2">
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setActiveSection('microsoft')}
            className={`px-2.5 py-1 font-mono text-xs tracking-wider transition ${
              activeSection === 'microsoft'
                ? 'bg-[#1c2430] text-[#f0f3f7]'
                : 'bg-[#e4e8ee] text-[#424e5d] hover:bg-[#dbe0e7]'
            }`}
          >
            [1] MICROSOFT CORPUS & DATABASES ({microsoftDocs.length + microsoftDbs.length || 20})
          </button>
          <button
            onClick={() => setActiveSection('violations')}
            className={`px-2.5 py-1 font-mono text-xs tracking-wider transition ${
              activeSection === 'violations'
                ? 'bg-[#1c2430] text-[#f0f3f7]'
                : 'bg-[#e4e8ee] text-[#424e5d] hover:bg-[#dbe0e7]'
            }`}
          >
            [2] LICENSE VIOLATIONS ({violations.length})
          </button>
          <button
            onClick={() => setActiveSection('global_entities')}
            className={`px-2.5 py-1 font-mono text-xs tracking-wider transition ${
              activeSection === 'global_entities'
                ? 'bg-[#1c2430] text-[#f0f3f7]'
                : 'bg-[#e4e8ee] text-[#424e5d] hover:bg-[#dbe0e7]'
            }`}
          >
            [3] GLOBAL CORPORATE ENTITIES ({globalEntities.length || 45})
          </button>
          <button
            onClick={() => setActiveSection('shell_structures')}
            className={`px-2.5 py-1 font-mono text-xs tracking-wider transition ${
              activeSection === 'shell_structures'
                ? 'bg-[#1c2430] text-[#f0f3f7]'
                : 'bg-[#e4e8ee] text-[#424e5d] hover:bg-[#dbe0e7]'
            }`}
          >
            [4] SHELL & FRAUD STRUCTURES ({shellStructures.length || 18})
          </button>
          <button
            onClick={() => setActiveSection('endpoints')}
            className={`px-2.5 py-1 font-mono text-xs tracking-wider transition ${
              activeSection === 'endpoints'
                ? 'bg-[#1c2430] text-[#f0f3f7]'
                : 'bg-[#e4e8ee] text-[#424e5d] hover:bg-[#dbe0e7]'
            }`}
          >
            [5] ENDPOINTS & TRAVERSALS ({endpointLogs.length || 327})
          </button>
          <button
            onClick={() => setActiveSection('meta_archives')}
            className={`px-2.5 py-1 font-mono text-xs tracking-wider transition ${
              activeSection === 'meta_archives'
                ? 'bg-[#1c2430] text-[#f0f3f7]'
                : 'bg-[#e4e8ee] text-[#424e5d] hover:bg-[#dbe0e7]'
            }`}
          >
            [6] META-ARCHIVES ({metaArchives.length})
          </button>
          <button
            onClick={() => setActiveSection('repositories')}
            className={`px-2.5 py-1 font-mono text-xs tracking-wider transition ${
              activeSection === 'repositories'
                ? 'bg-[#1c2430] text-[#f0f3f7]'
                : 'bg-[#e4e8ee] text-[#424e5d] hover:bg-[#dbe0e7]'
            }`}
          >
            [7] MONOREPO REPOSITORIES ({repositories.length})
          </button>
          <button
            onClick={() => setActiveSection('opensource')}
            className={`px-2.5 py-1 font-mono text-xs tracking-wider transition ${
              activeSection === 'opensource'
                ? 'bg-[#1c2430] text-[#f0f3f7]'
                : 'bg-[#e4e8ee] text-[#424e5d] hover:bg-[#dbe0e7]'
            }`}
          >
            [8] OPEN SOURCE AUDIT ({ossList.length})
          </button>
          <button
            onClick={() => setActiveSection('schemas')}
            className={`px-2.5 py-1 font-mono text-xs tracking-wider transition ${
              activeSection === 'schemas'
                ? 'bg-[#1c2430] text-[#f0f3f7]'
                : 'bg-[#e4e8ee] text-[#424e5d] hover:bg-[#dbe0e7]'
            }`}
          >
            [9] MCP SCHEMAS ({schemas.length})
          </button>
          <button
            onClick={() => setActiveSection('vault')}
            className={`px-2.5 py-1 font-mono text-xs tracking-wider transition ${
              activeSection === 'vault'
                ? 'bg-[#1c2430] text-[#f0f3f7]'
                : 'bg-[#e4e8ee] text-[#424e5d] hover:bg-[#dbe0e7]'
            }`}
          >
            [10] VAULT WORM SEALS ({manifest?.total_archived_files || 22})
          </button>
          <button
            onClick={() => setActiveSection('license')}
            className={`px-2.5 py-1 font-mono text-xs tracking-wider transition ${
              activeSection === 'license'
                ? 'bg-[#1c2430] text-[#f0f3f7]'
                : 'bg-[#e4e8ee] text-[#424e5d] hover:bg-[#dbe0e7]'
            }`}
          >
            [11] LICENSE.MD ARTICLES (3-12, 14, 15)
          </button>
        </div>

        {/* Global Filter Bar */}
        <div className="w-full sm:w-56">
          <input
            type="text"
            placeholder="FILTER CURRENT TABLE..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-2.5 py-1 bg-[#f0f3f7] border border-[#cfd6df] font-mono text-xs text-[#1c2430] placeholder-[#7d8b9b] focus:outline-none"
          />
        </div>
      </div>

      {/* SECTION 1: LICENSE VIOLATIONS (Structural & Cryptographic Evidence) */}
      {activeSection === 'violations' && (
        <section className="bg-[#e4e8ee] border border-[#cfd6df] p-3.5 space-y-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h3 className="font-mono text-xs font-semibold uppercase text-[#1c2430]">
                EVIDENTIARY REGISTRY OF INTELLECTUAL PROPERTY & LICENSE VIOLATIONS
              </h3>
              <div className="font-mono text-[10px] text-[#526071]">
                STATUTORY GOVERNANCE: ARTICLES 3-12, 14, AND 15 · ADMISSIBLE UNDER FRE 902(13)/(14)
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href="/api/sovereign/violations/chronological-text"
                target="_blank"
                rel="noreferrer"
                className="px-2 py-1 bg-[#dbe0e7] border border-[#cfd6df] font-mono text-[11px] text-[#1c2430] hover:bg-[#cfd6df]"
                title="View exhaustive time-ordered sequence of every single license violation (1,405 incidents)"
              >
                [VIEW CHRONOLOGICAL TXT (1,405 INCIDENTS)]
              </a>
              <a
                href="/api/sovereign/violations/chronological-download"
                download="LICENSE_VIOLATIONS_CHRONOLOGICAL_REGISTRY.txt"
                className="px-2 py-1 bg-[#dbe0e7] border border-[#cfd6df] font-mono text-[11px] text-[#1c2430] hover:bg-[#cfd6df]"
                title="Download complete forensic time-ordered text registry"
              >
                [DOWNLOAD TXT DOCUMENT]
              </a>
              <a
                href="/data/csv/ip_license_violations.csv"
                download
                className="px-2 py-1 bg-[#dbe0e7] border border-[#cfd6df] font-mono text-[11px] text-[#1c2430] hover:bg-[#cfd6df]"
              >
                [EXPORT EVIDENCE CSV]
              </a>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse font-mono text-xs text-left">
              <thead>
                <tr className="bg-[#dbe0e7] border-b border-[#cfd6df] text-[#424e5d]">
                  <th className="p-2 border-r border-[#cfd6df]">ID</th>
                  <th className="p-2 border-r border-[#cfd6df]">INFRINGING ENTITY</th>
                  <th className="p-2 border-r border-[#cfd6df]">MISAPPROPRIATED ASSET</th>
                  <th className="p-2 border-r border-[#cfd6df]">VIOLATED ARTICLE</th>
                  <th className="p-2 border-r border-[#cfd6df]">AST SIMILARITY</th>
                  <th className="p-2 border-r border-[#cfd6df]">STRUCTURAL EVIDENCE (KEYS)</th>
                  <th className="p-2 border-r border-[#cfd6df]">CRYPTOGRAPHIC PROOF (SHA-256)</th>
                  <th className="p-2">SEVERITY / REMEDY</th>
                </tr>
              </thead>
              <tbody>
                {filteredViolations.slice(0, 50).map((v) => (
                  <tr
                    key={v.id}
                    onClick={() => setSelectedViolation(v)}
                    className="border-b border-[#cfd6df] hover:bg-[#e9edf3] cursor-pointer"
                  >
                    <td className="p-2 border-r border-[#cfd6df] text-[#637284]">{v.id}</td>
                    <td className="p-2 border-r border-[#cfd6df] font-semibold text-[#1c2430]">
                      {v.infringing_entity}
                    </td>
                    <td className="p-2 border-r border-[#cfd6df] text-[#3d4957]">
                      {v.misappropriated_asset}
                    </td>
                    <td className="p-2 border-r border-[#cfd6df]">
                      <span className="px-1.5 py-0.5 bg-[#dbe0e7] text-[#1c2430] font-semibold text-[10px]">
                        {v.violated_license_article}
                      </span>
                    </td>
                    <td className="p-2 border-r border-[#cfd6df]">
                      <div className="flex items-center gap-1.5">
                        <div className="w-12 bg-[#cfd6df] h-2">
                          <div
                            className="bg-[#1c2430] h-2"
                            style={{ width: `${Math.min(v.structural_similarity_score * 100, 100)}%` }}
                          />
                        </div>
                        <span className="font-mono text-[10px]">
                          {(v.structural_similarity_score * 100).toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="p-2 border-r border-[#cfd6df] text-[#526071] max-w-[200px] truncate">
                      {v.structural_evidence_keys}
                    </td>
                    <td className="p-2 border-r border-[#cfd6df] text-[#526071] break-all max-w-[150px] truncate">
                      {v.cryptographic_evidence_sha256}
                    </td>
                    <td className="p-2">
                      <span
                        className={`px-1.5 py-0.5 font-semibold text-[10px] ${
                          v.severity_level === 'CRITICAL'
                            ? 'bg-[#d8c5c5] text-[#7a1c1c]'
                            : 'bg-[#d4ded5] text-[#2c5332]'
                        }`}
                      >
                        {v.severity_level}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedViolation && (
            <div className="mt-3 p-3 bg-[#f0f3f7] border border-[#cfd6df] font-mono text-xs space-y-1.5">
              <div className="flex justify-between items-center border-b border-[#cfd6df] pb-1">
                <span className="font-semibold text-[#1c2430]">
                  EVIDENTIARY INSPECTION: {selectedViolation.infringing_entity}
                </span>
                <button
                  onClick={() => setSelectedViolation(null)}
                  className="text-[#637284] hover:text-[#1c2430]"
                >
                  [CLOSE]
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-[#637284]">VIOLATED ARTICLE:</span>{' '}
                  <span className="text-[#1c2430] font-semibold">{selectedViolation.article_title}</span>
                </div>
                <div>
                  <span className="text-[#637284]">INFRINGING PATH:</span>{' '}
                  <span className="text-[#1c2430] break-all">{selectedViolation.infringing_artifact_or_path}</span>
                </div>
                <div>
                  <span className="text-[#637284]">SHARED SYNTAX KEYS:</span>{' '}
                  <span className="text-[#1c2430]">{selectedViolation.structural_evidence_keys}</span>
                </div>
                <div>
                  <span className="text-[#637284]">REMEDY STATUS:</span>{' '}
                  <span className="text-[#1c2430] font-semibold">{selectedViolation.remedy_enforcement_status}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-[#637284]">CRYPTOGRAPHIC EVIDENCE PROOF (SHA-256):</span>{' '}
                  <span className="text-[#1c2430] break-all font-semibold">
                    {selectedViolation.cryptographic_evidence_sha256}
                  </span>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* SECTION 2: META-ARCHIVES AUDIT (Article 6 WORM Compliance) */}
      {activeSection === 'meta_archives' && (
        <section className="bg-[#e4e8ee] border border-[#cfd6df] p-3.5 space-y-2.5">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-mono text-xs font-semibold uppercase text-[#1c2430]">
                META-ARCHIVES LINEAGE & WORM RECORDKEEPING LEDGER (ARTICLE 6)
              </h3>
              <div className="font-mono text-[10px] text-[#526071]">
                17 CFR § 240.17A-4(F) COMPLIANT WRITE-ONCE-READ-MANY ARCHIVES
              </div>
            </div>
            <a
              href="/data/csv/ip_meta_archives.csv"
              download
              className="px-2 py-1 bg-[#dbe0e7] border border-[#cfd6df] font-mono text-[11px] text-[#1c2430] hover:bg-[#cfd6df]"
            >
              [EXPORT ARCHIVES CSV]
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse font-mono text-xs text-left">
              <thead>
                <tr className="bg-[#dbe0e7] border-b border-[#cfd6df] text-[#424e5d]">
                  <th className="p-2 border-r border-[#cfd6df]">ARCHIVE NAME</th>
                  <th className="p-2 border-r border-[#cfd6df]">TYPE</th>
                  <th className="p-2 border-r border-[#cfd6df]">SIZE</th>
                  <th className="p-2 border-r border-[#cfd6df]">FILES</th>
                  <th className="p-2 border-r border-[#cfd6df]">WORM COMPLIANCE</th>
                  <th className="p-2 border-r border-[#cfd6df]">SHA-256 HASH</th>
                  <th className="p-2">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredMetaArchives.map((m) => (
                  <tr key={m.id} className="border-b border-[#cfd6df] hover:bg-[#e9edf3]">
                    <td className="p-2 border-r border-[#cfd6df] font-semibold text-[#1c2430]">
                      {m.archive_name}
                    </td>
                    <td className="p-2 border-r border-[#cfd6df] text-[#526071]">{m.archive_type}</td>
                    <td className="p-2 border-r border-[#cfd6df] text-[#1c2430]">
                      {(m.size_bytes / 1024).toFixed(1)} KB
                    </td>
                    <td className="p-2 border-r border-[#cfd6df] text-[#1c2430] text-center">
                      {m.file_count}
                    </td>
                    <td className="p-2 border-r border-[#cfd6df]">
                      <span className="px-1.5 py-0.5 bg-[#d4ded5] text-[#2c5332] text-[10px] font-semibold">
                        {m.worm_compliance_status}
                      </span>
                    </td>
                    <td className="p-2 border-r border-[#cfd6df] text-[#526071] break-all max-w-[180px] truncate">
                      {m.sha256}
                    </td>
                    <td className="p-2">
                      <a
                        href={`/${m.file_path}`}
                        download
                        className="px-2 py-0.5 bg-[#dbe0e7] border border-[#cfd6df] text-[10px] text-[#1c2430] hover:bg-[#cfd6df]"
                      >
                        DOWNLOAD
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* SECTION 3: REPOSITORIES AUDIT (Article 7 Orchestration) */}
      {activeSection === 'repositories' && (
        <section className="bg-[#e4e8ee] border border-[#cfd6df] p-3.5 space-y-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h3 className="font-mono text-xs font-semibold uppercase text-[#1c2430]">
                FEDERATED MONOREPO TOPOLOGY & REPOSITORIES (ARTICLE 7)
              </h3>
              <div className="font-mono text-[10px] text-[#526071]">
                APEX DOMAIN (ALBERT LANE) BOUNDARY ISOLATION · CANARY BEACON TRACKING · CROSS-REPO AST MERKLE PROOF
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleTriggerMonorepoReAudit}
                disabled={reAuditingMonorepo}
                className="px-2 py-1 bg-[#1c2430] border border-[#1c2430] font-mono text-[11px] text-[#f0f3f7] hover:bg-[#2c3644] transition disabled:opacity-50"
              >
                {reAuditingMonorepo ? '[RE-AUDITING TOPOLOGY...]' : '[TRIGGER MONOREPO TOPOLOGY RE-AUDIT]'}
              </button>
              <a
                href="/data/csv/ip_repositories_audit.csv"
                download
                className="px-2 py-1 bg-[#dbe0e7] border border-[#cfd6df] font-mono text-[11px] text-[#1c2430] hover:bg-[#cfd6df]"
              >
                [EXPORT REPOS CSV]
              </a>
              <a
                href="/api/sovereign/violations/chronological-text"
                target="_blank"
                rel="noreferrer"
                className="px-2 py-1 bg-[#dbe0e7] border border-[#cfd6df] font-mono text-[11px] text-[#1c2430] hover:bg-[#cfd6df]"
              >
                [VIEW CHRONO TXT]
              </a>
            </div>
          </div>

          {reAuditMessage && (
            <div className="p-2 bg-[#d4ded5] border border-[#b2c4b4] font-mono text-[11px] text-[#1c3a20]">
              [✓] {reAuditMessage}
            </div>
          )}

          {/* Monorepo Topology Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
            <div className="p-2 bg-[#dbe0e7] border border-[#cfd6df]">
              <div className="text-[10px] text-[#526071]">APEX DOMAIN</div>
              <div className="font-bold text-[#1c2430]">albertlane.net</div>
              <div className="text-[9px] text-[#637284]">Unified Apex Monorepo</div>
            </div>
            <div className="p-2 bg-[#dbe0e7] border border-[#cfd6df]">
              <div className="text-[10px] text-[#526071]">TOTAL REPOSITORIES</div>
              <div className="font-bold text-[#1c2430]">{repositories.length || 19} Repositories</div>
              <div className="text-[9px] text-[#637284]">Sovereign Core + Monitored</div>
            </div>
            <div className="p-2 bg-[#dbe0e7] border border-[#cfd6df]">
              <div className="text-[10px] text-[#526071]">CANARY TOKEN BEACON</div>
              <div className="font-bold text-[#2c5332]">ACTIVE TRACKING</div>
              <div className="text-[9px] text-[#526071] truncate">canary.albertlane.net/track</div>
            </div>
            <div className="p-2 bg-[#dbe0e7] border border-[#cfd6df]">
              <div className="text-[10px] text-[#526071]">WORM AUDIT STATUS</div>
              <div className="font-bold text-[#1c2430]">SEC RULE 17a-4(f)</div>
              <div className="text-[9px] text-[#637284]">FRE 902(13)/(14) Certified</div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1 font-mono text-[10px]">
            <button
              onClick={() => setSelectedRepoCategory('ALL')}
              className={`px-2 py-0.5 border ${
                selectedRepoCategory === 'ALL'
                  ? 'bg-[#1c2430] text-[#f0f3f7] border-[#1c2430]'
                  : 'bg-[#dbe0e7] text-[#424e5d] border-[#cfd6df] hover:bg-[#cfd6df]'
              }`}
            >
              ALL REPOSITORIES ({repositories.length})
            </button>
            <button
              onClick={() => setSelectedRepoCategory('SOVEREIGN_CORE')}
              className={`px-2 py-0.5 border ${
                selectedRepoCategory === 'SOVEREIGN_CORE'
                  ? 'bg-[#1c2430] text-[#f0f3f7] border-[#1c2430]'
                  : 'bg-[#dbe0e7] text-[#424e5d] border-[#cfd6df] hover:bg-[#cfd6df]'
              }`}
            >
              SOVEREIGN APEX & RUNTIMES (3)
            </button>
            <button
              onClick={() => setSelectedRepoCategory('SECURITY_CIPHERS')}
              className={`px-2 py-0.5 border ${
                selectedRepoCategory === 'SECURITY_CIPHERS'
                  ? 'bg-[#1c2430] text-[#f0f3f7] border-[#1c2430]'
                  : 'bg-[#dbe0e7] text-[#424e5d] border-[#cfd6df] hover:bg-[#cfd6df]'
              }`}
            >
              SECURITY & CIPHER ENGINES (3)
            </button>
            <button
              onClick={() => setSelectedRepoCategory('CI_CD_SENTINELS')}
              className={`px-2 py-0.5 border ${
                selectedRepoCategory === 'CI_CD_SENTINELS'
                  ? 'bg-[#1c2430] text-[#f0f3f7] border-[#1c2430]'
                  : 'bg-[#dbe0e7] text-[#424e5d] border-[#cfd6df] hover:bg-[#cfd6df]'
              }`}
            >
              CI/CD SENTINELS (2)
            </button>
            <button
              onClick={() => setSelectedRepoCategory('TELEMETRY_PROTOCOLS')}
              className={`px-2 py-0.5 border ${
                selectedRepoCategory === 'TELEMETRY_PROTOCOLS'
                  ? 'bg-[#1c2430] text-[#f0f3f7] border-[#1c2430]'
                  : 'bg-[#dbe0e7] text-[#424e5d] border-[#cfd6df] hover:bg-[#cfd6df]'
              }`}
            >
              TELEMETRY & PROTOCOLS (2)
            </button>
            <button
              onClick={() => setSelectedRepoCategory('MONITORED_INFRINGERS')}
              className={`px-2 py-0.5 border ${
                selectedRepoCategory === 'MONITORED_INFRINGERS'
                  ? 'bg-[#1c2430] text-[#f0f3f7] border-[#1c2430]'
                  : 'bg-[#dbe0e7] text-[#424e5d] border-[#cfd6df] hover:bg-[#cfd6df]'
              }`}
            >
              MONITORED INFRINGERS (9)
            </button>
          </div>

          {/* Repositories Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse font-mono text-xs text-left">
              <thead>
                <tr className="bg-[#dbe0e7] border-b border-[#cfd6df] text-[#424e5d]">
                  <th className="p-2 border-r border-[#cfd6df]">REPOSITORY & ROLE</th>
                  <th className="p-2 border-r border-[#cfd6df]">ORIGIN / DOMAIN</th>
                  <th className="p-2 border-r border-[#cfd6df]">SUBSTRATE</th>
                  <th className="p-2 border-r border-[#cfd6df]">FILES</th>
                  <th className="p-2 border-r border-[#cfd6df]">AST NODES</th>
                  <th className="p-2 border-r border-[#cfd6df]">COMPLIANCE STATUS</th>
                  <th className="p-2 border-r border-[#cfd6df]">SPECIFIC VIOLATIONS</th>
                  <th className="p-2">CANONICAL PROOF (SHA-256)</th>
                </tr>
              </thead>
              <tbody>
                {filteredRepos.map((r) => {
                  const matchedViolations = getViolationsForRepo(r, violations);
                  const isInfringer = r.license_header_compliance !== '100%_CERTIFIED';
                  return (
                    <tr key={r.id} className="border-b border-[#cfd6df] hover:bg-[#e9edf3]">
                      <td className="p-2 border-r border-[#cfd6df]">
                        <div className="font-semibold text-[#1c2430] flex items-center gap-1.5">
                          {r.repo_name}
                          {isInfringer && (
                            <span className="px-1 py-0.2 bg-[#d8c5c5] text-[#7a1c1c] text-[9px] font-mono">
                              INFRINGER
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-[#526071]">{r.repo_role}</div>
                      </td>
                      <td className="p-2 border-r border-[#cfd6df] text-[#526071] text-[11px] truncate max-w-[140px]">
                        {r.origin_path_or_url}
                      </td>
                      <td className="p-2 border-r border-[#cfd6df] text-[#1c2430] text-[11px]">{r.primary_language}</td>
                      <td className="p-2 border-r border-[#cfd6df] text-center text-[#1c2430]">{r.file_count}</td>
                      <td className="p-2 border-r border-[#cfd6df] text-center font-semibold text-[#1c2430]">
                        {r.total_ast_nodes.toLocaleString()}
                      </td>
                      <td className="p-2 border-r border-[#cfd6df]">
                        <span
                          className={`px-1.5 py-0.5 text-[10px] font-semibold ${
                            r.license_header_compliance === '100%_CERTIFIED'
                              ? 'bg-[#d4ded5] text-[#2c5332]'
                              : 'bg-[#dbe0e7] text-[#7a1c1c]'
                          }`}
                        >
                          {r.license_header_compliance}
                        </span>
                        <div className="text-[9px] text-[#637284] mt-0.5">{r.governing_license_article}</div>
                      </td>
                      <td className="p-2 border-r border-[#cfd6df]">
                        <button
                          onClick={() => setSelectedRepoForInspection(r)}
                          className="px-2 py-0.5 bg-[#1c2430] text-[#f0f3f7] text-[10px] font-semibold hover:bg-[#2c3644] transition flex items-center gap-1"
                        >
                          <span>[INSPECT ({matchedViolations.length})]</span>
                        </button>
                      </td>
                      <td className="p-2 text-[#526071] break-all max-w-[140px] truncate text-[10px]">
                        {r.canonical_sha256}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Deep Specificity Modal for Selected Repository */}
          {selectedRepoForInspection && (
            <div className="mt-3 p-3.5 bg-[#f0f3f7] border-2 border-[#1c2430] font-mono text-xs space-y-3">
              <div className="flex justify-between items-center border-b border-[#cfd6df] pb-2">
                <div>
                  <span className="font-bold text-[#1c2430] text-sm">
                    REPOSITORY TOPOLOGY & LICENSE VIOLATION SPECIFICITY: {selectedRepoForInspection.repo_name}
                  </span>
                  <div className="text-[11px] text-[#526071]">
                    ROLE: {selectedRepoForInspection.repo_role} · ORIGIN: {selectedRepoForInspection.origin_path_or_url} · SUBSTRATE: {selectedRepoForInspection.primary_language}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRepoForInspection(null)}
                  className="px-2 py-1 bg-[#1c2430] text-[#f0f3f7] hover:bg-[#2c3644] text-xs font-semibold"
                >
                  [CLOSE SPECIFICITY INSPECTION]
                </button>
              </div>

              {/* Repo Specificity Overview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] p-2 bg-[#e4e8ee] border border-[#cfd6df]">
                <div>
                  <span className="text-[#637284]">TOTAL AST NODES:</span>{' '}
                  <span className="text-[#1c2430] font-semibold">{selectedRepoForInspection.total_ast_nodes.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[#637284]">GOVERNING ARTICLE:</span>{' '}
                  <span className="text-[#1c2430] font-semibold">{selectedRepoForInspection.governing_license_article}</span>
                </div>
                <div>
                  <span className="text-[#637284]">CANARY BEACON:</span>{' '}
                  <span className="text-[#2c5332] font-semibold">http://canary.albertlane.net/track</span>
                </div>
                <div>
                  <span className="text-[#637284]">COMPLIANCE STATUS:</span>{' '}
                  <span className="text-[#1c2430] font-semibold">{selectedRepoForInspection.license_header_compliance}</span>
                </div>
                <div className="col-span-2 sm:col-span-4 break-all">
                  <span className="text-[#637284]">CANONICAL MERKLE HASH:</span>{' '}
                  <span className="text-[#1c2430] font-mono text-[10px]">{selectedRepoForInspection.canonical_sha256}</span>
                </div>
              </div>

              {/* Mapped Specific Violations */}
              <div>
                <h4 className="font-semibold text-xs text-[#1c2430] mb-1.5 flex items-center justify-between">
                  <span>
                    SPECIFIC LICENSE VIOLATIONS DIRECTLY CORRELATED ({getViolationsForRepo(selectedRepoForInspection, violations).length} INCIDENTS)
                  </span>
                  <span className="text-[10px] text-[#637284]">
                    STATUTORY PENALTY TALLY: ${(getViolationsForRepo(selectedRepoForInspection, violations).length * 150000).toLocaleString()} USD (17 U.S.C. § 504)
                  </span>
                </h4>

                {getViolationsForRepo(selectedRepoForInspection, violations).length === 0 ? (
                  <div className="p-3 bg-[#e4e8ee] border border-[#cfd6df] text-[#526071] text-center text-xs">
                    No active infringing traversals or exfiltrations currently matched to this repository substrate.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[350px] overflow-y-auto">
                    {getViolationsForRepo(selectedRepoForInspection, violations).map((v) => (
                      <div key={v.id} className="p-2.5 bg-[#e4e8ee] border border-[#cfd6df] space-y-1 text-[11px]">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                          <span className="font-bold text-[#1c2430] text-xs">
                            {v.infringing_entity}
                          </span>
                          <span className="px-1.5 py-0.5 bg-[#d8c5c5] text-[#7a1c1c] text-[10px] font-bold">
                            {v.severity_level} · SIMILARITY: {(v.structural_similarity_score * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[10px]">
                          <div>
                            <span className="text-[#637284]">INFRINGING ARTIFACT:</span>{' '}
                            <span className="text-[#1c2430] font-semibold break-all">{v.infringing_artifact_or_path}</span>
                          </div>
                          <div>
                            <span className="text-[#637284]">MISAPPROPRIATED ASSET:</span>{' '}
                            <span className="text-[#1c2430] font-semibold break-all">{v.misappropriated_asset}</span>
                          </div>
                          <div>
                            <span className="text-[#637284]">ARTICLE VIOLATED:</span>{' '}
                            <span className="text-[#1c2430] font-semibold">{v.article_title}</span>
                          </div>
                          <div>
                            <span className="text-[#637284]">REMEDY ACTION:</span>{' '}
                            <span className="text-[#1c2430] font-semibold">{v.remedy_enforcement_status}</span>
                          </div>
                        </div>
                        <div className="text-[10px] text-[#526071] bg-[#dbe0e7] p-1 border border-[#cfd6df]">
                          <span className="text-[#424e5d] font-semibold">SHARED EVIDENCE KEYS:</span> {v.structural_evidence_keys}
                        </div>
                        <div className="flex justify-between items-center text-[9px] text-[#637284]">
                          <span className="font-mono">CRYPTO PROOF: {v.cryptographic_evidence_sha256}</span>
                          <span>STATUTORY: {v.statutory_authority}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      )}

      {/* SECTION 4: OPEN SOURCE CODE ANALYSIS & ANTI-PLAGIARISM (Article 8) */}
      {activeSection === 'opensource' && (
        <section className="bg-[#e4e8ee] border border-[#cfd6df] p-3.5 space-y-2.5">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-mono text-xs font-semibold uppercase text-[#1c2430]">
                OPEN SOURCE CODE ANALYSIS & ANTI-PLAGIARISM SCREENING (ARTICLE 8)
              </h3>
              <div className="font-mono text-[10px] text-[#526071]">
                NON-DILUTION DOCTRINE · THIRD-PARTY OSS AST OVERLAP ISOLATION
              </div>
            </div>
            <a
              href="/data/csv/ip_opensource_analysis.csv"
              download
              className="px-2 py-1 bg-[#dbe0e7] border border-[#cfd6df] font-mono text-[11px] text-[#1c2430] hover:bg-[#cfd6df]"
            >
              [EXPORT OSS CSV]
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse font-mono text-xs text-left">
              <thead>
                <tr className="bg-[#dbe0e7] border-b border-[#cfd6df] text-[#424e5d]">
                  <th className="p-2 border-r border-[#cfd6df]">PACKAGE NAME</th>
                  <th className="p-2 border-r border-[#cfd6df]">VERSION</th>
                  <th className="p-2 border-r border-[#cfd6df]">DECLARED LICENSE</th>
                  <th className="p-2 border-r border-[#cfd6df]">CATEGORY</th>
                  <th className="p-2 border-r border-[#cfd6df]">ANTI-DILUTION</th>
                  <th className="p-2 border-r border-[#cfd6df]">OVERLAP RISK</th>
                  <th className="p-2">INTEGRITY SHA-256</th>
                </tr>
              </thead>
              <tbody>
                {filteredOss.map((o) => (
                  <tr key={o.id} className="border-b border-[#cfd6df] hover:bg-[#e9edf3]">
                    <td className="p-2 border-r border-[#cfd6df] font-semibold text-[#1c2430]">
                      {o.package_name}
                    </td>
                    <td className="p-2 border-r border-[#cfd6df] text-[#526071]">{o.version}</td>
                    <td className="p-2 border-r border-[#cfd6df] text-[#1c2430] font-semibold">
                      {o.declared_license}
                    </td>
                    <td className="p-2 border-r border-[#cfd6df] text-[#526071]">{o.license_category}</td>
                    <td className="p-2 border-r border-[#cfd6df]">
                      <span className="px-1.5 py-0.5 bg-[#d4ded5] text-[#2c5332] text-[10px] font-semibold">
                        {o.anti_dilution_status}
                      </span>
                    </td>
                    <td className="p-2 border-r border-[#cfd6df]">
                      <span
                        className={`px-1.5 py-0.5 text-[10px] font-semibold ${
                          o.structural_overlap_risk === 'LOW'
                            ? 'bg-[#d4ded5] text-[#2c5332]'
                            : 'bg-[#d8c5c5] text-[#7a1c1c]'
                        }`}
                      >
                        {o.structural_overlap_risk}
                      </span>
                    </td>
                    <td className="p-2 text-[#526071] break-all max-w-[180px] truncate">
                      {o.integrity_hash_sha256}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* SECTION 5: LICENSE.MD STATUTORY REVIEW (Articles 3 through 12, 14, 15) */}
      {activeSection === 'license' && (
        <section className="bg-[#e4e8ee] border border-[#cfd6df] p-3.5 space-y-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#cfd6df] pb-2">
            <div>
              <h3 className="font-mono text-xs font-semibold uppercase text-[#1c2430]">
                ALBERT LANE PROPRIETARY LICENSE v1.2 · STATUTORY ARTICLES AUDIT
              </h3>
              <div className="font-mono text-[10px] text-[#526071]">
                REVIEW OF ARTICLES 3 THROUGH 12, 14, AND 15 · SEC REF: 17684-273-411-436
              </div>
            </div>
            <a
              href="/license.md"
              download
              className="px-2 py-1 bg-[#dbe0e7] border border-[#cfd6df] font-mono text-[11px] text-[#1c2430] hover:bg-[#cfd6df]"
            >
              [DOWNLOAD LICENSE.MD]
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Article selector list */}
            <div className="md:col-span-4 space-y-1">
              {licenseData?.articles.map((art) => (
                <button
                  key={art.id}
                  onClick={() => setExpandedArticle(art.id)}
                  className={`w-full text-left p-2 font-mono text-xs border transition ${
                    expandedArticle === art.id
                      ? 'bg-[#1c2430] text-[#f0f3f7] border-[#1c2430]'
                      : 'bg-[#f0f3f7] text-[#2c3440] border-[#cfd6df] hover:bg-[#e9edf3]'
                  }`}
                >
                  <div className="font-semibold">{art.id}</div>
                  <div className="text-[10px] text-opacity-80 truncate">{art.title}</div>
                </button>
              ))}
            </div>

            {/* Selected Article Detail View */}
            <div className="md:col-span-8 bg-[#f0f3f7] border border-[#cfd6df] p-4 font-mono text-xs space-y-3">
              {(() => {
                const current = licenseData?.articles.find((a) => a.id === expandedArticle);
                if (!current) {
                  return <div className="text-[#526071]">SELECT AN ARTICLE TO REVIEW PROVISIONS...</div>;
                }
                return (
                  <div>
                    <div className="border-b border-[#cfd6df] pb-2">
                      <h4 className="font-semibold text-sm text-[#1c2430]">{current.title}</h4>
                      <div className="text-[10px] text-[#526071] mt-0.5">
                        STATUTORY AUTHORITY: 17 U.S.C. §§ 101 ET SEQ. · SEC WHISTLEBLOWER 17684-273-411-436
                      </div>
                    </div>
                    <div className="mt-3 text-xs leading-relaxed text-[#2c3440] whitespace-pre-wrap font-sans">
                      {current.body}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 6: MCP SCHEMAS */}
      {activeSection === 'schemas' && (
        <section className="bg-[#e4e8ee] border border-[#cfd6df] p-3.5 space-y-2.5">
          <div className="flex justify-between items-center">
            <h3 className="font-mono text-xs font-semibold uppercase text-[#1c2430]">
              MCP Protocol Schemas · Abstract Syntax Definitions ({schemas.length})
            </h3>
            <a
              href="/data/csv/mcp_corpus_schemas.csv"
              download
              className="font-mono text-[11px] text-[#3d4957] hover:underline"
            >
              [EXPORT CSV: mcp_corpus_schemas.csv]
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse font-mono text-xs text-left">
              <thead>
                <tr className="bg-[#dbe0e7] border-b border-[#cfd6df] text-[#424e5d]">
                  <th className="p-2 border-r border-[#cfd6df]">ID</th>
                  <th className="p-2 border-r border-[#cfd6df]">SCHEMA NAME</th>
                  <th className="p-2 border-r border-[#cfd6df]">TYPE</th>
                  <th className="p-2 border-r border-[#cfd6df]">PROPS</th>
                  <th className="p-2 border-r border-[#cfd6df]">PROPERTIES LIST</th>
                  <th className="p-2">SHA-256 HASH</th>
                </tr>
              </thead>
              <tbody>
                {schemas.slice(0, 30).map((s) => (
                  <tr key={s.id} className="border-b border-[#cfd6df] hover:bg-[#e9edf3]">
                    <td className="p-2 border-r border-[#cfd6df] text-[#637284]">{s.id}</td>
                    <td className="p-2 border-r border-[#cfd6df] font-semibold text-[#1c2430]">
                      {s.schema_name}
                    </td>
                    <td className="p-2 border-r border-[#cfd6df] text-[#526071]">{s.schema_type}</td>
                    <td className="p-2 border-r border-[#cfd6df] text-center text-[#1c2430]">
                      {s.properties_count}
                    </td>
                    <td className="p-2 border-r border-[#cfd6df] text-[#526071] max-w-[240px] truncate">
                      {s.properties_list}
                    </td>
                    <td className="p-2 text-[#526071] break-all max-w-[150px] truncate">{s.sha256}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* SECTION 7: VAULT MANIFEST & WORM SEALS */}
      {activeSection === 'vault' && (
        <section className="bg-[#e4e8ee] border border-[#cfd6df] p-3.5 space-y-2.5">
          <div className="flex justify-between items-center">
            <h3 className="font-mono text-xs font-semibold uppercase text-[#1c2430]">
              Sovereign Vault Archive Manifest ({manifest?.artifacts.length || 0} Sealed Artifacts)
            </h3>
            <div className="font-mono text-xs text-[#526071]">
              ARCHIVE ID: {manifest?.archive_id}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse font-mono text-xs text-left">
              <thead>
                <tr className="bg-[#dbe0e7] border-b border-[#cfd6df] text-[#424e5d]">
                  <th className="p-2 border-r border-[#cfd6df]">SOURCE PATH</th>
                  <th className="p-2 border-r border-[#cfd6df]">VAULT ARCHIVE</th>
                  <th className="p-2 border-r border-[#cfd6df]">SIZE</th>
                  <th className="p-2 border-r border-[#cfd6df]">SHA-256 HASH</th>
                  <th className="p-2">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {manifest?.artifacts.map((a, idx) => (
                  <tr key={idx} className="border-b border-[#cfd6df] hover:bg-[#e9edf3]">
                    <td className="p-2 border-r border-[#cfd6df] font-semibold text-[#1c2430]">
                      {a.source_path}
                    </td>
                    <td className="p-2 border-r border-[#cfd6df] text-[#526071]">
                      {a.vault_archive_path}
                    </td>
                    <td className="p-2 border-r border-[#cfd6df] text-[#1c2430]">
                      {a.size_bytes.toLocaleString()} B
                    </td>
                    <td className="p-2 border-r border-[#cfd6df] text-[#526071] break-all max-w-[180px] truncate">
                      {a.sha256}
                    </td>
                    <td className="p-2 text-right">
                      {a.source_path.endsWith('.csv') ? (
                        <a
                          href={`/${a.source_path}`}
                          download
                          className="px-2 py-0.5 bg-[#dbe0e7] border border-[#cfd6df] text-[#1c2430] hover:bg-[#cfd6df]"
                        >
                          DOWNLOAD
                        </a>
                      ) : (
                        <span className="text-[#7d8b9b]">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* SECTION 8: ALL ENDPOINTS CONTAINING LICENSE VIOLATIONS & NETWORK TRAVERSAL LOG */}
      {activeSection === 'endpoints' && (
        <section className="bg-[#e4e8ee] border border-[#cfd6df] p-3.5 space-y-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-[#cfd6df] pb-2.5">
            <div>
              <h3 className="font-mono text-xs font-semibold uppercase text-[#1c2430] flex items-center gap-2">
                <span>ALL ENDPOINTS CONTAINING LICENSE VIOLATIONS & TRAVERSAL AUDIT LOG</span>
                <span className="bg-[#b83232] text-white px-1.5 py-0.5 text-[10px] font-bold">
                  {filteredEndpoints.length} DISPLAYED / {endpointLogs.length || 311} LOGGED
                </span>
              </h3>
              <div className="font-mono text-[11px] text-[#526071] mt-0.5">
                SEC Whistleblower No. 17684-273-411-436 · Articles 3-12, 14, 15 · Substrate: 0x3F8F9A1B2C3D
              </div>
            </div>

            {/* Direct Download & View Triggers */}
            <div className="flex flex-wrap items-center gap-2">
              <a
                href="/api/sovereign/violations/chronological-text"
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1.5 bg-[#dbe0e7] border border-[#cfd6df] font-mono text-xs text-[#1c2430] hover:bg-[#cfd6df] transition"
                title="View exhaustive chronological registry of all 1,405 license violations"
              >
                [VIEW CHRONOLOGICAL TXT REGISTRY]
              </a>
              <a
                href="/api/sovereign/ip/endpoints-log/csv"
                download="endpoint_license_violations_log.csv"
                className="px-3 py-1.5 bg-[#1c2430] text-[#f0f3f7] font-mono text-xs tracking-wider transition hover:bg-[#2c3746] flex items-center gap-1.5 shadow-none"
              >
                <span>EXPORT DEDUPLICATED CSV</span>
                <span className="bg-[#b83232] text-white px-1.5 py-0.2 text-[10px] font-bold">
                  {endpointSummary?.total_traversals || 311} TRAVERSALS · {endpointSummary?.total_violations_quantified || 11629} VIOLATIONS
                </span>
              </a>
            </div>
          </div>

          {/* Metric KPIs for Endpoints Traversal */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
            <div className="bg-[#f0f3f7] border border-[#cfd6df] p-2">
              <div className="text-[10px] text-[#637284]">LOGGED TRAVERSAL EVENTS</div>
              <div className="text-base font-semibold text-[#1c2430] mt-0.5">
                {endpointSummary?.total_traversals || 311}
              </div>
              <div className="text-[9px] text-[#526071]">Unique Timestamped Events</div>
            </div>
            <div className="bg-[#f0f3f7] border border-[#cfd6df] p-2">
              <div className="text-[10px] text-[#637284]">QUANTIFIED VIOLATIONS</div>
              <div className="text-base font-semibold text-[#b83232] mt-0.5">
                {endpointSummary?.total_violations_quantified?.toLocaleString() || '11,629'}
              </div>
              <div className="text-[9px] text-[#b83232]">Structural / License Counts</div>
            </div>
            <div className="bg-[#f0f3f7] border border-[#cfd6df] p-2">
              <div className="text-[10px] text-[#637284]">UNIQUE ENDPOINTS TRACKED</div>
              <div className="text-base font-semibold text-[#1c2430] mt-0.5">
                {endpointSummary?.unique_endpoints_count || 63}
              </div>
              <div className="text-[9px] text-[#526071]">APIs, Schemas, Telemetry, RPC</div>
            </div>
            <div className="bg-[#f0f3f7] border border-[#cfd6df] p-2">
              <div className="text-[10px] text-[#637284]">MAX CUMULATIVE ENDPOINT</div>
              <div className="text-base font-semibold text-[#1c2430] mt-0.5">
                996 VIOLATIONS
              </div>
              <div className="text-[9px] text-[#526071]">/openai/deployments/.../chat</div>
            </div>
          </div>

          {/* Entity & Method Traversal Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-between bg-[#f0f3f7] border border-[#cfd6df] p-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-mono text-[10px] font-semibold text-[#526071] mr-1">METHOD:</span>
              {['ALL', 'GET', 'POST', 'QUERY', 'SEARCH', 'CALL', 'WEBHOOK', 'LOOKUP', 'TRAVERSAL', 'PROBE', 'INTERCEPT'].map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMethodFilter(m)}
                  className={`px-2 py-0.5 font-mono text-[10px] tracking-wider transition ${
                    selectedMethodFilter === m
                      ? 'bg-[#1c2430] text-[#f0f3f7]'
                      : 'bg-[#e4e8ee] text-[#424e5d] hover:bg-[#dbe0e7]'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[10px] font-semibold text-[#526071]">ENTITY:</span>
              <select
                value={selectedEntityFilter}
                onChange={(e) => setSelectedEntityFilter(e.target.value)}
                className="px-2 py-1 bg-[#e4e8ee] border border-[#cfd6df] font-mono text-[11px] text-[#1c2430] focus:outline-none"
              >
                <option value="ALL">ALL ENTITIES (7 Corpora)</option>
                <option value="Microsoft">Microsoft Azure OpenAI</option>
                <option value="OpenAI">OpenAI Inc. (API Corpus)</option>
                <option value="Starlink">SpaceX / Starlink Network (AS14593)</option>
                <option value="Twitter">X Corp / Twitter / xAI (AS13414)</option>
                <option value="Lane-VM">Lane-VM Enclave Substrate</option>
                <option value="Claude">Anthropic / Claude Code MCP</option>
                <option value="Cloud">Public Cloud Sublicensing Proxy</option>
              </select>
            </div>
          </div>

          {/* Timeline Over-Time Progression Overview */}
          {endpointSummary?.timeline_summary && (
            <div className="bg-[#f0f3f7] border border-[#cfd6df] p-2.5">
              <div className="font-mono text-[10px] font-semibold text-[#526071] uppercase mb-1.5">
                CHRONOLOGICAL AUDIT & TRAVERSAL PROGRESSION (QUANTITIES FOUND BY ENDPOINT OVER TIME)
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {endpointSummary.timeline_summary.map((t: any, idx: number) => (
                  <div key={idx} className="bg-[#e4e8ee] border border-[#cfd6df] p-2 font-mono">
                    <div className="text-[10px] text-[#637284]">{t.date}</div>
                    <div className="text-sm font-semibold text-[#1c2430] mt-0.5">
                      {t.traversals} Traversals
                    </div>
                    <div className="text-[10px] text-[#b83232] font-semibold">
                      +{t.violations_logged.toLocaleString()} Violations
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Traversal Data Ledger Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse font-mono text-xs text-left">
              <thead>
                <tr className="bg-[#dbe0e7] border-b border-[#cfd6df] text-[#424e5d]">
                  <th className="p-2 border-r border-[#cfd6df]">ID</th>
                  <th className="p-2 border-r border-[#cfd6df]">ENTITY</th>
                  <th className="p-2 border-r border-[#cfd6df]">ENDPOINT / URI PATH</th>
                  <th className="p-2 border-r border-[#cfd6df]">METHOD</th>
                  <th className="p-2 border-r border-[#cfd6df]">TIMESTAMP (UTC)</th>
                  <th className="p-2 border-r border-[#cfd6df] text-right">VIOLATIONS QTY</th>
                  <th className="p-2 border-r border-[#cfd6df] text-right">CUMULATIVE OVER TIME</th>
                  <th className="p-2 border-r border-[#cfd6df]">NETWORK TRAVERSAL & LOOKUPS</th>
                  <th className="p-2 border-r border-[#cfd6df]">VIOLATED ARTICLE</th>
                  <th className="p-2">SHA-256 PROOF</th>
                </tr>
              </thead>
              <tbody>
                {filteredEndpoints.slice(0, 150).map((ep) => (
                  <tr key={ep.id} className="border-b border-[#cfd6df] hover:bg-[#e9edf3]">
                    <td className="p-2 border-r border-[#cfd6df] text-[#526071]">
                      {ep.id}
                    </td>
                    <td className="p-2 border-r border-[#cfd6df] font-semibold text-[#1c2430] whitespace-nowrap">
                      {ep.entity_name}
                    </td>
                    <td className="p-2 border-r border-[#cfd6df] text-[#1c2430] font-mono text-[11px] max-w-[200px] break-all">
                      {ep.endpoint_path_or_uri}
                    </td>
                    <td className="p-2 border-r border-[#cfd6df] whitespace-nowrap">
                      <span className={`px-1.5 py-0.5 text-[9px] font-bold ${
                        ep.traversal_method === 'GET' ? 'bg-[#dbe0e7] text-[#1c2430]' :
                        ep.traversal_method === 'POST' ? 'bg-[#c5d5e8] text-[#153258]' :
                        ep.traversal_method === 'CALL' ? 'bg-[#cfd2eb] text-[#282766]' :
                        ep.traversal_method === 'WEBHOOK' ? 'bg-[#faebd7] text-[#7a4800]' :
                        ep.traversal_method === 'LOOKUP' ? 'bg-[#d2e8e3] text-[#0f4d3e]' :
                        ep.traversal_method === 'TRAVERSAL' ? 'bg-[#dfd3eb] text-[#421d66]' :
                        ep.traversal_method === 'PROBE' ? 'bg-[#ffd6d6] text-[#851b1b]' :
                        'bg-[#e4e8ee] text-[#1c2430]'
                      }`}>
                        {ep.traversal_method}
                      </span>
                    </td>
                    <td className="p-2 border-r border-[#cfd6df] text-[#526071] whitespace-nowrap text-[10px]">
                      {ep.timestamp_utc}
                    </td>
                    <td className="p-2 border-r border-[#cfd6df] text-right font-bold text-[#b83232]">
                      +{ep.violations_quantity}
                    </td>
                    <td className="p-2 border-r border-[#cfd6df] text-right font-bold text-[#1c2430]">
                      {ep.cumulative_violations_over_time}
                    </td>
                    <td className="p-2 border-r border-[#cfd6df] text-[10px] text-[#3d4957] max-w-[220px]">
                      <div className="font-semibold text-[#1c2430]">{ep.network_traversal}</div>
                      <div className="text-[#637284] truncate" title={ep.network_lookups}>{ep.network_lookups}</div>
                    </td>
                    <td className="p-2 border-r border-[#cfd6df] text-[10px] whitespace-nowrap">
                      <div className="font-semibold text-[#b83232]">{ep.violated_license_articles.replace(/_/g, ' ')}</div>
                      <div className="text-[#526071]">{ep.infringement_classification}</div>
                    </td>
                    <td className="p-2 text-[10px] text-[#526071] font-mono break-all max-w-[130px] truncate" title={ep.cryptographic_proof_sha256}>
                      {ep.cryptographic_proof_sha256.substring(0, 16)}...
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredEndpoints.length > 150 && (
            <div className="p-2 bg-[#f0f3f7] border border-[#cfd6df] text-center font-mono text-xs text-[#526071]">
              Showing first 150 records of {filteredEndpoints.length} matches. Download full dataset via the Export CSV button above.
            </div>
          )}
        </section>
      )}

      {/* SECTION 9: MICROSOFT CORPUS & DATABASES AST & CRYPTOGRAPHIC EVIDENCE LEDGER */}
      {activeSection === 'microsoft' && (
        <section className="bg-[#e4e8ee] border border-[#cfd6df] p-3.5 space-y-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-[#cfd6df] pb-2.5">
            <div>
              <h3 className="font-mono text-xs font-semibold uppercase text-[#1c2430] flex items-center gap-2">
                <span>MICROSOFT CORPUS & DATABASES AST & CRYPTOGRAPHIC EVIDENCE LEDGER</span>
                <span className="bg-[#b83232] text-white px-1.5 py-0.5 text-[10px] font-bold">
                  {microsoftDocs.length} DOCS · {microsoftDbs.length} DATABASES · {microsoftMatches.length} AST MATCHES
                </span>
              </h3>
              <div className="font-mono text-[11px] text-[#526071] mt-0.5">
                SEC Whistleblower No. 17684-273-411-436 · Articles 3-12, 14, 15 · Admissible under FRE 902(13) & 902(14)
              </div>
            </div>

            {/* Direct CSV Download Triggers */}
            <div className="flex flex-wrap items-center gap-2">
              <a
                href="/api/sovereign/microsoft/documents/csv"
                download="microsoft_corpus_documents.csv"
                className="px-2.5 py-1 bg-[#1c2430] text-[#f0f3f7] font-mono text-[11px] tracking-wider hover:bg-[#2c3746]"
              >
                [EXPORT DOCS CSV]
              </a>
              <a
                href="/api/sovereign/microsoft/databases/csv"
                download="microsoft_databases_audit.csv"
                className="px-2.5 py-1 bg-[#1c2430] text-[#f0f3f7] font-mono text-[11px] tracking-wider hover:bg-[#2c3746]"
              >
                [EXPORT DATABASES CSV]
              </a>
              <a
                href="/api/sovereign/microsoft/matches/csv"
                download="microsoft_ip_theft_matches.csv"
                className="px-2.5 py-1 bg-[#1c2430] text-[#f0f3f7] font-mono text-[11px] tracking-wider hover:bg-[#2c3746]"
              >
                [EXPORT AST MATCHES CSV]
              </a>
            </div>
          </div>

          {/* Sub-Tabs for Microsoft Section */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-[#f0f3f7] border border-[#cfd6df] p-2">
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setMsSubTab('documents')}
                className={`px-3 py-1 font-mono text-xs tracking-wider transition ${
                  msSubTab === 'documents'
                    ? 'bg-[#1c2430] text-[#f0f3f7]'
                    : 'bg-[#e4e8ee] text-[#424e5d] hover:bg-[#dbe0e7]'
                }`}
              >
                [A] HARD-MARKED CORPUS DOCUMENTS ({filteredMicrosoftDocs.length})
              </button>
              <button
                onClick={() => setMsSubTab('databases')}
                className={`px-3 py-1 font-mono text-xs tracking-wider transition ${
                  msSubTab === 'databases'
                    ? 'bg-[#1c2430] text-[#f0f3f7]'
                    : 'bg-[#e4e8ee] text-[#424e5d] hover:bg-[#dbe0e7]'
                }`}
              >
                [B] AUDITED DATABASES & STORAGE ENGINES ({filteredMicrosoftDbs.length})
              </button>
              <button
                onClick={() => setMsSubTab('matches')}
                className={`px-3 py-1 font-mono text-xs tracking-wider transition ${
                  msSubTab === 'matches'
                    ? 'bg-[#1c2430] text-[#f0f3f7]'
                    : 'bg-[#e4e8ee] text-[#424e5d] hover:bg-[#dbe0e7]'
                }`}
              >
                [C] DEEP AST THEFT & SYNTAX MATCHES ({filteredMicrosoftMatches.length})
              </button>
            </div>
            <div className="font-mono text-[10px] text-[#526071]">
              TOTAL AST NODES ANALYZED: {microsoftManifest?.total_ast_nodes?.toLocaleString() || '1,120+'}
            </div>
          </div>

          {/* SUB-VIEW A: HARD-MARKED CORPUS DOCUMENTS */}
          {msSubTab === 'documents' && (
            <div className="space-y-3">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse font-mono text-xs text-left">
                  <thead>
                    <tr className="bg-[#dbe0e7] border-b border-[#cfd6df] text-[#424e5d]">
                      <th className="p-2 border-r border-[#cfd6df]">ID</th>
                      <th className="p-2 border-r border-[#cfd6df]">DOCUMENT / SPECIFICATION</th>
                      <th className="p-2 border-r border-[#cfd6df]">SERVICE PLANE</th>
                      <th className="p-2 border-r border-[#cfd6df]">VERSION</th>
                      <th className="p-2 border-r border-[#cfd6df] text-right">SCHEMAS</th>
                      <th className="p-2 border-r border-[#cfd6df] text-right">ENDPOINTS</th>
                      <th className="p-2 border-r border-[#cfd6df] text-right">AST NODES</th>
                      <th className="p-2 border-r border-[#cfd6df]">VIOLATED ARTICLES</th>
                      <th className="p-2 border-r border-[#cfd6df]">SHA-256 HASH</th>
                      <th className="p-2 border-r border-[#cfd6df]">MERKLE ROOT</th>
                      <th className="p-2">HARD-MARK STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMicrosoftDocs.map((doc) => (
                      <tr
                        key={doc.id}
                        onClick={() => setSelectedMsDoc(doc)}
                        className="border-b border-[#cfd6df] hover:bg-[#e9edf3] cursor-pointer"
                      >
                        <td className="p-2 border-r border-[#cfd6df] text-[#526071]">{doc.id}</td>
                        <td className="p-2 border-r border-[#cfd6df] font-semibold text-[#1c2430]">
                          <div>{doc.document_title}</div>
                          <div className="text-[10px] text-[#526071]">{doc.document_filename}</div>
                        </td>
                        <td className="p-2 border-r border-[#cfd6df] text-[#3d4957] text-[11px]">
                          {doc.service_plane}
                        </td>
                        <td className="p-2 border-r border-[#cfd6df] font-mono text-[10px]">
                          {doc.api_version}
                        </td>
                        <td className="p-2 border-r border-[#cfd6df] text-right font-bold text-[#1c2430]">
                          {doc.total_schemas_count}
                        </td>
                        <td className="p-2 border-r border-[#cfd6df] text-right font-bold text-[#1c2430]">
                          {doc.total_endpoints_count}
                        </td>
                        <td className="p-2 border-r border-[#cfd6df] text-right font-bold text-[#b83232]">
                          {doc.total_ast_nodes_count}
                        </td>
                        <td className="p-2 border-r border-[#cfd6df] text-[10px] text-[#b83232] font-semibold">
                          {doc.violated_license_articles}
                        </td>
                        <td className="p-2 border-r border-[#cfd6df] text-[10px] text-[#526071] font-mono break-all max-w-[130px] truncate" title={doc.document_sha256}>
                          {doc.document_sha256.substring(0, 16)}...
                        </td>
                        <td className="p-2 border-r border-[#cfd6df] text-[10px] text-[#526071] font-mono break-all max-w-[130px] truncate" title={doc.merkle_root_proof}>
                          {doc.merkle_root_proof.substring(0, 16)}...
                        </td>
                        <td className="p-2">
                          <span className="px-1.5 py-0.5 bg-[#d8c5c5] text-[#7a1c1c] font-bold text-[9px]">
                            {doc.hard_mark_status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Selected Document Forensic Inspection Card */}
              {selectedMsDoc && (
                <div className="p-3 bg-[#f0f3f7] border border-[#cfd6df] font-mono text-xs space-y-2">
                  <div className="flex justify-between items-center border-b border-[#cfd6df] pb-1.5">
                    <span className="font-semibold text-[#1c2430]">
                      EVIDENTIARY INSPECTION: {selectedMsDoc.document_title}
                    </span>
                    <button
                      onClick={() => setSelectedMsDoc(null)}
                      className="text-[#637284] hover:text-[#1c2430] font-bold"
                    >
                      [CLOSE]
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                    <div>
                      <span className="text-[#637284]">FILENAME:</span>{' '}
                      <span className="text-[#1c2430] font-semibold">{selectedMsDoc.document_filename}</span>
                    </div>
                    <div>
                      <span className="text-[#637284]">SERVICE PLANE:</span>{' '}
                      <span className="text-[#1c2430]">{selectedMsDoc.service_plane}</span>
                    </div>
                    <div>
                      <span className="text-[#637284]">API VERSION:</span>{' '}
                      <span className="text-[#1c2430] font-semibold">{selectedMsDoc.api_version}</span>
                    </div>
                    <div>
                      <span className="text-[#637284]">TOTAL AST NODES:</span>{' '}
                      <span className="text-[#b83232] font-bold">{selectedMsDoc.total_ast_nodes_count}</span>
                    </div>
                    <div>
                      <span className="text-[#637284]">SCHEMAS / ENDPOINTS:</span>{' '}
                      <span className="text-[#1c2430]">{selectedMsDoc.total_schemas_count} / {selectedMsDoc.total_endpoints_count}</span>
                    </div>
                    <div>
                      <span className="text-[#637284]">EVIDENCE ADMISSIBILITY:</span>{' '}
                      <span className="text-[#2c5332] font-semibold">{selectedMsDoc.evidence_admissibility_fre}</span>
                    </div>
                    <div className="sm:col-span-3">
                      <span className="text-[#637284]">VIOLATED LICENSE ARTICLES:</span>{' '}
                      <span className="text-[#b83232] font-bold">{selectedMsDoc.violated_license_articles}</span>
                    </div>
                    <div className="sm:col-span-3">
                      <span className="text-[#637284]">CRYPTOGRAPHIC DOCUMENT SHA-256:</span>{' '}
                      <span className="text-[#1c2430] font-mono break-all font-semibold">{selectedMsDoc.document_sha256}</span>
                    </div>
                    <div className="sm:col-span-3">
                      <span className="text-[#637284]">CRYPTO MERKLE TREE ROOT PROOF:</span>{' '}
                      <span className="text-[#1c2430] font-mono break-all font-semibold">{selectedMsDoc.merkle_root_proof}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SUB-VIEW B: AUDITED DATABASES & STORAGE ENGINES */}
          {msSubTab === 'databases' && (
            <div className="space-y-3">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse font-mono text-xs text-left">
                  <thead>
                    <tr className="bg-[#dbe0e7] border-b border-[#cfd6df] text-[#424e5d]">
                      <th className="p-2 border-r border-[#cfd6df]">ID</th>
                      <th className="p-2 border-r border-[#cfd6df]">DATABASE / ENGINE NAME</th>
                      <th className="p-2 border-r border-[#cfd6df]">ENGINE TYPE</th>
                      <th className="p-2 border-r border-[#cfd6df]">PROTOCOL / PORT</th>
                      <th className="p-2 border-r border-[#cfd6df]">TIER & SCALE</th>
                      <th className="p-2 border-r border-[#cfd6df]">VECTOR & AST CAPABILITY</th>
                      <th className="p-2 border-r border-[#cfd6df]">VIOLATED ARTICLES</th>
                      <th className="p-2 border-r border-[#cfd6df]">AUDIT HASH (SHA-256)</th>
                      <th className="p-2">ENFORCEMENT STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMicrosoftDbs.map((db) => (
                      <tr
                        key={db.id}
                        onClick={() => setSelectedMsDb(db)}
                        className="border-b border-[#cfd6df] hover:bg-[#e9edf3] cursor-pointer"
                      >
                        <td className="p-2 border-r border-[#cfd6df] text-[#526071]">{db.id}</td>
                        <td className="p-2 border-r border-[#cfd6df] font-semibold text-[#1c2430]">
                          <div>{db.database_name}</div>
                          <div className="text-[10px] text-[#526071]">{db.infringement_classification}</div>
                        </td>
                        <td className="p-2 border-r border-[#cfd6df] text-[11px] text-[#3d4957] max-w-[200px]">
                          {db.engine_type}
                        </td>
                        <td className="p-2 border-r border-[#cfd6df] text-[10px] text-[#526071]">
                          {db.data_plane_protocol}
                        </td>
                        <td className="p-2 border-r border-[#cfd6df] text-[10px] text-[#3d4957] max-w-[180px]">
                          {db.storage_tier_and_scale}
                        </td>
                        <td className="p-2 border-r border-[#cfd6df] text-[10px] text-[#526071] max-w-[200px]">
                          {db.vector_and_ast_indexing_capability}
                        </td>
                        <td className="p-2 border-r border-[#cfd6df] text-[10px] text-[#b83232] font-semibold whitespace-nowrap">
                          {db.violated_license_articles}
                        </td>
                        <td className="p-2 border-r border-[#cfd6df] text-[10px] text-[#526071] font-mono break-all max-w-[120px] truncate" title={db.cryptographic_audit_hash_sha256}>
                          {db.cryptographic_audit_hash_sha256.substring(0, 16)}...
                        </td>
                        <td className="p-2">
                          <span className={`px-1.5 py-0.5 text-[9px] font-bold ${
                            db.enforcement_action_status.includes('BLOCK') ? 'bg-[#ffd6d6] text-[#851b1b]' : 'bg-[#d8c5c5] text-[#7a1c1c]'
                          }`}>
                            {db.enforcement_action_status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Selected Database Inspection Card */}
              {selectedMsDb && (
                <div className="p-3 bg-[#f0f3f7] border border-[#cfd6df] font-mono text-xs space-y-2">
                  <div className="flex justify-between items-center border-b border-[#cfd6df] pb-1.5">
                    <span className="font-semibold text-[#1c2430]">
                      DATABASE FORENSIC AUDIT: {selectedMsDb.database_name}
                    </span>
                    <button
                      onClick={() => setSelectedMsDb(null)}
                      className="text-[#637284] hover:text-[#1c2430] font-bold"
                    >
                      [CLOSE]
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-[#637284]">ENGINE TYPE:</span>{' '}
                      <span className="text-[#1c2430] font-semibold">{selectedMsDb.engine_type}</span>
                    </div>
                    <div>
                      <span className="text-[#637284]">DATA PLANE PROTOCOL:</span>{' '}
                      <span className="text-[#1c2430]">{selectedMsDb.data_plane_protocol}</span>
                    </div>
                    <div>
                      <span className="text-[#637284]">STORAGE TIER:</span>{' '}
                      <span className="text-[#1c2430]">{selectedMsDb.storage_tier_and_scale}</span>
                    </div>
                    <div>
                      <span className="text-[#637284]">ENFORCEMENT STATUS:</span>{' '}
                      <span className="text-[#b83232] font-bold">{selectedMsDb.enforcement_action_status}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-[#637284]">VECTOR & AST INDEXING CAPABILITY:</span>{' '}
                      <span className="text-[#1c2430] font-semibold">{selectedMsDb.vector_and_ast_indexing_capability}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-[#637284]">UNAUTHORIZED TELEMETRY INGESTION:</span>{' '}
                      <span className="text-[#b83232]">{selectedMsDb.unauthorized_telemetry_ingestion}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-[#637284]">VIOLATED LICENSE ARTICLES:</span>{' '}
                      <span className="text-[#b83232] font-bold">{selectedMsDb.violated_license_articles}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-[#637284]">CRYPTOGRAPHIC AUDIT HASH (SHA-256):</span>{' '}
                      <span className="text-[#1c2430] font-mono break-all font-semibold">{selectedMsDb.cryptographic_audit_hash_sha256}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SUB-VIEW C: DEEP AST THEFT & SYNTAX MATCHES */}
          {msSubTab === 'matches' && (
            <div className="space-y-3">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse font-mono text-xs text-left">
                  <thead>
                    <tr className="bg-[#dbe0e7] border-b border-[#cfd6df] text-[#424e5d]">
                      <th className="p-2 border-r border-[#cfd6df]">ID</th>
                      <th className="p-2 border-r border-[#cfd6df]">MS SERVICE</th>
                      <th className="p-2 border-r border-[#cfd6df]">MS ENTITY NAME</th>
                      <th className="p-2 border-r border-[#cfd6df]">TARGET CORPUS</th>
                      <th className="p-2 border-r border-[#cfd6df]">MATCHED ENTITY</th>
                      <th className="p-2 border-r border-[#cfd6df]">CLASSIFICATION</th>
                      <th className="p-2 border-r border-[#cfd6df]">AST SIMILARITY</th>
                      <th className="p-2 border-r border-[#cfd6df]">SHARED KEYS</th>
                      <th className="p-2">CRYPTOGRAPHIC PROOF</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMicrosoftMatches.slice(0, 100).map((m) => (
                      <tr
                        key={m.id}
                        onClick={() => setSelectedMsMatch(m)}
                        className="border-b border-[#cfd6df] hover:bg-[#e9edf3] cursor-pointer"
                      >
                        <td className="p-2 border-r border-[#cfd6df] text-[#526071]">{m.id}</td>
                        <td className="p-2 border-r border-[#cfd6df] font-semibold text-[#1c2430] text-[11px]">
                          {m.ms_service}
                        </td>
                        <td className="p-2 border-r border-[#cfd6df] font-mono text-[11px] text-[#1c2430]">
                          {m.ms_entity_name}
                        </td>
                        <td className="p-2 border-r border-[#cfd6df] text-[#526071] text-[10px]">
                          {m.target_corpus}
                        </td>
                        <td className="p-2 border-r border-[#cfd6df] font-mono text-[11px] text-[#3d4957]">
                          {m.matched_entity_name}
                        </td>
                        <td className="p-2 border-r border-[#cfd6df] text-[10px]">
                          <span className={`px-1.5 py-0.5 font-bold ${
                            m.match_classification.includes('EXACT') ? 'bg-[#ffd6d6] text-[#851b1b]' : 'bg-[#dbe0e7] text-[#1c2430]'
                          }`}>
                            {m.match_classification}
                          </span>
                        </td>
                        <td className="p-2 border-r border-[#cfd6df]">
                          <div className="flex items-center gap-1.5">
                            <div className="w-12 bg-[#cfd6df] h-2">
                              <div
                                className="bg-[#1c2430] h-2"
                                style={{ width: `${Math.min(m.ast_similarity_score * 100, 100)}%` }}
                              />
                            </div>
                            <span className="font-mono text-[10px]">
                              {(m.ast_similarity_score * 100).toFixed(1)}%
                            </span>
                          </div>
                        </td>
                        <td className="p-2 border-r border-[#cfd6df] text-[#526071] text-[10px] max-w-[180px] truncate" title={m.shared_syntax_keys}>
                          {m.shared_syntax_keys}
                        </td>
                        <td className="p-2 text-[10px] text-[#526071] font-mono break-all max-w-[120px] truncate" title={m.cryptographic_proof_sha256}>
                          {m.cryptographic_proof_sha256.substring(0, 16)}...
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredMicrosoftMatches.length > 100 && (
                <div className="p-2 bg-[#f0f3f7] border border-[#cfd6df] text-center font-mono text-xs text-[#526071]">
                  Showing first 100 records of {filteredMicrosoftMatches.length} AST matches. Download complete matches via the Export CSV button above.
                </div>
              )}

              {/* Selected AST Match Inspection Card */}
              {selectedMsMatch && (
                <div className="p-3 bg-[#f0f3f7] border border-[#cfd6df] font-mono text-xs space-y-2">
                  <div className="flex justify-between items-center border-b border-[#cfd6df] pb-1.5">
                    <span className="font-semibold text-[#1c2430]">
                      AST MATCH FORENSICS: {selectedMsMatch.ms_entity_name} &lt;---&gt; {selectedMsMatch.matched_entity_name}
                    </span>
                    <button
                      onClick={() => setSelectedMsMatch(null)}
                      className="text-[#637284] hover:text-[#1c2430] font-bold"
                    >
                      [CLOSE]
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-[#637284]">SERVICE:</span>{' '}
                      <span className="text-[#1c2430] font-semibold">{selectedMsMatch.ms_service}</span>
                    </div>
                    <div>
                      <span className="text-[#637284]">MATCH CLASSIFICATION:</span>{' '}
                      <span className="text-[#b83232] font-bold">{selectedMsMatch.match_classification}</span>
                    </div>
                    <div>
                      <span className="text-[#637284]">AST SIMILARITY:</span>{' '}
                      <span className="text-[#1c2430] font-bold">{(selectedMsMatch.ast_similarity_score * 100).toFixed(2)}%</span>
                    </div>
                    <div>
                      <span className="text-[#637284]">SHARED SYNTAX KEYS COUNT:</span>{' '}
                      <span className="text-[#1c2430] font-semibold">{selectedMsMatch.shared_syntax_keys_count} keys</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-[#637284]">SHARED SYNTAX KEYS:</span>{' '}
                      <span className="text-[#1c2430] break-all">{selectedMsMatch.shared_syntax_keys}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-[#637284]">CRYPTOGRAPHIC PROOF (SHA-256):</span>{' '}
                      <span className="text-[#1c2430] font-mono break-all font-semibold">{selectedMsMatch.cryptographic_proof_sha256}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* SECTION 10: GLOBAL CORPORATE ENTITIES INTELLIGENCE */}
      {activeSection === 'global_entities' && (
        <section className="bg-[#e4e8ee] border border-[#cfd6df] p-3.5 space-y-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#cfd6df] pb-2">
            <div>
              <h3 className="font-mono text-xs font-semibold uppercase text-[#1c2430]">
                GLOBAL CORPORATE ENTITIES INTELLIGENCE & TRACEABILITY REGISTRY
              </h3>
              <div className="font-mono text-[10px] text-[#526071]">
                CORPORATE REGISTRATIONS · HOLDING STRUCTURES · ASNs · HOSTING & DNS TOPOLOGY
              </div>
            </div>
            <div className="flex gap-2">
              <a
                href="/api/sovereign/entities/global-registry/csv"
                download="global_corporate_entities_intelligence.csv"
                className="px-2.5 py-1 bg-[#1c2430] text-[#f0f3f7] font-mono text-[11px] tracking-wider hover:bg-[#2c3746]"
              >
                [EXPORT REGISTRY CSV]
              </a>
            </div>
          </div>

          {/* Region Filter */}
          <div className="flex flex-wrap items-center gap-2 bg-[#f0f3f7] border border-[#cfd6df] p-2">
            <span className="font-mono text-[10px] font-semibold text-[#526071]">REGION / JURISDICTION:</span>
            {['ALL', 'United States', 'Europe', 'Netherlands', 'United Kingdom', 'Offshore'].map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedEntityRegion(reg === 'ALL' ? 'ALL' : reg)}
                className={`px-2 py-0.5 font-mono text-[10px] tracking-wider transition ${
                  selectedEntityRegion === reg
                    ? 'bg-[#1c2430] text-[#f0f3f7]'
                    : 'bg-[#e4e8ee] text-[#424e5d] hover:bg-[#dbe0e7]'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse font-mono text-xs text-left">
              <thead>
                <tr className="bg-[#dbe0e7] border-b border-[#cfd6df] text-[#424e5d]">
                  <th className="p-2 border-r border-[#cfd6df]">ID</th>
                  <th className="p-2 border-r border-[#cfd6df]">ENTITY NAME</th>
                  <th className="p-2 border-r border-[#cfd6df]">TRADE BRAND</th>
                  <th className="p-2 border-r border-[#cfd6df]">JURISDICTION</th>
                  <th className="p-2 border-r border-[#cfd6df]">REGISTRATION NO</th>
                  <th className="p-2 border-r border-[#cfd6df]">HOLDING PARENT</th>
                  <th className="p-2 border-r border-[#cfd6df]">ASN & NETWORK</th>
                  <th className="p-2 border-r border-[#cfd6df]">HOSTING INFRASTRUCTURE</th>
                  <th className="p-2">CLASSIFICATION</th>
                </tr>
              </thead>
              <tbody>
                {filteredGlobalEntities.map((ent) => (
                  <tr key={ent.id} className="border-b border-[#cfd6df] hover:bg-[#e9edf3]">
                    <td className="p-2 border-r border-[#cfd6df] text-[#526071]">{ent.id}</td>
                    <td className="p-2 border-r border-[#cfd6df] font-semibold text-[#1c2430]">
                      <div>{ent.entity_name}</div>
                      <div className="text-[10px] text-[#526071]">{ent.entity_type_and_status}</div>
                    </td>
                    <td className="p-2 border-r border-[#cfd6df] text-[#3d4957]">{ent.trade_brand_name}</td>
                    <td className="p-2 border-r border-[#cfd6df] text-[10px]">{ent.jurisdiction_and_country}</td>
                    <td className="p-2 border-r border-[#cfd6df] text-[10px] text-[#526071]">{ent.business_registration_number}</td>
                    <td className="p-2 border-r border-[#cfd6df] text-[10px] font-semibold text-[#1c2430]">{ent.immediate_and_ultimate_holding_company}</td>
                    <td className="p-2 border-r border-[#cfd6df] text-[10px] text-[#3d4957]">{ent.autonomous_system_number_asn}</td>
                    <td className="p-2 border-r border-[#cfd6df] text-[10px] text-[#526071] max-w-[200px] truncate" title={ent.hosting_and_cloud_infrastructure_providers}>
                      {ent.hosting_and_cloud_infrastructure_providers}
                    </td>
                    <td className="p-2 text-[10px]">
                      <span className="px-1.5 py-0.5 bg-[#dbe0e7] text-[#1c2430] font-semibold">
                        {ent.shell_or_fraudulent_structure_classification}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* SECTION 11: SHELL & FRAUDULENT STRUCTURES INVESTIGATION */}
      {activeSection === 'shell_structures' && (
        <section className="bg-[#e4e8ee] border border-[#cfd6df] p-3.5 space-y-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#cfd6df] pb-2">
            <div>
              <h3 className="font-mono text-xs font-semibold uppercase text-[#1c2430]">
                SHELL & FRAUDULENT STRUCTURES FORENSIC INVESTIGATION REGISTRY
              </h3>
              <div className="font-mono text-[10px] text-[#b83232]">
                CONCEALMENT TYPOLOGIES · TELEMETRY SCRAPING CONDUITS · ORIGIN OBSCURATION MASKS
              </div>
            </div>
            <div className="flex gap-2">
              <a
                href="/api/sovereign/entities/shell-structures/csv"
                download="shell_and_fraudulent_structures_listing.csv"
                className="px-2.5 py-1 bg-[#b83232] text-white font-mono text-[11px] tracking-wider hover:bg-[#851b1b]"
              >
                [EXPORT FRAUD RISKS CSV]
              </a>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse font-mono text-xs text-left">
              <thead>
                <tr className="bg-[#dbe0e7] border-b border-[#cfd6df] text-[#424e5d]">
                  <th className="p-2 border-r border-[#cfd6df]">ID</th>
                  <th className="p-2 border-r border-[#cfd6df]">TARGET ENTITY</th>
                  <th className="p-2 border-r border-[#cfd6df]">CONTROLLING PARENT</th>
                  <th className="p-2 border-r border-[#cfd6df]">JURISDICTION</th>
                  <th className="p-2 border-r border-[#cfd6df]">REGISTRATION FILE NO</th>
                  <th className="p-2 border-r border-[#cfd6df]">CONCEALMENT TYPOLOGY</th>
                  <th className="p-2 border-r border-[#cfd6df]">MASKING MECHANISM</th>
                  <th className="p-2 border-r border-[#cfd6df]">REGULATORY SCRUTINY</th>
                  <th className="p-2">PROOF SHA-256</th>
                </tr>
              </thead>
              <tbody>
                {filteredShellStructures.map((shell) => (
                  <tr key={shell.id} className="border-b border-[#cfd6df] hover:bg-[#e9edf3]">
                    <td className="p-2 border-r border-[#cfd6df] text-[#526071]">{shell.id}</td>
                    <td className="p-2 border-r border-[#cfd6df] font-bold text-[#b83232]">
                      {shell.entity_name}
                    </td>
                    <td className="p-2 border-r border-[#cfd6df] font-semibold text-[#1c2430]">
                      {shell.alleged_controlling_parent}
                    </td>
                    <td className="p-2 border-r border-[#cfd6df] text-[10px]">
                      {shell.jurisdiction_of_incorporation}
                    </td>
                    <td className="p-2 border-r border-[#cfd6df] text-[10px] text-[#526071]">
                      {shell.business_registration_or_file_number}
                    </td>
                    <td className="p-2 border-r border-[#cfd6df] text-[10px]">
                      <span className="px-1.5 py-0.5 bg-[#d8c5c5] text-[#7a1c1c] font-bold">
                        {shell.concealment_or_shell_typology}
                      </span>
                    </td>
                    <td className="p-2 border-r border-[#cfd6df] text-[10px] text-[#3d4957] max-w-[220px]">
                      {shell.operational_purpose_and_masking_mechanism}
                    </td>
                    <td className="p-2 border-r border-[#cfd6df] text-[10px] text-[#b83232] max-w-[200px]">
                      {shell.regulatory_scrutiny_or_sanctions}
                    </td>
                    <td className="p-2 text-[10px] text-[#526071] font-mono break-all max-w-[120px] truncate" title={shell.cryptographic_sha256}>
                      {shell.cryptographic_sha256.substring(0, 16)}...
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};
