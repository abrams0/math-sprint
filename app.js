const operationButtons = document.getElementById("operationButtons");
const countButtons = document.getElementById("countButtons");
const presetButtons = document.getElementById("presetButtons");
const maxNumberButtons = document.getElementById("maxNumberButtons");
const { buildProblems, operations, advanceQueue } = window.MathSprintLogic || {};
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const restartBtn = document.getElementById("restartBtn");

const menu = document.getElementById("menu");
const session = document.getElementById("session");
const summary = document.getElementById("summary");

const progressBar = document.getElementById("progressBar");
const problemText = document.getElementById("problemText");
const answerForm = document.getElementById("answerForm");
const answerInput = document.getElementById("answerInput");
const feedback = document.getElementById("feedback");
const roundMessage = document.getElementById("roundMessage");
const roundOverlay = document.getElementById("roundOverlay");
const roundOverlayTitle = document.getElementById("roundOverlayTitle");
const roundOverlayText = document.getElementById("roundOverlayText");
const reaction = document.getElementById("reaction");
const attemptCountEl = document.getElementById("attemptCount");
const firstTryCountEl = document.getElementById("firstTryCount");
const totalTimeEl = document.getElementById("totalTime");

const summaryAccuracy = document.getElementById("summaryAccuracy");
const summaryTotalTime = document.getElementById("summaryTotalTime");
const summaryFastest = document.getElementById("summaryFastest");
const summarySlowest = document.getElementById("summarySlowest");
const review = document.getElementById("review");
const reviewList = document.getElementById("reviewList");
const reviewContinueBtn = document.getElementById("reviewContinueBtn");
const dailyGoalValue = document.getElementById("dailyGoalValue");
const streakValue = document.getElementById("streakValue");
const dailyStatusValue = document.getElementById("dailyStatusValue");
const muteToggle = document.getElementById("muteToggle");

const APP_VERSION = "1.2.6";
const DAILY_GOAL = 20;

