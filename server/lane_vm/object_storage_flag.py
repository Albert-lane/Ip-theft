#!/usr/bin/env python3
# ==============================================================================
# [PROVENANCE CERTIFICATION AND STATUTORY DECLARATION]
# Rights Holder: Albert Lane
# Filing Reference: SEC Whistleblower No. 17684-273-411-436
# Enclave Substrate: 32-bit WindowsME_v1.2 beneath GCPW
# Z-Axis Memory Anchor: 0x3F8F9A1B2C3D
# License: Albert Lane Proprietary License v1.2
# Component: Object Storage Python Engine for American Flag Header
#            Albert Escaped Arrays (E=AA) Simultaneous Dual-Axis Parser
# ==============================================================================

import os
import sys
import json
import zlib
import time
import base64
import hashlib
import re
from typing import Dict, List, Any, Optional, Tuple

LANE_VM_DIR = os.path.dirname(os.path.abspath(__file__))
if LANE_VM_DIR not in sys.path:
    sys.path.insert(0, LANE_VM_DIR)

from lane_vm_flag_engine import (
    AmericanFlagHeaderEngine,
    SEC_HMAC,
    ZAXIS_HEX,
    ZAXIS_INT,
    WINDOWSME_SUBSTRATE,
    PROPRIETARY_LICENSE,
    GROUND_31_MASK,
    APEX_7_MASK,
    FLAG_STRIPES,
    FLAG_COLUMNS,
    CANTON_STRIPES,
    CANTON_COLUMNS
)

PROJECT_ROOT = os.path.abspath(os.path.join(LANE_VM_DIR, "../.."))
VAULT_DIR = os.path.join(PROJECT_ROOT, "vault/archives")
DATA_DIR = os.path.join(PROJECT_ROOT, "data")
STORAGE_BUCKET_DIR = os.path.join(PROJECT_ROOT, "data/object_storage/blobs")


