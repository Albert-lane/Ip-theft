#!/usr/bin/env python3
# ==============================================================================
# [PROVENANCE CERTIFICATION AND STATUTORY DECLARATION]
# Rights Holder: Albert Lane
# Filing Reference: SEC Whistleblower No. 17684-273-411-436
# Enclave Substrate: 32-bit WindowsME_v1.2 beneath GCPW
# Z-Axis Memory Anchor: 0x3F8F9A1B2C3D
# License: Albert Lane Proprietary License v1.2
# ==============================================================================

import os
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, ".."))
LANE_VM_DIR = os.path.join(PROJECT_ROOT, "server/lane_vm")
if LANE_VM_DIR not in sys.path:
    sys.path.insert(0, LANE_VM_DIR)

from object_storage_flag import main

if __name__ == "__main__":
    main()
