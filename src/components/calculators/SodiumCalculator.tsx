import React, { useState, useMemo } from 'react';
import { calcularSodioAdulto, calcularSodioPediatrico } from '../../utils/calculations';
import { Gender, SolutionType, PatientAgeGroup } from '../../types';
import { AlertCircle, Copy, Check, ShieldAlert, Droplets, Info, Beaker } from 'lucide-react';

interface SodiumCalculatorProps {
  onUpdateSummary?: (text: string) => void;
}

export const SodiumCalculator: React.FC<SodiumCalculatorProps> = () => {
  const [tipoPaciente, setTipoPaciente] = useState<PatientAgeGroup>('adult');
  const [peso, setPeso] = useState<number>(70);

  // Adult inputs
  const [sexo, setSexo] = useState<Gender>('M');
  const [idoso, setIdoso] = useState<boolean>(false);
  const [naAtual, setNaAtual] = useState<number>(118);
  const [solucao, setSolucao] = useState<SolutionType>('nacl3');

  const [copied, setCopied] = useState(false);

  // Calculations
  const resultadoAdulto = useMemo(() => {
    if (tipoPaciente !== 'adult') return null;
    return calcularSodioAdulto(peso, sexo, idoso, naAtual, solucao);
  }, [tipoPaciente, peso, sexo, idoso, naAtual, solucao]);

  const resultadoPediatrico = useMemo(() => {
    if (tipoPaciente !== 'pediatric') return null;
    return calcularSodioPediatrico(peso);
  }, [tipoPaciente, peso]);

  const prescriptionText = useMemo(() => {
    if (tipoPaciente === 'adult' && resultadoAdulto) {
      const solNome = solucao === 'nacl3' ? 'NaCl 3% (Salina Hipertônica - 513 mEq/L)' : 'NaCl 0,9% (Soro Fisiológico - 154 mEq/L)';
      return [
        `CORREÇÃO DE HIPONATREMIA (FÓRMULA DE ADROGUÉ-MADIAS)`,
        `• Paciente: Adulto (${sexo === 'M' ? 'Masculino' : 'Feminino'}, ${idoso ? 'Idoso' : 'Não-idoso'}), Peso: ${peso} kg`,
        `• Água Corporal Total (ACT): ${resultadoAdulto.act.toFixed(1)} L`,
        `• Sódio Sérico Atual: ${naAtual.toFixed(1)} mEq/L`,
        `• Solução Selecionada: ${solNome}`,
        `• Elevação estimada com 1000 mL da solução: +${resultadoAdulto.variacaoCom1L.toFixed(2)} mEq/L de Na⁺`,
        `• Velocidade Sugerida (para elevar ~0,5 mEq/h): ${resultadoAdulto.velocidadeSugeridaMlH.toFixed(1)} mL/h`,
        `• Volume necessário para elevar 0,5 mEq: ${resultadoAdulto.volPara05.toFixed(1)} mL`,
        `• PREPARO DE NaCl 3% (se não houver bolsa pronta): 890 mL de SF 0,9% + 110 mL de NaCl 20% (ou 445 mL SF 0,9% + 55 mL NaCl 20% em bolsa de 500 mL).`,
        `• LIMITE ABSOLUTO DE SEGURANÇA: NÃO ultrapassar elevação de 8 a 10 mEq/L nas primeiras 24 horas (risco fatal de Síndrome de Desmielinização Osmótica). Checar Na⁺ sérico a cada 2 a 4 horas.`
      ].join('\n');
    } else if (tipoPaciente === 'pediatric' && resultadoPediatrico) {
      return [
        `REPOSIÇÃO DE SÓDIO (PEDIATRIA)`,
        `• Peso do Paciente: ${peso} kg`,
        `• Manutenção Diária Recomendada: ${resultadoPediatrico.manutencaoMin.toFixed(1)} a ${resultadoPediatrico.manutencaoMax.toFixed(1)} mEq/dia`,
        `• Limite Absoluto de Infusão de Sódio: ${resultadoPediatrico.limiteAbsolutoHora.toFixed(1)} mEq/hora`,
        `• Monitorar diurese e densidade urinária, além de gasometria com eletrólitos seriada.`
      ].join('\n');
    }
    return '';
  }, [tipoPaciente, resultadoAdulto, resultadoPediatrico, sexo, idoso, peso, naAtual, solucao]);

  const handleCopy = () => {
    navigator.clipboard.writeText(prescriptionText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Title & Patient Type */}
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
        {/* Input Column */}
        <div className="lg:col-span-5 space-y-5 bg-white p-5 rounded-xl border border-slate-200">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Parâmetros do Paciente</h3>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-700">Peso Corporal (kg)</label>
              <span className="text-xs font-mono font-bold text-slate-900">{peso} kg</span>
            </div>
            <input
              type="number"
              step="0.5"
              min="1"
              max="200"
              value={peso}
              onChange={(e) => setPeso(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
            />
          </div>

          {tipoPaciente === 'adult' && (
            <div className="space-y-4">
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

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-700">Sódio Sérico Atual (mEq/L)</label>
                  <span className="text-xs font-mono font-bold text-rose-700">{naAtual} mEq/L</span>
                </div>
                <input
                  type="number"
                  step="1"
                  min="90"
                  max="145"
                  value={naAtual}
                  onChange={(e) => setNaAtual(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                />
                <p className="text-[11px] text-slate-500 mt-1">Normal: 135 a 145 mEq/L. Grave quando &lt; 120-125 mEq/L com sintomas neurológicos.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Solução para Reposição</label>
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

          {/* Critical Warning */}
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-900 text-xs flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-rose-700" />
            <div>
              <strong>Limite de Segurança:</strong> Não exceder elevação de <strong>8 a 10 mEq/L em 24 horas</strong> (ou 18 mEq/L em 48h). A correção excessivamente rápida causa <em>Síndrome de Desmielinização Osmótica (Mielinólise Pontina)</em> irreversível.
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7 space-y-5">
          {tipoPaciente === 'adult' && resultadoAdulto && (
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Resultados (Fórmula de Adrogué-Madias)
                </span>
                <span className="text-xs font-mono font-medium text-slate-600">
                  ACT: {resultadoAdulto.act.toFixed(1)} L
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[11px] text-slate-500 block">Variação com 1L</span>
                  <span className="text-xl font-bold font-mono text-emerald-700 tabular-nums">
                    +{resultadoAdulto.variacaoCom1L.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-mono">mEq/L por litro</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[11px] text-slate-500 block">Vol. para +0,5 mEq</span>
                  <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                    {resultadoAdulto.volPara05.toFixed(0)}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-mono">mL de solução</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[11px] text-slate-500 block">Velocidade Sugerida</span>
                  <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                    {resultadoAdulto.velocidadeSugeridaMlH.toFixed(1)}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-mono">mL/h em BIC</span>
                </div>
              </div>

              {/* Recipe for 3% saline */}
              {solucao === 'nacl3' && (
                <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-lg text-xs text-blue-950 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-blue-900">
                    <Beaker className="w-3.5 h-3.5 text-blue-700" />
                    <span>Como preparar Salina a 3% (NaCl 3%) no plantão:</span>
                  </div>
                  <p>
                    • Em frasco de 1000 mL: <strong>890 mL de SF 0,9% + 110 mL de NaCl 20%</strong> (11 ampolas de 10 mL de NaCl 20%).
                  </p>
                  <p>
                    • Em frasco de 500 mL: <strong>445 mL de SF 0,9% + 55 mL de NaCl 20%</strong> (5,5 ampolas de 10 mL de NaCl 20%).
                  </p>
                </div>
              )}

              <div className="p-3.5 bg-slate-900 text-white rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Prescrição e Conduta Formatada
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

          {tipoPaciente === 'pediatric' && resultadoPediatrico && (
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Resultados da Reposição (Pediatria)
                </span>
                <span className="text-xs font-mono font-medium text-slate-600">
                  Peso: {peso} kg
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[11px] text-slate-500 block">Manutenção Diária</span>
                  <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                    {resultadoPediatrico.manutencaoMin.toFixed(0)} - {resultadoPediatrico.manutencaoMax.toFixed(0)}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-mono">mEq/dia</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[11px] text-slate-500 block">Limite Absoluto</span>
                  <span className="text-xl font-bold font-mono text-rose-700 tabular-nums">
                    {resultadoPediatrico.limiteAbsolutoHora.toFixed(1)}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-mono">mEq/hora</span>
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

          {/* Clinical notes */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 space-y-2">
            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-slate-500" />
              <span>Conduta em Crise Convulsiva / Coma por Hiponatremia Grave:</span>
            </div>
            <p>
              Nas emergências neurológicas agudas graves (convulsões, rebaixamento grave da consciência), a diretriz europeia e americana recomenda <strong>bolus de 100 a 150 mL de NaCl 3% em 10 a 20 minutos</strong> (em pediatria 2 mL/kg), podendo ser repetido até 2 vezes se os sintomas persistirem, objetivando elevar o Na⁺ sérico rapidamente em 4 a 6 mEq/L para aliviar o edema cerebral agudo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
