# Start hier

Willkommen im Archiv. Am Freitag ist die ganze Woche in einem kleinen System
zusammengelaufen: eine Sammlungs-Ansicht mit einer echten Server-Grenze und einem
Cache davor. Dieses Repo ist dein Wochenpaket dazu: ein Projekt im Zentrum, und
drumherum die ganze Woche zum Festigen, Spielen und Mitnehmen.

Es gibt keinen Stundenplan und keine Tagesliste. Du gehst frei durch, in deiner
Reihenfolge und deinem Tempo, bis zur Abgabe am Dienstagmorgen. Nur das Projekt ist
der Anker: es ist das, was der Klient bekommt.

## Das Paket in einem Blick

| Raum | Was dort liegt | Wann es passt |
|---|---|---|
| **Das Projekt** ([`aufgaben/`](aufgaben/)) | Die Klienten-Bestellung: dein eigener Sammlungs-Betrachter mit Server-Grenze und Cache, in sieben Stufen | Das Herzstück, am besten in Ruhe und in Reihe |
| **Konzepte** ([`konzepte/index.html`](konzepte/index.html)) | Sechs Erklärer zu den Mustern des Projekts, plus Spickzettel | Vor oder neben den Aufgaben, zum Nachschlagen |
| **Fingerübungen** ([`fingeruebungen/`](fingeruebungen/)) | Vier kurze Übungen zu Vertrag, Aufräumen, Composable und Auftritt | Zwischendurch, je etwa zwanzig Minuten |
| **Das große Quiz** ([`quiz/DAS_GROSSE_WOCHENQUIZ.html`](quiz/DAS_GROSSE_WOCHENQUIZ.html)) | 24 Fragen über alle vier Tage, korrigiert sich selbst, mit Rängen | Wann immer du magst, gern mehrfach |
| **Karriere-Ecke** ([`karriere/`](karriere/)) | Die Bewerbungsfragen dieser Woche mit Antworten, deine Projekt-Geschichte, das Repo als Visitenkarte | Wenn das Projekt steht, als Ernte |

## Der Auftrag
Ein Kunde der Agentur wünscht sich eine **Sammlungs-Ansicht** (collection viewer).
Die Datenquelle ist langsam und weit weg. Deine Aufgabe ist die Grenze dazwischen:

```
Vue 3.5 (Frontend)  ->  Bun-Server (die Grenze)  ->  Cache  ->  eine echte Quelle
```

Der Browser spricht nur mit `/api`. Der Server holt aus der Quelle, normalisiert auf
eine kleine Katalogkarte und merkt sich, was er schon geholt hat. Redis ist optional:
ohne Docker läuft alles mit einer In-Memory-Map, gleicher Vertrag. Das System wird
lokal gebaut und lokal bewiesen, wie am Liefertag. Kein Deploy.

## Die Frage, die alles trägt
> „Wer besitzt diese Grenze, und was überquert sie?"

## Ein guter Weg hinein (kein Muss, nur ein Vorschlag)
Öffne die Konzepte im Browser und lies die ersten zwei. Wähle deine Datenquelle und
prüfe sie mit echten Anfragen (Aufgabe 01), das entscheidet alles Weitere. Dann trägt
dich das Projekt von Stufe zu Stufe. Das Quiz und die Fingerübungen sind deine Pausen,
die Karriere-Ecke ist die Ernte am Ende. **Abgabe:** siehe [`ABGABE.md`](ABGABE.md).

## Werkzeug
Editor ist Claude Code. Laufzeit ist Bun. Der Client wird mit
`bun create vite . --template vue` erstellt (der Punkt steht für den aktuellen Ordner).
Keine zusätzlichen Pakete: kein axios, kein VueUse, kein Tailwind. Der Server nutzt
`fetch` und (optional) den eingebauten Redis-Client von Bun, sonst nichts.

## Das startklare Chassis in einem Blick
```bash
# Terminal 1
cd starter/server && bun start        # Grenze auf Port 3000

# Terminal 2
cd starter/client && bun install && bun run dev   # Client auf Port 5173
```
Der Client zeigt dann, ob die Grenze erreichbar ist. Von hier aus baust du weiter.
