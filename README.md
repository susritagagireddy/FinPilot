# FinPilot AI 💸

> A conversational financial coaching web app with persistent memory, behavioral pattern detection, and intelligent model routing.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-4-FF6384?logo=chartdotjs&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)

---

## What is this?

Most budgeting apps log your money. FinPilot does something different — it *remembers* your financial behavior over time and uses that memory to give contextual advice.

Tell it your salary and savings goal on Day 1. Log a big Swiggy order on Day 7. Ask if you should buy an iPhone on Day 20. It will reference your emergency fund goal from two weeks ago and tell you exactly how many months that purchase sets you back.

The agent also routes queries between a lightweight model (fast math and logging) and a reasoning-heavy model (behavioral analysis and planning decisions) based on what you're actually asking — a pattern called **Cascadeflow routing**.

---

## Features

**Conversational Agent**
- Natural language expense logging (`"I spent ₹2,500 on Swiggy"`)
- Goal-aware advice that references your financial history mid-conversation
- Suggestion chips that walk through a full Day 1 → Day 7 → Day 20 coaching arc

**Cognitive Memory Shield**
- Persists salary, rent, savings targets, and behavioral tags across the session
- Extracts behavioral insights automatically (dining spikes, cash burn rate, retail therapy patterns)
- Stores everything in `localStorage` — survives page refresh

**Cascadeflow Model Routing**
- Simple arithmetic and logging → Llama 3 (8B) — 0.2s, ~64 tokens
- Financial planning, purchase evaluation, behavioral reasoning → Gemini 1.5 Pro — 1.2s, ~420 tokens
- Live routing decision log visible in the chat sidebar

**Dashboard**
- KPI cards: income, rent, spending, remaining balance
- Circular progress tracker for savings goals
- Behavioral insight tags (warning / success / info)

**Memory Timeline**
- Chronological log of every financial event the agent has recorded
- Color-coded by event type: salary, warning, info, danger

**Spending Timeline**
- Manual expense logger with category tagging
- Running totals per category

**Future Self Projection**
- Interactive 12-month savings projection chart (Chart.js)
- Sliders to simulate food reduction %, extra monthly savings, and annual salary hike
- Compares current trend vs optimized path

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 5 |
| Charts | Chart.js 4, react-chartjs-2 |
| Icons | Lucide React |
| Persistence | localStorage |
| Agent logic | Custom rule engine (`agentEngine.js`) |
| Styling | Custom CSS with CSS variables (dark theme) |

No backend. No database. The entire agent runs client-side.

---

## Project Structure

```
finpilot-ai/
├── src/
│   ├── App.jsx                   # Root layout, tab routing, global state
│   ├── main.jsx
│   ├── index.css                 # CSS variables, dark theme, all component styles
│   ├── components/
│   │   ├── AIChat.jsx            # Chat interface + Cascadeflow routing sidebar
│   │   ├── Dashboard.jsx         # KPI cards, goal tracker, memory shield
│   │   ├── MemoryTimeline.jsx    # Chronological event log
│   │   ├── SpendingTimeline.jsx  # Expense logger + category breakdown
│   │   ├── FutureSelf.jsx        # 12-month projection chart with sliders
│   │   ├── Onboarding.jsx        # First-run financial profile setup
│   │   └── DemoControls.jsx      # Demo step controls (hackathon mode)
│   └── utils/
│       └── agentEngine.js        # Core agent: routing, memory, state transitions
├── index.html
├── vite.config.js
└── package.json
```

---

## Getting Started

**Prerequisites:** Node.js 18+

```bash
# Clone the repo
git clone https://github.com/your-username/finpilot-ai.git
cd finpilot-ai

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

---

## How the Agent Works

All agent logic lives in `src/utils/agentEngine.js`. There are three core functions:

**`routeModel(userInput)`**
Parses the query for intent keywords and returns routing metadata — which model to use, why, estimated latency, and token count. Keywords like `should`, `plan`, `iphone`, `behavior`, `predict` trigger the Pro model. Everything else routes to the fast model.

**`processAgentInput(text, currentState)`**
The main processing loop. Parses natural language input, mutates the financial state (salary, expenses, goals, memory facts, behavioral insights), appends to the memory timeline, and returns both the updated state and the AI response message.

**`extractBehavioralInsights(expenses, salary, savingsGoal)`**
Runs after every state update. Scans the expense list for patterns — food spending ratio, total burn rate, post-payday shopping spikes — and generates insight tags shown on the dashboard.

State shape is defined in `createInitialState()` and flows through the entire app via props from `App.jsx`.

---

## Demo Flow

The app includes five pre-built suggestion chips that walk through the core narrative:

| Message | What it demonstrates |
|---|---|
| `My monthly salary is ₹40,000.` | Salary parsing, memory update, timeline entry |
| `My rent is ₹8,000. Save ₹10 lakh in 5 years.` | Multi-fact parsing, goal registration |
| `I spent ₹2,500 on Swiggy.` | Expense logging, food budget check, behavioral warning |
| `Should I buy an iPhone?` | Goal-aware reasoning, Pro model routing, 4-month delay calculation |
| `If I keep spending like this, where will I be in 1 year?` | Future projection, Future Self tab |

To reset the demo state: open the browser console and run `localStorage.clear()`, then refresh.

---

## What I Learned Building This

The hardest part wasn't the AI logic — it was **state architecture**. Every agent response needs to be grounded in an accumulated picture of the user. Getting the state shape right in `agentEngine.js`, ensuring each call to `processAgentInput` correctly reads from and writes back to the same structure, and making behavioral insights update reactively after every state change — that was where the real design thinking happened.

The cascadeflow routing pattern is something I want to explore further with actual API calls to tiered models in a future version.

---

## Roadmap

- [ ] Replace simulated model responses with live Gemini API calls
- [ ] Add multi-month expense tracking with persistent history
- [ ] Export financial summary as PDF
- [ ] Mobile-responsive layout
- [ ] User authentication + cloud sync

---

## Author

**Susrita Gagireddy**
CS Engineering student @ CR Rao AIMSCS, Hyderabad Central University
Research intern @ iHub-Data, IIIT Hyderabad (vehicle density detection, YOLOv8)

[LinkedIn](https://linkedin.com/in/your-handle) · [GitHub](https://github.com/your-username)

---

## License

MIT
