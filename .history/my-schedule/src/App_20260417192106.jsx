import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ScheduleGrid from './components/ScheduleGrid';
import Header from './components/Header';
import AddCourseModal from './components/AddCourseModal';
import AddEventModal from './components/AddEventModal';
import DraftsModal from './components/DraftsModal';

export default function App() {
  const [semesters, setSemesters] = useState(() => {
    const saved = localStorage.getItem('scheduleSemesters');
    return saved ? JSON.parse(saved) : [{
      id: 1,
      name: "Spring 2026",
      courses: [],
      drafts: [{ id: 1, name: "Main Draft", events: [] }]
    }];
  });

  const [currentSemesterId, setCurrentSemesterId] = useState(1);
  const [currentDraftId, setCurrentDraftId] = useState(1);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [startDay, setStartDay] = useState("Monday");

  const [showAddCourse, setShowAddCourse] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showDrafts, setShowDrafts] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);

  const currentSemester = semesters.find(s => s.id === currentSemesterId) || semesters[0];

  // Save to localStorage
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

    const newDraftObj = {
      id: Date.now(),
      name,
      events: []
    };

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

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto p-6">
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

        <div className="flex gap-6 mt-8">
          <Sidebar 
            currentSemester={currentSemester}
            setShowAddCourse={setShowAddCourse}
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
          if (currentDraftId === id && currentSemester.drafts.length > 1) {
            loadDraft(currentSemester.drafts[0].id);
          }
        }}
      />
    </div>
  );
}