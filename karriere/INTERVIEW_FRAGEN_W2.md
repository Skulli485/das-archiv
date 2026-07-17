# Interview-Fragen: Woche 2 „Das Archiv"

Diese Woche hat dich in die Lage versetzt, 14 Fragen zu beantworten, die in echten
Frontend- und Fullstack-Gesprächen kommen. Zu jeder Frage: die deutsche Formulierung,
die englische (Gespräche laufen oft auf Englisch), eine kompakte, starke Antwort aus
deinem eigenen Bauwerk (Tresor, Lesetisch, Katalogkarte, Laufzettel), und eine Zeile,
woran ein:e Interviewer:in merkt, dass du das wirklich gebaut und nicht nur gelesen hast.

Zwei Sätze, die du zitieren kannst, tragen die ganze Woche:

> David Wheeler (Fundamental Theorem of Software Engineering): „We can solve any problem
> by introducing an extra level of indirection." Mit dem Zusatz: „…except for the problem
> of too many layers of indirection."

> Donald Knuth (1974): „We should forget about small efficiencies, say about 97% of the
> time: premature optimization is the root of all evil. Yet we should not pass up our
> opportunities in that critical 3%."

---

## 1. Reaktivität, Props und Emits: der Vertrag

**DE:** „Erklär mir, wie Datenfluss in Vue funktioniert. Wie kommunizieren zwei Komponenten?"
**EN:** „Walk me through data flow in Vue. How do two components talk to each other?"

**Antwort:** Daten fließen nach unten, Ereignisse nach oben. Ein Eltern-Element gibt einen
Wert per Prop an ein Kind (`defineProps`), das Kind meldet eine Absicht per Event zurück
(`defineEmits`, dann `emit('waehle', id)`). In meinem Archiv besitzt `App.vue` die Auswahl.
Das Raster (`GalerieRaster`) kennt die Auswahl nicht, es sendet nur `waehle(id)` nach oben,
und `App` entscheidet. Reaktivität heißt: `ref` und `reactive` verfolgen, wer einen Wert
liest, und rendern genau die betroffenen Stellen neu, wenn er sich ändert. Der Kernvorteil
ist, dass der Zustand einen klaren Besitzer hat und der Fluss in eine Richtung läuft, also
kann ich jeden Wert bis zu seiner Quelle zurückverfolgen.

