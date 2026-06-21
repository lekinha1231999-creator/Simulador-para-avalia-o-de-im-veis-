/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { PropertyData, ComparableProperty, SimulationResult, ChecklistDocumental, ChecklistItem } from '../types';
import { AdjustedComparable } from '../lib/valuationEngine';
import { 
  FileText, ArrowLeft, Printer, ShieldCheck, AlertTriangle, 
  HelpCircle, Building2, Wallet, Layers, Landmark, ThumbsUp, Scale
} from 'lucide-react';

interface DashboardResultViewProps {
  subject: PropertyData;
  result: SimulationResult;
  adjustedComparables: AdjustedComparable[];
  documents: ChecklistDocumental;
  physicalChecks: ChecklistItem[];
  onBack: () => void;
  onReset: () => void;
}

export default function DashboardResultView({
  subject,
  result,
  adjustedComparables,
  documents,
  physicalChecks,
  onBack,
  onReset
}: DashboardResultViewProps) {
  
  const printAreaRef = useRef<HTMLDivElement>(null);

  // Trigger browser printing for saving as PDF
  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
  };

  // Quick risk styling
  const RISK_THEMES = {
    aprovado: {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-950',
      badge: 'bg-emerald-600 text-white',
      title: 'Aprovado (Excelente Perfil de Garantia)',
      icon: <ShieldCheck className="w-8 h-8 text-emerald-600" />
    },
    aprovado_ressalvas: {
      bg: 'bg-amber-50 border-amber-200 text-amber-950',
      badge: 'bg-amber-500 text-white',
      title: 'Aprovado com Ressalvas',
      icon: <AlertTriangle className="w-8 h-8 text-amber-600" />
    },
    risco_alto: {
      bg: 'bg-rose-50 border-rose-200 text-rose-950',
      badge: 'bg-rose-600 text-white',
      title: 'Risco Alto Detectado',
      icon: <AlertTriangle className="w-8 h-8 text-rose-600" />
    }
  };

  const activeTheme = RISK_THEMES[result.recomendacaoFinanciamento];

  // Calculated statistical variables
  const originalM2Average = adjustedComparables.reduce((acc, c) => acc + c.originalM2, 0) / adjustedComparables.length;
  const adjustedM2Average = result.valorM2Estimado;
  const percentChange = ((adjustedM2Average - originalM2Average) / originalM2Average) * 100;

  return (
    <div id="dashboard-result-wrapper" className="space-y-6">

      {/* Screen Headers with utility actions */}
      <div id="dash-action-row" className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-semibold text-xs flex items-center gap-2 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Ajustar Amostras de Entrada
        </button>
        <div id="dash-action-buttons animate-fadeIn" className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            className="px-4 py-2 text-xs text-gray-500 hover:text-gray-800 font-medium transition-colors cursor-pointer"
          >
            Refazer Simulação Completamente
          </button>
          
          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Gerar Relatório PDF / Imprimir
          </button>
        </div>
      </div>

      {/* Bento Grid Dashboard Layout */}
      <div id="dash-grid-deck" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
              {/* CARD 1: Valor de Mercado Estimado (Hero Stat) */}
        <div id="bento-hero-estimated" className="bento-card bento-hero-stat col-span-1 md:col-span-2 shadow-sm relative overflow-hidden">
          <div id="m-tile-badge" className="absolute top-0 right-0 py-1.5 px-4 bg-blue-500 text-white rounded-bl-xl font-bold text-[10px] tracking-wider uppercase">
            Estimativa NBR 14653
          </div>
          <div className="bento-card-title">Valor de Mercado Estimado</div>
          <div className="bento-big-value text-white my-1 font-extrabold text-3xl sm:text-4xl">
            {formatCurrency(result.valorEstimadoImovel)}
          </div>
          <div className="bento-confidence-tag">
            Confiança: {result.grauConfianca === 'Alto' ? 'Grau III' : result.grauConfianca === 'Médio' ? 'Grau II' : 'Grau I'} (Confiabilidade {result.grauConfianca})
          </div>
          
          <div className="grid grid-cols-3 gap-2 border-t border-white/20 mt-4 pt-3 text-[11px] text-white/95">
            <div>
              <span className="block opacity-75 font-medium text-[9px] uppercase">Conservadora (-10%)</span>
              <strong className="block font-mono mt-0.5">{formatCurrency(result.faixaConservadora)}</strong>
            </div>
            <div>
              <span className="block opacity-90 font-bold text-[9px] uppercase">Média / Estimada</span>
              <strong className="block font-mono mt-0.5">{formatCurrency(result.faixaMedia)}</strong>
            </div>
            <div>
              <span className="block opacity-75 font-medium text-[9px] uppercase">Otimista (+10%)</span>
              <strong className="block font-mono mt-0.5">{formatCurrency(result.faixaOtimista)}</strong>
            </div>
          </div>

          <p className="text-[10px] text-white/70 italic mt-3 leading-relaxed">
            * {result.confiancaMotivo}
          </p>
        </div>

        {/* CARD 2: Simulação de Financiamento */}
        <div id="bento-mortgage" className="bento-card col-span-1 shadow-sm justify-between">
          <div>
            <div className="bento-card-title">
              <Wallet className="w-3.5 h-3.5 text-blue-600" /> Simulação de Financiamento
            </div>
            <div className="bento-list-item">
              <span className="bento-label text-xs">Cota Máxima ({result.segurancaBancaria}%)</span>
              <span className="bento-value font-mono text-xs">{formatCurrency(result.valorMaximoFinanciador)}</span>
            </div>
            <div className="bento-list-item">
              <span className="bento-label text-xs">Entrada Mínima</span>
              <span className="bento-value font-mono text-xs">{formatCurrency(result.entradaMinimaNecessaria)}</span>
            </div>
            <div className="bento-list-item">
              <span className="bento-label text-xs">Modalidade de Financiamento</span>
              <span className="bento-value text-xs">SBPE / TR</span>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-2 mt-2">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Encargo Mensal Estimado</span>
            <span className="text-sm font-black font-mono text-slate-800">{formatCurrency(result.parcelaEstimadaInicial)} <span className="text-[9px] font-normal text-slate-450 font-sans">SAC Decrescente</span></span>
          </div>
        </div>

        {/* CARD 3: Enquadramento Bancário */}
        <div id="bento-enquadramento" className="bento-card col-span-1 shadow-sm">
          <div className="bento-card-title">
            <Landmark className="w-3.5 h-3.5 text-blue-600" /> Enquadramento Bancário
          </div>
          <div className="bento-list-item">
            <span className="bento-label">Habitabilidade</span>
            <span className="bento-status-pill bento-status-success font-black">Apto</span>
          </div>
          <div className="bento-list-item">
            <span className="bento-label">Liquidez do Imóvel</span>
            <span className="bento-status-pill bento-status-success font-black">Alta</span>
          </div>
          <div className="bento-list-item">
            <span className="bento-label">Risco Jurídico</span>
            <span className={`bento-status-pill font-black ${
              documents.imovel.find(d => d.id === 'i-4' && !d.checked) || result.recomendacaoFinanciamento === 'risco_alto' 
                ? 'bento-status-warning' 
                : 'bento-status-success'
            }`}>
              {result.recomendacaoFinanciamento === 'aprovado' ? 'Regular' : 'Atenção'}
            </span>
          </div>
        </div>

        {/* CARD 4: Dados do Imóvel Avaliado */}
        <div id="bento-subject-details" className="bento-card col-span-1 md:col-span-2 shadow-sm">
          <div className="bento-card-title">
            <Building2 className="w-3.5 h-3.5 text-blue-600" /> Dados do Imóvel Avaliado
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <div className="bento-list-item">
              <span className="bento-label">Tipo</span>
              <span className="bento-value capitalize">{subject.tipo}</span>
            </div>
            <div className="bento-list-item">
              <span className="bento-label">Área Privativa</span>
              <span className="bento-value font-mono">{subject.areaPrivativa} m²</span>
            </div>
            <div className="bento-list-item">
              <span className="bento-label">Padrão Construtivo</span>
              <span className="bento-value capitalize">{subject.padrao}</span>
            </div>
            <div className="bento-list-item">
              <span className="bento-label">Localização</span>
              <span className="bento-value text-right truncate max-w-[120px]" title={`${subject.bairro}, ${subject.cidade}`}>{subject.bairro}, {subject.cidade}</span>
            </div>
            <div className="bento-list-item">
              <span className="bento-label">Idade Aparente</span>
              <span className="bento-value">{subject.idade} anos</span>
            </div>
            <div className="bento-list-item">
              <span className="bento-label">Vagas Garagem</span>
              <span className="bento-value">{subject.vagas}</span>
            </div>
          </div>
        </div>

        {/* CARD 5: Metodologia Comparativa */}
        <div id="bento-methodology" className="bento-card col-span-1 shadow-sm justify-between">
          <div>
            <div className="bento-card-title">
              <Scale className="w-3.5 h-3.5 text-blue-600" /> Metodologia Comparativa
            </div>
            <div className="bento-chart-placeholder h-24 mb-4">
              <div className="bento-bar bento-bar-low" data-label="Mínimo" title={`Mínimo: ${formatCurrency(result.faixaConservadora)}`}></div>
              <div className="bento-bar bento-bar-avg" data-label="Média" title={`Média: ${formatCurrency(result.faixaMedia)}`}></div>
              <div className="bento-bar bento-bar-high" data-label="Máximo" title={`Máximo: ${formatCurrency(result.faixaOtimista)}`}></div>
            </div>
          </div>
          <div className="text-[11px] text-center mt-3 text-slate-500 font-semibold border-t border-slate-100 pt-2 font-mono">
            Valor Médio: {formatCurrency(result.valorM2Estimado)} / m²
          </div>
        </div>

        {/* CARD 6: Checklist de Vistoria de Amostra */}
        <div id="bento-checklist-peek" className="bento-card col-span-1 shadow-sm">
          <div className="bento-card-title">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Checklist de Vistoria
          </div>
          <div className="bento-list-item">
            <span className="bento-label">Estrutura / Trincas</span>
            <span className="bento-value font-semibold text-emerald-650">OK</span>
          </div>
          <div className="bento-list-item">
            <span className="bento-label">Infiltrações</span>
            <span className="bento-value font-semibold text-slate-500">Não Det.</span>
          </div>
          <div className="bento-list-item">
            <span className="bento-label">Acabamento</span>
            <span className="bento-value font-semibold text-blue-650 capitalize">{subject.conservacao}</span>
          </div>
        </div>

        {/* CARD 7: Amostras de Mercado (Comparáveis) */}
        <div id="bento-comparables-grid" className="bento-card col-span-1 md:col-span-2 lg:col-span-4 shadow-sm overflow-hidden">
          <div className="bento-card-title flex justify-between items-center w-full">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-600" /> Amostras de Mercado (Comparáveis Regulados NBR 14653)
            </span>
            <span className="text-[10px] text-slate-400 font-mono normal-case">
              Efeito correção média amostral: {percentChange >= 0 ? `+${percentChange.toFixed(1)}%` : `${percentChange.toFixed(1)}%`}
            </span>
          </div>
          
          <div className="overflow-x-auto w-full">
            <table className="comparables-table w-full text-left font-sans text-xs">
              <thead>
                <tr>
                  <th className="p-2 border-b border-slate-200">Bairro da Amostra</th>
                  <th className="p-2 border-b border-slate-200">Área</th>
                  <th className="p-2 border-b border-slate-200 text-right">Valor Bruto</th>
                  <th className="p-2 border-b border-slate-200 text-right">m² Ajustado</th>
                </tr>
              </thead>
              <tbody>
                {adjustedComparables.map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td className="p-2 border-b border-slate-100">
                      <span className="font-semibold">{item.bairro}</span>
                      <span className="text-[10px] text-slate-400 font-normal ml-2">({item.distancia}km)</span>
                    </td>
                    <td className="p-2 border-b border-slate-100">{item.area} m²</td>
                    <td className="p-2 border-b border-slate-100 text-right font-mono text-slate-500">{formatCurrency(item.valor)}</td>
                    <td className="p-2 border-b border-slate-100 text-right font-bold font-mono text-blue-800">{formatCurrency(item.valorM2Ajustado)}/m²</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CARD 8: Análise de Risco Físico, Construtivo e Enquadramentos */}
        <div id="bento-opinion-risk" className="bento-card col-span-1 md:col-span-2 lg:col-span-4 shadow-sm">
          <div className="bento-card-title">Análise de Risco Físico e Construtivo</div>
          
          <div className="space-y-4">
            <div className="risk-indicator flex items-center gap-2">
              <div className="dot shrink-0" style={{ backgroundColor: '#10b981', width: '8px', height: '8px', borderRadius: '50%' }}></div>
              <div className="text-xs text-slate-700 leading-relaxed">
                <strong>Conservação:</strong> Imóvel em excelente estado geral de preservação. Classificação atualizada para <span className="font-bold text-blue-900 capitalize">{subject.conservacao}</span>, dispensando reformas substanciais imediatas de alvenaria.
              </div>
            </div>

            <div className="risk-indicator flex items-center gap-2">
              <div className="dot shrink-0" style={{ backgroundColor: documents.imovel.find(d => d.id === 'i-4' && !d.checked) ? '#ef4444' : '#f59e0b', width: '8px', height: '8px', borderRadius: '50%' }}></div>
              <div className="text-xs text-slate-700 leading-relaxed">
                <strong>Documentação Imobiliária:</strong> {documents.imovel.find(d => d.id === 'i-4' && !d.checked) ? (
                  <span className="text-rose-700 font-extrabold block">⚠️ ALERTA: Imóvel sem habite-se legal ou certidão de baixa. Linhas habitacionais da Caixa e bancos comerciais serão imediatamente negadas de forma automática!</span>
                ) : (
                  <span>Certidão vintenária e averbações em dia. Exige conferência fiscal ordinária do recolhimento de impostos na entrega de chaves.</span>
                )}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 mt-1">
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-2">Qualificações e Programas Específicos</div>
              <div id="enquadramentos-bento-deck" className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className={`p-2.5 rounded-lg border text-xs ${result.enquadramentoSistemas.sfh ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950 font-sans' : 'bg-slate-50 border-slate-150 text-slate-400 font-sans'}`}>
                  <span className="font-bold block">Enquadramento SFH</span>
                  <span className="text-[10px] mt-0.5 block leading-relaxed opacity-90">
                    {result.enquadramentoSistemas.sfh ? 'Imóvel apto ao Sistema Financeiro de Habitação. Permite uso de saldo FGTS.' : 'Incompatível com o teto de R$ 1.5 mi.'}
                  </span>
                </div>
                <div className={`p-2.5 rounded-lg border text-xs ${result.enquadramentoSistemas.sfi ? 'bg-amber-50/50 border-amber-200 text-amber-950 font-sans' : 'bg-slate-50 border-slate-150 text-slate-400 font-sans'}`}>
                  <span className="font-bold block">Enquadramento SFI</span>
                  <span className="text-[10px] mt-0.5 block leading-relaxed opacity-90">
                    {result.enquadramentoSistemas.sfi ? 'Disponível como financiamento comercial livre com garantias de juros em vigor.' : 'Não aplicável.'}
                  </span>
                </div>
                <div className={`p-2.5 rounded-lg border text-xs ${result.enquadramentoSistemas.mcmv ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950 font-sans' : 'bg-slate-50 border-slate-150 text-slate-400 font-sans'}`}>
                  <span className="font-bold block text-emerald-900">Enquadramento MCMV</span>
                  <span className="text-[10px] mt-0.5 block leading-relaxed text-emerald-800">
                    {result.enquadramentoSistemas.mcmv ? `${result.enquadramentoSistemas.detalhesMcmv}` : 'Ultrapassa o limite de programa popular.'}
                  </span>
                </div>
              </div>
            </div>

            {/* Verdict text */}
            <div className={`mt-3 p-4 rounded-xl border ${activeTheme.bg}`}>
              <div className="flex gap-3 items-start text-xs">
                {activeTheme.icon}
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block p-0">Parecer de Engenharia Estimado</span>
                  <p className="font-black text-slate-900 leading-normal">{activeTheme.title}</p>
                  <p className="text-[11px] text-slate-700 leading-relaxed mt-1 font-medium">{result.motivoRecomendacao}</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* PRINT-ONLY IMMERSIVE VIEWPORT (Injected hidden, triggers neatly on @media print) */}
      <div id="printable-report-section" className="hidden print:block font-sans max-w-4xl mx-auto p-8 space-y-8 text-black" ref={printAreaRef}>
        
        {/* Header letterhead */}
        <div id="print-letterhead" className="border-b-4 border-gray-800 pb-6 flex justify-between items-end">
          <div id="letter-title">
            <h1 className="text-2xl font-black tracking-tight uppercase">Simulador de Avaliação Mercadológica</h1>
            <p className="text-xs text-gray-600">Relatório de Estimativa de Financiamento Habitacional</p>
          </div>
          <p className="text-xs font-mono text-gray-550">Simulação Educativa • Data base: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>

        {/* Disclaimer warning on print */}
        <div id="print-warning" className="border border-gray-400 p-4 rounded bg-gray-50 text-xs leading-relaxed italic">
          <strong>AVISO JURÍDICO LIMITANTE:</strong> Este relatório não constitui e não substitui um laudo técnico oficial de avaliação imobiliária, parecer de avaliação mercadológica regulado pela Resolução COFECI, ou a vistoria física de engenharia exigida pelos agentes financeiros para fins de alienação fiduciária. Os resultados representam estimativas aproximadas baseadas nos dados fornecidos pelo solicitante.
        </div>

        {/* Section 1: Subject property details */}
        <div id="print-section-subject" className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-350 pb-1 text-black font-sans">
            1. Caracterização do Imóvel Avaliado
          </h2>
          <div id="print-subject-grid" className="grid grid-cols-3 gap-y-2 gap-x-4 text-xs">
            <div><strong>Tipo Imóvel:</strong> <span className="uppercase">{subject.tipo}</span></div>
            <div><strong>Bairro:</strong> {subject.bairro}</div>
            <div><strong>Cidade:</strong> {subject.cidade} - {subject.estado}</div>
            <div><strong>Área Privativa:</strong> {subject.areaPrivativa} m²</div>
            <div><strong>Área Terreno:</strong> {subject.areaTerreno} m²</div>
            <div><strong>Idade Aparente:</strong> {subject.idade} anos</div>
            <div><strong>Padrão Construtivo:</strong> <span className="uppercase">{subject.padrao}</span></div>
            <div><strong>Conservação Física:</strong> <span className="uppercase">{subject.conservacao}</span></div>
            <div><strong>Suítes/Vagas:</strong> {subject.suites} suíte(s) / {subject.vagas} vagas</div>
          </div>
        </div>

        {/* Section 2: Core calculation memory */}
        <div id="print-section-comparables" className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-350 pb-1 text-black font-sans">
            2. Memória Comparativa de Amostras
          </h2>
          <table className="w-full text-xs text-left border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-black border-b border-gray-300">
                <th className="p-2 border-r border-gray-300">Bairro Amostrado</th>
                <th className="p-2 text-right border-r border-gray-300">Área</th>
                <th className="p-2 text-right border-r border-gray-300">Valor Bruto</th>
                <th className="p-2 text-right border-r border-gray-300">m² Bruto</th>
                <th className="p-2 text-right">m² Ajustado NBR</th>
              </tr>
            </thead>
            <tbody>
              {adjustedComparables.map((item, index) => (
                <tr key={item.id} className="border-b border-gray-300">
                  <td className="p-2 border-r border-gray-300">Amostra #{index+1} ({item.bairro})</td>
                  <td className="p-2 text-right border-r border-gray-300">{item.area} m²</td>
                  <td className="p-2 text-right border-r border-gray-300">{formatCurrency(item.valor)}</td>
                  <td className="p-2 text-right border-r border-gray-300">{formatCurrency(item.originalM2)}</td>
                  <td className="p-2 text-right font-bold">{formatCurrency(item.valorM2Ajustado)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between text-xs font-semibold pt-1">
            <span>Média Resultante por m² Homologada: {formatCurrency(result.valorM2Estimado)}</span>
            <span>Grau de Confiança de Modelo: {result.grauConfianca}</span>
          </div>
        </div>

        {/* Section 3: Value estimates */}
        <div id="print-section-estimates" className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-350 pb-1 text-black font-sans">
            3. Parecer e Resultados Estimados
          </h2>
          <div className="grid grid-cols-2 gap-4 border border-gray-300 p-4 rounded">
            <div className="space-y-1">
              <span className="text-[10px] uppercase text-gray-500 font-bold block">Valor Estimado do Imóvel (Faixa Média)</span>
              <p className="text-xl font-bold">{formatCurrency(result.valorEstimadoImovel)}</p>
              <span className="text-[10px] text-gray-600 block mt-1">
                Intervalo Arbitrável Admissível: {formatCurrency(result.faixaConservadora)} a {formatCurrency(result.faixaOtimista)}
              </span>
            </div>
            
            <div className="space-y-1">
              <span className="text-[10px] uppercase text-gray-500 font-bold block font-sans">Simulação Preliminar de Financiamento</span>
              <div className="text-xs space-y-1 mt-1">
                <div>• Máximo Financiável Concedido: <strong>{formatCurrency(result.valorMaximoFinanciador)}</strong></div>
                <div>• Entrada Mínima Necessária: <strong>{formatCurrency(result.entradaMinimaNecessaria)}</strong></div>
                <div>• Parcela Inicial Estimada (SAC): <strong>{formatCurrency(result.parcelaEstimadaInicial)}</strong></div>
                <div>• Proponente Renda Familiar: <strong>{formatCurrency(subject.rendaFamiliar)}</strong></div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Document check verify */}
        <div id="print-section-docs" className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-350 pb-1 text-black font-sans">
            4. Resumo de Requisitos de Linhas de Crédito
          </h2>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="font-bold underline mb-1">Análise Documental Pendente / Em Vigor:</p>
              <ul className="list-disc pl-4 space-y-1 text-gray-700">
                <li>Certidão vintenária / Matrícula averbada registrada</li>
                <li>Qualificação jurídica regularizada de todos os cônjuges</li>
                <li>Fiscalização e recolhimento prévio de ITBI estadual/condomínios</li>
              </ul>
            </div>
            <div>
              <p className="font-bold underline mb-1">Qualificação de Linha de Crédito:</p>
              <p className="leading-relaxed">
                As principais instituições brasileiras exigem comprovação de margem de 30% da renda líquida sob tabela SAC ou Tabela Price. Sujeito a variação do Custo Efetivo Total (CET).
              </p>
            </div>
          </div>
        </div>

        {/* Footer sign */}
        <div id="print-signature" className="pt-12 flex justify-between text-xs text-gray-500">
          <div>
            <p className="font-bold">_________________________________________________</p>
            <p className="mt-1">Solicitante da Simulação</p>
          </div>
          <div className="text-right">
            <p>Relatório emitido através do</p>
            <p className="font-bold text-gray-800">Simulador de Avaliação de Imóveis para Financiamento</p>
          </div>
        </div>

      </div>

    </div>
  );
}
