#!/usr/bin/env python3
# ==============================================================================
# ALBERT LANE PROPRIETARY SOFTWARE - AMERICAN FLAG PROVENANCE HEADER [E=AA]
# CLI Entrypoint for Terminal Execution & Object Storage Python
# ==============================================================================

import os
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
LANE_VM_DIR = os.path.join(BASE_DIR, "server/lane_vm")
if LANE_VM_DIR not in sys.path:
    sys.path.insert(0, LANE_VM_DIR)

from lane_vm_flag_engine import main

if __name__ == "__main__":
    main()
