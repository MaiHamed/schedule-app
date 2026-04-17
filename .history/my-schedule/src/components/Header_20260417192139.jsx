export default function Header({ 
  semesters, currentSemesterId, setCurrentSemesterId, 
  startDay, setStartDay, addSemester, 
  currentSemester, saveDraft, newDraft, setShowDrafts 
}) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-4xl font-bold flex items-center gap-3">
        📅 My Schedule
      </h1>

      <div className="flex items-center gap-4">
        <div>
          <label className="text-sm block mb-1 text-gray-400">Semester</label>
          <select 
            value={currentSemesterId}
            onChange={(e) => setCurrentSemesterId(Number(e.target.value))}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
          >
            {semesters.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <button 
          onClick={addSemester}
          className="bg-emerald-600 hover:bg-emerald-700 px-5 py-2 rounded-xl font-medium"
        >
          + Add Semester
        </button>

        <div>
          <label className="text-sm block mb-1 text-gray-400">Week starts on</label>
          <select 
            value={startDay}
            onChange={(e) => setStartDay(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
          >
            <option value="Monday">Monday</option>
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
          </select>
        </div>

        <button 
          onClick={saveDraft}
          className="bg-emerald-600 hover:bg-emerald-700 px-6 py-2 rounded-xl font-medium flex items-center gap-2"
        >
          💾 Save Draft
        </button>

        <button 
          onClick={newDraft}
          className="px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded-2xl"
        >
          New Draft
        </button>

        <button 
          onClick={() => setShowDrafts(true)}
          className="px-5 py-2 bg-amber-600 hover:bg-amber-700 rounded-2xl"
        >
          📂 My Drafts
        </button>

        <button 
          onClick={() => {
            const grid = document.getElementById('schedule-grid');
            if (grid) {
              import('html2canvas').then(html2canvas => {
                html2canvas.default(grid, { scale: 2 }).then(canvas => {
                  const link = document.createElement('a');
                  link.download = `schedule-${currentSemester.name}.png`;
                  link.href = canvas.toDataURL('image/png');
                  link.click();
                });
              });
            }
          }}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-xl font-medium flex items-center gap-2"
        >
          📤 Download
        </button>
      </div>
    </div>
  );
}