import { useState } from 'react';

export default function AddEventModal({ 
  isOpen, 
  onClose, 
  selectedCell, 
  currentSemester, 
  currentEvents, 
  setCurrentEvents 
}) {

  const [courseId, setCourseId] = useState('');
  const [type, setType] = useState('Lecture');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [hall, setHall] = useState('');
  const [group, setGroup] = useState('');
  const [section, setSection] = useState('');

  const handleAdd = () => {
    if (!courseId || !selectedCell || !startTime || !endTime) {
      alert("Please select course, start time and end time");
      return;
    }

    const newEvent = {
      id: Date.now(),
      courseId: Number(courseId),
      day: selectedCell.day,
      startTime: startTime,        // Changed from 'time'
      endTime: endTime,            // New: End time
      type,
      hall: hall || null,
      group: group || null,
      section: section || null
    };

    // Check for overlap
    const hasConflict = currentEvents.some(e => 
      e.day === newEvent.day && 
      ((startTime >= e.startTime && startTime < (e.endTime || e.time)) || 
       (endTime > e.startTime && endTime <= (e.endTime || e.time)))
    );

    if (hasConflict) {
      alert("⚠️ Time conflict! This overlaps with another class.");
      return;
    }

    setCurrentEvents(prev => [...prev, newEvent]);
    onClose();

    // Reset form
    setCourseId('');
    setStartTime('');
    setEndTime('');
    setHall('');
    setGroup('');
    setSection('');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Add Class on {selectedCell?.day}</h3>
        <p style={{color: '#888', marginBottom: '20px'}}>
          Starting from {selectedCell?.time}
        </p>
        
        <div className="panel-form">
          <label>Course</label>
          <select 
            value={courseId} 
            onChange={(e) => setCourseId(e.target.value)}
          >
            <option value="">Select Course</option>
            {currentSemester.courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.code} — {course.name}
              </option>
            ))}
          </select>

          <label>Type</label>
          <select 
            value={type} 
            onChange={(e) => setType(e.target.value)}
          >
            <option value="Lecture">Lecture</option>
            <option value="Lab">Lab</option>
            <option value="Tutorial">Tutorial</option>
            <option value="Extra">Extra Session</option>
          </select>

          <label>Start Time</label>
          <input 
            type="time" 
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />

          <label>End Time</label>
          <input 
            type="time" 
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />

          <label>Hall (optional)</label>
          <input 
            type="text" 
            placeholder="C-301" 
            value={hall}
            onChange={(e) => setHall(e.target.value)}
          />

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
            <div>
              <label>Group No.</label>
              <input 
                type="text" 
                placeholder="1" 
                value={group}
                onChange={(e) => setGroup(e.target.value)}
              />
            </div>
            <div>
              <label>Section No.</label>
              <input 
                type="text" 
                placeholder="2" 
                value={section}
                onChange={(e) => setSection(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="modal-buttons">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="save-btn" onClick={handleAdd}>
            Add to Schedule
          </button>
        </div>
      </div>
    </div>
  );
}