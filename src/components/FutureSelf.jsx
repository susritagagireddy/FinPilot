import React, { useState } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title as ChartTitle, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Eye, TrendingUp, Sparkles } from 'lucide-react';
import { formatCurrency } from '../utils/agentEngine';

// Register ChartJS modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  Tooltip,
  Legend
);

export default function FutureSelf({ state }) {
  // Simulator input states
  const [foodReduction, setFoodReduction] = useState(30); // 30% reduction default
  const [extraSavings, setExtraSavings] = useState(2000);  // ₹2,000 extra savings/month
  const [salaryHike, setSalaryHike] = useState(10);        // 10% annual hike

  // Core base metrics
  const salary = state.salary || 40000;
  const rent = state.rent || 8000;
  
  // Calculate category food expenses
  const foodExpenses = state.expenses
    .filter(e => e.category === 'Food')
    .reduce((sum, e) => sum + e.amount, 0) || 5000; // default food expense ₹5,000

  const otherExpenses = state.expenses
    .filter(e => e.category !== 'Rent' && e.category !== 'Food')
    .reduce((sum, e) => sum + e.amount, 0) || 5000; // default other expenses ₹5,000

  // Calculate monthly savings
  // Current Trend: Salary - Rent - Food - Other
  const currentMonthlySavings = Math.max(salary - rent - foodExpenses - otherExpenses, 2000);
  
  // Food savings based on slider reduction
  const foodSavingsAmount = foodExpenses * (foodReduction / 100);
  
  // Optimized Trend: Current Savings + Food Savings + Extra Savings
  const optimizedMonthlySavings = currentMonthlySavings + foodSavingsAmount + extraSavings;

  // Starting capital (Emergency fund or savings)
  const initialCapital = state.currentSavings || 20000;

  // Generate 12-month projections
  const months = ['Month 0', 'Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6', 'Month 7', 'Month 8', 'Month 9', 'Month 10', 'Month 11', 'Month 12'];
  
  const currentTrendData = [];
  const optimizedTrendData = [];
  
  let currentAccum = initialCapital;
  let optimizedAccum = initialCapital;
  
  currentTrendData.push(currentAccum);
  optimizedTrendData.push(optimizedAccum);

  for (let i = 1; i <= 12; i++) {
    // Apply compounding / monthly addition
    currentAccum += currentMonthlySavings;
    
    // Optimized path with hiking factored in at month 12
    let monthlyAdd = optimizedMonthlySavings;
    if (i === 12) {
      // Apply annual salary hike to savings potential
      monthlyAdd += (salary * (salaryHike / 100));
    }
    optimizedAccum += monthlyAdd;
    
    currentTrendData.push(Math.round(currentAccum));
    optimizedTrendData.push(Math.round(optimizedAccum));
  }

  // Chart configuration
  const chartData = {
    labels: months,
    datasets: [
      {
        label: 'Current Trend (Maintain Habits)',
        data: currentTrendData,
        borderColor: '#f59e0b', // Amber
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.2,
        borderWidth: 2,
        pointRadius: 3,
      },
      {
        label: 'Optimized Trend (FinPilot Strategy)',
        data: optimizedTrendData,
        borderColor: '#10b981', // Emerald
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.2,
        borderWidth: 3,
        pointRadius: 4,
        fill: true,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#e5e7eb',
          font: {
            family: 'Inter',
            size: 11
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.03)'
        },
        ticks: {
          color: '#9ca3af',
          font: {
            family: 'Inter',
            size: 10
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.03)'
        },
        ticks: {
          color: '#9ca3af',
          font: {
            family: 'Inter',
            size: 10
          },
          callback: (value) => formatCurrency(value)
        }
      }
    }
  };

  // Math metrics for summary
  const endCurrent = currentTrendData[12];
  const endOptimized = optimizedTrendData[12];
  const netGain = endOptimized - endCurrent;

  return (
    <div className="glass-card">
      <div className="memory-header">
        <Eye size={20} color="var(--accent-secondary)" />
        <h2 className="memory-title" style={{ color: 'var(--accent-secondary)' }}>Future Self Simulator</h2>
      </div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)' }}>
        Project your finances 1 year out. Adjust behaviors below to simulate how small changes alter your net worth trajectory.
      </p>

      <div className="simulator-layout">
        {/* Sliders Panel */}
        <div className="simulator-controls">
          <div className="slider-group">
            <div className="slider-header">
              <span>Reduce Food Delivery</span>
              <span className="slider-val">{foodReduction}%</span>
            </div>
            <input 
              type="range" 
              className="slider-input" 
              min="0" 
              max="100" 
              value={foodReduction}
              onChange={(e) => setFoodReduction(parseInt(e.target.value))}
            />
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Saves {formatCurrency(foodSavingsAmount)} / month from food spending.
            </p>
          </div>

          <div className="slider-group">
            <div className="slider-header">
              <span>Extra Monthly Savings</span>
              <span className="slider-val">{formatCurrency(extraSavings)}</span>
            </div>
            <input 
              type="range" 
              className="slider-input" 
              min="0" 
              max="10000" 
              step="500"
              value={extraSavings}
              onChange={(e) => setExtraSavings(parseInt(e.target.value))}
            />
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Inflow redirected from leisure/miscellaneous shopping.
            </p>
          </div>

          <div className="slider-group">
            <div className="slider-header">
              <span>Annual Salary Hike</span>
              <span className="slider-val">{salaryHike}%</span>
            </div>
            <input 
              type="range" 
              className="slider-input" 
              min="0" 
              max="30" 
              value={salaryHike}
              onChange={(e) => setSalaryHike(parseInt(e.target.value))}
            />
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Compound adjustment applied at Month 12.
            </p>
          </div>

          <div className="projection-summary">
            <div className="summary-heading">
              <Sparkles size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
              AI Trajectory Forecast
            </div>
            <p className="summary-body">
              By implementing these optimizations, your savings will reach <strong>{formatCurrency(endOptimized)}</strong> in 12 months. 
              This is a net gain of <strong style={{ color: 'var(--accent-primary)' }}>{formatCurrency(netGain)}</strong> over your current habits.
            </p>
            {state.savingsGoal > 0 && (
              <div style={{ marginTop: '8px', fontSize: '0.78rem', color: 'var(--accent-secondary)', fontWeight: 600 }}>
                Goal completion timeline cut by {Math.round((foodSavingsAmount + extraSavings) > 0 ? (state.savingsGoal / currentMonthlySavings) - (state.savingsGoal / optimizedMonthlySavings) : 0)} months!
              </div>
            )}
          </div>
        </div>

        {/* Visual Chart */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div className="chart-card glass-card" style={{ background: 'rgba(0,0,0,0.15)', flex: 1, padding: 'var(--space-md)' }}>
            <div style={{ height: '300px', width: '100%' }}>
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', justifyContent: 'center' }}>
            <TrendingUp size={14} color="var(--accent-primary)" />
            <span>Interactive chart dynamically compounding sliders at a 12-month interval.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
