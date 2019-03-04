'use strict';

const {SERVER_ERRORS} = require('../constants');

class ApplicationError extends Error {
    constructor(message = 'Application error', code = SERVER_ERRORS.GENERIC, payload = undefined) {
        super();
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.message = message;
        this.code = code;
        this.payload = payload;
    }
}

module.exports = ApplicationError;
