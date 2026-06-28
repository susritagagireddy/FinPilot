/**
 * FinPilot AI - Agent Engine & Behavior Simulator
 * Manages financial logic, persistent memory tracking, model routing, and projection models.
 */

// Helper to format currency
export const formatCurrency = (val) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val);
};

// Default seed structures
export const createInitialState = () => ({
  salary: 0,
  rent: 0,
  savingsGoal: 0,
  savingsGoalTimeline: 5, // in years
  currentSavings: 0,
  foodBudget: 5000,
  expenses: [],
  memoryFacts: [],
  behavioralInsights: [],
  timeline: [
    {
      id: 'init',
      date: 'Day 1',
      type: 'info',
      title: 'FinPilot AI Activated',
      desc: 'Coach successfully initialized. Waiting for income and savings goal declarations.'
    }
  ],
  modelHistory: []
});

/**
 * Simulates cascadeflow routing logic.
 * Simple math/logging => Llama 3 (Fast, Cheap)
 * Financial planning/Cognitive reasoning => Gemini 1.5 Pro (Powerful, Deep)
 */
export const routeModel = (userInput) => {
  const query = userInput.toLowerCase();
  
  // Rules for routing
  if (
    query.includes('should') ||
    query.includes('iphone') ||
    query.includes('plan') ||
    query.includes('priority') ||
    query.includes('hindsight') ||
    query.includes('behavior') ||
    query.includes('analyze') ||
    query.includes('future') ||
    query.includes('how am i doing') ||
    query.includes('predict')
  ) {
    return {
      model: 'Gemini 1.5 Pro',
      reason: 'Deep cognitive reasoning & behavior synthesis',
      latency: '1.2s',
      tokens: '420 input / 310 output'
    };
  }
  
  return {
    model: 'Llama 3 (8B)',
    reason: 'Simple arithmetic calculation & database logging',
    latency: '0.2s',
    tokens: '64 input / 32 output'
  };
};

/**
 * Analyzes expenses list to generate behavior insights
 */
export const extractBehavioralInsights = (expenses, salary, savingsGoal) => {
  const insights = [];
  
  // Insight 1: Food spending check
  const foodExpenses = expenses
    .filter(e => e.category.toLowerCase() === 'food' || e.title.toLowerCase().includes('swiggy') || e.title.toLowerCase().includes('zomato'))
    .reduce((sum, e) => sum + e.amount, 0);
  
  if (foodExpenses > 3000) {
    insights.push({
      type: 'warning',
      text: 'Weekend Food Splurges: High dining frequency detected (Swiggy/Zomato).'
    });
  }

  // Insight 2: Total expense ratio
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  if (salary > 0) {
    const ratio = totalSpent / salary;
    if (ratio > 0.6) {
      insights.push({
        type: 'warning',
        text: 'High Cash Burn Rate: Spending exceeds 60% of monthly salary.'
      });
    } else if (ratio < 0.3 && expenses.length > 3) {
      insights.push({
        type: 'success',
        text: 'Excellent Savings Rate: Keeping spending below 30% of income.'
      });
    }
  }

  // Insight 3: Payday behavior
  if (expenses.some(e => e.amount > 1000 && e.title.toLowerCase().includes('shopping'))) {
    insights.push({
      type: 'info',
      text: 'Retail Therapy Spike: Shopping surges immediately after income cycles.'
    });
  }

  return insights;
};

/**
 * Seeds states representing the 3-minute hackathon story.
 */
