/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ComparableProperty, BuildStandard, ConservationState } from '../types';
import { Trash2, Plus, Info, HelpCircle, FilePlus, Sparkles } from 'lucide-react';

interface ComparablesStepFormProps {
  comparables: ComparableProperty[];
  onComparablesChange: (updatedList: ComparableProperty[]) => void;
  onPrev: () => void;
  onCalculate: () => void;
  subjectNeighborhood: string;
}

export default function ComparablesStepForm({
  comparables,
  onComparablesChange,
  onPrev,
  onCalculate,
  subjectNeighborhood
}: ComparablesStepFormProps) {
  
  // Single comparable property input state
  const [newBairro, setNewBairro] = useState(subjectNeighborhood || '');
  const [newValor, setNewValor] = useState<number | ''>('');
  const [newArea, setNewArea] = useState<number | ''>('');
  const [newPadrao, setNewPadrao] = useState<BuildStandard>('medio');
  const [newConservacao, setNewConservacao] = useState<ConservationState>('bom');
  const [newDistancia, setNewDistancia] = useState<number | ''>('');

  const [formError, setFormError] = useState('');

  // Handle adding a comparable listing
  const handleAddComparable = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!newBairro || !newValor || !newArea || !newDistancia) {
      setFormError('Por favor, preencha todos os campos obrigatórios (*).');
      return;
    }

    if (Number(newValor) <= 0 || Number(newArea) <= 0) {
      setFormError('Valor e Área devem ser superiores a zero.');
      return;
    }

    const calculatedM2 = Number(newValor) / Number(newArea);

    const newItem: ComparableProperty = {
      id: `comp-custom-${Date.now()}`,
      bairro: newBairro,
      valor: Number(newValor),
      area: Number(newArea),
      padrao: newPadrao,
      conservacao: newConservacao,
      distancia: Number(newDistancia),
      valorM2: Math.round(calculatedM2)
    };

    onComparablesChange([...comparables, newItem]);

    // Reset inputs but keep neighborhood as a handy default
    setNewValor('');
    setNewArea('');
    setNewDistancia('');
  };

  // Remove comparable
  const handleRemoveComparable = (id: string) => {
    onComparablesChange(comparables.filter((item) => item.id !== id));
  };

  // Quick fill placeholder to quickly show how NBR-14653 matches
  const handleAddQuickRef = () => {
    const refs = [
      { id: `comp-qr-1-${Date.now()}`, bairro: subjectNeighborhood || 'Geral', valor: 650000, area: 110, padrao: 'medio' as BuildStandard, conservacao: 'bom' as ConservationState, distancia: 0.5, valorM2: 5909 },
      { id: `comp-qr-2-${Date.now()}`, bairro: subjectNeighborhood || 'Geral', valor: 780000, area: 130, padrao: 'medio' as BuildStandard, conservacao: 'otimo' as ConservationState, distancia: 1.2, valorM2: 6000 },
      { id: `comp-qr-3-${Date.now()}`, bairro: subjectNeighborhood || 'Geral', valor: 590000, area: 95, padrao: 'medio' as BuildStandard, conservacao: 'regular' as ConservationState, distancia: 0.8, valorM2: 6210 },
    ];
    onComparablesChange([...comparables, ...refs]);
  };

  return (
    <div id="comparables-step-wrapper" className="space-y-6">

      <div id="comparables-intro" className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-blue-900 flex gap-3 text-xs leading-relaxed">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div id="comp-guide-box">
          <p className="font-semibold text-blue-950">NBR 14653 - Método Comparativo Direto de Dados de Mercado</p>
          <p className="mt-1">
            Esta metodologia fundamenta-se na identificação de imóveis semelhantes anunciados ou vendidos na mesma microrregião. É necessário cadastrar <strong>de 3 a 10 comparados</strong> para calcular a média e as regressões de padrão, idade e localização.
          </p>
          <p className="text-[10px] text-blue-805 mt-1 font-semibold">
            * Dica: Use os exemplos na Etapa 1 se quiser pular o preenchimento manual de amostras e testar os cálculos imediatamente.
          </p>
        </div>
      </div>

      <div id="step-3-body" className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Form to insert a single Comparable */}
        <div id="comparable-add-form" className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4 h-fit lg:col-span-1">
          <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2 text-sm uppercase tracking-wider text-blue-600 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Adicionar Amostra
          </h3>

          <form onSubmit={handleAddComparable} className="space-y-3.5 text-xs">
            <div id="f-comp-bairro" className="space-y-1">
              <label className="text-gray-700 font-semibold">Bairro do Comparado *</label>
              <input
                type="text"
                value={newBairro}
                onChange={(e) => setNewBairro(e.target.value)}
                placeholder="Ex: Cambuí"
                className="w-full rounded border border-gray-300 p-2 text-xs bg-white text-gray-800"
                required
              />
            </div>

            <div id="f-comp-metrics" className="grid grid-cols-2 gap-2">
              <div id="f-v-anunc" className="space-y-1">
                <label className="text-gray-700 font-semibold">Valor Anunciado (R$) *</label>
                <input
                  type="number"
                  min="1"
                  value={newValor === '' ? '' : newValor}
                  onChange={(e) => setNewValor(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Ex: 550000"
                  className="w-full rounded border border-gray-300 p-2 text-xs font-medium bg-white text-gray-800"
                  required
                />
              </div>
              <div id="f-v-area" className="space-y-1">
                <label className="text-gray-700 font-semibold">Área Privativa (m²) *</label>
                <input
                  type="number"
                  min="1"
                  value={newArea === '' ? '' : newArea}
                  onChange={(e) => setNewArea(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Ex: 90"
                  className="w-full rounded border border-gray-300 p-2 text-xs font-medium bg-white text-gray-800"
                  required
                />
              </div>
            </div>

            <div id="f-comp-standards" className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-gray-700 font-semibold">Padrão Construtivo</label>
                <select
                  value={newPadrao}
                  onChange={(e) => setNewPadrao(e.target.value as BuildStandard)}
                  className="w-full rounded border border-gray-300 p-1.5 text-xs bg-white text-gray-800"
                >
                  <option value="popular">Popular</option>
                  <option value="medio">Médio</option>
                  <option value="alto">Alto</option>
                  <option value="luxo">Luxo</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-gray-700 font-semibold">Conservação</label>
                <select
                  value={newConservacao}
                  onChange={(e) => setNewConservacao(e.target.value as ConservationState)}
                  className="w-full rounded border border-gray-300 p-1.5 text-xs bg-white text-gray-800"
                >
                  <option value="ruim">Ruim</option>
                  <option value="regular">Regular</option>
                  <option value="bom">Bom</option>
                  <option value="otimo">Ótimo</option>
                </select>
              </div>
            </div>

            <div id="f-comp-distance" className="space-y-1">
              <label className="text-gray-700 font-semibold flex items-center justify-between">
                <span>Distância do Imóvel Referência (km) *</span>
                {newDistancia !== '' && <span className="font-bold text-blue-600">{newDistancia} km</span>}
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="15"
                value={newDistancia === '' ? '' : newDistancia}
                onChange={(e) => setNewDistancia(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Ex: 0.8"
                className="w-full rounded border border-gray-300 p-2 text-xs bg-white text-gray-800"
                required
              />
            </div>

            {/* Simulated item feedback inside form prior to submittal */}
            {Number(newValor) > 0 && Number(newArea) > 0 && (
              <div className="bg-gray-50 p-2 rounded text-[11px] text-gray-600 flex justify-between">
                <span>m² Bruto Calculado:</span>
                <span className="font-mono font-bold text-gray-900">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(Number(newValor) / Number(newArea))}/m²
                </span>
              </div>
            )}

            {formError && (
              <p className="text-[11px] text-red-650 font-bold bg-red-50 p-2 rounded border border-red-150">
                ⚠️ {formError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-xs"
            >
              <FilePlus className="w-4 h-4" /> Registrar na Amostra
            </button>
          </form>

          {comparables.length === 0 && (
            <button
              type="button"
              onClick={handleAddQuickRef}
              className="w-full py-2 border border-dashed border-gray-300 text-gray-600 hover:text-gray-800 font-medium text-xs rounded-lg cursor-pointer flex items-center justify-center gap-1 bg-gray-50/50"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Preencher com comparados rápidos desfavoráveis
            </button>
          )}

        </div>

        {/* Comparable listings table / output registry */}
        <div id="comparables-output-grid" className="lg:col-span-2 space-y-4">
          <div id="grid-header" className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
            <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider flex items-center gap-2">
              Amostras Cadastradas ({comparables.length}/10)
            </h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              comparables.length < 3 
                ? 'bg-red-100 text-red-700 border border-red-200' 
                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`}>
              {comparables.length < 3 ? '🔴 Mínimo de 3 dados pendente' : '✅ Amostra Pronta'}
            </span>
          </div>

          {comparables.length === 0 ? (
            <div id="empty-comps-card" className="border-2 border-dashed border-gray-100 rounded-2xl p-10 text-center space-y-3 bg-white">
              <p className="text-sm font-semibold text-gray-600">Nenhum imóvel comparável cadastrado até o momento.</p>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                Cadastre pelo menos 3 imóveis semelhantes no seu bairro na coluna à esquerda para possibilitar o cálculo comparativo.
              </p>
            </div>
          ) : (
            <div id="comps-table-container" className="bg-white rounded-xl border border-gray-150 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-100 uppercase text-[9px] tracking-wider">
                  <tr>
                    <th className="p-3">Bairro</th>
                    <th className="p-3">Valor</th>
                    <th className="p-3 text-right">Área</th>
                    <th className="p-3 text-right">m² Bruto</th>
                    <th className="p-3 text-center">Fatores</th>
                    <ThCentred className="p-3 text-center">Ações</ThCentred>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {comparables.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-3 py-3.5">
                        <span className="font-semibold block text-gray-900">{item.bairro}</span>
                        <span className="text-[10px] text-gray-400 font-normal">Amostra #{index + 1} • {item.distancia} km dist.</span>
                      </td>
                      <td className="p-3 font-semibold text-gray-900 font-mono">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(item.valor)}
                      </td>
                      <td className="p-3 text-right font-mono font-medium">{item.area} m²</td>
                      <td className="p-3 text-right font-mono font-bold text-blue-700 bg-blue-50/20">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(item.valorM2)}/m²
                      </td>
                      <td className="p-3 text-center">
                        <div id={`badges-comp-${item.id}`} className="flex justify-center gap-1 flex-wrap">
                          <span className="text-[9px] font-semibold bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded-md border border-gray-200">
                            Padrão: {item.padrao.toUpperCase()}
                          </span>
                          <span className="text-[9px] font-semibold bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded-md border border-gray-200">
                            Conservação: {item.conservacao.toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveComparable(item.id)}
                          className="p-1 px-2.5 text-xs text-red-650 hover:bg-red-50 border border-transparent rounded hover:border-red-250 transition-colors cursor-pointer inline-flex items-center gap-1 justify-center"
                          title="Excluir amostra"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div id="comps-footer-stats" className="bg-gray-50 p-3 text-[10px] text-gray-500 border-t border-gray-150 flex justify-between flex-wrap gap-2">
                <span>Coeficiente de escala e localização ativos sob NBR-14653.</span>
                <span>Média bruta de dados: <strong className="text-gray-800 font-mono">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(
                    comparables.length > 0 
                      ? comparables.reduce((acc, c) => acc + c.valorM2, 0) / comparables.length 
                      : 0
                  )}/m²
                </strong></span>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Navigation and final simulator launch trigger */}
      <div id="step-3-controls" className="pt-4 border-t border-gray-100 flex justify-between items-center">
        <button
          type="button"
          onClick={onPrev}
          className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 font-medium text-xs cursor-pointer"
        >
          ➔ Retornar aos Checklists
        </button>

        <button
          type="button"
          onClick={onCalculate}
          disabled={comparables.length < 3}
          className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-bold shadow-lg hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl transition-all flex items-center gap-2 text-sm disabled:from-gray-300 disabled:to-gray-350 disabled:cursor-not-allowed disabled:shadow-none cursor-pointer"
        >
          ⚙️ Calcular Avaliação Bancária
        </button>
      </div>

    </div>
  );
}

// Simple layout th helper to satisfy TypeScript compilation
function ThCentred(props: React.DetailedHTMLProps<React.ThHTMLAttributes<HTMLTableCellElement>, HTMLTableCellElement>) {
  return <th className="p-3 text-center" {...props} />;
}
