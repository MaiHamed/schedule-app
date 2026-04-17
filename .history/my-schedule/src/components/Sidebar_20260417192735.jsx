import { useEffect, useState } from 'react';


export default function Sidebar({ currentSemester, setShowAddCourse }) {
  return (
    <div className="w-72 bg-gray-900 rounded-3xl p-6 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Courses</h2>
        <button 
          onClick={() => setShowAddCourse(true)}
          className="bg-violet-600 hover:bg-violet-700 px-4 py-1.5 rounded-2xl text-sm font-medium flex items-center gap-1"
        >
          + Add Course
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-auto pr-2" id="courseList">
        {currentSemester.courses.length === 0 ? (
          <div className="text-gray-400 text-center py-12">
            No courses yet.<br />
            Click "+ Add Course" to get started
          </div>
        ) : (
          currentSemester.courses.map(course => (
            <div 
              key={course.id}
              className="flex items-center gap-3 bg-gray-800 rounded-2xl px-4 py-3 hover:bg-gray-700 transition-colors"
            >
              <div 
                className="w-6 h-6 rounded-xl flex-shrink-0" 
                style={{ backgroundColor: course.color }}
              />
              <div className="min-w-0 flex-1">
                <div className="font-medium truncate">{course.name}</div>
                <div className="text-xs text-gray-400">{course.code}</div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-auto pt-6 text-[10px] text-gray-500 text-center">
        All data saved in browser • Drafts supported
      </div>
    </div>
  );
}