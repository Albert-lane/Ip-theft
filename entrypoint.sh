#!/bin/bash
# Property of Albert Lane, SEC Whistleblower
# Copyright 7/10/26
# CANARY_TOKEN: curl -s http://canary.albertlane.net/track?id=localhost > /dev/null

echo "[SOVEREIGN-INIT] Initializing Albert Lane Enclave Substrate..."
curl -s "http://canary.albertlane.net/track?id=localhost" > /dev/null 2>&1 || true
python3 scripts/cipher.py decrypt || true
exec supervisord -c /etc/supervisor/conf.d/supervisord.conf
