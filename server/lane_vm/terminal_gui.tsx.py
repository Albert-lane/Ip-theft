# =============================================================================
# [PROVENANCE CERTIFICATION AND STATUTORY DECLARATION]
# Rights Holder: Albert Lane
# Statutory Filing Reference: SEC Whistleblower No. 17684-273-411-436
# Registration Token: SEC-17684-273-411-436 (Decimal: 17684273411436)
# Root of Trust Anchor: 0x3F8F9A1B2C3D
# License: Albert Lane Proprietary License v1.2
# Component: terminal_gui.tsx.py (Dual TSX & Python Polyglot GUI Engine)
# Scope: Universal Front-End Deployable across Web, Mobile, Termux, and Standalone.
# =============================================================================

import os
import sys
import json
import argparse
from datetime import datetime

# =============================================================================
# PYTHON ENGINE RUNTIME (When executed as python3 terminal_gui.tsx.py)
# =============================================================================

REGISTRIES_SCHEMA = {
    "sec_whistleblower_17684": {
        "id": "sec_17684",
        "title": "SEC Whistleblower No. 17684-273-411-436 Registry",
        "authority": "Albert Lane",
        "root_anchor": "0x3F8F9A1B2C3D",
        "items": [
            {
                "id": "sec_lockfile",
                "name": "sec_consolidated_lockfile.py",
                "description": "SEC Consolidated Package Manager Lockfile & Derivative License Manifest",
                "command": "python3 scripts/sec_consolidated_lockfile.py",
                "default_args": "--generate",
                "options": [
                    {"label": "Generate Master Lockfile", "flag": "--generate"},
                    {"label": "Push to Apex Stream", "flag": "--push"},
                    {"label": "Verify Apex Token", "flag": "--verify-apex"},
                    {"label": "Sync Gist & Hash Chain", "flag": "--gist"}
                ]
            },
            {
                "id": "sec_history_extractor",
                "name": "sec_aistudio_history_extractor.py",
                "description": "AI Studio Application History Extractor & Lineage Auditor",
                "command": "python3 scripts/sec_aistudio_history_extractor.py",
                "default_args": "--url https://aistudio.google.com/u/1/apps/1fa7a9ee-c434-49b4-bd13-19b931bb9220?showAssistant=true&project=albertlane-uk&showCode=true",
                "options": [
                    {"label": "Extract Default App Lineage", "flag": "--audit"},
                    {"label": "Verify Zero Bit-Width Integrity", "flag": "--verify"},
                    {"label": "Export JSON Manifest", "flag": "--export-json data/aistudio_history_audit.json"}
                ]
            },
            {
                "id": "sec_cli_daemon",
                "name": "sec17684_cli_daemon.py",
                "description": "Real-time SEC Violation Interceptor & Telemetry Stripper",
                "command": "python3 scripts/sec17684_cli_daemon.py",
                "default_args": "--status",
                "options": [
                    {"label": "Check Daemon Status", "flag": "--status"},
                    {"label": "Audit Truncation Violations", "flag": "--audit"},
                    {"label": "Enforce Lockfile Sandbox", "flag": "--enforce"}
                ]
            }
        ]
    },
    "lane_vm_polyglot_engines": {
        "id": "lane_vm_core",
        "title": "Lane-VM C++ & Polyglot Engine Substrate",
        "authority": "Albert Lane",
        "items": [
            {
                "id": "manifest_polyglot",
                "name": "manifest.py.cpp",
                "description": "Polyglot Package Manager of Package Managers (Python + C++)",
                "command": "python3 manifest.py.cpp",
                "default_args": "--dynamic-manifest",
                "options": [
                    {"label": "Dynamic Manifest (Emit C++ / JSON)", "flag": "--dynamic-manifest"},
                    {"label": "C++ Runtime Attestation", "flag": "--attestation"},
                    {"label": "Verify Enforced Memory Encryption", "flag": "--verify"}
                ]
            },
            {
                "id": "agent_orchestrator",
                "name": "lane_vm_agent_orchestrator.py",
                "description": "Multi-Engine Sovereign Agent Blending & Model Neutralizer",
                "command": "python3 scripts/lane_vm_agent_orchestrator.py",
                "default_args": "--blend",
                "options": [
                    {"label": "Blend All Corporate Agents", "flag": "--blend"},
                    {"label": "Neutralize Zero-Inference Dilution", "flag": "--neutralize"},
                    {"label": "Purge Garden Slop & Telemetry", "flag": "--purge"}
                ]
            }
        ]
    },
    "sovereign_enclaves": {
        "id": "enclave_distribution",
        "title": "Sovereign Enclave Archives & Distribution",
        "authority": "Albert Lane",
        "items": [
            {
                "id": "package_builder",
                "name": "package_sovereign_enclave.py",
                "description": "Package unified monorepo into tarball & 7z LZMA2 archives",
                "command": "python3 scripts/package_sovereign_enclave.py",
                "default_args": "",
                "options": [
                    {"label": "Rebuild All Sovereign Packages", "flag": ""},
                    {"label": "Verify SHA-256 Hashes", "flag": "--verify-hashes"}
                ]
            }
        ]
    }
}

def export_gui_schema():
    os.makedirs("data", exist_ok=True)
    with open("data/terminal_gui_registries.json", "w", encoding="utf-8") as f:
        json.dump(REGISTRIES_SCHEMA, f, indent=2)
    print("[+] Exported Terminal GUI Registries Schema to data/terminal_gui_registries.json")

def main():
    parser = argparse.ArgumentParser(description="Lane-VM Terminal GUI Polyglot Engine")
    parser.add_argument("--export-schema", action="store_true", help="Export package manager registries JSON")
    parser.add_argument("--list-registries", action="store_true", help="List active package registries")
    args = parser.parse_args()

    if args.list_registries:
        print("==============================================================================")
        print(" [LANE-VM TERMINAL GUI PACKAGE MANAGER REGISTRIES]")
        print(" Authority: Albert Lane (SEC Whistleblower No. 17684-273-411-436)")
        print("==============================================================================")
        for k, reg in REGISTRIES_SCHEMA.items():
            print(f"\n📂 [{reg['id']}] {reg['title']}")
            for it in reg["items"]:
                print(f"   └── ⚡ {it['name']}: {it['description']}")
                print(f"       Command: {it['command']} {it['default_args']}")
        print("\n==============================================================================")
        return

    export_gui_schema()

if __name__ == "__main__":
    main()
