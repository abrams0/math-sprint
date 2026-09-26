export const CATEGORIES = ["Nomen", "Verb", "Adjektiv"];
const CATEGORY_IDS = { Q1084: "Nomen", Q24905: "Verb", Q34698: "Adjektiv" };

// This is a vocabulary allowlist, NOT an offline classified deck. Categories come from Wikidata.
export const EXAMPLES = Object.freeze({
  Hund: "Der Hund schläft.", Katze: "Die Katze spielt.", Baum: "Der Baum wächst.",
  Haus: "Das Haus ist groß.", Buch: "Das Buch liegt auf dem Tisch.", Tisch: "Der Tisch ist rund.",
  Stuhl: "Der Stuhl steht am Fenster.", Ball: "Der Ball rollt.", Blume: "Die Blume duftet.",
  Sonne: "Die Sonne scheint.", Schule: "Die Schule beginnt um acht Uhr.", Kind: "Das Kind lacht.",
  Apfel: "Der Apfel schmeckt süß.", Brot: "Das Brot ist frisch.", Wasser: "Das Wasser ist kalt.",
  Vogel: "Der Vogel singt.", Fisch: "Der Fisch schwimmt.", Garten: "Der Garten ist grün.",
  Fenster: "Das Fenster ist offen.", Tür: "Die Tür ist zu.", Wolke: "Die Wolke zieht vorbei.",
  Auto: "Das Auto fährt.", Schuh: "Der Schuh passt.", Stift: "Der Stift schreibt gut.",
  laufen: "Wir laufen zum Spielplatz.", spielen: "Wir spielen im Garten.", lesen: "Wir lesen ein Buch.",
  schreiben: "Wir schreiben einen Brief.", lachen: "Wir lachen zusammen.", singen: "Wir singen ein Lied.",
  tanzen: "Wir tanzen zur Musik.", springen: "Wir springen über eine Pfütze.", malen: "Wir malen ein Bild.",
  rechnen: "Wir rechnen bis hundert.", lernen: "Wir lernen etwas Neues.", schlafen: "Wir schlafen im Bett.",
  trinken: "Wir trinken Wasser.", essen: "Wir essen einen Apfel.", schwimmen: "Wir schwimmen im See.",
  kochen: "Wir kochen eine Suppe.", backen: "Wir backen einen Kuchen.", hören: "Wir hören Musik.",
  suchen: "Wir suchen den Ball.", finden: "Wir finden den Schlüssel.", helfen: "Wir helfen einander.",
  bauen: "Wir bauen einen Turm.", gehen: "Wir gehen nach Hause.", fahren: "Wir fahren mit dem Bus.",
  klein: "Die Maus ist klein.", groß: "Der Elefant ist groß.", rund: "Der Ball ist rund.",
  weich: "Das Kissen ist weich.", hart: "Der Stein ist hart.", kalt: "Das Eis ist kalt.",
  warm: "Die Suppe ist warm.", heiß: "Der Tee ist heiß.", süß: "Der Honig ist süß.",
  sauer: "Die Zitrone ist sauer.", grün: "Das Gras ist grün.", blau: "Der Himmel ist blau.",
  gelb: "Die Banane ist gelb.", rot: "Die Tomate ist rot.", müde: "Nach dem Spielen bin ich müde.",
  fröhlich: "Das Kind ist fröhlich.", traurig: "Nach dem Abschied bin ich traurig.",
  freundlich: "Unsere Nachbarin ist freundlich.", mutig: "Das Kind ist mutig.",
  sauber: "Das Zimmer ist sauber.", schmutzig: "Die Schuhe sind schmutzig.",
  hungrig: "Vor dem Essen bin ich hungrig.", durstig: "Nach dem Sport bin ich durstig.",
  langsam: "Die Schnecke ist langsam.",
});

export function dictionaryUrl() {
  const lemmas = Object.keys(EXAMPLES).map((word) => `${JSON.stringify(word)}@de`).join(" ");
  // Do not filter categories in the query: conflicting/unsupported classes must remain visible to validation.
  const query = `SELECT ?lexeme ?lemma ?category WHERE {
    VALUES ?lemma { ${lemmas} }
    ?lexeme <http://wikiba.se/ontology#lemma> ?lemma;
      <http://purl.org/dc/terms/language> <http://www.wikidata.org/entity/Q188>;
      <http://wikiba.se/ontology#lexicalCategory> ?category.
  }`;
  return `https://query.wikidata.org/sparql?${new URLSearchParams({ query, format: "json" })}`;
}

export function parseDictionary(data) {
  if (!Array.isArray(data?.results?.bindings)) throw new Error("Invalid dictionary response");
  const words = new Map();
  for (const row of data.results.bindings) {
    const word = row.lemma?.value;
    if (!Object.hasOwn(EXAMPLES, word) || row.lemma["xml:lang"] !== "de") continue;
    const category = /^https?:\/\/www\.wikidata\.org\/entity\/(Q\d+)$/.exec(row.category?.value)?.[1];
    const lexeme = /^https?:\/\/www\.wikidata\.org\/entity\/(L\d+)$/.exec(row.lexeme?.value)?.[1];
    if (!words.has(word)) words.set(word, { classes: new Set(), lexeme });
    words.get(word).classes.add(category && lexeme ? category : "invalid");
  }
  return [...words.entries()].flatMap(([word, { classes, lexeme }]) => {
    const category = classes.size === 1 ? CATEGORY_IDS[[...classes][0]] : null;
    return category ? [{ word, category, example: EXAMPLES[word], lexeme }] : [];
  });
}

export async function loadWords(fetcher = fetch, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetcher(dictionaryUrl(), {
      signal: controller.signal, credentials: "omit", cache: "no-store",
      headers: { Accept: "application/sparql-results+json" },
    });
    if (!response.ok) throw new Error(`Dictionary HTTP ${response.status}`);
    const words = parseDictionary(await response.json());
    if (CATEGORIES.some((category) => words.filter((word) => word.category === category).length < 10)) {
      throw new Error("Not enough unambiguous words for all session sizes");
    }
    return words;
  } finally {
    clearTimeout(timer);
  }
}

function shuffle(items, random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function buildDeck(words, count, random = Math.random) {
  if (![10, 20, 30].includes(count)) throw new Error("Unsupported session size");
  const groups = Object.fromEntries(CATEGORIES.map((category) => [category,
    shuffle(words.filter((word) => word.category === category), random)]));
  const order = shuffle(CATEGORIES, random);
  const deck = [];
  for (let i = 0; i < count; i++) {
    const word = groups[order[i % 3]].pop();
    if (!word) throw new Error("Not enough words");
    deck.push(word);
  }
  return shuffle(deck, random);
}

export function createSession(deck) {
  if (!deck.length) throw new Error("Empty session");
  return { pending: [...deck], missed: [], index: 0, round: 1, total: deck.length,
    firstCorrect: 0, attempts: 0, corrected: 0, complete: false };
}

export function answerSession(session, category) {
  if (session.complete || !CATEGORIES.includes(category)) throw new Error("Invalid answer");
  const item = session.pending[session.index];
  const correct = category === item.category;
  session.attempts++;
  if (!correct) session.missed.push(item);
  else if (session.round === 1) session.firstCorrect++;
  else session.corrected++;
  session.index++;
  let outcome = "next";
  if (session.index === session.pending.length) {
    if (session.missed.length) {
      session.pending = session.missed;
      session.missed = [];
      session.index = 0;
      session.round++;
      outcome = "review";
    } else {
      session.complete = true;
      outcome = "complete";
    }
  }
  return { item, correct, outcome };
}
