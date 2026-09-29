import React from 'react';
import { CalculatorId, PrescribedItem } from '../types';
import { FileText, RotateCcw, Pill, Droplets } from 'lucide-react';

interface HeaderProps {
  activeCalc: CalculatorId;
  onSelectCalc: (id: CalculatorId) => void;
  onOpenPrescription: () => void;
  onResetActive: () => void;
  prescribedItemsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeCalc,
  onSelectCalc,
  onOpenPrescription,
  onResetActive,
  prescribedItemsCount
}) => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-2xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark with new official name */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSelectCalc('potassium');
              }}
              className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block animate-pulse"></span>
              JN Suíte Clínica
            </a>
            <span className="hidden sm:inline-block text-[11px] text-slate-400 font-medium">
              Calculadora médica
            </span>
          </div>

          {/* Zone 2: 4 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => onSelectCalc('potassium')}
              className={`hover:text-slate-900 transition-colors ${
                activeCalc === 'potassium' || activeCalc === 'sodium' || activeCalc === 'bicarbonate'
                  ? 'text-emerald-700 font-semibold underline underline-offset-8'
                  : ''
              }`}
            >
              Eletrólitos
            </button>
            <button
              onClick={() => onSelectCalc('gasometry')}
              className={`hover:text-slate-900 transition-colors ${
                activeCalc === 'gasometry'
                  ? 'text-emerald-700 font-semibold underline underline-offset-8'
                  : ''
              }`}
            >
              Gasometria Arterial
            </button>
            <button
              onClick={() => onSelectCalc('corrected-sodium')}
              className={`hover:text-slate-900 transition-colors ${
                activeCalc === 'corrected-sodium' || activeCalc === 'osmolarity' || activeCalc === 'anion-gap'
                  ? 'text-emerald-700 font-semibold underline underline-offset-8'
                  : ''
              }`}
            >
              Metabólico
            </button>
            <button
              onClick={() => onSelectCalc('antimicrobial')}
              className={`hover:text-slate-900 transition-colors ${
                activeCalc === 'antimicrobial'
                  ? 'text-emerald-700 font-semibold underline underline-offset-8'
                  : ''
              }`}
            >
              Antimicrobianos & TFG
            </button>
          </nav>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onResetActive}
              title="Restaurar valores padrão da calculadora ativa"
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenPrescription}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 whitespace-nowrap shadow-xs"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Prescrição & Evolução</span>
              {prescribedItemsCount > 0 && (
                <span className="px-1.5 py-0.2 bg-emerald-500 text-white font-mono text-[10px] rounded-full font-bold">
                  {prescribedItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
