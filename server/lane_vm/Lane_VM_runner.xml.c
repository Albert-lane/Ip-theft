/*<?xml version="1.0" encoding="UTF-8"?>
<!-- ==============================================================================
  [PROVENANCE CERTIFICATION AND STATUTORY DECLARATION]
  Rights Holder: Albert Lane
  Filing Reference: SEC Whistleblower No. 17684-273-411-436
  Enclave Substrate: 32-bit WindowsME_v1.2 beneath GCPW
  Z-Axis Memory Anchor: 0x3F8F9A1B2C3D
  License: Albert Lane Proprietary License v1.2
  Dialect: Lane-VM.xml.c (Dual-Mode XML Schema Definition & C AST Native Binding)
  Component: Universal GitHub Actions Self-Hosted Runner Orchestrator Specification
============================================================================== -->
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"
           targetNamespace="urn:lane-vm:github:runner:v1"
           xmlns="urn:lane-vm:github:runner:v1"
           elementFormDefault="qualified">

  <xs:simpleType name="TargetOsType">
    <xs:restriction base="xs:string">
      <xs:enumeration value="linux" />
      <xs:enumeration value="osx" />
      <xs:enumeration value="win" />
    </xs:restriction>
  </xs:simpleType>

  <xs:simpleType name="TargetArchType">
    <xs:restriction base="xs:string">
      <xs:enumeration value="x64" />
      <xs:enumeration value="arm64" />
      <xs:enumeration value="arm" />
    </xs:restriction>
  </xs:simpleType>

  <xs:complexType name="UniversalRunnerPackageType">
    <xs:sequence>
      <xs:element name="Os" type="TargetOsType" />
      <xs:element name="Arch" type="TargetArchType" />
      <xs:element name="Version" type="xs:string" fixed="2.335.1" />
      <xs:element name="Filename" type="xs:string" />
      <xs:element name="Sha256Checksum" type="xs:string" />
      <xs:element name="DaemonType" type="xs:string" />
    </xs:sequence>
  </xs:complexType>

  <xs:complexType name="RunnerRegistryType">
    <xs:sequence>
      <xs:element name="Package" type="UniversalRunnerPackageType" minOccurs="1" maxOccurs="7" />
    </xs:sequence>
    <xs:attribute name="secFiling" type="xs:string" fixed="SEC-17684-273-411-436" />
    <xs:attribute name="zaxisAnchor" type="xs:string" fixed="0x3F8F9A1B2C3D" />
  </xs:complexType>
</xs:schema>
*/

#ifndef LANE_VM_RUNNER_XML_C_H
#define LANE_VM_RUNNER_XML_C_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <stdbool.h>

#define LANE_VM_RUNNER_SEC_HMAC     "SEC-17684-273-411-436"
#define LANE_VM_RUNNER_ZAXIS        0x3F8F9A1B2C3DULL
#define LANE_VM_RUNNER_SUBSTRATE    "32-bit WindowsME_v1.2 beneath GCPW"
#define LANE_VM_RUNNER_VERSION      "2.335.1"

typedef enum {
    LANE_VM_OS_LINUX = 1,
    LANE_VM_OS_OSX   = 2,
    LANE_VM_OS_WIN   = 3
} lane_vm_os_t;

typedef enum {
    LANE_VM_ARCH_X64   = 1,
    LANE_VM_ARCH_ARM64 = 2,
    LANE_VM_ARCH_ARM   = 3
} lane_vm_arch_t;

#pragma pack(push, 1)
typedef struct {
    char os_str[8];           /* "linux", "osx", "win" */
    char arch_str[8];         /* "x64", "arm64", "arm" */
    char filename[64];        /* e.g. actions-runner-linux-x64-2.335.1.tar.gz */
    char sha256_hash[65];     /* 64-char hex digest */
    char download_url[160];
    char daemon_mode[32];     /* "POSIX_SETSID_DAEMON" or "WIN_NEW_CONSOLE" */
} lane_vm_runner_descriptor_t;
#pragma pack(pop)

