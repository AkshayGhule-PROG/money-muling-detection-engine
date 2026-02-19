import React from 'react'
import { useOutletContext } from 'react-router-dom'
import { Shield } from 'lucide-react'

export default function Rings(){
  const { result } = useOutletContext()
  const rings = result.rings || []
  
  const patternColors = {
    cycle: {bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6', border: '#3b82f6'},
    shell: {bg: 'rgba(168, 85, 247, 0.1)', text: '#a855f7', border: '#a855f7'},
    hub: {bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b', border: '#f59e0b'}
  }

  return (
    <div style={{padding: 0}}>
      <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #334155'}}>
        <div style={{padding: '8px 12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', color: '#ef4444'}}>
          <Shield size={20} />
        </div>
        <h3 style={{fontSize: '18px', fontWeight: '700', color: '#f1f5f9', margin: 0}}>Fraud Rings Detected</h3>
        <span style={{marginLeft: 'auto', fontSize: '12px', color: '#94a3b8', background: 'rgba(239, 68, 68, 0.1)', padding: '4px 12px', borderRadius: '20px'}}>{rings.length} rings</span>
      </div>
      
      {rings.length === 0 ? (
        <div style={{padding: '40px', textAlign: 'center', color: '#94a3b8'}}>
          <p>No fraud rings detected</p>
        </div>
      ) : (
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px'}}>
          {rings.map((r, i) => {
            const color = patternColors[r.pattern_type] || patternColors.cycle
            return (
              <div 
                key={r.ring_id}
                style={{
                  background: 'rgba(30, 41, 59, 0.6)',
                  border: `1px solid ${color.border}`,
                  borderRadius: '12px',
                  padding: '16px',
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                  animation: `slideInUp 0.6s ease-out forwards`,
                  animationDelay: `${i * 0.1}s`,
                  opacity: 0
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = color.text
                  e.currentTarget.style.boxShadow = `0 0 20px ${color.text}33`
                  e.currentTarget.style.transform = 'translateY(-4px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = color.border
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px'}}>
                  <span style={{padding: '4px 8px', background: color.bg, color: color.text, borderRadius: '6px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase'}}>
                    {r.pattern_type}
                  </span>
                  <span style={{marginLeft: 'auto', fontSize: '12px', color: '#94a3b8'}}>Ring #{r.ring_id}</span>
                </div>
                <div style={{marginBottom: '10px'}}>
                  <div style={{fontSize: '12px', color: '#94a3b8', marginBottom: '4px'}}>Members</div>
                  <div style={{fontSize: '18px', fontWeight: '700', color: '#f1f5f9'}}>{r.member_accounts.length}</div>
                </div>
                <div style={{marginBottom: '10px'}}>
                  <div style={{fontSize: '12px', color: '#94a3b8', marginBottom: '4px'}}>Risk Score</div>
                  <div style={{fontSize: '16px', fontWeight: '700', color: color.text}}>{r.risk_score.toFixed(1)}</div>
                </div>
                <div style={{fontSize: '11px', color: '#cbd5e1', lineHeight: '1.6', padding: '10px', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '6px'}}>
                  <strong>Accounts:</strong> {r.member_accounts.join(', ')}
                </div>
              </div>
            )
          })}
        </div>
      )}
      
      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