export const getDemoStepState = (step) => {
  const base = createInitialState();
  
  switch(step) {
    case 1: // Day 1: Salary, Rent, Goal
      return {
        ...base,
        salary: 40000,
        rent: 8000,
        savingsGoal: 1000000,
        savingsGoalTimeline: 5,
        currentSavings: 15000,
        memoryFacts: [
          { label: 'Monthly Salary', value: '₹40,000' },
          { label: 'Rent Expense', value: '₹8,000' },
          { label: 'Savings Target', value: '₹10,00,000 (5 yrs)' },
          { label: 'Risk Preference', value: 'Conservative (First Goal)' }
        ],
        timeline: [
          {
            id: 'init',
            date: 'Day 1',
            type: 'info',
            title: 'FinPilot AI Activated',
            desc: 'Coach successfully initialized.'
          },
          {
            id: 'day1-profile',
            date: 'Day 1',
            type: 'salary',
            title: 'Financial Profile Registered',
            desc: 'Salary set to ₹40,000, Rent to ₹8,000. Priority target defined: Save ₹10 Lakh in 5 years.'
          }
        ]
      };
      
    case 2: // Day 7: Logged food expenses & warning trigger
      const day7Expenses = [
        { title: 'Rent payment', amount: 8000, category: 'Rent', date: 'Day 1' },
        { title: 'Uber ride', amount: 350, category: 'Travel', date: 'Day 3' },
        { title: 'Coffee meeting', amount: 180, category: 'Food', date: 'Day 4' },
        { title: 'Swiggy order', amount: 2500, category: 'Food', date: 'Day 7' }
      ];
      return {
        ...base,
        salary: 40000,
        rent: 8000,
        savingsGoal: 1000000,
        savingsGoalTimeline: 5,
        currentSavings: 15000,
        expenses: day7Expenses,
        memoryFacts: [
          { label: 'Monthly Salary', value: '₹40,000' },
          { label: 'Rent Expense', value: '₹8,000' },
          { label: 'Savings Target', value: '₹10,00,000 (5 yrs)' },
          { label: 'Monthly Food Budget', value: '₹5,000' }
        ],
        behavioralInsights: [
          { type: 'warning', text: 'Dining budget used: Spent ₹2,680 (53% of ₹5,000 limit) in just 7 days.' }
        ],
        timeline: [
          {
            id: 'init',
            date: 'Day 1',
            type: 'info',
            title: 'FinPilot AI Activated',
            desc: 'Coach successfully initialized.'
          },
          {
            id: 'day1-profile',
            date: 'Day 1',
            type: 'salary',
            title: 'Financial Profile Registered',
            desc: 'Salary set to ₹40,000, Rent to ₹8,000. Goal: ₹10 Lakh in 5 years.'
          },
          {
            id: 'day7-swiggy',
            date: 'Day 7',
            type: 'warning',
            title: 'Dining Alert Triggered',
            desc: 'Swiggy order of ₹2,500 logged. Food spending reached 53% of monthly budget.'
          }
        ]
      };
      
    case 3: // Day 20: Ask buy iPhone (Goal impact analysis)
      const day20Expenses = [
        { title: 'Rent payment', amount: 8000, category: 'Rent', date: 'Day 1' },
        { title: 'Uber ride', amount: 350, category: 'Travel', date: 'Day 3' },
        { title: 'Coffee meeting', amount: 180, category: 'Food', date: 'Day 4' },
        { title: 'Swiggy order', amount: 2500, category: 'Food', date: 'Day 7' },
        { title: 'Movie ticket', amount: 450, category: 'Leisure', date: 'Day 12' },
        { title: 'Shopping', amount: 3200, category: 'Shopping', date: 'Day 15' }
      ];
      return {
        ...base,
        salary: 40000,
        rent: 8000,
        savingsGoal: 1000000,
        savingsGoalTimeline: 5,
        currentSavings: 20000, // emergency fund building
        expenses: day20Expenses,
        memoryFacts: [
          { label: 'Monthly Salary', value: '₹40,000' },
          { label: 'Rent Expense', value: '₹8,000' },
          { label: 'Savings Target', value: '₹10,00,000 (5 yrs)' },
          { label: 'Priority Goal', value: 'Build Emergency Fund (₹50,000)' },
          { label: 'Weekend Spender', value: 'High food/shopping spikes' }
        ],
        behavioralInsights: [
          { type: 'info', text: 'Emergency fund focus: Target is ₹50,000 (Currently ₹20,000).' },
          { type: 'warning', text: 'Retail therapy spike: Shopping spike logged on Day 15.' }
        ],
        timeline: [
          {
            id: 'init',
            date: 'Day 1',
            type: 'info',
            title: 'FinPilot AI Activated',
            desc: 'Coach successfully initialized.'
          },
          {
            id: 'day1-profile',
            date: 'Day 1',
            type: 'salary',
            title: 'Financial Profile Registered',
            desc: 'Salary set to ₹40,000, Rent to ₹8,000.'
          },
          {
            id: 'day7-swiggy',
            date: 'Day 7',
            type: 'warning',
            title: 'Dining Alert Triggered',
            desc: 'Swiggy order of ₹2,500. Dining budget overdrawn.'
          },
          {
            id: 'day15-insight',
            date: 'Day 15',
            type: 'info',
            title: 'Behavioral Habit Logged',
            desc: 'Identified: Priorities shifted from emergency fund during shopping spikes.'
          }
        ]
      };
      
    default:
      return base;
  }
};

/**
 * Smart core processing engine:
 * Evaluates inputs and determines response and DB modifications.
 */
