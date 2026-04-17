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
                  style={{ backgroundColor: course.color + '25', color: '#fff' }}
                >
                  <div style={{ fontWeight: '700' }}>{course.code}</div>
                  <div style={{ fontSize: '0.82rem', opacity: 0.9 }}>{event.type}</div>
                  {event.hall && <div style={{ fontSize: '0.78rem', marginTop: '4px' }}>📍 {event.hall}</div>}
                </div>
              ) : (
                <div className="plus">+</div>
              )}
            </td>
          );
        })}
      </tr>
    ))}
  </tbody>
</table>