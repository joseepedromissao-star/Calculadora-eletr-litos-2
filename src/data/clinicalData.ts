import { CalculatorMeta, InfectionTopography, PathologyScheme } from '../types';

export const CALCULATORS_LIST: CalculatorMeta[] = [
  {
    id: 'potassium',
    title: 'Reposição de Potássio (KCl 19,1%)',
    shortTitle: 'KCl 19,1%',
    category: 'Eletrólitos',
    description: 'Cálculo de reposição por mEq, ampolas de 10mL, volume de diluição e tempo seguro de infusão para acessos venosos periférico e central.',
    badge: 'Adulto & Pediatria'
  },
  {
    id: 'sodium',
    title: 'Reposição de Sódio (Hiponatremia Grave)',
    shortTitle: 'Reposição de Na⁺',
    category: 'Eletrólitos',
    description: 'Cálculo de variação sérica com 1L (Adrogué-Madias), Água Corporal Total (ACT), velocidade para elevação de 0,5 mEq/h e limites de segurança (10 mEq/24h).',
    badge: 'Fórmula de Adrogué'
  },
  {
    id: 'bicarbonate',
    title: 'Bicarbonato de Sódio (8,4%)',
    shortTitle: 'NaHCO₃ 8,4%',
    category: 'Ácido-Básico',
    description: 'Dosagens e vias para Acidose Metabólica, Hipercalemia e Parada Cardiorrespiratória (PCR) em adultos, pediatria e neonatologia.',
    badge: 'Emergência & CTI'
  },
  {
    id: 'gasometry',
    title: 'Interpretação de Gasometria Arterial',
    shortTitle: 'Gasometria Arterial',
    category: 'Ácido-Básico',
    description: 'Análise de pH, pCO₂ e HCO₃⁻ com cálculo da resposta compensatória esperada (Winter) e detecção de distúrbios mistos ou agudos.',
    badge: 'Fórmula de Winter'
  },
  {
    id: 'corrected-sodium',
    title: 'Sódio Corrigido na Hiperglicemia',
    shortTitle: 'Na⁺ Corrigido',
    category: 'Metabólico',
    description: 'Correção de pseudo-hiponatremia hiperglicêmica (Katz / Hillier) e seleção da solução salina isotônica vs hipotônica.',
    badge: 'Katz / Hillier'
  },
  {
    id: 'osmolarity',
    title: 'Osmolaridade Plasmática Efetiva',
    shortTitle: 'Osmolaridade',
    category: 'Metabólico',
    description: 'Cálculo da tonicidade efetiva sérica com alertas para risco neurológico no Estado Hiperglicêmico Hiperosmolar (EHH).',
    badge: 'Efetiva / Tonicidade'
  },
  {
    id: 'anion-gap',
    title: 'Ânion Gap (Hiato Aniônico)',
    shortTitle: 'Ânion Gap',
    category: 'Ácido-Básico',
    description: 'Cálculo do hiato aniônico sérico com identificação etiológica e confirmação diagnóstica de cetoacidose e acidose láctica.',
    badge: 'Diagnóstico Diferencial'
  },
  {
    id: 'antimicrobial',
    title: 'Antimicrobianos e Ajuste Renal (TFG)',
    shortTitle: 'Antimicrobianos & Renal',
    category: 'Infectologia & Renal',
    description: 'Taxa de Filtração Glomerular (Cockcroft-Gault / Schwartz pediátrico) com todas as 11 topografias infecciosas e antibióticos referenciados com ajuste renal.',
    badge: 'TFG / Cockcroft / Schwartz'
  },
];

export interface TopographyDefinition {
  title: string;
  subtitle: string;
  patologias: PathologyScheme[];
}

