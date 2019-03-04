'use strict';

const ObjectID = require('mongodb').ObjectID;
const expect = require('../expect');
const DbHelper = require('../DbHelper');
const NotFoundError = require('../../src/errors/NotFoundError');
const Sut = require('../../src/persistence/Repository');
const createFakeLogger = require('../createFakeLogger');

describe('persistence/Repository', () => {
    const dbHelper = new DbHelper();
    let sut;
    const collectionContent = [
        {_id: new ObjectID('000000000000000000000001'), name: 'Test name 1'},
        {_id: new ObjectID('000000000000000000000002'), name: 'Test name 2'},
        {_id: new ObjectID('000000000000000000000003'), name: 'Second important test: Test name 3'},
        {_id: new ObjectID('000000000000000000000004'), name: 'Test name 4'},
        {_id: new ObjectID('000000000000000000000005'), name: 'An important test: Test name 5'},
        {_id: new ObjectID('000000000000000000000006'), name: 'Test name 6'},
        {_id: new ObjectID('000000000000000000000007'), name: 'Test name 7'},
        {_id: new ObjectID('000000000000000000000008'), name: 'Test name 8'},
    ];

    beforeEach(async () => {
        await dbHelper.setupAsync({
            test_coll: collectionContent,
        });
        sut = new Sut('test_coll', createFakeLogger());
    });
    afterEach(async () => {
        await dbHelper.tearDownAsync();
    });

    describe('count', () => {
        it('should return objects count', async () => {
            const result = await sut.count();
            expect(result).to.equal(collectionContent.length);
        });

        it('should return filtered objects count', async () => {
            const result = await sut.count({name: 'Test name 2'});
            expect(result).to.equal(1);
        });

        it('should return 0 with a filter that does not match', async () => {
            const result = await sut.count({name: 'Unknown test'});
            expect(result).to.equal(0);
        });
    });

    describe('find', () => {
        it('should return all existing objects', async () => {
            const result = await sut.find();
            expect(result).to.be.an('array');
            expect(result).to.deep.equal(collectionContent);
        });
    });

    describe('findOne', () => {
        it('should return existing object', async () => {
            const result = await sut.findOne({_id: new ObjectID('000000000000000000000002')});
            expect(result).to.be.an('object');
            expect(result._id.toString()).to.equal('000000000000000000000002');
            expect(result.name).to.equal('Test name 2');
        });

        it('should throw NotFoundError if object does not exist', async () => {
            await expect(sut.findOne({_id: new ObjectID('999999999999999999999999')})).to.eventually.be.rejectedWith(NotFoundError);
        });
    });

    describe('replaceOne', () => {
        it('should update existing object', async () => {
            const result = await sut.replaceOne({_id: new ObjectID('000000000000000000000002')},
                {_id: new ObjectID('000000000000000000000002'), name: 'Test name 2 changed'});

            const effective = await dbHelper.db.collection('test_coll').findOne(new ObjectID('000000000000000000000002'));
            expect(effective).to.be.an('object');
            expect(effective._id.toString()).to.equal('000000000000000000000002');
            expect(effective.name).to.equal('Test name 2 changed');
            expect(result).to.deep.equal(effective);
        });
    });

    describe('updateOne', () => {
        it('should update existing object', async () => {
            const result = await sut.updateOne({_id: new ObjectID('000000000000000000000002')},
                {$set: {newField: 'Added new field'}});

            const effective = await dbHelper.db.collection('test_coll').findOne(new ObjectID('000000000000000000000002'));
            expect(effective).to.be.an('object');
            expect(effective._id.toString()).to.equal('000000000000000000000002');
            expect(effective.name).to.equal('Test name 2');
            expect(effective.newField).to.equal('Added new field');
            expect(result).to.deep.equal(effective);
        });
    });

    describe('insertOne', () => {
        it('should insert an object', async () => {
            await sut.insertOne({_id: new ObjectID('000000000000000000000009'), name: 'Test name 9'});

            const result = await dbHelper.db.collection('test_coll').findOne(new ObjectID('000000000000000000000009'));
            expect(result).to.be.an('object');
            expect(result._id.toString()).to.equal('000000000000000000000009');
            expect(result.name).to.equal('Test name 9');
        });

        it('should throw if _id is duplicated', async () => {
            await expect(sut.insertOne({_id: new ObjectID('000000000000000000000001'), name: 'Test name 1'})).to.be.rejectedWith(Error);
        });
    });

    describe('delete', () => {
        it('should delete an existing object', async () => {
            await sut.delete({_id: new ObjectID('000000000000000000000002')});

            const result = await dbHelper.db.collection('test_coll').findOne(new ObjectID('000000000000000000000002'));
            expect(result).to.be.null;
        });
    });
});
