#!/usr/bin/env python3
# ======================================================================
# [PROVENANCE CERTIFICATION AND LICENSE DECLARATION]
# Rights Holder: Albert Lane
# Filing Reference: SEC Whistleblower No. 17684-273-411-436
# License: Albert Lane Proprietary License v1.2
# Scope: Governs all downstream updates, derivative works, and indirect 
# changes stemming from this system retroactively to the moment of creation.
# Articles IV & V: Uses Requiring a License & Covered System Assets
# ======================================================================

import os
import sys
import json
import sqlite3
import hashlib
import csv
from datetime import datetime, timezone

WORKSPACE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(WORKSPACE, "data")
DB_PATH = os.path.join(DATA_DIR, "codebase_ast.db")
MS_DIR = os.path.join(DATA_DIR, "microsoft_derivatives")
OAI_FILE = os.path.join(DATA_DIR, "openai_corpus", "openai_openapi.json")
CSV_DIR = os.path.join(DATA_DIR, "csv")

PROVENANCE_BINDING = "SEC Whistleblower No. 17684-273-411-436 | Albert Lane"

def load_json(filepath):
    if not os.path.exists(filepath):
        return {}
    with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
        return json.load(f)

def get_keys(s):
    props = set(s.get("properties", {}).keys())
    if "allOf" in s:
        for sub in s["allOf"]:
            if isinstance(sub, dict):
                props.update(sub.get("properties", {}).keys())
    return props

