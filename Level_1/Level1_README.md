# Level 1 Submission: Apex Auto

## 🎯 Overview

To fulfill the requirements for Level 1 of the Codveda Internship, I chose to combine **Task 1 (Simple Static Website)** and **Task 3 (Introduction to JavaScript)** into a single, cohesive, real-world application: **Apex Auto**, a premium car maintenance booking system.

Combining these tasks allowed me to build a practical product rather than isolated, generic code snippets.

## ✅ Tasks Completed

### Task 1: UI & Structure (HTML/CSS)

- Developed a single-page landing layout.
- Utilized **Semantic HTML** (`<dialog>`, `<main>`, `<section>`) for Accessibility (a11y).
- Implemented a **Mobile-First** responsive design using CSS Grid and Flexbox.

### Task 3: Interactive Logic (JavaScript)

Instead of writing basic DOM manipulation, I engineered the interaction using standard technical interview patterns to ensure high performance and data integrity:

1. **State Management (Closures):** Created a "Smart Modal" that tracks if a user has typed data (`isFormDirty`). If they accidentally close the modal, it warns them, preventing data loss.
2. **Event Delegation:** Optimized memory usage ($O(1)$) by attaching a single event listener to the dropdown parent instead of multiple listeners for each list item.
3. **Performance Optimization (Debouncing):** Built a custom `debounce` function for the email input. It waits 500ms after the user stops typing before validating, significantly reducing CPU load.