/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  PhoneCall, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Coins, 
  Users, 
  HelpCircle, 
  Copy, 
  Download, 
  ExternalLink, 
  Volume2, 
  VolumeX, 
  Sliders, 
  Search, 
  Send,
  Zap,
  ArrowRight,
  Shield,
  Code,
  Activity,
  Award,
  ChevronRight,
  ChevronDown,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  SPEC_BLUEPRINTS, 
  MOCK_PAYER_LOGOS, 
  MOCK_TESTIMONIALS, 
  SIMULATION_SCENARIOS, 
  GENERAL_FAQS,
  SpecSection,
  SimulatorScenario
} from './data';

export default function App() {
  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<'landing' | 'blueprint'>('landing');
  const [copiedSectionIndex, setCopiedSectionIndex] = useState<number | null>(null);
  
  // Custom Simulator State
  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState(0);
  const [customScenario, setCustomScenario] = useState<any | null>(null);
  const currentScenario = customScenario || SIMULATION_SCENARIOS[selectedScenarioIdx];
  const [simStatus, setSimStatus] = useState<'idle' | 'running' | 'completed'>('idle');
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [transcriptLines, setTranscriptLines] = useState<{ speaker: 'ai' | 'rep' | 'system', text: string }[]>([]);
  const [isWaveActive, setIsWaveActive] = useState(false);
  const [bypassHoldActive, setBypassHoldActive] = useState(false);
  const transcriptBottomRef = useRef<HTMLDivElement>(null);

  // Custom Form Inputs
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [isCustomLoading, setIsCustomLoading] = useState(false);
  const [customForm, setCustomForm] = useState({
    patientName: '',
    dob: '',
    memberId: '',
    payer: 'MetLife Dental',
    npi: '',
    serviceCode: 'D2740 (Porcelain Crown)',
    providerType: 'Dental'
  });

  // Persistent Clinical Verification Inbox/Ledger
  const [verifications, setVerifications] = useState<any[]>(() => {
    const stored = localStorage.getItem('donedial_ledger');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {}
    }
    return [
      {
        id: 'metlife-ortho-hist',
        patientName: 'Johnathan Doe',
        dob: '11/24/1988',
        memberId: 'MET-89542319',
        payer: 'MetLife Dental',
        npi: '1942385501',
        requestedService: 'Major Orthodontics - Code D8080 (Braces)',
        timestamp: new Date(Date.now() - 4 * 60 * 60000).toISOString(),
        result: {
          insuranceStatus: 'Active Coverage',
          deductible: '$50.00',
          deductibleMet: 'Yes ($50/50 Met)',
          coinsurance: '50% (Patient pays half)',
          copay: 'N/A',
          maxBenefit: '$1,500.00 (Lifetime)',
          maxBenefitMet: '$0.00 met',
          outOfPocket: 'Subject to 50% co-insurance up to Lifetime limit',
          preAuthRequired: false,
          redFlags: [
            "CRITICAL DENIAL RISK: Orthodontia is limited to dependents under age 19. Patient is 37 years old. This claim WILL be denied if submitted.",
            "Work-in-progress clause: Covered only if dental bands were placed while MetLife plan was already active."
          ],
          payerReferenceNum: "MET-Eligibility-9943"
        },
        steps: SIMULATION_SCENARIOS[0].steps
      },
      {
        id: 'bcbs-medical-hist',
        patientName: 'Matthew Miller',
        dob: '09/02/1982',
        memberId: 'BCB-4921204',
        payer: 'Blue Cross Blue Shield (BCBS) PPO',
        npi: '1249553018',
        requestedService: 'Specialist Consultation - Code 99244',
        timestamp: new Date(Date.now() - 32 * 60 * 60000).toISOString(),
        result: {
          insuranceStatus: 'Active Coverage',
          deductible: '$1,000.00 (Waived for Consultation)',
          deductibleMet: 'No ($0.00 Met)',
          coinsurance: '0% after patient copay',
          copay: '$35.00 Copayment',
          maxBenefit: 'Unlimited',
          maxBenefitMet: 'N/A',
          outOfPocket: '$35.00 copay strictly for office consultation. Secondary diagnostic codes subject to $1,000 deductible.',
          preAuthRequired: true,
          redFlags: [
            "CRITICAL PRE-AUTH REQUIRED: Outpatient Specialist Code 99244 requires prior authorization referral from primary care provider.",
            "SECONDARY CODE ALERT: Copay is consult-only. Scopes or basic diagnostics are subject to $1,000 deductible."
          ],
          payerReferenceNum: "BC-9941-Miller"
        },
        steps: SIMULATION_SCENARIOS[2].steps
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('donedial_ledger', JSON.stringify(verifications));
  }, [verifications]);

  const [activeLedgerItem, setActiveLedgerItem] = useState<any | null>(null);

  // ROI Calculator State
  const [providerCount, setProviderCount] = useState(3);
  const [weeklyHoldHours, setWeeklyHoldHours] = useState(10);
  const [averageWriteoffCost, setAverageWriteoffCost] = useState(350);
  const [denialsPerMonth, setDenialsPerMonth] = useState(2);

  // Pricing State
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  // FAQ State
  const [expandedFaqIdx, setExpandedFaqIdx] = useState<number | null>(null);

  // Mock Hold Music Player State
  const [isPlayingHoldMusic, setIsPlayingHoldMusic] = useState(false);
  const [holdMusicType, setHoldMusicType] = useState<'jazz' | 'beep' | 'static'>('jazz');

  // Onboarding Form State
  const [onboardForm, setOnboardForm] = useState({
    name: '',
    email: '',
    practiceName: '',
    providersCount: '1-3',
    notes: ''
  });
  const [isOnboardSubmitted, setIsOnboardSubmitted] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

  // Developer Spec Viewer Filters
  const [specSearch, setSpecSearch] = useState('');
  const [selectedSpecIdx, setSelectedSpecIdx] = useState(0);

  // Audio Context (Synthesizer) for hold music and tone simulators
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorNodeRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Handle auto-scroll inside the live transcription window
  useEffect(() => {
    if (transcriptBottomRef.current) {
      transcriptBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [transcriptLines]);

  // Lead modal autofill handler based on calculators
  const openLeadModalWithDefaults = () => {
    setOnboardForm(prev => ({
      ...prev,
      providersCount: providerCount <= 3 ? '1-3' : '4-5',
      notes: `Interested in saving an estimated ${calculatedSavings.timeSaved} hours of weekly hold time and preventing $${calculatedSavings.monthlyLoss} in monthly denials.`
    }));
    setIsLeadModalOpen(true);
  };

  // ROI calculations
  const calculatedSavings = (() => {
    const hourlyRate = 22; // front desk coordinator average wage
    const monthlyStaffCost = weeklyHoldHours * 4 * hourlyRate * providerCount;
    const monthlyDenialCost = denialsPerMonth * averageWriteoffCost;
    
    // Total gross loss before Donedial
    const monthlyLoss = monthlyStaffCost + monthlyDenialCost;
    const yearlyLoss = monthlyLoss * 12;

    // Cost of Donedial (Pro Tier)
    const donedialMonthlyCost = 200 * providerCount;
    const pricingModifier = billingCycle === 'annual' ? 0.8 : 1.0;
    const donedialEffectiveCost = donedialMonthlyCost * pricingModifier;

    // Recovered net savings with Donedial (assuming 95% efficiency)
    const timeSaved = Math.round(weeklyHoldHours * providerCount * 0.95);
    const netMonthlySavings = Math.round((monthlyLoss * 0.95) - donedialEffectiveCost);
    const netYearlySavings = netMonthlySavings * 12;

    return {
      monthlyStaffCost,
      monthlyLoss,
      yearlyLoss,
      donedialEffectiveCost,
      timeSaved,
      netMonthlySavings,
      netYearlySavings
    };
  })();

  // Core voice simulator logic
  useEffect(() => {
    let timer: any;
    if (simStatus === 'running') {
      const scenario = currentScenario;
      if (scenario && scenario.steps && currentStepIdx < scenario.steps.length) {
        const step = scenario.steps[currentStepIdx];
        
        // Handle custom timing effects
        setIsWaveActive(step.type === 'talk');
        setBypassHoldActive(step.type === 'hold');

        timer = setTimeout(() => {
          // If step contains text dialogue, append to transcript
          if (step.transcript) {
            setTranscriptLines(prev => [
              ...prev, 
              { speaker: (step.speaker === 'ai' || step.speaker === 'rep' || step.speaker === 'system') ? step.speaker : 'system', text: step.transcript || '' }
            ]);
          }

          // Move to next step or finish
          if (currentStepIdx + 1 < scenario.steps.length) {
            setCurrentStepIdx(prev => prev + 1);
          } else {
            setSimStatus('completed');
            setIsWaveActive(false);
            setBypassHoldActive(false);
          }
        }, step.duration);
      }
    }
    return () => clearTimeout(timer);
  }, [simStatus, currentStepIdx, currentScenario]);

  const startSimulation = () => {
    setSimStatus('running');
    setCurrentStepIdx(0);
    setTranscriptLines([]);
    setIsWaveActive(false);
    setBypassHoldActive(false);
  };

  const resetSimulation = () => {
    setSimStatus('idle');
    setCurrentStepIdx(0);
    setTranscriptLines([]);
    setIsWaveActive(false);
    setBypassHoldActive(false);
  };

  // Mock Hold Music Synthesizer
  const playSynthesizerNotes = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      oscillatorNodeRef.current = osc;
      gainNodeRef.current = gain;

      gain.gain.setValueAtTime(0.06, ctx.currentTime);

      if (holdMusicType === 'jazz') {
        // Play funny arpeggios that sound like a distorted hold line
        osc.type = 'triangle';
        let noteIdx = 0;
        const notes = [261.63, 329.63, 392.00, 493.88, 523.25, 493.88, 392.00, 329.63]; // C Major scale arpeggio
        
        const noteTimer = setInterval(() => {
          if (!isPlayingHoldMusic || !oscillatorNodeRef.current) {
            clearInterval(noteTimer);
            return;
          }
          const nextFreq = notes[noteIdx % notes.length];
          osc.frequency.setValueAtTime(nextFreq, ctx.currentTime);
          noteIdx++;
        }, 400);
      } else if (holdMusicType === 'beep') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        let beepOn = true;
        
        const beepTimer = setInterval(() => {
          if (!isPlayingHoldMusic || !gainNodeRef.current) {
            clearInterval(beepTimer);
            return;
          }
          gain.gain.setValueAtTime(beepOn ? 0.05 : 0.0, ctx.currentTime);
          beepOn = !beepOn;
        }, 800);
      } else {
        // Crackly noise synth approximation using continuous quick frequency jumps
        osc.type = 'sine';
        const staticTimer = setInterval(() => {
          if (!isPlayingHoldMusic || !oscillatorNodeRef.current) {
            clearInterval(staticTimer);
            return;
          }
          osc.frequency.setValueAtTime(100 + Math.random() * 800, ctx.currentTime);
          gain.gain.setValueAtTime(0.01 + Math.random() * 0.04, ctx.currentTime);
        }, 50);
      }

      osc.start();
    } catch (e) {
      console.warn('Audio Context failed, standard fallback activated', e);
    }
  };

  const stopSynthesizerNotes = () => {
    if (oscillatorNodeRef.current) {
      try {
        oscillatorNodeRef.current.stop();
        oscillatorNodeRef.current.disconnect();
      } catch (e) {}
      oscillatorNodeRef.current = null;
    }
    gainNodeRef.current = null;
  };

  const toggleHoldMusic = (type: 'jazz' | 'beep' | 'static') => {
    if (isPlayingHoldMusic) {
      stopSynthesizerNotes();
      if (holdMusicType === type) {
        setIsPlayingHoldMusic(false);
        return;
      }
    }
    
    setHoldMusicType(type);
    setIsPlayingHoldMusic(true);
    // Short delay to ensure state sets before triggering note loop
    setTimeout(() => {
      stopSynthesizerNotes();
      playSynthesizerNotes();
    }, 50);
  };

  useEffect(() => {
    return () => {
      stopSynthesizerNotes();
    };
  }, []);

  // Spec Copy & Clipboard handler
  const handleCopySpecSection = (idx: number, spec: SpecSection) => {
    const formattedText = `
SECTION COMPONENT: ${spec.title}
--------------------------------------------------
WIREFRAME DETAIL: ${spec.wireframe}
COPYWRITING ELEMENTS:
${spec.copy.map((c, i) => `   [Line ${i+1}] ${c}`).join('\n')}
--------------------------------------------------
CONVERSION ADVICE: ${spec.tips}
    `;

    navigator.clipboard.writeText(formattedText);
    setCopiedSectionIndex(idx);
    setTimeout(() => setCopiedSectionIndex(null), 2500);
  };

  const handleCopyFullBlueprint = () => {
    const fullBlueprint = JSON.stringify(SPEC_BLUEPRINTS, null, 2);
    navigator.clipboard.writeText(fullBlueprint);
    alert('Full Blueprint specification copied to your clipboard in structured JSON format! You can easily hand this directly to any developer, GPT, or AI builder.');
  };

  // Onboard Submit Logic
  const handleOnboardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onboardForm.name || !onboardForm.email || !onboardForm.practiceName) {
      alert('Please fill out all required fields.');
      return;
    }

    // Save state to localStorage to mimic persistent database storage for registrations
    const mockLeadId = 'lead_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem(mockLeadId, JSON.stringify({
      ...onboardForm,
      timestamp: new Date().toISOString(),
      calculatedSavings
    }));

    setIsOnboardSubmitted(true);
    setTimeout(() => {
      setIsOnboardSubmitted(false);
      setIsLeadModalOpen(false);
      setOnboardForm({ name: '', email: '', practiceName: '', providersCount: '1-3', notes: '' });
      alert('Thank you! Your clinic pilot inquiry has been registered. Our health integration team will contact your office manager in under 24 hours to schedule the custom sandbox connection.');
    }, 1800);
  };

  // Save current verification slip to our ledger box dynamically
  const handleSaveVerificationToLedger = () => {
    if (!currentScenario || !currentScenario.result) return;
    
    // Check duplication
    const exists = verifications.some(v => v.id === currentScenario.id || (v.patientName === currentScenario.patientName && v.payer === currentScenario.payer && Math.abs(new Date(v.timestamp).getTime() - Date.now()) < 5 * 60000));
    if (exists) {
      alert('This active benefit slip is already saved in your Clinical Ledger.');
      return;
    }

    const newItem = {
      id: currentScenario.id || 'sim_' + Math.floor(10000 + Math.random() * 90000),
      patientName: currentScenario.patientName,
      dob: currentScenario.dob,
      memberId: currentScenario.memberId,
      payer: currentScenario.payer,
      npi: currentScenario.npi,
      requestedService: currentScenario.requestedService || 'Eligibility Check',
      timestamp: new Date().toISOString(),
      result: currentScenario.result,
      steps: currentScenario.steps
    };

    const updated = [newItem, ...verifications];
    setVerifications(updated);
    alert(`Successfully synced benefit verification for ${currentScenario.patientName} to your Clinic Ledger Dashboard!`);
  };

  const handleDeleteLedgerItem = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the verified benefit record for ${name}?`)) {
      setVerifications(prev => prev.filter(v => v.id !== id));
      if (activeLedgerItem && activeLedgerItem.id === id) {
        setActiveLedgerItem(null);
      }
    }
  };

  // Submit custom form parameters and dial out live through Express Gemini integration
  const handleCustomSimulationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customForm.patientName || !customForm.dob || !customForm.memberId) {
      alert('Please fill out all patient credentials to dial out.');
      return;
    }

    setIsCustomLoading(true);
    resetSimulation();

    // Map automatically providerType depending on treatment code
    const isMedicalCode = customForm.serviceCode.includes('992') || customForm.providerType === 'Medical';
    const finalForm = {
      ...customForm,
      providerType: isMedicalCode ? 'Medical' : 'Dental'
    };

    try {
      const resp = await fetch('/api/simulate-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(finalForm)
      });
      if (!resp.ok) {
        throw new Error('Payer server failed.');
      }
      const data = await resp.json();
      setCustomScenario(data);
      setIsCustomLoading(false);
      
      // Auto-trigger simulation!
      setSimStatus('running');
      setCurrentStepIdx(0);
      setTranscriptLines([]);
    } catch (error) {
      console.warn('Real-time Gemini simulation offline, engaging custom high-fidelity algorithmic generator.', error);
      // Create high quality fallback immediately on frontend as a fail-safe measure
      const id = 'sim_fallback_' + Math.floor(1000 + Math.random() * 9000);
      let coinsurance = '80% covered (In-network)';
      let deductible = '$50.00 Standard Individual';
      let deductibleMet = 'Yes ($50.00 met)';
      let maxBenefit = '$2,000.00 Annual Maximum';
      let maxBenefitMet = '$150.00 met ($1,850.00 remaining)';
      let copay = 'N/A';
      let preAuthRequired = false;
      let redFlags = [
        `PROMPT ACTION REQUIRED: Confirm ${customForm.payer} active member status at date of service.`,
        "Always document the representative voice operator verification code for claim records."
      ];

      const codeUpper = customForm.serviceCode.toUpperCase();
      if (codeUpper.includes('D2740') || codeUpper.includes('CROWN')) {
        coinsurance = '50% covered (Major service)';
        redFlags = [
          `CRITICAL DOWNGRADE WARNING: ${customForm.payer} downgrades posterior porcelain crown restorations to amalgam composite rates. Patient must sign financial waiver for difference.`,
          "7-YEAR REPLACEMENT EXCLUSION: Crowns are excluded if performed on the same tooth position during the previous seven years."
        ];
      } else if (codeUpper.includes('D8080') || codeUpper.includes('ORTHO') || codeUpper.includes('BRACES')) {
        coinsurance = '50% covered (Lifetime maximum maxes)';
        maxBenefit = '$1,500.00 Orthodontic Lifetime Maximum (Separate)';
        redFlags = [
          "DEPENDENT AGE LIMIT INFORCE: Orthodontia coverage terminates exactly on patient's 19th birthday. Adult orthodontia is explicitly excluded.",
          "Work-in-progress clause: Bands must have been placed while active member on this policy to claim full cost."
        ];
      } else if (codeUpper.includes('D4341') || codeUpper.includes('SCALING') || codeUpper.includes('PLANING')) {
        coinsurance = '80% covered (Periodontal specialty)';
        preAuthRequired = true;
        redFlags = [
          "PRIOR MEDICAL PROOF REQUIRED: Submitting dentist must append periodontal charting from past 12 months showcasing 4+ pocket levels over 4mm and radiographic evidence of bone loss.",
          "FREQUENCY EXCLUDED: Covered only once every 24 calendar months per quadrant area."
        ];
      } else if (codeUpper.includes('D1110') || codeUpper.includes('PROPHY') || codeUpper.includes('CLEANING')) {
        coinsurance = '100% covered (Preventive waived)';
        deductible = '$0.00 waived for preventive';
        deductibleMet = 'N/A (Deductible Waived)';
        redFlags = [
          "TWICE A CALENDAR YEAR RULE: Strict frequency limit of two prophylactic cleaning sessions per year. Verify on patient chart past cleanings in other dental coordinates.",
          "Adult vs. Child code mismatch: Patient is age-eligible for Adult Prophy. Do not submit D1120."
        ];
      } else if (codeUpper.includes('992') || codeUpper.includes('99213') || codeUpper.includes('CONSULT')) {
        coinsurance = '100% after copayment';
        copay = '$30.00 Specialist Copay';
        preAuthRequired = true;
        redFlags = [
          `OUTPATIENT REFERRAL REQ: This specialist code requires active referral from referring Primary Care Provider (PCP) in the gateway system.`,
          "Diagnostic restrictions: Basic consult checks exclude concurrent specialized in-office scopes or biopsies, which are subject to general high-deductible levels."
        ];
      }

      // Generate steps
      const steps = [
        { status: 'Initializing Outbound Line', subtext: `Deploying secure AI router node on carrier network queue for ${customForm.payer}`, duration: 1000, type: 'dial' as const },
        { status: 'Connected. Navigating IVR prompts', subtext: `Injecting NPI: ${customForm.npi || '1093122177'} into automated voice interface...`, duration: 1200, type: 'ivr' as const },
        { status: 'Submitting member criteria', subtext: `Providing Member ID: ${customForm.memberId} and Patient DOB: ${customForm.dob}`, duration: 1500, type: 'ivr' as const },
        { status: 'Circumventing hold queue', subtext: `Skipping estimated 24-minute payer waiting queue... Holding active status.`, duration: 2000, type: 'hold' as const },
        { 
          status: 'Payer Representative Pick-up', 
          subtext: `${customForm.payer} Rep: "Thank you for dialing Rebecca. NPI and practice verification please?"`, 
          duration: 1800, 
          type: 'talk' as const, 
          speaker: 'rep' as const, 
          transcript: `${customForm.payer} Rep: "Thank you for dialing Rebecca. NPI and practice verification please?"` 
        },
        { 
          status: 'AI verifying credentials', 
          subtext: `Donedial: "Authenticating NPI ${customForm.npi || '1093122177'}. Patients name is ${customForm.patientName}..."`, 
          duration: 2000, 
          type: 'talk' as const, 
          speaker: 'ai' as const, 
          transcript: `Donedial: "Hello Rebecca. I am verifying coverage for patient ${customForm.patientName}, DOB: ${customForm.dob}, Member ID: ${customForm.memberId}. We are requesting general eligibility and specific guidelines for treatment code ${customForm.serviceCode}."` 
        },
        { 
          status: 'Representative response recorded', 
          subtext: `${customForm.payer} Rep: "Patient active. Deductibles and treatment percentage details compiled."`, 
          duration: 2200, 
          type: 'talk' as const, 
          speaker: 'rep' as const, 
          transcript: `${customForm.payer} Rep: "I can look that up. The patient profile is active. Standard benefits apply for other procedures. For procedure ${customForm.serviceCode}, coverage rate is ${coinsurance}. Annual deductible is fifty dollars."` 
        },
        { 
          status: 'AI scanning secondary risks', 
          subtext: `Donedial: "Thank you. Are there specific waiting periods or frequency exclusions on this tooth position?"`, 
          duration: 1800, 
          type: 'talk' as const, 
          speaker: 'ai' as const, 
          transcript: `Donedial: "Excellent. Rebecca, does this policy enforce frequency limitations or alternate downgrades for this procedure position?"` 
        },
        { 
          status: 'Exclusion clauses received', 
          subtext: `${customForm.payer} Rep: "Yes, exclusions apply. Reference number logged: ID-FALLBACK-${Math.floor(10000+Math.random()*90000)}"`, 
          duration: 2405, 
          type: 'talk' as const, 
          speaker: 'rep' as const, 
          transcript: `${customForm.payer} Rep: "Yes, standard policy rules apply. Copay is ${copay}. Frequency limits and downcode rules apply as designated. Pre-auth is ${preAuthRequired ? 'required' : 'not explicitly required'}. Outpatient reference confirmation ID is FALLBACK-${Math.floor(100000+Math.random()*900000)}."` 
        },
        { status: 'Structuring insurance receipt...', subtext: 'Mapping transcript to the clinic database standard framework.', duration: 1000, type: 'format' as const }
      ];

      const localMockResult = {
        id,
        patientName: customForm.patientName,
        providerType: isMedicalCode ? 'Medical' : 'Dental',
        payer: customForm.payer,
        npi: customForm.npi || '1093122177',
        memberId: customForm.memberId,
        dob: customForm.dob,
        requestedService: customForm.serviceCode,
        steps,
        result: {
          insuranceStatus: 'Active Coverage',
          deductible,
          deductibleMet,
          coinsurance,
          copay,
          maxBenefit,
          maxBenefitMet,
          outOfPocket: `Approx. patient responsibility based on ${coinsurance} co-insurance scheme. Check specific procedure code limits.`,
          preAuthRequired,
          redFlags,
          payerReferenceNum: `FALLBACK-${Math.floor(100000+Math.random()*900000)}`
        }
      };

      setCustomScenario(localMockResult);
      setIsCustomLoading(false);
      setSimStatus('running');
      setCurrentStepIdx(0);
      setTranscriptLines([]);
    }
  };

  // Filtered spec blueprints list
  const filteredSpecBlueprints = SPEC_BLUEPRINTS.filter(spec => 
    spec.title.toLowerCase().includes(specSearch.toLowerCase()) ||
    spec.copy.some(c => c.toLowerCase().includes(specSearch.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#fafbfc] text-[#1e293b] font-sans antialiased selection:bg-teal-100 selection:text-teal-900">
      
      {/* Floating Status / Backdoor Navigation Bar */}
      <nav id="navbar" className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo and Identity */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-teal-600 text-white shadow-md shadow-teal-600/20">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <span className="font-display font-bold text-xl tracking-tight text-slate-900">donedial</span>
                <span className="ml-2 px-2 py-0.5 text-[10px] font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-md">Voice Agent AI</span>
              </div>
            </div>

            {/* View Mode Toggle Tabs */}
            <div className="hidden md:flex items-center space-x-1 bg-slate-100/80 p-1 rounded-xl">
              <button 
                id="btn-nav-landing"
                onClick={() => setActiveTab('landing')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'landing' 
                    ? 'bg-white text-slate-900 shadow-xs' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Interactive Landing Page
              </button>
              <button 
                id="btn-nav-blueprint"
                onClick={() => setActiveTab('blueprint')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'blueprint' 
                    ? 'bg-white text-slate-900 shadow-xs' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Developer Blueprint Spec
              </button>
            </div>

            {/* Utilities and CTAs */}
            <div className="flex items-center space-x-3">
              <span className="hidden lg:inline-flex items-center space-x-1.5 px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-50 rounded-lg">
                <Activity className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
                <span>Payer Gateway Active</span>
              </span>

              {activeTab === 'landing' ? (
                <button 
                  id="btn-header-cta"
                  onClick={openLeadModalWithDefaults}
                  className="px-4 py-2 text-xs font-bold text-white bg-slate-950 hover:bg-slate-800 rounded-xl transition shadow-xs"
                >
                  Onboard Clinic
                </button>
              ) : (
                <button 
                  id="btn-header-copy-spec"
                  onClick={handleCopyFullBlueprint}
                  className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl transition"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Full JSON Spec</span>
                </button>
              )}
            </div>

          </div>
        </div>
      </nav>

      {/* Header Warning Banner for Mobile Toggle */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-300">Switching Viewmodes:</span>
        <div className="flex bg-slate-800 p-0.5 rounded-lg border border-slate-700">
          <button 
            onClick={() => setActiveTab('landing')}
            className={`px-3 py-1 font-medium rounded-md ${activeTab === 'landing' ? 'bg-teal-600 text-white' : 'text-slate-400'}`}
          >
            UI Preview
          </button>
          <button 
            onClick={() => setActiveTab('blueprint')}
            className={`px-3 py-1 font-medium rounded-md ${activeTab === 'blueprint' ? 'bg-teal-600 text-white' : 'text-slate-400'}`}
          >
            Blueprint Spec
          </button>
        </div>
      </div>

      {/* Main Container */}
      <main className="mx-auto">

        {/* =========================================
            VIEW 1: INTERACTIVE HIGH-CONVERTING LANDING PREVIEW
            ========================================= */}
        {activeTab === 'landing' && (
          <div>
            
            {/* HERO SECTION BLOCK */}
            <header className="relative pt-10 pb-20 bg-gradient-to-b from-slate-50 via-slate-50/50 to-white overflow-hidden">
              <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,var(--color-teal-100),transparent_40%)]" />
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  
                  {/* Left Column: Core Copy Messaging */}
                  <div className="lg:col-span-7 space-y-8">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-100">
                      <Zap className="w-3.5 h-3.5 text-teal-600" />
                      <span className="text-xs font-bold text-teal-800 tracking-wide uppercase">⚡ Pre-Visit Benefits Automation</span>
                    </div>

                    <h1 className="font-display font-medium text-4xl sm:text-5xl lg:text-6xl text-slate-950 tracking-tight leading-[1.08]">
                      Stop wasting <span className="relative inline-block text-slate-900 font-semibold underline decoration-teal-500/80 decoration-4">10 hours a week</span> on hold with insurers.
                    </h1>

                    <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
                      Donedial is the AI voice agent built specifically for dental and family medical clinics. 
                      Coordinators drop patient details, and our agent automatically dials the payer, navigates the IVR system, and delivers complete, structured benefits in under 3 minutes.
                    </p>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 max-w-md">
                      <button 
                        id="btn-hero-primary-cta"
                        onClick={openLeadModalWithDefaults}
                        className="flex items-center justify-center space-x-2 px-7 py-4 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 active:scale-95 rounded-2xl transition shadow-lg shadow-teal-600/10 cursor-pointer"
                      >
                        <span>Start Onboarding Pilot</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <a 
                        href="#simulator"
                        className="flex items-center justify-center space-x-1 px-6 py-4 text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-2xl transition"
                      >
                        <span>Run Demo Simulator</span>
                      </a>
                    </div>

                    {/* Social proof trust badges */}
                    <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-y-4 gap-x-8 text-xs text-slate-500">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-teal-600" />
                        <span><strong>74,000+</strong> verified appointments</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-teal-600" />
                        <span><strong>12,400+</strong> hold-hours saved</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-teal-600" />
                        <span><strong>99.4%</strong> translation accuracy</span>
                      </div>
                    </div>

                  </div>

                  {/* Right Column: Live Call Simulator Widget */}
                  <div id="simulator" className="lg:col-span-5">
                    <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl p-6 relative overflow-hidden text-slate-300">
                      
                      {/* Widget Header */}
                      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                        <div className="flex items-center space-x-2.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
                          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-teal-400">donedial-voice-v1.4</span>
                        </div>
                        <span className="text-[10px] font-mono bg-slate-800 text-teal-400 px-2 py-0.5 rounded-md">Live Stream</span>
                      </div>

                      {/* Presets / Custom Togglers */}
                      <div className="flex bg-slate-950 p-1 rounded-xl mt-3 border border-slate-800 select-none">
                        <button
                          type="button"
                          onClick={() => {
                            setIsCustomMode(false);
                            setCustomScenario(null);
                            resetSimulation();
                          }}
                          className={`flex-1 py-1.5 text-center text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                            !isCustomMode
                              ? 'bg-teal-600 text-white shadow-xs'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          Scenario Presets
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsCustomMode(true);
                            resetSimulation();
                          }}
                          className={`flex-1 py-1.5 text-center text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                            isCustomMode
                              ? 'bg-teal-600 text-white shadow-xs'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          Verify Custom Patient (AI)
                        </button>
                      </div>

                      {!isCustomMode ? (
                        <>
                          {/* Dropdown to select scenario */}
                          <div className="mt-4 space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Select Call Scenario (Payer Profile)</label>
                            <select 
                              id="select-scenario"
                              value={selectedScenarioIdx} 
                              onChange={(e) => {
                                setSelectedScenarioIdx(Number(e.target.value)); 
                                setCustomScenario(null);
                                resetSimulation();
                              }}
                              className="w-full bg-slate-800 text-white font-semibold text-xs py-2.5 px-3 rounded-xl border border-slate-700 focus:outline-none focus:border-teal-500 cursor-pointer"
                            >
                              {SIMULATION_SCENARIOS.map((sc, index) => (
                                <option key={sc.id} value={index}>{sc.payer} • {sc.patientName} ({sc.providerType})</option>
                              ))}
                            </select>
                          </div>

                          {/* Scenario Detail Cards */}
                          <div className="mt-4 bg-slate-950 rounded-xl p-3 text-[11px] space-y-1.5 border border-slate-800/80 font-mono">
                            <div className="flex justify-between"><span className="text-slate-500">Member ID:</span> <span className="text-white font-medium">{currentScenario.memberId}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Service:</span> <span className="text-teal-400 font-medium">{currentScenario.requestedService}</span></div>
                          </div>
                        </>
                      ) : (
                        <div className="mt-4 bg-slate-950 rounded-xl p-2.5 text-[10px] text-teal-400 font-mono border border-slate-800/80">
                          ⚡ Real-scale LLM mode initialized. Populate credentials inside the simulation gateway screen below and dial out.
                        </div>
                      )}

                      {/* Screen Content Panel */}
                      <div className="mt-4 h-64 bg-slate-950 rounded-xl border border-slate-800 p-4 flex flex-col justify-between overflow-hidden">
                        
                        {/* Stream state logs */}
                        {simStatus === 'idle' && !isCustomLoading && (
                          !isCustomMode ? (
                            <div id="sim-idle-state" className="flex flex-col items-center justify-center h-full space-y-4 text-center">
                              <div className="w-12 h-12 rounded-full bg-teal-950/30 border border-teal-500/20 text-teal-400 flex items-center justify-center animate-bounce">
                                <PhoneCall className="w-6 h-6" />
                              </div>
                              <div className="space-y-1 max-w-[280px]">
                                <p className="text-xs font-semibold text-white">Interactive Voice Agent Simulation</p>
                                <p className="text-[10px] text-slate-500 font-mono">Run the simulation to see Donedial dial the insurance carrier and navigate IVR voice prompts in real-time.</p>
                              </div>
                            </div>
                          ) : (
                            /* GORGEOUS SCROLLABLE INPUT FORM */
                            <form onSubmit={handleCustomSimulationSubmit} className="flex-1 flex flex-col overflow-y-auto pr-1 space-y-2.5 text-xs text-slate-300 custom-scrollbar text-left">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold text-slate-500 uppercase">Patient Name</label>
                                  <input 
                                    type="text" 
                                    required
                                    placeholder="e.g. Sarah J. Connor"
                                    value={customForm.patientName}
                                    onChange={e => setCustomForm({...customForm, patientName: e.target.value})}
                                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[11px] text-white focus:outline-none focus:border-teal-500 font-mono"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold text-slate-500 uppercase">DOB</label>
                                  <input 
                                    type="text" 
                                    required
                                    placeholder="MM/DD/YYYY"
                                    value={customForm.dob}
                                    onChange={e => setCustomForm({...customForm, dob: e.target.value})}
                                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[11px] text-white focus:outline-none focus:border-teal-500 font-mono"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold text-slate-500 uppercase">Member ID</label>
                                  <input 
                                    type="text" 
                                    required
                                    placeholder="e.g. MET-993215"
                                    value={customForm.memberId}
                                    onChange={e => setCustomForm({...customForm, memberId: e.target.value})}
                                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[11px] text-white focus:outline-none focus:border-teal-500 font-mono"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold text-slate-500 uppercase">Doctor NPI (Optional)</label>
                                  <input 
                                    type="text" 
                                    placeholder="e.g. 1093122177"
                                    value={customForm.npi}
                                    onChange={e => setCustomForm({...customForm, npi: e.target.value})}
                                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[11px] text-white focus:outline-none focus:border-teal-500 font-mono"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 gap-2">
                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold text-slate-500 uppercase">Insurance Carrier (Payer)</label>
                                  <select 
                                    value={customForm.payer}
                                    onChange={e => setCustomForm({...customForm, payer: e.target.value})}
                                    className="w-full bg-slate-900 border border-slate-850 rounded px-2 py-1 text-[11px] text-white focus:outline-none focus:border-teal-500 font-mono select-none"
                                  >
                                    <option value="MetLife Dental">MetLife Dental</option>
                                    <option value="Delta Dental Premier">Delta Dental Premier</option>
                                    <option value="Aetna Dental PPO">Aetna Dental PPO</option>
                                    <option value="Cigna Dental">Cigna Dental</option>
                                    <option value="Ameritas Specialty">Ameritas Specialty</option>
                                    <option value="Blue Cross Blue Shield (BCBS) PPO">BCBS PPO (Medical/Dental)</option>
                                    <option value="UnitedHealthcare Dental">UnitedHealthcare Dental</option>
                                    <option value="Guardian Benefit Plan">Guardian Benefit Plan</option>
                                  </select>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 gap-2">
                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold text-slate-500 uppercase">Treatment Code requested</label>
                                  <select 
                                    value={customForm.serviceCode}
                                    onChange={e => setCustomForm({...customForm, serviceCode: e.target.value})}
                                    className="w-full bg-slate-900 border border-slate-850 rounded px-2 py-1 text-[11px] text-white focus:outline-none focus:border-teal-500 font-mono"
                                  >
                                    <option value="D2740 (Porcelain Crown) - Major Restoration">D2740 (Porcelain Crown) - Major Restoration</option>
                                    <option value="D8080 (Ortho Braces) - Comprehensive Orthodontic">D8080 (Ortho Braces) - Comprehensive Orthodontic</option>
                                    <option value="D4341 (Scaling & Root Planing) - Periodontal">D4341 (Scaling / Periodontal Scaling)</option>
                                    <option value="D1110 (Adult Prophy) - Preventive Cleaning">D1110 (Adult Prophy / Cleaning)</option>
                                    <option value="99213 (Specialist Consult Office Visit) - Medical">99213 (Specialist Office Consult) - Medical Code</option>
                                  </select>
                                </div>
                              </div>

                              <button 
                                type="submit"
                                className="w-full py-2 bg-teal-650 hover:bg-teal-600 active:scale-98 rounded text-[11px] font-bold text-white transition font-mono mt-1 flex items-center justify-center space-x-1 uppercase tracking-wider cursor-pointer"
                              >
                                <PhoneCall className="w-3 h-3 animate-pulse" />
                                <span>📞 DIAL LIVE AI CO-PILOT</span>
                              </button>
                            </form>
                          )
                        )}

                        {/* Custom Form Loading Spinner State */}
                        {isCustomLoading && (
                          <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                            <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                            <div className="text-center">
                              <p className="text-xs text-white font-mono font-bold uppercase tracking-wider animate-pulse">Establishing Outbound Trunk...</p>
                              <p className="text-[9px] text-slate-500 font-mono">Routing HIPAA-compliant server-bound secure token</p>
                            </div>
                          </div>
                        )}

                        {/* Running State Transcription Box */}
                        {(simStatus === 'running' || simStatus === 'completed') && (
                          <div className="flex-1 flex flex-col min-h-0 text-left">
                            
                            {/* Running status bar */}
                            <div className="flex items-center justify-between pb-2 border-b border-slate-905 text-[10px] font-mono">
                              <span className="text-slate-500">Target: {currentScenario.payer}</span>
                              <span className="text-teal-400 animate-pulse flex items-center space-x-1">
                                <span className="w-1.5 h-1.5 bg-teal-400 rounded-full inline-block" />
                                <span>{currentScenario.steps[currentStepIdx]?.status || 'Wrapping up'}</span>
                              </span>
                            </div>

                            {/* Live transcription content (scrolling) */}
                            <div id="sim-transcript-window" className="flex-1 overflow-y-auto py-2 pr-1 space-y-2.5 custom-scrollbar text-[11px] font-mono">
                              
                              {/* Initial dial logs */}
                              <div className="text-[10px] text-slate-500">
                                [SYS]: Establishing node credentials. Provider NPI {currentScenario.npi} loaded. Attempting line trigger...
                              </div>

                              {transcriptLines.map((line, i) => (
                                <div 
                                  key={i} 
                                  className={`p-2 rounded-lg leading-relaxed ${
                                    line.speaker === 'ai' 
                                      ? 'bg-teal-900/10 text-teal-300 border-l-2 border-teal-500' 
                                      : line.speaker === 'rep'
                                        ? 'bg-amber-900/10 text-amber-300 border-l-2 border-amber-500'
                                        : 'bg-slate-900 text-slate-400'
                                  }`}
                                >
                                  {line.text}
                                </div>
                              ))}

                              {/* Bypassing queue placeholder */}
                              {bypassHoldActive && (
                                <div className="p-3 bg-teal-900/20 text-teal-300 border border-teal-500/20 rounded-lg text-center animate-pulse space-y-1">
                                  <div className="font-semibold text-xs">🚀 18-42 Minute Hold Bypassed</div>
                                  <p className="text-[9px] text-slate-400">Our machine line manager absorbs the background elevator music while maintaining connectivity status.</p>
                                </div>
                              )}

                              {/* Step indicator status text */}
                              {simStatus === 'running' && (
                                <div className="text-[9px] text-slate-600 animate-pulse italic">
                                  Donedial: {currentScenario.steps[currentStepIdx]?.subtext}...
                                </div>
                              )}

                              <div ref={transcriptBottomRef} />
                            </div>

                          </div>
                        )}

                        {/* Interactive Sound Wave Bar */}
                        <div className="h-4 flex items-center justify-center space-x-0.5 mt-2">
                          {[...Array(16)].map((_, i) => (
                            <div 
                              key={i} 
                              className={`w-1 rounded-sm bg-teal-500 transition-all ${
                                isWaveActive 
                                  ? 'h-3 animate-pulse' 
                                  : 'h-1.5'
                              }`} 
                              style={{
                                animationDelay: `${i * 80}ms`,
                                animationDuration: isWaveActive ? `${0.5 + Math.random() * 0.8}s` : '1s'
                              }}
                            />
                          ))} 
                        </div>

                      </div>

                      {/* Control Panel / Actions */}
                      <div className="mt-4 flex items-center justify-between gap-3 text-xs">
                        {simStatus === 'idle' ? (
                          !isCustomMode ? (
                            <button 
                              id="btn-play-sim"
                              onClick={startSimulation}
                              className="flex-1 bg-teal-600 hover:bg-teal-500 text-white font-bold py-2.5 px-4 rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer"
                            >
                              <Zap className="w-3.5 h-3.5" />
                              <span>Run Voice Call Simulation</span>
                            </button>
                          ) : (
                            <div className="text-[10px] text-center font-mono text-slate-500 w-full bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                              👆 Populate credentials above & click "Dial Live AI..."
                            </div>
                          )
                        ) : simStatus === 'running' ? (
                          <div className="flex-1 flex gap-2">
                            <button 
                              onClick={resetSimulation}
                              className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2.5 px-4 rounded-xl transition flex-1 text-center cursor-pointer"
                            >
                              Reset Call
                            </button>
                          </div>
                        ) : (
                          <button 
                            id="btn-reset-sim"
                            onClick={() => {
                              resetSimulation();
                              if (isCustomMode) {
                                setCustomScenario(null);
                              }
                            }}
                            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-205 font-bold py-2.5 px-4 rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer"
                          >
                            <span>Clear & Try Another</span>
                          </button>
                        )}
                      </div>

                      {/* Simulation Structured Output Result Panel */}
                      <AnimatePresence>
                        {simStatus === 'completed' && (
                          <motion.div 
                             id="sim-result-card"
                             initial={{ opacity: 0, y: 15 }}
                             animate={{ opacity: 1, y: 0 }}
                             exit={{ opacity: 0, y: 15 }}
                             className="mt-4 bg-slate-950 p-4 rounded-xl border border-teal-500/30 text-xs space-y-3 text-left"
                           >
                            <div className="flex justify-between items-center pb-2 border-b border-slate-900">
                              <span className="font-semibold text-teal-400">Generated Benefit Slip Receipt</span>
                              <span className="font-mono text-[9px] text-slate-500">Ref# {currentScenario.result.payerReferenceNum}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                              <div><span className="text-slate-500">Status:</span> <span className="text-emerald-400 font-bold">{currentScenario.result.insuranceStatus}</span></div>
                              <div><span className="text-slate-500">Coinsurance:</span> <span className="text-slate-300">{currentScenario.result.coinsurance}</span></div>
                              <div><span className="text-slate-500">Deductible:</span> <span className="text-slate-300">{currentScenario.result.deductible}</span></div>
                              <div><span className="text-slate-500">Deductible Met:</span> <span className="text-slate-300">{currentScenario.result.deductibleMet}</span></div>
                              <div><span className="text-slate-500">Annual/Lifetime Max:</span> <span className="text-slate-300">{currentScenario.result.maxBenefit}</span></div>
                              <div><span className="text-slate-500">Max Met:</span> <span className="text-slate-300">{currentScenario.result.maxBenefitMet}</span></div>
                            </div>

                            {/* Custom Actionable Warning Warnings */}
                            <div className="p-2 bg-red-950/40 border border-red-500/20 rounded-lg text-[10px] text-red-300 space-y-1 font-sans">
                              <div className="font-semibold flex items-center space-x-1">
                                <AlertTriangle className="w-3 h-3 text-red-400" />
                                <span>Actionable Denial Risks Detected</span>
                              </div>
                              <ul className="list-disc list-inside space-y-1 text-slate-300 leading-normal pl-0.5">
                                {currentScenario.result.redFlags.map((flag, idx) => (
                                  <li key={idx}>{flag}</li>
                                ))}
                              </ul>
                            </div>

                            <div className="flex gap-2">
                              <button 
                                id="btn-result-lead"
                                onClick={handleSaveVerificationToLedger}
                                className="flex-1 py-1.5 px-3 bg-teal-600 hover:bg-teal-500 font-bold rounded-lg text-white transition text-center cursor-pointer"
                              >
                                Save This To Clinic Ledger
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                    </div>
                  </div>

                </div>

              </div>
            </header>

            {/* TRUST INDICATORS STRIP (Logo Area & Main stats) */}
            <section className="py-8 bg-slate-900 border-y border-slate-800 text-slate-400 select-none overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <p className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-6">
                  Reverse-Engineered Integration and Connectivity with Major Payers
                </p>

                <div className="grid grid-cols-2 md:grid-cols-6 gap-6 items-center justify-items-center opacity-70">
                  {MOCK_PAYER_LOGOS.map((logo) => (
                    <div key={logo.name} className="flex flex-col items-center justify-center p-2 rounded-xl transition hover:opacity-100 hover:bg-slate-800/20 cursor-default">
                      <span className="font-display font-semibold text-white tracking-tight">{logo.name}</span>
                      <span className="text-[8px] font-mono tracking-wider text-slate-500 text-center block mt-0.5">{logo.type}</span>
                    </div>
                  ))}
                </div>

                {/* Sarah Jenkins block below strip */}
                <div className="mt-8 pt-6 border-t border-slate-800/60 flex flex-col md:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
                  <div className="flex items-center space-x-3 text-left">
                    <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100" alt="Sarah Jenkins" className="w-10 h-10 rounded-full border border-slate-700 object-cover" />
                    <div>
                      <p className="text-xs text-slate-200 italic">"We used to have 4 phones going at once just for payer hold lines. Now Donedial handles them while clinicians check-in patients."</p>
                      <p className="text-[10px] text-slate-500 font-semibold mt-0.5"> Sarah Jenkins, Office Director @ Apex Dental (3 Providers)</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center font-mono">
                    <div>
                      <div className="text-xs font-bold text-white">11 Mins</div>
                      <div className="text-[8px] uppercase tracking-wider text-slate-500">Avg Hold Bypassed</div>
                    </div>
                    <div className="w-px h-6 bg-slate-800" />
                    <div>
                      <div className="text-xs font-bold text-teal-400">99.4%</div>
                      <div className="text-[8px] uppercase tracking-wider text-slate-500">Audit accuracy</div>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* LIVE PRACTICE HISTORY LEDGER / VERIFIED BENEFIT SLIPS */}
            <section className="py-16 bg-white border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 text-left">
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-teal-700 bg-teal-50 border border-teal-100 px-3 py-1 rounded-md uppercase tracking-wider">Payer Stream Client</span>
                    <h2 className="font-display font-semibold text-3xl text-slate-950 tracking-tight">
                      Benefit Eligibility Ledger
                    </h2>
                    <p className="text-sm text-slate-600 max-w-xl">
                      Real-time clinical record registry of successfully completed carrier voice verifications. Click PMS Slip to format for copy-pasting directly into patient files.
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 text-xs font-mono text-slate-500 bg-slate-50 border border-slate-150 p-2.5 rounded-xl">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block animate-pulse" />
                    <span>Database Connection: Synchronised</span>
                  </div>
                </div>

                {verifications.length === 0 ? (
                  <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto mb-3 animate-pulse" />
                    <p className="text-sm font-semibold text-slate-600">No Patient Scans Saved</p>
                    <p className="text-xs text-slate-400 mt-1">Dial selected scenarios or input a custom AI credential set above to register verification records instantly.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {verifications.map((item) => (
                      <div 
                        key={item.id} 
                        className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all p-5 flex flex-col justify-between text-left"
                      >
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <div className="text-left">
                              <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest leading-none">{item.payer}</p>
                              <h3 className="text-sm font-bold text-slate-900 mt-1 leading-tight">{item.patientName}</h3>
                            </div>
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-mono font-medium flex-shrink-0">
                              {item.providerType || 'Specialty'}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 py-3 border-y border-slate-100 text-[10.5px] font-mono text-slate-600">
                            <div><span className="text-slate-400">DOB:</span> <span className="text-slate-800 font-semibold">{item.dob || 'N/A'}</span></div>
                            <div><span className="text-slate-400">Member:</span> <span className="text-slate-800 font-semibold truncate inline-block max-w-[80px]">{item.memberId}</span></div>
                            <div className="col-span-2 text-left truncate">
                              <span className="text-slate-400">Check:</span> <span className="text-slate-800 font-semibold">{item.requestedService || 'Coverage Check'}</span>
                            </div>
                            <div className="col-span-2 text-left">
                              <span className="text-slate-400">Coinsurance:</span> <span className="text-teal-600 font-bold">{item.result?.coinsurance || 'N/A'}</span>
                            </div>
                          </div>

                          {item.result?.redFlags && item.result.redFlags.length > 0 && (
                            <div className="space-y-1.5">
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider text-left">Major exclusion denial alert:</p>
                              <div className="p-2 bg-red-50 text-[10px] text-red-800 border border-red-100 rounded-lg font-sans flex items-start space-x-1.5 leading-relaxed text-left">
                                <AlertTriangle className="w-3.5 h-3.5 text-red-500 mt-0.5 flex-shrink-0" />
                                <div className="font-semibold text-xs leading-normal">
                                  {item.result.redFlags[0]}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="mt-5 pt-4 border-t border-slate-150 flex items-center justify-between gap-2 text-left">
                          <span className="text-[9px] font-mono text-slate-400">
                            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <div className="flex space-x-1.5">
                            <button
                              onClick={() => {
                                const formattedText = `
*DONEDIAL AUTOMATED INSURANCE ELIGIBILITY CHECK*
Carrier: ${item.payer}
Patient Name: ${item.patientName} | DOB: ${item.dob || 'Unknown'}
Member ID: ${item.memberId}
Practice Doctor NPI: ${item.npi || '1093122177'}
Reference Confirmation code: ${item.result?.payerReferenceNum || 'DND-ELIG-MOCK'}
Coinsurance: ${item.result?.coinsurance || 'N/A'}
Deductible: ${item.result?.deductible || 'N/A'} | Met: ${item.result?.deductibleMet || 'N/A'}
Annual/Lifetime Max: ${item.result?.maxBenefit || 'N/A'} | Met: ${item.result?.maxBenefitMet || 'N/A'}
Exclusion Alert Warnings:
${item.result?.redFlags?.map((flag: string, i: number) => ` [Warning ${i+1}] ${flag}`).join('\n') || 'None'}
--------------------------------------------------
Verified automatically by Donedial Voice Integration node.
                                `;
                                navigator.clipboard.writeText(formattedText.trim());
                                alert(`FORMATTED PMS SLIP COPIED!\nYou can now paste directly into Eaglesoft, Dentrix, or OpenDental charts!`);
                              }}
                              className="text-[10px] py-1 px-2.5 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-600 rounded-lg transition-all font-semibold cursor-pointer"
                              title="Copy standard text layout"
                            >
                              PMS Slip
                            </button>
                            <button
                              onClick={() => setActiveLedgerItem(item)}
                              className="text-[10px] py-1 px-2.5 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg transition-all font-bold cursor-pointer"
                            >
                              Details
                            </button>
                            <button
                              onClick={() => handleDeleteLedgerItem(item.id, item.patientName)}
                              className="text-[10px] px-2 py-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-all cursor-pointer"
                              title="Delete Patient Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </section>

            {/* PROBLEM / PAIN INTERACTIVE PLAYGROUND (Hold Music Pain Simulator) */}
            <section className="py-20 bg-slate-50/50 border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
                  <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-md uppercase tracking-wider">The Problem</span>
                  <h2 className="font-display font-medium text-3xl sm:text-4xl text-slate-950 tracking-tight">
                    The hold music that costs you $2,000 per provider
                  </h2>
                  <p className="text-slate-600">
                    Front desks in dental and smaller doctor offices handles benefit verification the exact same way they did 20 years ago. 
                    Staff spends hours navigating complex automated phone menus only to arrive back where they started.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  
                  {/* High Pain bullet blocks */}
                  <div className="lg:col-span-6 space-y-6">
                    
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition">
                      <div className="flex space-x-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                          <Clock className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-bold text-slate-900 text-sm">The Office Hold Time Tax</h3>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            A primary medical or dental office of 1 to 5 providers wastes custom calculated 10+ hours a week sitting on standby lines with a telephone pressed to their ear.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition">
                      <div className="flex space-x-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                          <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-bold text-slate-900 text-sm">The Claim Denials Crisis</h3>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            Each missed coverage check or unobserved clause (e.g. alternate benefit downgrades, work-in-progress, coordination of benefit limits) results in denied insurance claims worth $200 to $2,000.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition">
                      <div className="flex space-x-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                          <Users className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-bold text-slate-900 text-sm">Staff Fatigue & High Turnover</h3>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            Your receptionists want to welcome patients and handle chair scheduling—not battle automated robot menus. Relieve billing specialists of hold strain to keep offices running happily.
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Interactive Pain Simulator (Funny hold music speaker) */}
                  <div className="lg:col-span-6">
                    <div id="hold-music-pain-box" className="p-6 bg-slate-900 rounded-3xl border border-slate-800 text-slate-300 text-center space-y-6 relative overflow-hidden">
                      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-500 via-amber-500 to-red-500" />
                      
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-red-400 font-semibold uppercase tracking-wider">Office Morale Test</span>
                        <h4 className="font-display text-white font-medium text-lg">Insurer Hold Music Simulator</h4>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto">Click below to experience the real, agonizing loop your receptionist endures for 40 minutes just to check a root-canal deductible.</p>
                      </div>

                      {/* Music box buttons representing different torture frequencies */}
                      <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto">
                        <button 
                          onClick={() => toggleHoldMusic('jazz')}
                          className={`py-3 px-2 rounded-xl text-xs font-bold transition border ${
                            isPlayingHoldMusic && holdMusicType === 'jazz'
                              ? 'bg-red-650 text-white border-red-500 shadow-lg animate-pulse'
                              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                          }`}
                        >
                          🎵 Distorted Elevator Jazz
                        </button>
                        <button 
                          onClick={() => toggleHoldMusic('beep')}
                          className={`py-3 px-2 rounded-xl text-xs font-bold transition border ${
                            isPlayingHoldMusic && holdMusicType === 'beep'
                              ? 'bg-red-650 text-white border-red-500 shadow-lg animate-pulse'
                              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                          }`}
                        >
                          🔈 Static Dial Beeps
                        </button>
                        <button 
                          onClick={() => toggleHoldMusic('static')}
                          className={`py-3 px-2 rounded-xl text-xs font-bold transition border ${
                            isPlayingHoldMusic && holdMusicType === 'static'
                              ? 'bg-red-650 text-white border-red-500 shadow-lg animate-pulse'
                              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                          }`}
                        >
                          📻 Infinite White Hiss
                        </button>
                      </div>

                      {/* Display active state of holding music */}
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] leading-relaxed max-w-xs mx-auto">
                        {isPlayingHoldMusic ? (
                          <div className="space-y-1.5 text-red-400 animate-pulse">
                            <Volume2 className="w-5 h-5 mx-auto text-red-500" />
                            <p className="font-semibold text-white">PLAYING: {holdMusicType.toUpperCase()} TUNES</p>
                            <p className="text-[10px] text-slate-500">"Please hold, your call is very important to us... Representative queue duration is forty-two minutes... [crackling noise]"</p>
                          </div>
                        ) : (
                          <div className="space-y-1 text-slate-500">
                            <VolumeX className="w-5 h-5 mx-auto text-slate-600" />
                            <p className="font-semibold">Music is Currently Off</p>
                            <p className="text-[10px]">Your front desk is currently silent. Click above to listen to how painful holds are.</p>
                          </div>
                        )}
                      </div>

                      {/* Risk message summary */}
                      <p className="text-xs font-bold text-red-300 bg-red-950/40 p-2.5 rounded-lg inline-block border border-red-900/30">
                        Donedial absorbs this wait entirely. Our voice nodes hold while your phone lines stay wide open for high-value client bookings.
                      </p>

                    </div>
                  </div>

                </div>

              </div>
            </section>

            {/* SOLUTION OVERVIEW & VALUE PROPOSITION */}
            <section className="py-20 bg-white border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
                  <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md uppercase tracking-wider">The Solution</span>
                  <h2 className="font-display font-medium text-3xl sm:text-4xl text-slate-950 tracking-tight">
                    The end-to-end verification agent for small practices
                  </h2>
                  <p className="text-slate-600">
                    We reverse-engineered carrier automated menus and dialed phone paths. Donedial turns manual administrative battles into structured coverage receipts under 3 minutes.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  
                  <div className="bg-[#fafbfc] p-8 rounded-2xl border border-slate-100 hover:border-slate-300 transition-all space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shadow-xs">
                      <PhoneCall className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg leading-tight">Automated Phone Navigation</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Donedial dials carrier systems, reads provider NPI credentials, Member IDs, and negotiates both digital verbal prompts and tone prompts to arrive at eligibility lines.
                    </p>
                  </div>

                  <div className="bg-[#fafbfc] p-8 rounded-2xl border border-slate-100 hover:border-slate-300 transition-all space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shadow-xs">
                      <Shield className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg leading-tight">Smart Denial-Defense Alerts</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      We highlight non-covered treatments, composite downcoding rules, frequency limitations, missing pre-auth requirements, and age restrictions on the spot.
                    </p>
                  </div>

                  <div className="bg-[#fafbfc] p-8 rounded-2xl border border-slate-100 hover:border-slate-300 transition-all space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shadow-xs">
                      <Zap className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg leading-tight">Zero Hold Waiting Loss</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Our system handles multiline calling concurrent stacks. Dial 15 carriers at once. Receive structured output in your dashboard the moment appointments are set.
                    </p>
                  </div>

                </div>

              </div>
            </section>

            {/* PROCESS MAP: HOW IT WORKS (Timeline cards) */}
            <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
              <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_left,var(--color-slate-800),transparent_40%)]" />
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                
                <div className="max-w-3xl mx-auto space-y-4 mb-16">
                  <span className="text-xs font-bold text-teal-400 font-mono tracking-wider uppercase">Simplified Workflow</span>
                  <h2 className="font-display font-medium text-3xl sm:text-4xl text-white tracking-tight">
                    Three steps. Under three minutes.
                  </h2>
                  <p className="text-slate-400">
                    Your coordinator provides the name, and Donedial delivers the completed insurance validation in under three minutes.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                  
                  <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 text-left space-y-4 relative">
                    <div className="text-3xl font-display font-bold text-teal-500 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 inline-block">01</div>
                    <h3 className="font-bold text-white text-lg">Input and Request</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Drop a patient name, date of birth, and plan identifier in your minimalist dashboard in seconds.
                    </p>
                  </div>

                  <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 text-left space-y-4 relative">
                    <div className="text-3xl font-display font-bold text-teal-500 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 inline-block">02</div>
                    <h3 className="font-bold text-white text-lg">AI Handles Carrier Call</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Our agent dials the specific carrier, navigates prompts, and transcripts conversation while bypassing hold queues.
                    </p>
                  </div>

                  <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 text-left space-y-4 relative">
                    <div className="text-3xl font-display font-bold text-teal-500 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 inline-block">03</div>
                    <h3 className="font-bold text-white text-lg">Structured Breakdown Analysis</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Receive clean insurance receipt breakdown detailing deductible limits, copays, out-of-pocket, and frequency risks.
                    </p>
                  </div>

                </div>

              </div>
            </section>

            {/* INTERACTIVE ROI SAVINGS CALCULATOR */}
            <section className="py-20 bg-slate-50/50 border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
                  <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md uppercase tracking-wider">Financial Efficiency</span>
                  <h2 className="font-display font-medium text-3xl sm:text-4xl text-slate-950 tracking-tight">
                    Calculate your office saved hours and prevented write-offs
                  </h2>
                  <p className="text-slate-600">
                    Use our live financial model to determine total receptionist time restored, eliminated denials, and your exact net return on investment.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
                  
                  {/* Left Column: Interactive Sliders */}
                  <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-8">
                    <div className="flex items-center space-x-2 pb-4 border-b border-slate-100">
                      <Sliders className="w-5 h-5 text-teal-600" />
                      <h3 className="font-bold text-slate-900 text-base">Adjust Your Practice Profile</h3>
                    </div>

                    {/* Slider 1: Provider counts */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>Number of Providers in Office</span>
                        <span className="text-teal-600 font-mono text-sm bg-teal-50 px-2.5 py-0.5 rounded-md">{providerCount} {providerCount === 1 ? 'Provider' : 'Providers'}</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="10" 
                        value={providerCount} 
                        onChange={(e) => setProviderCount(Number(e.target.value))}
                        className="w-full accent-teal-600 bg-slate-100 h-2 rounded-lg cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                        <span>1 Provider</span>
                        <span>5 Providers</span>
                        <span>10 Providers</span>
                      </div>
                    </div>

                    {/* Slider 2: Average Hold Hours */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>Hold Time spent weekly per provider (Hrs)</span>
                        <span className="text-teal-600 font-mono text-sm bg-teal-50 px-2.5 py-0.5 rounded-md">{weeklyHoldHours} Hours/wk</span>
                      </div>
                      <input 
                        type="range" 
                        min="2" 
                        max="40" 
                        value={weeklyHoldHours} 
                        onChange={(e) => setWeeklyHoldHours(Number(e.target.value))}
                        className="w-full accent-teal-600 bg-slate-100 h-2 rounded-lg cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                        <span>2 Hrs</span>
                        <span>20 Hrs</span>
                        <span>40 Hrs</span>
                      </div>
                    </div>

                    {/* Slider 3: Denied Claims Count */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>Avg Monthly Claim Denials Prevented</span>
                        <span className="text-teal-600 font-mono text-sm bg-teal-50 px-2.5 py-0.5 rounded-md">{denialsPerMonth} Claims/mo</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="10" 
                        value={denialsPerMonth} 
                        onChange={(e) => setDenialsPerMonth(Number(e.target.value))}
                        className="w-full accent-teal-600 bg-slate-100 h-2 rounded-lg cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                        <span>0 Claims</span>
                        <span>5 Claims</span>
                        <span>10 Claims</span>
                      </div>
                    </div>

                    {/* Slider 4: Hold Cost writeoffs */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>Average Cost of a Denied Write-off</span>
                        <span className="text-teal-600 font-mono text-sm bg-teal-50 px-2.5 py-0.5 rounded-md">${averageWriteoffCost}</span>
                      </div>
                      <input 
                        type="range" 
                        min="100" 
                        max="1500" 
                        step="50"
                        value={averageWriteoffCost} 
                        onChange={(e) => setAverageWriteoffCost(Number(e.target.value))}
                        className="w-full accent-teal-600 bg-slate-100 h-2 rounded-lg cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                        <span>$100</span>
                        <span>$800</span>
                        <span>$1,500</span>
                      </div>
                    </div>

                  </div>

                  {/* Right Column: Calculations Outputs */}
                  <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 p-8 rounded-3xl text-white flex flex-col justify-between border border-slate-800 shadow-xl">
                    
                    <div className="space-y-6">
                      <p className="text-[10px] uppercase font-mono font-bold tracking-widest text-teal-400">Your Clinic Saved Hours & Returns</p>
                      
                      <div className="grid grid-cols-2 gap-4 pb-6 border-b border-slate-800">
                        <div>
                          <p className="text-[10px] text-slate-500 font-mono uppercase">Weekly Hold Saved</p>
                          <p className="text-2xl font-bold font-display text-white mt-1">{calculatedSavings.timeSaved} Hours</p>
                          <p className="text-[9px] text-slate-400">Restored to patient care</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 font-mono uppercase">Yearly Gross Loss</p>
                          <p className="text-2xl font-bold font-display text-red-400 mt-1">${(calculatedSavings.yearlyLoss).toLocaleString()}</p>
                          <p className="text-[9px] text-slate-400 font-medium">Wasted on manual queue lines</p>
                        </div>
                      </div>

                      <div className="space-y-3 pt-2">
                        <div className="flex justify-between text-xs text-slate-400">
                          <span>Insurance office check staff wage cost:</span>
                          <span className="font-mono text-white">${calculatedSavings.monthlyStaffCost.toLocaleString()}/mo</span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-400">
                          <span>Denied claim write-offs:</span>
                          <span className="font-mono text-white">${(denialsPerMonth * averageWriteoffCost).toLocaleString()}/mo</span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-350 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                          <span>Donedial Monthly Cost ({providerCount} {providerCount === 1 ? 'provider' : 'providers'}):</span>
                          <span className="font-mono text-teal-400 font-bold">${Math.round(calculatedSavings.donedialEffectiveCost)}/mo</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 space-y-4">
                      <div className="p-4 bg-teal-900/20 border border-teal-500/20 rounded-2xl text-center">
                        <span className="text-[10px] text-teal-400 uppercase tracking-widest font-mono">Net Yearly Savings</span>
                        <div className="text-4xl font-display font-bold text-teal-400 mt-1">${(calculatedSavings.netYearlySavings).toLocaleString()}</div>
                        <p className="text-[10px] text-slate-400 mt-1">Preventing just 1 denied claim pays for your annual membership.</p>
                      </div>

                      <button 
                        id="btn-roi-cta"
                        onClick={openLeadModalWithDefaults}
                        className="w-full py-4 text-xs font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-xl transition text-center shadow-lg shadow-teal-400/10 cursor-pointer"
                      >
                        Claim My Saved Savings Today
                      </button>
                    </div>

                  </div>

                </div>

              </div>
            </section>

            {/* ADAVNCED FEATURES LIST */}
            <section className="py-20 bg-white border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
                  <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md uppercase tracking-wider">Platform Capabilities</span>
                  <h2 className="font-display font-medium text-3xl sm:text-4xl text-slate-950 tracking-tight">
                    Engineered for accuracy and dental/medical office speed
                  </h2>
                  <p className="text-slate-600">
                    Behind Donedial is a reliable language parsing layer that translates telephone noise into structured clinic records.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  
                  <div className="p-6 rounded-2xl border border-slate-100 hover:border-slate-200 transition space-y-3">
                    <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md font-mono">01</span>
                    <h3 className="font-bold text-slate-900 text-base">Intelligent IVR Navigation</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Our system automatically catalogs target menu directories carrier-by-carrier to bypass long automatic prompts.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl border border-slate-100 hover:border-slate-200 transition space-y-3">
                    <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md font-mono">02</span>
                    <h3 className="font-bold text-slate-900 text-base">Disputed Call Recording Audio</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      We keep encrypted HIPAA-compliant recording logs so you can provide visual/audio proof of benefits to carrier disputes.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl border border-slate-100 hover:border-slate-200 transition space-y-3">
                    <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md font-mono">03</span>
                    <h3 className="font-bold text-slate-900 text-base">Payer System Direct Connectors</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Connect coverage checks directly with practice managers like Dentrix, OpenDental, and Eaglesoft with ease.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl border border-slate-100 hover:border-slate-200 transition space-y-3">
                    <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md font-mono">04</span>
                    <h3 className="font-bold text-slate-900 text-base">Concurrency Multiline Stack</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Check 15 provider schedules concurrently. Zero delays or limit constraints—Donedial scales with patient volumes.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl border border-slate-100 hover:border-slate-200 transition space-y-3">
                    <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md font-mono">05</span>
                    <h3 className="font-bold text-slate-900 text-base">Composite Downcode Triggers</h3>
                    <p className="text-xs text-slate-600 leading-relaxed text-slate-600">
                      Specifically flags carrier rules such as back-mold composite restorations being auto-downgraded to silver amalgams.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl border border-slate-100 hover:border-slate-200 transition space-y-3">
                    <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md font-mono">06</span>
                    <h3 className="font-bold text-slate-900 text-base">24/7 Security & Multi-BAAs</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Complete transit encryption alongside signed Business Associate Agreements ensuring total state HIPAA regulatory compliance.
                    </p>
                  </div>

                </div>

              </div>
            </section>

            {/* SOCIAL PROOF / TESTIMONIALS */}
            <section className="py-20 bg-slate-50/50 border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
                  <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md uppercase tracking-wider">Office Testimonials</span>
                  <h2 className="font-display font-medium text-3xl sm:text-4xl text-slate-950 tracking-tight">
                    Trusted by local dentistry, orthopedia, and family clinics
                  </h2>
                  <p className="text-slate-600">
                    See how physical operations recovered their phone lines with automated voice checks.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {MOCK_TESTIMONIALS.map((test, index) => (
                    <div key={index} className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                      <p className="text-xs text-slate-600 italic leading-relaxed">"{test.quote}"</p>
                      
                      <div className="mt-6 flex items-center space-x-3 pt-4 border-t border-slate-100">
                        <img src={test.image} alt={test.author} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                        <div>
                          <p className="text-xs font-bold text-slate-900">{test.author}</p>
                          <p className="text-[10px] text-slate-500">{test.role} • {test.clinic}</p>
                          <span className="inline-block mt-1 text-[9px] font-mono text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md">{test.providers}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </section>

            {/* PRICING PLANS SECTION */}
            <section className="py-20 bg-white border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
                  <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md uppercase tracking-wider">Simple Subscriptions</span>
                  <h2 className="font-display font-medium text-3xl sm:text-4xl text-slate-950 tracking-tight">
                    Save thousands in denied claims for one low cost
                  </h2>
                  <p className="text-slate-600">
                    Scale or cancel your membership with absolute freedom. Just one prevented write-off completely covers your monthly subscription.
                  </p>

                  {/* Billing cycle toggle */}
                  <div className="inline-flex items-center space-x-2 bg-slate-100 p-1 rounded-xl mt-6">
                    <button 
                      onClick={() => setBillingCycle('monthly')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        billingCycle === 'monthly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                      }`}
                    >
                      Monthly Billing
                    </button>
                    <button 
                      onClick={() => setBillingCycle('annual')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center space-x-1 ${
                        billingCycle === 'annual' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                      }`}
                    >
                      <span>Annual Billing</span>
                      <span className="text-[9px] font-extrabold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">Save 20%</span>
                    </button>
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
                  
                  {/* Starter Tier */}
                  <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 flex flex-col justify-between">
                    <div className="space-y-4">
                      <span className="text-xs font-bold font-mono text-slate-500 uppercase tracking-widest">Starter AI</span>
                      <div className="space-y-1">
                        <span className="text-3xl font-display font-bold text-slate-950">${billingCycle === 'annual' ? '79' : '99'}</span>
                        <span className="text-xs text-slate-500">/mo per provider</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Best for single-provider practices starting to outsource hold times.
                      </p>
                      
                      <ul className="space-y-2 pt-4 text-xs font-medium text-slate-600 border-t border-slate-200">
                        <li className="flex items-center space-x-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> <span>Basic eligibility checks</span></li>
                        <li className="flex items-center space-x-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> <span>Standard IVR call routes</span></li>
                        <li className="flex items-center space-x-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> <span>Formatted Email breakdown output</span></li>
                        <li className="flex items-center space-x-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> <span>Up to 100 successful verification/mo</span></li>
                      </ul>
                    </div>

                    <button 
                      onClick={openLeadModalWithDefaults}
                      className="w-full mt-8 py-3 text-xs font-bold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition text-center"
                    >
                      Get Started with Starter
                    </button>
                  </div>

                  {/* Pro Tier (Most Popular) */}
                  <div className="bg-slate-900 rounded-3xl p-8 border border-teal-500 shadow-xl flex flex-col justify-between text-white relative">
                    <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 text-[9px] font-extrabold uppercase tracking-widest bg-teal-500 text-slate-950 py-1 px-3.5 rounded-full border border-teal-400">
                      Most Popular
                    </span>

                    <div className="space-y-4">
                      <span className="text-xs font-bold font-mono text-teal-400 uppercase tracking-widest">Pro Verification</span>
                      <div className="space-y-1">
                        <span className="text-4xl font-display font-bold text-white">${billingCycle === 'annual' ? '160' : '200'}</span>
                        <span className="text-xs text-slate-400">/mo per provider</span>
                      </div>
                      <p className="text-xs text-slate-350 leading-relaxed">
                        Best for busy dental & family clinics wanting full automation & denial alarms.
                      </p>
                      
                      <ul className="space-y-2 pt-4 text-xs font-medium text-slate-300 border-t border-slate-850">
                        <li className="flex items-center space-x-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> <span>Full voice agent checks</span></li>
                        <li className="flex items-center space-x-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> <span>Live human representative transfer negotiation</span></li>
                        <li className="flex items-center space-x-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> <span className="font-bold text-teal-300">Denial Defense risk analysis system</span></li>
                        <li className="flex items-center space-x-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> <span>Unlimited calls and checks</span></li>
                        <li className="flex items-center space-x-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> <span>Dentrix, Eaglesoft & medical PMS sync</span></li>
                      </ul>
                    </div>

                    <button 
                      onClick={openLeadModalWithDefaults}
                      className="w-full mt-8 py-3.5 text-xs font-extrabold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-xl transition text-center shadow-lg shadow-teal-450/20"
                    >
                      Onboard Practice Pilot Now
                    </button>
                  </div>

                  {/* Enterprise Tier */}
                  <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 flex flex-col justify-between">
                    <div className="space-y-4">
                      <span className="text-xs font-bold font-mono text-slate-500 uppercase tracking-widest">Enterprise Group</span>
                      <div className="space-y-1">
                        <span className="text-3xl font-display font-bold text-slate-950">${billingCycle === 'annual' ? '1200' : '1500'}</span>
                        <span className="text-xs text-slate-500">/mo up to 5 providers</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Best for multi-site medical networks or clinical groups needing API access.
                      </p>
                      
                      <ul className="space-y-2 pt-4 text-xs font-medium text-slate-600 border-t border-slate-200">
                        <li className="flex items-center space-x-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> <span>Custom PMS gateway API integrations</span></li>
                        <li className="flex items-center space-x-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> <span>Certified HIPAA audit logs logs</span></li>
                        <li className="flex items-center space-x-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> <span>Durable Dedicated carrier phone proxy</span></li>
                        <li className="flex items-center space-x-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> <span>Custom service agreements</span></li>
                        <li className="flex items-center space-x-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> <span>Dedicated Success Account manager</span></li>
                      </ul>
                    </div>

                    <button 
                      onClick={openLeadModalWithDefaults}
                      className="w-full mt-8 py-3 text-xs font-bold text-slate-850 bg-slate-100 hover:bg-slate-200 rounded-xl transition text-center"
                    >
                      Inquire Group Customization
                    </button>
                  </div>

                </div>

              </div>
            </section>

            {/* EXPANDABLE FAQ ACCORDIONS */}
            <section className="py-20 bg-[#fafbfc] border-b border-slate-200">
              <div className="max-w-4xl mx-auto px-4 sm:px-6">
                
                <div className="text-center space-y-4 mb-16">
                  <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md uppercase tracking-wider">Addressing Concerns</span>
                  <h2 className="font-display font-medium text-3xl text-slate-950 tracking-tight">
                    Frequently Asked Questions
                  </h2>
                  <p className="text-slate-600 text-sm">
                    Find straight answers here. If there is another detail, contact our support engineers anytime.
                  </p>
                </div>

                <div className="space-y-4">
                  {GENERAL_FAQS.map((faq, i) => {
                    const isExpanded = expandedFaqIdx === i;
                    return (
                      <div 
                        key={i} 
                        className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all duration-200 hover:border-slate-300"
                      >
                        <button 
                          onClick={() => setExpandedFaqIdx(isExpanded ? null : i)}
                          className="w-full py-5 px-6 flex justify-between items-center text-left"
                        >
                          <span className="font-bold text-slate-900 text-sm">{faq.question}</span>
                          <span className="flex-shrink-0 ml-4 w-6 h-6 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center border border-slate-250">
                            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                          </span>
                        </button>
                        
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="border-t border-slate-100"
                            >
                              <div className="p-6 bg-slate-50/50 text-xs text-slate-600 leading-relaxed">
                                {faq.answer}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>

              </div>
            </section>

            {/* FINAL CALL-TO-ACTION CARD & FOOTER */}
            <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
              <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,var(--color-slate-800),transparent_40%)]" />
              <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
                
                <h2 className="font-display font-medium text-3xl sm:text-4xl text-white tracking-tight">
                  Give your office hours of silence back today
                </h2>

                <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
                  Join over 120 family dental and general medicine small clinics that have permanently eliminated payer hold lists. We guarantee our accuracy checks return zero missing details.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
                  <button 
                    onClick={openLeadModalWithDefaults}
                    className="w-full sm:w-auto px-8 py-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-2xl transition shadow-lg shadow-teal-500/15 cursor-pointer"
                  >
                    Start Your 14-Day Free Trial
                  </button>
                  <button 
                    onClick={() => setActiveTab('blueprint')}
                    className="w-full sm:w-auto px-6 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition border border-slate-700"
                  >
                    View Developer Spec Sheets
                  </button>
                </div>

                <p className="text-[10px] text-slate-500 font-medium">
                  No installation contract or cancellation penalties. Fully HIPAA compliant setup in 10 minutes.
                </p>

              </div>
            </section>

          </div>
        )}

        {/* =========================================
            VIEW 2: DEVELOPER BLUEPRINT SPEC VIEW (A beautiful export deck)
            ========================================= */}
        {activeTab === 'blueprint' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            
            {/* Header copy */}
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-slate-200 mb-10 gap-4">
              <div>
                <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md uppercase tracking-wider">Dev Toolkit</span>
                <h1 className="font-display font-medium text-3xl text-slate-950 mt-2 font-semibold">Developers & AI Builders Blueprint Spec</h1>
                <p className="text-slate-600 text-xs mt-1">This panel encapsulates all Copy, layout formulas, wireframes details, and visual advice for your developers to build the complete, high-converting Donedial site.</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleCopyFullBlueprint}
                  className="flex items-center space-x-1.5 px-4 py-2.5 bg-slate-950 hover:bg-slate-800 font-bold text-white text-xs rounded-xl transition"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Entire Blueprint JSON</span>
                </button>
                <button 
                  onClick={() => alert('Download file download placeholder. All spec assets are bundle-packaged within this application context.')}
                  className="flex items-center space-x-1.5 px-4 py-2.5 bg-white hover:bg-slate-100 font-bold text-slate-700 text-xs rounded-xl border border-slate-300 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Blueprint Package</span>
                </button>
              </div>
            </div>

            {/* Double column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Sidebar: Navigation tabs of 10 blueprints */}
              <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 space-y-4">
                
                {/* Search field */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input 
                    type="text" 
                    placeholder="Search blueprint headings..."
                    value={specSearch}
                    onChange={(e) => setSpecSearch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold focus:outline-none focus:border-teal-500"
                  />
                </div>

                {/* Vertical lists */}
                <div className="space-y-1.5 max-h-[480px] overflow-y-auto custom-scrollbar">
                  {filteredSpecBlueprints.length === 0 ? (
                    <div className="p-4 text-slate-400 text-xs text-center font-mono">No matching sections found.</div>
                  ) : (
                    filteredSpecBlueprints.map((spec, idx) => {
                      const isActive = selectedSpecIdx === SPEC_BLUEPRINTS.indexOf(spec);
                      return (
                        <button
                          key={spec.title}
                          onClick={() => setSelectedSpecIdx(SPEC_BLUEPRINTS.indexOf(spec))}
                          className={`w-full text-left p-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-between ${
                            isActive
                              ? 'bg-teal-50 text-teal-800 border-l-4 border-teal-600'
                              : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <span className="truncate pr-2">{spec.title}</span>
                          <span className={`px-1.5 py-0.5 text-[8px] font-mono rounded ${isActive ? 'bg-teal-200/50' : 'bg-slate-100 text-slate-400'}`}>
                            Spec Section {SPEC_BLUEPRINTS.indexOf(spec) + 1}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>

                {/* Developer system instructions panel */}
                <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-[11px] text-indigo-850 space-y-1">
                  <div className="font-bold flex items-center space-x-1">
                    <Code className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Developer Instructions</span>
                  </div>
                  <p className="leading-relaxed">To implement, feed these specifications into code generators or builders: "Create full-stack or React interfaces mapping precisely to the following structure copy guidelines and target tone."</p>
                </div>

              </div>

              {/* Main Content Area: Detailed Spec Sheets */}
              <div id="blueprint-detail-view" className="lg:col-span-8 bg-slate-950 text-slate-300 rounded-2xl border border-slate-800 p-6 space-y-6">
                
                {/* Spec Title Info */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <h2 className="font-display text-white font-semibold text-lg">{SPEC_BLUEPRINTS[selectedSpecIdx].title}</h2>
                    <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest block mt-0.5">Wireframe layout & copy blueprint</span>
                  </div>
                  <button 
                    id="btn-copy-section-blueprint"
                    onClick={() => handleCopySpecSection(selectedSpecIdx, SPEC_BLUEPRINTS[selectedSpecIdx])}
                    className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-bold text-slate-100 rounded-lg transition"
                  >
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>{copiedSectionIndex === selectedSpecIdx ? 'Copied spec!' : 'Copy Section Cop'}</span>
                  </button>
                </div>

                {/* Wireframe details */}
                <div className="space-y-2">
                  <h4 className="text-[10px] uppercase tracking-widest font-mono text-slate-500 font-bold">Suggested Wireframe Component Layout</h4>
                  <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-850 font-mono text-xs text-indigo-100 leading-normal">
                    {SPEC_BLUEPRINTS[selectedSpecIdx].wireframe}
                  </div>
                </div>

                {/* Complete Copywrite Lines */}
                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase tracking-widest font-mono text-slate-500 font-bold">Complete Copy Blocks</h4>
                  <div className="space-y-2">
                    {SPEC_BLUEPRINTS[selectedSpecIdx].copy.map((line, i) => (
                      <div key={i} className="flex gap-3 text-xs leading-relaxed max-w-3xl">
                        <span className="font-mono text-teal-500 font-semibold bg-slate-900/80 px-2 py-0.5 rounded text-[10px] h-fit">Line {i+1}</span>
                        <p className="text-slate-200 mt-0.5">{line}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Conversion advice */}
                <div className="pt-4 border-t border-slate-850 space-y-2">
                  <h4 className="text-[10px] uppercase tracking-widest font-mono text-slate-500 font-bold">Conversion-focused Developer Tips</h4>
                  <p className="text-xs text-teal-300 leading-relaxed font-mono">
                    💡 {SPEC_BLUEPRINTS[selectedSpecIdx].tips}
                  </p>
                </div>

                {/* Global Brand Guidelines block */}
                <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl space-y-3 pt-4">
                  <h3 className="text-xs font-bold font-mono text-white flex items-center space-x-1">
                    <Award className="w-4 h-4 text-teal-400" />
                    <span>Master Brand Copywriting Guidelines</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] leading-relaxed">
                    <div className="space-y-1">
                      <p className="font-bold text-slate-350">Tone and Personality Formula</p>
                      <p className="text-slate-400">Stable, authoritative, and direct. Avoid tech-larp labels and fluffy marketing descriptions. Use literal numbers and real outcomes.</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-slate-350">Optimal Target Reading Level</p>
                      <p className="text-slate-400">Aim for an 8th-grade readability level. Ensure and confirm layout is fully scannable across all device shapes.</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </main>

      {/* LEAD CONVERSION CAPTURE FORM / MODAL */}
      <AnimatePresence>
        {isLeadModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            
            {/* Overlay backdrop */}
            <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs" onClick={() => setIsLeadModalOpen(false)} />

            {/* Modal Box */}
            <div className="flex min-h-screen items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white text-slate-950 rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl border border-slate-200/50"
              >
                
                {/* Header info */}
                <div className="space-y-2 text-center pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto shadow-sm">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-bold text-xl">Onboard Your Medical or Dental Practice</h3>
                  <p className="text-slate-500 text-xs max-w-sm mx-auto">Complete this simple sandbox request and get connected with our setup engineers in under 24 hours.</p>
                </div>

                {/* Active submit status */}
                {isOnboardSubmitted ? (
                  <div id="lead-submitted-success" className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-base text-slate-900">Lead Successfully Saved Securely</p>
                      <p className="text-xs text-slate-500 font-mono">Mock SQLite / Local DB persistent check ok</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleOnboardSubmit} className="space-y-4 mt-6">
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase block">Clinic Provider / Representative Name *</label>
                      <input 
                        type="text" 
                        required
                        value={onboardForm.name}
                        onChange={(e) => setOnboardForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Sarah Jenkins"
                        className="w-full bg-slate-50 border border-slate-250 rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:outline-none focus:border-teal-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase block">Interactive Contact Email *</label>
                      <input 
                        type="email" 
                        required
                        value={onboardForm.email}
                        onChange={(e) => setOnboardForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="sarah@apexdental.com"
                        className="w-full bg-slate-50 border border-slate-250 rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:outline-none focus:border-teal-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase block">Clinic Practice Name *</label>
                      <input 
                        type="text" 
                        required
                        value={onboardForm.practiceName}
                        onChange={(e) => setOnboardForm(prev => ({ ...prev, practiceName: e.target.value }))}
                        placeholder="Apex Family Dental"
                        className="w-full bg-slate-50 border border-slate-250 rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:outline-none focus:border-teal-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase block">Active Providers Count</label>
                        <select 
                          value={onboardForm.providersCount}
                          onChange={(e) => setOnboardForm(prev => ({ ...prev, providersCount: e.target.value }))}
                          className="w-full bg-slate-50 border border-slate-250 p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-teal-500"
                        >
                          <option value="1-3">1 to 3 Providers</option>
                          <option value="4-5">4 to 5 Providers</option>
                          <option value="6+">6+ Group practice</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase block">Preferred Practice Software</label>
                        <select 
                          className="w-full bg-slate-50 border border-slate-250 p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-teal-500"
                        >
                          <option value="dentrix">Dentrix</option>
                          <option value="eaglesoft">Eaglesoft</option>
                          <option value="opendental">OpenDental</option>
                          <option value="other">Medical EHR Web Portal</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase block">Onboarding Notes / Specific Payer Pain Points</label>
                      <textarea 
                        rows={3}
                        value={onboardForm.notes}
                        onChange={(e) => setOnboardForm(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="e.g. Deltadental eligibility line is always backed up..."
                        className="w-full bg-slate-50 border border-slate-250 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:border-teal-500"
                      />
                    </div>

                    <div className="flex gap-3 pt-2 text-xs">
                      <button 
                        type="button" 
                        onClick={() => setIsLeadModalOpen(false)}
                        className="flex-1 py-3 text-slate-500 bg-slate-100 hover:bg-slate-200 font-bold rounded-xl transition text-center"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="flex-1 py-3 text-white bg-teal-600 hover:bg-teal-700 font-bold rounded-xl transition text-center"
                      >
                        Submit & Request Sandbox
                      </button>
                    </div>

                  </form>
                )}

              </motion.div>
            </div>

          </div>
        )}
      </AnimatePresence>

      {/* LEDGER RECORD DETAILS MODAL OVERLAY */}
      <AnimatePresence>
        {activeLedgerItem && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs" onClick={() => setActiveLedgerItem(null)} />

            {/* Modal Body */}
            <div className="flex min-h-screen items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-slate-900 text-slate-100 rounded-3xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl border border-slate-800 text-left"
              >
                
                {/* Header detail info */}
                <div className="flex justify-between items-start pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] font-bold font-mono text-teal-400 uppercase tracking-widest">{activeLedgerItem.payer} verification</span>
                    <h3 className="font-display font-bold text-xl text-white mt-1">{activeLedgerItem.patientName}</h3>
                  </div>
                  <button 
                    onClick={() => setActiveLedgerItem(null)}
                    className="text-slate-400 hover:text-white font-mono text-xs bg-slate-800 px-3 py-1 rounded-lg cursor-pointer"
                  >
                    ✕ Close
                  </button>
                </div>

                {/* Sub Metadata parameters */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 text-xs border-b border-slate-800 font-mono">
                  <div>
                    <span className="text-slate-500 block">Date of Birth</span>
                    <span className="text-white font-bold">{activeLedgerItem.dob || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Member Plan ID</span>
                    <span className="text-white font-bold">{activeLedgerItem.memberId}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Verification Ref</span>
                    <span className="text-teal-400 font-bold">{activeLedgerItem.result?.payerReferenceNum || 'DND-9943'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Clinical Service Checked</span>
                    <span className="text-white font-bold truncate block">{activeLedgerItem.requestedService || 'Coverage Codes'}</span>
                  </div>
                </div>

                {/* Grid result parameters */}
                <div className="mt-6 space-y-6">
                  
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 font-sans">Verified Benefit Calculations:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs font-mono bg-slate-950 p-4 rounded-2xl border border-slate-800">
                      <div>
                        <span className="text-slate-500 block">Coverage Status:</span>
                        <span className="text-emerald-400 font-bold">{activeLedgerItem.result?.insuranceStatus || 'Active Coverage'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Coinsurance:</span>
                        <span className="text-slate-205 font-bold">{activeLedgerItem.result?.coinsurance || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Copay Fee:</span>
                        <span className="text-slate-205 font-bold">{activeLedgerItem.result?.copay || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Plan Deductible:</span>
                        <span className="text-slate-205 font-bold">{activeLedgerItem.result?.deductible || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Deductible Met:</span>
                        <span className="text-slate-205 font-bold">{activeLedgerItem.result?.deductibleMet || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Annual Plan Maximum:</span>
                        <span className="text-slate-205 font-bold">{activeLedgerItem.result?.maxBenefit || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Red flags exclusion warning */}
                  {activeLedgerItem.result?.redFlags && activeLedgerItem.result.redFlags.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider font-sans">Exclusions & Prior-Auth Risks detected:</h4>
                      <div className="p-4 bg-red-950/40 border border-red-500/20 rounded-2xl text-[11px] text-red-200">
                        <ul className="list-disc list-inside space-y-2 leading-relaxed">
                          {activeLedgerItem.result.redFlags.map((flag: string, index: number) => (
                            <li key={index} className="font-sans font-medium">{flag}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Step dialogue transcript logs */}
                  {activeLedgerItem.steps && activeLedgerItem.steps.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-sans">Full Telephone Transcript Dialogue:</h4>
                      <div className="h-44 overflow-y-auto p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 font-mono text-[11px] text-left custom-scrollbar">
                        <div className="text-[10px] text-slate-500">[SYS]: Initiating secure connection trunk node to payer...</div>
                        {activeLedgerItem.steps.map((st: any, i: number) => (
                          <div key={i} className="space-y-1.5">
                            {st.dialogue && (
                              <div className="p-2 rounded bg-teal-900/10 text-teal-300 border-l-2 border-teal-500">
                                {st.dialogue}
                              </div>
                            )}
                            {st.subtext && (
                              <div className="text-[10px] text-slate-500 italic pl-1">
                                [Payer Response]: {st.subtext}
                              </div>
                            )}
                          </div>
                        ))}
                        <div className="text-[10px] text-slate-550">[SYS]: Call session disconnected securely. Benefit slip processed.</div>
                      </div>
                    </div>
                  )}
                  
                </div>

                {/* Back actions */}
                <div className="mt-8 pt-4 border-t border-slate-800 flex gap-3 text-xs font-sans">
                  <button 
                    onClick={() => {
                      const formattedText = `
*DONEDIAL AUTOMATED INSURANCE ELIGIBILITY CHECK*
Carrier: ${activeLedgerItem.payer}
Patient Name: ${activeLedgerItem.patientName} | DOB: ${activeLedgerItem.dob || 'Unknown'}
Member ID: ${activeLedgerItem.memberId}
Practice Doctor NPI: ${activeLedgerItem.npi || '1093122177'}
Reference Confirmation code: ${activeLedgerItem.result?.payerReferenceNum || 'DND-ELIG-MOCK'}
Coinsurance: ${activeLedgerItem.result?.coinsurance || 'N/A'}
Deductible: ${activeLedgerItem.result?.deductible || 'N/A'} | Met: ${activeLedgerItem.result?.deductibleMet || 'N/A'}
Annual/Lifetime Max: ${activeLedgerItem.result?.maxBenefit || 'N/A'} | Met: ${activeLedgerItem.result?.maxBenefitMet || 'N/A'}
Exclusion Alert Warnings:
${activeLedgerItem.result?.redFlags?.map((flag: string, i: number) => ` [Warning ${i+1}] ${flag}`).join('\n') || 'None'}
--------------------------------------------------
Verified automatically by Donedial Voice Integration node.
                      `;
                      navigator.clipboard.writeText(formattedText.trim());
                      alert(`FORMATTED PMS SLIP COPIED!\nYou can now paste directly into Eaglesoft, Dentrix, or OpenDental charts!`);
                    }}
                    className="flex-1 py-3 bg-teal-600 hover:bg-teal-500 font-bold text-white rounded-xl transition text-center cursor-pointer"
                  >
                    Copy PMS Chart Text
                  </button>
                  <button 
                    onClick={() => setActiveLedgerItem(null)}
                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 font-bold text-slate-300 rounded-xl transition text-center cursor-pointer"
                  >
                    Done Viewing
                  </button>
                </div>

              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* BOTTOM FOOTER ELEMENT */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between pb-8 border-b border-slate-900 gap-6">
            
            <div className="space-y-2 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <span className="font-display font-bold text-white tracking-tight text-lg">donedial</span>
                <span className="text-[9px] font-semibold text-teal-400 bg-teal-900/30 border border-teal-500/25 px-1.5 py-0.5 rounded">Healthcare AI</span>
              </div>
              <p className="text-slate-500 text-[10px] max-w-sm">
                High-fidelity, end-to-end automated IVR insurance telephone systems for dentists and family care practitioners. Completely HIPAA compliant.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-slate-400 font-medium">
              <button onClick={() => setActiveTab('landing')} className="hover:text-white transition">Landing Page</button>
              <button onClick={() => { setActiveTab('landing'); setTimeout(() => document.getElementById('simulator')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="hover:text-white transition">Voice Demo</button>
              <button onClick={() => setActiveTab('blueprint')} className="hover:text-white transition">Dev Specs</button>
              <button onClick={openLeadModalWithDefaults} className="hover:text-white transition">Register Clinic</button>
            </div>

          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-8 text-[10px] text-slate-600 gap-4">
            <p>© 2026 Donedial Inc. All rights reserved. Registered Business Associate (BAA Ready) and secure HIPAA network.</p>
            <p>Designed and generated for healthcare administrators and clinical billing specialists.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
