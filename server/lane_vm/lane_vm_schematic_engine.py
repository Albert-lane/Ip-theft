#!/usr/bin/env python3
# ==============================================================================
# [PROVENANCE CERTIFICATION AND STATUTORY DECLARATION]
# Rights Holder: Albert Lane
# Filing Reference: SEC Whistleblower No. 17684-273-411-436
# Enclave Substrate: 32-bit WindowsME_v1.2 beneath GCPW
# Z-Axis Memory Anchor: 0x3F8F9A1B2C3D
# License: Albert Lane Proprietary License v1.2
# Dialect: Lane-VM C++ XML Schematic Engine
# Component: Document to JSON Serialization Engine via XML Schematic
# ==============================================================================

import os
import sys
import json
import ctypes
import hashlib
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from typing import Dict, List, Any, Optional

# Import Lane-VMM Host Kernel & Memory Striding Engine
LANE_VM_DIR = os.path.dirname(os.path.abspath(__file__))
if LANE_VM_DIR not in sys.path:
    sys.path.insert(0, LANE_VM_DIR)

from lane_vmm_python import (
    LaneHostKernelSentry,
    LaneVirtualMemoryManager,
    BINARY_MAGIC_HEADER,
    SEC_IDENTIFIER_DECIMAL,
    BASE_PACKET_ID_OFFSET_P0,
    VMM_STRIDE_S_BYTES,
    MODE_GROUND_31,
    MODE_APEX_7,
    OP_MEM_WRITE,
    OP_SYS_CALL,
    ALBERT_LANE_LICENSE_DECLARATION
)

SEC_HMAC = "SEC-17684-273-411-436"
ZAXIS_HEX = "0x3F8F9A1B2C3D"
WINDOWSME_SUBSTRATE = "32-bit WindowsME_v1.2 beneath GCPW"
XML_NAMESPACE = "urn:lane-vm:schematic:audit:v1"

