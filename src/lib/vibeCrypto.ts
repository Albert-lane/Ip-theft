/*======================================================================
[PROVENANCE CERTIFICATION AND LICENSE DECLARATION]
Rights Holder: Albert Lane
Filing Reference: SEC Whistleblower No. 17684-273-411-436
License: Albert Lane Proprietary License v1.2
======================================================================*/

export type SortField =
  | 'timestamp_asc'
  | 'timestamp_desc'
  | 'priority_asc'
  | 'priority_desc'
  | 'stream'
  | 'ecosystem';

export interface EncryptedWireEnvelope {
  ciphertext: string;
  iv: string;
  authTag: string;
  salt: string;
  nonce: string;
  timestamp: number;
  provenanceHash: string;
  metadata: {
    sortTimestamp: number;
    priority: number;
    stream: 'stdout' | 'stderr' | 'enclave' | 'provenance' | 'vibe';
    ecosystem?: string;
    vibeScore?: number;
    category?: string;
    commandId?: string;
  };
}

export interface DecryptedTerminalEntry {
  id: string;
  plaintext: string;
  stream: 'stdout' | 'stderr' | 'enclave' | 'provenance' | 'vibe';
  timestamp: number;
  priority: number;
  ecosystem: string;
  provenanceHash: string;
  isEncryptedWire: boolean;
  rawWire?: EncryptedWireEnvelope;
}

export async function encryptTerminalCommandUI(
  rawCmd: string,
  secret = 'albert-lane-sovereign-provenance-key-2026-sec-whistleblower'
): Promise<EncryptedWireEnvelope> {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 10000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );

  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    derivedKey,
    enc.encode(rawCmd)
  );

  const tagLength = 16;
  const ciphertextBytes = new Uint8Array(encryptedBuffer.slice(0, encryptedBuffer.byteLength - tagLength));
  const authTagBytes = new Uint8Array(encryptedBuffer.slice(encryptedBuffer.byteLength - tagLength));

  function bufToHex(buf: Uint8Array) {
    return Array.from(buf).map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  function bufToBase64(buf: Uint8Array) {
    let binary = '';
    for (let i = 0; i < buf.length; i++) {
      binary += String.fromCharCode(buf[i]);
    }
    return btoa(binary);
  }

  const nonce = Math.random().toString(36).substring(2, 10);
  const now = Date.now();

  return {
    ciphertext: bufToBase64(ciphertextBytes),
    iv: bufToHex(iv),
    authTag: bufToHex(authTagBytes),
    salt: bufToHex(salt),
    nonce,
    timestamp: now,
    provenanceHash: 'SEC-17684-273-411-436',
    metadata: {
      sortTimestamp: now,
      priority: 10,
      stream: 'stdout',
      ecosystem: 'lane-pm',
    },
  };
}

export async function decryptTerminalEnvelopeUI(
  envelope: EncryptedWireEnvelope,
  secret = 'albert-lane-sovereign-provenance-key-2026-sec-whistleblower'
): Promise<string> {
  try {
    function hexToBuf(hex: string) {
      const match = hex.match(/.{1,2}/g);
      if (!match) return new Uint8Array();
      return new Uint8Array(match.map((byte) => parseInt(byte, 16)));
    }

    function base64ToBuf(b64: string) {
      const binary = atob(b64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return bytes;
    }

    const salt = hexToBuf(envelope.salt);
    const iv = hexToBuf(envelope.iv);
    const authTag = hexToBuf(envelope.authTag);
    const ciphertext = base64ToBuf(envelope.ciphertext);

    // Concatenate ciphertext + authTag for WebCrypto AES-GCM
    const combined = new Uint8Array(ciphertext.length + authTag.length);
    combined.set(ciphertext, 0);
    combined.set(authTag, ciphertext.length);

    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      enc.encode(secret),
      'PBKDF2',
      false,
      ['deriveKey']
    );

    const derivedKey = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 10000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );

    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      derivedKey,
      combined
    );

    return new TextDecoder().decode(decryptedBuffer);
  } catch {
    // If decryption fails, fallback
    return `[ENCRYPTED WIRE ENVELOPE: ${envelope.ciphertext.slice(0, 32)}...]`;
  }
}

export function sortTerminalEntries(
  entries: DecryptedTerminalEntry[],
  sortField: SortField,
  streamFilter = 'all'
): DecryptedTerminalEntry[] {
  let filtered = entries;
  if (streamFilter !== 'all') {
    filtered = entries.filter((e) => e.stream === streamFilter);
  }

  const copy = [...filtered];
  switch (sortField) {
    case 'timestamp_asc':
      return copy.sort((a, b) => a.timestamp - b.timestamp);
    case 'timestamp_desc':
      return copy.sort((a, b) => b.timestamp - a.timestamp);
    case 'priority_asc':
      return copy.sort((a, b) => a.priority - b.priority);
    case 'priority_desc':
      return copy.sort((a, b) => b.priority - a.priority);
    case 'stream':
      return copy.sort((a, b) => a.stream.localeCompare(b.stream));
    case 'ecosystem':
      return copy.sort((a, b) => a.ecosystem.localeCompare(b.ecosystem));
    default:
      return copy;
  }
}
