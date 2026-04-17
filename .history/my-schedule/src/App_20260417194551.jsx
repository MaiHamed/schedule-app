// Add these states
const [editingCourse, setEditingCourse] = useState(null);
const [showEditPanel, setShowEditPanel] = useState(false);

// Function to open edit panel
const handleEditCourse = (course) => {
  setEditingCourse(course);
  setShowEditPanel(true);
};

// Function to save edited course
const handleSaveEditedCourse = (updatedCourse) => {
  setSemesters(prev => prev.map(sem => 
    sem.id === currentSemesterId 
      ? {
          ...sem,
          courses: sem.courses.map(c => c.id === updatedCourse.id ? updatedCourse : c)
        }
      : sem
  ));
};

// In your return, add the panel at the end:
<CourseEditPanel 
  course={editingCourse}
  isOpen={showEditPanel}
  onClose={() => setShowEditPanel(false)}
  onSaveCourse={handleSaveEditedCourse}
  currentEvents={currentEvents}
  setCurrentEvents={setCurrentEvents}
/>