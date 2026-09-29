export type CalculatorId =
  | 'potassium'
  | 'sodium'
  | 'bicarbonate'
  | 'gasometry'
  | 'corrected-sodium'
  | 'osmolarity'
  | 'anion-gap'
  | 'antimicrobial';

export interface CalculatorMeta {
  id: CalculatorId;
  title: string;
  shortTitle: string;
  category: 'Eletrólitos' | 'Ácido-Básico' | 'Metabólico' | 'Infectologia & Renal';
  description: string;
  badge?: string;
}

// Potassium Types
export type PatientAgeGroup = 'adult' | 'pediatric';
export type VenousAccess = 'peripheral' | 'central';

export interface PotassiumAdultResult {
  aumentoDesejado: number;
  doseMeq: number;
  ampolas: number; // 10mL a 19.1% (25.6 mEq/ampola)
  volMinDiluicaoSf: number;
  tempoMinHoras: number;
  taxaMax: number;
  via: VenousAccess;
}

export interface PotassiumPediatricResult {
  peso: number;
  isAdolescente: boolean;
  doseRecomendadaMeq: number;
  taxaInfusaoMeqH: number;
  tempoEstimadoHoras: number;
  ampolasKcl: number;
  volumeKclMl: number;
}

// Sodium Types
export type Gender = 'M' | 'F';
export type SolutionType = 'nacl3' | 'nacl09';

export interface SodiumAdultResult {
  act: number;
  variacaoCom1L: number;
  volPara05: number;
  velocidadeSugeridaMlH: number;
  preparoNacl3?: {
    sf09Ml: number;
    nacl20Ml: number;
    totalMl: number;
  };
}

export interface SodiumPediatricResult {
  manutencaoMin: number;
  manutencaoMax: number;
  limiteAbsolutoHora: number;
}

// Bicarbonate Types
export type BicarbonateIndication = 'metabolic_acidosis' | 'hyperkalemia' | 'cardiac_arrest';
export type BicarbonatePatient = 'adult' | 'pediatric' | 'neonatal';

export interface BicarbonateResult {
  indicacao: BicarbonateIndication;
  paciente?: BicarbonatePatient;
  doseMinMeq?: number;
  doseMaxMeq?: number;
  ampolasMin?: number;
  ampolasMax?: number;
  taxaMaxMeqH?: number;
  tempoInfusaoHoras?: string;
  orientacoes: string[];
  detalheDose: string;
}

// Gasometry Types
export interface GasometryResult {
  ph: number;
  pco2: number;
  hco3: number;
  estadoPh: 'Acidemia' | 'Alcalemia' | 'pH Normal';
  diagnostico: string;
  compensacao?: string;
  pco2Esperado?: {
    min: number;
    max: number;
    formula: string;
  };
  gravidade: 'normal' | 'leve' | 'moderada' | 'grave';
  alertasClinicos: string[];
}

// Corrected Sodium
export interface CorrectedSodiumResult {
  naMedido: number;
  glicemia: number;
  fator: number;
  naCorrigido: number;
  condutaSolucao: string;
  tipoSolucao: 'NaCl 0,9%' | 'NaCl 0,45%';
}

// Effective Osmolarity
export interface OsmolarityResult {
  naMedido: number;
  glicemia: number;
  osmolaridadeEfetiva: number;
  status: 'baixo' | 'normal' | 'elevado_grave';
  alerta: string;
}

// Anion Gap
export interface AnionGapResult {
  na: number;
  cl: number;
  hco3: number;
  anionGap: number;
  status: 'normal' | 'elevado' | 'baixo';
  alerta: string;
  principaisCausas: string[];
}

// GFR & Antimicrobial
export type PediatricProfile = '1' | '2' | '3' | '4'; // 1: prematuro, 2: RN termo, 3: crianca/fem, 4: adol masc
export type InfectionTopography = '1' | '2' | '3' | '4' | '5'; // Olhos, Pele/Partes Moles, Queimados, Respiratório, Sepse

export interface AntimicrobialScheme {
  id: string;
  nome: string;
  foco: string;
  dosePadrao: string;
  doseAjusteRenal: string;
  farmacos: string[];
  observacoes?: string;
  detalhesAjuste?: {
    farmaco: string;
    clcrFaixas: {
      faixa: string;
      dose: string;
    }[];
  }[];
}
