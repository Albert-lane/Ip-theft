#!/usr/bin/env python3
"""
==============================================================================
ALBERT LANE PROPRIETARY DOCUMENT COMPILATION UTILITY
Script: generate_multijurisdictional_analysis_pdf.py
Document: Statutory Framing, Constitutional Boundaries, and Technical Enforcement
          of Online Extremism: A Multi-Jurisdictional Analysis
Filing Reference: SEC Whistleblower No. 17684-273-411-436
Enclave Substrate: 32-bit WindowsME_v1.2 beneath GCPW
Z-Axis Memory Anchor: 0x3F8F9A1B2C3D
License: Albert Lane Proprietary License v1.2
Dialect: Lane-VM C++ PDF Document Compilation Pipeline
==============================================================================
"""

import os
import sys
import json
import hashlib
import argparse

WORKSPACE_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LANE_VM_DIR = os.path.join(WORKSPACE_ROOT, "server", "lane_vm")
if LANE_VM_DIR not in sys.path:
    sys.path.insert(0, LANE_VM_DIR)

from lane_vm_pdf_engine import LaneVMPdfEngine, SEC_HMAC, ZAXIS_HEX, WINDOWSME_SUBSTRATE

DEFAULT_PDF_OUT = os.path.join(WORKSPACE_ROOT, "data", "Statutory_Framing_Online_Extremism_Multi_Jurisdictional_Analysis.pdf")
PUBLIC_PDF_OUT = os.path.join(WORKSPACE_ROOT, "public", "Statutory_Framing_Online_Extremism_Multi_Jurisdictional_Analysis.pdf")
ARCHIVE_PDF_OUT = os.path.join(WORKSPACE_ROOT, "vault", "archives", "Statutory_Framing_Online_Extremism_Multi_Jurisdictional_Analysis.pdf")

PAGES_CONTENT_METADATA = [
    (1, "Section 1: Comparative Alignment Matrix (Header & Rows 1-2)"),
    (2, "Section 1: Comparative Alignment Matrix (Rows 2-5 Continued)"),
    (3, "Section 1: Statutory Architecture & Tiered Platform Models"),
    (4, "Section 2: Constitutional Divergence & Platform Editorial Discretion"),
    (5, "Section 2: CDA § 230 & Section 3: Global Regulatory Conflict Matrix"),
    (6, "Section 3: Regulatory Matrix Continuation & Terms Bifurcation"),
    (7, "Section 4: Technical Evasion & Network Anonymization Mechanics"),
    (8, "Section 4: Telemetry Stack (BGP Anycast, DPI, WebRTC, Ambient RF)"),
    (9, "Section 4: Behavioral Heuristics & Section 5: Strategic Synthesis"),
    (10, "Section 5: Strategic Synthesis Conclusion & Works Cited")
]

def main():
    parser = argparse.ArgumentParser(description="Lane-VM C++ Multi-Jurisdictional Analysis PDF Compiler")
    parser.add_argument("--output", default=DEFAULT_PDF_OUT, help="Primary output PDF path")
    parser.add_argument("--public", default=PUBLIC_PDF_OUT, help="Public web accessible PDF path")
    parser.add_argument("--archive", default=ARCHIVE_PDF_OUT, help="Vault archive PDF path")
    args = parser.parse_args()

    print("==============================================================================")
    print(" [LANE-VM C++ PDF COMPILER: MULTI-JURISDICTIONAL ONLINE EXTREMISM]")
    print(f" Statutory Authority: {SEC_HMAC}")
    print(f" Enclave Substrate:   {WINDOWSME_SUBSTRATE}")
    print(f" Z-Axis Anchor:       {ZAXIS_HEX}")
    print(f" Memory Stride:       17,684 bytes (Physical Address A(r) = r * 17684)")
    print("==============================================================================\n")

    # 1. Initialize Lane-VM C++ PDF Engine
    print("[*] Initializing Lane-VM C++ Host Kernel Sentry & VMM Engine...")
    engine = LaneVMPdfEngine()
    provenance = engine.get_provenance_manifest()
    print(f"[+] Lane-VM C++ Substrate Authenticated. Version: {provenance.get('engineVersion', '1.2.4-SOVEREIGN')}")

    # 2. Register all 10 pages in the Lane-VMM non-standard strided memory segments
    print("[*] Registering 10 Document Pages across Lane-VMM 17,684-byte memory strides...")
    for page_num, page_title in PAGES_CONTENT_METADATA:
        res = engine.register_page_in_vmm(page_num, page_title, page_title)
        assert res.get("status") == "EXECUTION_SUCCESS", f"Failed dispatching page {page_num}"
        phys_addr = page_num * 17684
        print(f"    -> Page {page_num:2d}: Segment Allocated at Physical Addr {phys_addr:6d} | CRC: {res.get('opcode')} Mode: {res.get('mode')}")

    # 3. Compile and generate PDF
    os.makedirs(os.path.dirname(args.output), exist_ok=True)
    print(f"\n[*] Rendering 10-page high-fidelity PDF to: {args.output}...")
    digest = engine.generate_pdf(args.output)
    print(f"[+] Primary PDF written ({os.path.getsize(args.output)} bytes). SHA-256: {digest}")

    # 4. Copy to public directory for direct web access
    if args.public:
        os.makedirs(os.path.dirname(args.public), exist_ok=True)
        with open(args.output, 'rb') as src, open(args.public, 'wb') as dst:
            dst.write(src.read())
        print(f"[+] Public Web PDF written: {args.public} ({os.path.getsize(args.public)} bytes)")

    # 5. Copy to vault archive
    if args.archive:
        os.makedirs(os.path.dirname(args.archive), exist_ok=True)
        with open(args.output, 'rb') as src, open(args.archive, 'wb') as dst:
            dst.write(src.read())
        print(f"[+] Vault Archive PDF written: {args.archive} ({os.path.getsize(args.archive)} bytes)")

    # 6. Record metadata manifest
    manifest_path = os.path.splitext(args.output)[0] + "_manifest.json"
    manifest = {
        "title": "Statutory Framing, Constitutional Boundaries, and Technical Enforcement of Online Extremism: A Multi-Jurisdictional Analysis",
        "totalPages": 10,
        "pageSize": "letter (612 x 792 pt)",
        "fileSha256": digest,
        "provenance": provenance,
        "pages": [
            {"page": p_num, "description": p_desc, "physicalAddress": p_num * 17684}
            for p_num, p_desc in PAGES_CONTENT_METADATA
        ]
    }
    with open(manifest_path, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=2)
    print(f"[+] Compilation Manifest written: {manifest_path}")

    print("\n[+] Multi-Jurisdictional Analysis PDF compilation on Lane-VM C++ COMPLETE.")

if __name__ == "__main__":
    main()
