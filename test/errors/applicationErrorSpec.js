'use strict';

const expect = require('../expect');
const ApplicationError = require('../../src/errors/ApplicationError');

describe('errors/applicationError', () => {
    it('return application error', () => {
        const err = new ApplicationError();
        expect(err).to.be.an('error');
        expect(err.code).to.equal('ERROR');
        expect(err.payload).to.be.undefined;
    });
});
