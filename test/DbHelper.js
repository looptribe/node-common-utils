'use strict';

const _ = require('lodash');
const ObjectID = require('mongodb').ObjectID;
const client = require('../src/persistence/client');

class DbHelper {
    async setupAsync(fixtures) {
        if (this.client) {
            throw new Error('Client already defined.');
        }
        this.client = await client.getAsync();
        this.db = this.client.db();

        if (fixtures) {
            for (const collection in fixtures) {
                if (Object.prototype.hasOwnProperty.call(fixtures, collection)) {
                    try {
                        await this.db.dropCollection(collection);
                    } catch (err) {
                        // Ignore error
                    }
                    const items = fixtures[collection];
                    if (items && items.length > 0) {
                        items.forEach((item) => {
                            if (item._id && _.isString(item._id)) {
                                item._id = new ObjectID(item._id);
                            }
                        });
                        await this.db.collection(collection).insertMany(items);
                    }
                }
            }
        }
    }

    async tearDownAsync() {
        await this.client.close();
        delete this.client;
    }
}

module.exports = DbHelper;