**Woran der Interviewer merkt, dass du es wirklich gebaut hast:** Du sagst, wer den Zustand
besitzt („`App` besitzt die Auswahl"), statt nur „Props runter, Events hoch" abzuspulen.

---

## 2. Warum Props schreibgeschützt sind und die Falle bei verschachtelten Objekten

**DE:** „Warum darf ein Kind seine Props nicht verändern? Und wo bricht diese Regel scheinbar?"
**EN:** „Why can't a child mutate its props? And where does that rule appear to break?"

**Antwort:** Props sind ein Einweg-Vertrag: sie gehören dem Eltern-Element, das Kind liest
sie nur. Verändere ich sie im Kind, läuft der Fluss plötzlich in zwei Richtungen und die
Quelle stimmt nicht mehr mit dem überein, was auf dem Schirm steht. Vue warnt bei direkter
Zuweisung an eine Prop. Die Falle: bei einem Objekt oder Array warnt Vue nicht, wenn ich ein
Feld darin ändere (`props.karte.titel = ...`), weil die Referenz gleich bleibt. Trotzdem
verändere ich stillschweigend den Zustand des Eltern-Elements. Der saubere Weg ist: für
lokale Änderungen eine eigene Kopie oder ein `computed` halten, und für echte Änderungen ein
Event nach oben senden, damit der Besitzer entscheidet.

**Woran der Interviewer merkt, dass du es wirklich gebaut hast:** Du nennst konkret den
verschachtelten Fall (`props.objekt.feld = x` warnt nicht, mutiert aber die Quelle), nicht
nur „Props sind readonly".

---

## 3. Wozu sich `defineModel` auflöst

**DE:** „Was macht `defineModel` unter der Haube?"
**EN:** „What does `defineModel` desugar to?"

**Antwort:** `defineModel()` ist Zucker für das v-model-Paar: eine Prop `modelValue` plus ein
Event `update:modelValue`. Ich bekomme eine `ref`, aus der ich lese und in die ich schreibe;
beim Schreiben sendet Vue im Hintergrund das `update:modelValue`-Event, und das Eltern-Element
hält den Wert weiter. Das ist genau der Einweg-Vertrag aus Frage 1, nur gebündelt, damit sich
eine Eingabe wie eine zwei-Wege-Bindung anfühlt, ohne dass das Kind fremden Zustand besitzt.
Der Zustand bleibt oben, das Kind meldet nur Änderungen.

**Woran der Interviewer merkt, dass du es wirklich gebaut hast:** Du sprichst die zwei Teile
namentlich aus (`modelValue` + `update:modelValue`) und ordnest sie dem Einweg-Fluss zu.

---

## 4. Was ein Composable ist und wann man eins herauszieht

**DE:** „Was ist ein Composable, und wann würdest du eins extrahieren?"
**EN:** „What is a composable, and when would you extract one?"

**Antwort:** Ein Composable ist eine Funktion, die die Composition API nutzt (`ref`,
`computed`, `watch`, Lifecycle-Hooks), um Logik mit Zustand zu kapseln und wiederverwendbar
zu machen. Bei mir liegt der ganze Ablauf einer Datenanfrage in `useArchiv()`: die vier
Zustände, der `AbortController`, der Wettlauf-Schutz. Die Komponente ruft `useArchiv()` und
bekommt `{ zustand, karte, meta, laden }` zurück, ohne die Mechanik zu kennen. Ich ziehe ein
Composable heraus, wenn dieselbe Logik an zwei Stellen gebraucht wird, oder wenn eine
Komponente zwei Dinge gleichzeitig tut (Anzeige plus Datenbeschaffung) und ich die Zuständig-
keiten trennen will. `useGalerie()` ist das kleinere Beispiel: es lädt die Manifest-Liste
einmal beim Mounten.

**Woran der Interviewer merkt, dass du es wirklich gebaut hast:** Du benennst die Rückgabe
konkret (`{ zustand, karte, meta, laden }`) und den Auslöser zum Extrahieren (Wiederverwendung
oder gemischte Zuständigkeit), nicht nur „Code auslagern".

---

## 5. Aufräumen im Lebenszyklus: was bei Unmount leckt

**DE:** „Was passiert beim Aufräumen einer Komponente, und was leckt, wenn du es lässt?"
**EN:** „What cleanup happens when a component unmounts, and what leaks if you skip it?"

**Antwort:** Alles, was eine Komponente außerhalb ihres eigenen Renderns startet, muss sie
beim Verlassen wieder schließen. Sonst leckt es: Event-Listener, Intervalle und Timer,
Abos, und laufende Anfragen. In meinem Archiv bricht `onUnmounted` eine noch laufende
`fetch` über den `AbortController` ab. Ohne das kommt die Antwort zu einer Komponente
zurück, die es nicht mehr gibt, setzt Zustand, der niemandem mehr gehört, und im schlimmsten
Fall wirft es einen Fehler oder hält Speicher fest. `watch` gibt mir mit seiner
Cleanup-Funktion denselben Griff: vor dem nächsten Lauf das Vorherige abräumen.

**Woran der Interviewer merkt, dass du es wirklich gebaut hast:** Du nennst die laufende
Anfrage als Leck (nicht nur Timer) und verknüpfst `onUnmounted` mit `AbortController.abort()`.

---

## 6. AbortController und Wettlaufsituationen bei schnellem Tippen

**DE:** „Jemand klickt oder tippt schnell hintereinander. Wie verhinderst du, dass eine alte
Antwort die neue überschreibt?"
**EN:** „A user clicks or types fast. How do you stop a stale response from overwriting the
fresh one?"

**Antwort:** Zwei Schutzschichten. Erstens ein `AbortController`: bei jeder neuen Anfrage
breche ich die vorherige ab, damit sie gar nicht erst zurückkommt. Zweitens, weil eine Antwort
trotzdem verspätet eintreffen kann, ein aufsteigender Anfrage-Zähler (`requestId`): ich merke
mir die Nummer der jüngsten Anfrage und verwerfe jede Antwort, deren Nummer nicht die jüngste
ist. Ohne das gewinnt bei schnellen Klicks die langsamste Antwort, nicht die letzte, und die
Detailansicht zeigt das falsche Objekt. Das lag alles in `useArchiv()`, damit jede Komponente,
die es nutzt, den Schutz automatisch bekommt.

**Woran der Interviewer merkt, dass du es wirklich gebaut hast:** Du trennst die zwei
Mechanismen sauber (Abbruch verhindert die meisten, der monotone Zähler fängt die Nachzügler)
und weißt, dass Abbruch allein den Wettlauf nicht schließt.

---

## 7. Cache-aside und wann TTL passt

**DE:** „Erklär cache-aside. Wann ist eine TTL die richtige Wahl?"
**EN:** „Explain cache-aside. When is a TTL the right call?"

**Antwort:** Cache-aside heißt: die Anwendung fragt zuerst den Cache. Treffer, dann gib den
Wert direkt zurück. Fehltreffer, dann hole aus der langsamen Quelle, schreibe das Ergebnis in
den Cache und gib es zurück. Bei mir liegt der Schlüssel als `archiv:objekt:<id>`, der erste
Klick geht in den Tresor (`source: "netz"`, gemessen ~600 ms), der zweite liegt schon auf dem
Tisch (`source: "cache"`, gemessen unter 2 ms). Die TTL ist die Lebensdauer einer Karte auf
dem Tisch: sie begrenzt, wie alt die Daten höchstens sein dürfen. TTL passt, wenn Lesen viel
häufiger ist als Schreiben, die Quelle langsam oder teuer oder gedrosselt ist, und ein bisschen
Veralten tragbar ist. Bei Kunstwerken, die sich praktisch nie ändern, ist selbst eine großzügige
TTL sicher.

**Woran der Interviewer merkt, dass du es wirklich gebaut hast:** Du beschreibst den Fehltreffer-
Pfad in der richtigen Reihenfolge (holen, dann schreiben, dann zurückgeben) und begründest die
TTL aus deinem Datentyp, nicht als Zahl aus dem Nichts.

---

## 8. Warum ein eigener Server vor einer fremden API steht

**DE:** „Warum rufst du die fremde API nicht direkt aus dem Browser? Wozu der eigene Server?"
**EN:** „Why not call the third-party API straight from the browser? What is the server for?"

**Antwort:** Der eigene Server ist die eine Grenze, die den Browser vom Tresor trennt, und er
löst vier Probleme an einer Stelle. Erstens CORS: der Browser ruft nur meinen eigenen Ursprung
`/api` auf, Vite leitet weiter, also fällt die Herkunftssperre weg. Zweitens Kopplung: mein
Client hängt an meinem Vertrag, nicht an der rohen Form des Anbieters. Ändert der Anbieter seine
50 Felder, fange ich das an einer Stelle ab, nicht in jeder Komponente. Drittens Geheimnisse:
ein API-Schlüssel bleibt auf dem Server und landet nie im Browser-Bundle. Viertens der Cache und
die Drosselung: es gibt genau einen Ort, an dem ich messe, cache und den Zugriff begrenze. Das
ist Wheelers zusätzliche Ebene der Indirektion, und seine Warnung dazu gilt: eine gut platzierte
Ebene, nicht fünf.

**Woran der Interviewer merkt, dass du es wirklich gebaut hast:** Du zählst nicht nur CORS auf,
sondern nennst Kopplung, Geheimnisse und den Cache als eine Grenze, und du kennst Wheelers
Zusatz („nicht zu viele Ebenen").

---

## 9. View-Model gegen rohe Transportform

**DE:** „Was ist der Unterschied zwischen der Antwort der API und dem, was deine Oberfläche
bekommt?"
**EN:** „What's the difference between the API's response and what your UI receives?"

**Antwort:** Die Transportform ist das, was der Anbieter schickt: rund 50 Felder, seine Namen,
seine Lücken. Das View-Model ist das, was meine Oberfläche braucht: bei mir die Katalogkarte
`{ id, titel, kuenstler, jahr, medium, abteilung, bild }`, sieben gut benannte Felder mit
sicheren Rückfallwerten („Ohne Titel", „Unbekannt"). Die Umwandlung passiert am Server in
`toKatalogkarte()`, also sieht der Client die rohe Form nie. Der Gewinn: meine Komponenten
kennen den Anbieter nicht, sie kennen nur die Karte. Fehlt ein Feld in der Quelle, entscheidet
die Grenze über den Rückfallwert, nicht jede einzelne Komponente.

**Woran der Interviewer merkt, dass du es wirklich gebaut hast:** Du nennst die konkrete
Reduktion (rund 50 Felder auf 7) und die Funktion, die sie macht, und du platzierst die
Rückfallwerte an der Grenze.

---

## 10. Anmutiger Rückfall: Redis fällt aus

**DE:** „Dein Cache läuft auf Redis. Was passiert, wenn Redis nicht da ist?"
**EN:** „Your cache runs on Redis. What happens when Redis isn't there?"

**Antwort:** Der Server fällt auf einen In-Memory-Map-Cache mit demselben Vertrag zurück:
dieselben Methoden `get` und `set(ttl)`, dasselbe Verhalten, nur der Laufzettel meldet `map`
statt `redis`. Wichtig ist die eine Falle, die ich dabei gelernt habe: ein Verbindungsversuch
zu einem geschlossenen Port kann hängen bleiben, im Test volle zwei Minuten. Darum läuft der
Verbindungsaufbau in einem Zeitlimit (`Promise.race`, rund 1,5 Sekunden), scheitert sauber und
schreibt eine einzige Logzeile. So bootet der Server auch ohne Docker, und wer kein Redis hat,
sieht identisches Verhalten. Das ist der Punkt: den Teil der Umgebung, den ich nicht kontrolliere,
darf ich nicht zur Voraussetzung machen.

**Woran der Interviewer merkt, dass du es wirklich gebaut hast:** Du kennst die konkrete Falle
(ein toter Port hängt den Verbindungsaufbau auf) und die Lösung (begrenzter Verbindungsversuch,
gleicher Cache-Vertrag).

---

## 11. Das Zustands-Triplett: Laden, Fertig, Fehler

**DE:** „Wie modellierst du das Laden von Daten in der Oberfläche?"
**EN:** „How do you model data loading in the UI?"

**Antwort:** Als benannte Zustände, nicht als lose Flags. Bei mir ist `zustand` einer von
`idle`, `laden`, `fertig`, `fehler`. Während `laden` zeige ich ein Skeleton, das die Form der
Karte andeutet, statt einer leeren Fläche oder eines endlosen Spinners. `fehler` ist ein
eigener, gleichrangiger Zustand, kein verschluckter Fehler im `catch`. Der Vorteil eines
Zustands-Enums statt drei boolescher Variablen ist, dass unmögliche Kombinationen (gleichzeitig
laden und Fehler) gar nicht erst entstehen können. Der langsame erste Klick (~600 ms) ist genau
die Zeit, in der das Skeleton den Bildschirm ruhig hält.

**Woran der Interviewer merkt, dass du es wirklich gebaut hast:** Du sagst „ein Zustand statt
drei Flags" und behandelst den Fehler als sichtbaren Zustand, nicht als Randnotiz.

---

## 12. Wie du Performance misst

**DE:** „Du sagst, es sei schnell. Woher weißt du das? Wie misst du?"
**EN:** „You say it's fast. How do you know? How do you measure?"

**Antwort:** Zwei Messungen. Erstens der Laufzettel: jede Antwort trägt eine echte Zahl aus
`performance.now()`, gemessen am Server, und die Oberfläche zeigt sie an (tabellarische Ziffern,
damit die Zahlen ruhig stehen). Gemessen: erster Klick ~600 ms aus dem Tresor, zweiter unter
2 ms vom Tisch, das ist rund Faktor 350. Zweitens Lighthouse in den DevTools, aber gegen die
lokale Preview (`vite preview`), nicht gegen den dev-Server mit HMR, weil nur die Preview das
echte Produktions-Bundle ausliefert. Ziel war 95 oder mehr. Ich messe zuerst und cache dann,
in Knuths Worten: der langsame Tresor-Zugriff ist die kritischen 3%, dort lohnt sich der Cache,
den Rest lasse ich in Ruhe.

**Woran der Interviewer merkt, dass du es wirklich gebaut hast:** Du unterscheidest Preview von
dev-Server bei Lighthouse und nennst echte Zahlen mit ihrer Quelle (`performance.now()` im
Laufzettel), statt „fühlt sich schnell an".

---

## 13. Was `vite build` und `vite preview` erzeugen

**DE:** „Was passiert bei `vite build`, und wozu `vite preview`?"
**EN:** „What does `vite build` produce, and what is `vite preview` for?"

**Antwort:** `vite build` erzeugt den Ordner `dist/`: das gebündelte, minimierte, baum-geschüttelte
Produktions-Artefakt mit Datei-Hashes fürs Caching. Bei mir waren das 14 Module, gebaut in rund
254 ms, das JavaScript 69,46 kB (27,6 kB gzip), das CSS 5,73 kB. `vite preview` startet einen
kleinen statischen Server, der genau dieses `dist/` ausliefert, ohne HMR, ohne dev-Server-Magie.
Das ist der Zustand, den ein Nutzer bekäme, und darum messe ich Lighthouse gegen die Preview.
Der dev-Server ist zum Entwickeln, die Preview ist die Probe des echten Artefakts, lokal, ohne
Deploy.

**Woran der Interviewer merkt, dass du es wirklich gebaut hast:** Du trennst die zwei Befehle
(build erzeugt `dist/`, preview serviert `dist/`) und weißt, warum man gegen die Preview misst
und nicht gegen dev.

---

## 14. Ein Engineering-Prinzip, nach dem du arbeitest

**DE:** „Nenn mir ein technisches Prinzip, an dem du dich bei diesem Projekt orientiert hast."
**EN:** „Name an engineering principle you actually worked by on this project."

**Antwort:** Zwei, und beide sind zitierbar. Wheelers Fundamental Theorem: „We can solve any
problem by introducing an extra level of indirection." Mein Server ist genau diese Ebene, eine
Grenze, die CORS, Latenz und die Kopplung an die rohe Form des Anbieters auf einmal auflöst. Und
Wheelers Zusatz gehört dazu: „…except for the problem of too many layers of indirection", also
eine gut platzierte Ebene, nicht fünf. Das zweite ist Knuth: „premature optimization is the root
of all evil … yet we should not pass up our opportunities in that critical 3%." Übersetzt in mein
Bauwerk: ich habe erst gemessen (der Laufzettel), den einen langsamen Tresor-Zugriff als die
kritischen 3% erkannt und genau dort gecacht, statt überall zu mikro-optimieren.

**Woran der Interviewer merkt, dass du es wirklich gebaut hast:** Du zitierst beide Sätze korrekt,
inklusive Wheelers Zusatz, und bindest jeden an eine konkrete Entscheidung in deinem Code (die eine
Grenze, das Messen vor dem Cachen).
