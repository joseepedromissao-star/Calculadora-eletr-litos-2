import React, { useState, useEffect, useCallback } from 'react';
import { CalculatorId, ActivePrescriptionData, PrescribedItem, PatientPrescriptionInfo } from './types';
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

  // Active calculator data
  const [prescriptionData, setPrescriptionData] = useState<ActivePrescriptionData | null>(null);

  // Cumulative prescribed items (Electrolytes + Antimicrobials combined)
  const [prescribedItems, setPrescribedItems] = useState<PrescribedItem[]>([]);

  // Patient and physician details
  const [patientInfo, setPatientInfo] = useState<PatientPrescriptionInfo>({
    patientName: '',
    bedNumber: '',
    recordNumber: '',
    physicianName: '',
    crm: ''
  });

  // Keyboard shortcut listener (1-8 to switch calculators)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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

  const handleResetActive = () => {
    setResetKey((prev) => prev + 1);
  };

  const handleUpdatePrescription = useCallback((data: ActivePrescriptionData) => {
    setPrescriptionData(data);
  }, []);

  const handleAddPrescribedItem = useCallback((item: PrescribedItem) => {
    setPrescribedItems((prev) => {
      // Filter out previous version of the exact same category item if existing, or append
      const filtered = prev.filter((p) => p.title !== item.title);
      return [...filtered, item];
    });
  }, []);

  const handleRemovePrescribedItem = useCallback((id: string) => {
    setPrescribedItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleClearAllItems = useCallback(() => {
    setPrescribedItems([]);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-slate-900 selection:text-white">
      {/* Header */}
      <Header
        activeCalc={activeCalc}
        onSelectCalc={setActiveCalc}
        onOpenPrescription={() => setIsExportOpen(true)}
        onResetActive={handleResetActive}
        prescribedItemsCount={prescribedItems.length}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 no-print">
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
            {activeCalc === 'potassium' && (
              <PotassiumCalculator
                onUpdatePrescriptionData={handleUpdatePrescription}
                onOpenPrescriptionModal={() => setIsExportOpen(true)}
                onAddPrescribedItem={handleAddPrescribedItem}
              />
            )}
            {activeCalc === 'sodium' && (
              <SodiumCalculator
                onUpdatePrescriptionData={handleUpdatePrescription}
                onOpenPrescriptionModal={() => setIsExportOpen(true)}
                onAddPrescribedItem={handleAddPrescribedItem}
              />
            )}
            {activeCalc === 'bicarbonate' && (
              <BicarbonateCalculator
                onUpdatePrescriptionData={handleUpdatePrescription}
                onOpenPrescriptionModal={() => setIsExportOpen(true)}
                onAddPrescribedItem={handleAddPrescribedItem}
              />
            )}
            {activeCalc === 'gasometry' && (
              <GasometryCalculator
                onUpdatePrescriptionData={handleUpdatePrescription}
                onOpenPrescriptionModal={() => setIsExportOpen(true)}
              />
            )}
            {activeCalc === 'corrected-sodium' && (
              <CorrectedSodiumCalculator
                onUpdatePrescriptionData={handleUpdatePrescription}
                onOpenPrescriptionModal={() => setIsExportOpen(true)}
              />
            )}
            {activeCalc === 'osmolarity' && (
              <OsmolarityCalculator
                onUpdatePrescriptionData={handleUpdatePrescription}
                onOpenPrescriptionModal={() => setIsExportOpen(true)}
              />
            )}
            {activeCalc === 'anion-gap' && (
              <AnionGapCalculator
                onUpdatePrescriptionData={handleUpdatePrescription}
                onOpenPrescriptionModal={() => setIsExportOpen(true)}
              />
            )}
            {activeCalc === 'antimicrobial' && (
              <AntimicrobialCalculator
                onUpdatePrescriptionData={handleUpdatePrescription}
                onOpenPrescriptionModal={() => setIsExportOpen(true)}
                onAddPrescribedItem={handleAddPrescribedItem}
              />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">JN Suíte Clínica</span>
            <span>·</span>
            <span>Calculadora médica</span>
          </div>
          <div className="text-slate-400 text-center sm:text-right text-[11px]">
            Diretrizes clínicas baseadas em evidências. Uso profissional de apoio à decisão médica.
          </div>
        </div>
      </footer>

      {/* Export / Official Prescription Modal & PDF Print View */}
      <PrescriptionExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        prescriptionData={prescriptionData}
        prescribedItems={prescribedItems}
        onRemovePrescribedItem={handleRemovePrescribedItem}
        onClearAllItems={handleClearAllItems}
        patientInfo={patientInfo}
        onUpdatePatientInfo={setPatientInfo}
      />
    </div>
  );
}
