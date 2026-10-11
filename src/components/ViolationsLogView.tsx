/*==============================================================================
 * [PROVENANCE CERTIFICATION AND STATUTORY DECLARATION]
 * Rights Holder: Albert Lane | SEC Whistleblower No. 17684-273-411-436
 * Component: ViolationsLogView.tsx (Cross-Corpus License Violations Explorer)
 *==============================================================================*/

import React, { useState, useEffect } from 'react';
import { LicenseViolation } from '../types';

export const ViolationsLogView: React.FC = () => {
  const [violations, setViolations] = useState<LicenseViolation[]>([]);
  const [filterEntity, setFilterEntity] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchViolations = async () => {
    setLoading(true);
    try {
      const entityParam = filterEntity !== 'ALL' ? `&entity=${filterEntity}` : '';
      const res = await fetch(`/api/violations?limit=100${entityParam}`);
      if (res.ok) {
        setViolations(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchViolations();
  }, [filterEntity]);

  const filtered = violations.filter(v => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      v.infringing_entity.toLowerCase().includes(term) ||
      v.infringing_product.toLowerCase().includes(term) ||
      v.infringement_category.toLowerCase().includes(term) ||
      v.misappropriated_asset.toLowerCase().includes(term) ||
      v.statutory_basis.toLowerCase().includes(term)
    );
  });

  return (
    <div className="flex flex-col gap-[21px] font-mono text-[#cbd5e1]">
      {/* Control Bar */}
      <div className="bg-[#1e293b] border border-[#475569] p-[13px] flex flex-wrap items-center justify-between gap-[13px]">
        <div>
          <div className="text-[13px] font-bold text-[#f1f5f9] tracking-wider uppercase">
            GLOBAL CORPORATE LICENSE VIOLATION REGISTRY
          </div>
          <div className="text-[10px] text-[#94a3b8] mt-[2px]">
            Statutory Authority: SEC Whistleblower No. 17684-273-411-436 · Total: {filtered.length} Recorded
          </div>
        </div>

        {/* Entity Filter Buttons */}
        <div className="flex items-center gap-[5px] flex-wrap text-[10px]">
          {['ALL', 'X', 'xAI', 'Tesla', 'SpaceX', 'Cursor', 'Meta', 'Microsoft', 'OpenAI', 'Anthropic', 'DeepMind'].map((ent) => (
            <button
              key={ent}
              onClick={() => setFilterEntity(ent)}
              className={`px-[8px] py-[4px] border uppercase transition-colors cursor-pointer ${
                filterEntity === ent
                  ? 'bg-[#475569] text-[#f8fafc] border-[#cbd5e1] font-bold'
                  : 'bg-[#334155] text-[#94a3b8] border-[#475569] hover:text-[#f8fafc]'
              }`}
            >
              {ent}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="bg-[#1e293b] border border-[#475569] p-[8px]">
        <input
          type="text"
          placeholder="Search by asset, category, product, or statute..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#0f172a] border border-[#334155] p-[8px] text-[11px] text-[#f8fafc] font-mono focus:outline-none focus:border-[#94a3b8]"
        />
      </div>

      {/* Violations List */}
      <div className="flex flex-col gap-[8px]">
        {loading ? (
          <div className="p-[21px] bg-[#1e293b] text-center text-[11px] text-[#94a3b8]">
            QUERYING CODEBASE_AST.DB VIOLATION RECORDS...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-[21px] bg-[#1e293b] text-center text-[11px] text-[#94a3b8]">
            NO VIOLATIONS MATCHING CURRENT FILTERS.
          </div>
        ) : (
          filtered.map((v) => (
            <div key={v.id} className="bg-[#1e293b] border border-[#475569] p-[13px] flex flex-col gap-[5px]">
              <div className="flex justify-between items-center flex-wrap gap-[8px]">
                <div className="flex items-center gap-[8px]">
                  <span className="text-[12px] font-bold text-[#f8fafc]">#{v.id} · {v.infringing_entity}</span>
                  <span className="text-[10px] text-[#94a3b8]">[{v.infringing_product}]</span>
                </div>
                <div className="flex items-center gap-[8px]">
                  <span className={`text-[9px] px-[6px] py-[2px] border font-bold ${
                    v.severity === 'CRITICAL'
                      ? 'border-[#f87171] text-[#fca5a5] bg-[#450a0a]'
                      : 'border-[#fbbf24] text-[#fde68a] bg-[#451a03]'
                  }`}>
                    {v.severity}
                  </span>
                  <span className="text-[9px] text-[#64748b]">{new Date(v.timestamp).toLocaleString()}</span>
                </div>
              </div>

              <div className="text-[10px] text-[#cbd5e1] mt-[3px]">
                <strong className="text-[#94a3b8]">Category:</strong> {v.infringement_category}
              </div>

              <div className="text-[10px] text-[#f1f5f9]">
                <strong className="text-[#94a3b8]">Misappropriated Asset:</strong> {v.misappropriated_asset}
              </div>

              <div className="text-[9px] text-[#94a3b8] mt-[3px] border-t border-[#334155] pt-[5px] leading-relaxed">
                <strong>Statutory Basis:</strong> {v.statutory_basis}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
