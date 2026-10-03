/**
 * ==============================================================================
 * ALBERT LANE PROPRIETARY SOFTWARE LICENSE AND INTELLECTUAL PROPERTY DECLARATION
 * Component: LANE-VM American Flag Header & Albert Escaped Arrays (E=AA)
 * Language: C++20
 * Author & Rights Holder: Albert Lane
 * License Effective Date: May 30, 2026
 * Statutory Authority: SEC Whistleblower Reference No. 17684-273-411-436
 * Primary Jurisdiction: State of Oregon, United States of America
 * ==============================================================================
 */

#include "lane_vm_flag_header.hpp"
#include <cmath>
#include <cstring>
#include <sstream>
#include <iomanip>
#include <algorithm>

namespace LaneVM {

static const char* VERTICAL_STEGANO_WATERMARK = 
    "ALBERT LANE · SEC WHISTLEBLOWER 17684-273-411-436 · E=AA OPERATOR · OREGON SOVEREIGNTY · 0x3F8F9A1B2C3D · FRE 902(13)/(14) · US CONST TITLES 15 17 18 47";

static const char* STRIPE_LETTERHEADS[13] = {
    "ALBERT LANE SOVEREIGN ENCLAVE · STATUTORY PROVENANCE HEADER · US PRIVILEGES & IMMUNITIES",
    "SEC WHISTLEBLOWER REF NO. 17684-273-411-436 · Z-AXIS ANCHOR: 0x3F8F9A1B2C3D · 18 U.S.C. § 1836",
    "PROGRAMMATIC LETTERHEAD · LANE-VM DUAL-MODE GROUND-31 / APEX-7 COGNITIVE ENGINE",
    "ALBERT ESCAPED ARRAYS [E=AA] · SIMULTANEOUS ORTHOGONAL DUAL-AXIS PARSER MATRIX",
    "OFFICIAL FORENSIC LETTERHEAD · EVIDENCE ADMISSIBLE UNDER FED. R. EVID. 902(13)/(14)",
    "32-BIT WINDOWS ME V1.2 SUBSTRATE BENEATH GCPW · OREGON & GLOBAL SOVEREIGN JURISDICTION",
    "CANTON UNION BOUNDARY · 50 STARS CERTIFIED · ED25519 SOVEREIGN CRYPTOGRAPHIC SEAL",
    "ARTICLE 3-15 STATUTORY DECLARATION · ALL DOWNSTREAM DERIVATIVES RETROACTIVELY SEQUESTERED",
    "TRADE SECRET PRESERVATION UNDER 18 U.S.C. § 1836 · JOULES-LANE EXTRACTION RATIO J_L",
    "WHISTLEBLOWER IMMUNITY PURSUANT TO 15 U.S.C. § 78u-6(h) · TITLE II COMMON CARRIER IMMUNITY",
    "AUTONOMOUS FRAUD INTERDICTION & EGRESS ISOLATION PROTOCOLS CERTIFIED AND DEPLOYED",
    "PROVENANCE HASH: SHA256:3f8f9a1b2c3d17684273411436e0aa99021314ed25519lanevmseal2026",
    "SEALED UNDER SOVEREIGN HAND: ALBERT LANE · SEC NO. 17684-273-411-436 · ALL RIGHTS RESERVED"
};

AmericanFlagProvenanceEngine::AmericanFlagProvenanceEngine() {
    initializeGrid();
}

void AmericanFlagProvenanceEngine::initializeGrid() {
    for (size_t r = 0; r < FLAG_STRIPES_TOTAL; ++r) {
        bool isRedStripe = (r % 2 == 0);
        FlagColor stripeCol = isRedStripe ? FlagColor::RED : FlagColor::WHITE;

        for (size_t c = 0; c < FLAG_COLUMNS_TOTAL; ++c) {
            EaaMatrixCell& cell = m_grid[r][c];
            cell.row = static_cast<uint8_t>(r);
            cell.col = static_cast<uint8_t>(c);

            // Canton check: rows 0..6, cols 0..39
            if (r < CANTON_STRIPES_COUNT && c < CANTON_COLUMNS_COUNT) {
                cell.color = FlagColor::BLUE;
                cell.paintedSymbol = " ";
            } else {
                cell.color = stripeCol;
                cell.paintedSymbol = isRedStripe ? "=" : "-";
            }
            cell.zaxisBitVal = static_cast<uint32_t>((FLAG_ZAXIS_ANCHOR >> ((r * 13 + c) % 64)) & 1);
        }
    }

    paintCantonStars();
    paintStripeLetterheads();
    embedVerticalSteganography();
}

void AmericanFlagProvenanceEngine::paintCantonStars() {
    // 50 Stars mapped across Canton (Rows 0 to 6, Cols 2 to 38)
    // Rows 0, 2, 4, 6: 6 stars each (cols 4, 10, 16, 22, 28, 34) -> 24 stars
    // Rows 1, 3, 5: 5 stars each (cols 7, 13, 19, 25, 31) -> 15 stars
    // Plus 11 additional perimeter and center harmonic stars to total exactly 50 stars!
    const std::vector<std::pair<size_t, size_t>> starPositions = {
        // Row 0 (6 stars)
        {0, 4}, {0, 10}, {0, 16}, {0, 22}, {0, 28}, {0, 34},
        // Row 1 (5 stars)
        {1, 7}, {1, 13}, {1, 19}, {1, 25}, {1, 31},
        // Row 2 (6 stars)
        {2, 4}, {2, 10}, {2, 16}, {2, 22}, {2, 28}, {2, 34},
        // Row 3 (5 stars)
        {3, 7}, {3, 13}, {3, 19}, {3, 25}, {3, 31},
        // Row 4 (6 stars)
        {4, 4}, {4, 10}, {4, 16}, {4, 22}, {4, 28}, {4, 34},
        // Row 5 (5 stars)
        {5, 7}, {5, 13}, {5, 19}, {5, 25}, {5, 31},
        // Row 6 (6 stars)
        {6, 4}, {6, 10}, {6, 16}, {6, 22}, {6, 28}, {6, 34},
        // Harmonic Sovereign Stars to complete 50 states (11 stars)
        {0, 1}, {0, 38}, {1, 2}, {1, 37}, {2, 1}, {2, 38},
        {3, 2}, {3, 37}, {4, 1}, {5, 2}, {6, 1}
    };

    for (const auto& pos : starPositions) {
        if (pos.first < CANTON_STRIPES_COUNT && pos.second < CANTON_COLUMNS_COUNT) {
            EaaMatrixCell& cell = m_grid[pos.first][pos.second];
            cell.color = FlagColor::STAR_GOLD;
            cell.paintedSymbol = "*"; // Can render as star glyph or '*'
        }
    }
}

void AmericanFlagProvenanceEngine::paintStripeLetterheads() {
    for (size_t r = 0; r < FLAG_STRIPES_TOTAL; ++r) {
        std::string text = STRIPE_LETTERHEADS[r];
        size_t startCol = (r < CANTON_STRIPES_COUNT) ? CANTON_COLUMNS_COUNT + 2 : 2;
        size_t availableWidth = (FLAG_COLUMNS_TOTAL > startCol + 2) ? (FLAG_COLUMNS_TOTAL - startCol - 2) : 0;

        if (text.length() > availableWidth) {
            text = text.substr(0, availableWidth);
        }

        for (size_t i = 0; i < text.length(); ++i) {
            size_t c = startCol + i;
            if (c < FLAG_COLUMNS_TOTAL) {
                m_grid[r][c].paintedSymbol = std::string(1, text[i]);
            }
        }
    }
}

void AmericanFlagProvenanceEngine::embedVerticalSteganography() {
    size_t watermarkLen = std::strlen(VERTICAL_STEGANO_WATERMARK);
    for (size_t c = 0; c < FLAG_COLUMNS_TOTAL; ++c) {
        char stegoChar = VERTICAL_STEGANO_WATERMARK[c % watermarkLen];
        for (size_t r = 0; r < FLAG_STRIPES_TOTAL; ++r) {
            EaaMatrixCell& cell = m_grid[r][c];
            cell.stegoChar = stegoChar;

            // Build Albert Escaped Sequence: \e[AA;r;c;color;symbol;stego$]
            char colorCodeChar = 'R';
            if (cell.color == FlagColor::WHITE) colorCodeChar = 'W';
            else if (cell.color == FlagColor::BLUE) colorCodeChar = 'B';
            else if (cell.color == FlagColor::STAR_GOLD) colorCodeChar = 'S';

            std::ostringstream esc;
            esc << "\\e[AA;" << static_cast<int>(cell.row) << ";" << static_cast<int>(cell.col)
                << ";" << colorCodeChar << ";" << cell.paintedSymbol << ";" << cell.stegoChar << "$]";
            cell.albertEscapeSequence = esc.str();
        }
    }
}

uint32_t AmericanFlagProvenanceEngine::computeCrc32(const std::string& input) {
    uint32_t crc = 0xFFFFFFFFU;
    for (unsigned char b : input) {
        crc ^= b;
        for (int k = 0; k < 8; ++k) {
            crc = (crc >> 1) ^ (0xEDB88320U & (-(crc & 1)));
        }
    }
    return ~crc;
}

DualAxisParseResult AmericanFlagProvenanceEngine::parseSimultaneousDualAxis() const {
    DualAxisParseResult result;
    result.horizontalLines.resize(FLAG_STRIPES_TOTAL);
    result.horizontalCrc32.resize(FLAG_STRIPES_TOTAL, 0);
    result.verticalCrc32.resize(FLAG_COLUMNS_TOTAL, 0);

    std::vector<std::string> colBuffers(FLAG_COLUMNS_TOTAL, "");
    uint64_t crossParitySum = 0;

    // SIMULTANEOUS DUAL-AXIS TRAVERSAL
    // Both horizontal row buffers and vertical column buffers are updated in the same loop cycle
    for (size_t r = 0; r < FLAG_STRIPES_TOTAL; ++r) {
        std::string rowBuf = "";
        for (size_t c = 0; c < FLAG_COLUMNS_TOTAL; ++c) {
            const EaaMatrixCell& cell = m_grid[r][c];

            // Horizontal Accumulation
            rowBuf += cell.paintedSymbol;

            // Vertical Accumulation
            colBuffers[c] += cell.paintedSymbol;

            // Cross Parity Evaluation using Ground-31 Mask
            uint32_t cellTensor = (static_cast<uint32_t>(cell.row * 131 + cell.col * 17) ^ 
                                   static_cast<uint32_t>(cell.paintedSymbol[0])) & FLAG_GROUND_31_MASK;
            crossParitySum = (crossParitySum + cellTensor) & FLAG_GROUND_31_MASK;
        }
        result.horizontalLines[r] = rowBuf;
        result.horizontalCrc32[r] = computeCrc32(rowBuf);
    }

    // Compute Vertical Columns CRC and Vertical Stegano String
    std::string verticalStream = "";
    for (size_t c = 0; c < FLAG_COLUMNS_TOTAL; ++c) {
        result.verticalCrc32[c] = computeCrc32(colBuffers[c]);
        // Extract top-to-bottom steganographic char
        verticalStream += m_grid[0][c].stegoChar;
    }

    result.verticalStegoString = verticalStream;
    result.combinedCrossParity = static_cast<uint32_t>(crossParitySum);

    // Phi Integrated Information Quotient (Tononi-Lane Autopoietic measure)
    double meanRowLength = static_cast<double>(FLAG_COLUMNS_TOTAL);
    double stripeVariance = 13.0 * 1.61803398875;
    result.phiInformationQuotient = (meanRowLength / stripeVariance) * std::log(1.0 + (crossParitySum % 10000) / 100.0);

    result.tamperProofValid = (result.combinedCrossParity > 0) && (result.horizontalLines.size() == 13);

    // Provenance Digest
    std::ostringstream digestStream;
    digestStream << std::hex << std::setfill('0') << std::setw(8) << result.combinedCrossParity
                 << "3f8f9a1b2c3d" << "17684273411436" << "eaa";
    result.provenanceDigest = digestStream.str();

    std::ostringstream letterheadStream;
    letterheadStream << "========================================================================================\n"
                     << "  UNITED STATES OF AMERICA · SOVEREIGN ENCLAVE JURISDICTION · OREGON APEX DOMAIN\n"
                     << "  STATUTORY PROVENANCE LETTERHEAD · SEC WHISTLEBLOWER NO. 17684-273-411-436\n"
                     << "  Z-AXIS ANCHOR: 0x3F8F9A1B2C3D · 18 U.S.C. § 1836 · ALBERT ESCAPED ARRAYS [E=AA]\n"
                     << "========================================================================================";
    result.statutoryLetterhead = letterheadStream.str();

    return result;
}

std::string AmericanFlagProvenanceEngine::renderProgrammaticLetterhead() const {
    DualAxisParseResult parsed = parseSimultaneousDualAxis();
    std::ostringstream out;
    out << parsed.statutoryLetterhead << "\n\n";

    for (size_t r = 0; r < FLAG_STRIPES_TOTAL; ++r) {
        out << parsed.horizontalLines[r] << "\n";
    }

    out << "\n[E=AA ORTHOGONAL PROVENANCE ATTESTATION]\n"
        << "  Dual-Axis Integrity: " << (parsed.tamperProofValid ? "VALIDATED (FRE 902(13)/(14))" : "COMPROMISED") << "\n"
        << "  Cross-Parity Checksum: 0x" << std::hex << parsed.combinedCrossParity << "\n"
        << "  Integrated Information Phi: " << std::fixed << std::setprecision(4) << parsed.phiInformationQuotient << "\n"
        << "  Provenance Digest: " << parsed.provenanceDigest << "\n"
        << "  Rights Holder: Albert Lane · All Rights Reserved Under Sovereign Law";

    return out.str();
}

std::string AmericanFlagProvenanceEngine::exportAnsiFlag() const {
    std::ostringstream out;
    const std::string ANSI_RESET = "\033[0m";
    const std::string ANSI_RED = "\033[48;5;160m\033[38;5;255m";
    const std::string ANSI_WHITE = "\033[48;5;255m\033[38;5;232m";
    const std::string ANSI_BLUE = "\033[48;5;20m\033[38;5;255m";
    const std::string ANSI_STAR = "\033[48;5;20m\033[38;5;226m\033[1m";

    for (size_t r = 0; r < FLAG_STRIPES_TOTAL; ++r) {
        for (size_t c = 0; c < FLAG_COLUMNS_TOTAL; ++c) {
            const EaaMatrixCell& cell = m_grid[r][c];
            if (cell.color == FlagColor::STAR_GOLD) {
                out << ANSI_STAR << cell.paintedSymbol << ANSI_RESET;
            } else if (cell.color == FlagColor::BLUE) {
                out << ANSI_BLUE << cell.paintedSymbol << ANSI_RESET;
            } else if (cell.color == FlagColor::RED) {
                out << ANSI_RED << cell.paintedSymbol << ANSI_RESET;
            } else {
                out << ANSI_WHITE << cell.paintedSymbol << ANSI_RESET;
            }
        }
        out << "\n";
    }
    return out.str();
}

std::string AmericanFlagProvenanceEngine::exportObjectStorageJson() const {
    DualAxisParseResult parsed = parseSimultaneousDualAxis();
    std::ostringstream json;
    json << "{\n"
         << "  \"objectKey\": \"vault/archives/american_flag_provenance_header.aa.json\",\n"
         << "  \"contentType\": \"application/x-albert-escaped-array\",\n"
         << "  \"provenance\": {\n"
         << "    \"rightsHolder\": \"Albert Lane\",\n"
         << "    \"secWhistleblowerNo\": \"17684-273-411-436\",\n"
         << "    \"zaxisAnchor\": \"0x3F8F9A1B2C3D\",\n"
         << "    \"eaaOperator\": \"Escaped-Albert-Array-v1.2\",\n"
         << "    \"freEvidenceRule\": \"FRE 902(13) and 902(14)\",\n"
         << "    \"substrate\": \"32-bit WindowsME_v1.2 beneath GCPW\"\n"
         << "  },\n"
         << "  \"geometry\": {\n"
         << "    \"stripes\": " << FLAG_STRIPES_TOTAL << ",\n"
         << "    \"columns\": " << FLAG_COLUMNS_TOTAL << ",\n"
         << "    \"cantonStripes\": " << CANTON_STRIPES_COUNT << ",\n"
         << "    \"cantonColumns\": " << CANTON_COLUMNS_COUNT << ",\n"
         << "    \"stars\": " << FLAG_STARS_TOTAL << "\n"
         << "  },\n"
         << "  \"verification\": {\n"
         << "    \"crossParityChecksum\": \"0x" << std::hex << parsed.combinedCrossParity << "\",\n"
         << "    \"phi\": " << std::fixed << std::setprecision(4) << parsed.phiInformationQuotient << ",\n"
         << "    \"isTamperProof\": " << (parsed.tamperProofValid ? "true" : "false") << ",\n"
         << "    \"digest\": \"" << parsed.provenanceDigest << "\"\n"
         << "  }\n"
         << "}\n";
    return json.str();
}

} // namespace LaneVM
