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

// Conduct Option definition for each calculator
export interface ConductOption {
  id: string;
  title: string;
  tag?: string;
  description: string;
  prescriptionText: string;
  justificationText?: string;
}

// Prescribed item in cumulative prescription (can contain electrolytes AND antimicrobials together!)
export interface PrescribedItem {
  id: string;
  category: 'electrolyte' | 'antimicrobial' | 'metabolic' | 'gasometry';
  title: string;
  orderText: string;
  justificationText: string;
  parameters: string[];
  addedAt: string;
}

export interface PatientPrescriptionInfo {
  patientName: string;
  bedNumber: string;
  recordNumber: string;
  physicianName: string;
  crm: string;
}

export interface ActivePrescriptionData {
  calculatorId: CalculatorId;
  calculatorTitle: string;
  parametersSummary: string[];
  conductOptions: ConductOption[];
  selectedConductId: string;
  customPrescriptionOrder?: string;
  antimicrobialsList?: PrescribedAntimicrobial[];
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
export type InfectionTopography =
  | '1' // Olhos
  | '2' // Pele e Partes Moles
  | '3' // Infecção em Queimados
  | '4' // Trato Respiratório
  | '5' // Sepse e Choque Séptico
  | '6' // Trato Urinário (ITU)
  | '7' // Sistema Nervoso Central (SNC / Meningites)
  | '8' // Intra-Abdominal e Gastrointestinal
  | '9' // Cardiovascular (Endocardite)
  | '10' // Ossos e Articulações (Osteoarticular)
  | '11' // Cabeça, Pescoço e Otorrinolaringologia
  | '12' // Ginecológico, Pélvico e ISTs
  | '13' // Neutropenia Febril e Imunossuprimidos
  | '14' // Infecções Fúngicas Invasivas
  | '15'; // Profilaxia Cirúrgica Antimicrobiana

export interface PathologyScheme {
  id: string;
  nome: string; // Ex: Conjuntivite Neonatal, Celulite Orbital, Pneumonia sem risco de Pseudomonas, etc.
  subtipo?: string;
  foco: string;
  dosePadraoTexto: string;
  doseAjusteRenalTexto: string;
  antibioticosRecomendados: {
    id: string;
    nome: string;
    dosePadrao: { valor: string; unidade: string; horario: string; via: string; diluente: string; tempo: string };
    doseRenal: { valor: string; unidade: string; horario: string; via: string; diluente: string; tempo: string; obs: string };
  }[];
  observacoes: string;
}

export interface PrescribedAntimicrobial {
  id: string;
  nome: string;
  patologiaId?: string;
  patologiaNome?: string;
  doseValor: string;
  doseUnidade: string; // 'g', 'mg', 'mg/kg'
  horario: string; // '6/6h', '8/8h', '12/12h', '24/24h', '48/48h', 'Dose única'
  via: string; // 'EV', 'VO', 'IM'
  tempoInfusao?: string; // '30 min', '60 min', 'Infusão Estendida (3-4h)'
  diluente: string; // '100 mL SF 0,9%', '250 mL SF 0,9%', '100 mL SG 5%', 'Sem diluente / Puro'
  ajustadoParaTfg: boolean;
  justificativaAjuste?: string;
  selecionado: boolean;
}
