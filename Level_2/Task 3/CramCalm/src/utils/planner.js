const DAY_MS = 1000 * 60 * 60 * 24;

const HORIZON_DAYS = 7;
const DEFAULT_MAX_HOURS_PER_DAY = 6;
const DEFAULT_CHUNK_HOURS = 0.5;
const DEFAULT_MAX_SUBJECT_HOURS_PER_DAY = 3;

// -------------------------------
// Basic helpers
// -------------------------------
export function getDaysLeft(examDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const exam = new Date(examDate);
  exam.setHours(0, 0, 0, 0);

  const diff = Math.ceil((exam - today) / DAY_MS);
  return diff <= 0 ? 1 : diff;
}

export function formatDate(examDate) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
  }).format(new Date(examDate));
}

export function getClosestExam(subjects) {
  if (!subjects.length) return null;

  return [...subjects]
    .map((subject) => ({
      ...subject,
      daysLeft: getDaysLeft(subject.examDate),
    }))
    .sort((a, b) => a.daysLeft - b.daysLeft)[0];
}

// -------------------------------
// Formatting helpers
// -------------------------------
export function formatHours(hours) {
  if (hours >= 1) {
    const whole = Math.floor(hours);
    const minutes = Math.round((hours - whole) * 60);

    if (minutes === 0) return `${whole}h`;
    return `${whole}h ${minutes}m`;
  }

  return `${Math.round(hours * 60)}m`;
}

export function formatDailyLoad(item) {
  if (!item) return "0h/day";

  if (item.dailyHours >= 1) {
    const whole = Math.floor(item.dailyHours);
    const minutes = Math.round((item.dailyHours - whole) * 60);

    if (minutes === 0) return `${whole}h/day`;
    return `${whole}h ${minutes}m/day`;
  }

  return `${item.dailyMinutes} min/day`;
}

export function formatTotalLoad(item) {
  if (!item) return "0h total";
  return `${formatHours(item.allocatedHours)} total`;
}

export function formatAverageLoad(item) {
  if (!item) return "0h/day";

  const avg = item.activeDays > 0 ? item.allocatedHours / item.activeDays : 0;

  if (avg >= 1) {
    const whole = Math.floor(avg);
    const minutes = Math.round((avg - whole) * 60);

    if (minutes === 0) return `≈ ${whole}h/day`;
    return `≈ ${whole}h ${minutes}m/day`;
  }

  return `≈ ${Math.round(avg * 60)} min/day`;
}

export function getWindowLabel(item) {
  if (!item) return "";

  return item.daysLeft <= HORIZON_DAYS
    ? `for ${item.studyWindowDays} day(s) until exam`
    : `for the next ${item.studyWindowDays} day(s)`;
}

// -------------------------------
// Scoring model
// -------------------------------
function getUrgencyScore(daysLeft) {
  if (daysLeft <= 2) return 5;
  if (daysLeft <= 4) return 4;
  if (daysLeft <= 7) return 3;
  if (daysLeft <= 10) return 2;
  return 1;
}

function getDifficultyWeight(difficulty) {
  const map = {
    1: 1.0,
    2: 1.5,
    3: 2.4,
    4: 3.8,
    5: 5.5,
  };

  return map[difficulty] || 1.0;
}

function getStudyWindowDays(daysLeft) {
  return Math.min(daysLeft, HORIZON_DAYS);
}

function enrichSubject(subject) {
  const daysLeft = getDaysLeft(subject.examDate);
  const urgency = getUrgencyScore(daysLeft);
  const difficultyWeight = getDifficultyWeight(subject.difficulty);
  const studyWindowDays = getStudyWindowDays(daysLeft);

  const priority = difficultyWeight * 0.72 + urgency * 0.28;

  return {
    ...subject,
    daysLeft,
    urgency,
    difficultyWeight,
    priority,
    studyWindowDays,
  };
}

// -------------------------------
// Day capacity builder
// -------------------------------
function roundDownToChunk(value, chunk) {
  return Math.floor(value / chunk) * chunk;
}