const translations = {
  en: {
    appTitle: "Math Sprint",
    appSubtitle: "Fast practice for math operations",
    menuTitle: "Pick Your Practice",
    menuHint: "Set the size, skills, and session length, then start.",
    maxNumberLabel: "Max number",
    operationsLabel: "Operations (pick one or more)",
    addition: "Addition",
    subtraction: "Subtraction",
    multiplicationSoon: "Multiplication",
    divisionSoon: "Division",
    problemsPerSession: "Problems per session",
    startSession: "Start Session",
    firstTryProgress: "First-try progress",
    attempt: "Attempt",
    correctFirstTry: "Correct First Try",
    time: "Time",
    endSession: "End Session",
    summaryTitle: "Great work!",
    summaryHint: "Here is the session summary.",
    summaryAccuracyLabel: "First-try accuracy",
    summaryTotalTimeLabel: "Total time",
    summaryFastestLabel: "Fastest solved",
    summarySlowestLabel: "Slowest solved",
    playAgain: "Play Again",
    footer: "Built for quick daily practice.",
    roundOverlayTitle: "Great first round!",
    roundOverlayText: "Now let’s revisit the tricky ones and lock them in.",
    roundOverlayHint: "Tap to continue",
    reviewTitle: "Let’s review mistakes",
    reviewHint: "Here are the problems to revisit.",
    reviewContinue: "Continue to Summary",
    dailyGoalLabel: "Daily goal",
    streakLabel: "Streak",
    dailyStatusLabel: "Today",
    dailyStatusDone: "Done",
    dailyStatusNotYet: "Not yet",
    tapToContinueLabel: "Pause on round break",
    tapToContinueHint: "Tap to continue after the round message.",
    presetsLabel: "Difficulty presets",
    presetEasy: "Easy 10",
    presetFluency: "Fluency 20",
    presetStrong: "Strong 30",
    presetChallenge: "Challenge 50",
    feedbackCorrect: "Nice!",
    feedbackWrong: "Try again later!",
    reactionHappy: "Yay!",
    reactionSad: "Oops"
  },
  lt: {
    appTitle: "Matematikos Sprintas",
    appSubtitle: "Greita matematikos veiksmų praktika",
    menuTitle: "Pasirink treniruotę",
    menuHint: "Nustatykite ribą, veiksmus ir užduočių kiekį, tada pradėkite.",
    maxNumberLabel: "Didžiausias skaičius",
    operationsLabel: "Veiksmai (galite pasirinkti kelis)",
    addition: "Sudėtis",
    subtraction: "Atimtis",
    multiplicationSoon: "Daugyba",
    divisionSoon: "Dalyba",
    problemsPerSession: "Užduočių skaičius",
    startSession: "Pradėti sesiją",
    firstTryProgress: "Pirmo bandymo progresas",
    attempt: "Bandymas",
    correctFirstTry: "Teisinga iš pirmo karto",
    time: "Laikas",
    endSession: "Baigti sesiją",
    summaryTitle: "Šaunu!",
    summaryHint: "Sesijos rezultatai.",
    summaryAccuracyLabel: "Tikslumas iš pirmo karto",
    summaryTotalTimeLabel: "Bendras laikas",
    summaryFastestLabel: "Greičiausiai išspręsta",
    summarySlowestLabel: "Lėčiausiai išspręsta",
    playAgain: "Kartoti",
    footer: "Sukurta kasdienei praktikai.",
    roundOverlayTitle: "Puikus pirmas ratas!",
    roundOverlayText: "Dabar pakartokime sunkesnes ir sustiprinkime įgūdžius.",
    roundOverlayHint: "Palieskite, kad tęstumėte",
    reviewTitle: "Peržiūrėkime klaidas",
    reviewHint: "Štai užduotys, kurias verta pakartoti.",
    reviewContinue: "Toliau į suvestinę",
    dailyGoalLabel: "Dienos tikslas",
    streakLabel: "Serija",
    dailyStatusLabel: "Šiandien",
    dailyStatusDone: "Atlikta",
    dailyStatusNotYet: "Dar ne",
    tapToContinueLabel: "Pauzė po pirmo rato",
    tapToContinueHint: "Palieskite, kad tęstumėte po žinutės.",
    presetsLabel: "Sunkumo lygiai",
    presetEasy: "Lengva 10",
    presetFluency: "Sklandu 20",
    presetStrong: "Stipru 30",
    presetChallenge: "Iššūkis 50",
    feedbackCorrect: "Šaunu!",
    feedbackWrong: "Bandysime dar kartą vėliau!",
    reactionHappy: "Valio!",
    reactionSad: "Oi"
  },
  de: {
    appTitle: "Mathe‑Sprint",
    appSubtitle: "Schnelles Training für Rechenoperationen",
    menuTitle: "Wähle dein Training",
    menuHint: "Lege den Zahlenbereich, die Aufgaben und die Länge fest.",
    maxNumberLabel: "Maximale Zahl",
    operationsLabel: "Operationen (mehrere möglich)",
    addition: "Addition",
    subtraction: "Subtraktion",
    multiplicationSoon: "Multiplikation",
    divisionSoon: "Division",
    problemsPerSession: "Aufgaben pro Sitzung",
    startSession: "Sitzung starten",
    firstTryProgress: "Erste‑Versuch‑Fortschritt",
    attempt: "Versuch",
    correctFirstTry: "Beim ersten Versuch richtig",
    time: "Zeit",
    endSession: "Sitzung beenden",
    summaryTitle: "Super gemacht!",
    summaryHint: "Hier ist die Zusammenfassung.",
    summaryAccuracyLabel: "Trefferquote beim ersten Versuch",
    summaryTotalTimeLabel: "Gesamtzeit",
    summaryFastestLabel: "Schnellste Lösung",
    summarySlowestLabel: "Langsamste Lösung",
    playAgain: "Nochmal spielen",
    footer: "Für tägliches Kurztraining gebaut.",
    roundOverlayTitle: "Starker erster Durchgang!",
    roundOverlayText: "Jetzt wiederholen wir die kniffligen und festigen sie.",
    roundOverlayHint: "Tippen zum Fortfahren",
    reviewTitle: "Fehler ansehen",
    reviewHint: "Hier sind die Aufgaben zum Wiederholen.",
    reviewContinue: "Weiter zur Zusammenfassung",
    dailyGoalLabel: "Tagesziel",
    streakLabel: "Serie",
    dailyStatusLabel: "Heute",
    dailyStatusDone: "Erledigt",
    dailyStatusNotYet: "Noch nicht",
    tapToContinueLabel: "Pause nach Runde 1",
    tapToContinueHint: "Tippen, um nach der Meldung weiterzumachen.",
    presetsLabel: "Schwierigkeitsstufen",
    presetEasy: "Leicht 10",
    presetFluency: "Flüssig 20",
    presetStrong: "Stark 30",
    presetChallenge: "Herausforderung 50",
    feedbackCorrect: "Super!",
    feedbackWrong: "Später nochmal!",
    reactionHappy: "Juhu!",
    reactionSad: "Oops"
  },
  ru: {
    appTitle: "Математический спринт",
    appSubtitle: "Быстрая практика арифметических операций",
    menuTitle: "Выберите тренировку",
    menuHint: "Задайте предел, операции и количество задач.",
    maxNumberLabel: "Максимальное число",
    operationsLabel: "Операции (можно несколько)",
    addition: "Сложение",
    subtraction: "Вычитание",
    multiplicationSoon: "Умножение",
    divisionSoon: "Деление",
    problemsPerSession: "Задач за сессию",
    startSession: "Начать сессию",
    firstTryProgress: "Прогресс с первого раза",
    attempt: "Попытка",
    correctFirstTry: "Правильно с первого раза",
    time: "Время",
    endSession: "Завершить сессию",
    summaryTitle: "Отлично!",
    summaryHint: "Итоги сессии.",
    summaryAccuracyLabel: "Точность с первого раза",
    summaryTotalTimeLabel: "Общее время",
    summaryFastestLabel: "Самое быстрое решение",
    summarySlowestLabel: "Самое медленное решение",
    playAgain: "Играть снова",
    footer: "Для короткой ежедневной практики.",
    roundOverlayTitle: "Отличный первый раунд!",
    roundOverlayText: "Теперь повторим сложные и закрепим результат.",
    roundOverlayHint: "Нажмите, чтобы продолжить",
    reviewTitle: "Разберём ошибки",
    reviewHint: "Вот задания, которые стоит повторить.",
    reviewContinue: "К итогам",
    dailyGoalLabel: "Цель дня",
    streakLabel: "Серия",
    dailyStatusLabel: "Сегодня",
    dailyStatusDone: "Сделано",
    dailyStatusNotYet: "Пока нет",
    tapToContinueLabel: "Пауза после 1-го раунда",
    tapToContinueHint: "Нажмите, чтобы продолжить после сообщения.",
    presetsLabel: "Уровни сложности",
    presetEasy: "Легко 10",
    presetFluency: "Уверенно 20",
    presetStrong: "Сильно 30",
    presetChallenge: "Вызов 50",
    feedbackCorrect: "Отлично!",
    feedbackWrong: "Попробуем позже!",
    reactionHappy: "Ура!",
    reactionSad: "Упс"
  }
};

