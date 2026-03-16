import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";

import Header from "./components/Header";
import StatsRow from "./components/StatsRow";
import MotivationBanner from "./components/MotivationBanner";
import StudyHoursInput from "./components/StudyHoursInput";
import SubjectForm from "./components/SubjectForm";
import SubjectList from "./components/SubjectList";
import FocusCard from "./components/FocusCard";
import PlanResult from "./components/PlanResult";

import { generatePlan, getClosestExam } from "./utils/planner";

const STORAGE_KEYS = {
  STUDY_HOURS: "unibrain-study-hours",
  SUBJECTS: "unibrain-subjects",
};

function subjectsReducer(state, action) {
  switch (action.type) {
    case "ADD_SUBJECT":
      return [...state, action.payload];

    case "DELETE_SUBJECT":
      return state.filter((subject) => subject.id !== action.payload);

    case "CLEAR_SUBJECTS":
      return [];

    default:
      return state;
  }
}

function getInitialStudyHours() {
  const saved = localStorage.getItem(STORAGE_KEYS.STUDY_HOURS);
  if (!saved) return 20;

  const parsed = Number(saved);
  return Number.isNaN(parsed) ? 20 : parsed;
}

function getInitialSubjects() {
  const saved = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
  if (!saved) return [];

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function App() {
  const [studyHours, setStudyHours] = useState(getInitialStudyHours);
  const [subjects, dispatch] = useReducer(
    subjectsReducer,
    [],
    getInitialSubjects,
  );
  const [showPlan, setShowPlan] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [toast, setToast] = useState("");

  const plan = useMemo(
    () => generatePlan(subjects, studyHours),
    [subjects, studyHours],
  );
  const closestExam = useMemo(() => getClosestExam(subjects), [subjects]);
  const focusSubject = plan[0] || null;

  const motivationMode = useMemo(() => {
    if (showPlan && plan.length > 0) return "generated";
    if (subjects.length > 0) return "ready";
    return "empty";
  }, [showPlan, plan.length, subjects.length]);

  const showToast = useCallback((message) => {
    setToast(message);
  }, []);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast("");
    }, 2200);

    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDY_HOURS, String(studyHours));
  }, [studyHours]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
  }, [subjects]);

  const handleAddSubject = useCallback(
    (subject) => {
      dispatch({ type: "ADD_SUBJECT", payload: subject });
      setShowPlan(false);
      setGlobalError("");
      showToast(`${subject.name} added to your study mission.`);
    },
    [showToast],
  );

  const handleDeleteSubject = useCallback(
    (id) => {
      const target = subjects.find((subject) => subject.id === id);

      dispatch({ type: "DELETE_SUBJECT", payload: id });
      setShowPlan(false);

      if (target) {
        showToast(`${target.name} removed from your plan.`);
      }
    },
    [subjects, showToast],
  );

  const handleClearSubjects = useCallback(() => {
    dispatch({ type: "CLEAR_SUBJECTS" });
    setShowPlan(false);
    showToast("All subjects cleared.");
  }, [showToast]);

  const handleGeneratePlan = useCallback(() => {
    if (studyHours <= 0) {
      setGlobalError(
        "Please enter a number greater than 0 for weekly study hours.",
      );
      setShowPlan(false);
      return;
    }

    if (subjects.length === 0) {
      setGlobalError("Please add at least one subject.");
      setShowPlan(false);
      return;
    }

    setGlobalError("");
    setShowPlan(true);
    showToast("Your daily study plan is ready.");
  }, [studyHours, subjects, showToast]);

  const closestExamText = closestExam
    ? `${closestExam.name} in ${closestExam.daysLeft} day(s)`
    : "No exam yet";

  const focusText = focusSubject ? focusSubject.name : "Not calculated";

  return (
    <div className="app-shell">
      <div className="container">
        <Header />

        <StatsRow
          studyHours={studyHours}
          subjectsCount={subjects.length}
          closestExamText={closestExamText}
          focusText={focusText}
        />

        <MotivationBanner mode={motivationMode} />

        {globalError && <div className="alert">{globalError}</div>}

        <div className="layout">
          <div className="left-col">
            <StudyHoursInput
              studyHours={studyHours}
              setStudyHours={setStudyHours}
            />

            <SubjectForm onAddSubject={handleAddSubject} />
          </div>

          <div className="right-col">
            <SubjectList
              subjects={subjects}
              onDelete={handleDeleteSubject}
              onClearAll={handleClearSubjects}
            />

            <FocusCard focusSubject={focusSubject} />

            <PlanResult
              plan={plan}
              onGenerate={handleGeneratePlan}
              hasSubjects={subjects.length > 0}
              hasHours={studyHours > 0}
              isVisible={showPlan}
            />
          </div>
        </div>

        <div className={`toast ${toast ? "toast-show" : ""}`}>{toast}</div>
      </div>
    </div>
  );
}

export default App;
