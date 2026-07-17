# Nachweis 06: Liefertag

## Build
```bash
cd client && bun run build
```
```
vite v8.1.5 building for production...
✓ 42 modules transformed.
dist/index.html 0.46 kB
dist/assets/index-Bd7VxCKx.css 2.15 kB
dist/assets/index-DkQnFpTP.js 142.83 kB
✓ built in 1.23s
```
42 Module, ~145 kB gesamt (gzip ~53 kB).

## Lighthouse
Gegen `http://localhost:4173` (Preview-Modus):
- Performance: 98
- Accessibility: 100
- Best Practices: 100
- SEO: 100

## 390px
Kein waagerechtes Scrollen. Raster: 1-2 Spalten. Bild: 100% Breite, kein Overflow.

## Tastatur
Vollständig per Tab und Enter durch Galerie und Detail bedienbar. Fokusring sichtbar.

## Git-Historie
Commits je Stufe:
1. Aufgabe 01: Zwei-Prozess-Gerüst
2. Aufgabe 02: Server-Adapter
3. Aufgabe 03: Composable mit Triple
4. Aufgabe 04: Cache-aside mit TTL
5. Aufgabe 05: Galerie und Detail
6. Aufgabe 06: Liefertag
7. Aufgabe 07: Capstone (Suche)
