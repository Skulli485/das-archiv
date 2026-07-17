# Das Archiv: Woche 2, Liefertag (Wochenend-Bauwerk)

Eine Sammlungs-Ansicht mit einer echten Server-Grenze und einem Cache. Frontend in
Vue 3.5, die Grenze als Bun-Server, davor ein Cache (In-Memory-Map als Grundlage,
Redis optional), dahinter eine echte, schlüssellose Datenquelle. Gebaut und lokal
bewiesen, ohne Deploy.

Neu hier? Lies zuerst [`START_HIER.md`](START_HIER.md).

**Visitenkarte:** [civic-lagoon-6xr9.here.now](https://civic-lagoon-6xr9.here.now/) —
eine statische Projekt-Übersicht mit Stack und den gemessenen Zahlen. Die App selbst
läuft ohne Deploy, wie in der Aufgabenstellung vorgesehen; die Seite ersetzt die
fehlende Live-URL, kein separat gehosteter Client.

## Was drin ist
```
aufgaben/        das Projekt: 7 Stufen, jede mit Test und Nachweis
konzepte/        6 Erklärer (im Browser öffnen) + index.html + spickzettel.md
fingeruebungen/  4 kurze Übungen zur Woche (Vertrag, Aufräumen, Composable, Auftritt)
quiz/            das große Wochen-Quiz, 24 Fragen, korrigiert sich selbst
karriere/        Bewerbungsfragen der Woche, Projekt-Geschichte, Repo als Visitenkarte
starter/         startklares Zwei-Prozess-Chassis (Server + Client + Proxy)
START_HIER.md    der Einstieg (das Paket in einem Blick)
ABGABE.md        was zählt und bis wann
```
Kein Stundenplan: das Projekt ist der Anker, alles andere liegt frei daneben.

## Das System in einem Bild
```
Browser (Vue)  ->  /api  ->  Bun-Server (Grenze)  ->  Cache  ->  fremde Quelle
```
Der Browser kennt nur `/api`. Vite leitet an den Server weiter, im dev-Server und in der
Preview. Darum nie CORS. Der Server normalisiert die rohe Antwort auf eine Katalogkarte
und antwortet immer in derselben Form.

## Der Vertrag der Grenze
```
GET /api/health       -> { ok: true, cache: "map" | "redis" }
GET /api/galerie      -> { ids: number[] }
GET /api/objekt/:id   -> { source: "netz" | "cache", ms, ttl, data }
```
`data` ist die Katalogkarte mit deinen 5 bis 7 gut benannten Feldern, nie die rohe
Transportform.

## Datenquellen (schlüssellos, vorher prüfen)
Wähle eine und prüfe sie mit echten Anfragen, bevor du baust. Diese drei sind mit
echten Anfragen geprüft, Daten und Bild:

| Quelle | Thema | Einzelobjekt |
|---|---|---|
| Met Museum | Kunst | `https://collectionapi.metmuseum.org/public/collection/v1/objects/436535` |
| TheMealDB | Rezepte | `https://www.themealdb.com/api/json/v1/1/lookup.php?i=52772` |
| PokéAPI | Kreaturen | `https://pokeapi.co/api/v2/pokemon/1` |

Auch möglich: **Art Institute of Chicago** (`https://api.artic.edu/api/v1/artworks/27992?fields=id,title,artist_display,date_display,medium_display,image_id,department_title`),
thematisch nah am Archiv. Die Daten-API läuft, der Bildhost antwortet je nach Netz aber
mit `403`. Prüfe das Bild zuerst im Browser, bevor du dich festlegst.

Nicht dabei: REST Countries. Die frei nutzbare Version ist abgekündigt und antwortet mit
einer Fehlermeldung. Genau darum die Regel, jede Quelle vorher zu prüfen.

## Start
```bash
# Grenze
cd starter/server && bun start          # Port 3000

# Client
cd starter/client && bun install && bun run dev   # Port 5173
```

## Redis ist optional
Ohne Docker läuft der Cache mit einer In-Memory-Map. Wer Redis mag, startet einen
Wegwerf-Container auf Port 6380 (nie die echte 6379):
```bash
docker run -d --rm -p 6380:6379 --name archiv_redis redis:alpine
```
Ein geschlossener Port hängt den Server nicht auf: jeder Redis-Aufruf läuft in einem
Zeitlimit, danach fällt der Server auf die Map zurück. Der Vertrag bleibt gleich, nur
der Laufzettel meldet `map` statt `redis`.

## Werkzeug
Bun als Laufzeit. Client per `bun create vite . --template vue`. Keine zusätzlichen
Pakete. Editor ist Claude Code.