let selectedOps = new Set(["add"]);
let problemCount = 10;
let maxNumber = 20;

let queue = [];
let currentProblem = null;
let startTime = null;
let timerInterval = null;
let sessionStart = null;
let attempts = 0;
let firstTryCorrect = 0;
let solvedTimes = [];
let firstAttemptIndex = 0;
let firstRoundMistakes = 0;
let mistakes = [];
let streak = Number(localStorage.getItem("mathSprintStreak") || 0);
let lastCompleteDate = localStorage.getItem("mathSprintLastCompleteDate");
let dailyProgress = Number(localStorage.getItem("mathSprintDailyProgress") || 0);
let dailyProgressDate = localStorage.getItem("mathSprintProgressDate");
let roundMessageShown = false;
let audioCtx = null;
let isMuted = localStorage.getItem("mathSprintMuted") === "true";

const FEEDBACK_DELAY_CORRECT = 900;
const FEEDBACK_DELAY_WRONG = 1200;
const ROUND_OVERLAY_DURATION = 3500;

if (operationButtons) operationButtons.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button || button.disabled) return;

  const op = button.dataset.op;
  if (selectedOps.has(op)) {
    if (selectedOps.size === 1) return;
    selectedOps.delete(op);
    button.classList.remove("active");
  } else {
    selectedOps.add(op);
    button.classList.add("active");
  }
  focusAnswerInput();
});

