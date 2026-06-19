/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SpecSection {
  title: string;
  wireframe: string;
  copy: string[];
  tips: string;
}

export interface SimulatorScenario {
  id: string;
  patientName: string;
  providerType: string;
  payer: string;
  npi: string;
  memberId: string;
  dob: string;
  requestedService: string;
  steps: {
    status: string;
    subtext: string;
    duration: number; // in milliseconds to wait
    type: 'dial' | 'ivr' | 'hold' | 'talk' | 'format';
    speaker?: 'ai' | 'rep' | 'system';
    transcript?: string;
  }[];
  result: {
    insuranceStatus: string;
    deductible: string;
    deductibleMet: string;
    coinsurance: string;
    copay: string;
    maxBenefit: string;
    maxBenefitMet: string;
    outOfPocket: string;
    preAuthRequired: boolean;
    redFlags: string[];
    payerReferenceNum: string;
  };
}

export const SPEC_BLUEPRINTS: SpecSection[] = [
  {
    title: "1. Above the Fold (Hero Section)",
    wireframe: "Desktop: Left/Right Split (left-hand has copy, primary & secondary CTAs, social proof; right-hand contains live interactive AI Voice caller simulator visual widget). Mobile: Vertically stacked layout with simulator immediately following CTAs.",
    copy: [
      "Primary Headline: 'Stop Wasting 10 Hours a Week on Hold with Insurers'",
      "Subheadline: 'Donedial is the AI voice agent that runs pre-visit benefit checks end-to-end. Give us the patient details, and get a clean coverage breakdown in under 3 minutes.'",
      "Primary CTA: 'Start Automating - $200/mo per Provider'",
      "Secondary CTA: 'Run a Sample Simulation'",
      "Social Proof: 'Verified coverage for over 74,000 appointments. Saved 12,400+ hold hours.'"
    ],
    tips: "Keep the visual action-focused. The hero should immediately demonstrate utility. The right-hand column call simulator makes the concept instant instead of abstract."
  },
  {
    title: "2. Trust Indicators Strip",
    wireframe: "A horizontal ticker or clean grid below the hero. Subdued gray logos of top dental and medical payers. Followed by key market stats and an office manager's direct quote.",
    copy: [
      "Supported Payers: MetLife, Delta Dental, Blue Cross Blue Shield, Aetna, Cigna, UnitedHealthcare",
      "Key Metric 1: '11 Mins Average Hold Saved'",
      "Key Metric 2: '99.4% Transcription Accuracy'",
      "Key Metric 3: '< 3 Minute Turnaround'",
      "Office Manager Quote: 'We used to have four phone lines going at once just for holds. Now Donedial handles them while patients get checked-in. Our billing team is finally sane!' - Sarah Jenkins, Office Director at Apex Dental"
    ],
    tips: "Ensure logos have high-contrast monochromatic filters for a clean, premium, unified aesthetic. Avoid generic colored logo spam."
  },
  {
    title: "3. Problem & Pain Section",
    wireframe: "Asymmetrical 2-column layout. Left side focuses on 'The Billing Nightmare' with diagnostic numbers. Right side details 3 distinct acute pain bullet blocks highlighted in red/amber alerts.",
    copy: [
      "Section Headline: 'The Hold Music That Costs You $2,000 per Clinic'",
      "Pain Block 1: 'The Hold Time Tax' - 'Staff wastes up to 10 hours a week dialing, sitting on hold, and navigating redundant automated menus just to verify a standard benefit.'",
      "Pain Block 2: 'The Claims Game' - 'Dental and medical clinics with 1 to 5 providers lose thousands monthly in denied claims or write-offs because of outdated or unverified patient coverage profiles.'",
      "Pain Block 3: 'Staff Burnout & Turnover' - 'Your front desk coordinators want to care for patients, not listen to insurer elevator loops. Automating the verification restores operational morale instantly.'"
    ],
    tips: "Back our pain section with high empathy. Avoid sounding overly scientific; appeal directly to the frustrating waiting loop."
  },
  {
    title: "4. Solution Overview",
    wireframe: "Centered introduction area showcasing the core value prop, leading into a 3-column micro-bento grid demonstrating interactive elements: Coverage breakdowns, Red flag checks, and Dashboard logging.",
    copy: [
      "Section Headline: 'The End-to-End Verification Agent for Small Practices'",
      "Value Proposition: 'Donedial dials the carrier, speaks to representative bots, waits out long queues, and delivers a perfect structured billing breakdown before the patient sits in the chair.'",
      "Feature A: 'Automated Phone Navigation' - 'No menu is too complex. Donedial dials provider NPIs, member IDs, and handles the robot prompts.'",
      "Feature B: 'Smart Denial-Defense alerts' - 'Flag hidden restrictions like amalgam downgrades, waiting periods, and frequency limitations on the spot.'",
      "Feature C: 'Zero Hold Waiting' - 'We absorb the hold drop-outs and long ring delays so your phone lines stay wide open for high-value client bookings.'"
    ],
    tips: "Present features as immediate relief. Instead of explaining technology, explain the business utility (prevented write-offs, open lines)."
  },
  {
    title: "5. How It Works",
    wireframe: "Staggered horizontal timeline cards. Step 1 (Left), Step 2 (Center), Step 3 (Right) using large numerals (01, 02, 03) and connecting paths to indicate clean visual flow.",
    copy: [
      "Step 1: 'Input and Request' - 'Drop a patient name, date of birth, and plan identifier in your minimalist dashboard.'",
      "Step 2: 'The AI Takes the Call' - 'Our agent dials the specific carrier, works through prompt trees, and transcripts live conversation with humans.'",
      "Step 3: 'Review the Structured Summary' - 'In under 3 minutes, receive copyable insurance receipt structures with deductibles, copay codes, and flags.'"
    ],
    tips: "Visual clarity is king. Make sure the user sees that inputting takes less than 20 seconds."
  },
  {
    title: "6. Advanced Features",
    wireframe: "Grid of 6 modular cards with clean borders, micro-badges, and Lucide icons.",
    copy: [
      "1. Intelligent IVR Nav: 'The agent learns prompt paths and remembers precise representative scripts, getting faster on every single call.'",
      "2. Natural Language Translation: 'Converts unstructured, conversational spoken insurance responses into absolute, standard ICD and billing-level fields.'",
      "3. Smart History Repository: 'Access historic call logs, transcripts, and secure audio recordings for any disputes or audits.'",
      "4. Practice Management Integrations: 'Works with Dentrix, Eaglesoft, OpenDental, and medical web portals natively.'",
      "5. Multitasking Call Clusters: 'Dial 10 carriers simultaneously. No limit to overlapping calls.'",
      "6. Denial Trigger Warnings: 'Highlight age restrictions, missing pre-auth conditions, and coordination of benefits rules.'"
    ],
    tips: "Ensure spacing between grid elements is spacious and the contrast remains high."
  },
  {
    title: "7. High-Yield Social Proof",
    wireframe: "Double testimonial layout on card containers with large, readable, centered pull-quotes.",
    copy: [
      "Testimonial 1: 'We prevent at least 4-5 denied claims every single week. At roughly $300 a check, Donedial paid for its entire annual subscription in our first two weeks.' - Dr. Angela Vance, Vance Orthodontics",
      "Testimonial 2: 'Our front desk turnover dropped to zero. The team can actually greet dental patients with a smile because they aren't stressed about carrier hold music.' - Mateo Alavez, General Manager, Sunrise Family Clinic"
    ],
    tips: "Highlight the return-on-investment numbers in bold. Small clinics care about cash recovery."
  },
  {
    title: "8. Pricing Tiers",
    wireframe: "3 pricing columns. Center tier (Pro) highlighted in deep indigo background with an attention-grabbing 'Most Popular' badge. Annually/Monthly sliding toggle.",
    copy: [
      "Starter Tier: '$99/mo per provider' - 'Basic eligibility verification, standard IVR, email summary, up to 100 calls/month.'",
      "Pro Tier (Most Popular): '$200/mo per provider' - 'Full-line automated checks, live human-rep negotiation transfer, denial risk alert system, unlimited calls, priority routing.'",
      "Enterprise Tier: '$1,500/mo package (Up to 5 providers)' - 'Includes customs PM system APIs, certified HIPAA audit logs, dedicated carrier gateway, 24/7 success engineer.'"
    ],
    tips: "Frame pricing relative to the average size of a dental denied claim ($200-$2000). Prevent one denial, and the entire tool is paid for."
  },
  {
    title: "9. FAQ Section",
    wireframe: "Clean vertical accordion layout. Clicking a question smoothly expands the answer area, turning a chevron icon by 180 degrees.",
    copy: [
      "Is Donedial HIPAA compliant?",
      "How does Donedial handle complex menus or human transfers?",
      "Which practice systems does Donedial connect with?",
      "Can patients hear the call recordings?",
      "Is there a setup contract or fee?"
    ],
    tips: "Keep answers authoritative but simple. Give exact structural details (e.g., 'We sign BAA agreements, run SOC2 compliance...')"
  },
  {
    title: "10. Final Call-to-Action & Footer",
    wireframe: "Immersive high-impact badge section. Soft off-black backgrounds with a vibrant secondary color gradient. Input field for immediate contact, support channels, and legal policies.",
    copy: [
      "CTA Title: 'Give Your Office Hours of Silence Back Today'",
      "CTA Subtitle: 'Join over 120 small clinics that have permanently deleted hold queues from their daily routine. Start a 14-day fully-featured trial.'",
      "Risk Reversal: 'No setup fee, cancel anytime in 1 click. Zero installation required.'"
    ],
    tips: "Add an alternative CTA for office managers who need a live demo deck to present to their main dentist/doctor partner."
  }
];

