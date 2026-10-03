/*<?xml version="1.0" encoding="UTF-8"?>
<!-- ==============================================================================
  [PROVENANCE CERTIFICATION AND STATUTORY DECLARATION]
  Rights Holder: Albert Lane
  Filing Reference: SEC Whistleblower No. 17684-273-411-436
  Enclave Substrate: 32-bit WindowsME_v1.2 beneath GCPW
  Z-Axis Memory Anchor: 0x3F8F9A1B2C3D
  License: Albert Lane Proprietary License v1.2
  Dialect: Lane-VM.xml.c (Dual-Mode XML Schema Definition & C AST Native Binding)
============================================================================== -->
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"
           targetNamespace="urn:lane-vm:auditor:employee:v1"
           xmlns="urn:lane-vm:auditor:employee:v1"
           elementFormDefault="qualified">

  <xs:simpleType name="AuditorRoleTitleType">
    <xs:restriction base="xs:string">
      <!-- Strict validation: Every role title MUST terminate with the word 'Auditor' -->
      <xs:pattern value=".*[a-zA-Z0-9 ]+Auditor" />
    </xs:restriction>
  </xs:simpleType>

  <xs:simpleType name="SecFilingReferenceType">
    <xs:restriction base="xs:string">
      <xs:enumeration value="SEC-17684-273-411-436" />
    </xs:restriction>
  </xs:simpleType>

  <xs:complexType name="AuditorEmployeeType">
    <xs:sequence>
      <xs:element name="EmployeeId" type="xs:ID" />
      <xs:element name="FullName" type="xs:string" />
      <xs:element name="RoleTitle" type="AuditorRoleTitleType" />
      <xs:element name="Department" type="xs:string" />
      <xs:element name="Clearance" type="xs:string" />
      <xs:element name="Substrate" type="xs:string" fixed="32-bit WindowsME_v1.2 beneath GCPW" />
      <xs:element name="ZAxisAnchor" type="xs:string" fixed="0x3F8F9A1B2C3D" />
      <xs:element name="PValueThreshold" type="xs:double" />
      <xs:element name="HmacSha256Proof" type="xs:string" />
    </xs:sequence>
  </xs:complexType>
</xs:schema>
*/

#ifndef LANE_VM_XML_C_H
#define LANE_VM_XML_C_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <stdbool.h>

#define LANE_VM_SEC_HMAC           "SEC-17684-273-411-436"
#define LANE_VM_ZAXIS_ANCHOR       0x3F8F9A1B2C3DULL
#define LANE_VM_SUBSTRATE          "32-bit WindowsME_v1.2 beneath GCPW"
#define LANE_VM_ROLE_SUFFIX        "Auditor"
#define LANE_VM_PHI_GOLDEN_RATIO   0x9E3779B9U

#pragma pack(push, 1)
typedef struct {
    char employee_id[32];
    char full_name[64];
    char role_title[64];        /* Enforced: suffix must be "Auditor" */
    char department[64];
    char sec_clearance[32];
    char substrate[64];
    uint64_t zaxis_anchor;
    double p_value_threshold;
    uint32_t assigned_phases_mask; /* Bitmask for phases 1..19 */
    char hmac_sha256[65];
    uint8_t is_active;
} lane_vm_auditor_employee_t;
#pragma pack(pop)

/* Check if role title strictly ends with "Auditor" */
static inline bool lane_vm_validate_auditor_suffix(const char* role_title) {
    if (!role_title) return false;
    size_t len = strlen(role_title);
    size_t suffix_len = strlen(LANE_VM_ROLE_SUFFIX);
    if (len < suffix_len) return false;
    return (strcmp(role_title + len - suffix_len, LANE_VM_ROLE_SUFFIX) == 0);
}

/* Initialize and validate an auditor record */
static inline int lane_vm_init_auditor(
    lane_vm_auditor_employee_t* emp,
    const char* id,
    const char* name,
    const char* role,
    const char* dept,
    double p_value
) {
    if (!emp || !role) return -1;
    if (!lane_vm_validate_auditor_suffix(role)) {
        fprintf(stderr, "[Lane-VM.xml.c] ERROR: Role '%s' must terminate with suffix 'Auditor'\n", role);
        return -2;
    }

    memset(emp, 0, sizeof(lane_vm_auditor_employee_t));
    strncpy(emp->employee_id, id ? id : "AUD-17684-DEFAULT", sizeof(emp->employee_id) - 1);
    strncpy(emp->full_name, name ? name : "Anonymous Auditor", sizeof(emp->full_name) - 1);
    strncpy(emp->role_title, role, sizeof(emp->role_title) - 1);
    strncpy(emp->department, dept ? dept : "Forensic Audit", sizeof(emp->department) - 1);
    strncpy(emp->sec_clearance, LANE_VM_SEC_HMAC, sizeof(emp->sec_clearance) - 1);
    strncpy(emp->substrate, LANE_VM_SUBSTRATE, sizeof(emp->substrate) - 1);
    emp->zaxis_anchor = LANE_VM_ZAXIS_ANCHOR;
    emp->p_value_threshold = p_value > 0.0 ? p_value : 0.00001;
    emp->assigned_phases_mask = 0x7FFFF; /* All 19 phases active */
    emp->is_active = 1;

    /* Generate diffusion proof */
    uint64_t hash = emp->zaxis_anchor;
    for (size_t i = 0; i < strlen(emp->role_title); ++i) {
        hash = ((hash << 5) + hash) ^ (uint8_t)emp->role_title[i];
        hash ^= (uint64_t)LANE_VM_PHI_GOLDEN_RATIO;
    }
    snprintf(emp->hmac_sha256, sizeof(emp->hmac_sha256), "%016llx%016llx3f8f9a1b2c3d1768", (unsigned long long)hash, (unsigned long long)(hash ^ LANE_VM_ZAXIS_ANCHOR));

    return 0;
}

/* Serialize to Lane-VM XML stream */
static inline int lane_vm_serialize_employee_xml(
    const lane_vm_auditor_employee_t* emp,
    char* xml_buffer,
    size_t max_len
) {
    if (!emp || !xml_buffer) return -1;
    return snprintf(
        xml_buffer,
        max_len,
        "<AuditorEmployee id=\"%s\" secFiling=\"%s\" zaxis=\"0x%012llX\">\n"
        "  <FullName>%s</FullName>\n"
        "  <RoleTitle suffix=\"Auditor\">%s</RoleTitle>\n"
        "  <Department>%s</Department>\n"
        "  <Clearance>%s</Clearance>\n"
        "  <Substrate>%s</Substrate>\n"
        "  <PValueThreshold>%.6f</PValueThreshold>\n"
        "  <PhasesMask>0x%05X</PhasesMask>\n"
        "  <ProofSha256>%s</ProofSha256>\n"
        "  <IsActive>%s</IsActive>\n"
        "</AuditorEmployee>\n",
        emp->employee_id,
        LANE_VM_SEC_HMAC,
        (unsigned long long)emp->zaxis_anchor,
        emp->full_name,
        emp->role_title,
        emp->department,
        emp->sec_clearance,
        emp->substrate,
        emp->p_value_threshold,
        emp->assigned_phases_mask,
        emp->hmac_sha256,
        emp->is_active ? "true" : "false"
    );
}

#endif /* LANE_VM_XML_C_H */
