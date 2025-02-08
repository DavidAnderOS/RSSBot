const RSSBot = require('./bot');
const Database = require('./database');
const RSSFeedParser = require('./rss-parser');
const cron = require('node-cron');

class RSSBotApp {
    constructor() {
        this.db = new Database();
        this.parser = new RSSFeedParser();
        this.bot = new RSSBot();
        this.startScheduler();
    }

    startScheduler() {
        cron.schedule('*/10 * * * *', () => {
            console.log('Checking for RSS updates...');
            this.checkFeeds();
        });
    }

    async checkFeeds() {
        console.log('Feed check started');
    }
}

if (require.main === module) {
    const app = new RSSBotApp();
    console.log('RSS Bot started');
}