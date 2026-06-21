/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChecklistDocumental, ChecklistItem } from '../types';
import { FileText, ShieldAlert, CheckCircle, HelpCircle, HardHat } from 'lucide-react';

interface ChecklistStepFormProps {
  documents: ChecklistDocumental;
  physicalChecks: ChecklistItem[];
  onDocumentsChange: (updatedDocs: ChecklistDocumental) => void;
  onPhysicalChecksChange: (updatedPhysicals: ChecklistItem[]) => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function ChecklistStepForm({
  documents,
  physicalChecks,
  onDocumentsChange,
  onPhysicalChecksChange,
  onPrev,
  onNext,
}: ChecklistStepFormProps) {
  const [activeTab, setActiveTab] = useState<'docs' | 'fisico'>('docs');

  // Toggle document checklist items
  const handleToggleDoc = (category: keyof ChecklistDocumental, id: string) => {
    const updatedCategory = documents[category].map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    onDocumentsChange({
      ...documents,
      [category]: updatedCategory,
    });
  };

  // Toggle physical properties checklist items
  const handleTogglePhysical = (id: string) => {
    const updated = physicalChecks.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    onPhysicalChecksChange(updated);
  };

  // Helper helper to quickly approve everything for fast audit simulations
  const handleApproveAll = () => {
    const approvedDocs: ChecklistDocumental = {
      vendedor: documents.vendedor.map(d => ({ ...d, checked: true })),
      comprador: documents.comprador.map(d => ({ ...d, checked: true })),
      imovel: documents.imovel.map(d => ({ ...d, checked: true }))
    };
    const approvedPhysical = physicalChecks.map(p => ({ ...p, checked: true }));
    onDocumentsChange(approvedDocs);
    onPhysicalChecksChange(approvedPhysical);
  };

  // Check counts
  const countDocsTotal = documents.vendedor.length + documents.comprador.length + documents.imovel.length;
  const countDocsChecked = 
    documents.vendedor.filter(d => d.checked).length + 
    documents.comprador.filter(d => d.checked).length + 
    documents.imovel.filter(d => d.checked).length;

  const countPhysicalTotal = physicalChecks.length;
  const countPhysicalChecked = physicalChecks.filter(p => p.checked).length;

  return (
    <div id="checklist-form-wrapper" className="space-y-6">
      
      {/* Description header */}
      <div id="checklist-intro" className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
        <div id="intro-texts">
          <h3 className="font-bold text-gray-950 text-sm">Garantias e Conformidade Bancária</h3>
          <p className="text-xs text-gray-650 mt-1 leading-relaxed">
            Bancos brasileiros exigem rigor físico e documental. Débitos pendentes ou falta de alvarás levam ao imediato indeferimento do financiamento comercial e do SFH.
          </p>
        </div>
        <button
          type="button"
          onClick={handleApproveAll}
          className="px-3.5 py-2 shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <CheckCircle className="w-4 h-4" /> Marcar Tudo como Conforme
        </button>
      </div>

      {/* Tabs navigation */}
      <div id="tabs-deck" className="flex border-b border-gray-200">
        <button
          type="button"
          onClick={() => setActiveTab('docs')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'docs'
              ? 'border-blue-600 text-blue-700 font-bold'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <FileText className="w-4 h-4" />
          Documentos & Certidões ({countDocsChecked}/{countDocsTotal})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('fisico')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'fisico'
              ? 'border-blue-600 text-blue-700 font-bold'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <HardHat className="w-4 h-4" />
          Auto-Vistoria Física ({countPhysicalChecked}/{countPhysicalTotal})
        </button>
      </div>

      {/* Active Tab rendering */}
      {activeTab === 'docs' ? (
        <div id="tab-documents-flow" className="space-y-6">
          
          <div id="doc-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* VENDEDOR */}
            <div id="sub-seller-docs" className="bg-white border border-gray-100 p-4 rounded-xl space-y-3 shadow-xs">
              <h4 className="font-bold text-gray-900 border-b border-gray-100 pb-2 text-xs uppercase text-blue-600">
                A) Vendedor (Pessoa Física/Jurídica)
              </h4>
              <p className="text-[10px] text-gray-400">Verifica que o atual proprietário não possui gravame ou restrição creditícia insolvente.</p>
              
              <div id="seller-list" className="space-y-2.5 pt-1">
                {documents.vendedor.map((item) => (
                  <label key={item.id} className="flex gap-2.5 p-2 bg-gray-50/60 rounded-lg hover:bg-gray-50 cursor-pointer border border-transparent transition-all hover:border-gray-200">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => handleToggleDoc('vendedor', item.id)}
                      className="rounded shrink-0 mt-0.5 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <div id={`label-item-${item.id}`} className="text-xs">
                      <p className="font-semibold text-gray-800 flex items-center gap-1">
                        {item.label}
                        {item.obrigatorio && <span className="text-[9px] font-bold text-red-500 bg-red-50 px-1.5 py-0.2 rounded">Obrigatório</span>}
                      </p>
                      <p className="text-[10px] text-gray-500 mt-0.5 leading-snug">{item.descricao}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* COMPRADOR */}
            <div id="sub-buyer-docs" className="bg-white border border-gray-100 p-4 rounded-xl space-y-3 shadow-xs">
              <h4 className="font-bold text-gray-900 border-b border-gray-100 pb-2 text-xs uppercase text-blue-600">
                B) Comprador (Proponente)
              </h4>
              <p className="text-[10px] text-gray-400">Garante a validade jurídica do proponente para o cadastro de alienação fiduciária.</p>
              
              <div id="buyer-list" className="space-y-2.5 pt-1">
                {documents.comprador.map((item) => (
                  <label key={item.id} className="flex gap-2.5 p-2 bg-gray-50/60 rounded-lg hover:bg-gray-50 cursor-pointer border border-transparent transition-all hover:border-gray-200">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => handleToggleDoc('comprador', item.id)}
                      className="rounded shrink-0 mt-0.5 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <div id={`label-buyer-${item.id}`} className="text-xs font-sans">
                      <p className="font-semibold text-gray-800 flex items-center gap-1">
                        {item.label}
                        {item.obrigatorio && <span className="text-[9px] font-bold text-red-500 bg-red-50 px-1.5 py-0.2 rounded">Obrigatório</span>}
                      </p>
                      <p className="text-[10px] text-gray-500 mt-0.5 leading-snug">{item.descricao}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* IMOVEL */}
            <div id="sub-property-docs" className="bg-white border border-gray-100 p-4 rounded-xl space-y-3 shadow-xs">
              <h4 className="font-bold text-gray-900 border-b border-gray-100 pb-2 text-xs uppercase text-blue-600">
                C) Imóvel (Regularidade Legal)
              </h4>
              <p className="text-[10px] text-gray-400">Regularidade fiscal e cartorária do imóvel. Interfere na segurança de execução de garantias.</p>
              
              <div id="property-list" className="space-y-2.5 pt-1">
                {documents.imovel.map((item) => {
                  const isHabitese = item.label.toLowerCase().includes('habite-se');
                  return (
                    <label key={item.id} className={`flex gap-2.5 p-2 rounded-lg hover:bg-gray-50 cursor-pointer border transition-all ${
                      isHabitese && !item.checked 
                        ? 'border-rose-200 bg-rose-50/40 hover:border-rose-400' 
                        : 'border-transparent bg-gray-50/60 hover:border-gray-200'
                    }`}>
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => handleToggleDoc('imovel', item.id)}
                        className="rounded shrink-0 mt-0.5 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <div id={`label-imovel-${item.id}`} className="text-xs">
                        <p className="font-semibold text-gray-800 flex items-center gap-1 flex-wrap">
                          {item.label}
                          {item.obrigatorio && <span className="text-[9px] font-bold text-red-500 bg-red-50 px-1.5 py-0.2 rounded">Mandatório</span>}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-0.5 leading-snug">{item.descricao}</p>
                        {isHabitese && !item.checked && (
                          <span className="inline-flex items-center gap-1 text-[9px] text-rose-700 font-bold mt-1 bg-rose-100 px-1 text-uppercase p-0.5 rounded">
                            ⚠️ Alerta: Sem habite-se é improvável financiar o imóvel!
                          </span>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      ) : (
        <div id="tab-physical-vistoria" className="space-y-6">
          
          <div id="physical-guidelines" className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-900 flex gap-3 text-xs">
            <ShieldAlert className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
            <div id="warn-p-ct">
              <p className="font-semibold">Auto-Vistoria Preventiva Construtiva</p>
              <p className="mt-1 leading-relaxed">
                As patologias físicas abaixo representam infiltrações graves ou falhas de fundações. Engenheiros credenciados por Caixa, BB e Itaú realizam vistorias in loco e rejeitam imóveis com danos críticos estruturais. Use este questionário para simular as condições que o vistoriador procurará.
              </p>
            </div>
          </div>

          <div id="physical-checklist-grid" className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {physicalChecks.map((item) => (
              <label key={item.id} className={`flex items-start gap-3 p-4 border rounded-xl hover:bg-gray-50 cursor-pointer transition-all ${
                item.checked 
                  ? 'border-gray-200 bg-white' 
                  : 'border-amber-200 bg-amber-50/30'
              }`}>
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => handleTogglePhysical(item.id)}
                  className="rounded shrink-0 mt-1 text-blue-600 focus:ring-blue-500 cursor-pointer w-4 h-4"
                />
                <div id={`label-phys-${item.id}`} className="text-xs">
                  <p className="font-semibold text-gray-900 flex items-center gap-2">
                    {item.label}
                    {item.checked ? (
                      <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.2 rounded-full">LIVRE/CONFORME</span>
                    ) : (
                      <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 border border-amber-200 px-1.5 py-0.2 rounded-full">PENDENTE/RISCO</span>
                    )}
                  </p>
                  <p className="text-gray-500 mt-1 leading-relaxed">{item.descricao}</p>
                </div>
              </label>
            ))}
          </div>

        </div>
      )}

      {/* Navigation Buttons */}
      <div id="step-2-controls" className="pt-4 border-t border-gray-100 flex justify-between">
        <button
          type="button"
          onClick={onPrev}
          className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 font-medium text-xs cursor-pointer"
        >
          ➔ Retornar aos Dados do Imóvel
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold shadow-md hover:bg-blue-700 transition-all flex items-center gap-2 text-sm cursor-pointer"
        >
          Continuar para Imóveis Comparáveis ➔
        </button>
      </div>

    </div>
  );
}