function buildDailyCapacities(totalWeeklyHours, maxHoursPerDay, chunkHours) {
  const weights = [1.28, 1.18, 1.12, 1.0, 0.9, 0.8, 0.72];
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);

  const rawDays = weights.map((weight, index) => ({
    day: index + 1,
    capacity: Math.min(
      maxHoursPerDay,
      roundDownToChunk((totalWeeklyHours * weight) / totalWeight, chunkHours),
    ),
    totalHours: 0,
    remaining: 0,
    tasks: [],
  }));

  let assigned = rawDays.reduce((sum, day) => sum + day.capacity, 0);
  let leftover = Number((totalWeeklyHours - assigned).toFixed(2));

  while (leftover >= chunkHours - 1e-9) {
    let placed = false;

    for (let i = 0; i < rawDays.length; i++) {
      if (rawDays[i].capacity + chunkHours <= maxHoursPerDay + 1e-9) {
        rawDays[i].capacity += chunkHours;
        leftover = Number((leftover - chunkHours).toFixed(2));
        placed = true;
      }

      if (leftover < chunkHours - 1e-9) break;
    }

    if (!placed) break;
  }

  return rawDays.map((day) => ({
    ...day,
    remaining: day.capacity,
  }));
}

// -------------------------------
// Subject target hours
// -------------------------------
function computeDesiredSubjectHours(
  subjects,
  totalWeeklyHours,
  maxHoursPerDay,
) {
  const totalPriority = subjects.reduce(
    (sum, subject) => sum + subject.priority,
    0,
  );

  let desired = subjects.map((subject) => {
    const baseShare = (subject.priority / totalPriority) * totalWeeklyHours;

    const difficultyBoost =
      subject.difficulty === 5 ? 1.2 : subject.difficulty === 4 ? 1.1 : 1;

    const boosted = baseShare * difficultyBoost;
    const subjectMax = subject.studyWindowDays * maxHoursPerDay;

    return {
      ...subject,
      desiredHours: Math.min(boosted, subjectMax),
      allocatedHours: 0,
      remainingNeed: 0,
      dayAllocations: {},
    };
  });

  const totalDesired = desired.reduce((sum, s) => sum + s.desiredHours, 0);

  desired = desired.map((subject) => ({
    ...subject,
    desiredHours:
      totalDesired > totalWeeklyHours
        ? (subject.desiredHours / totalDesired) * totalWeeklyHours
        : subject.desiredHours,
  }));

  return desired.map((subject) => ({
    ...subject,
    remainingNeed: subject.desiredHours,
  }));
}

// -------------------------------
// Day allocation helpers
// -------------------------------
function getAllocatedHoursForDay(subject, day) {
  return subject.dayAllocations[day] || 0;
}

function addTaskToDay(dayBucket, subjectName, chunkHours) {
  const existing = dayBucket.tasks.find((task) => task.subject === subjectName);

  if (existing) {
    existing.hours += chunkHours;
  } else {
    dayBucket.tasks.push({
      subject: subjectName,
      hours: chunkHours,
    });
  }

  dayBucket.totalHours += chunkHours;
  dayBucket.remaining = Number((dayBucket.remaining - chunkHours).toFixed(2));
}

function pickBestSubject(subjects, day, maxSubjectHoursPerDay) {
  const available = subjects.filter((subject) => {
    if (subject.remainingNeed <= 0) return false;
    if (day.day > subject.studyWindowDays) return false;

    const subjectHoursToday = getAllocatedHoursForDay(subject, day.day);
    if (subjectHoursToday >= maxSubjectHoursPerDay) return false;

    return true;
  });

  if (!available.length) return null;

  return available.sort((a, b) => {
    if (a.daysLeft !== b.daysLeft) return a.daysLeft - b.daysLeft;

    if (a.difficulty !== b.difficulty) return b.difficulty - a.difficulty;

    const aDensity =
      a.remainingNeed / Math.max(1, a.studyWindowDays - day.day + 1);
    const bDensity =
      b.remainingNeed / Math.max(1, b.studyWindowDays - day.day + 1);

    if (bDensity !== aDensity) return bDensity - aDensity;

    return b.priority - a.priority;
  })[0];
}

