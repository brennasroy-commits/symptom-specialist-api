# Symptom to Specialist Mapper API

An x402-powered API that maps symptoms to recommended medical specialists.
AI agents pay **$0.05 USDC per query** — no subscriptions, no API keys, no human in the loop.

Built on the [x402 protocol](https://github.com/coinbase/x402) by Coinbase.

---

## What It Does

Send a list of symptoms → get back ranked medical specialists.

```
GET /map?symptoms=headache,blurred_vision
```

```json
{
  "symptoms_queried": ["headache", "blurred_vision"],
  "recommended_specialists": ["Neurologist", "Ophthalmologist"],
  "urgency": "ROUTINE — schedule a regular appointment",
  "disclaimer": "This is a routing tool only. Not a medical diagnosis."
}
```

---

## Endpoints

| Endpoint | Cost | Description |
|---|---|---|
| `GET /symptoms` | Free | List all supported symptoms |
| `GET /health` | Free | Health check for deployment monitoring |
| `GET /map?symptoms=...` | $0.05 USDC | Map symptoms to specialists |
| `POST /map-detailed` | $0.05 USDC | Detailed analysis with urgency ranking |

---

## Setup Locally

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/symptom-specialist-api.git
cd symptom-specialist-api
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env
```
Edit `.env` and add your Base wallet address:
```
WALLET_ADDRESS=0xYourWalletAddressHere
```

> **Get a free Base wallet:** Download [Coinbase Wallet](https://www.coinbase.com/wallet) or use any EVM-compatible wallet.

### 4. Run the server
```bash
npm start
```

Server runs at `http://localhost:3000`

### 5. Test it (free endpoint first)
```bash
curl http://localhost:3000/symptoms
```

---

## Deploy to Railway

This API is designed to deploy on [Railway.app](https://railway.app) in minutes.

### Steps:
1. Push this repo to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Select this repo
4. Railway auto-detects Node.js and runs `npm start`
5. Add environment variables in Railway dashboard:
   - `WALLET_ADDRESS` = your Base wallet address
   - `NODE_ENV` = production
6. Click **Generate Domain** — your API is live

---

## How Payments Work (x402 Protocol)

1. AI agent sends a request to `/map`
2. Server responds with `402 Payment Required` + payment details
3. Agent automatically pays $0.05 USDC from its wallet to your wallet
4. Server receives payment confirmation and returns the data
5. USDC lands in your wallet instantly

No intermediary. No Stripe. No invoices. Just USDC → your wallet.

**Switch to mainnet:** In `server.js`, change `Network.BaseSepolia` to `Network.Base`

---

## For AI Agents: Integration Example

```python
# Python example using x402-fetch
import x402

client = x402.Client(wallet_private_key="YOUR_AGENT_WALLET_KEY")

response = client.get(
    "https://your-api.railway.app/map",
    params={"symptoms": "headache,blurred_vision"}
)

print(response.json())
```

```javascript
// JavaScript example
import { wrapFetchWithPayment } from "@coinbase/x402-fetch";

const fetch = wrapFetchWithPayment(baseFetch, wallet);

const res = await fetch("https://your-api.railway.app/map?symptoms=chest_pain");
const data = await res.json();
```

---

## Get Listed on x402 Bazaar

Once deployed, submit your API to the [x402 Bazaar](https://x402.org) so AI agents can discover it automatically.

---

## Disclaimer

This API is a **triage routing tool** — it helps direct users to appropriate specialists based on symptoms. It is **not** a diagnostic tool and does not provide medical advice. Always consult a licensed physician.

---

## License

MIT
