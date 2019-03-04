'use strict';

const expect = require('../expect');
const NotFoundError = require('../../src/errors/NotFoundError');

describe('errors/notFoundError', () => {
    it('return not found error', () => {
        const err = new NotFoundError();
        expect(err).to.be.an('error');
        expect(err.code).to.equal('NOT_FOUND');
        expect(err.payload).to.be.undefined;
    });
});
