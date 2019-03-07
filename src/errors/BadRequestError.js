'use strict';

const {SERVER_ERRORS} = require('../constants');
const ApplicationError = require('./ApplicationError');

class BadRequestError extends ApplicationError {
    constructor(message = 'Bad request') {
        super(message, SERVER_ERRORS.BAD_REQUEST);
    }
}

module.exports = BadRequestError;
