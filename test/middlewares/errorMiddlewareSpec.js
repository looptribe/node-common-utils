'use strict';

const sinon = require('sinon');

const expect = require('../expect');
const buildMiddleware = require('../../src/middlewares/errorMiddleware');
const ApplicationError = require('../../src/errors/ApplicationError');
const NotFoundError = require('../../src/errors/NotFoundError');

describe('middlewares/errorMiddleware', () => {
    let sut;

    beforeEach(() => {
        sut = buildMiddleware({warn: () => {}});
    });

    it('send an error response with notFound exception', () => {
        const res = {};

        res.status = sinon.fake.returns(res);
        res.send = sinon.fake();

        sut(new NotFoundError(), undefined, res, undefined);

        expect(res.status.calledOnce, 'status called once').to.be.true;
        expect(res.status.calledWith(404), 'status called with 404').to.be.true;
        expect(res.send.calledOnce, 'send called once').to.be.true;
        expect(res.send.lastArg, 'send called with error object').to.deep.equal({
            code: 'NOT_FOUND',
            message: 'Not found error',
            payload: undefined,
        });
    });

    it('send an error response with ApplicationError', () => {
        const res = {};

        res.status = sinon.fake.returns(res);
        res.send = sinon.fake();

        sut(new ApplicationError('Test message'), undefined, res, undefined);

        expect(res.status.calledOnce, 'status called once').to.be.true;
        expect(res.status.calledWith(500), 'status called with 500').to.be.true;
        expect(res.send.calledOnce, 'send called once').to.be.true;
        expect(res.send.lastArg, 'send called with error object').to.deep.equal({
            code: 'ERROR',
            message: 'Test message',
            payload: undefined,
        });
    });

    it('send an error response with generic Error', () => {
        const res = {};

        res.status = sinon.fake.returns(res);
        res.send = sinon.fake();

        sut(new Error('Test message'), undefined, res, undefined);

        expect(res.status.calledOnce, 'status called once').to.be.true;
        expect(res.status.calledWith(500), 'status called with 500').to.be.true;
        expect(res.send.calledOnce, 'send called once').to.be.true;
        expect(res.send.lastArg, 'send called with error object').to.deep.equal({
            code: 'ERROR',
            message: 'Test message',
            payload: undefined,
        });
    });
});
