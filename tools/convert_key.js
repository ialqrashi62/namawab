//
// convert_key.js
// ---------------
// Convert an OpenSSH-format ed25519 private key (the "openssh-key-v1\0"
// container introduced by OpenSSH 6.5+) into a PuTTY PPK v2 file.
//
// Pure Node.js — only `crypto` and `fs` from the standard library.
// No third-party dependencies, no network, no subprocesses.
//
//   INPUT  : C:\Users\ice\.ssh\nama_medical_key        (OpenSSH, ed25519, no passphrase)
//            C:\Users\ice\.ssh\nama_medical_key.pub    (cross-check public key)
//   OUTPUT : C:\Users\ice\.ssh\nama_medical_key.ppk    (PPK v2)
//
// PPK v2 layout produced (matches PuTTY 0.7x source, "ssh-ed25519" + unencrypted):
//   PuTTY-User-Key-File-2: ssh-ed25519
//   Encryption: none
//   Comment: imported-from-openssh
//   Public-Lines: <n>
//   <base64, 64 chars/line, of 51-byte blob: u32(len("ssh-ed25519")) + "ssh-ed25519" + u32(len(pub)) + pub>
//   Private-Lines: <n>
//   <base64, 64 chars/line, of 64-byte blob: 32-byte private seed + 32-byte public key>
//   Private-MAC: <lower-hex SHA-256("putty-private-key-file-mac-key" || private_blob)>
//
// Usage:
//   node C:\Users\ice\Desktop\NMEDCALVSCODE\tools\convert_key.js

'use strict';

const fs     = require('fs');
const crypto = require('crypto');

const INPUT_KEY  = 'C:\\Users\\ice\\.ssh\\nama_medical_key';
const INPUT_PUB  = 'C:\\Users\\ice\\.ssh\\nama_medical_key.pub';
const OUTPUT_PPK = 'C:\\Users\\ice\\.ssh\\nama_medical_key.ppk';

const ALGO          = 'ssh-ed25519';
const PUB_LINE_W    = 64;   // PuTTY line width for the public section
const PRIV_LINE_W   = 64;   // PuTTY line width for the private section
const MAC_LITERAL   = 'putty-private-key-file-mac-key';
const MAGIC_OPENSSH = Buffer.from('openssh-key-v1\0', 'binary');

// ---------------------------------------------------------------------------
// Low-level SSH wire-format readers (all big-endian, all bounds-checked).
// ---------------------------------------------------------------------------

function readU32(buf, off) {
  if (off + 4 > buf.length) {
    throw new Error('readU32: underflow at offset ' + off +
                    ' (need 4 bytes, have ' + (buf.length - off) + ')');
  }
  return { value: buf.readUInt32BE(off), next: off + 4 };
}

function readSshString(buf, off) {
  const len = readU32(buf, off);
  const start = len.next;
  const end   = start + len.value;
  if (end > buf.length) {
    throw new Error('readSshString: underflow at offset ' + off +
                    ' (declared length ' + len.value + ' bytes, only ' +
                    (buf.length - start) + ' available)');
  }
  return { value: buf.slice(start, end), next: end };
}

function writeU32(n) {
  const b = Buffer.alloc(4);
  b.writeUInt32BE(n >>> 0, 0);
  return b;
}

// ---------------------------------------------------------------------------
// OpenSSH private key file → raw bytes.
// ---------------------------------------------------------------------------

function readOpenSSHFile(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  let b64 = '';
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('-----')) continue;
    b64 += line;
  }
  if (!b64) {
    throw new Error('OpenSSH file appears empty: ' + filePath);
  }
  return Buffer.from(b64, 'base64');
}

// ---------------------------------------------------------------------------
// Parse the "openssh-key-v1" container.
// ---------------------------------------------------------------------------

