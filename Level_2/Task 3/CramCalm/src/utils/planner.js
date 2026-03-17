const DAY_MS = 1000 * 60 * 60 * 24;

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

function getUrgencyScore(daysLeft) {
  if (daysLeft <= 2) return 5;
  if (daysLeft <= 4) return 4;
  if (daysLeft <= 7) return 3;
  if (daysLeft <= 10) return 2;
  return 1;
}

function getStudyWindowDays(daysLeft) {
  return Math.min(daysLeft, 7);
}

function enrichSubject(subject, weeklyHours) {
  const daysLeft = getDaysLeft(subject.examDate);
  const urgency = getUrgencyScore(daysLeft);

  const priority = subject.difficulty * 0.6 + urgency * 0.4;

  const studyWindowDays = getStudyWindowDays(daysLeft);
  const dailyCapacity = weeklyHours / 7;

  const maxHoursInWindow = Math.max(
    1,
    Math.ceil(dailyCapacity * studyWindowDays),
  );

  return {
    ...subject,
    daysLeft,
    urgency,
    priority,
    studyWindowDays,
    maxHoursInWindow,
  };
}

function addDailyMetrics(item) {
  const dailyHours = item.allocatedHours / item.studyWindowDays;
  const dailyMinutes = Math.round(dailyHours * 60);

  return {
    ...item,
    dailyHours,
    dailyMinutes,
  };
}

export function formatDailyLoad(item) {
  if (item.dailyHours >= 1) {
    return `${item.dailyHours.toFixed(1)}h/day`;
  }

  return `${item.dailyMinutes} min/day`;
}

export function getWindowLabel(item) {
  return item.daysLeft < 7
    ? `for ${item.studyWindowDays} day(s) until exam`
    : `for the next ${item.studyWindowDays} day(s)`;
}

export function generatePlan(subjects, totalStudyHours) {
  if (!subjects.length || totalStudyHours <= 0) return [];

  const weeklyHours = Math.max(1, Math.floor(totalStudyHours));

  const ranked = subjects
    .map((subject) => enrichSubject(subject, weeklyHours))
    .sort((a, b) => b.priority - a.priority);

  const totalPriority = ranked.reduce(
    (sum, subject) => sum + subject.priority,
    0,
  );

  let initial = ranked.map((subject) => {
    const raw = (subject.priority / totalPriority) * weeklyHours;
    const capped = Math.min(Math.floor(raw), subject.maxHoursInWindow);

    return {
      ...subject,
      allocatedHours: capped,
    };
  });

  if (initial.every((item) => item.allocatedHours === 0)) {
    initial[0].allocatedHours = 1;
  }

  let used = initial.reduce((sum, item) => sum + item.allocatedHours, 0);
  let remaining = weeklyHours - used;

  while (remaining > 0) {
    let added = false;

    for (let i = 0; i < initial.length; i++) {
      if (initial[i].allocatedHours < initial[i].maxHoursInWindow) {
        initial[i].allocatedHours += 1;
        remaining -= 1;
        added = true;
      }

      if (remaining === 0) break;
    }

    if (!added) break;
  }

  return initial
    .filter((item) => item.allocatedHours > 0)
    .map(addDailyMetrics)
    .sort((a, b) => b.dailyHours - a.dailyHours || b.priority - a.priority);
}
``;
