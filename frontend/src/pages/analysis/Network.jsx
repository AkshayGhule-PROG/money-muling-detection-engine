import React, {useRef} from 'react'
import CytoscapeComponent from 'react-cytoscapejs'
import { useOutletContext } from 'react-router-dom'
import { Network as NetworkIcon } from 'lucide-react'

export default function Network(){
  const cyRef = useRef(null)
  const context = useOutletContext()
  const { result, rows } = context || {}

  console.log('🔄 Network component mounted', { contextExists: !!context, result, rowsCount: rows?.length })

  // build elements from rows and suspicious set
  const nodes = new Set()
  const edges = []
  
  console.log('📋 Rows data:', rows)
  console.log('📋 Row type:', typeof rows, 'Is array?', Array.isArray(rows))
  
  if (rows && Array.isArray(rows)) {
    console.log(`🔍 Processing ${rows.length} rows...`)
    for(const t of rows) {
      if (!t) {
        console.log('⚠️ Skipping empty row')
        continue
      }
      console.log('📝 Row:', t)
      // Use 'sender' and 'receiver' instead of 'sender_id' and 'receiver_id'
      if (t.sender) nodes.add(t.sender)
      if (t.receiver) nodes.add(t.receiver)
      if (t.transaction_id && t.sender && t.receiver) {
        edges.push({data:{id:t.transaction_id, source:t.sender, target:t.receiver}})
      }
    }
  } else {
    console.warn('⚠️ No rows or not an array:', { rows, isArray: Array.isArray(rows) })
  }
  
  console.log(`📊 Network: ${nodes.size} nodes, ${edges.length} edges`)
  
  // Create account score map
  const scoreMap = new Map()
  const susSet = new Set((result?.accounts||[]).map(s=>s.account_id).filter(Boolean))
  
  if (result?.accounts && Array.isArray(result.accounts)) {
    for (const acc of result.accounts) {
      scoreMap.set(acc.account_id, acc.suspicion_score)
    }
    console.log(`💾 Created score map with ${scoreMap.size} accounts`, Array.from(scoreMap.entries()).slice(0, 5))
  } else {
    console.warn('⚠️ No accounts data in result:', result?.accounts)
  }
  
  const nEls = Array.from(nodes).map(id=>{
    const score = scoreMap.get(id) || 0
    const isSuspicious = susSet.has(id)
    // Format: show ID with score as suffix for suspicious accounts
    const label = isSuspicious ? `${id} (${score.toFixed(0)})` : id
    return {
      data:{
        id,
        label: label,
        score: score,
        isSuspicious: isSuspicious
      }
    }
  })
  
  console.log('🎨 Elements created:', { nodeCount: nEls.length, edgeCount: edges.length, suspiciousCount: susSet.size })
  
  const elements = [...nEls.map(n=>({data:n.data, classes: n.data.isSuspicious?'sus':''})), ...edges]
  
  console.log('✅ Final elements:', elements.length)

  return (
    <div style={{padding: 0}}>
      <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #334155'}}>
        <div style={{padding: '8px 12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', color: '#3b82f6'}}>
          <NetworkIcon size={20} />
        </div>
        <h3 style={{fontSize: '18px', fontWeight: '700', color: '#f1f5f9', margin: 0}}>Transaction Network</h3>
        <span style={{marginLeft: 'auto', fontSize: '12px', color: '#94a3b8', background: 'rgba(59, 130, 246, 0.1)', padding: '4px 12px', borderRadius: '20px'}}>{nodes.size} accounts</span>
      </div>
      <div style={{height: 700, borderRadius: 12, border: '1px solid #334155', overflow: 'hidden', background: 'rgba(15, 23, 42, 0.4)'}}>
        <CytoscapeComponent 
          elements={elements} 
          style={{width:'100%',height:'100%'}} 
          stylesheet={[
            {
              selector: 'node',
              style: {
                'label': 'data(label)',
                'background-color': '#3b82f6',
                'width': 70,
                'height': 70,
                'font-size': 12,
                'color': '#fff',
                'text-valign': 'center',
                'text-halign': 'center',
                'font-weight': 'bold'
              }
            },
            {
              selector: 'edge',
              style: {
                'line-color': '#475569',
                'target-arrow-color': '#475569',
                'target-arrow-shape': 'triangle',
                'arrow-scale': 1.4,
                'curve-style': 'bezier',
                'width': 2,
                'opacity': 0.9
              }
            },
            {
              selector: '.sus',
              style: {
                'background-color': '#ef4444',
                'width': 80,
                'height': 80,
                'border-width': 3,
                'border-color': '#991b1b'
              }
            }
          ]}
          layout={{name: 'cose', directed: true, animate: true, animationDuration: 500, avoidOverlap: true, nodeSpacing: 15, padding: 40, randomize: false}}
          cy={(cy)=>{
            cyRef.current=cy
            console.log('✅ Cytoscape initialized with', cy.elements().length, 'elements')
            // Run layout on mount
            setTimeout(() => {
              const layout = cy.layout({name: 'cose', directed: true, animate: true, animationDuration: 500, avoidOverlap: true, nodeSpacing: 15, padding: 40})
              layout.run()
            }, 100)
          }} 
        />
      </div>
    </div>
  )
}
