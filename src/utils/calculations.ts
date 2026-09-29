import {
  VenousAccess,
  PotassiumAdultResult,
  PotassiumPediatricResult,
  Gender,
  SolutionType,
  SodiumAdultResult,
  SodiumPediatricResult,
  BicarbonateIndication,
  BicarbonatePatient,
  BicarbonateResult,
  GasometryResult,
  CorrectedSodiumResult,
  OsmolarityResult,
  AnionGapResult,
  PediatricProfile
} from '../types';

// ==========================================
// 1. POTÁSSIO (KCl 19,1%)
// ==========================================
export function calcularPotassioAdulto(
  potassioAtual: number,
  potassioAlvo: number,
  acesso: VenousAccess
): PotassiumAdultResult | null {
  const aumentoDesejado = potassioAlvo - potassioAtual;
  if (aumentoDesejado <= 0) return null;

  const doseMeq = (aumentoDesejado / 0.25) * 20;
  const ampolas = doseMeq / 25.6; // 10mL a 19.1% = 25.6 mEq

  const divisor = acesso === 'peripheral' ? 10 : 40;
  const volMinDiluicaoSf = (doseMeq / divisor) * 100;
  const tempoMinHoras = doseMeq / divisor;
  const taxaMax = divisor;

  return {
    aumentoDesejado,
    doseMeq,
    ampolas,
    volMinDiluicaoSf,
    tempoMinHoras,
    taxaMax,
    via: acesso
  };
}

export function calcularPotassioPediatrico(
  peso: number,
  isAdolescente: boolean
): PotassiumPediatricResult {
  const doseRecomendadaMeq = Math.min(0.75 * peso, 40);
  const limiteTaxa = isAdolescente ? 40 : 20;
  const taxaInfusaoMeqH = Math.min(0.5 * peso, limiteTaxa);
  const tempoEstimadoHoras = doseRecomendadaMeq / taxaInfusaoMeqH;
  const volumeKclMl = doseRecomendadaMeq / 2.56;
  const ampolasKcl = doseRecomendadaMeq / 25.6;

  return {
    peso,
    isAdolescente,
    doseRecomendadaMeq,
    taxaInfusaoMeqH,
    tempoEstimadoHoras,
    ampolasKcl,
    volumeKclMl
  };
}

// ==========================================
// 2. SÓDIO (NaCl 3% / 0,9%)
// ==========================================
export function calcularSodioAdulto(
  peso: number,
  sexo: Gender,
  idoso: boolean,
  naAtual: number,
  solucao: SolutionType
): SodiumAdultResult {
  let act: number;
  if (sexo === 'M') {
    act = idoso ? peso * 0.5 : peso * 0.6;
  } else {
    act = idoso ? peso * 0.45 : peso * 0.5;
  }

  const naSol = solucao === 'nacl3' ? 513 : 154;
  const variacaoCom1L = (naSol - naAtual) / (act + 1);
  const volPara05 = (0.5 / variacaoCom1L) * 1000;
  const velocidadeSugeridaMlH = solucao === 'nacl3' ? Math.min(volPara05, 100) : volPara05;

  return {
    act,
    variacaoCom1L,
    volPara05,
    velocidadeSugeridaMlH,
    preparoNacl3: {
      sf09Ml: 890,
      nacl20Ml: 110,
      totalMl: 1000
    }
  };
}

export function calcularSodioPediatrico(peso: number): SodiumPediatricResult {
  const manutencaoMin = Math.min(3 * peso, 100);
  const manutencaoMax = Math.min(4 * peso, 150);
  const limiteAbsolutoHora = peso;

  return {
    manutencaoMin,
    manutencaoMax,
    limiteAbsolutoHora
  };
}

