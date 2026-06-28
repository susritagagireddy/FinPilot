import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Home, 
  MessageSquareCode, 
  CalendarClock, 
  LineChart,
  TrendingUp
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import AIChat from './components/AIChat';
import MemoryTimeline from './components/MemoryTimeline';
import SpendingTimeline from './components/SpendingTimeline';
import FutureSelf from './components/FutureSelf';
import Onboarding from './components/Onboarding';
import { createInitialState } from './utils/agentEngine';

export default function App() {
  // Load initial states from LocalStorage or fallback to seed defaults
  const [state, setState] = useState(() => {
    const local = localStorage.getItem('finpilot_state');
    return local ? JSON.parse(local) : createInitialState();
  });

  const [chatHistory, setChatHistory] = useState(() => {
    const local = localStorage.getItem('finpilot_chat');
    return local ? JSON.parse(local) : [];
  });

  const [view, setView] = useState(() => {
    const local = localStorage.getItem('finpilot_view');
    return local || 'dashboard';
  });

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('finpilot_state', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    localStorage.setItem('finpilot_chat', JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    localStorage.setItem('finpilot_view', view);
  }, [view]);

  // Handle onboarding submission
  const handleOnboardingComplete = (data) => {
    const formatCurr = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
    
    setState(prev => {
      const nextState = {
        ...prev,
        salary: data.salary,
        rent: data.rent,
        savingsGoal: data.savingsGoal,
        savingsGoalTimeline: data.savingsGoalTimeline,
        currentSavings: 15000, // Seed starting savings
        memoryFacts: [
          { label: 'Monthly Salary', value: formatCurr(data.salary) },
          { label: 'Rent Expense', value: formatCurr(data.rent) },
          { label: 'Savings Target', value: `${formatCurr(data.savingsGoal)} (${data.savingsGoalTimeline} yrs)` },
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
            id: 'onboard-registered',
            date: 'Day 1',
            type: 'salary',
            title: 'Financial Profile Registered',
            desc: `Salary set to ${formatCurr(data.salary)}, Rent to ${formatCurr(data.rent)}. Priority target defined: Save ${formatCurr(data.savingsGoal)} in ${data.savingsGoalTimeline} years.`
          }
        ]
      };

      // Seed chat history with welcome message
      const welcomeMsg = {
        id: 'ai-welcome',
        sender: 'ai',
        text: `Hello! I am your FinPilot AI coach. I've recorded your monthly income as **${formatCurr(data.salary)}**, rent as **${formatCurr(data.rent)}**, and savings goal as **${formatCurr(data.savingsGoal)}**.\n\nI will remember your financial behavior over time to keep you on track.\n\nTry logging an expense in the **Spending Timeline** tab or ask me a question here!`,
        timestamp: new Date().toLocaleTimeString(),
        modelInfo: {
          model: 'Gemini 1.5 Pro',
          latency: '0.8s',
          reason: 'Deep cognitive reasoning & behavior synthesis'
        }
      };

      setChatHistory([welcomeMsg]);
      return nextState;
    });
  };

  // Handle updates coming from logging or chat submissions
  const handleSendMessage = (userText, aiResponse) => {
    // Add user message
    const userMsg = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setChatHistory(prev => [...prev, userMsg, aiResponse]);
  };

  // Render Onboarding Screen if salary is zero
  if (state.salary === 0) {
    return (
      <div className="app-container">
        <Onboarding onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Header Bar */}
      <header className="app-header">
        <div className="logo-container">
          <Compass className="logo-icon" size={32} />
          <div>
            <h1 className="logo-text">FinPilot AI</h1>
            <p className="logo-tagline">Persistent AI Financial Coach</p>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="nav-tabs">
          <button 
            type="button" 
            className={`nav-button ${view === 'dashboard' ? 'active' : ''}`}
            onClick={() => setView('dashboard')}
          >
            <Home size={16} />
            <span>Dashboard</span>
          </button>
          
          <button 
            type="button" 
            className={`nav-button ${view === 'chat' ? 'active' : ''}`}
            onClick={() => setView('chat')}
          >
            <MessageSquareCode size={16} />
            <span>AI Chat</span>
          </button>

          <button 
            type="button" 
            className={`nav-button ${view === 'spending' ? 'active' : ''}`}
            onClick={() => setView('spending')}
          >
            <TrendingUp size={16} />
            <span>Spending Timeline</span>
          </button>
          
          <button 
            type="button" 
            className={`nav-button ${view === 'timeline' ? 'active' : ''}`}
            onClick={() => setView('timeline')}
          >
            <CalendarClock size={16} />
            <span>Memory Timeline</span>
          </button>
          
          <button 
            type="button" 
            className={`nav-button ${view === 'futureself' ? 'active' : ''}`}
            onClick={() => setView('futureself')}
          >
            <LineChart size={16} />
            <span>Future Self</span>
          </button>
        </nav>
      </header>

      {/* Main View Area */}
      <main style={{ minHeight: '400px' }}>
        {view === 'dashboard' && (
          <Dashboard 
            state={state} 
            setState={setState} 
            onSendMessage={handleSendMessage} 
          />
        )}
        
        {view === 'chat' && (
          <AIChat 
            state={state} 
            setState={setState} 
            chatHistory={chatHistory} 
            setChatHistory={setChatHistory} 
          />
        )}

        {view === 'spending' && (
          <SpendingTimeline 
            state={state} 
            setState={setState} 
            onSendMessage={handleSendMessage} 
          />
        )}
        
        {view === 'timeline' && (
          <MemoryTimeline state={state} />
        )}
        
        {view === 'futureself' && (
          <FutureSelf state={state} />
        )}
      </main>
    </div>
  );
}
