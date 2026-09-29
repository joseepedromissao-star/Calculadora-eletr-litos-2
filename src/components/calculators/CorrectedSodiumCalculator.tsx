import React, { useState, useMemo } from 'react';
import { calcularSodioCorrigido } from '../../utils/calculations';
import { Copy, Check, Droplets, Info } from 'lucide-react';

export const CorrectedSodiumCalculator: React.FC = () => {
  const [naMedido, setNaMedido] = useState<number>(128);
  const [glicemia, setGlicemia] = useState<number>(450);
  const [copied, setCopied] = useState(false);

  const resultado = useMemo(() => {
    return calcularSodioCorrigido(naMedido, glicemia);
  }, [naMedido, glicemia]);

  const prescriptionText = useMemo(() => {
    return [
      `CÁLCULO DE SÓDIO CORRIGIDO NA HIPERGLICEMIA`,
      `• Sódio Sérico Medido: ${naMedido} mEq/L`,
      `• Glicemia Atual: ${glicemia} mg/dL`,
      `• Fator de Correção Aplicado: ${resultado.fator} mEq/L para cada 100 mg/dL acima de 100 mg/dL (${glicemia > 400 ? 'Katz corrigido / Hillier para glicemia > 400' : 'Fórmula clássica de Katz'})`,
      `• SÓDIO REAL ESTIMADO (CORRIGIDO): ${resultado.naCorrigido.toFixed(2)} mEq/L`,
      `• Orientação de Hidratação: ${resultado.condutaSolucao}`,
      `• Solução Salina Preferencial: ${resultado.tipoSolucao}`
    ].join('\n');
  }, [naMedido, glicemia, resultado]);

  const handleCopy = () => {
    navigator.clipboard.writeText(prescriptionText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-900">Sódio Corrigido (na Hiperglicemia)</h2>
        <p className="text-sm text-slate-600 mt-0.5">
          Correção de pseudo-hiponatremia hiperosmolar provocada pelo deslocamento osmótico de água intracelular para o espaço extracelular.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Column */}
        <div className="lg:col-span-5 space-y-5 bg-white p-5 rounded-xl border border-slate-200">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Parâmetros Laboratoriais</h3>

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
                max="170"
                value={naMedido}
                onChange={(e) => setNaMedido(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">Glicemia Sérica (mg/dL)</label>
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
              <p className="text-[11px] text-slate-500 mt-1">
                Glicemia &gt; 400 mg/dL ativa automaticamente o fator de Hillier (2,4 mEq/L por 100 mg/dL).
              </p>
            </div>
          </div>

          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-xs text-blue-900 space-y-1">
            <div className="font-semibold flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-700" />
              <span>Regra Prática de Prescrição</span>
            </div>
            <p>
              O valor corrigido orienta a escolha dos fluidos de expansão e manutenção: se o sódio corrigido for baixo (&lt; 135), manter <strong>NaCl 0,9%</strong>; se normal ou elevado (&ge; 135), transicionar para <strong>NaCl 0,45%</strong>.
            </p>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Resultado da Correção
              </span>
              <span className="text-xs font-mono text-slate-500">
                Fator: +{resultado.fator} por 100 mg/dL
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-xs text-slate-500 block">Sódio Medido</span>
                <span className="text-2xl font-bold font-mono text-slate-600 tabular-nums">
                  {naMedido.toFixed(1)}
                </span>
                <span className="text-[11px] text-slate-400 block font-mono">mEq/L (aparente)</span>
              </div>

              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <span className="text-xs text-emerald-800 font-semibold block">Sódio Real Estimado</span>
                <span className="text-3xl font-extrabold font-mono text-emerald-950 tabular-nums">
                  {resultado.naCorrigido.toFixed(1)}
                </span>
                <span className="text-[11px] text-emerald-700 block font-mono">mEq/L (corrigido)</span>
              </div>
            </div>

            {/* Recommendation badge */}
            <div className="p-3.5 bg-slate-100 rounded-lg border border-slate-200 text-xs text-slate-800 flex items-start gap-2.5">
              <Droplets className="w-4 h-4 shrink-0 text-slate-700 mt-0.5" />
              <div>
                <strong>Conduta Hídrica:</strong> {resultado.condutaSolucao}
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
