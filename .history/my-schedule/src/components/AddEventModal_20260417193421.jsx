import { useState } from 'react';

export default function AddEventModal({ 
  isOpen, onClose, selectedCell, currentSemester, 
  currentEvents, setCurrentEvents 
}) {

  const [courseId, setCourseId] = useState('');
  const [type, setType] = useState('Lecture');
  const [hall, setHall] = useState('');
  const [group, setGroup] = useState('');
  const [section, setSection] = useState('');

  const handleAdd = () => {
    if (!courseId || !selectedCell) return;

    const newEvent = {
      id: Date.now(),
      courseId: Number(courseId),
      day: selectedCell.day,
      time: selectedCell.time,
      type,
      hall: hall || null,
      group: group || null,
      section: section || null
    };

    const hasConflict = currentEvents.some(e => 
      e.day === newEvent.day && e.time === newEvent.time
    );

    if (hasConflict) {
      alert("Time slot already occupied!");
      return;
    }

    setCurrentEvents(prev => [...prev, newEvent]);
    onClose();

    setCourseId(''); setHall(''); setGroup(''); setSection('');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Add Class at {selectedCell?.time}</h3>
        
        <select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
          <option value="">Select Course</option>
          {currentSemester.courses.map(course => (
            <option key={course.id} value={course.id}>
              {course.code} - {course.name}
            </option>
          ))}
        </select>

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="Lecture">Lecture</option>
          <option value="Lab">Lab</option>
          <option value="Tutorial">Tutorial</option>
          <option value="Extra">Extra Session</option>
        </select>

        <input 
          type="text" 
          placeholder="Hall (optional) - e.g. C-301" 
          value={hall}
          onChange={(e) => setHall(e.target.value)}
        />

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
          <input 
            type="text" 
            placeholder="Group No." 
            value={group}
            onChange={(e) => setGroup(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="Section No." 
            value={section}
            onChange={(e) => setSection(e.target.value)}
          />
        </div>

        <div className="modal-buttons">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="save-btn" onClick={handleAdd}>Add to Schedule</button>
        </div>
      </div>
    </div>
  );
}