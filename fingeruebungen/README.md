# Fingerübungen

Vier kurze Übungen, je etwa zwanzig Minuten. Sie gehören zu keiner Reihenfolge und zu
keinem Tag: nimm eine, wenn du zwischendurch Zeit hast oder den Kopf vom Projekt lösen
willst. Jede wiederholt einen Griff aus der Woche, an einem kleinen, frischen Beispiel.

Alle vier laufen im Starter-Client (`starter/client`) oder in einem eigenen
Wegwerf-Projekt (`bun create vite . --template vue`). Kein Server nötig.

---

## 1 · Der Vertrag (Komponenten-Grenze)

**Griff aus der Woche:** eine Komponente ist eine Grenze mit Besitzer und Vertrag.

Baue ein `EditierbaresFeld.vue`: ein Label, ein Input, innen mit `defineModel()`.
Der Elternteil bindet es mit `v-model="name"` und zeigt `name` daneben live an.

Dann der Gegenversuch: gib dem Feld zusätzlich ein Objekt-Prop `person` und ändere im
Kind direkt `person.stadt`. Beobachte: kein Fehler, keine Warnung, und der Elternteil
ist trotzdem verändert. Genau das ist die stille Falle vom Dienstag. Repariere es:
lokale Kopie im Kind, Änderung als Ereignis nach oben, der Besitzer entscheidet.

**Beweis:** v-model synchron in beide Richtungen; die Objekt-Mutation erst gezeigt,
dann repariert; ein Satz im Commit, was der Vertrag des Feldes ist.

---

## 2 · Das Aufräumen (Lebenszyklus)

**Griff aus der Woche:** alles, was startet, muss sauber enden.

Baue eine `LiveUhr.vue`: `setInterval` in `onMounted` schreibt jede Sekunde die
Uhrzeit in ein `ref` und zählt in `console.log` mit. Der Elternteil blendet die Uhr
mit einem Schalter per `v-if` ein und aus.

Erst ohne Aufräumen: Uhr ausblenden, Konsole offen lassen. Der Zähler tickt weiter,
das Bauteil ist weg, der Timer lebt. Das ist ein Leck. Dann `clearInterval` in
`onUnmounted` ergänzen und denselben Versuch wiederholen.

**Beweis:** vorher tickt die Konsole nach dem Ausblenden weiter, nachher ist sie still.
Zwei Commits: einer mit Leck, einer mit Aufräumen.

---

## 3 · Das Werkzeug (Composable)

**Griff aus der Woche:** ein Composable ist eine Funktion, die Reaktivität besitzen
darf; ihr Rückgabewert ist ihr Vertrag.

Ziehe die Logik der LiveUhr in `src/composables/useUhrzeit.js` heraus: das `ref`, der
Timer, das Aufräumen, zurück kommt `{ uhrzeit }`. Die Komponente wird drei Zeilen kurz.

Dann das Experiment vom Donnerstag: verschiebe das `ref` aus der Funktion hinaus auf
Modulebene und montiere die Uhr zweimal. Beide zeigen jetzt denselben Zustand. Schiebe
es zurück in die Funktion und sie leben wieder getrennt. Wo der Zustand wohnt,
entscheidet, wem er gehört.

**Beweis:** Komponente nutzt nur noch das Composable; ein Satz im Commit, was
Modulebene gegenüber Funktionsebene ändert.

---

## 4 · Der Auftritt (Übergänge)

**Griff aus der Woche:** Zustandswechsel darf man sehen.

Baue eine `StatusZeile.vue`: ein Wort wechselt per Knopf durch `wartet`, `lädt`,
`fertig`. Lege `<Transition mode="out-in">` darum und gib dem `<span>` ein
`:key="status"`, damit jeder Wechsel den Auftritt neu spielt: altes Wort sanft raus,
neues sanft rein. Halte die Dauer unter dreihundert Millisekunden und respektiere
`prefers-reduced-motion`.

**Beweis:** der Wechsel ist sichtbar weich statt hart; ohne `:key` zeigt derselbe Code
keinen Neustart, probiere beides.
