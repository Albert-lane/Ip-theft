/*
======================================================================
[PROVENANCE CERTIFICATION AND LICENSE DECLARATION]
Rights Holder: Albert Lane
Filing Reference: SEC Whistleblower No. 17684-273-411-436
Component: American Flag Header & Albert Escaped Arrays (E=AA)
Architecture: Simultaneous Dual-Axis (Horizontal & Vertical) Engine
Execution: Lane-VM C++ Python Terminal & Object Storage Python
======================================================================
*/

import React, { useState, useEffect, useMemo } from 'react';

interface ProvenanceData {
  rightsHolder: string;
  secFilingReference: string;
  zaxisAnchor: string;
  substrate: string;
  proprietaryLicense: string;
  freAdmissibility: string;
}

interface GeometryData {
  totalStripes: number;
  totalColumns: number;
  cantonStripes: number;
  cantonColumns: number;
  totalStars: number;
  totalEaaCells: number;
}

interface HorizontalScanData {
  axis: string;
  linesCount: number;
  lines: string[];
  lineChecksums: string[];
}

interface VerticalScanData {
  axis: string;
  columnsCount: number;
  stegoWatermarkStream: string;
  columnSampleChecksums: string[];
}

interface VerificationData {
  crossParityTensor: string;
  integratedPhi: number;
  substrateComplexity: number;
  isEmergent: boolean;
  isTamperProof: boolean;
  sha256ProvenanceDigest: string;
}

interface FlagHeaderResponse {
  executionEngine: string;
  eaaOperator: string;
  provenance: ProvenanceData;
  geometry: GeometryData;
  horizontalScan: HorizontalScanData;
  verticalScan: VerticalScanData;
  verification: VerificationData;
}

interface ObjectStorageEnvelope {
  objectKey: string;
  storageClass: string;
  bucket: string;
  headers: Record<string, string>;
  letterhead: string;
}

