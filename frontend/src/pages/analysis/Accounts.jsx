import React, {useState, useMemo} from 'react'
import { useOutletContext } from 'react-router-dom'
import { Users, Search } from 'lucide-react'

export default function Accounts(){
  const { rows, result } = useOutletContext()
  const suspicious = result?.accounts || []
  const [q, setQ] = useState('')
  const accounts = useMemo(()=>{
    if (!rows || rows.length === 0) return []
    const map = new Map()
    for(const t of rows){
      if (!t) continue
      if (t.sender_id) map.set(t.sender_id, (map.get(t.sender_id)||0)+1)
      if (t.receiver_id) map.set(t.receiver_id, (map.get(t.receiver_id)||0)+1)
    }
    const arr = Array.from(map.entries()).map(([id,cnt])=>({account_id:id, transactions:cnt, score:(suspicious.find(x=>x.account_id===id)?.suspicion_score||0), patterns:(suspicious.find(x=>x.account_id===id)?.detected_patterns||[]) }))
    return arr.sort((a,b)=>b.score - a.score)
  },[rows,suspicious])

  const filtered = accounts.filter(a => a?.account_id?.toString().toLowerCase().includes(q.toLowerCase()))
  const flaggedCount = filtered.filter(a => a.score > 0).length

  return (
    <div style={{padding: 0}}>
      <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #334155'}}>
        <div style={{padding: '8px 12px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '8px', color: '#8b5cf6'}}>
          <Users size={20} />
        </div>
        <h3 style={{fontSize: '18px', fontWeight: '700', color: '#f1f5f9', margin: 0}}>Account Analysis</h3>
        <span style={{marginLeft: 'auto', fontSize: '12px', color: '#94a3b8', background: 'rgba(139, 92, 246, 0.1)', padding: '4px 12px', borderRadius: '20px'}}>{flaggedCount} flagged</span>
      </div>

      {/* Search */}
      <div style={{marginBottom: '20px', position: 'relative'}}>
        <Search size={18} style={{position: 'absolute', left: '12px', top: '12px', color: '#94a3b8'}} />
        <input 
          placeholder="Search accounts..." 
          value={q} 
          onChange={e=>setQ(e.target.value)} 
          style={{
            width: '100%',
            padding: '10px 12px 10px 40px',
            borderRadius: '8px',
            border: '1px solid #334155',
            background: 'rgba(30, 41, 59, 0.6)',
            color: '#f1f5f9',
            fontSize: '14px',
            transition: 'all 0.3s'
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#3b82f6'
            e.currentTarget.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.2)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#334155'
            e.currentTarget.style.boxShadow = 'none'
          }}
        />
      </div>

      {/* Table */}
      <div style={{overflowX: 'auto'}}>
        <table style={{width: '100%', borderCollapse: 'collapse'}}>
          <thead>
            <tr style={{borderBottom: '1px solid #334155', backgroundColor: 'rgba(15, 23, 42, 0.4)'}}>
              <th style={{padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Account ID</th>
              <th style={{padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Score</th>
              <th style={{padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Patterns</th>
              <th style={{padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Transactions</th>
              <th style={{padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} style={{padding: '40px', textAlign: 'center', color: '#94a3b8'}}>No accounts found</td></tr>
            ) : (
              filtered.map((a, i) => (
                <tr 
                  key={a.account_id}
                  style={{
                    borderBottom: '1px solid #334155',
                    backgroundColor: i % 2 === 0 ? 'transparent' : 'rgba(30, 41, 59, 0.3)',
                    transition: 'background-color 0.3s',
                    cursor: 'pointer',
                    animation: `slideInUp 0.6s ease-out forwards`,
                    animationDelay: `${i * 0.05}s`,
                    opacity: 0
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = i % 2 === 0 ? 'transparent' : 'rgba(30, 41, 59, 0.3)'
                  }}
                >
                  <td style={{padding: '12px', color: '#e2e8f0', fontFamily: 'monospace', fontSize: '13px'}}>{a.account_id}</td>
                  <td style={{padding: '12px'}}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '700',
                      background: a.score > 70 ? 'rgba(239, 68, 68, 0.1)' : a.score > 40 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                      color: a.score > 70 ? '#ef4444' : a.score > 40 ? '#f59e0b' : '#3b82f6'
                    }}>
                      {a.score.toFixed(1)}
                    </span>
                  </td>
                  <td style={{padding: '12px', color: '#cbd5e1', fontSize: '13px'}}>
                    {a.patterns.length > 0 ? a.patterns.join(', ') : '-'}
                  </td>
                  <td style={{padding: '12px', color: '#e2e8f0', fontWeight: '600'}}>{a.transactions}</td>
                  <td style={{padding: '12px'}}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '700',
                      background: a.score > 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                      color: a.score > 0 ? '#f87171' : '#86efac'
                    }}>
                      {a.score > 0 ? '⚠ Flagged' : '✓ Clean'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
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
