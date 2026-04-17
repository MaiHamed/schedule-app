import { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ScheduleGrid from './components/ScheduleGrid';
import AddCourseModal from './components/AddCourseModal';
import AddEventModal from './components/AddEventModal';
import DraftsModal from './components/DraftsModal';

interface Course {
  id: number;
  name: string;
  code: string;
  color: string;
}

interface Event {
  id: number;
  courseId: number;
  day: string;
  time: string;
  type: string;
  hall?: string;
  group?: string;
  section?: string;
}

interface Draft {
  id: number;
  name: string;
  events: Event[];
}

interface Semester {
  id: number;
  name: string;
  courses: Course[];
  drafts: Draft[];
}

export default function App() {
  const [semesters, setSemesters] = useState<Semester[]>(() => {
    const saved = localStorage.getItem('scheduleSemesters');
    return saved 
      ? JSON.parse(saved) 
      : [{
          id: 1,
          name: "Spring 2026",
          courses: [],
          drafts: [{ id: 1, name: "Main Draft", events: [] }]
        }];
  });

  const [currentSemesterId, setCurrentSemesterId] = useState(1);
  const [currentDraftId, setCurrentDraftId] = useState(1);
  const [currentEvents, setCurrentEvents] = useState<Event[]>([]);
  const [startDay, setStartDay] = useState<"Monday" | "Saturday" | "Sunday">("Monday");

  const [showAddCourse, setShowAddCourse] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showDrafts, setShowDrafts] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ day: string; time: string } | null>(null);

  const currentSemester = semesters.find(s => s.id === currentSemesterId) || semesters[0];

  // Auto-save to localStorage
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

  const loadDraft = (draftId: number) => {
    const semester = semesters.find(s => s.id === currentSemesterId);
    const draft = semester?.drafts.find(d => d.id === draftId);
    if (draft) {
      setCurrentDraftId(draftId);
      setCurrentEvents([...draft.events]);
    }
  };

  const newDraft = () => {
    const name = prompt("New draft name:", `Draft ${currentSemester.drafts.length + 1}`);
    if (!name) return;

    const newDraftObj: Draft = {
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

    const newSem: Semester = {
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
        deleteDraft={(id: number) => {
          setSemesters(prev => prev.map(sem => 
            sem.id === currentSemesterId 
              ? { ...sem, drafts: sem.drafts.filter(d => d.id !== id) }
              : sem
          ));
          // Load first draft if current was deleted
          const remainingDrafts = currentSemester.drafts.filter(d => d.id !== id);
          if (remainingDrafts.length > 0) {
            loadDraft(remainingDrafts[0].id);
          }
        }}
      />
    </div>
  );
}