/* Static verified checksum table for GitHub Actions Runner Release v2.335.1 */
static const lane_vm_runner_descriptor_t LANE_VM_RUNNER_TABLE[] = {
    { "linux", "arm",   "actions-runner-linux-arm-2.335.1.tar.gz",
      "d9810476ceebb6739913ed16afd5c61664e53312a444ee5226e9010a4219a864",
      "https://github.com/actions/runner/releases/download/v2.335.1/actions-runner-linux-arm-2.335.1.tar.gz",
      "POSIX_SETSID_DAEMON" },

    { "linux", "arm64", "actions-runner-linux-arm64-2.335.1.tar.gz",
      "6d1e85bfd1a506a8b17c1f1b9b57dba458ffed90898799aaa9f599520b0d9207",
      "https://github.com/actions/runner/releases/download/v2.335.1/actions-runner-linux-arm64-2.335.1.tar.gz",
      "POSIX_SETSID_DAEMON" },

    { "linux", "x64",   "actions-runner-linux-x64-2.335.1.tar.gz",
      "4ef2f25285f0ae4477f1fe1e346db76d2f3ebf03824e2ddd1973a2819bf6c8cf",
      "https://github.com/actions/runner/releases/download/v2.335.1/actions-runner-linux-x64-2.335.1.tar.gz",
      "POSIX_SETSID_DAEMON" },

    { "osx",   "arm64", "actions-runner-osx-arm64-2.335.1.tar.gz",
      "e1a9bc7a3661e06fa0b129d15c2064fe65dc81a431001d8958a9db1409b73769",
      "https://github.com/actions/runner/releases/download/v2.335.1/actions-runner-osx-arm64-2.335.1.tar.gz",
      "POSIX_SETSID_DAEMON" },

    { "osx",   "x64",   "actions-runner-osx-x64-2.335.1.tar.gz",
      "b2fe57b2ae5b0bc1605f9fc0723c07eedf06167321d3478ce0440f15e5b0a010",
      "https://github.com/actions/runner/releases/download/v2.335.1/actions-runner-osx-x64-2.335.1.tar.gz",
      "POSIX_SETSID_DAEMON" },

    { "win",   "arm64", "actions-runner-win-arm64-2.335.1.zip",
      "6cd1409daad8be4f77deb0c677ceb6153fccbab2e33af4fdc1b3465bd42ec742",
      "https://github.com/actions/runner/releases/download/v2.335.1/actions-runner-win-arm64-2.335.1.zip",
      "WIN_NEW_CONSOLE" },

    { "win",   "x64",   "actions-runner-win-x64-2.335.1.zip",
      "eb65c95277af42bcf3778a799c41359d224ba2a67b4de26b7cea1729b09c803d",
      "https://github.com/actions/runner/releases/download/v2.335.1/actions-runner-win-x64-2.335.1.zip",
      "WIN_NEW_CONSOLE" }
};

#define LANE_VM_RUNNER_TABLE_COUNT (sizeof(LANE_VM_RUNNER_TABLE) / sizeof(LANE_VM_RUNNER_TABLE[0]))

/* Lookup runner descriptor by OS and architecture */
static inline const lane_vm_runner_descriptor_t* lane_vm_find_runner_package(
    const char* os_str,
    const char* arch_str
) {
    if (!os_str || !arch_str) return NULL;
    for (size_t i = 0; i < LANE_VM_RUNNER_TABLE_COUNT; ++i) {
        if (strcmp(LANE_VM_RUNNER_TABLE[i].os_str, os_str) == 0 &&
            strcmp(LANE_VM_RUNNER_TABLE[i].arch_str, arch_str) == 0) {
            return &LANE_VM_RUNNER_TABLE[i];
        }
    }
    return NULL;
}

/* Serialize Runner Package to Lane-VM XML stream */
static inline int lane_vm_serialize_runner_xml(
    const lane_vm_runner_descriptor_t* desc,
    char* xml_buf,
    size_t max_len
) {
    if (!desc || !xml_buf) return -1;
    return snprintf(
        xml_buf,
        max_len,
        "<UniversalRunnerPackage os=\"%s\" arch=\"%s\" version=\"%s\" secFiling=\"%s\">\n"
        "  <Filename>%s</Filename>\n"
        "  <Sha256>%s</Sha256>\n"
        "  <DownloadUrl>%s</DownloadUrl>\n"
        "  <DaemonMode>%s</DaemonMode>\n"
        "  <SubstrateSublayer>%s</SubstrateSublayer>\n"
        "  <ZAxisAnchor>0x%012llX</ZAxisAnchor>\n"
        "</UniversalRunnerPackage>\n",
        desc->os_str,
        desc->arch_str,
        LANE_VM_RUNNER_VERSION,
        LANE_VM_RUNNER_SEC_HMAC,
        desc->filename,
        desc->sha256_hash,
        desc->download_url,
        desc->daemon_mode,
        LANE_VM_RUNNER_SUBSTRATE,
        (unsigned long long)LANE_VM_RUNNER_ZAXIS
    );
}

#endif /* LANE_VM_RUNNER_XML_C_H */
