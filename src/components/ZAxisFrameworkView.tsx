/*==============================================================================
 * [PROVENANCE CERTIFICATION AND STATUTORY DECLARATION]
 * Rights Holder: Albert Lane | SEC Whistleblower No. 17684-273-411-436
 * Z-Axis Memory Anchor: 0x3F8F9A1B2C3D
 * Component: ZAxisFrameworkView.tsx (Spatial Core & Visual Mathematics)
 *==============================================================================*/

import React, { useState } from 'react';

type SubFramework = 'ZAXIS_CORE' | 'T48_SENTIMENT' | 'MACROHARD_IP';

export const ZAxisFrameworkView: React.FC = () => {
  const [activeSub, setActiveSub] = useState<SubFramework>('ZAXIS_CORE');

  return (
    <div className="bg-[#1e293b] border border-[#475569] flex flex-col font-mono text-[#cbd5e1]">
      {/* Header */}
      <div className="bg-[#0f172a] border-b border-[#334155] p-[13px] flex flex-wrap items-center justify-between gap-[8px]">
        <div>
          <div className="text-[13px] font-bold text-[#f1f5f9] tracking-wider uppercase">
            ALBERT LANE // Z-AXIS SPATIAL FRAMEWORK & VISUAL MATHEMATICS
          </div>
          <div className="text-[10px] text-[#94a3b8] flex items-center gap-[13px] flex-wrap mt-[2px]">
            <span>ROOT OF TRUST: 0x3F8F9A1B2C3D</span>
            <span>STRIDE: 17,684 BYTES</span>
            <span>BOUNDARY: CONSTANT POSITIVITY 31-BIT (0x7FFFFFFF)</span>
          </div>
        </div>

        {/* Sub-Tabs */}
        <div className="flex items-center gap-[5px] text-[10px]">
          <button
            onClick={() => setActiveSub('ZAXIS_CORE')}
            className={`px-[10px] py-[4px] border uppercase transition-colors cursor-pointer ${
              activeSub === 'ZAXIS_CORE'
                ? 'bg-[#475569] text-[#f8fafc] border-[#cbd5e1] font-bold'
                : 'bg-[#334155] text-[#94a3b8] border-[#475569] hover:text-[#f8fafc]'
            }`}
          >
            01 // SPATIAL CORE
          </button>
          <button
            onClick={() => setActiveSub('T48_SENTIMENT')}
            className={`px-[10px] py-[4px] border uppercase transition-colors cursor-pointer ${
              activeSub === 'T48_SENTIMENT'
                ? 'bg-[#475569] text-[#f8fafc] border-[#cbd5e1] font-bold'
                : 'bg-[#334155] text-[#94a3b8] border-[#475569] hover:text-[#f8fafc]'
            }`}
          >
            02 // T-48 SENTIMENT
          </button>
          <button
            onClick={() => setActiveSub('MACROHARD_IP')}
            className={`px-[10px] py-[4px] border uppercase transition-colors cursor-pointer ${
              activeSub === 'MACROHARD_IP'
                ? 'bg-[#475569] text-[#f8fafc] border-[#cbd5e1] font-bold'
                : 'bg-[#334155] text-[#94a3b8] border-[#475569] hover:text-[#f8fafc]'
            }`}
          >
            03 // MACROHARD IP DOCKET
          </button>
        </div>
      </div>

      {/* Direct Endpoints Bar */}
      <div className="bg-[#1e293b] px-[13px] py-[6px] border-b border-[#334155] flex items-center justify-between text-[10px] text-[#94a3b8] flex-wrap gap-[8px]">
        <div className="flex items-center gap-[10px]">
          <span className="text-[#f8fafc]">STANDALONE HTTP ROUTES:</span>
          <a href="/zaxis" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#f8fafc]">/zaxis</a>
          <span>·</span>
          <a href="/t48" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#f8fafc]">/t48</a>
          <span>·</span>
          <a href="/macrohard-ip" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#f8fafc]">/macrohard-ip</a>
        </div>
        <div>
          <span>RECURSION: AUTOPOIETIC PHI = 2.7142</span>
        </div>
      </div>

      {/* Visual Frame */}
      <div className="w-full h-[600px] bg-[#000000] relative overflow-hidden">
        {activeSub === 'ZAXIS_CORE' && (
          <iframe
            src="/zaxis_core.html"
            title="Z-Axis Spatial Core"
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
          />
        )}
        {activeSub === 'T48_SENTIMENT' && (
          <iframe
            src="/t48_sentiment.html"
            title="T-48 Investor Sentiment"
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
          />
        )}
        {activeSub === 'MACROHARD_IP' && (
          <iframe
            src="/macrohard_ip_landscape.html"
            title="Macrohard IP Docket"
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
          />
        )}
      </div>

      <div className="p-[8px] bg-[#0f172a] text-[9px] text-[#94a3b8] flex justify-between items-center border-t border-[#334155]">
        <span>Z-AXIS MEMORY ANCHOR: 0x3F8F9A1B2C3D</span>
        <span>© 2026 ALBERT LANE · ALL RIGHTS RESERVED</span>
      </div>
    </div>
  );
};