export const MOCK_PAYER_LOGOS = [
  { name: 'MetLife', type: 'Dental & Health' },
  { name: 'Delta Dental', type: 'Dental Specialty' },
  { name: 'Blue Cross', type: 'Universal Health' },
  { name: 'Aetna', type: 'Medical & Vision' },
  { name: 'Cigna', type: 'Health Services' },
  { name: 'UnitedHealthcare', type: 'Global Health' }
];

export const MOCK_TESTIMONIALS = [
  {
    quote: "We used to have four phone lines going at once just for payer hold lines. Now we enter details and Donedial delivers coverage in under 3 minutes.",
    author: "Sarah Jenkins",
    role: "Office Director",
    clinic: "Apex Dental Group",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    providers: "3 Providers"
  },
  {
    quote: "We save at least $1,200 a week by preventing unannounced coverage termination write-offs before dental surgery sessions. Truly incredible ROI.",
    author: "Dr. Angela Vance",
    role: "Lead Orthodontist",
    clinic: "Vance Dental & Ortho",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200",
    providers: "2 Providers"
  },
  {
    quote: "The front desk turnover in small clinics is heavily fueled by insurer hold frustration. Removing that burden made our workspace beautiful again.",
    author: "Mateo Alavez",
    role: "Front Office Supervisor",
    clinic: "Sunrise Family Medical",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200",
    providers: "5 Providers"
  }
];

