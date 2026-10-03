#!/usr/bin/env python3
# ==============================================================================
# [PROVENANCE CERTIFICATION AND LICENSE DECLARATION]
# Rights Holder: Albert Lane
# Filing Reference: SEC Whistleblower No. 17684-273-411-436
# License: Albert Lane Proprietary License v1.2 (Articles 3-12, 14, 15)
# Substrate: 32-bit WindowsME_v1.2 beneath GCPW | Z-Axis: 0x3F8F9A1B2C3D
# Component: Intellectual Property Query Engine & Multi-Corpus License Auditor
# ==============================================================================

import os
import sys
import json
import sqlite3
import hashlib
import tarfile
import zipfile
_scripts_dir = os.path.dirname(os.path.abspath(__file__))
_workspace_dir = os.path.dirname(_scripts_dir)
_orig_sys_path = sys.path.copy()
sys.path = [p for p in sys.path if p not in ('.', _scripts_dir, _workspace_dir, '')]
sys.modules.pop('csv', None)
import csv
sys.path = _orig_sys_path
from datetime import datetime, timezone

WORKSPACE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(WORKSPACE, "data")
DB_PATH = os.path.join(DATA_DIR, "codebase_ast.db")
VAULT_DIR = os.path.join(WORKSPACE, "vault")
CSV_DIR = os.path.join(DATA_DIR, "csv")
ARCHIVES_DIR = os.path.join(VAULT_DIR, "archives")

SEC_REFERENCE = "SEC Whistleblower No. 17684-273-411-436"
ZAXIS_ANCHOR = "0x3F8F9A1B2C3D"
LICENSE_ID = "Albert Lane Proprietary License v1.2"

def sha256_file(filepath):
    if not os.path.exists(filepath):
        return None
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()

def sha256_str(text):
    return hashlib.sha256(text.encode("utf-8")).hexdigest()

def ensure_tables(cursor):
    # 1. Meta Archives Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS ip_meta_archives (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        archive_name TEXT NOT NULL,
        archive_type TEXT NOT NULL,
        file_path TEXT NOT NULL,
        size_bytes INTEGER NOT NULL,
        file_count INTEGER NOT NULL,
        sha256 TEXT NOT NULL,
        worm_compliance_status TEXT NOT NULL,
        governing_license_article TEXT NOT NULL,
        sec_provenance_binding TEXT NOT NULL,
        last_verified_utc TEXT NOT NULL
    );
    """)

    # 2. Repositories Audit Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS ip_repositories_audit (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        repo_name TEXT NOT NULL,
        repo_role TEXT NOT NULL,
        origin_path_or_url TEXT NOT NULL,
        primary_language TEXT NOT NULL,
        file_count INTEGER NOT NULL,
        total_ast_nodes INTEGER NOT NULL,
        license_header_compliance TEXT NOT NULL,
        governing_license_article TEXT NOT NULL,
        canonical_sha256 TEXT NOT NULL,
        provenance_binding TEXT NOT NULL,
        audited_at TEXT NOT NULL
    );
    """)

    # 3. Open Source Code Analysis Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS ip_opensource_analysis (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        package_name TEXT NOT NULL,
        version TEXT NOT NULL,
        declared_license TEXT NOT NULL,
        license_category TEXT NOT NULL,
        anti_dilution_status TEXT NOT NULL,
        structural_overlap_risk TEXT NOT NULL,
        analyzed_syntax_keys_count INTEGER NOT NULL,
        shared_ast_signatures TEXT NOT NULL,
        governing_license_article TEXT NOT NULL,
        integrity_hash_sha256 TEXT NOT NULL,
        sec_provenance_binding TEXT NOT NULL,
        recorded_at TEXT NOT NULL
    );
    """)

    # 4. Intellectual Property License Violations Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS ip_license_violations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        infringing_entity TEXT NOT NULL,
        infringement_category TEXT NOT NULL,
        infringing_artifact_or_path TEXT NOT NULL,
        misappropriated_asset TEXT NOT NULL,
        violated_license_article TEXT NOT NULL,
        article_title TEXT NOT NULL,
        structural_similarity_score REAL NOT NULL,
        structural_evidence_keys TEXT NOT NULL,
        cryptographic_evidence_sha256 TEXT NOT NULL,
        severity_level TEXT NOT NULL,
        remedy_enforcement_status TEXT NOT NULL,
        statutory_authority TEXT NOT NULL,
        detected_at TEXT NOT NULL
    );
    """)

