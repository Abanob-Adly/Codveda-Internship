import React from "react";
import { Sparkles, Target, Flame, CalendarDays } from "lucide-react";
import {
  formatDailyLoad,
  getWindowLabel,
  getDailySchedule,
  formatHours,
} from "../utils/planner";

function PlanResult({ plan, onGenerate, hasSubjects, hasHours, isVisible }) {
  const visiblePlan = plan.filter((item) => item.allocatedHours > 0);
  const totalHours = visiblePlan.reduce(
    (sum, item) => sum + item.allocatedHours,
    0,
  );

  const dailySchedule = getDailySchedule(visiblePlan);

  const getLabel = (index) => {
    if (index === 0) return "Main Focus";
    if (index === 1) return "Strong Push";
    return "Light Review";
  };

  return (
    <section className="card">
      <div className="section-row">
        <div>
          <h2 className="section-title">Your Daily Study Plan</h2>
          <p className="section-text">
            Build a practical daily plan based on urgency, difficulty, and real
            time before each exam.
          </p>
        </div>

        <button className="btn btn-primary" onClick={onGenerate}>
          <Sparkles size={16} />
          <span>Build My Plan</span>
        </button>
      </div>

      {!isVisible && (
        <div className="empty-state">
          <div className="empty-icon">
            <Target size={22} />
          </div>
          <h3 className="empty-title">
            {hasSubjects && hasHours
              ? "You are one click away"
              : "Set your inputs first"}
          </h3>
          <p className="empty-text">
            {hasSubjects && hasHours
              ? "Your time can be organized in a smarter daily way right now."
              : "Enter weekly hours and add at least one subject to begin."}
          </p>
        </div>
      )}

      {isVisible && visiblePlan.length > 0 && (
        <>
          <div className="result-banner">
            <div className="result-icon">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="result-title">Your daily plan is ready</h3>
              <p className="result-text">
                The app now shows how much to study per day for each subject and
                also gives you a realistic day-by-day schedule.
              </p>
            </div>
          </div>

          {/* Subject summary */}
          <div className="plan-list">
            {visiblePlan.map((item, index) => {
              const percentage =
                totalHours > 0
                  ? Math.round((item.allocatedHours / totalHours) * 100)
                  : 0;

              return (
                <article
                  key={item.id}
                  className="plan-card reveal-item"
                  style={{ animationDelay: `${index * 110}ms` }}
                >
                  <div className="plan-top">
                    <div>
                      <div className="plan-label">
                        <Flame size={14} />
                        <span>{getLabel(index)}</span>
                      </div>

                      <h3 className="plan-title">{item.name}</h3>
                      <p className="plan-meta">
                        Difficulty: {item.difficulty}/5 • Exam in{" "}
                        {item.daysLeft} day(s)
                      </p>
                    </div>

                    <div className="hours-badge">{formatDailyLoad(item)}</div>
                  </div>

                  <div className="progress">
                    <div
                      className="progress-bar"
                      style={{ "--target-width": `${percentage}%` }}
                    />
                  </div>

                  <p className="plan-meta">
                    Study window: {getWindowLabel(item)}
                  </p>
                </article>
              );
            })}
          </div>

          {/* Daily schedule */}
          <div className="schedule-section">
            <div className="schedule-header">
              <div className="schedule-header__icon">
                <CalendarDays size={18} />
              </div>
              <div>
                <h3 className="schedule-title">Day-by-Day Schedule</h3>
                <p className="schedule-text">
                  This is the actual daily distribution of your study hours.
                </p>
              </div>
            </div>

            <div className="schedule-grid">
              {dailySchedule.map((day) => (
                <article key={day.day} className="day-card">
                  <div className="day-card__top">
                    <h4 className="day-card__title">Day {day.day}</h4>
                    <div className="day-card__total">
                      {formatHours(day.totalHours)}
                    </div>
                  </div>

                  <div className="day-card__tasks">
                    {day.tasks.map((task) => (
                      <div key={task.subject} className="day-task">
                        <span className="day-task__name">{task.subject}</span>
                        <span className="day-task__hours">
                          {formatHours(task.hours)}
                        </span>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default PlanResult;
