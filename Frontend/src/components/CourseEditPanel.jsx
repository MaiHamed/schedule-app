import { useState, useEffect } from 'react';

export default function CourseEditPanel({ 
  course, 
  isOpen, 
  onClose, 
  onSaveCourse,
  currentEvents,
  setCurrentEvents 
}) {

  const [editedCourse, setEditedCourse] = useState(null);
  const [newTiming, setNewTiming] = useState({
    day: "Monday",
    startTime: "08:30",
    endTime: "09:50",
    type: "Lecture",
    hall: "",
    group: "",
    section: ""
  });

  // Reset form when course changes
  useEffect(() => {
    if (course) {
      setEditedCourse({ ...course });
    }
  }, [course]);

  const handleSaveCourse = () => {
    if (editedCourse) {
      onSaveCourse(editedCourse);
    }
    onClose();
  };

  const addTiming = () => {
    if (!editedCourse || !newTiming.startTime || !newTiming.endTime) return;

    const timingEvent = {
      id: Date.now(),
      courseId: editedCourse.id,
      day: newTiming.day,
      startTime: newTiming.startTime,
      endTime: newTiming.endTime,
      type: newTiming.type,
      hall: newTiming.hall || null,
      group: newTiming.group || null,
      section: newTiming.section || null
    };

    setCurrentEvents(prev => [...prev, timingEvent]);
    alert("✅ Timing added successfully!");
  };

  const deleteTiming = (eventId) => {
    if (confirm("Delete this timing?")) {
      setCurrentEvents(prev => prev.filter(e => e.id !== eventId));
    }
  };

  if (!isOpen || !course || !editedCourse) return null;

  return (
    <div className={`edit-panel ${isOpen ? 'open' : ''}`}>
      <div className="edit-panel-header">
        <h2>Edit Course</h2>
        <span className="close-panel" onClick={onClose}>✕</span>
      </div>

      <div className="panel-form">
        <label>Course Name</label>
        <input 
          type="text" 
          value={editedCourse.name}
          onChange={(e) => setEditedCourse({...editedCourse, name: e.target.value})}
        />

        <label>Course Code</label>
        <input 
          type="text" 
          value={editedCourse.code}
          onChange={(e) => setEditedCourse({...editedCourse, code: e.target.value.toUpperCase()})}
        />

        <label>Color</label>
        <input 
          type="color" 
          value={editedCourse.color}
          onChange={(e) => setEditedCourse({...editedCourse, color: e.target.value})}
        />
      </div>

      <button onClick={handleSaveCourse} className="save-btn" style={{width: '100%', margin: '20px 0'}}>
        Save Course Changes
      </button>

      {/* Add Timing Section */}
      <div style={{marginTop: '40px'}}>
        <h3>Add New Timing</h3>
        
        <div className="panel-form">
          <label>Day</label>
          <select 
            value={newTiming.day}
            onChange={(e) => setNewTiming({...newTiming, day: e.target.value})}
          >
            {["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"].map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <label>Start Time</label>
          <input 
            type="time" 
            value={newTiming.startTime}
            onChange={(e) => setNewTiming({...newTiming, startTime: e.target.value})}
          />

          <label>End Time</label>
          <input 
            type="time" 
            value={newTiming.endTime}
            onChange={(e) => setNewTiming({...newTiming, endTime: e.target.value})}
          />

          <label>Type</label>
          <select 
            value={newTiming.type}
            onChange={(e) => setNewTiming({...newTiming, type: e.target.value})}
          >
            <option value="Lecture">Lecture</option>
            <option value="Lab">Lab</option>
            <option value="Tutorial">Tutorial</option>
            <option value="Extra">Extra</option>
          </select>

          <label>Hall (optional)</label>
          <input 
            type="text" 
            placeholder="C-301"
            value={newTiming.hall}
            onChange={(e) => setNewTiming({...newTiming, hall: e.target.value})}
          />

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
            <div>
              <label>Group</label>
              <input 
                type="text" 
                placeholder="1"
                value={newTiming.group}
                onChange={(e) => setNewTiming({...newTiming, group: e.target.value})}
              />
            </div>
            <div>
              <label>Section</label>
              <input 
                type="text" 
                placeholder="2"
                value={newTiming.section}
                onChange={(e) => setNewTiming({...newTiming, section: e.target.value})}
              />
            </div>
          </div>
        </div>

        <button onClick={addTiming} className="add-timing-btn">
          + Add Timing to Schedule
        </button>
      </div>

      {/* Current Timings */}
      <div className="timings-list">
        <h3>Current Timings</h3>
        {currentEvents.filter(e => e.courseId === course.id).length === 0 ? (
          <p style={{color: '#666', textAlign: 'center', padding: '30px 0'}}>
            No timings added yet
          </p>
        ) : (
          currentEvents
            .filter(e => e.courseId === course.id)
            .map(event => (
              <div key={event.id} className="timing-item">
                <strong>{event.day} • {event.startTime} - {event.endTime || event.time}</strong><br />
                <span>{event.type}</span>
                {event.hall && <span> | 📍 {event.hall}</span>}
                <button onClick={() => deleteTiming(event.id)}>
                  Delete Timing
                </button>
              </div>
            ))
        )}
      </div>
    </div>
  );
}