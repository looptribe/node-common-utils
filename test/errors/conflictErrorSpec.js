'use strict';

const expect = require('../expect');
const ConflictError = require('../../src/errors/ConflictError');

describe('errors/conflictError', () => {
    it('return conflict error', () => {
        const err = new ConflictError();
        expect(err).to.be.an('error');
        expect(err.code).to.equal('CONFLICT');
        expect(err.payload).to.be.undefined;
    });
});
