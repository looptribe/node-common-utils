'use strict';

const {ObjectId} = require('mongodb');
const {clone} = require('lodash');

function toObjectId(id) {
    return new ObjectId(id);
}

function toStringId(oid) {
    return oid.toString();
}

module.exports = {
    generateId: () => {
        return new ObjectId();
    },
    isValidId: (id) => {
        return id instanceof ObjectId && ObjectId.isValid(id);
    },
    toObjectId,
    toStringId,
    dtoToDomain: (dto) => {
        const domain = clone(dto);
        domain.id = toStringId(domain._id);
        delete domain._id;
        return domain;
    },
    domainToDto: (domain) => {
        const dto = clone(domain);
        dto._id = toObjectId(dto.id);
        delete dto.id;
        return dto;
    },
};
