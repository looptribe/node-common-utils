'use strict';

const expect = require('../expect');
const BadRequestError = require('../../src/errors/BadRequestError');

describe('errors/badRequestErrorSpec', () => {
    it('return bad request error', () => {
        const err = new BadRequestError();
        expect(err).to.be.an('error');
        expect(err.code).to.equal('BAD_REQUEST');
        expect(err.payload).to.be.undefined;
    });
});
