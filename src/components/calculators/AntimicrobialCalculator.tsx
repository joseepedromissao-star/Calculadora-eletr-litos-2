import React, { useState, useMemo, useEffect } from 'react';
import { calcularTfg } from '../../utils/calculations';
import { TOPOGRAPHY_MAP } from '../../data/clinicalData';
import {
  InfectionTopography,
  PediatricProfile,
  Gender,
  ActivePrescriptionData,
  ConductOption,
  PrescribedItem,
  PathologyScheme
} from '../../types';
import { NumericInput } from '../NumericInput';
import {
  Copy,
  Check,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Stethoscope,
  Clock,
  Layers,
  Flame,
  Eye,
  Pill,
  FileText,
  Plus,
  Info,
  Droplets,
  Activity,
  HeartPulse,
  Shield,
  Heart,
  Microscope,
  Scissors,
  Printer
} from 'lucide-react';

interface ConfiguredAntibiotic {
  id: string;
  patologiaId: string;
  patologiaNome: string;
  nome: string;
  doseValor: string;
  doseUnidade: string;
  horario: string;
  via: string;
  tempoInfusao: string;
  diluente: string;
  ajustadoParaTfg: boolean;
  justificativa: string;
  selecionado: boolean;
}

interface AntimicrobialCalculatorProps {
  onUpdatePrescriptionData: (data: ActivePrescriptionData) => void;
  onOpenPrescriptionModal: () => void;
  onAddPrescribedItem: (item: PrescribedItem) => void;
}

