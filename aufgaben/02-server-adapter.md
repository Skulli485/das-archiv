# Aufgabe 02: Der Server-Adapter: rufen und normalisieren

> Konzept dazu: [`konzepte/02-transport-zu-view-model.html`](../konzepte/02-transport-zu-view-model.html)

## Ziel
Der Server ruft deine Quelle live und gibt nach vorne nicht die rohe Antwort heraus,
sondern eine kleine, sauber benannte **Katalogkarte**. Die Grenze entscheidet, was
sie überquert.

## Konzept
Die Quelle sendet eine Transportform: viele Felder, fremde Namen, Lücken. Deine
Anwendung braucht davon nur wenige, gut benannt. Eine Funktion an der Grenze bildet
das eine auf das andere ab. Fehlende Felder bekommen einen ruhigen Ersatzwert. Die
50 rohen Felder erreichen den Browser nie.

## Beispiel
Das Muster der Abbildung (mit erfundenen Feldern, damit du deine eigene baust):

```js
// aus einer rohen Transportform ...
const roh = { objectID: 437, title: 'Flora', artistDisplayName: '', objectDate: '1654' }

// ... wird eine kleine Karte mit sicheren Ersatzwerten
function toKarte(o) {
  return {
    id: o.objectID,
    titel: o.title || 'Ohne Titel',
    kuenstler: o.artistDisplayName || 'Unbekannt',
    jahr: o.objectDate || '',
  }
}
```

Der Vertrag, den dein Objekt-Endpunkt zurückgibt (Cache kommt erst in Aufgabe 04,
darum jetzt immer `source: 'netz'`):

```
GET /api/objekt/:id  ->  { source: 'netz', ms, data: <Katalogkarte> }
GET /api/galerie     ->  { ids: [ ... ] }
```

## Aufgabe
1. Schreibe `holeAusQuelle(id)`: ruft deine Quelle per `fetch`, wirft bei einer
   Nicht-OK-Antwort einen Fehler, gibt das rohe Objekt zurück.
2. Schreibe `toKarte(roh)`: bildet die rohe Form auf 5 bis 7 gut benannte Felder ab.
   Nimm deutsche, bedeutungstragende Namen (`titel`, `kuenstler`, `jahr`, `bild`, ...),
   nicht die Quell-Schlüssel. Jedes Feld bekommt einen Ersatzwert.
3. Verdrahte `GET /api/objekt/:id`: holt, normalisiert, misst die Dauer mit
   `performance.now()`, antwortet mit `{ source: 'netz', ms, data }`. Bei einem Fehler
   der Quelle: Status `502` und `{ error }`.
4. Verdrahte `GET /api/galerie`: gibt deine kuratierte Liste von Objekt-Nummern zurück.
   Prüfe jede Nummer vorab, damit keine kaputte Kachel entsteht (mindestens 8 gute).

## Akzeptanzkriterien
- [ ] `GET /api/objekt/<id>` liefert `{ source: 'netz', ms, data }` mit einer echten Karte.
- [ ] `data` enthält nur deine gewählten Felder, keine rohen Quell-Felder.
- [ ] Fehlende Felder erscheinen als Ersatzwert, nicht als `null` oder `undefined`.
- [ ] `ms` ist eine gemessene Zahl (grob die Laufzeit der Quelle, oft mehrere hundert ms).
- [ ] `GET /api/galerie` liefert mindestens 8 geprüfte Nummern.
- [ ] Eine ungültige Nummer führt zu Status `502` mit `{ error }`, nicht zu einem Absturz.

## So testest du
```bash
curl "http://localhost:3000/api/objekt/DEINE_ID"
# erwartet: { "source": "netz", "ms": <zahl>, "data": { ... deine Felder ... } }

curl "http://localhost:3000/api/galerie"
# erwartet: { "ids": [ ... ] }
```
Sieh dir `data` genau an. Ist dort ein Feld, das die Quelle heißt (z. B. `strInstructions`
oder `artistDisplayName`)? Dann leckt die Transportform, benenne es um.

## Nachweis
Ergänze `nachweise/02-adapter.md` mit:
- der vollständigen Antwort eines `curl` auf einen Objekt-Aufruf,
- einem Satz dazu, welche rohen Felder du weggelassen hast und warum.
