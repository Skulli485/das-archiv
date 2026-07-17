# Aufgabe 04: Das Gedächtnis: Cache-aside mit TTL

> Konzepte dazu: [`konzepte/03-cache-aside-ttl.html`](../konzepte/03-cache-aside-ttl.html) und [`konzepte/04-graceful-degradation.html`](../konzepte/04-graceful-degradation.html)

## Ziel
Der Server merkt sich, was er schon geholt hat. Der erste Aufruf einer Nummer geht in
die Quelle (langsam, `source: 'netz'`), der zweite kommt aus dem Gedächtnis (schnell,
`source: 'cache'`). Redis ist optional: ohne Docker läuft alles mit einer In-Memory-Map,
gleicher Vertrag.

## Konzept
Cache-aside heißt: erst im Gedächtnis nachsehen, nur bei einem Fehltreffer in die
Quelle, dann die Antwort ablegen. Ein TTL (Gültigkeitsdauer) sagt, wie lange eine Karte
liegen bleibt. Der Cache hat eine kleine Schnittstelle (`get`, `set(ttl)`, `ttl`) mit
zwei möglichen Umsetzungen dahinter: Redis, wenn erreichbar, sonst eine Map. Der Rest
des Servers merkt davon nichts.

## Beispiel
Die Schnittstelle und der Cache-aside-Ablauf (Muster, nicht die Lösung):

```js
// cache: { get(k), set(k, v, ttl), ttl(k), mode }

async function karte(id) {
  const key = `archiv:objekt:${id}`
  const t0 = performance.now()
  const treffer = await cache.get(key)
  if (treffer) {
    const ttl = await cache.ttl(key)
    return { source: 'cache', ms: +(performance.now() - t0).toFixed(1), ttl, data: JSON.parse(treffer) }
  }
  const data = await holeAusQuelle(id)         // aus Aufgabe 02
  await cache.set(key, JSON.stringify(data), TTL)
  return { source: 'netz', ms: +(performance.now() - t0).toFixed(1), ttl: TTL, data }
}
```

Die Map-Umsetzung ist klein: ein `Map` von Schlüssel auf `{ v, exp }`, wobei `exp` der
Ablaufzeitpunkt ist. Beim `get` prüfst du, ob `exp` schon vorbei ist.

Wenn du Redis versuchst, denke an den Stolperstein aus Konzept 04: `RedisClient.connect()`
auf einen geschlossenen Port hängt. Jeder Redis-Aufruf gehört in ein Zeitlimit
(`Promise.race` mit rund 1,5 s). Scheitert es, fällt der Server auf die Map zurück und
schreibt genau eine Zeile: `[cache] Redis nicht erreichbar (...) -> In-Memory Map`.

## Aufgabe
1. Baue die Cache-Schnittstelle mit einer **Map** als Speicher: `get`, `set(key, value, ttl)`,
   `ttl(key)`. Achte auf den Ablauf per TTL.
2. Verdrahte Cache-aside in `karte(id)`: Schlüssel bilden, `get`, bei Treffer
   `source: 'cache'`, bei Fehltreffer holen, ablegen, `source: 'netz'`.
3. Erweitere `GET /api/health` auf `{ ok, cache: <"map" | "redis"> }`.
4. Optional (Redis): baue die zweite Umsetzung mit Wegwerf-Redis auf Port 6380
   (`docker run -d --rm -p 6380:6379 --name archiv_redis redis:alpine`). Jeder Aufruf im
   Zeitlimit. Scheitert die Verbindung, fällt der Server auf die Map zurück, mit der
   einen Log-Zeile. Der Vertrag bleibt in beiden Fällen gleich.

## Akzeptanzkriterien
- [ ] Erster Aufruf einer Nummer: `source: 'netz'`, mehrere hundert ms.
- [ ] Zweiter Aufruf derselben Nummer innerhalb des TTL: `source: 'cache'`, deutlich kleinere ms.
- [ ] Nach Ablauf des TTL: wieder `source: 'netz'`.
- [ ] `GET /api/health` meldet den aktiven Cache-Modus.
- [ ] Ohne Redis läuft alles mit der Map, ohne Aenderung am übrigen Code.
- [ ] Falls Redis versucht wird: ein geschlossener Port hängt den Server nicht auf (Zeitlimit greift), und die Rückfall-Zeile erscheint genau einmal.

## So testest du
```bash
# zweimal dieselbe Nummer
curl "http://localhost:3000/api/objekt/DEINE_ID"   # source netz, ~hunderte ms
curl "http://localhost:3000/api/objekt/DEINE_ID"   # source cache, wenige ms

curl "http://localhost:3000/api/health"            # { ok, cache }

# optional Redis: starten, testen, stoppen und Rückfall sehen
docker run -d --rm -p 6380:6379 --name archiv_redis redis:alpine
docker stop archiv_redis
```
Nach `docker stop` startest du den Server neu: er meldet den Rückfall auf die Map und
läuft weiter.

## Nachweis
Ergänze `nachweise/04-cache.md` mit:
- den zwei `curl`-Antworten (erst `netz`, dann `cache`) samt der beiden ms-Werte,
- der Zeile aus `GET /api/health`,
- falls Redis versucht: der Rückfall-Log-Zeile.