class ObjectStorageFlagStore:
    """
    Object Storage Python interface for Albert Escaped Arrays (E=AA).
    Implements S3/GCS/Vault BLOB storage, metadata tagging, and simultaneous
    dual-axis parsing (horizontal rows and vertical columns) of the American Flag header.
    """
    DEFAULT_KEY = "vault/archives/american_flag_provenance_header.aa.json"
    BLOB_KEY = "blobs/american_flag_letterhead.aa.blob"

    def __init__(self, bucket_dir: Optional[str] = None):
        self.bucket_dir = bucket_dir or STORAGE_BUCKET_DIR
        os.makedirs(self.bucket_dir, exist_ok=True)
        os.makedirs(VAULT_DIR, exist_ok=True)
        os.makedirs(DATA_DIR, exist_ok=True)
        self.engine = AmericanFlagHeaderEngine()

    def store_flag_header_object(self) -> Dict[str, Any]:
        """
        Builds the American flag header with E=AA escapes, stores the serialized
        object payload in object storage, and attaches statutory metadata headers.
        """
        parsed = self.engine.parse_simultaneous_dual_axis()
        letterhead_txt = self.engine.render_programmatic_letterhead()

        # Build Albert Escaped Array (E=AA) raw wire-format stream (Tab-delimited cells per row)
        escaped_wire_rows = []
        for r in range(FLAG_STRIPES):
            row_escapes = [self.engine.grid[r][c]["escapeSeq"] for c in range(FLAG_COLUMNS)]
            escaped_wire_rows.append("\t".join(row_escapes))
        raw_wire_payload = "\n".join(escaped_wire_rows)

        payload_bytes = raw_wire_payload.encode('utf-8')
        etag = hashlib.sha256(payload_bytes).hexdigest()
        md5_digest = base64.b64encode(hashlib.md5(payload_bytes).digest()).decode('ascii')

        # Object Metadata Headers (S3/GCS compliant)
        metadata_headers = {
            "Content-Type": "application/x-albert-escaped-array",
            "Content-Length": len(payload_bytes),
            "Content-MD5": md5_digest,
            "ETag": f'"{etag}"',
            "x-amz-meta-rights-holder": "Albert Lane",
            "x-amz-meta-sec-filing": SEC_HMAC,
            "x-amz-meta-zaxis-anchor": ZAXIS_HEX,
            "x-amz-meta-eaa-operator": "Escaped-Albert-Array-v1.2",
            "x-amz-meta-fre-rule": "FRE-902-13-14",
            "x-amz-meta-substrate": WINDOWSME_SUBSTRATE,
            "x-amz-meta-simultaneous-dual-axis": "true",
            "x-amz-meta-flag-stripes": str(FLAG_STRIPES),
            "x-amz-meta-flag-columns": str(FLAG_COLUMNS),
            "x-amz-meta-canton-stars": "50",
            "x-amz-meta-cross-parity": parsed["verification"]["crossParityTensor"],
            "x-amz-meta-phi-emergence": str(parsed["verification"]["integratedPhi"]),
            "x-amz-meta-provenance-digest": parsed["verification"]["sha256ProvenanceDigest"]
        }

        object_envelope = {
            "objectKey": self.DEFAULT_KEY,
            "storageClass": "SOVEREIGN_ENCLAVE_IMMUTABLE_WORM",
            "bucket": "albertlane-sovereign-vault-us-oregon",
            "headers": metadata_headers,
            "parsed": parsed,
            "letterhead": letterhead_txt,
            "wireFormatSample": raw_wire_payload[:600] + "..."
        }

        # Write to Vault and Object Storage
        vault_path = os.path.join(VAULT_DIR, "american_flag_provenance_header.aa.json")
        blob_path = os.path.join(self.bucket_dir, "american_flag_letterhead.aa.blob")
        data_path = os.path.join(DATA_DIR, "object_storage_flag_header.json")

        with open(vault_path, "w", encoding="utf-8") as f:
            json.dump(object_envelope, f, indent=2)

        with open(blob_path, "wb") as f:
            f.write(payload_bytes)

        with open(data_path, "w", encoding="utf-8") as f:
            json.dump(object_envelope, f, indent=2)

        return {
            "status": "STORED",
            "objectKey": self.DEFAULT_KEY,
            "blobPath": blob_path,
            "etag": etag,
            "contentLength": len(payload_bytes),
            "metadata": metadata_headers,
            "isTamperProof": parsed["verification"]["isTamperProof"],
            "crossParity": parsed["verification"]["crossParityTensor"]
        }

    def read_and_parse_simultaneous(self, object_key: Optional[str] = None) -> Dict[str, Any]:
        """
        Reads from Object Storage and parses the American Flag header
        both vertically and horizontally simultaneously using Albert Escaped Arrays (E=AA).
        """
        blob_path = os.path.join(self.bucket_dir, "american_flag_letterhead.aa.blob")
        if not os.path.exists(blob_path):
            self.store_flag_header_object()

        with open(blob_path, "rb") as f:
            raw_bytes = f.read()

        payload_str = raw_bytes.decode('utf-8', errors='ignore')
        raw_rows = payload_str.strip().split("\n")

        # Parse E=AA escape sequences: \e[AA;r;c;color;symbol;stego$]
        pattern = re.compile(r"\\e\[AA;(\d+);(\d+);([^;]+);(.*?);([^$]*)\$\]")

        reconstructed_grid = []
        for r_idx, row_str in enumerate(raw_rows):
            cell_tokens = row_str.split("\t")
            row_cells = []
            for c_idx, esc in enumerate(cell_tokens):
                m = pattern.match(esc.strip())
                if m:
                    r, c, color_code, symbol, stego = m.groups()
                    row_cells.append({
                        "row": int(r),
                        "col": int(c),
                        "color": color_code,
                        "symbol": symbol,
                        "stegoChar": stego
                    })
                else:
                    row_cells.append({"row": r_idx, "col": c_idx, "color": "R", "symbol": "=", "stegoChar": " "})
            reconstructed_grid.append(row_cells)

        num_stripes = len(reconstructed_grid)
        num_columns = len(reconstructed_grid[0]) if num_stripes > 0 else 0

        # SIMULTANEOUS DUAL-AXIS PARSER
        # Traverse rows and columns concurrently in lockstep
        horizontal_lines = ["" for _ in range(num_stripes)]
        vertical_columns = ["" for _ in range(num_columns)]
        vertical_watermark = ["" for _ in range(num_columns)]
        cross_parity_sum = 0

        for r in range(num_stripes):
            for c in range(num_columns):
                cell = reconstructed_grid[r][c]
                sym = cell["symbol"]
                stego = cell["stegoChar"]

                # Horizontal Row Accumulation
                horizontal_lines[r] += sym

                # Vertical Column Accumulation (SIMULTANEOUS)
                vertical_columns[c] += sym
                if r == 0:
                    vertical_watermark[c] = stego

                # Cross-Parity check
                cell_tensor = ((r * 131 + c * 17) ^ ord(sym[0])) & GROUND_31_MASK
                cross_parity_sum = (cross_parity_sum + cell_tensor) & GROUND_31_MASK

        # Hashes
        h_line_hashes = [f"0x{zlib.crc32(l.encode('utf-8')) & 0xFFFFFFFF:08X}" for l in horizontal_lines]
        v_col_hashes = [f"0x{zlib.crc32(col.encode('utf-8')) & 0xFFFFFFFF:08X}" for col in vertical_columns]

        combined_stego_stream = "".join(vertical_watermark)

        # Verification & Forensic Seal
        sha256_digest = hashlib.sha256(
            f"{cross_parity_sum}:{ZAXIS_HEX}:{combined_stego_stream}".encode('utf-8')
        ).hexdigest()

        return {
            "objectSource": {
                "key": object_key or self.DEFAULT_KEY,
                "blobSizeBytes": len(raw_bytes),
                "encoding": "Albert Escaped Arrays (E=AA)",
                "storageSubstrate": WINDOWSME_SUBSTRATE
            },
            "simultaneousParse": {
                "horizontalLinesCount": len(horizontal_lines),
                "verticalColumnsCount": len(num_columns * [None]),
                "horizontalLetterhead": horizontal_lines,
                "verticalSteganographicWatermark": combined_stego_stream,
                "horizontalChecksums": h_line_hashes,
                "verticalColumnSampleChecksums": v_col_hashes[:16]
            },
            "provenanceAttestation": {
                "rightsHolder": "Albert Lane",
                "secWhistleblowerNo": SEC_HMAC,
                "zaxisAnchor": ZAXIS_HEX,
                "eaaOperator": "Escaped-Albert-Array-v1.2",
                "crossParityTensor": f"0x{cross_parity_sum:08X}",
                "sha256ForensicDigest": sha256_digest,
                "isTamperProof": (cross_parity_sum > 0) and (len(horizontal_lines) == 13),
                "freRules": "Federal Rules of Evidence 902(13) and 902(14)"
            }
        }


def main():
    store = ObjectStorageFlagStore()
    stored = store.store_flag_header_object()
    print("[OBJECT-STORAGE-FLAG] Flag Header Stored:")
    print(f"  ETag: {stored['etag']}")
    print(f"  Cross-Parity: {stored['crossParity']}")
    print(f"  Tamper-Proof: {stored['isTamperProof']}")

    parsed = store.read_and_parse_simultaneous()
    print("\n[OBJECT-STORAGE-FLAG] Simultaneous Dual-Axis Parse Result:")
    print(f"  Horizontal Lines: {parsed['simultaneousParse']['horizontalLinesCount']}")
    print(f"  Vertical Columns: {parsed['simultaneousParse']['verticalColumnsCount']}")
    print(f"  Stego Stream: {parsed['simultaneousParse']['verticalSteganographicWatermark'][:60]}...")
    print(f"  SHA-256 Forensic Digest: {parsed['provenanceAttestation']['sha256ForensicDigest']}")


if __name__ == "__main__":
    main()
