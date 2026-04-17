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
    return saved ? JSON.parse(saved) : [{
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
    const draft = currentSemester.drafts.find(d => d.id === draftId);
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
    const