/* =========================================================
   SEITE — Inhalte einsetzen, Countdown, Ablauf, Galerie,
            Ort, Rueckmeldung, Finale.
   Nichts hier laedt von fremden Servern. Karten und Kalender
   oeffnen sich erst nach einem Klick des Gastes.
   ========================================================= */
(function () {
  'use strict';

  var D = window.KARTE;
  var ruhig = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(s, w) { return (w || document).querySelector(s); }
  function $$(s, w) { return Array.prototype.slice.call((w || document).querySelectorAll(s)); }
  function el(t, k, x) { var n = document.createElement(t); if (k) n.className = k; if (x != null) n.textContent = x; return n; }

  // Alles, was erst aus dem Skript geladen wird, bekommt dieselbe
  // Versionsnummer wie die Dateien im Kopf der Seite. Sonst zeigen
  // Browser nach einer Aenderung tagelang die alten Bilder.
  function v(pfad) { return pfad + '?v=' + D.version; }

  /* ---------- 1 · Inhalte aus inhalt.js einsetzen ---------- */

  function tief(pfad) {
    return pfad.split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, D);
  }
  $$('[data-inhalt]').forEach(function (n) {
    var w = tief(n.getAttribute('data-inhalt'));
    if (typeof w === 'string') n.textContent = w;
  });
  document.title = D.paar.namen + ' — Wir heiraten';
  $('#studio').href = D.fuss.studioUrl;

  /* ---------- 2 · Countdown ---------- */

  var ziel = new Date(D.paar.beginnISO).getTime();
  var uTage = $('#u-tage'), uStd = $('#u-std'), uMin = $('#u-min'), uSek = $('#u-sek');

  function zwei(n) { return n < 10 ? '0' + n : String(n); }

  function ticken() {
    var rest = ziel - Date.now();
    if (rest <= 0) {
      $('#uhr').hidden = true;
      $('.countdown-schluss').textContent = 'Heute sagen wir Ja.';
      return;
    }
    var s = Math.floor(rest / 1000);
    uTage.textContent = Math.floor(s / 86400);
    uStd.textContent  = zwei(Math.floor(s % 86400 / 3600));
    uMin.textContent  = zwei(Math.floor(s % 3600 / 60));
    uSek.textContent  = zwei(s % 60);
  }
  ticken();
  setInterval(ticken, 1000);

  /* ---------- 3 · Ablauf ---------- */

  var ablauf = $('#ablauf');
  D.ablauf.forEach(function (p, i) {
    var w = el('div', 'punkt');
    w.appendChild(el('div', 'punkt-zeit', p.zeit));
    var k = el('div', 'punkt-koerper');
    k.appendChild(el('h3', 'punkt-titel', p.titel));
    k.appendChild(el('p', 'punkt-text', p.text));
    if (p.bild) {
      var b = new Image();
      b.className = 'punkt-bild'; b.src = v(p.bild); b.alt = p.alt || '';
      b.loading = 'lazy'; b.decoding = 'async';
      k.appendChild(b);
    }
    w.appendChild(k);
    w.setAttribute('data-tritt', '');
    w.style.setProperty('--warten', (i * 90) + 'ms');
    ablauf.appendChild(w);
  });

  /* ---------- 4 · Dresscode-Palette ---------- */

  var pal = $('#palette');
  D.dresscode.palette.forEach(function (f) {
    var fig = el('figure');
    var i = el('i'); i.style.background = f.wert;
    fig.appendChild(i);
    fig.appendChild(el('figcaption', null, f.name));
    pal.appendChild(fig);
  });

  /* ---------- 5 · Gut zu wissen ---------- */

  var wissen = $('#wissen');
  D.hinweise.forEach(function (h, i) {
    var z = el('div', 'wissen-zeile');
    z.appendChild(el('h3', null, h.titel));
    z.appendChild(el('p', null, h.text));
    z.setAttribute('data-tritt', '');
    z.style.setProperty('--warten', (i * 70) + 'ms');
    wissen.appendChild(z);
  });

  /* ---------- 6 · Galerie ---------- */

  var gal = $('#galerie');
  D.galerie.forEach(function (g, i) {
    var fig = el('figure', g.gross ? 'gross' : '');
    var b = new Image();
    b.src = v(g.datei); b.alt = g.alt;
    b.loading = 'lazy'; b.decoding = 'async';
    fig.appendChild(b);
    fig.setAttribute('data-tritt', '');
    fig.style.setProperty('--warten', ((i % 2) * 110) + 'ms');
    // Jedes zweite Bild laeuft langsamer als das Scrollen - sonst waere
    // es kein Parallax, sondern nur eine zweite Geschwindigkeit fuer alle.
    fig.dataset.tempo = (i % 3 === 0) ? '0.10' : (i % 3 === 1 ? '0.05' : '0.16');
    gal.appendChild(fig);
  });

  /* ---------- 7 · Ort ---------- */

  var meldung = $('#meldung');
  function sagen(t) { meldung.textContent = t; }

  var adresseText = D.ort.name + ', ' + D.ort.strasse + ', ' + D.ort.plz + ' ' + D.ort.stadt;

  $('#route').href = 'https://www.google.com/maps/dir/?api=1&destination='
                   + D.ort.lat + ',' + D.ort.lon;

  $('#adresse').addEventListener('click', function (e) {
    var k = e.currentTarget;
    function gut() { k.lastChild.textContent = ' Adresse kopiert'; sagen('Adresse kopiert.');
                     setTimeout(function () { k.lastChild.textContent = ' Adresse kopieren'; }, 2600); }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(adresseText).then(gut, function () { sagen(adresseText); });
    } else { sagen(adresseText); }
  });

  $('#kalender').addEventListener('click', function () {
    function stempel(iso) { return new Date(iso).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'; }
    var ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//JP Webstudio//Hochzeitskarte//DE',
      'BEGIN:VEVENT',
      'UID:' + Date.now() + '@hochzeitskarte',
      'DTSTAMP:' + stempel(new Date().toISOString()),
      'DTSTART:' + stempel(D.paar.beginnISO),
      'DTEND:'   + stempel(D.paar.endeISO),
      'SUMMARY:Hochzeit ' + D.paar.namen,
      'LOCATION:' + adresseText.replace(/,/g, '\\,'),
      'END:VEVENT', 'END:VCALENDAR'
    ].join('\r\n');
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    a.download = 'Hochzeit-' + D.paar.sie + '-und-' + D.paar.er + '.ics';
    a.click();
    URL.revokeObjectURL(a.href);
    sagen('Termin gespeichert.');
  });

  /* ---------- 8 · Rueckmeldung ---------- */

  var antwort = { dabei: null, name: '', personen: 1, essen: null, allergien: '', nachricht: '' };
  var schritte = $$('.schritt');
  var jetzt = 1;

  function zeigen(n) {
    schritte.forEach(function (s) { s.classList.toggle('aktiv', +s.dataset.schritt === n); });
    jetzt = n;
    var k = $('.schritt.aktiv h2, .schritt.aktiv p');
    if (k) k.setAttribute('tabindex', '-1'), k.focus({ preventScroll: true });
  }

  function drueckbar(gruppe, aufWahl) {
    $$('button', gruppe).forEach(function (b) {
      b.addEventListener('click', function () {
        $$('button', gruppe).forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true');
        aufWahl(b);
      });
    });
  }

  $('#ja').addEventListener('click', function () {
    antwort.dabei = true;
    $('#ja').setAttribute('aria-pressed', 'true');
    $('#nein').setAttribute('aria-pressed', 'false');
    setTimeout(function () { zeigen(2); }, 220);
  });
  $('#nein').addEventListener('click', function () {
    antwort.dabei = false;
    $('#nein').setAttribute('aria-pressed', 'true');
    $('#ja').setAttribute('aria-pressed', 'false');
    setTimeout(function () { zeigen(2); }, 220);
  });

  var zahlen = $('#zahlen');
  for (var i = 1; i <= D.rsvp.maxGaeste; i++) {
    var z = el('button', 'zahl', String(i));
    z.type = 'button'; z.setAttribute('aria-pressed', i === 1 ? 'true' : 'false');
    z.setAttribute('aria-label', i + (i === 1 ? ' Person' : ' Personen'));
    zahlen.appendChild(z);
  }
  drueckbar(zahlen, function (b) { antwort.personen = +b.textContent; });
  drueckbar($('#essen'), function (b) { antwort.essen = b.textContent; });

  $$('[data-weiter]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (jetzt === 2) {
        var f = $('#name'), feld = f.closest('.feld');
        if (!f.value.trim()) { feld.classList.add('hat-fehler'); f.focus(); return; }
        feld.classList.remove('hat-fehler');
        antwort.name = f.value.trim();
        // Wer absagt, wird nicht nach Personenzahl und Essen gefragt.
        zeigen(antwort.dabei ? 3 : 5);
        return;
      }
      zeigen(jetzt + 1);
    });
  });

  $$('[data-zurueck]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (jetzt === 5 && !antwort.dabei) { zeigen(2); return; }
      zeigen(jetzt - 1);
    });
  });

  $('#name').addEventListener('input', function () {
    this.closest('.feld').classList.remove('hat-fehler');
  });

  $('#senden').addEventListener('click', function () {
    antwort.allergien = $('#allergien').value.trim();
    antwort.nachricht = $('#nachricht').value.trim();
    // Noch nicht angebunden: die Antwort wird geprueft, aber nicht versendet.
    if (!antwort.dabei) {
      $('#danke-satz').textContent = 'Schade.';
      $('#danke-text').innerHTML = 'Wir hätten euch gern dabeigehabt.<br>Wir denken an euch.';
    }
    zeigen(6);
    $('#rsvp').scrollIntoView({ behavior: ruhig ? 'auto' : 'smooth', block: 'center' });
  });

  /* ---------- 9 · Finale: Video erst laden, wenn es gebraucht wird ---------- */

  var finale = $('#finale-video');
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (eintraege) {
      eintraege.forEach(function (e) {
        if (e.isIntersecting) {
          if (!finale.src) finale.src = v('assets/video/finale.mp4');
          if (!ruhig) finale.play().catch(function () {});
        } else { finale.pause(); }
      });
    }, { threshold: 0.15 }).observe($('#finale'));
  }

  /* ---------- 10 · Auftritt beim Scrollen ---------- */

  if ('IntersectionObserver' in window) {
    var beobachter = new IntersectionObserver(function (eintraege) {
      eintraege.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('da'); beobachter.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    $$('[data-tritt]').forEach(function (n) { beobachter.observe(n); });
  } else {
    $$('[data-tritt]').forEach(function (n) { n.classList.add('da'); });
  }

  /* ---------- 11 · Bewegung, die an den Scrollstand gebunden ist ---------- */

  var ablaufBox = $('#ablauf');
  var fuellung  = $('#ablauf-fuellung');
  var punkte    = null;
  var ortBox    = $('#ort');
  var ortBild   = $('#ort-bild');
  var countdown = $('#countdown');
  var galBilder = null;
  var offen     = false;

  function messen() {
    punkte    = $$('.punkt');
    galBilder = $$('#galerie figure');
  }

  function zeichnen() {
    offen = false;
    if (ruhig) {
      // Ohne Bewegung wird die Linie nicht gezeichnet, sondern steht
      // einfach da - sonst bliebe sie fuer immer leer und die Punkte hohl.
      fuellung.style.transform = 'scaleY(1)';
      $$('.punkt').forEach(function (p) { p.classList.add('erreicht'); });
      return;
    }
    var h = window.innerHeight;

    // Die Linie im Ablauf waechst mit dem Lesefortschritt
    if (punkte && punkte.length) {
      var b = ablaufBox.getBoundingClientRect();
      var f = (h * 0.62 - b.top) / b.height;
      fuellung.style.transform = 'scaleY(' + Math.max(0, Math.min(1, f)) + ')';
      punkte.forEach(function (p) {
        var r = p.getBoundingClientRect();
        p.classList.toggle('erreicht', r.top < h * 0.62);
      });
    }

    // Der Ort geht beim Scrollen von 1.08 auf 1 zurueck
    var o = ortBox.getBoundingClientRect();
    if (o.bottom > 0 && o.top < h) {
      var g = 1 - Math.max(0, Math.min(1, (h - o.top) / (h + o.height)));
      ortBild.style.setProperty('--skala', (1 + g * 0.08).toFixed(4));
    }

    // Countdown-Hintergrund zieht ganz leicht auf
    var c = countdown.getBoundingClientRect();
    if (c.bottom > 0 && c.top < h) {
      var z = Math.max(0, Math.min(1, (h - c.top) / (h + c.height)));
      countdown.style.setProperty('--zoom', (1.04 + z * 0.07).toFixed(4));
    }

    // Galerie: drei Geschwindigkeiten, nicht eine
    if (galBilder) {
      galBilder.forEach(function (fig) {
        var r = fig.getBoundingClientRect();
        if (r.bottom < -200 || r.top > h + 200) return;
        var mitte = r.top + r.height / 2 - h / 2;
        fig.firstChild.style.setProperty('--verschub', (-mitte * +fig.dataset.tempo).toFixed(1) + 'px');
      });
    }
  }

  function anstossen() {
    if (offen) return;
    offen = true;
    requestAnimationFrame(zeichnen);
  }

  window.addEventListener('scroll', anstossen, { passive: true });
  window.addEventListener('resize', function () { messen(); anstossen(); });

  /* ---------- 12 · Der Musikknopf zieht auf die Seite um ---------- */

  document.addEventListener('ton-uebernehmen', function () {
    var alt = document.getElementById('ton');
    if (!alt) return;
    var neu = alt.cloneNode(true);
    neu.id = 'ton-seite';
    neu.className = 'film-knopf ton-seite';
    document.body.appendChild(neu);
    neu.addEventListener('click', function () { alt.click(); syncen(); });
    function syncen() {
      var an = alt.getAttribute('aria-pressed') === 'true';
      neu.setAttribute('aria-pressed', an ? 'true' : 'false');
      neu.setAttribute('aria-label', an ? 'Musik ausschalten' : 'Musik einschalten');
      neu.classList.toggle('stumm', !an);
    }
    syncen();
  });

  document.addEventListener('film-vorbei', function () { messen(); anstossen(); });
  messen();
  anstossen();
})();
