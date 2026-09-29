import React, { useState, useMemo } from 'react';
import { calcularPotassioAdulto, calcularPotassioPediatrico } from '../../utils/calculations';
import { VenousAccess, PatientAgeGroup } from '../../types';
import { AlertCircle, Copy, Check, ShieldAlert, Clock, Droplets, Info } from 'lucide-react';

interface PotassiumCalculatorProps {
  onUpdateSummary?: (text: string) => void;
}

export const PotassiumCalculator: React.FC<PotassiumCalculatorProps> = ({ onUpdateSummary }) => {
  const [tipoPaciente, setTipoPaciente] = useState<PatientAgeGroup>('adult');

  // Adult inputs
  const [kAtual, setKAtual] = useState<number>(2.8);
  const [kAlvo, setKAlvo] = useState<number>(4.0);
  const [acesso, setAcesso] = useState<VenousAccess>('peripheral');

  // Pediatric inputs
  const [pesoPediatrico, setPesoPediatrico] = useState<number>(18);
  const [isAdolescente, setIsAdolescente] = useState<boolean>(false);

  const [copied, setCopied] = useState(false);

  // Computations
  const resultadoAdulto = useMemo(() => {
    if (tipoPaciente !== 'adult') return null;
    return calcularPotassioAdulto(kAtual, kAlvo, acesso);
  }, [tipoPaciente, kAtual, kAlvo, acesso]);

  const resultadoPediatrico = useMemo(() => {
    if (tipoPaciente !== 'pediatric') return null;
    return calcularPotassioPediatrico(pesoPediatrico, isAdolescente);
  }, [tipoPaciente, pesoPediatrico, isAdolescente]);

  const prescriptionText = useMemo(() => {
    if (tipoPaciente === 'adult') {
      if (!resultadoAdulto) return 'Potássio alvo deve ser maior que o atual.';
      const viaNome = acesso === 'peripheral' ? 'Acesso Venoso Periférico (AVP)' : 'Acesso Venoso Central (CVC)';
      return [
        `REPOSIÇÃO DE POTÁSSIO (ADULTO - ${viaNome})`,
        `• K⁺ Sérico Atual: ${kAtual.toFixed(2)} mEq/L → Alvo: ${kAlvo.toFixed(2)} mEq/L (Déficit estimado: ${resultadoAdulto.aumentoDesejado.toFixed(2)} mEq/L)`,
        `• Dose Total: ${resultadoAdulto.doseMeq.toFixed(2)} mEq de KCl`,
        `• KCl 19,1% (10 mL = 25,6 mEq): ${resultadoAdulto.ampolas.toFixed(2)} ampolas (${(resultadoAdulto.ampolas * 10).toFixed(1)} mL)`,
        `• Diluição Mínima (SF 0,9%): ${resultadoAdulto.volMinDiluicaoSf.toFixed(1)} mL`,
        `• Tempo Mínimo de Infusão: ${resultadoAdulto.tempoMinHoras.toFixed(2)} horas (Taxa máxima: ${resultadoAdulto.taxaMax} mEq/h)`,
        `• Recomendação: Infundir em Bomba de Infusão Contínua (BIC). Monitorização cardíaca contínua se infusão > 10 mEq/h.`
      ].join('\n');
    } else {
      if (!resultadoPediatrico) return '';
      return [
        `REPOSIÇÃO DE POTÁSSIO (PEDIATRIA)`,
        `• Paciente: ${resultadoPediatrico.isAdolescente ? 'Adolescente' : 'Criança'}, Peso: ${pesoPediatrico} kg`,
        `• Dose Recomendada: ${resultadoPediatrico.doseRecomendadaMeq.toFixed(2)} mEq de KCl`,
        `• Volume de KCl 19,1%: ${resultadoPediatrico.volumeKclMl.toFixed(2)} mL (${resultadoPediatrico.ampolasKcl.toFixed(2)} ampolas)`,
        `• Velocidade de Infusão: ${resultadoPediatrico.taxaInfusaoMeqH.toFixed(2)} mEq/h`,
        `• Tempo Estimado de Infusão: ${resultadoPediatrico.tempoEstimadoHoras.toFixed(2)} horas`,
        `• Alerta: Concentração periférica máxima recomendada ≤ 40 mEq/L. Se CVC: até 80 mEq/L com monitorização em UTI.`
      ].join('\n');
    }
  }, [tipoPaciente, resultadoAdulto, resultadoPediatrico, kAtual, kAlvo, acesso, pesoPediatrico]);

  const handleCopy = () => {
    navigator.clipboard.writeText(prescriptionText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Title & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Reposição de Potássio (KCl 19,1%)</h2>
          <p className="text-sm text-slate-600 mt-0.5">
            Cálculo de mEq, ampolas a 19,1% (25,6 mEq / 10 mL), diluição em SF 0,9% e taxas de segurança por via de acesso.
          </p>
        </div>

        {/* Patient Age Group Toggle */}
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
        <div className="lg:col-span-5 space-y-5 bg-white p-5 rounded-xl border border-slate-200">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Parâmetros Clínicos</h3>

          {tipoPaciente === 'adult' ? (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-700">Potássio Sérico Atual (mEq/L)</label>
                  <span className="text-xs font-mono font-bold text-slate-900">{kAtual.toFixed(2)}</span>
                </div>
                <input
                  type="number"
                  step="0.1"
                  min="1.0"
                  max="5.5"
                  value={kAtual}
                  onChange={(e) => setKAtual(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                />
                <p className="text-[11px] text-slate-500 mt-1">Valor de referência normal: 3,5 a 5,0 mEq/L</p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-700">Potássio Alvo Desejado (mEq/L)</label>
                  <span className="text-xs font-mono font-bold text-slate-900">{kAlvo.toFixed(2)}</span>
                </div>
                <input
                  type="number"
                  step="0.1"
                  min="2.0"
                  max="5.5"
                  value={kAlvo}
                  onChange={(e) => setKAlvo(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                />
                <p className="text-[11px] text-slate-500 mt-1">Geralmente almeja-se 4,0 a 4,5 mEq/L</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Acesso Venoso</label>
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
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-700">Peso do Paciente (kg)</label>
                  <span className="text-xs font-mono font-bold text-slate-900">{pesoPediatrico} kg</span>
                </div>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  max="120"
                  value={pesoPediatrico}
                  onChange={(e) => setPesoPediatrico(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={isAdolescente}
                    onChange={(e) => setIsAdolescente(e.target.checked)}
                    className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800">Paciente é Adolescente?</span>
                    <span className="block text-[11px] text-slate-500">
                      Permite limite de velocidade até 40 mEq/h (ao invés de 20 mEq/h).
                    </span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Quick Warning */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
            <div>
              <strong>Segurança:</strong> KCl 19,1% NUNCA deve ser infundido em bolus direto. Risco fatal de PCR por assistolia ou FV. Sempre usar Bomba de Infusão.
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7 space-y-5">
          {tipoPaciente === 'adult' && resultadoAdulto && (
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Resultados da Prescrição (Adulto)
                </span>
                <span className="text-xs font-mono font-medium text-slate-600">
                  Déficit: +{resultadoAdulto.aumentoDesejado.toFixed(2)} mEq/L
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[11px] text-slate-500 block">Dose Total</span>
                  <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                    {resultadoAdulto.doseMeq.toFixed(1)}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-mono">mEq KCl</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[11px] text-slate-500 block">Ampolas (10mL)</span>
                  <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                    {resultadoAdulto.ampolas.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-mono">KCl 19,1%</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[11px] text-slate-500 block">Diluição Mínima</span>
                  <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                    {resultadoAdulto.volMinDiluicaoSf.toFixed(0)}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-mono">mL SF 0,9%</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[11px] text-slate-500 block">Tempo Mínimo</span>
                  <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                    {resultadoAdulto.tempoMinHoras.toFixed(1)}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-mono">horas</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-900 text-white rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Conduta Prática Formatada
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
            </div>
          )}

          {tipoPaciente === 'adult' && !resultadoAdulto && (
            <div className="p-6 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
              <div>
                <strong>Atenção:</strong> O potássio alvo deve ser maior que o potássio sérico atual ({kAtual} mEq/L).
              </div>
            </div>
          )}

          {tipoPaciente === 'pediatric' && resultadoPediatrico && (
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Resultados da Prescrição (Pediatria)
                </span>
                <span className="text-xs font-mono font-medium text-slate-600">
                  Base: {pesoPediatrico} kg
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[11px] text-slate-500 block">Dose Recomendada</span>
                  <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                    {resultadoPediatrico.doseRecomendadaMeq.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-mono">mEq (máx 40)</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[11px] text-slate-500 block">Taxa de Infusão</span>
                  <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                    {resultadoPediatrico.taxaInfusaoMeqH.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-mono">mEq/hora</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[11px] text-slate-500 block">Tempo Estimado</span>
                  <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                    {resultadoPediatrico.tempoEstimadoHoras.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-mono">horas</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-900 text-white rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Conduta Pediátrica Formatada
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
            </div>
          )}

          {/* Clinical pearls */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 space-y-2">
            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-slate-500" />
              <span>Notas de Segurança Clínica (Pérolas do Plantão)</span>
            </div>
            <ul className="list-disc pl-4 space-y-1">
              <li><strong>Hipomagnesemia associada:</strong> Se a reposição de potássio for refratária, cheque e reponha Magnésio (Sulfato de Magnésio 10% ou 50%). O magnésio é cofator essencial da bomba Na⁺/K⁺-ATPase.</li>
              <li><strong>Acesso Periférico (AVP):</strong> Concentração máxima segura de 40 mEq/L para evitar flebite química dolorosa. Taxa máxima de 10 mEq/h.</li>
              <li><strong>Acesso Central (CVC):</strong> Concentrações superiores a 40 mEq/L (até 80-100 mEq/L) exigem CVC com ponta na veia cava e monitorização contínua por eletrocardiograma.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
