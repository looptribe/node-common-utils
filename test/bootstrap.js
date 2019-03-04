'use strict';

const fs = require('fs');
const path = require('path');

const client = require('../src/persistence/client');

const env = process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : '';
const configFile = path.join(__dirname, '..', 'config', 'config' + env + '.json');
fs.accessSync(configFile, fs.R_OK);
const config = require(configFile);

client.setup(config.database);