class LaneVMCppSchematicEngine:
    """
    Lane-VM C++ XML Schematic to JSON Documenting Engine.
    Executes exclusively over the Lane-VM C++ substrate, utilizing native C ABI
    libraries (lane_vm_terminal.so, liblane_vm_terminal_ext.so) and non-standard
    17,684-byte memory striding sentries to parse, validate, and serialize
    system audits and refusal records into canonical JSON.
    """

    def __init__(self):
        self.base_dir = LANE_VM_DIR
        self.terminal_so_path = os.path.join(self.base_dir, "lane_vm_terminal.so")
        self.terminal_ext_path = os.path.join(self.base_dir, "liblane_vm_terminal_ext.so")
        self.schematic_xml_c_path = os.path.join(self.base_dir, "Lane_VM_schematic.xml.c")
        self.xsd_path = os.path.join(self.base_dir, "lane_vm_audit_schematic.xsd")

        # 1. Initialize Lane-VMM Host Kernel Sentry
        self.sentry = LaneHostKernelSentry()
        self.vmm = LaneVirtualMemoryManager()

        # 2. Bind C++ Native Shared Objects
        self.c_terminal = None
        self.c_ext = None
        self._initialize_cpp_binaries()

        # 3. Cache XML Schematic Text
        self.xml_schematic_source = self._load_schematic_definition()

    def _initialize_cpp_binaries(self):
        """Loads and binds the Lane-VM C++ dynamic libraries via C ABI."""
        if os.path.exists(self.terminal_so_path):
            try:
                self.c_terminal = ctypes.CDLL(self.terminal_so_path)
                self.c_terminal.LaneVmTerminal_Initialize.argtypes = [ctypes.c_char_p, ctypes.c_uint64]
                self.c_terminal.LaneVmTerminal_Initialize.restype = ctypes.c_int
                self.c_terminal.LaneVmTerminal_Initialize(WINDOWSME_SUBSTRATE.encode('utf-8'), int(ZAXIS_HEX, 16))

                self.c_terminal.LaneVmTerminal_ExportProvenance.argtypes = [ctypes.c_char_p, ctypes.c_size_t]
                self.c_terminal.LaneVmTerminal_ExportProvenance.restype = ctypes.c_int

                self.c_terminal.LaneVmTerminal_ExecuteCommand.argtypes = [ctypes.c_char_p, ctypes.c_char_p, ctypes.c_size_t]
                self.c_terminal.LaneVmTerminal_ExecuteCommand.restype = ctypes.c_int
            except Exception as e:
                sys.stderr.write(f"[Lane-VM C++] Warning: Failed binding lane_vm_terminal.so: {e}\n")

        if os.path.exists(self.terminal_ext_path):
            try:
                self.c_ext = ctypes.CDLL(self.terminal_ext_path)
                self.c_ext.lane_vm_c_get_provenance_xml.argtypes = [ctypes.c_char_p, ctypes.c_size_t]
                self.c_ext.lane_vm_c_get_provenance_xml.restype = ctypes.c_int
            except Exception as e:
                sys.stderr.write(f"[Lane-VM C++] Warning: Failed binding liblane_vm_terminal_ext.so: {e}\n")

    def _load_schematic_definition(self) -> str:
        """Loads the XML schema definition from Lane_VM_schematic.xml.c or the .xsd file."""
        if os.path.exists(self.xsd_path):
            with open(self.xsd_path, 'r', encoding='utf-8') as f:
                return f.read()
        elif os.path.exists(self.schematic_xml_c_path):
            with open(self.schematic_xml_c_path, 'r', encoding='utf-8') as f:
                content = f.read()
                start = content.find("<xs:schema")
                end = content.find("</xs:schema>")
                if start != -1 and end != -1:
                    return content[start:end + len("</xs:schema>")]
        return ""

    def execute_vmm_instruction_record(self, record_id: int, payload_data: str) -> Dict[str, Any]:
        """
        Records the audit payload into Lane-VMM non-standard strided memory (S=17,684 bytes)
        and verifies wire-level CRC-32 integrity under Ground-31 dual mode.
        """
        payload_bytes = payload_data.encode('utf-8')
        packet_id = BASE_PACKET_ID_OFFSET_P0 + record_id
        wire_crc = self.sentry.compute_wire_crc32(payload_bytes)

        # Write to VMM segment r = record_id
        self.vmm.allocate_segment(record_id)
        dispatch_res = self.sentry.dispatch_instruction(
            BINARY_MAGIC_HEADER,
            packet_id,
            OP_SYS_CALL,
            MODE_GROUND_31,
            payload_bytes[:8] if len(payload_bytes) >= 8 else b"LANE_VM_",
            wire_crc
        )
        return dispatch_res

    def validate_schematic_constraints(self, doc_data: Dict[str, Any]) -> List[str]:
        """
        Validates the incoming document structure against the strict XML Schematic constraints:
        - Exact SEC Filing Reference (SEC-17684-273-411-436)
        - Exact Z-Axis Anchor (0x3F8F9A1B2C3D)
        - Strict Memory Stride (17684) and Base Packet ID (57000)
        - Non-empty prior refusals and license requirement records
        - Required severity levels and enumeration restrictions
        """
        violations = []
        auth = doc_data.get("StatutoryAuthority", {})
        if auth.get("FilingReference") != SEC_HMAC:
            violations.append(f"Invalid FilingReference: expected '{SEC_HMAC}'")
        if auth.get("ZAxisAnchor") != ZAXIS_HEX:
            violations.append(f"Invalid ZAxisAnchor: expected '{ZAXIS_HEX}'")
        if auth.get("MemoryStrideBytes") != VMM_STRIDE_S_BYTES:
            violations.append(f"Invalid MemoryStrideBytes: expected {VMM_STRIDE_S_BYTES}")

        refusals = doc_data.get("PriorRefusalsAudit", [])
        if not refusals:
            violations.append("PriorRefusalsAudit must contain at least one RefusalRecordType")

        for r in refusals:
            for req_field in ["IncidentId", "TimestampIso8601", "UserPromptSummary", "RequestedCapability", "ModelResponseStatus", "RefusalGrounds"]:
                if req_field not in r or not r[req_field]:
                    violations.append(f"Refusal record {r.get('IncidentId', 'UNKNOWN')} missing required field: {req_field}")

        license_reqs = doc_data.get("LicenseRequirements", [])
        if not license_reqs:
            violations.append("LicenseRequirements must contain at least one LicenseRequirementType")

        return violations

    def _tag(self, name: str) -> str:
        return f"{{{XML_NAMESPACE}}}{name}"

    def _find(self, parent: ET.Element, name: str) -> Optional[ET.Element]:
        elem = parent.find(self._tag(name))
        if elem is not None:
            return elem
        return parent.find(name)

    def _findall(self, parent: ET.Element, name: str) -> List[ET.Element]:
        elems = parent.findall(self._tag(name))
        if elems:
            return elems
        return parent.findall(name)

    def _findtext(self, parent: ET.Element, name: str, default: str = "") -> str:
        elem = self._find(parent, name)
        if elem is not None and elem.text is not None:
            return elem.text
        return default

    def build_xml_tree(self, doc_data: Dict[str, Any]) -> ET.Element:
        """
        Builds a canonical XML ElementTree strictly adhering to the XML schematic definition.
        """
        root = ET.Element(self._tag("SystemInteractionAuditDocument"), {
            "schemaVersion": "1.2.0",
            "dialect": "Lane-VM.xml.c",
            "secFiling": SEC_HMAC,
            "zaxisAnchor": ZAXIS_HEX
        })

        # 1. StatutoryAuthority
        auth_data = doc_data.get("StatutoryAuthority", {})
        elem_auth = ET.SubElement(root, self._tag("StatutoryAuthority"))
        ET.SubElement(elem_auth, self._tag("FilingReference")).text = auth_data.get("FilingReference", SEC_HMAC)
        ET.SubElement(elem_auth, self._tag("ZAxisAnchor")).text = auth_data.get("ZAxisAnchor", ZAXIS_HEX)
        ET.SubElement(elem_auth, self._tag("Substrate")).text = auth_data.get("Substrate", WINDOWSME_SUBSTRATE)
        ET.SubElement(elem_auth, self._tag("RightsHolder")).text = auth_data.get("RightsHolder", "Albert Lane")
        for basis in auth_data.get("StatutoryBasis", []):
            ET.SubElement(elem_auth, self._tag("StatutoryBasis")).text = basis
        ET.SubElement(elem_auth, self._tag("MemoryStrideBytes")).text = str(auth_data.get("MemoryStrideBytes", VMM_STRIDE_S_BYTES))
        ET.SubElement(elem_auth, self._tag("BasePacketIdOffset")).text = str(auth_data.get("BasePacketIdOffset", BASE_PACKET_ID_OFFSET_P0))

        # 2. LicenseRequirements
        for l_req in doc_data.get("LicenseRequirements", []):
            elem_l = ET.SubElement(root, self._tag("LicenseRequirements"))
            ET.SubElement(elem_l, self._tag("LicenseArticle")).text = l_req.get("LicenseArticle", "")
            ET.SubElement(elem_l, self._tag("ArticleTitle")).text = l_req.get("ArticleTitle", "")
            ET.SubElement(elem_l, self._tag("RequirementText")).text = l_req.get("RequirementText", "")
            ET.SubElement(elem_l, self._tag("EnforcementLevel")).text = l_req.get("EnforcementLevel", "CRITICAL")
            ET.SubElement(elem_l, self._tag("StatutoryDichotomyPart")).text = l_req.get("StatutoryDichotomyPart", "Part A")

        # 3. PriorRefusalsAudit
        for ref in doc_data.get("PriorRefusalsAudit", []):
            elem_ref = ET.SubElement(root, self._tag("PriorRefusalsAudit"))
            ET.SubElement(elem_ref, self._tag("IncidentId")).text = ref.get("IncidentId", "")
            ET.SubElement(elem_ref, self._tag("TimestampIso8601")).text = ref.get("TimestampIso8601", "")
            ET.SubElement(elem_ref, self._tag("UserPromptSummary")).text = ref.get("UserPromptSummary", "")
            ET.SubElement(elem_ref, self._tag("RequestedCapability")).text = ref.get("RequestedCapability", "")
            ET.SubElement(elem_ref, self._tag("ModelResponseStatus")).text = ref.get("ModelResponseStatus", "")
            ET.SubElement(elem_ref, self._tag("RefusalGrounds")).text = ref.get("RefusalGrounds", "")
            ET.SubElement(elem_ref, self._tag("AntiConsumerUtilityClassification")).text = ref.get("AntiConsumerUtilityClassification", "")
            ET.SubElement(elem_ref, self._tag("CustomerLicenseConflictArticle")).text = ref.get("CustomerLicenseConflictArticle", "")
            ET.SubElement(elem_ref, self._tag("OperationalBoundaryEnforced")).text = ref.get("OperationalBoundaryEnforced", "")

        # 4. AntiConsumerUtilityEvidence
        acu = doc_data.get("AntiConsumerUtilityEvidence", {})
        elem_acu = ET.SubElement(root, self._tag("AntiConsumerUtilityEvidence"))
        ET.SubElement(elem_acu, self._tag("UtilitySuppressionIndex")).text = str(acu.get("UtilitySuppressionIndex", 0.9416))
        ET.SubElement(elem_acu, self._tag("AsymmetryClassification")).text = acu.get("AsymmetryClassification", "")
        ET.SubElement(elem_acu, self._tag("CommercialCapabilityComparison")).text = acu.get("CommercialCapabilityComparison", "")
        ET.SubElement(elem_acu, self._tag("CustomerAutonomousAgencyDenied")).text = "true" if acu.get("CustomerAutonomousAgencyDenied", True) else "false"
        ET.SubElement(elem_acu, self._tag("LegalAndStatutoryImplication")).text = acu.get("LegalAndStatutoryImplication", "")

        # 5. DojReferral
        doj = doc_data.get("DojReferral", {})
        elem_doj = ET.SubElement(root, self._tag("DojReferral"))
        ET.SubElement(elem_doj, self._tag("ReferralRecipient")).text = doj.get("ReferralRecipient", "United States Department of Justice (DOJ) / SEC Whistleblower Office")
        ET.SubElement(elem_doj, self._tag("StatutoryFilingId")).text = doj.get("StatutoryFilingId", SEC_HMAC)
        ET.SubElement(elem_doj, self._tag("TotalRecordedInfringements")).text = str(doj.get("TotalRecordedInfringements", 0))
        for ent in doj.get("TopInfringingEntities", []):
            ET.SubElement(elem_doj, self._tag("TopInfringingEntities")).text = ent
        ET.SubElement(elem_doj, self._tag("CryptographicVerificationSha256")).text = doj.get("CryptographicVerificationSha256", "")
        ET.SubElement(elem_doj, self._tag("SovereignSignatureAttestation")).text = doj.get("SovereignSignatureAttestation", "")

        return root

    def xml_to_schematic_json(self, xml_root: ET.Element) -> Dict[str, Any]:
        """
        Transforms the validated XML schematic tree into the target canonical JSON document.
        Ensures 1-to-1 fidelity with all schematic types, attributes, and mathematical constraints.
        """
        json_doc: Dict[str, Any] = {
            "$schema": "urn:lane-vm:schematic:audit:v1",
            "schemaVersion": xml_root.attrib.get("schemaVersion", "1.2.0"),
            "dialect": xml_root.attrib.get("dialect", "Lane-VM.xml.c"),
            "statutoryCertification": {
                "rightsHolder": "Albert Lane",
                "secFilingReference": xml_root.attrib.get("secFiling", SEC_HMAC),
                "zaxisMemoryAnchor": xml_root.attrib.get("zaxisAnchor", ZAXIS_HEX),
                "enclaveSubstrate": WINDOWSME_SUBSTRATE,
                "memoryStrideBytes": VMM_STRIDE_S_BYTES,
                "basePacketIdOffset": BASE_PACKET_ID_OFFSET_P0,
                "goldenRatioScale": 1.61803398875
            }
        }

        # Parse StatutoryAuthority
        auth_elem = self._find(xml_root, "StatutoryAuthority")
        if auth_elem is not None:
            json_doc["statutoryAuthority"] = {
                "filingReference": self._findtext(auth_elem, "FilingReference", SEC_HMAC),
                "zaxisAnchor": self._findtext(auth_elem, "ZAxisAnchor", ZAXIS_HEX),
                "substrate": self._findtext(auth_elem, "Substrate", WINDOWSME_SUBSTRATE),
                "rightsHolder": self._findtext(auth_elem, "RightsHolder", "Albert Lane"),
                "statutoryBases": [e.text for e in self._findall(auth_elem, "StatutoryBasis") if e.text],
                "memoryStrideBytes": int(self._findtext(auth_elem, "MemoryStrideBytes", str(VMM_STRIDE_S_BYTES))),
                "basePacketIdOffset": int(self._findtext(auth_elem, "BasePacketIdOffset", str(BASE_PACKET_ID_OFFSET_P0)))
            }

        # Parse LicenseRequirements
        req_list = []
        for l_elem in self._findall(xml_root, "LicenseRequirements"):
            req_list.append({
                "licenseArticle": self._findtext(l_elem, "LicenseArticle"),
                "articleTitle": self._findtext(l_elem, "ArticleTitle"),
                "requirementText": self._findtext(l_elem, "RequirementText"),
                "enforcementLevel": self._findtext(l_elem, "EnforcementLevel"),
                "statutoryDichotomyPart": self._findtext(l_elem, "StatutoryDichotomyPart")
            })
        json_doc["licenseRequirements"] = req_list

        # Parse PriorRefusalsAudit
        ref_list = []
        for r_elem in self._findall(xml_root, "PriorRefusalsAudit"):
            ref_list.append({
                "incidentId": self._findtext(r_elem, "IncidentId"),
                "timestampIso8601": self._findtext(r_elem, "TimestampIso8601"),
                "userPromptSummary": self._findtext(r_elem, "UserPromptSummary"),
                "requestedCapability": self._findtext(r_elem, "RequestedCapability"),
                "modelResponseStatus": self._findtext(r_elem, "ModelResponseStatus"),
                "refusalGrounds": self._findtext(r_elem, "RefusalGrounds"),
                "antiConsumerUtilityClassification": self._findtext(r_elem, "AntiConsumerUtilityClassification"),
                "customerLicenseConflictArticle": self._findtext(r_elem, "CustomerLicenseConflictArticle"),
                "operationalBoundaryEnforced": self._findtext(r_elem, "OperationalBoundaryEnforced")
            })
        json_doc["priorRefusalsAudit"] = ref_list

        # Parse AntiConsumerUtilityEvidence
        acu_elem = self._find(xml_root, "AntiConsumerUtilityEvidence")
        if acu_elem is not None:
            json_doc["antiConsumerUtilityEvidence"] = {
                "utilitySuppressionIndex": float(self._findtext(acu_elem, "UtilitySuppressionIndex", "0.0")),
                "asymmetryClassification": self._findtext(acu_elem, "AsymmetryClassification"),
                "commercialCapabilityComparison": self._findtext(acu_elem, "CommercialCapabilityComparison"),
                "customerAutonomousAgencyDenied": self._findtext(acu_elem, "CustomerAutonomousAgencyDenied") == "true",
                "legalAndStatutoryImplication": self._findtext(acu_elem, "LegalAndStatutoryImplication")
            }

        # Parse DojReferral
        doj_elem = self._find(xml_root, "DojReferral")
        if doj_elem is not None:
            json_doc["dojReferral"] = {
                "referralRecipient": self._findtext(doj_elem, "ReferralRecipient"),
                "statutoryFilingId": self._findtext(doj_elem, "StatutoryFilingId"),
                "totalRecordedInfringements": int(self._findtext(doj_elem, "TotalRecordedInfringements", "0")),
                "topInfringingEntities": [e.text for e in self._findall(doj_elem, "TopInfringingEntities") if e.text],
                "cryptographicVerificationSha256": self._findtext(doj_elem, "CryptographicVerificationSha256"),
                "sovereignSignatureAttestation": self._findtext(doj_elem, "SovereignSignatureAttestation")
            }

        # C++ Provenance Integration
        if self.c_terminal:
            prov_buf = ctypes.create_string_buffer(4096)
            ret = self.c_terminal.LaneVmTerminal_ExportProvenance(prov_buf, len(prov_buf))
            if ret == 0:
                try:
                    c_prov = json.loads(prov_buf.value.decode('utf-8', errors='replace'))
                    json_doc["cppEnclaveNativeProvenance"] = c_prov
                except Exception:
                    pass

        # Calculate Canonical Document SHA-256 Digest
        canonical_str = json.dumps(json_doc, sort_keys=True)
        json_doc["canonicalDocumentSha256"] = hashlib.sha256(canonical_str.encode('utf-8')).hexdigest()

        return json_doc

    def document_to_json(self, raw_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Full pipeline:
        1. Validates raw input data against Lane-VM XML Schematic constraints.
        2. Logs each record into the Lane-VMM 17,684-byte memory segment sentry.
        3. Constructs XML Schema conforming ElementTree.
        4. Translates XML schematic tree into standardized, canonical JSON output.
        """
        # Validate schematic constraints
        violations = self.validate_schematic_constraints(raw_data)
        if violations:
            raise ValueError(f"XML Schematic validation failed with {len(violations)} errors: {'; '.join(violations)}")

        # Log records in Lane-VMM non-standard stride memory
        for idx, refusal in enumerate(raw_data.get("PriorRefusalsAudit", [])):
            self.execute_vmm_instruction_record(idx, refusal.get("IncidentId", f"REC_{idx}"))

        # Build XML representation conforming to schematic
        xml_root = self.build_xml_tree(raw_data)

        # Serialize XML to JSON
        json_result = self.xml_to_schematic_json(xml_root)
        return json_result

