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

    // Check overlap (simple version)
    const hasConflict = currentEvents.some(e => 
      e.day === newEvent.day && e.time === newEvent.time
    );

    if (hasConflict) {
      alert("Time slot already occupied!");
      return;
    }

    setCurrentEvents(prev => [...prev, newEvent]);
    onClose();
    
    // Reset form
    setCourseId('');
    setHall('');
    setGroup('');
    setSection('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-3xl p-8 w-96">
        <h3 className="text-2xl mb-6">Add Class at {selectedCell?.time}</h3>
        
        <select 
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          className="w-full mb-4 bg-gray-800 rounded-2xl px-5 py-4 outline-none"
        >
          <option value="">Select Course</option>
          {currentSemester.courses.map(course => (
            <option key={course.id} value={course.id}>
              {course.code} - {course.name}
            </option>
          ))}
        </select>

        <select 
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full mb-6 bg-gray-800 rounded-2xl px-5 py-4 outline-none"
        >
          <option value="Lecture">Lecture</option>
          <option value="Lab">Lab</option>
          <option value="Tutorial">Tutorial</option>
          <option value="Extra">Extra Session</option>
        </select>

        <div className="space-y-4 mb-8">
          <input 
            type="text" 
            placeholder="Hall (optional) - e.g. C-301" 
            value={hall}
            onChange={(e) => setHall(e.target.value)}
            className="w-full bg-gray-800 rounded-2xl px-5 py-4 outline-none"
          />
          <div className="grid grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="Group No." 
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              className="bg-gray-800 rounded-2xl px-5 py-4 outline-none"
            />
            <input 
              type="text" 
              placeholder="Section No." 
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="bg-gray-800 rounded-2xl px-5 py-4 outline-none"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 py-4 rounded-2xl border border-gray-700"
          >
            Cancel
          </button>
          <button 
            onClick={handleAdd}
            className="flex-1 py-4 bg-emerald-600 rounded-2xl font-medium"
          >
            Add to Schedule
          </button>
        </div>
      </div>
    </div>
  );
}