if (maxNumberButtons) maxNumberButtons.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  maxNumberButtons.querySelectorAll(".chip").forEach((btn) => {
    btn.classList.toggle("active", btn === button);
  });
  maxNumber = Number(button.dataset.max);
  focusAnswerInput();
});

if (presetButtons) presetButtons.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  presetButtons.querySelectorAll(".chip").forEach((btn) => {
    btn.classList.toggle("active", btn === button);
  });
  maxNumber = Number(button.dataset.max);
  if (maxNumberButtons) {
    maxNumberButtons.querySelectorAll(".chip").forEach((btn) => {
      btn.classList.toggle("active", Number(btn.dataset.max) === maxNumber);
    });
  }
  focusAnswerInput();
});

if (countButtons) countButtons.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  countButtons.querySelectorAll(".chip").forEach((btn) => {
    btn.classList.toggle("active", btn === button);
  });
  problemCount = Number(button.dataset.count);
  focusAnswerInput();
});

startBtn.addEventListener("click", () => {
  setupSession();
});

stopBtn.addEventListener("click", () => {
  endSession();
});

if (muteToggle) muteToggle.addEventListener("click", () => {
  isMuted = !isMuted;
  localStorage.setItem("mathSprintMuted", String(isMuted));
  updateMuteUI();
  focusAnswerInput();
});

reviewContinueBtn.addEventListener("click", () => {
  review.classList.add("hidden");
  summary.classList.remove("hidden");
});

restartBtn.addEventListener("click", () => {
  summary.classList.add("hidden");
  menu.classList.remove("hidden");
});

answerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  handleAnswer();
});

answerInput.addEventListener("input", () => {
  answerInput.value = answerInput.value.replace(/\\D+/g, "");
});

function setupSession() {
  queue = buildProblems(problemCount, maxNumber, Array.from(selectedOps));
  progressBar.innerHTML = "";
  queue.forEach(() => {
    const segment = document.createElement("div");
    segment.className = "progress-segment";
    const mark = document.createElement("span");
    mark.className = "sr-only";
    mark.textContent = "Not attempted";
    segment.appendChild(mark);
    progressBar.appendChild(segment);
  });

  attempts = 0;
  firstTryCorrect = 0;
  solvedTimes = [];
  firstAttemptIndex = 0;
  firstRoundMistakes = 0;
  mistakes = [];
  roundMessageShown = false;
  roundMessage.classList.add("hidden");
  roundMessage.textContent = "";
  roundOverlay.classList.add("hidden");

  menu.classList.add("hidden");
  summary.classList.add("hidden");
  review.classList.add("hidden");
  session.classList.remove("hidden");

  sessionStart = Date.now();
  startTimer();

  nextProblem();
}

function nextProblem() {
  if (queue.length === 0) {
    endSession();
    return;
  }

  currentProblem = queue[0];
  currentProblem.startTimestamp = Date.now();
  answerInput.value = "";
  feedback.textContent = "";
  feedback.classList.remove("wrong");
  reaction.className = "reaction";
  reaction.textContent = "";

  const symbol = operations[currentProblem.op].label;
  problemText.textContent = `${currentProblem.a} ${symbol} ${currentProblem.b}`;
  focusAnswerInput();

  updateStats();
}

