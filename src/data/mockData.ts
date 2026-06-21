/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PropertyData, ComparableProperty, ChecklistDocumental, ChecklistItem } from '../types';

export const ESTADOS_BRASILEIROS = [
  { sigla: 'AL', nome: 'Alagoas' },
  { sigla: 'AM', nome: 'Amazonas' },
  { sigla: 'BA', nome: 'Bahia' },
  { sigla: 'CE', nome: 'Ceará' },
  { sigla: 'DF', nome: 'Distrito Federal' },
  { sigla: 'ES', nome: 'Espírito Santo' },
  { sigla: 'GO', nome: 'Goiás' },
  { sigla: 'MA', nome: 'Maranhão' },
  { sigla: 'MG', nome: 'Minas Gerais' },
  { sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { sigla: 'MT', nome: 'Mato Grosso' },
  { sigla: 'PA', nome: 'Pará' },
  { sigla: 'PB', nome: 'Paraíba' },
  { sigla: 'PE', nome: 'Pernambuco' },
  { sigla: 'PI', nome: 'Piauí' },
  { sigla: 'PR', nome: 'Paraná' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' },
  { sigla: 'RN', nome: 'Rio Grande do Norte' },
  { sigla: 'RS', nome: 'Rio Grande do Sul' },
  { sigla: 'SC', nome: 'Santa Catarina' },
  { sigla: 'SE', nome: 'Sergipe' },
  { sigla: 'SP', nome: 'São Paulo' },
  { sigla: 'TO', nome: 'Tocantins' }
];

export const TIPOS_AMOSTRA = [
  { value: 'casa', label: 'Casa Comercial/Residencial' },
  { value: 'apartamento', label: 'Apartamento Residencial' },
  { value: 'terreno', label: 'Terreno Urbano' },
  { value: 'sala_comercial', label: 'Sala Comercial' },
  { value: 'predio_comercial', label: 'Prédio Comercial' }
];

export const CORD_PADRAO_CORES = {
  popular: 'text-amber-600 bg-amber-50 border-amber-200',
  medio: 'text-blue-600 bg-blue-50 border-blue-200',
  alto: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  luxo: 'text-purple-600 bg-purple-50 border-purple-200'
};

export const SAMPLE_PROPERTY_HOUSE: PropertyData = {
  tipo: 'casa',
  estado: 'SP',
  cidade: 'Campinas',
  bairro: 'Cambuí',
  endereco: 'Rua General Osório, prox ao número 1200',
  areaPrivativa: 180,
  areaTerreno: 250,
  quartos: 3,
  suites: 1,
  banheiros: 3,
  vagas: 2,
  idade: 12,
  padrao: 'alto',
  conservacao: 'bom',
  andar: 0,
  temElevador: false,
  temCondominio: false,
  taxaCondominio: 0,
  temLazer: true,
  temSeguranca: true,
  temInfraestrutura: true,
  rendaFamiliar: 15000,
  possuiOutroFinanciamento: false,
  valorDesejadoFinanciamento: 500000
};

export const SAMPLE_COMPARABLES_HOUSE: ComparableProperty[] = [
  {
    id: 'comp-1',
    bairro: 'Cambuí',
    valor: 1100000,
    area: 200,
    padrao: 'alto',
    conservacao: 'bom',
    distancia: 0.4,
    valorM2: 5500
  },
  {
    id: 'comp-2',
    bairro: 'Cambuí',
    valor: 920000,
    area: 160,
    padrao: 'alto',
    conservacao: 'regular',
    distancia: 0.8,
    valorM2: 5750
  },
  {
    id: 'comp-3',
    bairro: 'Cambuí',
    valor: 1250000,
    area: 190,
    padrao: 'alto',
    conservacao: 'otimo',
    distancia: 0.2,
    valorM2: 6578
  },
  {
    id: 'comp-4',
    bairro: 'Cambuí',
    valor: 980000,
    area: 175,
    padrao: 'medio',
    conservacao: 'bom',
    distancia: 1.1,
    valorM2: 5600
  },
  {
    id: 'comp-5',
    bairro: 'Guanabara', // Bairro vizinho similar
    valor: 1050000,
    area: 210,
    padrao: 'alto',
    conservacao: 'bom',
    distancia: 1.8,
    valorM2: 5000
  }
];

export const SAMPLE_PROPERTY_APT: PropertyData = {
  tipo: 'apartamento',
  estado: 'RJ',
  cidade: 'Rio de Janeiro',
  bairro: 'Botafogo',
  endereco: 'Rua Voluntários da Pátria, 350',
  areaPrivativa: 85,
  areaTerreno: 0,
  quartos: 2,
  suites: 1,
  banheiros: 2,
  vagas: 1,
  idade: 8,
  padrao: 'medio',
  conservacao: 'otimo',
  andar: 6,
  temElevador: true,
  temCondominio: true,
  taxaCondominio: 850,
  temLazer: true,
  temSeguranca: true,
  temInfraestrutura: true,
  rendaFamiliar: 12000,
  possuiOutroFinanciamento: false,
  valorDesejadoFinanciamento: 420000
};

export const SAMPLE_COMPARABLES_APT: ComparableProperty[] = [
  {
    id: 'comp-apt-1',
    bairro: 'Botafogo',
    valor: 890000,
    area: 80,
    padrao: 'medio',
    conservacao: 'otimo',
    distancia: 0.3,
    valorM2: 11125
  },
  {
    id: 'comp-apt-2',
    bairro: 'Botafogo',
    valor: 950000,
    area: 90,
    padrao: 'medio',
    conservacao: 'bom',
    distancia: 0.6,
    valorM2: 10555
  },
  {
    id: 'comp-apt-3',
    bairro: 'Botafogo',
    valor: 805000,
    area: 75,
    padrao: 'medio',
    conservacao: 'regular',
    distancia: 0.9,
    valorM2: 10733
  },
  {
    id: 'comp-apt-4',
    bairro: 'Botafogo',
    valor: 1120000,
    area: 88,
    padrao: 'alto',
    conservacao: 'otimo',
    distancia: 0.5,
    valorM2: 12727
  }
];

export const DEFAULT_DOCUMENT_CHECKLIST: ChecklistDocumental = {
  vendedor: [
    { id: 'v-1', label: 'Cópia do RG e CPF (ou CNH)', checked: true, obrigatorio: true, descricao: 'Necessário para comprovação de identidade de todos os coproprietários.' },
    { id: 'v-2', label: 'Certidão de Casamento ou União Estável', checked: true, obrigatorio: true, descricao: 'Necessária para verificar outorga uxória na venda.' },
    { id: 'v-3', label: 'Certidão Negativa de Protesto de Títulos', checked: false, obrigatorio: true, descricao: 'Comprova que o vendedor não possui pendências financeiras que possam anular a venda.' },
    { id: 'v-4', label: 'Certidões de Distribuidores Cíveis e Trabalhistas', checked: false, obrigatorio: true, descricao: 'Garante que o imóvel não será alvo de penhora judicial futuro (risco jurídico).' },
    { id: 'v-5', label: 'Certidão Federal de Débitos de Tributos Federais', checked: false, obrigatorio: true, descricao: 'Garante regularidade de impostos federais junto à PGFN.' }
  ],
  comprador: [
    { id: 'c-1', label: 'RG e CPF válidos (ou CNH)', checked: true, obrigatorio: true, descricao: 'Necessário para a qualificação fiduciária do comprador.' },
    { id: 'c-2', label: 'Comprovante de Estado Civil', checked: true, obrigatorio: true, descricao: 'Necessário para inserção correlata no registro do imóvel.' },
    { id: 'c-3', label: 'Comprovante de Renda (Holerites ou IR)', checked: true, obrigatorio: true, descricao: 'Comprovação da capacidade de endividamento (limite de 30% da renda familiar).' },
    { id: 'c-4', label: 'Extrato do FGTS (se for utilizar)', checked: false, obrigatorio: false, descricao: 'Para abater o saldo do valor financiável no âmbito do SFH.' },
    { id: 'c-5', label: 'Comprovante de residência atualizado', checked: true, obrigatorio: true, descricao: 'Dos últimos 60 dias para formalidade do cadastro.' }
  ],
  imovel: [
    { id: 'i-1', label: 'Matrícula Atualizada do Imóvel (com certidão de ônus e ações)', checked: true, obrigatorio: true, descricao: 'Certidão vintenária que indica quem realmente é o dono e se há hipoteca, penhora ou alienação.' },
    { id: 'i-2', label: 'Certidão Negativa de Tributos Municipais (IPTU)', checked: true, obrigatorio: true, descricao: 'Comprova que não há dívida ativa municipal com o imóvel.' },
    { id: 'i-3', label: 'Declaração de Quitação de Débitos Condominiais', checked: false, obrigatorio: true, descricao: 'Assinada pelo síndico ou administradora (obrigatória para apartamentos).' },
    { id: 'i-4', label: 'Habite-se Residencial (para novas construções)', checked: true, obrigatorio: true, descricao: 'Sem o Habite-se averbado na matrícula, bancos NÃO aprovam financiamento habitacional.' },
    { id: 'i-5', label: 'Planta Baixa Aprovada pela Prefeitura', checked: false, obrigatorio: false, descricao: 'Auxiliadora para o vistoriador credenciado de engenharia do banco.' }
  ]
};

export const DEFAULT_PHYSICAL_CHECKLIST: ChecklistItem[] = [
  { id: 'p-1', label: 'Estrutura estável sem fissuras ativas ou rachaduras graves', checked: true, obrigatorio: true, descricao: 'Qualquer dano estrutural acarreta reprovação sumária na vistoria de engenharia.' },
  { id: 'p-2', label: 'Ausência de infiltrações ativas ou mofo crônico nas lajes/paredes', checked: true, obrigatorio: true, descricao: 'Pontos de umidade degradam as alvenarias e abaixam o valor avaliado do banco.' },
  { id: 'p-3', label: 'Saneamento básico constituído e em funcionamento completo', checked: true, obrigatorio: true, descricao: 'Água encanada, escoamento de esgoto e energia integrada são mandatórios.' },
  { id: 'p-4', label: 'Cobertura (telhado) sem empenamento ou goteiras expressivas', checked: true, obrigatorio: true, descricao: 'Telhados danificados são apontados como urgência física pela perícia.' },
  { id: 'p-5', label: 'Elétrica e hidráulica em condições normais de operação', checked: true, obrigatorio: true, descricao: 'Fiações expostas ou vazamentos geram impedimentos para liberação da garantia.' },
  { id: 'p-6', label: 'Revestimentos e pintura em estado estético de conservação aceitável', checked: true, obrigatorio: false, descricao: 'Padrão estético influi na liquidez e no fator multiplicador de depreciação.' }
];
