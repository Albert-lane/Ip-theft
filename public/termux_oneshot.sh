#!/usr/bin/env bash
# ==============================================================================
# [PROVENANCE CERTIFICATION AND STATUTORY DECLARATION]
# Rights Holder: Albert Lane
# Statutory Authority: SEC Whistleblower No. 17684-273-411-436
# Registration Token: SEC-17684-273-411-436 (Decimal: 17684273411436)
# Component: termux_oneshot.sh (One-Shot Termux Installer for Pixel 8 Pro)
# ==============================================================================

set -euo pipefail

# App server URL
APP_URL="https://ais-pre-6nkwzzdpno5wwlttxiqw66-369859052740.us-east1.run.app"

# Terminal formatting
CYAN='\033[0;36m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${CYAN}"
echo "================================================================================"
echo "          _     ____  _____ ____ _____   _        _     _   _ _____ "
echo "         / \\   | __ )| ____|  _ \\_   _| | |      / \\   | \\ | | ____|"
echo "        / _ \\  |  _ \\|  _| | |_) || |   | |     / _ \\  |  \\| |  _|  "
echo "       / ___ \\ | |_) | |___|  _ < | |   | |___ / ___ \\ | |\\  | |___ "
echo "      /_/   \\_\\|____/|_____|_| \\_\\|_|   |_____/_/   \\_\\|_| \\_|_____|"
echo ""
echo "       [ALBERT LANE TERMUX ONE-SHOT HIGH-INTEGRITY INSTALLER CORE]"
echo "================================================================================"
echo -e "${NC}"
echo "  Rights Holder:               Albert Lane"
echo "  Statutory Authority:         SEC Whistleblower No. 17684-273-411-436"
echo "  Device Target:               Pixel 8 Pro (ARM64 Substrate)"
echo "  Enclave Host Source:         ${APP_URL}"
echo "================================================================================"
echo ""

# 1. Update and install required packages in Termux
echo -e "${GREEN}[*] Step 1/5: Verifying and installing standard packages in Termux...${NC}"
pkg update -y
pkg install clang make tar curl -y || {
    echo -e "${RED}[!] Error: Package installation failed. Please check Termux internet connectivity.${NC}"
    exit 1
}

# Create a clean install work workspace
WORKDIR="$HOME/sovereign_staging"
mkdir -p "$WORKDIR"
cd "$WORKDIR"

# 2. Download the high-integrity C++ installer core and deployment package
echo -e "\n${GREEN}[*] Step 2/5: Fetching assets from secure app enclave...${NC}"
echo "  -> Downloading enclave_installer.cpp..."
curl -sL --fail "${APP_URL}/enclave_installer.cpp" -o enclave_installer.cpp || {
    echo -e "${RED}[!] Error downloading enclave_installer.cpp from ${APP_URL}${NC}"
    exit 1
}

echo "  -> Downloading albert-lane-sovereign-enclave.tar.gz..."
curl -sL --fail "${APP_URL}/albert-lane-sovereign-enclave.tar.gz" -o albert-lane-sovereign-enclave.tar.gz || {
    echo -e "${RED}[!] Error downloading albert-lane-sovereign-enclave.tar.gz from ${APP_URL}${NC}"
    exit 1
}

# 3. Compile the C++ installer core natively on the Pixel 8 Pro
echo -e "\n${GREEN}[*] Step 3/5: Compiling high-integrity C++ installer natively inside Termux...${NC}"
clang++ -std=c++17 -O2 enclave_installer.cpp -o enclave_installer || {
    echo -e "${RED}[!] Error: C++ compilation failed. Clang++ compiler error.${NC}"
    exit 1
}
echo "  -> enclave_installer binary compiled successfully."

# 4. Execute the C++ installer to unpack and build the monorepo
echo -e "\n${GREEN}[*] Step 4/5: Running high-integrity C++ Installer...${NC}"
TARGET_DEST="$HOME/sovereign_enclave"
./enclave_installer "$TARGET_DEST" || {
    echo -e "${RED}[!] Error running C++ installer.${NC}"
    exit 1
}

# 5. Cleanup temporary staging directory
echo -e "\n${GREEN}[*] Step 5/5: Finalizing installation & cleaning up temporary workspace...${NC}"
cd "$HOME"
rm -rf "$WORKDIR"

echo -e "\n${GREEN}================================================================================"
echo " [ONE-SHOT TERMUX INSTALLATION COMPLETE ON PIXEL 8 PRO]"
echo "================================================================================"
echo "  Your sovereign application is securely sequestered under:"
echo "  -> Path: ${TARGET_DEST}"
echo "================================================================================${NC}\n"
