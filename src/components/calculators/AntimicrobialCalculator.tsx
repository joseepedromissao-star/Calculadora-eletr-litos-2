import React, { useState, useMemo } from 'react';
import { calcularTfg } from '../../utils/calculations';
import { TOPOGRAPHY_MAP } from '../../data/clinicalData';
import { InfectionTopography, PediatricProfile, Gender } from '../../types';
import {
  Copy,
  Check,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Stethoscope,
  Info,
  ChevronDown,
  ChevronUp,
  Clock,
  Layers,
  Flame,
  Eye
} from 'lucide-react';

export const AntimicrobialCalculator: React.FC = () => {
  // Patient / GFR inputs
  const [idade, setIdade] = useState<number>(62);
  const [cr, setCr] = useState<number>(1.8);
  const [peso, setPeso] = useState<number>(72);
  const [sexo, setSexo] = useState<Gender>('M');

  // Pediatric specific
  const [altura, setAltura] = useState<number>(110);
  const [perfilPediatrico, setPerfilPediatrico] = useState<PediatricProfile>('3');

  // Topography selection
  const [topografia, setTopografia] = useState<InfectionTopography>('5'); // Default: Sepse
  const [expandedScheme, setExpandedScheme] = useState<string | null>(null);

  const [copied, setCopied] = useState(false);

  // Calculate GFR
  const infoTfg = useMemo(() => {
    return calcularTfg(idade, cr, peso, sexo, altura, perfilPediatrico);
  }, [idade, cr, peso, sexo, altura, perfilPediatrico]);

  const topografiaData = TOPOGRAPHY_MAP[topografia];

  const prescriptionText = useMemo(() => {
    const lines = [
      `AVALIAÇÃO DE ANTIMICROBIANOS E AJUSTE RENAL`,
      `• Paciente: ${idade < 18 ? 'Pediátrico' : 'Adulto'} (${idade} anos), Creatinina: ${cr.toFixed(2)} mg/dL`,
      `• Taxa de Filtração Glomerular (${infoTfg.metodo}): ${infoTfg.tfg.toFixed(1)} ${infoTfg.unidade}`,
      `• Classificação: ${infoTfg.estagioDrc}`,
      `• Status de Ajuste Renal: ${
        infoTfg.precisaAjuste
          ? '[!] TFG < 50 mL/min - AJUSTE DE DOSE OBRIGATÓRIO'
          : '[✓] TFG >= 50 mL/min - Doses Plenas / Padrão'
      }`,
      `\nTOPOGRAFIA SELECIONADA: ${topografiaData.title.toUpperCase()}`
    ];

    topografiaData.schemes.forEach((s) => {
      lines.push(`\n[${s.nome.toUpperCase()}]`);
      lines.push(`Foco: ${s.foco}`);
      if (infoTfg.precisaAjuste) {
        lines.push(`Prescrição Recomendada: ${s.doseAjusteRenal}`);
      } else {
        lines.push(`Prescrição Padrão: ${s.dosePadrao}`);
      }
      if (s.observacoes) {
        lines.push(`Observações: ${s.observacoes}`);
      }
    });

    lines.push(`\n* Recomenda-se a reavaliação dos antimicrobianos entre 48 a 72 horas após o início da terapêutica.`);
    return lines.join('\n');
  }, [idade, cr, infoTfg, topografiaData]);

  const handleCopy = () => {
    navigator.clipboard.writeText(prescriptionText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-900">Calculadora de Antimicrobianos e Ajuste Renal</h2>
        <p className="text-sm text-slate-600 mt-0.5">
          Cálculo automatizado do Clearance de Creatinina / TFG (Cockcroft-Gault para adultos e Schwartz para pediatria) com protocolos terapêuticos e diretrizes de ajuste para TFG &lt; 50 mL/min.
        </p>
      </div>

      {/* TFG & Renal Status Hero Card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Filtração Glomerular & Triagem Renal
          </span>
          <span className="text-xs font-mono text-slate-500">
            Método: {infoTfg.metodo}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Idade (anos)</label>
              <input
                type="number"
                min="0.1"
                max="115"
                step="1"
                value={idade}
                onChange={(e) => setIdade(parseFloat(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Creatinina (mg/dL)</label>
              <input
                type="number"
                min="0.1"
                max="20"
                step="0.1"
                value={cr}
                onChange={(e) => setCr(parseFloat(e.target.value) || 0.1)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>

            {idade >= 18 ? (
              <>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Peso (kg)</label>
                  <input
                    type="number"
                    min="20"
                    max="250"
                    step="1"
                    value={peso}
                    onChange={(e) => setPeso(parseFloat(e.target.value) || 70)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Sexo</label>
                  <div className="grid grid-cols-2 gap-1 p-0.5 bg-slate-100 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setSexo('M')}
                      className={`py-1 text-xs font-bold rounded ${
                        sexo === 'M' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                      }`}
                    >
                      M
                    </button>
                    <button
                      type="button"
                      onClick={() => setSexo('F')}
                      className={`py-1 text-xs font-bold rounded ${
                        sexo === 'F' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                      }`}
                    >
                      F
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Altura (cm)</label>
                  <input
                    type="number"
                    min="30"
                    max="200"
                    step="1"
                    value={altura}
                    onChange={(e) => setAltura(parseFloat(e.target.value) || 100)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Perfil (Schwartz)</label>
                  <select
                    value={perfilPediatrico}
                    onChange={(e) => setPerfilPediatrico(e.target.value as PediatricProfile)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  >
                    <option value="1">1: Prematuro (&lt; 1 ano, k=0.33)</option>
                    <option value="2">2: RN Termo (&lt; 1 ano, k=0.45)</option>
                    <option value="3">3: Criança / Adol Fem (k=0.55)</option>
                    <option value="4">4: Adol Masc (k=0.70)</option>
                  </select>
                </div>
              </>
            )}
          </div>

          {/* TFG Score Readout */}
          <div className="md:col-span-4 p-3.5 rounded-xl border bg-slate-50 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase text-slate-500 block">
                {idade >= 18 ? 'Clearance (Cockcroft-Gault)' : 'TFG Estimada (Schwartz)'}
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
              <span className="text-[11px] text-slate-500 block">{infoTfg.estagioDrc}</span>
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

        {/* Critical Alert Bar if GFR < 50 */}
        {infoTfg.precisaAjuste ? (
          <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg text-amber-950 text-xs flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" />
            <div>
              <strong>[!] ALERTA CRÍTICO: TFG &lt; 50 mL/min ({infoTfg.tfg.toFixed(1)} {infoTfg.unidade})</strong>
              <p className="mt-0.5">
                É OBRIGATÓRIO realizar a correção de doses para a função renal do doente. As prescrições recomendadas abaixo já destacam a necessidade de ajuste renal.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-950 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-700" />
            <div>
              <strong>[✓] TFG &ge; 50 mL/min:</strong> As doses empíricas plenas habituais podem ser utilizadas com segurança para o tratamento inicial.
            </div>
          </div>
        )}
      </div>

      {/* Topography Selector Tabs */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Topografia da Infecção
          </label>
          <span className="text-xs text-slate-500">Selecione o foco para exibir o esquema</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {(
            [
              { id: '1', title: '1. Olhos', icon: Eye },
              { id: '2', title: '2. Pele / Partes Moles', icon: Layers },
              { id: '3', title: '3. Queimados', icon: Flame },
              { id: '4', title: '4. Trato Respiratório', icon: Stethoscope },
              { id: '5', title: '5. Sepse & Choque', icon: ShieldAlert }
            ] as const
          ).map((item) => {
            const Icon = item.icon;
            const isSelected = topografia === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTopografia(item.id)}
                className={`p-3 text-left rounded-xl border transition-all ${
                  isSelected
                    ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <Icon className="w-4 h-4 mb-1.5 opacity-85" />
                <div className="text-xs font-bold leading-snug">{item.title}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Topography Schemes Display */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>Esquemas para: {topografiaData.title}</span>
            <span className="text-xs font-normal text-slate-500">({topografiaData.subtitle})</span>
          </h3>
          <button
            onClick={handleCopy}
            className="text-xs flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado!' : 'Copiar Conduta'}</span>
          </button>
        </div>

        <div className="space-y-3">
          {topografiaData.schemes.map((scheme) => {
            const isExpanded = expandedScheme === scheme.id;
            return (
              <div
                key={scheme.id}
                className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 transition-shadow hover:shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="text-base font-bold text-slate-900">{scheme.nome}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{scheme.foco}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {scheme.farmacos.map((f, i) => (
                      <span key={i} className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Prescription Box depending on Renal Function */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Dose Padrão */}
                  <div
                    className={`p-3.5 rounded-lg border text-xs space-y-1 ${
                      !infoTfg.precisaAjuste
                        ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/20'
                        : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span>Dose Padrão (TFG &ge; 50 mL/min)</span>
                      {!infoTfg.precisaAjuste && (
                        <span className="text-[10px] text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                          Ativa para este paciente
                        </span>
                      )}
                    </div>
                    <p className="font-mono text-slate-900 leading-relaxed">{scheme.dosePadrao}</p>
                  </div>

                  {/* Dose com Ajuste Renal */}
                  <div
                    className={`p-3.5 rounded-lg border text-xs space-y-1 ${
                      infoTfg.precisaAjuste
                        ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-500/20'
                        : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span>Ajuste Renal (TFG &lt; 50 mL/min)</span>
                      {infoTfg.precisaAjuste && (
                        <span className="text-[10px] text-amber-900 bg-amber-200/80 px-1.5 py-0.5 rounded">
                          Obrigatório para este paciente
                        </span>
                      )}
                    </div>
                    <p className="font-mono text-slate-900 leading-relaxed font-semibold">
                      {scheme.doseAjusteRenal}
                    </p>
                  </div>
                </div>

                {/* Clinical Notes & Observations */}
                {scheme.observacoes && (
                  <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg flex items-start gap-2">
                    <Info className="w-4 h-4 shrink-0 text-slate-500 mt-0.5" />
                    <span>{scheme.observacoes}</span>
                  </div>
                )}

                {/* Detailed Renal Clearance Adjustment Table Toggle */}
                {scheme.detalhesAjuste && scheme.detalhesAjuste.length > 0 && (
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setExpandedScheme(isExpanded ? null : scheme.id)}
                      className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1 transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      <span>
                        {isExpanded
                          ? 'Ocultar tabela detalhada de ClCr para os fármacos'
                          : 'Ver faixas exatas de ClCr e doses ajustadas dos antibióticos'}
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="mt-3 space-y-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                        {scheme.detalhesAjuste.map((detalhe, idx) => (
                          <div key={idx} className="space-y-1.5">
                            <span className="text-xs font-bold text-slate-900 block font-mono">
                              Ajuste Específico: {detalhe.farmaco}
                            </span>
                            <div className="border border-slate-200 rounded-md overflow-hidden bg-white">
                              <table className="min-w-full divide-y divide-slate-200 text-xs">
                                <thead className="bg-slate-100">
                                  <tr>
                                    <th className="px-3 py-1.5 text-left font-bold text-slate-600 w-1/3">
                                      Faixa de ClCr / Condição
                                    </th>
                                    <th className="px-3 py-1.5 text-left font-bold text-slate-600">
                                      Dose Ajustada Recomendada
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 font-mono">
                                  {detalhe.clcrFaixas.map((f, fi) => (
                                    <tr key={fi} className="hover:bg-slate-50">
                                      <td className="px-3 py-1.5 text-slate-700 font-semibold">{f.faixa}</td>
                                      <td className="px-3 py-1.5 text-slate-900">{f.dose}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Global Re-evaluation Notice */}
        <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-center gap-2.5">
          <Clock className="w-4 h-4 shrink-0 text-slate-500" />
          <span>
            <strong>Diretriz de Stewardship Antimicrobiano:</strong> Recomenda-se a reavaliação clínica e laboratorial obrigatória de todos os antimicrobianos entre <strong>48 a 72 horas</strong> após o início da terapêutica com base nas hemoculturas e antibiograma definitivo (escalonamento ou descalonamento guiado).
          </span>
        </div>
      </div>
    </div>
  );
};
