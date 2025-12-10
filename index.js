// @ts-check
const express = require('express');
const { Telegraf } = require('telegraf');
const dotenv = require('dotenv');

dotenv.config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const rawPublicUrl = process.env.PUBLIC_URL || '';
const PORT = Number(process.env.PORT) || 3000;

if (!TELEGRAM_BOT_TOKEN) {
  console.error('Missing TELEGRAM_BOT_TOKEN in environment variables.');
  process.exit(1);
}

const bot = new Telegraf(TELEGRAM_BOT_TOKEN);
const app = express();

const WEBHOOK_PATH = '/telegram/webhook';
const webhookPath = WEBHOOK_PATH.startsWith('/') ? WEBHOOK_PATH : `/${WEBHOOK_PATH}`;
const PUBLIC_URL = rawPublicUrl.replace(/\/+$/, '');

bot.start(async (ctx) => {
  await ctx.reply('👋 Router bot online. Send me a message.');
});

bot.on(['text', 'voice'], async (ctx) => {
  console.log('Incoming update:', JSON.stringify(ctx.update, null, 2));
  await ctx.reply('✅ Router bot online – I got your message.');
});

app.use(express.json());
app.use(webhookPath, bot.webhookCallback(webhookPath));

app.get('/', (_req, res) => {
  res.send('Router bot is running.');
});

(async () => {
  if (PUBLIC_URL) {
    const webhookUrl = `${PUBLIC_URL}${webhookPath}`;
    try {
      await bot.telegram.setWebhook(webhookUrl);
      console.log(`Telegram webhook set to ${webhookUrl}`);
    } catch (error) {
      console.error('Failed to set Telegram webhook:', error);
      process.exit(1);
    }
  } else {
    console.warn('PUBLIC_URL is not set. Remember to configure it in production.');
  }

  app.listen(PORT, () => {
    console.log(`Router bot gateway listening on port ${PORT}`);
  });
})();