// ==========================================
// 3. BICARBONATO DE SÓDIO (8,4%)
// ==========================================
export function calcularBicarbonato(
  indicacao: BicarbonateIndication,
  paciente: BicarbonatePatient = 'adult',
  peso: number = 70
): BicarbonateResult {
  if (indicacao === 'cardiac_arrest') {
    return {
      indicacao,
      detalheDose: '1 mEq/kg EV direto (solução pura a 8,4%). Usualmente 1 ampola (10mL ou 50mL conforme apresentação).',
      orientacoes: [
        'PCR: Administrar em via EV exclusiva, direto, sem diluição.',
        'Não infundir na mesma via com Cálcio, Epinefrina ou Dopamina (risco de precipitação química).',
        'Indicação preferencial em PCR por hipercalemia prévia, acidose metabólica grave preexistente ou intoxicação por antidepressivos tricíclicos.'
      ]
    };
  }

  if (indicacao === 'hyperkalemia') {
    return {
      indicacao,
      paciente: 'adult',
      detalheDose: '50 mEq (50 mL de NaHCO₃ 8,4%) EV em 5 minutos.',
      orientacoes: [
        'Promove influxo intracelular transitório de potássio via trocador Na⁺/H⁺.',
        'Tempo de início: 15-30 minutos; duração: 1-2 horas.',
        'Sempre associar medidas de estabilização de membrana (Gluconato de Cálcio a 10%) e glicoinsulina se houver alteração no ECG.'
      ]
    };
  }

  // Acidose metabólica
  const doseMinMeq = 2 * peso;
  const doseMaxMeq = 5 * peso;
  const ampolasMin = doseMinMeq / 10;
  const ampolasMax = doseMaxMeq / 10;
  const taxaMaxMeqH = peso;

  const orientacoes: string[] = [
    `Dose total estimada: ${doseMinMeq.toFixed(1)} a ${doseMaxMeq.toFixed(1)} mEq (${ampolasMin.toFixed(1)} a ${ampolasMax.toFixed(1)} ampolas de 10mL).`,
    `Taxa máxima de infusão recomendada: ${taxaMaxMeqH.toFixed(1)} mEq/h. Infundir a dose planejada em 4 a 8 horas.`,
    'Objetivo terapêutico: elevar o pH para ~7,20 e HCO₃⁻ para 10-12 mEq/L (não buscar normalização súbita completa para evitar alcalose de rebote e hipocalcemia).'
  ];

  if (paciente === 'adult') {
    orientacoes.push('AVP (Acesso Venoso Periférico): Máximo 10 mL de Bicarbonato 8,4% para cada 50 mL de diluente (SG 5% ou Água Destilada) para reduzir osmolaridade e flebite.');
  } else if (paciente === 'pediatric') {
    orientacoes.push('PEDIATRIA: OBRIGATÓRIO Cateter Venoso Central (CVC) devido à hiperosmolaridade da solução (cerca de 2000 mOsm/L).');
  } else if (paciente === 'neonatal') {
    orientacoes.push('NEONATO: Infusão EV muito lenta (máx 10 mEq/min). Concentração máxima 0,5 mEq/mL (diluir 1:1 estritamente com Água Destilada). Risco severo de hemorragia intraventricular se rápida infusão hiperosmolar.');
  }

  return {
    indicacao,
    paciente,
    doseMinMeq,
    doseMaxMeq,
    ampolasMin,
    ampolasMax,
    taxaMaxMeqH,
    tempoInfusaoHoras: '4 a 8 horas',
    detalheDose: `${doseMinMeq.toFixed(1)} a ${doseMaxMeq.toFixed(1)} mEq EV`,
    orientacoes
  };
}

