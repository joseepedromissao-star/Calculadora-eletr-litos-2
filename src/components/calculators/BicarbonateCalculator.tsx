import React, { useState, useMemo } from 'react';
import { calcularBicarbonato } from '../../utils/calculations';
import { BicarbonateIndication, BicarbonatePatient } from '../../types';
import { AlertCircle, Copy, Check, ShieldAlert, HeartPulse, Flame, Activity, Info } from 'lucide-react';

interface BicarbonateCalculatorProps {
  onUpdateSummary?: (text: string) => void;
}

export const BicarbonateCalculator: React.FC<BicarbonateCalculatorProps> = () => {
  const [indicacao, setIndicacao] = useState<BicarbonateIndication>('metabolic_acidosis');
  const [paciente, setPaciente] = useState<BicarbonatePatient>('adult');
  const [peso, setPeso] = useState<number>(70);
  const [copied, setCopied] = useState(false);

  const resultado = useMemo(() => {
    return calcularBicarbonato(indicacao, paciente, peso);
  }, [indicacao, paciente, peso]);

  const prescriptionText = useMemo(() => {
    if (!resultado) return '';
    const indNome =
      indicacao === 'metabolic_acidosis'
        ? `Acidose Metabólica Grave (${paciente === 'adult' ? 'Adulto' : paciente === 'pediatric' ? 'Pediátrico' : 'Neonato'}, ${peso} kg)`
        : indicacao === 'hyperkalemia'
        ? 'Hipercalemia Grave com Repercussão Eletrocardiográfica'
        : 'Parada Cardiorrespiratória (PCR)';

    const lines = [
      `PRESCRIÇÃO - BICARBONATO DE SÓDIO 8,4% (1 mEq/mL)`,
      `• Indicação: ${indNome}`,
      `• Dose Calculada: ${resultado.detalheDose}`
    ];

    if (resultado.ampolasMin !== undefined && resultado.ampolasMax !== undefined) {
      lines.push(
        `• Quantidade de Ampolas (10 mL = 10 mEq): ${resultado.ampolasMin.toFixed(1)} a ${resultado.ampolasMax.toFixed(1)} ampolas`
      );
      lines.push(`• Taxa Máxima de Infusão: ${resultado.taxaMaxMeqH?.toFixed(1)} mEq/hora`);
      lines.push(`• Tempo de Infusão Recomendado: ${resultado.tempoInfusaoHoras}`);
    }

    lines.push(`• Orientações e Regras de Segurança:`);
    resultado.orientacoes.forEach((o) => lines.push(`  - ${o}`));

    return lines.join('\n');
  }, [indicacao, paciente, peso, resultado]);

  const handleCopy = () => {
    navigator.clipboard.writeText(prescriptionText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-900">Reposição de Bicarbonato de Sódio (8,4%)</h2>
        <p className="text-sm text-slate-600 mt-0.5">
          Apresentação padrão: 8,4% (1 mEq = 1 mL = 10 mEq por ampola de 10 mL). Dosagens específicas para Acidose Metabólica, Hipercalemia e PCR.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-5 bg-white p-5 rounded-xl border border-slate-200">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Seleção Clínica</h3>

          {/* Indication radio buttons */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">Cenário Clínico / Indicação</label>

            <button
              type="button"
              onClick={() => setIndicacao('metabolic_acidosis')}
              className={`w-full p-3 text-left rounded-lg border transition-all flex items-start gap-3 ${
                indicacao === 'metabolic_acidosis'
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              <Activity className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold">1. Acidose Metabólica Grave</div>
                <div className="text-[11px] opacity-80">
                  pH &lt; 7.15 ou HCO₃⁻ &lt; 6-8 mEq/L (2 a 5 mEq/kg em 4 a 8h)
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setIndicacao('hyperkalemia')}
              className={`w-full p-3 text-left rounded-lg border transition-all flex items-start gap-3 ${
                indicacao === 'hyperkalemia'
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              <Flame className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold">2. Hipercalemia Aguda (Adulto)</div>
                <div className="text-[11px] opacity-80">
                  Desvio intracelular rápido: 50 mEq (50 mL) EV em 5 minutos
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setIndicacao('cardiac_arrest')}
              className={`w-full p-3 text-left rounded-lg border transition-all flex items-start gap-3 ${
                indicacao === 'cardiac_arrest'
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              <HeartPulse className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold">3. Parada Cardiorrespiratória (PCR)</div>
                <div className="text-[11px] opacity-80">
                  EV Direto em via exclusiva com solução PURA (1 mEq/kg)
                </div>
              </div>
            </button>
          </div>

          {/* Conditional inputs for Metabolic Acidosis */}
          {indicacao === 'metabolic_acidosis' && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
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

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-700">Peso Corporal (kg)</label>
                  <span className="text-xs font-mono font-bold text-slate-900">{peso} kg</span>
                </div>
                <input
                  type="number"
                  step={paciente === 'neonatal' ? '0.1' : '1'}
                  min="0.5"
                  max="200"
                  value={peso}
                  onChange={(e) => setPeso(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                />
              </div>
            </div>
          )}

          {/* Warning box */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
            <div>
              <strong>Incompatibilidade Físico-Química Crítica:</strong> NUNCA misturar Bicarbonato de Sódio com Gluconato de Cálcio, Cloreto de Cálcio, Noradrenalina ou Dopamina no mesmo equipo/lúmen (ocorre precipitação insolúvel imediata de Carbonato de Cálcio).
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Conduta Terapêutica Recomendada
              </span>
              <span className="text-xs font-mono font-semibold text-emerald-700">
                {indicacao === 'metabolic_acidosis'
                  ? 'Acidose Metabólica'
                  : indicacao === 'hyperkalemia'
                  ? 'Hipercalemia'
                  : 'PCR'}
              </span>
            </div>

            {indicacao === 'metabolic_acidosis' && resultado.doseMinMeq !== undefined && (
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[11px] text-slate-500 block">Dose em mEq</span>
                  <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                    {resultado.doseMinMeq.toFixed(0)} - {resultado.doseMaxMeq?.toFixed(0)}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-mono">mEq NaHCO₃</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[11px] text-slate-500 block">Ampolas (10mL a 8,4%)</span>
                  <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                    {resultado.ampolasMin?.toFixed(1)} - {resultado.ampolasMax?.toFixed(1)}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-mono">ampolas</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[11px] text-slate-500 block">Taxa Máxima</span>
                  <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                    {resultado.taxaMaxMeqH?.toFixed(0)}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-mono">mEq/hora</span>
                </div>
              </div>
            )}

            {/* Prescriptive Text Box */}
            <div className="p-3.5 bg-slate-900 text-white rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Prescrição Médica Formatada
                </span>
                <button
                  onClick={handleCopy}
                  className="text-xs flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
              <pre className="text-xs font-mono leading-relaxed whitespace-pre-wrap text-slate-200">
                {prescriptionText}
              </pre>
            </div>

            {/* Clinical rules summary */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Regras de Administração por Perfil</h4>
              <div className="space-y-2 text-xs text-slate-600">
                {paciente === 'adult' && (
                  <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-lg text-blue-950">
                    <strong>Adulto em Acesso Periférico (AVP):</strong> Para reduzir a osmolaridade (solução a 8,4% tem ~2000 mOsm/L) e prevenir flebite intensa ou necrose tecidual em caso de extravasamento, diluir no máximo <strong>10 mL de NaHCO₃ 8,4% para cada 50 mL de SG 5% ou Água Destilada</strong>.
                  </div>
                )}
                {paciente === 'pediatric' && (
                  <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg text-amber-950">
                    <strong>Pediatria:</strong> Obrigatório o uso de <strong>Cateter Venoso Central (CVC)</strong> para soluções concentradas ou diluir para concentração isotônica se AVP provisório.
                  </div>
                )}
                {paciente === 'neonatal' && (
                  <div className="p-3 bg-rose-50/60 border border-rose-200 rounded-lg text-rose-950">
                    <strong>Neonato:</strong> Infundir em velocidade muito lenta (máx 10 mEq/min). Concentração final <strong>0,5 mEq/mL</strong> (diluir 1:1 rigorosamente com Água Destilada).
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