function handleAnswer() {
  if (!currentProblem) return;

  const answer = Number(answerInput.value);
  if (Number.isNaN(answer) || answerInput.value.trim() === "") return;

  const expected = operations[currentProblem.op].solve(
    currentProblem.a,
    currentProblem.b
  );

  attempts += 1;

  if (!currentProblem.firstAttempted) {
    const segment = progressBar.children[firstAttemptIndex];
    if (answer === expected) {
      segment.classList.add("correct");
      const label = segment.querySelector(".sr-only");
      if (label) label.textContent = "Correct";
      firstTryCorrect += 1;
    } else {
      segment.classList.add("wrong");
      const label = segment.querySelector(".sr-only");
      if (label) label.textContent = "Incorrect";
      firstRoundMistakes += 1;
      mistakes.push({ a: currentProblem.a, b: currentProblem.b, op: currentProblem.op });
    }
    currentProblem.firstAttempted = true;
    firstAttemptIndex += 1;
    if (firstAttemptIndex === problemCount && !roundMessageShown && firstRoundMistakes > 0) {
      const overlayDuration = showRoundMessage();
      currentProblem.overlayDelay = overlayDuration;
      roundMessageShown = true;
    }
  }

  if (answer === expected) {
    const solveTime = Date.now() - currentProblem.startTimestamp;
    solvedTimes.push(solveTime);
    currentProblem.solved = true;
    queue = advanceQueue(queue, true);
    feedback.textContent = translations[currentLang].feedbackCorrect || "Nice!";
    feedback.classList.remove("wrong");
    showReaction(true);
    playSound(true);
    const delay = Math.max(FEEDBACK_DELAY_CORRECT, currentProblem.overlayDelay || 0);
    setTimeout(nextProblem, delay);
  } else {
    feedback.textContent = translations[currentLang].feedbackWrong || "Try again later!";
    feedback.classList.add("wrong");
    showReaction(false);
    playSound(false);
    queue = advanceQueue(queue, false);
    const delay = Math.max(FEEDBACK_DELAY_WRONG, currentProblem.overlayDelay || 0);
    setTimeout(nextProblem, delay);
  }

  updateStats();
}

function updateStats() {
  attemptCountEl.textContent = attempts;
  firstTryCountEl.textContent = `${firstTryCorrect} / ${problemCount}`;
}

function endSession() {
  stopTimer();
  session.classList.add("hidden");
  if (mistakes.length > 0) {
    renderReview();
    review.classList.remove("hidden");
    summary.classList.add("hidden");
  } else {
    summary.classList.remove("hidden");
  }

  updateDailyProgressDate();
  const today = getLocalDateKey();
  dailyProgress += problemCount;
  dailyProgressDate = today;
  localStorage.setItem("mathSprintDailyProgress", String(dailyProgress));
  localStorage.setItem("mathSprintProgressDate", dailyProgressDate);

  if (dailyProgress >= DAILY_GOAL && lastCompleteDate !== today) {
    if (lastCompleteDate === getYesterdayKey()) {
      streak += 1;
    } else {
      streak = 1;
    }
    lastCompleteDate = today;
    localStorage.setItem("mathSprintStreak", String(streak));
    localStorage.setItem("mathSprintLastCompleteDate", lastCompleteDate);
  }
  updateDailyUI();

  const accuracy = Math.round((firstTryCorrect / problemCount) * 100);
  summaryAccuracy.textContent = `${accuracy}%`;
  summaryTotalTime.textContent = formatDuration(Date.now() - sessionStart);

  if (solvedTimes.length > 0) {
    const fastest = Math.min(...solvedTimes);
    const slowest = Math.max(...solvedTimes);
    summaryFastest.textContent = formatDuration(fastest);
    summarySlowest.textContent = formatDuration(slowest);
  } else {
    summaryFastest.textContent = "--";
    summarySlowest.textContent = "--";
  }
}

function startTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    totalTimeEl.textContent = formatDuration(Date.now() - sessionStart);
  }, 250);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function formatDuration(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}


function showReaction(isCorrect) {
  reaction.className = "reaction show";
  if (isCorrect) {
    reaction.classList.add("happy");
    reaction.textContent = translations[currentLang].reactionHappy || "Yay!";
  } else {
    reaction.classList.add("sad");
    reaction.textContent = translations[currentLang].reactionSad || "Oops";
  }
}

function ensureAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playSound(isCorrect) {
  if (isMuted) return;
  ensureAudioContext();
  if (!audioCtx) return;

  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = "sine";
  osc.frequency.value = isCorrect ? 640 : 220;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.18, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);

  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(now);
  osc.stop(now + 0.25);
}

