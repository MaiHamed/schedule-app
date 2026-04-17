import { useState } from 'react';

const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

export default function ScheduleGrid({ 
  currentEvents, 
  setCurrentEvents, 
  startDay, 
  currentSemester, 
  setShowAddEvent, 
  setSelectedCell 
}) {

  const weekDaysFull = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const startIndex = weekDaysFull.indexOf(startDay);
  const displayedDays = [
    ...weekDaysFull.slice(startIndex),
    ...weekDaysFull.slice(0, startIndex)
  ];

  const [editingEvent, setEditingEvent] = useState(null);   // New: for edit panel

  const handleCellClick = (day, time) => {
    const existing = currentEvents.find(e => e.day === day && e.time === time);
    
    if (existing) {
      setEditingEvent(existing);        // Open edit panel
    } else {
      setSelectedCell({ day, time });
      setShowAddEvent(true);
    }
  };

  const deleteEvent = (id) => {
    if (confirm("Delete this class?")) {
      setCurrentEvents(prev => prev.filter(e => e.id !== id));
      setEditingEvent(null);
    }
  };

  return (
    <div className="schedule-container">
      <div className="schedule-header">
        <h2>Timetable</h2>
        <p>Click empty cell to add • Click event to edit</p>
      </div>

      <table className="schedule-table">
        <thead>
          <tr>
            <th className="time-cell"></th>
            {displayedDays.map(day => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map(time => (
            <tr key={time}>
              <td className="time-cell">{time}</td>
              {displayedDays.map(day => {
                const event = currentEvents.find(e => e.day === day && e.time === time);
                const course = event ? currentSemester.courses.find(c => c.id === event.courseId) : null;

                return (
                  <td 
                    key={day}
                    className="grid-cell"
                    onClick={() => handleCellClick(day, time)}
                    style={event && course ? { backgroundColor: course.color + '30' } : {}}
                  >
                    {event && course ? (
                      <div 
                        className="event-box" 
                        style={{ 
                          backgroundColor: course.color + '25',
                          color: '#ffffff'
                        }}
                      >
                        <div style={{ fontWeight: '700', fontSize: '1.05rem' }}>{course.code}</div>
                        <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>{event.type}</div>
                        {event.hall && <div style={{ fontSize: '0.78rem', marginTop: '4px' }}>📍 {event.hall}</div>}
                        {(event.group || event.section) && (
                          <div style={{ fontSize: '0.78rem' }}>
                            {event.group && `G${event.group}`} 
                            {event.section && ` • Sec ${event.section}`}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="empty-cell"></div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Panel */}
      {editingEvent && (
        <EditPanel 
          event={editingEvent}
          course={currentSemester.courses.find(c => c.id === editingEvent.courseId)}
          onClose={() => setEditingEvent(null)}
          onDelete={deleteEvent}
          currentEvents={currentEvents}
          setCurrentEvents={setCurrentEvents}
        />
      )}
    </div>
  );
}

// Simple Edit Panel Component (inside same file for now)
function EditPanel({ event, course, onClose, onDelete, currentEvents, setCurrentEvents }) {
  const [type, setType] = useState(event.type);
  const [hall, setHall] = useState(event.hall || '');
  const [group, setGroup] = useState(event.group || '');
  const [section, setSection] = useState(event.section || '');

  const saveChanges = () => {
    setCurrentEvents(prev => prev.map(e => 
      e.id === event.id 
        ? { ...e, type, hall: hall || null, group: group || null, section: section || null }
        : e
    ));
    onClose();
  };

  return (
    <div className="edit-panel open">
      <div className="edit-panel-header">
        <h2>Edit Class</h2>
        <button onClick={onClose} style={{fontSize: '1.8rem', color: '#888'}}>✕</button>
      </div>

      <div style={{marginBottom: '20px'}}>
        <strong>Course:</strong> {course?.code} - {course?.name}
      </div>

      <div style={{marginBottom: '20px'}}>
        <strong>Day:</strong> {event.day} <br />
        <strong>Time:</strong> {event.time}
      </div>

      <label style={{display: 'block', margin: '15px 0 8px', color: '#aaa'}}>Type</label>
      <select 
        value={type} 
        onChange={(e) => setType(e.target.value)}
        style={{width: '100%', padding: '12px', background: '#1f1f1f', borderRadius: '12px', color: 'white'}}
      >
        <option value="Lecture">Lecture</option>
        <option value="Lab">Lab</option>
        <option value="Tutorial">Tutorial</option>
        <option value="Extra">Extra Session</option>
      </select>

      <label style={{display: 'block', margin: '20px 0 8px', color: '#aaa'}}>Hall (optional)</label>
      <input 
        type="text" 
        value={hall}
        onChange={(e) => setHall(e.target.value)}
        placeholder="C-301"
        style={{width: '100%', padding: '12px', background: '#1f1f1f', borderRadius: '12px', color: 'white'}}
      />

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '20px'}}>
        <div>
          <label style={{display: 'block', marginBottom: '8px', color: '#aaa'}}>Group No.</label>
          <input 
            type="text" 
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            placeholder="1"
            style={{width: '100%', padding: '12px', background: '#1f1f1f', borderRadius: '12px', color: 'white'}}
          />
        </div>
        <div>
          <label style={{display: 'block', marginBottom: '8px', color: '#aaa'}}>Section No.</label>
          <input 
            type="text" 
            value={section}
            onChange={(e) => setSection(e.target.value)}
            placeholder="2"
            style={{width: '100%', padding: '12px', background: '#1f1f1f', borderRadius: '12px', color: 'white'}}
          />
        </div>
      </div>

      <div style={{marginTop: '30px', display: 'flex', gap: '12px'}}>
        <button 
          onClick={() => onDelete(event.id)}
          style={{flex: 1, padding: '14px', background: '#7f1d1d', color: 'white', borderRadius: '12px'}}
        >
          Delete Class
        </button>
        <button 
          onClick={saveChanges}
          style={{flex: 1, padding: '14px', background: '#10b981', color: 'white', borderRadius: '12px'}}
        >
          Save Changes
        </button>
      </div>

      <p style={{marginTop: '30px', fontSize: '0.85rem', color: '#666', textAlign: 'center'}}>
        Note: Multiple timings support coming soon
      </p>
    </div>
  );
}