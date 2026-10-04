(function () {
  'use strict';

  /* ---------- Koruma ---------- */

  // Sayfa başka bir sitede iframe içine gömülürse içeriği gizle
  if (window.top !== window.self) {
    document.documentElement.style.display = 'none';
    try { window.top.location = window.self.location; } catch (e) { /* çapraz kaynak: engellenir */ }
  }

  function isFormControl(target) {
    return target && target.closest && target.closest('select, button, option');
  }

  // Sağ tık menüsü, kopyalama, kesme, sürükleme ve metin seçimi kapalı
  document.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  document.addEventListener('copy', function (e) { e.preventDefault(); });
  document.addEventListener('cut', function (e) { e.preventDefault(); });
  document.addEventListener('dragstart', function (e) { e.preventDefault(); });
  document.addEventListener('selectstart', function (e) {
    if (!isFormControl(e.target)) e.preventDefault();
  });

  /* ---------- Veri ---------- */

  var MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  var FIRST_YEAR = 1923;
  var LAST_YEAR = new Date().getFullYear();
  var DEFAULT_YEAR = 2000;

  var root = document.documentElement;
  var daySelect = document.getElementById('day');
  var monthSelect = document.getElementById('month');
  var yearSelect = document.getElementById('year');
  var dateText = document.getElementById('dateText');
  var hexText = document.getElementById('hexText');
  var copyBtn = document.getElementById('copyBtn');
  var copyStatus = document.getElementById('copyStatus');
  var reading = document.getElementById('reading');
  var readingTitle = document.getElementById('readingTitle');
  var readingText = document.getElementById('readingText');
  var readingChips = document.getElementById('readingChips');
  var readingShadow = document.getElementById('readingShadow');
  var themeMeta = document.querySelector('meta[name="theme-color"]');
  var iconLink = document.querySelector('link[rel="icon"]');

  var currentHex = '';
  var copyTimer = null;

  /* ---------- Yardımcılar ---------- */

  function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate(); // month: 1-12
  }

  function fillSelect(select, items) {
    var fragment = document.createDocumentFragment();
    items.forEach(function (item) {
      var option = document.createElement('option');
      option.value = item.value;
      option.textContent = item.text;
      fragment.appendChild(option);
    });
    select.appendChild(fragment);
  }

  function hslToRgb(h, s, l) {
    s /= 100; l /= 100;
    var k = function (n) { return (n + h / 30) % 12; };
    var a = s * Math.min(l, 1 - l);
    var f = function (n) {
      return l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    };
    return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
  }

  function toHex(rgb) {
    return '#' + rgb.map(function (v) {
      return v.toString(16).padStart(2, '0');
    }).join('').toUpperCase();
  }

  function luminance(rgb) {
    var c = rgb.map(function (v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }

  // Beyaz ya da koyu yazıdan hangisi renk üzerinde daha okunaklıysa onu seç
  function readableOn(rgb) {
    var L = luminance(rgb);
    var contrastWhite = 1.05 / (L + 0.05);
    var inkL = luminance([6, 6, 6]);
    var contrastInk = (L + 0.05) / (inkL + 0.05);
    return contrastWhite >= contrastInk ? '#ffffff' : '#060606';
  }

  /* ---------- Arayüz ---------- */

  function refreshDays() {
    var month = parseInt(monthSelect.value, 10);
    var year = parseInt(yearSelect.value, 10);
    var previousDay = parseInt(daySelect.value, 10) || 1;
    var max = daysInMonth(month, year);

    daySelect.innerHTML = '';
    var days = [];
    for (var d = 1; d <= max; d++) days.push({ value: d, text: d });
    fillSelect(daySelect, days);
    daySelect.value = Math.min(previousDay, max);
  }

  function setMeter(rowId, text, percent) {
    var row = document.getElementById(rowId);
    row.querySelector('dd').textContent = text;
    row.querySelector('.track i').style.setProperty('--p', percent.toFixed(1) + '%');
  }

  function renderReading(hue, saturation, lightness) {
    var r = window.BirthdayReading.describe(hue, saturation, lightness);
    readingTitle.textContent = r.name;
    readingText.textContent = r.text;
    readingShadow.textContent = 'Gölge yanın: ' + r.shadow + '.';
    readingChips.innerHTML = '';
    r.traits.forEach(function (trait) {
      var li = document.createElement('li');
      li.textContent = trait;
      readingChips.appendChild(li);
    });
    // Her değişimde yumuşak bir geçiş oynat
    reading.classList.add('swap');
    void reading.offsetWidth;
    reading.classList.remove('swap');
  }

  function updateColor() {
    var day = parseInt(daySelect.value, 10);
    var month = parseInt(monthSelect.value, 10);
    var year = parseInt(yearSelect.value, 10);

    // Gün → ton, ay → doygunluk, yıl → açıklık
    var hue = (day / 31) * 360;
    var saturation = (month / 12) * 100;
    // Açıklık %20-%85 aralığında tutulur; uçlarda siyah/beyaza dönmesin
    var lightness = 20 + ((year - FIRST_YEAR) / (LAST_YEAR - FIRST_YEAR)) * 65;

    var rgb = hslToRgb(hue, saturation, lightness);
    var hex = toHex(rgb);
    currentHex = hex;

    root.style.setProperty('--color', hex);
    root.style.setProperty('--on-color', readableOn(rgb));

    dateText.textContent = day + ' ' + MONTHS[month - 1] + ' ' + year;
    hexText.textContent = hex;

    renderReading(hue, saturation, lightness);

    setMeter('rowHue', Math.round(hue) + '°', (hue / 360) * 100);
    setMeter('rowSat', Math.round(saturation) + '%', saturation);
    setMeter('rowLight', Math.round(lightness) + '%', lightness);

    if (themeMeta) themeMeta.setAttribute('content', hex);
    if (iconLink) {
      iconLink.setAttribute('href',
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='14' fill='%23" +
        hex.slice(1) + "'/%3E%3C/svg%3E");
    }
  }

  function flashCopyLabel(text) {
    copyBtn.textContent = text;
    copyStatus.textContent = text;
    clearTimeout(copyTimer);
    copyTimer = setTimeout(function () {
      copyBtn.textContent = 'HEX kodunu kopyala';
      copyStatus.textContent = '';
    }, 1800);
  }

  function copyHex() {
    if (!navigator.clipboard || !window.isSecureContext) {
      flashCopyLabel('Kopyalanamadı');
      return;
    }
    navigator.clipboard.writeText(currentHex).then(
      function () { flashCopyLabel('Kopyalandı: ' + currentHex); },
      function () { flashCopyLabel('Kopyalanamadı'); }
    );
  }

  function init() {
    var today = new Date();
    fillSelect(monthSelect, MONTHS.map(function (name, i) {
      return { value: i + 1, text: name };
    }));
    var years = [];
    for (var y = FIRST_YEAR; y <= LAST_YEAR; y++) years.push({ value: y, text: y });
    fillSelect(yearSelect, years);

    // Varsayılan: bugünün günü ve ayı, 2000 yılı
    monthSelect.value = today.getMonth() + 1;
    yearSelect.value = DEFAULT_YEAR;
    refreshDays();
    daySelect.value = Math.min(today.getDate(), daysInMonth(today.getMonth() + 1, DEFAULT_YEAR));
    updateColor();
  }

  monthSelect.addEventListener('change', function () { refreshDays(); updateColor(); });
  yearSelect.addEventListener('change', function () { refreshDays(); updateColor(); });
  daySelect.addEventListener('change', updateColor);
  copyBtn.addEventListener('click', copyHex);

  init();
})();
