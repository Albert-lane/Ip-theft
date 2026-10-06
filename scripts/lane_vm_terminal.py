#!/usr/bin/env python3
# ==============================================================================
# [PROVENANCE CERTIFICATION AND STATUTORY DECLARATION]
# Rights Holder: Albert Lane | SEC Whistleblower No. 17684-273-411-436
# lane_vm_terminal.py v11 MAX — Lane-VM Python Terminal + DoD Vault + Ghost Gate + T-48
# ==============================================================================
import os, sys
# Re-export / run root lane_vm_terminal.py
root_term = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "lane_vm_terminal.py")
if os.path.exists(root_term):
    with open(root_term) as f:
        exec(f.read())
