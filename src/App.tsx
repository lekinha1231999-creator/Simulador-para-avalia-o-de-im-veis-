/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PropertyData, ComparableProperty, ChecklistDocumental, ChecklistItem, SimulationResult } from './types';
import { 
  DEFAULT_DOCUMENT_CHECKLIST, 
  DEFAULT_PHYSICAL_CHECKLIST, 
  SAMPLE_PROPERTY_HOUSE, 
  SAMPLE_COMPARABLES_HOUSE, 
  SAMPLE_PROPERTY_APT, 
  SAMPLE_COMPARABLES_APT 
} from './data/mockData';
import { calculateValuation } from './lib/valuationEngine';
import PropertyDataForm from './components/PropertyDataForm';
import ChecklistStepForm from './components/ChecklistStepForm';
import ComparablesStepForm from './components/ComparablesStepForm';
import DashboardResultView from './components/DashboardResultView';
import AvisoJuridico from './components/Disclaimers';
import { 
  Calculator, 
  Hammer, 
  ClipboardCheck, 
  LayoutDashboard, 
  Smartphone, 
  Monitor, 
  Wifi, 
  Battery, 
  Signal, 
  ChevronLeft, 
  Sparkles, 
  ShieldCheck, 
  Home, 
  Volume2, 
  Lock
} from 'lucide-react';

