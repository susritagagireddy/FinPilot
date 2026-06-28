import React from 'react';
import { 
  Wallet, 
  TrendingUp, 
  Target, 
  PieChart, 
  BrainCircuit, 
  AlertTriangle, 
  CheckCircle,
  Info,
  DollarSign
} from 'lucide-react';
import { formatCurrency } from '../utils/agentEngine';

export default function Dashboard({ state, setState, onSendMessage }) {

  // Calculate stats
  const salary = state.salary || 0;
  const rent = state.rent || 0;
  const totalExpenses = state.expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = salary > 0 ? (salary - rent - totalExpenses) : 0;
  
  // Savings Goal calculations
  const goalProgress = state.savingsGoal > 0 
    ? Math.min((state.currentSavings / state.savingsGoal) * 100, 100) 
    : 0;

  // Quick logger logic removed as logger resides fully in Spending Timeline tab

  // SVG parameters for circular progress
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (goalProgress / 100) * circumference;

  return (
    <div className="dashboard-grid">
      {/* Left Column: Metrics and Logging */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
        
        {/* KPI Cards Row */}
        <div className="stats-row">
          <div className="glass-card stat-card">
            <div className="stat-header">
              <span>Salary / Income</span>
              <TrendingUp className="stat-icon" size={16} color="var(--accent-primary)" />
            </div>
            <div className="stat-value">{formatCurrency(salary)}</div>
            <div className="stat-desc">Monthly base inflow</div>
          </div>

          <div className="glass-card stat-card">
            <div className="stat-header">
              <span>Fixed Rent</span>
              <Wallet className="stat-icon" size={16} color="var(--accent-danger)" />
            </div>
            <div className="stat-value">{formatCurrency(rent)}</div>
            <div className="stat-desc">Rent is {salary > 0 ? Math.round((rent / salary) * 100) : 0}% of salary</div>
          </div>

          <div className="glass-card stat-card">
            <div className="stat-header">
              <span>Other Spending</span>
              <PieChart className="stat-icon" size={16} color="var(--accent-warning)" />
            </div>
            <div className="stat-value">{formatCurrency(totalExpenses)}</div>
            <div className="stat-desc">{state.expenses.length} transaction(s) logged</div>
          </div>

          <div className="glass-card stat-card">
            <div className="stat-header">
              <span>Remaining Balance</span>
              <DollarSign className="stat-icon" size={16} color="var(--accent-secondary)" />
            </div>
            <div className="stat-value" style={{ color: remaining < 0 ? 'var(--accent-danger)' : 'var(--text-primary)' }}>
              {formatCurrency(remaining)}
            </div>
            <div className="stat-desc">Available for savings/fun</div>
          </div>
        </div>

        {/* Goal Tracker Panel */}
        <div className="glass-card">
          <div className="memory-header">
            <Target size={20} color="var(--accent-primary)" />
            <h2 className="memory-title" style={{ color: 'var(--accent-primary)' }}>Financial Savings Tracker</h2>
          </div>
          
          {state.savingsGoal > 0 ? (
            <div className="goal-progress-container">
              <div className="circular-progress">
                <svg>
                  <circle className="bg-circle" cx="35" cy="35" r={radius} />
                  <circle 
                    className="progress-circle" 
                    cx="35" 
                    cy="35" 
                    r={radius} 
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                  />
                </svg>
                <div className="progress-text">{goalProgress.toFixed(1)}%</div>
              </div>
              
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Goal: {formatCurrency(state.savingsGoal)}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Targeted over <strong>{state.savingsGoalTimeline} years</strong>. Current emergency fund & savings: <strong>{formatCurrency(state.currentSavings)}</strong>.
                </p>
                <div style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--accent-secondary)' }}>
                  Need to save {formatCurrency((state.savingsGoal - state.currentSavings) / (state.savingsGoalTimeline * 12))}/month to stay on target.
                </div>
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 'var(--space-md)' }}>
              No active goal defined. Tell FinPilot AI in Chat: <em>"I want to save ₹10 lakh in 5 years"</em>.
            </p>
          )}
        </div>
      </div>

      {/* Right Column: AI Memory & Insights */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
        
        {/* Memory Shield */}
        <div className="glass-card memory-shield">
          <div className="memory-header">
            <BrainCircuit size={20} color="var(--accent-secondary)" />
            <h2 className="memory-title">Cognitive Memory Shield</h2>
          </div>
          
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
            This is what FinPilot has learned about you through persistent memory tracking:
          </p>

          <div className="memory-fact-grid">
            {state.memoryFacts.length > 0 ? (
              state.memoryFacts.map((fact, index) => (
                <div className="memory-fact-card" key={index}>
                  <span className="fact-label">{fact.label}</span>
                  <span className="fact-value">{fact.value}</span>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '10px 0' }}>
                Memory is currently empty. Start chatting to seed financial parameters!
              </p>
            )}
          </div>

          <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginTop: '8px', color: 'var(--text-primary)' }}>
            Behavioral Profile Insights
          </h3>
          <div className="behavior-tags">
            {state.behavioralInsights.length > 0 ? (
              state.behavioralInsights.map((insight, idx) => (
                <div 
                  className={`behavior-tag ${
                    insight.type === 'warning' ? 'tag-warning' : 
                    insight.type === 'success' ? 'tag-success' : 'tag-info'
                  }`} 
                  key={idx}
                >
                  {insight.type === 'warning' && <AlertTriangle size={12} />}
                  {insight.type === 'success' && <CheckCircle size={12} />}
                  {insight.type === 'info' && <Info size={12} />}
                  <span>{insight.text}</span>
                </div>
              ))
            ) : (
              <div className="behavior-tag tag-info">
                <Info size={12} />
                <span>Collecting spending behavioral patterns...</span>
              </div>
            )}
          </div>
        </div>

        {/* Proactive Advisor Banner */}
        <div className="glass-card" style={{ borderLeft: '3px solid var(--accent-secondary)' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <BrainCircuit size={28} color="var(--accent-secondary)" style={{ flexShrink: 0 }} />
            <div>
              <h4 style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--accent-secondary)' }}>
                Persistent Memory Digest
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                {state.salary > 0 
                  ? `FinPilot observes that you spend ${formatCurrency(rent)} on rent. With your goal target, you should aim to deposit at least ${formatCurrency((state.savingsGoal - state.currentSavings) / (state.savingsGoalTimeline * 12))} into high-yield accounts monthly.`
                  : "Welcome! Seed your financial facts (salary, goals, rent) so I can build your custom behavioral savings track."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
