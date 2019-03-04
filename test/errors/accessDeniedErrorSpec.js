'use strict';

const expect = require('../expect');
const AccessDeniedError = require('../../src/errors/AccessDeniedError');

describe('errors/accessDeniedErrorSpec', () => {
    it('return access denied error', () => {
        const err = new AccessDeniedError();
        expect(err).to.be.an('error');
        expect(err.code).to.equal('ACCESS_DENIED');
        expect(err.payload).to.be.undefined;
    });
});