// -------------------------------
// Main planner
// -------------------------------
export function generatePlan(subjects, totalStudyHours, options = {}) {
  if (!subjects.length || totalStudyHours <= 0) return [];

  const maxHoursPerDay =
    options.maxHoursPerDay && options.maxHoursPerDay > 0
      ? options.maxHoursPerDay
      : DEFAULT_MAX_HOURS_PER_DAY;

  const maxSubjectHoursPerDay =
    options.maxSubjectHoursPerDay && options.maxSubjectHoursPerDay > 0
      ? options.maxSubjectHoursPerDay
      : DEFAULT_MAX_SUBJECT_HOURS_PER_DAY;

  const chunkHours =
    options.chunkHours && options.chunkHours > 0
      ? options.chunkHours
      : DEFAULT_CHUNK_HOURS;

  const weeklyBudget = Math.max(1, Math.floor(totalStudyHours));
  const effectiveWeeklyBudget = Math.min(
    weeklyBudget,
    HORIZON_DAYS * maxHoursPerDay,
  );

  const enriched = subjects.map(enrichSubject);
  const desiredSubjects = computeDesiredSubjectHours(
    enriched,
    effectiveWeeklyBudget,
    maxHoursPerDay,
  );

  const days = buildDailyCapacities(
    effectiveWeeklyBudget,
    maxHoursPerDay,
    chunkHours,
  );

  let remainingWeeklyBudget = effectiveWeeklyBudget;
  let workingSubjects = [...desiredSubjects];

  while (remainingWeeklyBudget >= chunkHours - 1e-9) {
    const activeDay = days.find((day) => day.remaining >= chunkHours - 1e-9);
    if (!activeDay) break;

    const subject = pickBestSubject(
      workingSubjects,
      activeDay,
      maxSubjectHoursPerDay,
    );

    // اليوم ده اتقفل بالنسبة للمواد المتاحة
    if (!subject) {
      activeDay.remaining = 0;
      continue;
    }

    addTaskToDay(activeDay, subject.name, chunkHours);

    workingSubjects = workingSubjects.map((item) => {
      if (item.id !== subject.id) return item;

      const currentForDay = item.dayAllocations[activeDay.day] || 0;
      const newAllocated = Number(
        (item.allocatedHours + chunkHours).toFixed(2),
      );
      const newRemaining = Number(
        Math.max(0, item.remainingNeed - chunkHours).toFixed(2),
      );

      return {
        ...item,
        allocatedHours: newAllocated,
        remainingNeed: newRemaining,
        dayAllocations: {
          ...item.dayAllocations,
          [activeDay.day]: Number((currentForDay + chunkHours).toFixed(2)),
        },
      };
    });

    remainingWeeklyBudget = Number(
      (remainingWeeklyBudget - chunkHours).toFixed(2),
    );
  }

  return workingSubjects
    .filter((subject) => subject.allocatedHours > 0)
    .map((subject) => {
      const activeDays = Object.keys(subject.dayAllocations).length || 1;
      const dailyHours = subject.allocatedHours / activeDays;
      const dailyMinutes = Math.round(dailyHours * 60);

      return {
        ...subject,
        activeDays,
        dailyHours,
        dailyMinutes,
      };
    })
    .sort((a, b) => {
      if (b.allocatedHours !== a.allocatedHours) {
        return b.allocatedHours - a.allocatedHours;
      }

      return a.daysLeft - b.daysLeft;
    });
}

// -------------------------------
// Daily schedule helper for UI
// -------------------------------
export function getDailySchedule(plan, options = {}) {
  const maxHoursPerDay =
    options.maxHoursPerDay && options.maxHoursPerDay > 0
      ? options.maxHoursPerDay
      : DEFAULT_MAX_HOURS_PER_DAY;

  const days = Array.from({ length: HORIZON_DAYS }, (_, index) => ({
    day: index + 1,
    totalHours: 0,
    remaining: maxHoursPerDay,
    tasks: [],
  }));

  plan.forEach((subject) => {
    Object.entries(subject.dayAllocations || {}).forEach(([day, hours]) => {
      const bucket = days.find((d) => d.day === Number(day));
      if (!bucket) return;

      const existing = bucket.tasks.find(
        (task) => task.subject === subject.name,
      );

      if (existing) {
        existing.hours += hours;
      } else {
        bucket.tasks.push({
          subject: subject.name,
          hours,
        });
      }

      bucket.totalHours += hours;
      bucket.remaining = Math.max(0, bucket.remaining - hours);
    });
  });

  return days
    .filter((day) => day.totalHours > 0)
    .map((day) => ({
      ...day,
      tasks: day.tasks.sort((a, b) => b.hours - a.hours),
    }));
}
``;
