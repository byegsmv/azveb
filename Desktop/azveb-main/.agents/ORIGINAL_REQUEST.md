# Original User Request

## Initial Request — 2026-08-13T04:03:04Z

# Teamwork Project Prompt — Draft (Extended)

> Status: Step 2 — Expanding scope
> Goal: Test and repair admin/moderator/user panels, add ad posting options and premium features, then delegate to teamwork_preview
> Requested team: [none — teamwork routes from the description]

Proje: Drive'de "fermermarket" klasöründe mevcut admin, moderator ve user panellerindeki tüm modüllerin otomatik test edilip çalışmayanların onarılması, kullanıcı ilanları için 1‑gün ücretsiz, 15‑gün ve 30‑gün ücretli ilan seçeneklerinin eklenmesi, premium ilan ve mağaza öne çıkarma özelliklerinin entegrasyonu.

Working directory: ~/teamwork_projects/fermermarket_enhancements

## Requirements

### R1. Panel Test ve Onarım
- **Super Admin, Admin, Moderator** panellerindeki bütün UI ve backend modüllerinin (CRUD, erişim kontrolleri, veri akışı) otomatik test edilmesi.
- Çalışmayan/modül hatalıysa, hatanın kaynak kodu (JS/TS/Python) düzeltilerek testlerin %100 geçmesi sağlanmalı.
- Aynı test ve onarım süreci **User Panel** için de uygulanmalı.

