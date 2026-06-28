import React from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  Info, 
  Sparkles, 
  ShieldCheck, 
  Calendar,
  AlertOctagon
} from 'lucide-react';

export default function MemoryTimeline({ state }) {
  
  // Icon selector based on event type
  const getTimelineIcon = (type) => {
    switch (type) {
      case 'salary':
        return <TrendingUp size={12} color="#10b981" />;
      case 'warning':
        return <AlertTriangle size={12} color="#f59e0b" />;
      case 'danger':
        return <AlertOctagon size={12} color="#f43f5e" />;
      case 'info':
      default:
        return <Info size={12} color="#06b6d4" />;
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-lg)' }}>
      {/* Timeline view */}
      <div className="glass-card">
        <div className="memory-header">
          <Calendar size={20} color="var(--accent-primary)" />
          <h2 className="memory-title" style={{ color: 'var(--accent-primary)' }}>Financial Memory Timeline</h2>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>
          A ledger of everything FinPilot AI has remembered about your journey, including milestones and behavioral updates.
        </p>

        <div className="timeline-list">
          {state.timeline.length > 0 ? (
            state.timeline.map((event) => (
              <div className="timeline-item" key={event.id}>
                <div className={`timeline-dot ${event.type}`}>
                  {getTimelineIcon(event.type)}
                </div>
                <div className="timeline-content">
                  <div className="timeline-date">{event.date}</div>
                  <h3 className="timeline-title">{event.title}</h3>
                  <p className="timeline-desc">{event.desc}</p>
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '40px 0' }}>
              No timeline milestones recorded yet. Start updating your profile parameters.
            </p>
          )}
        </div>
      </div>

      {/* Sidebar: Cognitive Summary */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
        <div className="glass-card">
          <div className="memory-header" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
            <ShieldCheck size={18} color="var(--accent-secondary)" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--accent-secondary)' }}>Memory Trust Profile</h3>
          </div>
          
          <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <Sparkles size={16} color="var(--accent-warning)" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <h4 style={{ fontSize: '0.82rem', fontWeight: 600 }}>Behavioral Identity:</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  {state.expenses.length >= 4 
                    ? "Calculated: 'Weekend Spender' pattern with food delivery spikes."
                    : "Analyzing habits... Needs at least 3 logged expense entries."}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <Sparkles size={16} color="var(--accent-primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <h4 style={{ fontSize: '0.82rem', fontWeight: 600 }}>Emergency Lock:</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  {state.memoryFacts.some(f => f.label.includes('Priority'))
                    ? "Active priority: Build emergency savings of ₹50,000 before luxury purchases."
                    : "No specific priority lockdowns defined."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
