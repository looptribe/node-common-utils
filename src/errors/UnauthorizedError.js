'use strict';

const {SERVER_ERRORS} = require('../constants');
const ApplicationError = require('./ApplicationError');

class UnauthorizedError extends ApplicationError {
    constructor(message = 'Unauthorized') {
        super(message, SERVER_ERRORS.UNAUTHORIZED);
    }
}

module.exports = UnauthorizedError;
