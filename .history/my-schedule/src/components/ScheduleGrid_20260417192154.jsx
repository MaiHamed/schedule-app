import { useEffect, useState } from 'react';

const timeSlots = [
  "08:00", "09:00", "10:00", "11:00", "12:00", 
  "13:00", "14:00", "15:00", "16:00", "17:00"
];

export default function ScheduleGrid({ 
  currentEvents, setCurrentEvents, startDay, 
  currentSemester, setShowAddEvent, setSelectedCell 
}) {

  const weekDaysFull = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const displayedDays = weekDaysFull.slice(weekDaysFull.indexOf(startDay))
                             .concat(weekDaysFull.slice(0, weekDaysFull.indexOf(startDay)));

  const handleCellClick = (day, time) => {
    const existing = currentEvents.find(e => e.day === day && e.time === time);
    
    if (existing) {
      if (confirm(`Remove ${existing.type} at ${day} ${time}?`)) {
        setCurrentEvents(prev => prev.filter(e => !(e.day === day && e.time === time)));
      }
    } else {
      setSelectedCell({ day, time });
      setShowAddEvent(true);
    }
  };

  return (
    <div className="flex-1 bg-gray-900 rounded-3xl p-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-semibold">Timetable</h2>
        <div className="text-sm text-gray-400">Click any cell to add lecture/lab/tutorial</div>
      </div>

      <div id="schedule-grid" className="overflow-auto border border-gray-700 rounded-2xl bg-gray-950">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-4 bg-gray-800 border-b border-gray-700"></th>
              {displayedDays.map(day => (
                <th key={day} className="p-4 bg-gray-800 border-b border-gray-700 text-center font-medium">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((time, row) => (
              <tr key={time}>
                <td className="p-4 bg-gray-800 border-r border-gray-700 text-right font-medium w-20">
                  {time}
                </td>
                {displayedDays.map((day) => {
                  const event = currentEvents.find(e => e.day === day && e.time === time);
                  const course = event ? currentSemester.courses.find(c => c.id === event.courseId) : null;

                  return (
                    <td 
                      key={day}
                      onClick={() => handleCellClick(day, time)}
                      className="border border-gray-700 h-16 cursor-pointer hover:bg-gray-800 transition-colors relative"
                      style={event && course ? { backgroundColor: course.color + '33' } : {}}
                    >
                      {event && course ? (
                        <div className="p-2 text-center">
                          <div className="font-bold text-sm">{course.code}</div>
                          <div className="text-xs opacity-75">{event.type}</div>
                          {event.hall && <div className="text-[10px] text-emerald-400">📍 {event.hall}</div>}
                          {(event.group || event.section) && (
                            <div className="text-[10px]">
                              {event.group && `G${event.group}`} 
                              {event.section && ` Sec${event.section}`}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-600 hover:text-gray-400 text-2xl">+</div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}