export default function App() {
  
  // Step State (1: Dados, 2: Checklists, 3: Comparados, 4: Resultado)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Subject Property State
  const [subjectProperty, setSubjectProperty] = useState<PropertyData>({
    tipo: 'casa',
    estado: 'SP',
    cidade: '',
    bairro: '',
    endereco: '',
    areaPrivativa: 120,
    areaTerreno: 200,
    quartos: 3,
    suites: 1,
    banheiros: 2,
    vagas: 1,
    idade: 10,
    padrao: 'medio',
    conservacao: 'bom',
    andar: 0,
    temElevador: false,
    temCondominio: false,
    taxaCondominio: 0,
    temLazer: false,
    temSeguranca: false,
    temInfraestrutura: true,
    rendaFamiliar: 7500,
    possuiOutroFinanciamento: false,
    valorDesejadoFinanciamento: 300000
  });

  // Comparables List
  const [comparables, setComparables] = useState<ComparableProperty[]>([]);

  // Checklists states
  const [documents, setDocuments] = useState<ChecklistDocumental>(
    JSON.parse(JSON.stringify(DEFAULT_DOCUMENT_CHECKLIST))
  );
  const [physicalChecks, setPhysicalChecks] = useState<ChecklistItem[]>(
    JSON.parse(JSON.stringify(DEFAULT_PHYSICAL_CHECKLIST))
  );

  // Simulation Engine result storage
  const [valuationResult, setValuationResult] = useState<SimulationResult | null>(null);
  const [adjustedComparables, setAdjustedComparables] = useState<any[]>([]);

  // Load sample scenarios (HouseCampinas or AptoBotafogo)
  const handleLoadDemo = (type: 'casa' | 'apartamento') => {
    if (type === 'casa') {
      setSubjectProperty(SAMPLE_PROPERTY_HOUSE);
      setComparables(SAMPLE_COMPARABLES_HOUSE);
      
      // Fully load appropriate checked items for high trust calculation demo
      setDocuments(JSON.parse(JSON.stringify(DEFAULT_DOCUMENT_CHECKLIST)));
      setPhysicalChecks(JSON.parse(JSON.stringify(DEFAULT_PHYSICAL_CHECKLIST)));
    } else {
      setSubjectProperty(SAMPLE_PROPERTY_APT);
      setComparables(SAMPLE_COMPARABLES_APT);
      
      setDocuments(JSON.parse(JSON.stringify(DEFAULT_DOCUMENT_CHECKLIST)));
      setPhysicalChecks(JSON.parse(JSON.stringify(DEFAULT_PHYSICAL_CHECKLIST)));
    }
    
    // Reset any previous calculations to force review
    setValuationResult(null);
  };

  // Perform core valuation calculations
  const handleCalculate = () => {
    // Count missing essential documentation (Checked is true means we HAVE the document, checked is false means MISSING)
    const missingDocsCount = 
      documents.vendedor.filter(d => d.obrigatorio && !d.checked).length +
      documents.comprador.filter(d => d.obrigatorio && !d.checked).length +
      documents.imovel.filter(d => d.obrigatorio && !d.checked).length;

    // Count missing essential safety conditions
    const missingPhysicalsCount = physicalChecks.filter(p => p.obrigatorio && !p.checked).length;

    // Check specific critical Habite-se condition in Imóvel
    const habiteseDocItem = documents.imovel.find(d => d.id === 'i-4');
    const hasNoHabitese = habiteseDocItem ? !habiteseDocItem.checked : false;

    const { result, adjustedComparables: adjs } = calculateValuation(
      subjectProperty,
      comparables,
      missingDocsCount,
      missingPhysicalsCount,
      hasNoHabitese
    );

    setValuationResult(result);
    setAdjustedComparables(adjs);
    setCurrentStep(4);
    
    // Smooth scroll page back to top to read dashboard metrics
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetAll = () => {
    setSubjectProperty({
      tipo: 'casa',
      estado: 'SP',
      cidade: '',
      bairro: '',
      endereco: '',
      areaPrivativa: 120,
      areaTerreno: 200,
      quartos: 3,
      suites: 1,
      banheiros: 2,
      vagas: 1,
      idade: 10,
      padrao: 'medio',
      conservacao: 'bom',
      andar: 0,
      temElevador: false,
      temCondominio: false,
      taxaCondominio: 0,
      temLazer: false,
      temSeguranca: false,
      temInfraestrutura: true,
      rendaFamiliar: 7500,
      possuiOutroFinanciamento: false,
      valorDesejadoFinanciamento: 300000
    });
    setComparables([]);
    setDocuments(JSON.parse(JSON.stringify(DEFAULT_DOCUMENT_CHECKLIST)));
    setPhysicalChecks(JSON.parse(JSON.stringify(DEFAULT_PHYSICAL_CHECKLIST)));
    setValuationResult(null);
    setAdjustedComparables([]);
    setCurrentStep(1);
  };

  // ==========================================
  // Android Emulation State & Interactions
  // ==========================================
  const [emulateAndroid, setEmulateAndroid] = useState<boolean>(true);
  const [isScreenOn, setIsScreenOn] = useState<boolean>(true);
  const [batteryLevel, setBatteryLevel] = useState<number>(92);
  const [showStatusNotification, setShowStatusNotification] = useState<string | null>(
    "Dispositivo Android Inicializado - Modo Homologado NBR 14653"
  );

  // Auto dismiss toast banner notifications
  React.useEffect(() => {
    if (showStatusNotification) {
      const timer = setTimeout(() => setShowStatusNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [showStatusNotification]);

  // Dynamic status bar clock ticker
  const [statusBarTime, setStatusBarTime] = useState<string>("20:34");
  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      setStatusBarTime(`${hrs}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 15000);
    return () => clearInterval(interval);
  }, []);

  // Side Hardware Key Simulation effects
  const handlePowerClick = () => {
    setIsScreenOn(prev => !prev);
    setShowStatusNotification(isScreenOn ? "Tela Suspensa (Economia de Energia)" : "Tela Simulador Ativada ✨");
  };

  const handleVolumeClick = (dir: 'up' | 'down') => {
    if (!isScreenOn) return;
    setBatteryLevel(prev => {
      const next = dir === 'up' ? Math.min(100, prev + 5) : Math.max(5, prev - 5);
      setShowStatusNotification(`Nível de Bateria do Emulador: ${next}% 🔋`);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-blue-900 selection:text-white transition-colors duration-300">
      
      {/* Dynamic Upper Top Control Panel - Desktop Only */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-md shadow-blue-900/30">
              <Smartphone className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-white">AvaliaBanc Mobile</h1>
                <span className="bg-emerald-500/20 text-emerald-400 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border border-emerald-500/30 tracking-wider">
                  Android OS 14
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Simulador de Engenharia de Garantias imobiliárias em conformidade normativa NBR 14653.
              </p>
            </div>
          </div>

          {/* Mode Switch Pills */}
          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
            <button
              onClick={() => setEmulateAndroid(true)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                emulateAndroid 
                  ? 'bg-blue-600 text-white shadow' 
                  : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>📱 Emulador Android</span>
            </button>
            <button
              onClick={() => {
                setEmulateAndroid(false);
                setIsScreenOn(true);
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                !emulateAndroid 
                  ? 'bg-blue-600 text-white shadow' 
                  : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>💻 Modo Tablet Expandido</span>
            </button>
          </div>
        </div>
      </div>

      {emulateAndroid ? (
        /* ============================================================ */
        /* PREMIUM ANDROID SMARTPHONE CHASSIS CONTEXT                   */
        /* ============================================================ */
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-radial from-slate-900 to-slate-950">
          
          {/* Main hardware wrapper containing buttons and active frame shadow */}
          <div className="relative flex items-center justify-center">
            
            {/* LEFT SIDE PHYSICAL KEYS (Volume Keys) */}
            <div className="absolute -left-[5px] top-44 flex flex-col gap-3 py-1 z-0">
              <button 
                onClick={() => handleVolumeClick('up')}
                className="w-[5px] h-12 bg-slate-800 hover:bg-slate-700 rounded-l active:scale-x-95 cursor-pointer border-r border-slate-950 shadow-xs"
                title="Aumentar Bateria (Atalho Vol+)"
              />
              <button 
                onClick={() => handleVolumeClick('down')}
                className="w-[5px] h-12 bg-slate-800 hover:bg-slate-700 rounded-l active:scale-x-95 cursor-pointer border-r border-slate-950 shadow-xs"
                title="Diminuir Bateria (Atalho Vol-)"
              />
            </div>

            {/* RIGHT SIDE PHYSICAL KEY (Power Key) */}
            <div className="absolute -right-[5px] top-60 z-0">
              <button 
                onClick={handlePowerClick}
                className="w-[5px] h-16 bg-red-800 hover:bg-red-700 rounded-r active:scale-x-95 cursor-pointer border-l border-slate-950 shadow-xs"
                title="Botão Liga/Desliga"
              />
            </div>

            {/* PHONE CHASSIS BODY */}
            <div className="w-[395px] max-w-full h-[812px] bg-slate-900 border-[10px] border-slate-950 rounded-[44px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col relative z-10 select-none">
              
              {/* SCREEN ON/OFF CONTEXT SWITCH */}
              {isScreenOn ? (
                /* SCREEN LAYER IS ACTIVE */
                <div className={`flex flex-col h-full bg-slate-50 text-slate-800 android-view-active overflow-hidden relative`}>
                  
                  {/* ANDROID SYSTEM STATUS BAR */}
                  <div className="bg-[#1e1b4b] text-white h-[28px] px-6 flex justify-between items-center text-[11px] font-sans shrink-0 font-medium z-30 select-none relative">
                    
                    {/* Time or Quick Clock indicator */}
                    <div className="flex items-center gap-1">
                      <span className="font-semibold tracking-tight">{statusBarTime}</span>
                      <div className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-ping ml-1" title="Nova Notificação" />
                    </div>

                    {/* Camera Hole Punch Notch */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-1.5 w-4 h-4 bg-black rounded-full border border-slate-900 z-50 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-blue-900/60 rounded-full" />
                    </div>

                    {/* Right side notification badges & device icons */}
                    <div className="flex items-center gap-2">
                      <Wifi className="w-3.5 h-3.5" />
                      <Signal className="w-3.5 h-3.5" />
                      <div className="flex items-center gap-0.5" title={`${batteryLevel}% de Bateria`}>
                        <Battery className="w-4 h-4 text-emerald-300" />
                        <span className="text-[9px] scale-90 font-mono font-bold">{batteryLevel}%</span>
                      </div>
                    </div>
                  </div>

                  {/* ANDROID SYSTEM TOP APP BAR (Material 3 Style AppHeader) */}
                  <div className="bg-[#1e1b4b] text-white px-4 pb-3 pt-1 shadow-sm flex items-center justify-between gap-2 shrink-0 z-20">
                    <div className="flex items-center gap-2">
                      {currentStep > 1 && (
                        <button
                          onClick={() => setCurrentStep(prev => prev - 1)}
                          className="p-1 px-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 active:scale-95 transition-all text-xs cursor-pointer flex items-center gap-1"
                        >
                          <ChevronLeft className="w-4 h-4" /> Voltar
                        </button>
                      )}
                      <div>
                        <h2 className="text-sm font-black tracking-tight leading-4 flex items-center gap-1.5 text-ellipsis overflow-hidden">
                          ✨ AvaliaBanc
                        </h2>
                        <span className="text-[9px] text-indigo-200 block truncate font-medium">Simulador Residencial NBR 14653</span>
                      </div>
                    </div>

                    <span className="text-[10px] bg-indigo-500/30 px-2 py-0.5 rounded-full border border-indigo-500/25 font-mono text-indigo-200 uppercase font-bold shrink-0">
                      Passo {currentStep}/4
                    </span>
                  </div>

                  {/* ANDROID VIEWPORT SCROLLABLE CONTENT BODY */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar pb-10 bg-slate-50 relative">
                    
                    {/* Live Toast Banner Notifications */}
                    {showStatusNotification && (
                      <div className="bg-indigo-950 text-white p-3 rounded-xl border border-indigo-700/60 shadow-lg text-[11px] leading-relaxed animate-fadeIn absolute top-2 left-4 right-4 z-50 flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>{showStatusNotification}</span>
                      </div>
                    )}

                    {/* Step view display mapped inside android viewport config */}
                    <div className="space-y-4">
                      {currentStep === 1 && (
                        <div className="space-y-4">
                          <AvisoJuridico />
                          <PropertyDataForm
                            data={subjectProperty}
                            onChange={(updated) => setSubjectProperty((prev) => ({ ...prev, ...updated }))}
                            onNext={() => setCurrentStep(2)}
                            onLoadExample={handleLoadDemo}
                          />
                        </div>
                      )}

                      {currentStep === 2 && (
                        <ChecklistStepForm
                          documents={documents}
                          physicalChecks={physicalChecks}
                          onDocumentsChange={setDocuments}
                          onPhysicalChecksChange={setPhysicalChecks}
                          onPrev={() => setCurrentStep(1)}
                          onNext={() => setCurrentStep(3)}
                        />
                      )}

                      {currentStep === 3 && (
                        <ComparablesStepForm
                          comparables={comparables}
                          onComparablesChange={setComparables}
                          onPrev={() => setCurrentStep(2)}
                          onCalculate={handleCalculate}
                          subjectNeighborhood={subjectProperty.bairro}
                        />
                      )}

                      {currentStep === 4 && valuationResult && (
                        <DashboardResultView
                          subject={subjectProperty}
                          result={valuationResult}
                          adjustedComparables={adjustedComparables}
                          documents={documents}
                          physicalChecks={physicalChecks}
                          onBack={() => setCurrentStep(3)}
                          onReset={handleResetAll}
                        />
                      )}
                    </div>
                  </div>

                  {/* ANDROID BOTTOM NAVIGATION BAR (Material 3 Style Tablet/Bottom tabs navigation) */}
                  <div className="bg-[#f8fafc] border-t border-slate-200 px-3 py-1 bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] flex justify-around items-center h-[58px] shrink-0 select-none z-30 transition-all shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
                    {[
                      { step: 1, label: "Imóvel", icon: <Home className="w-4 h-4" />, disabled: false },
                      { step: 2, label: "Vistoria", icon: <ClipboardCheck className="w-4 h-4" />, disabled: !(subjectProperty.areaPrivativa && subjectProperty.rendaFamiliar && subjectProperty.cidade) && currentStep < 2 },
                      { step: 3, label: "Amostras", icon: <Hammer className="w-4 h-4" />, disabled: !(subjectProperty.areaPrivativa && subjectProperty.rendaFamiliar) && currentStep < 3 },
                      { step: 4, label: "Relatório", icon: <LayoutDashboard className="w-4 h-4" />, disabled: valuationResult === null }
                    ].map((tab) => {
                      const isActive = currentStep === tab.step;
                      return (
                        <button
                          key={tab.step}
                          onClick={() => !tab.disabled && setCurrentStep(tab.step)}
                          disabled={tab.disabled}
                          className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1 transition-all relative ${
                            tab.disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                          }`}
                        >
                          {/* M3 Active Backdrop Highlight Pill */}
                          <div className={`px-4 py-1 rounded-full transition-all flex items-center justify-center ${
                            isActive 
                              ? 'bg-indigo-100 text-[#1e1b4b] font-black' 
                              : 'text-slate-500 hover:text-slate-800'
                          }`}>
                            {tab.icon}
                          </div>
                          <span className={`text-[8.5px] tracking-wide font-semibold mt-0.5 transition-all ${
                            isActive ? 'text-[#1e1b4b] font-extrabold' : 'text-slate-500'
                          }`}>
                            {tab.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* ANDROID NAVIGATION GESTURES PILL BAR */}
                  <div className="bg-[#f1f5f9] h-[15px] w-full flex justify-center items-center shrink-0 z-30 pb-1 select-none">
                    <div className="w-28 h-1 bg-slate-400 rounded-full transition-colors" />
                  </div>

                </div>
              ) : (
                /* SCREEN LAYER IS SUSPENDED / OFF */
                <div className="bg-black w-full h-full flex flex-col items-center justify-center text-slate-700 animate-fadeIn relative">
                  <Lock className="w-10 h-10 mb-2 opacity-30 text-white animate-pulse" />
                  <span className="text-xs text-slate-500 font-mono">Dispositivo Bloqueado</span>
                  <button 
                    onClick={() => setIsScreenOn(true)}
                    className="mt-6 px-4 py-2 bg-slate-900 border border-slate-800 rounded-full hover:bg-slate-800 text-[10px] text-slate-300 font-bold tracking-widest cursor-pointer transition-all"
                  >
                    ATIVAR TELA
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      ) : (
        /* ============================================================ */
        /* STANDARD DUAL-VIEW TABLET/DESKTOP OPTIMIZED LAYOUT           */
        /* ============================================================ */
        <main id="main-app-container" className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6">
          
          <AvisoJuridico />

          {/* Steps navigation toolbar */}
          <div id="step-indicator-wrapper" className="bg-slate-900 rounded-xl border border-slate-800 p-4 shadow-sm">
            <div className="grid grid-cols-4 gap-2 text-center">
              
              <button
                onClick={() => currentStep > 1 && setCurrentStep(1)}
                disabled={currentStep === 4}
                className={`p-2.5 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-2 text-xs font-semibold cursor-pointer transition-all ${
                  currentStep === 1 
                    ? 'bg-blue-600 text-white font-black shadow-lg shadow-blue-905/30' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                }`}
              >
                <Calculator className="w-4 h-4 shrink-0" />
                <span>1. Dados do Imóvel</span>
              </button>

              <button
                onClick={() => currentStep > 2 && setCurrentStep(2)}
                disabled={!(subjectProperty.areaPrivativa && subjectProperty.rendaFamiliar && subjectProperty.cidade) || currentStep === 4}
                className={`p-2.5 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-2 text-xs font-semibold cursor-pointer transition-all ${
                  currentStep === 2 
                    ? 'bg-blue-600 text-white font-black shadow-lg shadow-blue-905/30' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed'
                }`}
              >
                <ClipboardCheck className="w-4 h-4 shrink-0" />
                <span>2. Certidões & Vistorias</span>
              </button>

              <button
                onClick={() => currentStep > 3 && setCurrentStep(3)}
                disabled={!(subjectProperty.areaPrivativa && subjectProperty.rendaFamiliar) || currentStep === 4}
                className={`p-2.5 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-2 text-xs font-semibold cursor-pointer transition-all ${
                  currentStep === 3 
                    ? 'bg-blue-600 text-white font-black shadow-lg shadow-blue-905/30' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed'
                }`}
              >
                <Hammer className="w-4 h-4 shrink-0" />
                <span>3. Imóveis Comparados</span>
              </button>

              <button
                disabled={valuationResult === null}
                onClick={() => valuationResult && setCurrentStep(4)}
                className={`p-2.5 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-2 text-xs font-semibold cursor-pointer transition-all ${
                  currentStep === 4 
                    ? 'bg-blue-600 text-white font-black shadow-lg shadow-blue-905/30' 
                    : 'text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span>4. Relatório do Laudo</span>
              </button>

            </div>
          </div>

          <div id="step-active-content-box" className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl animate-fadeIn">
            {currentStep === 1 && (
              <PropertyDataForm
                data={subjectProperty}
                onChange={(updated) => setSubjectProperty((prev) => ({ ...prev, ...updated }))}
                onNext={() => setCurrentStep(2)}
                onLoadExample={handleLoadDemo}
              />
            )}

            {currentStep === 2 && (
              <ChecklistStepForm
                documents={documents}
                physicalChecks={physicalChecks}
                onDocumentsChange={setDocuments}
                onPhysicalChecksChange={setPhysicalChecks}
                onPrev={() => setCurrentStep(1)}
                onNext={() => setCurrentStep(3)}
              />
            )}

            {currentStep === 3 && (
              <ComparablesStepForm
                comparables={comparables}
                onComparablesChange={setComparables}
                onPrev={() => setCurrentStep(2)}
                onCalculate={handleCalculate}
                subjectNeighborhood={subjectProperty.bairro}
              />
            )}

            {currentStep === 4 && valuationResult && (
              <DashboardResultView
                subject={subjectProperty}
                result={valuationResult}
                adjustedComparables={adjustedComparables}
                documents={documents}
                physicalChecks={physicalChecks}
                onBack={() => setCurrentStep(3)}
                onReset={handleResetAll}
              />
            )}
          </div>

        </main>
      )}

      {/* Dynamic educational footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 px-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-3xl mx-auto space-y-3">
          <p className="font-bold text-slate-300">AvaliaBanc - Engenharia Imobiliária & Crédito Habitacional</p>
          <p className="leading-relaxed">
            As fórmulas, coeficientes de padrão constritivo, idade aparente, conservação e amortizações simuladas neste aplicativo utilizam critérios representativos estatísticos inspirados nas recomendações da ABNT NBR 14653. Elas não expressam de forma soberana as taxas atuais vigentes nos balcões das agências da Caixa Econômica Federal ou outras bandeiras privadas brasileiras. O enquadramento nos sistemas SFH ou Minha Casa Minha Vida requer correspondência com a renda e validação de documentação cadastral ordinária.
          </p>
        </div>
      </footer>
    </div>
  );
}
