import React, { useState } from 'react';
import { Compass, DollarSign, Target, Home, Sparkles, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../utils/agentEngine';

export default function Onboarding({ onComplete }) {
  const [salary, setSalary] = useState('');
  const [rent, setRent] = useState('');
  const [goal, setGoal] = useState('');
  const [timeline, setTimeline] = useState('5');

  const handleSubmit = (e) => {
    e.preventDefault();

    const salaryNum = parseFloat(salary.replace(/,/g, ''));
    const rentNum = parseFloat(rent.replace(/,/g, ''));
    const goalNum = parseFloat(goal.replace(/,/g, ''));
    const timelineNum = parseInt(timeline);

    if (isNaN(salaryNum) || salaryNum <= 0) return;
    if (isNaN(rentNum) || rentNum < 0) return;
    if (isNaN(goalNum) || goalNum <= 0) return;

    onComplete({
      salary: salaryNum,
      rent: rentNum,
      savingsGoal: goalNum,
      savingsGoalTimeline: timelineNum
    });
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      padding: 'var(--space-md)'
    }}>
      <div className="glass-card" style={{
        maxWidth: '500px',
        width: '100%',
        padding: 'var(--space-xl)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-lg)',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        boxShadow: '0 8px 32px rgba(16, 185, 129, 0.1)'
      }}>
        {/* Title */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            width: '56px',
            height: '56px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--accent-primary-glow)',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 'var(--space-md)',
            border: '1px solid var(--accent-primary)'
          }}>
            <Compass size={28} color="var(--accent-primary)" style={{ animation: 'pulse-glow 3s infinite ease-in-out' }} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800 }}>Welcome to FinPilot AI</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Set up your persistent financial coach parameters to get started.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <DollarSign size={12} color="var(--accent-primary)" />
              <span>What is your monthly salary? (₹)</span>
            </label>
            <input 
              type="number" 
              className="input-field" 
              placeholder="e.g. 40000"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Home size={12} color="var(--accent-danger)" />
              <span>What is your monthly rent? (₹)</span>
            </label>
            <input 
              type="number" 
              className="input-field" 
              placeholder="e.g. 8000"
              value={rent}
              onChange={(e) => setRent(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Target size={12} color="var(--accent-secondary)" />
              <span>How much do you want to save? (₹)</span>
            </label>
            <input 
              type="number" 
              className="input-field" 
              placeholder="e.g. 1000000"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Goal Target Timeline (Years)</label>
            <select 
              className="input-field" 
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              style={{ background: '#0a0d14' }}
            >
              <option value="1">1 Year</option>
              <option value="2">2 Years</option>
              <option value="3">3 Years</option>
              <option value="5">5 Years</option>
              <option value="10">10 Years</option>
            </select>
          </div>

          <button type="submit" className="btn-primary" style={{ justifyContent: 'center', marginTop: '10px', padding: '14px' }}>
            <span>Initialize FinPilot Coach</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ 
          background: 'rgba(245, 158, 11, 0.03)', 
          border: '1px solid rgba(245, 158, 11, 0.15)', 
          borderRadius: 'var(--radius-md)', 
          padding: '12px',
          display: 'flex',
          gap: '10px'
        }}>
          <Sparkles size={16} color="var(--accent-warning)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            FinPilot remembers everything you specify. We will calculate your daily runway and flag warning behavior when your transactions stray from these bounds.
          </p>
        </div>
      </div>
    </div>
  );
}
