# Nachweis 05: Galerie und Detail

## Miss then Hit
1. Klick auf Kachel 436535 → Laufzettel zeigt `Tresor 606.0 ms` (netz, Messing)
2. Erneuter Klick auf 436535 → Laufzettel zeigt `Tisch 0.1 ms TTL 60s` (cache, Patina)

## Tastatur-Durchgang
- Tab durch das Raster: jede Kachel bekommt einen sichtbaren Fokusring (2px solid Messing)
- Enter auf einer Kachel öffnet die Detailkarte
- Tab durch die Detail-Felder

## 390px-Ansicht
- DevTools auf 390px: kein waagerechtes Scrollen
- Raster passt sich an (auto-fill, minmax(140px, 1fr))
- Bild skaliert auf max-width 100%

## Grenz-Entscheidung
- `GalerieRaster` lädt nur die IDs und meldet die gewählte Nummer per `emit('waehle', id)` nach oben. Es kennt keine Kartendaten.
- `KartenDetail` nutzt das Composable und rendert nur, was es bekommt. Es weiß nichts von Cache- oder Quellen-Interna.
- `LaufzettelBadge` ist rein darstellend: es rendert `{ source, ms, ttl }` und kennt keine Cache-Regeln.
- `App.vue` besitzt die Auswahl (`gewaehlt`) und verbindet Galerie und Detail.
