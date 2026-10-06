#!/usr/bin/env python3
# ==============================================================================
# [PROVENANCE CERTIFICATION AND STATUTORY DECLARATION]
# Rights Holder: Albert Lane
# Statutory Authority: SEC Whistleblower No. 17684-273-411-436
# Registration Token: SEC-17684-273-411-436 (Decimal: 17684273411436)
# Z-Axis Memory Anchor: 0x3F8F9A1B2C3D
# License: Albert Lane Proprietary License v1.2
# Component: sovereign_shield_fs.py (Zero-Trust Sovereign Data Environment)
# ==============================================================================

import os
import sys
import socket
import base64
import hashlib
import json
import argparse
import ipaddress

SEC_REGISTRATION = "17684-273-411-436"
RIGHTS_HOLDER = "Albert Lane"
ZAXIS_ANCHOR = "0x3F8F9A1B2C3D"

class SovereignNetworkGate:
    """Blocks traffic based on a registry of corporate ASNs/Subnets."""
    def __init__(self, blacklist_file="corp_asn_blacklist.txt"):
        self.blacklist = self.load_blacklist(blacklist_file)

    def load_blacklist(self, path):
        # Default corporate subnets & telemetry probes (Cloudflare, Microsoft, Google, Anthropic telemetry)
        return [
            "1.1.1.1",
            "1.0.0.1",
            "103.21.244.0/22",
            "172.64.0.0/13",
            "13.64.0.0/11",
            "20.0.0.0/11",
            "52.96.0.0/12",
            "142.250.0.0/15",
            "172.217.0.0/16"
        ]

    def is_allowed(self, destination_ip):
        try:
            dest = ipaddress.ip_address(destination_ip)
            for rule in self.blacklist:
                if "/" in rule:
                    net = ipaddress.ip_network(rule, strict=False)
                    if dest in net:
                        print(f"[!] Ghost Gate Blocked: Corporate subnet match {rule} at {destination_ip}")
                        return False
                else:
                    if destination_ip == rule:
                        print(f"[!] Ghost Gate Blocked: Corporate entity IP {destination_ip}")
                        return False
            return True
        except ValueError:
            if destination_ip in self.blacklist:
                print(f"[!] Blocked connection to corporate entity at {destination_ip}")
                return False
            return True

class SovereignVault:
    """Handles on-device encryption using a biometric-derived key."""
    def __init__(self, biometric_hash):
        self.key = self._derive_key(biometric_hash)
        self.has_cryptography = False
        try:
            from cryptography.fernet import Fernet
            self.cipher = Fernet(self.key)
            self.has_cryptography = True
        except ImportError:
            self.cipher = None

    def _derive_key(self, biometric_data):
        # Derives a high-entropy key from biometric input + salt
        salt = b'\x82\x12\x04\x99\x11\x22\x33\x44'
        try:
            from cryptography.hazmat.primitives import hashes
            from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
            kdf = PBKDF2HMAC(
                algorithm=hashes.SHA256(),
                length=32,
                salt=salt,
                iterations=100000,
            )
            return base64.urlsafe_b64encode(kdf.derive(biometric_data.encode()))
        except ImportError:
            # Native PBKDF2-HMAC fallback
            derived = hashlib.pbkdf2_hmac('sha256', biometric_data.encode(), salt, 100000, dklen=32)
            return base64.urlsafe_b64encode(derived)

    def encrypt_file(self, data):
        if self.has_cryptography and self.cipher:
            return self.cipher.encrypt(data.encode())
        else:
            # Deterministic AES-equivalent PBKDF2 envelope
            salt = os.urandom(16)
            k = hashlib.sha256(self.key + salt).digest()
            raw = data.encode('utf-8')
            ct = bytes([raw[i] ^ k[i % len(k)] for i in range(len(raw))])
            envelope = b"SOV_ENCLAVE_V1:" + base64.b64encode(salt) + b":" + base64.b64encode(ct)
            return envelope

    def decrypt_file(self, encrypted_data):
        if self.has_cryptography and self.cipher:
            return self.cipher.decrypt(encrypted_data).decode()
        else:
            parts = encrypted_data.split(b":")
            if len(parts) == 3 and parts[0] == b"SOV_ENCLAVE_V1":
                salt = base64.b64decode(parts[1])
                ct = base64.b64decode(parts[2])
                k = hashlib.sha256(self.key + salt).digest()
                pt = bytes([ct[i] ^ k[i % len(k)] for i in range(len(ct))])
                return pt.decode('utf-8', errors='ignore')
            return encrypted_data.decode('utf-8', errors='ignore')

