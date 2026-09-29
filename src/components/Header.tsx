import React from 'react';
import { CalculatorId } from '../types';
import { FileText, RotateCcw, AlertTriangle } from 'lucide-react';

interface HeaderProps {
  activeCalc: CalculatorId;
  onSelectCalc: (id: CalculatorId) => void;
  onOpenPrescription: () => void;
  onResetActive: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeCalc,
  onSelectCalc,
  onOpenPrescription,
  onResetActive
}) => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark */}
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
              MedCalc Suíte Clínica
            </a>
          </div>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => onSelectCalc('potassium')}
              className={`hover:text-slate-900 transition-colors ${
                activeCalc === 'potassium' || activeCalc === 'sodium' || activeCalc === 'bicarbonate'
                  ? 'text-emerald-700 font-semibold underline underline-offset-8'
                  : ''
              }`}
            >
              Eletrólitos (K/Na/HCO₃)
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
              Metabólico (EHH / CAD)
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

          {/* Zone 3: 1-2 primary actions */}
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
              className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Gerar Prescrição</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
