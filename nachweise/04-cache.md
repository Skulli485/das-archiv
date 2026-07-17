# Nachweis 04: Das Gedächtnis – Cache-aside mit TTL

## Erster Aufruf (Cache-Miss → Netz)
```bash
curl "http://localhost:3000/api/objekt/436535"
```
```json
{"source":"netz","ms":606.0,"ttl":60,"data":{"id":436535,"titel":"Wheat Field with Cypresses",...}}
```

## Zweiter Aufruf (Cache-Hit → Redis)
```bash
curl "http://localhost:3000/api/objekt/436535"
```
```json
{"source":"cache","ms":0.1,"ttl":60,"data":{"id":436535,"titel":"Wheat Field with Cypresses",...}}
```

## Health-Endpunkt
```bash
curl "http://localhost:3000/api/health"
```
```json
{"ok":true,"dienst":"leseraum","cache":"redis","zeit":"2026-07-17T20:23:40.488Z"}
```

## Rückfall-Zeile (wenn Redis nicht erreichbar)
```
[cache] map (Redis nicht erreichbar: Verbindungstimeout)
```
Nach `docker stop archiv_redis` und Server-Neustart läuft alles mit der Map weiter.
