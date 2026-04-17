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

  const handleCellClick = (day, time) => {
    const existing = currentEvents.find(e => e.day === day && e.time === time);
    
    if (existing) {
      if (confirm(`Remove this class?\n${existing.type} at ${day} ${time}`)) {
        setCurrentEvents(prev => prev.filter(e => !(e.day === day && e.time === time)));
      }
    } else {
      setSelectedCell({ day, time });
      setShowAddEvent(true);
    }
  };

  return (
    <div className="schedule-container">
      <div className="schedule-header">
        <h2>Timetable</h2>
        <p>Click any empty cell to add a class</p>
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
                        <div style={{ fontSize: '0.85rem', opacity: 0.9, marginTop: '2px' }}>
                          {event.type}
                        </div>
                        {event.hall && (
                          <div style={{ fontSize: '0.78rem', marginTop: '6px', color: '#34d399' }}>
                            📍 {event.hall}
                          </div>
                        )}
                        {(event.group || event.section) && (
                          <div style={{ fontSize: '0.78rem', marginTop: '2px' }}>
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
    </div>
  );
}