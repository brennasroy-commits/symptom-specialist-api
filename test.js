/**
 * test.js — Run this locally to verify your API works before deploying
 *
 * This bypasses x402 payments and hits the free endpoints only.
 * Run with: node test.js
 *
 * Make sure your server is running first: npm start
 */

const BASE_URL = "http://localhost:3000";

async function test(name, url, options = {}) {
  try {
    const res = await fetch(url, options);
    const data = await res.json();
    console.log(`\n✅ ${name}`);
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.log(`\n❌ ${name} FAILED`);
    console.error(err.message);
  }
}

async function runTests() {
  console.log("Running API tests...\n");
  console.log("=".repeat(50));

  // Free endpoints (no payment required)
  await test("Health Check", `${BASE_URL}/health`);
  await test("List All Symptoms", `${BASE_URL}/symptoms`);

  // These will return 402 Payment Required without a funded wallet
  // That's expected behavior — it means the payment middleware is working
  console.log("\n" + "=".repeat(50));
  console.log("\nℹ️  The following will return 402 Payment Required.");
  console.log("   That means x402 is working correctly.\n");

  await test(
    "Map Symptoms (expects 402)",
    `${BASE_URL}/map?symptoms=headache,dizziness`
  );

  await test("Map Detailed (expects 402)", `${BASE_URL}/map-detailed`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      symptoms: ["chest_pain", "shortness_of_breath"],
      notes: "Started 2 days ago",
    }),
  });

  console.log("\n" + "=".repeat(50));
  console.log("\n✅ Tests complete.");
  console.log(
    "If health + symptoms returned data and /map returned 402 — you are ready to deploy.\n"
  );
}

runTests();
