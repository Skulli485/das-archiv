# Aufgabe 01: Das Zwei-Prozess-Gerüst

> Konzept dazu: [`konzepte/01-die-server-grenze.html`](../konzepte/01-die-server-grenze.html)

## Ziel
Zwei Prozesse laufen nebeneinander: ein Bun-Server (die Grenze) und ein Vue-Client.
Der Browser spricht nur mit `/api`, Vite leitet das an den Server weiter. Am Ende
zeigt der Client, dass die Grenze erreichbar ist. Außerdem hast du deine Datenquelle
gewählt und mit echten Anfragen geprüft, bevor du eine Zeile Anwendungscode schreibst.

## Konzept
Eine Sammlungs-Ansicht braucht Daten. Die Quelle ist langsam und weit weg. Statt sie
direkt aus dem Browser zu rufen (CORS, rohe Formen, keine Kontrolle), setzt du einen
eigenen kleinen Server davor. Er wird deine einzige Grenze zur fremden Welt. Der Client
kennt nur `/api`, nie die Quelle selbst.

## Wahl der Datenquelle (zuerst prüfen, dann bauen)
Wähle **eine** schlüssellose API. Diese drei sind mit echten Anfragen geprüft, Daten
und Bild. Jede liefert ein Einzelobjekt (für die Detailkarte); die Liste für die
Galerie stellst du dir aus geprüften Nummern selbst zusammen:

| Quelle | Thema | Einzelobjekt | Bild |
|---|---|---|---|
| Met Museum | Kunst | `https://collectionapi.metmuseum.org/public/collection/v1/objects/436535` | Feld `primaryImageSmall` |
| TheMealDB | Rezepte | `https://www.themealdb.com/api/json/v1/1/lookup.php?i=52772` | Feld `strMealThumb` |
| PokéAPI | Kreaturen | `https://pokeapi.co/api/v2/pokemon/1` | `sprites.front_default` |

Auch möglich, thematisch nah am Archiv: Art Institute of Chicago
(`https://api.artic.edu/api/v1/artworks/27992?fields=id,title,artist_display,date_display,medium_display,image_id,department_title`,
Bild aus `image_id`: `https://www.artic.edu/iiif/2/{image_id}/full/843,/0/default.jpg`).
Die Daten-API läuft, der Bildhost antwortet je nach Netz aber mit `403`. Genau deshalb
gilt: prüfe das Bild zuerst im Browser, bevor du dich festlegst.

Nicht dabei: REST Countries. Die frei nutzbare Version ist abgekündigt und antwortet mit
einer Fehlermeldung. Das ist der Grund für die Regel, jede Quelle vorher zu prüfen.

## Beispiel
Der Aufbau, den du herstellst (Quellcode, keine `node_modules`):

```
mein-archiv/
  server/
    index.js          # Bun.serve, spricht /api/health
    package.json      # { "type": "module", "scripts": { "start": "bun index.js" } }
  client/             # bun create vite . --template vue
    vite.config.js    # Proxy /api -> http://localhost:3000
    src/App.vue
```

Der Proxy ist das Herz dieser Aufgabe:

```js
// vite.config.js
const proxy = { '/api': 'http://localhost:3000' }
export default defineConfig({ plugins: [vue()], server: { proxy }, preview: { proxy } })
```

Der Server antwortet zunächst nur auf einen Gesundheits-Aufruf:

```js
// server/index.js (Auszug, Muster)
if (pathname === '/api/health') return json({ ok: true, dienst: 'leseraum' })
```

## Aufgabe
1. Prüfe deine gewählte Quelle mit `curl` oder im Browser. Notiere die rohe Antwort
   (ein Ausschnitt reicht) und welche Felder du später brauchst.
2. Lege den Aufbau an. Du hast zwei Wege, beide zulässig:
   - **Von Grund auf:** `mkdir server`, dort `index.js` und `package.json` schreiben;
     im `client` `bun create vite . --template vue` ausführen; den Proxy eintragen.
   - **Vom Chassis:** kopiere den Ordner [`../starter/`](../starter/) als Startpunkt und
     baue darauf weiter. Das Chassis bootet bereits und zeigt den Gesundheits-Status.
3. Starte beide Prozesse in zwei Terminals:
   - `cd server && bun start` (Grenze auf Port 3000)
   - `cd client && bun run dev` (Client auf Port 5173)
4. Öffne den Client. Er soll anzeigen, dass die Grenze erreichbar ist.

## Akzeptanzkriterien
- [ ] Beide Prozesse starten ohne Fehler.
- [ ] `GET /api/health` liefert durch den Proxy (also über `http://localhost:5173/api/health`) eine JSON-Antwort mit `ok: true`.
- [ ] Der Client zeigt sichtbar den Zustand der Grenze (erreichbar / nicht erreichbar).
- [ ] Deine Quelle ist mit einer echten Anfrage geprüft; die rohe Antwort ist notiert.
- [ ] Keine Fehler in der Browser-Konsole.

## So testest du
```bash
# direkt am Server
curl http://localhost:3000/api/health

# durch den Vite-Proxy (der Weg, den der Browser geht)
curl http://localhost:5173/api/health

# deine Quelle (Beispiel Met)
curl "https://collectionapi.metmuseum.org/public/collection/v1/objects/436535"
```
Beide Health-Aufrufe geben dieselbe Antwort. Wenn nur der direkte Aufruf klappt und der
über 5173 nicht, stimmt der Proxy noch nicht.

## Nachweis
Lege `nachweise/01-geruest.md` an mit:
- der Antwort auf `curl http://localhost:5173/api/health`,
- dem Namen deiner gewählten Quelle,
- einem kurzen Ausschnitt der rohen Antwort deiner Quelle und den 5 bis 7 Feldern, die du behalten willst.
