#!/usr/bin/env bash
# Setzt nur die Versionsnummer neu, ohne zu veroeffentlichen.
# Fuer die Arbeit am lokalen Server: sonst haelt der Browser das alte
# Stylesheet fest, weil sich die Adresse nicht geaendert hat.
set -euo pipefail
cd "$(dirname "$0")/.."
V="$(date +%Y%m%d%H%M%S)"
perl -0777 -i -pe "s|(href=\"css/[a-z-]+\\.css)(\\?v=[0-9]+)?\"|\$1?v=$V\"|g" index.html
perl -0777 -i -pe "s|(src=\"js/[a-z-]+\\.js)(\\?v=[0-9]+)?\"|\$1?v=$V\"|g" index.html
perl -0777 -i -pe "s|((?:src\|href\|poster)=\"assets/img/[a-z0-9-]+\\.(?:webp\|jpg))(\\?v=[0-9]+)?\"|\$1?v=$V\"|g" index.html
# Bilder, die nur im Stylesheet stehen. Die CSS-Datei selbst bekommt zwar
# eine Version, die Adresse des Bildes darin aber nicht - ohne diese Zeile
# zeigt der Browser nach einem Bildwechsel weiter das alte.
perl -0777 -i -pe "s|url\('(\.\./assets/img/[a-z0-9-]+\.(?:webp\|jpg))(\?v=[0-9]+)?'\)|url('\$1?v=$V')|g" css/*.css
perl -0777 -i -pe "s|(^  version: ')[^']*(')|\${1}$V\${2}|m" js/inhalt.js
echo "Version $V"
