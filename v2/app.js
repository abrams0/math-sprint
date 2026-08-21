import {
  OPERATIONS,
  buildReport,
  computeAnswer,
  factKey,
  inverseHint,
  masteryStrength,
  median,
  normalizeMastery,
  recordAttempt,
  scoreAttempt,
  selectAdaptiveProblems,
} from "./logic.js?v=2.0.3";

const APP_VERSION = "2.0.3";
const STORAGE_KEY = "mathSprintV2:data";
const DAILY_GOAL = 15;
const FEEDBACK_DELAY = 650;

const copy = {
  en: {
    navHome: "Dashboard", navInsights: "Insights", streakEncouragement: "Small wins become strong skills.", backToOld: "Back to old version", localProfile: "Local profile",
    missionKicker: "Today’s mission", missionTitle: "Make division feel easy.", missionBody: "A short confidence sprint connects division to multiplication facts you already know.", startSmart: "Start smart sprint", divisionBoost: "Division boost",
    quickSetup: "Quick setup", chooseSkill: "Choose a focus", recommended: "Recommended", smartMix: "Smart mix", addition: "Addition", subtraction: "Subtraction", multiplication: "Multiplication", division: "Division", sessionLength: "Questions",
    recommendedForYou: "Recommended for you", focusDivision: "Division confidence", focusReason: "Start with friendly 2, 5 and 10 facts, then level up when they feel easy.", practiceDivision: "Practice division",
    lastSevenDays: "Last 7 days", weeklyProgress: "Weekly progress", questions: "Questions", mastery: "Mastery", accuracy: "Accuracy", speed: "Steady pace", masteryEmpty: "Complete a sprint to map your skills.", accuracyEmpty: "First-try accuracy will appear here.", speedNote: "Median answer time, not a pressure timer.",
    keepMomentum: "Build momentum, one sprint at a time.", dailyGoal: "Daily goal", personalBest: "Your personal best", insights: "Insights", insightsHint: "See what is getting easier",
    smartSprint: "Smart sprint", score: "Score", beatYourBest: "Beat your best", raceHint: "Accuracy and brave corrections matter most.", answerStreak: "Answer streak", youCanDoThis: "You can do this.", yourAnswer: "Your answer", checkAnswer: "Check answer", useWhatYouKnow: "Use what you know",
    sprintComplete: "Sprint complete", summaryTitle: "That got easier.", summaryMessage: "You practiced, corrected, and made your brain stronger.", firstTry: "First try", braveCorrections: "Brave corrections", steadyPace: "Steady pace", xpEarned: "XP earned", playAgain: "Play again", seeInsights: "See insights", backHome: "Back home",
    parentView: "Learning overview", insightsTitle: "Progress that explains itself", insightsBody: "See accuracy, corrections, pace and mastery separately.", backDashboard: "Back to dashboard", skillMastery: "Skill mastery", whatNext: "What to practice next", recentSprints: "Recent sprints", storedLocally: "Stored only on this device", dataTools: "Data tools", dataToolsBody: "Download a private JSON report for safekeeping or deeper analysis.", downloadReport: "Download report",
    leaveTitle: "Leave this sprint?", leaveBody: "Completed answers will still count, but the sprint score will not.", keepGoing: "Keep going", leaveSprint: "Leave sprint",
    correct: "Exactly right!", corrected: "You found it. Corrections build strong memory.", tryHint: "Not yet. Use the clue below, then try again.", answerNeeded: "Enter an answer first.", newBest: "New personal best!", closeBest: "You were close to your best.", firstSprint: "Your first score is on the board.", noSessions: "Complete a sprint and your progress will appear here.", sessions: "sessions", dayOne: "Day one", days: "day streak", noScore: "No score yet", pointsBest: "best points", divisionNext: "Build division confidence", divisionNextBody: "Friendly fact families and multiplication clues make division predictable.", practiceNow: "Practice now", mastered: "mastered", learning: "learning",
  },
  lt: {
    navHome: "Pradžia", navInsights: "Pažanga", streakEncouragement: "Mažos pergalės tampa tvirtais įgūdžiais.", backToOld: "Grįžti į seną versiją", localProfile: "Vietinis profilis",
    missionKicker: "Šiandienos misija", missionTitle: "Padaryk dalybą lengvą.", missionBody: "Trumpas sprintas susieja dalybą su daugybos faktais, kuriuos jau moki.", startSmart: "Pradėti išmanų sprintą", divisionBoost: "Dalybos treniruotė",
    quickSetup: "Greitas pasirinkimas", chooseSkill: "Pasirink sritį", recommended: "Rekomenduojama", smartMix: "Išmanus mišinys", addition: "Sudėtis", subtraction: "Atimtis", multiplication: "Daugyba", division: "Dalyba", sessionLength: "Užduotys",
    recommendedForYou: "Rekomenduojame tau", focusDivision: "Drąsi dalyba", focusReason: "Pradėk nuo lengvų 2, 5 ir 10 faktų, tada kilk aukščiau.", practiceDivision: "Treniruoti dalybą", lastSevenDays: "Paskutinės 7 dienos", weeklyProgress: "Savaitės pažanga", questions: "Užduotys", mastery: "Įvaldyta", accuracy: "Tikslumas", speed: "Ramus tempas", masteryEmpty: "Atlik sprintą ir pamatysi įgūdžių žemėlapį.", accuracyEmpty: "Čia matysi tikslumą iš pirmo karto.", speedNote: "Vidurinis atsakymo laikas, be spaudimo.", keepMomentum: "Po vieną sprintą pirmyn.", dailyGoal: "Dienos tikslas", personalBest: "Tavo rekordas", insights: "Pažanga", insightsHint: "Pamatyk, kas lengvėja",
    smartSprint: "Išmanus sprintas", score: "Taškai", beatYourBest: "Pagerink rekordą", raceHint: "Svarbiausia tikslumas ir drąsūs pataisymai.", answerStreak: "Atsakymų serija", youCanDoThis: "Tau pavyks.", yourAnswer: "Tavo atsakymas", checkAnswer: "Tikrinti", useWhatYouKnow: "Pasinaudok tuo, ką moki", sprintComplete: "Sprintas baigtas", summaryTitle: "Dabar jau lengviau.", summaryMessage: "Treniravaisi, taisytais ir sustiprinai savo smegenis.", firstTry: "Iš pirmo karto", braveCorrections: "Drąsūs pataisymai", steadyPace: "Ramus tempas", xpEarned: "Gauta XP", playAgain: "Dar kartą", seeInsights: "Žiūrėti pažangą", backHome: "Į pradžią", parentView: "Mokymosi apžvalga", insightsTitle: "Aiškiai matoma pažanga", insightsBody: "Tikslumas, pataisymai, tempas ir įvaldymas rodomi atskirai.", backDashboard: "Atgal į pradžią", skillMastery: "Įgūdžių įvaldymas", whatNext: "Ką treniruoti toliau", recentSprints: "Paskutiniai sprintai", storedLocally: "Saugoma tik šiame įrenginyje", dataTools: "Duomenys", dataToolsBody: "Atsisiųsk privatų JSON pažangos failą.", downloadReport: "Atsisiųsti ataskaitą", leaveTitle: "Baigti sprintą?", leaveBody: "Atliktos užduotys liks, bet sprinto taškai nebus išsaugoti.", keepGoing: "Tęsti", leaveSprint: "Baigti", correct: "Teisingai!", corrected: "Pavyko. Pataisymai stiprina atmintį.", tryHint: "Dar ne. Panaudok užuominą ir bandyk dar kartą.", answerNeeded: "Pirmiausia įrašyk atsakymą.", newBest: "Naujas asmeninis rekordas!", closeBest: "Buvai arti savo rekordo.", firstSprint: "Pirmasis rezultatas jau įrašytas.", noSessions: "Atlik sprintą ir čia pamatysi pažangą.", sessions: "sprintai", dayOne: "Pirma diena", days: "dienų serija", noScore: "Dar nėra", pointsBest: "taškų rekordas", divisionNext: "Stiprink dalybą", divisionNextBody: "Daugybos užuominos padeda suprasti dalybą.", practiceNow: "Treniruotis", mastered: "įvaldyta", learning: "mokomasi",
  },
  de: {
    navHome: "Übersicht", navInsights: "Fortschritt", streakEncouragement: "Kleine Erfolge werden zu starken Fähigkeiten.", backToOld: "Zur alten Version", localProfile: "Lokales Profil", missionKicker: "Heutige Mission", missionTitle: "Division soll leicht wirken.", missionBody: "Ein kurzer Sprint verbindet Division mit bekannten Malaufgaben.", startSmart: "Smart-Sprint starten", divisionBoost: "Divisions-Training", quickSetup: "Schnellauswahl", chooseSkill: "Schwerpunkt wählen", recommended: "Empfohlen", smartMix: "Smarte Mischung", addition: "Addition", subtraction: "Subtraktion", multiplication: "Multiplikation", division: "Division", sessionLength: "Aufgaben", recommendedForYou: "Für dich empfohlen", focusDivision: "Sicher dividieren", focusReason: "Beginne mit einfachen 2er-, 5er- und 10er-Aufgaben und steigere dich.", practiceDivision: "Division üben", lastSevenDays: "Letzte 7 Tage", weeklyProgress: "Wochenfortschritt", questions: "Aufgaben", mastery: "Beherrschung", accuracy: "Genauigkeit", speed: "Ruhiges Tempo", masteryEmpty: "Nach einem Sprint siehst du deine Fähigkeiten.", accuracyEmpty: "Hier erscheint die Genauigkeit beim ersten Versuch.", speedNote: "Median der Antwortzeit, ohne Zeitdruck.", keepMomentum: "Sprint für Sprint vorankommen.", dailyGoal: "Tagesziel", personalBest: "Dein Rekord", insights: "Fortschritt", insightsHint: "Sieh, was leichter wird", smartSprint: "Smart-Sprint", score: "Punkte", beatYourBest: "Schlage deinen Rekord", raceHint: "Genauigkeit und mutige Korrekturen zählen am meisten.", answerStreak: "Antwortserie", youCanDoThis: "Du schaffst das.", yourAnswer: "Deine Antwort", checkAnswer: "Antwort prüfen", useWhatYouKnow: "Nutze, was du weißt", sprintComplete: "Sprint geschafft", summaryTitle: "Das wurde leichter.", summaryMessage: "Du hast geübt, verbessert und dein Denken gestärkt.", firstTry: "Erster Versuch", braveCorrections: "Mutige Korrekturen", steadyPace: "Ruhiges Tempo", xpEarned: "XP erhalten", playAgain: "Nochmal", seeInsights: "Fortschritt ansehen", backHome: "Zur Übersicht", parentView: "Lernübersicht", insightsTitle: "Fortschritt, der sich erklärt", insightsBody: "Genauigkeit, Korrekturen, Tempo und Beherrschung getrennt sehen.", backDashboard: "Zur Übersicht", skillMastery: "Fähigkeiten", whatNext: "Als Nächstes üben", recentSprints: "Letzte Sprints", storedLocally: "Nur auf diesem Gerät gespeichert", dataTools: "Daten", dataToolsBody: "Private JSON-Auswertung herunterladen.", downloadReport: "Auswertung laden", leaveTitle: "Sprint verlassen?", leaveBody: "Gelöste Aufgaben zählen, der Sprintwert wird nicht gespeichert.", keepGoing: "Weitermachen", leaveSprint: "Verlassen", correct: "Genau richtig!", corrected: "Geschafft. Korrekturen stärken das Gedächtnis.", tryHint: "Noch nicht. Nutze den Mal-Hinweis und versuche es erneut.", answerNeeded: "Gib zuerst eine Antwort ein.", newBest: "Neuer persönlicher Rekord!", closeBest: "Fast dein Rekord.", firstSprint: "Dein erster Wert steht.", noSessions: "Nach einem Sprint erscheint hier dein Fortschritt.", sessions: "Sprints", dayOne: "Tag eins", days: "Tage Serie", noScore: "Noch kein Wert", pointsBest: "Punkte Bestwert", divisionNext: "Division stärken", divisionNextBody: "Malaufgaben machen Division berechenbar.", practiceNow: "Jetzt üben", mastered: "beherrscht", learning: "im Aufbau",
  },
  ru: {
    navHome: "Главная", navInsights: "Прогресс", streakEncouragement: "Маленькие победы создают крепкие навыки.", backToOld: "Старая версия", localProfile: "Локальный профиль", missionKicker: "Миссия дня", missionTitle: "Сделай деление лёгким.", missionBody: "Короткий спринт связывает деление со знакомыми примерами умножения.", startSmart: "Начать умный спринт", divisionBoost: "Тренировка деления", quickSetup: "Быстрый выбор", chooseSkill: "Выбери навык", recommended: "Рекомендуем", smartMix: "Умный микс", addition: "Сложение", subtraction: "Вычитание", multiplication: "Умножение", division: "Деление", sessionLength: "Задачи", recommendedForYou: "Для тебя", focusDivision: "Уверенное деление", focusReason: "Начни с простых фактов на 2, 5 и 10, затем повышай уровень.", practiceDivision: "Тренировать деление", lastSevenDays: "Последние 7 дней", weeklyProgress: "Прогресс за неделю", questions: "Задачи", mastery: "Освоение", accuracy: "Точность", speed: "Спокойный темп", masteryEmpty: "Заверши спринт, чтобы увидеть карту навыков.", accuracyEmpty: "Здесь появится точность с первой попытки.", speedNote: "Медианное время ответа без давления.", keepMomentum: "Шаг вперёд с каждым спринтом.", dailyGoal: "Цель дня", personalBest: "Твой рекорд", insights: "Прогресс", insightsHint: "Смотри, что становится легче", smartSprint: "Умный спринт", score: "Очки", beatYourBest: "Побей свой рекорд", raceHint: "Точность и исправления важнее скорости.", answerStreak: "Серия ответов", youCanDoThis: "У тебя получится.", yourAnswer: "Твой ответ", checkAnswer: "Проверить", useWhatYouKnow: "Используй то, что знаешь", sprintComplete: "Спринт завершён", summaryTitle: "Стало легче.", summaryMessage: "Ты тренировался, исправлялся и укреплял мышление.", firstTry: "С первой попытки", braveCorrections: "Исправления", steadyPace: "Ровный темп", xpEarned: "Получено XP", playAgain: "Ещё раз", seeInsights: "Смотреть прогресс", backHome: "На главную", parentView: "Обзор обучения", insightsTitle: "Понятный прогресс", insightsBody: "Точность, исправления, темп и освоение показаны отдельно.", backDashboard: "На главную", skillMastery: "Освоение навыков", whatNext: "Что тренировать дальше", recentSprints: "Последние спринты", storedLocally: "Хранится только на этом устройстве", dataTools: "Данные", dataToolsBody: "Скачать приватный JSON-отчёт.", downloadReport: "Скачать отчёт", leaveTitle: "Выйти из спринта?", leaveBody: "Решённые задачи сохранятся, но очки спринта — нет.", keepGoing: "Продолжить", leaveSprint: "Выйти", correct: "Верно!", corrected: "Получилось. Исправления укрепляют память.", tryHint: "Пока нет. Используй подсказку с умножением и попробуй снова.", answerNeeded: "Сначала введи ответ.", newBest: "Новый личный рекорд!", closeBest: "Почти твой рекорд.", firstSprint: "Первый результат записан.", noSessions: "Заверши спринт, и здесь появится прогресс.", sessions: "спринтов", dayOne: "Первый день", days: "дней подряд", noScore: "Пока нет", pointsBest: "лучший результат", divisionNext: "Укрепить деление", divisionNextBody: "Подсказки умножения делают деление понятным.", practiceNow: "Тренироваться", mastered: "освоено", learning: "изучается",
  },
};

