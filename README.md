# CCAR-F Çalışma Planı

30 ücretsiz CCAR-F dersine bağlantılar sunan, iPad ana ekranına eklenebilen kişisel çalışma planı. İlerleme tarayıcının yerel depolamasında kalır. Uygulama kabuğu çevrimdışı açılır. Hak sahibinden izin aldıktan sonra kullanıcı ders metinlerini kendi cihazına indirip uygulama içinde çevrimdışı okuyabilir.

## Neden dersler çevrimdışı değil?

[AI Cert Guides kullanım koşulları](https://claudecertificationguide.com/terms), ücretsiz derslerin tamamını başka bir sitede yeniden yayımlamayı yasaklıyor. Bu depoda ders metni veya kaynak sitenin görsel varlıkları bulunmaz. Uygulamadaki indirme düğmesi, kullanıcının kişisel çevrimdışı kullanım iznini onaylamasından sonra çalışır; metinleri yalnızca cihazın IndexedDB alanına kaydeder. Kaynak siteye açık erişim ve tarayıcılar arası isteklere izin veren CORS başlıkları gerekir. İndirme sırasında etkileşimli alıştırmalar ve görseller yerine dersin metin bölümü saklanır. Tarayıcı depolaması silinirse dersler yeniden indirilmelidir.

## GitHub Pages

GitHub Pages, `main` dalının `/ (root)` klasöründen yayımlanacak şekilde ayarlandı. `https://hozkelemci.github.io/ccar-f-guide-offline/` adresini iPad Safari'de açıp **Paylaş → Ana Ekrana Ekle** yolunu izleyin. Dersleri indirmeden önce ana ekrandaki uygulamayı açın; Safari ile ana ekran uygulamasının kayıt alanları ayrı olabilir.

## Yerel deneme

Depo kökünde `python3 -m http.server 8000` çalıştırıp `http://localhost:8000/` adresini açın. Service worker için localhost veya HTTPS gerekir.
