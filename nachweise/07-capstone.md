# Nachweis 07: Capstone

## Was wurde gebaut

### 1. Such-Endpunkt (`GET /api/suche?q=...`)
Der Server ruft die Met Museum Search API auf und gibt eine Liste kleiner Karten zurück
(`id`, `titel`, `kuenstler`, `bild`), in derselben Vertragsform wie die Galerie.
Der Client hat ein `SuchForm` mit Debounce (350ms) und Triple-Zustand.

### 2. Frisch laden (`?frisch=1`)
Ein Query-Parameter am Objekt-Endpunkt umgeht den Cache.
Die `source` wird zu `"frisch"` statt `"netz"`. Der Cache wird danach aktualisiert.

## Grenz-Entscheidung
- Die Suche ruft die Met Search API auf, bildet die rohe Antwort aber auf kleine Karten ab
  (nur `id`, `titel`, `kuenstler`, `bild`). Keine rohen Felder wie `objectBeginDate`
  oder `classification` überqueren die Grenze.
- `?frisch=1` ist ein Flag am Endpunkt, kein separater Pfad. Die Vertragsform bleibt
  gleich (`{ source, ms, ttl, data }`), nur die `source` unterscheidet sich (`"frisch"`).
- Das Such-UI nutzt dasselbe `useX`-Muster (AbortController + Anfrage-Nummer) wie die
  Detail-Karte. Konsistenz über die Grenze.

## Test
```
# Suche
curl "http://localhost:3000/api/suche?q=sunflowers"
→ { "query": "sunflowers", "ergebnisse": [{ "id": 436535, ... }] }

# Frisch laden
curl "http://localhost:3000/api/objekt/436535?frisch=1"
→ { "source": "frisch", "ms": 580.2, "ttl": 60, "data": { ... } }
```
