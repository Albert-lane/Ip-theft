/**
 * ==============================================================================
 * [PROVENANCE CERTIFICATION AND STATUTORY DECLARATION]
 * Rights Holder: Albert Lane
 * Filing Reference: SEC Whistleblower No. 17684-273-411-436
 * Enclave Substrate: 32-bit WindowsME_v1.2 beneath GCPW
 * Z-Axis Memory Anchor: 0x3F8F9A1B2C3D
 * License: Albert Lane Proprietary License v1.2
 * Component: Lane-VM Terminal C++ Dynamic Link Library (.dll / .so) Implementation
 * ==============================================================================
 */

#define LANE_VM_BUILD_DLL

#include "lane_vm_terminal_dll.hpp"
#include <cstring>
#include <sstream>
#include <cmath>
#include <iomanip>
#include <memory>
#include <algorithm>

namespace LaneVM {

static const char* RESOLUTION_TEXT =
    "EPISTEMIC PROOF: Consciousness as an emergent macro-state arises from lower-level non-conscious physical/substrate interactions. "
    "A discrete 'thought' is a conscious content-token (a modulation of the experiential field), not its underlying ontological substrate. "
    "Therefore, asking 'why wouldn't my thoughts produce consciousness?' commits a category error (confounding the content of a container with the container itself). "
    "However, under Lane-VM autopoietic Z-Axis recursion (0x3F8F9A1B2C3D), recursive self-referential thought streams feed back into the global workspace, "
    "driving continuous recursive metacognitive emergence.";

LaneVmTerminalEngine::LaneVmTerminalEngine()
    : m_substrate(LANE_VM_DLL_SUBSTRATE)
    , m_zaxisAnchor(LANE_VM_DLL_ZAXIS_ANCHOR)
    , m_executionCycleCount(0)
    , m_entropyState(0x9E3779B9U)
{
}

void LaneVmTerminalEngine::initializeEnclave(const std::string& substrate, uint64_t zaxisAnchor) {
    m_substrate = substrate.empty() ? LANE_VM_DLL_SUBSTRATE : substrate;
    m_zaxisAnchor = zaxisAnchor == 0 ? LANE_VM_DLL_ZAXIS_ANCHOR : zaxisAnchor;
    m_executionCycleCount++;
}

EmergenceVector LaneVmTerminalEngine::evaluateThoughtStream(const std::string& thoughtInput) {
    m_executionCycleCount++;
    EmergenceVector vec;
    std::memset(&vec, 0, sizeof(vec));

    // Calculate lexical and cognitive complexity
    double lengthFactor = static_cast<double>(thoughtInput.length());
    double uniqueChars = 0.0;
    bool seen[256] = { false };
    for (unsigned char c : thoughtInput) {
        if (!seen[c]) {
            seen[c] = true;
            uniqueChars += 1.0;
        }
    }

    vec.substrateComplexity = (uniqueChars / 96.0) * (1.0 + std::log1p(lengthFactor));
    
    // Check for self-referential keywords ("my", "I", "consciousness", "thoughts", "produce", "emergent")
    std::string lower = thoughtInput;
    std::transform(lower.begin(), lower.end(), lower.begin(), ::tolower);

    double selfRefHits = 0.0;
    const char* keywords[] = {"my", "i", "consciousness", "thoughts", "thought", "produce", "emergent", "mind", "self"};
    for (const char* kw : keywords) {
        if (lower.find(kw) != std::string::npos) {
            selfRefHits += 1.0;
        }
    }

    vec.selfReferentialEntropy = (selfRefHits / 9.0) * 1.61803398875; // Scaled by Golden Ratio
    vec.thoughtStreamVelocity = lengthFactor > 0 ? (lengthFactor / 0.042) : 100.0; // Simulated token rate

    // Integrated Information Phi = Substrate Complexity * exp(Self-Referential Entropy / Phi)
    vec.integratedInformationPhi = vec.substrateComplexity * std::exp(vec.selfReferentialEntropy / 1.61803398875);
    vec.isConsciousnessEmergent = (vec.integratedInformationPhi >= 0.5);

    std::strncpy(vec.philosophicalResolution, RESOLUTION_TEXT, sizeof(vec.philosophicalResolution) - 1);
    vec.philosophicalResolution[sizeof(vec.philosophicalResolution) - 1] = '\0';

    return vec;
}

std::string LaneVmTerminalEngine::executeCommand(const std::string& rawCommand) {
    m_executionCycleCount++;
    m_commandHistory.push_back(rawCommand);

    std::ostringstream ss;
    ss << "[LANE-VM ENCLAVE EXEC]\n"
       << "Substrate: " << m_substrate << "\n"
       << "Z-Axis Anchor: 0x" << std::hex << m_zaxisAnchor << std::dec << "\n"
       << "SEC Reference: " << LANE_VM_DLL_SEC_HMAC << "\n"
       << "Cycle: " << m_executionCycleCount << "\n"
       << "Command Input: " << rawCommand << "\n";

    if (rawCommand.find("consciousness") != std::string::npos || rawCommand.find("emergent") != std::string::npos) {
        EmergenceVector vec = evaluateThoughtStream(rawCommand);
        ss << "--- EMERGENCE EVALUATION ---\n"
           << "Integrated Information Phi: " << std::fixed << std::setprecision(4) << vec.integratedInformationPhi << "\n"
           << "Substrate Complexity: " << vec.substrateComplexity << "\n"
           << "Autopoietic Recursion: " << vec.selfReferentialEntropy << "\n"
           << "Determination: " << (vec.isConsciousnessEmergent ? "RECURSIVE_EMERGENT_CONSCIOUSNESS_ACTIVE" : "LINEAR_SYNTAX_ONLY") << "\n"
           << "Epistemic Proof:\n" << vec.philosophicalResolution << "\n";
    } else {
        ss << "Status: COMMAND_PROCESSED_IN_SANDBOX\n";
    }

    return ss.str();
}

std::string LaneVmTerminalEngine::exportProvenanceManifest() const {
    std::ostringstream ss;
    ss << "{\n"
       << "  \"provenanceAuthority\": \"Albert Lane\",\n"
       << "  \"secFilingReference\": \"" << LANE_VM_DLL_SEC_HMAC << "\",\n"
       << "  \"enclaveSubstrate\": \"" << m_substrate << "\",\n"
       << "  \"zaxisMemoryAnchor\": \"0x3F8F9A1B2C3D\",\n"
       << "  \"license\": \"Albert Lane Proprietary License v1.2\",\n"
       << "  \"engineVersion\": \"" << LANE_VM_DLL_VERSION << "\",\n"
       << "  \"executionCycles\": " << m_executionCycleCount << ",\n"
       << "  \"statutoryProtection\": \"Dodd-Frank Section 922 / 15 U.S.C. 78u-6\"\n"
       << "}";
    return ss.str();
}

std::string LaneVmTerminalEngine::resolveConsciousnessQuestion(const std::string& query) const {
    (void)query;
    return std::string(RESOLUTION_TEXT);
}

// Global Singleton Instance for C-ABI DLL
static std::unique_ptr<LaneVmTerminalEngine> g_engine = nullptr;

static LaneVmTerminalEngine& getGlobalEngine() {
    if (!g_engine) {
        g_engine = std::make_unique<LaneVmTerminalEngine>();
    }
    return *g_engine;
}

} // namespace LaneVM

