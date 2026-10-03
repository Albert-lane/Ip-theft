#!/usr/bin/env python3
# ======================================================================
# [PROVENANCE CERTIFICATION AND LICENSE DECLARATION]
# Rights Holder: Albert Lane
# Filing Reference: SEC Whistleblower No. 17684-273-411-436
# License: Albert Lane Proprietary License v1.2
# Scope: Forensic Query Engine for Microsoft Corpus Documents, Databases & AST Findings.
# ======================================================================

import os
import sys
import json
import sqlite3

WORKSPACE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(WORKSPACE, "data")
DB_PATH = os.path.join(DATA_DIR, "codebase_ast.db")

def main():
    payload = {}
    if len(sys.argv) > 1:
        try:
            payload = json.loads(sys.argv[1])
        except Exception:
            payload = {}

    query = payload.get("query", "").strip()
    category = payload.get("category", "ALL").upper()
    limit = min(max(int(payload.get("limit", 100)), 1), 500)

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    res = {
        "status": "SUCCESS",
        "statutory_authority": "SEC Whistleblower No. 17684-273-411-436",
        "rights_holder": "Albert Lane",
        "query": query,
        "category": category,
        "documents": [],
        "databases": [],
        "matches": [],
        "schemas": []
    }

    q_param = f"%{query}%"

    # 1. Documents
    if category in ("ALL", "DOCUMENTS"):
        cursor.execute("""
        SELECT id, document_filename, document_title, service_plane, api_version,
               total_schemas_count, total_endpoints_count, total_ast_nodes_count,
               document_sha256, merkle_root_proof, violated_license_articles,
               hard_mark_status, evidence_admissibility_fre, ingested_at
        FROM microsoft_corpus_documents
        WHERE document_filename LIKE ? OR document_title LIKE ? OR service_plane LIKE ? OR violated_license_articles LIKE ?
        ORDER BY id ASC LIMIT ?
        """, (q_param, q_param, q_param, q_param, limit))
        keys = [
            "id", "document_filename", "document_title", "service_plane", "api_version",
            "total_schemas_count", "total_endpoints_count", "total_ast_nodes_count",
            "document_sha256", "merkle_root_proof", "violated_license_articles",
            "hard_mark_status", "evidence_admissibility_fre", "ingested_at"
        ]
        res["documents"] = [dict(zip(keys, r)) for r in cursor.fetchall()]

    # 2. Databases
    if category in ("ALL", "DATABASES"):
        cursor.execute("""
        SELECT id, database_name, engine_type, data_plane_protocol, storage_tier_and_scale,
               vector_and_ast_indexing_capability, unauthorized_telemetry_ingestion,
               violated_license_articles, infringement_classification,
               cryptographic_audit_hash_sha256, sec_whistleblower_reference,
               enforcement_action_status, last_audited_at
        FROM microsoft_databases_audit
        WHERE database_name LIKE ? OR engine_type LIKE ? OR vector_and_ast_indexing_capability LIKE ? OR violated_license_articles LIKE ?
        ORDER BY id ASC LIMIT ?
        """, (q_param, q_param, q_param, q_param, limit))
        keys = [
            "id", "database_name", "engine_type", "data_plane_protocol", "storage_tier_and_scale",
            "vector_and_ast_indexing_capability", "unauthorized_telemetry_ingestion",
            "violated_license_articles", "infringement_classification",
            "cryptographic_audit_hash_sha256", "sec_whistleblower_reference",
            "enforcement_action_status", "last_audited_at"
        ]
        res["databases"] = [dict(zip(keys, r)) for r in cursor.fetchall()]

    # 3. Matches
    if category in ("ALL", "MATCHES"):
        cursor.execute("""
        SELECT id, ms_service, ms_entity_type, ms_entity_name, ms_path_or_schema,
               target_corpus, matched_entity_name, match_classification,
               ast_similarity_score, shared_syntax_keys_count, shared_syntax_keys,
               cryptographic_proof_sha256, recorded_at
        FROM microsoft_ip_theft_matches
        WHERE ms_service LIKE ? OR ms_entity_name LIKE ? OR matched_entity_name LIKE ? OR shared_syntax_keys LIKE ?
        ORDER BY ast_similarity_score DESC LIMIT ?
        """, (q_param, q_param, q_param, q_param, limit))
        keys = [
            "id", "ms_service", "ms_entity_type", "ms_entity_name", "ms_path_or_schema",
            "target_corpus", "matched_entity_name", "match_classification",
            "ast_similarity_score", "shared_syntax_keys_count", "shared_syntax_keys",
            "cryptographic_proof_sha256", "recorded_at"
        ]
        res["matches"] = [dict(zip(keys, r)) for r in cursor.fetchall()]

    # 4. Schemas
    if category in ("ALL", "SCHEMAS"):
        cursor.execute("""
        SELECT id, service_name, schema_name, schema_type, properties_count,
               required_properties, ast_keys, sha256, math_proof_hash
        FROM microsoft_derivative_schemas
        WHERE service_name LIKE ? OR schema_name LIKE ? OR ast_keys LIKE ?
        ORDER BY properties_count DESC LIMIT ?
        """, (q_param, q_param, q_param, limit))
        keys = [
            "id", "service_name", "schema_name", "schema_type", "properties_count",
            "required_properties", "ast_keys", "sha256", "math_proof_hash"
        ]
        res["schemas"] = [dict(zip(keys, r)) for r in cursor.fetchall()]

    conn.close()
    print(json.dumps(res))

if __name__ == "__main__":
    main()
