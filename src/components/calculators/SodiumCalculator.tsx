import React, { useState, useMemo, useEffect } from 'react';
import { calcularSodioAdulto, calcularSodioPediatrico } from '../../utils/calculations';
import { Gender, SolutionType, PatientAgeGroup, ActivePrescriptionData, ConductOption, PrescribedItem } from '../../types';
import { NumericInput } from '../NumericInput';
import { Copy, Check, ShieldAlert, CheckCircle2, FileText, Beaker, Plus } from 'lucide-react';

interface SodiumCalculatorProps {
  onUpdatePrescriptionData: (data: ActivePrescriptionData) => void;
  onOpenPrescriptionModal: () => void;
  onAddPrescribedItem: (item: PrescribedItem) => void;
}

export const SodiumCalculator: React.FC<SodiumCalculatorProps> = ({
  onUpdatePrescriptionData,
  onOpenPrescriptionModal,
  onAddPrescribedItem
}) => {
  const [tipoPaciente, setTipoPaciente] = useState<PatientAgeGroup>('adult');
  const [peso, setPeso] = useState<number>(70);

  // Adult inputs
  const [sexo, setSexo] = useState<Gender>('M');
  const [idoso, setIdoso] = useState<boolean>(false);
  const [naAtual, setNaAtual] = useState<number>(118);
  const [solucao, setSolucao] = useState<SolutionType>('nacl3');

  // Selected conduct
  const [selectedConductId, setSelectedConductId] = useState<string>('conduct-nacl-bic');
  const [copied, setCopied] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  // Calculations
  const resultadoAdulto = useMemo(() => {
    if (tipoPaciente !== 'adult') return null;
    return calcularSodioAdulto(peso, sexo, idoso, naAtual, solucao);
  }, [tipoPaciente, peso, sexo, idoso, naAtual, solucao]);

  const resultadoPediatrico = useMemo(() => {
    if (tipoPaciente !== 'pediatric') return null;
    return calcularSodioPediatrico(peso);
  }, [tipoPaciente, peso]);

  // Available selectable conducts
  const conductOptions: ConductOption[] = useMemo(() => {
    if (tipoPaciente === 'adult' && resultadoAdulto) {
      const velo = resultadoAdulto.velocidadeSugeridaMlH.toFixed(0);

      return [
        {
          id: 'conduct-nacl-bic',
          title: `Conduta 1: Infusão Contínua em BIC (${solucao === 'nacl3' ? 'NaCl 3%' : 'SF 0,9%'})`,
          tag: 'Alvo +0,5 mEq/h',
          description: `Infundir a ${velo} mL/h em Bomba de Infusão para elevar ~0,5 mEq/L/h. Limite estrito: no máximo 8 a 10 mEq/L em 24h.`,
          prescriptionText: `PRESCRIÇÃO:\n1. Solução de ${solucao === 'nacl3' ? 'Cloreto de Sódio 3% (NaCl 3%) 500 mL' : 'Soro Fisiológico 0,9% 1000 mL'}\n   Via: Endovenosa\n   Infusão: Bomba de Infusão Contínua (BIC) a ${velo} mL/hora.\n   Meta: Elevação de 0,5 mEq/h de Na⁺ sérico.\n   Controle: Dosar Na⁺ sérico a cada 2 a 4 horas. Interromper infusão assim que atingir elevação de 8 mEq/L nas 24h.`,
          justificationText: `Hiponatremia sintomática grave (${naAtual} mEq/L). Água corporal total calculada em ${resultadoAdulto.act.toFixed(1)} L. Infusão de solução ${solucao === 'nacl3' ? 'hipertônica a 3%' : 'isotônica'} calculada pela fórmula de Adrogué-Madias para elevação controlada de 0,5 mEq/h, respeitando teto estrito de 8-10 mEq/24h contra mielinólise pontina.`
        },
        {
          id: 'conduct-nacl-bolus',
          title: 'Conduta 2: Bolus Rápido de Emergência (Convulsão / Coma / Edema Cerebral)',
          tag: 'Emergência Neurológica',
          description: 'Administrar 100 a 150 mL de NaCl 3% em bolus em 10 a 20 minutos. Repetir até 2x se sintomas persistirem (alvo agudo +4 a 6 mEq/L).',
          prescriptionText: `PRESCRIÇÃO DE EMERGÊNCIA (BOLUS NA HIPONATREMIA SINTOMÁTICA):\n1. Cloreto de Sódio 3% (NaCl 3%) --------------------- 150 mL\n   Via: Endovenosa rápida\n   Tempo de Infusão: Correr em 15 a 20 minutos.\n   Indicação: Alívio urgente do edema cerebral / crise convulsiva refratária.\n   Conduta após bolus: Checar sódio sérico imediato. Se melhora clínica, transicionar para infusão lenta.`,
          justificationText: `Emergência neurocrítica por edema cerebral hiponatrêmico agudo. Administração em bolus de salina hipertônica 3% com meta de elevar a natremia em 4-6 mEq/L rapidamente.`
        }
      ];
    } else if (tipoPaciente === 'pediatric' && resultadoPediatrico) {
      return [
        {
          id: 'conduct-ped-nacl',
          title: 'Conduta Pediátrica: Manutenção Diária e Limite Máximo de Sódio',
          tag: 'Pediatria',
          description: `Manutenção de ${resultadoPediatrico.manutencaoMin.toFixed(0)} a ${resultadoPediatrico.manutencaoMax.toFixed(0)} mEq/dia. Taxa máxima horária de ${resultadoPediatrico.limiteAbsolutoHora.toFixed(1)} mEq/h.`,
          prescriptionText: `PRESCRIÇÃO PEDIÁTRICA:\n1. Solução de Manutenção com Sódio (ex: SF 0,9% em SG 5%)\n   Dose Diária: ${resultadoPediatrico.manutencaoMin.toFixed(0)} a ${resultadoPediatrico.manutencaoMax.toFixed(0)} mEq de Na⁺/dia divididos nas 24 horas.\n   Limite Máximo Absoluto: Não ultrapassar ${resultadoPediatrico.limiteAbsolutoHora.toFixed(1)} mEq/hora.`,
          justificationText: `Manutenção hidroeletrolítica pediátrica peso-guiada (${peso} kg).`
        }
      ];
    }
    return [];
  }, [tipoPaciente, resultadoAdulto, resultadoPediatrico, solucao, naAtual, peso]);

  useEffect(() => {
    const paramsSummary =
      tipoPaciente === 'adult' && resultadoAdulto
        ? [
            `• Sódio Sérico Atual: ${naAtual} mEq/L (Normal: 135-145 mEq/L)`,
            `• Paciente: Adulto (${sexo === 'M' ? 'Masc' : 'Fem'}, ${idoso ? 'Idoso' : 'Não idoso'}), Peso: ${peso} kg`,
            `• Água Corporal Total (ACT): ${resultadoAdulto.act.toFixed(1)} L`,
            `• Solução: ${solucao === 'nacl3' ? 'NaCl 3% (513 mEq/L)' : 'NaCl 0,9% (154 mEq/L)'}`,
            `• Variação com 1000 mL: +${resultadoAdulto.variacaoCom1L.toFixed(2)} mEq/L | Velocidade para +0,5 mEq/h: ${resultadoAdulto.velocidadeSugeridaMlH.toFixed(0)} mL/h`
          ]
        : resultadoPediatrico
        ? [
            `• Paciente Pediátrico: ${peso} kg`,
            `• Manutenção Diária: ${resultadoPediatrico.manutencaoMin.toFixed(0)} a ${resultadoPediatrico.manutencaoMax.toFixed(0)} mEq/dia`,
            `• Limite Horário Absoluto: ${resultadoPediatrico.limiteAbsolutoHora.toFixed(1)} mEq/h`
          ]
        : [];

    onUpdatePrescriptionData({
      calculatorId: 'sodium',
      calculatorTitle: 'Calculadora médica - Reposição de Sódio (Hiponatremia Grave)',
      parametersSummary: paramsSummary,
      conductOptions,
      selectedConductId: conductOptions.some((c) => c.id === selectedConductId)
        ? selectedConductId
        : conductOptions[0]?.id || ''
    });
  }, [
    tipoPaciente,
    peso,
    sexo,
    idoso,
    naAtual,
    solucao,
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
      id: `nacl-${Date.now()}`,
      category: 'electrolyte',
      title: `Reposição de Sódio: ${activeConduct.title}`,
      orderText: activeConduct.prescriptionText,
      justificationText: activeConduct.justificationText || activeConduct.description,
      parameters:
        tipoPaciente === 'adult' && resultadoAdulto
          ? [
              `Na⁺ Atual: ${naAtual} mEq/L`,
              `ACT: ${resultadoAdulto.act.toFixed(1)} L`,
              `Solução: ${solucao === 'nacl3' ? 'NaCl 3%' : 'NaCl 0,9%'}`,
              `Velocidade: ${resultadoAdulto.velocidadeSugeridaMlH.toFixed(0)} mL/h`
            ]
          : [`Peso: ${peso} kg`],
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
          <h2 className="text-xl font-bold text-slate-900">Reposição de Sódio (Hiponatremia Grave)</h2>
          <p className="text-sm text-slate-600 mt-0.5">
            Fórmula de Adrogué-Madias, Água Corporal Total (ACT), velocidade para subida de 0,5 mEq/h e limites estritos contra desmielinização osmótica.
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

          <NumericInput
            label="Peso Corporal"
            unit="kg"
            value={peso}
            onChange={setPeso}
            step="0.5"
            min={1}
            max={200}
            helperText="Pode apagar o valor completamente com Backspace para redigitar"
          />

          {tipoPaciente === 'adult' && (
            <div className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Sexo Biológico</label>
                  <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setSexo('M')}
                      className={`py-1.5 text-xs font-semibold rounded-md transition-colors ${
                        sexo === 'M' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Masc
                    </button>
                    <button
                      type="button"
                      onClick={() => setSexo('F')}
                      className={`py-1.5 text-xs font-semibold rounded-md transition-colors ${
                        sexo === 'F' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Fem
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Faixa Etária</label>
                  <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setIdoso(false)}
                      className={`py-1.5 text-xs font-semibold rounded-md transition-colors ${
                        !idoso ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Adulto
                    </button>
                    <button
                      type="button"
                      onClick={() => setIdoso(true)}
                      className={`py-1.5 text-xs font-semibold rounded-md transition-colors ${
                        idoso ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Idoso
                    </button>
                  </div>
                </div>
              </div>

              <NumericInput
                label="Sódio Sérico Atual"
                unit="mEq/L"
                value={naAtual}
                onChange={setNaAtual}
                step="1"
                min={90}
                max={145}
                helperText="Valores < 120-125 mEq/L indicam hiponatremia grave"
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Solução para Reposição</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSolucao('nacl3')}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                      solucao === 'nacl3'
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    NaCl 3%
                    <span className="block text-[10px] font-normal opacity-85">513 mEq/L (Hipertônica)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSolucao('nacl09')}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                      solucao === 'nacl09'
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    NaCl 0,9% (SF)
                    <span className="block text-[10px] font-normal opacity-85">154 mEq/L (Isotônica)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-900 text-xs flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-rose-700" />
            <div>
              <strong>Limite de Segurança:</strong> Não ultrapassar elevação de <strong>8 a 10 mEq/L em 24h</strong>. Risco grave de <em>Síndrome de Desmielinização Osmótica (Mielinólise Pontina)</em>.
            </div>
          </div>
        </div>

        {/* Results & Selectable Conducts Column */}
        <div className="lg:col-span-7 space-y-4">
          {tipoPaciente === 'adult' && resultadoAdulto && (
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Variação com 1L</span>
                <span className="text-xl font-bold font-mono text-emerald-700 tabular-nums">
                  +{resultadoAdulto.variacaoCom1L.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">mEq/L por litro</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Vol. para +0,5 mEq</span>
                <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                  {resultadoAdulto.volPara05.toFixed(0)}
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">mL de solução</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Velocidade Sugerida</span>
                <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                  {resultadoAdulto.velocidadeSugeridaMlH.toFixed(0)}
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">mL/h em BIC</span>
              </div>
            </div>
          )}

          {/* Selectable Conducts */}
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

              {solucao === 'nacl3' && (
                <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-xs text-blue-950 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-blue-900">
                    <Beaker className="w-3.5 h-3.5 text-blue-700" />
                    <span>Como preparar Salina a 3% (NaCl 3%) no hospital:</span>
                  </div>
                  <p>
                    • Em frasco de 500 mL: <strong>445 mL de SF 0,9% + 55 mL de NaCl 20%</strong> (5,5 ampolas de 10 mL de NaCl 20%).
                  </p>
                </div>
              )}

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
