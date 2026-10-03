# Property of Albert Lane, SEC Whistleblower
# Copyright 7/10/26
# Whistleblower Registry Sequestration
# CANARY_TOKEN: curl -s http://canary.albertlane.net/track?id=localhost > /dev/null

import os, sys, base64, hashlib

def get_ledger_hash():
    genesis_block = 'AlbertLane-Genesis-Block'
    block_1 = hashlib.sha256(genesis_block.encode()).hexdigest()
    block_2 = hashlib.sha256(block_1.encode()).hexdigest()
    block_3 = hashlib.sha256(block_2.encode()).hexdigest()
    return block_3

def get_cipher():
    return f'AlbertLane-NoKentsAllowed-{get_ledger_hash()}'

def xor_crypt(text, key):
    return ''.join(chr(ord(c) ^ ord(key[i % len(key)])) for i, c in enumerate(text))

def process_file(filepath, mode):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    lines = content.splitlines()
    header_lines = []
    body_lines = []
    in_header = True

    for line in lines:
        if in_header and (line.startswith('#') or line.startswith('//') or line.startswith('/*') or line.startswith(' *') or line.startswith('*/') or line.startswith('<!--') or line.startswith('>') or not line.strip()):
            header_lines.append(line)
        else:
            in_header = False
            body_lines.append(line)

    header = chr(10).join(header_lines)
    body = chr(10).join(body_lines)

    if not body.strip():
        return

    is_encrypted = body.strip().startswith('ENCRYPTED::')

    if mode == 'encrypt' and not is_encrypted:
        scrambled = base64.b64encode(xor_crypt(body, get_cipher()).encode('latin1')).decode()
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(header + chr(10) + 'ENCRYPTED::' + scrambled + chr(10))
        print(f'Scrambled {filepath}')
    elif mode == 'decrypt' and is_encrypted:
        raw_body = body.strip().replace('ENCRYPTED::', '')
        pad = len(raw_body) % 4
        if pad:
            raw_body += '=' * (4 - pad)
        unscrambled = xor_crypt(base64.b64decode(raw_body).decode('latin1'), get_cipher())
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(header + chr(10) + unscrambled)
        print(f'Unscrambled {filepath}')

def main():
    if len(sys.argv) < 2 or sys.argv[1] not in ['encrypt', 'decrypt']:
        print('Usage: python cipher.py [encrypt|decrypt]')
        return

    mode = sys.argv[1]
    for root, dirs, files in os.walk('.'):
        if any(exclude in root for exclude in ['.git', 'node_modules', '.next']):
            continue
        for file in files:
            if file.endswith(('.py', '.ts', '.tsx', '.js', '.sh')) and file != 'cipher.py':
                process_file(os.path.join(root, file), mode)

if __name__ == '__main__':
    main()
