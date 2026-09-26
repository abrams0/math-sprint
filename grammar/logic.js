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
  "Maus": "Die Maus knabbert an einem Käse.",
  "Pferd": "Das Pferd läuft über die Wiese.",
  "Kuh": "Die Kuh frisst Gras.",
  "Schaf": "Das Schaf hat weiche Wolle.",
  "Ziege": "Die Ziege steht auf dem Hügel.",
  "Schwein": "Das Schwein liegt im Stroh.",
  "Huhn": "Das Huhn legt ein Ei.",
  "Ente": "Die Ente schwimmt auf dem Teich.",
  "Gans": "Die Gans läuft zum Wasser.",
  "Biene": "Die Biene fliegt zur Blume.",
  "Ameise": "Die Ameise trägt ein Blatt.",
  "Schmetterling": "Der Schmetterling sitzt auf einer Blüte.",
  "Spinne": "Die Spinne baut ein Netz.",
  "Schnecke": "Die Schnecke trägt ihr Haus.",
  "Frosch": "Der Frosch springt in den Teich.",
  "Igel": "Der Igel versteckt sich im Laub.",
  "Eichhörnchen": "Das Eichhörnchen sammelt Nüsse.",
  "Hase": "Der Hase hüpft über die Wiese.",
  "Kaninchen": "Das Kaninchen frisst eine Karotte.",
  "Fuchs": "Der Fuchs schleicht durch den Wald.",
  "Bär": "Der Bär sucht nach Futter.",
  "Löwe": "Der Löwe ruht im Schatten.",
  "Tiger": "Der Tiger hat Streifen.",
  "Elefant": "Der Elefant hat einen langen Rüssel.",
  "Giraffe": "Die Giraffe hat einen langen Hals.",
  "Affe": "Der Affe klettert auf einen Baum.",
  "Pinguin": "Der Pinguin watschelt über das Eis.",
  "Delfin": "Der Delfin springt aus dem Wasser.",
  "Wal": "Der Wal schwimmt im Meer.",
  "Schildkröte": "Die Schildkröte trägt einen Panzer.",
  "Familie": "Die Familie isst zusammen.",
  "Mutter": "Meine Mutter liest mir vor.",
  "Vater": "Mein Vater kocht eine Suppe.",
  "Bruder": "Mein Bruder spielt mit mir.",
  "Schwester": "Meine Schwester malt ein Bild.",
  "Freund": "Mein Freund kommt zu Besuch.",
  "Freundin": "Meine Freundin lacht mit mir.",
  "Lehrer": "Der Lehrer erklärt die Aufgabe.",
  "Lehrerin": "Die Lehrerin schreibt an die Tafel.",
  "Bäcker": "Der Bäcker backt frisches Brot.",
  "Ärztin": "Die Ärztin hilft kranken Menschen.",
  "Küche": "In der Küche duftet es nach Kuchen.",
  "Zimmer": "Mein Zimmer ist gemütlich.",
  "Bett": "Das Bett hat eine weiche Decke.",
  "Kissen": "Das Kissen liegt auf dem Bett.",
  "Decke": "Die Decke hält mich warm.",
  "Lampe": "Die Lampe leuchtet hell.",
  "Uhr": "Die Uhr zeigt acht Uhr an.",
  "Tasche": "Meine Tasche ist leicht.",
  "Rucksack": "Mein Rucksack ist gepackt.",
  "Hose": "Die Hose ist blau.",
  "Jacke": "Meine Jacke hält mich warm.",
  "Mütze": "Die Mütze bedeckt meine Ohren.",
  "Socke": "Eine Socke liegt unter dem Bett.",
  "Kleid": "Das Kleid hat bunte Punkte.",
  "Teller": "Der Teller steht auf dem Tisch.",
  "Tasse": "Die Tasse ist mit Tee gefüllt.",
  "Löffel": "Mit dem Löffel esse ich Suppe.",
  "Gabel": "Die Gabel liegt neben dem Teller.",
  "Flasche": "Die Flasche enthält Wasser.",
  "Banane": "Die Banane ist gelb.",
  "Birne": "Die Birne schmeckt süß.",
  "Erdbeere": "Die Erdbeere ist reif.",
  "Karotte": "Die Karotte wächst im Garten.",
  "Kartoffel": "Die Kartoffel liegt im Korb.",
  "Tomate": "Die Tomate ist rot.",
  "Gurke": "Die Gurke ist knackig.",
  "Käse": "Der Käse liegt auf dem Brot.",
  "Milch": "Die Milch steht im Kühlschrank.",
  "Suppe": "Die Suppe wärmt mich auf.",
  "Kuchen": "Der Kuchen duftet wunderbar.",
  "Wald": "Der Wald ist voller Bäume.",
  "Wiese": "Die Wiese ist voller Blumen.",
  "Berg": "Der Berg ist sehr hoch.",
  "Fluss": "Der Fluss fließt durch die Stadt.",
  "Meer": "Das Meer rauscht.",
  "klettern": "Wir klettern auf einen Baum.",
  "hüpfen": "Wir hüpfen auf einem Bein.",
  "rennen": "Wir rennen zum Spielplatz.",
  "wandern": "Wir wandern durch den Wald.",
  "reisen": "Wir reisen mit dem Zug.",
  "fliegen": "Die Vögel fliegen nach Süden.",
  "rollen": "Die Bälle rollen über den Boden.",
  "kriechen": "Die Käfer kriechen unter das Blatt.",
  "krabbeln": "Die Babys krabbeln über den Teppich.",
  "reiten": "Wir reiten auf einem Pony.",
  "turnen": "Wir turnen in der Sporthalle.",
  "werfen": "Wir werfen den Ball.",
  "fangen": "Wir fangen den Ball.",
  "kicken": "Wir kicken auf dem Sportplatz.",
  "rutschen": "Wir rutschen die Rutsche hinunter.",
  "schaukeln": "Wir schaukeln auf dem Spielplatz.",
  "basteln": "Wir basteln eine Laterne.",
  "zeichnen": "Wir zeichnen ein Tier.",
  "falten": "Wir falten ein Papierboot.",
  "kleben": "Wir kleben Bilder auf das Papier.",
  "schneiden": "Wir schneiden das Papier mit einer Schere.",
  "nähen": "Wir nähen einen Knopf an.",
  "stricken": "Wir stricken einen Schal.",
  "formen": "Wir formen Tiere aus Knete.",
  "fühlen": "Wir fühlen den weichen Stoff.",
  "sehen": "Wir sehen einen Regenbogen.",
  "riechen": "Wir riechen den Duft der Blumen.",
  "schmecken": "Die Äpfel schmecken süß.",
  "sprechen": "Wir sprechen über unser Wochenende.",
  "reden": "Wir reden miteinander.",
  "fragen": "Wir fragen nach dem Weg.",
  "antworten": "Wir antworten auf die Frage.",
  "erzählen": "Wir erzählen eine Geschichte.",
  "erklären": "Wir erklären die Spielregeln.",
  "rufen": "Wir rufen unsere Freunde.",
  "flüstern": "Wir flüstern in der Bücherei.",
  "schweigen": "Wir schweigen und hören zu.",
  "zuhören": "Wir wollen der Geschichte zuhören.",
  "denken": "Wir denken an unsere Freunde.",
  "wissen": "Wir wissen die Antwort.",
  "verstehen": "Wir verstehen die Aufgabe.",
  "merken": "Wir merken uns den Weg.",
  "zählen": "Wir zählen die Sterne.",
  "üben": "Wir üben ein neues Lied.",
  "probieren": "Wir probieren ein Stück Kuchen.",
  "planen": "Wir planen einen Ausflug.",
  "wünschen": "Wir wünschen dir einen schönen Tag.",
  "hoffen": "Wir hoffen auf gutes Wetter.",
  "freuen": "Wir freuen uns auf die Ferien.",
  "staunen": "Wir staunen über den Regenbogen.",
  "lächeln": "Wir lächeln uns an.",
  "weinen": "Manchmal weinen wir, wenn wir traurig sind.",
  "trösten": "Wir trösten unsere Freundin.",
  "teilen": "Wir teilen unser Obst.",
  "schenken": "Wir schenken dir ein Bild.",
  "danken": "Wir danken dir für deine Hilfe.",
  "grüßen": "Wir grüßen unsere Nachbarn.",
  "besuchen": "Wir besuchen unsere Großeltern.",
  "treffen": "Wir treffen unsere Freunde.",
  "warten": "Wir warten auf den Bus.",
  "bleiben": "Wir bleiben heute zu Hause.",
  "kommen": "Wir kommen gleich zurück.",
  "bringen": "Wir bringen das Buch mit.",
  "holen": "Wir holen unsere Jacken.",
  "tragen": "Wir tragen den Korb zusammen.",
  "ziehen": "Wir ziehen den Schlitten.",
  "schieben": "Wir schieben den Wagen.",
  "heben": "Wir heben die Kiste zusammen.",
  "legen": "Wir legen die Bücher auf den Tisch.",
  "stellen": "Wir stellen die Schuhe ins Regal.",
  "sitzen": "Wir sitzen auf einer Bank.",
  "stehen": "Wir stehen an der Haltestelle.",
  "liegen": "Die Stifte liegen auf dem Tisch.",
  "öffnen": "Wir öffnen das Fenster.",
  "schließen": "Wir schließen die Tür.",
  "waschen": "Wir waschen unsere Hände.",
  "schnell": "Der Zug ist schnell.",
  "leise": "Die Musik ist leise.",
  "laut": "Der Donner ist laut.",
  "hell": "Das Zimmer ist hell.",
  "dunkel": "Der Himmel ist dunkel.",
  "lang": "Der Schal ist lang.",
  "kurz": "Der Weg ist kurz.",
  "hoch": "Der Turm ist hoch.",
  "niedrig": "Der Zaun ist niedrig.",
  "breit": "Der Fluss ist breit.",
  "schmal": "Der Pfad ist schmal.",
  "dick": "Das Buch ist dick.",
  "dünn": "Das Papier ist dünn.",
  "leicht": "Die Feder ist leicht.",
  "schwer": "Der Stein ist schwer.",
  "alt": "Die Eiche ist alt.",
  "jung": "Der Hund ist noch jung.",
  "neu": "Mein Rucksack ist neu.",
  "frisch": "Das Brot ist frisch.",
  "reif": "Der Apfel ist reif.",
  "roh": "Die Karotte ist roh.",
  "gemütlich": "Das Zimmer ist gemütlich.",
  "glatt": "Der Tisch ist glatt.",
  "rau": "Die Baumrinde ist rau.",
  "trocken": "Die Wäsche ist trocken.",
  "nass": "Meine Jacke ist nass.",
  "feucht": "Die Erde ist feucht.",
  "voll": "Der Korb ist voll.",
  "leer": "Die Flasche ist leer.",
  "offen": "Das Fenster ist offen.",
  "geschlossen": "Die Tür ist geschlossen.",
  "kaputt": "Das Spielzeug ist kaputt.",
  "gesund": "Nach der Erkältung bin ich wieder gesund.",
  "krank": "Heute bin ich krank und bleibe im Bett.",
  "stark": "Der Elefant ist stark.",
  "schwach": "Der Wind ist heute schwach.",
  "fleißig": "Die Biene ist fleißig.",
  "faul": "Heute bin ich faul und ruhe mich aus.",
  "froh": "Über deinen Besuch bin ich froh.",
  "glücklich": "Das Kind ist glücklich.",
  "zufrieden": "Mit meinem Bild bin ich zufrieden.",
  "stolz": "Auf meinen Turm bin ich stolz.",
  "aufgeregt": "Vor dem Ausflug bin ich aufgeregt.",
  "ruhig": "Der See ist ruhig.",
  "geduldig": "Unsere Lehrerin ist geduldig.",
  "nett": "Unser Nachbar ist nett.",
  "hilfsbereit": "Meine Freundin ist hilfsbereit.",
  "ehrlich": "Mein Freund ist ehrlich.",
  "vorsichtig": "Beim Überqueren der Straße bin ich vorsichtig.",
  "aufmerksam": "Die Kinder sind aufmerksam.",
  "neugierig": "Die Katze ist neugierig.",
  "schüchtern": "In einer neuen Gruppe bin ich manchmal schüchtern.",
  "lustig": "Die Geschichte ist lustig.",
  "spannend": "Das Buch ist spannend.",
  "langweilig": "Der lange Film ist langweilig.",
  "einfach": "Diese Aufgabe ist einfach.",
  "schwierig": "Das Rätsel ist schwierig.",
  "wichtig": "Deine Frage ist wichtig.",
  "richtig": "Die Antwort ist richtig.",
  "falsch": "Diese Lösung ist falsch.",
  "schön": "Der Garten ist schön.",
  "hübsch": "Die Blume ist hübsch.",
  "bunt": "Der Regenbogen ist bunt.",
  "weiß": "Der Schnee ist weiß.",
  "schwarz": "Die Tafel ist schwarz.",
  "braun": "Der Baumstamm ist braun.",
  "grau": "Die Wolke ist grau.",
  "orange": "Der Kürbis ist orange.",
  "lila": "Die Blüte ist lila.",
  "rosa": "Das Kleid ist rosa.",
  "eckig": "Der Bilderrahmen ist eckig.",
  "spitz": "Der Bleistift ist spitz.",
  "flach": "Der Teller ist flach.",
  "tief": "Der Brunnen ist tief.",
  "fern": "Die Insel ist noch fern.",
  "nah": "Unser Ziel ist nah.",
  "Freundschaft": "Unsere Freundschaft ist mir wichtig.",
  "Hoffnung": "Die Hoffnung auf gutes Wetter bleibt.",
  "Geduld": "Beim Lernen brauche ich manchmal Geduld.",
  "Mut": "Für den ersten Sprung brauche ich Mut.",
  "Freude": "Die Freude über das Geschenk ist groß.",
  "Angst": "Im Dunkeln habe ich manchmal Angst.",
  "Gefühl": "Dieses Gefühl kenne ich gut.",
  "Geheimnis": "Das Geheimnis verrate ich nicht.",
  "Erinnerung": "Die Erinnerung an den Ausflug macht mich froh.",
  "Erlebnis": "Die Übernachtung im Zelt war ein schönes Erlebnis.",
  "Abenteuer": "Unsere Wanderung wird ein Abenteuer.",
  "Entdeckung": "Im Wald machen wir eine spannende Entdeckung.",
  "Erfindung": "Das Fahrrad ist eine praktische Erfindung.",
  "Versuch": "Beim nächsten Versuch klappt es bestimmt.",
  "Ergebnis": "Das Ergebnis unserer Rechnung stimmt.",
  "Unterschied": "Den Unterschied zwischen den Bildern finde ich schnell.",
  "Gemeinschaft": "In unserer Gemeinschaft helfen wir einander.",
  "Verantwortung": "Für mein Haustier übernehme ich Verantwortung.",
  "Umgebung": "Wir erkunden die Umgebung unserer Schule.",
  "Jahreszeit": "Der Herbst ist eine bunte Jahreszeit.",
  "beobachten": "Wir beobachten die Vögel im Garten.",
  "vergleichen": "Wir vergleichen zwei Bilder.",
  "untersuchen": "Wir untersuchen ein Blatt mit der Lupe.",
  "entdecken": "Wir entdecken einen Käfer im Gras.",
  "erfinden": "Wir erfinden eine eigene Geschichte.",
  "vermuten": "Wir vermuten, dass es bald regnet.",
  "begründen": "Wir begründen unsere Antwort.",
  "beschreiben": "Wir beschreiben den Weg zur Schule.",
  "berichten": "Wir berichten von unserem Ausflug.",
  "überlegen": "Wir überlegen uns eine Lösung.",
  "entscheiden": "Wir entscheiden gemeinsam über das Spiel.",
  "erinnern": "Wir erinnern uns an den Ausflug.",
  "vergessen": "Wir vergessen manchmal unsere Mützen.",
  "versprechen": "Wir versprechen, einander zu helfen.",
  "entschuldigen": "Wir entschuldigen uns für unseren Fehler.",
  "vereinbaren": "Wir vereinbaren einen Treffpunkt.",
  "vorbereiten": "Wir wollen ein Picknick vorbereiten.",
  "verbessern": "Wir verbessern unseren Text.",
  "sammeln": "Wir sammeln bunte Blätter.",
  "sortieren": "Wir sortieren die Steine nach ihrer Größe.",
  "zuverlässig": "Meine Freundin ist zuverlässig.",
  "gerecht": "Diese Regel ist gerecht.",
  "ungerecht": "Diese Entscheidung finde ich ungerecht.",
  "höflich": "Unser Gast ist höflich.",
  "unhöflich": "Diese Antwort war unhöflich.",
  "ängstlich": "Das Kaninchen ist ängstlich.",
  "tapfer": "Beim Arzt war das Kind tapfer.",
  "zufällig": "Unsere Begegnung war zufällig.",
  "gewöhnlich": "Dieser Stein ist ganz gewöhnlich.",
  "ungewöhnlich": "Die Form dieses Steins ist ungewöhnlich.",
  "ähnlich": "Die beiden Bilder sind ähnlich.",
  "unterschiedlich": "Unsere Ideen sind unterschiedlich.",
  "gemeinsam": "Die Freude am Spielen ist uns gemeinsam.",
  "einsam": "Ohne seine Freunde fühlt sich das Kind einsam.",
  "wertvoll": "Die Erinnerung ist mir wertvoll.",
  "kostbar": "Sauberes Wasser ist kostbar.",
  "empfindlich": "Meine Haut ist empfindlich.",
  "deutlich": "Die Schrift an der Tafel ist deutlich.",
  "seltsam": "Dieses Geräusch ist seltsam.",
  "geheimnisvoll": "Die alte Kiste sieht geheimnisvoll aus.",
});