export const TOPOGRAPHY_MAP: Record<InfectionTopography, TopographyDefinition> = {
  '1': {
    title: 'Olhos',
    subtitle: 'Infecções oculares e periorbitárias graves',
    patologias: [
      {
        id: 'olhos-conjuntivite',
        nome: 'Conjuntivite Neonatal',
        subtipo: 'Neonato',
        foco: 'Neisseria gonorrhoeae / Chlamydia trachomatis em recém-nascidos',
        dosePadraoTexto: 'Ceftriaxona 25-50mg/kg EV dose única (máx: 125mg) + Azitromicina 20mg/kg/dia VO 24/24h por 3 dias.',
        doseAjusteRenalTexto: '[AJUSTAR DOSE CONFORME FUNÇÃO RENAL] (Fármacos: Ceftriaxona + Azitromicina)',
        antibioticosRecomendados: [
          {
            id: 'ceftriaxona-conj',
            nome: 'Ceftriaxona',
            dosePadrao: { valor: '50', unidade: 'mg/kg', horario: 'Dose única', via: 'EV', diluente: '50 mL SF 0,9%', tempo: '30 min' },
            doseRenal: { valor: '50', unidade: 'mg/kg', horario: 'Dose única', via: 'EV', diluente: '50 mL SF 0,9%', tempo: '30 min', obs: 'Dose única de até 125mg. Eliminação mista (biliar e renal).' }
          },
          {
            id: 'azitromicina-conj',
            nome: 'Azitromicina',
            dosePadrao: { valor: '20', unidade: 'mg/kg', horario: '24/24h', via: 'VO', diluente: 'Suspensão oral', tempo: 'VO por 3 dias' },
            doseRenal: { valor: '20', unidade: 'mg/kg', horario: '24/24h', via: 'VO', diluente: 'Suspensão oral', tempo: 'VO por 3 dias', obs: 'Eliminação biliar. Não requer ajuste renal.' }
          }
        ],
        observacoes: 'Irrigação ocular contínua com SF 0,9%. Tratar mãe e parceiro.'
      },
      {
        id: 'olhos-celulite',
        nome: 'Celulite Orbital (Pós-septal)',
        subtipo: 'Emergência Oftalmológica',
        foco: 'S. aureus, Streptococcus spp., anaeróbios de seios da face',
        dosePadraoTexto: 'Ceftriaxona 2g EV 1x/dia + Clindamicina 600mg EV 6/6h.',
        doseAjusteRenalTexto: '[AJUSTAR DOSE CONFORME FUNÇÃO RENAL] (Fármacos: Ceftriaxona + Clindamicina)',
        antibioticosRecomendados: [
          {
            id: 'ceftriaxona-cel',
            nome: 'Ceftriaxona',
            dosePadrao: { valor: '2', unidade: 'g', horario: '24/24h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min' },
            doseRenal: { valor: '1', unidade: 'g', horario: '24/24h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min', obs: 'Se ClCr < 10 mL/min com disfunção hepática, reduzir para 1g.' }
          },
          {
            id: 'clindamicina-cel',
            nome: 'Clindamicina',
            dosePadrao: { valor: '600', unidade: 'mg', horario: '6/6h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min' },
            doseRenal: { valor: '600', unidade: 'mg', horario: '6/6h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min', obs: 'Metabolismo hepático predominante. Dose mantida.' }
          }
        ],
        observacoes: 'Emergência com risco de trombose de seio cavernoso. Solicitar TC de órbitas.'
      }
    ]
  },
  '2': {
    title: 'Pele e Partes Moles',
    subtitle: 'Celulite, erisipela, pé diabético e fasceíte necrosante',
    patologias: [
      {
        id: 'pele-celulite',
        nome: 'Celulite / Erisipela',
        subtipo: 'Infecção Cutânea',
        foco: 'Streptococcus pyogenes e S. aureus sensível (MSSA)',
        dosePadraoTexto: 'Oxacilina 2g EV 4/4h; OU Cefalotina 1g EV 6/6h; OU Cefalexina 500mg 2cp VO 6/6h.',
        doseAjusteRenalTexto: '[AJUSTAR DOSE CONFORME FUNÇÃO RENAL] (Fármacos: Oxacilina ou Cefalotina)',
        antibioticosRecomendados: [
          {
            id: 'oxacilina-cel',
            nome: 'Oxacilina',
            dosePadrao: { valor: '2', unidade: 'g', horario: '4/4h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min' },
            doseRenal: { valor: '1.5', unidade: 'g', horario: '6/6h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min', obs: 'Se ClCr ≤ 10 mL/min: 1g a 2g 6/6h.' }
          },
          {
            id: 'cefalotina-cel',
            nome: 'Cefalotina',
            dosePadrao: { valor: '1', unidade: 'g', horario: '6/6h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min' },
            doseRenal: { valor: '1', unidade: 'g', horario: '8/8h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min', obs: 'ClCr 10-50 mL/min: estender intervalo para 8/8h a 12/12h.' }
          },
          {
            id: 'cefalexina-cel',
            nome: 'Cefalexina (VO)',
            dosePadrao: { valor: '1', unidade: 'g', horario: '6/6h', via: 'VO', diluente: 'Com água', tempo: 'VO' },
            doseRenal: { valor: '500', unidade: 'mg', horario: '8/8h', via: 'VO', diluente: 'Com água', tempo: 'VO', obs: 'ClCr 10-50 mL/min: 500mg 8/8h a 12/12h.' }
          }
        ],
        observacoes: 'Demarcar área do eritema com caneta dérmica para avaliar evolução em 24-48h.'
      },
      {
        id: 'pele-pe-diabetico',
        nome: 'Pé Diabético Moderado (Polimicrobiano)',
        subtipo: 'Infecção Mista',
        foco: 'Gram-positivos, bacilos Gram-negativos e anaeróbios',
        dosePadraoTexto: 'Amoxicilina-Clavulanato 500/125mg VO 8/8h OU Ceftriaxone 2g EV + Metronidazol 500mg EV 8/8h (21-28 dias).',
        doseAjusteRenalTexto: '[AJUSTAR DOSE CONFORME FUNÇÃO RENAL] (Fármacos: Amoxicilina-Clavulanato ou Ceftriaxone + Metronidazol)',
        antibioticosRecomendados: [
          {
            id: 'amox-clav-pe',
            nome: 'Amoxicilina + Clavulanato',
            dosePadrao: { valor: '500/125', unidade: 'mg', horario: '8/8h', via: 'VO', diluente: 'Com água', tempo: 'VO' },
            doseRenal: { valor: '500/125', unidade: 'mg', horario: '12/12h', via: 'VO', diluente: 'Com água', tempo: 'VO', obs: 'ClCr 10-30 mL/min: 500/125mg 12/12h (evitar formulação 875mg).' }
          },
          {
            id: 'ceftriaxona-pe',
            nome: 'Ceftriaxona',
            dosePadrao: { valor: '2', unidade: 'g', horario: '24/24h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min' },
            doseRenal: { valor: '2', unidade: 'g', horario: '24/24h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min', obs: 'Dose plena mantida.' }
          },
          {
            id: 'metronidazol-pe',
            nome: 'Metronidazol',
            dosePadrao: { valor: '500', unidade: 'mg', horario: '8/8h', via: 'EV', diluente: 'Bolsa 100 mL pronta', tempo: '30 min' },
            doseRenal: { valor: '500', unidade: 'mg', horario: '12/12h', via: 'EV', diluente: 'Bolsa 100 mL pronta', tempo: '30 min', obs: 'ClCr < 10 mL/min: estender para 12/12h.' }
          }
        ],
        observacoes: 'Desbridamento mecânico e alívio de pressão plantar são mandatórios.'
      },
      {
        id: 'pele-fasceite',
        nome: 'Fasceíte Necrosante / Gangrena de Fournier',
        subtipo: 'Emergência Cirúrgica',
        foco: 'Flora polimicrobiana sinérgica tipo I ou Streptococcus pyogenes tipo II',
        dosePadraoTexto: 'Meropenem 1g EV 8/8h + Vancomicina 15-20 mg/kg EV 12/12h + Clindamicina 900mg EV 8/8h.',
        doseAjusteRenalTexto: '[AJUSTAR DOSE CONFORME FUNÇÃO RENAL] (Ajustar Meropenem e Vancomicina)',
        antibioticosRecomendados: [
          {
            id: 'meropenem-fn',
            nome: 'Meropenem',
            dosePadrao: { valor: '1', unidade: 'g', horario: '8/8h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: 'Infusão Estendida (3h)' },
            doseRenal: { valor: '1', unidade: 'g', horario: '12/12h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: 'Infusão Estendida (3h)', obs: 'ClCr 26-50: 1g 12/12h. ClCr 10-25: 500mg 12/12h. ClCr < 10: 500mg 24/24h.' }
          },
          {
            id: 'vancomicina-fn',
            nome: 'Vancomicina',
            dosePadrao: { valor: '25-30', unidade: 'mg/kg', horario: '12/12h', via: 'EV', diluente: '250 mL SF 0,9%', tempo: '60-120 min' },
            doseRenal: { valor: '15', unidade: 'mg/kg', horario: '24/24h', via: 'EV', diluente: '250 mL SF 0,9%', tempo: '60-120 min', obs: 'Ataque integral. Manutenção ClCr 30-50: 15 mg/kg 24/24h.' }
          },
          {
            id: 'clindamicina-fn',
            nome: 'Clindamicina',
            dosePadrao: { valor: '900', unidade: 'mg', horario: '8/8h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min' },
            doseRenal: { valor: '900', unidade: 'mg', horario: '8/8h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min', obs: 'Inibe síntese de toxinas bacterianas (efeito antitoxínico).' }
          }
        ],
        observacoes: 'Desbridamento cirúrgico de emergência é a intervenção que salva a vida.'
      }
    ]
  },
  '3': {
    title: 'Infecção em Queimados',
    subtitle: 'Protocolos de sepse precoce vs tardia em grandes queimados',
    patologias: [
      {
        id: 'queimados-precoce',
        nome: 'Sepse Precoce SEM Infecção no Local (< 72h)',
        subtipo: 'Precoce (< 72h)',
        foco: 'Flora endógena inicial cutânea (S. aureus, Streptococcus)',
        dosePadraoTexto: 'Ceftriaxone + Oxacilina.',
        doseAjusteRenalTexto: '[AJUSTAR DOSE CONFORME FUNÇÃO RENAL] (Fármacos: Ceftriaxone + Oxacilina)',
        antibioticosRecomendados: [
          {
            id: 'ceftriaxona-qp',
            nome: 'Ceftriaxona',
            dosePadrao: { valor: '2', unidade: 'g', horario: '24/24h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min' },
            doseRenal: { valor: '2', unidade: 'g', horario: '24/24h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min', obs: 'Manter dose plena.' }
          },
          {
            id: 'oxacilina-qp',
            nome: 'Oxacilina',
            dosePadrao: { valor: '2', unidade: 'g', horario: '4/4h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min' },
            doseRenal: { valor: '1.5', unidade: 'g', horario: '6/6h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min', obs: 'Se ClCr < 10: 1g a 2g 6/6h.' }
          }
        ],
        observacoes: 'Grandes queimados podem ter hiperfiltração nas primeiras 48h seguida de LRA.'
      },
      {
        id: 'queimados-tardia',
        nome: 'Sepse Tardia SEM Infecção no Local (> 72h)',
        subtipo: 'Tardia (> 72h)',
        foco: 'Patógenos nosocomiais multirresistentes (Pseudomonas aeruginosa, MRSA)',
        dosePadraoTexto: 'Piperacilina/Tazobactan + Vancomicina.',
        doseAjusteRenalTexto: '[AJUSTAR DOSE CONFORME FUNÇÃO RENAL] (Fármacos: Piperacilina/Tazobactan + Vancomicina)',
        antibioticosRecomendados: [
          {
            id: 'pip-tazo-qt',
            nome: 'Piperacilina + Tazobactam',
            dosePadrao: { valor: '4.5', unidade: 'g', horario: '6/6h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: 'Infusão Estendida (4h)' },
            doseRenal: { valor: '3.375', unidade: 'g', horario: '6/6h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: 'Infusão Estendida (4h)', obs: 'ClCr 20-50 mL/min: 3,375g 6/6h OU 2,25g 6/6h. ClCr < 20: 2,25g 8/8h.' }
          },
          {
            id: 'vancomicina-qt',
            nome: 'Vancomicina',
            dosePadrao: { valor: '25-30', unidade: 'mg/kg', horario: '12/12h', via: 'EV', diluente: '250 mL SF 0,9%', tempo: '60-120 min' },
            doseRenal: { valor: '15', unidade: 'mg/kg', horario: '24/24h', via: 'EV', diluente: '250 mL SF 0,9%', tempo: '60-120 min', obs: 'Ataque integral. Manutenção ClCr 30-50: 15 mg/kg 24/24h.' }
          }
        ],
        observacoes: 'Ajuste estrito de Vancomicina por vancocinemia sérica (alvo vale 15-20 mcg/mL).'
      }
    ]
  },
  '4': {
    title: 'Trato Respiratório',
    subtitle: 'Pneumonia adquirida na comunidade e intra-hospitalar',
    patologias: [
      {
        id: 'resp-sem-pseudo',
        nome: 'Pneumonia Adulto SEM Risco para Pseudomonas',
        subtipo: 'Comunitária Grave',
        foco: 'Streptococcus pneumoniae, Haemophilus influenzae, germes atípicos',
        dosePadraoTexto: 'Ceftriaxona 2g EV 24/24h + Azitromicina 500mg EV 24/24h por 7-10 dias.',
        doseAjusteRenalTexto: '[AJUSTAR DOSE CONFORME FUNÇÃO RENAL] (Fármacos: Ceftriaxona + Azitromicina)',
        antibioticosRecomendados: [
          {
            id: 'ceftriaxona-pac',
            nome: 'Ceftriaxona',
            dosePadrao: { valor: '2', unidade: 'g', horario: '24/24h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min' },
            doseRenal: { valor: '2', unidade: 'g', horario: '24/24h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min', obs: 'Dose plena 2g 24/24h mantida.' }
          },
          {
            id: 'azitromicina-pac',
            nome: 'Azitromicina',
            dosePadrao: { valor: '500', unidade: 'mg', horario: '24/24h', via: 'EV', diluente: '250 mL SF 0,9%', tempo: '60 min' },
            doseRenal: { valor: '500', unidade: 'mg', horario: '24/24h', via: 'EV', diluente: '250 mL SF 0,9%', tempo: '60 min', obs: 'Eliminação biliar. Sem ajuste renal.' }
          }
        ],
        observacoes: 'Trocar para VO após 48h afebril e com estabilidade clínica.'
      },
      {
        id: 'resp-com-pseudo',
        nome: 'Pneumonia Adulto COM Risco para Pseudomonas (Sem ATB Prévio)',
        subtipo: 'Risco Nosocomial',
        foco: 'Pseudomonas aeruginosa, bacilos Gram-negativos produtores de AmpC',
        dosePadraoTexto: 'Ceftazidima 2g EV 8/8h.',
        doseAjusteRenalTexto: '[AJUSTAR DOSE CONFORME FUNÇÃO RENAL] (Fármaco: Ceftazidima)',
        antibioticosRecomendados: [
          {
            id: 'ceftazidima-pnas',
            nome: 'Ceftazidima',
            dosePadrao: { valor: '2', unidade: 'g', horario: '8/8h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: 'Infusão Estendida (3h)' },
            doseRenal: { valor: '1', unidade: 'g', horario: '8/8h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: 'Infusão Estendida (3h)', obs: 'ClCr 31-50 mL/min: 1g 8/8h ou 2g 12/12h. ClCr 16-30: 1g 12/12h.' }
          }
        ],
        observacoes: 'Fatores de risco: bronquiectasias, DPOC com uso frequente de corticoides/ATB, internação prévia.'
      },
      {
        id: 'resp-aspirativa',
        nome: 'Pneumonia Aspirativa / Abscesso Pulmonar',
        subtipo: 'Anaeróbios da Boca',
        foco: 'Streptococcus orais, Peptostreptococcus, Prevotella, Fusobacterium',
        dosePadraoTexto: 'Ceftriaxona 2g EV 24/24h + Metronidazol 500mg EV 8/8h (ou Ampicilina-Sulbactam 3g 6/6h).',
        doseAjusteRenalTexto: '[AJUSTAR DOSE CONFORME FUNÇÃO RENAL] (Ajustar Metronidazol se ClCr < 10)',
        antibioticosRecomendados: [
          {
            id: 'ceftriaxona-asp',
            nome: 'Ceftriaxona',
            dosePadrao: { valor: '2', unidade: 'g', horario: '24/24h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min' },
            doseRenal: { valor: '2', unidade: 'g', horario: '24/24h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min', obs: 'Dose plena mantida.' }
          },
          {
            id: 'metronidazol-asp',
            nome: 'Metronidazol',
            dosePadrao: { valor: '500', unidade: 'mg', horario: '8/8h', via: 'EV', diluente: 'Bolsa 100 mL pronta', tempo: '30 min' },
            doseRenal: { valor: '500', unidade: 'mg', horario: '12/12h', via: 'EV', diluente: 'Bolsa 100 mL pronta', tempo: '30 min', obs: 'ClCr < 10 mL/min: estender para 12/12h.' }
          }
        ],
        observacoes: 'Comum em pacientes com rebaixamento de consciência, disfagia ou pós-PCR.'
      }
    ]
  },
  '5': {
    title: 'Sepse e Choque Séptico',
    subtitle: 'Ressuscitação da 1ª Hora (Hour-1 Bundle)',
    patologias: [
      {
        id: 'sepse-pulmonar',
        nome: 'Sepse com Foco Pulmonar (Comunitário)',
        subtipo: 'Hour-1 Bundle',
        foco: 'S. pneumoniae, Legionella, bacilos entéricos Gram-negativos',
        dosePadraoTexto: 'Ceftriaxone 2g EV 24/24h + Macrolídeo EV (Azitromicina 500mg).',
        doseAjusteRenalTexto: '[AJUSTAR DOSE CONFORME FUNÇÃO RENAL] (Fármacos: Ceftriaxone + Macrolídeo)',
        antibioticosRecomendados: [
          {
            id: 'ceftriaxona-sp',
            nome: 'Ceftriaxona',
            dosePadrao: { valor: '2', unidade: 'g', horario: '24/24h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min' },
            doseRenal: { valor: '2', unidade: 'g', horario: '24/24h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min', obs: '1ª dose deve ser PLENA na sepse mesmo se falência renal.' }
          },
          {
            id: 'azitromicina-sp',
            nome: 'Azitromicina',
            dosePadrao: { valor: '500', unidade: 'mg', horario: '24/24h', via: 'EV', diluente: '250 mL SF 0,9%', tempo: '60 min' },
            doseRenal: { valor: '500', unidade: 'mg', horario: '24/24h', via: 'EV', diluente: '250 mL SF 0,9%', tempo: '60 min', obs: 'Dose plena mantida.' }
          }
        ],
        observacoes: 'A primeira dose em paciente séptico deve ser administrada na 1ª hora em dose máxima.'
      },
      {
        id: 'sepse-abdominal',
        nome: 'Sepse com Foco Abdominal (Comunitário)',
        subtipo: 'Hour-1 Bundle',
        foco: 'Enterobacteriaceae (E. coli, Klebsiella), Enterococcus e anaeróbios (Bacteroides fragilis)',
        dosePadraoTexto: 'Ceftriaxone 2g EV 24/24h + Metronidazol 500mg EV 8/8h.',
        doseAjusteRenalTexto: '[AJUSTAR DOSE CONFORME FUNÇÃO RENAL] (Fármacos: Ceftriaxone + Metronidazol)',
        antibioticosRecomendados: [
          {
            id: 'ceftriaxona-sa',
            nome: 'Ceftriaxona',
            dosePadrao: { valor: '2', unidade: 'g', horario: '24/24h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min' },
            doseRenal: { valor: '2', unidade: 'g', horario: '24/24h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min', obs: 'Dose plena de ataque 2g mantida.' }
          },
          {
            id: 'metronidazol-sa',
            nome: 'Metronidazol',
            dosePadrao: { valor: '500', unidade: 'mg', horario: '8/8h', via: 'EV', diluente: 'Bolsa 100 mL pronta', tempo: '30 min' },
            doseRenal: { valor: '500', unidade: 'mg', horario: '12/12h', via: 'EV', diluente: 'Bolsa 100 mL pronta', tempo: '30 min', obs: 'ClCr < 10 mL/min: estender intervalo para 12/12h.' }
          }
        ],
        observacoes: 'Controle de foco cirúrgico urgente é indispensável.'
      },
      {
        id: 'sepse-corrente-sanguinea',
        nome: 'Sepse com Foco em Corrente Sanguínea (Cateter)',
        subtipo: 'Hour-1 Bundle',
        foco: 'S. aureus (MRSA), Staphylococcus coagulase-negativa, P. aeruginosa',
        dosePadraoTexto: 'Retirar o dispositivo e iniciar Vancomicina 30mg/kg EV (ataque) + Cefepime 2g EV 8/8h.',
        doseAjusteRenalTexto: '[AJUSTAR DOSE CONFORME FUNÇÃO RENAL] (Fármacos: Vancomicina + Cefepime)',
        antibioticosRecomendados: [
          {
            id: 'vancomicina-sc',
            nome: 'Vancomicina',
            dosePadrao: { valor: '25-30', unidade: 'mg/kg', horario: '12/12h', via: 'EV', diluente: '250 mL SF 0,9%', tempo: '60-120 min' },
            doseRenal: { valor: '15', unidade: 'mg/kg', horario: '24/24h', via: 'EV', diluente: '250 mL SF 0,9%', tempo: '60-120 min', obs: 'Dose de ataque integral (25-30 mg/kg). Manutenção ClCr 30-50: 15 mg/kg a cada 24h.' }
          },
          {
            id: 'cefepime-sc',
            nome: 'Cefepime',
            dosePadrao: { valor: '2', unidade: 'g', horario: '8/8h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: 'Infusão Estendida (3-4h)' },
            doseRenal: { valor: '2', unidade: 'g', horario: '12/12h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: 'Infusão Estendida (3-4h)', obs: 'ClCr 30-50: 2g 12/12h. ClCr 11-29: 1g 24/24h. Risco de neurotoxicidade grave se não corrigido!' }
          }
        ],
        observacoes: 'Retirar cateter suspeito e coletar hemoculturas pareadas (cateter + periférica).'
      }
    ]
  },
  '6': {
    title: 'Trato Urinário (ITU)',
    subtitle: 'Cistite, pielonefrite aguda e urossepses',
    patologias: [
      {
        id: 'itu-cistite',
        nome: 'Cistite Aguda Não Complicada',
        subtipo: 'Urinária Baixa',
        foco: 'Escherichia coli, Klebsiella pneumoniae, Proteus mirabilis',
        dosePadraoTexto: 'Fosfomicina trometamol 3g VO dose única OU Nitrofurantoína 100mg VO 6/6h por 5 dias.',
        doseAjusteRenalTexto: '[AJUSTAR DOSE CONFORME FUNÇÃO RENAL] (Atenção: Nitrofurantoína contraindicada se ClCr < 30)',
        antibioticosRecomendados: [
          {
            id: 'fosfomicina-cist',
            nome: 'Fosfomicina Trometamol',
            dosePadrao: { valor: '3', unidade: 'g', horario: 'Dose única', via: 'VO', diluente: 'Dissolver em meio copo de água', tempo: 'VO ao deitar' },
            doseRenal: { valor: '3', unidade: 'g', horario: 'Dose única', via: 'VO', diluente: 'Dissolver em meio copo de água', tempo: 'VO ao deitar', obs: 'Seguro e eficaz em dose única mesmo com TFG reduzida.' }
          },
          {
            id: 'nitrofurantoina-cist',
            nome: 'Nitrofurantoína',
            dosePadrao: { valor: '100', unidade: 'mg', horario: '6/6h', via: 'VO', diluente: 'Com alimentos', tempo: 'VO por 5 dias' },
            doseRenal: { valor: '100', unidade: 'mg', horario: '6/6h', via: 'VO', diluente: 'Com alimentos', tempo: 'VO', obs: 'Contraindicado se ClCr < 30 mL/min (não atinge níveis urinários terapêuticos e acumula toxicidade).' }
          }
        ],
        observacoes: 'Não utilizar quinolonas como 1ª escolha em cistite simples pelo risco de resistência e efeitos adversos.'
      },
      {
        id: 'itu-pielonefrite',
        nome: 'Pielonefrite Aguda Comunitária',
        subtipo: 'Urinária Alta',
        foco: 'E. coli uropatogênica, K. pneumoniae',
        dosePadraoTexto: 'Ceftriaxona 1g a 2g EV 24/24h OU Ciprofloxacino 500mg VO 12/12h (ou 400mg EV 12/12h).',
        doseAjusteRenalTexto: '[AJUSTAR DOSE CONFORME FUNÇÃO RENAL] (Ajustar Ciprofloxacino se ClCr < 30)',
        antibioticosRecomendados: [
          {
            id: 'ceftriaxona-pielo',
            nome: 'Ceftriaxona',
            dosePadrao: { valor: '2', unidade: 'g', horario: '24/24h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min' },
            doseRenal: { valor: '2', unidade: 'g', horario: '24/24h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min', obs: 'Dose plena 2g 24/24h mantida com excelente excreção urinária.' }
          },
          {
            id: 'ciprofloxacino-pielo',
            nome: 'Ciprofloxacino',
            dosePadrao: { valor: '400', unidade: 'mg', horario: '12/12h', via: 'EV', diluente: 'Bolsa pronta 200 mL', tempo: '60 min' },
            doseRenal: { valor: '400', unidade: 'mg', horario: '24/24h', via: 'EV', diluente: 'Bolsa pronta 200 mL', tempo: '60 min', obs: 'ClCr < 30 mL/min: reduzir frequência para cada 24 horas.' }
          }
        ],
        observacoes: 'Solicitar urocultura prévia com antibiograma obrigatório.'
      },
      {
        id: 'itu-urossepses',
        nome: 'Urossepses / ITU Complicada com Obstrução',
        subtipo: 'Sepse Urológica',
        foco: 'Enterobacteriaceae multirresistentes, Pseudomonas aeruginosa, Enterococcus',
        dosePadraoTexto: 'Cefepime 2g EV 8/8h OU Meropenem 1g EV 8/8h (se risco de ESBL / choque séptico).',
        doseAjusteRenalTexto: '[AJUSTAR DOSE CONFORME FUNÇÃO RENAL] (Ajuste obrigatório para Cefepime e Meropenem)',
        antibioticosRecomendados: [
          {
            id: 'cefepime-uro',
            nome: 'Cefepime',
            dosePadrao: { valor: '2', unidade: 'g', horario: '8/8h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: 'Infusão Estendida (3-4h)' },
            doseRenal: { valor: '2', unidade: 'g', horario: '12/12h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: 'Infusão Estendida (3-4h)', obs: 'ClCr 30-50: 2g 12/12h. ClCr 11-29: 1g 24/24h.' }
          },
          {
            id: 'meropenem-uro',
            nome: 'Meropenem',
            dosePadrao: { valor: '1', unidade: 'g', horario: '8/8h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: 'Infusão Estendida (3h)' },
            doseRenal: { valor: '1', unidade: 'g', horario: '12/12h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: 'Infusão Estendida (3h)', obs: 'ClCr 26-50: 1g 12/12h. ClCr 10-25: 500mg 12/12h. ClCr < 10: 500mg 24/24h.' }
          }
        ],
        observacoes: 'Desobstrução urológica urgente (duplo J ou nefrostomia) se litíase ou hidronefrose obstrutiva.'
      }
    ]
  },
  '7': {
    title: 'Sistema Nervoso Central (SNC / Meningites)',
    subtitle: 'Meningite bacteriana aguda comunitária e pós-neurocirúrgica',
    patologias: [
      {
        id: 'snc-meningite-comunitaria',
        nome: 'Meningite Bacteriana Aguda Comunitária',
        subtipo: 'Emergência Neurológica',
        foco: 'Streptococcus pneumoniae, Neisseria meningitidis, Listeria monocytogenes (> 50 anos)',
        dosePadraoTexto: 'Ceftriaxona 2g EV 12/12h + Vancomicina 15-20 mg/kg EV 12/12h (+ Ampicilina 2g 4/4h se > 50 anos).',
        doseAjusteRenalTexto: '[AJUSTAR DOSE CONFORME FUNÇÃO RENAL] (Ajustar Vancomicina e Ampicilina)',
        antibioticosRecomendados: [
          {
            id: 'ceftriaxona-men',
            nome: 'Ceftriaxona',
            dosePadrao: { valor: '2', unidade: 'g', horario: '12/12h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min' },
            doseRenal: { valor: '2', unidade: 'g', horario: '12/12h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min', obs: 'Dose MENÍNGEA dobrada (4g/dia total: 2g 12/12h) para penetração liquórica ótima.' }
          },
          {
            id: 'vancomicina-men',
            nome: 'Vancomicina',
            dosePadrao: { valor: '25-30', unidade: 'mg/kg', horario: '12/12h', via: 'EV', diluente: '250 mL SF 0,9%', tempo: '60-120 min' },
            doseRenal: { valor: '15', unidade: 'mg/kg', horario: '24/24h', via: 'EV', diluente: '250 mL SF 0,9%', tempo: '60-120 min', obs: 'Ataque pleno obrigatório. Alvo vancocinemia sérica 15 a 20 mcg/mL.' }
          },
          {
            id: 'ampicilina-men',
            nome: 'Ampicilina',
            dosePadrao: { valor: '2', unidade: 'g', horario: '4/4h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min' },
            doseRenal: { valor: '2', unidade: 'g', horario: '6/6h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min', obs: 'Cobertura de Listeria em > 50 anos ou imunossuprimidos. ClCr < 50: 2g 6/6h.' }
          }
        ],
        observacoes: 'Administrar Dexametasona 10mg EV antes ou junto da primeira dose de antibiótico.'
      },
      {
        id: 'snc-meningite-nosocomial',
        nome: 'Meningite Hospitalar / Pós-Neurocirúrgica / DVE',
        subtipo: 'Hospitalar',
        foco: 'Pseudomonas aeruginosa, Acinetobacter baumannii, S. aureus MRSA, S. epidermidis',
        dosePadraoTexto: 'Meropenem 2g EV 8/8h + Vancomicina 15-20 mg/kg EV 12/12h.',
        doseAjusteRenalTexto: '[AJUSTAR DOSE CONFORME FUNÇÃO RENAL] (Ajuste obrigatório para Meropenem e Vancomicina)',
        antibioticosRecomendados: [
          {
            id: 'meropenem-snc',
            nome: 'Meropenem',
            dosePadrao: { valor: '2', unidade: 'g', horario: '8/8h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: 'Infusão Estendida (3h)' },
            doseRenal: { valor: '1', unidade: 'g', horario: '8/8h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: 'Infusão Estendida (3h)', obs: 'Dose MENÍNGEA é 2g 8/8h. Em ClCr 26-50: 1g 8/8h. ClCr 10-25: 1g 12/12h.' }
          },
          {
            id: 'vancomicina-snc',
            nome: 'Vancomicina',
            dosePadrao: { valor: '25-30', unidade: 'mg/kg', horario: '12/12h', via: 'EV', diluente: '250 mL SF 0,9%', tempo: '60-120 min' },
            doseRenal: { valor: '15', unidade: 'mg/kg', horario: '24/24h', via: 'EV', diluente: '250 mL SF 0,9%', tempo: '60-120 min', obs: 'Monitorar nível sérico estritamente.' }
          }
        ],
        observacoes: 'Considerar troca ou remoção do cateter de DVE contaminado.'
      }
    ]
  },
  '8': {
    title: 'Intra-Abdominal e Gastrointestinal',
    subtitle: 'Apendicite, peritonite, colangite e infecção por C. difficile',
    patologias: [
      {
        id: 'abd-peritonite-comunitaria',
        nome: 'Apendicite / Colecistite / Diverticulite Aguda',
        subtipo: 'Comunitária',
        foco: 'Enterobacteriaceae (E. coli, Klebsiella), Bacteroides fragilis e anaeróbios',
        dosePadraoTexto: 'Ceftriaxona 2g EV 24/24h + Metronidazol 500mg EV 8/8h.',
        doseAjusteRenalTexto: '[AJUSTAR DOSE CONFORME FUNÇÃO RENAL] (Ajustar Metronidazol se ClCr < 10)',
        antibioticosRecomendados: [
          {
            id: 'ceftriaxona-abd',
            nome: 'Ceftriaxona',
            dosePadrao: { valor: '2', unidade: 'g', horario: '24/24h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min' },
            doseRenal: { valor: '2', unidade: 'g', horario: '24/24h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min', obs: 'Dose plena 2g mantida.' }
          },
          {
            id: 'metronidazol-abd',
            nome: 'Metronidazol',
            dosePadrao: { valor: '500', unidade: 'mg', horario: '8/8h', via: 'EV', diluente: 'Bolsa 100 mL pronta', tempo: '30 min' },
            doseRenal: { valor: '500', unidade: 'mg', horario: '12/12h', via: 'EV', diluente: 'Bolsa 100 mL pronta', tempo: '30 min', obs: 'ClCr < 10 mL/min: estender para 12/12h.' }
          }
        ],
        observacoes: 'Avaliar indicação cirúrgica imediata.'
      },
      {
        id: 'abd-peritonite-grave',
        nome: 'Peritonite Secundária Grave / Choque Séptico Abdominal',
        subtipo: 'Nosocomial / Grave',
        foco: 'P. aeruginosa, Enterobacteriaceae ESBL, Enterococcus faecalis, anaeróbios resistentes',
        dosePadraoTexto: 'Piperacilina/Tazobactam 4,5g EV 6/6h OU Meropenem 1g EV 8/8h.',
        doseAjusteRenalTexto: '[AJUSTAR DOSE CONFORME FUNÇÃO RENAL] (Ajuste obrigatório para Pip-Tazo e Meropenem)',
        antibioticosRecomendados: [
          {
            id: 'pip-tazo-abd',
            nome: 'Piperacilina + Tazobactam',
            dosePadrao: { valor: '4.5', unidade: 'g', horario: '6/6h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: 'Infusão Estendida (4h)' },
            doseRenal: { valor: '3.375', unidade: 'g', horario: '6/6h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: 'Infusão Estendida (4h)', obs: 'ClCr 20-50: 3,375g 6/6h. ClCr < 20: 2,25g 8/8h.' }
          },
          {
            id: 'meropenem-abd',
            nome: 'Meropenem',
            dosePadrao: { valor: '1', unidade: 'g', horario: '8/8h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: 'Infusão Estendida (3h)' },
            doseRenal: { valor: '1', unidade: 'g', horario: '12/12h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: 'Infusão Estendida (3h)', obs: 'ClCr 26-50: 1g 12/12h. ClCr 10-25: 500mg 12/12h. ClCr < 10: 500mg 24/24h.' }
          }
        ],
        observacoes: 'Controle precoce da fonte de contaminação intra-abdominal.'
      },
      {
        id: 'abd-clostridioides',
        nome: 'Colite por Clostridioides difficile',
        subtipo: 'Diarreia Hospitalar',
        foco: 'Clostridioides difficile produtor de toxinas A e B',
        dosePadraoTexto: 'Vancomicina 125mg VO 6/6h por 10 dias (OU Metronidazol 500mg VO 8/8h se não grave).',
        doseAjusteRenalTexto: '[AJUSTAR DOSE CONFORME FUNÇÃO RENAL] (Vancomicina VO não é absorvida sistemicamente; sem ajuste renal)',
        antibioticosRecomendados: [
          {
            id: 'vancomicina-vo',
            nome: 'Vancomicina (VIA ORAL)',
            dosePadrao: { valor: '125', unidade: 'mg', horario: '6/6h', via: 'VO', diluente: 'Solução oral / Cápsula', tempo: 'VO por 10 dias' },
            doseRenal: { valor: '125', unidade: 'mg', horario: '6/6h', via: 'VO', diluente: 'Solução oral / Cápsula', tempo: 'VO por 10 dias', obs: 'NÃO há absorção entérica relevante. Não requer ajuste de dose renal!' }
          },
          {
            id: 'metronidazol-vo',
            nome: 'Metronidazol (VO)',
            dosePadrao: { valor: '500', unidade: 'mg', horario: '8/8h', via: 'VO', diluente: 'Com água', tempo: 'VO por 10-14 dias' },
            doseRenal: { valor: '500', unidade: 'mg', horario: '12/12h', via: 'VO', diluente: 'Com água', tempo: 'VO', obs: 'Alternativa em casos leves a moderados. ClCr < 10: 500mg 12/12h.' }
          }
        ],
        observacoes: 'A Vancomicina endovenosa NÃO tem eficácia no lúmen intestinal para C. difficile.'
      }
    ]
  },
  '9': {
    title: 'Cardiovascular (Endocardite)',
    subtitle: 'Endocardite infecciosa em valva nativa e protética',
    patologias: [
      {
        id: 'cardio-valva-nativa',
        nome: 'Endocardite Infecciosa em Valva Nativa (Aguda/Subaguda)',
        subtipo: 'Valva Nativa',
        foco: 'S. aureus (MSSA/MRSA), Streptococcus viridans, Enterococcus faecalis',
        dosePadraoTexto: 'Ampicilina 2g EV 4/4h + Oxacilina 2g EV 4/4h + Gentamicina 1mg/kg EV 8/8h (OU Vancomicina 15-20mg/kg EV 12/12h).',
        doseAjusteRenalTexto: '[AJUSTAR DOSE CONFORME FUNÇÃO RENAL] (Ajuste obrigatório para Vancomicina, Ampicilina e Gentamicina)',
        antibioticosRecomendados: [
          {
            id: 'ampicilina-ei',
            nome: 'Ampicilina',
            dosePadrao: { valor: '2', unidade: 'g', horario: '4/4h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min' },
            doseRenal: { valor: '2', unidade: 'g', horario: '6/6h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min', obs: 'ClCr 10-50 mL/min: 2g 6/6h.' }
          },
          {
            id: 'oxacilina-ei',
            nome: 'Oxacilina',
            dosePadrao: { valor: '2', unidade: 'g', horario: '4/4h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min' },
            doseRenal: { valor: '1.5', unidade: 'g', horario: '6/6h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min', obs: 'Se ClCr < 10: 1g a 2g 6/6h.' }
          },
          {
            id: 'vancomicina-ei',
            nome: 'Vancomicina',
            dosePadrao: { valor: '25-30', unidade: 'mg/kg', horario: '12/12h', via: 'EV', diluente: '250 mL SF 0,9%', tempo: '60-120 min' },
            doseRenal: { valor: '15', unidade: 'mg/kg', horario: '24/24h', via: 'EV', diluente: '250 mL SF 0,9%', tempo: '60-120 min', obs: 'Alvo de vale sérico 15 a 20 mcg/mL.' }
          }
        ],
        observacoes: 'Coletar 3 conjuntos de hemoculturas de punções venosas separadas antes do primeiro frasco.'
      },
      {
        id: 'cardio-valva-protetica',
        nome: 'Endocardite em Valva Protética Recente (< 1 ano)',
        subtipo: 'Prótese Valvar',
        foco: 'Staphylococcus epidermidis resistente à oxacilina, S. aureus, bacilos Gram-negativos',
        dosePadraoTexto: 'Vancomicina 15-20mg/kg EV 12/12h + Gentamicina 1mg/kg EV 8/8h por 2 semanas + Rifampicina 300mg VO 8/8h.',
        doseAjusteRenalTexto: '[AJUSTAR DOSE CONFORME FUNÇÃO RENAL] (Ajustar Vancomicina e Gentamicina)',
        antibioticosRecomendados: [
          {
            id: 'vancomicina-ep',
            nome: 'Vancomicina',
            dosePadrao: { valor: '25-30', unidade: 'mg/kg', horario: '12/12h', via: 'EV', diluente: '250 mL SF 0,9%', tempo: '60-120 min' },
            doseRenal: { valor: '15', unidade: 'mg/kg', horario: '24/24h', via: 'EV', diluente: '250 mL SF 0,9%', tempo: '60-120 min', obs: 'Dose ajustada rigorosamente por ClCr.' }
          },
          {
            id: 'rifampicina-ep',
            nome: 'Rifampicina',
            dosePadrao: { valor: '300', unidade: 'mg', horario: '8/8h', via: 'VO', diluente: 'Com água', tempo: 'VO em jejum' },
            doseRenal: { valor: '300', unidade: 'mg', horario: '8/8h', via: 'VO', diluente: 'Com água', tempo: 'VO em jejum', obs: 'Ação em biofilme de prótese. Metabolismo predominantemente hepático.' }
          }
        ],
        observacoes: 'A rifampicina só deve ser iniciada após clearance da bacteremia (3 a 5 dias).'
      }
    ]
  },
  '10': {
    title: 'Ossos e Articulações (Osteoarticular)',
    subtitle: 'Artrite séptica aguda e osteomielite',
    patologias: [
      {
        id: 'osteo-artrite-septica',
        nome: 'Artrite Séptica Aguda de Articulação Nativa',
        subtipo: 'Emergência Reumatológica/Ortopédica',
        foco: 'S. aureus (MSSA/MRSA), Streptococcus spp., Neisseria gonorrhoeae (adulto jovem)',
        dosePadraoTexto: 'Oxacilina 2g EV 4/4h + Ceftriaxona 2g EV 24/24h (OU Vancomicina se risco de MRSA).',
        doseAjusteRenalTexto: '[AJUSTAR DOSE CONFORME FUNÇÃO RENAL] (Ajustar se Vancomicina indicada)',
        antibioticosRecomendados: [
          {
            id: 'oxacilina-art',
            nome: 'Oxacilina',
            dosePadrao: { valor: '2', unidade: 'g', horario: '4/4h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min' },
            doseRenal: { valor: '1.5', unidade: 'g', horario: '6/6h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min', obs: 'Manter dose plena exceto ClCr < 10.' }
          },
          {
            id: 'ceftriaxona-art',
            nome: 'Ceftriaxona',
            dosePadrao: { valor: '2', unidade: 'g', horario: '24/24h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min' },
            doseRenal: { valor: '2', unidade: 'g', horario: '24/24h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min', obs: 'Excelente penetração sinovial.' }
          },
          {
            id: 'vancomicina-art',
            nome: 'Vancomicina',
            dosePadrao: { valor: '25-30', unidade: 'mg/kg', horario: '12/12h', via: 'EV', diluente: '250 mL SF 0,9%', tempo: '60-120 min' },
            doseRenal: { valor: '15', unidade: 'mg/kg', horario: '24/24h', via: 'EV', diluente: '250 mL SF 0,9%', tempo: '60-120 min', obs: 'Indicada se risco de MRSA ou choque séptico.' }
          }
        ],
        observacoes: 'Artrocentese diagnóstica e descompressão articular cirúrgica urgente.'
      },
      {
        id: 'osteo-osteomielite',
        nome: 'Osteomielite Aguda / Crônica',
        subtipo: 'Infecção Óssea',
        foco: 'S. aureus, bacilos Gram-negativos (P. aeruginosa em usuários de drogas ou pés diabéticos)',
        dosePadraoTexto: 'Oxacilina 2g EV 4/4h OU Cefepime 2g EV 8/8h OU Ciprofloxacino 750mg VO 12/12h por 6 semanas.',
        doseAjusteRenalTexto: '[AJUSTAR DOSE CONFORME FUNÇÃO RENAL] (Ajustar Cefepime e Ciprofloxacino)',
        antibioticosRecomendados: [
          {
            id: 'oxacilina-ost',
            nome: 'Oxacilina',
            dosePadrao: { valor: '2', unidade: 'g', horario: '4/4h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min' },
            doseRenal: { valor: '1.5', unidade: 'g', horario: '6/6h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min', obs: 'Tratamento prolongado (4 a 6 semanas).' }
          },
          {
            id: 'cefepime-ost',
            nome: 'Cefepime',
            dosePadrao: { valor: '2', unidade: 'g', horario: '8/8h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: 'Infusão Estendida (3-4h)' },
            doseRenal: { valor: '2', unidade: 'g', horario: '12/12h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: 'Infusão Estendida (3-4h)', obs: 'ClCr 30-50: 2g 12/12h. ClCr 11-29: 1g 24/24h.' }
          },
          {
            id: 'ciprofloxacino-ost',
            nome: 'Ciprofloxacino (VO)',
            dosePadrao: { valor: '750', unidade: 'mg', horario: '12/12h', via: 'VO', diluente: 'Com água', tempo: 'VO' },
            doseRenal: { valor: '500', unidade: 'mg', horario: '24/24h', via: 'VO', diluente: 'Com água', tempo: 'VO', obs: 'Excelente biodisponibilidade óssea. ClCr < 30: 500mg 24/24h.' }
          }
        ],
        observacoes: 'Desbridamento cirúrgico do sequestro ósseo é fundamental para cura.'
      }
    ]
  },
  '11': {
    title: 'Cabeça, Pescoço e Otorrino',
    subtitle: 'Abscessos cervicais profundos, angina de Ludwig e mastoidite',
    patologias: [
      {
        id: 'otorrino-angina-ludwig',
        nome: 'Abscesso Periamigdaliano / Angina de Ludwig',
        subtipo: 'Risco de Via Aérea',
        foco: 'Flora mista anaeróbia oral, Streptococcus pyogenes, S. viridans',
        dosePadraoTexto: 'Ceftriaxona 2g EV 24/24h + Clindamicina 600mg EV 6/6h (OU Ampicilina-Sulbactam 3g EV 6/6h).',
        doseAjusteRenalTexto: '[AJUSTAR DOSE CONFORME FUNÇÃO RENAL] (Ajustar Ampicilina-Sulbactam se ClCr < 50)',
        antibioticosRecomendados: [
          {
            id: 'ceftriaxona-lud',
            nome: 'Ceftriaxona',
            dosePadrao: { valor: '2', unidade: 'g', horario: '24/24h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min' },
            doseRenal: { valor: '2', unidade: 'g', horario: '24/24h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min', obs: 'Dose plena 2g 24/24h.' }
          },
          {
            id: 'clindamicina-lud',
            nome: 'Clindamicina',
            dosePadrao: { valor: '600', unidade: 'mg', horario: '6/6h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min' },
            doseRenal: { valor: '600', unidade: 'mg', horario: '6/6h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min', obs: 'Excelente cobertura anaeróbia oral.' }
          }
        ],
        observacoes: 'Prioridade número 1: garantir via aérea (risco iminente de asfixia por edema cervical).'
      },
      {
        id: 'otorrino-mastoidite',
        nome: 'Mastoidite Aguda / Sinusite Complicada',
        subtipo: 'Otorrinolaringologia',
        foco: 'S. pneumoniae, Haemophilus influenzae, S. aureus, Pseudomonas',
        dosePadraoTexto: 'Ceftriaxona 2g EV 24/24h + Oxacilina 2g EV 4/4h (OU Cefepime 2g 8/8h se nosocomial).',
        doseAjusteRenalTexto: '[AJUSTAR DOSE CONFORME FUNÇÃO RENAL] (Ajuste obrigatório para Cefepime)',
        antibioticosRecomendados: [
          {
            id: 'ceftriaxona-mas',
            nome: 'Ceftriaxona',
            dosePadrao: { valor: '2', unidade: 'g', horario: '24/24h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min' },
            doseRenal: { valor: '2', unidade: 'g', horario: '24/24h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min', obs: 'Penetração óssea e em mucosa de ouvido médio/mastóide.' }
          },
          {
            id: 'oxacilina-mas',
            nome: 'Oxacilina',
            dosePadrao: { valor: '2', unidade: 'g', horario: '4/4h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min' },
            doseRenal: { valor: '1.5', unidade: 'g', horario: '6/6h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min', obs: 'Manter dose plena exceto ClCr < 10.' }
          }
        ],
        observacoes: 'Solicitar TC de ossos temporais e mastóides com urgência.'
      }
    ]
  },
  '12': {
    title: 'Ginecológico, Pélvico e ISTs',
    subtitle: 'Doença inflamatória pélvica grave e infecções gonocócicas',
    patologias: [
      {
        id: 'pelv-dip-grave',
        nome: 'Doença Inflamatória Pélvica (DIP) Grave / Hospitalar',
        subtipo: 'Internação / Cirúrgica',
        foco: 'Neisseria gonorrhoeae, Chlamydia trachomatis, Mycoplasma genitalium, anaeróbios e enterobactérias',
        dosePadraoTexto: 'Ceftriaxona 1g EV 24/24h + Doxiciclina 100mg VO 12/12h + Metronidazol 500mg EV 8/8h (14 dias).',
        doseAjusteRenalTexto: '[AJUSTAR DOSE CONFORME FUNÇÃO RENAL] (Ajustar Metronidazol se ClCr < 10)',
        antibioticosRecomendados: [
          {
            id: 'ceftriaxona-dip',
            nome: 'Ceftriaxona',
            dosePadrao: { valor: '1', unidade: 'g', horario: '24/24h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min' },
            doseRenal: { valor: '1', unidade: 'g', horario: '24/24h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min', obs: 'Dose plena mantida.' }
          },
          {
            id: 'doxiciclina-dip',
            nome: 'Doxiciclina',
            dosePadrao: { valor: '100', unidade: 'mg', horario: '12/12h', via: 'VO', diluente: 'Com água abundante', tempo: 'VO por 14 dias' },
            doseRenal: { valor: '100', unidade: 'mg', horario: '12/12h', via: 'VO', diluente: 'Com água abundante', tempo: 'VO por 14 dias', obs: 'Eliminação não renal. Sem ajuste na insuficiência renal.' }
          },
          {
            id: 'metronidazol-dip',
            nome: 'Metronidazol',
            dosePadrao: { valor: '500', unidade: 'mg', horario: '8/8h', via: 'EV', diluente: 'Bolsa 100 mL pronta', tempo: '30 min' },
            doseRenal: { valor: '500', unidade: 'mg', horario: '12/12h', via: 'EV', diluente: 'Bolsa 100 mL pronta', tempo: '30 min', obs: 'ClCr < 10 mL/min: estender para 12/12h.' }
          }
        ],
        observacoes: 'Se abscesso tubo-ovariano suspeito, manter cobertura estrita de anaeróbios.'
      },
      {
        id: 'pelv-uretrite-cervicite',
        nome: 'Uretrite / Cervicite Aguda Não Complicada',
        subtipo: 'Ambulatorial / Pronto-Atendimento',
        foco: 'Neisseria gonorrhoeae e Chlamydia trachomatis',
        dosePadraoTexto: 'Ceftriaxona 500mg IM dose única + Azitromicina 1g VO dose única.',
        doseAjusteRenalTexto: '[AJUSTAR DOSE CONFORME FUNÇÃO RENAL] (Dose única não requer ajuste)',
        antibioticosRecomendados: [
          {
            id: 'ceftriaxona-ure',
            nome: 'Ceftriaxona (IM)',
            dosePadrao: { valor: '500', unidade: 'mg', horario: 'Dose única', via: 'IM', diluente: 'Diluente com lidocaína 1%', tempo: 'IM glútea profunda' },
            doseRenal: { valor: '500', unidade: 'mg', horario: 'Dose única', via: 'IM', diluente: 'Diluente com lidocaína 1%', tempo: 'IM glútea profunda', obs: 'Dose única. Sem necessidade de ajuste.' }
          },
          {
            id: 'azitromicina-ure',
            nome: 'Azitromicina',
            dosePadrao: { valor: '1', unidade: 'g', horario: 'Dose única', via: 'VO', diluente: 'Com água', tempo: 'VO 1 hora antes da refeição' },
            doseRenal: { valor: '1', unidade: 'g', horario: 'Dose única', via: 'VO', diluente: 'Com água', tempo: 'VO', obs: 'Dose única de 1000mg. Eliminação biliar.' }
          }
        ],
        observacoes: 'Tratamento simultâneo do parceiro e abstinência sexual por 7 dias.'
      }
    ]
  },
  '13': {
    title: 'Neutropenia Febril e Imunossuprimidos',
    subtitle: 'Protocolo de sepse e febre em neutropênicos pós-quimioterapia',
    patologias: [
      {
        id: 'neutro-alto-risco',
        nome: 'Neutropenia Febril de Alto Risco (Neutrófilos < 500/mm³)',
        subtipo: 'Emergência Onco-Hematológica',
        foco: 'Pseudomonas aeruginosa, bacilos entéricos Gram-negativos, bacteremia fulminante',
        dosePadraoTexto: 'Cefepime 2g EV 8/8h (OU Piperacilina/Tazobactam 4,5g 6/6h) + Vancomicina se choque ou infecção de cateter.',
        doseAjusteRenalTexto: '[AJUSTAR DOSE CONFORME FUNÇÃO RENAL] (Ajuste obrigatório para Cefepime, Pip-Tazo e Vancomicina)',
        antibioticosRecomendados: [
          {
            id: 'cefepime-neutro',
            nome: 'Cefepime',
            dosePadrao: { valor: '2', unidade: 'g', horario: '8/8h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: 'Infusão Estendida (3-4h)' },
            doseRenal: { valor: '2', unidade: 'g', horario: '12/12h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: 'Infusão Estendida (3-4h)', obs: 'ClCr 30-50: 2g 12/12h. ClCr 11-29: 1g 24/24h. Risco de neurotoxicidade.' }
          },
          {
            id: 'pip-tazo-neutro',
            nome: 'Piperacilina + Tazobactam',
            dosePadrao: { valor: '4.5', unidade: 'g', horario: '6/6h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: 'Infusão Estendida (4h)' },
            doseRenal: { valor: '3.375', unidade: 'g', horario: '6/6h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: 'Infusão Estendida (4h)', obs: 'ClCr 20-50: 3,375g 6/6h. ClCr < 20: 2,25g 8/8h.' }
          },
          {
            id: 'vancomicina-neutro',
            nome: 'Vancomicina',
            dosePadrao: { valor: '25-30', unidade: 'mg/kg', horario: '12/12h', via: 'EV', diluente: '250 mL SF 0,9%', tempo: '60-120 min' },
            doseRenal: { valor: '15', unidade: 'mg/kg', horario: '24/24h', via: 'EV', diluente: '250 mL SF 0,9%', tempo: '60-120 min', obs: 'Ataque integral. Manutenção ajustada rigorosamente ao ClCr.' }
          }
        ],
        observacoes: 'Iniciar em até 30-60 minutos do pico febril. Coletar hemoculturas pareadas imediatamente.'
      }
    ]
  },
  '14': {
    title: 'Infecções Fúngicas Invasivas',
    subtitle: 'Candidemia e candidíase invasiva em pacientes críticos em UTI',
    patologias: [
      {
        id: 'fungo-candidemia',
        nome: 'Candidemia / Candidíase Invasiva em CTI',
        subtipo: 'CTI / Terapia Intensiva',
        foco: 'Candida albicans, Candida glabrata, Candida tropicalis, Candida parapsilosis',
        dosePadraoTexto: 'Anidulafungina 200mg EV (ataque) depois 100mg 24/24h OU Fluconazol 800mg EV (ataque) depois 400mg 24/24h.',
        doseAjusteRenalTexto: '[AJUSTAR DOSE CONFORME FUNÇÃO RENAL] (Anidulafungina sem ajuste; Fluconazol reduzir 50% se ClCr < 50)',
        antibioticosRecomendados: [
          {
            id: 'anidulafungina-cand',
            nome: 'Anidulafungina',
            dosePadrao: { valor: '200 depois 100', unidade: 'mg', horario: '24/24h', via: 'EV', diluente: '250 mL SF 0,9%', tempo: '90-120 min' },
            doseRenal: { valor: '200 depois 100', unidade: 'mg', horario: '24/24h', via: 'EV', diluente: '250 mL SF 0,9%', tempo: '90-120 min', obs: 'Degradação química espontânea. Sem necessidade de ajuste para insuficiência renal ou diálise.' }
          },
          {
            id: 'fluconazol-cand',
            nome: 'Fluconazol',
            dosePadrao: { valor: '800 depois 400', unidade: 'mg', horario: '24/24h', via: 'EV', diluente: 'Frasco pronto 200 mL', tempo: '60-120 min' },
            doseRenal: { valor: '400 depois 200', unidade: 'mg', horario: '24/24h', via: 'EV', diluente: 'Frasco pronto 200 mL', tempo: '60-120 min', obs: 'Dose de ataque 800mg plena mantida. Manutenção reduzida em 50% se ClCr ≤ 50 mL/min.' }
          }
        ],
        observacoes: 'Retirar cateter venoso central e realizar fundoscopia para rastreio de endoftalmite.'
      }
    ]
  },
  '15': {
    title: 'Profilaxia Cirúrgica Antimicrobiana',
    subtitle: 'Prevenção de infecção de sítio cirúrgico (ISC) em bloco cirúrgico',
    patologias: [
      {
        id: 'prof-cirurgia-geral',
        nome: 'Profilaxia em Cirurgia Limpa com Implante / Cirurgia Geral',
        subtipo: 'Bloco Cirúrgico',
        foco: 'Staphylococcus aureus, Streptococcus, Staphylococcus coagulase negativa',
        dosePadraoTexto: 'Cefazolina 2g EV (3g se peso > 120 kg) 30 a 60 min antes da incisão da pele.',
        doseAjusteRenalTexto: '[AJUSTAR DOSE CONFORME FUNÇÃO RENAL] (Dose profilática pré-operatória única de 2g mantida)',
        antibioticosRecomendados: [
          {
            id: 'cefazolina-prof',
            nome: 'Cefazolina',
            dosePadrao: { valor: '2', unidade: 'g', horario: 'Dose única pré-incisão', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min (30-60 min pré-incisão)' },
            doseRenal: { valor: '2', unidade: 'g', horario: 'Dose única pré-incisão', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min', obs: 'Dose única de indução não requer redução. Repicar a cada 4 horas se cirurgia estendida.' }
          }
        ],
        observacoes: 'Suspender a profilaxia cirúrgica em até 24 horas após o término do procedimento cirúrgico.'
      }
    ]
  }
};
