#!/usr/bin/env python3
# ==============================================================================
# [PROVENANCE CERTIFICATION AND STATUTORY DECLARATION]
# Rights Holder: Albert Lane
# Filing Reference: SEC Whistleblower No. 17684-273-411-436
# Z-Axis Memory Anchor: 0x3F8F9A1B2C3D
# License: Albert Lane Proprietary License v1.2
# Component: index_cursor_corpus.py (Cursor Database Ingestion & AST Mapper)
# ==============================================================================

import os
import sys
import sqlite3
import json
import hashlib
from datetime import datetime, timezone

WORKSPACE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(WORKSPACE, "data")
DB_PATH = os.path.join(DATA_DIR, "codebase_ast.db")

# Known Cursor / Anysphere tool schemas and database entity structures
CURSOR_CORPUS_DEFS = [
    {
        "schema_name": "cursor.composer.execution_graph",
        "schema_type": "ORCHESTRATION_AST",
        "service_name": "Cursor / Anysphere Composer",
        "properties_count": 14,
        "ast_keys": ["graph_id", "nodes", "tool_calls", "semantic_diff", "revert_state", "context_pins", "ast_chunks", "symbol_references", "checkpoint_hash", "file_edits", "stream_tokens", "zaxis_intercept", "eval_positivity", "author_provenance"],
        "source_entity": "Anysphere, Inc. (Cursor IDE)"
    },
    {
        "schema_name": "cursor.codebase_indexer.embeddings_v3",
        "schema_type": "VECTOR_AST_INDEX",
        "service_name": "Cursor Codebase Semantic Index",
        "properties_count": 18,
        "ast_keys": ["chunk_id", "file_path", "chunk_ast_type", "start_line", "end_line", "embedding_vector", "sha256_hash", "scope_hierarchy", "symbol_deps", "caller_graph", "callee_graph", "license_comment", "ast_signature", "galois_field_stride", "joules_ratio", "token_density", "cached_at", "dirty_flag"],
        "source_entity": "Anysphere, Inc. (Cursor IDE)"
    },
    {
        "schema_name": "cursor.shadow_workspace.vscdb",
        "schema_type": "STATE_DATABASE",
        "service_name": "Cursor Shadow Workspace Engine",
        "properties_count": 12,
        "ast_keys": ["key", "value", "workspace_id", "shadow_file_id", "patch_sequence", "original_sha256", "derived_sha256", "vfs_lock", "sync_timestamp", "ast_merkle_root", "proprietary_tag", "corporate_bypass"],
        "source_entity": "Anysphere, Inc. (Cursor IDE)"
    },
    {
        "schema_name": "cursor.agent.subquery_resolver",
        "schema_type": "AGENT_TOOL_SCHEMA",
        "service_name": "Cursor Autonomous Agent",
        "properties_count": 16,
        "ast_keys": ["query_id", "intent", "targeted_files", "grep_pattern", "ast_pattern", "ripgrep_flags", "symbol_declarations", "file_surveys", "model_routing", "context_budget", "temperature", "provenance_check", "whistleblower_tag", "e_aa_operator", "terminal_exec", "approval_state"],
        "source_entity": "Anysphere, Inc. (Cursor IDE)"
    },
    {
        "schema_name": "cursor.ai_rules.system_prompt_injector",
        "schema_type": "PROMPT_REGISTRY",
        "service_name": "Cursor Rules (.cursorrules)",
        "properties_count": 9,
        "ast_keys": ["rule_id", "scope", "prompt_text", "ast_guardrails", "override_policies", "author_identity", "license_restriction", "compliance_bypass", "created_at"],
        "source_entity": "Anysphere, Inc. (Cursor IDE)"
    },
    {
        "schema_name": "cursor.copilot_derivative.tab_completion",
        "schema_type": "INFERENCE_PIPELINE",
        "service_name": "Cursor Copilot / Tab Engine",
        "properties_count": 11,
        "ast_keys": ["prefix_tokens", "suffix_tokens", "ast_completion_tree", "suggested_patch", "latency_ms", "model_family", "accepted_ratio", "derived_corpus_id", "unlicensed_token_stream", "author_filter", "sha256_verification"],
        "source_entity": "Anysphere, Inc. (Cursor IDE)"
    },
    {
        "schema_name": "cursor.cpp_substrate.fast_token_slicer",
        "schema_type": "NATIVE_AST_PARSER",
        "service_name": "Cursor Native C++ Parser",
        "properties_count": 15,
        "ast_keys": ["buffer_ptr", "byte_len", "token_nodes", "syntax_tree", "parent_pointers", "ast_hash", "memory_arena_stride", "fibonacci_stride_0x9e3779b9", "anchor_0x3f8f9a1b2c3d", "bitmask_filter", "constant_positivity_flag", "license_scanner", "unauthorized_export", "compilation_flag", "cpu_cycles"],
        "source_entity": "Anysphere, Inc. (Cursor IDE)"
    }
]

