import React, { useState, useMemo, useEffect } from 'react';
import { calcularOsmolaridadeEfetiva } from '../../utils/calculations';
import { ActivePrescriptionData, ConductOption } from '../../types';
import { NumericInput } from '../NumericInput';
import { Copy, Check, CheckCircle2, FileText, ShieldAlert } from 'lucide-react';

interface OsmolarityCalculatorProps {
  onUpdatePrescriptionData: (data: ActivePrescriptionData) => void;
  onOpenPrescriptionModal: () => void;
}

export const OsmolarityCalculator: React.FC<OsmolarityCalculatorProps> = ({
  onUpdatePrescriptionData,
  onOpenPrescriptionModal
}) => {
  const [naMedido, setNaMedido] = useState<number>(142);
  const [glicemia, setGlicemia] = useState<number>(550);
  const [ureia, setUreia] = useState<number>(45);

  const [selectedConductId, setSelectedConductId] = useState<string>('conduct-osm-ehh');
  const [copied, setCopied] = useState(false);

  const resultado = useMemo(() => {
    return calcularOsmolaridadeEfetiva(naMedido, glicemia);
  }, [naMedido, glicemia]);

  const osmTotal = useMemo(() => {
    return 2 * naMedido + glicemia / 18 + ureia / 6;
  }, [naMedido, glicemia, ureia]);

  const conductOptions: ConductOption[] = useMemo(() => {
    const isGrave = resultado.osmolaridadeEfetiva > 320;
    const isResolvido = resultado.osmolaridadeEfetiva < 315;

    return [
      {
        id: 'conduct-osm-ehh',
        title: isGrave
          ? 'Conduta: Manejo Intensivo do Estado Hiperosmolar (> 320 mOsm/L)'
          : isResolvido
          ? 'Conduta: Critério de Resolução Atingido (< 315 mOsm/L)'
          : 'Conduta: Hidratação Equilibrada e Monitorização de Tonicidade',
        tag: isGrave ? 'Alerta Crítico' : 'Tonicidade Efetiva',
        description: isGrave
          ? 'Osmolaridade > 320 mOsm/L indica risco de trombose vascular e rebaixamento sensorial. Reduzir osmolaridade no máximo 3 mOsm/kg/h.'
          : isResolvido
          ? 'Osmolaridade < 315 mOsm/L com recuperação do estado mental indica resolução do EHH. Iniciar transição para insulina SC.'
          : 'Manter infusão volêmica controlada e controle glicêmico.',
        prescriptionText: `PRESCRIÇÃO E CONDUTA (ESTADO HIPEROSMOLAR):\n1. Hidratação Venosa Contínua (NaCl 0,45% ou 0,9% conforme Na⁺ corrigido) a 250-500 mL/h.\n2. Insulina Regular contínua em BIC para meta de redução gradual.\n3. Meta de Segurança: Não permitir queda excessivamente rápida da osmolaridade (< 3 mOsm/L por hora) para evitar edema cerebral iatrogênico.\n4. Profilaxia de TVP: Enoxaparina 40 mg SC 1x/dia se não houver contraindicação (risco trombótico aumentado pelo estado hiperosmolar).`
      }
    ];
  }, [resultado]);

  useEffect(() => {
    const paramsSummary = [
      `• Sódio Sérico: ${naMedido} mEq/L | Glicemia: ${glicemia} mg/dL | Ureia: ${ureia} mg/dL`,
      `• Osmolaridade Efetiva (Tonicidade): ${resultado.osmolaridadeEfetiva.toFixed(1)} mOsm/L`,
      `• Osmolaridade Total Estimada: ${osmTotal.toFixed(1)} mOsm/L`,
      `• Classificação: ${resultado.alerta}`
    ];

    onUpdatePrescriptionData({
      calculatorId: 'osmolarity',
      calculatorTitle: 'Osmolaridade Plasmática Efetiva',
      parametersSummary: paramsSummary,
      conductOptions,
      selectedConductId: conductOptions.some((c) => c.id === selectedConductId)
        ? selectedConductId
        : conductOptions[0]?.id || ''
    });
  }, [naMedido, glicemia, ureia, resultado, osmTotal, conductOptions, selectedConductId, onUpdatePrescriptionData]);

  const activeConduct = conductOptions.find((c) => c.id === selectedConductId) || conductOptions[0];

  const handleCopy = () => {
    if (activeConduct) {
      navigator.clipboard.writeText(activeConduct.prescriptionText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-900">Osmolaridade Plasmática Efetiva</h2>
        <p className="text-sm text-slate-600 mt-0.5">
          Tonicidade celular gerada pelos solutos impermeáveis (sódio e glicose). Parâmetro essencial no manejo do Estado Hiperglicêmico Hiperosmolar (EHH).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-4 bg-white p-5 rounded-xl border border-slate-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Dados Laboratoriais</h3>

          <div className="space-y-3.5">
            <NumericInput
              label="Sódio Sérico Medido"
              unit="mEq/L"
              value={naMedido}
              onChange={setNaMedido}
              step="1"
              min={100}
              max={180}
              helperText="Campo editável com Backspace"
            />

            <NumericInput
              label="Glicemia Sérica"
              unit="mg/dL"
              value={glicemia}
              onChange={setGlicemia}
              step="10"
              min={50}
              max={2000}
              helperText="Glicose / 18 para converter em mOsm/L"
            />

            <NumericInput
              label="Ureia Sérica (Opcional)"
              unit="mg/dL"
              value={ureia}
              onChange={setUreia}
              step="5"
              min={5}
              max={300}
              helperText="A ureia é permeável e só conta na osmolaridade total"
            />
          </div>
        </div>

        {/* Results & Conducts Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-2 gap-2.5">
            <div
              className={`p-3.5 rounded-xl border ${
                resultado.osmolaridadeEfetiva > 320
                  ? 'bg-rose-50 border-rose-200 text-rose-950'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-950'
              }`}
            >
              <span className="text-xs font-semibold block text-slate-700">Osmolaridade Efetiva</span>
              <span className="text-3xl font-extrabold font-mono tabular-nums">
                {resultado.osmolaridadeEfetiva.toFixed(1)}
              </span>
              <span className="text-[11px] text-slate-500 block font-mono">mOsm/L (Tonicidade)</span>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200">
              <span className="text-xs font-semibold block text-slate-600">Osmolaridade Total</span>
              <span className="text-3xl font-extrabold font-mono text-slate-900 tabular-nums">
                {osmTotal.toFixed(1)}
              </span>
              <span className="text-[11px] text-slate-500 block font-mono">mOsm/L (com Ureia/6)</span>
            </div>
          </div>

          {/* Conduct Selection */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Conduta Selecionável para a Prescrição
                </h3>
              </div>
            </div>

            <div className="space-y-2">
              {conductOptions.map((opt) => {
                const isSelected = selectedConductId === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedConductId(opt.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                        : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100/70 text-slate-800'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-400" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold leading-tight">{opt.title}</span>
                        {opt.tag && (
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                              isSelected ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {opt.tag}
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-xs mt-1 leading-relaxed ${
                          isSelected ? 'text-slate-300' : 'text-slate-600'
                        }`}
                      >
                        {opt.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {activeConduct && (
              <div className="pt-2 border-t border-slate-100 space-y-2.5">
                <div className="p-3 bg-slate-900 text-slate-200 rounded-lg text-xs font-mono whitespace-pre-wrap leading-relaxed">
                  {activeConduct.prescriptionText}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-1">
                  <button
                    onClick={handleCopy}
                    className="w-full sm:w-auto px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copiado!' : 'Copiar Conduta'}</span>
                  </button>

                  <button
                    onClick={onOpenPrescriptionModal}
                    className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Gerar Prescrição com Conduta Selecionada</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
