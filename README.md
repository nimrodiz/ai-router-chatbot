# Router Bot Gateway

Minimal Telegram "router bot" gateway that will later host STT/AI routing logic. For now it only exposes a webhook, logs incoming updates, and sends a confirmation reply so we can validate infra (Railway, Telegram webhooks, etc.).

## Run locally
1. `npm install`
2. Copy `.env.example` to `.env` and fill `TELEGRAM_BOT_TOKEN` from BotFather.
3. (Optional) Set `PUBLIC_URL` to a tunneling URL (ngrok, Cloudflare Tunnel, etc.) if you want Telegram to hit your local machine.
4. `npm start`

## Bot behavior
- `/start` replies with `👋 Router bot online. Send me a message.`
- Any text or voice message logs the full Telegram update to the console and responds with `✅ Router bot online – I got your message.`

## Deploy to Railway
1. Create a new Railway service from this repo.
2. In the Railway dashboard, set environment variables:
   - `TELEGRAM_BOT_TOKEN`
   - `PUBLIC_URL` = `https://<your-railway-app-domain>`
3. Deploy. On boot the bot will call `setWebhook(PUBLIC_URL + "/telegram/webhook")` and log the webhook URL.
4. Make sure your Telegram bot (created with BotFather) uses the same token.
