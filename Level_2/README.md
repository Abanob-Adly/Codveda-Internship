# 🚀 Ultra Tracker

A gamified, high-performance productivity system built entirely with **Vanilla JavaScript**.

This project was developed as a core task during my Web Development Internship at **Codveda Technologies**, aiming to solidify the fundamentals of DOM manipulation, Event Delegation, and State Management before transitioning into React.js.

## 🔗 Live Demo

[Insert Your Live Preview Link Here]

## ✨ Key Features

Unlike regular To-Do lists, Ultra Tracker is designed to build habits and provide psychological rewards:

- **⚡ 1-Click Ultra Routine:** Automatically populates daily essential habits (Gym, Deep Work, Problem Solving) with unique IDs.
- **🎉 Gamification (Dopamine Boost):** Integrates `canvas-confetti` to trigger a celebration effect when a task is marked as done.
- **⏱️ Precision Time-Tracking:** Automatically records and displays the exact time a task was added and completed.
- **💾 Persistent State:** Fully integrated with the browser's `LocalStorage` to ensure zero data loss upon refreshing.
- **📊 Real-time Counters:** Dynamically tracks and updates the number of pending tasks.
- **🧹 Smart Clearing:** One-click removal of all completed tasks to keep the workspace clean.

## 🛠️ Tech Stack

- **HTML5** (Semantic structuring)
- **CSS3** (Responsive UI & Custom styling)
- **Vanilla JavaScript** (ES6+, DOM Manipulation, Event Delegation)
- **Third-Party Libraries:** [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)

## 🧠 The Engineering Mindset

The primary goal of this project was to avoid frameworks and rely purely on Vanilla JS to master:

- **Event Delegation:** Attaching a single event listener to the parent list to handle dynamic elements efficiently ($O(1)$ memory usage).
- **Data-Driven UI:** Treating the JavaScript array as the single source of truth, where the DOM simply reflects the current state of the array.
- **Clean Code & Refactoring:** Organizing code into distinct rendering, storage, and event-handling functions.

## 💻 How to Run Locally

1. Clone the repository:
   ```bash
   git clone [https://github.com/your-username/ultra-tracker.git](https://github.com/your-username/ultra-tracker.git)
   ```
