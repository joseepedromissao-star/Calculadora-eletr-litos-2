import React, { useState, useMemo, useEffect } from 'react';
import { calcularPotassioAdulto, calcularPotassioPediatrico } from '../../utils/calculations';
import { VenousAccess, PatientAgeGroup, ActivePrescriptionData, ConductOption, PrescribedItem } from '../../types';
import { NumericInput } from '../NumericInput';
import { AlertCircle, Copy, Check, ShieldAlert, CheckCircle2, FileText, Plus } from 'lucide-react';

interface PotassiumCalculatorProps {
  onUpdatePrescriptionData: (data: ActivePrescriptionData) => void;
  onOpenPrescriptionModal: () => void;
  onAddPrescribedItem: (item: PrescribedItem) => void;
}

export const PotassiumCalculator: React.FC<PotassiumCalculatorProps> = ({
  onUpdatePrescriptionData,
  onOpenPrescriptionModal,
  onAddPrescribedItem
}) => {
  const [tipoPaciente, setTipoPaciente] = useState<PatientAgeGroup>('adult');

  // Adult inputs
  const [kAtual, setKAtual] = useState<number>(2.8);
  const [kAlvo, setKAlvo] = useState<number>(4.0);
  const [acesso, setAcesso] = useState<VenousAccess>('peripheral');

  // Pediatric inputs
  const [pesoPediatrico, setPesoPediatrico] = useState<number>(18);
  const [isAdolescente, setIsAdolescente] = useState<boolean>(false);

  // Selected conduct
  const [selectedConductId, setSelectedConductId] = useState<string>('conduct-standard');
  const [copied, setCopied] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  // Calculations
  const resultadoAdulto = useMemo(() => {
    if (tipoPaciente !== 'adult') return null;
    return calcularPotassioAdulto(kAtual, kAlvo, acesso);
  }, [tipoPaciente, kAtual, kAlvo, acesso]);

  const resultadoPediatrico = useMemo(() => {
    if (tipoPaciente !== 'pediatric') return null;
    return calcularPotassioPediatrico(pesoPediatrico, isAdolescente);
  }, [tipoPaciente, pesoPediatrico, isAdolescente]);

  // Available selectable conducts
  const conductOptions: ConductOption[] = useMemo(() => {
    if (tipoPaciente === 'adult' && resultadoAdulto) {
      const volSf = Math.round(resultadoAdulto.volMinDiluicaoSf);
      const amp = resultadoAdulto.ampolas.toFixed(1);
      const tempo = resultadoAdulto.tempoMinHoras.toFixed(1);
      const veloMlH = (volSf / Math.max(1, resultadoAdulto.tempoMinHoras)).toFixed(0);

      return [
        {
          id: 'conduct-standard',
          title: `Conduta Padrão (${acesso === 'peripheral' ? 'AVP Periférico' : 'CVC Central'} - Diluição Recomendada)`,
          tag: 'Primeira Escolha',
          description: `KCl 19,1% ${amp} ampolas (${(resultadoAdulto.ampolas * 10).toFixed(0)} mL = ${resultadoAdulto.doseMeq.toFixed(1)} mEq) diluídas em ${volSf} mL de SF 0,9% em BIC a ${veloMlH} mL/h por ${tempo} horas.`,
          prescriptionText: `PRESCRIÇÃO:\n1. Cloreto de Potássio 19,1% (10 mL) ---------------- ${amp} ampolas (${resultadoAdulto.doseMeq.toFixed(1)} mEq)\n   Soro Fisiológico 0,9% ------------------------------ ${volSf} mL\n   Via: ${acesso === 'peripheral' ? 'Endovenosa Periférica (AVP)' : 'Endovenosa Central (CVC)'}\n   Infusão: Bomba de Infusão Contínua (BIC) a ${veloMlH} mL/h (Tempo total: ${tempo} horas).\n   Monitorização: Sinais vitais e cardioscópio se infusão > 10 mEq/h.`,
          justificationText: `Hipocalemia sintomática ou moderada a severa (K⁺ atual ${kAtual.toFixed(2)} mEq/L, alvo ${kAlvo.toFixed(2)} mEq/L). Déficit estimado em ${resultadoAdulto.aumentoDesejado.toFixed(2)} mEq/L. Reposição por via ${acesso === 'peripheral' ? 'periférica com taxa ≤ 10 mEq/h' : 'central com taxa ≤ 40 mEq/h'} para prevenir arritmias ventriculares.`
        },
        {
          id: 'conduct-fractioned',
          title: 'Conduta Fracionada em 2 Etapas (Segurança com Checagem de K⁺ Intermediária)',
          tag: 'Alta Segurança',
          description: `Administrar 50% da dose calculada (${(resultadoAdulto.doseMeq / 2).toFixed(1)} mEq) nas primeiras 4 a 6 horas e dosar K⁺ sérico antes de liberar a 2ª metade.`,
          prescriptionText: `PRESCRIÇÃO (ETAPA 1 DE 2):\n1. Cloreto de Potássio 19,1% (10 mL) ---------------- ${(resultadoAdulto.ampolas / 2).toFixed(1)} ampolas (${(resultadoAdulto.doseMeq / 2).toFixed(1)} mEq)\n   Soro Fisiológico 0,9% ------------------------------ ${Math.round(volSf / 2)} mL\n   Via: ${acesso === 'peripheral' ? 'Endovenosa Periférica (AVP)' : 'Endovenosa Central (CVC)'}\n   Infusão: Correr em BIC em ${(resultadoAdulto.tempoMinHoras / 2).toFixed(1)} horas.\n   AVALIAÇÃO: Coletar potássio sérico de controle 1 hora após término antes de infundir a 2ª etapa.`,
          justificationText: `Estratégia fracionada de alta segurança para evitar hipercalemia de rebote. Infunde-se 50% do déficit (${(resultadoAdulto.doseMeq / 2).toFixed(1)} mEq) com recoleta antes do restante.`
        }
      ];
    } else if (tipoPaciente === 'pediatric' && resultadoPediatrico) {
      const volSf = Math.round(resultadoPediatrico.doseRecomendadaMeq * 25);
      const tempo = resultadoPediatrico.tempoEstimadoHoras.toFixed(1);
      const veloMlH = (volSf / Math.max(1, resultadoPediatrico.tempoEstimadoHoras)).toFixed(1);

      return [
        {
          id: 'conduct-ped-standard',
          title: 'Conduta Pediátrica em Bomba de Infusão (Dose Peso-Guiada)',
          tag: 'Recomendada',
          description: `KCl 19,1%: ${resultadoPediatrico.volumeKclMl.toFixed(1)} mL (${resultadoPediatrico.doseRecomendadaMeq.toFixed(1)} mEq) diluído em ${volSf} mL de SF 0,9% em BIC em ${tempo} horas.`,
          prescriptionText: `PRESCRIÇÃO PEDIÁTRICA:\n1. Cloreto de Potássio 19,1% ------------------------- ${resultadoPediatrico.volumeKclMl.toFixed(1)} mL (${resultadoPediatrico.doseRecomendadaMeq.toFixed(1)} mEq de K⁺)\n   Soro Fisiológico 0,9% ------------------------------ ${volSf} mL\n   Via: Endovenosa em Bomba de Infusão Contínua (BIC)\n   Velocidade: ${veloMlH} mL/h por ${tempo} horas (Taxa: ${resultadoPediatrico.taxaInfusaoMeqH.toFixed(2)} mEq/h).\n   Alerta de Enfermagem: Não infundir em bolus sob hipótese alguma.`,
          justificationText: `Reposição pediátrica peso-guiada (${pesoPediatrico} kg) respeitando limite estrito de velocidade (${resultadoPediatrico.taxaInfusaoMeqH.toFixed(2)} mEq/h).`
        }
      ];
    }
    return [];
  }, [tipoPaciente, resultadoAdulto, resultadoPediatrico, acesso, kAtual, kAlvo, pesoPediatrico]);

  useEffect(() => {
    const paramsSummary =
      tipoPaciente === 'adult' && resultadoAdulto
        ? [
            `• K⁺ Sérico Atual: ${kAtual.toFixed(2)} mEq/L | Alvo: ${kAlvo.toFixed(2)} mEq/L (Déficit: +${resultadoAdulto.aumentoDesejado.toFixed(2)} mEq/L)`,
            `• Acesso Venoso: ${acesso === 'peripheral' ? 'Periférico (AVP - máx 10 mEq/h)' : 'Central (CVC - máx 40 mEq/h)'}`,
            `• Dose Calculada: ${resultadoAdulto.doseMeq.toFixed(1)} mEq (${resultadoAdulto.ampolas.toFixed(2)} ampolas de KCl 19,1%)`,
            `• Diluição: ${resultadoAdulto.volMinDiluicaoSf.toFixed(0)} mL SF 0,9% em ${resultadoAdulto.tempoMinHoras.toFixed(1)} horas`
          ]
        : resultadoPediatrico
        ? [
            `• Paciente Pediátrico: ${pesoPediatrico} kg (${isAdolescente ? 'Adolescente' : 'Criança'})`,
            `• Dose: ${resultadoPediatrico.doseRecomendadaMeq.toFixed(2)} mEq (${resultadoPediatrico.volumeKclMl.toFixed(2)} mL KCl 19,1%)`,
            `• Taxa Segura: ${resultadoPediatrico.taxaInfusaoMeqH.toFixed(2)} mEq/h em ${resultadoPediatrico.tempoEstimadoHoras.toFixed(2)} horas`
          ]
        : [];

    onUpdatePrescriptionData({
      calculatorId: 'potassium',
      calculatorTitle: 'Calculadora médica - Reposição de Potássio (KCl 19,1%)',
      parametersSummary: paramsSummary,
      conductOptions,
      selectedConductId: conductOptions.some((c) => c.id === selectedConductId)
        ? selectedConductId
        : conductOptions[0]?.id || ''
    });
  }, [
    tipoPaciente,
    kAtual,
    kAlvo,
    acesso,
    pesoPediatrico,
    isAdolescente,
    resultadoAdulto,
    resultadoPediatrico,
    conductOptions,
    selectedConductId,
    onUpdatePrescriptionData
  ]);

  const activeConduct = conductOptions.find((c) => c.id === selectedConductId) || conductOptions[0];

  const handleCopy = () => {
    if (activeConduct) {
      navigator.clipboard.writeText(activeConduct.prescriptionText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAddToCombined = () => {
    if (!activeConduct) return;

    const item: PrescribedItem = {
      id: `kcl-${Date.now()}`,
      category: 'electrolyte',
      title: `Reposição de Potássio: ${activeConduct.title}`,
      orderText: activeConduct.prescriptionText,
      justificationText: activeConduct.justificationText || activeConduct.description,
      parameters:
        tipoPaciente === 'adult' && resultadoAdulto
          ? [
              `K⁺ Atual: ${kAtual.toFixed(2)} mEq/L → Alvo: ${kAlvo.toFixed(2)} mEq/L`,
              `Dose: ${resultadoAdulto.doseMeq.toFixed(1)} mEq KCl (${resultadoAdulto.ampolas.toFixed(2)} ampolas a 19,1%)`,
              `Via: ${acesso === 'peripheral' ? 'AVP (máx 10 mEq/h)' : 'CVC (máx 40 mEq/h)'}`
            ]
          : [`Peso Pediátrico: ${pesoPediatrico} kg`, `Dose: ${resultadoPediatrico?.doseRecomendadaMeq.toFixed(2)} mEq`],
      addedAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    onAddPrescribedItem(item);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Reposição de Potássio (KCl 19,1%)</h2>
          <p className="text-sm text-slate-600 mt-0.5">
            Cálculo de mEq, ampolas a 19,1% (25,6 mEq / 10 mL), diluição em SF 0,9% e taxas de segurança por via de acesso.
          </p>
        </div>

        <div className="flex items-center p-1 bg-slate-100 rounded-lg shrink-0">
          <button
            onClick={() => setTipoPaciente('adult')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              tipoPaciente === 'adult'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Adulto
          </button>
          <button
            onClick={() => setTipoPaciente('pediatric')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              tipoPaciente === 'pediatric'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pediátrico
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-4 bg-white p-5 rounded-xl border border-slate-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Parâmetros do Paciente</h3>

          {tipoPaciente === 'adult' ? (
            <div className="space-y-3.5">
              <NumericInput
                label="Potássio Sérico Atual"
                unit="mEq/L"
                value={kAtual}
                onChange={setKAtual}
                step="0.1"
                min={1.0}
                max={6.0}
                helperText="Referência normal: 3,5 a 5,0 mEq/L (campo livre para apagar e editar)"
              />

              <NumericInput
                label="Potássio Alvo Desejado"
                unit="mEq/L"
                value={kAlvo}
                onChange={setKAlvo}
                step="0.1"
                min={2.0}
                max={5.5}
                helperText="Geralmente almeja-se 4,0 a 4,5 mEq/L"
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Acesso Venoso</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAcesso('peripheral')}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                      acesso === 'peripheral'
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    Periférico (AVP)
                    <span className="block text-[10px] font-normal opacity-80">Máx: 10 mEq/h</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAcesso('central')}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                      acesso === 'central'
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    Central (CVC)
                    <span className="block text-[10px] font-normal opacity-80">Máx: 40 mEq/h</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              <NumericInput
                label="Peso Corporal da Criança"
                unit="kg"
                value={pesoPediatrico}
                onChange={setPesoPediatrico}
                step="0.5"
                min={1}
                max={120}
                helperText="Pode apagar o valor completamente com Backspace para digitar novo peso"
              />

              <div>
                <label className="flex items-center gap-2.5 cursor-pointer p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={isAdolescente}
                    onChange={(e) => setIsAdolescente(e.target.checked)}
                    className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800">Paciente é Adolescente?</span>
                    <span className="block text-[11px] text-slate-500">
                      Permite limite de velocidade de infusão até 40 mEq/h (ao invés de 20 mEq/h).
                    </span>
                  </div>
                </label>
              </div>
            </div>
          )}

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
            <div>
              <strong>Segurança Crítica:</strong> KCl 19,1% NUNCA deve ser infundido em bolus direto. Risco fatal de PCR por assistolia. Sempre usar Bomba de Infusão (BIC).
            </div>
          </div>
        </div>

        {/* Results & Selectable Conducts Column */}
        <div className="lg:col-span-7 space-y-4">
          {tipoPaciente === 'adult' && resultadoAdulto && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Dose Total</span>
                <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                  {resultadoAdulto.doseMeq.toFixed(1)}
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">mEq KCl</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Ampolas (10mL)</span>
                <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                  {resultadoAdulto.ampolas.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">KCl 19,1%</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Diluição Mínima</span>
                <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                  {resultadoAdulto.volMinDiluicaoSf.toFixed(0)}
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">mL SF 0,9%</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Tempo Mínimo</span>
                <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                  {resultadoAdulto.tempoMinHoras.toFixed(1)}
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">horas</span>
              </div>
            </div>
          )}

          {tipoPaciente === 'adult' && !resultadoAdulto && (
            <div className="p-5 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
              <div>
                <strong>Atenção:</strong> O potássio alvo deve ser maior que o potássio sérico atual ({kAtual} mEq/L).
              </div>
            </div>
          )}

          {tipoPaciente === 'pediatric' && resultadoPediatrico && (
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Dose Recomendada</span>
                <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                  {resultadoPediatrico.doseRecomendadaMeq.toFixed(1)}
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">mEq</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Taxa de Infusão</span>
                <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                  {resultadoPediatrico.taxaInfusaoMeqH.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">mEq/h</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Tempo Estimado</span>
                <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                  {resultadoPediatrico.tempoEstimadoHoras.toFixed(1)}
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">horas</span>
              </div>
            </div>
          )}

          {/* Selectable Conducts Section */}
          {conductOptions.length > 0 && (
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Selecione a Conduta Desejada para a Prescrição
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Pode ser combinada com antibióticos no mesmo documento.
                  </p>
                </div>
                {addedNotice && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded animate-pulse">
                    ✓ Eletrólito Adicionado à Prescrição!
                  </span>
                )}
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
                      <span>{copied ? 'Copiado!' : 'Copiar Texto'}</span>
                    </button>

                    <button
                      onClick={handleAddToCombined}
                      className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5 text-emerald-950" />
                      <span>Adicionar à Prescrição (com Antibióticos)</span>
                    </button>

                    <button
                      onClick={onOpenPrescriptionModal}
                      className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <FileText className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Abrir Prescrição Completa</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
