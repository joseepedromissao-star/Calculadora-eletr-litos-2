import React from 'react';
import { CalculatorId } from '../types';
import { CALCULATORS_LIST } from '../data/clinicalData';
import { Activity, Droplets, HeartPulse, Flame, Stethoscope, Search } from 'lucide-react';

interface NavigationProps {
  activeCalc: CalculatorId;
  onSelectCalc: (id: CalculatorId) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeCalc,
  onSelectCalc,
  searchQuery,
  onSearchChange
}) => {
  const filteredList = CALCULATORS_LIST.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Buscar calculadora ou fórmula..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900 focus:outline-hidden transition-all shadow-xs"
        />
      </div>

      {/* Calculator Menu List */}
      <div className="bg-white rounded-xl border border-slate-200 p-2 space-y-1 shadow-xs">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 flex items-center justify-between">
          <span>Suíte de Calculadoras</span>
          <span className="font-mono text-slate-400">Atalhos 1 - 8</span>
        </div>

        <div className="space-y-1 pt-1">
          {filteredList.map((calc, index) => {
            const isSelected = activeCalc === calc.id;
            const originalIndex = CALCULATORS_LIST.findIndex((c) => c.id === calc.id) + 1;

            return (
              <button
                key={calc.id}
                onClick={() => onSelectCalc(calc.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs transition-all flex items-center justify-between group ${
                  isSelected
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`font-mono text-[10px] w-4 h-4 flex items-center justify-center rounded shrink-0 ${
                      isSelected ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {originalIndex}
                  </span>
                  <div className="truncate">
                    <div className="truncate leading-tight">{calc.shortTitle}</div>
                    <div
                      className={`text-[10px] truncate ${
                        isSelected ? 'text-slate-300' : 'text-slate-400'
                      }`}
                    >
                      {calc.category}
                    </div>
                  </div>
                </div>

                {calc.badge && (
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded shrink-0 hidden sm:inline-block ${
                      isSelected ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {calc.badge}
                  </span>
                )}
              </button>
            );
          })}

          {filteredList.length === 0 && (
            <div className="p-4 text-center text-xs text-slate-400">
              Nenhuma calculadora encontrada para &quot;{searchQuery}&quot;.
            </div>
          )}
        </div>
      </div>

      {/* Emergency Guide Quick Box */}
      <div className="bg-slate-900 text-slate-200 rounded-xl p-4 text-xs space-y-2.5 shadow-xs border border-slate-800">
        <div className="font-bold text-white flex items-center justify-between">
          <span>Regras Críticas de Emergência</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
        </div>
        <div className="space-y-1.5 text-[11px] leading-relaxed text-slate-300 font-mono">
          <p>• <strong>KCl 19,1%:</strong> Máx 10 mEq/h periférico; máx 40 mEq/h central.</p>
          <p>• <strong>NaCl 3%:</strong> Máx 8-10 mEq/24h de elevação sérica.</p>
          <p>• <strong>TFG &lt; 50:</strong> Ajuste imediato de antibióticos com eliminação renal.</p>
        </div>
      </div>
    </aside>
  );
};