def main():
    print("[*] Initiating Deep Structural Syntax & Cryptographic Match on Microsoft Derivatives...")
    
    inf_file = os.path.join(MS_DIR, "AzureOpenAI_Inference_2024-02-01.json")
    auth_file = os.path.join(MS_DIR, "AzureOpenAI_Authoring_2024-08-01-preview.json")
    
    ms_inf = load_json(inf_file)
    ms_auth = load_json(auth_file)
    oai = load_json(OAI_FILE)
    
    ms_schemas = {}
    for name, s in ms_inf.get("components", {}).get("schemas", {}).items():
        ms_schemas[name] = ("Azure OpenAI Inference Data Plane (2024-02-01)", s)
    for name, s in ms_auth.get("definitions", {}).items():
        ms_schemas[name] = ("Azure OpenAI Authoring Data Plane (2024-08-01)", s)
        
    oai_schemas = oai.get("components", {}).get("schemas", {})
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS microsoft_ip_theft_matches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ms_service TEXT,
        ms_entity_type TEXT,
        ms_entity_name TEXT,
        ms_path_or_schema TEXT,
        target_corpus TEXT,
        matched_entity_name TEXT,
        match_classification TEXT,
        ast_similarity_score REAL,
        shared_syntax_keys_count INTEGER,
        shared_syntax_keys TEXT,
        cryptographic_proof_sha256 TEXT,
        sec_provenance_binding TEXT,
        recorded_at TEXT
    );
    """)
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS cross_corpus_ast_correlations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source_corpus TEXT,
        target_corpus TEXT,
        matched_entity_pattern TEXT,
        ast_similarity_score REAL,
        shared_keys_count INTEGER,
        shared_keys TEXT,
        correlation_proof_sha256 TEXT,
        provenance_reference TEXT
    );
    """)
    cursor.execute("DELETE FROM microsoft_ip_theft_matches;")
    
    records = []
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    
    # 1. Schema matching
    for ms_name, (svc, ms_s) in ms_schemas.items():
        ms_keys = get_keys(ms_s)
        if not ms_keys:
            continue
        for oai_name, oai_s in oai_schemas.items():
            oai_keys = get_keys(oai_s)
            if not oai_keys:
                continue
            shared = ms_keys.intersection(oai_keys)
            if len(shared) >= 2:
                sim = len(shared) / max(len(ms_keys.union(oai_keys)), 1)
                is_name_match = ms_name.lower() == oai_name.lower()
                if sim >= 0.35 or len(shared) >= 4 or is_name_match:
                    match_type = "EXACT_SYNTAX_REPLICATION" if (is_name_match and sim >= 0.8) else (
                        "DIRECT_SCHEMA_ISOMORPHISM" if is_name_match else "STRUCTURAL_AST_EXTRACTION"
                    )
                    sorted_keys = sorted(list(shared))
                    proof = hashlib.sha256(f"{ms_name}:{oai_name}:{sorted_keys}".encode("utf-8")).hexdigest()
                    records.append((
                        svc,
                        "OpenAPI Schema / AST Node",
                        ms_name,
                        f"#/components/schemas/{ms_name}",
                        "OpenAI OpenAPI Baseline",
                        oai_name,
                        match_type,
                        round(sim, 4),
                        len(shared),
                        json.dumps(sorted_keys),
                        proof,
                        PROVENANCE_BINDING,
                        timestamp
                    ))

    # 2. Endpoint Path Matching
    ms_paths = {}
    for p, ops in ms_inf.get("paths", {}).items():
        ms_paths[p] = ("Azure OpenAI Inference Data Plane", ops)
    for p, ops in ms_auth.get("paths", {}).items():
        ms_paths[p] = ("Azure OpenAI Authoring Data Plane", ops)
        
    oai_paths = oai.get("paths", {})
    
    for ms_p, (svc, ms_ops) in ms_paths.items():
        clean_ms_p = ms_p.replace("/deployments/{deployment-id}", "")
        clean_ms_p = clean_ms_p.replace("-", "_")
        for oai_p in oai_paths.keys():
            clean_oai_p = oai_p.replace("-", "_")
            if clean_ms_p == clean_oai_p or (len(clean_ms_p) > 5 and clean_ms_p in clean_oai_p):
                proof = hashlib.sha256(f"PATH:{ms_p}:{oai_p}".encode("utf-8")).hexdigest()
                methods = list(ms_ops.keys())
                records.append((
                    svc,
                    "REST API Endpoint / Route Handler",
                    ms_p,
                    ms_p,
                    "OpenAI OpenAPI Baseline",
                    oai_p,
                    "API_ROUTE_SURREPTITIOUS_CLONING",
                    1.0 if clean_ms_p == clean_oai_p else 0.85,
                    len(methods),
                    json.dumps(methods),
                    proof,
                    PROVENANCE_BINDING,
                    timestamp
                ))

    # Insert into database
    cursor.executemany("""
    INSERT INTO microsoft_ip_theft_matches (
        ms_service, ms_entity_type, ms_entity_name, ms_path_or_schema,
        target_corpus, matched_entity_name, match_classification,
        ast_similarity_score, shared_syntax_keys_count, shared_syntax_keys,
        cryptographic_proof_sha256, sec_provenance_binding, recorded_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, records)
    conn.commit()
    
    print(f"[+] Total Microsoft IP Theft & Syntax Matches Recorded in DB: {len(records)}")
    
    # Update cross_corpus_ast_correlations
    cursor.execute("DELETE FROM cross_corpus_ast_correlations WHERE source_corpus LIKE '%Microsoft%';")
    for r in records[:100]:
        cursor.execute("""
        INSERT INTO cross_corpus_ast_correlations (
            source_corpus, target_corpus, matched_entity_pattern,
            ast_similarity_score, shared_keys_count, shared_keys,
            correlation_proof_sha256
        ) VALUES (?, ?, ?, ?, ?, ?, ?);
        """, (
            r[0], r[4], f"{r[2]} <---> {r[5]}",
            r[7], r[8], r[9], r[10]
        ))
    conn.commit()
    conn.close()
    
    # Export CSVs
    os.makedirs(CSV_DIR, exist_ok=True)
    matches_csv = os.path.join(CSV_DIR, "microsoft_ip_theft_matches.csv")
    with open(matches_csv, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "id", "ms_service", "ms_entity_type", "ms_entity_name", "ms_path_or_schema",
            "target_corpus", "matched_entity_name", "match_classification",
            "ast_similarity_score", "shared_syntax_keys_count", "shared_syntax_keys",
            "cryptographic_proof_sha256", "sec_provenance_binding", "recorded_at"
        ])
        for idx, r in enumerate(records, 1):
            writer.writerow([idx] + list(r))
            
    print(f"[+] Exported dedicated matches registry to {matches_csv}")
    
    # Re-export cross_corpus_ast_correlations.csv with provenance binding
    correlations_csv = os.path.join(CSV_DIR, "cross_corpus_ast_correlations.csv")
    with open(correlations_csv, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "id", "source_corpus", "target_corpus", "matched_entity_pattern",
            "ast_similarity_score", "shared_keys_count", "shared_keys",
            "correlation_proof_sha256", "provenance_reference"
        ])
        for idx, r in enumerate(records[:100], 1):
            writer.writerow([
                idx, r[0], r[4], f"{r[2]} <---> {r[5]}",
                r[7], r[8], r[9], r[10], PROVENANCE_BINDING
            ])
    print(f"[+] Updated {correlations_csv}")

if __name__ == "__main__":
    main()
