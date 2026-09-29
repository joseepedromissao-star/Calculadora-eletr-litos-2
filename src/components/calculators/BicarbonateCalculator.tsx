import React, { useState, useMemo, useEffect } from 'react';
import { calcularBicarbonato } from '../../utils/calculations';
import { BicarbonateIndication, BicarbonatePatient, ActivePrescriptionData, ConductOption, PrescribedItem } from '../../types';
import { NumericInput } from '../NumericInput';
import { Copy, Check, ShieldAlert, CheckCircle2, FileText, Activity, Flame, HeartPulse, Plus } from 'lucide-react';

interface BicarbonateCalculatorProps {
  onUpdatePrescriptionData: (data: ActivePrescriptionData) => void;
  onOpenPrescriptionModal: () => void;
  onAddPrescribedItem: (item: PrescribedItem) => void;
}

export const BicarbonateCalculator: React.FC<BicarbonateCalculatorProps> = ({
  onUpdatePrescriptionData,
  onOpenPrescriptionModal,
  onAddPrescribedItem
}) => {
  const [indicacao, setIndicacao] = useState<BicarbonateIndication>('metabolic_acidosis');
  const [paciente, setPaciente] = useState<BicarbonatePatient>('adult');
  const [peso, setPeso] = useState<number>(70);

  const [selectedConductId, setSelectedConductId] = useState<string>('conduct-bicarb-standard');
  const [copied, setCopied] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  const resultado = useMemo(() => {
    return calcularBicarbonato(indicacao, paciente, peso);
  }, [indicacao, paciente, peso]);

  // Selectable conducts
  const conductOptions: ConductOption[] = useMemo(() => {
    if (indicacao === 'metabolic_acidosis') {
      const minDose = (2 * peso).toFixed(0);
      const maxDose = (5 * peso).toFixed(0);
      const ampMin = (2 * peso / 10).toFixed(1);
      const ampMax = (5 * peso / 10).toFixed(1);
      const taxaMax = peso.toFixed(0);

      const diluenteTexto =
        paciente === 'adult'
          ? 'Diluído em SG 5% ou Água Destilada (máx 10 mL de NaHCO₃ para cada 50 mL de diluente se AVP)'
          : paciente === 'pediatric'
          ? 'Cateter Venoso Central (CVC) obrigatório pela hiperosmolaridade'
          : 'Diluir 1:1 com Água Destilada (concentração 0,5 mEq/mL), infundir muito lentamente';

      return [
        {
          id: 'conduct-bicarb-standard',
          title: `Conduta: Reposição Controlada em BIC (${minDose} a ${maxDose} mEq)`,
          tag: 'Acidose Metabólica Grave',
          description: `Infundir ${ampMin} a ${ampMax} ampolas (10 mL = 10 mEq) em 4 a 8 horas (taxa máx ${taxaMax} mEq/h). ${diluenteTexto}.`,
          prescriptionText: `PRESCRIÇÃO:\n1. Bicarbonato de Sódio 8,4% (10 mL = 10 mEq) ------ ${ampMin} ampolas (${minDose} mEq)\n   Soro Glicosado 5% (SG 5%) ------------------------- 250 mL\n   Via: ${paciente === 'pediatric' ? 'Endovenosa Central (CVC)' : 'Endovenosa'}\n   Infusão: Bomba de Infusão Contínua (BIC) em 6 horas (Taxa máx: ${taxaMax} mEq/h).\n   Alvo Clínico: Elevar pH para ~7,20 e HCO₃⁻ para 10-12 mEq/L (evitar alcalose de rebote).\n   Atenção: Não infundir no mesmo acesso com Cálcio ou Catecolaminas.`,
          justificationText: `Acidose metabólica severa. Reposição calculada de ${minDose} a ${maxDose} mEq de NaHCO₃ 8,4% infundida lentamente em 4 a 8 horas com meta de atingir pH ≥ 7,20 seguro.`
        }
      ];
    } else if (indicacao === 'hyperkalemia') {
      return [
        {
          id: 'conduct-bicarb-hyperk',
          title: 'Conduta: Bolus Rápido para Desvio Intracelular (Hipercalemia Aguda)',
          tag: 'Emergência',
          description: 'Administrar 50 mEq (50 mL de NaHCO₃ 8,4%) EV em 5 minutos para estimular influxo de potássio via Na⁺/H⁺.',
          prescriptionText: `PRESCRIÇÃO DE EMERGÊNCIA (HIPERCALEMIA COM ALTERAÇÃO NO ECG):\n1. Bicarbonato de Sódio 8,4% ------------------------- 50 mL (50 mEq)\n   Via: Endovenosa rápida\n   Tempo de Infusão: Correr em 5 minutos.\n   Medidas associadas: Administrar Gluconato de Cálcio 10% 10 mL EV em 3 min se QRS alargado e iniciar Solução Polarizante (Glicoinsulina).`,
          justificationText: `Hipercalemia aguda com repercussão eletrocardiográfica. Desvio intracelular rápido de potássio.`
        }
      ];
    } else {
      return [
        {
          id: 'conduct-bicarb-pcr',
          title: 'Conduta: Bolus Direto em PCR (Solução Pura)',
          tag: 'Parada Cardiorrespiratória',
          description: 'Administrar 1 mEq/kg EV direto em via exclusiva, sem diluição. Indicado em hipercalemia preexistente ou intoxicação por tricíclicos.',
          prescriptionText: `CONDUTA EM PCR:\n1. Bicarbonato de Sódio 8,4% ------------------------- ${(peso * 1).toFixed(0)} mL (${peso} mEq)\n   Via: Endovenosa Direta (Push)\n   Administração: Solução PURA, via exclusiva.\n   Atenção: Lavar a via com SF 0,9% antes e após (incompatível com adrenalina).`,
          justificationText: `PCR em contexto de acidose grave preexistente ou hipercalemia.`
        }
      ];
    }
  }, [indicacao, paciente, peso]);

  useEffect(() => {
    const paramsSummary = [
      `• Indicação Selecionada: ${
        indicacao === 'metabolic_acidosis'
          ? 'Acidose Metabólica Grave'
          : indicacao === 'hyperkalemia'
          ? 'Hipercalemia Aguda (Adulto)'
          : 'Parada Cardiorrespiratória (PCR)'
      }`,
      ...(indicacao === 'metabolic_acidosis'
        ? [
            `• Perfil: ${paciente === 'adult' ? 'Adulto' : paciente === 'pediatric' ? 'Pediátrico' : 'Neonato'}, Peso: ${peso} kg`,
            `• Dose Total Estimada: ${(2 * peso).toFixed(0)} a ${(5 * peso).toFixed(0)} mEq (${(2 * peso / 10).toFixed(1)} a ${(5 * peso / 10).toFixed(1)} ampolas)`,
            `• Taxa Máxima de Infusão: ${peso} mEq/h (tempo de 4 a 8 horas)`
          ]
        : [])
    ];

    onUpdatePrescriptionData({
      calculatorId: 'bicarbonate',
      calculatorTitle: 'Calculadora médica - Reposição de Bicarbonato de Sódio (8,4%)',
      parametersSummary: paramsSummary,
      conductOptions,
      selectedConductId: conductOptions.some((c) => c.id === selectedConductId)
        ? selectedConductId
        : conductOptions[0]?.id || ''
    });
  }, [indicacao, paciente, peso, conductOptions, selectedConductId, onUpdatePrescriptionData]);

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
      id: `bicarb-${Date.now()}`,
      category: 'electrolyte',
      title: `Bicarbonato de Sódio 8,4%: ${activeConduct.title}`,
      orderText: activeConduct.prescriptionText,
      justificationText: activeConduct.justificationText || activeConduct.description,
      parameters: [`Indicação: ${indicacao}`, `Peso: ${peso} kg`],
      addedAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    onAddPrescribedItem(item);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-900">Reposição de Bicarbonato de Sódio (8,4%)</h2>
        <p className="text-sm text-slate-600 mt-0.5">
          Apresentação padrão: 8,4% (1 mEq = 1 mL = 10 mEq por ampola de 10 mL). Dosagens específicas para Acidose Metabólica, Hipercalemia e PCR.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-4 bg-white p-5 rounded-xl border border-slate-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Seleção Clínica</h3>

          {/* Indication selection */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setIndicacao('metabolic_acidosis')}
              className={`w-full p-3 text-left rounded-lg border transition-all flex items-start gap-2.5 ${
                indicacao === 'metabolic_acidosis'
                  ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              <Activity className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold">1. Acidose Metabólica Grave</div>
                <div className="text-[11px] opacity-80">2 a 5 mEq/kg em 4 a 8 horas (BIC)</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setIndicacao('hyperkalemia')}
              className={`w-full p-3 text-left rounded-lg border transition-all flex items-start gap-2.5 ${
                indicacao === 'hyperkalemia'
                  ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              <Flame className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold">2. Hipercalemia Aguda (Adulto)</div>
                <div className="text-[11px] opacity-80">50 mEq (50 mL) EV em 5 minutos</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setIndicacao('cardiac_arrest')}
              className={`w-full p-3 text-left rounded-lg border transition-all flex items-start gap-2.5 ${
                indicacao === 'cardiac_arrest'
                  ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              <HeartPulse className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold">3. Parada Cardiorrespiratória (PCR)</div>
                <div className="text-[11px] opacity-80">1 mEq/kg EV Direto pura em via exclusiva</div>
              </div>
            </button>
          </div>

          {/* Conditional inputs */}
          {indicacao === 'metabolic_acidosis' && (
            <div className="space-y-3.5 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Perfil do Paciente</label>
                <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setPaciente('adult')}
                    className={`py-1.5 text-xs font-semibold rounded-md transition-colors ${
                      paciente === 'adult' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Adulto
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaciente('pediatric')}
                    className={`py-1.5 text-xs font-semibold rounded-md transition-colors ${
                      paciente === 'pediatric' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Pediátrico
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaciente('neonatal')}
                    className={`py-1.5 text-xs font-semibold rounded-md transition-colors ${
                      paciente === 'neonatal' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Neonato
                  </button>
                </div>
              </div>

              <NumericInput
                label="Peso Corporal"
                unit="kg"
                value={peso}
                onChange={setPeso}
                step={paciente === 'neonatal' ? 0.1 : 1}
                min={0.5}
                max={200}
                helperText="Campo numérico totalmente editável (use Backspace para limpar)"
              />
            </div>
          )}

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
            <div>
              <strong>Incompatibilidade Físico-Química:</strong> NUNCA infundir Bicarbonato junto com Cálcio, Noradrenalina ou Dopamina (ocorre precipitação imediata).
            </div>
          </div>
        </div>

        {/* Results & Selectable Conducts Column */}
        <div className="lg:col-span-7 space-y-4">
          {indicacao === 'metabolic_acidosis' && resultado.doseMinMeq !== undefined && (
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Dose em mEq</span>
                <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                  {resultado.doseMinMeq.toFixed(0)} - {resultado.doseMaxMeq?.toFixed(0)}
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">mEq NaHCO₃</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Ampolas (10mL a 8,4%)</span>
                <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                  {resultado.ampolasMin?.toFixed(1)} - {resultado.ampolasMax?.toFixed(1)}
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">ampolas</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Taxa Máxima</span>
                <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                  {resultado.taxaMaxMeqH?.toFixed(0)}
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">mEq/hora</span>
              </div>
            </div>
          )}

          {/* Selectable Conducts */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Conduta Selecionável para a Prescrição
                </h3>
                <p className="text-[11px] text-slate-500">
                  Pode ser combinada com antibióticos no mesmo documento.
                </p>
              </div>
              {addedNotice && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded animate-pulse">
                  ✓ Bicarbonato Adicionado à Prescrição!
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
        </div>
      </div>
    </div>
  );
};
