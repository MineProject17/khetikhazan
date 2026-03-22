<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/cfc224d8-e97e-4939-a2dc-7561b4385012

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

# 🌾 KhetiKhazana — खेती खज़ाना

> **India's first AI-powered financial literacy simulation game for farmers.**  
> Built for the **Innovate4FinLit Game Challenge** by NCFE × Hack2Skill  
> Team: **BharatFinLit Labs** | Sai Ganesh Mandhati

---

<div align="center">

[![Live Demo](https://img.shields.io/badge/🔴%20LIVE%20DEMO-khetikhazan.web.app-green?style=for-the-badge)](https://khetikhazan.web.app)
[![GCP Cloud Run](https://img.shields.io/badge/GCP-Cloud%20Run-blue?style=for-the-badge&logo=google-cloud)](https://console.cloud.google.com/run)
[![Firebase](https://img.shields.io/badge/Firebase-Hosting-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com)
[![Gemini AI](https://img.shields.io/badge/Gemini-1.5%20Flash-purple?style=for-the-badge&logo=google)](https://aistudio.google.com)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

</div>

---

## Overview

KhetiKhazana (**"Farm Treasury"** in Hindi) addresses a critical gap in rural India's financial landscape: **farmers know money is tight, but lack a risk-free environment to practise financial decisions before making them in real life.**

- **60%** of rural debt in India remains informal (moneylenders at 30–60% interest)
- **₹1.8 lakh crore** in annual crop losses from weather events — most uninsured
- **23%** financial literacy rate in rural India
- **₹6,000 crore** in PM-KISAN benefits go unclaimed yearly

KhetiKhazana solves this through **muscle memory, not quizzes** — a 12-month farming simulation where every wrong decision costs you the harvest.

---

## 🎮 What Makes It Different

| Traditional Approach | KhetiKhazana |
|---|---|
| Pamphlets & awareness camps | ✅ High-fidelity consequence simulation |
| Quiz-based apps | ✅ Decisions with real financial outcomes |
| One-time training | ✅ Repeatable seasonal gameplay |
| No feedback loop | ✅ FinScore tracks every decision |
| Text-heavy content | ✅ Bank Sakhi AI explains in Hinglish |

---

## 🤖 Bank Sakhi — Agentic AI Advisor

Powered by **Google Gemini 1.5 Flash**, Bank Sakhi (Priya) is an agentic AI advisor that:

- Speaks **Hinglish** (Hindi + English mix) — the way farmers actually communicate
- Gives **context-aware tips** based on current month, decision, and player's financial state
- Appears **before every decision** — proactively guiding, not just reacting
- Falls back to **cached Hinglish tips** when offline — AI is an enhancement, not a dependency

```
System Prompt:
"You are Priya, Bank Sakhi — a warm financial advisor for Indian farmers.
Speak Hinglish. Max 2 sentences. Be practical and encouraging.
Topics: KCC loans, PMFBY insurance, e-NAM, PM-KISAN, Ayushman Bharat, MGNREGA."
```

---

## 🏛️ Government Schemes Taught In-Game

Every decision teaches a real scheme that already exists for every farmer:

| Scheme | What It Teaches | Month in Game |
|---|---|---|
| **KCC** — Kisan Credit Card | 4% subsidised loans vs 30% moneylenders | January |
| **PMFBY** — Crop Insurance | ₹1,500 protects entire season | March |
| **MGNREGA** | Fair government wages for farm labour | April |
| **e-NAM** | MSP ₹2,275/qtl guaranteed — no middleman | May & September |
| **Ayushman Bharat** | ₹5 lakh free health cover | August |
| **PM-KISAN** | ₹6,000/year direct benefit | Random event |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    USER LAYER                           │
│  Browser PWA (Chrome) · Service Worker · localStorage  │
│  Offline-First · Works on 2G · No app install needed   │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│                    AI LAYER                             │
│  Bank Sakhi = Gemini 1.5 Flash API                      │
│  Hinglish system prompt · Context-aware per month       │
│  Offline fallback: cached tips for all 12 months       │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│              BACKEND LAYER (GCP Mumbai)                 │
│  Firebase App Hosting · Firestore DB · Anonymous Auth   │
│  Cloud Run · Real-time leaderboard · <2KB per sync      │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│                  DATA FLOW                              │
│  Open URL → Service Worker caches app → Game runs      │
│  100% offline → On reconnect: Firestore syncs score    │
│  → Leaderboard updates live globally                   │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|---|---|---|
| **Frontend** | React + Vite + Tailwind CSS | 18.3 / 5.4 / 3.4 |
| **AI Advisor** | Google Gemini 1.5 Flash | Latest |
| **Database** | Firebase Firestore | SDK 10.x |
| **Auth** | Firebase Anonymous Auth | SDK 10.x |
| **Hosting** | Firebase App Hosting (GCP) | — |
| **Compute** | Google Cloud Run | us-west1 |
| **Build Tool** | Google AI Studio + Antigravity | — |
| **Fonts** | Mukta (Hindi) + Poppins | Google Fonts CDN |

---

## 📁 Repository Structure

```
khetikhazan/
├── src/
│   ├── components/
│   │   ├── GameEngine.jsx        # Core 12-month simulation loop
│   │   ├── DecisionCard.jsx      # Monthly decision UI
│   │   ├── BankSakhi.jsx         # Gemini AI chatbot widget
│   │   ├── EventPopup.jsx        # Random weather events
│   │   ├── HUD.jsx               # Live stats bar
│   │   ├── Results.jsx           # FinScore + badges + leaderboard
│   │   └── Leaderboard.jsx       # Real-time Firestore leaderboard
│   ├── data/
│   │   ├── decisions.js          # All 12 monthly decisions + logic
│   │   └── events.js             # Random events (drought, flood etc.)
│   ├── firebase/
│   │   ├── config.js             # Firebase init (reads from .env)
│   │   └── leaderboard.js        # Firestore read/write functions
│   ├── App.jsx
│   └── main.jsx
├── public/
│   ├── manifest.json             # PWA config
│   └── sw.js                     # Service worker (offline cache)
├── .env.example                  # Environment variables template
├── .gitignore                    # Excludes .env and secrets
├── firebase.json                 # Firebase hosting config
├── firebase-blueprint.json       # Firebase project blueprint
├── firestore.rules               # Firestore security rules
├── package.json                  # Dependencies + scripts
├── vite.config.ts                # Vite build config
└── README.md                     # This file
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- A Google account (for Gemini API key)
- Firebase project (free tier works)

### 1. Clone the Repository

```bash
git clone https://github.com/MineProject17/khetikhazan.git
cd khetikhazan
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_FIREBASE_API_KEY=your_firebase_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Get your **Gemini API key** free at [aistudio.google.com/apikey](https://aistudio.google.com/apikey)  
Get your **Firebase config** at [console.firebase.google.com](https://console.firebase.google.com)

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in Chrome.

> **No credentials required to play.** Anonymous Firebase Auth is used — open and play instantly.

### 5. Build for Production

```bash
npm run build
```

### 6. Deploy to Firebase

```bash
npm install -g firebase-tools
firebase login
firebase deploy
```

Your app will be live at `https://your-project.web.app`

---

## 🎯 Gameplay — The 12-Month Simulation

The player is **Ramu Kaka** — a small farmer with 2 acres of wheat, ₹9,000 savings, and zero debt. The year is January.

### Three Seasons — Rule of Three

```
PHASE 1: Pre-Sowing (Jan–Mar)
  → Secure KCC loan OR moneylender OR own savings
  → Buy PMFBY insurance OR skip
  → These choices determine if you survive Phase 2

PHASE 2: Growth & Crisis (Apr–Aug)
  → Manage crop, hire labour, register e-NAM
  → Random events fire: drought, flood, pest, medical emergency
  → Only PMFBY-insured farmers survive the flood

PHASE 3: Harvest & Plan (Sep–Dec)
  → Sell via e-NAM (best) or arhatiya (worst)
  → Repay all debt or watch it compound
  → Plan Year 2 with KCC + FPO membership
```

### FinScore System (0–1000)

| Rank | Score | Title |
|---|---|---|
| 🏆 | 700+ | Kisan Samraat |
| 🥈 | 500+ | Pragat Kisan |
| 🥉 | 300+ | Naveen Kisan |
| 📚 | 0–299 | Seekhta Kisan |

### Badges

`🛡️ Insurance Hero` `💳 Debt-Free` `📱 Digital Farmer` `🏦 KCC Holder` `💰 Smart Saver` `🎓 FinGuru` `🤝 FPO Member`

---

## 🌐 Offline & Low-Bandwidth Support

Built specifically for rural India's connectivity constraints:

- **PWA Service Worker** caches all assets on first load — full game runs with **zero internet**
- **Single bundle under 500KB** — works on 2G networks
- **localStorage** saves game state every round — no progress lost if signal drops
- **Firestore sync under 2KB per session** — syncs score when reconnected
- **No login required** — anonymous auth means zero friction for low-literacy users
- **Runs on any Android phone** with Chrome — even 2GB RAM, 4-year-old devices

---

## 📊 Firestore Database Schema

```
Collection: khetikhazan_scores
Document fields:
{
  name:           string,   // Anonymous Farmer (privacy-safe)
  score:          number,   // FinScore 0-1000
  debt:           number,   // Final debt in ₹
  wiseDecisions:  number,   // Count of optimal choices (max 12)
  badges:         array,    // Earned badges
  region:         string,   // Player's region
  insured:        boolean,  // Whether PMFBY was purchased
  timestamp:      timestamp // Firestore server timestamp
}
```

---

## 🗺️ Roadmap

### Phase 1 — Hackathon ✅ (Current)
- [x] Web PWA live on Firebase GCP
- [x] 12-month simulation with all decisions
- [x] Bank Sakhi powered by Gemini 1.5 Flash
- [x] Real-time Firestore leaderboard
- [x] PWA offline support
- [x] Deployed on GCP Cloud Run

### Phase 2 — Pilot (3–6 months)
- [ ] Flutter mobile app (Android, 50MB max)
- [ ] Bhashini API — voice interface in 4 Indian languages
- [ ] Live mandi prices via Agmarknet API
- [ ] Cotton and rice crop modules
- [ ] 500 farmer pilot with 3 NGO partners

### Phase 3 — Scale (6–12 months)
- [ ] 10,000 users across 5 states
- [ ] Live PM-KISAN eligibility check
- [ ] Real IMD weather data integration
- [ ] Impact analytics dashboard via BigQuery
- [ ] Community leaderboards per district

### Phase 4 — National (Year 2)
- [ ] NCFE official integration
- [ ] 1 million farmers target
- [ ] ₹5/user/year at scale on GCP auto-scaling
- [ ] Government subsidy via Bhashini (free) + PM-KISAN APIs (free)

---

## 💰 Cost Analysis

| Scale | Monthly Cost | Per User/Year |
|---|---|---|
| Hackathon (now) | ₹0 (free tier) | — |
| 10,000 users | ₹15,000 | ₹18 |
| 1,00,000 users | ₹60,000 | ₹7.2 |
| 10,00,000 users | ₹4,16,000 | ₹5 |

Government APIs (Bhashini, PM-KISAN, e-NAM) are **free** — reducing marginal cost significantly.

---

## 🔒 Security

- All API keys stored in `.env` — never committed to GitHub
- `.gitignore` excludes all secret files
- Firebase API key restricted to `khetikhazan.web.app` only
- Anonymous auth — no personal data collected
- DPDP Act compliant — zero PII stored
- Firestore security rules prevent unauthorised writes

---

## 🤝 Contributing

This project was built for the Innovate4FinLit Game Challenge. Contributions welcome after the submission deadline (March 29, 2026).

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 🙏 Acknowledgements

- **NCFE** (National Centre for Financial Education) — for the Innovate4FinLit challenge
- **Hack2Skill** — for organising and supporting the hackathon
- **Google** — for Gemini API, Firebase, GCP, AI Studio, and Antigravity
- **Bhashini** (Govt. of India) — voice API for Indian language support (Phase 2)

---

<div align="center">

**BharatFinLit Labs · Sai Ganesh Mandhati**  
[khetikhazan.web.app](https://khetikhazan.web.app) · [GitHub](https://github.com/MineProject17/khetikhazan)

*One game. One year. One farmer's financial future — changed.*

</div>




