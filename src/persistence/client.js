'use strict';

const MongoClient = require('mongodb').MongoClient;

let clientPromise;
let _connectionUrl;

module.exports.getAsync = () => {
    if (clientPromise === undefined) {
        clientPromise = MongoClient.connect(_connectionUrl, {useNewUrlParser: true})
            .then((client) => {
                client.on('close', () => {
                    clientPromise = undefined;
                });
                return client;
            });
    }
    return clientPromise;
};

module.exports.setup = (connectionUrl) => _connectionUrl = connectionUrl;
