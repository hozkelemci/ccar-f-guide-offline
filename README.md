# CCAR-F Çalışma Planı

30 ücretsiz CCAR-F dersine bağlantılar sunan, iPad ana ekranına eklenebilen kişisel çalışma planı. İlerleme tarayıcının yerel depolamasında kalır. Uygulama kabuğu çevrimdışı açılır; ders metinleri yalnızca [kaynak sitede](https://claudecertificationguide.com/learn) çevrimiçi okunur.

## Neden dersler çevrimdışı değil?

[AI Cert Guides kullanım koşulları](https://claudecertificationguide.com/terms), ücretsiz derslerin tamamını başka bir sitede yeniden yayımlamayı yasaklıyor. Bu depoda ders metni veya kaynak sitenin görsel varlıkları bulunmaz. Tam içerikli çevrimdışı sürüm için hak sahibinin açık yazılı izni gerekir.

## GitHub Pages

GitHub Pages, `main` dalının `/ (root)` klasöründen yayımlanacak şekilde ayarlandı. `https://hozkelemci.github.io/ccar-f-guide-offline/` adresini iPad Safari'de açıp **Paylaş → Ana Ekrana Ekle** yolunu izleyin. İlk ziyarette çevrimiçi kalıp uygulamanın kurulumunu tamamlamasına izin verin.

## Yerel deneme

Depo kökünde `python3 -m http.server 8000` çalıştırıp `http://localhost:8000/` adresini açın. Service worker için localhost veya HTTPS gerekir.
