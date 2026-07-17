# Aufgabe 05: Galerie und Detail: die ganze Woche

> Konzept dazu: [`konzepte/05-triple-abortcontroller-race.html`](../konzepte/05-triple-abortcontroller-race.html)

## Ziel
Die Sammlungs-Ansicht steht: ein Raster kuratierter Objekte, ein Klick öffnet die
Detailkarte mit einem Übergang, einem Platzhalter während des Ladens und dem
Laufzettel (`source`, `ms`, `ttl`). Der Renn-Wächter aus Aufgabe 03 trägt hier, und
alles ist per Tastatur und auf 390px Breite bedienbar.

## Konzept
Die Ansicht teilt sich in Komponenten mit klaren Grenzen: ein Raster, das eine Auswahl
nach oben meldet, und eine Detailkarte, die nur anzeigt, was ihr gegeben wird. `App.vue`
besitzt die Auswahl. Der Übergang und der Platzhalter machen die langsame erste Ladung
ruhig statt ruckhaft. Der Laufzettel macht sichtbar, woher die Karte kam.

## Beispiel
Die Aufteilung (Muster, nicht die Lösung):

```
App.vue                 besitzt die Auswahl (welche id)
  GalerieRaster.vue     lädt /api/galerie, Raster aus Kacheln, meldet waehle(id) nach oben
  KartenDetail.vue      zeigt die Karte, Platzhalter bei laden, Übergang, Laufzettel
    LaufzettelBadge.vue rendert { source, ms, ttl }, kennt keine Cache-Regeln
```

Der Übergang, der bei jeder neuen Karte neu startet:

```html
<Transition name="auf" mode="out-in">
  <article v-if="zustand === 'fertig' && karte" :key="karte.id"> ... </article>
</Transition>
```

Der `:key="karte.id"` sorgt dafür, dass der Eintritts-Übergang bei jeder Karte neu
läuft (das Muster `forms-key-restart` aus dieser Woche).

## Aufgabe
1. `GalerieRaster`: lädt einmal `/api/galerie`, zeigt ein Raster fokussierbarer Kacheln,
   meldet die gewählte Nummer per Ereignis nach oben. `:key` auf dem `v-for`.
2. `KartenDetail`: zeigt die Katalogkarte. Während `zustand === 'laden'` ein Platzhalter
   (Skeleton). `<Transition mode="out-in">` auf der Karte, `:key` auf der Objekt-Nummer.
3. `LaufzettelBadge`: rendert `{ source, ms, ttl }`. `netz` in Messing („aus dem Tresor"),
   `cache` in Patina („vom Tisch"). Die ms in Ziffern gleicher Breite (`tabular-nums`).
4. Barrierefreiheit und Layout: Bilder mit `loading="lazy"`, fester `width` und `height`
   (kein Layout-Sprung), `alt` aus Titel und Urheber. Kacheln per Tastatur erreichbar
   (`tabindex`, Enter und Leertaste), sichtbarer Fokusring. `prefers-reduced-motion`
   wird beachtet. Auf 390px Breite kein waagerechtes Scrollen.

## Akzeptanzkriterien
- [ ] Klick auf eine Kachel lädt die Detailkarte.
- [ ] Erster Aufruf einer Nummer `netz`, erneuter Aufruf `cache` (aus Aufgabe 04).
- [ ] Übergang und Platzhalter sind sichtbar, die Karte springt nicht.
- [ ] Der Laufzettel zeigt `source`, `ms` und bei `cache` das `ttl`.
- [ ] Vollständig per Tastatur bedienbar, mit sichtbarem Fokusring.
- [ ] Auf 390px Breite kein waagerechtes Scrollen.
- [ ] Keine Fehler in der Konsole.

## So testest du
1. Nur mit der Tastatur durch das Raster gehen (Tab), eine Kachel mit Enter öffnen.
2. Netzwerk drosseln und den Platzhalter beim ersten Laden beobachten.
3. Dieselbe Kachel zweimal öffnen: erst `netz`, dann `cache`.
4. DevTools auf 390px stellen und die ganze Ansicht prüfen.

## Nachweis
Ergänze `nachweise/05-galerie.md` mit:
- einer kurzen Beschreibung (oder Screenshots) von: Miss dann Hit, Tastatur-Durchgang, 390px-Ansicht,
- einem Satz zu einer Grenz-Entscheidung, die du in den Komponenten getroffen hast (was geht nach oben, was bleibt unten).
