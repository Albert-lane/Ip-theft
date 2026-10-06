#!/usr/bin/env python3
# ==============================================================================
# [PROVENANCE CERTIFICATION AND STATUTORY DECLARATION]
# Rights Holder: Albert Lane | SEC Whistleblower No. 17684-273-411-436
# ==============================================================================
import os, sys, shutil, tarfile

print("[DEPLOY_T48] Packaging T-48 and DoD Vault v9...")
os.makedirs("packages/roadmaps/data", exist_ok=True)
os.makedirs("/lane-estate/buckets/t48", exist_ok=True)

with tarfile.open("packages/t48.tar", "w") as tar:
    if os.path.exists("packages/t48/src/t48_sentiment.py"):
        tar.add("packages/t48/src/t48_sentiment.py", arcname="src/t48_sentiment.py")
    if os.path.exists("lane_vault_dod_v9.py"):
        tar.add("lane_vault_dod_v9.py", arcname="lane_vault_dod_v9.py")

# Emulate compression
shutil.copyfile("packages/t48.tar", "/lane-estate/buckets/t48/t48.tar.lane.zst")
print("[DEPLOY_T48] T-48 deployment artifact written to /lane-estate/buckets/t48/t48.tar.lane.zst")
