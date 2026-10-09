/* Paylaşım görseli: 1080x1920 (9:16) dikey kart üretir.
   Doğum tarihi metni kaldırılmış, Logo ve "Design by Digimooz" eklenmiştir. */
(function (root) {
  'use strict';

  var W = 1080;
  var H = 1920;
  var FONT = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

  function mulberry32(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

  function hsl(h, s, l, a) {
    h = ((h % 360) + 360) % 360;
    return 'hsla(' + h.toFixed(1) + ',' + clamp(s, 0, 100).toFixed(1) + '%,' +
      clamp(l, 0, 100).toFixed(1) + '%,' + (a === undefined ? 1 : a) + ')';
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function wrapText(ctx, text, maxWidth, maxLines) {
    if (!text) return [];
    var words = text.split(' ');
    var lines = [];
    var line = '';
    words.forEach(function (word) {
      var test = line ? line + ' ' + word : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    });
    if (line) lines.push(line);
    if (maxLines && lines.length > maxLines) {
      lines = lines.slice(0, maxLines);
      lines[maxLines - 1] = lines[maxLines - 1].replace(/[;,.\s]*$/, '') + '…';
    }
    return lines;
  }

  function loadLogoImage() {
    return new Promise(function (resolve) {
      var img = new Image();
      img.crossOrigin = 'anonymous'; // Canvas'ın indirme engeline (taint) takılmasını önler
      img.onload = function () { resolve(img); };
      img.onerror = function () {
        var fallback = new Image();
        fallback.crossOrigin = 'anonymous';
        fallback.onload = function () { resolve(fallback); };
        fallback.onerror = function () { resolve(null); };
        fallback.src = 'logo.png';
      };
      img.src = 'logo.png';
    });
  }

  function drawPebbles(ctx, st, rng) {
    var h = st.hue || 0, s = st.saturation || 70, l = st.lightness || 50;

    ctx.fillStyle = hsl(h, s * 0.8, Math.max(l - 30, 8));
    ctx.fillRect(0, 0, W, H);

    var count = 40;
    for (var i = 0; i < count; i++) {
      var r = 40 + rng() * 110;
      var x = rng() * W;
      var y = rng() * H;

      var hv = h + (rng() - 0.5) * 16;
      var sv = s + (rng() - 0.5) * 14;
      var lv = l + (rng() - 0.5) * 18;

      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.25)';
      ctx.shadowBlur = r * 0.25;
      ctx.shadowOffsetX = r * 0.05;
      ctx.shadowOffsetY = r * 0.08;

      var g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r);
      g.addColorStop(0, hsl(hv, sv, lv + 14));
      g.addColorStop(0.6, hsl(hv, sv, lv));
      g.addColorStop(1, hsl(hv, sv, lv - 18));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    var v = ctx.createRadialGradient(W / 2, H / 2, H * 0.2, W / 2, H / 2, H * 0.8);
    v.addColorStop(0, 'rgba(0,0,0,0)');
    v.addColorStop(1, 'rgba(0,0,0,0.35)');
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, W, H);
  }

  function drawCard(ctx, st, logoImg) {
    var r = st.reading || {};
    var cardW = 680;
    var pad = 40;
    var inner = cardW - pad * 2;
    var swatch = inner;

    var nameSize = 64;
    ctx.font = '800 ' + nameSize + 'px ' + FONT;
    var nameText = r.name || 'Özel Renk';
    while (ctx.measureText(nameText).width > inner && nameSize > 34) {
      nameSize -= 2;
      ctx.font = '800 ' + nameSize + 'px ' + FONT;
    }

    ctx.font = '600 24px ' + FONT;
    var traitLines = wrapText(ctx, (r.traits || []).join('  ·  '), inner, 2);
    ctx.font = '500 26px ' + FONT;
    var coreLines = wrapText(ctx, r.core || '', inner, 3);

    var y = pad + swatch + 32;
    var nameY = y + nameSize * 0.8; y += nameSize + 12;
    var metaY = y + 26; y += 40 + 16;
    var dividerY = y; y += 20;
    var traitY = y + 22; y += traitLines.length * 34 + 14;
    var coreY = y + 24; y += coreLines.length * 36 + 28;
    var creditY = y + 22; y += 40;
    var cardH = y + 16;

    var cardX = (W - cardW) / 2;
    var cardY = Math.round((H - cardH) / 2) + 30;

    // Kartın Üstündeki Logo (Kartın tam üst merkezinde)
    if (logoImg) {
      var logoW = 240;
      var logoH = Math.round(logoW * (logoImg.naturalHeight / (logoImg.naturalWidth || 1)));
      var logoX = (W - logoW) / 2;
      var logoY = cardY - logoH - 28;
      ctx.drawImage(logoImg, logoX, logoY, logoW, logoH);
    }

    // Beyaz Kart
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.35)';
    ctx.shadowBlur = 45;
    ctx.shadowOffsetY = 18;
    ctx.fillStyle = '#ffffff';
    roundRect(ctx, cardX, cardY, cardW, cardH, 24);
    ctx.fill();
    ctx.restore();

    // Renk Kutusu (Swatch)
    ctx.fillStyle = st.hex || '#000000';
    roundRect(ctx, cardX + pad, cardY + pad, swatch, swatch, 16);
    ctx.fill();

    var x = cardX + pad;
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'left';

    // Renk Başlığı
    ctx.fillStyle = '#17141a';
    ctx.font = '800 ' + nameSize + 'px ' + FONT;
    ctx.fillText(nameText, x, cardY + nameY);

    // HEX Kodu
    ctx.fillStyle = '#6b6473';
    ctx.font = '700 28px ' + FONT;
    ctx.fillText(st.hex || '', x, cardY + metaY);

    // Ayırıcı çizgi
    ctx.fillStyle = 'rgba(23,20,26,0.12)';
    ctx.fillRect(x, cardY + dividerY, inner, 2);

    // Karakter Özellikleri
    ctx.fillStyle = '#17141a';
    ctx.font = '700 24px ' + FONT;
    traitLines.forEach(function (line, i) {
      ctx.fillText(line, x, cardY + traitY + i * 34);
    });

    // Açıklama Metni
    ctx.fillStyle = '#3f3a47';
    ctx.font = '500 26px ' + FONT;
    coreLines.forEach(function (line, i) {
      ctx.fillText(line, x, cardY + coreY + i * 36);
    });

    // Design by Digimooz (Ortalı ve şık imza)
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(23,20,26,0.45)';
    ctx.font = '600 20px ' + FONT;
    ctx.fillText('Design by Digimooz', cardX + (cardW / 2), cardY + creditY);
  }

  function render(canvas, st, seed) {
    canvas.width = W;
    canvas.height = H;
    var ctx = canvas.getContext('2d');
    var rng = mulberry32(seed);

    return loadLogoImage().then(function (logoImg) {
      drawPebbles(ctx, st, rng);
      drawCard(ctx, st, logoImg);
    });
  }

  function init(options) {
    var doc = root.document;
    var openBtn = doc.getElementById('shareOpen');
    var dialog = doc.getElementById('shareDialog');
    var canvas = doc.getElementById('shareCanvas');
    var downloadBtn = doc.getElementById('shareDownload');
    var shuffleBtn = doc.getElementById('shareShuffle');
    var closeBtn = doc.getElementById('shareClose');
    var status = doc.getElementById('shareStatus');

    if (!openBtn || !dialog || !canvas) return;

    var state = null;

    function draw() {
      state = options.getState();
      if (status) status.textContent = 'Görsel hazırlanıyor…';
      var seed = Math.floor(Math.random() * 1000000);
      render(canvas, state, seed).then(function () {
        if (status) status.textContent = '';
      }).catch(function (err) {
        console.error(err);
        if (status) status.textContent = 'Önizleme oluşturulamadı.';
      });
    }

    openBtn.addEventListener('click', function () {
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
      }
      draw();
    });

    if (shuffleBtn) shuffleBtn.addEventListener('click', draw);
    if (closeBtn) closeBtn.addEventListener('click', function () { dialog.close(); });

    dialog.addEventListener('click', function (e) {
      if (e.target === dialog) dialog.close();
    });

    // İndirme mekanizması (init fonksiyonu içine yerleştirildi)
    if (downloadBtn) {
      downloadBtn.addEventListener('click', function () {
        try {
          if (canvas.toBlob) {
            canvas.toBlob(function (blob) {
              if (!blob) {
                if (status) status.textContent = 'İndirme başarısız.';
                return;
              }
              var url = URL.createObjectURL(blob);
              var a = doc.createElement('a');
              a.href = url;
              a.download = 'renk-karti-' + (state.hex || '').replace('#', '') + '.png';
              doc.body.appendChild(a);
              a.click();
              doc.body.removeChild(a);
              setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
              if (status) status.textContent = 'Görsel indirildi.';
            }, 'image/png');
          } else {
            var url = canvas.toDataURL('image/png');
            var a = doc.createElement('a');
            a.href = url;
            a.download = 'renk-karti-' + (state.hex || '').replace('#', '') + '.png';
            doc.body.appendChild(a);
            a.click();
            doc.body.removeChild(a);
            if (status) status.textContent = 'Görsel indirildi.';
          }
        } catch (e) {
          console.error(e);
          if (status) status.textContent = 'İndirme başarısız.';
        }
      });
    }
  }

  root.BirthdayShare = { init: init, render: render };
})(typeof window !== 'undefined' ? window : globalThis);