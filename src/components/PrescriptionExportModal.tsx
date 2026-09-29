import React, { useState } from 'react';
import { Copy, Check, Printer, X, Download, ShieldCheck } from 'lucide-react';

interface PrescriptionExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCalcTitle: string;
}

export const PrescriptionExportModal: React.FC<PrescriptionExportModalProps> = ({
  isOpen,
  onClose,
  activeCalcTitle
}) => {
  const [patientName, setPatientName] = useState('');
  const [bedNumber, setBedNumber] = useState('');
  const [physicianName, setPhysicianName] = useState('');
  const [crm, setCrm] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const fullReport = [
    `=======================================================`,
    `       MEDCALC SUÍTE CLÍNICA - EVOLUÇÃO / CONDUTA      `,
    `=======================================================`,
    `Data/Hora: ${currentDate}`,
    patientName ? `Paciente: ${patientName}` : `Paciente: Não identificado`,
    bedNumber ? `Leito/Unidade: ${bedNumber}` : `Leito/Unidade: UTI / Emergência`,
    physicianName ? `Médico(a): ${physicianName} ${crm ? `(CRM: ${crm})` : ''}` : `Emitido via MedCalc Suíte Clínica`,
    `-------------------------------------------------------`,
    `Módulo Calculado: ${activeCalcTitle}`,
    `-------------------------------------------------------`,
    `AVALIAÇÃO E CONDUTA:`,
    `1. Verificada compatibilidade de vias e diluições recomendadas.`,
    `2. Monitorização contínua de sinais vitais e gasometria/eletrólitos seriada.`,
    `3. Ajustes de dose executados conforme diretrizes institucionais.`,
    `=======================================================`
  ].join('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(fullReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h3 className="text-base font-bold text-slate-900">Gerar Registro de Evolução / Prescrição</h3>
        </div>

        <div className="space-y-3.5 mb-5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Nome do Paciente</label>
              <input
                type="text"
                placeholder="Ex: João da Silva"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Leito / Setor</label>
              <input
                type="text"
                placeholder="Ex: Leito 04 - UTI 2"
                value={bedNumber}
                onChange={(e) => setBedNumber(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Médico(a) Responsável</label>
              <input
                type="text"
                placeholder="Ex: Dr. José Pedro"
                value={physicianName}
                onChange={(e) => setPhysicianName(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">CRM / UF</label>
              <input
                type="text"
                placeholder="Ex: 123456/SP"
                value={crm}
                onChange={(e) => setCrm(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Preview box */}
        <div className="p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-xs mb-5 whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed border border-slate-800">
          {fullReport}
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Fechar
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir</span>
          </button>

          <button
            onClick={handleCopy}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado!' : 'Copiar Texto'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