function showRoundMessage() {
  const t = translations[currentLang] || translations.en;
  roundOverlayTitle.textContent = t.roundOverlayTitle || "Great first round!";
  roundOverlayText.textContent = t.roundOverlayText || "Now let’s revisit the tricky ones and lock them in.";
  roundOverlay.classList.remove("hidden");
  setTimeout(() => {
    roundOverlay.classList.add("hidden");
  }, ROUND_OVERLAY_DURATION);
  return ROUND_OVERLAY_DURATION;
}

const langSelector = document.getElementById("langSelector");
let currentLang = localStorage.getItem("mathSprintLang") || "en";

function applyTranslations(lang) {
  const dict = translations[lang] || translations.en;
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });
}


function updateFooterVersion() {
  const footer = document.querySelector('[data-i18n="footer"]');
  if (footer) {
    footer.textContent = `${footer.textContent} v${APP_VERSION}`;
  }
}

if (langSelector) langSelector.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const lang = button.dataset.lang;
  currentLang = lang;
  localStorage.setItem("mathSprintLang", lang);
  langSelector.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("active", btn === button);
  });
  applyTranslations(lang);
  updateFooterVersion();
  updateDailyUI();
  focusAnswerInput();
});

function setInitialLangButton() {
  const btn = langSelector.querySelector(`.lang-btn[data-lang="${currentLang}"]`);
  if (btn) {
    langSelector.querySelectorAll(".lang-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  }
}

setInitialLangButton();
applyTranslations(currentLang);
updateFooterVersion();
updateDailyProgressDate();
ensureDailyProgress();
updateDailyUI();
updateMuteUI();

function updateMuteUI() {
  if (!muteToggle) return;
  muteToggle.classList.toggle("muted", isMuted);
  muteToggle.textContent = isMuted ? "🔇" : "🔊";
}

function renderReview() {
  if (!reviewList) return;
  reviewList.innerHTML = "";
  mistakes.forEach((item) => {
    const symbol = operations[item.op].label;
    const answer = operations[item.op].solve(item.a, item.b);
    const row = document.createElement("div");
    row.className = "review-item";
    row.innerHTML = `<span>${item.a} ${symbol} ${item.b}</span><span>${answer}</span>`;
    reviewList.appendChild(row);
  });
}

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getYesterdayKey() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return getLocalDateKey(d);
}


function updateDailyProgressDate() {
  const today = getLocalDateKey();
  if (!dailyProgressDate) {
    dailyProgressDate = today;
    if (lastCompleteDate === today && dailyProgress < DAILY_GOAL) {
      dailyProgress = DAILY_GOAL;
      localStorage.setItem("mathSprintDailyProgress", String(dailyProgress));
    }
    localStorage.setItem("mathSprintProgressDate", dailyProgressDate);
  } else if (dailyProgressDate !== today) {
    dailyProgress = 0;
    dailyProgressDate = today;
    localStorage.setItem("mathSprintDailyProgress", String(dailyProgress));
    localStorage.setItem("mathSprintProgressDate", dailyProgressDate);
  }
  if (lastCompleteDate && lastCompleteDate !== today) {
    const yesterday = getYesterdayKey();
    if (lastCompleteDate !== yesterday) {
      streak = 0;
      localStorage.setItem("mathSprintStreak", String(streak));
    }
  }
}


function ensureDailyProgress() {
  const today = getLocalDateKey();
  if (lastCompleteDate === today && dailyProgress < DAILY_GOAL) {
    dailyProgress = DAILY_GOAL;
    localStorage.setItem("mathSprintDailyProgress", String(dailyProgress));
  }
}

function updateDailyUI() {
  if (dailyGoalValue) dailyGoalValue.textContent = `${dailyProgress}/${DAILY_GOAL}`;
  if (streakValue) streakValue.textContent = `${streak}`;
  const today = getLocalDateKey();
  const done = lastCompleteDate == today || dailyProgress >= DAILY_GOAL;
  if (dailyStatusValue) dailyStatusValue.textContent = done ? (translations[currentLang].dailyStatusDone || "Done") : (translations[currentLang].dailyStatusNotYet || "Not yet");
}

function focusAnswerInput() {
  if (!answerInput) return;
  setTimeout(() => answerInput.focus(), 0);
}
