# Aufgabe 03: Das Composable mit dem Triple

> Konzept dazu: [`konzepte/05-triple-abortcontroller-race.html`](../konzepte/05-triple-abortcontroller-race.html)

## Ziel
Ein Composable kapselt den Aufruf an die Grenze und gibt der Komponente einen kleinen
Vertrag. Es kennt vier Zustände, bricht eine überholte Anfrage ab und ignoriert
veraltete Antworten. Die Komponente rendert nur noch Zustände.

## Konzept
Eine Anfrage ist nie nur da oder nicht da. Sie ist `idle` (noch nie gefragt), `laden`
(gerade unterwegs), `fertig` (Daten liegen vor) oder `fehler`. Ein einzelnes Boolean
kann das nicht ausdrücken. Zwei Wächter halten es sauber: ein `AbortController`
stoppt die laufende Anfrage, wenn eine neue startet oder die Komponente verschwindet;
eine mitzählende Anfrage-Nummer sorgt dafür, dass nur die neueste Antwort zählt.

## Beispiel
Das Muster eines Composables (allgemein gehalten, damit du deins baust):

```js
import { ref } from 'vue'

export function useX() {
  const zustand = ref('idle')  // idle | laden | fertig | fehler
  const daten = ref(null)
  let controller = null
  let lauf = 0

  async function laden(id) {
    controller?.abort()
    controller = new AbortController()
    const meine = ++lauf                 // diese Anfrage bekommt eine Nummer
    zustand.value = 'laden'
    try {
      const res = await fetch(`/api/...${id}`, { signal: controller.signal })
      if (!res.ok) throw new Error('Server ' + res.status)
      const body = await res.json()
      if (meine !== lauf) return         // eine neuere Anfrage hat uebernommen
      daten.value = body
      zustand.value = 'fertig'
    } catch (e) {
      if (e.name === 'AbortError' || meine !== lauf) return
      zustand.value = 'fehler'
    }
  }

  return { zustand, daten, laden }
}
```

## Aufgabe
1. Baue dein Composable (z. B. `useArchiv`), das eine Objekt-Nummer lädt und
   `{ zustand, karte, meta, laden }` zurückgibt. `meta` trägt `{ source, ms, ttl }`
   aus der Antwort der Grenze.
2. Setze beide Wächter ein: `AbortController` (neue Anfrage bricht die alte ab) und
   die mitzählende Anfrage-Nummer (veraltete Antwort wird verworfen).
3. Brich die laufende Anfrage auch bei `onUnmounted` ab, damit kein Zustand nach dem
   Verschwinden der Komponente gesetzt wird.
4. Lass `App.vue` das Composable nutzen und alle vier Zustände rendern: einen Hinweis
   bei `idle`, einen Platzhalter bei `laden`, die Karte bei `fertig`, eine Meldung bei `fehler`.

## Akzeptanzkriterien
- [ ] Alle vier Zustände sind im UI sichtbar behandelt.
- [ ] Eine neue Anfrage bricht die vorige ab (im Netzwerk-Tab als `canceled` sichtbar).
- [ ] Eine langsame Antwort, die nach einer neueren eintrifft, überschreibt das UI nicht.
- [ ] Beim Verlassen der Ansicht wird die laufende Anfrage abgebrochen.
- [ ] Keine Fehler in der Konsole, auch nicht durch abgebrochene Anfragen.

## So testest du
1. Netzwerk in den DevTools drosseln (z. B. „Slow 3G").
2. Schnell hintereinander zwei verschiedene Nummern anfragen.
3. Beobachten: nur die zuletzt geklickte Karte erscheint, die früher geklickte
   überschreibt nichts, wenn ihre Antwort später eintrifft.
4. Ansicht wechseln oder Komponente entfernen, während eine Anfrage läuft: kein
   Fehler, kein spätes Setzen von Zustand.

## Nachweis
Ergänze `nachweise/03-composable.md` mit:
- der Rückgabe-Form deines Composables (welche Felder, welcher Typ),
- einer kurzen Beschreibung deines Renn-Tests und was du beobachtet hast.
