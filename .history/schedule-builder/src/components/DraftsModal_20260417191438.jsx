export default function DraftsModal({ 
  isOpen, 
  onClose, 
  currentSemester, 
  currentDraftId, 
  loadDraft, 
  deleteDraft 
}) {

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-3xl p-8 w-[520px]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold">Saved Drafts</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="max-h-96 overflow-auto space-y-3 pr-2">
          {currentSemester.drafts.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No drafts yet</p>
          ) : (
            currentSemester.drafts.map(draft => {
              const isActive = draft.id === currentDraftId;
              return (
                <div 
                  key={draft.id}
                  className={`flex justify-between items-center p-5 rounded-2xl transition-all ${
                    isActive 
                      ? 'bg-emerald-900/30 ring-2 ring-emerald-500' 
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  <div>
                    <div className="font-medium">{draft.name}</div>
                    <div className="text-xs text-gray-400">
                      {draft.events.length} classes • {draft.events.length > 0 ? 'Active' : 'Empty'}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => {
                        loadDraft(draft.id);
                        onClose();
                      }}
                      className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-2xl text-sm font-medium"
                    >
                      Load
                    </button>
                    <button 
                      onClick={() => {
                        if (confirm(`Delete draft "${draft.name}"?`)) {
                          deleteDraft(draft.id);
                        }
                      }}
                      className="px-4 py-2 text-red-400 hover:bg-red-950/50 rounded-2xl"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <button 
          onClick={onClose}
          className="mt-8 w-full py-4 border border-gray-700 rounded-2xl hover:bg-gray-800"
        >
          Close
        </button>
      </div>
    </div>
  );
}