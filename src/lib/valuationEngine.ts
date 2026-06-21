/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PropertyData, ComparableProperty, SimulationResult, BuildStandard, ConservationState } from '../types';

// Escores para o padrão construtivo
const STANDARD_SCORES: Record<BuildStandard, number> = {
  popular: 1.0,
  medio: 1.4,
  alto: 1.9,
  luxo: 2.6
};

// Escores para conservação
const CONSERVATION_SCORES: Record<ConservationState, number> = {
  ruim: 0.65,
  regular: 0.85,
  bom: 1.0,
  otimo: 1.15
};

export interface AdjustedComparable extends ComparableProperty {
  originalM2: number;
  fPadrao: number;
  fConservacao: number;
  fDistancia: number;
  fArea: number;
  valorM2Ajustado: number;
}

export function calculateValuation(
  subject: PropertyData,
  comparables: ComparableProperty[],
  missingMandatoryDocsCount: number,
  missingMandatoryPhysicalsCount: number,
  hasNoHabitese: boolean
): { result: SimulationResult; adjustedComparables: AdjustedComparable[] } {
  
  const userArea = subject.areaPrivativa || 1;
  const subjectStandardScore = STANDARD_SCORES[subject.padrao];
  const subjectConservationScore = CONSERVATION_SCORES[subject.conservacao];

  // Processamento e ajuste de cada amostra (comparável)
  const adjustedComparables: AdjustedComparable[] = comparables.map((comp) => {
    const originalM2 = comp.valor / comp.area;
    
    // 1. Fator Padrão Construtivo
    const compStandardScore = STANDARD_SCORES[comp.padrao];
    const fPadrao = subjectStandardScore / compStandardScore;

    // 2. Fator Conservação
    const compConservationScore = CONSERVATION_SCORES[comp.conservacao];
    const fConservacao = subjectConservationScore / compConservationScore;

    // 3. Fator Distância (fórmula de retração de valor pela distância geocodificada estimada)
    // Coeficiente atenuador baseado em KM
    const fDistancia = Math.max(1.0 - (comp.distancia * 0.04), 0.80);

    // 4. Fator de Escala (Área) - Imóveis maiores costumam ter valor unitário por m² levemente menor
    // Coeficiente expoente econômico de -0.15 de escala
    const fArea = Math.pow(comp.area / userArea, -0.12);

    // Valor unitário final ajustado
    const valorM2Ajustado = originalM2 * fPadrao * fConservacao * fDistancia * fArea;

    return {
      ...comp,
      originalM2,
      fPadrao,
      fConservacao,
      fDistancia,
      fArea,
      valorM2Ajustado: Math.round(valorM2Ajustado * 100) / 100
    };
  });

  // Cálculos Estatísticos
  const comparablesCount = adjustedComparables.length;
  let valorM2Estimado = 0;
  let valorM2MedioSemAjuste = 0;

  if (comparablesCount > 0) {
    const somaAjustado = adjustedComparables.reduce((acc, c) => acc + c.valorM2Ajustado, 0);
    const somaOriginal = adjustedComparables.reduce((acc, c) => acc + (c.valor / c.area), 0);
    valorM2Estimado = somaAjustado / comparablesCount;
    valorM2MedioSemAjuste = somaOriginal / comparablesCount;
  } else {
    // Fallback razoável caso não haja comparáveis (ex: valores médios brasileiros estimados por padrão)
    const baseM2 = subject.padrao === 'luxo' ? 12000 : subject.padrao === 'alto' ? 8500 : subject.padrao === 'medio' ? 5500 : 3500;
    valorM2Estimado = baseM2 * CONSERVATION_SCORES[subject.conservacao];
    valorM2MedioSemAjuste = baseM2;
  }

  // Coeficiente de Variação (Desvio Padrão / Média)
  let coefVariacao = 0;
  if (comparablesCount > 1) {
    const variancia = adjustedComparables.reduce((acc, c) => acc + Math.pow(c.valorM2Ajustado - valorM2Estimado, 2), 0) / (comparablesCount - 1);
    const desvioPadrao = Math.sqrt(variancia);
    coefVariacao = desvioPadrao / valorM2Estimado;
  }

  // Avaliação do Grau de Confiança (NBR 14653 simplificado para fins educativos)
  let grauConfianca: 'Baixo' | 'Médio' | 'Alto' = 'Médio';
  let confiancaMotivo = '';

  if (comparablesCount < 3) {
    grauConfianca = 'Baixo';
    confiancaMotivo = 'Número insuficiente de dados comparáveis cadastrados (mínimo recomendado: 3).';
  } else if (coefVariacao > 0.22) {
    grauConfianca = 'Baixo';
    confiancaMotivo = 'Dispersão excessiva dos valores ajustados dos imóveis comparáveis (sinaliza amostra heterogênea).';
  } else if (comparablesCount >= 5 && coefVariacao <= 0.12) {
    grauConfianca = 'Alto';
    confiancaMotivo = 'Amostra robusta (5+ comparáveis) e com baixa dispersão estatística.';
  } else {
    grauConfianca = 'Médio';
    confiancaMotivo = 'Quantidade adequada de comparáveis e dispersão dentro dos padrões aceitáveis.';
  }

  // Valor Total Estimado
  const valorEstimadoImovel = Math.round(valorM2Estimado * userArea);
  
  // Faixas de Negociação (-10% e +10% como limites admissíveis usuais)
  const faixaConservadora = Math.round(valorEstimadoImovel * 0.90);
  const faixaOtimista = Math.round(valorEstimadoImovel * 1.10);
  const faixaMedia = valorEstimadoImovel;

  // --- PARÂMETROS BANCÁRIOS SIMULADOS ---
  // 1. Percentual de Segurança Bancária (Baseia-se em conservação, idade e checklist)
  let segurancaBancaria = 80; // Percentual padrão para financiamento residencial em bancos privados/públicos

  if (subject.tipo === 'sala_comercial' || subject.tipo === 'predio_comercial') {
    segurancaBancaria = 70; // Imóveis comerciais têm cota de financiamento menor (LTV menor)
  } else if (subject.tipo === 'terreno') {
    segurancaBancaria = 60; // Terrenos puros têm cota menor ainda
  }

  // Penalização por conservação ruim ou regular
  if (subject.conservacao === 'ruim') {
    segurancaBancaria -= 15;
  } else if (subject.conservacao === 'regular') {
    segurancaBancaria -= 5;
  }

  // Penalização por idade do imóvel
  if (subject.idade > 30) {
    segurancaBancaria -= 5;
  }

  // Penalização por checklists incompletos
  segurancaBancaria -= (missingMandatoryDocsCount * 4);
  segurancaBancaria -= (missingMandatoryPhysicalsCount * 3);

  // Garantir limites mínimos/máximos de LTV do banco
  segurancaBancaria = Math.max(Math.min(segurancaBancaria, 85), 40);

  // Valor provável de avaliação do banco (Geralmente é conservador)
  // O perito técnico do banco costuma arbitrar um valor ligeiramente descontado caso haja imperfeições
  const fatorPerito = hasNoHabitese ? 0.50 : (1 - (missingMandatoryPhysicalsCount * 0.05) - (subject.conservacao === 'ruim' ? 0.12 : 0));
  const valorProvavelAvaliacaoBanco = Math.round(valorEstimadoImovel * Math.max(fatorPerito, 0.5));

  // 2. Capacidade Financeira do Proponente baseada na Renda
  // Parcela máxima permitida por lei no SFH/SFI: 30% da renda familiar bruta.
  let rendaDisponivel = subject.rendaFamiliar;
  if (subject.possuiOutroFinanciamento) {
    rendaDisponivel *= 0.80; // Deduz 20% da renda presumida para outros compromissos
  }
  const parcelaMaximaPermitida = Math.round(rendaDisponivel * 0.30);

  // Sob as regras da Tabela SAC (SISTEMA DE AMORTIZAÇÃO CONSTANTE), amplamente usada no Brasil (Caixa, etc.):
  // A primeira parcela é a mais alta. Fator de amortização + juros simulados a 10.5% ao ano + seguros obrigatórios:
  // Fator aproximado da primeira parcela para 30 anos (360 meses) = ~0.011 (ou seja, parcela / 0.011 = financiamento máximo pela renda)
  const taxaSimuladaAnual = 0.105; // 10.5% a.a.
  const prazoMeses = 360;
  // Fator SAC inicial = (1 / prazo) + (taxa_anual / 12) + seguro_medio (0.0006) = ~0.0119
  const fatorSACInicial = (1 / prazoMeses) + (taxaSimuladaAnual / 12) + 0.0006;
  
  const valorMaximoPelaRenda = Math.round(parcelaMaximaPermitida / fatorSACInicial);

  // Valor máximo financiável estimado (Menor entre o limite de garantia (LTV) e o limite de renda)
  const limiteGarantiaBanco = Math.round(valorProvavelAvaliacaoBanco * (segurancaBancaria / 100));
  const valorMaximoFinanciador = Math.min(limiteGarantiaBanco, valorMaximoPelaRenda);

  // Parcela inicial estimada
  const parcelaEstimadaInicial = Math.round(valorMaximoFinanciador * fatorSACInicial);

  // Entrada mínima necessária (Valor estimado do imóvel - valor máximo de financiamento concedido)
  // Lembrando que no Brasil o comprador precisa pagar a diferença.
  const entradaMinimaNecessaria = Math.max(valorEstimadoImovel - valorMaximoFinanciador, Math.round(valorEstimadoImovel * 0.15));

  // Enquadramentos de Programas Habitacionais
  const sfh = valorEstimadoImovel <= 1500000 && subject.tipo !== 'sala_comercial' && subject.tipo !== 'predio_comercial';
  const sfi = !sfh;
  
  // Regras básicas Minha Casa Minha Vida (MCMV) - Teto varia por região, mas varia até R$ 350.000 para faixa 3
  // Renda familiar máxima MCMV Faixa 3 internacionalizada é R$ 8.000.
  const mcmv = valorEstimadoImovel <= 350000 && 
                subject.rendaFamiliar <= 8500 && 
                (subject.tipo === 'apartamento' || subject.tipo === 'casa') &&
                subject.padrao !== 'luxo' && subject.padrao !== 'alto';

  const detalhesMcmv = mcmv 
    ? 'Habilitado para Faixa 3 do programa MCMV. Juros reduzidos subsidiados (cerca de 7.66% a 8.16% a.a.).'
    : subject.rendaFamiliar > 8500 
      ? 'Não enquadrado no MCMV devido à renda familiar superior a R$ 8.500.'
      : valorEstimadoImovel > 350000 
        ? 'Não enquadrado no MCMV devido ao valor do imóvel ultrapassar R$ 350.000.'
        : 'Não enquadrado devido ao tipo/padrão do imóvel.';

  // --- DIAGNÓSTICO E RECOMENDAÇÃO ---
  let recomendacaoFinanciamento: 'aprovado' | 'aprovado_ressalvas' | 'risco_alto' = 'aprovado';
  let motivoRecomendacao = '';
  const pontosPositivos: string[] = [];
  const pontosRisco: string[] = [];
  
  // Deteção de Liquidez
  let liquidezEstimada: 'Baixa' | 'Média' | 'Alta' = 'Média';
  if (subject.tipo === 'apartamento' && subject.conservacao === 'otimo' && subject.padrao === 'medio') {
    liquidezEstimada = 'Alta';
  } else if (subject.tipo === 'casa' && subject.areaPrivativa > 300) {
    liquidezEstimada = 'Alta'; // Alto padrão em bons bairros
  } else if (subject.tipo === 'predio_comercial' || subject.conservacao === 'ruim') {
    liquidezEstimada = 'Baixa';
  }

  // Pontos positivos e riscos
  if (subject.conservacao === 'otimo' || subject.conservacao === 'bom') {
    pontosPositivos.push(`Excelente estado de conservação (${subject.conservacao.toUpperCase()}), minimizando risco de depreciação.`);
  }
  if (subject.idade < 10) {
    pontosPositivos.push(`Imóvel seminovo (${subject.idade} anos), excelente aceitação como garantia fiduciária.`);
  }
  if (subject.temInfraestrutura) {
    pontosPositivos.push('Saneamento e infraestrutura pública completa na localização do imóvel.');
  }
  if (subject.vagas >= 2) {
    pontosPositivos.push(`Boa oferta de garagens (${subject.vagas} vagas), aumentando a liquidez de repasse.`);
  }
  if (grauConfianca === 'Alto') {
    pontosPositivos.push('Amostra estatística homogênea com alta fidedignidade de mercado.');
  }

  // Riscos
  if (hasNoHabitese) {
    pontosRisco.push('IMPERATIVO: Imóvel sem Habite-se residencial/comercial averbado na matrícula. Financiamento bloqueado.');
  }
  if (subject.conservacao === 'ruim') {
    pontosRisco.push('Conservação precária (RUIM) pode gerar restrição construtiva ou declínio por parte do vistoriador do banco.');
  }
  if (subject.idade > 35) {
    pontosRisco.push('Imóvel com idade elevada (mais de 35 anos). Bancos reduzem a cota máxima de financiamento para salvaguarda física.');
  }
  if (missingMandatoryDocsCount > 0) {
    pontosRisco.push(`Pendência documental: ${missingMandatoryDocsCount} documento(s) essencial(is) pendente(s) ou desmarcado(s).`);
  }
  if (missingMandatoryPhysicalsCount > 0) {
    pontosRisco.push(`Patologia física detectada: ${missingMandatoryPhysicalsCount} item(ns) estrutural(ais) comprometido(s) na auto-vistoria.`);
  }
  if (valorMaximoFinanciador < (subject.valorDesejadoFinanciamento || 0)) {
    pontosRisco.push('Capacidade de renda familiar insuficiente para o montante de financiamento desejado pelo cliente.');
  }

  // Recomendação Final
  if (hasNoHabitese || subject.conservacao === 'ruim' || missingMandatoryDocsCount >= 3 || missingMandatoryPhysicalsCount >= 3) {
    recomendacaoFinanciamento = 'risco_alto';
    motivoRecomendacao = 'Risco grave detectado em fatores físicos, estruturais corporais ou documentais. É provável que o banco recuse a garantia até a total regularização.';
  } else if (missingMandatoryDocsCount > 0 || missingMandatoryPhysicalsCount > 0 || subject.conservacao === 'regular' || valorMaximoFinanciador < (subject.valorDesejadoFinanciamento || 1)) {
    recomendacaoFinanciamento = 'aprovado_ressalvas';
    motivoRecomendacao = 'Financiamento condicionado à solução de pendências documentais moderadas, adequação do valor de entrada ou reforma corretiva básica.';
  } else {
    recomendacaoFinanciamento = 'aprovado';
    motivoRecomendacao = 'Excelente perfil de garantia. Imóvel regular, saudável e compatível com as regras prudenciais dos principais bancos brasileiros.';
  }

  const result: SimulationResult = {
    valorM2Estimado: Math.round(valorM2Estimado),
    valorM2MedioSemAjuste: Math.round(valorM2MedioSemAjuste),
    valorEstimadoImovel,
    faixaConservadora,
    faixaOtimista,
    faixaMedia,
    grauConfianca,
    confiancaMotivo,
    segurancaBancaria,
    valorProvavelAvaliacaoBanco,
    valorMaximoFinanciador,
    parcelaMaximaPermitida,
    parcelaEstimadaInicial,
    entradaMinimaNecessaria,
    enquadramentoSistemas: {
      sfh,
      sfi,
      mcmv,
      detalhesMcmv
    },
    recomendacaoFinanciamento,
    motivoRecomendacao,
    pontosPositivos,
    pontosRisco,
    liquidezEstimada
  };

  return {
    result,
    adjustedComparables
  };
}
