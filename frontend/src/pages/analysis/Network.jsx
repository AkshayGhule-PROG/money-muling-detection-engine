import React, {useRef} from 'react'
import CytoscapeComponent from 'react-cytoscapejs'
import { useOutletContext } from 'react-router-dom'
import { Network as NetworkIcon } from 'lucide-react'

export default function Network(){
  const cyRef = useRef(null)
  const { result, rows } = useOutletContext()

  // build elements from rows and suspicious set
  const nodes = new Set()
  const edges = []
  if (rows && Array.isArray(rows)) {
    for(const t of rows) {
      if (!t) continue
      if (t.sender_id) nodes.add(t.sender_id)
      if (t.receiver_id) nodes.add(t.receiver_id)
      if (t.transaction_id && t.sender_id && t.receiver_id) {
        edges.push({data:{id:t.transaction_id, source:t.sender_id, target:t.receiver_id}})
      }
    }
  }
  const nEls = Array.from(nodes).map(id=>({data:{id,label:id}}))
  const susSet = new Set((result?.accounts||[]).map(s=>s.account_id).filter(Boolean))
  const elements = [...nEls.map(n=>({data:n.data, classes: susSet.has(n.data.id)?'sus':''})), ...edges]

  return (
    <div style={{padding: 0}}>
      <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #334155'}}>
        <div style={{padding: '8px 12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', color: '#3b82f6'}}>
          <NetworkIcon size={20} />
        </div>
        <h3 style={{fontSize: '18px', fontWeight: '700', color: '#f1f5f9', margin: 0}}>Transaction Network</h3>
        <span style={{marginLeft: 'auto', fontSize: '12px', color: '#94a3b8', background: 'rgba(59, 130, 246, 0.1)', padding: '4px 12px', borderRadius: '20px'}}>{nodes.size} accounts</span>
      </div>
      <div style={{height: 600, borderRadius: 12, border: '1px solid #334155', overflow: 'hidden', background: 'rgba(15, 23, 42, 0.4)'}}>
        <CytoscapeComponent 
          elements={elements} 
          style={{width:'100%',height:'100%'}} 
          stylesheet={[
            {selector: 'node', style: { 'label': 'data(label)', 'background-color':'#3b82f6','width':24,'height':24, 'font-size': 12, 'color': '#fff', 'text-valign': 'center', 'text-halign': 'center'}},
            {selector: 'edge', style:{'line-color':'#475569','target-arrow-color':'#475569','target-arrow-shape':'triangle', 'width': 1.5}},
            {selector:'.sus', style:{'background-color':'#ef4444','width':32,'height':32,'border-width':3,'border-color':'#991b1b'}}
          ]} 
          cy={(cy)=>{cyRef.current=cy}} 
        />
      </div>
    </div>
  )
}
