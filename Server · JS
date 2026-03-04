/**
 * Symptom to Specialist Mapper API
 * ---------------------------------
 * An x402-powered API that maps symptoms to medical specialists.
 * AI agents pay $0.05 per query in USDC on Base.
 *
 * Built with: Express.js + x402 protocol
 * Deploy on:  Railway.app
 */

const express = require("express");
const { paymentMiddleware, Network, Resource } = require("@coinbase/x402-express");

const app = express();
app.use(express.json());

// ─────────────────────────────────────────────
// YOUR WALLET ADDRESS (set in Railway env vars)
// ─────────────────────────────────────────────
const WALLET_ADDRESS = process.env.WALLET_ADDRESS;
const PORT = process.env.PORT || 3000;
const PRICE_PER_QUERY = "$0.05"; // You control this

// ─────────────────────────────────────────────
// SYMPTOM → SPECIALIST DATA
// This is your moat. The richer and more accurate
// this data is, the more valuable your API is.
// ─────────────────────────────────────────────
const symptomMap = {
  // Neurological
  headache: ["Neurologist", "Primary Care Physician"],
  migraine: ["Neurologist"],
  seizure: ["Neurologist"],
  dizziness: ["Neurologist", "ENT (Ear, Nose & Throat)"],
  numbness: ["Neurologist"],
  memory_loss: ["Neurologist", "Geriatrician"],
  tremor: ["Neurologist"],

  // Cardiac
  chest_pain: ["Cardiologist", "Emergency Medicine"],
  palpitations: ["Cardiologist"],
  shortness_of_breath: ["Cardiologist", "Pulmonologist"],
  high_blood_pressure: ["Cardiologist", "Primary Care Physician"],
  swollen_legs: ["Cardiologist", "Vascular Surgeon"],

  // Gastrointestinal
  abdominal_pain: ["Gastroenterologist", "Primary Care Physician"],
  bloating: ["Gastroenterologist"],
  acid_reflux: ["Gastroenterologist"],
  blood_in_stool: ["Gastroenterologist", "Colorectal Surgeon"],
  nausea: ["Gastroenterologist", "Primary Care Physician"],
  constipation: ["Gastroenterologist", "Primary Care Physician"],
  diarrhea: ["Gastroenterologist", "Primary Care Physician"],

  // Musculoskeletal
  joint_pain: ["Rheumatologist", "Orthopedic Surgeon"],
  back_pain: ["Orthopedic Surgeon", "Physical Therapist"],
  knee_pain: ["Orthopedic Surgeon"],
  muscle_weakness: ["Neurologist", "Rheumatologist"],
  swollen_joints: ["Rheumatologist"],
  fracture: ["Orthopedic Surgeon"],

  // Skin
  rash: ["Dermatologist"],
  acne: ["Dermatologist"],
  hair_loss: ["Dermatologist", "Endocrinologist"],
  mole_change: ["Dermatologist"],
  eczema: ["Dermatologist"],
  psoriasis: ["Dermatologist"],

  // Mental Health
  anxiety: ["Psychiatrist", "Psychologist"],
  depression: ["Psychiatrist", "Psychologist"],
  insomnia: ["Psychiatrist", "Sleep Specialist"],
  panic_attacks: ["Psychiatrist", "Psychologist"],
  ptsd: ["Psychiatrist", "Psychologist"],
  mood_swings: ["Psychiatrist"],

  // Eyes
  blurred_vision: ["Ophthalmologist"],
  eye_pain: ["Ophthalmologist"],
  double_vision: ["Ophthalmologist", "Neurologist"],
  dry_eyes: ["Ophthalmologist"],

  // ENT
  ear_pain: ["ENT (Ear, Nose & Throat)"],
  hearing_loss: ["ENT (Ear, Nose & Throat)", "Audiologist"],
  sore_throat: ["ENT (Ear, Nose & Throat)", "Primary Care Physician"],
  nasal_congestion: ["ENT (Ear, Nose & Throat)", "Primary Care Physician"],
  sinus_pain: ["ENT (Ear, Nose & Throat)"],

  // Hormonal / Endocrine
  fatigue: ["Endocrinologist", "Primary Care Physician"],
  weight_gain: ["Endocrinologist", "Primary Care Physician"],
  weight_loss: ["Endocrinologist", "Oncologist", "Primary Care Physician"],
  excessive_thirst: ["Endocrinologist"],
  hot_flashes: ["Endocrinologist", "OB/GYN"],

  // Urological
  frequent_urination: ["Urologist", "Endocrinologist"],
  blood_in_urine: ["Urologist"],
  painful_urination: ["Urologist", "Primary Care Physician"],
  kidney_pain: ["Urologist", "Nephrologist"],

  // Reproductive / Women's Health
  irregular_periods: ["OB/GYN"],
  pelvic_pain: ["OB/GYN"],
  pregnancy_concerns: ["OB/GYN"],
  breast_lump: ["OB/GYN", "Oncologist"],

  // Respiratory
  chronic_cough: ["Pulmonologist"],
  wheezing: ["Pulmonologist"],
  asthma: ["Pulmonologist"],
  sleep_apnea: ["Sleep Specialist", "Pulmonologist"],
};

// Urgency rules — symptoms that need emergency care flagged
const urgentSymptoms = [
  "chest_pain",
  "seizure",
  "blood_in_stool",
  "blood_in_urine",
  "shortness_of_breath",
  "breast_lump",
  "weight_loss",
];

