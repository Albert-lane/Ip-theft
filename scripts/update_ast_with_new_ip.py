#!/usr/bin/env python3
# ==============================================================================
# [PROVENANCE CERTIFICATION AND STATUTORY DECLARATION]
# Rights Holder: Albert Lane | SEC Whistleblower No. 17684-273-411-436
# Governing License: Albert Lane Proprietary License v1.2 / E=AA
# ==============================================================================

import os
import sys
import sqlite3
import ast
import json
import re
import hashlib
from datetime import datetime
import importlib.util

# Load stdlib csv to avoid local csv.py shadow
try:
    import _csv
    import importlib.machinery
    stdlib_csv_path = os.path.join(os.path.dirname(os.__file__), "csv.py")
    if os.path.exists(stdlib_csv_path):
        spec = importlib.util.spec_from_file_location("stdlib_csv", stdlib_csv_path)
        csv_mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(csv_mod)
    else:
        import csv as csv_mod
except Exception:
    import csv as csv_mod

WORKSPACE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(WORKSPACE, "data")
DB_PATH = os.path.join(DATA_DIR, "codebase_ast.db")
CSV_PATH = os.path.join(DATA_DIR, "csv", "ast_entities.csv")
JSON_MIRROR_PATH = os.path.join(DATA_DIR, "csv_json_mirror", "ast_entities.json")
AST_ANALYSIS_PATH = os.path.join(DATA_DIR, "ast_analysis.json")

def parse_python_ast(filepath, rel_path):
    entities = []
    try:
        with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
            code = f.read()
        tree = ast.parse(code, filename=rel_path)
        for node in ast.walk(tree):
            if isinstance(node, ast.FunctionDef) or isinstance(node, ast.AsyncFunctionDef):
                args = [a.arg for a in node.args.args]
                entities.append((rel_path, "function", node.name, node.lineno, json.dumps(args)))
            elif isinstance(node, ast.ClassDef):
                bases = [getattr(b, "id", getattr(b, "attr", str(b))) for b in node.bases]
                entities.append((rel_path, "class", node.name, node.lineno, json.dumps(bases)))
            elif isinstance(node, ast.Import):
                for alias in node.names:
                    entities.append((rel_path, "import", alias.name, node.lineno, alias.asname or ""))
            elif isinstance(node, ast.ImportFrom):
                mod = node.module or ""
                for alias in node.names:
                    entities.append((rel_path, "import_from", f"{mod}.{alias.name}", node.lineno, alias.asname or ""))
            elif isinstance(node, ast.Assign):
                for target in node.targets:
                    if isinstance(target, ast.Name):
                        entities.append((rel_path, "variable", target.id, node.lineno, "assignment"))
    except Exception:
        pass
    return entities

def parse_text_or_code_entities(filepath, rel_path):
    entities = []
    try:
        with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
            lines = f.readlines()
        for idx, line in enumerate(lines, 1):
            line_str = line.strip()
            # TypeScript / JavaScript functions & classes
            ts_func = re.search(r'(?:export\s+)?(?:async\s+)?function\s+([a-zA-Z0-9_$]+)', line_str)
            if ts_func:
                entities.append((rel_path, "function", ts_func.group(1), idx, "typescript_function"))
            ts_class = re.search(r'(?:export\s+)?class\s+([a-zA-Z0-9_$]+)', line_str)
            if ts_class:
                entities.append((rel_path, "class", ts_class.group(1), idx, "typescript_class"))
            ts_iface = re.search(r'(?:export\s+)?interface\s+([a-zA-Z0-9_$]+)', line_str)
            if ts_iface:
                entities.append((rel_path, "interface", ts_iface.group(1), idx, "typescript_interface"))
            ts_type = re.search(r'(?:export\s+)?type\s+([a-zA-Z0-9_$]+)\s*=', line_str)
            if ts_type:
                entities.append((rel_path, "type", ts_type.group(1), idx, "typescript_type"))

            # Markdown / Legal articles
            if rel_path.endswith((".md", ".txt", ".tex")):
                heading = re.search(r'^(?:#+|\d+\.|\bARTICLE\b|\bSECTION\b)\s+(.+)', line_str, re.IGNORECASE)
                if heading:
                    entities.append((rel_path, "legal_article_heading", heading.group(1)[:120], idx, "statutory_section"))
                license_claim = re.search(r'(SEC Whistleblower|Dodd-Frank|17 U\.S\.C\.|18 U\.S\.C\.|Albert Lane)', line_str, re.IGNORECASE)
                if license_claim:
                    entities.append((rel_path, "statutory_claim", license_claim.group(0), idx, line_str[:100]))
    except Exception:
        pass
    return entities

