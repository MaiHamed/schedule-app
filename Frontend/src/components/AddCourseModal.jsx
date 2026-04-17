import { useState } from 'react';

export default function AddCourseModal({ 
  isOpen, onClose, semesters, setSemesters, currentSemesterId 
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
      color
    };

    setSemesters(prev => prev.map(sem => 
      sem.id === currentSemesterId 
        ? { ...sem, courses: [...sem.courses, newCourse] }
        : sem
    ));

    setName(''); setCode(''); setColor('#3b82f6');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Add New Course</h3>
        
        <input 
          type="text"
          placeholder="Course Name (e.g. Data Structures)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        
        <input 
          type="text"
          placeholder="Course Code (e.g. CS301)"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'24px'}}>
          <span>Color:</span>
          <input 
            type="color" 
            value={color} 
            onChange={(e) => setColor(e.target.value)}
          />
        </div>

        <div className="modal-buttons">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="save-btn" onClick={handleAddCourse}>Add Course</button>
        </div>
      </div>
    </div>
  );
}