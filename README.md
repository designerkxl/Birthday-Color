# Doğum Günü Rengi

Doğum tarihini seç, sana özel rengi ve o rengin karakter yorumunu gör.

Gün, ay ve yıl bilgisinden bir renk üretilir. Sayfanın zemini bu renge dönüşür, HEX kodu ve burç yorumu tadında kısa bir karakter tanımı ekrana gelir.

**Canlı demo:** https://designerkxl.github.io/Birthday-Color/

## Özellikler

- Gün, ay ve yıldan kişiye özel renk üretimi
- Rengin HEX kodu ve tek tuşla kopyalama
- Renk ailesine, canlılığına ve derinliğine göre kısa karakter yorumu (30 farklı renk adı)
- Seçilen aya ve yıla göre geçerli gün listesi (artık yıllar dahil)
- Zemin rengine göre otomatik seçilen okunaklı yazı rengi
- Masaüstü ve mobilde uyumlu, klavye ve ekran okuyucu dostu tasarım
- Harici bağlantı yok: yazı tipi dahil her şey projenin içinde

## Renk nasıl hesaplanıyor?

Renk, HSL modeliyle üç değerden üretilir:

| Seçim | Belirlediği | Aralık |
|-------|-------------|--------|
| Gün   | Ton (hue) | 0° – 360° |
| Ay    | Doygunluk (saturation) | %0 – %100 |
| Yıl   | Açıklık (lightness) | %20 – %85 |

Açıklık, en eski yıllar siyaha, en yeni yıllar beyaza dönmesin diye %20–%85 arasında tutulur.

## Renk yorumu

Yorumlar `reading.js` dosyasında üretilir. Ton 10 renk ailesinden birini seçer, doygunluk ve açıklık metnin tonunu ve etiketleri belirler. Metinleri değiştirmek için bu dosyadaki renk ailesi listesini düzenlemen yeterlidir.

> Yorumlar eğlence amaçlıdır. Renk psikolojisi bilimsel bir kesinlik taşımaz.

## Yerelde çalıştırma

Kurulum gerekmez, derleme adımı yoktur.

```bash
git clone https://github.com/designerkxl/Birthday-Color.git
cd Birthday-Color
```

`index.html` dosyasını tarayıcıda açabilirsin. Yazı tipinin ve panoya kopyalama özelliğinin sorunsuz çalışması için küçük bir yerel sunucu önerilir:

```bash
python3 -m http.server 8000
# sonra tarayıcıda http://localhost:8000 adresini aç
```

## Proje yapısı

```
Birthday-Color/
├── index.html      Sayfa yapısı ve güvenlik politikası (CSP)
├── style.css       Tasarım
├── script.js       Renk hesaplama, arayüz ve koruma kodları
├── reading.js      Renk yorumu metinleri
├── _headers        Netlify / Cloudflare Pages güvenlik başlıkları
└── fonts/          Bricolage Grotesque (kendi içinde barındırılır)
```

## Güvenlik ve koruma

- Sıkı bir İçerik Güvenliği Politikası (CSP): yalnızca projenin kendi dosyaları yüklenir
- Sayfa başka sitelerde iframe içine gömülürse gizlenir
- Sağ tık, kopyalama ve metin seçimi kapalıdır

Tarayıcı tarafı koruma caydırıcıdır, kesin engel değildir. Kaynak kod zaten herkese açıktır.

## Kullanılan teknolojiler

HTML, CSS ve JavaScript (kütüphane yok).

## Lisans ve katkılar

- Yazı tipi: [Bricolage Grotesque](https://github.com/ateliertriay/bricolage), SIL Open Font License 1.1 ile lisanslıdır. Lisans metni `fonts/LICENSE-OFL.txt` dosyasındadır.
- Tasarım ve geliştirme: Köksal Akgün
