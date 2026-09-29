import React, { useState, useMemo } from 'react';
import { interpretarGasometria } from '../../utils/calculations';
import { Copy, Check, ShieldAlert, Activity, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

interface GasometryCalculatorProps {
  onUpdateSummary?: (text: string) => void;
}

export const GasometryCalculator: React.FC<GasometryCalculatorProps> = () => {
  const [ph, setPh] = useState<number>(7.28);
  const [pco2, setPco2] = useState<number>(24);
  const [hco3, setHco3] = useState<number>(11);

  const [copied, setCopied] = useState(false);

  const resultado = useMemo(() => {
    return interpretarGasometria(ph, pco2, hco3);
  }, [ph, pco2, hco3]);

  const prescriptionText = useMemo(() => {
    const lines = [
      `LAUDO DE GASOMETRIA ARTERIAL`,
      `• Parâmetros: pH ${ph.toFixed(2)} | pCO₂ ${pco2.toFixed(1)} mmHg | HCO₃⁻ ${hco3.toFixed(1)} mEq/L`,
      `• Estado Primário: ${resultado.estadoPh}`,
      `• Diagnóstico: ${resultado.diagnostico}`
    ];
    if (resultado.compensacao) {
      lines.push(`• Compensação: ${resultado.compensacao}`);
    }
    if (resultado.pco2Esperado) {
      lines.push(
        `• Resposta Esperada (${resultado.pco2Esperado.formula}): ${resultado.pco2Esperado.min.toFixed(1)} a ${resultado.pco2Esperado.max.toFixed(1)} mmHg`
      );
    }
    if (resultado.alertasClinicos.length > 0) {
      lines.push(`• Alertas Clínicos:`);
      resultado.alertasClinicos.forEach((a) => lines.push(`  - ${a}`));
    }
    return lines.join('\n');
  }, [ph, pco2, hco3, resultado]);

  const handleCopy = () => {
    navigator.clipboard.writeText(prescriptionText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const applyPreset = (newPh: number, newPco2: number, newHco3: number) => {
    setPh(newPh);
    setPco2(newPco2);
    setHco3(newHco3);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-900">Interpretação de Gasometria Arterial</h2>
        <p className="text-sm text-slate-600 mt-0.5">
          Identificação sistemática do distúrbio primário (Acidemia vs Alcalemia), cálculo da resposta compensatória esperada (Fórmula de Winter) e triagem de distúrbios mistos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Column */}
        <div className="lg:col-span-5 space-y-5 bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Valores Medidos</h3>
            <span className="text-xs text-slate-500">Sangue Arterial</span>
          </div>

          {/* Quick Presets */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Casos Clínicos de Plantão</label>
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

          <div className="space-y-4 pt-1">
            {/* pH */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">pH Arterial</label>
                <span
                  className={`text-xs font-mono font-bold ${
                    ph < 7.35 ? 'text-amber-700' : ph > 7.45 ? 'text-blue-700' : 'text-emerald-700'
                  }`}
                >
                  {ph.toFixed(2)}
                </span>
              </div>
              <input
                type="number"
                step="0.01"
                min="6.80"
                max="7.80"
                value={ph}
                onChange={(e) => setPh(parseFloat(e.target.value) || 7.40)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>&lt; 7.35: Acidemia</span>
                <span>Normal: 7.35 - 7.45</span>
                <span>&gt; 7.45: Alcalemia</span>
              </div>
            </div>

            {/* pCO2 */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">pCO₂ (mmHg)</label>
                <span className="text-xs font-mono font-bold text-slate-900">{pco2.toFixed(1)} mmHg</span>
              </div>
              <input
                type="number"
                step="1"
                min="10"
                max="120"
                value={pco2}
                onChange={(e) => setPco2(parseFloat(e.target.value) || 40)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>Normal: 35 a 45 mmHg</span>
                <span>Componente Respiratório</span>
              </div>
            </div>

            {/* HCO3 */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">HCO₃⁻ Sérico (mEq/L)</label>
                <span className="text-xs font-mono font-bold text-slate-900">{hco3.toFixed(1)} mEq/L</span>
              </div>
              <input
                type="number"
                step="0.5"
                min="2"
                max="60"
                value={hco3}
                onChange={(e) => setHco3(parseFloat(e.target.value) || 24)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>Normal: 22 a 26 mEq/L</span>
                <span>Componente Metabólico</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
            {/* Visual Status Indicator */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Laudo Diagnóstico Automatizado
              </span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded ${
                  resultado.estadoPh === 'Acidemia'
                    ? 'bg-amber-100 text-amber-900'
                    : resultado.estadoPh === 'Alcalemia'
                    ? 'bg-blue-100 text-blue-900'
                    : 'bg-emerald-100 text-emerald-900'
                }`}
              >
                {resultado.estadoPh} (pH {ph.toFixed(2)})
              </span>
            </div>

            {/* Diagnosis Main Banner */}
            <div
              className={`p-4 rounded-xl border ${
                resultado.gravidade === 'grave'
                  ? 'bg-rose-50 border-rose-200 text-rose-950'
                  : resultado.gravidade === 'moderada'
                  ? 'bg-amber-50 border-amber-200 text-amber-950'
                  : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            >
              <div className="text-xs font-semibold uppercase tracking-wider opacity-75">Diagnóstico Principal</div>
              <div className="text-lg font-bold mt-0.5">{resultado.diagnostico}</div>

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

            {/* Clinical Alerts */}
            {resultado.alertasClinicos.length > 0 && (
              <div className="space-y-2">
                {resultado.alertasClinicos.map((alerta, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2"
                  >
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
                    <span>{alerta}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Prescriptive / Report text */}
            <div className="p-3.5 bg-slate-900 text-white rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Texto Formatado para Prontuário
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
        </div>
      </div>
    </div>
  );
};
