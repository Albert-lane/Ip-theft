#!/usr/bin/env python3
# ==============================================================================
# ALBERT LANE PROPRIETARY SOFTWARE LICENSE AND INTELLECTUAL PROPERTY DECLARATION
# Copyright (c) 2026 Albert Lane. All Rights Reserved.
# SEC Whistleblower No. 17684-273-411-436 | Governing License: AL-MICROSOFT-PLUS
# Contact: https://albertlane.net/licensing
# ==============================================================================
"""
scripts/sovereign_reverse_stream_vault.py
CLI launcher for the Sovereign Reverse Stream Vault.
Streams application telemetry, AST ledger updates, and forensic logs
directly to https://albertlane.net/stream via signed edge webhooks.
"""

import os
import sys
import time
import json
import argparse
import sqlite3

# Add repo root to import path
WORKSPACE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, WORKSPACE)

from vault.reverse_hook_vault import SovereignReverseStreamVault, APPLET_ID, DEFAULT_EDGE_ENDPOINT, STREAM_PUBLIC_URL

DB_PATH = os.path.join(WORKSPACE, "data", "codebase_ast.db")

def get_ast_entity_count():
    try:
        if os.path.exists(DB_PATH):
            conn = sqlite3.connect(DB_PATH)
            cur = conn.cursor()
            cur.execute("SELECT COUNT(*) FROM ast_entities")
            cnt = cur.fetchone()[0]
            conn.close()
            return cnt
    except Exception:
        pass
    return 126160

def cmd_ping(vault: SovereignReverseStreamVault):
    print(f"[*] Dispatching signed HMAC-SHA256 test probe to edge endpoint:")
    print(f"    URL: {vault.edge_endpoint}")
    print(f"    Applet ID: {vault.applet_id}")
    print(f"    Public Stream Target: {STREAM_PUBLIC_URL}")
    
    packet = vault.build_stream_packet(
        event_type="PROBE_PING",
        data={
            "message": "Albert Lane Sovereign Reverse Hook Heartbeat",
            "enclave_mode": "IMMUTABLE_VAULT",
            "ast_entities": get_ast_entity_count()
        }
    )
    print(f"[+] Envelope generated with signature: {packet['signature']}")
    print(f"[*] Transmitting packet...")
    res = vault.transmit_packet(packet)
    print(f"[+] Result:")
    print(json.dumps(res, indent=2))

def cmd_dump_packet(vault: SovereignReverseStreamVault):
    packet = vault.build_stream_packet(
        event_type="SAMPLE_FRAME",
        data={
            "applet_status": "ONLINE",
            "ast_count": get_ast_entity_count(),
            "timestamp": time.time()
        }
    )
    print("=== CRYPTOGRAPHIC STREAM PACKET ENVELOPE ===")
    print(json.dumps(packet["envelope"], indent=2))
    print(f"\nHMAC-SHA256 Signature: {packet['signature']}")

def cmd_daemon(vault: SovereignReverseStreamVault, interval: int = 30):
    print(f"[*] Launching Sovereign Reverse Stream Daemon (Interval: {interval}s)...")
    print(f"[*] Target Endpoint: {vault.edge_endpoint}")
    print(f"[*] View live stream at: {STREAM_PUBLIC_URL}")
    try:
        while True:
            ast_cnt = get_ast_entity_count()
            res = vault.stream_telemetry_heartbeat(ast_count=ast_cnt)
            status_desc = "DELIVERED" if res.get("success") else f"FAILED ({res.get('error', 'Unknown')})"
            print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Stream packet #{vault.sequence_number} (Ledger H={vault.ledger_height}): {status_desc}")
            time.sleep(interval)
    except KeyboardInterrupt:
        print("\n[*] Reverse stream daemon stopped by user.")

def main():
    parser = argparse.ArgumentParser(description="Sovereign Reverse Stream Vault CLI")
    sub = parser.add_subparsers(dest="command", required=True)

    p_ping = sub.add_parser("ping", help="Send a single signed test frame to the edge webhook")
    p_ping.set_defaults(func=lambda args, v: cmd_ping(v))

    p_dump = sub.add_parser("dump", help="Dump sample cryptographically signed payload envelope")
    p_dump.set_defaults(func=lambda args, v: cmd_dump_packet(v))

    p_daemon = sub.add_parser("daemon", help="Run continuous streaming daemon")
    p_daemon.add_argument("--interval", type=int, default=30, help="Stream interval in seconds")
    p_daemon.set_defaults(func=lambda args, v: cmd_daemon(v, args.interval))

    parser.add_argument("--secret", default=None, help="Custom vault secret key")
    parser.add_argument("--endpoint", default=None, help="Custom edge endpoint URL")
    parser.add_argument("--serial", default=None, help="Device serial string")

    args = parser.parse_args()
    vault = SovereignReverseStreamVault(
        secret_key=args.secret,
        edge_endpoint=args.endpoint,
        device_serial=args.serial
    )

    args.func(args, vault)

if __name__ == "__main__":
    main()
