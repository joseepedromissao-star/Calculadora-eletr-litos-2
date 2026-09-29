import React, { useState, useMemo } from 'react';
import { calcularOsmolaridadeEfetiva } from '../../utils/calculations';
import { Copy, Check, ShieldAlert, CheckCircle2, Info } from 'lucide-react';

export const OsmolarityCalculator: React.FC = () => {
  const [naMedido, setNaMedido] = useState<number>(142);
  const [glicemia, setGlicemia] = useState<number>(550);
  const [ureia, setUreia] = useState<number>(45); // optional
  const [copied, setCopied] = useState(false);

  const resultado = useMemo(() => {
    return calcularOsmolaridadeEfetiva(naMedido, glicemia);
  }, [naMedido, glicemia]);

  const osmTotal = useMemo(() => {
    return 2 * naMedido + glicemia / 18 + ureia / 6;
  }, [naMedido, glicemia, ureia]);

  const prescriptionText = useMemo(() => {
    return [
      `OSMOLARIDADE PLASMÁTICA EFETIVA (TONICIDADE)`,
      `• Sódio Sérico: ${naMedido} mEq/L`,
      `• Glicemia: ${glicemia} mg/dL`,
      `• Fórmula: (2 × Na⁺) + (Glicemia / 18)`,
      `• Osmolaridade Efetiva: ${resultado.osmolaridadeEfetiva.toFixed(2)} mOsm/L`,
      `• Osmolaridade Total Estimada (com Ureia ${ureia} mg/dL): ${osmTotal.toFixed(2)} mOsm/L`,
      `• Classificação Clínica: ${resultado.alerta}`
    ].join('\n');
  }, [naMedido, glicemia, ureia, resultado, osmTotal]);

  const handleCopy = () => {
    navigator.clipboard.writeText(prescriptionText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-900">Osmolaridade Plasmática Efetiva</h2>
        <p className="text-sm text-slate-600 mt-0.5">
          Tonicidade efetiva celular gerada pelos solutos impermeáveis (sódio e glicose). Parâmetro essencial no manejo do Estado Hiperglicêmico Hiperosmolar (EHH) e CAD.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Column */}
        <div className="lg:col-span-5 space-y-5 bg-white p-5 rounded-xl border border-slate-200">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Dados do Paciente</h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">Sódio Medido (mEq/L)</label>
                <span className="text-xs font-mono font-bold text-slate-900">{naMedido} mEq/L</span>
              </div>
              <input
                type="number"
                step="1"
                min="100"
                max="180"
                value={naMedido}
                onChange={(e) => setNaMedido(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">Glicemia (mg/dL)</label>
                <span className="text-xs font-mono font-bold text-amber-700">{glicemia} mg/dL</span>
              </div>
              <input
                type="number"
                step="10"
                min="50"
                max="2000"
                value={glicemia}
                onChange={(e) => setGlicemia(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">Ureia Sérica (mg/dL - Opcional)</label>
                <span className="text-xs font-mono font-bold text-slate-500">{ureia} mg/dL</span>
              </div>
              <input
                type="number"
                step="5"
                min="10"
                max="300"
                value={ureia}
                onChange={(e) => setUreia(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                A ureia difunde livremente pela membrana celular e não gera gradiente osmótico efetivo (não conta na tonicidade efetiva).
              </p>
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Resultado de Tonicidade
              </span>
              <span className="text-xs font-mono text-slate-600">
                Alvo de resolução: &lt; 315 mOsm/L
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div
                className={`p-4 rounded-lg border ${
                  resultado.osmolaridadeEfetiva > 320
                    ? 'bg-rose-50 border-rose-200'
                    : 'bg-emerald-50 border-emerald-200'
                }`}
              >
                <span className="text-xs font-semibold block text-slate-700">Osmolaridade Efetiva</span>
                <span
                  className={`text-3xl font-extrabold font-mono tabular-nums ${
                    resultado.osmolaridadeEfetiva > 320 ? 'text-rose-900' : 'text-emerald-950'
                  }`}
                >
                  {resultado.osmolaridadeEfetiva.toFixed(1)}
                </span>
                <span className="text-[11px] text-slate-500 block font-mono">mOsm/L (Tonicidade)</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-xs font-semibold block text-slate-600">Osmolaridade Total</span>
                <span className="text-3xl font-extrabold font-mono text-slate-900 tabular-nums">
                  {osmTotal.toFixed(1)}
                </span>
                <span className="text-[11px] text-slate-500 block font-mono">mOsm/L (com Ureia/6)</span>
              </div>
            </div>

            {/* Alert banner */}
            <div
              className={`p-3.5 rounded-lg border text-xs flex items-start gap-2.5 ${
                resultado.osmolaridadeEfetiva > 320
                  ? 'bg-rose-50 border-rose-200 text-rose-950'
                  : resultado.osmolaridadeEfetiva < 315
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : 'bg-amber-50 border-amber-200 text-amber-950'
              }`}
            >
              {resultado.osmolaridadeEfetiva > 320 ? (
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-700 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-700 mt-0.5" />
              )}
              <div>
                <strong>{resultado.alerta}</strong>
              </div>
            </div>

            {/* Prescriptive Text Box */}
            <div className="p-3.5 bg-slate-900 text-white rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Resumo Clínico Formatado
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
