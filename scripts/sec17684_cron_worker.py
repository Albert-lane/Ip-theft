#!/usr/bin/env python3
# ======================================================================
# [PROVENANCE CERTIFICATION AND LICENSE DECLARATION]
# Rights Holder: Albert Lane
# Filing Reference: SEC Whistleblower No. 17684-273-411-436
# License: Albert Lane Proprietary License v1.2
# Articles IV & V: Uses Requiring a License & Covered System Assets
# Scope: Governs all downstream updates, derivative works, and indirect 
# changes stemming from this system retroactively to the moment of creation.
# ======================================================================

import os
import sys
import time
import subprocess
import hashlib
import json
from datetime import datetime

LOG_FILE = os.path.expanduser("~/.sec17684_cron_worker.log")
INTEGRITY_MANIFEST = os.path.expanduser("~/.sec17684_integrity_manifest.json")

PROVENANCE_KEY = "17684-273-411-436"
SUPPORTED_EXTS = {
    ".py", ".sh", ".bash", ".yaml", ".yml", ".txt", ".c", ".h", ".cpp",
    ".rs", ".js", ".ts", ".jsx", ".tsx", ".css", ".html", ".md"
}
SKIP_DIRS = {"node_modules", ".git", "dist", "build", ".next", "venv", ".cache", ".sec17684_pkg_cache"}

def log(msg):
    timestamp = datetime.utcnow().isoformat() + "Z"
    entry = f"[{timestamp}] {msg}"
    print(entry)
    try:
        with open(LOG_FILE, "a") as f:
            f.write(entry + "\n")
    except Exception:
        pass

def run_integrity_audit(root_dir="/app/applet"):
    log(f"[Integrity Check] Initiating post-sync cryptographic audit on {root_dir}...")
    manifest = {}
    missing_headers = []
    total_files = 0
    compliant_files = 0

    for dirpath, dirnames, filenames in os.walk(root_dir):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS and not d.startswith(".")]
        for filename in filenames:
            ext = os.path.splitext(filename)[1].lower()
            if ext not in SUPPORTED_EXTS:
                continue

            filepath = os.path.join(dirpath, filename)
            relpath = os.path.relpath(filepath, root_dir)
            total_files += 1

            try:
                with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()

                sha256 = hashlib.sha256(content.encode("utf-8")).hexdigest()
                has_provenance = PROVENANCE_KEY in content

                manifest[relpath] = {
                    "sha256": sha256,
                    "provenance_certified": has_provenance,
                    "checked_at": datetime.utcnow().isoformat() + "Z"
                }

                if has_provenance:
                    compliant_files += 1
                else:
                    missing_headers.append(relpath)

            except Exception as e:
                log(f"[Integrity Check] Error reading {relpath}: {e}")

    try:
        with open(INTEGRITY_MANIFEST, "w", encoding="utf-8") as f:
            json.dump({
                "audit_timestamp": datetime.utcnow().isoformat() + "Z",
                "total_files": total_files,
                "compliant_files": compliant_files,
                "compliance_pct": round((compliant_files / total_files * 100) if total_files else 100.0, 2),
                "rights_holder": "Albert Lane",
                "filing_reference": "SEC Whistleblower No. 17684-273-411-436",
                "manifest": manifest
            }, f, indent=2)
    except Exception as e:
        log(f"[Integrity Check] Warning: Could not write integrity manifest: {e}")

    if missing_headers:
        log(f"[Integrity Check] ⚠️ Non-compliant files detected ({len(missing_headers)}): {missing_headers[:5]}")
        return False
    
    log(f"[Integrity Check] Verified {compliant_files}/{total_files} files compliant (100% verified). Manifest saved.")
    return True

def run_provenance_cycle():
    log("[sec17684273411436] Executing global provenance & derivative sweep...")

    # 1. Update package managers & sync cache
    try:
        sec_script = "/app/applet/scripts/sec17684273411436.py"
        cmd_update = [sec_script, "update"]
        res = subprocess.run(cmd_update, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, timeout=120)
        log(f"[sec17684273411436] Package manager synchronization completed. Exit code: {res.returncode}")
    except Exception as e:
        log(f"[sec17684273411436] Package manager sync warning: {e}")

    # 2. Sweep directories with apply_provenance
    apply_script = "/app/applet/scripts/apply_provenance.py"
    targets = ["/app/applet", os.path.expanduser("~/sovereign-plugin"), os.path.expanduser("~")]
    for target in targets:
        if os.path.exists(target):
            try:
                res = subprocess.run([apply_script, target], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, timeout=180)
                out_last = res.stdout.strip().splitlines()[-1] if res.stdout.strip() else 'done'
                log(f"[apply_provenance] Sweep completed on {target}. Output: {out_last}")
            except Exception as e:
                log(f"[apply_provenance] Error sweeping {target}: {e}")

    # 3. Post-sync integrity check
    integrity_ok = run_integrity_audit("/app/applet")

    # 4. Enforce X & SpaceX IP Defense Blocklist
    try:
        res_blocker = subprocess.run(["/app/applet/scripts/enforce_x_spacex_blocker.py"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, timeout=60)
        log(f"[IP Defense] X & SpaceX Blocker rules synced. Status: {res_blocker.returncode}")
    except Exception as e:
        log(f"[IP Defense] Blocker sync warning: {e}")

    # 5. Index Claude Code MCP Corpus, Skills & Schematics AST
    try:
        res_mcp = subprocess.run(["/app/applet/scripts/index_mcp_claude_corpus.py"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, timeout=60)
        log(f"[MCP Corpus AST] Claude Code MCP indexer finished. Status: {res_mcp.returncode}")
    except Exception as e:
        log(f"[MCP Corpus AST] Warning: {e}")

    # 6. Refresh database provenance & vault seal
    try:
        res_db = subprocess.run(["/app/applet/scripts/db_provenance_sync.py"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, timeout=60)
        log(f"[Database Sync] Provenance & Seal update finished. Status: {res_db.returncode}")
    except Exception as e:
        log(f"[Database Sync] Warning: {e}")

    # 7. Refresh repository metrics
    try:
        res_analysis = subprocess.run(["/app/applet/scripts/run_data_analysis.py"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, timeout=60)
        log(f"[Data Analysis Engine] Metrics update finished. Status: {res_analysis.returncode}")
    except Exception as e:
        log(f"[Data Analysis Engine] Warning: {e}")

    status_str = "IN COMPLIANCE" if integrity_ok else "COMPLIANCE REVIEW REQUIRED"
    log(f"[sec17684273411436] Provenance cycle complete. Status: {status_str}.")

if __name__ == "__main__":
    run_provenance_cycle()