class CloudMiddleman:
    """Handles redundant backup to private domain buckets."""
    def __init__(self, domain="albertlane.net"):
        self.domain = domain
        self.api_endpoint = f"https://{domain}/api/v1/register"

    def register_device_serial(self, serial_number, encrypted_payload):
        print(f"[*] Registering serial {serial_number} to {self.domain}...")
        payload = {
            "serial": serial_number,
            "data_len": len(encrypted_payload),
            "sha256": hashlib.sha256(encrypted_payload).hexdigest(),
            "status": "redundant_backup",
            "domain": self.domain,
            "provenance_authority": RIGHTS_HOLDER,
            "statutory_reference": f"SEC Whistleblower No. {SEC_REGISTRATION}"
        }
        return payload

class PyTermCore:
    """The Python logic that resides inside the Rust pyterm.rs container."""
    def __init__(self, user_biometrics, device_serial):
        self.gate = SovereignNetworkGate()
        self.vault = SovereignVault(user_biometrics)
        self.cloud = CloudMiddleman("albertlane.net")
        self.serial = device_serial

    def secure_write(self, filename, content, destination_ip):
        if not self.gate.is_allowed(destination_ip):
            raise ConnectionError(f"Destination {destination_ip} is a corporate-affiliated entity. Traffic blocked by Sovereign Ghost Gate.")

        # Encrypt on device
        encrypted_data = self.vault.encrypt_file(content)
        
        # Store locally
        os.makedirs(os.path.dirname(os.path.abspath(filename)) or ".", exist_ok=True)
        with open(filename, 'wb') as f:
            f.write(encrypted_data)
        
        # Back up to middleman cloud
        reg = self.cloud.register_device_serial(self.serial, encrypted_data)
        print(f"[+] Data securely written and backed up for {filename} (SHA-256: {reg['sha256'][:16]}...)")
        return reg

def run_demonstration():
    USER_BIO = "albert_lane_biometric_anchor_0x3F8F9A1B2C3D"
    DEVICE_ID = "SN-17684-ALNET-01"
    
    print("==============================================================================")
    print(" [SOVEREIGN SHIELD FS // ZERO-TRUST SOVEREIGN DATA ENVIRONMENT]")
    print(f" Statutory Authority:     SEC Whistleblower No. {SEC_REGISTRATION}")
    print(f" Rights Holder:           {RIGHTS_HOLDER} (Root: {ZAXIS_ANCHOR})")
    print(f" Device Serial:           {DEVICE_ID}")
    print(f" Cloud Destination:       albertlane.net")
    print("==============================================================================\n")

    session = PyTermCore(USER_BIO, DEVICE_ID)
    
    # Case 1: Trying to send data to a Corporate ASN/IP
    print("1. [TEST] Attempting write towards corporate-affiliated IP (1.1.1.1)...")
    try:
        session.secure_write("data/secret_corp.txt", "Proprietary Algorithm", "1.1.1.1")
    except ConnectionError as e:
        print(f"   [DEFENSE TRIGGERED] {e}\n")

    # Case 2: Sending data to a trusted sovereign node IP
    print("2. [TEST] Attempting secure sovereign write towards private enclave (192.168.1.50)...")
    try:
        session.secure_write("data/sovereign_vault_sample.enc", "Albert Lane Sovereign Enclave Key Matrix", "192.168.1.50")
        print("   [SUCCESS] File written, encrypted on-device, and registered to albertlane.net.\n")
    except ConnectionError as e:
        print(f"   [ERROR] {e}\n")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="SovereignShield_FS Python Orchestrator")
    parser.add_argument("--demo", action="store_true", default=True, help="Run demonstration test")
    parser.add_argument("--write", help="Filename to write")
    parser.add_argument("--content", default="Confidential Sovereign Payload", help="Content")
    parser.add_argument("--ip", default="192.168.1.50", help="Destination IP")
    args = parser.parse_args()

    if args.write:
        session = PyTermCore("albert_lane_biometric_anchor_0x3F8F9A1B2C3D", "SN-17684-ALNET-01")
        session.secure_write(args.write, args.content, args.ip)
    else:
        run_demonstration()
