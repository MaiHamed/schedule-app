import { useState } from 'react';

const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

export default function ScheduleGrid({ 
  currentEvents, setCurrentEvents, startDay, 
  currentSemester, setShowAddEvent, setSelectedCell 
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
        <h2 style={{ fontSize: '1.8rem', fontWeight: '600' }}>Timetable</h2>
        <p style={{ color: '#888' }}>Click any empty cell to add a class</p>
      </div>

      <table>
        <thead>
          <tr>
            <th className="time-col"></th>
            {displayedDays.map(day => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map(time => (
            <tr key={time}>
              <td className="time-col">{time}</td>
              {displayedDays.map(day => {
                const event = currentEvents.find(e => e.day === day && e.time === time);
                const course = event ? currentSemester.courses.find(c => c.id === event.courseId) : null;

                return (
                  <td 
                    key={day}
                    className="grid-cell"
                    onClick={() => handleCellClick(day, time)}
                    style={event && course ? { backgroundColor: course.color + '22' } : {}}
                  >
                    {event && course ? (
                      <div className="event" style={{ color: '#fff' }}>
                        <div style={{ fontWeight: 'bold' }}>{course.code}</div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.85 }}>{event.type}</div>
                        {event.hall && <div style={{ fontSize: '0.75rem', color: '#34d399' }}>📍 {event.hall}</div>}
                        {(event.group || event.section) && (
                          <div style={{ fontSize: '0.75rem' }}>
                            {event.group && `G${event.group}`} {event.section && `Sec ${event.section}`}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div style={{ color: '#555', fontSize: '1.6rem' }}>+</div>
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