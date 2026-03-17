import React, { useState } from "react";
import { PlusCircle, BookOpen, BarChart3, CalendarDays } from "lucide-react";

function SubjectForm({ onAddSubject }) {
  const [formData, setFormData] = useState({
    name: "",
    difficulty: 3,
    examDate: "",
  });
  const [error, setError] = useState("");

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedName = formData.name.trim();

    if (!trimmedName) {
      setError("Please enter a subject name.");
      return;
    }

    if (!formData.examDate) {
      setError("Please select an exam date.");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const exam = new Date(formData.examDate);
    exam.setHours(0, 0, 0, 0);

    if (exam < today) {
      setError("The exam date cannot be in the past.");
      return;
    }

    onAddSubject({
      id: crypto.randomUUID(),
      name: trimmedName,
      difficulty: Number(formData.difficulty),
      examDate: formData.examDate,
    });

    setFormData({
      name: "",
      difficulty: 3,
      examDate: "",
    });
    setError("");
  };

  return (
    <section className="card">
      <div className="section-head">
        <div className="section-icon">
          <PlusCircle size={18} />
        </div>
        <div>
          <h2 className="section-title">Add a Subject</h2>
          <p className="section-text">
            Add your subject, its difficulty, and the exam date.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form-grid">
        <label className="label">
          Subject Name
          <div className="input-wrap">
            <BookOpen size={16} className="input-icon" />
            <input
              type="text"
              className="input input-with-icon"
              placeholder="Example: Mathematics"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>
        </label>

        <label className="label">
          Difficulty (1-5)
          <div className="input-wrap">
            <BarChart3 size={16} className="input-icon" />
            <select
              className="input input-with-icon"
              value={formData.difficulty}
              onChange={(e) => handleChange("difficulty", e.target.value)}
            >
              <option value="1">1 - Very Easy</option>
              <option value="2">2 - Easy</option>
              <option value="3">3 - Medium</option>
              <option value="4">4 - Hard</option>
              <option value="5">5 - Very Hard</option>
            </select>
          </div>
        </label>

        <label className="label">
          Exam Date
          <div className="input-wrap">
            <CalendarDays size={16} className="input-icon" />
            <input
              type="date"
              className="input input-with-icon"
              value={formData.examDate}
              onChange={(e) => handleChange("examDate", e.target.value)}
            />
          </div>
        </label>

        <button type="submit" className="btn btn-primary btn-wide">
          <PlusCircle size={18} />
          <span>Add to My Plan</span>
        </button>
      </form>

      {error && <p className="error-text">{error}</p>}
    </section>
  );
}

export default SubjectForm;
