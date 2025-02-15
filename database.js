const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
    constructor(dbPath = './database.db') {
        this.dbPath = dbPath;
        this.db = null;
        this.init();
    }

    init() {
        this.db = new sqlite3.Database(this.dbPath, (err) => {
            if (err) {
                console.error('Error opening database:', err);
            } else {
                console.log('Connected to SQLite database');
                this.createTables();
            }
        });
    }

    createTables() {
        const createFeedsTable = `
            CREATE TABLE IF NOT EXISTS feeds (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                url TEXT UNIQUE NOT NULL,
                title TEXT,
                description TEXT,
                last_checked DATETIME DEFAULT CURRENT_TIMESTAMP,
                active INTEGER DEFAULT 1
            )
        `;

        const createSubscriptionsTable = `
            CREATE TABLE IF NOT EXISTS subscriptions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                chat_id INTEGER NOT NULL,
                feed_id INTEGER NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (feed_id) REFERENCES feeds (id)
            )
        `;

        const createItemsTable = `
            CREATE TABLE IF NOT EXISTS items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                feed_id INTEGER NOT NULL,
                guid TEXT UNIQUE,
                title TEXT,
                link TEXT,
                pub_date DATETIME,
                content TEXT,
                sent INTEGER DEFAULT 0,
                FOREIGN KEY (feed_id) REFERENCES feeds (id)
            )
        `;

        this.db.run(createFeedsTable);
        this.db.run(createSubscriptionsTable);
        this.db.run(createItemsTable);
    }

    addFeed(url, title, description) {
        return new Promise((resolve, reject) => {
            this.db.run(
                'INSERT INTO feeds (url, title, description) VALUES (?, ?, ?)',
                [url, title, description],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    }

    getActiveFeeds() {
        return new Promise((resolve, reject) => {
            this.db.all(
                'SELECT * FROM feeds WHERE active = 1',
                [],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    }

    addSubscription(chatId, feedId) {
        return new Promise((resolve, reject) => {
            this.db.run(
                'INSERT INTO subscriptions (chat_id, feed_id) VALUES (?, ?)',
                [chatId, feedId],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    }

    saveItem(feedId, guid, title, link, pubDate, content) {
        return new Promise((resolve, reject) => {
            this.db.run(
                'INSERT OR IGNORE INTO items (feed_id, guid, title, link, pub_date, content) VALUES (?, ?, ?, ?, ?, ?)',
                [feedId, guid, title, link, pubDate, content],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    }

    close() {
        this.db.close((err) => {
            if (err) {
                console.error('Error closing database:', err);
            }
        });
    }
}

module.exports = Database;