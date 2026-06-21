/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PropertyType = 'casa' | 'apartamento' | 'terreno' | 'sala_comercial' | 'predio_comercial';
export type BuildStandard = 'popular' | 'medio' | 'alto' | 'luxo';
export type ConservationState = 'ruim' | 'regular' | 'bom' | 'otimo';

export interface PropertyData {
  tipo: PropertyType;
  estado: string;
  cidade: string;
  bairro: string;
  endereco: string;
  areaPrivativa: number;
  areaTerreno: number;
  quartos: number;
  suites: number;
  banheiros: number;
  vagas: number;
  idade: number; // anos
  padrao: BuildStandard;
  conservacao: ConservationState;
  
  // Apartamento-specific or specific features
  andar: number;
  temElevador: boolean;
  temCondominio: boolean;
  taxaCondominio: number;
  temLazer: boolean;
  temSeguranca: boolean;
  temInfraestrutura: boolean; // asfalto, saneamento, etc.

  // Simulação de renda e crédito
  rendaFamiliar: number;
  possuiOutroFinanciamento: boolean;
  valorDesejadoFinanciamento: number;
}

export interface ComparableProperty {
  id: string;
  bairro: string;
  valor: number;
  area: number;
  padrao: BuildStandard;
  conservacao: ConservationState;
  distancia: number; // km aproximada
  valorM2: number;
}

export interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  obrigatorio: boolean;
  descricao: string;
}

export interface ChecklistDocumental {
  vendedor: ChecklistItem[];
  comprador: ChecklistItem[];
  imovel: ChecklistItem[];
}

export interface SimulationResult {
  valorM2Estimado: number;
  valorM2MedioSemAjuste: number;
  valorEstimadoImovel: number;
  faixaConservadora: number; // -10% NBR-like margin
  faixaOtimista: number; // +10%
  faixaMedia: number; // Central
  grauConfianca: 'Baixo' | 'Médio' | 'Alto';
  confiancaMotivo: string;

  // Parâmetros bancários
  segurancaBancaria: number; // % (ex: 80% ou 75% baseado no risco e conservação)
  valorProvavelAvaliacaoBanco: number; // valor técnico avaliado para fins de garantia
  valorMaximoFinanciador: number; // Limite de 80% do valor avaliado ou limite pelo teto de renda
  parcelaMaximaPermitida: number; // 30% da renda bruta familiar
  parcelaEstimadaInicial: number; // Estimativa de parcela inicial (ex: usando tabela Sac a 10.5% a.a.)
  entradaMinimaNecessaria: number; // DIFERENÇA entre valor do imóvel e o financiado máximo
  enquadramentoSistemas: {
    sfh: boolean; // Sistema Financeiro da Habitação (até R$ 1.5 milhão)
    sfi: boolean; // Sistema de Financiamento Imobiliário (acima ou comercial)
    mcmv: boolean; // Minha Casa Minha Vida (até limite regional e padrão)
    detalhesMcmv: string;
  };
  
  // Recomendações e Riscos
  recomendacaoFinanciamento: 'aprovado' | 'aprovado_ressalvas' | 'risco_alto';
  motivoRecomendacao: string;
  pontosPositivos: string[];
  pontosRisco: string[];
  liquidezEstimada: 'Baixa' | 'Média' | 'Alta';
}
