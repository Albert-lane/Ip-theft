/**
 * ==============================================================================
 * [PROVENANCE CERTIFICATION AND STATUTORY DECLARATION]
 * Rights Holder: Albert Lane
 * Filing Reference: SEC Whistleblower No. 17684-273-411-436
 * Enclave Substrate: 32-bit WindowsME_v1.2 beneath GCPW
 * Z-Axis Memory Anchor: 0x3F8F9A1B2C3D
 * License: Albert Lane Proprietary License v1.2
 * Component: Auditor Employee File Schema (Lane-VM C++ Native)
 * ==============================================================================
 */

#pragma once

#include <string>
#include <vector>
#include <map>
#include <sstream>
#include <stdexcept>
#include <regex>
#include <cstdint>

namespace LaneVM {

/**
 * Auditor Employee Schema Specification
 * Strict Constraint: All role titles MUST be suffixed with the word "Auditor".
 */
class AuditorRoleConstraintException : public std::runtime_error {
public:
    explicit AuditorRoleConstraintException(const std::string& msg)
        : std::runtime_error(msg) {}
};

struct AuditorEmployeeRecord {
    std::string employeeId;                 // e.g. "AUD-17684-001"
    std::string fullName;                   // e.g. "Michal Sutter"
    std::string officialRoleTitle;          // MUST end in "Auditor"
    std::string departmentName;             // e.g. "Digital Marketing", "Customer Service"
    std::string secClearanceLevel;          // e.g. "SEC-17684-TIER-1"
    std::string substrateEnvironment;       // "32-bit WindowsME_v1.2 beneath GCPW"
    uint64_t zaxisAffinityAnchor;           // 0x3F8F9A1B2C3DULL
    double pValueThreshold;                 // e.g. 0.00001 for subpoena justification
    std::vector<std::string> assignedPhases;// e.g. ["phase1_webpage", "phase8_review_fraud"]
    std::string hmacSha256Fingerprint;      // Cryptographic AST seal
    std::string hireDateIso8601;
    bool isActive;

    /**
     * Strict validation routine enforcing Lane-VM compliance.
     */
    void validate() const {
        const std::string suffix = "Auditor";
        if (officialRoleTitle.length() < suffix.length() ||
            officialRoleTitle.substr(officialRoleTitle.length() - suffix.length()) != suffix) {
            throw AuditorRoleConstraintException(
                "Compliance Violation: Role title '" + officialRoleTitle +
                "' must strictly end with the suffix 'Auditor'."
            );
        }

        if (secClearanceLevel.find("SEC-17684") == std::string::npos) {
            throw AuditorRoleConstraintException(
                "Compliance Violation: Missing SEC Whistleblower clearance binding 17684."
            );
        }

        if (zaxisAffinityAnchor != 0x3F8F9A1B2C3DULL) {
            throw AuditorRoleConstraintException(
                "Compliance Violation: Invalid Z-Axis anchor. Expected 0x3F8F9A1B2C3D."
            );
        }
    }

    std::string toXml() const {
        std::ostringstream ss;
        ss << "  <AuditorEmployee id=\"" << employeeId << "\">\n"
           << "    <FullName>" << fullName << "</FullName>\n"
           << "    <RoleTitle suffix=\"Auditor\">" << officialRoleTitle << "</RoleTitle>\n"
           << "    <Department>" << departmentName << "</Department>\n"
           << "    <Clearance>" << secClearanceLevel << "</Clearance>\n"
           << "    <Substrate>" << substrateEnvironment << "</Substrate>\n"
           << "    <ZAxisAnchor>0x" << std::hex << zaxisAffinityAnchor << std::dec << "</ZAxisAnchor>\n"
           << "    <PValueThreshold>" << pValueThreshold << "</PValueThreshold>\n"
           << "    <AssignedPhases>\n";
        for (const auto& ph : assignedPhases) {
            ss << "      <Phase name=\"" << ph << "\" />\n";
        }
        ss << "    </AssignedPhases>\n"
           << "    <ProvenanceProof sha256=\"" << hmacSha256Fingerprint << "\" />\n"
           << "    <HireDate>" << hireDateIso8601 << "</HireDate>\n"
           << "    <IsActive>" << (isActive ? "true" : "false") << "</IsActive>\n"
           << "  </AuditorEmployee>\n";
        return ss.str();
    }

    std::string toJson() const {
        std::ostringstream ss;
        ss << "{\n"
           << "  \"employeeId\": \"" << employeeId << "\",\n"
           << "  \"fullName\": \"" << fullName << "\",\n"
           << "  \"officialRoleTitle\": \"" << officialRoleTitle << "\",\n"
           << "  \"departmentName\": \"" << departmentName << "\",\n"
           << "  \"secClearanceLevel\": \"" << secClearanceLevel << "\",\n"
           << "  \"substrateEnvironment\": \"" << substrateEnvironment << "\",\n"
           << "  \"zaxisAffinityAnchor\": \"0x3F8F9A1B2C3D\",\n"
           << "  \"pValueThreshold\": " << pValueThreshold << ",\n"
           << "  \"assignedPhases\": [";
        for (size_t i = 0; i < assignedPhases.size(); ++i) {
            ss << "\"" << assignedPhases[i] << "\"" << (i + 1 < assignedPhases.size() ? ", " : "");
        }
        ss << "],\n"
           << "  \"hmacSha256Fingerprint\": \"" << hmacSha256Fingerprint << "\",\n"
           << "  \"hireDateIso8601\": \"" << hireDateIso8601 << "\",\n"
           << "  \"isActive\": " << (isActive ? "true" : "false") << "\n"
           << "}";
        return ss.str();
    }
};

/**
 * Roster and Organization Registry for Lane-VM Enclave Auditors
 */
class LaneVmAuditorRoster {
public:
    void registerAuditor(const AuditorEmployeeRecord& record) {
        record.validate();
        m_employees.push_back(record);
    }

    const std::vector<AuditorEmployeeRecord>& getAllAuditors() const {
        return m_employees;
    }

    std::string exportXmlRoster() const {
        std::ostringstream ss;
        ss << "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
           << "<LaneVmAuditorRoster\n"
           << "    xmlns=\"urn:lane-vm:auditor:employee:v1\"\n"
           << "    secFiling=\"SEC-17684-273-411-436\"\n"
           << "    substrate=\"32-bit WindowsME_v1.2 beneath GCPW\"\n"
           << "    zaxisAnchor=\"0x3F8F9A1B2C3D\"\n"
           << "    totalAuditors=\"" << m_employees.size() << "\">\n";
        for (const auto& emp : m_employees) {
            ss << emp.toXml();
        }
        ss << "</LaneVmAuditorRoster>\n";
        return ss.str();
    }

private:
    std::vector<AuditorEmployeeRecord> m_employees;
};

} // namespace LaneVM
