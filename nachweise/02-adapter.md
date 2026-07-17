# Nachweis 02: Der Server-Adapter

## curl-Antwort
```bash
curl "http://localhost:3000/api/objekt/436535"
```
```json
{"source":"netz","ms":606.0,"ttl":60,"data":{"id":436535,"titel":"Wheat Field with Cypresses","kuenstler":"Vincent van Gogh","jahr":"1889","bild":"https://images.metmuseum.org/CRDImages/ep/web-large/DP-42549-001.jpg","material":"Oil on canvas","abteilung":"European Paintings"}}
```

## Galerie-Endpunkt
```bash
curl "http://localhost:3000/api/galerie"
```
```json
{"ids":[436535,436532,436530,436528,436524,436521,436518,436516]}
```

## Weggelassene rohe Felder
- `objectBeginDate`, `objectEndDate` – nur das Anzeige-Jahr (`objectDate`) reicht
- `dimensions`, `measurements` – nicht für die Karte nötig
- `classification`, `culture`, `period` – zu spezifisch für die Ansicht
- `repository`, `accessionNumber`, `geographyType` – intern, nicht für Nutzer
- `tags`, `URL`, `resourceURL` – irrelevant für das UI
- Alle Bild-Varianten außer `primaryImageSmall` (Galerie braucht nur eine Vorschau)
