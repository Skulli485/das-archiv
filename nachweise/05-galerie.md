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

## Nachtrag: Vorschaubilder im Saal-Raster (Museums-Redesign)
Für die museale Optik zeigt das Raster jetzt echte Vorschaubilder statt nur der
Objekt-Nummer. Dafür bewusst **kein** Umweg über `/api/objekt/:id`: würde das Raster
beim Laden alle acht Objekte einzeln abrufen, wären sie beim ersten Klick der
Besucherin schon im Cache, und der Miss-dann-Hit-Beweis wäre kaputt.

Stattdessen ein eigener, schreibgeschützter Endpunkt `GET /api/galerie/vorschau`, der
eine fest kuratierte Liste (`id`, `titel`, `kuenstler`, `bild`) zurückgibt und dabei nie
`gedacht()`/`merke()` aufruft, also den Objekt-Cache nie berührt:

```bash
curl "http://localhost:3000/api/galerie/vorschau"
→ {"vorschau":[{"id":436535,"titel":"Wheat Field with Cypresses","kuenstler":"Vincent van Gogh","bild":"https://images.metmuseum.org/CRDImages/ep/web-large/DP-42549-001.jpg"}, ...]}
```

Gegenprobe: `/api/objekt/436530` liefert danach weiterhin beim ersten Aufruf
`"source":"netz"` und erst beim zweiten `"source":"cache"` — die Vorschau hat den
Cache-Zustand dieses Objekts nicht verändert.
