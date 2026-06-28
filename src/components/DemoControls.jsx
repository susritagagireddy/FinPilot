import React from 'react';
import { Play, Calendar, Zap, RefreshCw, BarChart2 } from 'lucide-react';
import { getDemoStepState } from '../utils/agentEngine';

export default function DemoControls({ currentStep, setStep, setState, setChatHistory, setView }) {
  
  const handleStepClick = (step) => {
    setStep(step);
    
    // Get seeded state for this step
    const seededState = getDemoStepState(step);
    
    // Seed chat history to match the Day 1, 7, 20 story
    let seededChat = [];
    
    if (step >= 1) {
      seededChat.push(
        {
          id: 'u1',
          sender: 'user',
          text: 'My monthly salary is ₹40,000.',
          timestamp: '10:00 AM'
        },
        {
          id: 'ai1',
          sender: 'ai',
          text: 'I have updated your profile with a monthly salary of ₹40,000. I\'ll remember this for your budget limits. What are your rent expenses and savings goals?',
          timestamp: '10:00 AM',
          modelInfo: { model: 'Llama 3 (8B)', latency: '0.2s', reason: 'Simple arithmetic calculation & database logging' }
        },
        {
          id: 'u2',
          sender: 'user',
          text: 'My rent is ₹8,000. I want to save ₹10 lakh in 5 years.',
          timestamp: '10:02 AM'
        },
        {
          id: 'ai2',
          sender: 'ai',
          text: 'Understood. Your rent is set to ₹8,000. Your primary goal is to save ₹10,00,000 in 5 years (₹16,667/month). I will hold you accountable to this target!',
          timestamp: '10:02 AM',
          modelInfo: { model: 'Llama 3 (8B)', latency: '0.2s', reason: 'Simple arithmetic calculation & database logging' }
        }
      );
    }
    
    if (step >= 2) {
      seededChat.push(
        {
          id: 'u3',
          sender: 'user',
          text: 'I spent ₹2,500 on Swiggy.',
          timestamp: 'Day 7, 1:15 PM'
        },
        {
          id: 'ai3',
          sender: 'ai',
          text: 'I remember your monthly food budget is ₹5,000. \n\nYou\'ve already spent ₹2,680 (53% of budget) in just 7 days. \n\nTry cooking this weekend if you want to stay on track.',
          timestamp: 'Day 7, 1:15 PM',
          modelInfo: { model: 'Llama 3 (8B)', latency: '0.2s', reason: 'Simple arithmetic calculation & database logging' }
        }
      );
    }
    
    if (step >= 3) {
      seededChat.push(
        {
          id: 'u4',
          sender: 'user',
          text: 'Should I buy an iPhone?',
          timestamp: 'Day 20, 4:30 PM'
        },
        {
          id: 'ai4',
          sender: 'ai',
          text: 'Last month you said your priority was building an emergency fund. \n\nBuying this phone (approx. ₹80,000) will delay that emergency fund target by about 4 months.\n\nConsider waiting or saving up a dedicated gadget fund first.',
          timestamp: 'Day 20, 4:30 PM',
          modelInfo: { model: 'Gemini 1.5 Pro', latency: '1.2s', reason: 'Deep cognitive reasoning & behavior synthesis' }
        }
      );
    }

    if (step === 4) {
      seededChat.push(
        {
          id: 'u5',
          sender: 'user',
          text: 'If I keep spending like this, where will I be in 1 year?',
          timestamp: 'Day 20, 4:32 PM'
        },
        {
          id: 'ai5',
          sender: 'ai',
          text: 'If you keep spending like this, here is where you will be in 1 year:\n\n- Projected Net Worth: ₹2,04,000\n- Goal Progress: You will reach your target of ₹10 Lakh in 5.8 years (instead of 5 years).\n- Pro Tip: Cutting food deliveries by 50% will accelerate your goal timeline by 4 months! Let\'s check out the Future Self tab for an interactive projection chart.',
          timestamp: 'Day 20, 4:32 PM',
          modelInfo: { model: 'Gemini 1.5 Pro', latency: '1.2s', reason: 'Deep cognitive reasoning & behavior synthesis' }
        }
      );
    }
    
    // Set appropriate view based on the demo step
    if (step === 1 || step === 2) {
      setView('dashboard');
    } else if (step === 3) {
      setView('chat');
    } else if (step === 4) {
      setView('futureself');
    }
    
    // Seed model histories into state
    const history = [];
    if (step >= 1) {
      history.push(
        { query: 'My monthly salary is ₹40,000.', model: 'Llama 3 (8B)', reason: 'Simple arithmetic calculation & database logging', latency: '0.2s', tokens: '64 input / 32 output' },
        { query: 'My rent is ₹8,000. Save ₹10 lakh in 5 years.', model: 'Llama 3 (8B)', reason: 'Simple arithmetic calculation & database logging', latency: '0.2s', tokens: '64 input / 32 output' }
      );
    }
    if (step >= 2) {
      history.push(
        { query: 'I spent ₹2,500 on Swiggy.', model: 'Llama 3 (8B)', reason: 'Simple arithmetic calculation & database logging', latency: '0.2s', tokens: '64 input / 32 output' }
      );
    }
    if (step >= 3) {
      history.push(
        { query: 'Should I buy an iPhone?', model: 'Gemini 1.5 Pro', reason: 'Deep cognitive reasoning & behavior synthesis', latency: '1.2s', tokens: '420 input / 310 output' }
      );
    }
    if (step === 4) {
      history.push(
        { query: 'If I keep spending like this, where will I be in 1 year?', model: 'Gemini 1.5 Pro', reason: 'Deep cognitive reasoning & behavior synthesis', latency: '1.2s', tokens: '420 input / 310 output' }
      );
    }
    
    setState({
      ...seededState,
      modelHistory: history
    });
  };

  const handleReset = () => {
    setStep(0);
    setState(getDemoStepState(0));
    setChatHistory([]);
    setView('dashboard');
  };

  return (
    <div className="demo-bar">
      <div className="demo-title-row">
        <div className="demo-title-text">
          <Zap size={14} color="var(--accent-primary)" />
          <span>Hackathon Demo controller</span>
        </div>
        <div className="demo-status">
          Active Scenario: {currentStep === 0 ? 'Fresh Slate' : `Step ${currentStep} of 4`}
        </div>
      </div>
      
      <div className="demo-steps">
        <button 
          className={`demo-btn ${currentStep === 1 ? 'active' : ''}`}
          onClick={() => handleStepClick(1)}
        >
          <span className="demo-btn-label">Day 1</span>
          <span style={{ fontSize: '0.75rem' }}>Profile Register</span>
        </button>

        <button 
          className={`demo-btn ${currentStep === 2 ? 'active' : ''}`}
          onClick={() => handleStepClick(2)}
        >
          <span className="demo-btn-label">Day 7</span>
          <span style={{ fontSize: '0.75rem' }}>Swiggy Alert</span>
        </button>

        <button 
          className={`demo-btn ${currentStep === 3 ? 'active' : ''}`}
          onClick={() => handleStepClick(3)}
        >
          <span className="demo-btn-label">Day 20</span>
          <span style={{ fontSize: '0.75rem' }}>Should I buy?</span>
        </button>

        <button 
          className={`demo-btn ${currentStep === 4 ? 'active' : ''}`}
          onClick={() => handleStepClick(4)}
        >
          <span className="demo-btn-label">Compounded</span>
          <span style={{ fontSize: '0.75rem' }}>Future Self</span>
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          Click steps to run the 3-minute story sequence. Memory and timeline seed dynamically!
        </span>
        <button 
          type="button" 
          onClick={handleReset} 
          style={{ 
            background: 'transparent', 
            border: 'none', 
            color: 'var(--accent-danger)', 
            cursor: 'pointer',
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <RefreshCw size={10} />
          <span>Reset Demo</span>
        </button>
      </div>
    </div>
  );
}
