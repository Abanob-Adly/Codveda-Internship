import React from "react";
import { BookOpen } from "lucide-react";
import SubjectCard from "./SubjectCard";

function SubjectList({ subjects, onDelete, onClearAll }) {
  return (
    <section className="card">
      <div className="section-row">
        <div>
          <h2 className="section-title">Your Subjects</h2>
          <p className="section-text">
            Keep your subjects organized before building the final plan.
          </p>
        </div>

        {subjects.length > 0 && (
          <button className="btn btn-secondary" onClick={onClearAll}>
            Clear All
          </button>
        )}
      </div>

      {subjects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <BookOpen size={22} />
          </div>
          <h3 className="empty-title">Start with one subject</h3>
          <p className="empty-text">
            Add your first subject and let UniBrain organize the rest.
          </p>
        </div>
      ) : (
        <div className="subject-list">
          {subjects.map((subject, index) => (
            <div
              key={subject.id}
              className="reveal-item"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <SubjectCard subject={subject} onDelete={onDelete} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default SubjectList;
``;
