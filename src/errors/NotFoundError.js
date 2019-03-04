'use strict';

const {SERVER_ERRORS} = require('../constants');
const ApplicationError = require('./ApplicationError');

class NotFoundError extends ApplicationError {
    constructor(message = 'Not found error') {
        super(message, SERVER_ERRORS.NOT_FOUND);
    }
}

module.exports = NotFoundError;
