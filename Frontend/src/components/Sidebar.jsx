import { useState } from 'react';

export default function Sidebar({ 
  currentSemester, 
  setShowAddCourse,
  onEditCourse 
}) {

  const deleteCourse = (courseId) => {
    if (confirm("Delete this course and all its timings?")) {
      // You need to pass this function from App.jsx if you want to delete from sidebar
      // For now, we'll just alert (we'll improve it later)
      alert("Course deletion from sidebar coming soon. Use the edit panel for now.");
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>My Courses</h2>
        <button 
          onClick={() => setShowAddCourse(true)}
          className="add-course-btn"
        >
          + Add Course
        </button>
      </div>

      <div className="course-list">
        {currentSemester.courses.length === 0 ? (
          <div className="empty-message">
            No courses yet.<br />Click "+ Add Course" to begin
          </div>
        ) : (
          currentSemester.courses.map(course => (
            <div 
              key={course.id} 
              className="course-item"
              onClick={() => onEditCourse(course)}
            >
              <div 
                className="course-color" 
                style={{ backgroundColor: course.color }}
              />
              <div className="course-info">
                <div className="course-name">{course.name}</div>
                <div className="course-code">{course.code}</div>
              </div>
              <button 
                className="delete-course-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteCourse(course.id);
                }}
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>

      <div className="sidebar-footer">
        All data saved in browser
      </div>
    </div>
  );
}