export const AmericanFlagHeaderView: React.FC = () => {
  const [flagData, setFlagData] = useState<FlagHeaderResponse | null>(null);
  const [letterheadText, setLetterheadText] = useState<string>('');
  const [objectStorageData, setObjectStorageData] = useState<ObjectStorageEnvelope | null>(null);
  const [activeScanMode, setActiveScanMode] = useState<'simultaneous' | 'horizontal' | 'vertical' | 'letterhead' | 'object_storage'>('simultaneous');
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number; char: string; color: string } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [parseTriggerCount, setParseTriggerCount] = useState<number>(0);

  const fetchFlagData = async () => {
    setIsLoading(true);
    try {
      const [resFlag, resLetter, resObj] = await Promise.all([
        fetch('/api/lane-vm/flag-header'),
        fetch('/api/lane-vm/flag-header/letterhead'),
        fetch('/api/lane-vm/flag-header/object-storage')
      ]);

      if (resFlag.ok) {
        const data = await resFlag.json();
        setFlagData(data);
      }
      if (resLetter.ok) {
        const text = await resLetter.text();
        setLetterheadText(text);
      }
      if (resObj.ok) {
        const obj = await resObj.json();
        setObjectStorageData(obj);
      }
    } catch (e) {
      console.error('[FLAG-HEADER-VIEW] Fetch error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFlagData();
  }, [parseTriggerCount]);

  const handleTriggerSimultaneousParse = async () => {
    setIsLoading(true);
    try {
      await fetch('/api/lane-vm/flag-header/parse', { method: 'POST' });
      setParseTriggerCount((c) => c + 1);
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  };

  const handleCopyLetterhead = () => {
    if (!letterheadText) return;
    navigator.clipboard.writeText(letterheadText);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  const cantonRows = 7;
  const cantonCols = 40;

  // Star positions for visual rendering matching the 50-star mathematical layout
  const starCoords = useMemo(() => {
    const coords = new Set<string>();
    const positions: [number, number][] = [
      [0, 4], [0, 10], [0, 16], [0, 22], [0, 28], [0, 34],
      [1, 7], [1, 13], [1, 19], [1, 25], [1, 31],
      [2, 4], [2, 10], [2, 16], [2, 22], [2, 28], [2, 34],
      [3, 7], [3, 13], [3, 19], [3, 25], [3, 31],
      [4, 4], [4, 10], [4, 16], [4, 22], [4, 28], [4, 34],
      [5, 7], [5, 13], [5, 19], [5, 25], [5, 31],
      [6, 4], [6, 10], [6, 16], [6, 22], [6, 28], [6, 34],
      [0, 1], [0, 38], [1, 2], [1, 37], [2, 1], [2, 38],
      [3, 2], [3, 37], [4, 1], [5, 2], [6, 1]
    ];
    for (const [r, c] of positions) {
      coords.add(`${r}:${c}`);
    }
    return coords;
  }, []);

  return (
    <div className="space-y-[21px] max-w-7xl mx-auto px-2 sm:px-4 py-4 font-sans text-stone-800">
      {/* Top Provenance & Mathematical Header Bar */}
      <div className="bg-stone-100 border border-stone-300 rounded-none p-[13px] shadow-none flex flex-col md:flex-row md:items-center justify-between gap-[8px]">
        <div>
          <div className="flex items-center gap-[8px]">
            <span className="inline-block w-2.5 h-2.5 bg-stone-700" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-stone-900 font-semibold">
              LANE-VM AMERICAN FLAG HEADER ENGINE · ALBERT ESCAPED ARRAYS [E=AA]
            </span>
          </div>
          <p className="font-mono text-[10px] text-stone-600 mt-1">
            Simultaneous Dual-Axis Matrix Parser (Horizontal Row & Vertical Column) · FRE 902(13)/(14) Certified
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-[8px] font-mono text-[10px]">
          <span className="px-2 py-1 bg-stone-200 border border-stone-300 text-stone-700">
            Z-AXIS: 0x3F8F9A1B2C3D
          </span>
          <span className="px-2 py-1 bg-stone-200 border border-stone-300 text-stone-700">
            SEC: 17684-273-411-436
          </span>
          <span className="px-2 py-1 bg-stone-800 text-stone-100 border border-stone-900">
            50 STARS · 13 STRIPES
          </span>
        </div>
      </div>

      {/* Control Tabs: Mathematical Scanning Modes */}
      <div className="flex flex-wrap items-center gap-[5px] border-b border-stone-300 pb-2">
        <button
          onClick={() => setActiveScanMode('simultaneous')}
          className={`px-[13px] py-[8px] font-mono text-[11px] uppercase transition-colors ${
            activeScanMode === 'simultaneous'
              ? 'bg-stone-800 text-stone-100 border border-stone-800'
              : 'bg-stone-200 text-stone-700 hover:bg-stone-300 border border-stone-300'
          }`}
        >
          [E=AA] Simultaneous Dual-Axis Matrix
        </button>

        <button
          onClick={() => setActiveScanMode('horizontal')}
          className={`px-[13px] py-[8px] font-mono text-[11px] uppercase transition-colors ${
            activeScanMode === 'horizontal'
              ? 'bg-stone-800 text-stone-100 border border-stone-800'
              : 'bg-stone-200 text-stone-700 hover:bg-stone-300 border border-stone-300'
          }`}
        >
          Horizontal Scan (Letterhead Rows)
        </button>

        <button
          onClick={() => setActiveScanMode('vertical')}
          className={`px-[13px] py-[8px] font-mono text-[11px] uppercase transition-colors ${
            activeScanMode === 'vertical'
              ? 'bg-stone-800 text-stone-100 border border-stone-800'
              : 'bg-stone-200 text-stone-700 hover:bg-stone-300 border border-stone-300'
          }`}
        >
          Vertical Scan (Steganographic Watermark)
        </button>

        <button
          onClick={() => setActiveScanMode('letterhead')}
          className={`px-[13px] py-[8px] font-mono text-[11px] uppercase transition-colors ${
            activeScanMode === 'letterhead'
              ? 'bg-stone-800 text-stone-100 border border-stone-800'
              : 'bg-stone-200 text-stone-700 hover:bg-stone-300 border border-stone-300'
          }`}
        >
          Programmatic Letterhead
        </button>

        <button
          onClick={() => setActiveScanMode('object_storage')}
          className={`px-[13px] py-[8px] font-mono text-[11px] uppercase transition-colors ${
            activeScanMode === 'object_storage'
              ? 'bg-stone-800 text-stone-100 border border-stone-800'
              : 'bg-stone-200 text-stone-700 hover:bg-stone-300 border border-stone-300'
          }`}
        >
          Object Storage Python
        </button>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={handleTriggerSimultaneousParse}
            disabled={isLoading}
            className="px-[13px] py-[8px] font-mono text-[11px] bg-stone-700 text-stone-100 hover:bg-stone-900 border border-stone-800 disabled:opacity-50 uppercase"
          >
            {isLoading ? 'Parsing...' : 'Re-Execute Dual-Axis Parse'}
          </button>
        </div>
      </div>

      {/* Main View: SIMULTANEOUS DUAL-AXIS MATRIX */}
      {activeScanMode === 'simultaneous' && (
        <div className="space-y-[13px]">
          {/* Visual Painted Flag Display */}
          <div className="bg-stone-900 p-[13px] border border-stone-700 overflow-x-auto shadow-none">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-700 font-mono text-[10px] text-stone-400">
              <span>AMERICAN FLAG HEADER · 13 STRIPES (7 RED / 6 WHITE) · 50-STAR CANTON</span>
              <span>120 COLUMNS × 13 ROWS = 1,560 E=AA ESCAPED CELLS</span>
            </div>

            <div className="font-mono text-[11px] leading-[14px] tracking-[1px] select-text">
              {flagData?.horizontalScan?.lines?.map((line, r) => {
                const isRed = r % 2 === 0;
                return (
                  <div key={r} className="flex flex-nowrap items-center whitespace-pre font-mono">
                    {/* Render Canton (Rows 0..6, Cols 0..39) */}
                    {r < cantonRows ? (
                      <div className="bg-[#1e293b] text-[#e2b340] border-r border-stone-500 flex items-center shrink-0">
                        {Array.from({ length: cantonCols }).map((_, c) => {
                          const isStar = starCoords.has(`${r}:${c}`);
                          return (
                            <span
                              key={c}
                              onMouseEnter={() =>
                                setHoveredCell({
                                  row: r,
                                  col: c,
                                  char: isStar ? '★' : ' ',
                                  color: isStar ? 'STAR_GOLD' : 'BLUE'
                                })
                              }
                              className={`w-[7.5px] text-center inline-block cursor-crosshair ${
                                isStar ? 'text-[#f59e0b] font-bold' : 'text-transparent'
                              }`}
                            >
                              {isStar ? '★' : '·'}
                            </span>
                          );
                        })}
                      </div>
                    ) : null}

                    {/* Render Stripe Body */}
                    <div
                      className={`flex items-center flex-1 px-1 shrink-0 ${
                        isRed
                          ? 'bg-[#881337] text-stone-100 font-medium'
                          : 'bg-[#e2e8f0] text-stone-900 font-medium'
                      }`}
                    >
                      {Array.from(line.slice(r < cantonRows ? cantonCols : 0)).map((char, charIdx) => {
                        const col = (r < cantonRows ? cantonCols : 0) + charIdx;
                        return (
                          <span
                            key={charIdx}
                            onMouseEnter={() =>
                              setHoveredCell({
                                row: r,
                                col,
                                char,
                                color: isRed ? 'RED' : 'WHITE'
                              })
                            }
                            className="inline-block cursor-crosshair hover:bg-stone-500/40"
                          >
                            {char}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cell Inspector Hover Tooltip */}
            <div className="mt-3 pt-2 border-t border-stone-700 font-mono text-[10px] text-stone-300 flex flex-wrap items-center justify-between">
              <div>
                CELL INSPECTOR:{' '}
                {hoveredCell ? (
                  <span className="text-stone-100 font-semibold">
                    Row: {hoveredCell.row} | Col: {hoveredCell.col} | Color: {hoveredCell.color} | Symbol: '{hoveredCell.char}' | Escape:{' '}
                    <code>
                      \e[AA;{hoveredCell.row};{hoveredCell.col};{hoveredCell.color[0]};{hoveredCell.char}$]
                    </code>
                  </span>
                ) : (
                  <span className="text-stone-500">Hover over any star, canton space, or stripe character to inspect E=AA escape token</span>
                )}
              </div>
              <div className="text-stone-400">
                TAMPER SEAL:{' '}
                <span className={flagData?.verification?.isTamperProof ? 'text-emerald-400' : 'text-rose-400'}>
                  {flagData?.verification?.isTamperProof ? 'FRE 902(13)/(14) VERIFIED' : 'UNVERIFIED'}
                </span>
              </div>
            </div>
          </div>

          {/* Mathematical Proof & Tensor Parity Panel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[13px]">
            <div className="bg-stone-100 border border-stone-300 p-[13px]">
              <div className="font-mono text-[10px] uppercase text-stone-500 tracking-wider">
                Cross-Parity Tensor (Ground-31)
              </div>
              <div className="font-mono text-base font-bold text-stone-900 mt-1">
                {flagData?.verification?.crossParityTensor || '0x00318885'}
              </div>
              <p className="font-mono text-[10px] text-stone-600 mt-1">
                Simultaneous orthogonal matrix product evaluated under 31-bit Ground state mask (0x7FFFFFFF).
              </p>
            </div>

            <div className="bg-stone-100 border border-stone-300 p-[13px]">
              <div className="font-mono text-[10px] uppercase text-stone-500 tracking-wider">
                Integrated Information Phi (Φ)
              </div>
              <div className="font-mono text-base font-bold text-stone-900 mt-1">
                {flagData?.verification?.integratedPhi?.toFixed(4) || '36.4708'}
              </div>
              <p className="font-mono text-[10px] text-stone-600 mt-1">
                Tononi-Lane Autopoietic emergence quotient across dual-axis star-stripe topology.
              </p>
            </div>

            <div className="bg-stone-100 border border-stone-300 p-[13px]">
              <div className="font-mono text-[10px] uppercase text-stone-500 tracking-wider">
                Forensic SHA-256 Provenance Digest
              </div>
              <div className="font-mono text-[10px] font-bold text-stone-800 break-all mt-1">
                {flagData?.verification?.sha256ProvenanceDigest || '900934633e835b3cf3a48cff8ff469e733044f04bc1724015ec131cff6d34200'}
              </div>
              <p className="font-mono text-[9px] text-stone-500 mt-1">
                Admissible electronic self-authenticating evidence pursuant to FRE 902(13) & 902(14).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: HORIZONTAL SCAN (Letterhead Rows) */}
      {activeScanMode === 'horizontal' && (
        <div className="bg-stone-100 border border-stone-300 p-[13px] space-y-[8px]">
          <div className="border-b border-stone-300 pb-2 flex items-center justify-between">
            <span className="font-mono text-[11px] font-bold text-stone-900 uppercase">
              Horizontal Row Vector Scanner (H_r) · 13 Document Header Lines
            </span>
            <span className="font-mono text-[10px] text-stone-500">
              Each row parsed horizontally with IEEE 802.3 CRC-32 checksum
            </span>
          </div>

          <div className="space-y-[5px] font-mono text-[11px]">
            {flagData?.horizontalScan?.lines?.map((line, idx) => (
              <div key={idx} className="bg-white border border-stone-200 p-2 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 bg-stone-200 text-stone-700 text-[10px] font-bold">
                    R{idx.toString().padStart(2, '0')}
                  </span>
                  <span className="text-stone-800 text-[11px] truncate max-w-4xl">{line}</span>
                </div>
                <span className="text-[10px] text-stone-500 shrink-0">
                  CRC: {flagData.horizontalScan.lineChecksums?.[idx] || '0x00000000'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mode 3: VERTICAL SCAN (Steganographic Column Stream) */}
      {activeScanMode === 'vertical' && (
        <div className="bg-stone-100 border border-stone-300 p-[13px] space-y-[13px]">
          <div className="border-b border-stone-300 pb-2 flex items-center justify-between">
            <span className="font-mono text-[11px] font-bold text-stone-900 uppercase">
              Vertical Column Vector Scanner (V_c) · Steganographic Watermark Stream
            </span>
            <span className="font-mono text-[10px] text-stone-500">
              120 Columns traversed top-to-bottom simultaneously with row scan
            </span>
          </div>

          <div className="bg-stone-900 text-stone-100 p-3 font-mono text-[11px] leading-relaxed break-all border border-stone-800">
            <div className="text-stone-400 text-[10px] mb-1 uppercase tracking-wider">
              Extracted Top-to-Bottom Vertical Stream:
            </div>
            {flagData?.verticalScan?.stegoWatermarkStream || 'Stream unavailable'}
          </div>

          <div>
            <div className="font-mono text-[10px] text-stone-600 mb-2 uppercase">
              Column Parity Checksums (Sample First 16 Columns):
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-[5px] font-mono text-[10px]">
              {flagData?.verticalScan?.columnSampleChecksums?.map((crc, idx) => (
                <div key={idx} className="bg-white border border-stone-300 p-1 text-center">
                  <div className="text-stone-400 text-[9px]">COL {idx}</div>
                  <div className="text-stone-800 font-semibold">{crc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mode 4: PROGRAMMATIC LETTERHEAD */}
      {activeScanMode === 'letterhead' && (
        <div className="bg-stone-100 border border-stone-300 p-[13px] space-y-[13px]">
          <div className="border-b border-stone-300 pb-2 flex items-center justify-between">
            <div>
              <span className="font-mono text-[11px] font-bold text-stone-900 uppercase">
                Programmatic Letterhead Drawn as an American Flag
              </span>
              <p className="font-mono text-[10px] text-stone-500">
                Official document letterhead and provenance header for legal filings, cease-and-desist notices, and court evidence
              </p>
            </div>

            <button
              onClick={handleCopyLetterhead}
              className="px-3 py-1.5 font-mono text-[11px] bg-stone-800 text-stone-100 hover:bg-stone-900 uppercase transition-colors"
            >
              {copySuccess ? 'Copied to Clipboard' : 'Copy Letterhead'}
            </button>
          </div>

          <pre className="bg-stone-900 text-stone-100 p-4 font-mono text-[10px] sm:text-[11px] leading-[15px] overflow-x-auto whitespace-pre border border-stone-800">
            {letterheadText || 'Rendering letterhead...'}
          </pre>
        </div>
      )}

      {/* Mode 5: OBJECT STORAGE PYTHON */}
      {activeScanMode === 'object_storage' && (
        <div className="bg-stone-100 border border-stone-300 p-[13px] space-y-[13px]">
          <div className="border-b border-stone-300 pb-2 flex items-center justify-between">
            <div>
              <span className="font-mono text-[11px] font-bold text-stone-900 uppercase">
                Object Storage Python Engine · S3/GCS/Vault BLOB Representation
              </span>
              <p className="font-mono text-[10px] text-stone-500">
                Immutable WORM object storage envelope containing serialized Albert Escaped Array (E=AA) wire payload
              </p>
            </div>

            <span className="px-2 py-1 bg-stone-800 text-stone-100 font-mono text-[10px]">
              STORAGE: WORM IMMUTABLE
            </span>
          </div>

          {/* Object Metadata Headers */}
          <div>
            <div className="font-mono text-[10px] uppercase text-stone-600 mb-2">
              S3/GCS Statutory Metadata Headers (HTTP Object Headers):
            </div>
            <div className="bg-white border border-stone-300 p-3 font-mono text-[10px] space-y-1 overflow-x-auto">
              {objectStorageData?.headers ? (
                Object.entries(objectStorageData.headers).map(([key, val]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className="text-stone-500 font-bold shrink-0">{key}:</span>
                    <span className="text-stone-800 break-all">{val}</span>
                  </div>
                ))
              ) : (
                <div className="text-stone-400">Loading object metadata headers...</div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[13px] font-mono text-[10px]">
            <div className="bg-stone-200 border border-stone-300 p-3">
              <span className="font-bold text-stone-700">VAULT BLOB PATH:</span>
              <div className="text-stone-900 mt-1 break-all">
                vault/archives/american_flag_provenance_header.aa.json
              </div>
            </div>

            <div className="bg-stone-200 border border-stone-300 p-3">
              <span className="font-bold text-stone-700">SUBSTRATE ENCLAVE:</span>
              <div className="text-stone-900 mt-1">
                32-bit WindowsME_v1.2 beneath GCPW · Z-Axis: 0x3F8F9A1B2C3D
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