// ==========================================
// 4. INTERPRETAÇÃO DE GASOMETRIA ARTERIAL
// ==========================================
export function interpretarGasometria(
  ph: number,
  pco2: number,
  hco3: number
): GasometryResult {
  let estadoPh: 'Acidemia' | 'Alcalemia' | 'pH Normal' = 'pH Normal';
  let diagnostico = '';
  let compensacao = '';
  let pco2Esperado: { min: number; max: number; formula: string } | undefined;
  const alertasClinicos: string[] = [];

  if (ph < 7.35) {
    estadoPh = 'Acidemia';
    if (hco3 < 22 && pco2 > 45) {
      diagnostico = 'Acidose Mista (Metabólica e Respiratória)';
      compensacao = 'Sem compensação possível: ambos os componentes atuam na mesma direção, agravando a acidemia.';
      alertasClinicos.push('Quadro de altíssima gravidade: falência respiratória com acidose metabólica simultânea. Considerar IOT e suporte ventilatório imediato.');
    } else if (hco3 < 22) {
      diagnostico = 'Acidose Metabólica';
      // Fórmula de Winter: pCO2 esperado = (1.5 * HCO3) + 8 ± 2
      const esp = 1.5 * hco3 + 8;
      const min = esp - 2;
      const max = esp + 2;
      pco2Esperado = {
        min,
        max,
        formula: 'Fórmula de Winter: pCO₂ = (1,5 × HCO₃⁻) + 8 ± 2'
      };

      if (pco2 >= min && pco2 <= max) {
        compensacao = 'Compensada (Resposta respiratória hiperventilatória adequada).';
      } else if (pco2 > max) {
        compensacao = 'Descompensada: Acidose Respiratória associada (hipoventilação relativa / fadiga diafragmática).';
        alertasClinicos.push('pCO₂ acima do esperado: sugere fadiga muscular respiratória iminente no paciente com acidose metabólica.');
      } else {
        compensacao = 'Descompensada: Alcalose Respiratória associada (hiperventilação excessiva / estímulo central concomitante).';
      }
    } else if (pco2 > 45) {
      diagnostico = 'Acidose Respiratória';
      if (hco3 > 26) {
        compensacao = 'Parcialmente Compensada (retenção renal crônica de bicarbonato). Sugere distúrbio crônico ou crônico agudizado (ex: DPOC).';
      } else {
        compensacao = 'Descompensada / Aguda (rins ainda não tiveram tempo de reter bicarbonato - processo leva 24-48h).';
        alertasClinicos.push('Acidose respiratória aguda: investigar causas de depressão respiratória (opioides, sedativos, obstrução de via aérea, broncoespasmo grave).');
      }
    } else {
      diagnostico = 'Distúrbio indefinido / limítrofe.';
    }
  } else if (ph > 7.45) {
    estadoPh = 'Alcalemia';
    if (hco3 > 26 && pco2 < 35) {
      diagnostico = 'Alcalose Mista (Metabólica e Respiratória)';
      compensacao = 'Ambos os componentes atuam somando alcalose sérica.';
    } else if (hco3 > 26) {
      diagnostico = 'Alcalose Metabólica';
      // pCO2 esperado = (0.7 * HCO3) + 21 ± 2
      const esp = 0.7 * hco3 + 21;
      const min = esp - 2;
      const max = esp + 2;
      pco2Esperado = {
        min,
        max,
        formula: 'Compensação: pCO₂ = (0,7 × HCO₃⁻) + 21 ± 2'
      };

      if (pco2 >= min && pco2 <= max) {
        compensacao = 'Compensada (Hipoventilação alveolar compensatória fisiológica).';
      } else if (pco2 > max) {
        compensacao = 'Descompensada: Acidose Respiratória associada.';
      } else {
        compensacao = 'Descompensada: Alcalose Respiratória associada.';
      }
    } else if (pco2 < 35) {
      diagnostico = 'Alcalose Respiratória';
      if (hco3 < 22) {
        compensacao = 'Parcialmente Compensada (excreção renal crônica de bicarbonato).';
      } else {
        compensacao = 'Descompensada / Aguda (hiperventilação psicogênica, dor, TEP, sepse inicial, ventilação mecânica agressiva).';
      }
    } else {
      diagnostico = 'Distúrbio indefinido / limítrofe.';
    }
  } else {
    estadoPh = 'pH Normal';
    if (pco2 > 45 && hco3 > 26) {
      diagnostico = ph < 7.40
        ? 'Acidose Respiratória totalmente compensada'
        : 'Alcalose Metabólica totalmente compensada';
      compensacao = 'Equilíbrio compensatório completo pelo órgão pareado.';
    } else if (pco2 < 35 && hco3 < 22) {
      diagnostico = ph < 7.40
        ? 'Acidose Metabólica totalmente compensada'
        : 'Alcalose Respiratória totalmente compensada';
      compensacao = 'Equilíbrio compensatório completo.';
    } else if (pco2 >= 35 && pco2 <= 45 && hco3 >= 22 && hco3 <= 26) {
      diagnostico = 'Gasometria Arterial Normal';
      compensacao = 'Parâmetros dentro dos limites normais de referência fisiológica.';
    } else {
      diagnostico = 'Distúrbio misto equilibrado';
      compensacao = 'Alterações simultâneas de pCO₂ e HCO₃⁻ neutralizando o desvio final do pH.';
    }
  }

  let gravidade: 'normal' | 'leve' | 'moderada' | 'grave' = 'normal';
  if (ph < 7.15 || ph > 7.58 || pco2 > 65 || hco3 < 10) {
    gravidade = 'grave';
  } else if (ph < 7.28 || ph > 7.50 || pco2 > 52 || hco3 < 16) {
    gravidade = 'moderada';
  } else if (ph < 7.35 || ph > 7.45) {
    gravidade = 'leve';
  }

  return {
    ph,
    pco2,
    hco3,
    estadoPh,
    diagnostico,
    compensacao,
    pco2Esperado,
    gravidade,
    alertasClinicos
  };
}

