import { CalculatorMeta, InfectionTopography, AntimicrobialScheme } from '../types';

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
    description: 'Taxa de Filtração Glomerular (Cockcroft-Gault / Schwartz pediátrico) com condutas empíricas por topografia e ajustes para ClCr < 50 mL/min.',
    badge: 'TFG / Cockcroft / Schwartz'
  },
];

export const TOPOGRAPHY_MAP: Record<InfectionTopography, { title: string; subtitle: string; icon: string; schemes: AntimicrobialScheme[] }> = {
  '1': {
    title: 'Olhos',
    subtitle: 'Infecções oculares e periorbitárias graves',
    icon: 'Eye',
    schemes: [
      {
        id: 'olhos-conjuntivite',
        nome: 'Conjuntivite Neonatal',
        foco: 'Neisseria gonorrhoeae / Chlamydia trachomatis em neonatos',
        dosePadrao: 'Ceftriaxona 25-50 mg/kg EV dose única (máx: 125 mg) + Azitromicina 20 mg/kg/dia VO 24/24h por 3 dias.',
        doseAjusteRenal: '[AJUSTAR DOSE CONFORME FUNÇÃO RENAL] (Fármacos: Ceftriaxona + Azitromicina)',
        farmacos: ['Ceftriaxona', 'Azitromicina'],
        observacoes: 'Irrigação ocular contínua com SF 0,9%. Avaliar também tratamento materno e do parceiro.',
        detalhesAjuste: [
          {
            farmaco: 'Ceftriaxona',
            clcrFaixas: [
              { faixa: 'ClCr ≥ 10 mL/min', dose: 'Dose habitual (eliminação biliar compensatória)' },
              { faixa: 'ClCr < 10 mL/min', dose: 'Máximo 2g/dia (reduzir se coexistir disfunção hepática)' },
            ]
          },
          {
            farmaco: 'Azitromicina',
            clcrFaixas: [
              { faixa: 'Qualquer ClCr', dose: 'Não requer ajuste de dose habitual' }
            ]
          }
        ]
      },
      {
        id: 'olhos-celulite',
        nome: 'Celulite Orbital (Pós-septal)',
        foco: 'S. aureus (incluindo MRSA comunitário), Streptococcus spp., anaeróbios',
        dosePadrao: 'Ceftriaxona 2g EV 1x/dia + Clindamicina 600mg EV 6/6h.',
        doseAjusteRenal: '[AJUSTAR DOSE CONFORME FUNÇÃO RENAL] (Fármacos: Ceftriaxona + Clindamicina)',
        farmacos: ['Ceftriaxona', 'Clindamicina'],
        observacoes: 'Emergência oftalmológica. Solicitar TC de órbitas e seios da face urgente. Risco de trombose de seio cavernoso.',
        detalhesAjuste: [
          {
            farmaco: 'Ceftriaxona',
            clcrFaixas: [
              { faixa: 'ClCr ≥ 10 mL/min', dose: '2g EV 24/24h (Dose plena)' },
              { faixa: 'ClCr < 10 mL/min', dose: '1g a 2g EV 24/24h (monitorar toxicidade)' }
            ]
          },
          {
            farmaco: 'Clindamicina',
            clcrFaixas: [
              { faixa: 'Qualquer ClCr', dose: 'Metabolismo predominantemente hepático. Não necessita ajuste renal direto.' }
            ]
          }
        ]
      }
    ]
  },
  '2': {
    title: 'Pele e Partes Moles',
    subtitle: 'Celulite não complicada e infecções complexas em extremidades',
    icon: 'Layers',
    schemes: [
      {
        id: 'pele-celulite',
        nome: 'Celulite e Erisipela',
        foco: 'Streptococcus pyogenes e S. aureus sensível (MSSA)',
        dosePadrao: 'Oxacilina 2g EV 4/4h; OU Cefalotina 1g EV 6/6h; OU Cefalexina 500mg 2cp (1g) VO 6/6h.',
        doseAjusteRenal: '[AJUSTAR DOSE CONFORME FUNÇÃO RENAL] (Fármacos: Oxacilina ou Cefalotina)',
        farmacos: ['Oxacilina', 'Cefalotina', 'Cefalexina'],
        observacoes: 'Demarcar a borda do eritema com caneta dérmica para avaliar evolução clínica em 24-48h.',
        detalhesAjuste: [
          {
            farmaco: 'Oxacilina',
            clcrFaixas: [
              { faixa: 'ClCr > 10 mL/min', dose: '2g EV 4/4h (eliminação mista)' },
              { faixa: 'ClCr ≤ 10 mL/min', dose: '1g a 2g EV 4/4h a 6/6h (máximo 12g/dia)' }
            ]
          },
          {
            farmaco: 'Cefalotina',
            clcrFaixas: [
              { faixa: 'ClCr 50-80 mL/min', dose: '1g EV 6/6h' },
              { faixa: 'ClCr 10-50 mL/min', dose: '500mg a 1g EV 8/8h a 12/12h' },
              { faixa: 'ClCr < 10 mL/min', dose: '500mg EV 12/12h a 24/24h' }
            ]
          },
          {
            farmaco: 'Cefalexina (VO)',
            clcrFaixas: [
              { faixa: 'ClCr 10-50 mL/min', dose: '500mg VO 8/8h a 12/12h' },
              { faixa: 'ClCr < 10 mL/min', dose: '250mg a 500mg VO 12/12h a 24/24h' }
            ]
          }
        ]
      },
      {
        id: 'pele-pe-diabetico',
        nome: 'Pé Diabético Moderado (Polimicrobiano)',
        foco: 'Gram-positivos, bacilos Gram-negativos e anaeróbios',
        dosePadrao: 'Amoxicilina-Clavulanato 500/125mg VO 8/8h OU Ceftriaxone 2g EV 24/24h + Metronidazol 500mg EV 8/8h (21-28 dias).',
        doseAjusteRenal: '[AJUSTAR DOSE CONFORME FUNÇÃO RENAL] (Fármacos: Amoxicilina-Clavulanato ou Ceftriaxone + Metronidazol)',
        farmacos: ['Amoxicilina-Clavulanato', 'Ceftriaxona', 'Metronidazol'],
        observacoes: 'Desbridamento mecânico e alívio de pressão (offloading) são fundamentais.',
        detalhesAjuste: [
          {
            farmaco: 'Amoxicilina + Clavulanato (VO)',
            clcrFaixas: [
              { faixa: 'ClCr 10-30 mL/min', dose: '500/125mg VO 12/12h (evitar formulação 875mg)' },
              { faixa: 'ClCr < 10 mL/min', dose: '500/125mg VO 24/24h' },
              { faixa: 'Hemodiálise', dose: '500/125mg após sessão + 500/125mg 24/24h' }
            ]
          },
          {
            farmaco: 'Metronidazol',
            clcrFaixas: [
              { faixa: 'ClCr ≥ 10 mL/min', dose: '500mg EV 8/8h' },
              { faixa: 'ClCr < 10 mL/min', dose: '250mg a 500mg EV 12/12h (acúmulo de metabólitos ativos)' }
            ]
          }
        ]
      }
    ]
  },
  '3': {
    title: 'Infecção em Queimados',
    subtitle: 'Protocolos de sepse precoce vs tardia em grandes queimados',
    icon: 'Flame',
    schemes: [
      {
        id: 'queimados-sepse-precoce',
        nome: 'Sepse Precoce SEM Infecção no Local (< 72 horas)',
        foco: 'Colonização inicial por flora endógena cutânea (S. aureus, Streptococcus)',
        dosePadrao: 'Ceftriaxone 2g EV 24/24h + Oxacilina 2g EV 4/4h.',
        doseAjusteRenal: '[AJUSTAR DOSE CONFORME FUNÇÃO RENAL] (Fármacos: Ceftriaxone + Oxacilina)',
        farmacos: ['Ceftriaxona', 'Oxacilina'],
        observacoes: 'Queimados apresentam hiperfiltração nas primeiras 48-72h seguida de risco de LRA por rabdomiólise e hipovolemia. Monitorar diurese horária.',
        detalhesAjuste: [
          {
            farmaco: 'Oxacilina',
            clcrFaixas: [
              { faixa: 'ClCr > 10 mL/min', dose: '2g EV 4/4h' },
              { faixa: 'ClCr ≤ 10 mL/min', dose: '1g a 2g EV 4/4h a 6/6h' }
            ]
          }
        ]
      },
      {
        id: 'queimados-sepse-tardia',
        nome: 'Sepse Tardia SEM Infecção no Local (> 72 horas)',
        foco: 'Patógenos nosocomiais multirresistentes (Pseudomonas aeruginosa, Acinetobacter, MRSA)',
        dosePadrao: 'Piperacilina/Tazobactam 4,5g EV 6/6h (ou infusão estendida em 4h) + Vancomicina 15-20 mg/kg EV 12/12h (com ataque de 25-30 mg/kg).',
        doseAjusteRenal: '[AJUSTAR DOSE CONFORME FUNÇÃO RENAL] (Fármacos: Piperacilina/Tazobactam + Vancomicina)',
        farmacos: ['Piperacilina/Tazobactam', 'Vancomicina'],
        observacoes: 'Ajuste de dose de Vancomicina estritamente guiado por clearance e vancocinemia (alvo AUC/MIC 400-600 ou vale 15-20 mcg/mL).',
        detalhesAjuste: [
          {
            farmaco: 'Piperacilina + Tazobactam',
            clcrFaixas: [
              { faixa: 'ClCr > 50 mL/min', dose: '4,5g EV 6/6h (infusão estendida em 4 horas)' },
              { faixa: 'ClCr 20-50 mL/min', dose: '3,375g EV 6/6h OU 2,25g EV 6/6h' },
              { faixa: 'ClCr < 20 mL/min', dose: '2,25g EV 8/8h' },
              { faixa: 'Hemodiálise', dose: '2,25g EV 12/12h + dose suplementar de 0,75g pós-diálise' }
            ]
          },
          {
            farmaco: 'Vancomicina',
            clcrFaixas: [
              { faixa: 'ClCr > 50 mL/min', dose: 'Manter dose plena de manutenção conforme peso e monitorar vale' },
              { faixa: 'ClCr 30-49 mL/min', dose: '15 mg/kg a cada 24 horas' },
              { faixa: 'ClCr 10-29 mL/min', dose: '15 mg/kg a cada 48 horas' },
              { faixa: 'ClCr < 10 mL/min / HD', dose: 'Dose de ataque 25 mg/kg e redosar apenas quando nível < 15-20 mcg/mL' }
            ]
          }
        ]
      }
    ]
  },
  '4': {
    title: 'Trato Respiratório',
    subtitle: 'Pneumonia adquirida na comunidade e intra-hospitalar',
    icon: 'Stethoscope',
    schemes: [
      {
        id: 'resp-sem-pseudomonas',
        nome: 'Pneumonia Adulto SEM Risco para Pseudomonas',
        foco: 'Streptococcus pneumoniae, Haemophilus influenzae, atípicos',
        dosePadrao: 'Ceftriaxona 2g EV 24/24h + Azitromicina 500mg EV 24/24h por 7-10 dias.',
        doseAjusteRenal: '[AJUSTAR DOSE CONFORME FUNÇÃO RENAL] (Fármacos: Ceftriaxona + Azitromicina)',
        farmacos: ['Ceftriaxona', 'Azitromicina'],
        observacoes: 'Trocar para via oral assim que paciente apresentar estabilidade clínica (afebril > 48h e tolerando VO).',
        detalhesAjuste: [
          {
            farmaco: 'Ceftriaxona',
            clcrFaixas: [
              { faixa: 'ClCr ≥ 10 mL/min', dose: '2g EV 24/24h' },
              { faixa: 'ClCr < 10 mL/min', dose: '1g a 2g EV 24/24h' }
            ]
          }
        ]
      },
      {
        id: 'resp-com-pseudomonas',
        nome: 'Pneumonia Adulto COM Risco para Pseudomonas (Sem ATB Prévio)',
        foco: 'Pseudomonas aeruginosa, enterobactérias produtoras de AmpC',
        dosePadrao: 'Ceftazidima 2g EV 8/8h (infusão estendida de 3h preferível).',
        doseAjusteRenal: '[AJUSTAR DOSE CONFORME FUNÇÃO RENAL] (Fármaco: Ceftazidima)',
        farmacos: ['Ceftazidima'],
        observacoes: 'Fatores de risco para Pseudomonas: bronquiectasias, DPOC grave, corticoterapia prévia, internação recente com uso de ATB.',
        detalhesAjuste: [
          {
            farmaco: 'Ceftazidima',
            clcrFaixas: [
              { faixa: 'ClCr > 50 mL/min', dose: '2g EV 8/8h' },
              { faixa: 'ClCr 31-50 mL/min', dose: '1g EV 8/8h ou 2g EV 12/12h' },
              { faixa: 'ClCr 16-30 mL/min', dose: '1g EV 12/12h' },
              { faixa: 'ClCr 6-15 mL/min', dose: '500mg EV 24/24h' },
              { faixa: 'ClCr < 6 mL/min / HD', dose: '500mg EV 48/48h ou após cada sessão de hemodiálise' }
            ]
          }
        ]
      }
    ]
  },
  '5': {
    title: 'Sepse e Choque Séptico',
    subtitle: 'Protocolo de Ressuscitação da 1ª Hora ("Hour-1 Bundle")',
    icon: 'ShieldAlert',
    schemes: [
      {
        id: 'sepse-pulmonar',
        nome: 'Sepse com Foco Pulmonar (Comunitário)',
        foco: 'Streptococcus pneumoniae, Legionella, Bacilos Gram-negativos',
        dosePadrao: 'Ceftriaxone 2g EV 24/24h + Macrolídeo EV (Azitromicina 500mg EV 24/24h ou Claritromicina 500mg EV 12/12h).',
        doseAjusteRenal: '[AJUSTAR DOSE CONFORME FUNÇÃO RENAL] (Fármacos: Ceftriaxone + Macrolídeo)',
        farmacos: ['Ceftriaxona', 'Azitromicina'],
        observacoes: 'A 1ª dose de antibiótico deve ser administrada em dose PLENA mesmo se disfunção renal presente, iniciando ajuste a partir da 2ª dose.',
        detalhesAjuste: [
          {
            farmaco: 'Ceftriaxona',
            clcrFaixas: [
              { faixa: '1ª Dose (Ataque)', dose: '2g EV imediato (NÃO REDUZIR DOSE DE ATAQUE NA SEPSE)' },
              { faixa: 'ClCr < 10 mL/min (Manutenção)', dose: '1g a 2g EV a cada 24 horas' }
            ]
          }
        ]
      },
      {
        id: 'sepse-abdominal',
        nome: 'Sepse com Foco Abdominal (Comunitário)',
        foco: 'Enterobacteriaceae (E. coli, Klebsiella), Enterococcus e anaeróbios (B. fragilis)',
        dosePadrao: 'Ceftriaxone 2g EV 24/24h + Metronidazol 500mg EV 8/8h.',
        doseAjusteRenal: '[AJUSTAR DOSE CONFORME FUNÇÃO RENAL] (Fármacos: Ceftriaxone + Metronidazol)',
        farmacos: ['Ceftriaxona', 'Metronidazol'],
        observacoes: 'Controle de foco cirúrgico urgente é indispensável para sucesso do tratamento na sepse abdominal.',
        detalhesAjuste: [
          {
            farmaco: 'Metronidazol',
            clcrFaixas: [
              { faixa: 'ClCr ≥ 10 mL/min', dose: '500mg EV 8/8h' },
              { faixa: 'ClCr < 10 mL/min', dose: '500mg EV 12/12h (reduzir frequência em 50%)' }
            ]
          }
        ]
      },
      {
        id: 'sepse-corrente-sanguinea',
        nome: 'Sepse com Foco em Corrente Sanguínea (Cateter)',
        foco: 'Staphylococcus aureus (incluindo MRSA), S. epidermidis, Pseudomonas, BGN multirresistentes',
        dosePadrao: 'Retirar o dispositivo imediatamente e iniciar Vancomicina 30mg/kg EV (dose de ataque) + Cefepime 2g EV 8/8h.',
        doseAjusteRenal: '[AJUSTAR DOSE CONFORME FUNÇÃO RENAL] (Fármacos: Vancomicina + Cefepime)',
        farmacos: ['Vancomicina', 'Cefepime'],
        observacoes: 'Coletar 2 pares de hemoculturas (periférica + cateter antes de retirar se possível). Dose de ataque de Vancomicina não deve ser reduzida na sepse.',
        detalhesAjuste: [
          {
            farmaco: 'Cefepime',
            clcrFaixas: [
              { faixa: 'ClCr > 50 mL/min', dose: '2g EV 8/8h (infusão estendida em 3-4h)' },
              { faixa: 'ClCr 30-50 mL/min', dose: '2g EV 12/12h' },
              { faixa: 'ClCr 11-29 mL/min', dose: '1g a 2g EV 24/24h' },
              { faixa: 'ClCr ≤ 10 mL/min', dose: '500mg a 1g EV 24/24h' },
              { faixa: 'Hemodiálise', dose: '1g no dia 1, depois 500mg/dia + dose extra pós-diálise (risco de neurotoxicidade se não ajustado)' }
            ]
          },
          {
            farmaco: 'Vancomicina',
            clcrFaixas: [
              { faixa: 'Dose de Ataque', dose: '25-30 mg/kg EV (máx: 3000mg) - dose integral obrigatória' },
              { faixa: 'ClCr 30-50 mL/min', dose: '15 mg/kg EV 24/24h' },
              { faixa: 'ClCr < 30 mL/min', dose: '15 mg/kg EV 48/48h ou dosagem sérica guiada' }
            ]
          }
        ]
      }
    ]
  }
};
