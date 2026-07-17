# Spickzettel: Das Archiv

Eine Seite zum Danebenlegen. Die Muster, nicht die fertige Lösung.

## Die Grenze in einem Bild
```
Browser (Vue)  ->  /api  ->  Bun-Server (Grenze)  ->  Cache  ->  fremde Quelle
     Leser              Vite-Proxy    Lesetisch       Gedächtnis     Tresor
```
Der Browser kennt nur `/api`. Vite leitet weiter, im dev-Server und in der Preview.
Darum nie CORS.

## Der Vertrag der Grenze
```
GET /api/health       -> { ok: true, cache: "map" | "redis" }
GET /api/galerie      -> { ids: number[] }
GET /api/objekt/:id   -> { source: "netz" | "cache", ms, ttl, data }
                         data = Katalogkarte (deine 5 bis 7 Felder)
Fehler der Quelle     -> Status 502, { error }
```

## Die Katalogkarte (Beispiel Kunst)
```
{ id, titel, kuenstler, jahr, medium, abteilung, bild }
```
Bedeutungstragende Namen, deutsche Feldnamen, sichere Ersatzwerte
(`"Ohne Titel"`, `"Unbekannt"`, `""`). Nie die rohen Quell-Felder nach vorne.

## Cache-aside (Server)
```
key = `archiv:objekt:${id}`
treffer = cache.get(key)
  Treffer   -> { source: "cache", ms, ttl, data }         (schnell)
  Fehltreffer -> data = holeAusQuelle(id)
                cache.set(key, JSON, TTL)
                { source: "netz", ms, ttl: TTL, data }     (langsam)
ms mit performance.now() messen.
```

## Zwei Speicher, eine Schnittstelle
```
cache: { get(k), set(k, v, ttl), ttl(k), mode }
  Redis erreichbar  -> mode "redis"
  sonst             -> In-Memory Map, mode "map"
```
Stolperstein: `RedisClient.connect()` auf einen zu Port hängt. Jeder Redis-Aufruf in
ein Zeitlimit (`Promise.race`, rund 1,5 s). Scheitert es: Rückfall auf die Map, eine
Zeile `[cache] Redis nicht erreichbar (...) -> In-Memory Map`.

## Das Composable (Client)
```
zustand: idle | laden | fertig | fehler
Wächter 1: AbortController  -> neue Anfrage bricht die alte ab, onUnmounted bricht ab
Wächter 2: lauf = ++zähler -> nach dem await: if (meine !== lauf) return
Rückgabe: { zustand, karte, meta, laden }   meta = { source, ms, ttl }
```

## Zustände im UI
| zustand | was der Nutzer sieht |
|---|---|
| idle | ruhiger Hinweis |
| laden | Platzhalter (Skeleton) |
| fertig | die Karte plus Laufzettel |
| fehler | kurze Meldung |

## Der Laufzettel (Badge)
- `netz` in Messing: „aus dem Tresor · {ms} ms"
- `cache` in Patina: „vom Tisch · {ms} ms · TTL {ttl}s"
- ms in Ziffern gleicher Breite (`tabular-nums`).

## Datenquellen (schlüssellos, vorher prüfen)
| Quelle | Einzelobjekt |
|---|---|
| Met Museum | `.../public/collection/v1/objects/436535` |
| Art Institute of Chicago | `.../api/v1/artworks/27992?fields=id,title,artist_display,date_display,medium_display,image_id,department_title` |
| TheMealDB | `.../api/json/v1/1/lookup.php?i=52772` |
| PokéAPI (Zusatz) | `.../api/v2/pokemon/1` |

## Befehle
```bash
cd server && bun start        # Grenze, Port 3000
cd client && bun run dev      # Client, Port 5173
cd client && bun run build    # dist/
cd client && bun run preview  # Preview, Port 4173
git log --oneline             # der Faden der Arbeit
```

## Barrierefreiheit und Leistung
`loading="lazy"` an Bildern; feste `width` und `height` (kein Layout-Sprung); `alt` aus
Titel und Urheber; Kacheln fokussierbar (`tabindex`, Enter und Leertaste); sichtbarer
Fokusring; `prefers-reduced-motion` beachten; `tabular-nums` für die ms.