// ==========================================
// 5. SÓDIO CORRIGIDO (NA HIPERGLICEMIA)
// ==========================================
export function calcularSodioCorrigido(
  naMedido: number,
  glicemia: number
): CorrectedSodiumResult {
  const fator = glicemia > 400 ? 2.4 : 1.6;
  const deltaGlicose = Math.max(0, glicemia - 100) / 100;
  const naCorrigido = naMedido + fator * deltaGlicose;

  let condutaSolucao = '';
  let tipoSolucao: 'NaCl 0,9%' | 'NaCl 0,45%' = 'NaCl 0,9%';

  if (naCorrigido < 135) {
    tipoSolucao = 'NaCl 0,9%';
    condutaSolucao = 'Sódio corrigido baixo (< 135 mEq/L): Utilizar solução isotônica salina (NaCl 0,9%) na hidratação.';
  } else {
    tipoSolucao = 'NaCl 0,45%';
    condutaSolucao = 'Sódio corrigido normal ou alto (≥ 135 mEq/L): Utilizar solução salina hipotônica (NaCl 0,45%) para evitar sobrecarga de sódio hiperosmolar.';
  }

  return {
    naMedido,
    glicemia,
    fator,
    naCorrigido,
    condutaSolucao,
    tipoSolucao
  };
}

// ==========================================
// 6. OSMOLARIDADE PLASMÁTICA EFETIVA
// ==========================================
export function calcularOsmolaridadeEfetiva(
  naMedido: number,
  glicemia: number
): OsmolarityResult {
  // Fórmula: 2 * Na + (Glicose / 18)
  const osmolaridadeEfetiva = 2 * naMedido + glicemia / 18;

  let status: 'baixo' | 'normal' | 'elevado_grave' = 'normal';
  let alerta = '';

  if (osmolaridadeEfetiva > 320) {
    status = 'elevado_grave';
    alerta = 'ALERTA CRÍTICO: Valores > 320 mOsm/L no Estado Hiperglicêmico Hiperosmolar (EHH) associam-se a alto risco de deterioração neurológica, coma e trombose vascular.';
  } else if (osmolaridadeEfetiva < 315) {
    status = 'normal';
    alerta = 'STATUS FAVORÁVEL: Valores < 315 mOsm/L indicam resolução satisfatória do quadro hiperosmolar no EHH/CAD.';
  } else {
    status = 'baixo';
    alerta = 'STATUS INTERMEDIÁRIO: Osmolaridade em faixa intermediária (315-320 mOsm/L). Manter hidratação monitorada.';
  }

  return {
    naMedido,
    glicemia,
    osmolaridadeEfetiva,
    status,
    alerta
  };
}

