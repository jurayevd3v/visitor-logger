const express = require('express');
const axios = require('axios');
const useragent = require('useragent');
const app = express();
const port = 3000;

// 🔐 O'ZINGIZGA MOSLANG
const BOT_TOKEN = '7745614203:AAEX4vxYenzX78FN5jOEdAGs608Xj1dSJrk';
const CHAT_ID = '2012098674';

// IP asosida location olish
async function getLocation(ip) {
  try {
    const response = await axios.get(`https://ipapi.co/${ip}/json/`);
    return response.data;
  } catch (error) {
    console.error("Joylashuvni olishda xatolik:", error.message);
    return {};
  }
}

app.get('/', async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  // Qurilma haqida ma'lumot
  const agent = useragent.parse(req.headers['user-agent']);
  const deviceInfo = agent.toString(); // Masalan: "Chrome 90.0.4430 on Windows 10"

  // Joylashuv
  const location = await getLocation(ip);
  const city = location.city || "Noma'lum";
  const region = location.region || "";
  const country = location.country_name || "Noma'lum";
  const isp = location.org || "";

  const message = `
🕵️ Yangi tashrif!
🌐 IP: ${ip}
📍 Joylashuv: ${city}, ${region}, ${country}
🏢 ISP: ${isp}
📱 Qurilma: ${deviceInfo}
  `;

  // Telegramga yuborish
  try {
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: message,
    });
    console.log("🔔 Telegramga yuborildi:", ip);
  } catch (err) {
    console.error("Telegramga yuborishda xatolik:", err.message);
  }

  res.send(`<h2>Assalomu alaykum!</h2><p>Sizning tashrifingiz qayd etildi.</p>`);
});

app.listen(port, () => {
  console.log(`✅ Server http://localhost:${port} da ishlayapti`);
});
