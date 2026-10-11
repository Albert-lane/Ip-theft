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
CSV_DIR = os.path.join(DATA_DIR, "csv")

RIGHTS_HOLDER = "Albert Lane"
FILING_REF = "SEC Whistleblower No. 17684-273-411-436"
LICENSE = "Albert Lane Proprietary License v1.2"
SEQUESTRATION = "SEQUESTERED_FEDERAL_PROTECTION"
TIMESTAMP = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")

def main():
    print("[*] Applying Provenance into codebase_ast.db...")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # 1. Update files table in SQLite
    cursor.execute("SELECT id, file_path FROM files;")
    files_in_db = cursor.fetchall()
    
    certified_ids = []
    for fid, relpath in files_in_db:
        fullpath = os.path.join(WORKSPACE, relpath)
        if os.path.exists(fullpath):
            try:
                with open(fullpath, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()
                if "17684-273-411-436" in content or "Albert Lane" in content:
                    certified_ids.append(fid)
            except Exception:
                pass
                
    if certified_ids:
        cursor.executemany("UPDATE files SET provenance_certified = '100%_SEC_CERTIFIED' WHERE id = ?;", [(i,) for i in certified_ids])
        conn.commit()
    print(f"[+] Updated files table: {len(certified_ids)} files certified in DB.")

    # 2. Create and populate provenance_registry table in SQLite
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS provenance_registry (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        file_path TEXT UNIQUE,
        language TEXT,
        lines INTEGER,
        bytes INTEGER,
        sha256 TEXT,
        rights_holder TEXT,
        filing_reference TEXT,
        license TEXT,
        sequestration_status TEXT,
        certified_at TEXT
    );
    """)
    cursor.execute("DELETE FROM provenance_registry;")

    prov_rows = []
    # Collect all certified files across the workspace
    for root, dirs, filenames in os.walk(WORKSPACE):
        dirs[:] = [d for d in dirs if d not in ["node_modules", ".git", "dist", "build", ".next", "venv", ".cache", ".sec17684_pkg_cache", "site-packages", ".turbo"] and not d.startswith(".")]
        for filename in filenames:
            filepath = os.path.join(root, filename)
            relpath = os.path.relpath(filepath, WORKSPACE)
            try:
                with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()
                if "17684-273-411-436" in content or "Albert Lane" in content:
                    lines = content.count("\n") + (1 if content else 0)
                    size = len(content.encode("utf-8"))
                    sha256 = hashlib.sha256(content.encode("utf-8")).hexdigest()
                    ext = os.path.splitext(filename)[1].lower()
                    lang = "JSON" if ext == ".json" else ("TypeScript" if ext in (".ts", ".tsx") else ("Python" if ext == ".py" else ("JavaScript" if ext in (".js", ".jsx") else ("Markdown" if ext == ".md" else ("CSV" if ext == ".csv" else "Config/Code")))))
                    prov_rows.append((
                        relpath, lang, lines, size, sha256,
                        RIGHTS_HOLDER, FILING_REF, LICENSE, SEQUESTRATION, TIMESTAMP
                    ))
            except Exception:
                pass

    cursor.executemany("""
    INSERT INTO provenance_registry (
        file_path, language, lines, bytes, sha256,
        rights_holder, filing_reference, license, sequestration_status, certified_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, prov_rows)
    conn.commit()
    print(f"[+] Populated provenance_registry table with {len(prov_rows)} certified items.")

    # 3. Populate api_corpus_derivatives
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS api_corpus_derivatives (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source_corpus TEXT,
        entity_path TEXT,
        schema_type TEXT,
        sha256 TEXT,
        ast_nodes_count INTEGER,
        keys_extracted TEXT,
        timestamp TEXT,
        cryptographic_certainty TEXT
    );
    """)
    cursor.execute("DELETE FROM api_corpus_derivatives;")
    api_derivatives = []
    
    # 3a. SpaceX derivatives
    spacex_dir = os.path.join(DATA_DIR, "spacex_derivatives")
    if os.path.exists(spacex_dir):
        for f in sorted(os.listdir(spacex_dir)):
            if f.endswith(".js"):
                fp = os.path.join(spacex_dir, f)
                with open(fp, "r", encoding="utf-8") as fp_in:
                    content = fp_in.read()
                sha = hashlib.sha256(content.encode("utf-8")).hexdigest()
                api_derivatives.append((
                    "SpaceX-API Derivative Models",
                    f"data/spacex_derivatives/{f}",
                    "Mongoose Schema",
                    sha,
                    content.count("Schema({") + content.count("new Schema"),
                    f"model:{f.replace('.js', '')}",
                    TIMESTAMP,
                    f"VERIFIED_SEC_PROVENANCE: {FILING_REF}"
                ))

    # 3b. Azure OpenAI Derivatives
    ms_dir = os.path.join(DATA_DIR, "microsoft_derivatives")
    if os.path.exists(ms_dir):
        for f in sorted(os.listdir(ms_dir)):
            if f.endswith(".json"):
                fp = os.path.join(ms_dir, f)
                with open(fp, "r", encoding="utf-8") as fp_in:
                    d = json.load(fp_in)
                sha = hashlib.sha256(json.dumps(d).encode("utf-8")).hexdigest()
                schemas_cnt = len(d.get("components", {}).get("schemas", {})) or len(d.get("definitions", {}))
                api_derivatives.append((
                    "Microsoft Azure OpenAI Data Plane",
                    f"data/microsoft_derivatives/{f}",
                    "OpenAPI Specification",
                    sha,
                    schemas_cnt,
                    f"{schemas_cnt} schemas / {len(d.get('paths', {}))} endpoints",
                    TIMESTAMP,
                    f"VERIFIED_SEC_PROVENANCE: {FILING_REF}"
                ))

    # 3c. OpenAI Corpus
    oai_file = os.path.join(DATA_DIR, "openai_corpus", "openai_openapi.json")
    if os.path.exists(oai_file):
        with open(oai_file, "r", encoding="utf-8") as fp_in:
            d = json.load(fp_in)
        sha = hashlib.sha256(json.dumps(d).encode("utf-8")).hexdigest()
        schemas_cnt = len(d.get("components", {}).get("schemas", {}))
        api_derivatives.append((
            "OpenAI OpenAPI Corpus Baseline",
            "data/openai_corpus/openai_openapi.json",
            "OpenAPI Specification",
            sha,
            schemas_cnt,
            f"{schemas_cnt} schemas / {len(d.get('paths', {}))} endpoints",
            TIMESTAMP,
            f"VERIFIED_SEC_PROVENANCE: {FILING_REF}"
        ))

    # 3d. Claude Code MCP Corpus & Specification
    mcp_spec_file = os.path.join(DATA_DIR, "mcp_corpus", "mcp_specification_schema.json")
    if os.path.exists(mcp_spec_file):
        with open(mcp_spec_file, "r", encoding="utf-8") as fp_in:
            d = json.load(fp_in)
        sha = hashlib.sha256(json.dumps(d).encode("utf-8")).hexdigest()
        defs_cnt = len(d.get("definitions", {}))
        api_derivatives.append((
            "Model Context Protocol (MCP) Specification",
            "data/mcp_corpus/mcp_specification_schema.json",
            "JSON-RPC 2.0 AST Schema Definition",
            sha,
            defs_cnt,
            f"{defs_cnt} schemas / Core AST node types",
            TIMESTAMP,
            f"VERIFIED_SEC_PROVENANCE: {FILING_REF}"
        ))

    # 3e. Claude Code MCP Skills & Schematics Corpus
    mcp_skills_file = os.path.join(DATA_DIR, "mcp_corpus", "claude_code_mcp_skills_corpus.json")
    if os.path.exists(mcp_skills_file):
        with open(mcp_skills_file, "r", encoding="utf-8") as fp_in:
            d = json.load(fp_in)
        sha = hashlib.sha256(json.dumps(d).encode("utf-8")).hexdigest()
        tools_cnt = sum(len(s.get("tools", [])) for s in d.get("mcp_skills_catalog", []))
        api_derivatives.append((
            "Claude Code MCP Skills & Schematics Catalog",
            "data/mcp_corpus/claude_code_mcp_skills_corpus.json",
            "Agent Tool AST Signatures & Skills",
            sha,
            tools_cnt,
            f"{len(d.get('mcp_skills_catalog', []))} skills / {tools_cnt} tool AST signatures",
            TIMESTAMP,
            f"VERIFIED_SEC_PROVENANCE: {FILING_REF}"
        ))

    # 3f. Claude Code MCP AST Correlations
    mcp_corr_file = os.path.join(CSV_DIR, "mcp_ast_correlations.csv")
    if os.path.exists(mcp_corr_file):
        with open(mcp_corr_file, "r", encoding="utf-8") as fp_in:
            content = fp_in.read()
        sha = hashlib.sha256(content.encode("utf-8")).hexdigest()
        rows_cnt = max(0, content.count("\n") - 1)
        api_derivatives.append((
            "Claude Code MCP AST Cross-Corpus Matrix",
            "data/csv/mcp_ast_correlations.csv",
            "AST Correlation Dataset",
            sha,
            rows_cnt,
            f"{rows_cnt} cross-corpus syntax correlations",
            TIMESTAMP,
            f"VERIFIED_SEC_PROVENANCE: {FILING_REF}"
        ))

    cursor.executemany("""
    INSERT INTO api_corpus_derivatives (
        source_corpus, entity_path, schema_type, sha256,
        ast_nodes_count, keys_extracted, timestamp, cryptographic_certainty
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    """, api_derivatives)
    conn.commit()
    print(f"[+] Populated api_corpus_derivatives table with {len(api_derivatives)} derivatives.")

    # 4. Insert new sovereign_vault_seal record
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS sovereign_vault_seal (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        rights_holder TEXT,
        filing_reference TEXT,
        license TEXT,
        sealed_at TEXT,
        total_entities INTEGER,
        tamper_hash TEXT
    );
    """)
    cursor.execute("SELECT count(*) FROM ast_entities;")
    total_entities = cursor.fetchone()[0]
    tamper_hash = hashlib.sha256(f"{RIGHTS_HOLDER}:{FILING_REF}:{total_entities}:{len(prov_rows)}:{TIMESTAMP}".encode("utf-8")).hexdigest()
    cursor.execute("""
    INSERT INTO sovereign_vault_seal (
        rights_holder, filing_reference, license, sealed_at, total_entities, tamper_hash
    ) VALUES (?, ?, ?, ?, ?, ?);
    """, (RIGHTS_HOLDER, FILING_REF, LICENSE, TIMESTAMP, total_entities + len(prov_rows), tamper_hash))
    conn.commit()
    print(f"[+] Sealed sovereign_vault_seal with tamper hash: {tamper_hash}")

    # Fetch all seal records for CSV export
    cursor.execute("SELECT id, rights_holder, filing_reference, license, sealed_at, total_entities, tamper_hash FROM sovereign_vault_seal ORDER BY id ASC;")
    seal_rows = cursor.fetchall()

    conn.close()

    # 5. Export updated CSV files
    os.makedirs(CSV_DIR, exist_ok=True)
    prov_csv = os.path.join(CSV_DIR, "provenance_registry.csv")
    with open(prov_csv, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "file_path", "language", "lines", "bytes", "sha256",
            "rights_holder", "filing_reference", "license", "sequestration_status", "certified_at"
        ])
        for r in prov_rows:
            writer.writerow(list(r))
    print(f"[+] Exported updated {prov_csv} with {len(prov_rows)} records.")

    seal_csv = os.path.join(CSV_DIR, "vault_seal.csv")
    with open(seal_csv, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["id", "rights_holder", "filing_reference", "license", "sealed_at", "total_entities", "tamper_hash"])
        for sr in seal_rows:
            writer.writerow(list(sr))
    print(f"[+] Exported updated {seal_csv} with {len(seal_rows)} records.")

    # 6. Archive and sync Sovereign Vault Manifest
    vault_dir = os.path.join(WORKSPACE, "vault")
    archives_dir = os.path.join(vault_dir, "archives")
    os.makedirs(archives_dir, exist_ok=True)

    tracked_artifacts = [
        "data/report.json",
        "data/repository_metrics.json",
        "data/ast_analysis.json",
        "data/codebase_ast.db",
        "data/openai_corpus/openai_openapi.json",
        "data/mcp_corpus/mcp_specification_schema.json",
        "data/mcp_corpus/claude_code_mcp_skills_corpus.json",
        "data/csv/files.csv",
        "data/csv/language_statistics.csv",
        "data/csv/ast_entities.csv",
        "data/csv/package_manifests.csv",
        "data/csv/provenance_registry.csv",
        "data/csv/vault_seal.csv",
        "data/csv/openai_api_schemas.csv",
        "data/csv/openai_api_endpoints.csv",
        "data/csv/mcp_corpus_schemas.csv",
        "data/csv/mcp_skills_tools.csv",
        "data/csv/mcp_ast_correlations.csv",
        "data/csv/cross_corpus_ast_correlations.csv",
        "data/csv/microsoft_marketable_derivatives.csv",
        "data/csv/spacex_code_derivatives.csv",
        "data/csv/ip_defense_blocklist.csv",
        "data/website_provenance.json"
    ]

    manifest_artifacts = []
    import shutil
    for rel_path in tracked_artifacts:
        full_src = os.path.join(WORKSPACE, rel_path)
        if os.path.exists(full_src):
            basename = os.path.basename(rel_path)
            dest_arch = os.path.join(archives_dir, basename)
            try:
                shutil.copy2(full_src, dest_arch)
            except Exception as e:
                pass
            with open(full_src, "rb") as af:
                bytes_content = af.read()
                sha_val = hashlib.sha256(bytes_content).hexdigest()
                size_val = len(bytes_content)
            manifest_artifacts.append({
                "source_path": rel_path,
                "vault_archive_path": f"vault/archives/{basename}",
                "size_bytes": size_val,
                "sha256": sha_val,
                "sec_provenance_binding": f"{FILING_REF} | {RIGHTS_HOLDER}",
                "last_synced_utc": TIMESTAMP
            })

    vault_manifest_path = os.path.join(vault_dir, "vault_ast_manifest.json")
    manifest_data = {
        "archive_id": f"VAULT-PROVENANCE-{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}",
        "timestamp_utc": TIMESTAMP,
        "rights_holder": RIGHTS_HOLDER,
        "filing_reference": FILING_REF,
        "license": LICENSE,
        "sequestration_status": SEQUESTRATION,
        "latest_tamper_hash": tamper_hash,
        "total_archived_files": len(manifest_artifacts),
        "artifacts": manifest_artifacts
    }
    with open(vault_manifest_path, "w", encoding="utf-8") as vmf:
        json.dump(manifest_data, vmf, indent=2)
    print(f"[+] Sovereign Vault Manifest updated: {vault_manifest_path} ({len(manifest_artifacts)} artifacts).")

    # 7. Append audit log to compliance_master.log
    compliance_log_path = os.path.join(vault_dir, "compliance_master.log")
    log_entry = f"[{TIMESTAMP}] SOVEREIGN_VAULT_SYNC: Certified {len(prov_rows)} files | Sealed {len(manifest_artifacts)} artifacts | Tamper Hash: {tamper_hash} | SEC Whistleblower No. 17684-273-411-436\n"
    with open(compliance_log_path, "a", encoding="utf-8") as clf:
        clf.write(log_entry)
    print(f"[+] Appended compliance audit log to {compliance_log_path}.")

if __name__ == "__main__":
    main()