export const processAgentInput = (text, currentState, skipAddExpense = false) => {
  const query = text.trim();
  const lower = query.toLowerCase();
  
  // Model routing metadata
  const routing = routeModel(query);
  
  // Initial structures to mutate
  let updatedState = { ...currentState };
  let aiMessageText = '';
  
  // -- DAY 1 FLOW PARSING: Salary ₹40,000, Rent ₹8,000, Save ₹10 lakh in 5 years --
  if (lower.includes('salary') || lower.includes('salary is') || lower.includes('income is')) {
    const salaryMatch = query.replace(/,/g, '').match(/(?:₹|rs\.?\s*)?(\d+)/i);
    const salaryVal = salaryMatch ? parseInt(salaryMatch[1]) : 40000;
    
    updatedState.salary = salaryVal;
    
    // Add memory facts
    updatedState.memoryFacts = updatedState.memoryFacts.filter(f => f.label !== 'Monthly Salary');
    updatedState.memoryFacts.push({ label: 'Monthly Salary', value: formatCurrency(salaryVal) });
    
    // Add to timeline
    updatedState.timeline.push({
      id: 'salary-' + Date.now(),
      date: 'Today',
      type: 'salary',
      title: 'Salary Logged',
      desc: `Registered monthly income of ${formatCurrency(salaryVal)}.`
    });
    
    aiMessageText = `I have updated your profile with a monthly salary of **${formatCurrency(salaryVal)}**. I'll remember this for your budget limits. What are your rent expenses and savings goals?`;
  }
  else if (lower.includes('rent') || lower.includes('rent is')) {
    const rentMatch = query.replace(/,/g, '').match(/(?:₹|rs\.?\s*)?(\d+)/i);
    const rentVal = rentMatch ? parseInt(rentMatch[1]) : 8000;
    
    updatedState.rent = rentVal;
    updatedState.memoryFacts = updatedState.memoryFacts.filter(f => f.label !== 'Rent Expense');
    updatedState.memoryFacts.push({ label: 'Rent Expense', value: formatCurrency(rentVal) });
    
    updatedState.timeline.push({
      id: 'rent-' + Date.now(),
      date: 'Today',
      type: 'info',
      title: 'Rent Expense Saved',
      desc: `Monthly rent set to ${formatCurrency(rentVal)}.`
    });
    
    aiMessageText = `Got it! Your rent is **${formatCurrency(rentVal)}** per month. Combined with your salary, you have ${formatCurrency(updatedState.salary - rentVal)} remaining for other expenses and savings.`;
  }
  else if (lower.includes('save') && (lower.includes('lakh') || lower.includes('lacs') || lower.includes('10 lakh') || lower.includes('goal'))) {
    const targetVal = lower.includes('10') ? 1000000 : 200000;
    const years = lower.includes('5') ? 5 : 1;
    
    updatedState.savingsGoal = targetVal;
    updatedState.savingsGoalTimeline = years;
    
    updatedState.memoryFacts = updatedState.memoryFacts.filter(f => !f.label.includes('Target'));
    updatedState.memoryFacts.push({ label: 'Savings Target', value: `${formatCurrency(targetVal)} (${years} yrs)` });
    
    updatedState.timeline.push({
      id: 'goal-' + Date.now(),
      date: 'Today',
      type: 'info',
      title: 'Savings Goal Defined',
      desc: `Goal set to ${formatCurrency(targetVal)} in ${years} years.`
    });
    
    aiMessageText = `Understood. Your primary goal is to save **${formatCurrency(targetVal)} in ${years} years** (${formatCurrency(targetVal / (years * 12))}/month). I will hold you accountable to this target!`;
  }
  
  // -- DAY 7 FLOW PARSING: Spent ₹2,500 on Swiggy / Coffee / Uber --
  else if (lower.includes('spent') || (query.match(/(?:coffee|uber|swiggy|zomato|movie|food|shopping|grocery)\s*(?:₹|rs\.?\s*)?\d+/i))) {
    // Try to extract title, amount, and categorize
    let amount = 250;
    let title = 'Expense';
    let category = 'Leisure';
    
    const amountMatch = query.replace(/,/g, '').match(/(?:₹|rs\.?\s*)?(\d+)/i);
    if (amountMatch) amount = parseInt(amountMatch[1]);
    
    if (lower.includes('swiggy') || lower.includes('zomato') || lower.includes('food')) {
      title = lower.includes('swiggy') ? 'Swiggy order' : 'Food order';
      category = 'Food';
    } else if (lower.includes('uber') || lower.includes('taxi') || lower.includes('travel')) {
      title = 'Uber ride';
      category = 'Travel';
    } else if (lower.includes('coffee') || lower.includes('starbucks')) {
      title = 'Coffee';
      category = 'Food';
    } else if (lower.includes('movie') || lower.includes('netflix')) {
      title = 'Leisure';
      category = 'Leisure';
    } else if (lower.includes('shopping') || lower.includes('clothes')) {
      title = 'Shopping';
      category = 'Shopping';
    }
    
    if (!skipAddExpense) {
      const newExpense = { title, amount, category, date: 'Today' };
      updatedState.expenses = [...updatedState.expenses, newExpense];
    }
    
    // Check Food Budget Memory
    if (category === 'Food') {
      const foodSpent = updatedState.expenses
        .filter(e => e.category === 'Food')
        .reduce((sum, e) => sum + e.amount, 0);
        
      if (title.includes('Swiggy') && amount >= 2500) {
        // Day 7 exact response match
        updatedState.timeline.push({
          id: 'swiggy-' + Date.now(),
          date: 'Day 7',
          type: 'warning',
          title: 'Dining Alert Triggered',
          desc: `Swiggy order of ${formatCurrency(amount)} registered. Food spending spike detected.`
        });
        
        aiMessageText = `I remember your monthly food budget is **${formatCurrency(updatedState.foodBudget)}**. \n\nYou've already spent **${formatCurrency(foodSpent)}** (${Math.round((foodSpent / updatedState.foodBudget) * 100)}%). \n\n*Try cooking this weekend if you want to stay on track.*`;
      } else {
        aiMessageText = `Logged expense: **${title}** of **${formatCurrency(amount)}**. Total food expenses this month: ${formatCurrency(foodSpent)}. Keep it up!`;
      }
    } else {
      aiMessageText = `Logged expense: **${title}** of **${formatCurrency(amount)}**. I've subtracted this from your monthly net income.`;
    }
  }
  
  // -- DAY 20 FLOW PARSING: iPhone purchase analysis --
  else if (lower.includes('iphone') || lower.includes('buy a phone') || (lower.includes('should i buy') && lower.includes('phone'))) {
    // Day 20 emergency fund memory response
    const delayMonths = 4;
    
    // Add memory facts for future reference
    if (!updatedState.memoryFacts.some(f => f.label === 'Priority Goal')) {
      updatedState.memoryFacts.push({ label: 'Priority Goal', value: 'Build Emergency Fund (₹50,000)' });
    }
    
    updatedState.timeline.push({
      id: 'iphone-query-' + Date.now(),
      date: 'Day 20',
      type: 'danger',
      title: 'Major Purchase Evaluated',
      desc: 'Advised user against buying iPhone. Calculated 4-month delay in emergency fund goals.'
    });
    
    aiMessageText = `Last month you said your priority was **building an emergency fund**. \n\nBuying this phone (approx. ₹80,000) will delay that emergency fund target by about **${delayMonths} months**.\n\n*Consider waiting or saving up a dedicated gadget fund first.*`;
  }
  
  // -- FUTURE SELF FLOW PARSING --
  else if (lower.includes('future') || lower.includes('one year') || lower.includes('1 year') || lower.includes('where will i be')) {
    aiMessageText = `If you keep spending like this, here is where you will be in 1 year:
\n- **Projected Net Worth**: ${formatCurrency(updatedState.salary * 12 - (updatedState.rent * 12 + 180000))}
\n- **Goal Progress**: You will reach your target of ₹10 Lakh in **5.8 years** (instead of 5 years).
\n- **Pro Tip**: Cutting food deliveries by 50% will accelerate your goal timeline by **4 months**! Let's check out the **Future Self** tab for an interactive projection chart.`;
  }
  
  // -- DEFAULT / CONVERSATIONAL PARSING --
  else {
    aiMessageText = `I'm analyzing your request. I remember your monthly salary is **${formatCurrency(updatedState.salary || 40000)}** and your goal is to save **${formatCurrency(updatedState.savingsGoal || 1000000)}**.\n\nWhat other expenses would you like to log today?`;
  }
  
  // Update behavioral insights automatically
  updatedState.behavioralInsights = extractBehavioralInsights(updatedState.expenses, updatedState.salary, updatedState.savingsGoal);
  
  // Append model history for visual display
  updatedState.modelHistory = [
    {
      query: text,
      timestamp: new Date().toLocaleTimeString(),
      ...routing
    },
    ...updatedState.modelHistory
  ];
  
  return {
    state: updatedState,
    response: {
      id: 'ai-' + Date.now(),
      sender: 'ai',
      text: aiMessageText,
      timestamp: new Date().toLocaleTimeString(),
      modelInfo: routing
    }
  };
};
