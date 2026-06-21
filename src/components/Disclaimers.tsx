/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldAlert, BookOpen, UserCheck } from 'lucide-react';

export default function AvisoJuridico() {
  return (
    <div id="aviso-juridico-container" className="bg-amber-50 border border-amber-200 rounded-xl p-5 shadow-sm text-amber-900 leading-relaxed mb-6">
      <div className="flex items-start gap-4">
        <div id="icon-shield-alert" className="p-2 bg-amber-100 rounded-lg text-amber-700 shrink-0 mt-0.5">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div id="disclaimer-details" className="space-y-2">
          <h3 className="font-semibold text-amber-950 font-sans tracking-tight text-base">
            Informação Importante & Limitações do Simulador
          </h3>
          <p className="text-sm">
            Este aplicativo é uma <strong>ferramenta de simulação educacional preliminar</strong> e não possui de nenhuma forma caráter de laudo oficial, parecer técnico de avaliação mercadológica (PTAM) ou consultoria regulamentada. 
          </p>
          <div id="disclaimer-grid" className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs text-amber-805">
            <div id="disclaimer-col-1" className="flex gap-2">
              <UserCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>Não substitui a vistoria obrigatória realizada por engenheiro credenciado pelo agente financeiro.</span>
            </div>
            <div id="disclaimer-col-2" className="flex gap-2">
              <BookOpen className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>Baseado no Método Comparativo Direto simplificado, inspirado na norma técnica <strong>ABNT NBR 14653</strong>.</span>
            </div>
          </div>
          <p className="text-xs text-amber-700 pt-1 border-t border-amber-200 mt-2">
            * Cada instituição financeira possui critérios próprios, taxas mutáveis e análises seletivas de risco de crédito de compradores e restrições jurídicas que determinam os termos definitivos do contrato de financiamento habitacional.
          </p>
        </div>
      </div>
    </div>
  );
}
