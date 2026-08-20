/* =========================================================
   INHALTE – pro Paar wird ausschliesslich diese Datei angefasst.
   Demo-Datensatz: Sophie & Alexander, 24.08.2027 (frei erfunden).

   Hinweis zum Ort: Der Film zeigt eine erzeugte Villa, die dem
   echten Schloss Benrath nicht aehnelt. Fuer eine echte Kundenseite
   entweder den Namen oder das Bildmaterial tauschen - eine Zeile.
   ========================================================= */
window.KARTE = {

  version: '20260820205628',

  paar: {
    sie:        'Sophie',
    er:         'Alexander',
    namen:      'Sophie & Alexander',
    kuerzel:    'S & A',
    datumPunkt: '24 · 08 · 2027',
    datumLang:  'Samstag · 24. August 2027',
    tag:        '24',
    monat:      'August',
    jahr:       '2027',
    beginnISO:  '2027-08-24T14:00:00',
    endeISO:    '2027-08-25T03:00:00',
    stadt:      'Düsseldorf',
  },

  ort: {
    name:    'Schloss Benrath',
    stadt:   'Düsseldorf',
    strasse: 'Benrather Schloßallee 104',
    plz:     '40597',
    lat: 51.163, lon: 6.871,
  },

  /* ---------- Der Ablauf. Vier Punkte, mehr braucht niemand. ---------- */
  ablauf: [
    { zeit: '14:00', titel: 'Trauung',
      text: 'Im Schlosspark, unter freiem Himmel. Bitte seid um Viertel vor zwei da – wir fangen pünktlich an.',
      bild: 'assets/img/d-ringe.webp',
      alt:  'Zwei schmale Goldringe auf cremefarbener Seide' },
    { zeit: '15:30', titel: 'Empfang',
      text: 'Champagner und Kleinigkeiten auf der Terrasse. Die Stunde, in der alle Fotos entstehen.',
      bild: 'assets/img/d-glas.webp',
      alt:  'Champagnerschale im Gegenlicht der Abendsonne' },
    { zeit: '18:00', titel: 'Dinner',
      text: 'Vier Gänge an der langen Tafel. Sitzplan hängt am Eingang, gesucht wird nicht.',
      bild: 'assets/img/d-tafel.webp',
      alt:  'Lange gedeckte Hochzeitstafel mit weißen Rosen und Kerzen' },
    { zeit: '21:00', titel: 'Celebration',
      text: 'Die Tafel wird zur Tanzfläche. Wir hören auf, wenn niemand mehr steht.',
      bild: 'assets/img/d-lichter.webp',
      alt:  'Lichterketten über der Terrasse in der blauen Stunde' },
  ],

  /* ---------- Dresscode ---------- */
  dresscode: {
    marke:  'What to wear',
    titel:  'Summer Elegant',
    text:   'Lange Kleider, Anzug mit Krawatte oder Fliege. Getraut wird auf Rasen – '
          + 'Pfennigabsätze sinken ein, eine flache oder breite Sohle ist die klügere Wahl. '
          + 'Weiß bleibt an diesem Tag bei Sophie.',
    palette: [
      { name: 'Ivory',     wert: '#f2ece1' },
      { name: 'Champagne', wert: '#e0cba8' },
      { name: 'Sage',      wert: '#8e9a86' },
      { name: 'Taupe',     wert: '#8b7f6e' },
      { name: 'Black',     wert: '#241f1a' },
    ],
  },

  /* ---------- Gut zu wissen ---------- */
  hinweise: [
    { titel: 'Übernachtung',
      text: 'Im Benrather Hof liegen 20 Zimmer bis zum 1. Juli 2027 auf unserem Namen, '
          + 'Stichwort „Hochzeit Sophie & Alexander“. Vom Schloss sind es sieben Minuten zu Fuß.' },
    { titel: 'Geschenke',
      text: 'Wir haben zwei Haushalte zusammengelegt, an Tellern fehlt es nicht. '
          + 'Wer uns etwas mitgeben möchte: Wir sparen auf zwei Wochen Apulien.' },
    { titel: 'Parken & Anreise',
      text: 'Vor dem Schloss stehen rund 60 Plätze, ab 18 Uhr kostenlos. '
          + 'Die S6 hält in Benrath, von dort acht Minuten zu Fuß. Am Bahnhof gibt es einen Taxistand.' },
    { titel: 'Kinder',
      text: 'Kinder sind herzlich dabei. Ab 18 Uhr gibt es im Kaminzimmer eine Betreuung, '
          + 'sagt uns bei der Rückmeldung kurz Bescheid.' },
  ],

  /* ---------- Galerie. Die Bilder stammen aus dem Film. ---------- */
  galerie: [
    { datei: 'assets/img/g-wagen.webp',    alt: 'Cremefarbener Oldtimer in der Lindenallee',            gross: true  },
    { datei: 'assets/img/g-ringe.webp',    alt: 'Zwei Goldringe auf Seide',                             gross: false },
    { datei: 'assets/img/g-rosen.webp',    alt: 'Weiße Gartenrosen und Schleierkraut',                  gross: false },
    { datei: 'assets/img/g-tafel.webp',    alt: 'Gedeckte Tafel auf der Terrasse im Abendlicht',        gross: true  },
    { datei: 'assets/img/g-villa.webp',    alt: 'Die Villa in der Abendsonne',                          gross: false },
    { datei: 'assets/img/g-torte.webp',    alt: 'Schlichte Hochzeitstorte mit weißen Rosen',            gross: false },
    { datei: 'assets/img/g-papeterie.webp',alt: 'Einladungskarte, Siegel und Salbeiband auf Seide',     gross: true  },
  ],

  rsvp: {
    frist:     '1. Juni 2027',
    fristISO:  '2027-06-01',
    maxGaeste: 4,
  },

  // Leer lassen, solange keine Musik da ist: dann bleibt der Notenknopf
  // verborgen und die Karte laeuft stumm. Sobald eine Datei vorliegt,
  // hier den Pfad eintragen - siehe assets/audio/HIER-MUSIK-ABLEGEN.txt
  musik: {
    datei:       '',
    lautstaerke: 0.38,
  },

  fuss: {
    verantwortlich: 'Verantwortlich für den Inhalt: Sophie Brandt und Alexander Reiss · hallo@sophie-und-alexander.de',
    datenschutz:    'Diese Seite setzt keine Cookies und lädt weder Schriften noch Karten von fremden Servern. '
                  + 'Die Rückmeldung wird derzeit nicht versendet. Der Kalender-Knopf legt eine Datei auf eurem Gerät ab.',
    demo:           'Demo-Karte von JP Webstudio. Paar, Termin, Hotel und Kontaktdaten sind erfunden.',
    studio:         'Digital Experience by JP Webstudio',
    studioUrl:      'https://webstudiojp.github.io/',
  },
};
