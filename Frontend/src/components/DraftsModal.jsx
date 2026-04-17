import { useState } from 'react';

export default function DraftsModal({ 
  isOpen, onClose, currentSemester, currentDraftId, loadDraft, deleteDraft 
}) {

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal" style={{width: '520px'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
          <h3>Saved Drafts</h3>
          <button onClick={onClose} style={{fontSize:'1.8rem', color:'#888'}}>✕</button>
        </div>

        <div style={{maxHeight:'380px', overflow:'auto', paddingRight:'10px'}}>
          {currentSemester.drafts.length === 0 ? (
            <p style={{textAlign:'center', color:'#777', padding:'40px 0'}}>No drafts yet</p>
          ) : (
            currentSemester.drafts.map(draft => {
              const isActive = draft.id === currentDraftId;
              return (
                <div 
                  key={draft.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '18px',
                    background: isActive ? '#14532d' : '#1f1f1f',
                    borderRadius: '16px',
                    marginBottom: '10px'
                  }}
                >
                  <div>
                    <div style={{fontWeight:'600'}}>{draft.name}</div>
                    <div style={{fontSize:'0.85rem', color:'#888'}}>
                      {draft.events.length} classes
                    </div>
                  </div>
                  <div style={{display:'flex', gap:'10px'}}>
                    <button 
                      onClick={() => { loadDraft(draft.id); onClose(); }}
                      style={{padding:'8px 16px', background:'#27272a', borderRadius:'10px'}}
                    >
                      Load
                    </button>
                    <button 
                      onClick={() => confirm(`Delete "${draft.name}"?`) && deleteDraft(draft.id)}
                      style={{padding:'8px 12px', color:'#ef4444'}}
                    >
                      🗑
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <button className="cancel-btn" onClick={onClose} style={{marginTop:'20px', width:'100%'}}>
          Close
        </button>
      </div>
    </div>
  );
}