export const AntimicrobialCalculator: React.FC<AntimicrobialCalculatorProps> = ({
  onUpdatePrescriptionData,
  onOpenPrescriptionModal,
  onAddPrescribedItem
}) => {
  // Patient parameters
  const [idade, setIdade] = useState<number>(62);
  const [cr, setCr] = useState<number>(1.8);
  const [peso, setPeso] = useState<number>(72);
  const [sexo, setSexo] = useState<Gender>('M');

  // Pediatric specific
  const [altura, setAltura] = useState<number>(110);
  const [perfilPediatrico, setPerfilPediatrico] = useState<PediatricProfile>('3');

  // Topography and active pathology
  const [topografia, setTopografia] = useState<InfectionTopography>('5');
  const [selectedPatologiaId, setSelectedPatologiaId] = useState<string>('sepse-pulmonar');

  const [copied, setCopied] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  // Compute GFR
  const infoTfg = useMemo(() => {
    return calcularTfg(idade, cr, peso, sexo, altura, perfilPediatrico);
  }, [idade, cr, peso, sexo, altura, perfilPediatrico]);

  const currentTopography = TOPOGRAPHY_MAP[topografia];
  const activePathology =
    currentTopography.patologias.find((p) => p.id === selectedPatologiaId) ||
    currentTopography.patologias[0];

  // Configured antibiotics state for current pathology
  const [configuredDrugs, setConfiguredDrugs] = useState<Record<string, ConfiguredAntibiotic>>({});

  // Initialize or update configured drugs when active pathology or TFG changes
  useEffect(() => {
    if (!activePathology) return;

    setConfiguredDrugs((prev) => {
      const updated = { ...prev };
      activePathology.antibioticosRecomendados.forEach((atb) => {
        const drugConf = infoTfg.precisaAjuste ? atb.doseRenal : atb.dosePadrao;
        if (!updated[atb.id]) {
          updated[atb.id] = {
            id: atb.id,
            patologiaId: activePathology.id,
            patologiaNome: activePathology.nome,
            nome: atb.nome,
            doseValor: drugConf.valor,
            doseUnidade: drugConf.unidade,
            horario: drugConf.horario,
            via: drugConf.via,
            tempoInfusao: drugConf.tempo,
            diluente: drugConf.diluente,
            ajustadoParaTfg: infoTfg.precisaAjuste,
            justificativa: atb.doseRenal.obs,
            selecionado: true // Default checked for ease of prescribing
          };
        } else {
          // Update renal status if GFR changes
          updated[atb.id] = {
            ...updated[atb.id],
            ajustadoParaTfg: infoTfg.precisaAjuste,
            justificativa: atb.doseRenal.obs,
            doseValor: updated[atb.id].doseValor || drugConf.valor
          };
        }
      });
      return updated;
    });
  }, [activePathology, infoTfg]);

  const toggleDrug = (atbId: string) => {
    setConfiguredDrugs((prev) => {
      const cur = prev[atbId];
      if (!cur) return prev;
      return {
        ...prev,
        [atbId]: { ...cur, selecionado: !cur.selecionado }
      };
    });
  };

  const updateDrugField = (atbId: string, field: keyof ConfiguredAntibiotic, val: any) => {
    setConfiguredDrugs((prev) => {
      const cur = prev[atbId];
      if (!cur) return prev;
      return {
        ...prev,
        [atbId]: { ...cur, [field]: val }
      };
    });
  };

  const selectedForActivePathology = useMemo(() => {
    if (!activePathology) return [];
    return activePathology.antibioticosRecomendados
      .map((a) => configuredDrugs[a.id])
      .filter((d): d is ConfiguredAntibiotic => Boolean(d && d.selecionado));
  }, [activePathology, configuredDrugs]);

  // Formatted prescription order text for the active pathology
  const prescriptionFormattedOrder = useMemo(() => {
    if (selectedForActivePathology.length === 0) {
      return 'Nenhum antibiótico selecionado para esta patologia.';
    }

    const items = selectedForActivePathology.map((d, i) => {
      const doseFinal = `${d.doseValor} ${d.doseUnidade}`;
      return `${i + 1}. ${d.nome} ------------------------- ${doseFinal}\n   Via: ${d.via} (${d.diluente}${d.tempoInfusao ? `, em ${d.tempoInfusao}` : ''})\n   Posologia: de ${d.horario}\n   Indicação: ${activePathology.nome}\n   ${d.ajustadoParaTfg ? `* Ajustado p/ TFG = ${infoTfg.tfg.toFixed(1)} ${infoTfg.unidade} (${d.justificativa})` : '* Dose plena habitual'}`;
    });

    return items.join('\n\n');
  }, [selectedForActivePathology, activePathology, infoTfg]);

  // Sync to prescription data
  useEffect(() => {
    const paramsSummary = [
      `• Paciente: ${idade >= 18 ? 'Adulto' : 'Pediátrico'} (${idade} anos, ${cr} mg/dL Cr, ${peso} kg)`,
      `• TFG Calculada (${infoTfg.metodo}): ${infoTfg.tfg.toFixed(1)} ${infoTfg.unidade} (${infoTfg.estagioDrc})`,
      `• Patologia Infecciosa: ${activePathology?.nome || 'Não definida'} (${currentTopography.title})`,
      `• Status Renal: ${infoTfg.precisaAjuste ? '[!] TFG < 50 mL/min - AJUSTE OBRIGATÓRIO' : '[✓] TFG >= 50 mL/min - Doses Plenas'}`
    ];

    const conductOption: ConductOption = {
      id: 'conduct-atb-pathology',
      title: `Antimicrobianos para: ${activePathology?.nome || 'Patologia'}`,
      tag: infoTfg.precisaAjuste ? 'Ajuste Renal' : 'Dose Plena',
      description: `Esquema direcionado com ${selectedForActivePathology.length} antibiótico(s) calculados com dose, horário e via para ${activePathology?.nome}.`,
      prescriptionText: `PRESCRIÇÃO DE ANTIMICROBIANOS:\n${prescriptionFormattedOrder}\n\n* Reavaliação clínica e de antibiograma em 48 a 72 horas.`
    };

    onUpdatePrescriptionData({
      calculatorId: 'antimicrobial',
      calculatorTitle: 'Calculadora médica - Antimicrobianos e Ajuste Renal',
      parametersSummary: paramsSummary,
      conductOptions: [conductOption],
      selectedConductId: conductOption.id
    });
  }, [idade, cr, peso, infoTfg, activePathology, currentTopography, selectedForActivePathology, prescriptionFormattedOrder, onUpdatePrescriptionData]);

  const handleCopy = () => {
    navigator.clipboard.writeText(prescriptionFormattedOrder);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddToCombinedPrescription = () => {
    if (selectedForActivePathology.length === 0) return;

    const item: PrescribedItem = {
      id: `atb-${Date.now()}`,
      category: 'antimicrobial',
      title: `Antimicrobianos: ${activePathology.nome} (${selectedForActivePathology.map((d) => d.nome).join(' + ')})`,
      orderText: prescriptionFormattedOrder,
      justificationText: `Prescrição indicada para ${activePathology.nome} (${activePathology.foco}). Taxa de filtração glomerular estimada em ${infoTfg.tfg.toFixed(1)} ${infoTfg.unidade} (${infoTfg.estagioDrc}). ${infoTfg.precisaAjuste ? 'Doses e intervalos ajustados rigorosamente para disfunção renal conforme diretriz institucional.' : 'Função renal preservada (TFG ≥ 50 mL/min) permitindo posologia plena.'}`,
      parameters: [
        `Idade: ${idade} anos | Cr: ${cr} mg/dL | Peso: ${peso} kg`,
        `TFG (${infoTfg.metodo}): ${infoTfg.tfg.toFixed(1)} ${infoTfg.unidade}`,
        `Patologia: ${activePathology.nome}`,
        `Foco Infeccioso: ${activePathology.foco}`
      ],
      addedAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    onAddPrescribedItem(item);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-900">Antimicrobianos e Ajuste Renal por TFG</h2>
        <p className="text-sm text-slate-600 mt-0.5">
          Patologias e doenças organizadas por topografia com os antibióticos recomendados, cálculo de dose, posologia (horário) e via de administração ajustados para função renal.
        </p>
      </div>

      {/* GFR Hero Card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Filtração Glomerular & Dados do Paciente
          </span>
          <span className="text-xs font-mono text-slate-500">
            Método: {infoTfg.metodo}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <NumericInput
              label="Idade"
              unit="anos"
              value={idade}
              onChange={setIdade}
              step="1"
              min={0.1}
              max={115}
            />

            <NumericInput
              label="Creatinina"
              unit="mg/dL"
              value={cr}
              onChange={setCr}
              step="0.1"
              min={0.1}
              max={20}
            />

            {idade >= 18 ? (
              <>
                <NumericInput
                  label="Peso"
                  unit="kg"
                  value={peso}
                  onChange={setPeso}
                  step="1"
                  min={20}
                  max={250}
                />

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Sexo</label>
                  <div className="grid grid-cols-2 gap-1 p-0.5 bg-slate-100 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setSexo('M')}
                      className={`py-1.5 text-xs font-bold rounded ${
                        sexo === 'M' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                      }`}
                    >
                      Masc
                    </button>
                    <button
                      type="button"
                      onClick={() => setSexo('F')}
                      className={`py-1.5 text-xs font-bold rounded ${
                        sexo === 'F' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                      }`}
                    >
                      Fem
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <NumericInput
                  label="Altura"
                  unit="cm"
                  value={altura}
                  onChange={setAltura}
                  step="1"
                  min={30}
                  max={200}
                />

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Perfil Pediátrico</label>
                  <select
                    value={perfilPediatrico}
                    onChange={(e) => setPerfilPediatrico(e.target.value as PediatricProfile)}
                    className="w-full px-2 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  >
                    <option value="1">1: Prematuro (&lt; 1a, k=0.33)</option>
                    <option value="2">2: RN Termo (&lt; 1a, k=0.45)</option>
                    <option value="3">3: Criança / Adol Fem (k=0.55)</option>
                    <option value="4">4: Adol Masc (k=0.70)</option>
                  </select>
                </div>
              </>
            )}
          </div>

          {/* GFR result readout */}
          <div className="md:col-span-4 p-3.5 rounded-xl border bg-slate-50 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase text-slate-500 block">
                {idade >= 18 ? 'Clearance de Creatinina' : 'TFG Estimada (Schwartz)'}
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span
                  className={`text-2xl font-extrabold font-mono tabular-nums ${
                    infoTfg.precisaAjuste ? 'text-amber-700' : 'text-emerald-700'
                  }`}
                >
                  {infoTfg.tfg.toFixed(1)}
                </span>
                <span className="text-xs font-mono text-slate-500">{infoTfg.unidade}</span>
              </div>
              <span className="text-[10px] text-slate-500 block">{infoTfg.estagioDrc}</span>
            </div>

            <div className="text-right">
              {infoTfg.precisaAjuste ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-md">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Ajustar Dose
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-md">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Dose Padrão
                </span>
              )}
            </div>
          </div>
        </div>

        {infoTfg.precisaAjuste && (
          <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg text-amber-950 text-xs flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" />
            <div>
              <strong>[!] ALERTA CRÍTICO: TFG &lt; 50 mL/min ({infoTfg.tfg.toFixed(1)} {infoTfg.unidade})</strong>
              <p className="mt-0.5">
                É OBRIGATÓRIO realizar a correção de doses para a função renal. Os antibióticos abaixo foram automaticamente calculados com doses ou intervalos adequados para este clearance.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Topography Selector Tabs */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            1. Selecione a Topografia da Infecção (15 Topografias Clínicas)
          </label>
          <span className="text-xs text-slate-400 font-mono">
            {Object.keys(TOPOGRAPHY_MAP).length} topografias ativas
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {(
            [
              { id: '1', title: '1. Olhos', sub: 'Ocular / Órbita', icon: Eye },
              { id: '2', title: '2. Pele / Partes Moles', sub: 'Celulite, pé diabético', icon: Layers },
              { id: '3', title: '3. Queimados', sub: 'Sepse precoce / tardia', icon: Flame },
              { id: '4', title: '4. Respiratório', sub: 'PAC / PNAV / Aspirativa', icon: Stethoscope },
              { id: '5', title: '5. Sepse & Choque', sub: 'Hour-1 Bundle', icon: ShieldAlert },
              { id: '6', title: '6. Trato Urinário', sub: 'Cistite / Pielo / Urossepse', icon: Droplets },
              { id: '7', title: '7. SNC / Meningite', sub: 'Comunitária / Hospitalar', icon: Activity },
              { id: '8', title: '8. Intra-Abdominal', sub: 'Peritonite / C. difficile', icon: AlertTriangle },
              { id: '9', title: '9. Cardiovascular', sub: 'Endocardite infecciosa', icon: HeartPulse },
              { id: '10', title: '10. Osteoarticular', sub: 'Artrite / Osteomielite', icon: Shield },
              { id: '11', title: '11. Cabeça / Otorrino', sub: 'Ludwig / Mastoidite', icon: Stethoscope },
              { id: '12', title: '12. Ginecológico / IST', sub: 'DIP grave / Cervicite', icon: Heart },
              { id: '13', title: '13. Neutropenia Febril', sub: 'Alto risco oncológico', icon: ShieldAlert },
              { id: '14', title: '14. Fúngica Invasiva', sub: 'Candidemia em CTI', icon: Microscope },
              { id: '15', title: '15. Profilaxia Cirúrgica', sub: 'Prevenção de ISC', icon: Scissors }
            ] as const
          ).map((item) => {
            const Icon = item.icon;
            const isSelected = topografia === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setTopografia(item.id);
                  const firstPat = TOPOGRAPHY_MAP[item.id]?.patologias[0];
                  if (firstPat) setSelectedPatologiaId(firstPat.id);
                }}
                className={`p-2.5 text-left rounded-xl border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-slate-900 bg-slate-900 text-white shadow-xs ring-1 ring-slate-900'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span className={`text-[10px] font-mono px-1 rounded ${isSelected ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-500'}`}>
                    #{item.id}
                  </span>
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight line-clamp-1">{item.title}</div>
                  <span className={`text-[10px] block leading-tight mt-0.5 line-clamp-1 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    {item.sub}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pathology / Disease Selector Buttons */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          2. Selecione a Patologia / Doença Específica
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {currentTopography.patologias.map((pat) => {
            const isPatSelected = selectedPatologiaId === pat.id;
            return (
              <button
                key={pat.id}
                type="button"
                onClick={() => setSelectedPatologiaId(pat.id)}
                className={`p-3 text-left rounded-xl border transition-all ${
                  isPatSelected
                    ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 ring-2 ring-emerald-600/30'
                    : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-bold">{pat.nome}</span>
                  {pat.subtipo && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">
                      {pat.subtipo}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1">{pat.foco}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Pathology Details & Referenced Antibiotics */}
      {activePathology && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Patologia Ativa
                </span>
                <h3 className="text-base font-bold text-slate-900">{activePathology.nome}</h3>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                <strong>Foco etiológico:</strong> {activePathology.foco}
              </p>
            </div>
          </div>

          {/* Standard vs Renal Guidelines Banner from the Python Script */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div
              className={`p-3 rounded-lg border ${
                !infoTfg.precisaAjuste
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-medium'
                  : 'bg-slate-50 border-slate-200 text-slate-600 opacity-60'
              }`}
            >
              <div className="font-bold flex items-center justify-between mb-1">
                <span>Diretriz Padrão (TFG &ge; 50 mL/min)</span>
                {!infoTfg.precisaAjuste && (
                  <span className="text-[10px] bg-emerald-200/80 px-1.5 py-0.5 rounded font-mono">
                    Ativo
                  </span>
                )}
              </div>
              <p className="font-mono text-slate-900">{activePathology.dosePadraoTexto}</p>
            </div>

            <div
              className={`p-3 rounded-lg border ${
                infoTfg.precisaAjuste
                  ? 'bg-amber-50 border-amber-300 text-amber-950 font-medium'
                  : 'bg-slate-50 border-slate-200 text-slate-600 opacity-60'
              }`}
            >
              <div className="font-bold flex items-center justify-between mb-1">
                <span>Diretriz com Ajuste Renal (TFG &lt; 50 mL/min)</span>
                {infoTfg.precisaAjuste && (
                  <span className="text-[10px] bg-amber-200/80 px-1.5 py-0.5 rounded font-mono font-bold">
                    Obrigatório
                  </span>
                )}
              </div>
              <p className="font-mono text-slate-900">{activePathology.doseAjusteRenalTexto}</p>
            </div>
          </div>

          {activePathology.observacoes && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-slate-500" />
              <span>{activePathology.observacoes}</span>
            </div>
          )}

          {/* Referenced Antibiotics with Dose / Schedule / Route Customizer */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                3. Antibióticos Referenciados para {activePathology.nome}
              </label>
              <span className="text-xs text-slate-400">
                Marque para prescrever e edite os parâmetros
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {activePathology.antibioticosRecomendados.map((atb) => {
                const conf = configuredDrugs[atb.id] || {
                  id: atb.id,
                  patologiaId: activePathology.id,
                  patologiaNome: activePathology.nome,
                  nome: atb.nome,
                  doseValor: (infoTfg.precisaAjuste ? atb.doseRenal : atb.dosePadrao).valor,
                  doseUnidade: (infoTfg.precisaAjuste ? atb.doseRenal : atb.dosePadrao).unidade,
                  horario: (infoTfg.precisaAjuste ? atb.doseRenal : atb.dosePadrao).horario,
                  via: (infoTfg.precisaAjuste ? atb.doseRenal : atb.dosePadrao).via,
                  tempoInfusao: (infoTfg.precisaAjuste ? atb.doseRenal : atb.dosePadrao).tempo,
                  diluente: (infoTfg.precisaAjuste ? atb.doseRenal : atb.dosePadrao).diluente,
                  ajustadoParaTfg: infoTfg.precisaAjuste,
                  justificativa: atb.doseRenal.obs,
                  selecionado: true
                };

                return (
                  <div
                    key={atb.id}
                    className={`p-4 rounded-xl border transition-all ${
                      conf.selecionado
                        ? 'border-slate-900 bg-white shadow-sm ring-1 ring-slate-900'
                        : 'border-slate-200 bg-slate-50/70 opacity-75 hover:opacity-100'
                    }`}
                  >
                    {/* Header with checkbox */}
                    <div className="flex items-center justify-between mb-2.5">
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={conf.selecionado}
                          onChange={() => toggleDrug(atb.id)}
                          className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900 cursor-pointer"
                        />
                        <span className="text-sm font-bold text-slate-900">{atb.nome}</span>
                      </label>

                      {conf.ajustadoParaTfg ? (
                        <span className="text-[10px] font-mono bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">
                          Ajustado p/ TFG
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                          Dose Plena
                        </span>
                      )}
                    </div>

                    {conf.selecionado ? (
                      <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
                        {/* Dose & Unit */}
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                              Dose Calculada
                            </label>
                            <input
                              type="text"
                              value={conf.doseValor}
                              onChange={(e) => updateDrugField(atb.id, 'doseValor', e.target.value)}
                              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-mono font-bold focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                              Unidade
                            </label>
                            <select
                              value={conf.doseUnidade}
                              onChange={(e) => updateDrugField(atb.id, 'doseUnidade', e.target.value)}
                              className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs bg-white font-mono focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                            >
                              <option value="g">g (Gramas)</option>
                              <option value="mg">mg (Miligramas)</option>
                              <option value="mg/kg">mg/kg</option>
                            </select>
                          </div>
                        </div>

                        {/* Horário & Via */}
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                              Horário / Posologia
                            </label>
                            <select
                              value={conf.horario}
                              onChange={(e) => updateDrugField(atb.id, 'horario', e.target.value)}
                              className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs bg-white font-mono font-semibold focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                            >
                              <option value="4/4h">de 4/4h (6x/dia)</option>
                              <option value="6/6h">de 6/6h (4x/dia)</option>
                              <option value="8/8h">de 8/8h (3x/dia)</option>
                              <option value="12/12h">de 12/12h (2x/dia)</option>
                              <option value="24/24h">de 24/24h (1x/dia)</option>
                              <option value="48/48h">de 48/48h</option>
                              <option value="Dose única">Dose única</option>
                              <option value="Pós-hemodiálise">Após hemodiálise</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                              Via de Administração
                            </label>
                            <select
                              value={conf.via}
                              onChange={(e) => updateDrugField(atb.id, 'via', e.target.value)}
                              className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs bg-white font-mono font-semibold focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                            >
                              <option value="EV">Endovenosa (EV)</option>
                              <option value="VO">Via Oral (VO)</option>
                              <option value="IM">Intramuscular (IM)</option>
                            </select>
                          </div>
                        </div>

                        {/* Diluente & Tempo */}
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                              Diluente
                            </label>
                            <input
                              type="text"
                              value={conf.diluente}
                              onChange={(e) => updateDrugField(atb.id, 'diluente', e.target.value)}
                              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                              Tempo de Infusão
                            </label>
                            <input
                              type="text"
                              value={conf.tempoInfusao}
                              onChange={(e) => updateDrugField(atb.id, 'tempoInfusao', e.target.value)}
                              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                            />
                          </div>
                        </div>

                        {conf.justificativa && (
                          <p className="text-[10px] text-amber-800 bg-amber-50 p-2 rounded-md font-mono">
                            {conf.justificativa}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400">
                        Marque para prescrever este antibiótico para {activePathology.nome}.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Prescription Preview Box & Actions */}
          {selectedForActivePathology.length > 0 && (
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Prescrição Formatada ({activePathology.nome})
                </span>
                {addedNotice && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded animate-pulse">
                    ✓ Adicionado à Prescrição Combinada!
                  </span>
                )}
              </div>

              <div className="p-3.5 bg-slate-900 text-slate-200 rounded-xl font-mono text-xs whitespace-pre-wrap leading-relaxed border border-slate-800 shadow-inner">
                {prescriptionFormattedOrder}
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
                  onClick={handleAddToCombinedPrescription}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-950" />
                  <span>Adicionar à Prescrição Combinada</span>
                </button>

                <button
                  onClick={onOpenPrescriptionModal}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Abrir Prescrição Completa</span>
                </button>

                <button
                  onClick={() => {
                    handleAddToCombinedPrescription();
                    onOpenPrescriptionModal();
                  }}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-emerald-950 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Imprimir / Gerar PDF</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stewardship reminder */}
      <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-center gap-2.5">
        <Clock className="w-4 h-4 shrink-0 text-slate-500" />
        <span>
          <strong>Reavaliação Obrigatória:</strong> Recomenda-se a reavaliação dos antimicrobianos entre <strong>48 a 72 horas</strong> após o início da terapêutica com base nas hemoculturas e antibiograma definitivo para escalonamento ou descalonamento guiado.
        </span>
      </div>
    </div>
  );
};
