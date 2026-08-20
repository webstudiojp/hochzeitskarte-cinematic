#!/usr/bin/env bash
# Setzt eine frische Versionsnummer an alle eigenen Dateien und stellt live.
# Ohne das liefern Browser tagelang die alte Fassung aus dem Zwischenspeicher -
# beim Kunden hiesse das: geaenderte Uhrzeit, Gaeste sehen die alte.
set -euo pipefail
cd "$(dirname "$0")/.."

[ -f assets/video/film.mp4 ] || { echo "assets/video/film.mp4 fehlt - erst ./bin/film-bauen.sh"; exit 1; }

./bin/frisch.sh > /dev/null
V="$(perl -ne "print \$1 if /^  version: '([^']*)'/" js/inhalt.js)"
echo "Version $V gesetzt."

git add -A
git commit -q -m "${1:-Aktualisierung}

Version $V

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>" || { echo "Nichts zu committen."; exit 0; }

git remote get-url origin >/dev/null 2>&1 || {
  echo "Kein origin eingetragen. Erst das Repo auf GitHub anlegen und"
  echo "  git remote add origin <adresse>"
  echo "Der Commit liegt bereits lokal."
  exit 0
}
git push -q origin main
echo "Live. In etwa einer Minute ausgeliefert."