export const SIMULATION_SCENARIOS: SimulatorScenario[] = [
  {
    id: 'metlife-ortho',
    patientName: 'Johnathan Doe',
    providerType: 'Dental (Orthodontic)',
    payer: 'MetLife Dental',
    npi: '1942385501',
    memberId: 'MET-89542319',
    dob: '11/24/1988',
    requestedService: 'Major Orthodontics - Code D8080 (Braces / Bracket system)',
    steps: [
      { status: 'Initializing Outbound Line', subtext: 'Deploying secure voice node on MetLife high-priority portal', duration: 1200, type: 'dial' },
      { status: 'Connected. Navigating IVR prompts', subtext: 'Sending NPI 1942385501 via tone frequency synthesizer...', duration: 1500, type: 'ivr' },
      { status: 'Navigating eligibility criteria', subtext: 'AI enters Member ID: MET-89542319 & DOB: 11/24/1988. Requesting orthodontic eligibility agent.', duration: 1800, type: 'ivr' },
      { status: 'Skipping hold queue (Payer Queue Delay: 24m)', subtext: 'Donedial absorbing queue hold line. Monitoring tones for live representative pickup...', duration: 2500, type: 'hold' },
      { status: 'Representative Connected', subtext: 'MetLife Rep: "Thank you for contacting MetLife, this is Clara. Who do I have the pleasure of speaking with?"', duration: 2000, type: 'talk', speaker: 'rep', transcript: 'MetLife Rep: "Thank you for contacting MetLife, this is Clara. Who do I have the pleasure of speaking with?"' },
      { status: 'AI negotiating details', subtext: 'Donedial: "Hi, I am an automated benefit assistant calling on behalf of Apex Orthodontics. I need to verify orthodontia benefits for patient Johnathan Doe."', duration: 2400, type: 'talk', speaker: 'ai', transcript: 'Donedial: "Hi Clara, I am verifying orthodontia benefits for Johnathan Doe, DOB November 24, 1988, Member ID MET-89542319. Is this plan active, and what is the lifetime maximum for orthodontic treatment?"' },
      { status: 'Representative response recorded', subtext: 'MetLife Rep: "Yes, the plan is active. Orthodontia is covered at fifty percent with a fifteen hundred lifetime maximum. Deductible is fifty dollars, which has been met for this period."', duration: 2500, type: 'talk', speaker: 'rep', transcript: 'MetLife Rep: "Yes, the plan is active. Orthodontia is covered at fifty percent with a fifteen hundred lifetime maximum. Deductible is fifty dollars, which has been met for this period."' },
      { status: 'AI probing for denial risks', subtext: 'Donedial: "Thank you. Is there an age restriction, waiting period, or work-in-progress limit?"', duration: 2200, type: 'talk', speaker: 'ai', transcript: 'Donedial: "Thank you Clara. Are there any age restrictions for this orthodontia benefit, and does it exclude treatment already in progress?"' },
      { status: 'Representative verifying rules', subtext: 'MetLife Rep: "Ah, yes, there is an age limit of nineteen. Orthodontia is only covered for dependents up to age nineteen. Age limit is strictly enforced. No cover for adult orthodontia."', duration: 2600, type: 'talk', speaker: 'rep', transcript: 'MetLife Rep: "Ah, yes, let me check. There is a age limit of nineteen. Orthodontia is only covered for dependents up to age nineteen. No coverage for adult orthodontia. Work in progress is covered if the carrier was active at band placement. Reference number is MET-Eligibility-9943."' },
      { status: 'Formatting receipt...', subtext: 'Applying medical translation models to structure the transcribed output into clean dashboard variables.', duration: 1500, type: 'format' }
    ],
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
    }
  },
  {
    id: 'delta-crowns',
    patientName: 'Janeen Smith',
    providerType: 'General Dental',
    payer: 'Delta Dental Premier',
    npi: '1093122177',
    memberId: 'DLT-7182241',
    dob: '05/14/1975',
    requestedService: 'Major Restorative - Code D2740 (Porcelain/Ceramic Crown)',
    steps: [
      { status: 'Initializing Outbound Line', subtext: 'Deploying secure voice node on Delta Dental system', duration: 1000, type: 'dial' },
      { status: 'Connected. Navigating IVR prompts', subtext: 'Navigating automatic verbal prompt system with fast tone scripts...', duration: 1500, type: 'ivr' },
      { status: 'Navigating eligibility criteria', subtext: 'Entering Member ID and Provider details into IVR flow.', duration: 1500, type: 'ivr' },
      { status: 'Holding (Payer Queue Delay: 18m)', subtext: 'Donedial skipping the queue. Monitoring queue hold line...', duration: 2000, type: 'hold' },
      { status: 'Representative Connected', subtext: 'Delta Rep: "Thanks for calling Delta Premier, this is David. Provider name please?"', duration: 1800, type: 'talk', speaker: 'rep', transcript: 'Delta Rep: "Thanks for calling Delta Premier, this is David. Provider name and NPI please?"' },
      { status: 'AI negotiating details', subtext: 'Donedial: "Diling on behalf of Sunrise Dental, NPI 1093122177. Patients name is Janeen Smith, DOB 05/14/1975, code D2740."', duration: 2200, type: 'talk', speaker: 'ai', transcript: 'Donedial: "Hello David. I am calling from Sunrise Dental on behalf of Janeen Smith, DOB May 14, 1975, Member ID DLT-7182241. We need benefits for code D2740, porcelain crown on tooth number fourteen."' },
      { status: 'Representative response recorded', subtext: 'Delta Rep: "Alright, she is covered at sixty percent. Annual maximum is fifteen hundred, she has four hundred spent, so eleven hundred remaining. No deductible on major."', duration: 2500, type: 'talk', speaker: 'rep', transcript: 'Delta Rep: "Okay, I see that. Porcelain crowns are covered at sixty percent. Deductible is waived. Her remaining annual maximum is eleven hundred dollars out of fifteen hundred."' },
      { status: 'AI probing for limitations', subtext: 'Donedial verifying frequency limits (e.g., 5-year replacement rule) and downgrade rules.', duration: 2000, type: 'talk', speaker: 'ai', transcript: 'Donedial: "Got it. Are there any cosmetic downgrades or frequency limitations on porcelain crowns for tooth fourteen?"' },
      { status: 'Representative verifying rules', subtext: 'Delta Rep: "Standard alternate benefits apply. We downgrade porcelain posterior crowns to metal cast/amalgam price. Frequency limit is once per tooth in seven years. Ref# DEL-88126."', duration: 2700, type: 'talk', speaker: 'rep', transcript: 'Delta Rep: "Yes, standard alternate benefits clause applies. Porcelain crowns on posterior teeth are paid at the rate of a noble metal crown. There is a seven-year frequency replacement exclusion per tooth. Reference number is DEL-88126."' },
      { status: 'Formatting receipt...', subtext: 'Synthesizing audio data into standard JSON report payload.', duration: 1200, type: 'format' }
    ],
    result: {
      insuranceStatus: 'Active Coverage',
      deductible: '$0.00 waived for major',
      deductibleMet: 'Yes',
      coinsurance: '60% covered (Patient pays 40% based on downcode allowance)',
      copay: 'N/A',
      maxBenefit: '$1,500.00 (Annual)',
      maxBenefitMet: '$400.00 met ($1,100.00 remaining)',
      outOfPocket: 'Approx. 40% of downgraded noble metal fee, plus the price difference for porcelain.',
      preAuthRequired: false,
      redFlags: [
        "POSSIBLE DOWNGRADE: Posterior porcelain crowns are downgraded to noble metal fees. Inform patient of extra out-of-pocket costs.",
        "FREQUENCY EXCLUSION: Only covered once every 7 years per tooth. Confirm patient hasn't had crown on tooth #14 since 2019."
      ],
      payerReferenceNum: "DEL-88126"
    }
  },
  {
    id: 'bcbs-medical',
    patientName: 'Matthew Miller',
    providerType: 'Family Medical (Specialist)',
    payer: 'Blue Cross Blue Shield (BCBS) PPO',
    npi: '1249553018',
    memberId: 'BCB-4921204',
    dob: '09/02/1982',
    requestedService: 'Specialist Consultation & Outpatient Diagnosis - Code 99244',
    steps: [
      { status: 'Initializing Outbound Line', subtext: 'Deploying secure voice node on BCBS regional portal queue', duration: 1100, type: 'dial' },
      { status: 'Connected. Navigating IVR prompts', subtext: 'Navigating automatic health eligibility systems utilizing swift response loops...', duration: 1400, type: 'ivr' },
      { status: 'Navigating eligibility criteria', subtext: 'Transmitting Member ID, Group Number, and Provider NPI to navigate specialist eligibility menu.', duration: 1600, type: 'ivr' },
      { status: 'Holding (Payer Queue Delay: 42m)', subtext: 'Donedial bypassing long queues automatically. High queue hold in active monitor mode...', duration: 2200, type: 'hold' },
      { status: 'Representative Connected', subtext: 'BCBS Agent: "Blue Cross Blue Shield eligibilities, my name is Arthur. How can I help?"', duration: 1800, type: 'talk', speaker: 'rep', transcript: 'BCBS Agent: "Blue Cross Blue Shield eligibility department, my name is Arthur. How may I assist you today?"' },
      { status: 'AI negotiating details', subtext: 'Donedial: "Diling on behalf of Cascade Clinic. Patient Matthew Miller DOB September 2, 1982, Member ID BCB-4921204. Need specialist office visit coverage for code 99244."', duration: 2300, type: 'talk', speaker: 'ai', transcript: 'Donedial: "Hi Arthur. I am calling from Cascade Clinic on behalf of Matthew Miller, DOB September second, 1982, Member ID BCB-4921204. We are looking for specialist outpatient office visit benefits, specifically code 99244. Is a pre-authorization required?"' },
      { status: 'Representative response recorded', subtext: 'BCBS Agent: "Yes, plan is active. Specialist visits are subject to a thirty-five dollar copay. Outpatient specialist deductible does not apply, but wait, a pre-auth is required for secondary diagnostics."', duration: 2600, type: 'talk', speaker: 'rep', transcript: 'BCBS Agent: "The patient is active under a PPO network. Specialist office visits have a thirty-five dollar copay. Deductible is waived. However, if any secondary diagnostic procedures are scheduled during that visit, they are subject to his thousand-dollar deductible. Also, code 99244 requires a prior authorization from the referring primary physician. Reference number BC-9941."' },
      { status: 'AI probing for exact rules', subtext: 'Donedial: "Thank you. Is there a specific prior authorization fax or portal to submit the referral?"', duration: 2100, type: 'talk', speaker: 'ai', transcript: 'Donedial: "Understood. Prior auth is needed. What is the standard submission portal for the referral, and what is the typical processing timeframe?"' },
      { status: 'Representative verifying rules', subtext: 'BCBS Agent: "Submit online via Availity portal or fax to 800-555-0199. Standard processing is seven to ten business days. Urgent is seventy-two hours."', duration: 2500, type: 'talk', speaker: 'rep', transcript: 'BCBS Agent: "Please submit the referral through our online Availity portal under prior-auths. Standard review takes seven to ten medical review days, while urgent requests are processed within seventy-two hours. Reference ID is BC-9941-Miller."' },
      { status: 'Formatting receipt...', subtext: 'Aggregating transcription metadata and building visual card representation.', duration: 1200, type: 'format' }
    ],
    result: {
      insuranceStatus: 'Active Coverage',
      deductible: '$1,000.00 (Waived for Consultation)',
      deductibleMet: 'No ($0.00 Met)',
      coinsurance: '0% after patient copay (PPO in-network)',
      copay: '$35.00 Copayment',
      maxBenefit: 'Unlimited',
      maxBenefitMet: 'N/A',
      outOfPocket: '$35.00 copay strictly for office consultation. Secondary diagnostic codes subject to $1,000 deductible.',
      preAuthRequired: true,
      redFlags: [
        "CRITICAL PRE-AUTH REQUIRED: Outpatient Specialist Code 99244 requires prior authorization referral from primary care provider.",
        "SECONDARY CODE ALERT: Copay is consult-only. If doctor performs scoping or basic in-office testing, patient must meet $1,000 deductible. Alert patient of potential secondary billing."
      ],
      payerReferenceNum: "BC-9941-Miller"
    }
  }
];

