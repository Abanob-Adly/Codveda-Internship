import React from "react";
import { Clock3 } from "lucide-react";

function StudyHoursInput({ studyHours, setStudyHours }) {
  return (
    <section className="card">
      <div className="section-head">
        <div className="section-icon">
          <Clock3 size={18} />
        </div>
        <div>
          <h2 className="section-title">Weekly Study Hours</h2>
          <p className="section-text">
            Choose how many hours you can realistically study this week.
          </p>
        </div>
      </div>

      <div className="hours-box">
        <div className="hours-number">{studyHours}h</div>
        <p className="hours-hint">Consistency beats pressure.</p>
      </div>

      <input
        type="range"
        min="1"
        max="60"
        value={studyHours}
        onChange={(e) => setStudyHours(Number(e.target.value))}
        className="range-input"
      />

      <label className="label">
        Custom value
        <input
          type="number"
          min="1"
          max="100"
          value={studyHours}
          onChange={(e) => setStudyHours(Number(e.target.value))}
          className="input"
          placeholder="Example: 20"
        />
      </label>
    </section>
  );
}

export default StudyHoursInput;