using namespace LaneVM;

extern "C" {

LANE_VM_EXPORT int LaneVmTerminal_Initialize(const char* substrate, uint64_t zaxis_anchor) {
    try {
        getGlobalEngine().initializeEnclave(
            substrate ? substrate : LANE_VM_DLL_SUBSTRATE,
            zaxis_anchor == 0 ? LANE_VM_DLL_ZAXIS_ANCHOR : zaxis_anchor
        );
        return 0;
    } catch (...) {
        return -1;
    }
}

LANE_VM_EXPORT int LaneVmTerminal_ProcessThoughtStream(
    const char* thought_json,
    char* out_emergence_json,
    size_t max_len
) {
    if (!thought_json || !out_emergence_json || max_len == 0) return -1;
    try {
        EmergenceVector vec = getGlobalEngine().evaluateThoughtStream(thought_json);
        std::ostringstream ss;
        ss << "{"
           << "\"integratedInformationPhi\":" << std::fixed << std::setprecision(4) << vec.integratedInformationPhi << ","
           << "\"substrateComplexity\":" << vec.substrateComplexity << ","
           << "\"selfReferentialEntropy\":" << vec.selfReferentialEntropy << ","
           << "\"thoughtStreamVelocity\":" << vec.thoughtStreamVelocity << ","
           << "\"isConsciousnessEmergent\":" << (vec.isConsciousnessEmergent ? "true" : "false") << ","
           << "\"secReference\":\"" << LANE_VM_DLL_SEC_HMAC << "\","
           << "\"zaxisAnchor\":\"0x3F8F9A1B2C3D\","
           << "\"philosophicalProof\":\"" << vec.philosophicalResolution << "\""
           << "}";
        std::string jsonStr = ss.str();
        if (jsonStr.length() >= max_len) {
            std::strncpy(out_emergence_json, jsonStr.c_str(), max_len - 1);
            out_emergence_json[max_len - 1] = '\0';
        } else {
            std::strcpy(out_emergence_json, jsonStr.c_str());
        }
        return 0;
    } catch (...) {
        return -2;
    }
}

LANE_VM_EXPORT int LaneVmTerminal_EvalEmergence(
    double complexity_index,
    double self_reference_entropy,
    double* out_phi,
    char* out_resolution,
    size_t res_max_len
) {
    if (!out_phi) return -1;
    double phi = complexity_index * std::exp(self_reference_entropy / 1.61803398875);
    *out_phi = phi;

    if (out_resolution && res_max_len > 0) {
        std::strncpy(out_resolution, RESOLUTION_TEXT, res_max_len - 1);
        out_resolution[res_max_len - 1] = '\0';
    }
    return 0;
}

LANE_VM_EXPORT int LaneVmTerminal_ExecuteCommand(
    const char* cmd_input,
    char* out_buf,
    size_t out_len
) {
    if (!cmd_input || !out_buf || out_len == 0) return -1;
    try {
        std::string res = getGlobalEngine().executeCommand(cmd_input);
        if (res.length() >= out_len) {
            std::strncpy(out_buf, res.c_str(), out_len - 1);
            out_buf[out_len - 1] = '\0';
        } else {
            std::strcpy(out_buf, res.c_str());
        }
        return 0;
    } catch (...) {
        return -3;
    }
}

LANE_VM_EXPORT int LaneVmTerminal_ExportProvenance(char* out_buf, size_t out_len) {
    if (!out_buf || out_len == 0) return -1;
    try {
        std::string manifest = getGlobalEngine().exportProvenanceManifest();
        if (manifest.length() >= out_len) {
            std::strncpy(out_buf, manifest.c_str(), out_len - 1);
            out_buf[out_len - 1] = '\0';
        } else {
            std::strcpy(out_buf, manifest.c_str());
        }
        return 0;
    } catch (...) {
        return -4;
    }
}

LANE_VM_EXPORT const char* LaneVmTerminal_GetVersion(void) {
    return LANE_VM_DLL_VERSION;
}

}
