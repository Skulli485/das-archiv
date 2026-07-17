# Abgabe

## Wann
Dienstag, 21.07.2026, 09:00 (Start Woche 3). Der Termin ist abstimmbar, falls die
Gruppe etwas anderes braucht.

## Wie
Du baust in deinem **eigenen** Repo. Dieses Repo hier ist die Vorlage zum Nachlesen
(du bist als Mitarbeiter eingeladen und kannst es klonen). Im Standup öffnen wir zwei
bis drei Repos live und sehen uns das laufende System an, in derselben Form wie gewohnt.
Zeig in 90 Sekunden: ein Miss dann Hit, eine Grenz-Entscheidung, `git log --oneline`.
Und bring deinen Kurator-Moment mit: das eine Objekt aus deiner Sammlung, das du
behalten würdest, mit einem Satz warum.

## Was frei bleibt
Gewertet wird nur das Projekt (die Tabelle unten). Quiz, Fingerübungen und
Karriere-Ecke sind dein Gewinn, nicht dein Soll: kein Nachweis nötig. Wer mag, nennt
im Standup seinen Quiz-Rang oder bringt seine 90-Sekunden-Projektgeschichte aus der
Karriere-Ecke mit, beides hat dort seinen natürlichen Auftritt.

## Was zählt
Bewertet wird, was tatsächlich im Repo liegt und läuft, nicht was gemeint war.

| Bereich | Woran es sich zeigt |
|---|---|
| Aufbau bootet | `bun install && bun run build` im Client läuft ohne Fehler. |
| Die Grenze trägt | `GET /api/objekt/:id` liefert `{ source, ms, ttl, data }`, `data` hat nur deine Felder, keine rohe Transportform. |
| Cache-aside beweisbar | Erster Aufruf `netz`, zweiter `cache` mit kleinerer ms. `GET /api/health` meldet den Modus. |
| Das Triple und die Wächter | Vier Zustände im UI. Neue Anfrage bricht die alte ab. Veraltete Antwort überschreibt nichts. |
| Galerie und Detail | Raster, Klick, Detailkarte mit Übergang, Platzhalter und Laufzettel. Tastatur und 390px sitzen. |
| Liefertag | `bun run build`, Preview, Lighthouse-Leistung mindestens 95 gegen die Preview, `git log` als Faden. |
| Capstone | Eine eigene Erweiterung, die die Vertragsform hält, mit einem Satz zur Grenz-Entscheidung. |
| Nachweise | `nachweise/01..07-*.md` liegen vor und zeigen echte Ausgaben. |

## Die Nachweise
Lege im Lauf der Aufgaben einen Ordner `nachweise/` an und darin je Aufgabe eine kurze
Datei. Sie enthält echte Ausgaben (curl-Antworten, ms-Werte, die Lighthouse-Zahl, das
`git log`), nicht Beschreibungen von Absichten. Das ist dein Beleg, dass es trägt.

## Git-Historie
Ein Commit je Stufe, nicht ein einziger großer Commit. Die Historie soll sich lesen
lassen wie der Weg durch die sieben Aufgaben. Deutsche, sachliche Commit-Titel.

## Reicht das ohne Redis?
Ja. Der Cache läuft auf der In-Memory-Map vollständig. Redis ist eine freiwillige
Zugabe, keine Voraussetzung. Wer es baut, weist den Rückfall auf die Map nach.
