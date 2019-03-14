'use strict';

const {SERVER_ERRORS} = require('../constants');
const ApplicationError = require('./ApplicationError');

class ConflictError extends ApplicationError {
    constructor(message = 'Conflict') {
        super(message, SERVER_ERRORS.CONFLICT);
    }
}

module.exports = ConflictError;