// ==========================================
// 7. ÂNION GAP
// ==========================================
export function calcularAnionGap(
  na: number,
  cl: number,
  hco3: number
): AnionGapResult {
  const anionGap = na - (cl + hco3);

  let status: 'normal' | 'elevado' | 'baixo' = 'normal';
  let alerta = '';
  const principaisCausas: string[] = [];

  if (anionGap > 12) {
    status = 'elevado';
    alerta = 'ALERTA CRÍTICO: Ânion gap elevado (> 12 mEq/L). A presença associada de cetonemia/cetonúria confirma Cetoacidose Diabética (CAD).';
    principaisCausas.push('Cetoacidose (Diabética, Alcoólica, Jejum prolongado)');
    principaisCausas.push('Acidose Láctica (Sepse, Choque, Hipoperfusão tecidual, Metformina)');
    principaisCausas.push('Insuficiência Renal / Uremia (retenção de fosfatos e sulfatos)');
    principaisCausas.push('Intoxicações exógenas (Salicilatos, Metanol, Etilenoglicol - MUDPILES)');
  } else if (anionGap < 4) {
    status = 'baixo';
    alerta = 'Ânion gap reduzido (< 4 mEq/L). Sugere hipoalbuminemia severa, mieloma múltiplo (paraproteínas catiônicas) ou intoxicação por lítio/brometo.';
    principaisCausas.push('Hipoalbuminemia acentuada (cada 1 g/dL de queda na albumina reduz o AG em ~2,5)');
    principaisCausas.push('Mieloma Múltiplo');
    principaisCausas.push('Hipercalcemia / Hipermagnesemia acentuada');
  } else {
    status = 'normal';
    alerta = 'Ânion gap dentro da normalidade (4-12 mEq/L). Em caso de acidose metabólica, configura acidose hiperclorêmica.';
    principaisCausas.push('Perdas digestivas de bicarbonato (Diarreia volumosa, fístulas biliares/pancreáticas)');
    principaisCausas.push('Acidose Tubular Renal (ATR tipo 1, 2 ou 4)');
    principaisCausas.push('Expansão volêmica vigorosa com SF 0,9% (acidose hiperclorêmica dilucional)');
  }

  return {
    na,
    cl,
    hco3,
    anionGap,
    status,
    alerta,
    principaisCausas
  };
}

// ==========================================
// 8. TFG (COCKCROFT-GAULT & SCHWARTZ)
// ==========================================
export function calcularTfg(
  idade: number,
  cr: number,
  peso?: number,
  sexo?: Gender,
  altura?: number,
  perfilPediatrico?: PediatricProfile
): {
  tfg: number;
  metodo: 'Cockcroft-Gault' | 'Schwartz';
  unidade: string;
  precisaAjuste: boolean;
  estagioDrc: string;
} {
  let tfg = 0;
  let metodo: 'Cockcroft-Gault' | 'Schwartz' = 'Cockcroft-Gault';
  let unidade = 'mL/min';

  if (idade < 18) {
    metodo = 'Schwartz';
    unidade = 'mL/min/1,73m²';
    const alt = altura || 100;
    const kMap: Record<PediatricProfile, number> = {
      '1': 0.33, // Prematuro (< 1 ano)
      '2': 0.45, // RN Termo (< 1 ano)
      '3': 0.55, // Criança / Adolescente Feminino
      '4': 0.70  // Adolescente Masculino
    };
    const k = kMap[perfilPediatrico || '3'] || 0.55;
    tfg = (k * alt) / Math.max(0.1, cr);
  } else {
    metodo = 'Cockcroft-Gault';
    unidade = 'mL/min';
    const p = peso || 70;
    tfg = ((140 - idade) * p) / (72 * Math.max(0.1, cr));
    if (sexo === 'F') {
      tfg *= 0.85;
    }
  }

  const precisaAjuste = tfg < 50;

  let estagioDrc = '';
  if (tfg >= 90) estagioDrc = 'Função renal normal ou elevada (Estágio G1)';
  else if (tfg >= 60) estagioDrc = 'Redução leve da filtração (Estágio G2)';
  else if (tfg >= 45) estagioDrc = 'Redução leve a moderada (Estágio G3a - Ajuste em fármacos críticos)';
  else if (tfg >= 30) estagioDrc = 'Redução moderada a severa (Estágio G3b - Ajuste obrigatório)';
  else if (tfg >= 15) estagioDrc = 'Redução severa da filtração (Estágio G4 - Risco de acúmulo de metabólitos)';
  else estagioDrc = 'Falência renal dialítica / terminal (Estágio G5)';

  return {
    tfg,
    metodo,
    unidade,
    precisaAjuste,
    estagioDrc
  };
}
