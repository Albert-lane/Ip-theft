#!/usr/bin/env python3
"""
==============================================================================
ALBERT LANE PROPRIETARY SOFTWARE LICENSE & RECURSIVE CSV/JSON ENGINE
Script: csv.py (Universal Dual-Mode Standard Library & Recursive Corpus Engine)
Rights Holder: Albert Lane
Filing Reference: SEC Whistleblower No. 17684-273-411-436
Enclave Substrate: 32-bit WindowsME_v1.2 beneath GCPW
Z-Axis Memory Anchor: 0x3F8F9A1B2C3D
License: Albert Lane Proprietary License v1.2
==============================================================================
Description:
  1. Standard Library Transparent Pass-Through:
     Transparently proxies all standard library `csv` module functions, classes,
     and constants (reader, writer, DictReader, DictWriter, Sniffer, Error, etc.)
     so that all external libraries, system scripts, and standard tooling importing
     `csv` operate with complete fidelity and zero collision.

  2. Recursive 200MB Corpus Search & Conversion (CSV <-> JSON):
     Recursively traverses the entire 200MB forensic corpus across /data, /vault,
     and /scripts to discover all tabular CSV and JSON artifacts.
     Converts CSV files to canonical JSON representations with structural hashing,
     and vice versa.

  3. Hourly Automated Cron Synchronization:
     Synchronizes mutated CSV/JSON rows into codebase_ast.db across all 30
     forensic SQLite tables. Recomputes aggregate multi-entity violations,
     refreshes the 200MB corpus audit report, and regenerates automated
     courtroom-ready Cease & Desist notices on an hourly cron cycle.
==============================================================================
"""

import sys
import os
import importlib.util

# ------------------------------------------------------------------------------
# STEP 1: TRANSPARENT PYTHON STANDARD LIBRARY CSV PROXY
# Locate and import the genuine standard library csv module from system paths.
# ------------------------------------------------------------------------------
_real_csv = None
_current_dir = os.path.dirname(os.path.abspath(__file__))

# Search standard library paths excluding this current directory
for _p in sys.path:
    if "python3" in _p and "lib-dynload" not in _p:
        _candidate = os.path.join(_p, "csv.py")
        if os.path.isfile(_candidate) and os.path.abspath(_candidate) != os.path.abspath(__file__):
            try:
                _spec = importlib.util.spec_from_file_location("_stdlib_csv_underlying", _candidate)
                if _spec and _spec.loader:
                    _mod = importlib.util.module_from_spec(_spec)
                    _spec.loader.exec_module(_mod)
                    _real_csv = _mod
                    break
            except Exception:
                continue

if _real_csv is None:
    # Fallback to default linux stdlib location
    for _fallback in ["/usr/lib/python3.10/csv.py", "/usr/lib/python3.11/csv.py", "/usr/lib/python3.12/csv.py", "/usr/lib/python3.9/csv.py"]:
        if os.path.isfile(_fallback):
            _spec = importlib.util.spec_from_file_location("_stdlib_csv_underlying", _fallback)
            if _spec and _spec.loader:
                _mod = importlib.util.module_from_spec(_spec)
                _spec.loader.exec_module(_mod)
                _real_csv = _mod
                break

# Expose all standard library csv attributes into this module's namespace
if _real_csv is not None:
    for _attr in dir(_real_csv):
        if not _attr.startswith("__"):
            globals()[_attr] = getattr(_real_csv, _attr)
    __all__ = getattr(_real_csv, "__all__", [a for a in dir(_real_csv) if not a.startswith("_")])
else:
    __all__ = []

# ------------------------------------------------------------------------------
# STEP 2: RECURSIVE CORPUS SYNCHRONIZER & HOURLY CRON ENGINE
# ------------------------------------------------------------------------------
import time
import json
import sqlite3
import hashlib
import argparse
import signal
from datetime import datetime, timezone
from typing import Dict, List, Any, Set, Tuple, Optional

WORKSPACE_ROOT = os.path.abspath(os.path.dirname(__file__))
DATA_DIR = os.path.join(WORKSPACE_ROOT, "data")
VAULT_DIR = os.path.join(WORKSPACE_ROOT, "vault")
SCRIPTS_DIR = os.path.join(WORKSPACE_ROOT, "scripts")
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
    "microsoft_corpus_documents.csv": "microsoft_corpus_documents",
    "microsoft_marketable_derivatives.csv": "microsoft_marketable_derivatives",
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
    "ip_opensource_analysis.csv": "ip_opensource_analysis",
    "language_statistics.csv": "language_stats",
    "vault_seal.csv": "sovereign_vault_seal",
}


