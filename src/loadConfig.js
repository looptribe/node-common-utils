'use strict';

const Ajv = require('ajv');
const fs = require('fs');
const nconf = require('nconf');
const path = require('path');

module.exports = (basePath) => {
    const defaults = require(path.join(basePath, 'defaults'));
    const schema = require(path.join(basePath, 'schema'));

    const env = process.env.NODE_ENV ? '.' + process.env.NODE_ENV : '';
    const configFile = path.join(basePath, 'config' + env + '.json');
    fs.accessSync(configFile, fs.R_OK);
    nconf.use('config', {type: 'file', file: configFile});

    nconf.add('defaults', {type: 'literal', store: defaults});

    const config = nconf.get();

    const ajv = new Ajv();
    if (!ajv.validate(schema, config)) {
        throw new Error('Invalid configuration:\n' + JSON.stringify(ajv.errors, null, 4));
    }

    return config;
};
