# Continuity-Bibel — die 25 Sekunden

Der Film ist keine Aneinanderreihung von acht Clips. Er ist **eine
Kamerafahrt**, die neunmal unterbrochen und jedes Mal exakt dort wieder
aufgenommen wird, wo sie aufgehört hat.

Technisch erzwungen wird das über **Keyframes**: Jeder Clip bekommt ein
Startbild und ein Endbild mit. Das Endbild von Clip A **ist dieselbe Datei**
wie das Startbild von Clip B. Damit gibt es keinen Schnitt, den man verstecken
müsste — es gibt schlicht keinen.

    K0 ──Clip 1──▶ K1 ──Clip 2──▶ K2 ──Clip 3──▶ K3 ──Clip 4──▶ K4
    K4 ──Clip 5──▶ K5 ──Clip 6──▶ K6 ──Clip 7──▶ K7 ──Clip 8──▶ K8

## Die Bibel-Zeile

Steht wortgleich vor **jedem** Bild- und Video-Prompt. Ohne sie driften
Farbe, Jahreszeit und Gebäude nach zwei Generierungen auseinander.

> Same luxurious late-summer European wedding world: ivory and champagne
> palette with warm brass gold and muted sage green, white garden roses and
> gypsophila, honey-coloured European villa with tall pale stone columns,
> soft natural golden-hour light, elegant editorial cinematography, shallow
> depth of field, extremely subtle 35mm film grain, no people visible, no
> text, no lettering, no signage, no logos.

Der Nachsatz `no text, no lettering, no signage` ist nicht kosmetisch: KI
setzt sonst Schilder und Menükarten ins Bild, und die tragen zuverlässig
Kauderwelsch. Kauderwelsch im Bild ist auf einer Kundenseite ein Ausschluss-
kriterium, kein Schönheitsfehler.

## Anker

Drei Bilder werden zuerst erzeugt und danach als Referenz in jeden weiteren
Prompt gegeben. Sie halten fest, wie **dieses** Gebäude, **dieser** Wagen und
**diese** Tafel aussehen.

| Anker | Motiv |
|---|---|
| A1 | Die Villa, Golden Hour, Säulenfront |
| A2 | Der cremefarbene Oldtimer in der Lindenallee |
| A3 | Die lange Hochzeitstafel auf der Terrasse |

## Keyframes

Die geraden Übergänge sind bewusst **fast einfarbig** — weiß, dunkel, golden.
Genau dort liegt die Naht, und genau dort sieht man sie nicht.

| # | Was zu sehen ist | Rolle |
|---|---|---|
| K0 | Makro weiße Rosen, Seide dahinter | Anfang |
| K1 | Eine riesige unscharfe weiße Blüte deckt das Bild | Naht (weiß) |
| K2 | Inneres eines goldenen Rings, dunkler Messingtunnel | Naht (dunkel) |
| K3 | Beschattete Flanke des Oldtimers füllt das Bild | Naht (dunkel) |
| K4 | Dunkle Steinsäule füllt das Bild | Naht (dunkel) |
| K5 | Champagnerglas direkt vor der Linse, Brechung | Naht (creme) |
| K6 | Kerzenflamme, goldene Überbelichtung | Naht (gold) |
| K7 | Dieselbe Villa, blaue Stunde, Lichterketten | Abend |
| K8 | Eine weiße Rose läuft ins Bild, alles wird Ivory | Übergang zur Seite |

K8 ist der wichtigste: Sein Ivory ist **exakt** der Hintergrundwert der
Website darunter (`--grund`). Wenn das Video an dieser Stelle verschwindet,
ändert sich kein Pixel.

## Clips

Jeder Clip 3 Sekunden, 9:16, ohne Ton — die Musik liegt auf der Seite.

| Clip | Von → Nach | Kamera |
|---|---|---|
| 1 | K0 → K1 | langsam durch die Rosen, Blüte schiebt sich vor die Linse |
| 2 | K1 → K2 | knapp über Seide mit zwei Ringen, hinein in den Ring |
| 3 | K2 → K3 | aus dem Dunkel wird ein Reifen, Rückzug auf den Wagen, Vorbeifahrt |
| 4 | K3 → K4 | hinter der Karosserie hervor auf die Villa, Wagen fährt hinten ein |
| 5 | K4 → K5 | hinter der Säule hervor, Fahrt die Tafel entlang, hinter das Glas |
| 6 | K5 → K6 | Verzerrung löst sich zur Torte, Kerze wandert vor die Linse |
| 7 | K6 → K7 | aus dem goldenen Licht wird die Abendsonne über der Villa |
| 8 | K7 → K8 | letzte Annäherung, eine weiße Rose füllt das Bild |

Der Wagen in Clip 4 ist derselbe wie in Clip 3 — **das** ist der Trick. Das
Gehirn schließt daraus, dass er gerade angekommen ist, und hält zwei getrennt
erzeugte Aufnahmen für eine einzige.

## Finale

Ein zehnter Clip schließt den Kreis: dieselbe Tafel aus Clip 5, nachts,
Kerzen brennen. Er ist kein neuer Ort, sondern derselbe Abend, sechs Stunden
später.
