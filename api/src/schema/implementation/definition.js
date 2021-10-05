"use strict";
/* eslint-disable max-len */
/*
// This file is subject to the terms and conditions defined in
// file 'LICENSE.md', which is part of this source code package.
*/
exports.__esModule = true;
var mongodb_1 = require("mongodb");
var Definition = /** @class */ (function () {
    // class methods will not be preserved in storage
    function Definition(id, base) {
        // bare properties will be persisted in storage
        this._id = undefined;
        this.author = null;
        this.text = null;
        this.voters = null;
        if (id) {
            if (id instanceof mongodb_1.ObjectID) {
                this._id = id;
            }
            else {
                this._id = new mongodb_1.ObjectID(id);
            }
        }
        if (base) {
            if (base.mongo) {
                this.fromMongoDB(base.mongo);
            }
            if (base.gql) {
                this.fromGQL(base.gql);
            }
        }
    }
    Definition.prototype.fromGQL = function (gql) {
        if (typeof gql.author !== 'undefined') {
            this.author = gql.author;
        }
        if (typeof gql.text !== 'undefined') {
            this.text = gql.text;
        }
        if (typeof gql.voters !== 'undefined') {
            this.voters = gql.voters;
        }
        return this;
    };
    Definition.prototype.fromMongoDB = function (mongo) {
        if (typeof mongo.author !== 'undefined') {
            this.author = mongo.author;
        }
        if (typeof mongo.text !== 'undefined') {
            this.text = mongo.text;
        }
        if (typeof mongo.voters !== 'undefined') {
            this.voters = mongo.voters;
        }
        return this;
    };
    Definition.prototype.toGQL = function () {
        return {
            id: this._id.toHexString(),
            author: this.author,
            text: this.text,
            voters: this.voters
        };
    };
    Definition.prototype.toMongoDB = function () {
        return {
            _id: this._id,
            author: this.author,
            text: this.text,
            voters: this.voters
        };
    };
    Definition.gqlFields = function () {
        return "\n      id\n      text\n      author\n      voters\n    ";
    };
    return Definition;
}());
exports["default"] = Definition;
