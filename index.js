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
        try {
            const feeds = await this.db.getActiveFeeds();
            console.log(`Checking ${feeds.length} feeds...`);
            
            for (const feed of feeds) {
                await this.processFeed(feed);
            }
        } catch (error) {
            console.error('Error checking feeds:', error);
        }
    }

    async processFeed(feed) {
        try {
            const feedData = await this.parser.parseFeed(feed.url);
            console.log(`Processing ${feedData.title} - ${feedData.items.length} items`);
            
            for (const item of feedData.items) {
                await this.db.saveItem(
                    feed.id,
                    item.guid || item.link,
                    item.title,
                    item.link,
                    item.pubDate,
                    item.content
                );
            }
        } catch (error) {
            console.error(`Error processing feed ${feed.url}:`, error);
        }
    }
}

if (require.main === module) {
    const app = new RSSBotApp();
    console.log('RSS Bot started');
}