const state = loadState();
let currentView = "home";
let session = null;
let audioContext = null;

const elements = Object.fromEntries([
  "languageSelect", "soundToggle", "learnerName", "learnerInitial", "sideStreak", "dailyStreak", "dailyGoalText", "dailyGoalBar", "bestScore", "weeklyChart", "masteryMetric", "masteryText", "accuracyMetric", "accuracyText", "speedMetric", "skillSelector", "lengthSelector", "recommendationLabel", "practiceCounter", "practiceProgressBar", "liveScore", "targetScore", "raceProgress", "answerStreak", "problemExpression", "answerForm", "answerInput", "feedbackMessage", "hintPanel", "hintText", "hintVisual", "numberPad", "confidenceLine", "summaryScore", "summaryAccuracy", "summaryCorrections", "summaryPace", "summaryXp", "bestScoreMessage", "skillMasteryList", "insightSessionCount", "nextPracticeCard", "recentSessions", "exportBtn", "leaveDialog", "leavePracticeBtn", "cancelLeaveBtn", "confirmLeaveBtn", "playAgainBtn", "smartStartBtn"
].map((id) => [id, document.getElementById(id)]));

function defaultState() {
  const today = dateKey();
  return {
    schema: 2,
    profile: { name: "Player" },
    preferences: { lang: localStorage.getItem("mathSprintLang") || "en", sound: localStorage.getItem("mathSprintMuted") !== "true", skill: "smart", length: 10 },
    mastery: {}, sessions: [], xp: 0, bestScore: 0, bestScores: {},
    streak: Number(localStorage.getItem("mathSprintStreak") || 0),
    lastPracticeDate: null,
    daily: { date: today, completed: Number(localStorage.getItem("mathSprintDailyProgress") || 0) },
    legacyImported: false,
  };
}

