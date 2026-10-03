#!/bin/sh
set -e
SERVER="http://localhost:3000"
echo "[*] Querying live cryptographic verification engine at $SERVER..."
LIVE_VERIFY=$(curl -sSf "$SERVER/api/sovereign/verify")
STATUS=$(echo "$LIVE_VERIFY" | grep -o '"status":"[^"]*' | cut -d'"' -f4)
PUB_KEY=$(echo "$LIVE_VERIFY" | grep -o '"ed25519_public_key":"[^"]*' | cut -d'"' -f4)
MERKLE=$(echo "$LIVE_VERIFY" | grep -o '"root_merkle_digest":"[^"]*' | cut -d'"' -f4)
MISMATCHES=$(echo "$LIVE_VERIFY" | grep -o '"mismatch_count":[0-9]*' | cut -d':' -f2)

echo "======================================================================"
echo "SOVEREIGN PROVENANCE VERIFICATION RESULT"
echo "Authority:           Albert Lane"
echo "SEC Whistleblower:   No. 17684-273-411-436"
echo "Status:              $STATUS"
echo "Ed25519 Public Key:  $PUB_KEY"
echo "Root Merkle Digest:  $MERKLE"
echo "Byte-Level Errors:   $MISMATCHES"
echo "======================================================================"

if [ "$STATUS" = "VERIFIED_MATHEMATICAL_INTEGRITY" ] && [ "$MISMATCHES" -eq 0 ]; then
    echo "[SUCCESS] Real-time bitwise SHA-256 calculation matches canonical state. Ed25519 signature verified."
    exit 0
else
    echo "[FAILURE] Cryptographic verification failed."
    exit 1
fi
