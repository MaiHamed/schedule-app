import { useEffect, useState } from 'react';

export default function Header({ 
  semesters, 
  currentSemesterId, 
  setCurrentSemesterId, 
  startDay, 
  setStartDay, 
  addSemester, 
  currentSemester, 
  saveDraft, 
  newDraft, 
  setShowDrafts 
}) {

  return (
    <div className="header">
      <h1>My Schedule</h1>

      <div className="controls">
        {/* Semester Selector */}
        <div>
          <label>Semester</label>
          <select 
            value={currentSemesterId}
            onChange={(e) => setCurrentSemesterId(Number(e.target.value))}
          >
            {semesters.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* Add Semester Button */}
        <button 
          onClick={addSemester}
          className="btn-emerald"
        >
          + Add Semester
        </button>

        {/* Week Start Selector */}
        <div>
          <label>Week starts on</label>
          <select 
            value={startDay}
            onChange={(e) => setStartDay(e.target.value)}
          >
            <option value="Monday">Monday</option>
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
          </select>
        </div>

        {/* Action Buttons */}
        <button 
          onClick={saveDraft}
          className="btn-emerald flex items-center gap-2"
        >
          Save Draft
        </button>

        <button 
          onClick={newDraft}
          className="btn-gray"
        >
          New Draft
        </button>

        <button 
          onClick={() => setShowDrafts(true)}
          className="btn-amber"
        >
           My Drafts
        </button>

        <button 
          onClick={() => {
            const grid = document.getElementById('schedule-grid');
            if (grid) {
              import('html2canvas').then((html2canvas) => {
                html2canvas.default(grid, { scale: 2 }).then((canvas) => {
                  const link = document.createElement('a');
                  link.download = `schedule-${currentSemester.name}.png`;
                  link.href = canvas.toDataURL('image/png');
                  link.click();
                });
              });
            }
          }}
          className="btn-blue flex items-center gap-2"
        >
           Download
        </button>
      </div>
    </div>
  );
}