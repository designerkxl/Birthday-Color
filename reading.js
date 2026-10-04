/* Renk yorumu: ton (gün), doygunluk (ay) ve açıklık (yıl) değerlerinden
   burç yorumu tadında kısa bir karakter tanımı üretir. Eğlence amaçlıdır. */
(function (root) {
  'use strict';

  // Ton aralığına göre renk aileleri (derece cinsinden üst sınır)
  var FAMILIES = [
    {
      max: 15, // 346°-360° da kırmızıya düşer
      names: ['Bordo', 'Ateş Kırmızısı', 'Mercan'],
      effect: 'Kırmızı, bir odadaki herkesin nabzını yükselten renktir; yanında olanlar harekete geçme isteği duyar.',
      core: 'Sen cesur ve kararlısın; işleri başlatan, peşini de bırakmayan kişisin.',
      traits: ['Cesur', 'Kararlı'],
      shadow: 'sabırsızlık ve çabuk parlama'
    },
    {
      max: 40,
      names: ['Tarçın', 'Mandalina', 'Şeftali'],
      effect: 'Turuncu sıcaklık ve neşe yayar; yanında olanlar kendini davetli hisseder.',
      core: 'Sen girişken, sosyal ve enerjiksin; her ortama canlılık katacak bir fikrin mutlaka vardır.',
      traits: ['Girişken', 'Sıcakkanlı'],
      shadow: 'aynı anda çok işe girişip dağılmak'
    },
    {
      max: 70,
      names: ['Hardal', 'Güneş Sarısı', 'Papatya'],
      effect: 'Sarı iyimserlik ve zihin açıklığı getirir; yanında olanların keyfi yerine gelir.',
      core: 'Sen meraklı, esprili ve fikir dolusun; hayata hep gülümseyerek bakarsın.',
      traits: ['İyimser', 'Meraklı'],
      shadow: 'zihnini bir türlü susturamamak'
    },
    {
      max: 100,
      names: ['Zeytin Yeşili', 'Fıstık Yeşili', 'Bahar Filizi'],
      effect: 'Bu ton tazelik ve yenilenme hissi verir; yanında olanlar derin bir nefes alır.',
      core: 'Sen yeni başlangıçlara hep açıksın; oyunbaz ve umut dolu bakışınla çevreni canlandırırsın.',
      traits: ['Taze', 'Oyunbaz'],
      shadow: 'bir yerde uzun süre duramamak'
    },
    {
      max: 160,
      names: ['Orman Yeşili', 'Zümrüt', 'Nane'],
      effect: 'Yeşil dinginlik ve güven verir; yanında olanlar köklenmiş hisseder.',
      core: 'Sen şefkatli, dengeli ve güvenilirsin; sevdiklerinin sığındığı bir limansın.',
      traits: ['Güvenilir', 'Şefkatli'],
      shadow: 'kendini ihmal edip herkesin yükünü taşımak'
    },
    {
      max: 200,
      names: ['Petrol', 'Turkuaz', 'Deniz Köpüğü'],
      effect: 'Turkuaz berraklık ve ferahlık getirir; yanında olanların zihni sakinleşir.',
      core: 'Sen iletişimde ustasın; hem duygularını hem düşüncelerini net ve özgün biçimde anlatırsın.',
      traits: ['Berrak', 'İletişimci'],
      shadow: 'gereğinden mesafeli görünmek'
    },
    {
      max: 250,
      names: ['Gece Mavisi', 'Okyanus Mavisi', 'Gökyüzü'],
      effect: 'Mavi huzur ve güven uyandırır; yanında olanlar rahatlar.',
      core: 'Sen sadık, sakin ve mantıklısın; zor anlarda soğukkanlılığınla yol gösterirsin.',
      traits: ['Sadık', 'Sakin'],
      shadow: 'duygularını içine atmak'
    },
    {
      max: 290,
      names: ['Çivit', 'Ametist', 'Lavanta'],
      effect: 'Mor gizem ve hayal gücü uyandırır; yanında olanlar seni merak eder.',
      core: 'Sen sezgisel ve derin düşünürsün; sıradan olanın ardındaki anlamı görürsün.',
      traits: ['Sezgisel', 'Hayalperest'],
      shadow: 'kendi dünyana fazla çekilmek'
    },
    {
      max: 330,
      names: ['Böğürtlen', 'Orkide', 'Leylak'],
      effect: 'Bu ton coşku ve özgünlük taşır; yanında olanlar kendi tuhaflıklarıyla rahat eder.',
      core: 'Sen sıra dışı ve ifade gücü yüksek birisin; kalıpların dışında parlarsın.',
      traits: ['Özgün', 'Sanatçı ruhlu'],
      shadow: 'anlaşılmadığını düşünüp kırılmak'
    },
    {
      max: 346,
      names: ['Gül Kurusu', 'Gül Pembesi', 'Pudra'],
      effect: 'Pembe şefkat ve yumuşaklık çağrıştırır; yanında olanlar kabul gördüğünü hisseder.',
      core: 'Sen empatik ve sevgi dolusun; insanların duygusunu daha onlar söylemeden sezersin.',
      traits: ['Empatik', 'Sevecen'],
      shadow: 'herkesi memnun etmeye çalışmak'
    }
  ];

  // Doygunluk (ay): sönük / dengeli / canlı
  var SATURATION = [
    { max: 30, sentence: 'Enerjin sessiz ve ölçülü akar; gösterişe değil derinliğe güvenirsin.', trait: 'Mütevazı' },
    { max: 65, sentence: 'Duygu ile mantığı dengeleyerek hareket edersin.', trait: 'Dengeli' },
    { max: 101, sentence: 'Tutkun yüksek; girdiğin ortamda varlığını herkes hisseder.', trait: 'Tutkulu' }
  ];

  // Açıklık (yıl): koyu / orta / açık
  var LIGHTNESS = [
    { max: 40, sentence: 'İç dünyan derin; az konuşur, çok düşünürsün.', trait: 'Derinlikli' },
    { max: 62, sentence: 'Ayakların yere basar, hayallerin yine de yükseklerde kalır.', trait: 'Sağlam' },
    { max: 101, sentence: 'Çevrene ışık ve hafiflik taşırsın.', trait: 'İçten' }
  ];

  function pick(list, value) {
    for (var i = 0; i < list.length; i++) {
      if (value < list[i].max) return { item: list[i], index: i };
    }
    return { item: list[list.length - 1], index: list.length - 1 };
  }

  // hue: 0-360, saturation: 0-100, lightness: 0-100
  function describe(hue, saturation, lightness) {
    var h = hue >= 346 ? 0 : hue;
    var family = pick(FAMILIES, h).item;
    var sat = pick(SATURATION, saturation).item;
    var light = pick(LIGHTNESS, lightness);

    return {
      name: family.names[light.index],
      text: [family.effect, family.core, sat.sentence, light.item.sentence].join(' '),
      traits: [family.traits[0], family.traits[1], sat.trait, light.item.trait],
      shadow: family.shadow
    };
  }

  root.BirthdayReading = { describe: describe };
})(typeof window !== 'undefined' ? window : globalThis);
