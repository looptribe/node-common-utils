'use strict';

const expect = require('../expect');
const UnauthorizedError = require('../../src/errors/UnauthorizedError');

describe('errors/unauthorizedError', () => {
    it('return unauthorized error', () => {
        const err = new UnauthorizedError();
        expect(err).to.be.an('error');
        expect(err.code).to.equal('UNAUTHORIZED');
        expect(err.payload).to.be.undefined;
    });
});
