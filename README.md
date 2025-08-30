# RSS-to-Telegram Bot

Aplikasi untuk mengambil berita dari RSS Feed, menyimpannya ke MongoDB, dan mengirimkannya ke Telegram Channel/Thread.

---

## 📌 Fitur

- Fetch berita dari multiple RSS Feed.
- Penyimpanan data ke MongoDB (hindari duplikat).
- Pengiriman otomatis ke Telegram Channel/Thread.
- Update status `sent` setelah berita terkirim.
- Bypass Cloudflare (jika diperlukan).

---

## 🛠 Teknologi

- **Node.js** + **TypeScript**
- **MongoDB** (Mongoose)
- **Axios** (fetch RSS)
- **node-telegram-bot-api** (kirim pesan ke Telegram)
- **Winston** (logging)

---

## 📦 Instalasi

1. **Clone repository**:
   ```bash
   git clone https://github.com/segalih/throw-rss.git
   cd throw-rss
   npm i
   npm build
   npm start
   ```