function dictionaryUrl(words) {
  const lemmas = words.map((word) => `${JSON.stringify(word)}@de`).join(" ");
  // Do not filter categories in the query: conflicting/unsupported classes must remain visible to validation.
  const query = `SELECT ?lexeme ?lemma ?category WHERE {
    VALUES ?lemma { ${lemmas} }
    ?lexeme <http://wikiba.se/ontology#lemma> ?lemma;
      <http://purl.org/dc/terms/language> <http://www.wikidata.org/entity/Q188>;
      <http://wikiba.se/ontology#lexicalCategory> ?category.
  }`;
  return `https://query.wikidata.org/sparql?${new URLSearchParams({ query, format: "json" })}`;
}

export function dictionaryUrls() {
  const words = Object.keys(EXAMPLES);
  const urls = [];
  // Keep GET requests short enough for the public endpoint and intermediaries.
  for (let i = 0; i < words.length; i += 60) urls.push(dictionaryUrl(words.slice(i, i + 60)));
  return urls;
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
    const bindings = [];
    // Fetch sequentially to avoid bursting the shared service; never expose a partial deck.
    for (const url of dictionaryUrls()) {
      const response = await fetcher(url, {
        signal: controller.signal, credentials: "omit", cache: "no-store",
        headers: { Accept: "application/sparql-results+json" },
      });
      if (!response.ok) throw new Error(`Dictionary HTTP ${response.status}`);
      const data = await response.json();
      if (!Array.isArray(data?.results?.bindings)) throw new Error("Invalid dictionary response");
      bindings.push(...data.results.bindings);
    }
    const words = parseDictionary({ results: { bindings } });
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
