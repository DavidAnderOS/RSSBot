const TelegramBot = require('node-telegram-bot-api');
const Database = require('./database');
const RSSFeedParser = require('./rss-parser');
require('dotenv').config();

class RSSBot {
    constructor() {
        this.token = process.env.TELEGRAM_BOT_TOKEN;
        this.bot = new TelegramBot(this.token, { polling: true });
        this.db = new Database();
        this.parser = new RSSFeedParser();
        this.setupCommands();
    }

    setupCommands() {
        this.bot.onText(/\/start/, (msg) => {
            const chatId = msg.chat.id;
            this.bot.sendMessage(chatId, 'Welcome to RSS Bot! Use /help to see available commands.');
        });

        this.bot.onText(/\/help/, (msg) => {
            const chatId = msg.chat.id;
            const helpText = `
Available commands:
/start - Start the bot
/help - Show this help message  
/add <url> - Add RSS feed
/list - List subscribed feeds
/remove <id> - Remove RSS feed
            `;
            this.bot.sendMessage(chatId, helpText);
        });

        this.bot.onText(/\/add (.+)/, async (msg, match) => {
            const chatId = msg.chat.id;
            const feedUrl = match[1];
            
            try {
                const feedData = await this.parser.parseFeed(feedUrl);
                await this.db.addFeed(feedUrl, feedData.title, feedData.description);
                this.bot.sendMessage(chatId, `✅ RSS feed added: ${feedData.title}`);
            } catch (error) {
                this.bot.sendMessage(chatId, `❌ Failed to add feed: ${error.message}`);
            }
        });
    }

    sendNotification(chatId, title, link, content) {
        const message = `📰 *${title}*\n\n${content}\n\n[Read more](${link})`;
        this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    }
}

module.exports = RSSBot;