/*==============================================================================
 * [PROVENANCE CERTIFICATION AND STATUTORY DECLARATION]
 * Rights Holder: Albert Lane | SEC Whistleblower No. 17684-273-411-436
 * Component: SovereignPackagingView.tsx (Deployment Archives & Termux Tool)
 *==============================================================================*/

import React, { useState } from 'react';

export const SovereignPackagingView: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const termuxCmd = "curl -sL https://ais-pre-6nkwzzdpno5wwlttxiqw66-369859052740.us-east1.run.app/termux | bash";

  const copyTermux = () => {
    navigator.clipboard.writeText(termuxCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-[21px] font-mono text-[#cbd5e1]">
      {/* Header */}
      <div className="bg-[#1e293b] border border-[#475569] p-[13px] flex flex-wrap items-center justify-between gap-[13px]">
        <div>
          <div className="text-[13px] font-bold text-[#f1f5f9] tracking-wider uppercase">
            SOVEREIGN ENCLAVE // PACKAGING ENGINE & API HOSTING
          </div>
          <div className="text-[10px] text-[#94a3b8] mt-[3px]">
            Target Domain: albertlane.net · API: api.albertlane.net · Memory Anchor: 0x3F8F9A1B2C3D
          </div>
        </div>
        <div className="text-[10px] text-[#34d399] font-bold">
          IMMUTABLE PRESERVATION SEAL: ACTIVE
        </div>
      </div>

      {/* Termux One-Shot Section */}
      <div className="bg-[#1e293b] border border-[#475569] p-[13px]">
        <div className="text-[11px] font-bold text-[#f8fafc] uppercase mb-[5px]">
          PIXEL 8 PRO / ANDROID TERMUX ONE-SHOT COMMAND
        </div>
        <p className="text-[10px] text-[#94a3b8] mb-[8px]">
          Installs compilation dependencies, fetches the sovereign C++ installer, compiles clang++ binary, and deploys the enclave directly onto mobile storage:
        </p>
        <div className="flex items-center gap-[8px] bg-[#0f172a] border border-[#334155] p-[8px]">
          <code className="text-[10px] text-[#f8fafc] flex-1 select-all overflow-x-auto whitespace-nowrap">
            {termuxCmd}
          </code>
          <button
            onClick={copyTermux}
            className="px-[10px] py-[4px] text-[9px] font-bold bg-[#334155] hover:bg-[#475569] text-[#f8fafc] border border-[#94a3b8] cursor-pointer"
          >
            {copied ? 'COPIED!' : 'COPY COMMAND'}
          </button>
        </div>
      </div>

      {/* Package Downloads Table */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[13px]">
        <div className="bg-[#1e293b] border border-[#475569] p-[13px] flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-bold text-[#f8fafc] uppercase">TARBALL PACKAGE (.TAR.GZ)</div>
            <div className="text-[9px] text-[#94a3b8] mt-[3px]">Gzip Compressed Universal Enclave</div>
            <div className="text-[8px] text-[#64748b] mt-[8px] break-all font-mono">
              SHA-256: 7392640181e88fe9092d1b60113967ff5064cbc98bec28f57c4cc546452bc106
            </div>
          </div>
          <a
            href="/albert-lane-sovereign-enclave.tar.gz"
            download
            className="mt-[13px] block text-center py-[6px] text-[10px] font-bold bg-[#334155] hover:bg-[#475569] text-[#f8fafc] border border-[#94a3b8]"
          >
            DOWNLOAD .TAR.GZ
          </a>
        </div>

        <div className="bg-[#1e293b] border border-[#475569] p-[13px] flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-bold text-[#f8fafc] uppercase">7ZIP ARCHIVE (.7Z)</div>
            <div className="text-[9px] text-[#94a3b8] mt-[3px]">LZMA2 Maximum Compression</div>
            <div className="text-[8px] text-[#64748b] mt-[8px] break-all font-mono">
              SHA-256: b0a842076791eba1b2094111dab5993b863a1aadd745229109923c291d5c25fa
            </div>
          </div>
          <a
            href="/albert-lane-sovereign-enclave.7z"
            download
            className="mt-[13px] block text-center py-[6px] text-[10px] font-bold bg-[#334155] hover:bg-[#475569] text-[#f8fafc] border border-[#94a3b8]"
          >
            DOWNLOAD .7Z
          </a>
        </div>

        <div className="bg-[#1e293b] border border-[#475569] p-[13px] flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-bold text-[#f8fafc] uppercase">COMBINED ZIP (.ZIP)</div>
            <div className="text-[9px] text-[#94a3b8] mt-[3px]">Windows / macOS Native Decompress</div>
            <div className="text-[8px] text-[#64748b] mt-[8px] break-all font-mono">
              SHA-256: dec1e6b3e4a6dce2f085ac98d47095ec986ea1feafb2ffff03b9044c6c3eb894
            </div>
          </div>
          <a
            href="/albert-lane-sovereign-enclave.zip"
            download
            className="mt-[13px] block text-center py-[6px] text-[10px] font-bold bg-[#334155] hover:bg-[#475569] text-[#f8fafc] border border-[#94a3b8]"
          >
            DOWNLOAD .ZIP
          </a>
        </div>
      </div>
    </div>
  );
};
