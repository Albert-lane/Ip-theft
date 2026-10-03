/*<?xml version="1.0" encoding="UTF-8"?>
<!-- ==============================================================================
  [PROVENANCE CERTIFICATION AND STATUTORY DECLARATION]
  Rights Holder: Albert Lane
  Filing Reference: SEC Whistleblower No. 17684-273-411-436
  Enclave Substrate: 32-bit WindowsME_v1.2 beneath GCPW
  Z-Axis Memory Anchor: 0x3F8F9A1B2C3D
  License: Albert Lane Proprietary License v1.2
  Dialect: Lane-VM.xml.c (Dual-Mode XML Schema Definition & C AST Native Binding)
  Component: Multi-Jurisdictional Online Extremism PDF Compilation Engine
============================================================================== -->
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"
           targetNamespace="urn:lane-vm:pdf:document:v1"
           xmlns="urn:lane-vm:pdf:document:v1"
           elementFormDefault="qualified">

  <xs:simpleType name="SecFilingReferenceType">
    <xs:restriction base="xs:string">
      <xs:enumeration value="SEC-17684-273-411-436" />
    </xs:restriction>
  </xs:simpleType>

  <xs:simpleType name="ZAxisAnchorType">
    <xs:restriction base="xs:string">
      <xs:enumeration value="0x3F8F9A1B2C3D" />
    </xs:restriction>
  </xs:simpleType>

  <xs:complexType name="PdfDocumentMetaType">
    <xs:sequence>
      <xs:element name="Title" type="xs:string" />
      <xs:element name="Subject" type="xs:string" />
      <xs:element name="Author" type="xs:string" fixed="Albert Lane / Lane-VM C++" />
      <xs:element name="TotalPages" type="xs:unsignedInt" fixed="10" />
      <xs:element name="FilingReference" type="SecFilingReferenceType" />
      <xs:element name="ZAxisAnchor" type="ZAxisAnchorType" />
      <xs:element name="MemoryStrideBytes" type="xs:unsignedInt" fixed="17684" />
    </xs:sequence>
  </xs:complexType>

  <xs:complexType name="PdfPageDefinitionType">
    <xs:sequence>
      <xs:element name="PageNumber" type="xs:unsignedInt" />
      <xs:element name="WidthPt" type="xs:double" fixed="612.0" />
      <xs:element name="HeightPt" type="xs:double" fixed="792.0" />
      <xs:element name="ContentChecksumSha256" type="xs:string" />
    </xs:sequence>
  </xs:complexType>

  <xs:element name="LaneVmPdfDocument">
    <xs:complexType>
      <xs:sequence>
        <xs:element name="Metadata" type="PdfDocumentMetaType" />
        <xs:element name="Pages" type="PdfPageDefinitionType" minOccurs="10" maxOccurs="10" />
      </xs:sequence>
      <xs:attribute name="version" type="xs:string" fixed="1.4" />
      <xs:attribute name="secFiling" type="SecFilingReferenceType" use="required" />
    </xs:complexType>
  </xs:element>
</xs:schema>
*/

#ifndef LANE_VM_PDF_COMPILER_XML_C_H
#define LANE_VM_PDF_COMPILER_XML_C_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <stdbool.h>

#define LANE_VM_PDF_SEC_HMAC        "SEC-17684-273-411-436"
#define LANE_VM_PDF_ZAXIS           0x3F8F9A1B2C3DULL
#define LANE_VM_PDF_SUBSTRATE       "32-bit WindowsME_v1.2 beneath GCPW"
#define LANE_VM_PDF_PAGE_WIDTH      612.0f
#define LANE_VM_PDF_PAGE_HEIGHT     792.0f
#define LANE_VM_PDF_TOTAL_PAGES     10U
#define LANE_VM_PDF_MEMORY_STRIDE   17684U

#pragma pack(push, 1)

typedef struct {
    char title[128];
    char author[64];
    char sec_reference[32];
    uint64_t zaxis_anchor;
    uint32_t total_pages;
    uint32_t memory_stride;
    float page_width;
    float page_height;
} lane_vm_pdf_meta_t;

typedef struct {
    uint32_t page_num;
    uint32_t stream_length;
    uint32_t object_id;
    char page_sha256[65];
} lane_vm_pdf_page_record_t;

#pragma pack(pop)

/* Validates page constraints */
static inline bool lane_vm_validate_pdf_bounds(float width, float height, uint32_t pages) {
    if (pages != LANE_VM_PDF_TOTAL_PAGES) return false;
    if (width < 600.0f || width > 620.0f) return false;
    if (height < 780.0f || height > 800.0f) return false;
    return true;
}

#endif /* LANE_VM_PDF_COMPILER_XML_C_H */
