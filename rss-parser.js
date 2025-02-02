const Parser = require('rss-parser');
const parser = new Parser();

class RSSFeedParser {
    constructor() {
        this.parser = parser;
    }

    async parseFeed(feedUrl) {
        try {
            const feed = await this.parser.parseURL(feedUrl);
            return {
                title: feed.title,
                description: feed.description,
                link: feed.link,
                items: feed.items.map(item => ({
                    title: item.title,
                    link: item.link,
                    pubDate: item.pubDate,
                    content: item.content || item.contentSnippet,
                    guid: item.guid
                }))
            };
        } catch (error) {
            console.error('Error parsing RSS feed:', error);
            throw new Error(`Failed to parse RSS feed: ${feedUrl}`);
        }
    }

    async getLatestItems(feedUrl, limit = 5) {
        const feed = await this.parseFeed(feedUrl);
        return feed.items.slice(0, limit);
    }
}

module.exports = RSSFeedParser;