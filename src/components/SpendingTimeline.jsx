import React, { useState } from 'react';
import { Trash2, DollarSign, Calendar, Plus, ShoppingBag, Truck, Utensils, Film, Sparkles } from 'lucide-react';
import { formatCurrency, processAgentInput } from '../utils/agentEngine';

export default function SpendingTimeline({ state, setState, onSendMessage }) {
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('Food');

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'food':
        return <Utensils size={14} color="var(--accent-primary)" />;
      case 'travel':
        return <Truck size={14} color="var(--accent-secondary)" />;
      case 'rent':
        return <DollarSign size={14} color="var(--accent-danger)" />;
      case 'shopping':
        return <ShoppingBag size={14} color="var(--accent-warning)" />;
      case 'leisure':
        return <Film size={14} color="var(--accent-warning)" />;
      default:
        return <DollarSign size={14} color="var(--text-muted)" />;
    }
  };

  const handleManualAdd = (e) => {
    e.preventDefault();
    if (!expenseTitle.trim() || !expenseAmount.trim()) return;

    const amountNum = parseFloat(expenseAmount.replace(/,/g, ''));
    if (isNaN(amountNum) || amountNum <= 0) return;

    const newExpense = {
      title: expenseTitle,
      amount: amountNum,
      category: expenseCategory,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    };

    const updatedExpenses = [...state.expenses, newExpense];
    
    // Update state
    setState(prev => {
      const nextState = {
        ...prev,
        expenses: updatedExpenses
      };
      
      // Trigger AI behavior evaluation automatically
      const mockQuery = `I spent ${amountNum} on ${expenseTitle}`;
      const { state: finalState, response } = processAgentInput(mockQuery, nextState, true);
      
      // Propagate AI response to chat
      onSendMessage(mockQuery, response);
      
      return finalState;
    });

    setExpenseTitle('');
    setExpenseAmount('');
  };

  const handleDeleteExpense = (indexToDelete) => {
    const updatedExpenses = state.expenses.filter((_, idx) => idx !== indexToDelete);
    setState(prev => ({
      ...prev,
      expenses: updatedExpenses
    }));
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-lg)' }}>
      {/* List of expenses */}
      <div className="glass-card">
        <div className="memory-header">
          <Calendar size={20} color="var(--accent-primary)" />
          <h2 className="memory-title" style={{ color: 'var(--accent-primary)' }}>Spending Timeline</h2>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>
          Detailed ledger of your transactions. Add expenses using the form on the right or talk to the AI in the Chat tab.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'var(--space-md)' }}>
          {state.expenses.length > 0 ? (
            state.expenses.map((exp, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 16px',
                animation: 'fade-in 0.3s ease-out'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--border-color)'
                  }}>
                    {getCategoryIcon(exp.category)}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)' }}>{exp.title}</h4>
                    <div style={{ display: 'flex', gap: '8px', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      <span>{exp.date || 'Today'}</span>
                      <span>•</span>
                      <span style={{ color: 'var(--accent-secondary)' }}>{exp.category}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                    {formatCurrency(exp.amount)}
                  </span>
                  <button 
                    onClick={() => handleDeleteExpense(index)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      transition: 'color var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-danger)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              <DollarSign size={40} style={{ opacity: 0.2, marginBottom: '10px' }} />
              <p style={{ fontSize: '0.85rem' }}>No expenses logged yet. Log your first expense to begin tracking!</p>
            </div>
          )}
        </div>
      </div>

      {/* Manual Entry Sidebar Form */}
      <div className="glass-card" style={{ height: 'fit-content' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 600, marginBottom: '12px' }}>
          ➕ Log Transaction
        </h3>
        
        <form onSubmit={handleManualAdd} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Description</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g. Swiggy food order"
              value={expenseTitle}
              onChange={(e) => setExpenseTitle(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Amount (₹)</label>
            <input 
              type="number" 
              className="input-field" 
              placeholder="e.g. 2500"
              value={expenseAmount}
              onChange={(e) => setExpenseAmount(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Category</label>
            <select 
              className="input-field" 
              value={expenseCategory}
              onChange={(e) => setExpenseCategory(e.target.value)}
              style={{ background: '#0a0d14' }}
            >
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Rent">Rent</option>
              <option value="Shopping">Shopping</option>
              <option value="Leisure">Leisure</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <button type="submit" className="btn-primary" style={{ justifyContent: 'center', marginTop: '6px' }}>
            <Plus size={16} />
            <span>Add Expense</span>
          </button>
        </form>

        <div style={{ 
          marginTop: '16px', 
          background: 'rgba(6, 182, 212, 0.03)', 
          border: '1px solid rgba(6, 182, 212, 0.1)', 
          borderRadius: 'var(--radius-md)', 
          padding: '10px',
          display: 'flex',
          gap: '8px'
        }}>
          <Sparkles size={14} color="var(--accent-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            Adding expenses updates the **Cognitive Memory Shield** and triggers real-time behavior tracking warnings!
          </p>
        </div>
      </div>
    </div>
  );
}