function parseOpenSSHPrivate(buf) {
  if (buf.length < 15 || !buf.slice(0, 15).equals(MAGIC_OPENSSH)) {
    throw new Error('Not an OpenSSH v1 key (bad magic header)');
  }

  let off = 15;

  const cipher     = readSshString(buf, off); off = cipher.next;
  const kdf        = readSshString(buf, off); off = kdf.next;
  const kdfOptions = readSshString(buf, off); off = kdfOptions.next;
  const numKeys    = readU32(buf, off);       off = numKeys.next;

  if (numKeys.value !== 1) {
    throw new Error('Unsupported: numKeys = ' + numKeys.value + ' (only 1 is supported)');
  }
  if (cipher.value.toString('utf8') !== 'none' ||
      kdf.value.toString('utf8')    !== 'none') {
    throw new Error('Unsupported: key is encrypted (cipher=' + cipher.value +
                    ', kdf=' + kdf.value + '). Passphrase-less keys only.');
  }
  if (kdfOptions.value.length !== 0) {
    throw new Error('Unsupported: kdf options are non-empty (len=' +
                    kdfOptions.value.length + ')');
  }

  const pubBlob  = readSshString(buf, off); off = pubBlob.next;
  const privBlob = readSshString(buf, off); off = privBlob.next;

  // --- public sub-blob:  string "ssh-ed25519"  +  string <32 bytes> ---
  const pubAlgo = readSshString(pubBlob.value, 0);
  const pubKey  = readSshString(pubBlob.value, pubAlgo.next);
  if (pubAlgo.value.toString('utf8') !== ALGO) {
    throw new Error('Unsupported public algorithm: ' + pubAlgo.value);
  }
  if (pubKey.value.length !== 32) {
    throw new Error('Expected 32-byte ed25519 public key, got ' + pubKey.value.length);
  }

  // --- private sub-blob ---
  // OpenSSH layout inside the unencrypted `openssh-key-v1` private blob:
  //   u32 checkint1
  //   u32 checkint2                 (must equal checkint1)
  //   string keytype                (e.g. "ssh-ed25519")
  //   string publickey              (raw 32 bytes for ed25519)
  //   string privatekey-list        (compound, ed25519 = single pair)
  //     string "ssh-ed25519"
  //     string <32-byte seed>       (this is what we want)
  //   string comment
  //   1-byte...0x00...padding       (ignored)
  const pb = privBlob.value;
  let poff = 0;

  const c1 = readU32(pb, poff); poff = c1.next;
  const c2 = readU32(pb, poff); poff = c2.next;
  if (c1.value !== c2.value) {
    throw new Error('OpenSSH checkint mismatch (' + c1.value + ' != ' + c2.value + ')');
  }

  const privAlgo = readSshString(pb, poff); poff = privAlgo.next;
  if (privAlgo.value.toString('utf8') !== ALGO) {
    throw new Error('Unsupported private algorithm: ' + privAlgo.value);
  }

  // Embedded public key inside the private blob (must match the public sub-blob).
  const privPub = readSshString(pb, poff); poff = privPub.next;
  if (privPub.value.length !== 32) {
    throw new Error('Expected 32-byte ed25519 public key in private blob, got ' +
                    privPub.value.length);
  }
  if (!privPub.value.equals(pubKey.value)) {
    throw new Error('Public key inside the private blob does not match the public blob.');
  }

  // Private-key list (one or more inner pairs: algorithm || key-material).
  const privList = readSshString(pb, poff);
  const listAlgo = readSshString(privList.value, 0);
  if (listAlgo.value.toString('utf8') !== ALGO) {
    throw new Error('Unsupported private-list algorithm: ' + listAlgo.value);
  }
  const privSeed = readSshString(privList.value, listAlgo.next);
  if (privSeed.value.length !== 32) {
    throw new Error('Expected 32-byte ed25519 private seed, got ' + privSeed.value.length);
  }

  return {
    algorithm:   ALGO,
    privateSeed: privSeed.value,
    publicKey:   pubKey.value,
  };
}

// ---------------------------------------------------------------------------
// Cross-check against the .pub file (ssh-ed25519 AAAA... user@host).
// ---------------------------------------------------------------------------

function readPubFile(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const text  = fs.readFileSync(filePath, 'utf8').trim();
  const parts = text.split(/\s+/);
  if (parts.length < 2) {
    throw new Error('Malformed .pub file: ' + filePath);
  }
  const buf = Buffer.from(parts[1], 'base64');
  // Layout: u32(11) + "ssh-ed25519" + u32(32) + <32 bytes> = 51 bytes
  if (buf.length < 47) {
    throw new Error('.pub blob too small: ' + buf.length + ' bytes');
  }
  return { algo: parts[0], publicKey: buf.slice(buf.length - 32) };
}

// ---------------------------------------------------------------------------
// Build the PPK v2 file content.
// ---------------------------------------------------------------------------

