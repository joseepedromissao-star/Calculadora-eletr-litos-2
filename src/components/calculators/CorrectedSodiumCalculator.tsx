import React, { useState, useMemo, useEffect } from 'react';
import { calcularSodioCorrigido } from '../../utils/calculations';
import { ActivePrescriptionData, ConductOption } from '../../types';
import { NumericInput } from '../NumericInput';
import { Copy, Check, CheckCircle2, FileText, Droplets, Info } from 'lucide-react';

interface CorrectedSodiumCalculatorProps {
  onUpdatePrescriptionData: (data: ActivePrescriptionData) => void;
  onOpenPrescriptionModal: () => void;
}

export const CorrectedSodiumCalculator: React.FC<CorrectedSodiumCalculatorProps> = ({
  onUpdatePrescriptionData,
  onOpenPrescriptionModal
}) => {
  const [naMedido, setNaMedido] = useState<number>(128);
  const [glicemia, setGlicemia] = useState<number>(450);

  const [selectedConductId, setSelectedConductId] = useState<string>('conduct-corr-fluid');
  const [copied, setCopied] = useState(false);

  const resultado = useMemo(() => {
    return calcularSodioCorrigido(naMedido, glicemia);
  }, [naMedido, glicemia]);

  // Selectable conducts
  const conductOptions: ConductOption[] = useMemo(() => {
    const isHiponatremicoReal = resultado.naCorrigido < 135;
    const solucaoRecomendada = isHiponatremicoReal ? 'NaCl 0,9% (Isotônica)' : 'NaCl 0,45% (Hipotônica)';

    return [
      {
        id: 'conduct-corr-fluid',
        title: `Conduta 1: Hidratação Venosa com ${solucaoRecomendada}`,
        tag: 'Baseada no Na⁺ Corrigido',
        description: isHiponatremicoReal
          ? `Sódio corrigido baixo (${resultado.naCorrigido.toFixed(1)} mEq/L): Iniciar/manter expansão com NaCl 0,9% 500 a 1000 mL/h na primeira fase.`
          : `Sódio corrigido normal ou alto (${resultado.naCorrigido.toFixed(1)} mEq/L): Transicionar para NaCl 0,45% 250 a 500 mL/h para evitar hipernatremia hiperosmolar.`,
        prescriptionText: `PRESCRIÇÃO DE HIDRATAÇÃO (NA HIPERGLICEMIA):\n1. ${
          isHiponatremicoReal ? 'Soro Fisiológico 0,9% ------------------------------ 1000 mL' : 'Cloreto de Sódio 0,45% (NaCl 0,45%) ---------------- 500 mL'
        }\n   Via: Endovenosa\n   Velocidade: ${isHiponatremicoReal ? '500 mL/h nas primeiras 2 a 4 horas' : '250 a 350 mL/h em BIC'}\n   Justificativa: Sódio real corrigido calculado em ${resultado.naCorrigido.toFixed(1)} mEq/L.`
      },
      {
        id: 'conduct-corr-insulin',
        title: 'Conduta 2: Insulinoterapia Regular Contínua (Bomba de Infusão)',
        tag: 'Protocolo Cetoacidose / EHH',
        description: 'Bomba de Insulina Regular 0,1 U/kg/h em SF 0,9% (100 U em 100 mL de SF = 1 U/mL). Queda alvo da glicemia: 50 a 75 mg/dL por hora.',
        prescriptionText: `PRESCRIÇÃO:\n1. Insulina Regular ---------------------------------- 100 Unidades\n   Soro Fisiológico 0,9% ------------------------------ 100 mL (Concentração: 1 U/mL)\n   Via: Endovenosa contínua em BIC\n   Velocidade inicial: 0,1 U/kg/hora (desprezar os primeiros 20 mL no equipo para saturar sítios de adesão plástica).\n   Meta: Queda da glicemia entre 50 a 70 mg/dL por hora. Não iniciar se K⁺ < 3,3 mEq/L.`
      }
    ];
  }, [resultado]);

  useEffect(() => {
    const paramsSummary = [
      `• Sódio Sérico Medido: ${naMedido} mEq/L | Glicemia: ${glicemia} mg/dL`,
      `• Fator Aplicado: ${resultado.fator} mEq/L para cada 100 mg/dL de glicose acima de 100`,
      `• SÓDIO CORRIGIDO REAL: ${resultado.naCorrigido.toFixed(1)} mEq/L`,
      `• Conduta Hídrica Recomendada: ${resultado.condutaSolucao}`
    ];

    onUpdatePrescriptionData({
      calculatorId: 'corrected-sodium',
      calculatorTitle: 'Sódio Corrigido na Hiperglicemia',
      parametersSummary: paramsSummary,
      conductOptions,
      selectedConductId: conductOptions.some((c) => c.id === selectedConductId)
        ? selectedConductId
        : conductOptions[0]?.id || ''
    });
  }, [naMedido, glicemia, resultado, conductOptions, selectedConductId, onUpdatePrescriptionData]);

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
        <h2 className="text-xl font-bold text-slate-900">Sódio Corrigido (na Hiperglicemia)</h2>
        <p className="text-sm text-slate-600 mt-0.5">
          Correção da pseudo-hiponatremia hiperosmolar provocada pela glicose elevada e seleção assertiva da solução salina.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-4 bg-white p-5 rounded-xl border border-slate-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Parâmetros Laboratoriais</h3>

          <div className="space-y-3.5">
            <NumericInput
              label="Sódio Sérico Medido"
              unit="mEq/L"
              value={naMedido}
              onChange={setNaMedido}
              step="1"
              min={100}
              max={170}
              helperText="Campo livre para apagar completamente com Backspace e redigitar"
            />

            <NumericInput
              label="Glicemia Sérica"
              unit="mg/dL"
              value={glicemia}
              onChange={setGlicemia}
              step="10"
              min={50}
              max={2000}
              helperText="Glicemia > 400 mg/dL adota fator de Hillier (2,4 mEq/L por 100 mg/dL)"
            />
          </div>

          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-xs text-blue-900 space-y-1">
            <div className="font-semibold flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-700" />
              <span>Regra Prática de Prescrição</span>
            </div>
            <p>
              Se Na⁺ corrigido &lt; 135: manter <strong>NaCl 0,9%</strong>. Se normal ou elevado (&ge; 135): utilizar <strong>NaCl 0,45%</strong>.
            </p>
          </div>
        </div>

        {/* Results & Conducts Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 block">Sódio Medido</span>
              <span className="text-2xl font-bold font-mono text-slate-600 tabular-nums">
                {naMedido.toFixed(1)}
              </span>
              <span className="text-[11px] text-slate-400 block font-mono">mEq/L (aparente)</span>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-xs text-emerald-800 font-semibold block">Sódio Real Estimado</span>
              <span className="text-3xl font-extrabold font-mono text-emerald-950 tabular-nums">
                {resultado.naCorrigido.toFixed(1)}
              </span>
              <span className="text-[11px] text-emerald-700 block font-mono">mEq/L (corrigido)</span>
            </div>
          </div>

          {/* Selectable conducts */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Condutas Selecionáveis para a Prescrição
                </h3>
                <p className="text-[11px] text-slate-500">
                  Escolha a conduta para inserir na prescrição oficial.
                </p>
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
