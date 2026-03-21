import { MonthData, GameState } from './types';

export const INITIAL_STATE: GameState = {
  money: 9000,
  debt: 0,
  crop: 12,
  cropHealth: 100,
  score: 100,
  month: 0,
  wiseDecisions: 0,
  insured: false,
  enam: false,
  kcc: false,
  stored: 0,
  fpo: false,
  savings: 0,
};

export const MONTHS: MonthData[] = [
  {
    name: "January",
    season: "Winter (Rabi)",
    description: "It's time to buy seeds for the new season. You have ₹9000. How will you finance it?",
    tip: "Kisan Credit Card (KCC) offers the lowest interest rate (4-7%) compared to local moneylenders (24-36%).",
    choices: [
      { text: "Use savings (₹5000)", effect: { money: -5000 }, consequence: "You used your cash, but now have less liquidity for emergencies.", isWise: false, isUPI: true },
      { text: "Take KCC Loan (₹5000)", effect: { money: 5000, debt: 5000, kcc: true }, consequence: "Smart choice! You got a low-interest loan and kept your cash.", isWise: true },
      { text: "Borrow from Moneylender", effect: { money: 5000, debt: 8000 }, consequence: "High interest! Your debt is much higher than what you borrowed.", isWise: false }
    ]
  },
  {
    name: "February",
    season: "Winter (Rabi)",
    description: "Your crops are growing. Do you want to buy crop insurance (PMFBY)?",
    tip: "PMFBY protects you against natural calamities. The premium is very low for food crops.",
    choices: [
      { text: "Buy Insurance (₹500)", effect: { money: -500, insured: true }, consequence: "You are now protected against weather risks.", isWise: true, isUPI: true },
      { text: "Skip Insurance", effect: {}, consequence: "You saved ₹500, but your crops are at risk.", isWise: false },
      { text: "Buy expensive private insurance (₹2000)", effect: { money: -2000, insured: true }, consequence: "You are insured, but paid too much.", isWise: false, isUPI: true }
    ]
  },
  {
    name: "March",
    season: "Spring",
    description: "You have some extra cash. What should you do with it?",
    tip: "Opening a savings account keeps your money safe and earns interest.",
    choices: [
      { text: "Keep cash at home", effect: {}, consequence: "Your money is not earning interest and is at risk of theft.", isWise: false },
      { text: "Deposit in Bank (₹2000)", effect: { money: -2000, savings: 2000 }, consequence: "Safe and earning interest!", isWise: true, isUPI: true },
      { text: "Buy a new phone (₹4000)", effect: { money: -4000 }, consequence: "You spent money on a depreciating asset.", isWise: false, isUPI: true }
    ]
  },
  {
    name: "April",
    season: "Summer (Zaid)",
    description: "Harvest time! Where will you sell your produce?",
    tip: "e-NAM (National Agriculture Market) connects you to buyers nationwide for better prices.",
    choices: [
      { text: "Local middleman", effect: { money: 8000 }, consequence: "You got paid immediately, but at a lower price.", isWise: false },
      { text: "Register on e-NAM", effect: { money: 12000, enam: true }, consequence: "Great! You bypassed middlemen and got a better price.", isWise: true },
      { text: "Wait for better prices", effect: { stored: 1 }, consequence: "You stored the crop, hoping for better prices later.", isWise: false }
    ]
  },
  {
    name: "May",
    season: "Summer (Zaid)",
    description: "You need to buy a tractor. How will you fund it?",
    tip: "Joining an FPO (Farmer Producer Organization) allows you to share expensive machinery.",
    choices: [
      { text: "Take a huge loan", effect: { debt: 20000 }, consequence: "You are now heavily in debt.", isWise: false },
      { text: "Join an FPO (₹1000 fee)", effect: { money: -1000, fpo: true }, consequence: "Smart! You can now rent machinery cheaply through the FPO.", isWise: true, isUPI: true },
      { text: "Rent from neighbor (₹3000)", effect: { money: -3000 }, consequence: "A decent short-term solution, but expensive over time.", isWise: false, isUPI: true }
    ]
  },
  {
    name: "June",
    season: "Monsoon (Kharif)",
    description: "Monsoon is here. Time to sow Kharif crops. Buy seeds and fertilizers.",
    tip: "Soil Health Card helps you buy only the fertilizers your soil actually needs.",
    choices: [
      { text: "Buy standard mix (₹4000)", effect: { money: -4000 }, consequence: "You spent money on fertilizers you might not need.", isWise: false, isUPI: true },
      { text: "Use Soil Health Card (₹2000)", effect: { money: -2000 }, consequence: "You saved money by buying only what your soil needs!", isWise: true, isUPI: true },
      { text: "Buy premium imported (₹6000)", effect: { money: -6000 }, consequence: "Too expensive and unnecessary.", isWise: false, isUPI: true }
    ]
  },
  {
    name: "July",
    season: "Monsoon (Kharif)",
    description: "A salesman offers a 'double your money in 6 months' scheme.",
    tip: "Beware of Ponzi schemes! If it sounds too good to be true, it probably is.",
    choices: [
      { text: "Invest ₹5000", effect: { money: -5000 }, consequence: "Oh no! It was a scam. You lost your money.", isWise: false, isUPI: true },
      { text: "Ignore and report", effect: { score: 10 }, consequence: "Wise choice! You protected your hard-earned money.", isWise: true },
      { text: "Invest ₹1000 just to see", effect: { money: -1000 }, consequence: "You still lost money to a scam.", isWise: false, isUPI: true }
    ]
  },
  {
    name: "August",
    season: "Monsoon (Kharif)",
    description: "Your daughter needs a laptop for college (₹15000).",
    tip: "Education loans have lower interest rates and flexible repayment terms.",
    choices: [
      { text: "Sell land to buy it", effect: { cropHealth: -20, money: 15000 }, consequence: "You lost your income-generating asset.", isWise: false },
      { text: "Take Education Loan", effect: { debt: 15000 }, consequence: "Good choice. The loan is manageable and an investment in her future.", isWise: true },
      { text: "Borrow from moneylender", effect: { debt: 25000 }, consequence: "Terrible interest rates will trap you in debt.", isWise: false }
    ]
  },
  {
    name: "September",
    season: "Autumn",
    description: "You receive a suspicious SMS asking for your UPI PIN to receive PM-KISAN funds.",
    tip: "Never share your UPI PIN. Government schemes never ask for your PIN to send money.",
    choices: [
      { text: "Share PIN", effect: { money: -5000 }, consequence: "You were scammed! Money was deducted from your account.", isWise: false },
      { text: "Delete SMS", effect: { score: 10 }, consequence: "Safe! You avoided a phishing scam.", isWise: true },
      { text: "Call the number to check", effect: { money: -500 }, consequence: "They tricked you into sending a small amount.", isWise: false }
    ]
  },
  {
    name: "October",
    season: "Autumn",
    description: "Kharif harvest is ready. Prices are currently low.",
    tip: "Warehouse Receipt Financing lets you store crops and get a loan against them to sell later when prices rise.",
    choices: [
      { text: "Sell immediately", effect: { money: 6000 }, consequence: "You sold at a loss due to low market prices.", isWise: false },
      { text: "Use Warehouse Receipt", effect: { money: 4000, stored: 1 }, consequence: "Smart! You got cash now and can sell the crop later for more.", isWise: true },
      { text: "Leave crops in field", effect: { cropHealth: -30 }, consequence: "Crops got damaged. You lost money.", isWise: false }
    ]
  },
  {
    name: "November",
    season: "Winter (Rabi)",
    description: "Time to repay your KCC loan from January.",
    tip: "Timely repayment of KCC loans makes you eligible for interest subvention (subsidy).",
    choices: [
      { text: "Repay in full", effect: { money: -5000, debt: -5000, score: 20 }, consequence: "Excellent! You maintain a good credit score and get an interest subsidy.", isWise: true, isUPI: true },
      { text: "Delay payment", effect: { debt: 1000, score: -10 }, consequence: "Your debt increased due to penalties and your credit score dropped.", isWise: false },
      { text: "Take another loan to pay", effect: { debt: 2000 }, consequence: "You are falling into a debt trap.", isWise: false }
    ]
  },
  {
    name: "December",
    season: "Winter (Rabi)",
    description: "Year-end planning. How will you secure your family's future?",
    tip: "PMJJBY (Life Insurance) and PMSBY (Accident Insurance) offer high coverage for very low premiums.",
    choices: [
      { text: "Enroll in PMJJBY/PMSBY (₹436)", effect: { money: -436, score: 20 }, consequence: "Your family is now financially secure against unforeseen events.", isWise: true, isUPI: true },
      { text: "Keep cash under mattress", effect: {}, consequence: "Your family remains unprotected.", isWise: false },
      { text: "Buy gold jewelry", effect: { money: -5000 }, consequence: "Gold is an asset, but doesn't provide the same safety net as insurance.", isWise: false, isUPI: true }
    ]
  }
];

export const RANDOM_EVENTS = [
  {
    name: "Dust Storm",
    trigger: (state: GameState) => !state.insured,
    effect: { cropHealth: -40, money: -2000 },
    message: "A severe dust storm damaged your crops! Since you weren't insured, you suffered a loss."
  },
  {
    name: "Dust Storm (Insured)",
    trigger: (state: GameState) => state.insured,
    effect: { money: 1000, cropHealth: -20 },
    message: "A dust storm hit, but your PMFBY insurance covered the damages! You received a payout."
  },
  {
    name: "PM-KISAN Payout",
    trigger: () => true,
    effect: { money: 2000 },
    message: "You received your PM-KISAN installment of ₹2000 directly in your bank account."
  },
  {
    name: "Pest Attack",
    trigger: (state: GameState) => !state.insured,
    effect: { cropHealth: -30, money: -1000 },
    message: "Pests attacked your field. Without insurance, you bear the cost."
  },
  {
    name: "UPI Fraud Attempt",
    trigger: () => true,
    effect: { score: 5 },
    message: "Someone tried to trick you into sharing your UPI PIN, but you remembered the Bank Sakhi's advice and ignored it!"
  }
];
