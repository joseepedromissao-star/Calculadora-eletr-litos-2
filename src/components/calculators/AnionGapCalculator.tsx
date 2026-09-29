import React, { useState, useMemo, useEffect } from 'react';
import { calcularAnionGap } from '../../utils/calculations';
import { ActivePrescriptionData, ConductOption } from '../../types';
import { NumericInput } from '../NumericInput';
import { Copy, Check, CheckCircle2, FileText, ShieldAlert } from 'lucide-react';

interface AnionGapCalculatorProps {
  onUpdatePrescriptionData: (data: ActivePrescriptionData) => void;
  onOpenPrescriptionModal: () => void;
}

export const AnionGapCalculator: React.FC<AnionGapCalculatorProps> = ({
  onUpdatePrescriptionData,
  onOpenPrescriptionModal
}) => {
  const [na, setNa] = useState<number>(135);
  const [cl, setCl] = useState<number>(100);
  const [hco3, setHco3] = useState<number>(12);
  const [albumina, setAlbumina] = useState<number>(4.0);

  const [selectedConductId, setSelectedConductId] = useState<string>('conduct-ag-primary');
  const [copied, setCopied] = useState(false);

  const resultado = useMemo(() => {
    return calcularAnionGap(na, cl, hco3);
  }, [na, cl, hco3]);

  const agCorrigido = useMemo(() => {
    return resultado.anionGap + 2.5 * (4.0 - albumina);
  }, [resultado.anionGap, albumina]);

  const conductOptions: ConductOption[] = useMemo(() => {
    const isElevado = resultado.anionGap > 12;

    if (isElevado) {
      return [
        {
          id: 'conduct-ag-cad',
          title: 'Conduta 1: Protocolo de Cetoacidose Diabética (CAD)',
          tag: 'Ânion Gap Elevado',
          description: 'Hidratação salina vigorosa + Insulina Regular 0,1 U/kg/h + reposição profilática de KCl (alvo de K⁺ entre 4 e 5 mEq/L).',
          prescriptionText: `PRESCRIÇÃO - PROTOCOLO DE CAD (ÂNION GAP ELEVADO):\n1. Soro Fisiológico 0,9% ------------------------------ 1000 mL EV na primeira hora\n2. Insulina Regular em BIC --------------------------- 0,1 U/kg/h (após hidratação inicial e se K⁺ > 3,3)\n3. Cloreto de Potássio 19,1% ------------------------- 20 a 30 mEq por litro de solução se K⁺ 3,5-5,0\n4. Monitorização: Glicemia capilar horária, gasometria e eletrólitos a cada 2 a 4 horas até fechamento do Ânion Gap (< 12).`
        },
        {
          id: 'conduct-ag-lactate',
          title: 'Conduta 2: Protocolo de Acidose Láctica / Sepse e Choque',
          tag: 'Hipoperfusão Tecidual',
          description: 'Expansão volêmica balanceada (30 mL/kg), coleta de hemoculturas e início precoce de antibióticos na 1ª hora.',
          prescriptionText: `PRESCRIÇÃO - RESSUSCITAÇÃO NA ACIDOSE LÁCTICA:\n1. Ringer Lactato ou Solução Balanceada EV ----------- 30 mL/kg em até 3 horas\n2. Coleta de 2 pares de hemoculturas + lactato arterial de controle em 2 a 4 horas\n3. Iniciar antimicrobiano de amplo espectro na primeira hora\n4. Noradrenalina se PAM < 65 mmHg a despeito da volemia.`
        }
      ];
    } else {
      return [
        {
          id: 'conduct-ag-hyperclor',
          title: 'Conduta: Manejo da Acidose Hiperclorêmica / Perdas Digestivas',
          tag: 'Ânion Gap Normal',
          description: 'Substituição de SF 0,9% por soluções balanceadas (Ringer Lactato ou Plasma-Lyte) e reposição de bicarbonato se diarreia maciça ou ATR.',
          prescriptionText: `PRESCRIÇÃO - ACIDOSE HIPERCLORÊMICA:\n1. Suspender infusões excessivas de NaCl 0,9% (substituir por Ringer Lactato ou SG 5% com Bicarbonato)\n2. Correção de perdas entéricas ou renais de bicarbonato\n3. Monitorização seriada de cloro e bicarbonato séricos.`
        }
      ];
    }
  }, [resultado]);

  useEffect(() => {
    const paramsSummary = [
      `• Parâmetros: Na⁺ ${na} mEq/L | Cl⁻ ${cl} mEq/L | HCO₃⁻ ${hco3} mEq/L`,
      `• Ânion Gap Calculado: ${resultado.anionGap.toFixed(1)} mEq/L (Normal: 4 a 12 mEq/L)`,
      ...(albumina !== 4.0 ? [`• Ânion Gap Corrigido para Albumina (${albumina} g/dL): ${agCorrigido.toFixed(1)} mEq/L`] : []),
      `• Status: ${resultado.alerta}`
    ];

    onUpdatePrescriptionData({
      calculatorId: 'anion-gap',
      calculatorTitle: 'Ânion Gap (Hiato Aniônico)',
      parametersSummary: paramsSummary,
      conductOptions,
      selectedConductId: conductOptions.some((c) => c.id === selectedConductId)
        ? selectedConductId
        : conductOptions[0]?.id || ''
    });
  }, [na, cl, hco3, albumina, resultado, agCorrigido, conductOptions, selectedConductId, onUpdatePrescriptionData]);

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
        <h2 className="text-xl font-bold text-slate-900">Ânion Gap (Hiato Aniônico)</h2>
        <p className="text-sm text-slate-600 mt-0.5">
          Diferença entre os principais cátions e ânions mensuráveis. Essencial na diferenciação diagnóstica das acidoses metabólicas normoclorêmicas vs hiperclorêmicas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-4 bg-white p-5 rounded-xl border border-slate-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Eletrólitos Séricos</h3>

          <div className="space-y-3.5">
            <NumericInput
              label="Sódio (Na⁺)"
              unit="mEq/L"
              value={na}
              onChange={setNa}
              step="1"
              min={100}
              max={180}
              helperText="Campo editável com Backspace"
            />

            <NumericInput
              label="Cloro (Cl⁻)"
              unit="mEq/L"
              value={cl}
              onChange={setCl}
              step="1"
              min={60}
              max={140}
              helperText="Normal: 98 a 106 mEq/L"
            />

            <NumericInput
              label="Bicarbonato (HCO₃⁻)"
              unit="mEq/L"
              value={hco3}
              onChange={setHco3}
              step="0.5"
              min={1}
              max={50}
              helperText="Normal: 22 a 26 mEq/L"
            />

            <NumericInput
              label="Albumina Sérica (Opcional)"
              unit="g/dL"
              value={albumina}
              onChange={setAlbumina}
              step="0.1"
              min={0.5}
              max={6.0}
              helperText="Cada 1 g/dL abaixo de 4 reduz o AG aparente em ~2,5"
            />
          </div>
        </div>

        {/* Results & Conducts Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-2 gap-2.5">
            <div
              className={`p-3.5 rounded-xl border ${
                resultado.anionGap > 12
                  ? 'bg-rose-50 border-rose-200 text-rose-950'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-950'
              }`}
            >
              <span className="text-xs font-semibold block text-slate-700">Ânion Gap Calculado</span>
              <span className="text-3xl font-extrabold font-mono tabular-nums">
                {resultado.anionGap.toFixed(1)}
              </span>
              <span className="text-[11px] text-slate-500 block font-mono">mEq/L (Normal: 4 a 12)</span>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200">
              <span className="text-xs font-semibold block text-slate-600">Corrigido p/ Albumina</span>
              <span className="text-3xl font-extrabold font-mono text-slate-900 tabular-nums">
                {agCorrigido.toFixed(1)}
              </span>
              <span className="text-[11px] text-slate-500 block font-mono">mEq/L ({albumina} g/dL)</span>
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