### R2. İlan Yayınlama Modülü
- Kullanıcıların ilan eklerken **1‑gün (ücretsiz), 15‑gün, 30‑gün** seçeneklerinden birini seçebilmesi.
- 15‑gün ve 30‑gün seçenekleri **ödeme entegrasyonu** (örnek Stripe veya ödeme API'si) ile çalışmalı.
- Veritabanı şeması buna uygun şekilde güncellenmeli (ilan süresi, ödeme durumu, son tarih).

### R3. Premium & Mağaza Öne Çıkarma
- **Premium ilan** (renk, etiket) ve **Mağaza öne çıkarma** (carousel, üstte gösterim) özellikleri eklenmeli.
- Bu modüller için ayrı **admin kontrol paneli** (aktif/pasif) oluşturulmalı.
- Tüm premium özelliklerin test senaryoları (ücret kontrolü, görünürlük) otomatik olarak doğrulanmalı.

## Acceptance Criteria

### Panel Test & Onarım
- [ ] Super Admin, Admin, Moderator ve User panelindeki **her bir modül** en az bir birim testi ve entegrasyon testi geçer.
- [ ] Çalışmayan modül bulunursa, kodu düzeltilip testler tekrar çalıştırılır ve %100 başarı elde edilir.

### İlan Yayınlama
- [ ] Kullanıcı 1‑gün ilanı ücretsiz olarak oluşturabilir ve sistem otomatik olarak süresini 1 gün olarak ayarlar.
- [ ] 15‑gün ve 30‑gün ilanları için ödeme akışı (örnek `stripe.checkout`) başarılı bir şekilde tamamlanır ve ilan süresi ilgili gün sayısına ayarlanır.
- [ ] İlan süresi dolduğunda ilan otomatik olarak devre dışı bırakılır.

### Premium & Mağaza
- [ ] Premium ilan oluşturulduğunda UI’da belirgin bir etiket/renk gösterilir.
- [ ] Mağaza öne çıkarma özelliği aktif olduğunda, mağaza ana sayfasında ilk 3 slotta listelenir.
- [ ] Premium ve öne çıkarma fonksiyonları için admin panelinde toggle butonu bulunur ve bu butonun değişimi doğru şekilde saklanır.

---
*Next: when approved → delegate via invoke_subagent (see Delegation Protocol)*

## Follow-up — 2026-08-13T05:04:12Z

# Combined Teamwork Prompt – All Features

> Status: Ready to dispatch
> Goal: Implement panel test/repair, ad posting (free/paid with receipt upload and WhatsApp notification), premium features, automatic logo fallback, admin approval workflow, and AI‑driven banner generation.
> Requested team: [none — teamwork routes from the description]

Working directory: ~/teamwork_projects/fermermarket_full

## Requirements

### 1️⃣ Panel Test & Repair
- Super Admin, Admin, Moderator ve User panellerindeki tüm UI & backend modüllerinin otomatik test edilmesi.
- Hatalı/modül çalışmıyorsa kaynak kodu düzeltilip testler %100 geçmeli.

### 2️⃣ İlan Yayınlama Modülü
- 1‑gün (ücretsiz), 15‑gün ve 30‑gün seçenekleri.
- Ücretli seçeneklerde **dekont upload** (kullanıcı resim ekler), dekont **WhatsApp Business** numarasına gönderilir.
- Dekont gönderimi sonrası admin onayı gerekir; onaylanmazsa ilan görünmez.
- Veritabanı alanları: `durationDays`, `paymentStatus`, `receiptUrl`, `whatsappSent`.

### 3️⃣ Premium & Mağaza Öne Çıkarma
- Premium ilan etiketi & renk, mağaza carousel (ilk 3 slot).
- Admin panelinde toggle (`PREMIUM_ADS`, `STORE_PROMOTIONS`).
- Tüm premium işlemler admin/super‑admin/moderator onayı almalı.

### 4️⃣ Otomatik Logo/Ek Resim
- İlan, profil fotoğrafı veya mağaza logosu eksikse `fermermarket` logosu otomatik eklenir.

### 5️⃣ AI Banner Modülü
- API‑key‑only bağımlı AI görsel servisi (`AI_BANNER_API_KEY`).
- `POST /api/banner/generate` başlık, ürün adı, logo, iletişim alır, uygun boyutta (300×250) banner üretir.
- Sağ‑sol bannerlar responsive, mobilde %100 genişlik 150 px yüksekliğinde.
- API anahtarı süresi dolduğunda admin yeni anahtar ekleyebilecek, sistem otomatik olarak yeni anahtarı okuyacak.
- Anahtar yoksa placeholder banner gösterilir.

## Acceptance Criteria
- **Panel**: Tüm modüller test geçer, hatalar düzeltilir.
- **İlan**: Ücretsiz ilan 1 gün; ücretli ilanlar dekont upload → WhatsApp gönderimi → admin onayı → aktif.
- **Premium**: Premium etiket/renk ve mağaza carousel sadece admin onayıyla görünür.
- **Logo**: Eksik görseller otomatik `fermermarket` logosu ile doldurulur.
- **Banner**: `POST /api/banner/generate` %95 istek 2 s içinde sonuç verir; placeholder hata durumunda gösterilir; admin key güncellemesi anında etkili.
- **Kod**: `npm run lint` ve mevcut testler sorunsuz geçer; yeni birim testler %90+ kapsama sahip.

---
*Next: when approved → delegate via invoke_subagent (see Delegation Protocol)*

## Follow-up — 2026-08-13T07:24:54Z

# Teamwork Project Prompt — Draft

> Status: Step 1 — Eliciting project idea
> Goal: Craft prompt → get user approval → delegate to teamwork_preview
> Requested team: [none — teamwork routes from the description]

Proje: Drive'de "fermermarket" klasöründe hava durumu günlük tahmin ve nem bilgisi sağlayan bir araç geliştirilmesi, sistem hatalarının derin analiz edilip giderilmesi ve AI Agronom modülünün sorunsuz çalışması.

Working directory: ~/teamwork_projects/weather_tool_fermermarket

## Requirements

### R1. Hava durumu aracı
- Açık hava durumu API'si (OpenWeatherMap) kullanarak günlük tahmin ve nem bilgisini JSON string olarak döndürmeli.
- API anahtarı ortam değişkeni `OWM_API_KEY` içinde bulunmalı.
- Sonuç formatı: `{"date":"YYYY-MM-DD","temperature":"XX°C","humidity":"YY%"}`

### R2. Entegrasyon & UI
- Araç, mevcut `fermermarket` klasöründeki ilgili dosyalara (ör. `src/utils/weather.ts` veya `src/utils/weather.py`) eklenmeli.
- UI tasarımı bozulmayacak, mevcut CSS/HTML yapısına müdahale etmeyecek.

### R3. Sistem hatalarının analiz ve giderilmesi
- AI Agronom modülündeki hatalar/buglar (yanıt vermeme) derinlemesine incelenip düzeltilecek.
- Tüm yeni değişiklikler paralel olarak test edilecek ve entegrasyon sorunsuz olmalı.

## Acceptance Criteria

### Hava durumu aracı
- [ ] `get_weather(location: str) -> str` fonksiyonu, geçerli bir şehir adı alıp belirtilen JSON formatında günlük tahmin ve nem döndürür.
- [ ] API hataları (`not_found`, `rate_limit`) uygun hata mesajlarıyla `is_error:true` döner.

### Entegrasyon & UI
- [ ] `fermermarket` klasöründeki mevcut sayfalar/komponentler görsel olarak değişmez.
- [ ] Yeni fonksiyon proje derleme/test komutları (`npm run build` veya `npm run dev`) hatasız geçer.

### Sistem hataları
- [ ] AI Agronom modülü artık yanıt verir; hata logları yok.
- [ ] Tüm yeni eklenen kodlar static analysis (`npm run lint`) ve unit test (`npm test`) geçer.

---
*Next: when approved → delegate via invoke_subagent (see Delegation Protocol)*

