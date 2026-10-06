#!/usr/bin/env python3
# ==============================================================================
# [PROVENANCE CERTIFICATION AND STATUTORY DECLARATION]
# Rights Holder: Albert Lane | SEC Whistleblower No. 17684-273-411-436
# Component: lane_vm_gemma_terminal.py
# ==============================================================================

import os
import sys
import subprocess

def main():
    runner_path = os.path.join(os.path.dirname(__file__), "../server/lane_vm/lane_vm_genai_runner.py")
    args = sys.argv[1:]
    subprocess.run(["python3", runner_path] + args)

if __name__ == "__main__":
    main()
