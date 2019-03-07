'use strict';

const {SERVER_ERRORS} = require('../constants');

const codeToStatus = {
    [SERVER_ERRORS.NOT_FOUND]: 404,
    [SERVER_ERRORS.UNAUTHORIZED]: 401,
    [SERVER_ERRORS.ACCESS_DENIED]: 403,
    [SERVER_ERRORS.BAD_REQUEST]: 400,
};

const buildMiddleware = (logger) => (err, req, res, next) => {
    const result = {
        message: err.message,
        code: err.code || SERVER_ERRORS.GENERIC,
        payload: err.payload,
    };
    const status = codeToStatus[err.code] || 500;
    logger.warn(`ErrorMiddleware caught an error code=${result.code} status=${result.status}: ${err} `);
    res.status(status).send(result);
};

module.exports = buildMiddleware;
