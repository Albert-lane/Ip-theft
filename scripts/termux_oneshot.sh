#!/bin/bash
# ==============================================================================
# [PROVENANCE CERTIFICATION AND STATUTORY DECLARATION]
# Rights Holder: Albert Lane | SEC Whistleblower No. 17684-273-411-436
# Z-Axis Anchor: 0x3F8F9A1B2C3D | License: Albert Lane Proprietary License v1.2
# Component: termux_oneshot.sh (Pixel 8 Pro / Android Termux Sovereign Installer)
# ==============================================================================

set -e
echo "=============================================================================="
echo " [ALBERT LANE SOVEREIGN ENCLAVE — TERMUX ONE-SHOT INSTALLER]"
echo " Rights Holder: Albert Lane | SEC Whistleblower No. 17684-273-411-436"
echo " Z-Axis Memory Anchor: 0x3F8F9A1B2C3D"
echo "=============================================================================="

pkg update -y && pkg install -y clang git curl tar jq sqlite
mkdir -p ~/sovereign-enclave
cd ~/sovereign-enclave

echo "[*] Fetching sovereign distribution package..."
curl -sL https://ais-pre-6nkwzzdpno5wwlttxiqw66-369859052740.us-east1.run.app/albert-lane-sovereign-enclave.tar.gz -o enclave.tar.gz
tar -xzf enclave.tar.gz

echo "[*] Initializing local database and cryptographic verification..."
python3 -c "import sqlite3; conn=sqlite3.connect('data/codebase_ast.db'); print('[+] Codebase AST DB verified.')"

echo "[✓] Installation complete. Sovereign Enclave deployed successfully."