def get_db_connection():
    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute("PRAGMA quick_check")
        res = cur.fetchone()
        if res and res[0] != "ok":
            raise sqlite3.DatabaseError("Corrupted db")
        return conn
    except Exception as e:
        print(f"[!] Warning: SQLite db issue detected ({e}), rebuilding database file...")
        if os.path.exists(DB_PATH):
            os.remove(DB_PATH)
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute("""
            CREATE TABLE IF NOT EXISTS ast_entities (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                file_path TEXT,
                entity_type TEXT,
                name TEXT,
                lineno INTEGER,
                extra TEXT
            )
        """)
        # If CSV exists, seed from CSV
        if os.path.exists(CSV_PATH):
            try:
                with open(CSV_PATH, "r", encoding="utf-8", errors="ignore") as f:
                    r = csv_mod.reader(f)
                    header = next(r, None)
                    rows_to_insert = []
                    for row in r:
                        if len(row) >= 6:
                            rows_to_insert.append((row[1], row[2], row[3], int(row[4]) if row[4].isdigit() else 0, row[5]))
                    if rows_to_insert:
                        cur.executemany("INSERT INTO ast_entities (file_path, entity_type, name, lineno, extra) VALUES (?, ?, ?, ?, ?)", rows_to_insert)
                        conn.commit()
                        print(f"[+] Re-seeded {len(rows_to_insert):,} entities from CSV backup.")
            except Exception as seed_err:
                print(f"[!] CSV seeding note: {seed_err}")
        return conn

def update_ast():
    print("[*] Starting AST indexation across repository...")
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        CREATE TABLE IF NOT EXISTS ast_entities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            file_path TEXT,
            entity_type TEXT,
            name TEXT,
            lineno INTEGER,
            extra TEXT
        )
    """)

    # Get set of currently indexed file paths
    cur.execute("SELECT DISTINCT file_path FROM ast_entities")
    existing_files = {r[0] for r in cur.fetchall()}

    all_new_entities = []
    scanned_files_count = 0

    for root, dirs, files in os.walk(WORKSPACE):
        if "node_modules" in root or ".git" in root or "dist" in root:
            continue
        for f in files:
            full_p = os.path.join(root, f)
            rel_p = os.path.relpath(full_p, WORKSPACE)

            # Re-index recently created or modified files and unindexed files
            if rel_p.endswith(".py"):
                scanned_files_count += 1
                cur.execute("DELETE FROM ast_entities WHERE file_path = ?", (rel_p,))
                ents = parse_python_ast(full_p, rel_p)
                all_new_entities.extend(ents)
            elif rel_p.endswith((".ts", ".tsx", ".md", ".txt", ".tex", ".c", ".h", ".cpp", ".hpp", ".json")):
                scanned_files_count += 1
                cur.execute("DELETE FROM ast_entities WHERE file_path = ?", (rel_p,))
                ents = parse_text_or_code_entities(full_p, rel_p)
                all_new_entities.extend(ents)

    print(f"[*] Scanned {scanned_files_count} files. Inserting {len(all_new_entities)} newly extracted AST entities...")
    cur.executemany(
        "INSERT INTO ast_entities (file_path, entity_type, name, lineno, extra) VALUES (?, ?, ?, ?, ?)",
        all_new_entities
    )
    conn.commit()

    cur.execute("SELECT COUNT(*) FROM ast_entities")
    total_ast_count = cur.fetchone()[0]
    print(f"[+] Updated total AST entities in codebase_ast.db: {total_ast_count:,}")

    # Export to CSV
    print(f"[*] Exporting to {CSV_PATH}...")
    os.makedirs(os.path.dirname(CSV_PATH), exist_ok=True)
    cur.execute("SELECT id, file_path, entity_type, name, lineno, extra FROM ast_entities")
    rows = cur.fetchall()
    
    with open(CSV_PATH, "w", newline="", encoding="utf-8") as f:
        writer = csv_mod.writer(f)
        writer.writerow(["id", "file_path", "entity_type", "name", "lineno", "extra"])
        writer.writerows(rows)

    # Export to JSON mirror
    print(f"[*] Exporting to {JSON_MIRROR_PATH}...")
    os.makedirs(os.path.dirname(JSON_MIRROR_PATH), exist_ok=True)
    json_data = [
        {"id": r[0], "file_path": r[1], "entity_type": r[2], "name": r[3], "lineno": r[4], "extra": r[5]}
        for r in rows
    ]
    with open(JSON_MIRROR_PATH, "w", encoding="utf-8") as f:
        json.dump(json_data, f, indent=2)

    # Export master AST analysis JSON
    print(f"[*] Updating {AST_ANALYSIS_PATH}...")
    with open(AST_ANALYSIS_PATH, "w", encoding="utf-8") as f:
        json.dump({
            "metadata": {
                "rightsHolder": "Albert Lane",
                "secFilingReference": "SEC-17684-273-411-436",
                "last_updated": datetime.utcnow().isoformat() + "Z",
                "total_entities": total_ast_count,
                "total_files_scanned": scanned_files_count
            },
            "sample_entities": json_data[:200]
        }, f, indent=2)

    conn.close()
    print("[+] AST indexing completed successfully.")

if __name__ == "__main__":
    update_ast()
