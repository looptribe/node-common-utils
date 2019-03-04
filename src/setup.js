'use strict';

module.exports = (config) => {
    require('./persistence/client').setup(config.database);
};