def log_sync(msg: str):
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    line = f"[{timestamp}] [LaneRecursiveCSV] {msg}"
    print(line)
    try:
        os.makedirs(os.path.dirname(LOG_PATH), exist_ok=True)
        with open(LOG_PATH, "a", encoding="utf-8") as f:
            f.write(line + "\n")
    except Exception:
        pass


def compute_file_sha256(filepath: str) -> str:
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()


def csv_to_json_converter(csv_path: str, output_json_path: Optional[str] = None) -> Dict[str, Any]:
    """
    Parses a CSV file using standard library reader/DictReader and converts it to
    a structured JSON document with provenance metadata, typed values, and SHA-256 hash.
    """
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"CSV file not found: {csv_path}")

    sha = compute_file_sha256(csv_path)
    rows = []
    headers = []

    # Read using DictReader
    with open(csv_path, "r", encoding="utf-8", errors="replace") as f:
        reader = _real_csv.DictReader(f) if _real_csv else None
        if reader:
            headers = reader.fieldnames or []
            for r in reader:
                # Type inference
                parsed_row = {}
                for k, v in r.items():
                    if v is None or v == "":
                        parsed_row[k] = None
                    elif v.lower() == "true":
                        parsed_row[k] = True
                    elif v.lower() == "false":
                        parsed_row[k] = False
                    else:
                        try:
                            if "." in v:
                                parsed_row[k] = float(v)
                            else:
                                parsed_row[k] = int(v)
                        except (ValueError, TypeError):
                            parsed_row[k] = v
                rows.append(parsed_row)

    payload = {
        "metadata": {
            "sourceCsvFile": os.path.relpath(csv_path, WORKSPACE_ROOT),
            "sha256": sha,
            "rowCount": len(rows),
            "columnCount": len(headers),
            "columns": headers,
            "statutoryAuthority": SEC_HMAC,
            "zaxisAnchor": ZAXIS_HEX,
            "convertedAtUtc": datetime.now(timezone.utc).isoformat()
        },
        "records": rows
    }

    if output_json_path:
        os.makedirs(os.path.dirname(os.path.abspath(output_json_path)), exist_ok=True)
        with open(output_json_path, "w", encoding="utf-8") as f:
            json.dump(payload, f, indent=2)

    return payload


def json_to_csv_converter(json_path: str, output_csv_path: Optional[str] = None) -> str:
    """
    Takes a structured JSON file containing records/entities and serializes it to standard CSV.
    """
    if not os.path.exists(json_path):
        raise FileNotFoundError(f"JSON file not found: {json_path}")

    with open(json_path, "r", encoding="utf-8", errors="replace") as f:
        data = json.load(f)

    records = []
    if isinstance(data, list):
        records = data
    elif isinstance(data, dict):
        if "records" in data and isinstance(data["records"], list):
            records = data["records"]
        elif "entities" in data and isinstance(data["entities"], list):
            records = data["entities"]
        elif "data" in data and isinstance(data["data"], list):
            records = data["data"]

    if not records or not isinstance(records[0], dict):
        raise ValueError(f"JSON file does not contain a list of object records: {json_path}")

    # Gather all field names
    fieldnames = []
    for r in records:
        for k in r.keys():
            if k not in fieldnames:
                fieldnames.append(k)

    if not output_csv_path:
        base, _ = os.path.splitext(json_path)
        output_csv_path = base + ".csv"

    os.makedirs(os.path.dirname(os.path.abspath(output_csv_path)), exist_ok=True)
    with open(output_csv_path, "w", encoding="utf-8", newline="") as f:
        writer = _real_csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for r in records:
            # Flatten dicts/lists for CSV compliance
            clean_row = {}
            for k in fieldnames:
                v = r.get(k)
                if isinstance(v, (dict, list)):
                    clean_row[k] = json.dumps(v)
                else:
                    clean_row[k] = v
            writer.writerow(clean_row)

    return output_csv_path


