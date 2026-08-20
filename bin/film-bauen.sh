#!/usr/bin/env bash
# Baut aus den Rohclips in assets/roh/ alles, was die Seite ausliefert:
# den zusammenhaengenden Film, den Finale-Clip, die Poster und jedes Bild.
#
# Warum ein Skript und nicht von Hand: Der Film muss am Ende auf exakt
# denselben Farbwert ausblenden, den die Seite als Hintergrund hat.
# Steht der Wert an zwei Stellen von Hand, laeuft er irgendwann
# auseinander - und dann blitzt beim Uebergang eine Kante auf.
set -euo pipefail
cd "$(dirname "$0")/.."

# --grund der Seite ist #F2ECE1. Die Blende bekommt aber #F4EEE3:
# libx264 schreibt begrenzten Wertebereich, beim Dekodieren kommen rund
# zwei bis drei Stufen zu wenig heraus. Nachgemessen liefert #F4EEE3 am
# Ende 242/237/225 - also genau den Hintergrund der Seite.
GRUND="0xF4EEE3"
SEITE="#F2ECE1"           # der Wert aus css/basis.css, nur zur Kontrolle
ROH="assets/roh"
VID="assets/video"
IMG="assets/img"
Q=82                       # webp-Qualitaet

command -v ffmpeg >/dev/null || { echo "ffmpeg fehlt"; exit 1; }
command -v cwebp  >/dev/null || { echo "cwebp fehlt (brew install webp)"; exit 1; }
mkdir -p "$VID" "$IMG"
TMPNAHT="$(mktemp -t naht).raw"

REIHE=(c1 c2 c3 c4 c4b c5 c6 c7 c8)

# --- 1 · Der Film ------------------------------------------------------
echo "Film bauen …"
LISTE="$(mktemp)"
GESAMT=0
for c in "${REIHE[@]}"; do
  [ -f "$ROH/$c.mp4" ] || { echo "  fehlt: $ROH/$c.mp4"; exit 1; }
  echo "file '$PWD/$ROH/$c.mp4'" >> "$LISTE"
  D=$(ffprobe -v error -select_streams v -show_entries stream=duration -of csv=p=0 "$ROH/$c.mp4")
  GESAMT=$(python3 -c "print($GESAMT + $D)")
done
# Die Blende muss vor dem letzten Bild fertig sein, sonst bleibt das
# Schlussbild auf halbem Weg stehen und die Kante wird sichtbar.
AB=$(python3 -c "print(round($GESAMT - 0.82, 3))")
echo "  ${#REIHE[@]} Clips, $(python3 -c "print(round($GESAMT,1))") s, Ausklang ab ${AB}s"

ffmpeg -loglevel error -y -f concat -safe 0 -i "$LISTE" \
  -vf "scale=960:-2,fade=t=out:st=${AB}:d=0.62:color=${GRUND},format=yuv420p" \
  -c:v libx264 -profile:v high -level 4.0 -crf 29 -preset slow \
  -movflags +faststart -an "$VID/film.mp4"
rm -f "$LISTE"

ffmpeg -loglevel error -y -i "$ROH/c9-finale.mp4" \
  -vf "scale=960:-2,format=yuv420p" -c:v libx264 -profile:v high -crf 30 -preset slow \
  -movflags +faststart -an "$VID/finale.mp4"

# --- 2 · Helfer --------------------------------------------------------
# rahmen <quelle.mp4> <sekunde|ende> <ziel-ohne-endung> [breite]
rahmen(){
  local q="$1" t="$2" z="$3" b="${4:-1200}" tmp
  tmp="$(mktemp -t rahmen).png"
  if [ "$t" = "ende" ]; then
    ffmpeg -loglevel error -y -sseof -0.12 -i "$q" -vf "scale=$b:-1" -update 1 "$tmp"
  else
    ffmpeg -loglevel error -y -ss "$t" -i "$q" -vf "scale=$b:-1" -frames:v 1 "$tmp"
  fi
  cwebp -quiet -q $Q "$tmp" -o "$IMG/$z.webp"
  rm -f "$tmp"
}
# standbild <quelle.png> <ziel-ohne-endung> [breite]
standbild(){
  local q="$1" z="$2" b="${3:-1200}" tmp
  tmp="$(mktemp -t still).png"
  ffmpeg -loglevel error -y -i "$q" -vf "scale=$b:-1" "$tmp"
  cwebp -quiet -q $Q "$tmp" -o "$IMG/$z.webp"
  rm -f "$tmp"
}

# --- 3 · Poster --------------------------------------------------------
echo "Poster …"
rahmen "$ROH/c1.mp4"        0    film-start 900
rahmen "$ROH/c9-finale.mp4" 0    finale     1200

# --- 4 · Bilder der Seite ---------------------------------------------
# Sie stammen aus demselben Film. Genau deshalb passt die Seite
# hinterher zum Vorspann, ohne dass man es begruenden muesste.
echo "Bilder …"
standbild "$ROH/k7-abend.png"    ort         1400
standbild "$ROH/s2-dresscode.png" dresscode  1100
rahmen "$ROH/c2.mp4"        2.0  countdown  1400

rahmen "$ROH/c2.mp4"        2.3  d-ringe     760
rahmen "$ROH/c5.mp4"        ende d-glas      760
rahmen "$ROH/c5.mp4"        2.4  d-tafel     760
rahmen "$ROH/c7.mp4"        ende d-lichter   760

standbild "$ROH/a2-wagen.png"     g-wagen     1200
rahmen "$ROH/c2.mp4"        2.3  g-ringe     900
standbild "$ROH/k0-rosen.png"     g-rosen     900
standbild "$ROH/a3-tafel.png"     g-tafel     1200
standbild "$ROH/a1-villa.png"     g-villa     900
rahmen "$ROH/c6.mp4"        1.9  g-torte     900
standbild "$ROH/s1-papeterie.png" g-papeterie 1200

# --- 5 · Vorschau beim Teilen (1200x630) ------------------------------
echo "Vorschau …"
ffmpeg -loglevel error -y -i "$ROH/a3-tafel.png" \
  -vf "scale=1200:-1,crop=1200:630:0:(ih-630)*0.42" -q:v 3 "$IMG/vorschau.jpg"

# --- 6 . Nachmessen: stimmt das Schlussbild mit --grund ueberein? -----
echo "Naht nachmessen ..."
ffmpeg -loglevel error -y -sseof -0.08 -i "$VID/film.mp4" -vf "scale=4:4" \
  -update 1 -f rawvideo -pix_fmt rgb24 "$TMPNAHT"
python3 - "$SEITE" "$TMPNAHT" <<PRUEF
import sys
s = sys.argv[1].lstrip("#")
soll = tuple(int(s[i:i+2], 16) for i in (0, 2, 4))
d = open(sys.argv[2], "rb").read()
ist = (d[0], d[1], d[2])
ab = max(abs(a - b) for a, b in zip(ist, soll))
print("  Schlussbild %d/%d/%d   Seite %d/%d/%d   Abweichung %d  %s"
      % (ist[0], ist[1], ist[2], soll[0], soll[1], soll[2], ab,
         "gut" if ab <= 2 else "ZU GROSS"))
PRUEF
rm -f "$TMPNAHT"

echo
echo "Fertig:"
du -h "$VID"/*.mp4 "$IMG"/*.webp "$IMG"/vorschau.jpg | sort -h
echo
echo "Gesamt ausgeliefert: $(du -sh assets/video assets/img | awk '{s=$1} END{}' ; du -ch "$VID"/*.mp4 "$IMG"/*.webp "$IMG"/*.jpg | tail -1 | cut -f1)"
