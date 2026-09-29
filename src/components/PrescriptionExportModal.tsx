import React, { useState } from 'react';
import { Copy, Check, Printer, X, ShieldCheck, FileCheck, Trash2, Plus, Calendar, User, Bed, Stethoscope, FileText, Download } from 'lucide-react';
import { ActivePrescriptionData, PrescribedItem, PatientPrescriptionInfo } from '../types';

interface PrescriptionExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  prescriptionData: ActivePrescriptionData | null;
  prescribedItems: PrescribedItem[];
  onRemovePrescribedItem: (id: string) => void;
  onClearAllItems: () => void;
  patientInfo: PatientPrescriptionInfo;
  onUpdatePatientInfo: (info: PatientPrescriptionInfo) => void;
}

export const PrescriptionExportModal: React.FC<PrescriptionExportModalProps> = ({
  isOpen,
  onClose,
  prescriptionData,
  prescribedItems,
  onRemovePrescribedItem,
  onClearAllItems,
  patientInfo,
  onUpdatePatientInfo
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'frente' | 'verso'>('preview');
  const [copied, setCopied] = useState(false);

  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Effective items to display: either cumulative prescribed items, or current active calculator conduct
  const currentActiveConduct =
    prescriptionData?.conductOptions.find((c) => c.id === prescriptionData.selectedConductId) ||
    prescriptionData?.conductOptions[0];

  const itemsToRender: { id: string; title: string; orderText: string; justificationText: string; parameters: string[] }[] =
    prescribedItems.length > 0
      ? prescribedItems
      : currentActiveConduct
      ? [
          {
            id: 'current-active',
            title: prescriptionData?.calculatorTitle || 'Conduta Ativa',
            orderText: currentActiveConduct.prescriptionText,
            justificationText: currentActiveConduct.description || 'Conduta calculada conforme parâmetros clínicos inseridos.',
            parameters: prescriptionData?.parametersSummary || []
          }
        ]
      : [];

  // Plain text export string
  const plainTextReport = [
    `======================================================================`,
    `               JN SUÍTE CLÍNICA - PRESCRIÇÃO MÉDICA HOSPITALAR        `,
    `======================================================================`,
    `Data/Hora: ${currentDate}`,
    `Paciente: ${patientInfo.patientName || 'Não identificado'} | Leito: ${patientInfo.bedNumber || 'CTI/Emergência'} | Pront: ${patientInfo.recordNumber || 'S/N'}`,
    `Médico(a): ${patientInfo.physicianName || 'Médico Assistente'} | CRM: ${patientInfo.crm || 'Não informado'}`,
    `----------------------------------------------------------------------`,
    `[FRENTE] ITENS DA PRESCRIÇÃO MÉDICA (ELETRÓLITOS & ANTIMICROBIANOS):`,
    ...itemsToRender.map((it, idx) => `ITEM ${idx + 1}: ${it.title}\n${it.orderText}\n`),
    `----------------------------------------------------------------------`,
    `[VERSO] EVOLUÇÃO CLÍNICA & JUSTIFICATIVA FARMACOLÓGICA:`,
    ...itemsToRender.map((it, idx) => `• ITEM ${idx + 1} (${it.title}):\n  - Justificativa: ${it.justificationText}\n  - Parâmetros: ${it.parameters.join(' | ')}\n`),
    `======================================================================`
  ].join('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(plainTextReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([plainTextReport], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const sanitizedName = patientInfo.patientName ? patientInfo.patientName.trim().replace(/\s+/g, '_') : 'Paciente';
    a.download = `Prescricao_JN_Suite_Clinica_${sanitizedName}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Interactive Modal (hidden during print) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs no-print">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    Prescrição Médica & Evolução Clínica (PDF Frente e Verso)
                  </h3>
                  <p className="text-xs text-slate-500">
                    JN Suíte Clínica · Calculadora médica
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* View Tabs */}
          <div className="flex items-center justify-between pt-3 pb-1 border-b border-slate-100">
            <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 font-bold rounded-md transition-colors ${
                  activeTab === 'preview' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Visão Geral ({itemsToRender.length} {itemsToRender.length === 1 ? 'item' : 'itens'})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('frente')}
                className={`px-3 py-1.5 font-bold rounded-md transition-colors ${
                  activeTab === 'frente' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Frente (Prescrição)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('verso')}
                className={`px-3 py-1.5 font-bold rounded-md transition-colors ${
                  activeTab === 'verso' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Verso (Evolução / Justificativa)
              </button>
            </div>

            {prescribedItems.length > 0 && (
              <button
                type="button"
                onClick={onClearAllItems}
                className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 font-semibold transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Limpar lista</span>
              </button>
            )}
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto flex-1 py-3.5 space-y-4 pr-1">
            {/* Patient Header Inputs */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Identificação do Paciente & Prescritor
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">Nome do Paciente</label>
                  <input
                    type="text"
                    placeholder="Ex: Carlos Eduardo"
                    value={patientInfo.patientName}
                    onChange={(e) => onUpdatePatientInfo({ ...patientInfo, patientName: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">Leito / Setor</label>
                  <input
                    type="text"
                    placeholder="Ex: Leito 04 - CTI"
                    value={patientInfo.bedNumber}
                    onChange={(e) => onUpdatePatientInfo({ ...patientInfo, bedNumber: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">Prontuário</label>
                  <input
                    type="text"
                    placeholder="Ex: 984321"
                    value={patientInfo.recordNumber}
                    onChange={(e) => onUpdatePatientInfo({ ...patientInfo, recordNumber: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">Médico(a) / CRM</label>
                  <input
                    type="text"
                    placeholder="Ex: Dr. José Pedro / CRM-SP"
                    value={patientInfo.physicianName}
                    onChange={(e) => onUpdatePatientInfo({ ...patientInfo, physicianName: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* TAB: PREVIEW / ALL ITEMS */}
            {activeTab === 'preview' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Itens Ativos na Prescrição (Eletrólitos + Antimicrobianos)
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {itemsToRender.length} {itemsToRender.length === 1 ? 'item incluso' : 'itens inclusos'}
                  </span>
                </div>

                {itemsToRender.map((item, idx) => (
                  <div key={item.id || idx} className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-mono text-[10px] font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{item.title}</span>
                      </div>

                      {item.id !== 'current-active' && (
                        <button
                          type="button"
                          onClick={() => onRemovePrescribedItem(item.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                          title="Remover este item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="p-2.5 bg-slate-900 text-slate-200 rounded-lg font-mono text-xs whitespace-pre-wrap leading-relaxed">
                      {item.orderText}
                    </div>

                    <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-md">
                      <strong>Justificativa clínica:</strong> {item.justificationText}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB: FRENTE (PRESCRIÇÃO) */}
            {activeTab === 'frente' && (
              <div className="p-5 bg-white border border-slate-300 rounded-xl space-y-4 shadow-sm font-sans">
                <div className="text-center border-b border-slate-200 pb-3">
                  <h4 className="text-sm font-extrabold uppercase tracking-wide text-slate-900">
                    JN Suíte Clínica - Prescrição Médica Hospitalar
                  </h4>
                  <p className="text-[11px] text-slate-500">Página 1 (Frente do Documento)</p>
                </div>

                <div className="text-xs text-slate-700 grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-lg">
                  <div><strong>Paciente:</strong> {patientInfo.patientName || '_____________________________________'}</div>
                  <div><strong>Leito/Setor:</strong> {patientInfo.bedNumber || 'CTI / Emergência'}</div>
                  <div><strong>Data/Hora:</strong> {currentDate}</div>
                  <div><strong>Médico:</strong> {patientInfo.physicianName || 'Dr(a). __________________________'}</div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="text-xs font-bold uppercase text-slate-700 tracking-wider">Itens Prescritos:</div>
                  {itemsToRender.map((it, idx) => (
                    <div key={idx} className="p-3 border border-slate-200 rounded-lg font-mono text-xs text-slate-900 leading-relaxed whitespace-pre-wrap bg-slate-50/50">
                      {`ITEM ${idx + 1}:\n${it.orderText}`}
                    </div>
                  ))}
                </div>

                <div className="pt-6 mt-4 border-t border-slate-200 flex justify-end">
                  <div className="text-center w-64">
                    <div className="border-b border-slate-400 w-full mb-1"></div>
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">Carimbo e Assinatura Médica</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: VERSO (EVOLUÇÃO & JUSTIFICATIVA) */}
            {activeTab === 'verso' && (
              <div className="p-5 bg-white border border-slate-300 rounded-xl space-y-4 shadow-sm font-sans">
                <div className="text-center border-b border-slate-200 pb-3">
                  <h4 className="text-sm font-extrabold uppercase tracking-wide text-slate-900">
                    JN Suíte Clínica - Evolução Clínica & Justificativa Farmacológica
                  </h4>
                  <p className="text-[11px] text-slate-500">Página 2 (Verso do Documento)</p>
                </div>

                <div className="space-y-3 pt-1">
                  {itemsToRender.map((it, idx) => (
                    <div key={idx} className="p-3 border border-slate-200 rounded-lg text-xs text-slate-800 space-y-1.5 bg-slate-50/50">
                      <div className="font-bold text-slate-900 text-xs">
                        Item {idx + 1}: {it.title}
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        <strong>Racional e Justificativa de Dose:</strong> {it.justificationText}
                      </p>
                      {it.parameters.length > 0 && (
                        <div className="text-[11px] text-slate-500 font-mono pt-1">
                          Parâmetros laboratoriais: {it.parameters.join(' · ')}
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-lg text-xs text-amber-950 space-y-1">
                    <div className="font-bold">Metas de Segurança e Monitorização Obrigatória:</div>
                    <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                      <li>Infusões de potássio ou bicarbonato estritamente controladas por Bomba de Infusão Contínua (BIC).</li>
                      <li>Correção de sódio monitorada com dosagem sérica seriada a cada 2 a 4h (limite 8-10 mEq/24h).</li>
                      <li>Reavaliação dos antimicrobianos guiada por hemoculturas e antibiograma definitivo em 48 a 72h.</li>
                    </ul>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-200 flex justify-end">
                  <div className="text-center w-64">
                    <div className="border-b border-slate-400 w-full mb-1"></div>
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">Assinatura do Médico Assistente</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Fechar
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado!' : 'Copiar Texto'}</span>
              </button>

              <button
                onClick={handleDownload}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
                title="Baixar arquivo de texto com a prescrição e evolução"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>Baixar (.txt)</span>
              </button>

              <button
                onClick={handlePrint}
                className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Printer className="w-3.5 h-3.5 text-emerald-400" />
                <span>Imprimir / Salvar em PDF (Frente & Verso)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* DEDICATED PRINT DOCUMENT (Visible ONLY when printing to paper or PDF!) */}
      <div className="print-only font-sans text-slate-900 p-2">
        {/* ========================================================= */}
        {/* PAGE 1: FRENTE - PRESCRIÇÃO MÉDICA HOSPITALAR             */}
        {/* ========================================================= */}
        <div className="print-page flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="border-b-2 border-slate-900 pb-3 mb-4 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                  JN SUÍTE CLÍNICA
                </h1>
                <p className="text-xs uppercase tracking-wider text-slate-600 font-bold">
                  PRESCRIÇÃO MÉDICA HOSPITALAR
                </p>
              </div>
              <div className="text-right text-xs">
                <div className="font-bold">Data/Hora: {currentDate}</div>
                <div className="text-slate-500 font-mono text-[10px]">DOCUMENTO CLÍNICO OFICIAL</div>
              </div>
            </div>

            {/* Patient Box */}
            <div className="border border-slate-300 rounded-lg p-3 text-xs mb-5 grid grid-cols-2 gap-2 bg-slate-50">
              <div><strong>PACIENTE:</strong> {patientInfo.patientName || '_________________________________________'}</div>
              <div><strong>LEITO / UNIDADE:</strong> {patientInfo.bedNumber || 'CTI / EMERGÊNCIA'}</div>
              <div><strong>PRONTUÁRIO:</strong> {patientInfo.recordNumber || '____________________'}</div>
              <div><strong>MÉDICO PRESCRITOR:</strong> {patientInfo.physicianName || 'Dr(a). ____________________'}</div>
            </div>

            {/* Prescription Items */}
            <div className="space-y-4">
              <h2 className="text-xs font-extrabold uppercase tracking-wider border-b border-slate-300 pb-1 text-slate-800">
                ITENS PRESCRITOS (REPOSIÇÃO DE ELETRÓLITOS & ANTIMICROBIANOS):
              </h2>

              {itemsToRender.map((it, idx) => (
                <div key={idx} className="border border-slate-300 rounded-lg p-3 text-xs font-mono whitespace-pre-wrap leading-relaxed bg-white">
                  <div className="font-bold font-sans text-xs text-slate-900 border-b border-slate-200 pb-1 mb-1">
                    ITEM {idx + 1}: {it.title}
                  </div>
                  {it.orderText}
                </div>
              ))}
            </div>
          </div>

          {/* Page 1 Footer / Signature */}
          <div className="pt-8 border-t border-slate-300 flex items-end justify-between text-xs">
            <div className="text-[10px] text-slate-500 max-w-sm">
              Checagem de enfermagem: Conferir identificação do paciente na pulseira, via de acesso e vazão na Bomba de Infusão.
            </div>
            <div className="text-center w-72">
              <div className="border-b border-slate-900 w-full mb-1"></div>
              <span className="font-bold block text-[11px]">{patientInfo.physicianName || 'MÉDICO(A) ASSISTENTE'}</span>
              <span className="text-[10px] text-slate-600 font-mono">{patientInfo.crm ? `CRM: ${patientInfo.crm}` : 'CARIMBO E ASSINATURA'}</span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* PAGE BREAK (Forces Page 2 / Verso)                        */}
        {/* ========================================================= */}
        <div className="print-page-break"></div>

        {/* ========================================================= */}
        {/* PAGE 2: VERSO - EVOLUÇÃO CLÍNICA & JUSTIFICATIVA          */}
        {/* ========================================================= */}
        <div className="print-page flex flex-col justify-between pt-4">
          <div>
            {/* Header */}
            <div className="border-b-2 border-slate-900 pb-3 mb-4 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                  JN SUÍTE CLÍNICA
                </h1>
                <p className="text-xs uppercase tracking-wider text-slate-600 font-bold">
                  EVOLUÇÃO CLÍNICA & JUSTIFICATIVA FARMACOLÓGICA (VERSO)
                </p>
              </div>
              <div className="text-right text-xs">
                <div className="font-bold">Data/Hora: {currentDate}</div>
                <div className="text-slate-500 font-mono text-[10px]">APOIO À DECISÃO CLÍNICA</div>
              </div>
            </div>

            {/* Patient Recap */}
            <div className="border border-slate-300 rounded-lg p-2.5 text-xs mb-4 grid grid-cols-3 gap-2 bg-slate-50">
              <div><strong>Paciente:</strong> {patientInfo.patientName || 'Conforme Frente'}</div>
              <div><strong>Leito:</strong> {patientInfo.bedNumber || 'CTI'}</div>
              <div><strong>Prontuário:</strong> {patientInfo.recordNumber || 'S/N'}</div>
            </div>

            {/* Clinical Justifications */}
            <div className="space-y-4">
              <h2 className="text-xs font-extrabold uppercase tracking-wider border-b border-slate-300 pb-1 text-slate-800">
                JUSTIFICATIVA FARMACOLÓGICA E MEMORIAL DE CÁLCULO:
              </h2>

              {itemsToRender.map((it, idx) => (
                <div key={idx} className="border border-slate-300 rounded-lg p-3 text-xs text-slate-800 space-y-1.5 bg-white">
                  <div className="font-bold text-slate-900">
                    ITEM {idx + 1}: {it.title}
                  </div>
                  <p className="leading-relaxed">
                    <strong>Racional Terapêutico:</strong> {it.justificationText}
                  </p>
                  {it.parameters.length > 0 && (
                    <div className="p-2 bg-slate-50 rounded text-[11px] font-mono text-slate-700">
                      <strong>Parâmetros considerados:</strong> {it.parameters.join(' | ')}
                    </div>
                  )}
                </div>
              ))}

              {/* Safety Guidelines */}
              <div className="border border-amber-300 bg-amber-50/60 rounded-lg p-3 text-xs text-amber-950 space-y-1">
                <div className="font-bold">Diretrizes de Segurança e Manejo Hospitalar:</div>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                  <li><strong>Eletrólitos:</strong> Velocidade de infusão restrita aos tetos máximos recomendados para prevenir flebite e toxicidade cardíaca / osmótica.</li>
                  <li><strong>Ajuste Renal:</strong> Doses reduzidas ou intervalos estendidos para Clearance &lt; 50 mL/min com vistas a evitar acúmulo de metabólitos tóxicos.</li>
                  <li><strong>Stewardship Antimicrobiano:</strong> Reavaliação obrigatória entre 48 a 72 horas para descalonamento guiado por cultura.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Page 2 Footer / Signature */}
          <div className="pt-8 border-t border-slate-300 flex items-end justify-between text-xs">
            <div className="text-[10px] text-slate-500 max-w-sm">
              Evolução e conduta clínica registradas para fins de auditoria médica e prontuário eletrônico.
            </div>
            <div className="text-center w-72">
              <div className="border-b border-slate-900 w-full mb-1"></div>
              <span className="font-bold block text-[11px]">{patientInfo.physicianName || 'MÉDICO(A) ASSISTENTE'}</span>
              <span className="text-[10px] text-slate-600 font-mono">{patientInfo.crm ? `CRM: ${patientInfo.crm}` : 'ASSINATURA MÉDICA'}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
