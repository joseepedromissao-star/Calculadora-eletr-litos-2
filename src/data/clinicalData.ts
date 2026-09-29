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
    description: 'Taxa de Filtração Glomerular (Cockcroft-Gault / Schwartz pediátrico) com patologias infecciosas e antibióticos referenciados com ajuste renal.',
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
            dosePadrao: { valor: '20', unidade: 'mg/kg', horario: '24/24h', via: 'VO', diluente: 'Puro / Suspensão oral', tempo: 'VO por 3 dias' },
            doseRenal: { valor: '20', unidade: 'mg/kg', horario: '24/24h', via: 'VO', diluente: 'Puro / Suspensão oral', tempo: 'VO por 3 dias', obs: 'Eliminação hepática/biliar. Não requer ajuste renal.' }
          }
        ],
        observacoes: 'Irrigação ocular abundante com SF 0,9%. Tratar mãe e parceiro.'
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
            doseRenal: { valor: '1', unidade: 'g', horario: '24/24h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min', obs: 'Se ClCr < 10 mL/min com disfunção hepática associada, reduzir para 1g.' }
          },
          {
            id: 'clindamicina-cel',
            nome: 'Clindamicina',
            dosePadrao: { valor: '600', unidade: 'mg', horario: '6/6h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min' },
            doseRenal: { valor: '600', unidade: 'mg', horario: '6/6h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min', obs: 'Metabolismo hepático predominante. Dose habitual mantida.' }
          }
        ],
        observacoes: 'Emergência oftalmológica com risco de trombose do seio cavernoso. Solicitar TC de órbitas.'
      }
    ]
  },
  '2': {
    title: 'Pele e Partes Moles',
    subtitle: 'Celulite não complicada e infecções complexas em extremidades',
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
            doseRenal: { valor: '1.5', unidade: 'g', horario: '6/6h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min', obs: 'Se ClCr ≤ 10 mL/min: 1g a 2g 6/6h (máx 12g/dia).' }
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
            doseRenal: { valor: '2', unidade: 'g', horario: '24/24h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min', obs: 'Dose plena mantida exceto na falência hepatorrenal extrema.' }
          },
          {
            id: 'metronidazol-pe',
            nome: 'Metronidazol',
            dosePadrao: { valor: '500', unidade: 'mg', horario: '8/8h', via: 'EV', diluente: 'Bolsa 100 mL pronta', tempo: '30 min' },
            doseRenal: { valor: '500', unidade: 'mg', horario: '12/12h', via: 'EV', diluente: 'Bolsa 100 mL pronta', tempo: '30 min', obs: 'ClCr < 10 mL/min: reduzir frequência para 12/12h.' }
          }
        ],
        observacoes: 'Desbridamento de tecidos necróticos e alívio de carga plantar são obrigatórios.'
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
            doseRenal: { valor: '15', unidade: 'mg/kg', horario: '24/24h', via: 'EV', diluente: '250 mL SF 0,9%', tempo: '60-120 min', obs: 'Dose de ataque 25-30 mg/kg não reduzida. Manutenção ClCr 30-50: 15 mg/kg 24/24h.' }
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
            doseRenal: { valor: '2', unidade: 'g', horario: '24/24h', via: 'EV', diluente: '100 mL SF 0,9%', tempo: '30 min', obs: 'Dose plena 2g 24/24h.' }
          },
          {
            id: 'azitromicina-pac',
            nome: 'Azitromicina',
            dosePadrao: { valor: '500', unidade: 'mg', horario: '24/24h', via: 'EV', diluente: '250 mL SF 0,9%', tempo: '60 min' },
            doseRenal: { valor: '500', unidade: 'mg', horario: '24/24h', via: 'EV', diluente: '250 mL SF 0,9%', tempo: '60 min', obs: 'Eliminação biliar. Sem ajuste renal.' }
          }
        ],
        observacoes: 'Avaliar transição para VO assim que o paciente mantiver estabilidade hemodinâmica e afebril > 48h.'
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
  }
};
