/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = 3000;

// Enable JSON body parsing
app.use(express.json());

// Lazy-loaded Gemini AI client to prevent startup crashes if GEMINI_API_KEY is missing
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({ apiKey: key });
    }
  }
  return aiClient;
}

// REST API for checking health status
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Endpoint to simulate a custom insurance verification call using Gemini (or smart fallback)
app.post('/api/simulate-call', async (req, res) => {
  try {
    const { 
      patientName, 
      dob, 
      memberId, 
      payer, 
      npi, 
      serviceCode, 
      providerType 
    } = req.body;

    if (!patientName || !dob || !memberId || !payer) {
      return res.status(400).json({ error: 'Missing required patient fields: patientName, dob, memberId, or payer.' });
    }

    const cleanServiceCode = (serviceCode || 'D2740 (Porcelain Crown)').trim();
    const cleanProviderType = providerType || 'Dental';
    const cleanNpi = npi || '1093122177';

    const ai = getAIClient();
    
    if (ai) {
      // If client exists, call Gemini 3.5 Flash
      const systemInstruction = `
You are an expert healthcare insurance coordinator system model called Donedial AI. 
Your job is to simulate a complete outbound telephone call to the specified carrier: "${payer}".
The conversation occurs between "Donedial" and an "Insurer Representative" regarding coverage verification for:
- Patient Name: ${patientName}
- Date of Birth: ${dob}
- Member ID: ${memberId}
- Inquiring Service Code/Procedure: ${cleanServiceCode}
- Provider Subtype: ${cleanProviderType}
- Practice NPI: ${cleanNpi}

Based on the specific inquiring service code (e.g., if it is D2740 for major porcelain crowns, or D1110 for cleanings, D4341 for scaling, or medical consult codes), search your clinical knowledge. You must generate structured call step logs and a highly realistic transcript that includes professional dialogue, specific clauses, alternate benefits downgrades, deductible offsets, or pre-authorization status typical for ${payer}.

OUTPUT FORMAT REQUIREMENT:
You must return only a valid JSON object matching the following structure. Do not wrap it in markdown codeblocks (no \`\`\`json), return only RAW JSON:
{
  "id": "sim_custom",
  "patientName": "${patientName}",
  "providerType": "${cleanProviderType}",
  "payer": "${payer}",
  "npi": "${cleanNpi}",
  "memberId": "${memberId}",
  "dob": "${dob}",
  "requestedService": "${cleanServiceCode}",
  "steps": [
    {
      "status": "String describing active milestone (e.g. Connected to Aetna IVR)",
      "subtext": "Technical subtext explaining background detail (e.g. Navigating dental diagnostics...)",
      "duration": 1200,
      "type": "dial" or "ivr" or "hold" or "talk" or "format"
    },
    ... (generate exactly 8 to 11 chronologically progressing steps. At least 3 must have type 'talk' and include dialogue in the fields below)
  ],
  "result": {
    "insuranceStatus": "Active Coverage" or "Terminated" or "Inactive (COBRA Pending)",
    "deductible": "e.g. $50.00 standard individual",
    "deductibleMet": "e.g. Yes ($50/$50 met for calendar year)",
    "coinsurance": "e.g. 50% covered (Patient pays half)",
    "copay": "e.g. $15.00 flat or N/A",
    "maxBenefit": "e.g. $1,500.00 Annual Maximum",
    "maxBenefitMet": "e.g. $300.50 met ($1,199.50 remaining)",
    "outOfPocket": "e.g. Subject to coinsurance and alternate benefits",
    "preAuthRequired": true or false,
    "redFlags": [
       "Provide 2-3 specific clinical/insurance risks customized EXACTLY for this payer and inquiring code (e.g. composite downgrades, age exclusions for adult ortho D8080, wait periods, frequency rules such as crown limited to once per tooth in 7 years)."
    ],
    "payerReferenceNum": "e.g. DND-8892A-A2"
  }
}

Guidelines for steps of type "talk":
- You MUST specify the "speaker": "ai" or "rep"
- You MUST specify "transcript": "Precise dialogue line spoken, including quotes (e.g., Donedial: \\"Hello, I am calling on behalf of Apex Orthodontics to verify orthodos...\\" or Rep: \\"Standard crowns are covered at fifty percent...\\")"
`;

      const prompt = `Synthesize a realistic step-by-step phone verification scenario for patient ${patientName} on ${cleanServiceCode} with insurer ${payer}. Ensure the results are realistic and tailored specifically to the insurer and treatment code, providing realistic deductible, coinsurance, pre-auth, and 2-3 detailed red-flags/denial risks. Only return raw, clean, parseable JSON. No markdown enclosures.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          systemInstruction: systemInstruction,
        }
      });

      const rawText = response.text || '';
      // Ensure we sanitize double markdown enclosures
      const sanitizedText = rawText
        .replace(/```json/gi, '')
        .replace(/```/gi, '')
        .trim();

      const resultJSON = JSON.parse(sanitizedText);
      return res.json(resultJSON);
    } else {
      // Intelligent fallback generator if Gemini Key is not set
      // Customize scenarios dynamically based on input treatment codes
      const id = 'sim_custom_' + Math.floor(1000 + Math.random() * 9000);
      let coinsurance = '80% covered (In-network)';
      let deductible = '$50.00 Standard Individual';
      let deductibleMet = 'Yes ($50.00 met)';
      let maxBenefit = '$2,000.00 Annual Maximum';
      let maxBenefitMet = '$150.00 met ($1,850.00 remaining)';
      let copay = 'N/A';
      let preAuthRequired = false;
      let redFlags = [
        `PROMPT ACTION REQUIRED: Confirm ${payer} active member status at date of service.`,
        "Always document the representative voice operator verification code for claim records."
      ];

      const codeUpper = cleanServiceCode.toUpperCase();
      if (codeUpper.includes('D2740') || codeUpper.includes('CROWN')) {
        coinsurance = '50% covered (Major service)';
        redFlags = [
          `CRITICAL DOWNGRADE WARNING: ${payer} downgrades posterior porcelain crown restorations to amalgam composite rates. Patient must sign financial waiver for difference.`,
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

      // Generate realistic step logs
      const steps = [
        { status: 'Initializing Outbound Line', subtext: `Deploying secure AI router node on carrier network queue for ${payer}`, duration: 1000, type: 'dial' },
        { status: 'Connected. Navigating IVR prompts', subtext: `Injecting office NPI: ${cleanNpi} into automated voice interface...`, duration: 1200, type: 'ivr' },
        { status: 'Submitting member criteria', subtext: `Providing Member ID: ${memberId} and Patient DOB: ${dob}`, duration: 1500, type: 'ivr' },
        { status: 'Circumventing hold queue', subtext: `Skipping estimated 24-minute payer waiting queue... Holding active status.`, duration: 2000, type: 'hold' },
        { 
          status: 'Payer Representative Pick-up', 
          subtext: `${payer} Rep: "Thank you for dialing ${payer}, this is Rebecca. NPI and practice verification please?"`, 
          duration: 1800, 
          type: 'talk', 
          speaker: 'rep', 
          transcript: `${payer} Rep: "Thank you for dialing ${payer} eligibility line, this is Rebecca. NPI and practice details please?"` 
        },
        { 
          status: 'AI verifying credentials', 
          subtext: `Donedial: "Authenticating NPI ${cleanNpi}. Patients name is ${patientName}, checking coverage on code ${cleanServiceCode}..."`, 
          duration: 2000, 
          type: 'talk', 
          speaker: 'ai', 
          transcript: `Donedial: "Hello Rebecca. I am verifying coverage for patient ${patientName}, DOB: ${dob}, Member ID: ${memberId}. We are requesting general eligibility and specific guidelines for treatment code ${cleanServiceCode}."` 
        },
        { 
          status: 'Representative response recorded', 
          subtext: `${payer} Rep: "Patient active. Deductibles and treatment percentage details compiled."`, 
          duration: 2200, 
          type: 'talk', 
          speaker: 'rep', 
          transcript: `${payer} Rep: "I can look that up. The patient profile is active. Standard benefits apply for other procedures. For procedure ${cleanServiceCode}, coverage rate is ${coinsurance}. Annual deductible is fifty dollars."` 
        },
        { 
          status: 'AI scanning secondary risks', 
          subtext: `Donedial: "Thank you. Are there specific waiting periods or frequency exclusions on this tooth position?"`, 
          duration: 1800, 
          type: 'talk', 
          speaker: 'ai', 
          transcript: `Donedial: "Excellent. Rebecca, does this policy enforce frequency limitations or alternate downgrades for this procedure position?"` 
        },
        { 
          status: 'Exclusion clauses received', 
          subtext: `${payer} Rep: "Yes, exclusions apply. Reference number logged: ID-FALLBACK-${Math.floor(10000+Math.random()*90000)}"`, 
          duration: 2405, 
          type: 'talk', 
          speaker: 'rep', 
          transcript: `${payer} Rep: "Yes, standard policy rules apply. Copay is ${copay}. Frequency limits and downcode rules apply as designated. Pre-auth is ${preAuthRequired ? 'required' : 'not explicitly required'}. Outpatient reference confirmation ID is FALLBACK-${Math.floor(100000+Math.random()*900000)}."` 
        },
        { status: 'Structuring insurance receipt...', subtext: 'Mapping transcript to the clinic database standard framework.', duration: 1000, type: 'format' }
      ];

      const mockResultJSON = {
        id,
        patientName,
        providerType: cleanProviderType,
        payer,
        npi: cleanNpi,
        memberId,
        dob,
        requestedService: cleanServiceCode,
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

      return res.json(mockResultJSON);
    }

  } catch (error: any) {
    console.error('Call simulation API error:', error);
    res.status(500).json({ error: 'Failed to simulate verification: ' + error.message });
  }
});

// Setup static file serving to route all static files and fallback to index.html for SPA
async function mountMiddlewareAndListen() {
  if (process.env.NODE_ENV !== "production") {
    // Development mode with Vite hot build pipeline
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production compiled static server mode
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Donedial fullstack server running on http://0.0.0.0:${PORT}`);
  });
}

mountMiddlewareAndListen();
