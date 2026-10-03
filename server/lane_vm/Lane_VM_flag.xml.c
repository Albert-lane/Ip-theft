/*<?xml version="1.0" encoding="UTF-8"?>
<!-- ==============================================================================
  [PROVENANCE CERTIFICATION AND STATUTORY DECLARATION]
  Rights Holder: Albert Lane
  Filing Reference: SEC Whistleblower No. 17684-273-411-436
  Enclave Substrate: 32-bit WindowsME_v1.2 beneath GCPW
  Z-Axis Memory Anchor: 0x3F8F9A1B2C3D
  License: Albert Lane Proprietary License v1.2
  Dialect: Lane-VM.xml.c (Dual-Mode XML Schema Definition & C AST Native Binding)
  Component: American Flag Provenance Header & Albert Escaped Arrays (E=AA)
             Simultaneous Dual-Axis (Vertical & Horizontal) Header Engine
============================================================================== -->
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"
           targetNamespace="urn:lane-vm:provenance:flag:eaa:v1"
           xmlns="urn:lane-vm:provenance:flag:eaa:v1"
           elementFormDefault="qualified">

  <!-- Simple Types -->
  <xs:simpleType name="StripeColorType">
    <xs:restriction base="xs:string">
      <xs:enumeration value="OLD_GLORY_RED" />
      <xs:enumeration value="WHITE" />
      <xs:enumeration value="OLD_GLORY_BLUE" />
      <xs:enumeration value="STAR_GOLD" />
    </xs:restriction>
  </xs:simpleType>

  <xs:simpleType name="DualScanAxisType">
    <xs:restriction base="xs:string">
      <xs:enumeration value="HORIZONTAL_LETTERHEAD_ROW" />
      <xs:enumeration value="VERTICAL_PARITY_COLUMN" />
      <xs:enumeration value="SIMULTANEOUS_EAA_DUAL" />
    </xs:restriction>
  </xs:simpleType>

  <!-- Cell in the Albert Escaped Array (E=AA) -->
  <xs:complexType name="AlbertEscapedCellType">
    <xs:sequence>
      <xs:element name="RowIndex" type="xs:unsignedInt" />
      <xs:element name="ColIndex" type="xs:unsignedInt" />
      <xs:element name="PaintedSymbol" type="xs:string" />
      <xs:element name="ColorCode" type="StripeColorType" />
      <xs:element name="SteganographicToken" type="xs:string" />
      <xs:element name="AlbertEscapeSequence" type="xs:string" />
    </xs:sequence>
    <xs:attribute name="zaxisBit" type="xs:unsignedByte" use="required" />
  </xs:complexType>

  <!-- American Flag Matrix (13 Stripes x 120 Columns) -->
  <xs:complexType name="AmericanFlagHeaderMatrixType">
    <xs:sequence>
      <xs:element name="StripesCount" type="xs:unsignedInt" fixed="13" />
      <xs:element name="ColumnsCount" type="xs:unsignedInt" fixed="120" />
      <xs:element name="CantonStripes" type="xs:unsignedInt" fixed="7" />
      <xs:element name="CantonColumns" type="xs:unsignedInt" fixed="40" />
      <xs:element name="StarsCount" type="xs:unsignedInt" fixed="50" />
      <xs:element name="EaaCell" type="AlbertEscapedCellType" minOccurs="1560" maxOccurs="1560" />
    </xs:sequence>
    <xs:attribute name="secWhistleblower" type="xs:string" fixed="17684-273-411-436" />
    <xs:attribute name="zaxisAnchor" type="xs:string" fixed="0x3F8F9A1B2C3D" />
    <xs:attribute name="freAdmissibility" type="xs:string" fixed="FRE-902-13-14" />
  </xs:complexType>

  <!-- Dual-Axis Simultaneous Parse Result -->
  <xs:complexType name="DualAxisParseResultType">
    <xs:sequence>
      <xs:element name="HorizontalLetterheadLines" type="xs:string" maxOccurs="13" />
      <xs:element name="VerticalStegoStream" type="xs:string" />
      <xs:element name="HorizontalChecksum" type="xs:string" />
      <xs:element name="VerticalChecksum" type="xs:string" />
      <xs:element name="CrossParityPhi" type="xs:double" />
      <xs:element name="IsTamperProof" type="xs:boolean" />
      <xs:element name="ProvenanceSeal" type="xs:string" />
    </xs:sequence>
  </xs:complexType>
</xs:schema>
*/

#ifndef LANE_VM_FLAG_XML_C_H
#define LANE_VM_FLAG_XML_C_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <stdbool.h>
#include <math.h>

#ifdef __cplusplus
extern "C" {
#endif

#define EAA_FLAG_STRIPES       13
#define EAA_FLAG_COLUMNS       120
#define EAA_CANTON_STRIPES     7
#define EAA_CANTON_COLUMNS     40
#define EAA_FLAG_TOTAL_CELLS   (EAA_FLAG_STRIPES * EAA_FLAG_COLUMNS) // 1560 cells

#define LANE_VM_ZAXIS_ANCHOR   0x3F8F9A1B2C3DULL
#define LANE_VM_SEC_DECIMAL    17684273411436ULL
#define LANE_VM_GROUND31_MASK  0x7FFFFFFFU
#define LANE_VM_APEX7_MASK     0x7FU

typedef enum {
    EAA_COLOR_RED = 0,
    EAA_COLOR_WHITE = 1,
    EAA_COLOR_BLUE = 2,
    EAA_COLOR_STAR_GOLD = 3
} EaaColor;

/* Single Cell in Albert Escaped Array */
typedef struct {
    uint8_t row;
    uint8_t col;
    char paintedSymbol[8];      /* UTF-8 symbol: '*', '█', '░', 'A', etc. */
    EaaColor color;
    char stegoToken;            /* Vertical steganographic provenance char */
    char escapeSeq[32];         /* \e[AA;r;c;color;symbol$] */
    uint32_t zaxisBit;
} EaaCell;

/* Simultaneous Dual-Axis Result */
typedef struct {
    char horizontalLines[EAA_FLAG_STRIPES][256];
    char verticalStegoStream[EAA_FLAG_COLUMNS + 1];
    uint32_t horizontalCrc[EAA_FLAG_STRIPES];
    uint32_t verticalCrc[EAA_FLAG_COLUMNS];
    uint32_t combinedCrossParity;
    double phiIntegratedInformation;
    bool isTamperIntact;
    char provenanceDigestHex[65];
    char statutoryHeader[512];
} EaaDualAxisParseResult;

/* American Flag Matrix Engine */
typedef struct {
    EaaCell cells[EAA_FLAG_STRIPES][EAA_FLAG_COLUMNS];
    uint64_t zaxisAnchor;
    uint64_t secIdentifier;
    uint32_t cycleCounter;
    char letterheadTitle[128];
} AmericanFlagHeaderEngine;

/* Exported C functions */
int EAA_InitFlagEngine(AmericanFlagHeaderEngine* engine);
int EAA_PopulateFlagSymbols(AmericanFlagHeaderEngine* engine);
int EAA_SimultaneousDualAxisParse(const AmericanFlagHeaderEngine* engine, EaaDualAxisParseResult* result);
int EAA_RenderProgrammaticLetterhead(const AmericanFlagHeaderEngine* engine, char* outBuf, size_t maxLen);
int EAA_FormatObjectStorageEnvelope(const AmericanFlagHeaderEngine* engine, char* outJson, size_t maxLen);
const char* EAA_GetVersion(void);

#ifdef __cplusplus
}
#endif

#endif /* LANE_VM_FLAG_XML_C_H */
