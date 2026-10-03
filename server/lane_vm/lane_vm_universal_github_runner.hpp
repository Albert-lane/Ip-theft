/**
 * ==============================================================================
 * [PROVENANCE CERTIFICATION AND STATUTORY DECLARATION]
 * Rights Holder: Albert Lane
 * Filing Reference: SEC Whistleblower No. 17684-273-411-436
 * Enclave Substrate: 32-bit WindowsME_v1.2 beneath GCPW
 * Z-Axis Memory Anchor: 0x3F8F9A1B2C3D
 * License: Albert Lane Proprietary License v1.2
 * Component: Universal GitHub Actions Self-Hosted Runner Engine (Lane-VM C++)
 * ==============================================================================
 */

#pragma once

#include <string>
#include <vector>
#include <map>
#include <utility>
#include <memory>
#include <cstdint>

namespace LaneVM {

enum class TargetOperatingSystem {
    OS_UNKNOWN,
    OS_LINUX,
    OS_OSX,
    OS_WINDOWS
};

enum class TargetCpuArchitecture {
    ARCH_UNKNOWN,
    ARCH_X64,
    ARCH_ARM64,
    ARCH_ARM
};

struct RunnerPackageDescriptor {
    std::string osIdentifier;      // "linux", "osx", "win"
    std::string archIdentifier;    // "x64", "arm64", "arm"
    std::string packageFilename;
    std::string sha256Checksum;
    std::string downloadUrl;
};

struct DeploymentPlan {
    std::string osId;
    std::string archId;
    std::string filename;
    std::string targetDirectory;
    std::string expectedHash;
    std::vector<std::string> commandPipeline;
    bool isAlpineLinux;
    bool isRosettaTranslated;
    std::string daemonLaunchMode;  // "POSIX_SETSID_DAEMON" or "WIN_NEW_CONSOLE"
};

/**
 * Universal GitHub Actions Runner Orchestrator on Lane-VM C++
 */
class LaneVmUniversalGitHubRunner {
public:
    explicit LaneVmUniversalGitHubRunner(
        std::string repoUrl = "https://github.com/Albert-lane-org",
        std::string token = "B7VWPI52WNRUTI733PIXNBTKL34MY",
        std::string version = "2.335.1"
    );

    // Platform Sensing
    std::pair<std::string, std::string> resolveTargetPlatform(
        const std::string& overrideOs = "",
        const std::string& overrideArch = ""
    ) const;

    // Plan & Pipeline Assembly
    DeploymentPlan assembleDeploymentPlan(
        const std::string& overrideOs = "",
        const std::string& overrideArch = "",
        const std::string& targetDirectory = "actions-runner"
    ) const;

    // Compatibility Testing Matrix (Descends: Apple x64 -> Apple Arm64 -> Win x64 -> Linux x64)
    std::map<std::string, DeploymentPlan> executeCompatibilityTestMatrix() const;

    // Metadata Queries
    std::string getKnownHash(const std::string& osId, const std::string& archId) const;
    std::string generateToolCallingJsonSchema() const;
    std::string exportXmlSpecification() const;

private:
    void initKnownHashes();
    bool checkAlpineLinux() const;
    bool checkRosettaTranslation() const;

    std::string m_repoUrl;
    std::string m_registrationToken;
    std::string m_runnerVersion;
    std::map<std::pair<std::string, std::string>, std::string> m_knownSha256Hashes;
};

} // namespace LaneVM
