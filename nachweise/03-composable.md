# Nachweis 03: Das Composable mit dem Triple

## Rückgabe-Form
```js
{ zustand, karte, meta, laden, zurueck }
```
- `zustand`: `ref('idle' | 'laden' | 'fertig' | 'fehler')`
- `karte`: `ref(null | { id, titel, kuenstler, jahr, bild, material, abteilung })`
- `meta`: `ref(null | { source: string, ms: number, ttl: number })`
- `laden(id: number)`: async Funktion, lädt ein Objekt
- `zurueck()`: setzt zurück auf idle

## Wächter
1. **AbortController**: `controller?.abort()` bricht die laufende Anfrage ab, wenn eine neue startet oder die Komponente verschwindet (`onUnmounted`)
2. **Anfrage-Nummer** (`lauf`): Jede Anfrage bekommt eine Nummer. Ist `meine !== lauf`, wird die Antwort verworfen – eine neuere Anfrage hat übernommen

## Renn-Test
1. Netzwerk auf "Slow 3G" gedrosselt
2. Schnell hintereinander Objekt 436535 und 436532 angeklickt
3. Beobachtung: Nur 436532 (zuletzt geklickt) erscheint. Die ältere Anfrage wird im Netzwerk-Tab als `canceled` angezeigt
4. Ansicht gewechselt während eine Anfrage lief: kein Fehler, kein spätes Zustands-Setzen
