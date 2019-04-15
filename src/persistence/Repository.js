'use strict';

const {get} = require('lodash');
const client = require('../persistence/client');
const NotFoundError = require('../errors/NotFoundError');
const util = require('util');

class Repository {
    constructor(collectionName, logger) {
        this.collectionName = collectionName;
        this.repositoryName = `${collectionName.replace(/^./, (str) => str.toUpperCase())}Repository`;
        this.logger = logger;
    }

    async getCollection() {
        this.logger.debug(`${this.repositoryName}/getCollection`);
        const clientInstance = await client.getAsync();
        return clientInstance.db().collection(this.collectionName);
    }

    async count(filter = {}) {
        this.logger.debug(`${this.repositoryName}/count`);
        const collection = await this.getCollection();
        const data = await collection.countDocuments(filter);
        this.logger.silly(util.inspect(data, true, null));
        return data;
    }

    async delete(filter) {
        this.logger.debug(`${this.repositoryName}/delete`);
        const collection = await this.getCollection();
        const results = await collection.deleteOne(filter);
        this.logger.silly(util.inspect(results, true, null));
        if (results && results.deletedCount === 0) {
            throw new Error('Unable to delete data');
        } else if (results && results.deletedCount === 1) {
            return {};
        } else {
            throw new Error('Database error');
        }
    }

    async deleteMany(filter) {
        this.logger.debug(`${this.repositoryName}/deleteMany`);
        const collection = await this.getCollection();
        const results = await collection.deleteMany(filter);
        this.logger.silly(util.inspect(results, true, null));
        return results.deletedCount;
    }

    async find(query = {}, offset, limit) {
        this.logger.debug(`${this.repositoryName}/find`);
        const collection = await this.getCollection();
        let results = await collection.find(query);
        if (offset) {
            results = results.skip(offset);
        }
        if (limit) {
            results = results.limit(limit);
        }
        const data = await results.toArray();
        this.logger.silly(util.inspect(data, true, null));
        return data;
    }

    async findOne(query, projection = {}) {
        this.logger.debug(`${this.repositoryName}/findOne`);
        const collection = await this.getCollection();
        const data = await collection.findOne(query, projection);
        this.logger.silly(util.inspect(data, true, null));
        if (data) {
            return data;
        } else {
            throw new NotFoundError('Unable to get data');
        }
    }

    async insertOne(data) {
        this.logger.debug(`${this.repositoryName}/insertOne`);
        const collection = await this.getCollection();
        const results = await collection.insertOne(data);
        this.logger.silly(util.inspect(results, true, null));
        if (results && results.insertedCount === 1) {
            return results.ops[0];
        } else {
            this.logger.warn('Insertion error', data, results);
            let errorMsg = get(results, 'writeConcernError.errmsg');
            if (errorMsg) {
                throw new Error('Unable to write data');
            }
            errorMsg = get(results, 'writeError.errmsg');
            if (errorMsg) {
                throw new Error('Unable to insert data');
            } else {
                throw new Error('Database error');
            }
        }
    }

    async replaceOne(filter, data) {
        this.logger.debug(`${this.repositoryName}/replaceOne`);
        const collection = await this.getCollection();
        const results = await collection.findOneAndReplace(filter, data, {returnOriginal: false});
        this.logger.silly(util.inspect(results, true, null));
        if (!results.ok) {
            throw new Error('Unable to write data');
        }
        return results.value;
    }

    async updateOne(filter, update) {
        this.logger.debug(`${this.repositoryName}/updateOne`);
        const collection = await this.getCollection();
        const results = await collection.findOneAndUpdate(filter, update, {returnOriginal: false});
        this.logger.silly(util.inspect(results, true, null));
        if (!results.ok) {
            throw new Error('Unable to write data');
        }
        return results.value;
    }

    async createIndex(keys, options) {
        this.logger.debug(`${this.repositoryName}/createIndex`);
        const collection = await this.getCollection();
        const results = await collection.createIndex(keys, options);
        this.logger.silly(util.inspect(results, true, null));
        return results;
    }
}

module.exports = Repository;
