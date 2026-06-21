/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PropertyData, PropertyType, BuildStandard, ConservationState } from '../types';
import { ESTADOS_BRASILEIROS, TIPOS_AMOSTRA } from '../data/mockData';
import { Info, HelpCircle, Sparkles, Receipt, Users } from 'lucide-react';

interface PropertyDataFormProps {
  data: PropertyData;
  onChange: (updated: Partial<PropertyData>) => void;
  onNext: () => void;
  onLoadExample: (type: 'casa' | 'apartamento') => void;
}

export default function PropertyDataForm({ data, onChange, onNext, onLoadExample }: PropertyDataFormProps) {
  const handleChange = (field: keyof PropertyData, value: any) => {
    onChange({ [field]: value });
  };

  return (
    <div id="property-form-wrapper" className="space-y-6">
      
      {/* Quick pre-fill button container */}
      <div id="demo-injector-banner" className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-4 rounded-xl flex flex-col sm:flex-row hover:border-blue-400 items-start sm:items-center justify-between gap-3 shadow-xs">
        <div id="demo-banner-text" className="space-y-1">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Sparkles className="w-3.5 h-3.5" /> Fast-Track
          </span>
          <p className="text-xs text-blue-900 font-medium">
            Simule rapidamente preenchendo automaticamente com exemplos reais de mercado:
          </p>
        </div>
        <div id="demo-actions" className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onLoadExample('casa')}
            className="px-3 py-1.5 bg-white text-xs text-blue-700 font-semibold border border-blue-200 rounded-lg shadow-xs hover:bg-blue-50 transition-colors"
          >
            🏡 Casa Alto Padrão (Campinas)
          </button>
          <button
            type="button"
            onClick={() => onLoadExample('apartamento')}
            className="px-3 py-1.5 bg-white text-xs text-indigo-700 font-semibold border border-indigo-200 rounded-lg shadow-xs hover:bg-indigo-50 transition-colors"
          >
            🏢 Apto Médio (Rio - Botafogo)
          </button>
        </div>
      </div>

      <div id="form-structure" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* COL 1: Caracterizações Básicas e Tipo */}
        <div id="col-basic-details" className="space-y-5 bg-white p-5 rounded-xl border border-gray-100 shadow-xs">
          <h3 className="font-semibold text-gray-900 border-b border-gray-100 pb-2 text-sm uppercase tracking-wider text-blue-600">
            1. Caracterização & Localização
          </h3>

          <div id="field-tipo" className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 flex items-center justify-between">
              Tipo do Imóvel *
            </label>
            <select
              value={data.tipo}
              onChange={(e) => handleChange('tipo', e.target.value as PropertyType)}
              className="w-full text-sm rounded-lg border border-gray-300 p-2.5 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none"
            >
              {TIPOS_AMOSTRA.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div id="field-state-city" className="grid grid-cols-3 gap-2">
            <div className="col-span-1 space-y-1">
              <label className="text-xs font-semibold text-gray-700">Estado *</label>
              <select
                value={data.estado}
                onChange={(e) => handleChange('estado', e.target.value)}
                className="w-full text-xs rounded-lg border border-gray-300 p-2 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {ESTADOS_BRASILEIROS.map((est) => (
                  <option key={est.sigla} value={est.sigla}>{est.sigla}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2 space-y-1">
              <label className="text-xs font-semibold text-gray-700">Cidade *</label>
              <input
                type="text"
                placeholder="Ex: Campinas"
                value={data.cidade}
                onChange={(e) => handleChange('cidade', e.target.value)}
                className="w-full text-xs rounded-lg border border-gray-300 p-2 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
          </div>

          <div id="field-bairro" className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">Bairro *</label>
            <input
              type="text"
              placeholder="Ex: Cambuí"
              value={data.bairro}
              onChange={(e) => handleChange('bairro', e.target.value)}
              className="w-full text-xs rounded-lg border border-gray-300 p-2 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div id="field-endereco" className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">Endereço Aproximado</label>
            <input
              type="text"
              placeholder="Ex: Rua General Osório, 1200"
              value={data.endereco}
              onChange={(e) => handleChange('endereco', e.target.value)}
              className="w-full text-xs rounded-lg border border-gray-300 p-2 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Sizing Dimensions */}
          <div id="field-areas" className="grid grid-cols-2 gap-2 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                Área Privativa m² *
              </label>
              <input
                type="number"
                min="5"
                value={data.areaPrivativa || ''}
                onChange={(e) => handleChange('areaPrivativa', Number(e.target.value))}
                className="w-full text-xs rounded-lg border border-gray-300 p-2 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                required
              />
              <span className="text-[10px] text-gray-400">Área útil construída</span>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                Área Terreno m² 
              </label>
              <input
                type="number"
                min="0"
                disabled={data.tipo === 'apartamento'}
                value={data.tipo === 'apartamento' ? 0 : (data.areaTerreno || '')}
                onChange={(e) => handleChange('areaTerreno', Number(e.target.value))}
                className="w-full text-xs rounded-lg border border-gray-300 p-2 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-150 disabled:text-gray-450 outline-none"
              />
              <span className="text-[10px] text-gray-400">{data.tipo === 'apartamento' ? 'Não aplicável' : 'Área total do lote'}</span>
            </div>
          </div>

          <div id="field-idade" className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 flex justify-between">
              <span>Idade Aparente (Anos)</span>
              <span className="font-mono text-[11px] text-blue-600 font-bold">{data.idade} anos</span>
            </label>
            <input
              type="range"
              min="0"
              max="70"
              value={data.idade}
              onChange={(e) => handleChange('idade', Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <span className="text-[10px] text-gray-400 block -mt-1">
              Idade influi nas cotas máximas do banco por depreciação.
            </span>
          </div>

        </div>

        {/* COL 2: Padrão, Cômodos e Conservação */}
        <div id="col-standards-rooms" className="space-y-5 bg-white p-5 rounded-xl border border-gray-100 shadow-xs">
          <h3 className="font-semibold text-gray-900 border-b border-gray-100 pb-2 text-sm uppercase tracking-wider text-blue-600">
            2. Padrão Construtivo e Detalhes
          </h3>

          {/* Construtive Standard Selector */}
          <div id="field-padrao" className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 flex items-center justify-between">
              Padrão de Acabamento *
            </label>
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              {(['popular', 'medio', 'alto', 'luxo'] as BuildStandard[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handleChange('padrao', p)}
                  className={`p-2.5 rounded-lg border text-capitalize font-medium transition-all cursor-pointer ${
                    data.padrao === p
                      ? 'border-blue-600 bg-blue-50 text-blue-800 ring-2 ring-blue-100 shadow-xs font-bold'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {p === 'popular' ? 'Popular / Simples' : p === 'medio' ? 'Médio Normal' : p === 'alto' ? 'Alto / Superior' : 'Exclusivo / Luxo'}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-gray-400 leading-tight">
              Especificações e materiais da construção. Interfere fortemente no m² estimado.
            </p>
          </div>

          {/* Conservation State Selector */}
          <div id="field-conservacao" className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Estado de Conservação *</label>
            <div className="grid grid-cols-4 gap-1 text-center text-xs">
              {(['ruim', 'regular', 'bom', 'otimo'] as ConservationState[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleChange('conservacao', c)}
                  className={`py-2 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                    data.conservacao === c
                      ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold ring-2 ring-blue-100'
                      : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {c.toUpperCase()}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-gray-400 leading-tight">
              Bancos evitam financiar imóveis em estado &quot;ruim&quot; (reforço de penologias físicas).
            </p>
          </div>

          {/* Room configuration counts */}
          <div id="field-room-counts" className="bg-gray-50 p-3 rounded-lg border border-gray-100 space-y-3">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-widest text-[10px]">
              Divisão Interna de Cômodos
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="space-y-1">
                <label className="text-gray-600">Quartos Totais</label>
                <input
                  type="number"
                  min="0"
                  value={data.quartos}
                  onChange={(e) => handleChange('quartos', Math.max(0, Number(e.target.value)))}
                  className="w-full rounded border border-gray-300 p-1 bg-white text-gray-800"
                />
              </div>
              <div className="space-y-1">
                <label className="text-gray-600">Desses, Suítes</label>
                <input
                  type="number"
                  min="0"
                  value={data.suites}
                  onChange={(e) => handleChange('suites', Math.min(data.quartos, Math.max(0, Number(e.target.value))))}
                  className="w-full rounded border border-gray-300 p-1 bg-white text-gray-800"
                />
              </div>
              <div className="space-y-1">
                <label className="text-gray-600">Banheiros</label>
                <input
                  type="number"
                  min="1"
                  value={data.banheiros}
                  onChange={(e) => handleChange('banheiros', Math.max(1, Number(e.target.value)))}
                  className="w-full rounded border border-gray-300 p-1 bg-white text-gray-800"
                />
              </div>
              <div className="space-y-1">
                <label className="text-gray-600">Vagas Garagem</label>
                <input
                  type="number"
                  min="0"
                  value={data.vagas}
                  onChange={(e) => handleChange('vagas', Math.max(0, Number(e.target.value)))}
                  className="w-full rounded border border-gray-300 p-1 bg-white text-gray-800"
                />
              </div>
            </div>
          </div>

          {/* Infrastructures features checklist */}
          <div id="features-booleans" className="space-y-2 text-xs">
            <h4 className="font-bold text-gray-700 text-[10px] uppercase tracking-widest">
              Características & Condomínio
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer hover:text-gray-800">
                <input
                  type="checkbox"
                  checked={data.temCondominio}
                  onChange={(e) => handleChange('temCondominio', e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                Possui Condomínio
              </label>

              <label className="flex items-center gap-2 text-gray-600 cursor-pointer hover:text-gray-800">
                <input
                  type="checkbox"
                  checked={data.temElevador}
                  onChange={(e) => handleChange('temElevador', e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                Possui Elevador
              </label>

              <label className="flex items-center gap-2 text-gray-600 cursor-pointer hover:text-gray-800">
                <input
                  type="checkbox"
                  checked={data.temLazer}
                  onChange={(e) => handleChange('temLazer', e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                Área de Lazer
              </label>

              <label className="flex items-center gap-2 text-gray-600 cursor-pointer hover:text-gray-800">
                <input
                  type="checkbox"
                  checked={data.temSeguranca}
                  onChange={(e) => handleChange('temSeguranca', e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                Segurança 24h
              </label>
            </div>

            {data.temCondominio && (
              <div id="condo-details" className="pt-1.5 animate-fadeIn">
                <label className="block text-[10px] font-bold text-gray-600">TAXA DE CONDOMÍNIO (R$)</label>
                <input
                  type="number"
                  placeholder="Ex: 450"
                  value={data.taxaCondominio || ''}
                  onChange={(e) => handleChange('taxaCondominio', Number(e.target.value))}
                  className="w-full text-xs rounded border border-gray-300 p-1.5 bg-white text-gray-800 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

        </div>

        {/* COL 3: Renda & Financiamento Desejado */}
        <div id="col-finance-credit" className="space-y-5 bg-gradient-to-b from-gray-50 to-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-900 border-b border-gray-100 pb-2 text-sm uppercase tracking-wider text-blue-600 flex items-center justify-between">
            <span>3. Capacidade de Crédito</span>
            <Receipt className="w-4 h-4 text-gray-400" />
          </h3>

          <div id="field-renda" className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-blue-600" /> Renda Familiar Mensal Bruta (R$) *
            </label>
            <input
              type="number"
              min="1500"
              value={data.rendaFamiliar || ''}
              onChange={(e) => handleChange('rendaFamiliar', Number(e.target.value))}
              className="w-full text-sm font-bold rounded-lg border border-gray-300 p-2.5 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ex: 8000"
              required
            />
            <p className="text-[10px] text-gray-500 leading-tight">
              A Caixa e outros bancos limitam o valor da parcela a no máximo <strong>30% da sua renda familiar bruta</strong>.
            </p>
          </div>

          <div id="field-outro-financiamento" className="bg-white p-3 rounded-lg border border-gray-200">
            <label className="flex items-start gap-2.5 text-xs text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={data.possuiOutroFinanciamento}
                onChange={(e) => handleChange('possuiOutroFinanciamento', e.target.checked)}
                className="rounded mt-0.5 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="space-y-1">
                <strong>Possui outro financiamento ativo?</strong>
                <span className="block text-[10px] text-gray-500 font-normal">
                  Se sim, estimamos um recuo de 20% na parcela disponível útil para evitar endividamento cruzado.
                </span>
              </span>
            </label>
          </div>

          <div id="field-valor-desejado" className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 block">
              Valor Pretendido de Financiamento (R$)
            </label>
            <input
              type="number"
              min="0"
              value={data.valorDesejadoFinanciamento || ''}
              onChange={(e) => handleChange('valorDesejadoFinanciamento', Number(e.target.value))}
              className="w-full text-xs rounded-lg border border-gray-300 p-2 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: 400000"
            />
            <span className="text-[10px] text-gray-400 block -mt-1">
              O banco geralmente analisa se este valor é coerente com a sua renda informada e o m² do imóvel.
            </span>
          </div>

          <div id="banco-aviso-box" className="p-3 bg-blue-50 rounded-lg text-xs text-blue-900 border border-blue-100 flex gap-2">
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div id="box-txt-ct">
              <p className="font-semibold text-blue-950">Engenharia do Banco</p>
              <p className="text-[10px] text-blue-805 leading-relaxed mt-0.5">
                Não assine contratos particulares de compra e venda sem antes prever a vistoria física do banco e aprovação jurídica das certidões.
              </p>
            </div>
          </div>
        </div>

      </div>

      <div id="stage-1-controls" className="pt-4 flex justify-end">
        <button
          type="button"
          onClick={onNext}
          disabled={!data.areaPrivativa || !data.rendaFamiliar || !data.cidade || !data.bairro}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold shadow-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all cursor-pointer inline-flex items-center gap-2 text-sm"
        >
          Continuar para Checklists ➔
        </button>
      </div>

    </div>
  );
}
