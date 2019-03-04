'use strict';

const {SERVER_ERRORS} = require('../constants');
const ApplicationError = require('./ApplicationError');

class AccessDeniedError extends ApplicationError {
    constructor(message = 'Access denied') {
        super(message, SERVER_ERRORS.ACCESS_DENIED);
    }
}

module.exports = AccessDeniedError;
