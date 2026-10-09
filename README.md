# Birthday Color 🎨

Kullanıcıların doğum tarihlerine göre (Gün, Ay, Yıl) benzersiz bir **HSL** renk kodu üreten, bu renge özel kişilik analizi sunan ve sosyal medyada paylaşılabilecek yüksek çözünürlüklü kartlar oluşturan modern bir web uygulaması.

Canlı test adresi: [digimooz.com/dgr](https://digimooz.com/dgr/)

---

## ✨ Özellikler

- **Dinamik Renk Algoritması:** Doğum tarihinin her bir bileşeni (gün, ay, yıl) kullanılarak benzersiz bir renk üretilir.
- **Akıllı Metin Kontrastı:** Arka plan rengine göre metinlerin erişilebilirliğini korumak için dinamik parlaklık (luminance) hesabı yapılarak metin rengi açık ya da koyu olarak otomatik ayarlanır.
- **Kişilik & Renk Analizi:** Üretilen ton ailesine göre (Kırmızı, Turuncu, Sarı, Turkuaz, Gece Mavisi vb.) renk adı, öne çıkan karakteristik özellikler ve "gölge yan" yorumları gösterilir.
- **HEX Kodu Kopyalama:** Tek tıkla üretilen rengin HEX kodunu panoya kopyalama desteği.
- **9:16 Hikaye/Paylaşım Kartı Oluşturucu:**
  - HTML5 Canvas ve prosedürel desen oluşturma (Mulberry32 PRNG tabanlı organik çakıl taşı/arka plan deseni) kullanır.
  - 1080x1920 piksel çözünürlükte Instagram Stories / TikTok / Durum formatında kart önizlemesi ve tek tıkla PNG formatında indirme imkânı sunar.
- **Modern & Duyarlı (Responsive) Tasarım:** Mobil, tablet ve masaüstü ekranlar için optimize edilmiş arayüz.

---

## 🧮 Renk Hesaplama Mantığı

Renk üretimi **HSL** (Hue, Saturation, Lightness) renk uzayı referans alınarak şu formülle hesaplanır:

| Parametre | Tarih Girdisi | Formül | Açıklama |
|---|---|---|---|
| **Hue (Ton)** | Gün (1 - 31) | `(Gün / 31) * 360` | Rengin ana ton çemberindeki açısını ($0^\circ - 360^\circ$) belirler. |
| **Saturation (Doygunluk)** | Ay (1 - 12) | `(Ay / 12) * 100` | Rengin canlılık yüzdesini ($8.3\% - 100\%$) belirler. |
| **Lightness (Açıklık)** | Yıl ($1923 - \text{Güncel}$) | `20 + ((Yıl - 1923) / (Güncel - 1923)) * 65` | Rengin parlaklık/koyuluk düzeyini ($20\% - 85\%$) belirler. |

---

## 🛠️ Teknolojiler

- **HTML5:** Anlamsal yapılar ve Canvas API
- **CSS3:** Modern CSS değişkenleri (`CSS Variables`), Flexbox, CSS Grid ve Responsive `@media` kuralları
- **JavaScript (Vanilla JS - ES6+):** Sıfır harici kütüphane bağımlılığı (Pure JavaScript)

---

## 📁 Proje Yapısı

```plaintext
birthday-color/
├── index.html        # Ana HTML yapısı ve panel arayüzü
├── style.css         # Modal, buton ve duyarlı tasarım stilleri
├── script.js         # Tarih seçimleri, HSL/RGB dönüşümleri ve ana uygulama mantığı
├── reading.js        # Ton ve doygunluk bazlı metin/karakter analiz motoru
├── share.js          # Canvas tabanlı 1080x1920 hikaye kartı üreticisi ve indirme mantığı
├── logo.png          # Proje logosu
└── README.md         # Proje dokümantasyonu
```

---

## 🚀 Canlı Demo & Kurulum

### Canlı Demo
Uygulamayı tarayıcınızda doğrudan denemek için:  
👉 **[https://digimooz.com/dgr/](https://digimooz.com/dgr/)**

---

## 🚀 Kurulum ve Çalıştırma

Projeyi çalıştırmak için herhangi bir paket yöneticisine veya derleme adımına gerek yoktur.

1. Depoyu klonlayın:
   ```bash
   git clone https://github.com/kullanici-adi/birthday-color.git
   cd birthday-color
   ```

2. Projeyi bir yerel sunucu ile açın *(Canvas güvenlik ilkeleri ve resim yüklemeleri için yerel sunucu önerilir)*:
   ```bash
   # Python 3 ile:
   python3 -m http.server 8000

   # veya VS Code kullanıyorsanız "Live Server" eklentisini kullanabilirsiniz.
   ```

3. Tarayıcınızda açın:
   ```
   http://localhost:8000
   ```

---

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına göz atabilirsiniz.

---

<p align="center">
  Design & Development by <b>Digimooz</b>
</p>