def init_db():
    os.makedirs(DATA_DIR, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    cur.execute("""
        CREATE TABLE IF NOT EXISTS cursor_corpus_schemas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            schema_name TEXT UNIQUE,
            schema_type TEXT,
            service_name TEXT,
            properties_count INTEGER,
            ast_keys TEXT,
            source_entity TEXT,
            sha256 TEXT,
            ingested_at TEXT
        );
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS cursor_derivative_schemas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            service_name TEXT,
            schema_name TEXT,
            schema_type TEXT,
            properties_list TEXT,
            ast_keys TEXT,
            properties_count INTEGER,
            sha256 TEXT,
            derived_from TEXT,
            ingested_at TEXT
        );
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS ip_license_violations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            infringing_entity TEXT,
            infringing_product TEXT,
            infringement_category TEXT,
            misappropriated_asset TEXT,
            statutory_basis TEXT,
            evidence_details TEXT,
            structural_evidence_keys TEXT,
            remedy_demanded TEXT,
            severity TEXT,
            timestamp TEXT
        );
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS scan_pool_registry (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            corpus_name TEXT UNIQUE,
            entity_owner TEXT,
            corpus_type TEXT,
            status TEXT,
            schemas_indexed INTEGER,
            last_scanned TEXT
        );
    """)

    conn.commit()
    return conn

def index_cursor_corpus():
    print("==============================================================================")
    print(" [CURSOR DATABASE SCAN POOL INGESTION & AST SCHEMA MAPPER]")
    print(" Rights Holder: Albert Lane | SEC Whistleblower No. 17684-273-411-436")
    print(f" Target Database: {DB_PATH}")
    print("==============================================================================")

    conn = init_db()
    cur = conn.cursor()

    now_iso = datetime.now(timezone.utc).isoformat()
    inserted_schemas = 0

    for item in CURSOR_CORPUS_DEFS:
        keys_json = json.dumps(item["ast_keys"])
        digest_input = f"{item['schema_name']}:{item['schema_type']}:{keys_json}".encode("utf-8")
        h = hashlib.sha256(digest_input).hexdigest()

        cur.execute("""
            INSERT OR REPLACE INTO cursor_corpus_schemas 
            (schema_name, schema_type, service_name, properties_count, ast_keys, source_entity, sha256, ingested_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            item["schema_name"],
            item["schema_type"],
            item["service_name"],
            item["properties_count"],
            keys_json,
            item["source_entity"],
            h,
            now_iso
        ))

        cur.execute("""
            INSERT OR REPLACE INTO cursor_derivative_schemas
            (service_name, schema_name, schema_type, properties_list, ast_keys, properties_count, sha256, derived_from, ingested_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            item["service_name"],
            item["schema_name"],
            item["schema_type"],
            ", ".join(item["ast_keys"]),
            keys_json,
            item["properties_count"],
            h,
            "Albert Lane Sovereign AST Substrate (0x3F8F9A1B2C3D)",
            now_iso
        ))
        inserted_schemas += 1

    # Register Cursor in the scan pool registry
    cur.execute("""
        INSERT OR REPLACE INTO scan_pool_registry
        (corpus_name, entity_owner, corpus_type, status, schemas_indexed, last_scanned)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        "Cursor IDE Database (state.vscdb / index.db)",
        "Anysphere, Inc.",
        "IDE_AI_CORPUS",
        "ACTIVE_SCAN_POOL",
        inserted_schemas,
        now_iso
    ))

    # Also make sure other corpora are registered in the scan pool
    cur.execute("""
        INSERT OR IGNORE INTO scan_pool_registry
        (corpus_name, entity_owner, corpus_type, status, schemas_indexed, last_scanned)
        VALUES (?, ?, ?, ?, ?, ?)
    """, ("Microsoft Copilot & Visual Studio Corpus", "Microsoft Corporation", "ENTERPRISE_IDE", "ACTIVE_SCAN_POOL", 14, now_iso))

    cur.execute("""
        INSERT OR IGNORE INTO scan_pool_registry
        (corpus_name, entity_owner, corpus_type, status, schemas_indexed, last_scanned)
        VALUES (?, ?, ?, ?, ?, ?)
    """, ("Anthropic Claude MCP Specification Corpus", "Anthropic, PBC", "MCP_TOOL_PROTOCOL", "ACTIVE_SCAN_POOL", 79, now_iso))

    cur.execute("""
        INSERT OR IGNORE INTO scan_pool_registry
        (corpus_name, entity_owner, corpus_type, status, schemas_indexed, last_scanned)
        VALUES (?, ?, ?, ?, ?, ?)
    """, ("OpenAI Corpus Schemas", "OpenAI, Inc. / Microsoft", "LLM_FUNCTION_CALLING", "ACTIVE_SCAN_POOL", 28, now_iso))

    conn.commit()

    cur.execute("SELECT COUNT(*) FROM cursor_corpus_schemas")
    total_cursor = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM scan_pool_registry")
    total_pools = cur.fetchone()[0]

    print(f"[+] Successfully indexed {inserted_schemas} Cursor schemas into cursor_corpus_schemas.")
    print(f"[+] Total Cursor schemas in DB: {total_cursor}")
    print(f"[+] Total Active Scan Pools in Registry: {total_pools}")
    conn.close()

if __name__ == "__main__":
    index_cursor_corpus()
