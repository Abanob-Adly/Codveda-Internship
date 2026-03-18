import React from "react";
import { Flame, Target, Clock3, CalendarDays } from "lucide-react";
import {
  formatDate,
  formatTotalLoad,
  formatAverageLoad,
  getWindowLabel,
} from "../utils/planner";

function FocusCard({ focusSubject }) {
  if (!focusSubject) {
    return (
      <section className="card">
        <div className="focus-box">
          <div className="focus-badge">
            <Target size={14} />
            <span>Top Priority This Week</span>
          </div>

          <h3 className="focus-title">No focus subject yet</h3>
          <p className="focus-text">
            Build your plan first and Cramcalm will tell you what needs the most
            attention.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="card">
      <div className="focus-box">
        <div className="focus-badge">
          <Flame size={14} />
          <span>Top Priority This Week</span>
        </div>

        <h3 className="focus-title">{focusSubject.name}</h3>
        <p className="focus-text">
          This subject needs the strongest push right now based on difficulty
          and urgency.
        </p>

        <div className="chip-row">
          <div className="chip chip-accent">
            <Target size={14} />
            <span>{formatTotalLoad(focusSubject)}</span>
          </div>

          <div className="chip">
            <Clock3 size={14} />
            <span>{formatAverageLoad(focusSubject)}</span>
          </div>

          <div className="chip">
            <CalendarDays size={14} />
            <span>{formatDate(focusSubject.examDate)}</span>
          </div>
        </div>

        <p className="plan-meta">
          Study window: {getWindowLabel(focusSubject)}
        </p>
      </div>
    </section>
  );
}

export default FocusCard;
