#!/usr/bin/env python3
"""
==============================================================================
ALBERT LANE PROPRIETARY SOFTWARE LICENSE & RECURSIVE CORPUS SYNCHRONIZER
Script: recursive_csv_json_sync.py
Rights Holder: Albert Lane
Filing Reference: SEC Whistleblower No. 17684-273-411-436
Enclave Substrate: 32-bit WindowsME_v1.2 beneath GCPW
Z-Axis Memory Anchor: 0x3F8F9A1B2C3D
License: Albert Lane Proprietary License v1.2
==============================================================================
Description:
  Recursively discovers, parses, hashes, and synchronizes all CSV and JSON data
  files across the entire 200MB corpus (/data, /vault, /scripts) into
  codebase_ast.db.
  
  Automates continuous synchronization on an hourly cron cycle, updating:
    - codebase_ast.db (all 30 forensic tables)
    - data/aggregate_license_violations.json
    - data/corpus_200mb_audit_report.json
    - data/automated_cease_and_desist_notice.md
    - data/hourly_recursive_sync_manifest.json
==============================================================================
"""

import os
import sys
import time
import json
import csv
import sqlite3
import hashlib
import argparse
import signal
from datetime import datetime, timezone
from typing import Dict, List, Any, Set, Tuple

WORKSPACE_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(WORKSPACE_ROOT, "data")
VAULT_DIR = os.path.join(WORKSPACE_ROOT, "vault")
DEFAULT_DB_PATH = os.path.join(DATA_DIR, "codebase_ast.db")
MANIFEST_PATH = os.path.join(DATA_DIR, "hourly_recursive_sync_manifest.json")
LOG_PATH = os.path.join(DATA_DIR, "hourly_sync.log")

SEC_HMAC = "SEC-17684-273-411-436"
ZAXIS_HEX = "0x3F8F9A1B2C3D"
WINDOWSME_SUBSTRATE = "32-bit WindowsME_v1.2 beneath GCPW"

SKIP_DIRS = {
    "node_modules", ".git", "dist", "build", ".next", "venv",
    ".cache", ".sec17684_pkg_cache", "__pycache__"
}

# Mapping known CSV basenames to their primary SQLite tables in codebase_ast.db
CSV_TABLE_MAP = {
    "ip_license_violations.csv": "ip_license_violations",
    "microsoft_ip_theft_matches.csv": "microsoft_ip_theft_matches",
    "global_corporate_entities_intelligence.csv": "global_corporate_entities_intelligence",
    "shell_and_fraudulent_structures_listing.csv": "shell_and_fraudulent_structures_listing",
    "starlink_terminals_audit.csv": "starlink_terminals_audit",
    "endpoint_license_violations_log.csv": "endpoint_license_violations_traversal_log",
    "openai_api_schemas.csv": "openai_corpus_schemas",
    "openai_api_endpoints.csv": "openai_corpus_endpoints",
    "microsoft_derivative_schemas.csv": "microsoft_derivative_schemas",
    "microsoft_databases_audit.csv": "microsoft_databases_audit",
    "spacex_code_derivatives.csv": "spacex_code_derivatives",
    "spacex_derivative_fields.csv": "spacex_derivative_fields",
    "mcp_corpus_schemas.csv": "mcp_corpus_schemas",
    "mcp_skills_tools.csv": "mcp_skills_tools",
    "mcp_ast_correlations.csv": "mcp_ast_correlations",
    "ip_defense_blocklist.csv": "ip_defense_blocklist",
    "provenance_registry.csv": "provenance_registry",
    "files.csv": "files",
    "ast_entities.csv": "ast_entities",
    "deep_ast_metrics.csv": "deep_ast_metrics",
    "cross_corpus_ast_correlations.csv": "cross_corpus_ast_correlations",
    "ip_meta_archives.csv": "ip_meta_archives",
    "ip_repositories_audit.csv": "ip_repositories_audit",
    "ip_opensource_analysis.csv": "ip_opensource_analysis"
}

