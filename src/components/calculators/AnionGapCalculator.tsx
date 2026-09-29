import React, { useState, useMemo } from 'react';
import { calcularAnionGap } from '../../utils/calculations';
import { Copy, Check, ShieldAlert, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export const AnionGapCalculator: React.FC = () => {
  const [na, setNa] = useState<number>(135);
  const [cl, setCl] = useState<number>(100);
  const [hco3, setHco3] = useState<number>(12);
  const [albumina, setAlbumina] = useState<number>(4.0); // optional correction
  const [copied, setCopied] = useState(false);

  const resultado = useMemo(() => {
    return calcularAnionGap(na, cl, hco3);
  }, [na, cl, hco3]);

  const agCorrigido = useMemo(() => {
    // AG corrigido = AG + 2.5 * (4.0 - Albumina)
    return resultado.anionGap + 2.5 * (4.0 - albumina);
  }, [resultado.anionGap, albumina]);

  const prescriptionText = useMemo(() => {
    const lines = [
      `CÁLCULO DE ÂNION GAP (HIATO ANIÔNICO)`,
      `• Parâmetros: Na⁺ ${na} mEq/L | Cl⁻ ${cl} mEq/L | HCO₃⁻ ${hco3} mEq/L`,
      `• Fórmula: Na⁺ - (Cl⁻ + HCO₃⁻)`,
      `• Ânion Gap Calculado: ${resultado.anionGap.toFixed(1)} mEq/L (Referência: 4 a 12 mEq/L)`
    ];

    if (albumina !== 4.0) {
      lines.push(
        `• Ânion Gap Corrigido para Albumina (${albumina.toFixed(1)} g/dL): ${agCorrigido.toFixed(1)} mEq/L`
      );
    }

    lines.push(`• Classificação: ${resultado.alerta}`);
    lines.push(`• Principais Hipóteses Diagnósticas:`);
    resultado.principaisCausas.forEach((c) => lines.push(`  - ${c}`));

    return lines.join('\n');
  }, [na, cl, hco3, albumina, resultado, agCorrigido]);

  const handleCopy = () => {
    navigator.clipboard.writeText(prescriptionText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-900">Ânion Gap (Hiato Aniônico)</h2>
        <p className="text-sm text-slate-600 mt-0.5">
          Diferença entre os principais cátions e ânions mensuráveis. Essencial na diferenciação diagnóstica das acidoses metabólicas normoclorêmicas vs hiperclorêmicas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Inputs */}
        <div className="lg:col-span-5 space-y-5 bg-white p-5 rounded-xl border border-slate-200">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Eletrólitos Séricos</h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">Sódio (Na⁺)</label>
                <span className="text-xs font-mono font-bold text-slate-900">{na} mEq/L</span>
              </div>
              <input
                type="number"
                step="1"
                min="100"
                max="180"
                value={na}
                onChange={(e) => setNa(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">Cloro (Cl⁻)</label>
                <span className="text-xs font-mono font-bold text-slate-900">{cl} mEq/L</span>
              </div>
              <input
                type="number"
                step="1"
                min="60"
                max="140"
                value={cl}
                onChange={(e) => setCl(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
              />
              <p className="text-[11px] text-slate-500 mt-1">Normal: 98 a 106 mEq/L</p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">Bicarbonato (HCO₃⁻)</label>
                <span className="text-xs font-mono font-bold text-slate-900">{hco3} mEq/L</span>
              </div>
              <input
                type="number"
                step="0.5"
                min="1"
                max="50"
                value={hco3}
                onChange={(e) => setHco3(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">Albumina Sérica (g/dL - Opcional)</label>
                <span className="text-xs font-mono font-bold text-slate-500">{albumina.toFixed(1)} g/dL</span>
              </div>
              <input
                type="number"
                step="0.1"
                min="0.5"
                max="6.0"
                value={albumina}
                onChange={(e) => setAlbumina(parseFloat(e.target.value) || 4.0)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                A albumina é o principal ânion não medido. Se hipoalbuminemia, o AG real é maior do que o calculado.
              </p>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Resultado do Hiato Aniônico
              </span>
              <span className="text-xs font-mono text-slate-500">
                Referência: 4 a 12 mEq/L
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div
                className={`p-4 rounded-lg border ${
                  resultado.anionGap > 12
                    ? 'bg-rose-50 border-rose-200'
                    : 'bg-emerald-50 border-emerald-200'
                }`}
              >
                <span className="text-xs font-semibold block text-slate-700">Ânion Gap Não Corrigido</span>
                <span
                  className={`text-3xl font-extrabold font-mono tabular-nums ${
                    resultado.anionGap > 12 ? 'text-rose-950' : 'text-emerald-950'
                  }`}
                >
                  {resultado.anionGap.toFixed(1)}
                </span>
                <span className="text-[11px] text-slate-500 block font-mono">mEq/L</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-xs font-semibold block text-slate-600">Ânion Gap Corrigido (Albumina)</span>
                <span className="text-3xl font-extrabold font-mono text-slate-900 tabular-nums">
                  {agCorrigido.toFixed(1)}
                </span>
                <span className="text-[11px] text-slate-500 block font-mono">mEq/L (+2,5 por g/dL abaixo de 4)</span>
              </div>
            </div>

            {/* Alert Banner */}
            <div
              className={`p-3.5 rounded-lg border text-xs flex items-start gap-2.5 ${
                resultado.anionGap > 12
                  ? 'bg-rose-50 border-rose-200 text-rose-950'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-950'
              }`}
            >
              {resultado.anionGap > 12 ? (
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-700 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-700 mt-0.5" />
              )}
              <div>
                <strong>{resultado.alerta}</strong>
              </div>
            </div>

            {/* Differential Diagnosis list */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5">
              <span className="font-bold text-slate-800 block">Diagnósticos Diferenciais Compatíveis:</span>
              <ul className="list-disc pl-4 space-y-1 text-slate-700">
                {resultado.principaisCausas.map((causa, i) => (
                  <li key={i}>{causa}</li>
                ))}
              </ul>
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
