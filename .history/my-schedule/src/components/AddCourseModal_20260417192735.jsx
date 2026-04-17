import { useEffect, useState } from 'react';

export default function AddCourseModal({ 
  isOpen, 
  onClose, 
  semesters, 
  setSemesters, 
  currentSemesterId 
}) {

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [color, setColor] = useState('#3b82f6');

  const handleAddCourse = () => {
    if (!name.trim()) {
      alert("Course name is required");
      return;
    }

    const newCourse = {
      id: Date.now(),
      name: name.trim(),
      code: (code.trim() || "COURSE").toUpperCase(),
      color: color
    };

    setSemesters(prev => prev.map(sem => 
      sem.id === currentSemesterId 
        ? { ...sem, courses: [...sem.courses, newCourse] }
        : sem
    ));

    // Reset form
    setName('');
    setCode('');
    setColor('#3b82f6');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-3xl p-8 w-96">
        <h3 className="text-2xl font-semibold mb-6">Add New Course</h3>
        
        <input 
          type="text"
          placeholder="Course Name (e.g. Data Structures)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 bg-gray-800 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-violet-500"
        />
        
        <input 
          type="text"
          placeholder="Course Code (e.g. CS301)"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full mb-6 bg-gray-800 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-violet-500"
        />

        <div className="flex items-center gap-4 mb-8">
          <span className="text-sm text-gray-400">Color:</span>
          <input 
            type="color" 
            value={color} 
            onChange={(e) => setColor(e.target.value)}
            className="w-12 h-10 bg-transparent border-0 p-0 cursor-pointer"
          />
        </div>

        <div className="flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 py-4 rounded-2xl border border-gray-700 hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleAddCourse}
            className="flex-1 py-4 bg-violet-600 hover:bg-violet-700 rounded-2xl font-medium"
          >
            Add Course
          </button>
        </div>
      </div>
    </div>
  );
}