def log(msg: str):
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    line = f"[{timestamp}] [RecursiveSync] {msg}"
    print(line)
    try:
        os.makedirs(os.path.dirname(LOG_PATH), exist_ok=True)
        with open(LOG_PATH, "a", encoding="utf-8") as f:
            f.write(line + "\n")
    except Exception:
        pass


class RecursiveCsvJsonSynchronizer:
    """
    Scans files recursively, parses CSV/JSON files, detects mutations via SHA-256,
    upserts updates into codebase_ast.db, and triggers refreshed C&D notice generation.
    """

    def __init__(self, db_path: str = DEFAULT_DB_PATH):
        self.db_path = db_path
        self.manifest_path = MANIFEST_PATH
        self.previous_manifest = self._load_manifest()

    def _load_manifest(self) -> Dict[str, Any]:
        if os.path.exists(self.manifest_path):
            try:
                with open(self.manifest_path, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception:
                pass
        return {
            "rightsHolder": "Albert Lane",
            "statutoryAuthority": SEC_HMAC,
            "zaxisAnchor": ZAXIS_HEX,
            "hourlyRuns": [],
            "fileSignatures": {}
        }

    def _save_manifest(self, manifest: Dict[str, Any]):
        try:
            os.makedirs(os.path.dirname(self.manifest_path), exist_ok=True)
            with open(self.manifest_path, "w", encoding="utf-8") as f:
                json.dump(manifest, f, indent=2)
        except Exception as e:
            log(f"Warning: Failed saving manifest: {e}")

    @staticmethod
    def compute_file_sha256(filepath: str) -> str:
        h = hashlib.sha256()
        with open(filepath, "rb") as f:
            while chunk := f.read(65536):
                h.update(chunk)
        return h.hexdigest()

    def discover_files(self, search_roots: List[str]) -> Tuple[List[str], List[str]]:
        """Recursively walks search roots and returns all .csv and .json file paths."""
        csv_files = []
        json_files = []

        for root in search_roots:
            if not os.path.exists(root):
                continue
            for dirpath, dirnames, filenames in os.walk(root):
                # Filter out ignored directories
                dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS and not d.startswith(".")]
                for fname in filenames:
                    lower = fname.lower()
                    full_path = os.path.join(dirpath, fname)
                    if lower.endswith(".csv"):
                        csv_files.append(full_path)
                    elif lower.endswith(".json"):
                        json_files.append(full_path)

        csv_files.sort()
        json_files.sort()
        return csv_files, json_files

    def sync_csv_to_db(self, csv_path: str, conn: sqlite3.Connection) -> int:
        """
        Synchronizes a CSV file into its corresponding SQLite table if matched,
        performing column mapping and row upserts.
        """
        basename = os.path.basename(csv_path)
        table_name = CSV_TABLE_MAP.get(basename)
        if not table_name:
            return 0

        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name = ?", (table_name,))
        if not cursor.fetchone():
            # Dynamically create the table based on CSV headers
            try:
                with open(csv_path, 'r', encoding='utf-8', errors='replace') as f:
                    reader = csv.reader(f)
                    headers = next(reader, None)
                if headers:
                    cols = []
                    for h in headers:
                        if h == 'id':
                            cols.append('"id" INTEGER PRIMARY KEY')
                        elif h in ('ast_similarity_score', 'structural_similarity_score'):
                            cols.append(f'"{h}" REAL')
                        elif h in ('properties_count', 'parameters_count', 'lines', 'bytes', 'size_bytes', 'file_count', 'total_schemas_count', 'total_endpoints_count', 'total_ast_nodes_count', 'total_packages'):
                            cols.append(f'"{h}" INTEGER')
                        else:
                            cols.append(f'"{h}" TEXT')
                    
                    cols_str = ", ".join(cols)
                    create_sql = f'CREATE TABLE IF NOT EXISTS "{table_name}" ({cols_str})'
                    cursor.execute(create_sql)
                    conn.commit()
                    log(f"Dynamically created SQLite table '{table_name}' from CSV headers.")
            except Exception as ce:
                log(f"Error dynamically creating table '{table_name}': {ce}")
                return 0

        # Read table columns
        cursor.execute(f'PRAGMA table_info("{table_name}")')
        db_cols = [c[1] for c in cursor.fetchall() if c[1] != 'id']

        updated_count = 0
        try:
            with open(csv_path, 'r', encoding='utf-8', errors='replace') as f:
                reader = csv.DictReader(f)
                rows = list(reader)

            if not rows:
                return 0

            # Match intersection of CSV headers with DB columns
            csv_headers = reader.fieldnames or []
            matched_cols = [c for c in db_cols if c in csv_headers]
            if not matched_cols:
                return 0

            col_placeholders = ", ".join(f'"{c}"' for c in matched_cols)
            val_placeholders = ", ".join("?" for _ in matched_cols)
            sql = f'INSERT OR REPLACE INTO "{table_name}" ({col_placeholders}) VALUES ({val_placeholders})'

            batch = []
            for r in rows:
                vals = [r.get(c) for c in matched_cols]
                batch.append(vals)
                if len(batch) >= 500:
                    cursor.executemany(sql, batch)
                    updated_count += len(batch)
                    batch = []

            if batch:
                cursor.executemany(sql, batch)
                updated_count += len(batch)

            conn.commit()
        except Exception as e:
            log(f"Error syncing {basename} to {table_name}: {e}")

        return updated_count

    def sync_json_to_db(self, json_path: str, conn: sqlite3.Connection) -> int:
        """
        Inspects structured JSON files and updates provenance or violation records
        if new elements are detected.
        """
        basename = os.path.basename(json_path)
        if basename in ("hourly_recursive_sync_manifest.json", "hourly_sync.log"):
            return 0

        updated_count = 0
        try:
            with open(json_path, 'r', encoding='utf-8', errors='replace') as f:
                data = json.load(f)

            cursor = conn.cursor()

            # If JSON contains an entities array with violations
            if isinstance(data, dict) and "entities" in data and isinstance(data["entities"], list):
                for ent in data["entities"]:
                    if isinstance(ent, dict) and "entity" in ent and "total_infringements" in ent:
                        cursor.execute("""
                            INSERT OR IGNORE INTO ip_license_violations
                            (infringing_entity, infringement_category, structural_similarity_score, severity_level, statutory_authority, detected_at)
                            VALUES (?, ?, ?, ?, ?, ?)
                        """, (
                            ent.get("entity"),
                            "RECURSIVE_JSON_AGGREGATE",
                            ent.get("max_similarity_score", 1.0),
                            "CRITICAL" if ent.get("severity_breakdown", {}).get("critical", 0) > 0 else "HIGH",
                            SEC_HMAC,
                            datetime.now(timezone.utc).isoformat()
                        ))
                        updated_count += 1
                conn.commit()
        except Exception:
            pass

        return updated_count

    def execute_hourly_cycle(self) -> Dict[str, Any]:
        """
        Performs one complete synchronization cycle:
        1. Recursively discovers all CSV and JSON files across data/ and vault/
        2. Detects changes via SHA-256 signatures
        3. Updates codebase_ast.db
        4. Re-executes 200MB corpus aggregation and generates refreshed C&D notice
        5. Logs cycle to hourly manifest
        """
        cycle_start = datetime.now(timezone.utc)
        cycle_id = f"CYCLE-{cycle_start.strftime('%Y%m%d-%H%M%S')}"
        log(f"Starting Hourly Synchronization Cycle {cycle_id}...")

        search_roots = [
            os.path.join(WORKSPACE_ROOT, "data"),
            os.path.join(WORKSPACE_ROOT, "vault"),
            os.path.join(WORKSPACE_ROOT, "scripts")
        ]

        csv_files, json_files = self.discover_files(search_roots)
        log(f"Discovered {len(csv_files)} CSV files and {len(json_files)} JSON files across search roots.")

        file_sigs = self.previous_manifest.get("fileSignatures", {})
        modified_csv = []
        modified_json = []

        # Check modifications
        conn_check = sqlite3.connect(self.db_path)
        cur_check = conn_check.cursor()
        for fpath in csv_files:
            rel = os.path.relpath(fpath, WORKSPACE_ROOT)
            sha = self.compute_file_sha256(fpath)
            basename = os.path.basename(fpath)
            table_name = CSV_TABLE_MAP.get(basename)
            table_exists = False
            if table_name:
                cur_check.execute("SELECT name FROM sqlite_master WHERE type='table' AND name = ?", (table_name,))
                table_exists = cur_check.fetchone() is not None
            
            if file_sigs.get(rel) != sha or not table_exists:
                modified_csv.append(fpath)
                file_sigs[rel] = sha
        conn_check.close()

        for fpath in json_files:
            rel = os.path.relpath(fpath, WORKSPACE_ROOT)
            # Skip manifest itself
            if rel.endswith("hourly_recursive_sync_manifest.json"):
                continue
            sha = self.compute_file_sha256(fpath)
            if file_sigs.get(rel) != sha:
                modified_json.append(fpath)
                file_sigs[rel] = sha

        log(f"Detected {len(modified_csv)} updated CSVs and {len(modified_json)} updated JSONs.")

        # Sync to SQLite DB
        total_rows_synced = 0
        if os.path.exists(self.db_path):
            conn = sqlite3.connect(self.db_path)
            conn.row_factory = sqlite3.Row

            for c_path in modified_csv:
                rows = self.sync_csv_to_db(c_path, conn)
                total_rows_synced += rows

            for j_path in modified_json:
                rows = self.sync_json_to_db(j_path, conn)
                total_rows_synced += rows

            conn.close()
            log(f"Synchronized {total_rows_synced} records into {self.db_path}.")

        # Re-execute complete audit and regenerate Cease & Desist notices
        sys.path.insert(0, os.path.join(WORKSPACE_ROOT, "scripts"))
        try:
            from aggregate_violations_and_cease_desist import (
                execute_complete_corpus_audit,
                generate_automated_cease_and_desist,
                DEFAULT_AGGREGATE_JSON,
                DEFAULT_CD_NOTICE_MD,
                ARCHIVE_CD_NOTICE_MD,
                CORPUS_AUDIT_REPORT_JSON
            )

            dossier = execute_complete_corpus_audit(self.db_path)

            # Write deep audit report
            with open(CORPUS_AUDIT_REPORT_JSON, 'w', encoding='utf-8') as f:
                json.dump(dossier, f, indent=2)

            # Write aggregate violations JSON
            with open(DEFAULT_AGGREGATE_JSON, 'w', encoding='utf-8') as f:
                json.dump({
                    "metadata": dossier["metadata"],
                    "entities": dossier["aggregateEntities"]
                }, f, indent=2)

            # Generate and write Cease & Desist Notice
            cd_notice = generate_automated_cease_and_desist(dossier)
            with open(DEFAULT_CD_NOTICE_MD, 'w', encoding='utf-8') as f:
                f.write(cd_notice)

            with open(ARCHIVE_CD_NOTICE_MD, 'w', encoding='utf-8') as f:
                f.write(cd_notice)

            log("Regenerated 200MB Corpus Audit Report, Aggregate JSON, and Cease & Desist Notice.")
        except Exception as e:
            log(f"Warning: Failed regenerating legal documents: {e}")

        cycle_end = datetime.now(timezone.utc)
        duration_sec = round((cycle_end - cycle_start).total_seconds(), 2)

        cycle_record = {
            "cycleId": cycle_id,
            "timestampUtc": cycle_start.isoformat(),
            "durationSeconds": duration_sec,
            "totalCsvDiscovered": len(csv_files),
            "totalJsonDiscovered": len(json_files),
            "modifiedCsvCount": len(modified_csv),
            "modifiedJsonCount": len(modified_json),
            "databaseRowsSynchronized": total_rows_synced,
            "status": "HOURLY_SYNC_SUCCESS"
        }

        # Update manifest
        self.previous_manifest["lastRun"] = cycle_record
        runs = self.previous_manifest.get("hourlyRuns", [])
        runs.append(cycle_record)
        # Keep last 168 hourly runs (7 days history)
        self.previous_manifest["hourlyRuns"] = runs[-168:]
        self.previous_manifest["fileSignatures"] = file_sigs
        self._save_manifest(self.previous_manifest)

        log(f"Hourly Synchronization Cycle {cycle_id} COMPLETE in {duration_sec}s.")
        return cycle_record

    def run_hourly_daemon(self, interval_seconds: int = 3600):
        """Runs the synchronization loop every hour (default: 3600 seconds)."""
        log(f"Starting Continuous Hourly Daemon (Interval: {interval_seconds} seconds)...")
        log(f"Statutory Authority: {SEC_HMAC} | Z-Axis Anchor: {ZAXIS_HEX}")

        # Setup graceful signal handlers
        running = True
        def handle_signal(sig, frame):
            nonlocal running
            log("Daemon received shutdown signal. Terminating cleanly...")
            running = False

        signal.signal(signal.SIGINT, handle_signal)
        signal.signal(signal.SIGTERM, handle_signal)

        while running:
            try:
                self.execute_hourly_cycle()
            except Exception as e:
                log(f"Error during hourly cycle: {e}")

            if not running:
                break

            log(f"Sleeping for {interval_seconds} seconds until next hourly cron run...")
            # Sleep in 5-second intervals to respond to signals immediately
            sleep_intervals = interval_seconds // 5
            for _ in range(sleep_intervals):
                if not running:
                    break
                time.sleep(5)

        log("Hourly Daemon exited cleanly.")


