/**
 * ==============================================================================
 * [PROVENANCE CERTIFICATION AND STATUTORY DECLARATION]
 * Rights Holder: Albert Lane
 * Filing Reference: SEC Whistleblower No. 17684-273-411-436
 * Enclave Substrate: 32-bit WindowsME_v1.2 beneath GCPW
 * Z-Axis Memory Anchor: 0x3F8F9A1B2C3D
 * License: Albert Lane Proprietary License v1.2
 * ==============================================================================
 */

#include "lane_vm_universal_github_runner.hpp"
#include <sstream>
#include <stdexcept>
#include <fstream>
#include <iostream>

#if defined(__APPLE__)
#include <sys/types.h>
#include <sys/sysctl.h>
#endif

namespace LaneVM {

LaneVmUniversalGitHubRunner::LaneVmUniversalGitHubRunner(
    std::string repoUrl,
    std::string token,
    std::string version
)
    : m_repoUrl(std::move(repoUrl))
    , m_registrationToken(std::move(token))
    , m_runnerVersion(std::move(version))
{
    initKnownHashes();
}

void LaneVmUniversalGitHubRunner::initKnownHashes() {
    // Release v2.335.1 Cryptographically Verified Matrix
    m_knownSha256Hashes[{"linux", "arm"}]   = "d9810476ceebb6739913ed16afd5c61664e53312a444ee5226e9010a4219a864";
    m_knownSha256Hashes[{"linux", "arm64"}] = "6d1e85bfd1a506a8b17c1f1b9b57dba458ffed90898799aaa9f599520b0d9207";
    m_knownSha256Hashes[{"linux", "x64"}]   = "4ef2f25285f0ae4477f1fe1e346db76d2f3ebf03824e2ddd1973a2819bf6c8cf";
    m_knownSha256Hashes[{"osx", "arm64"}]   = "e1a9bc7a3661e06fa0b129d15c2064fe65dc81a431001d8958a9db1409b73769";
    m_knownSha256Hashes[{"osx", "x64"}]     = "b2fe57b2ae5b0bc1605f9fc0723c07eedf06167321d3478ce0440f15e5b0a010";
    m_knownSha256Hashes[{"win", "arm64"}]   = "6cd1409daad8be4f77deb0c677ceb6153fccbab2e33af4fdc1b3465bd42ec742";
    m_knownSha256Hashes[{"win", "x64"}]     = "eb65c95277af42bcf3778a799c41359d224ba2a67b4de26b7cea1729b09c803d";
}

bool LaneVmUniversalGitHubRunner::checkAlpineLinux() const {
#if defined(__linux__)
    std::ifstream alpineRelease("/etc/alpine-release");
    return alpineRelease.good();
#else
    return false;
#endif
}

bool LaneVmUniversalGitHubRunner::checkRosettaTranslation() const {
#if defined(__APPLE__)
    int ret = 0;
    size_t size = sizeof(ret);
    if (sysctlbyname("sysctl.proc_translated", &ret, &size, NULL, 0) == 0) {
        return ret == 1;
    }
#endif
    return false;
}

std::string LaneVmUniversalGitHubRunner::getKnownHash(const std::string& osId, const std::string& archId) const {
    auto it = m_knownSha256Hashes.find({osId, archId});
    if (it != m_knownSha256Hashes.end()) {
        return it->second;
    }
    return "";
}

std::pair<std::string, std::string> LaneVmUniversalGitHubRunner::resolveTargetPlatform(
    const std::string& overrideOs,
    const std::string& overrideArch
) const {
    std::string resolvedOs;
    std::string resolvedArch;

    if (!overrideOs.empty()) {
        resolvedOs = overrideOs;
    } else {
#if defined(_WIN32)
        resolvedOs = "win";
#elif defined(__APPLE__)
        resolvedOs = "osx";
#elif defined(__linux__)
        resolvedOs = "linux";
#else
        resolvedOs = "linux";
#endif
    }

    if (!overrideArch.empty()) {
        resolvedArch = overrideArch;
    } else {
#if defined(__APPLE__)
        if (checkRosettaTranslation()) {
            resolvedArch = "arm64"; // Rosetta translation detected: override to native Apple Silicon
        } else {
#if defined(__x86_64__)
            resolvedArch = "x64";
#elif defined(__arm64__) || defined(__aarch64__)
            resolvedArch = "arm64";
#else
            resolvedArch = "x64";
#endif
        }
#elif defined(_WIN32)
#if defined(_M_ARM64)
        resolvedArch = "arm64";
#else
        resolvedArch = "x64";
#endif
#else // Linux
#if defined(__aarch64__)
        resolvedArch = "arm64";
#elif defined(__arm__)
        resolvedArch = "arm";
#else
        resolvedArch = "x64";
#endif
#endif
    }

    if (resolvedOs == "win" && resolvedArch == "arm") {
        throw std::runtime_error("Lane-VM Error: Windows on ARM32 is not supported by GitHub Actions Runner packages.");
    }

    return {resolvedOs, resolvedArch};
}

DeploymentPlan LaneVmUniversalGitHubRunner::assembleDeploymentPlan(
    const std::string& overrideOs,
    const std::string& overrideArch,
    const std::string& targetDirectory
) const {
    auto [osId, archId] = resolveTargetPlatform(overrideOs, overrideArch);
    std::string expectedHash = getKnownHash(osId, archId);

    DeploymentPlan plan;
    plan.osId = osId;
    plan.archId = archId;
    plan.targetDirectory = targetDirectory;
    plan.expectedHash = expectedHash;
    plan.isAlpineLinux = checkAlpineLinux();
    plan.isRosettaTranslated = checkRosettaTranslation();

    if (osId == "linux" || osId == "osx") {
        std::string archiveExt = "tar.gz";
        plan.filename = "actions-runner-" + osId + "-" + archId + "-" + m_runnerVersion + "." + archiveExt;
        std::string downloadUrl = "https://github.com/actions/runner/releases/download/v" + m_runnerVersion + "/" + plan.filename;

        if (osId == "linux" && plan.isAlpineLinux) {
            plan.commandPipeline.push_back("apk update && apk add --no-cache curl tar bash");
        }

        plan.commandPipeline.push_back("mkdir -p " + targetDirectory + " && cd " + targetDirectory);
        plan.commandPipeline.push_back("curl -o " + plan.filename + " -L " + downloadUrl);

        if (!expectedHash.empty()) {
            std::string hashCmd = "echo '" + expectedHash + "  " + plan.filename + "' | shasum -a 256 -c || "
                                + "echo '" + expectedHash + "  " + plan.filename + "' | sha256sum -c";
            plan.commandPipeline.push_back(hashCmd);
        }

        plan.commandPipeline.push_back("tar xzf ./" + plan.filename);
        plan.commandPipeline.push_back("./config.sh --url " + m_repoUrl + " --token " + m_registrationToken + " --unattended");
        plan.daemonLaunchMode = "POSIX_SETSID_DAEMON";
    } else if (osId == "win") {
        plan.filename = "actions-runner-win-" + archId + "-" + m_runnerVersion + ".zip";
        std::string downloadUrl = "https://github.com/actions/runner/releases/download/v" + m_runnerVersion + "/" + plan.filename;

        plan.commandPipeline.push_back("mkdir -Force " + targetDirectory + "; Set-Location " + targetDirectory);
        plan.commandPipeline.push_back("Invoke-WebRequest -Uri " + downloadUrl + " -OutFile " + plan.filename);

        if (!expectedHash.empty()) {
            std::string hashCmd = "if ((Get-FileHash -Path " + plan.filename + " -Algorithm SHA256).Hash.ToUpper() -ne '"
                                + expectedHash + "'.ToUpper()) { throw 'Computed checksum mismatch' }";
            plan.commandPipeline.push_back(hashCmd);
        }

        plan.commandPipeline.push_back("Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::ExtractToDirectory(\"$PWD/" + plan.filename + "\", \"$PWD\")");
        plan.commandPipeline.push_back("./config.cmd --url " + m_repoUrl + " --token " + m_registrationToken + " --unattended");
        plan.daemonLaunchMode = "WIN_NEW_CONSOLE";
    }

    return plan;
}

std::map<std::string, DeploymentPlan> LaneVmUniversalGitHubRunner::executeCompatibilityTestMatrix() const {
    // Hierarchy in descending order: Apple x64 -> Apple Arm64 -> Windows x64 -> Linux x64
    std::vector<std::tuple<std::string, std::string, std::string>> sequence = {
        {"Apple macOS x64", "osx", "x64"},
        {"Apple macOS Arm64", "osx", "arm64"},
        {"Windows x64", "win", "x64"},
        {"Linux x64", "linux", "x64"}
    };

    std::map<std::string, DeploymentPlan> results;
    for (const auto& [name, osVal, archVal] : sequence) {
        results[name] = assembleDeploymentPlan(osVal, archVal, "actions-runner");
    }
    return results;
}

std::string LaneVmUniversalGitHubRunner::generateToolCallingJsonSchema() const {
    return R"JSON({
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "setup_github_runner_parameters",
  "description": "Parameters for deploying a self-hosted GitHub Actions runner across Linux, macOS, and Windows with dynamic platform sensing, dependency resolution, and background agent execution on Lane-VM.",
  "type": "object",
  "properties": {
    "url": {
      "type": "string",
      "format": "uri",
      "description": "The target GitHub organization or repository URL (e.g., https://github.com/Albert-lane-org)."
    },
    "token": {
      "type": "string",
      "description": "The cryptographic registration token issued by GitHub for authentication."
    },
    "version": {
      "type": "string",
      "default": "2.335.1",
      "description": "The precise version tag of the GitHub Actions runner package to download."
    },
    "override_os": {
      "type": "string",
      "enum": ["linux", "osx", "win"],
      "description": "Bypasses system-level platform detection to force target configuration for specific environments during testing."
    },
    "override_arch": {
      "type": "string",
      "enum": ["x64", "arm64", "arm"],
      "description": "Bypasses hardware architecture queries to force specific CPU package selection."
    }
  },
  "required": ["url", "token"]
})JSON";
}

std::string LaneVmUniversalGitHubRunner::exportXmlSpecification() const {
    std::ostringstream ss;
    ss << "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
       << "<LaneVmGitHubRunnerSpecification\n"
       << "    xmlns=\"urn:lane-vm:github:runner:v1\"\n"
       << "    secReference=\"SEC-17684-273-411-436\"\n"
       << "    version=\"" << m_runnerVersion << "\"\n"
       << "    repo=\"" << m_repoUrl << "\">\n"
       << "  <ChecksumMatrix count=\"" << m_knownSha256Hashes.size() << "\">\n";
    for (const auto& [key, hash] : m_knownSha256Hashes) {
        ss << "    <Package os=\"" << key.first << "\" arch=\"" << key.second << "\" sha256=\"" << hash << "\" />\n";
    }
    ss << "  </ChecksumMatrix>\n"
       << "</LaneVmGitHubRunnerSpecification>\n";
    return ss.str();
}

} // namespace LaneVM
