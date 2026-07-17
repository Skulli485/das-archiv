# Aufgabe 07: Capstone: dein eigener Feinschliff

> Baut auf allen vorigen Aufgaben auf.

## Ziel
Du erweiterst das System um eine eigene Fähigkeit, ohne die Grenze und den Vertrag zu
brechen. Die Form der Antwort bleibt, die rohe Transportform bleibt hinten.

## Konzept
Ein gutes System lässt sich erweitern, ohne dass die Grenze aufweicht. Jede neue
Fähigkeit trifft dieselbe Entscheidung wie zuvor: was überquert die Grenze, in welcher
Form, und wer besitzt sie. Genau diese Entscheidung dokumentierst du hier bewusst.

## Beispiel
Richtungen, aus denen du mindestens eine wählst (oder eine eigene Idee in gleichem Geist):

- **Zweiter Endpunkt Suche:** `GET /api/suche?q=...` ruft die Such-Route deiner Quelle und
  gibt eine Liste kleiner Karten zurück, in derselben Vertragsform.
- **Zweite Ressourcenart:** ein weiterer Objekttyp deiner Quelle mit eigener Karte, über
  dieselbe Grenze.
- **Vorabladen beim Zeigen:** Fahren über eine Kachel lädt die Karte im Voraus, mit
  demselben Abbruch- und Renn-Wächter.
- **Frisch laden:** ein Schalter, der den Cache für eine Nummer umgeht (z. B. per
  Abfrage-Flag `?frisch=1`), ohne die Vertragsform zu ändern.
- **Leerer Zustand:** eine ruhige Ansicht, wenn eine Suche nichts findet oder eine Nummer
  kein Bild hat.

## Aufgabe
1. Wähle mindestens eine Richtung und baue sie ganz aus, vom Server bis ins UI.
2. Halte die Vertragsform (`{ source, ms, ttl, data }` bzw. eine bewusst gewählte Listen-Form)
   und die Grenz-Disziplin ein: keine rohen Felder nach vorne.
3. Erhalte die Barrierefreiheit aus Aufgabe 05.
4. Schreibe die Grenz-Entscheidung auf: was hast du hinzugefügt, was überquert die
   Grenze, und warum in dieser Form.

## Akzeptanzkriterien
- [ ] Die neue Fähigkeit funktioniert vom Server bis ins UI.
- [ ] Die Vertragsform bleibt erhalten, es leckt keine rohe Transportform.
- [ ] Die Barrierefreiheit (Tastatur, Fokusring, Bildmaße) bleibt erhalten.
- [ ] Ein eigener Commit für die Erweiterung.
- [ ] Die Grenz-Entscheidung ist in einem kurzen Absatz beschrieben.

## So testest du
- Uebe den neuen Weg mehrfach durch.
- Sieh dir die Antwort an: nur deine Felder, kein Quell-Rohtext.
- Tastatur- und 390px-Durchgang auch für den neuen Teil.

## Nachweis
Ergänze `nachweise/07-capstone.md` mit:
- was du gebaut hast,
- der Grenz-Entscheidung (was überquert die Grenze und in welcher Form),
- einem kurzen Test, der zeigt, dass es trägt.