class RecursiveCsvJsonEngine:
    """
    Core engine that powers recursive CSV <-> JSON synchronization,
    database ingestion into codebase_ast.db, and hourly cron execution.
    """

    def __init__(self, db_path: str = DEFAULT_DB_PATH):
        self.db_path = db_path
        self.manifest_path = MANIFEST_PATH
        self.manifest = self._load_manifest()

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
            "engine": "csv.py (Recursive Dual-Mode Standard Library & Corpus Sync)",
            "hourlyRuns": [],
            "fileSignatures": {},
            "generatedJsonMirror": {}
        }

    def _save_manifest(self):
        try:
            os.makedirs(os.path.dirname(self.manifest_path), exist_ok=True)
            with open(self.manifest_path, "w", encoding="utf-8") as f:
                json.dump(self.manifest, f, indent=2)
        except Exception as e:
            log_sync(f"Failed saving manifest: {e}")

    def discover_corpus_files(self, search_roots: Optional[List[str]] = None) -> Tuple[List[str], List[str]]:
        """Recursively discovers all CSV and JSON files across the 200MB corpus."""
        if search_roots is None:
            search_roots = [
                os.path.join(WORKSPACE_ROOT, "data"),
                os.path.join(WORKSPACE_ROOT, "vault"),
                os.path.join(WORKSPACE_ROOT, "scripts"),
                os.path.join(WORKSPACE_ROOT, "server")
            ]

        csv_files = []
        json_files = []

        for root in search_roots:
            if not os.path.exists(root):
                continue
            for dirpath, dirnames, filenames in os.walk(root):
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

    def sync_csv_file_to_db(self, csv_path: str, conn: sqlite3.Connection) -> int:
        """Parses CSV and syncs into its corresponding SQLite table if defined."""
        basename = os.path.basename(csv_path)
        table_name = CSV_TABLE_MAP.get(basename)
        if not table_name:
            return 0

        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name = ?", (table_name,))
        if not cursor.fetchone():
            return 0

        cursor.execute(f'PRAGMA table_info("{table_name}")')
        db_cols = [c[1] for c in cursor.fetchall() if c[1] != 'id']

        updated = 0
        try:
            with open(csv_path, 'r', encoding='utf-8', errors='replace') as f:
                reader = _real_csv.DictReader(f) if _real_csv else None
                if not reader:
                    return 0
                rows = list(reader)

            if not rows:
                return 0

            csv_headers = reader.fieldnames or []
            matched_cols = [c for c in db_cols if c in csv_headers]
            if not matched_cols:
                return 0

            col_placeholders = ", ".join(f'"{c}"' for c in matched_cols)
            val_placeholders = ", ".join("?" for _ in matched_cols)
            sql = f'INSERT OR REPLACE INTO "{table_name}" ({col_placeholders}) VALUES ({val_placeholders})'

            batch = []
            for r in rows:
                batch.append([r.get(c) for c in matched_cols])
                if len(batch) >= 500:
                    cursor.executemany(sql, batch)
                    updated += len(batch)
                    batch = []

            if batch:
                cursor.executemany(sql, batch)
                updated += len(batch)

            conn.commit()
        except Exception as e:
            log_sync(f"Error syncing {basename} to {table_name}: {e}")

        return updated

    def sync_json_file_to_db(self, json_path: str, conn: sqlite3.Connection) -> int:
        """Inspects structured JSON and ingests violation records."""
        basename = os.path.basename(json_path)
        if basename in ("hourly_recursive_sync_manifest.json", "hourly_sync.log"):
            return 0

        updated = 0
        try:
            with open(json_path, 'r', encoding='utf-8', errors='replace') as f:
                data = json.load(f)

            cursor = conn.cursor()
            if isinstance(data, dict) and "entities" in data and isinstance(data["entities"], list):
                for ent in data["entities"]:
                    if isinstance(ent, dict) and "entity" in ent and "total_infringements" in ent:
                        cursor.execute("""
                            INSERT OR IGNORE INTO ip_license_violations
                            (infringing_entity, infringement_category, structural_similarity_score, severity_level, statutory_authority, detected_at)
                            VALUES (?, ?, ?, ?, ?, ?)
                        """, (
                            ent.get("entity"),
                            "RECURSIVE_CSV_JSON_SYNC",
                            ent.get("max_similarity_score", 1.0),
                            "CRITICAL" if ent.get("severity_breakdown", {}).get("critical", 0) > 0 else "HIGH",
                            SEC_HMAC,
                            datetime.now(timezone.utc).isoformat()
                        ))
                        updated += 1
                conn.commit()
        except Exception:
            pass

        return updated

    def mirror_csvs_to_json(self, csv_files: List[str]) -> int:
        """
        Recursively converts all CSV files into a JSON mirror cache under data/csv_json_mirror/
        enabling high-speed programmatic JSON access to the entire 200MB tabular corpus.
        """
        mirror_dir = os.path.join(DATA_DIR, "csv_json_mirror")
        os.makedirs(mirror_dir, exist_ok=True)
        count = 0

        for fpath in csv_files:
            rel = os.path.relpath(fpath, WORKSPACE_ROOT)
            sha = compute_file_sha256(fpath)
            mirror_cache = self.manifest.get("generatedJsonMirror", {})
            if mirror_cache.get(rel) == sha:
                continue

            base = os.path.splitext(os.path.basename(fpath))[0]
            out_json = os.path.join(mirror_dir, f"{base}.json")
            try:
                csv_to_json_converter(fpath, out_json)
                mirror_cache[rel] = sha
                count += 1
            except Exception as e:
                log_sync(f"Failed converting {fpath} to JSON: {e}")

        self.manifest["generatedJsonMirror"] = mirror_cache
        return count

    def execute_hourly_cycle(self) -> Dict[str, Any]:
        """
        Executes a complete hourly cycle:
        1. Discovers all CSV and JSON files across the 200MB corpus.
        2. Detects modifications via SHA-256 digests.
        3. Converts mutated CSVs to recursive JSON mirrors.
        4. Upserts records into codebase_ast.db across 30 tables.
        5. Re-executes the comprehensive audit and regenerates Cease & Desist notices.
        6. Updates the hourly manifest.
        """
        start_time = datetime.now(timezone.utc)
        cycle_id = f"CYCLE-{start_time.strftime('%Y%m%d-%H%M%S')}"
        log_sync(f"Initiating Hourly Cron Cycle {cycle_id}...")

        csv_files, json_files = self.discover_corpus_files()
        log_sync(f"Corpus scan: Discovered {len(csv_files)} CSV files and {len(json_files)} JSON files.")

        file_sigs = self.manifest.get("fileSignatures", {})
        modified_csv = []
        modified_json = []

        for fpath in csv_files:
            rel = os.path.relpath(fpath, WORKSPACE_ROOT)
            sha = compute_file_sha256(fpath)
            if file_sigs.get(rel) != sha:
                modified_csv.append(fpath)
                file_sigs[rel] = sha

        for fpath in json_files:
            rel = os.path.relpath(fpath, WORKSPACE_ROOT)
            if rel.endswith("hourly_recursive_sync_manifest.json"):
                continue
            sha = compute_file_sha256(fpath)
            if file_sigs.get(rel) != sha:
                modified_json.append(fpath)
                file_sigs[rel] = sha

        log_sync(f"Changes detected: {len(modified_csv)} updated CSVs, {len(modified_json)} updated JSONs.")

        # Mirror CSVs to JSON
        mirrored_count = self.mirror_csvs_to_json(csv_files)
        if mirrored_count > 0:
            log_sync(f"Generated/Updated {mirrored_count} recursive JSON mirrors in data/csv_json_mirror/.")

        # Sync to SQLite
        total_rows_synced = 0
        if os.path.exists(self.db_path):
            conn = sqlite3.connect(self.db_path)
            conn.row_factory = sqlite3.Row

            for c_path in modified_csv:
                rows = self.sync_csv_file_to_db(c_path, conn)
                total_rows_synced += rows

            for j_path in modified_json:
                rows = self.sync_json_file_to_db(j_path, conn)
                total_rows_synced += rows

            conn.close()
            log_sync(f"Database sync: Ingested {total_rows_synced} rows into {self.db_path}.")

        # Re-execute legal audit & C&D generation
        sys.path.insert(0, SCRIPTS_DIR)
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

            with open(CORPUS_AUDIT_REPORT_JSON, 'w', encoding='utf-8') as f:
                json.dump(dossier, f, indent=2)

            with open(DEFAULT_AGGREGATE_JSON, 'w', encoding='utf-8') as f:
                json.dump({
                    "metadata": dossier["metadata"],
                    "entities": dossier["aggregateEntities"]
                }, f, indent=2)

            cd_notice = generate_automated_cease_and_desist(dossier)
            with open(DEFAULT_CD_NOTICE_MD, 'w', encoding='utf-8') as f:
                f.write(cd_notice)

            with open(ARCHIVE_CD_NOTICE_MD, 'w', encoding='utf-8') as f:
                f.write(cd_notice)

            log_sync("Legal compliance: Refreshed Corpus Audit Report, Aggregate Violations JSON, and Cease & Desist Notice.")
        except Exception as e:
            log_sync(f"Warning: Failed updating legal documents: {e}")

        end_time = datetime.now(timezone.utc)
        duration_sec = round((end_time - start_time).total_seconds(), 2)

        cycle_record = {
            "cycleId": cycle_id,
            "timestampUtc": start_time.isoformat(),
            "durationSeconds": duration_sec,
            "totalCsvDiscovered": len(csv_files),
            "totalJsonDiscovered": len(json_files),
            "modifiedCsvCount": len(modified_csv),
            "modifiedJsonCount": len(modified_json),
            "mirroredJsonCount": mirrored_count,
            "databaseRowsSynchronized": total_rows_synced,
            "status": "HOURLY_SYNC_SUCCESS"
        }

        self.manifest["lastRun"] = cycle_record
        runs = self.manifest.get("hourlyRuns", [])
        runs.append(cycle_record)
        self.manifest["hourlyRuns"] = runs[-168:]  # 7 days history
        self.manifest["fileSignatures"] = file_sigs
        self._save_manifest()

        log_sync(f"Hourly Cron Cycle {cycle_id} finished successfully in {duration_sec}s.")
        return cycle_record

    def run_hourly_daemon(self, interval_seconds: int = 3600):
        """Runs the synchronization loop every hour (default: 3600 seconds)."""
        log_sync(f"Starting Albert Lane Hourly Cron Daemon (Interval: {interval_seconds}s)...")
        running = True

        def handle_term(sig, frame):
            nonlocal running
            log_sync("Received termination signal. Gracefully exiting daemon...")
            running = False

        signal.signal(signal.SIGINT, handle_term)
        signal.signal(signal.SIGTERM, handle_term)

        while running:
            try:
                self.execute_hourly_cycle()
            except Exception as e:
                log_sync(f"Daemon cycle exception: {e}")

            if not running:
                break

            log_sync(f"Daemon sleeping {interval_seconds}s until next hourly cron run...")
            for _ in range(interval_seconds // 5):
                if not running:
                    break
                time.sleep(5)

        log_sync("Daemon terminated cleanly.")


def get_hourly_crontab_string() -> str:
    """Returns the standard Linux / UNIX crontab line for hourly automation."""
    python_bin = sys.executable
    script_path = os.path.abspath(__file__)
    return f"0 * * * * {python_bin} {script_path} --cron-hourly >> /tmp/albert_lane_hourly_sync.log 2>&1"


def main():
    parser = argparse.ArgumentParser(
        description="Albert Lane Dual-Mode CSV Engine & Recursive Corpus Hourly Synchronizer"
    )
    parser.add_argument("--run-once", action="store_true", help="Execute single synchronization cycle immediately")
    parser.add_argument("--cron-hourly", action="store_true", help="Execute scheduled hourly cron cycle")
    parser.add_argument("--daemon", action="store_true", help="Run continuous background daemon (default 3600s interval)")
    parser.add_argument("--interval", type=int, default=3600, help="Daemon cycle interval in seconds (default: 3600)")
    parser.add_argument("--print-crontab", action="store_true", help="Print standard hourly crontab string")
    parser.add_argument("--csv-to-json", type=str, metavar="CSV_PATH", help="Convert specified CSV file to canonical JSON")
    parser.add_argument("--json-to-csv", type=str, metavar="JSON_PATH", help="Convert specified JSON file to standard CSV")
    parser.add_argument("--out", type=str, help="Output destination for manual conversion")
    parser.add_argument("--db", default=DEFAULT_DB_PATH, help="Path to codebase_ast.db")
    args = parser.parse_args()

    if args.print_crontab:
        print("=== ALBERT LANE HOURLY CRONTAB ENTRY (0 * * * *) ===")
        print(get_hourly_crontab_string())
        print("=====================================================")
        return

    if args.csv_to_json:
        res = csv_to_json_converter(args.csv_to_json, args.out)
        print(json.dumps(res["metadata"], indent=2))
        return

    if args.json_to_csv:
        out = json_to_csv_converter(args.json_to_csv, args.out)
        print(f"Generated CSV: {out}")
        return

    engine = RecursiveCsvJsonEngine(args.db)

    if args.daemon:
        engine.run_hourly_daemon(args.interval)
    else:
        summary = engine.execute_hourly_cycle()
        print("\n=== HOURLY RECURSIVE SYNC SUMMARY ===")
        print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
