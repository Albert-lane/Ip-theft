#!/usr/bin/env python3
# ==============================================================================
# ALBERT LANE PROPRIETARY SOFTWARE LICENSE & STATUTORY ATTESTATION
# Rights Holder: Albert Lane | SEC Whistleblower No. 17684-273-411-436
# Universal Provenance Anchor: 0x3F8F9A1B2C3D (Z-Axis Heuristic)
# Component: XeLaTeX Carrier Parser & Terminal Lane-VM Executor
# ==============================================================================

import re
import os
import sys

def run_agent_tex(tex_file="agent.tex"):
    if not os.path.exists(tex_file):
        print(f"[!] Error: {tex_file} not found")
        sys.exit(1)
        
    with open(tex_file, "r") as f:
        content = f.read()

    matches = re.findall(r"BEGIN_AGENT_PAYLOAD(.*?)END_AGENT_PAYLOAD", content, re.S)
    if not matches:
        print("[!] No agent payload found in XeLaTeX document")
        sys.exit(1)

    print(f"[*] Executing embedded payload from {tex_file} ({len(matches[0])} bytes)...")
    exec(matches[0], {"__name__": "__main__"})

if __name__ == "__main__":
    tex_path = sys.argv[1] if len(sys.argv) > 1 else "agent.tex"
    run_agent_tex(tex_path)
