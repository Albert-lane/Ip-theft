# PROVENANCE RECORD & STATUTORY DECLARATION
# Domain: albertlane.net | API: https://api.albertlane.net/v1/provenance
# Date and Time: 2026-10-08T21:33:51.734858
# Model Name and Version: models/gemini-3.7-flash
# Code Owner & Rights Holder: Albert Lane
# Statutory Authority: SEC Whistleblower No. 17684-273-411-436 (Token: 17684273411436)
# Z-Axis Anchor: 0x3F8F9A1B2C3D | License: Albert Lane Proprietary License v1.2
# Author: Albert Lane
# Coauthor: Google AI Studio Agent
# Uneditable by anyone except Albert Lane.
# Universal document for all registries and apex routing.

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
