const task_input = document.querySelector("#task-input");
const add_btn = document.querySelector("#add-btn");
const task_list = document.querySelector("#task-list");
const load_ultra_btn = document.querySelector("#load-ultra-btn");
const clear_completed_btn = document.querySelector("#clear-completed-btn");
const pending_count = document.querySelector("#pending-count");
let tasks = [];

const ultraRoutineTemplate = [
  {
    id: Date.now() + 1,

    text: "Gym: Arnold Split Workout 🏋️‍♂️",

    completed: false,
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  },

  {
    id: Date.now() + 2,

    text: "Solve 1 Problem Solving Challenge 🧠",

    completed: false,
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  },

  {
    id: Date.now() + 3,

    text: "Read/Listen to English for 30 Mins 🗣️",

    completed: false,
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  },

  {
    id: Date.now() + 4,

    text: "Deep Work: Progress in React.js/Node.js 💻",

    completed: false,
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  },
];

function renderTasks() {
  task_list.innerHTML = "";

  const uncompletedTasks = tasks.filter((task) => !task.completed).length;
  if (pending_count) {
    pending_count.textContent = uncompletedTasks;
  }

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-item";
    li.innerHTML = `
    <label class="task-label">
        <input type="checkbox" class="task-checkbox" data-id="${task.id}" ${task.completed ? "checked" : ""}>
        <div class="task-content">
            <span class="task-text">${task.text}</span>
            
            <span class="added-time" style="font-size: 0.65rem; color: #888; display: block; margin-top: 4px;">🕒 Added: ${task.time || "Just now"}</span>
            
            ${task.completed && task.completedAt ? `<span class="completed-time" style="font-size: 0.65rem; color: #4ade80; display: block; margin-top: 2px;">✅ Done: ${task.completedAt}</span>` : ""}
        </div>
    </label>
    <button class="delete-btn" data-id="${task.id}">Delete</button>
    `;
    task_list.appendChild(li);
  });
}

// ==========================================
// Storage Functions
// ==========================================
function saveToStorage() {
  try {
    localStorage.setItem("ultra_tasks", JSON.stringify(tasks));
  } catch (e) {
    console.warn("Storage Full or Blocked", e);
  }
}

function loadFromStorage() {
  const storedTasks = localStorage.getItem("ultra_tasks");
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
  }
  renderTasks();
}

// ==========================================
// EventS
// ==========================================
add_btn.addEventListener("click", () => {
  let taskText = task_input.value.trim();
  if (taskText !== "") {
    const newTask = {
      id: Date.now(),
      text: taskText,
      completed: false,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    tasks.push(newTask);
    task_input.value = "";

    saveToStorage();
    renderTasks();
  }
});

task_input.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    add_btn.click();
  }
});

task_list.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-btn")) {
    const taskId = Number(event.target.getAttribute("data-id"));
    tasks = tasks.filter((task) => task.id !== taskId);
    saveToStorage();
    renderTasks();
  }

  if (event.target.classList.contains("task-checkbox")) {
    const taskId = Number(event.target.getAttribute("data-id"));

    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      if (task.completed) {
        task.completedAt = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } else {
        task.completedAt = null;
      }
      saveToStorage();
      renderTasks();
    }
  }
});

load_ultra_btn.addEventListener("click", () => {
  tasks = [...tasks, ...ultraRoutineTemplate];
  saveToStorage();
  renderTasks();
});

clear_completed_btn.addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.completed);
  saveToStorage();
  renderTasks();
});

loadFromStorage();
