"use strict";
/* eslint-disable no-underscore-dangle */
/*
// This file is subject to the terms and conditions defined in
// file 'LICENSE.md', which is part of this source code package.
*/
exports.__esModule = true;
var mongodb_1 = require("mongodb");
var _1 = require(".");
var graphql_1 = require("../../generated/graphql");
var Word = /** @class */ (function () {
    // class methods will not be preserved in storage
    function Word(id, base) {
        this._id = undefined;
        this.author = null;
        this.text = null;
        this.definitions = null;
        this.comittee = null;
        this.status = graphql_1.WordStatus.None;
        if (id) {
            if (id instanceof mongodb_1.ObjectID) {
                this._id = id;
            }
            else {
                this._id = new mongodb_1.ObjectID(id);
            }
        }
        if (base) {
            if (base.gql) {
                this.fromGQL(base.gql);
            }
            if (base.mongo) {
                this.fromMongoDB(base.mongo);
            }
        }
    }
    Word.prototype.fromGQL = function (gql) {
        if (typeof gql.author !== 'undefined') {
            this.author = gql.author;
        }
        if (typeof gql.text !== 'undefined') {
            this.text = gql.text;
        }
        if (typeof gql.definitions !== 'undefined') {
            this.definitions = (gql.definitions !== null) ? gql.definitions.map(function (d) { return new _1.Definition(d.id, { gql: d }); }) : null;
        }
        if (typeof gql.comittee !== 'undefined') {
            this.comittee = gql.comittee;
        }
        if (typeof gql.status !== 'undefined') {
            this.status = gql.status;
        }
        return this;
    };
    Word.prototype.fromMongoDB = function (mongo) {
        if (typeof mongo.author !== 'undefined') {
            this.author = mongo.author;
        }
        if (typeof mongo.text !== 'undefined') {
            this.text = mongo.text;
        }
        if (typeof mongo.definitions !== 'undefined') {
            this.definitions = (mongo.definitions !== null) ? mongo.definitions.map(function (d) { return new _1.Definition(d._id, { mongo: d }); }) : null;
        }
        if (typeof mongo.comittee !== 'undefined') {
            this.comittee = mongo.comittee;
        }
        if (typeof mongo.status !== 'undefined') {
            this.status = mongo.status;
        }
        return this;
    };
    Word.prototype.toGQL = function () {
        return {
            id: this._id.toHexString(),
            text: this.text,
            author: this.author,
            comittee: this.comittee,
            definitions: (this.definitions !== null) ? this.definitions.map(function (d) { return (d.toGQL()); }) : null,
            status: this.status
        };
    };
    Word.prototype.toMongoDB = function () {
        return {
            _id: this._id,
            text: this.text,
            author: this.author,
            definitions: (this.definitions) ? this.definitions.map(function (d) { return d.toMongoDB(); }) : null,
            comittee: this.comittee,
            status: this.status
        };
    };
    Word.gqlFields = function () {
        return "\n      id\n      text\n      author\n      comittee\n      status\n      definitions {\n        " + _1.Definition.gqlFields() + "\n      }\n    ";
    };
    return Word;
}());
exports["default"] = Word;
