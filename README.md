# Cinematic — digitale Hochzeitskarte

Eine Einladung, die als Umschlag anfängt, in eine 27 Sekunden lange
Kamerafahrt übergeht und irgendwann aufhört, Video zu sein, ohne dass man
sagen könnte, wann. Statische Seite, kein Build-Schritt, kein Framework.

**Der Demo-Datensatz Sophie & Alexander ist frei erfunden** — Paar, Termin,
Hotel und Kontaktdaten existieren nicht.

## Die Idee

Der Film ist keine Aneinanderreihung von Clips, sondern **eine** Fahrt, die
neunmal unterbrochen und jedes Mal exakt dort wieder aufgenommen wird, wo sie
aufgehört hat. Erzwungen wird das über Keyframes: Jeder Clip bekommt ein Start-
und ein Endbild mit, und das Endbild von Clip A ist dieselbe Datei wie das
Startbild von Clip B. Es gibt keinen Schnitt zu verstecken, weil keiner da ist.

Am Ende blendet der Film auf denselben Farbwert aus, den die Seite darunter als
Hintergrund hat. `bin/film-bauen.sh` misst das nach und meldet die Abweichung —
zuletzt eine Stufe von 255.

Details stehen in [docs/continuity-bibel.md](docs/continuity-bibel.md).

## Aufbau

| Datei | Inhalt |
|---|---|
| `js/inhalt.js` | Alle Inhalte. Pro Paar wird nur diese Datei angefasst. |
| `js/film.js` | Umschlag, Kamerafahrt, Übergang in die Seite, Musik. |
| `js/seite.js` | Countdown, Zeitleiste, Galerie, Ort, Rückmeldung. |
| `css/basis.css` | Token, Schrift, Grundraster. |
| `css/film.css` | Umschlag und Film. |
| `css/seite.css` | Alles nach dem Film. |
| `bin/film-bauen.sh` | Baut Film, Poster und jedes Bild aus `assets/roh/`. |
| `assets/roh/` | Die Rohclips und Keyframes. Nicht im Repo (`.gitignore`). |

## Farben

Genau **eine** Akzentfarbe: warmes Messing. Alles andere ist Tiefe, nicht Farbe.

| Token | Wert | Rolle |
|---|---|---|
| `--grund` | `#f2ece1` | Ivory. Derselbe Wert, auf den der Film ausblendet. |
| `--grund-tief` | `#e6dccb` | Der Countdown, wenn die Seite dunkler wird. |
| `--nacht` | `#1a1611` | Finale und Fuß. |
| `--akzent` | `#a98449` | Flächen und Linien. |
| `--akzent-text` | `#785c2e` | Alles, was gelesen werden muss (5.3:1 auf `--grund`). |

Wird `--grund` geändert, muss `GRUND` in `bin/film-bauen.sh` mit geändert
werden — sonst blitzt beim Übergang Video → Seite eine Kante auf.

## Den Film neu bauen

    ./bin/film-bauen.sh

Braucht `ffmpeg` und `cwebp` (`brew install ffmpeg webp`) und die Rohclips in
`assets/roh/` (`c1`–`c8`, `c4b`, `c9-finale`, dazu die Keyframes als PNG).
Das Skript setzt die neun Clips zusammen, blendet aus, schneidet die Poster
und jedes Bild der Seite aus demselben Material und misst am Schluss die Naht
nach. Ausgeliefert werden rund 10 MB, davon 6 MB Film.

## Musik

Noch keine Datei dabei. Sobald `assets/audio/musik.mp3` existiert, startet sie
beim Antippen des Umschlags und der Notenknopf erscheint; ohne Datei bleibt er
verborgen und die Karte läuft stumm. Hinweise zur Lizenz stehen in
`assets/audio/HIER-MUSIK-ABLEGEN.txt`.

## Zum Ausprobieren

- `?film=aus` — überspringt Umschlag und Film und zeigt sofort die Seite
- `#cd`, `#tag`, `#venue`, `#det`, `#rsvp-marke` — springen in einen Abschnitt

## Der Ort

Der Film zeigt eine erzeugte Villa, die dem echten Schloss Benrath nicht
ähnelt. Für eine Kundenseite entweder den Namen in `js/inhalt.js` tauschen
oder das Bildmaterial — es sollte nicht so aussehen, als sei das Gebäude im
Film der genannte Ort.

## Vorschau beim Teilen

Die Open-Graph-Angaben stehen im Kopf der `index.html`, das Bild ist
`assets/img/vorschau.jpg` (1200×630). **Bei jedem neuen Projekt müssen dort
die eigene Adresse und das eigene Vorschaubild eingetragen werden** —
Messenger ignorieren relative Pfade.

## Bildschirmgrößen

Der Film ist hochformatig (9:16), weil eine Einladung auf dem Telefon geöffnet
wird. Auf Schirmen, die breiter als hoch sind, steht er als Bühne in voller
Höhe mittig, dahinter derselbe Film unscharf und abgedunkelt — sonst bliebe
von einer 9:16-Fahrt auf 16:9 nichts übrig.

## Veröffentlichen

    ./bin/veroeffentlichen.sh "Was geändert wurde"

Setzt eine frische Versionsnummer an alle eigenen Dateien und stellt live.
Ohne das liefern Browser tagelang die alte Fassung aus dem Zwischenspeicher.
Beim Arbeiten am lokalen Server reicht `./bin/frisch.sh`.

## Noch nicht angebunden

Die Rückmeldung ist eine vollständige Oberfläche ohne Server: Eingaben werden
geprüft und der Ablauf stimmt, aber nichts wird versendet oder gespeichert.
