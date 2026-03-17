import React from "react";
import {
  Trash2,
  BookOpen,
  BarChart3,
  CalendarDays,
  Clock3,
} from "lucide-react";
import { getDaysLeft, formatDate } from "../utils/planner";

function SubjectCard({ subject, onDelete }) {
  const daysLeft = getDaysLeft(subject.examDate);

  return (
    <article className="subject-card">
      <div className="subject-top">
        <div className="subject-name-wrap">
          <div className="subject-symbol">
            <BookOpen size={16} />
          </div>
          <h3 className="subject-name">{subject.name}</h3>
        </div>

        <button
          className="icon-btn"
          onClick={() => onDelete(subject.id)}
          aria-label={`Delete ${subject.name}`}
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="chip-row">
        <div className="chip">
          <BarChart3 size={14} />
          <span>Difficulty {subject.difficulty}/5</span>
        </div>

        <div className="chip">
          <CalendarDays size={14} />
          <span>{formatDate(subject.examDate)}</span>
        </div>

        <div className="chip chip-accent">
          <Clock3 size={14} />
          <span>{daysLeft} day(s) left</span>
        </div>
      </div>
    </article>
  );
}

export default SubjectCard;
``;
