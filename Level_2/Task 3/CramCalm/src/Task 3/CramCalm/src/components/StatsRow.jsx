import React from "react";
import { Clock3, BookOpen, Target, CalendarDays } from "lucide-react";

function StatsRow({ studyHours, subjectsCount, closestExamText, focusText }) {
  const stats = [
    {
      title: "Weekly Hours",
      value: `${studyHours}h`,
      icon: Clock3,
    },
    {
      title: "Subjects Added",
      value: subjectsCount,
      icon: BookOpen,
    },
    {
      title: "Closest Exam",
      value: closestExamText,
      icon: CalendarDays,
    },
    {
      title: "Main Focus",
      value: focusText,
      icon: Target,
    },
  ];

  return (
    <section className="stats-grid">
      {stats.map((item, index) => {
        const Icon = item.icon;

        return (
          <article
            key={item.title}
            className="stat-card reveal-item"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="stat-icon">
              <Icon size={18} />
            </div>
            <div>
              <p className="stat-label">{item.title}</p>
              <h3 className="stat-value">{item.value}</h3>
            </div>
          </article>
        );
      })}
    </section>
  );
}

export default StatsRow;
