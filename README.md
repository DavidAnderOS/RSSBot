# RSS Bot

A Telegram bot that monitors RSS feeds and sends notifications for new articles.

## Setup

1. Copy `.env.example` to `.env`
2. Set your Telegram bot token in `.env`
3. Install dependencies: `npm install`
4. Start the bot: `npm start`

## Commands

- `/start` - Initialize bot
- `/add <url>` - Subscribe to RSS feed  
- `/list` - View subscribed feeds
- `/remove <id>` - Unsubscribe from feed

## Features

- RSS feed parsing
- Automatic notification scheduling
- SQLite database storage
- Multi-user support