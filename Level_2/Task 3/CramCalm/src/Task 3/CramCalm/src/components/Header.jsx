import React from "react";
import { Sparkles, Clock3, BookOpen, Target } from "lucide-react";

function Header() {
  return (
    <header className="hero">
      <div className="hero-badge">
        <Sparkles size={14} />
        <span>Smart Study Planner</span>
      </div>

      <h1 className="hero-title">Build momentum, not pressure.</h1>

      <p className="hero-subtitle">
        Organize your subjects, focus on what matters most, and make your week
        feel clearer and easier to follow.
      </p>

      <div className="hero-tags">
        <div className="hero-tag">
          <BookOpen size={14} />
          <span>Study smarter</span>
        </div>
        <div className="hero-tag">
          <Clock3 size={14} />
          <span>Use time better</span>
        </div>
        <div className="hero-tag">
          <Target size={14} />
          <span>Focus on priorities</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
