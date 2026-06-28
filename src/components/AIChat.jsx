import React, { useState, useRef, useEffect } from 'react';
import { Send, Cpu, Layers, Activity, Zap } from 'lucide-react';
import { processAgentInput } from '../utils/agentEngine';

export default function AIChat({ state, setState, chatHistory, setChatHistory }) {
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sendMessage(inputText);
    setInputText('');
  };

  const sendMessage = (text) => {
    // Add user message
    const userMsg = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString()
    };
    
    const newHistory = [...chatHistory, userMsg];
    setChatHistory(newHistory);

    // Process through agent
    const { state: updatedState, response } = processAgentInput(text, state);
    setState(updatedState);

    // Add AI message
    setChatHistory(prev => [...prev, response]);
  };

  // Click handler for suggestion chips
  const handleChipClick = (chipText) => {
    sendMessage(chipText);
  };

  // Suggestion chips
  const suggestions = [
    "My monthly salary is ₹40,000.",
    "My rent is ₹8,000. Save ₹10 lakh in 5 years.",
    "I spent ₹2,500 on Swiggy.",
    "Should I buy an iPhone?",
    "If I keep spending like this, where will I be in 1 year?"
  ];

  // Routing stats calculations
  const totalQueries = state.modelHistory.length;
  const proCount = state.modelHistory.filter(h => h.model.includes('Pro')).length;
  const flashCount = state.modelHistory.filter(h => h.model.includes('Llama') || h.model.includes('Flash')).length;

  return (
    <div className="chat-container">
      {/* Main Chat Interface */}
      <div className="chat-main">
        {/* Messages list */}
        <div className="chat-history">
          {chatHistory.length === 0 ? (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '100%', 
              color: 'var(--text-muted)',
              textAlign: 'center',
              padding: '20px'
            }}>
              <Cpu size={48} color="var(--accent-secondary)" style={{ marginBottom: '12px', opacity: 0.6 }} />
              <h3 style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>
                FinPilot AI Agent Active
              </h3>
              <p style={{ fontSize: '0.85rem', maxWidth: '360px', marginTop: '6px' }}>
                Ask me to log expenses, set up savings goals, or evaluate purchases. I remember your behavior over time!
              </p>
            </div>
          ) : (
            chatHistory.map((msg) => (
              <div key={msg.id} className={`chat-bubble-container ${msg.sender}`}>
                <div className="chat-bubble">
                  {msg.text.split('\n').map((para, i) => (
                    <p key={i} style={{ marginBottom: para === '' ? '8px' : '4px' }}>
                      {para.startsWith('*') && para.endsWith('*') ? (
                        <em style={{ color: 'var(--accent-warning)', fontWeight: 500 }}>{para.replace(/\*/g, '')}</em>
                      ) : para.startsWith('**') ? (
                        <strong>{para.replace(/\*\*/g, '')}</strong>
                      ) : (
                        para.replace(/\*\*/g, '')
                      )}
                    </p>
                  ))}
                </div>
                <div className="bubble-meta">
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'ai' && msg.modelInfo && (
                    <span className="routing-reason">
                      <Zap size={10} />
                      {msg.modelInfo.model} ({msg.modelInfo.latency})
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="chat-chips">
          {suggestions.map((chip, idx) => (
            <button 
              key={idx} 
              type="button" 
              className="chip"
              onClick={() => handleChipClick(chip)}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Message Input form */}
        <form onSubmit={handleSubmit} className="log-form">
          <input 
            type="text" 
            className="input-field" 
            placeholder="Talk to your coach or log expenses (e.g., Coffee ₹180)..." 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button type="submit" className="btn-primary" style={{ padding: '12px 20px' }}>
            <Send size={16} />
          </button>
        </form>
      </div>

      {/* Sidebar: Cascadeflow Debug */}
      <div className="chat-sidebar">
        <div className="glass-card cascade-panel">
          <div className="cascade-header">
            <Layers size={18} />
            <span>Cascadeflow Routing</span>
          </div>
          
          <div className="routing-item">
            <span className="routing-label">Total Routes:</span>
            <span className="routing-val">{totalQueries}</span>
          </div>

          <div className="routing-item">
            <span className="routing-label">Gemini 1.5 Pro (Deep reasoning):</span>
            <span className="routing-val active-pro">{proCount}</span>
          </div>

          <div className="routing-item">
            <span className="routing-label">Llama 3 (Simple math/logs):</span>
            <span className="routing-val active-flash">{flashCount}</span>
          </div>

          <div style={{ marginTop: '8px' }}>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
              Realtime Decision Logs
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
              {state.modelHistory.length > 0 ? (
                state.modelHistory.map((item, idx) => (
                  <div key={idx} style={{ 
                    background: 'rgba(0, 0, 0, 0.2)', 
                    padding: '8px', 
                    borderRadius: 'var(--radius-sm)', 
                    border: '1px solid var(--border-color)',
                    fontSize: '0.75rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: 'var(--text-primary)' }}>
                      <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '120px' }}>
                        "{item.query}"
                      </span>
                      <span style={{ color: item.model.includes('Pro') ? 'var(--accent-secondary)' : 'var(--accent-warning)' }}>
                        {item.model}
                      </span>
                    </div>
                    <div style={{ color: 'var(--text-muted)', marginTop: '4px', fontSize: '0.7rem' }}>
                      Reason: {item.reason} ({item.latency})
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textAlign: 'center', padding: '10px 0' }}>
                  No routing transactions logged yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