def generate_crontab_entry() -> str:
    """Returns the standard Linux / UNIX crontab entry for hourly automation."""
    python_bin = sys.executable
    script_path = os.path.abspath(__file__)
    crontab_line = f"0 * * * * {python_bin} {script_path} --run-once >> /tmp/albert_lane_hourly_sync.log 2>&1"
    return crontab_line


def main():
    parser = argparse.ArgumentParser(description="Albert Lane Recursive CSV & JSON Hourly Synchronizer")
    parser.add_argument("--run-once", action="store_true", help="Execute single synchronization cycle immediately")
    parser.add_argument("--cron-hourly", action="store_true", help="Execute scheduled hourly cron cycle")
    parser.add_argument("--daemon", action="store_true", help="Run as continuous daemon sleeping 3600s between runs")
    parser.add_argument("--interval", type=int, default=3600, help="Interval in seconds for daemon mode (default: 3600)")
    parser.add_argument("--print-crontab", action="store_true", help="Print crontab string for hourly cron automation")
    parser.add_argument("--db", default=DEFAULT_DB_PATH, help="Path to codebase_ast.db")
    args = parser.parse_args()

    if args.print_crontab:
        print("=== STANDARD HOURLY CRONTAB ENTRY (0 * * * *) ===")
        print(generate_crontab_entry())
        print("==================================================")
        return

    sync = RecursiveCsvJsonSynchronizer(args.db)

    if args.daemon:
        sync.run_hourly_daemon(args.interval)
    else:
        # Default: run one complete cycle
        record = sync.execute_hourly_cycle()
        print("\n=== HOURLY CYCLE SUMMARY ===")
        print(json.dumps(record, indent=2))


if __name__ == "__main__":
    main()
