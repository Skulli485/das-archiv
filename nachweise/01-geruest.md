# Nachweis 01: Das Zwei-Prozess-Gerüst

## Quelle
Met Museum Collection API – `https://collectionapi.metmuseum.org/public/collection/v1/objects/436535`

## Health-Antwort (über Vite-Proxy)
```bash
curl http://localhost:5173/api/health
```
```json
{"ok":true,"dienst":"leseraum","cache":"redis","zeit":"2026-07-17T20:23:40.488Z"}
```

## Rohe Antwort der Quelle (Ausschnitt)
```json
{
  "objectID": 436535,
  "title": "Wheat Field with Cypresses",
  "artistDisplayName": "Vincent van Gogh",
  "objectDate": "1889",
  "primaryImageSmall": "https://images.metmuseum.org/CRDImages/ep/web-large/DP-42549-001.jpg",
  "medium": "Oil on canvas",
  "department": "European Paintings"
}
```

## Behaltene Felder (5-7)
1. `titel` (aus `title`)
2. `kuenstler` (aus `artistDisplayName`)
3. `jahr` (aus `objectDate`)
4. `bild` (aus `primaryImageSmall`)
5. `material` (aus `medium`)
6. `abteilung` (aus `department`)
7. `id` (aus `objectID`)