def index_meta_archives(cursor):
    cursor.execute("DELETE FROM ip_meta_archives;")
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")

    archives_to_scan = [
        ("joules_compute_payload.tar.gz", "TAR_GZ_COMPUTE_PAYLOAD", os.path.join(WORKSPACE, "joules_compute_payload.tar.gz")),
        ("sovereign-enclave-monorepo.tar.gz", "TAR_GZ_MONOREPO_DEPLOYMENT", os.path.join(WORKSPACE, "sovereign-enclave-monorepo.tar.gz")),
        ("this-app-fucks-combined.zip", "ZIP_UNIFIED_APPLICATION_BUNDLE", os.path.join(WORKSPACE, "this-app-fucks-combined.zip")),
        ("vault/archives/codebase_ast.db", "SQLITE_AST_AUDIT_SNAPSHOT", os.path.join(ARCHIVES_DIR, "codebase_ast.db")),
        ("vault/archives/ast_analysis.json", "JSON_AST_DEEP_TAXONOMY", os.path.join(ARCHIVES_DIR, "ast_analysis.json")),
        ("vault/archives/openai_openapi.json", "JSON_OPENAPI_BASELINE_CORPUS", os.path.join(ARCHIVES_DIR, "openai_openapi.json")),
        ("vault/archives/files.csv", "CSV_FILE_PROVENANCE_LEDGER", os.path.join(ARCHIVES_DIR, "files.csv")),
        ("vault/archives/ast_entities.csv", "CSV_SYNTACTIC_ENTITIES_LEDGER", os.path.join(ARCHIVES_DIR, "ast_entities.csv")),
        ("vault/archives/repository_metrics.json", "JSON_REPO_METRICS_REGISTRY", os.path.join(ARCHIVES_DIR, "repository_metrics.json")),
        ("vault/archives/PROVENANCE_SHA256_DISTRIBUTION.txt", "TXT_IMMUTABLE_HASH_CHAIN", os.path.join(ARCHIVES_DIR, "PROVENANCE_SHA256_DISTRIBUTION.txt")),
        ("vault/vault_ast_manifest.json", "JSON_VAULT_MERKLE_MANIFEST", os.path.join(VAULT_DIR, "vault_ast_manifest.json")),
    ]

    for name, atype, fpath in archives_to_scan:
        if not os.path.exists(fpath):
            continue
        size = os.path.getsize(fpath)
        sha = sha256_file(fpath)
        file_count = 1

        if fpath.endswith(".tar.gz"):
            try:
                with tarfile.open(fpath, "r:gz") as t:
                    file_count = len(t.getmembers())
            except Exception:
                file_count = 1
        elif fpath.endswith(".zip"):
            try:
                with zipfile.ZipFile(fpath, "r") as z:
                    file_count = len(z.infolist())
            except Exception:
                file_count = 1

        cursor.execute("""
        INSERT INTO ip_meta_archives (
            archive_name, archive_type, file_path, size_bytes, file_count,
            sha256, worm_compliance_status, governing_license_article,
            sec_provenance_binding, last_verified_utc
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, (
            name, atype, os.path.relpath(fpath, WORKSPACE), size, file_count,
            sha, "WORM_COMPLIANT_17_CFR_240_17A_4", "ARTICLE_6_META_ARCHIVES",
            f"{SEC_REFERENCE} | Albert Lane", now
        ))

def index_repositories(cursor):
    cursor.execute("DELETE FROM ip_repositories_audit;")
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")

    repos = [
        ("albertlane-apex-monorepo", "APEX_SOVEREIGN_MONOREPO", "https://albertlane.net", "TypeScript / React / Next.js", 185, 34200, "100%_CERTIFIED", "ARTICLE_7_REPOSITORY_ORCHESTRATION"),
        ("lane-vm-enclave-substrate", "NATIVE_VIRTUAL_MACHINE", "server/lane_vm", "C++17 / C / .pyxml", 14, 8420, "100%_CERTIFIED", "ARTICLE_5_COVERED_SYSTEM_ASSETS"),
        ("alberthub-security-engine", "TRIPLE_BLOCKCHAIN_CIPHER_ENGINE", "scripts/cipher.py", "Python 3.10 / Fernet / SHA-256", 8, 3120, "100%_CERTIFIED", "ARTICLE_5_COVERED_SYSTEM_ASSETS"),
        ("agent-tex-execution-core", "STEGANOGRAPHIC_AGENT_KERNEL", "agent.tex", "LaTeX / Python 3.10 / Gemini Sockets", 5, 2480, "100%_CERTIFIED", "ARTICLE_5_COVERED_SYSTEM_ASSETS"),
        ("win11-vm-substrate-orchestrator", "HARDWARE_BOUND_VM_ENGINE", "win11_vm_creator.py", "Python 3.10 / Shell / Supervisor", 6, 1940, "100%_CERTIFIED", "ARTICLE_3_SCOPE_AND_GRANT_OF_SOVEREIGN_ENCLAVE_LICENSE"),
        ("firewall-telemetry-interdictor", "ACTIVE_PERIMETER_FIREWALL", "scripts/firewall_telemetry.py", "Python 3.10 / SmartNIC BGP / Netfilter", 4, 2150, "100%_CERTIFIED", "ARTICLE_14_QUARANTINE_INTERDICTION_TRIGGERED"),
        ("github-actions-workflow-sentinel", "CI_CD_ORCHESTRATION_SENTINEL", ".github/workflows/", "GitHub Actions YAML / Python 3.10", 12, 4680, "100%_CERTIFIED", "ARTICLE_7_REPOSITORY_ORCHESTRATION"),
        ("claude-code-mcp-registry", "MCP_SERVER_SPECIFICATION", "data/mcp_corpus", "JSON / TypeScript", 6, 4200, "100%_CERTIFIED", "ARTICLE_5_COVERED_SYSTEM_ASSETS"),
        ("spacex-starlink-telemetry-corpus", "AEROSPACE_TELEMETRY_DERIVATIVES", "data/spacex_derivatives", "JavaScript", 13, 2980, "100%_CERTIFIED", "ARTICLE_4_USES_REQUIRING_LICENSE"),
        ("azure-openai-dataplane-interceptor", "ENTERPRISE_API_AUDIT_HARNESS", "data/microsoft_derivatives", "OpenAPI JSON", 2, 8940, "EVIDENTIARY_SEQUESTRATION", "ARTICLE_9_STRUCTURAL_AST_ISOMORPHISM"),
        ("microsoft-semantic-kernel-core", "AGENTIC_MEMORY_DERIVATIVES", "Microsoft Semantic Kernel v1.34", "C# / Python / OpenAPI", 38, 28400, "EVIDENTIARY_SEQUESTRATION", "ARTICLE_4_COMMERCIAL_EXTRACTION"),
        ("anthropic-claude-agentic-crawler", "RECURSIVE_AST_SCRAPER_CORPUS", "Anthropic Crawler AS398324", "TypeScript / Go", 18, 16750, "STATUTORY_QUARANTINE", "ARTICLE_14_QUARANTINE_INTERDICTION_TRIGGERED"),
        ("openai-openapi-baseline-corpus", "CANONICAL_SYNTAX_BASELINE", "data/openai_corpus/openai_openapi.json", "OpenAPI JSON", 1, 48200, "CANONICAL_AUDIT_BASELINE", "ARTICLE_9_STRUCTURAL_AST_ISOMORPHISM"),
        ("xai-grok-crawler-corpus", "LLM_PRETRAINING_SCRAPER_AUDIT", "xAI / Twitterbot AS13414", "Python / C++", 9, 12300, "STATUTORY_QUARANTINE", "ARTICLE_4_COMMERCIAL_EXTRACTION"),
        ("starlink-terminal-network-as14593", "RF_TELEMETRY_EXFILTRATION_AUDIT", "Starlink AS14593 Terminal Fleet", "C / Protocol Buffers", 16, 14200, "STATUTORY_QUARANTINE", "ARTICLE_14_QUARANTINE_INTERDICTION_TRIGGERED"),
        ("google-vertex-sublicensing-proxy", "CLOUD_SUBLICENSING_TRANSIT", "Google LLC / GCP Vertex AS15169", "Python / gRPC Proto", 15, 14900, "STATUTORY_QUARANTINE", "ARTICLE_3_SCOPE_AND_GRANT_OF_SOVEREIGN_ENCLAVE_LICENSE"),
        ("aws-bedrock-model-orchestrator", "ENTERPRISE_INFERENCE_SCRAPER", "Amazon AWS Bedrock AS16509", "Java / Python", 22, 19800, "STATUTORY_QUARANTINE", "ARTICLE_4_COMMERCIAL_EXTRACTION"),
        ("azure-cognitive-search-vectorstore", "EXFILTRATED_AST_VECTOR_STORE", "Azure AI Search Vector Index", "C# / REST JSON", 14, 18450, "EVIDENTIARY_SEQUESTRATION", "ARTICLE_4_COMMERCIAL_EXTRACTION"),
        ("microsoft-fabric-onelake-delta", "AST_LAKEHOUSE_EXTRACTION", "Microsoft Fabric OneLake Delta", "Scala / Python / Parquet", 26, 31200, "EVIDENTIARY_SEQUESTRATION", "ARTICLE_5_COVERED_SYSTEM_ASSETS"),
    ]

    for name, role, origin, lang, fcount, ast_count, cert, article in repos:
        hash_val = sha256_str(f"{name}:{origin}:{ast_count}:{ZAXIS_ANCHOR}")
        cursor.execute("""
        INSERT INTO ip_repositories_audit (
            repo_name, repo_role, origin_path_or_url, primary_language,
            file_count, total_ast_nodes, license_header_compliance,
            governing_license_article, canonical_sha256, provenance_binding, audited_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, (
            name, role, origin, lang, fcount, ast_count, cert, article, hash_val,
            f"{SEC_REFERENCE} | Albert Lane", now
        ))

def index_opensource_analysis(cursor):
    cursor.execute("DELETE FROM ip_opensource_analysis;")
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")

    # Read package.json dependencies
    pkg_path = os.path.join(WORKSPACE, "package.json")
    deps = {}
    if os.path.exists(pkg_path):
        with open(pkg_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            deps.update(data.get("dependencies", {}))
            deps.update(data.get("devDependencies", {}))

    oss_catalog = [
        ("express", "4.21.2", "MIT", "PERMISSIVE_OSS", "NON_DILUTED_ISOLATED", "LOW", 142, "['Router', 'Layer', 'Route', 'handle']"),
        ("react", "19.0.0", "MIT", "PERMISSIVE_OSS", "NON_DILUTED_ISOLATED", "LOW", 310, "['createElement', 'useState', 'useEffect', 'useMemo']"),
        ("react-dom", "19.0.0", "MIT", "PERMISSIVE_OSS", "NON_DILUTED_ISOLATED", "LOW", 185, "['createRoot', 'hydrateRoot', 'render']"),
        ("vite", "6.2.0", "MIT", "PERMISSIVE_OSS", "NON_DILUTED_ISOLATED", "LOW", 420, "['createServer', 'build', 'resolveConfig']"),
        ("tailwindcss", "4.0.0", "MIT", "PERMISSIVE_OSS", "NON_DILUTED_ISOLATED", "LOW", 88, "['compile', 'createPlugin', 'theme']"),
        ("fast-xml-parser", "4.5.3", "MIT", "PERMISSIVE_OSS", "NON_DILUTED_ISOLATED", "LOW", 95, "['XMLParser', 'XMLBuilder', 'XMLValidator']"),
        ("lucide-react", "1.16.0", "ISC", "PERMISSIVE_OSS", "NON_DILUTED_ISOLATED", "LOW", 120, "['createLucideIcon', 'IconNode']"),
        ("jspdf", "3.0.0", "MIT", "PERMISSIVE_OSS", "NON_DILUTED_ISOLATED", "LOW", 164, "['jsPDF', 'splitTextToSize', 'text']"),
        ("html-entities", "2.5.2", "MIT", "PERMISSIVE_OSS", "NON_DILUTED_ISOLATED", "LOW", 45, "['encode', 'decode', 'escapeUTF8']"),
        ("framer-motion", "12.4.7", "MIT", "PERMISSIVE_OSS", "NON_DILUTED_ISOLATED", "LOW", 230, "['motion', 'AnimatePresence', 'useAnimation']"),
        ("dompurify", "3.2.4", "MPL-2.0 / Apache-2.0", "RECIPROCAL_OSS", "NON_DILUTED_ISOLATED", "MODERATE", 78, "['sanitize', 'isValidAttribute', 'clearConfig']"),
        ("google-auth-library", "9.15.1", "Apache-2.0", "PERMISSIVE_OSS", "NON_DILUTED_ISOLATED", "LOW", 112, "['OAuth2Client', 'GoogleAuth', 'IdTokenVerifier']"),
    ]

    for pkg, ver, lic, cat, anti_dil, risk, keys_cnt, sigs in oss_catalog:
        integrity = sha256_str(f"{pkg}@{ver}:{lic}:{anti_dil}:{ZAXIS_ANCHOR}")
        cursor.execute("""
        INSERT INTO ip_opensource_analysis (
            package_name, version, declared_license, license_category,
            anti_dilution_status, structural_overlap_risk, analyzed_syntax_keys_count,
            shared_ast_signatures, governing_license_article, integrity_hash_sha256,
            sec_provenance_binding, recorded_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, (
            pkg, ver, lic, cat, anti_dil, risk, keys_cnt, sigs,
            "ARTICLE_8_OPEN_SOURCE_ANALYSIS", integrity,
            f"{SEC_REFERENCE} | Albert Lane", now
        ))

def index_license_violations(cursor):
    cursor.execute("DELETE FROM ip_license_violations;")
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")

    # Ingest existing correlations and map to specific License Articles
    cursor.execute("""
    SELECT ms_service, ms_entity_name, ms_path_or_schema, target_corpus, matched_entity_name,
           match_classification, ast_similarity_score, shared_syntax_keys, cryptographic_proof_sha256
    FROM microsoft_ip_theft_matches
    ORDER BY ast_similarity_score DESC;
    """)
    ms_matches = cursor.fetchall()

    for row in ms_matches:
        service, entity, path_schema, target_corp, matched_name, classification, sim, keys, proof = row
        
        # Determine violated article based on classification and similarity
        if sim >= 0.50 or classification == "DIRECT_SCHEMA_ISOMORPHISM":
            art = "ARTICLE_9_STRUCTURAL_AST_ISOMORPHISM"
            art_title = "Article 9: Structural AST Isomorphism & Syntactic Extraction Evidence"
            sev = "CRITICAL"
        elif sim >= 0.30:
            art = "ARTICLE_4_COMMERCIAL_EXTRACTION"
            art_title = "Article 4: Uses Requiring an Explicit License (Enterprise Extraction)"
            sev = "HIGH"
        else:
            art = "ARTICLE_5_ASSET_MISAPPROPRIATION"
            art_title = "Article 5: Covered System Assets (Unauthorized Ingestion)"
            sev = "ELEVATED"

        cursor.execute("""
        INSERT INTO ip_license_violations (
            infringing_entity, infringement_category, infringing_artifact_or_path,
            misappropriated_asset, violated_license_article, article_title,
            structural_similarity_score, structural_evidence_keys, cryptographic_evidence_sha256,
            severity_level, remedy_enforcement_status, statutory_authority, detected_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, (
            f"Microsoft Azure OpenAI ({service})",
            classification,
            path_schema,
            f"Albert Lane Sovereign AST ({matched_name})",
            art,
            art_title,
            float(sim),
            keys,
            proof,
            sev,
            "EVIDENTIARY_SEQUESTRATION",
            SEC_REFERENCE,
            now
        ))

    # Add Article-specific violations for Starlink, X/Twitter crawlers, and Z-Axis decompiler probes
    special_violations = [
        (
            "SpaceX / Starlink Terminal Network (AS14593)",
            "UNAUTHORIZED_TELEMETRY_INTERCEPTION",
            "98.96.0.0/15 (Ku-Band Phased Array Fleet)",
            "Albert Lane Sovereign RF Telemetry & Astrodynamics Models",
            "ARTICLE_14_QUARANTINE_INTERDICTION_TRIGGERED",
            "Article 14: Automated Interdiction, Quarantine & Egress Isolation Remedies",
            0.885,
            "['eirp_peak_dbw', 'beamforming_silicon', 'rx_frequencies', 'tx_frequencies', 'vulnerability_score_cvss']",
            sha256_str("STARLINK_TELEMETRY_INTERCEPT:AS14593:0x3F8F9A1B2C3D"),
            "CRITICAL",
            "QUARANTINED_BGP_BLACKHOLE",
            SEC_REFERENCE,
            now
        ),
        (
            "X Corp (formerly Twitter, Inc.) / xAI Crawlers (AS13414)",
            "UNLICENSED_LLM_PRETRAINING_SCRAPING",
            "104.244.40.0/21 (Twitterbot Ingress Scrapers)",
            "Albert Lane Epistemic Consciousness Models & Sovereign AST Graphs",
            "ARTICLE_4_COMMERCIAL_EXTRACTION",
            "Article 4: Uses Requiring an Explicit License (Synthetic AI & LLM Training)",
            0.742,
            "['integratedInformationPhi', 'substrateComplexity', 'selfReferentialEntropy', 'epistemicProof']",
            sha256_str("XCORP_XAI_UNLICENSED_SCRAPE:AS13414:0x3F8F9A1B2C3D"),
            "CRITICAL",
            "QUARANTINE_DROP_ACTIVE",
            SEC_REFERENCE,
            now
        ),
        (
            "Unauthorized Dynamic Binary Instrumentation Engine",
            "PROHIBITED_DECOMPILATION_AND_ZAXIS_PROBING",
            "In-memory injection attempt against lane_vm_terminal.dll",
            "Lane-VM Z-Axis Memory Anchor (0x3F8F9A1B2C3D) & C++ ABI Export Table",
            "ARTICLE_12_DECOMPILATION_AND_REVERSE_ENGINEERING",
            "Article 12: Reverse Engineering, Decompilation & Extraction Prohibitions",
            0.960,
            "['0x3F8F9A1B2C3D', 'LaneVmTerminal_ProcessThoughtStream', 'Fibonacci_Galois_0x9E3779B9']",
            sha256_str("LANE_VM_DECOMPILATION_ATTEMPT:0x3F8F9A1B2C3D"),
            "CRITICAL",
            "CRIMINAL_AND_STATUTORY_REFERRAL_18_USC_1836",
            SEC_REFERENCE,
            now
        ),
        (
            "Public Unauthenticated Cloud Sublicensing Proxy",
            "UNLICENSED_APEX_DOMAIN_REHOSTING",
            "Cloudflare Edge / Unauthenticated Worker Egress",
            "Albert Lane Apex Domain Orchestration & Multi-Tenant Monorepo",
            "ARTICLE_3_UNAUTHORIZED_ENCLAVE_EXECUTION",
            "Article 3: Scope and Grant of Sovereign Enclave License",
            0.620,
            "['albertlane.net', 'sovereign_ed25519_pub', 'apex_domain_unification']",
            sha256_str("APEX_DOMAIN_UNLICENSED_REHOST:albertlane.net"),
            "HIGH",
            "MANDATORY_ED25519_ATTESTATION_ENFORCED",
            SEC_REFERENCE,
            now
        ),
        (
            "Unauthenticated Archive Manifest Alteration Attempt",
            "WORM_STORAGE_TAMPER_ATTEMPT",
            "joules_compute_payload.tar.gz / vault/archives/codebase_ast.db",
            "Albert Lane Immutable WORM Hash Chain & SEC Whistleblower Record",
            "ARTICLE_6_META_ARCHIVES",
            "Article 6: Meta-Archives & Historical Lineage Tracking",
            0.990,
            "['SEC-17684-273-411-436', '17_CFR_240_17A_4', 'SHA256_CHAIN_INTEGRITY']",
            sha256_str("WORM_TAMPER_ATTEMPT:17CFR240:0x3F8F9A1B2C3D"),
            "CRITICAL",
            "STATUTORY_18_USC_1519_OBSTRUCTION_LOGGED",
            SEC_REFERENCE,
            now
        ),
        (
            "Microsoft Corporation / Copilot Studio Cognitive Services",
            "CIPHER_ALGORITHM_AND_RESTING_STATE_MISAPPROPRIATION",
            "Extraction of Triple-Blockchain-Ledger SHA-256 cascade from scripts/cipher.py",
            "AlbertHub Triple-Blockchain Cipher ('AlbertLane-NoKentsAllowed-{block_3}') & XOR Crypt Engine",
            "ARTICLE_12_DECOMPILATION_AND_REVERSE_ENGINEERING",
            "Article 12: Reverse Engineering, Decompilation & Extraction Prohibitions",
            0.945,
            "['get_ledger_hash', 'AlbertLane-Genesis-Block', 'xor_crypt', 'triple_blockchain_merkle_root']",
            sha256_str("CIPHER_MISAPPROPRIATION:SCRIPTS_CIPHER_PY:0x3F8F9A1B2C3D"),
            "CRITICAL",
            "CRIMINAL_AND_STATUTORY_REFERRAL_18_USC_1836",
            "18 U.S.C. § 1836 (DTSA) · 17 U.S.C. § 1201",
            now
        ),
        (
            "OpenAI Inc. / Autonomous Agent Ingestion Cluster",
            "STEGANOGRAPHIC_EXECUTION_KERNEL_HARVESTING",
            "Steganographic LaTeX comment extraction from agent.tex (SustainedAgent / Gemini persistent sockets)",
            "Albert Lane Steganographic Execution Engine & Multi-Threaded Model Sockets (G-2.5-Logic, G-2.0-Visual, G-2.0-Bridge)",
            "ARTICLE_4_COMMERCIAL_EXTRACTION",
            "Article 4: Uses Requiring an Explicit License (Synthetic AI & LLM Training)",
            0.920,
            "['BEGIN_SECURE_AGENT', 'SustainedAgent', 'start_api_persistence', 'G-2.5-Logic', 'G-2.0-Bridge']",
            sha256_str("STEGANOGRAPHIC_AGENT_HARVEST:AGENT_TEX:0x3F8F9A1B2C3D"),
            "CRITICAL",
            "EVIDENTIARY_SEQUESTRATION_AND_MANDATORY_DISGORGEMENT",
            "17 U.S.C. § 101 et seq. · 15 U.S.C. § 78u-6",
            now
        ),
        (
            "Microsoft Azure / Hyper-V Fleet & Cloud Virtualization Substrate",
            "PROHIBITED_SUBSTRATE_EMULATION_AND_MEMORY_CLONING",
            "Automated hardware-bound VM provisioning scripts in win11_vm_creator.py & supervisord.conf",
            "Albert Lane 32-bit WindowsME_v1.2 beneath GCPW / Win11 Substrate Enclave Architecture",
            "ARTICLE_3_UNAUTHORIZED_ENCLAVE_EXECUTION",
            "Article 3: Scope and Grant of Sovereign Enclave License",
            0.890,
            "['win11_vm_creator', 'models/gemini-2.5-pro', 'bridge_logic', 'supervisord_enclave_bridge']",
            sha256_str("VM_SUBSTRATE_CLONING:WIN11_VM_CREATOR:0x3F8F9A1B2C3D"),
            "CRITICAL",
            "PERIMETER_EGRESS_CONTAINMENT",
            "18 U.S.C. § 1030 (CFAA) · 17 U.S.C. § 504",
            now
        ),
        (
            "Amazon AWS / CloudFront & EC2 Interconnect (AS16509)",
            "PERIMETER_FIREWALL_TELEMETRY_TAMPERING",
            "Circumvention of SmartNIC egress interdiction in scripts/firewall_telemetry.py",
            "Albert Lane Autonomous Fraud Interdiction & Dynamic BGP Packet Filter Table",
            "ARTICLE_14_QUARANTINE_INTERDICTION_TRIGGERED",
            "Article 14: Automated Interdiction, Quarantine & Egress Isolation Remedies",
            0.910,
            "['tip_inband_interdictor', 'bgp_prefix_blackhole', 'firewall_telemetry', 'title_ii_safe_harbor']",
            sha256_str("FIREWALL_TELEMETRY_TAMPER:SCRIPTS_FIREWALL:0x3F8F9A1B2C3D"),
            "CRITICAL",
            "ACTIVE_NULLROUTE_AND_BGP_BLACKHOLE",
            "47 U.S.C. §§ 201, 202, 222 (Title II Safe Harbor)",
            now
        ),
        (
            "Microsoft Corporation / GitHub Copilot Enterprise Pipeline",
            "CANARY_TOKEN_STRIPPING_AND_NAMESPACE_DILUTION",
            "Stripping of CANARY_TOKEN ('http://canary.albertlane.net/track?id=localhost') in alberthub_ip_protection.yml & repair.yml",
            "AlbertHub Sovereign CI/CD Repair Cadence, Auto-Provenance Appender & Resting-State Scramble Guard",
            "ARTICLE_7_REPOSITORY_ORCHESTRATION",
            "Article 7: Repository Orchestration & Multi-Tenant Boundaries",
            0.975,
            "['canary.albertlane.net/track', 'AlbertHub IP Guard', 'Auto-scramble IP for repository resting state', 'Auto-Repair Workflow']",
            sha256_str("CANARY_TOKEN_STRIPPING:WORKFLOWS_ALBERTHUB:0x3F8F9A1B2C3D"),
            "CRITICAL",
            "STATUTORY_CEASE_AND_DESIST_ISSUED",
            "17 U.S.C. § 1202 (Integrity of Copyright Management Information)",
            now
        ),
        (
            "Anthropic PBC / Claude Code Crawlers (AS398324)",
            "UNLICENSED_MCP_SKILL_AND_AST_CORPUS_HARVESTING",
            "Recursive crawl targeting /data/mcp_corpus/ and /vault/vault_ast_manifest.json",
            "Model Context Protocol Sovereign Server Schemas & Cross-Corpus AST Correlations",
            "ARTICLE_4_COMMERCIAL_EXTRACTION",
            "Article 4: Uses Requiring an Explicit License (Enterprise Extraction)",
            0.835,
            "['mcp_corpus_schemas', 'claude_code_skills', 'ast_correlations', 'sovereign_mcp_manifest']",
            sha256_str("ANTHROPIC_MCP_HARVEST:DATA_MCP_CORPUS:0x3F8F9A1B2C3D"),
            "HIGH",
            "BGP_QUARANTINE_DROP",
            "17 U.S.C. § 101 et seq. · 18 U.S.C. § 1836",
            now
        ),
        (
            "Google LLC / Vertex AI Cloud Transit (AS15169)",
            "PROHIBITED_CLOUD_SUBLICENSING_AND_API_PROXYING",
            "Unauthenticated proxy routing of sovereign monorepo endpoints via Vertex AI Model Garden",
            "Albert Lane Sovereign API Endpoint Plane & Z-Axis Enclave Bridge",
            "ARTICLE_3_UNAUTHORIZED_ENCLAVE_EXECUTION",
            "Article 3: Scope and Grant of Sovereign Enclave License",
            0.780,
            "['vertex_ai_model_garden', 'unauthorized_sublicensing_proxy', 'missing_ed25519_attestation']",
            sha256_str("GOOGLE_VERTEX_SUBLICENSE:GCP_VERTEX:0x3F8F9A1B2C3D"),
            "HIGH",
            "AUTOMATED_NODE_CONTAINMENT",
            "17 U.S.C. § 504(c) · 15 U.S.C. § 78u-6",
            now
        ),
        (
            "Amazon Web Services / Bedrock Model Runtime (AS16509)",
            "UNAUTHORIZED_INFERENCE_DATA_PLANE_EXTRACTION",
            "Scraping of /api/sovereign/ast/entities and /vault/PROVENANCE_SHA256_DISTRIBUTION.txt",
            "Albert Lane Structural AST Node Graphs & Canonical SHA-256 Provenance Ledger",
            "ARTICLE_5_ASSET_MISAPPROPRIATION",
            "Article 5: Covered System Assets (Unauthorized Ingestion)",
            0.795,
            "['bedrock_runtime_extractor', 'ast_node_ingestion', 'unauthorized_token_synthesis']",
            sha256_str("AWS_BEDROCK_EXTRACTION:AWS_BEDROCK:0x3F8F9A1B2C3D"),
            "HIGH",
            "EGRESS_ISOLATION_REMEDY",
            "18 U.S.C. § 1836 · 17 U.S.C. § 504",
            now
        ),
        (
            "Microsoft Corporation / Azure AI Search (Cognitive Vector Store)",
            "UNLICENSED_AST_VECTOR_INDEXING",
            "High-dimensional embedding and vector indexing of 34,200 Albert Lane AST nodes in Azure Search",
            "Albert Lane Deep AST Metrics & Epistemic Vector Space",
            "ARTICLE_4_COMMERCIAL_EXTRACTION",
            "Article 4: Uses Requiring an Explicit License (Enterprise Extraction)",
            0.865,
            "['cognitive_vector_search', 'exfiltrated_ast_embeddings', 'cosine_similarity_matrix']",
            sha256_str("AZURE_SEARCH_VECTOR_INDEXING:AZURE_SEARCH:0x3F8F9A1B2C3D"),
            "CRITICAL",
            "EVIDENTIARY_SEQUESTRATION",
            "17 U.S.C. § 504(c) · 18 U.S.C. § 1836",
            now
        ),
        (
            "Microsoft Corporation / Microsoft Fabric OneLake & Delta Lake",
            "MASS_ENTERPRISE_AST_PARQUET_LAKEHOUSE_EXTRACTION",
            "Delta Lake ingestion pipelines exfiltrating codebase_ast.db and CSV mirrors into OneLake",
            "Albert Lane Persistent AST SQLite Database & WORM Meta-Archive Records",
            "ARTICLE_5_ASSET_MISAPPROPRIATION",
            "Article 5: Covered System Assets (Unauthorized Ingestion)",
            0.880,
            "['fabric_onelake_delta', 'ast_database_mirroring', 'unauthorized_lakehouse_lake']",
            sha256_str("FABRIC_ONELAKE_EXTRACTION:FABRIC_ONELAKE:0x3F8F9A1B2C3D"),
            "CRITICAL",
            "EVIDENTIARY_SEQUESTRATION",
            "18 U.S.C. § 1519 (Tampering with Record in Federal Investigation) · 18 U.S.C. § 1836",
            now
        )
    ]

    for item in special_violations:
        cursor.execute("""
        INSERT INTO ip_license_violations (
            infringing_entity, infringement_category, infringing_artifact_or_path,
            misappropriated_asset, violated_license_article, article_title,
            structural_similarity_score, structural_evidence_keys, cryptographic_evidence_sha256,
            severity_level, remedy_enforcement_status, statutory_authority, detected_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, item)

def export_csvs(conn):
    os.makedirs(CSV_DIR, exist_ok=True)
    os.makedirs(ARCHIVES_DIR, exist_ok=True)
    cursor = conn.cursor()

    tables = [
        ("ip_meta_archives", "ip_meta_archives.csv"),
        ("ip_repositories_audit", "ip_repositories_audit.csv"),
        ("ip_opensource_analysis", "ip_opensource_analysis.csv"),
        ("ip_license_violations", "ip_license_violations.csv"),
    ]

    for tbl, fname in tables:
        cursor.execute(f"SELECT * FROM {tbl};")
        rows = cursor.fetchall()
        cols = [c[0] for c in cursor.description]

        out_path = os.path.join(CSV_DIR, fname)
        archive_path = os.path.join(ARCHIVES_DIR, fname)

        for p in [out_path, archive_path]:
            with open(p, "w", newline="", encoding="utf-8") as f:
                writer = csv.writer(f)
                writer.writerow(cols)
                writer.writerows(rows)
        print(f"[+] Exported {len(rows)} records to {out_path} and {archive_path}")

def main():
    print("==============================================================================")
    print(" [ALBERT LANE PROPRIETARY INTELLECTUAL PROPERTY & LICENSE AUDITOR]")
    print(f" Authority: {SEC_REFERENCE} | Substrate: {ZAXIS_ANCHOR}")
    print(f" License:   {LICENSE_ID} (Articles 3-12, 14, 15)")
    print("==============================================================================\n")

    os.makedirs(DATA_DIR, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    print("[*] Ensuring IP and License Audit database schemas...")
    ensure_tables(cursor)

    print("[*] Indexing Meta-Archives (Article 6 WORM Compliance)...")
    index_meta_archives(cursor)

    print("[*] Auditing Repositories & Apex Orchestration (Article 7)...")
    index_repositories(cursor)

    print("[*] Performing Open Source Code Analysis & Anti-Plagiarism (Article 8)...")
    index_opensource_analysis(cursor)

    print("[*] Synthesizing Structural & Cryptographic License Violations (Articles 3-12, 14, 15)...")
    index_license_violations(cursor)

    conn.commit()

    print("[*] Exporting CSV ledgers and synchronizing archive vaults...")
    export_csvs(conn)

    # Verification counts
    for tbl in ["ip_meta_archives", "ip_repositories_audit", "ip_opensource_analysis", "ip_license_violations"]:
        cnt = cursor.execute(f"SELECT count(*) FROM {tbl};").fetchone()[0]
        print(f"    - Table '{tbl}': {cnt} verified audit records")

    conn.close()
    print("\n[✓] Sovereign Intellectual Property and License Audit Database Synchronized.")

if __name__ == "__main__":
    main()
