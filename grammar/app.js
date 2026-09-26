import { CATEGORIES, loadWords, buildDeck, createSession, answerSession } from "./logic.js?v=2.2.0";
import { translations, translate } from "./i18n.js?v=2.2.0";
import { HISTORY_KEY, readHistory, recordResult, renderHistoryChart } from "./history.js?v=2.2.0";

const APP_VERSION = "2.2.0";
const $ = (id) => document.getElementById(id);
const choices = [...document.querySelectorAll("[data-category]")];
const hintKeys = { Nomen: "nounHint", Verb: "verbHint", Adjektiv: "adjectiveHint" };
let language = "en";
try { language = localStorage.getItem("mathSprintLang") || language; } catch { /* Practice also works without storage. */ }
if (!translations[language]) language = "en";
let words = [];
let count = 10;
let session = null;
let phase = "setup";
let loading = "loading";
let busy = false;
let timer = null;
let feedback = null;
let questionPosition = null;
let startedAt = 0;
let elapsedMs = 0;
let history = readHistory();
let sessionHistoryId = null;
const t = (key, values) => translate(language, key, values);

if (new URLSearchParams(location.search).get("from") === "v2") $("backMath").href = "../v2/";

function show(view, focusId) {
  const changedView = phase !== view;
  phase = view;
  for (const id of ["setup", "practice", "review", "summary"]) $(id).hidden = id !== view;
  if (view === "setup") renderHistory();
  if (changedView) window.scrollTo(0, 0);
  if (focusId) $(focusId).focus({ preventScroll: true });
}

function renderLoadStatus() {
  $("loadStatus").textContent = t(loading, { count: words.length });
  $("retryLoad").hidden = loading !== "error";
  $("start").disabled = loading !== "ready";
  $("setup").setAttribute("aria-busy", String(loading === "loading"));
}

async function fetchDictionary() {
  loading = "loading";
  words = [];
  renderLoadStatus();
  try {
    words = await loadWords();
    loading = "ready";
  } catch {
    loading = "error";
  }
  renderLoadStatus();
}

function renderQuestionLabels() {
  if (questionPosition) $("roundLabel").textContent = t("round", questionPosition);
  $("progress").setAttribute("aria-label", t("progress"));
}

function renderFeedback() {
  $("feedbackTitle").textContent = feedback ? t(feedback.correct ? "correct" : "wrong", {
    word: feedback.item.word, category: feedback.item.category,
  }) : "";
  $("feedbackHint").textContent = feedback && !feedback.correct ? t(hintKeys[feedback.item.category]) : "";
  $("example").textContent = feedback ? feedback.item.example : "";
}

function renderSummary() {
  if (!session?.complete) return;
  const accuracy = session.firstCorrect / session.total;
  $("summaryMessage").textContent = t(accuracy === 1 ? "perfect" : accuracy >= .9 ? "good" : "encouragement");
  $("accuracy").textContent = new Intl.NumberFormat(language, { style: "percent", maximumFractionDigits: 0 }).format(accuracy);
  const seconds = Math.round(elapsedMs / 1000);
  $("totalTime").textContent = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
  $("corrections").textContent = String(session.corrected);
}

function renderHistory() {
  const entries = history.entries;
  const percentage = (value) => new Intl.NumberFormat(language, { style: "percent", maximumFractionDigits: 0 }).format(value);
  const date = (entry) => new Intl.DateTimeFormat(language, { dateStyle: "medium", timeStyle: "short" }).format(entry.completedAt);
  $("historyCount").textContent = t("historyCount", { count: entries.length });
  $("historyEmpty").hidden = entries.length > 0;
  $("historyPlot").hidden = !entries.length;
  $("historyDetails").hidden = !entries.length;
  $("historyNote").textContent = t(history.saved ? "historyNote" : "historyUnsaved");
  $("historyNote").classList.toggle("warning", !history.saved);
  $("historySaveWarning").hidden = history.saved;
  renderHistoryChart($("historyChart"), entries, {
    title: t("historyTitle"), description: t("historyDescription", { count: entries.length }),
    percentage, pointLabel: (entry) => `${date(entry)}: ${percentage(entry.firstCorrect / entry.total)}`,
  });
  $("historyRows").replaceChildren();
  for (const entry of entries) {
    const row = document.createElement("tr");
    for (const text of [date(entry), percentage(entry.firstCorrect / entry.total)]) {
      const cell = document.createElement("td");
      cell.textContent = text;
      row.append(cell);
    }
    $("historyRows").append(row);
  }
}

