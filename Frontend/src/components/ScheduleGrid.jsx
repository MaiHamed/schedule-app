import { useState } from 'react';

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

  // Generate time slots from 8:00 AM to 8:00 PM in 30-minute increments
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        let displayTime = time24;

        if (hour > 12) {
          displayTime = `${hour - 12}:${minute.toString().padStart(2, '0')} PM`;
        } else if (hour === 12) {
          displayTime = `12:${minute.toString().padStart(2, '0')} PM`;
        } else {
          displayTime = `${hour}:${minute.toString().padStart(2, '0')} AM`;
        }
        
        slots.push({ time24, displayTime });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleCellClick = (day, time24) => {
    const existing = currentEvents.find(e => e.day === day && e.startTime === time24);
    
    if (existing) {
      if (confirm(`Remove this class?\n${existing.type} at ${day} ${existing.startTime}`)) {
        setCurrentEvents(prev => prev.filter(e => !(e.day === day && e.startTime === time24)));
      }
    } else {
      setSelectedCell({ day, time: time24 });
      setShowAddEvent(true);
    }
  };

  return (
    <div className="schedule-container">
      <div className="schedule-header">
        <h2>Timetable</h2>
        <p>Click any empty cell to add a class (supports different durations)</p>
      </div>

      <table className="schedule-table">
        <thead>
          <tr>
            <th className="time-cell">Time</th>
            {displayedDays.map(day => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map(({ time24, displayTime }) => (
            <tr key={time24}>
              <td className="time-cell">{displayTime}</td>
              {displayedDays.map(day => {
                const event = currentEvents.find(e => e.day === day && e.startTime === time24);
                const course = event ? currentSemester.courses.find(c => c.id === event.courseId) : null;

                return (
                  <td 
                    key={day}
                    className="grid-cell"
                    onClick={() => handleCellClick(day, time24)}
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
                        <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>
                          {event.startTime} - {event.endTime || '??'}
                        </div>
                        {event.hall && (
                          <div style={{ fontSize: '0.78rem', marginTop: '4px', color: '#34d399' }}>
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