function loadState() {
  const fallback = defaultState();
  let stored = {};
  try { stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch { stored = {}; }
  const loaded = {
    ...fallback, ...stored,
    profile: { ...fallback.profile, ...(stored.profile || {}) },
    preferences: { ...fallback.preferences, ...(stored.preferences || {}) },
    mastery: normalizeMastery(stored.mastery || {}),
    sessions: Array.isArray(stored.sessions) ? stored.sessions.slice(0, 120) : [],
    bestScores: stored.bestScores && typeof stored.bestScores === "object" ? stored.bestScores : {},
    daily: { ...fallback.daily, ...(stored.daily || {}) },
  };
  if (loaded.daily.date !== dateKey()) loaded.daily = { date: dateKey(), completed: 0 };
  if (!loaded.legacyImported) importLegacyStats(loaded);
  return loaded;
}

function importLegacyStats(target) {
  try {
    const legacy = JSON.parse(localStorage.getItem("mathSprintStats") || "{}");
    Object.entries(legacy).forEach(([key, value]) => {
      const match = key.match(/^(add|sub|mul|div):(\d+),(\d+)$/);
      if (!match || !value || typeof value !== "object") return;
      const [, op, left, right] = match;
      const canonical = factKey(op, Number(left), Number(right));
      const attempts = Math.max(0, Number(value.attempts) || 0);
      const firstTryCorrect = Math.min(attempts, Math.max(0, Number(value.firstTry) || 0));
      target.mastery[canonical] = { attempts, correct: firstTryCorrect, firstTryCorrect, corrections: 0, lastSeenAt: 0, lastCorrectAt: 0, dueAt: Date.now() };
    });
  } catch { /* V1 data stays untouched if malformed. */ }
  target.legacyImported = true;
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, sessions: state.sessions.slice(0, 120) }));
}

function dateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function translate(key) { return (copy[state.preferences.lang] || copy.en)[key] || copy.en[key] || key; }

function applyTranslations() {
  document.documentElement.lang = state.preferences.lang;
  document.querySelectorAll("[data-i18n]").forEach((node) => { node.textContent = translate(node.dataset.i18n); });
  elements.soundToggle.setAttribute("aria-label", state.preferences.sound ? "Mute sound" : "Turn sound on");
  renderAll();
}

function showView(view) {
  currentView = view;
  document.querySelectorAll(".view").forEach((node) => node.classList.toggle("hidden", node.dataset.view !== view));
  document.querySelectorAll(".nav-item").forEach((node) => {
    const active = node.dataset.viewTarget === view || (view === "summary" && node.dataset.viewTarget === "home");
    node.classList.toggle("active", active);
    if (active) node.setAttribute("aria-current", "page"); else node.removeAttribute("aria-current");
  });
  if (view === "home") renderDashboard();
  if (view === "insights") renderInsights();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function operationLabel(op) { return translate({ add: "addition", sub: "subtraction", mul: "multiplication", div: "division" }[op]); }

function aggregateMetrics(sessions = state.sessions) {
  const attempts = sessions.flatMap((item) => item.attempts || []);
  const first = attempts.filter((item) => item.firstTry).length;
  const completed = attempts.length;
  const times = attempts.map((item) => item.durationMs).filter(Number.isFinite);
  const masteryValues = Object.values(state.mastery).map(masteryStrength);
  return {
    completed,
    accuracy: completed ? Math.round(first / completed * 100) : null,
    medianMs: median(times),
    mastery: masteryValues.length ? Math.round(masteryValues.reduce((a, b) => a + b, 0) / masteryValues.length * 100) : 0,
  };
}

function updateStreak() {
  if (!state.lastPracticeDate) return;
  const today = dateKey();
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
  if (state.lastPracticeDate !== today && state.lastPracticeDate !== dateKey(yesterday)) state.streak = 0;
}

function renderAll() {
  updateStreak();
  elements.learnerName.textContent = state.profile.name;
  elements.learnerInitial.textContent = (state.profile.name[0] || "P").toUpperCase();
  elements.languageSelect.value = state.preferences.lang;
  elements.soundToggle.textContent = state.preferences.sound ? "◖))" : "×";
  elements.soundToggle.setAttribute("aria-pressed", String(!state.preferences.sound));
  syncSelectors();
  if (currentView === "home") renderDashboard();
  if (currentView === "insights") renderInsights();
}

function syncSelectors() {
  elements.skillSelector.querySelectorAll("[data-skill]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.skill === state.preferences.skill)));
  elements.lengthSelector.querySelectorAll("[data-length]").forEach((button) => button.setAttribute("aria-pressed", String(Number(button.dataset.length) === state.preferences.length)));
}

function renderDashboard() {
  const metrics = aggregateMetrics();
  elements.masteryMetric.textContent = `${metrics.mastery}%`;
  elements.masteryMetric.parentElement.style.setProperty("--metric", `${metrics.mastery}%`);
  elements.masteryText.textContent = metrics.completed ? `${Object.values(state.mastery).filter((item) => masteryStrength(item) >= .8).length} ${translate("mastered")}` : translate("masteryEmpty");
  elements.accuracyMetric.textContent = metrics.accuracy === null ? "—" : `${metrics.accuracy}%`;
  elements.accuracyMetric.parentElement.style.setProperty("--metric", `${metrics.accuracy || 0}%`);
  elements.accuracyText.textContent = metrics.completed ? `${metrics.completed} ${translate("questions").toLowerCase()}` : translate("accuracyEmpty");
  elements.speedMetric.textContent = metrics.medianMs === null ? "—" : `${(metrics.medianMs / 1000).toFixed(1)}s`;
  elements.speedMetric.parentElement.style.setProperty("--metric", metrics.medianMs ? `${Math.max(8, Math.min(100, 10000 / metrics.medianMs * 50))}%` : "0%");
  const streakText = state.streak ? `${state.streak} ${translate("days")}` : translate("dayOne");
  elements.sideStreak.textContent = streakText;
  elements.dailyStreak.textContent = streakText;
  elements.dailyGoalText.textContent = `${state.daily.completed} / ${DAILY_GOAL}`;
  elements.dailyGoalBar.style.width = `${Math.min(100, state.daily.completed / DAILY_GOAL * 100)}%`;
  elements.bestScore.textContent = state.bestScore ? `${state.bestScore} ${translate("pointsBest")}` : translate("noScore");
  renderWeeklyChart();
}

function renderWeeklyChart() {
  elements.weeklyChart.replaceChildren();
  const days = [];
  for (let offset = 6; offset >= 0; offset -= 1) { const date = new Date(); date.setDate(date.getDate() - offset); days.push(date); }
  const summaries = days.map((day) => {
    const key = dateKey(day);
    const sessions = state.sessions.filter((item) => item.date === key);
    const attempts = sessions.flatMap((item) => item.attempts || []);
    return { day, key, count: attempts.length, accuracy: attempts.length ? Math.round(attempts.filter((item) => item.firstTry).length / attempts.length * 100) : null };
  });
  const maxCount = Math.max(10, ...summaries.map((item) => item.count));
  summaries.forEach((item) => {
    const column = document.createElement("div");
    column.className = `chart-day${item.count ? "" : " empty"}${item.key === dateKey() ? " today" : ""}`;
    const height = item.count ? Math.max(12, item.count / maxCount * 100) : 4;
    column.innerHTML = `<div class="chart-bar-wrap"><i class="chart-bar" style="height:${height}%" data-accuracy="${item.accuracy === null ? "" : `${item.accuracy}%`}"></i></div><small>${new Intl.DateTimeFormat(state.preferences.lang, { weekday: "short" }).format(item.day)}</small>`;
    elements.weeklyChart.append(column);
  });
  const description = summaries.map((item) => `${item.key}: ${item.count}`).join(", ");
  elements.weeklyChart.setAttribute("aria-label", `${translate("weeklyProgress")}: ${description}`);
}

function recommendOperations(mode) {
  if (mode && mode !== "smart") return [mode];
  const recent = state.sessions.slice(0, 8).flatMap((item) => item.attempts || []);
  const byOp = ["div", "mul", "sub", "add"].map((op) => {
    const rows = recent.filter((item) => item.op === op);
    return { op, accuracy: rows.length ? rows.filter((item) => item.firstTry).length / rows.length : (op === "div" ? .45 : op === "mul" ? .58 : .8), samples: rows.length };
  });
  byOp.sort((a, b) => a.accuracy - b.accuracy || b.samples - a.samples);
  return byOp[0].op === "div" ? ["div", "mul"] : [byOp[0].op];
}

function uniqueProblems(problems, desired, operations, max, confidenceStart) {
  const output = [];
  const seen = new Set();
  const source = [...problems];
  let attempts = 0;
  while (output.length < desired && attempts < desired * 12) {
    const problem = source.shift() || selectAdaptiveProblems({ count: 1, max, operations, mastery: state.mastery, confidenceStart })[0];
    const key = `${problem.op}:${problem.a}:${problem.b}`;
    if (!seen.has(key)) { seen.add(key); output.push(problem); }
    attempts += 1;
  }
  const uniquePool = [...output];
  while (output.length < desired && uniquePool.length) output.push({ ...uniquePool[output.length % uniquePool.length] });
  return output;
}

function startSprint(forcedMode) {
  const mode = forcedMode || state.preferences.skill;
  const operations = recommendOperations(mode);
  const count = state.preferences.length;
  const hasPractice = state.sessions.length > 1;
  const max = operations.every((op) => op === "mul" || op === "div") ? (hasPractice ? 50 : 20) : (hasPractice ? 50 : 20);
  let problems;
  const confidenceStart = state.sessions.length === 0;
  if (mode === "smart" && operations.includes("div")) {
    const divisionCount = Math.ceil(count * .7);
    problems = [
      ...selectAdaptiveProblems({ count: divisionCount, max, operations: ["div"], mastery: state.mastery, confidenceStart }),
      ...selectAdaptiveProblems({ count: count - divisionCount, max, operations: ["mul"], mastery: state.mastery, confidenceStart }),
    ];
    problems.sort(() => Math.random() - .5);
  } else {
    problems = selectAdaptiveProblems({ count: count * 2, max, operations, mastery: state.mastery, confidenceStart });
  }
  problems = uniqueProblems(problems, count, operations, max, confidenceStart);
  const scoreKey = `${mode}:${count}`;
  session = { mode, scoreKey, operations, planned: count, problems, index: 0, attempts: [], score: 0, streak: 0, problemStartedAt: Date.now(), wrongOnCurrent: false, startedAt: Date.now(), previousBest: Number(state.bestScores[scoreKey] || 0), advancing: false };
  showView("practice");
  renderProblem();
}

function renderProblem() {
  const problem = session && session.problems[session.index];
  if (!problem) { finishSprint(); return; }
  session.problemStartedAt = Date.now();
  session.wrongOnCurrent = false;
  session.advancing = false;
  elements.practiceCounter.textContent = `${session.index + 1} / ${session.planned}`;
  elements.practiceProgressBar.style.width = `${session.index / session.planned * 100}%`;
  elements.liveScore.textContent = session.score;
  elements.targetScore.textContent = session.previousBest || session.planned * 80;
  elements.raceProgress.style.height = `${Math.min(100, session.score / Math.max(1, session.previousBest || session.planned * 80) * 100)}%`;
  elements.answerStreak.textContent = session.streak;
  elements.problemExpression.textContent = `${problem.a} ${OPERATIONS[problem.op].label.replace("x", "×").replace("/", "÷")} ${problem.b}`;
  elements.answerInput.value = "";
  elements.feedbackMessage.textContent = "";
  elements.feedbackMessage.className = "feedback-message";
  elements.hintPanel.classList.add("hidden");
  elements.confidenceLine.textContent = translate(session.index < 2 ? "youCanDoThis" : "beatYourBest");
  elements.answerInput.focus();
}

function submitAnswer(event) {
  event.preventDefault();
  if (!session || session.advancing) return;
  const raw = elements.answerInput.value.replace(/\D+/g, "");
  if (!raw) { setFeedback(translate("answerNeeded"), "error"); return; }
  const problem = session.problems[session.index];
  const correct = Number(raw) === computeAnswer(problem.op, problem.a, problem.b);
  if (!correct) {
    session.wrongOnCurrent = true;
    session.streak = 0;
    setFeedback(translate("tryHint"), "error");
    showHint(problem);
    playTone(false);
    elements.answerInput.select();
    return;
  }
  const durationMs = Math.max(250, Date.now() - session.problemStartedAt);
  const firstTry = !session.wrongOnCurrent;
  const result = { op: problem.op, a: problem.a, b: problem.b, factKey: problem.factKey || factKey(problem.op, problem.a, problem.b), correct: true, firstTry, corrected: !firstTry, durationMs };
  session.attempts.push(result);
  state.mastery = recordAttempt(state.mastery, problem, result);
  const base = scoreAttempt(result);
  session.streak = firstTry ? session.streak + 1 : 1;
  const streakBonus = firstTry ? Math.min(25, Math.max(0, session.streak - 1) * 5) : 0;
  session.score += base + streakBonus;
  state.daily.completed += 1;
  state.xp += firstTry ? 10 : 6;
  saveState();
  setFeedback(translate(firstTry ? "correct" : "corrected"), "success");
  elements.liveScore.textContent = session.score;
  elements.answerStreak.textContent = session.streak;
  playTone(true);
  session.advancing = true;
  window.setTimeout(() => { if (!session) return; session.index += 1; renderProblem(); }, FEEDBACK_DELAY);
}

function setFeedback(message, type) { elements.feedbackMessage.textContent = message; elements.feedbackMessage.className = `feedback-message ${type}`; }

function showHint(problem) {
  const answer = computeAnswer(problem.op, problem.a, problem.b);
  let text = inverseHint(problem).replaceAll(" x ", " × ").replaceAll(" / ", " ÷ ");
  if (problem.op === "div") text = `${answer} × ${problem.b} = ${problem.a}. So ${problem.a} ÷ ${problem.b} = ${answer}.`;
  elements.hintText.textContent = text;
  elements.hintVisual.replaceChildren();
  const dots = Math.min(30, problem.op === "div" ? problem.a : answer);
  for (let index = 0; index < dots; index += 1) elements.hintVisual.append(document.createElement("i"));
  elements.hintPanel.classList.remove("hidden");
}

function finishSprint() {
  if (!session) return;
  const report = buildReport(session.attempts, state.mastery);
  const now = new Date();
  const today = dateKey(now);
  if (state.lastPracticeDate !== today) {
    const yesterday = new Date(now); yesterday.setDate(yesterday.getDate() - 1);
    state.streak = state.lastPracticeDate === dateKey(yesterday) ? state.streak + 1 : 1;
  }
  state.lastPracticeDate = today;
  const previousBest = session.previousBest;
  state.bestScores[session.scoreKey] = Math.max(previousBest, session.score);
  state.bestScore = Math.max(state.bestScore, session.score);
  const record = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    date: today, completedAt: now.toISOString(), mode: session.mode, operations: session.operations,
    planned: session.planned, durationMs: Date.now() - session.startedAt, score: session.score,
    firstTryAccuracy: report.attempts ? Math.round(report.firstTryCorrect / report.attempts * 100) : 0,
    corrected: report.corrected, medianDurationMs: report.medianDurationMs, attempts: session.attempts,
  };
  state.sessions.unshift(record);
  saveState();
  elements.summaryScore.textContent = session.score;
  elements.summaryAccuracy.textContent = `${record.firstTryAccuracy}%`;
  elements.summaryCorrections.textContent = report.corrected;
  elements.summaryPace.textContent = report.medianDurationMs ? `${(report.medianDurationMs / 1000).toFixed(1)}s` : "—";
  elements.summaryXp.textContent = `+${report.firstTryCorrect * 10 + report.corrected * 6}`;
  elements.bestScoreMessage.textContent = !previousBest ? translate("firstSprint") : session.score > previousBest ? translate("newBest") : translate("closeBest");
  showView("summary");
}

function abortSprint() { session = null; elements.leaveDialog.classList.add("hidden"); showView("home"); }

function skillMetrics() {
  return ["add", "sub", "mul", "div"].map((op) => {
    const attempts = state.sessions.flatMap((item) => item.attempts || []).filter((item) => item.op === op);
    const accuracy = attempts.length ? Math.round(attempts.filter((item) => item.firstTry).length / attempts.length * 100) : 0;
    const pace = median(attempts.map((item) => item.durationMs));
    return { op, attempts: attempts.length, accuracy, pace, mastery: attempts.length ? Math.round(Math.min(100, accuracy * Math.min(1, attempts.length / 12))) : 0 };
  });
}

function renderInsights() {
  const skills = skillMetrics();
  elements.insightSessionCount.textContent = `${state.sessions.length} ${translate("sessions")}`;
  elements.skillMasteryList.replaceChildren();
  skills.forEach((skill) => {
    const row = document.createElement("div"); row.className = "mastery-row";
    row.innerHTML = `<span>${operationLabel(skill.op)}</span><div class="mastery-track"><i style="width:${skill.mastery}%"></i></div><strong>${skill.mastery}%</strong>`;
    elements.skillMasteryList.append(row);
  });
  const divisionSkill = skills.find((skill) => skill.op === "div");
  const multiplicationSkill = skills.find((skill) => skill.op === "mul");
  const practiced = skills.filter((skill) => skill.attempts > 0);
  let weakest = divisionSkill;
  if (divisionSkill.attempts >= 20 && divisionSkill.accuracy >= 85) weakest = multiplicationSkill;
  if (weakest.attempts >= 20 && weakest.accuracy >= 85 && practiced.length) weakest = [...practiced].sort((a, b) => a.accuracy - b.accuracy)[0];
  elements.nextPracticeCard.innerHTML = `<strong>${weakest.op === "div" ? translate("divisionNext") : operationLabel(weakest.op)}</strong><p>${weakest.op === "div" ? translate("divisionNextBody") : translate("focusReason")}</p><button class="primary-button" type="button">${translate("practiceNow")}</button>`;
  elements.nextPracticeCard.querySelector("button").addEventListener("click", () => startSprint(weakest.op));
  elements.recentSessions.replaceChildren();
  if (!state.sessions.length) { const empty = document.createElement("div"); empty.className = "empty-state"; empty.textContent = translate("noSessions"); elements.recentSessions.append(empty); return; }
  state.sessions.slice(0, 8).forEach((item) => {
    const row = document.createElement("div"); row.className = "session-row";
    const label = item.operations.map(operationLabel).join(" + ");
    row.innerHTML = `<span>${new Intl.DateTimeFormat(state.preferences.lang, { month: "short", day: "numeric" }).format(new Date(item.completedAt))}</span><strong>${label}</strong><span>${item.firstTryAccuracy}%</span><span>${item.corrected} ↺</span><span>${item.medianDurationMs ? `${(item.medianDurationMs / 1000).toFixed(1)}s` : "—"}</span>`;
    elements.recentSessions.append(row);
  });
}

function playTone(success) {
  if (!state.preferences.sound) return;
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator(); const gain = audioContext.createGain();
    oscillator.type = "sine"; oscillator.frequency.value = success ? 620 : 210; gain.gain.value = .045;
    oscillator.connect(gain); gain.connect(audioContext.destination); oscillator.start(); gain.gain.exponentialRampToValueAtTime(.001, audioContext.currentTime + .18); oscillator.stop(audioContext.currentTime + .2);
  } catch { /* Sound is optional. */ }
}

