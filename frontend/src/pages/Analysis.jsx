import React from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { Download, Users, AlertTriangle, Network, Circle, ArrowLeft } from 'lucide-react'

function StatCard({title, value, small, icon: Icon, index}){
  return (
    <div 
      style={{
        backgroundColor: '#1e293b',
        borderRadius: '12px',
        border: '1px solid #334155',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.8) 100%)',
        backdropFilter: 'blur(10px)',
        animation: `slideInUp 0.6s ease-out forwards`,
        animationDelay: `${index * 0.1}s`,
        opacity: 0,
        transition: 'all 0.3s ease',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#60a5fa';
        e.currentTarget.style.boxShadow = '0 0 30px rgba(59, 130, 246, 0.2)';
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#334155';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
        <div>
          <div style={{color:'#94a3b8',fontSize:13,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.05em'}}>{title}</div>
          <div style={{fontSize:42,fontWeight:800,marginTop:12,color:title==='Flagged'?'#ef4444':title==='Fraud Rings'?'#f59e0b':'#3b82f6',backgroundImage:title!=='Flagged'&&title!=='Fraud Rings'?'linear-gradient(135deg, #3b82f6, #a78bfa)':'none',backgroundClip:title!=='Flagged'&&title!=='Fraud Rings'?'text':'unset',WebkitBackgroundClip:title!=='Flagged'&&title!=='Fraud Rings'?'text':'unset',WebkitTextFillColor:title!=='Flagged'&&title!=='Fraud Rings'?'transparent':'unset'}}>{value}</div>
        </div>
        {Icon && <Icon size={36} style={{color: '#475569', opacity: 0.6}} />}
      </div>
      {small && <div style={{fontSize:13, color:'#cbd5e1', marginTop: 'auto', paddingTop: '16px', lineHeight: '1.8'}}>{small}</div>}
    </div>
  )
}

export default function Analysis(){
  const navigate = useNavigate()
  
  // Safely parse localStorage data with error handling
  let result = null
  let rows = []
  
  try {
    const raw = localStorage.getItem('analysis_result')
    // Only parse if raw exists and is not the string "undefined"
    if (raw && raw !== 'undefined' && raw !== 'null') {
      result = JSON.parse(raw)
      console.log('✅ Loaded analysis_result from localStorage:', result)
    } else {
      console.warn('⚠️ analysis_result not found in localStorage')
    }
  } catch (err) {
    console.error('❌ Error parsing analysis_result:', err)
  }
  
  try {
    const rawRows = localStorage.getItem('analysis_rows')
    // Only parse if rawRows exists and is not the string "undefined"
    if (rawRows && rawRows !== 'undefined' && rawRows !== 'null') {
      rows = JSON.parse(rawRows)
      console.log(`✅ Loaded ${rows.length} transaction rows from localStorage`)
    } else {
      console.warn('⚠️ analysis_rows not found in localStorage')
    }
  } catch (err) {
    console.error('❌ Error parsing analysis_rows:', err)
  }
  
  // Log data structure for debugging
  if (result) {
    console.log('📊 Result structure:', {
      hasAccounts: !!result.accounts,
      accountCount: result.accounts?.length || 0,
      hasRings: !!result.rings,
      ringCount: result.rings?.length || 0,
      hasSummary: !!result.summary,
      hasNodes: !!result.nodes,
      hasEdges: !!result.edges
    })
  }

  if(!result) return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-white mb-2">No analysis found</h3>
        <div className="text-slate-400">Upload CSV on the home page first.</div>
        <button onClick={() => navigate('/')} className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all">Go Home</button>
      </div>
    </div>
  )

  function downloadReport() {
    // Transform result to match the required JSON format
    const transformedData = {
      suspicious_accounts: result.accounts.map(account => ({
        account_id: account.account_id,
        suspicion_score: account.suspicion_score,
        detected_patterns: account.detected_patterns || [],
        ring_ids: account.ring_ids || []
      })),
      fraud_rings: result.rings.map(ring => ({
        ring_id: ring.ring_id,
        member_accounts: ring.member_accounts,
        pattern_type: ring.pattern_type,
        risk_score: ring.risk_score
      })),
      summary: {
        total_accounts_analyzed: result.summary.total_accounts_analyzed,
        suspicious_accounts_flagged: result.summary.suspicious_accounts_flagged,
        fraud_rings_detected: result.summary.fraud_rings_detected,
        processing_time_seconds: result.summary.processing_time_seconds
      }
    }
    
    const jsonStr = JSON.stringify(transformedData, null, 2)
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'fraud_analysis_report.json'
    a.click()
    URL.revokeObjectURL(url)
  }
  
  function openBrowserConsole() {
    // Log all data for debugging
    console.log('📋 ===== DATA INSPECTION =====')
    console.log('Result object:', result)
    console.log('Rows count:', rows.length)
    console.log('Accounts:', result?.accounts?.length || 0)
    console.log('Rings:', result?.rings?.length || 0)
    console.log('Summary:', result?.summary)
    console.log('✅ Check browser console for details')
  }

  return (
    <div style={{background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)', minHeight: '100vh'}}>
      {/* Navbar Section */}
      <div style={{background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(51, 65, 85, 0.5)'}}>
        <div style={{maxWidth: '80rem', margin: '0 auto', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
            <button 
              onClick={() => navigate('/')} 
              style={{padding: '8px', cursor: 'pointer', borderRadius: '8px', border: '1px solid #334155', background: 'transparent', transition: 'all 0.3s'}}
              onMouseEnter={(e) => {e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'; e.currentTarget.style.borderColor = '#3b82f6';}}
              onMouseLeave={(e) => {e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#334155';}}
            >
              <ArrowLeft size={20} style={{color: '#e2e8f0'}} />
            </button>
            <div>
              <h1 style={{fontSize: '24px', fontWeight: '800', color: '#f1f5f9', margin: 0}}>Analysis Dashboard</h1>
              <p style={{fontSize: '13px', color: '#94a3b8', margin: '4px 0 0 0'}}>{result.summary.total_accounts_analyzed} accounts analyzed</p>
            </div>
          </div>
          <button 
            onClick={downloadReport}
            style={{display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: '#fff', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px', transition: 'all 0.3s', boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)'}}
            onMouseEnter={(e) => {e.currentTarget.style.boxShadow = '0 0 30px rgba(99, 102, 241, 0.5)'; e.currentTarget.style.transform = 'translateY(-2px)';}}
            onMouseLeave={(e) => {e.currentTarget.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.3)'; e.currentTarget.style.transform = 'translateY(0)';}}
          >
            <Download size={18} />
            Download Report
          </button>
        </div>
      </div>

      {/* Stat Cards Section */}
      <div style={{maxWidth: '80rem', margin: '0 auto', padding: '32px 24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px'}}>
        <StatCard 
          title="Total Accounts" 
          value={result.summary.total_accounts_analyzed}
          icon={Users}
          index={0}
        />
        <StatCard 
          title="Flagged" 
          value={result.summary.suspicious_accounts_flagged}
          icon={AlertTriangle}
          index={1}
        />
        <StatCard 
          title="Fraud Rings" 
          value={result.summary.fraud_rings_detected}
          icon={Network}
          index={2}
        />
        <StatCard 
          title="Patterns"
          value=""
          icon={Circle}
          index={3}
          small={
            <div>
              <div style={{display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px'}}><span style={{color: '#3b82f6'}}>●</span> Circular: {result.rings.filter(r=>r.pattern_type==='cycle').length}</div>
              <div style={{display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px'}}><span style={{color: '#f59e0b'}}>●</span> Smurfing: 1</div>
              <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}><span style={{color: '#a78bfa'}}>●</span> Shell: {result.rings.filter(r=>r.pattern_type==='shell').length}</div>
            </div>
          }
        />
      </div>

      {/* Tabs and Content Section */}
      <div style={{maxWidth: '80rem', margin: '0 auto', padding: '0 24px 32px'}}>
        <div style={{background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: '1px solid #334155'}}>
          {/* Tabs Header */}
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', padding: '16px'}}>
            <div style={{display: 'flex', gap: '8px'}}>
              {[
                {to: '/analysis/network', label: 'Network Graph'},
                {to: '/analysis/fraud', label: `Fraud Rings (${result.rings.length})`},
                {to: '/analysis/accounts', label: `Accounts (${result.summary.total_accounts_analyzed})`}
              ].map((tab, i) => (
                <NavLink 
                  key={i}
                  to={tab.to}
                  style={({isActive}) => ({
                    padding: '10px 16px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '14px',
                    color: isActive ? '#3b82f6' : '#94a3b8',
                    background: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                    border: isActive ? '1px solid #3b82f6' : '1px solid transparent',
                    transition: 'all 0.3s',
                    cursor: 'pointer',
                    textDecoration: 'none'
                  })}
                >
                  {tab.label}
                </NavLink>
              ))}
            </div>
            <button style={{padding: '6px 12px', border: '1px solid #334155', borderRadius: '6px', fontSize: '12px', fontWeight: '600', color: '#e2e8f0', background: 'transparent', cursor: 'pointer', transition: 'all 0.3s'}}
              onMouseEnter={(e) => {e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'; e.currentTarget.style.borderColor = '#3b82f6';}}
              onMouseLeave={(e) => {e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#334155';}}
            >
              Hierarchical
            </button>
          </div>

          {/* Content Area */}
          <div style={{padding: '24px'}}>
            {console.log('📤 Analysis passing to Outlet:', {resultExists: !!result, rowsCount: rows.length})}
            <Outlet context={{result, rows}} />
          </div>
        </div>
      </div>

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