export const GENERAL_FAQS = [
  {
    question: "Is Donedial fully HIPAA compliant?",
    answer: "Absolutely. Donedial is built on SOC2-certified, encrypted servers with strict transit rules. All call audios are fully encrypted at rest, and we sign standard HIPAA Business Associate Agreements (BAAs) with every single clinic. Only authorized administrative staff can access history summaries."
  },
  {
    question: "Which insurance carriers/payers are supported?",
    answer: "We support over 200 major dental and medical insurance carriers nationwide, including MetLife, Delta Dental, Blue Cross Blue Shield, Aetna, Cigna, UnitedHealthcare, Guardian, Humana, and state-specific Medicaid portals. We systemically reverse-engineer phone routes carrier-by-carrier to bypass queue limits."
  },
  {
    question: "Do you integrate with practice software like Dentrix or Eaglesoft?",
    answer: "Yes. Donedial can integrate with popular Dental Practice Management (PMS) and Electronic Health Record (EHR) platforms—such as Dentrix, Eaglesoft, OpenDental, and medical billing structures—to drop verified benefit slips directly into patient appointment cards."
  },
  {
    question: "What happens if a call gets disconnected or dropped?",
    answer: "Insurers drop calls frequently, but that is exactly why Donedial exists. If an insurer drops the line, the system automatically dials back, navigates the prompts, resumes holding, and tracks down the info on our own compute time. You only get billed for successful, complete benefit results."
  },
  {
    question: "Is there a setup contract or onboarding cost?",
    answer: "None. Donedial operates on a transparent, monthly subscription plan with absolute freedom to downgrade or cancel at any time in 1 click. You can get fully set up and run your very first verified automated call in under 10 minutes."
  },
  {
    question: "How long does a typical verification call take?",
    answer: "The user dashboard returns a structured report in under 3 minutes. While the actual call to the insurer can take 15 to 45 minutes of real hold time on our side, you don't wait for it—our agent multitasking infrastructure operates multiple carrier lines concurrently, letting your team move on instantly."
  }
];
