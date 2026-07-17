# Aufgabe 06: Liefertag: fertigstellen und beweisen

> Konzept dazu: [`konzepte/06-liefertag-ritus.html`](../konzepte/06-liefertag-ritus.html)

## Ziel
Das System ist fertig und lokal bewiesen. Kein Deploy, kein Hosting. Der Beweis liegt
im gebauten Artefakt, in der Preview, in Lighthouse, auf 390px, an der Tastatur und in
der Git-Historie.

## Konzept
Liefertag heißt fertigstellen und beweisen. Ein Fremder soll dein Repo klonen, zweimal
`bun install` tippen und in wenigen Minuten dasselbe sehen wie du. Die Beweise sind
lokal und überprüfbar.

## Beispiel
Die Reihenfolge (zwei Terminals):

```bash
# Terminal 1: die Grenze läuft
cd server && bun start

# Terminal 2: bauen und die echte Preview servieren
cd client
bun run build          # erzeugt dist/
bun run preview        # serviert dist/ lokal, Proxy /api läuft mit
```
Danach Lighthouse in den DevTools gegen die Preview laufen lassen (nicht gegen den
dev-Server).

## Aufgabe
1. `bun run build` im Client: das Produktions-Artefakt `dist/` entsteht ohne Fehler.
2. `bun run preview`: die Preview serviert `dist/`, der Proxy leitet `/api` weiter, die
   Grenze läuft dazu.
3. Lighthouse in den DevTools gegen die Preview: Leistung mindestens 95.
4. 390px-Kontrolle in der Geräte-Ansicht: kein waagerechtes Scrollen.
5. Tastatur-Durchgang: nur mit Tab und Enter durch Galerie und Detail, sichtbarer Fokusring.
6. `README.md` schreiben: wie man beide Prozesse startet, der Hinweis auf Wegwerf-Redis
   (Port 6380) und der Hinweis auf den Map-Rückfall.
7. Git-Historie ordnen: ein Commit je Stufe, nicht ein einziger Riesen-Commit.
   `git log --oneline` liest sich als Faden der Arbeit.

## Akzeptanzkriterien
- [ ] `bun run build` läuft ohne Fehler, `dist/` entsteht.
- [ ] Die Preview zeigt das gebaute System, `/api` funktioniert über den Proxy.
- [ ] Lighthouse-Leistung gegen die Preview mindestens 95.
- [ ] Auf 390px kein waagerechtes Scrollen.
- [ ] Vollständig per Tastatur bedienbar.
- [ ] `README.md` erklärt Start, Redis-Hinweis und Map-Rückfall.
- [ ] `git log --oneline` zeigt mehrere zusammenhängende Commits.

## So testest du
- Lighthouse: DevTools, Reiter Lighthouse, Modus „Navigation", gegen `http://localhost:4173`.
- 390px: DevTools Geräte-Ansicht auf 390px Breite.
- Tastatur: Maus weglegen, nur Tab und Enter.
- Historie: `git log --oneline` im Repo.

## Nachweis
Ergänze `nachweise/06-liefertag.md` mit:
- der Lighthouse-Leistungszahl (Screenshot oder Wert),
- der Ausgabe von `git log --oneline`,
- einem Satz dazu, was `bun run build` gemeldet hat (Modulzahl, Größe).
