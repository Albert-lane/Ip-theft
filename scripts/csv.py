#!/usr/bin/env python3
"""
==============================================================================
ALBERT LANE PROPRIETARY SOFTWARE LICENSE & RECURSIVE CSV/JSON ENGINE (SCRIPTS WRAPPER)
Script: scripts/csv.py
==============================================================================
"""
import sys
import os

WORKSPACE_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if WORKSPACE_ROOT not in sys.path:
    sys.path.insert(0, WORKSPACE_ROOT)

import csv as _root_csv

# Re-export everything from root csv.py
for _k in dir(_root_csv):
    if not _k.startswith("__"):
        globals()[_k] = getattr(_root_csv, _k)

if __name__ == "__main__":
    _root_csv.main()
