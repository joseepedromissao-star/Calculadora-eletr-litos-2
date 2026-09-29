import React, { useState, useEffect } from 'react';
import { CalculatorId } from './types';
import { CALCULATORS_LIST } from './data/clinicalData';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { PotassiumCalculator } from './components/calculators/PotassiumCalculator';
import { SodiumCalculator } from './components/calculators/SodiumCalculator';
import { BicarbonateCalculator } from './components/calculators/BicarbonateCalculator';
import { GasometryCalculator } from './components/calculators/GasometryCalculator';
import { CorrectedSodiumCalculator } from './components/calculators/CorrectedSodiumCalculator';
import { OsmolarityCalculator } from './components/calculators/OsmolarityCalculator';
import { AnionGapCalculator } from './components/calculators/AnionGapCalculator';
import { AntimicrobialCalculator } from './components/calculators/AntimicrobialCalculator';
import { PrescriptionExportModal } from './components/PrescriptionExportModal';

export default function App() {
  const [activeCalc, setActiveCalc] = useState<CalculatorId>('potassium');
  const [searchQuery, setSearchQuery] = useState('');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  // Keyboard shortcut listener (1-8 to switch calculators, matching CLI menu)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      const keyMap: Record<string, CalculatorId> = {
        '1': 'potassium',
        '2': 'sodium',
        '3': 'bicarbonate',
        '4': 'gasometry',
        '5': 'corrected-sodium',
        '6': 'osmolarity',
        '7': 'anion-gap',
        '8': 'antimicrobial'
      };

      if (keyMap[e.key]) {
        setActiveCalc(keyMap[e.key]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeCalcMeta = CALCULATORS_LIST.find((c) => c.id === activeCalc) || CALCULATORS_LIST[0];

  const handleResetActive = () => {
    setResetKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-slate-900 selection:text-white">
      {/* Top Bar Contract (Brand - 4 Nav Links - Action) */}
      <Header
        activeCalc={activeCalc}
        onSelectCalc={setActiveCalc}
        onOpenPrescription={() => setIsExportOpen(true)}
        onResetActive={handleResetActive}
      />

      {/* Main Workspace Frame */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Navigation Sidebar */}
          <Navigation
            activeCalc={activeCalc}
            onSelectCalc={setActiveCalc}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {/* Active Calculator Canvas Stage */}
          <div className="flex-1 min-w-0" key={`${activeCalc}-${resetKey}`}>
            {activeCalc === 'potassium' && <PotassiumCalculator />}
            {activeCalc === 'sodium' && <SodiumCalculator />}
            {activeCalc === 'bicarbonate' && <BicarbonateCalculator />}
            {activeCalc === 'gasometry' && <GasometryCalculator />}
            {activeCalc === 'corrected-sodium' && <CorrectedSodiumCalculator />}
            {activeCalc === 'osmolarity' && <OsmolarityCalculator />}
            {activeCalc === 'anion-gap' && <AnionGapCalculator />}
            {activeCalc === 'antimicrobial' && <AntimicrobialCalculator />}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">MedCalc Suíte Clínica</span>
            <span>·</span>
            <span>Urgência, Emergência, UTI & Terapia Intensiva</span>
          </div>
          <div className="text-slate-400 text-center sm:text-right text-[11px]">
            Diretrizes baseadas em Katz, Adrogué-Madias, Winter, Cockcroft-Gault & Schwartz. Uso profissional de apoio à decisão clínica.
          </div>
        </div>
      </footer>

      {/* Export / Prescription Modal */}
      <PrescriptionExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        activeCalcTitle={activeCalcMeta.title}
      />
    </div>
  );
}
