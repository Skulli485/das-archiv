# „Erzähl mir von einem Projekt": die Archiv-Geschichte in 90 Sekunden

Fast jedes Gespräch hat diese Frage: „Erzähl mir von einem Projekt, das du gebaut hast."
(EN: „Tell me about a project you built.") Die Frage prüft nicht, ob du viel gebaut hast,
sondern ob du deine Entscheidungen begründen kannst. Halte dich an einen Bogen: Lage,
das Problem an der Grenze, deine Entscheidungen, der Beweis. Ziel sind rund 90 Sekunden,
also vier bis fünf Sätze pro Abschnitt, keine Aufzählung von Technologien.

Keine Marketing-Wörter. Sag, was war, was du entschieden hast und wie du es geprüft hast.
Sachlich, so wie du es einem erfahrenen Kollegen am Schreibtisch erklären würdest.

---

## Der Bogen (Struktur)

1. **Lage:** Was war die Aufgabe, in einem Satz.
2. **Das Problem an der Grenze:** Warum es nicht mit einem direkten Aufruf getan war.
3. **Die Entscheidungen:** Drei bis vier, jede mit Grund.
4. **Der Beweis:** Gemessene Zahlen, git-Verlauf, lokale Lighthouse.

---

## Das Skelett zum Ausfüllen

Setz deine eigenen Zahlen und deine eigene Datenquelle ein. Die Werte in spitzen Klammern
sind Platzhalter. Zur Orientierung stehen daneben die Zahlen aus dem Klassen-Archiv als
Beispiel; deine werden pro Lauf leicht abweichen, weil der Laufzettel die echte Zahl zeigt.

> **Lage.** Ich habe einen Sammlungs-Betrachter für `<deine Quelle, z. B. Rezepte / Kunst /
> Kreaturen>` gebaut: ein Raster von Objekten, Klick öffnet die Detailkarte. Frontend in
> Vue 3.5, dahinter ein eigener kleiner Server als Grenze zur fremden Datenquelle.
>
> **Das Problem an der Grenze.** Die fremde Quelle ist langsam und weit weg: ein Objekt
> abzurufen dauerte `<dein 1. Klick, z. B. ~600 ms>`. Direkt aus dem Browser hätte ich
> außerdem CORS im Weg gehabt, wäre an die rohe Form des Anbieters gekoppelt gewesen (rund
> 50 Felder) und hätte bei jedem Klick erneut gewartet.
>
> **Die Entscheidungen.**
> - *Eine Grenze.* Ein eigener Server davor, damit der Browser nur meinen Ursprung `/api`
>   kennt. Das löst CORS, Kopplung und den Ort fürs Messen und Cachen auf einmal.
> - *Normalisieren.* Der Server wandelt die rohen `<~50>` Felder in ein View-Model mit
>   `<deine 5 bis 7>` gut benannten Feldern um, mit sicheren Rückfallwerten. Die Oberfläche
>   sieht nie die rohe Transportform.
> - *Cache-aside mit TTL.* Erster Klick geht in die Quelle und wird im Cache abgelegt, jeder
>   weitere kommt aus dem Cache. Die TTL begrenzt, wie alt die Daten höchstens sein dürfen.
> - *Anmutiger Rückfall.* Der Cache läuft auf Redis, wenn erreichbar, sonst auf einer
>   In-Memory-Map mit demselben Vertrag. Ein toter Port hängt den Server nicht auf, der
>   Verbindungsaufbau läuft in einem Zeitlimit.
>
> **Der Beweis.** Gemessen mit dem Laufzettel (echte `performance.now()`-Zahl): erster Klick
> `<~600 ms>` aus der Quelle, zweiter `<unter 2 ms>` aus dem Cache, rund Faktor `<~350>`. Der
> git-Verlauf zeigt einen Commit pro Stufe, die Nachrichten benennen die Entscheidungen. Und
> Lighthouse gegen die lokale Preview lag bei `<dein Wert, Ziel 95+>`. Kein Deploy: gebaut und
> lokal bewiesen.

Zwei Sätze, die du am Ende fallen lassen kannst, wenn Zeit ist: Wheeler („eine zusätzliche
Ebene der Indirektion") für die Grenze, Knuth („erst messen, dann die kritischen 3% optimieren")
fürs Cachen. Zitiere sie nur, wenn sie natürlich passen, nicht als Schmuck.

---

## Die drei Nachfragen, die kommen, und wie du sie nimmst

Nach der Geschichte bohrt ein:e Interviewer:in nach. Das ist gut: es heißt, die Geschichte
hat gesessen. Halte die Antworten kurz und benenne die Grenze deiner eigenen Lösung offen.

**1. „Was, wenn der Cache veraltet ist?"** (EN: „What if the cache is stale?")
Dafür ist die TTL da: sie ist die obere Grenze, wie alt ein Wert werden darf. Ich wähle sie
nach dem Datentyp. Kunstwerke oder Rezepte ändern sich praktisch nie, also ist selbst eine
großzügige TTL sicher. Bei Daten, die sich schnell ändern, wäre die TTL kurz, oder ich würde
den Cache-Eintrag beim Schreiben gezielt verwerfen. Der wunde Punkt ist bekannt: für Daten,
die veralten dürfen, ist Zeit-basiertes Verfallen die einfachste tragbare Antwort.

**2. „Warum kein Deploy?"** (EN: „Why didn't you deploy it?")
Der Liefertag war bewusst lokal: fertigstellen und beweisen, nicht veröffentlichen. Der
Beweis liegt im Bauwerk selbst: `bun run build` erzeugt das echte `dist/`, `vite preview`
serviert es, Lighthouse misst dagegen, und der git-Verlauf zeigt den Weg. Das öffentliche
Ausrollen kommt später im Kurs. Ich wollte erst sicher sein, dass das Artefakt stimmt, bevor
eine URL darauf zeigt.

**3. „Wie testest du das?"** (EN: „How do you test this?")
Auf zwei Ebenen. Die Grenze prüfe ich über ihren Vertrag: `/api/health` meldet den
Cache-Modus, `/api/objekt/:id` zweimal aufgerufen liefert beim ersten Mal `netz`, beim
zweiten `cache` mit kleinerer Zahl, und das in beiden Modi (Redis an, Redis aus). Die
Oberfläche prüfe ich an den vier Zuständen: Laden zeigt Skeleton, Fehler zeigt einen eigenen
Zustand, schnelles Klicken darf nie die falsche Karte zeigen (Wettlauf-Schutz). Automatisierte
Tests wären der nächste Schritt; hier war der Vertrag der Grenze der Prüfpunkt.

---

## Was du nicht sagst

- Keine Wörter wie „nahtlos", „hochskalierbar", „modernste", „revolutionär". Sag die Zahl.
- Keine Liste von Technologien ohne Grund. „Ich habe Redis benutzt" allein sagt nichts, „ich
  habe cache-aside benutzt, weil Lesen viel häufiger war als Schreiben" schon.
- Nicht überverkaufen. Der Wettlauf-Schutz und der Rückfall auf die Map sind stärker, wenn du
  sie als bewusste Entscheidungen gegen bekannte Fallen erzählst, nicht als Feature-Liste.