document.addEventListener("click", (event) => {
  const viewButton = event.target.closest("[data-view-target]");
  if (viewButton) { showView(viewButton.dataset.viewTarget); return; }
  const startButton = event.target.closest("[data-start-mode]");
  if (startButton) startSprint(startButton.dataset.mode);
});

elements.skillSelector.addEventListener("click", (event) => {
  const button = event.target.closest("[data-skill]"); if (!button) return;
  state.preferences.skill = button.dataset.skill; saveState(); syncSelectors();
});
elements.lengthSelector.addEventListener("click", (event) => {
  const button = event.target.closest("[data-length]"); if (!button) return;
  state.preferences.length = Number(button.dataset.length); saveState(); syncSelectors();
});
elements.languageSelect.addEventListener("change", () => { state.preferences.lang = elements.languageSelect.value; localStorage.setItem("mathSprintLang", state.preferences.lang); saveState(); applyTranslations(); });
elements.soundToggle.addEventListener("click", () => { state.preferences.sound = !state.preferences.sound; localStorage.setItem("mathSprintMuted", String(!state.preferences.sound)); saveState(); renderAll(); });
elements.smartStartBtn.addEventListener("click", () => startSprint("smart"));
elements.answerForm.addEventListener("submit", submitAnswer);
elements.answerInput.addEventListener("input", () => { elements.answerInput.value = elements.answerInput.value.replace(/\D+/g, ""); });
elements.numberPad.addEventListener("click", (event) => {
  const button = event.target.closest("button"); if (!button) return;
  if (button.dataset.number) elements.answerInput.value = `${elements.answerInput.value}${button.dataset.number}`.slice(0, 4);
  if (button.dataset.action === "clear") elements.answerInput.value = "";
  if (button.dataset.action === "backspace") elements.answerInput.value = elements.answerInput.value.slice(0, -1);
  elements.answerInput.focus();
});
elements.leavePracticeBtn.addEventListener("click", () => elements.leaveDialog.classList.remove("hidden"));
elements.cancelLeaveBtn.addEventListener("click", () => elements.leaveDialog.classList.add("hidden"));
elements.confirmLeaveBtn.addEventListener("click", abortSprint);
elements.playAgainBtn.addEventListener("click", () => { const mode = session ? session.mode : state.preferences.skill; startSprint(mode); });
elements.exportBtn.addEventListener("click", () => {
  const payload = JSON.stringify({ exportedAt: new Date().toISOString(), appVersion: APP_VERSION, profile: state.profile, mastery: state.mastery, sessions: state.sessions }, null, 2);
  const url = URL.createObjectURL(new Blob([payload], { type: "application/json" }));
  const anchor = document.createElement("a"); anchor.href = url; anchor.download = `math-sprint-progress-${dateKey()}.json`; anchor.click(); URL.revokeObjectURL(url);
});

if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register(`./sw.js?v=${APP_VERSION}`, { scope: "./" }));

applyTranslations();
showView("home");
