import React from "react";
import { Sparkles, Target, Flame } from "lucide-react";

function MotivationBanner({ mode }) {
  const contentMap = {
    empty: {
      title: "Your plan starts here",
      text: "Start with one subject. Small steps build strong weeks.",
      icon: Sparkles,
    },
    ready: {
      title: "You are almost there",
      text: "Nice start. One click can turn your week into a smarter plan.",
      icon: Target,
    },
    generated: {
      title: "Your direction is clear",
      text: "Good job. Your study time is now organized in a practical daily way.",
      icon: Flame,
    },
  };

  const content = contentMap[mode];
  const Icon = content.icon;

  return (
    <section className="motivation-banner">
      <div className="motivation-icon">
        <Icon size={18} />
      </div>
      <div>
        <h3 className="motivation-title">{content.title}</h3>
        <p className="motivation-text">{content.text}</p>
      </div>
    </section>
  );
}

export default MotivationBanner;