function applyLanguage() {
  document.documentElement.lang = language;
  document.title = `${t("title")} · Math Sprint`;
  $("language").value = language;
  for (const element of document.querySelectorAll("[data-i18n]")) element.textContent = t(element.dataset.i18n);
  $("version").textContent = `${t("version")} ${APP_VERSION}`;
  renderLoadStatus();
  renderQuestionLabels();
  renderFeedback();
  renderSummary();
  renderHistory();
}

function presentWord() {
  clearTimeout(timer);
  busy = false;
  $("end").disabled = false;
  feedback = null;
  const item = session.pending[session.index];
  questionPosition = { round: session.round, current: session.index + 1, total: session.pending.length };
  $("word").textContent = item.word;
  $("progress").max = session.pending.length;
  $("progress").value = session.index;
  $("feedback").removeAttribute("data-result");
  $("sourceWord").hidden = true;
  for (const button of choices) { button.disabled = false; button.classList.remove("right", "wrong"); }
  renderQuestionLabels();
  renderFeedback();
  show("practice", "word");
}

function start() {
  if (loading !== "ready") return;
  clearTimeout(timer);
  session = createSession(buildDeck(words, count));
  sessionHistoryId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  startedAt = performance.now();
  elapsedMs = 0;
  presentWord();
}

function submit(category) {
  if (phase !== "practice" || busy) return;
  busy = true;
  feedback = answerSession(session, category);
  const result = feedback;
  if (result.outcome === "complete") {
    elapsedMs = performance.now() - startedAt;
    // Save at the final answer, not after the feedback delay or during a render.
    history = recordResult(history.entries, {
      id: sessionHistoryId, completedAt: Date.now(), total: session.total, firstCorrect: session.firstCorrect,
    });
    $("end").disabled = true;
    renderHistory();
  }
  $("progress").value = questionPosition.current;
  $("feedback").dataset.result = result.correct ? "correct" : "wrong";
  for (const button of choices) {
    button.disabled = true;
    button.classList.toggle("right", button.dataset.category === result.item.category);
    button.classList.toggle("wrong", !result.correct && button.dataset.category === category);
  }
  $("sourceWord").href = `https://www.wikidata.org/wiki/Lexeme:${result.item.lexeme}`;
  $("sourceWord").hidden = false;
  renderFeedback();
  timer = setTimeout(() => {
    if (result.outcome === "complete") {
      renderSummary();
      show("summary", "summaryMessage");
    } else if (result.outcome === "review") {
      show("review", "reviewTitle");
      timer = setTimeout(presentWord, 4500);
    } else {
      presentWord();
    }
  }, result.correct ? 1400 : 3200);
}

$("language").addEventListener("change", () => {
  language = $("language").value;
  try { localStorage.setItem("mathSprintLang", language); } catch { /* A blocked preference store must not stop practice. */ }
  applyLanguage();
});
for (const button of document.querySelectorAll("[data-count]")) {
  button.addEventListener("click", () => {
    count = Number(button.dataset.count);
    for (const option of document.querySelectorAll("[data-count]")) option.setAttribute("aria-pressed", String(option === button));
  });
}
for (const button of choices) button.addEventListener("click", () => submit(button.dataset.category));
document.addEventListener("keydown", (event) => {
  if (event.repeat || event.isComposing || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
  if (event.target.closest("select, input, textarea, [contenteditable='true']")) return;
  if (phase !== "practice" || busy || !/^[123]$/.test(event.key)) return;
  event.preventDefault();
  submit(CATEGORIES[Number(event.key) - 1]);
});
$("start").addEventListener("click", start);
$("retryLoad").addEventListener("click", fetchDictionary);
$("continue").addEventListener("click", () => { if (phase === "review") presentWord(); });
$("end").addEventListener("click", () => {
  if (!window.confirm(t("leave"))) return;
  clearTimeout(timer);
  session = null;
  feedback = null;
  questionPosition = null;
  busy = false;
  show("setup", "start");
});
$("again").addEventListener("click", () => show("setup", "start"));
window.addEventListener("storage", (event) => {
  if (event.key !== HISTORY_KEY && event.key !== null) return;
  history = readHistory();
  renderHistory();
});
if ("ResizeObserver" in window) {
  new ResizeObserver(() => {
    if (phase === "setup") renderHistory();
  }).observe($("historyPlot"));
} else {
  window.addEventListener("resize", renderHistory);
}
applyLanguage();
fetchDictionary();
