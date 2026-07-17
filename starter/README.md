# Das Archiv – Starter

Eine Vue 3 + Bun-Anwendung mit Cache-Aside (Redis mit In-Memory-Fallback).
Datenquelle: Met Museum Collection API.

## Start

Zwei Terminals:

```bash
# Terminal 1: Server (Grenze auf Port 3000)
cd server
bun install
bun start

# Terminal 2: Client (Vite auf Port 5173)
cd client
bun install
bun run dev
```

Browser: http://localhost:5173

## Redis (optional)

Der Server verbindet sich automatisch mit Redis auf Port 6380.
Ohne Redis läuft alles mit einer In-Memory-Map (gleicher Vertrag).

Redis starten (Wegwerf-Container, nicht Port 6379):

```bash
docker run -d --rm -p 6380:6379 --name archiv_redis redis:alpine
```

Prüfen:

```bash
redis-cli -p 6380 ping   # → PONG
```

Der Server meldet beim Start:
- `[cache] Redis @ redis://localhost:6380` (mit Redis)
- `[cache] map (Redis nicht erreichbar: ...)` (ohne Redis)

## Produktions-Build

```bash
cd client
bun run build      # erzeugt dist/
bun run preview    # serviert dist/ auf Port 4173
```

## API-Endpunkte

| Endpunkt | Beschreibung |
|---|---|
| `GET /api/health` | `{ ok, dienst, cache, zeit }` |
| `GET /api/galerie` | `{ ids: [...] }` – kuratierte Met-Objekte |
| `GET /api/objekt/:id` | `{ source, ms, ttl, data }` – Cache-Aside |
| `GET /api/objekt/:id?frisch=1` | Cache-Bypass, `source: "frisch"` |
| `GET /api/suche?q=...` | `{ query, ergebnisse: [...] }` – Met-Suche |

## Vertrag

Jede Objekt-Antwort hat dieselbe Form:

```json
{
  "source": "netz" | "cache" | "frisch",
  "ms": 325.7,
  "ttl": 60,
  "data": { "id": 436535, "titel": "...", "kuenstler": "...", ... }
}
```