// ─────────────────────────────────────────────
// x402 PAYMENT MIDDLEWARE
// This is what makes the API pay-per-query.
// Agents must pay PRICE_PER_QUERY in USDC
// before the request goes through.
// ─────────────────────────────────────────────
app.use(
  paymentMiddleware(
    WALLET_ADDRESS,
    {
      "GET /map": {
        price: PRICE_PER_QUERY,
        network: Network.BaseSepolia, // Switch to Network.Base for mainnet
        description: "Map one or more symptoms to recommended medical specialists",
      },
      "POST /map-detailed": {
        price: PRICE_PER_QUERY,
        network: Network.BaseSepolia,
        description: "Detailed symptom analysis with urgency scoring and notes",
      },
    },
    {
      facilitatorUrl: "https://x402.org/facilitator", // Coinbase's public facilitator
    }
  )
);

// ─────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────

/**
 * GET /map?symptoms=headache,dizziness
 * Simple lookup — returns specialists for given symptoms
 */
app.get("/map", (req, res) => {
  const rawSymptoms = req.query.symptoms;

  if (!rawSymptoms) {
    return res.status(400).json({
      error: "Missing required query param: symptoms",
      example: "/map?symptoms=headache,dizziness",
    });
  }

  const symptoms = rawSymptoms
    .split(",")
    .map((s) => s.trim().toLowerCase().replace(/ /g, "_"));

  const results = {};
  const allSpecialists = new Set();
  const unknownSymptoms = [];

  symptoms.forEach((symptom) => {
    if (symptomMap[symptom]) {
      results[symptom] = symptomMap[symptom];
      symptomMap[symptom].forEach((s) => allSpecialists.add(s));
    } else {
      unknownSymptoms.push(symptom);
    }
  });

  const isUrgent = symptoms.some((s) => urgentSymptoms.includes(s));

  return res.json({
    symptoms_queried: symptoms,
    results,
    recommended_specialists: [...allSpecialists],
    urgency: isUrgent ? "HIGH — consider emergency or same-day care" : "ROUTINE — schedule a regular appointment",
    unknown_symptoms: unknownSymptoms.length > 0 ? unknownSymptoms : undefined,
    disclaimer: "This is a routing tool only. Not a medical diagnosis. Always consult a licensed physician.",
  });
});

/**
 * POST /map-detailed
 * Body: { symptoms: ["headache", "blurred vision"], notes: "3 weeks duration" }
 * Returns richer response with context
 */
app.post("/map-detailed", (req, res) => {
  const { symptoms: inputSymptoms, notes } = req.body;

  if (!inputSymptoms || !Array.isArray(inputSymptoms)) {
    return res.status(400).json({
      error: "Body must include a symptoms array",
      example: { symptoms: ["headache", "blurred_vision"], notes: "optional free text context" },
    });
  }

  const symptoms = inputSymptoms.map((s) =>
    s.trim().toLowerCase().replace(/ /g, "_")
  );

  const specialistFrequency = {};
  const perSymptom = {};
  const unknownSymptoms = [];

  symptoms.forEach((symptom) => {
    if (symptomMap[symptom]) {
      perSymptom[symptom] = {
        specialists: symptomMap[symptom],
        urgent: urgentSymptoms.includes(symptom),
      };
      symptomMap[symptom].forEach((s) => {
        specialistFrequency[s] = (specialistFrequency[s] || 0) + 1;
      });
    } else {
      unknownSymptoms.push(symptom);
    }
  });

  // Sort specialists by how many symptoms they cover
  const rankedSpecialists = Object.entries(specialistFrequency)
    .sort((a, b) => b[1] - a[1])
    .map(([specialist, count]) => ({ specialist, symptoms_covered: count }));

  const isUrgent = symptoms.some((s) => urgentSymptoms.includes(s));

  return res.json({
    symptoms_queried: symptoms,
    per_symptom_breakdown: perSymptom,
    ranked_specialists: rankedSpecialists,
    top_recommendation: rankedSpecialists[0]?.specialist || null,
    urgency: isUrgent ? "HIGH" : "ROUTINE",
    urgency_detail: isUrgent
      ? "One or more symptoms may require urgent care. Seek same-day or emergency evaluation."
      : "These symptoms appear non-urgent. Schedule a routine appointment.",
    patient_notes: notes || null,
    unknown_symptoms: unknownSymptoms.length > 0 ? unknownSymptoms : undefined,
    disclaimer: "This is a triage routing tool only. Not a medical diagnosis.",
  });
});

/**
 * GET /symptoms
 * Free endpoint — lists all supported symptoms (no payment required)
 * This helps agents know what they can query before paying
 */
app.get("/symptoms", (req, res) => {
  return res.json({
    total: Object.keys(symptomMap).length,
    symptoms: Object.keys(symptomMap).sort(),
    usage: "GET /map?symptoms=symptom1,symptom2 (costs $0.05 USDC per query)",
  });
});

/**
 * GET /health
 * Free health check for Railway deployment monitoring
 */
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─────────────────────────────────────────────
// START SERVER
// ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Symptom Specialist API running on port ${PORT}`);
  console.log(`Wallet: ${WALLET_ADDRESS}`);
  console.log(`Price per query: ${PRICE_PER_QUERY} USDC`);
});
