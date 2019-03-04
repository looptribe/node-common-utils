'use strict';

const {createLogger, format, transports} = require('winston');

module.exports = (config) => {
    const formatter = format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`);

    const options = {
        format: format.combine(format.colorize(), format.simple(), format.timestamp(), formatter),
        transports: config.map((cfg) => new transports[cfg.type](cfg.options)),
    };

    return createLogger(options);
};
