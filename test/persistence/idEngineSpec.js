'use strict';

const ObjectID = require('mongodb').ObjectID;
const expect = require('../expect');
const sut = require('../../src/persistence/idEngine');

describe('persistence/idEngine', () => {
    describe('generateId()', () => {
        it('should generate a new id', () => {
            const results = sut.generateId();
            const validId = new RegExp('^[0-9a-fA-F]{24}$');
            expect(validId.test(results)).to.be.true;
            expect(results instanceof ObjectID).to.be.true;
        });
    });

    describe('isValidId()', () => {
        it('should validate a valid id', () => {
            const results = sut.isValidId(new ObjectID('deadbeefdeadbeefdeadbeef'));
            expect(results).to.be.true;
        });

        it('should validate an invalid id', () => {
            const results = sut.isValidId('deadbeef');
            expect(results).to.be.false;
        });

        it('should validate an invalid id', () => {
            const results = sut.isValidId('deadbeefdeadbeefdeadbeef');
            expect(results).to.be.false;
        });
    });

    describe('toObjectId', () => {
        it('should return an object id', () => {
            const results = sut.toObjectId('deadbeefdeadbeefdeadbeef');
            expect(results instanceof ObjectID).to.be.true;
        });

        it('should return an object id', () => {
            const results = sut.toObjectId(new ObjectID('deadbeefdeadbeefdeadbeef'));
            expect(results instanceof ObjectID).to.be.true;
        });
    });

    describe('dtoToDomain', () => {
        it('should return a domain object', () => {
            const results = sut.dtoToDomain({
                _id: new ObjectID('deadbeefdeadbeefdeadbeef'),
                name: 'name',
            });
            expect(results.id).to.equal('deadbeefdeadbeefdeadbeef');
            expect(results._id).to.be.undefined;
        });
    });

    describe('domainToDto', () => {
        it('should return a dto object', () => {
            const results = sut.domainToDto({
                id: 'deadbeefdeadbeefdeadbeef',
                name: 'name',
            });
            expect(results._id.equals(new ObjectID('deadbeefdeadbeefdeadbeef'))).to.be.true;
            expect(results.id).to.be.undefined;
        });
    });
});
