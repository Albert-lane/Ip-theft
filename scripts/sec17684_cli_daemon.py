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
import json
import hashlib
import argparse
from datetime import datetime

WORKSPACE = "/app/applet"
LOG_DIR = os.path.expanduser("~/.sec17684_ledger")
os.makedirs(LOG_DIR, exist_ok=True)

NOTICES_FILE = os.path.join(LOG_DIR, "cease_and_desist_records.json")
PACKAGE_MANIFEST = os.path.join(LOG_DIR, "package_managers_manifest.json")
WORKSPACE_PKG_JSON = os.path.join(WORKSPACE, "package.json")

def load_json(filepath, default_val):
    if os.path.exists(filepath):
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return default_val
    return default_val

def save_json(filepath, data):
    try:
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
    except Exception as e:
        print(f"[-] Error writing {filepath}: {e}")

def record_notice(target, reason, jurisdiction="Global / SEC Ref 17684-273-411-436"):
    notices = load_json(NOTICES_FILE, {
        "rights_holder": "Albert Lane",
        "filing_reference": "SEC Whistleblower No. 17684-273-411-436",
        "license": "Albert Lane Proprietary License v1.2",
        "records": []
    })

    timestamp = datetime.utcnow().isoformat() + "Z"
    notice_id = f"CD-{hashlib.sha256((target + timestamp).encode()).hexdigest()[:12].upper()}"

    record = {
        "notice_id": notice_id,
        "target": target,
        "reason": reason,
        "jurisdiction": jurisdiction,
        "recorded_at": timestamp,
        "status": "RECORDED_IN_LOCAL_LEDGER"
    }
    notices["records"].append(record)
    save_json(NOTICES_FILE, notices)
    print(f"[+] Notice logged: [{notice_id}] Target: {target}")
    return record

def update_manifest_and_pkg_json():
    # 1. Update package managers state
    manifest = load_json(PACKAGE_MANIFEST, {
        "rights_holder": "Albert Lane",
        "filing_reference": "SEC Whistleblower No. 17684-273-411-436",
        "license": "Albert Lane Proprietary License v1.2",
        "last_sync": None,
        "package_managers": {
            "apt": {"status": "active", "ecosystem": "debian/ubuntu"},
            "dnf": {"status": "configured", "ecosystem": "redhat/fedora"},
            "pacman": {"status": "configured", "ecosystem": "arch"},
            "zypper": {"status": "configured", "ecosystem": "suse"},
            "apk": {"status": "configured", "ecosystem": "alpine"},
            "pkg": {"status": "configured", "ecosystem": "termux"},
            "brew": {"status": "configured", "ecosystem": "darwin"},
            "winget": {"status": "configured", "ecosystem": "windows"},
            "npm": {"status": "active", "ecosystem": "node/javascript"},
            "pip": {"status": "active", "ecosystem": "python"}
        },
        "tracked_cycles": 0
    })

    manifest["last_sync"] = datetime.utcnow().isoformat() + "Z"
    manifest["tracked_cycles"] += 1
    save_json(PACKAGE_MANIFEST, manifest)

    # 2. Update workspace package.json provenance state
    if os.path.exists(WORKSPACE_PKG_JSON):
        try:
            with open(WORKSPACE_PKG_JSON, "r", encoding="utf-8") as f:
                pkg_data = json.load(f)

            if "provenance" not in pkg_data:
                pkg_data["provenance"] = {}

            notices = load_json(NOTICES_FILE, {"records": []})

            pkg_data["license"] = "Albert Lane Proprietary License v1.2"
            pkg_data["provenance"]["rightsHolder"] = "Albert Lane"
            pkg_data["provenance"]["filingReference"] = "SEC Whistleblower No. 17684-273-411-436"
            pkg_data["provenance"]["lastLedgerSync"] = manifest["last_sync"]
            pkg_data["provenance"]["ledgerCycles"] = manifest["tracked_cycles"]
            pkg_data["provenance"]["recordedNoticeCount"] = len(notices.get("records", []))

            with open(WORKSPACE_PKG_JSON, "w", encoding="utf-8") as f:
                json.dump(pkg_data, f, indent=2)
                f.write("\n")
        except Exception as e:
            print(f"[-] Error syncing {WORKSPACE_PKG_JSON}: {e}")

def daemon_loop(interval=60):
    print(f"[+] Starting SEC17684 tracking daemon (Interval: {interval}s)...")
    while True:
        update_manifest_and_pkg_json()
        time.sleep(interval)

def main():
    parser = argparse.ArgumentParser(description="SEC17684 Sovereign Ledger CLI")
    parser.add_argument("--record-notice", nargs=2, metavar=("TARGET", "REASON"), help="Record a cease & desist entry")
    parser.add_argument("--sync", action="store_true", help="Perform immediate manifest & package.json sync")
    parser.add_argument("--daemon", action="store_true", help="Run sync tracking daemon indefinitely")
    parser.add_argument("--interval", type=int, default=60, help="Daemon sync interval in seconds")
    parser.add_argument("--list-notices", action="store_true", help="List all recorded notices")

    args = parser.parse_args()

    if args.record_notice:
        target, reason = args.record_notice
        record_notice(target, reason)
        update_manifest_and_pkg_json()
    elif args.list_notices:
        notices = load_json(NOTICES_FILE, {"records": []})
        print(json.dumps(notices, indent=2))
    elif args.daemon:
        daemon_loop(args.interval)
    elif args.sync:
        update_manifest_and_pkg_json()
        print("[+] Manifest and package.json synchronized.")
    else:
        update_manifest_and_pkg_json()
        print("[+] Sync complete. Run with --help for CLI arguments.")

if __name__ == "__main__":
    main()