function base64Wrap(buf, width) {
  const b64 = buf.toString('base64');
  const out = [];
  for (let i = 0; i < b64.length; i += width) {
    out.push(b64.slice(i, i + width));
  }
  return out;
}

function buildPPK(algorithm, privateSeed, publicKey) {
  if (algorithm !== ALGO) {
    throw new Error('buildPPK only supports ' + ALGO);
  }
  const algo = Buffer.from(algorithm, 'utf8');

  // Public blob: u32(len("ssh-ed25519")) + "ssh-ed25519" + u32(32) + <32 bytes>
  //            = 4 + 11 + 4 + 32 = 51 bytes
  const pubBlob = Buffer.concat([
    writeU32(algo.length),
    algo,
    writeU32(publicKey.length),
    publicKey,
  ]);

  // Private blob (PuTTY v2 for unencrypted ed25519):
  //            <32-byte private seed> + <32-byte public key> = 64 bytes
  const privBlob = Buffer.concat([privateSeed, publicKey]);

  // MAC key: SHA-256( "putty-private-key-file-mac-key" || privateBlob )
  // Then we output the digest hex-encoded as the Private-MAC line.
  // (PuTTY verifies this same way: SHA-256 over the literal string then
  //  the private blob, treated as the MAC key — for unencrypted keys the
  //  digest itself is also the MAC value.)
  const mac = crypto.createHash('sha256')
    .update(Buffer.from(MAC_LITERAL, 'utf8'))
    .update(privBlob)
    .digest('hex');

  const pubLines  = base64Wrap(pubBlob,  PUB_LINE_W);
  const privLines = base64Wrap(privBlob, PRIV_LINE_W);

  const lines = [];
  lines.push('PuTTY-User-Key-File-2: ' + algorithm);
  lines.push('Encryption: none');
  lines.push('Comment: imported-from-openssh');
  lines.push('Public-Lines: ' + pubLines.length);
  for (const l of pubLines)  lines.push(l);
  lines.push('Private-Lines: ' + privLines.length);
  for (const l of privLines) lines.push(l);
  lines.push('Private-MAC: ' + mac);

  // PPK files use CRLF line endings (PuTTY tolerates LF, but CRLF is canonical).
  return lines.join('\r\n') + '\r\n';
}

// ---------------------------------------------------------------------------
// Driver.
// ---------------------------------------------------------------------------

function main() {
  console.log('[1/5] Reading OpenSSH private key : ' + INPUT_KEY);
  const raw = readOpenSSHFile(INPUT_KEY);
  console.log('      Decoded payload size         : ' + raw.length + ' bytes');

  console.log('[2/5] Parsing openssh-key-v1 container ...');
  const parsed = parseOpenSSHPrivate(raw);
  console.log('      Algorithm                    : ' + parsed.algorithm);
  console.log('      Private seed (32B, hex)      : ' + parsed.privateSeed.toString('hex'));
  console.log('      Public key   (32B, hex)      : ' + parsed.publicKey.toString('hex'));

  console.log('[3/5] Cross-checking with .pub file ...');
  const fromPub = readPubFile(INPUT_PUB);
  if (fromPub) {
    console.log('      Algorithm (.pub)             : ' + fromPub.algo);
    if (!fromPub.publicKey.equals(parsed.publicKey)) {
      throw new Error('Public key from .pub file does NOT match the private key blob!');
    }
    console.log('      Public keys match             : OK');
  } else {
    console.log('      (no .pub file found, cross-check skipped)');
  }

  console.log('[4/5] Building PPK v2 content ...');
  const ppk = buildPPK(parsed.algorithm, parsed.privateSeed, parsed.publicKey);

  console.log('[5/5] Writing PPK to ' + OUTPUT_PPK);
  fs.writeFileSync(OUTPUT_PPK, ppk, { encoding: 'utf8' });
  const written = fs.statSync(OUTPUT_PPK).size;
  console.log('      Wrote ' + written + ' bytes');

  console.log('');
  console.log('========== BEGIN PPK FILE CONTENT ==========');
  process.stdout.write(ppk);
  console.log('==========  END PPK FILE CONTENT  ==========');
}

try {
  main();
} catch (err) {
  console.error('FATAL: ' + (err && err.stack ? err.stack : err));
  process.exit(1);
}
