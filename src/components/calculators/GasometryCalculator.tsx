import React, { useState, useMemo, useEffect } from 'react';
import { interpretarGasometria } from '../../utils/calculations';
import { ActivePrescriptionData, ConductOption } from '../../types';
import { NumericInput } from '../NumericInput';
import { Copy, Check, CheckCircle2, FileText, ArrowRight, AlertTriangle } from 'lucide-react';

interface GasometryCalculatorProps {
  onUpdatePrescriptionData: (data: ActivePrescriptionData) => void;
  onOpenPrescriptionModal: () => void;
}

export const GasometryCalculator: React.FC<GasometryCalculatorProps> = ({
  onUpdatePrescriptionData,
  onOpenPrescriptionModal
}) => {
  const [ph, setPh] = useState<number>(7.28);
  const [pco2, setPco2] = useState<number>(24);
  const [hco3, setHco3] = useState<number>(11);

  const [selectedConductId, setSelectedConductId] = useState<string>('conduct-gas-primary');
  const [copied, setCopied] = useState(false);

  const resultado = useMemo(() => {
    return interpretarGasometria(ph, pco2, hco3);
  }, [ph, pco2, hco3]);

  // Generate selectable conducts adapted to the arterial gas analysis
  const conductOptions: ConductOption[] = useMemo(() => {
    const list: ConductOption[] = [];

    if (resultado.estadoPh === 'Acidemia') {
      if (resultado.diagnostico.includes('Metabólica')) {
        list.push({
          id: 'conduct-gas-met-fluid',
          title: 'Conduta 1: Ressuscitação Volêmica & Tratamento Etiológico',
          tag: 'Primeira Linha',
          description: `Expansão com cristaloides balanceados (ex: Ringer Lactato ou Plasma-Lyte), rastreio de foco séptico / cetoacidose / isquemia tecidual e suspensão de drogas nefrotóxicas.`,
          prescriptionText: `PRESCRIÇÃO E CONDUTA MÉDICA:\n1. Ringer Lactato ou Solução Balanceada EV ----------- 1000 mL (correr em 60 minutos)\n2. Investigação urgente: Lactato sérico, glicemia, cetonemia, função renal e eletrólitos completos.\n3. Meta: Otimização hemodinâmica guiada por delta-PP / tempo de enchimento capilar / diurese > 0,5 mL/kg/h.`
        });

        if (ph < 7.20) {
          list.push({
            id: 'conduct-gas-met-bicarb',
            title: 'Conduta 2: Correção Criteriosa com Bicarbonato de Sódio (pH < 7,20)',
            tag: 'Acidemia Crítica',
            description: `Administrar NaHCO₃ 8,4% fracionado para elevar o pH para faixa segura (~7,20) e prevenir colapso cardiovascular / arritmias ventriculares.`,
            prescriptionText: `PRESCRIÇÃO (CORREÇÃO DE ACIDOSE GRAVE COM pH < 7,20):\n1. Bicarbonato de Sódio 8,4% ------------------------- 100 mL (100 mEq)\n   Soro Glicosado 5% --------------------------------- 250 mL\n   Via: Endovenosa em BIC\n   Tempo de Infusão: Correr em 4 horas.\n   Controle: Repetir gasometria arterial 1 hora após término da infusão.`
          });
        }
      }

      if (resultado.diagnostico.includes('Respiratória') || (resultado.pco2Esperado && pco2 > resultado.pco2Esperado.max)) {
        list.push({
          id: 'conduct-gas-vent-support',
          title: 'Conduta: Otimização de Suporte Ventilatório (VNI ou Invasiva)',
          tag: 'Suporte Respiratório',
          description: `Ajustar ventilação mecânica para hipercapnia / hipoventilação relativa (aumentar volume corrente e frequência respiratória para meta de pCO₂ entre ${resultado.pco2Esperado?.min.toFixed(0) || 35} e ${resultado.pco2Esperado?.max.toFixed(0) || 45} mmHg).`,
          prescriptionText: `PRESCRIÇÃO DE SUPORTE VENTILATÓRIO:\n1. Ventilação Não-Invasiva (VNI) ou Mecânica Invasiva:\n   - Ajustar Volume-Minuto para depuração de CO₂ (alvo pCO₂: ${resultado.pco2Esperado ? `${resultado.pco2Esperado.min.toFixed(0)}-${resultado.pco2Esperado.max.toFixed(0)}` : '35-45'} mmHg).\n   - Monitorização de mecânica: Pressão de Platô < 30 cmH₂O e Driving Pressure < 15 cmH₂O.\n   - Gasometria de controle em 1 a 2 horas após novo ajuste ventilatório.`
        });
      }
    } else if (resultado.estadoPh === 'Alcalemia') {
      if (resultado.diagnostico.includes('Respiratória')) {
        list.push({
          id: 'conduct-gas-alcalose-resp',
          title: 'Conduta: Manejo da Hiperventilação e Causa de Base',
          tag: 'Alcalose Respiratória',
          description: 'Tratar dor, ansiedade, febre, hipoxemia ou reduzir frequência respiratória / ventilação minuto excessiva na ventilação mecânica.',
          prescriptionText: `CONDUTA:\n1. Ajustar ventilação mecânica para reduzir hiperventilação excessiva (reduzir FR mandatória / diminuir volume-minuto).\n2. Se paciente em respiração espontânea: analgesia otimizada, sedação leve se indicado, e investigar TEP / sepse inicial.`
        });
      } else {
        list.push({
          id: 'conduct-gas-alcalose-met',
          title: 'Conduta: Reposição Salina e Correção de Cloro / Potássio',
          tag: 'Alcalose Metabólica',
          description: 'Hidratação com NaCl 0,9% (salino-responsiva) para reposição de cloreto e correção agressiva de hipocalemia associada.',
          prescriptionText: `PRESCRIÇÃO:\n1. Soro Fisiológico 0,9% ------------------------------ 1000 mL EV a 150 mL/h\n2. Reposição de KCl conforme dosagem sérica.\n3. Suspender diuréticos de alça / tiazídicos se em uso.`
        });
      }
    } else {
      list.push({
        id: 'conduct-gas-normal',
        title: 'Conduta: Monitorização de Rotina e Manutenção Clínica',
        tag: 'pH Equilibrado',
        description: 'Gasometria arterial compensada ou fisiologicamente normal. Manter parâmetros de suporte e controles seriados.',
        prescriptionText: `EVOLUÇÃO MÉDICA:\n1. Gasometria arterial com equilíbrio ácido-básico preservado.\n2. Manter monitorização clínica e plano terapêutico vigente.`
      });
    }

    return list;
  }, [resultado, ph, pco2]);

  useEffect(() => {
    const paramsSummary = [
      `• Parâmetros Medidos: pH ${ph.toFixed(2)} | pCO₂ ${pco2.toFixed(1)} mmHg | HCO₃⁻ ${hco3.toFixed(1)} mEq/L`,
      `• Estado Ácido-Básico: ${resultado.estadoPh}`,
      `• Diagnóstico: ${resultado.diagnostico}`,
      ...(resultado.compensacao ? [`• Compensação: ${resultado.compensacao}`] : []),
      ...(resultado.pco2Esperado
        ? [`• Faixa Alvo de Winter (pCO₂): ${resultado.pco2Esperado.min.toFixed(1)} a ${resultado.pco2Esperado.max.toFixed(1)} mmHg`]
        : [])
    ];

    onUpdatePrescriptionData({
      calculatorId: 'gasometry',
      calculatorTitle: 'Interpretação de Gasometria Arterial',
      parametersSummary: paramsSummary,
      conductOptions,
      selectedConductId: conductOptions.some((c) => c.id === selectedConductId)
        ? selectedConductId
        : conductOptions[0]?.id || ''
    });
  }, [ph, pco2, hco3, resultado, conductOptions, selectedConductId, onUpdatePrescriptionData]);

  const activeConduct = conductOptions.find((c) => c.id === selectedConductId) || conductOptions[0];

  const handleCopy = () => {
    if (activeConduct) {
      navigator.clipboard.writeText(activeConduct.prescriptionText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const applyPreset = (newPh: number, newPco2: number, newHco3: number) => {
    setPh(newPh);
    setPco2(newPco2);
    setHco3(newHco3);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-900">Interpretação de Gasometria Arterial</h2>
        <p className="text-sm text-slate-600 mt-0.5">
          Identificação do distúrbio primário, cálculo da compensação pela Fórmula de Winter e prescrição clínica direcionada.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Column */}
        <div className="lg:col-span-5 space-y-4 bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Valores Medidos</h3>
            <span className="text-[11px] text-slate-400">Totalmente editável</span>
          </div>

          {/* Quick presets */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Casos Rápidos de Plantão</label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => applyPreset(7.40, 40, 24)}
                className="px-2 py-1.5 text-xs text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors text-slate-700 truncate"
              >
                Normal (7.40 / 40 / 24)
              </button>
              <button
                type="button"
                onClick={() => applyPreset(7.28, 23, 10)}
                className="px-2 py-1.5 text-xs text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors text-slate-700 truncate"
              >
                CAD (Acidose Met. Comp.)
              </button>
              <button
                type="button"
                onClick={() => applyPreset(7.33, 62, 32)}
                className="px-2 py-1.5 text-xs text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors text-slate-700 truncate"
              >
                DPOC (Acidose Resp. Crônica)
              </button>
              <button
                type="button"
                onClick={() => applyPreset(7.08, 65, 14)}
                className="px-2 py-1.5 text-xs text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors text-slate-700 truncate"
              >
                Choque/PCR (Acidose Mista)
              </button>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            <NumericInput
              label="pH Arterial"
              value={ph}
              onChange={setPh}
              step="0.01"
              min={6.80}
              max={7.80}
              helperText="Normal: 7,35 a 7,45 (apague tudo com Backspace para digitar novo valor)"
            />

            <NumericInput
              label="pCO₂ (Pressão Parcial de CO₂)"
              unit="mmHg"
              value={pco2}
              onChange={setPco2}
              step="1"
              min={10}
              max={130}
              helperText="Normal: 35 a 45 mmHg (componente respiratório)"
            />

            <NumericInput
              label="HCO₃⁻ (Bicarbonato Sérico)"
              unit="mEq/L"
              value={hco3}
              onChange={setHco3}
              step="0.5"
              min={2}
              max={60}
              helperText="Normal: 22 a 26 mEq/L (componente metabólico)"
            />
          </div>
        </div>

        {/* Results & Selectable Conducts Column */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Diagnosis Banner */}
          <div
            className={`p-4 rounded-xl border ${
              resultado.gravidade === 'grave'
                ? 'bg-rose-50 border-rose-200 text-rose-950'
                : resultado.gravidade === 'moderada'
                ? 'bg-amber-50 border-amber-200 text-amber-950'
                : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider opacity-75">Diagnóstico Principal</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-white/80 shadow-2xs">
                {resultado.estadoPh} (pH {ph.toFixed(2)})
              </span>
            </div>
            <div className="text-lg font-bold mt-1">{resultado.diagnostico}</div>

            {resultado.compensacao && (
              <div className="mt-2 text-xs text-slate-700 flex items-start gap-1.5">
                <ArrowRight className="w-4 h-4 shrink-0 mt-0.5 text-slate-500" />
                <span>
                  <strong>Compensação:</strong> {resultado.compensacao}
                </span>
              </div>
            )}

            {resultado.pco2Esperado && (
              <div className="mt-2 pt-2 border-t border-slate-200/60 text-xs font-mono text-slate-700">
                {resultado.pco2Esperado.formula}
                <div className="font-bold text-slate-900 mt-0.5">
                  Faixa Alvo do pCO₂: {resultado.pco2Esperado.min.toFixed(1)} a {resultado.pco2Esperado.max.toFixed(1)} mmHg (Atual: {pco2.toFixed(1)})
                </div>
              </div>
            )}
          </div>

          {/* Selectable Conducts */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Condutas Selecionáveis para a Prescrição
                </h3>
                <p className="text-[11px] text-slate-500">
                  Escolha a conduta médica compatível com o laudo para emitir a prescrição.
                </p>
              </div>
              <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                {conductOptions.length} Opções
              </span>
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
