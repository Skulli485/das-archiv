# Das Repo als Visitenkarte, ohne Deploy

Ein Repo kann für dich sprechen, bevor jemand eine Zeile Code liest. Ohne Deploy, ohne
Live-URL: der Aufbau, die README und der git-Verlauf argumentieren schon. Diese Datei zeigt,
wie dein Wochenend-Archiv sich wie eine Visitenkarte liest.

Wer das Repo öffnet, entscheidet in zwanzig Sekunden am oberen Teil der README. Also gehört
dort das Wichtigste hin, nicht die Installationsanleitung.

---

## 1. Der Kopf der README (die ersten zwanzig Sekunden)

Fünf Blöcke, in dieser Reihenfolge, direkt unter dem Titel:

```markdown
# Sammlungs-Betrachter <deine Quelle>

Ein Raster von Objekten aus <deine Quelle>, Klick öffnet die Detailkarte. Der Browser
kennt nur den eigenen Server als Grenze; davor ein Cache, dahinter die fremde Quelle.
Gebaut und lokal bewiesen, ohne Deploy.

## Was es ist
Sammlungs-Betrachter: Raster, Detailansicht, ein Server als Grenze mit Cache-aside.
Die vier Ladezustände, Wettlauf-Schutz bei schnellem Klicken, anmutiger Rückfall,
wenn Redis fehlt.

## Stack
Vue 3.5 · Vite 8 · Bun (Server + Laufzeit) · Cache: Redis optional, sonst In-Memory-Map.
Keine zusätzlichen Pakete, handgeschriebenes CSS.

## So läuft es lokal
    cd server && bun start          # Grenze, Port 3000
    cd client && bun install && bun run dev   # Client, Port 5173
Redis ist optional; ohne Docker läuft der Cache auf einer Map, der Vertrag bleibt gleich.

## Screenshot
![Detailkarte mit Laufzettel](docs/screenshot.png)

## Die gemessenen Zahlen
Erster Klick <~600 ms> aus der Quelle, zweiter <unter 2 ms> aus dem Cache (Faktor ~350).
Build: <14> Module, JS <69,46 kB> (gzip <27,6 kB>). Lighthouse gegen lokale Preview: <95+>.
```

Der Screenshot ersetzt die fehlende Live-URL. Ein Bild reicht: die Detailkarte mit dem
sichtbaren Laufzettel (`vom Tisch · 1.8 ms · TTL 60s`). Leg es als `docs/screenshot.png`
ab und verlinke es relativ, dann zeigt GitHub es direkt an. Die gemessenen Zahlen sind der
Teil, den die meisten Repos weglassen; genau darum fallen sie auf.

---

## 2. Der git-Verlauf als Nachweis der Arbeit

Ein sauberer Verlauf ist ein Beweis: er zeigt, dass du in Schritten gedacht hast und jeder
Schritt für sich lief. Ein Commit pro Stufe, und die Nachricht benennt die Entscheidung,
nicht die Datei. So liest sich ein guter Verlauf:

```
$ git log --oneline
a1b2c3d  Liefertag-Beweis: build + preview, Lighthouse gegen lokale Preview
e4f5a6b  Galerie: Raster zu Detail, Wettlauf-Schutz per monotonem requestId
7c8d9e0  Cache-aside mit TTL, Rueckfall auf In-Memory-Map bei totem Redis-Port
1a2b3c4  Grenze: Server normalisiert ~50 Felder auf die Katalogkarte
5d6e7f8  Geruest: zwei Prozesse, Vite-Proxy /api auf den Server
```

Was diese Nachrichten richtig machen:
- Sie nennen die **Entscheidung** („Rückfall auf Map bei totem Port"), nicht die Mechanik
  („index.js geändert").
- Eine Stufe pro Commit: Gerüst, Grenze, Cache, Galerie, Beweis. Der Verlauf erzählt genau
  den Bogen aus deiner Projekt-Geschichte.
- Keine Sammel-Commits wie „wip" oder „fixes". Wer den Verlauf liest, sieht die Reihenfolge
  deiner Gedanken.

Ein Tipp: baue in der Reihenfolge, in der du erzählst, und committe am Ende jeder Stufe. Dann
entsteht der saubere Verlauf von selbst, nicht als Nacharbeit.

---

## 3. Wie du das Repo verlinkst und vorstellst

**In einem Lebenslauf (eine Zeile):**

> Sammlungs-Betrachter (Vue 3.5, Bun-Server, Cache-aside): eine Server-Grenze normalisiert
> eine fremde API und cached sie, gemessen ~600 ms auf unter 2 ms. github.com/<name>/<repo>

Die Zeile trägt eine Zahl und eine Entscheidung, nicht nur Technologien. Das ist der
Unterschied zu „Vue-Projekt mit API".

**Im Chat, wenn ein:e Recruiter:in fragt** (EN: „Do you have something you can show me?"):

> Klar. Ein kleiner Sammlungs-Betrachter mit einem eigenen Server als Grenze und Cache-aside
> davor: <repo-link>. Die README oben hat den Aufbau, einen Screenshot und die gemessenen
> Zahlen. Läuft lokal mit zwei Befehlen; eine öffentliche URL kommt später, das Repo selbst
> zeigt schon, was drin steckt.

Kurz, ein Link, und der Verweis auf den Kopf der README. Kein Absatz Selbstlob.

**Beim Durchgehen im Gespräch:** öffne die README, dann den git-Verlauf (`git log --oneline`),
dann eine Datei, die eine Entscheidung trägt (`useArchiv.js` für den Wettlauf-Schutz oder
`server/index.js` für den Rückfall auf die Map). Drei Ansichten, drei Minuten.

---

## 4. Eine klare Notiz zur fehlenden URL

Schreib unten in die README einen Satz, der die fehlende Live-URL einordnet, statt sie zu
verstecken:

> Noch ohne öffentliche URL: dieses Bauwerk wurde lokal fertiggestellt und bewiesen (Build,
> Preview, Lighthouse, git-Verlauf). Das öffentliche Ausrollen folgt später im Kurs. Der
> Aufbau, die Zahlen und der Verlauf argumentieren schon.

Das ist keine Entschuldigung, sondern eine Einordnung. Ein Repo, das lokal sauber baut, mit
echten Zahlen und einem lesbaren Verlauf, sagt einem erfahrenen Blick mehr als eine hastig
ausgerollte Demo ohne Messung. Die URL kommt, wenn sie dran ist.
