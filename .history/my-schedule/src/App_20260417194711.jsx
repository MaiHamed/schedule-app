import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ScheduleGrid from './components/ScheduleGrid';
import Header from './components/Header';
import AddCourseModal from './components/AddCourseModal';
import AddEventModal from './components/AddEventModal';
import DraftsModal from './components/DraftsModal';

export default function App() {
  const [semesters, setSemesters] = useState(() => {
    try {
      const saved = localStorage.getItem('scheduleSemesters');
      return saved ? JSON.parse(saved) : [{
        id: 1,
        name: "Spring 2026",
        courses: [],
        drafts: [{ id: 1, name: "Main Draft", events: [] }]
      }];
    } catch (e) {
      return [{
        id: 1,
        name: "Spring 2026",
        courses: [],
        drafts: [{ id: 1, name: "Main Draft", events: [] }]
      }];
    }
  });

  const [currentSemesterId, setCurrentSemesterId] = useState(1);
  const [currentDraftId, setCurrentDraftId] = useState(1);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [startDay, setStartDay] = useState("Monday");

  const [showAddCourse, setShowAddCourse] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showDrafts, setShowDrafts] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [showEditPanel, setShowEditPanel] = useState(false);

  const currentSemester = semesters.find(s => s.id === currentSemesterId) || semesters[0];

  useEffect(() => {
    localStorage.setItem('scheduleSemesters', JSON.stringify(semesters));
  }, [semesters]);

  const saveDraft = () => {
    setSemesters(prev => prev.map(sem =>
      sem.id === currentSemesterId
        ? {
          ...sem,
          drafts: sem.drafts.map(draft =>
            draft.id === currentDraftId
              ? { ...draft, events: [...currentEvents] }
              : draft
          )
        }
        : sem
    ));
    alert("✅ Draft saved successfully!");
  };

  const loadDraft = (draftId) => {
    const draft = currentSemester.drafts.find(d => d.id === draftId);
    if (draft) {
      setCurrentDraftId(draftId);
      setCurrentEvents([...draft.events]);
    }
  };

  const newDraft = () => {
    const name = prompt("New draft name:", `Draft ${currentSemester.drafts.length + 1}`);
    if (!name) return;

    const newDraftObj = { id: Date.now(), name, events: [] };

    setSemesters(prev => prev.map(sem =>
      sem.id === currentSemesterId
        ? { ...sem, drafts: [...sem.drafts, newDraftObj] }
        : sem
    ));

    setCurrentDraftId(newDraftObj.id);
    setCurrentEvents([]);
  };

  const addSemester = () => {
    const name = prompt("Semester name (e.g. Fall 2026)", "Fall 2026");
    if (!name) return;

    const newSem = {
      id: Date.now(),
      name,
      courses: [],
      drafts: [{ id: Date.now(), name: "Main Draft", events: [] }]
    };

    setSemesters(prev => [...prev, newSem]);
    setCurrentSemesterId(newSem.id);
    setCurrentDraftId(newSem.drafts[0].id);
    setCurrentEvents([]);
  };

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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="app-container">
        <Header
          semesters={semesters}
          currentSemesterId={currentSemesterId}
          setCurrentSemesterId={setCurrentSemesterId}
          startDay={startDay}
          setStartDay={setStartDay}
          addSemester={addSemester}
          currentSemester={currentSemester}
          saveDraft={saveDraft}
          newDraft={newDraft}
          setShowDrafts={setShowDrafts}
        />

        <div className="main-layout">
          <Sidebar
            currentSemester={currentSemester}
            setShowAddCourse={setShowAddCourse}
            onEditCourse={handleEditCourse}
          />

          <ScheduleGrid
            currentEvents={currentEvents}
            setCurrentEvents={setCurrentEvents}
            startDay={startDay}
            currentSemester={currentSemester}
            setShowAddEvent={setShowAddEvent}
            setSelectedCell={setSelectedCell}
          />
        </div>
      </div>

      <AddCourseModal
        isOpen={showAddCourse}
        onClose={() => setShowAddCourse(false)}
        semesters={semesters}
        setSemesters={setSemesters}
        currentSemesterId={currentSemesterId}
      />

      <AddEventModal
        isOpen={showAddEvent}
        onClose={() => setShowAddEvent(false)}
        selectedCell={selectedCell}
        currentSemester={currentSemester}
        currentEvents={currentEvents}
        setCurrentEvents={setCurrentEvents}
      />

      <DraftsModal
        isOpen={showDrafts}
        onClose={() => setShowDrafts(false)}
        currentSemester={currentSemester}
        currentDraftId={currentDraftId}
        loadDraft={loadDraft}
        deleteDraft={(id) => {
          setSemesters(prev => prev.map(sem =>
            sem.id === currentSemesterId
              ? { ...sem, drafts: sem.drafts.filter(d => d.id !== id) }
              : sem
          ));
          const remaining = semesters.find(s => s.id === currentSemesterId)?.drafts || [];
          if (currentDraftId === id && remaining.length > 0) {
            loadDraft(remaining[0].id);
          }
        }}

      />

      <CourseEditPanel
        course={editingCourse}
        isOpen={showEditPanel}
        onClose={() => setShowEditPanel(false)}
        onSaveCourse={handleSaveEditedCourse}
        currentEvents={currentEvents}
        setCurrentEvents={setCurrentEvents}
      />
    </div>
  );
}