/* =========================================================
   FILM — Umschlag oeffnen, Kamerafahrt, Uebergang in die Seite

   Der ganze Sinn dieser Datei ist, dass der Gast keinen einzigen
   Schnitt sieht. Deshalb steht der Film nicht als eigene Szene da,
   sondern schiebt sich in die Bewegung des Umschlags hinein und
   loest sich am Ende in genau der Farbe auf, die die Seite hat.
   ========================================================= */
(function () {
  'use strict';

  var D = window.KARTE;
  var buehne     = document.getElementById('buehne');
  var umschlag   = document.getElementById('umschlag');
  var szene      = document.getElementById('umschlag-szene');
  var vorn       = document.getElementById('film-vorn');
  var hinten     = document.getElementById('film-hinten');
  var titel      = document.getElementById('film-titel');
  var balken     = document.getElementById('fortschritt');
  var knopfWeg   = document.getElementById('ueberspringen');
  var knopfTon   = document.getElementById('ton');
  var musik      = document.getElementById('musik');
  var seite      = document.getElementById('seite');

  var ruhig = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var gelaufen = false;

  // Zum Ausprobieren und Abnehmen: ?film=aus zeigt sofort die Seite.
  // Sonst muesste man beim Pruefen jedes Mal 27 Sekunden zusehen.
  var ohneFilm = new URLSearchParams(location.search).get('film') === 'aus';

  /* ---------- Musik ---------------------------------------------
     Kein Browser laesst Ton ohne Zutun zu. Deshalb startet sie genau
     im Moment des Antippens und blendet ueber zwei Sekunden auf. */

  var tonAn = false;
  var tonMoeglich = !!D.musik.datei;

  if (tonMoeglich) { musik.src = D.musik.datei; } else { knopfTon.hidden = true; }

  function musikAn() {
    if (!tonMoeglich || tonAn) return;
    musik.volume = 0;
    var p = musik.play();
    if (p && p.catch) p.catch(function () {});
    tonAn = true;
    knopfTon.setAttribute('aria-pressed', 'true');
    knopfTon.setAttribute('aria-label', 'Musik ausschalten');
    var start = performance.now();
    (function auf(t) {
      var f = Math.min(1, (t - start) / 2000);
      musik.volume = f * D.musik.lautstaerke;
      if (f < 1) requestAnimationFrame(auf);
    })(start);
  }

  function musikAus() {
    if (!tonAn) return;
    var von = musik.volume, start = performance.now();
    tonAn = false;
    knopfTon.setAttribute('aria-pressed', 'false');
    knopfTon.setAttribute('aria-label', 'Musik einschalten');
    (function ab(t) {
      var f = Math.min(1, (t - start) / 700);
      musik.volume = von * (1 - f);
      if (f < 1) requestAnimationFrame(ab); else musik.pause();
    })(start);
  }

  knopfTon.addEventListener('click', function () { tonAn ? musikAus() : musikAn(); });

  /* ---------- Der Ablauf ---------------------------------------- */

  function sperren(ja) {
    document.body.style.overflow = ja ? 'hidden' : '';
  }
  sperren(true);

  if (ohneFilm) {
    buehne.hidden = true;
    sperren(false);
    seite.classList.add('da');
    document.addEventListener('DOMContentLoaded', function () {
      document.dispatchEvent(new CustomEvent('film-vorbei'));
    });
    return;
  }

  umschlag.addEventListener('click', oeffnen);

  function oeffnen() {
    if (gelaufen) return;
    gelaufen = true;
    umschlag.removeEventListener('click', oeffnen);
    musikAn();

    if (ruhig) { szene.style.opacity = '0'; setTimeout(fertig, 500); return; }

    // 1 · Lasche auf, Karte faehrt heraus
    buehne.classList.add('oeffnet');

    // 2 · Die Kamera faehrt in die geprägte Rose auf der Karte
    setTimeout(function () { buehne.classList.add('faehrt-ein'); }, 1150);

    // 3 · Der Film ist da, bevor die Rose den Schirm ausfuellt
    setTimeout(starten, 2500);
  }

  function starten() {
    // Auf breiten Schirmen liegt derselbe Film unscharf dahinter, damit
    // eine 9:16-Fahrt auf 16:9 nicht zur Briefmarke wird.
    if (window.innerWidth / window.innerHeight > 9 / 16) {
      hinten.src = 'assets/video/film.mp4?v=' + D.version;
      hinten.play().catch(function () {});
    }
    vorn.src = 'assets/video/film.mp4?v=' + D.version;
    buehne.classList.add('laeuft');
    szene.style.opacity = '0';

    var p = vorn.play();
    if (p && p.catch) p.catch(function () { fertig(); });

    vorn.addEventListener('timeupdate', laufend);
    vorn.addEventListener('ended', ausblenden);
    // Wenn das Video gar nicht erst laedt, darf der Gast nicht haengen.
    vorn.addEventListener('error', fertig);
    setTimeout(function () { if (!vorn.duration) fertig(); }, 8000);
  }

  function laufend() {
    var d = vorn.duration;
    if (!d) return;
    var f = vorn.currentTime / d;
    balken.style.width = (f * 100).toFixed(2) + '%';
    // Der Titel kommt erst, wenn die Villa aus dem goldenen Licht steht -
    // nachgemessen bei Sekunde 23,0 von 27,4. Frueher laege er auf der
    // Ueberbelichtung und waere nicht zu lesen.
    if (vorn.currentTime > d - 4.4) titel.classList.add('da');
    // Kurz vor Schluss beginnt der Ausklang, damit die Farbe steht,
    // bevor das Video endet.
    if (vorn.currentTime > d - 1.0) ausblenden();
  }

  function ausblenden() {
    if (buehne.classList.contains('blendet')) return;
    buehne.classList.add('blendet');
    titel.classList.remove('da');
    setTimeout(fertig, 1150);
  }

  function fertig() {
    if (buehne.hidden) return;
    vorn.pause(); hinten.pause();
    buehne.hidden = true;
    sperren(false);
    seite.classList.add('da');
    window.scrollTo(0, 0);
    document.dispatchEvent(new CustomEvent('film-vorbei'));
    // Der Musikknopf wandert mit auf die Seite.
    if (tonMoeglich) document.dispatchEvent(new CustomEvent('ton-uebernehmen'));
  }

  knopfWeg.addEventListener('click', ausblenden);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !buehne.hidden && gelaufen) ausblenden();
  });

  // Der Film ist die Buehne. Wer waehrenddessen scrollt, will weiter.
  buehne.addEventListener('wheel', function () {
    if (buehne.classList.contains('laeuft')) ausblenden();
  }, { passive: true });
})();
