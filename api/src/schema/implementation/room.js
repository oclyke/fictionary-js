"use strict";
/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
/*
// This file is subject to the terms and conditions defined in
// file 'LICENSE.md', which is part of this source code package.
*/
exports.__esModule = true;
var mongodb_1 = require("mongodb");
var _1 = require(".");
var Room = /** @class */ (function () {
    // class methods will not be preserved in storage
    function Room(id, base) {
        // bare properties will be persisted in storage
        this._id = undefined;
        this.tag = null;
        this.players = null;
        this.scores = null; // map of player ids to their scores
        this.colors = null; // map of player ids to their in-game colors
        this.words = null;
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
    Room.prototype.fromGQL = function (gql) {
        if (typeof gql.tag !== 'undefined') {
            this.tag = gql.tag;
        }
        if (typeof gql.players !== 'undefined') {
            this.players = gql.players;
        }
        if (typeof gql.scores !== 'undefined') {
            this.scores = gql.scores;
        }
        if (typeof gql.colors !== 'undefined') {
            this.colors = gql.colors;
        }
        if (typeof gql.words !== 'undefined') {
            this.words = (gql.words !== null) ? gql.words.map(function (w) { return new _1.Word(w.id).fromGQL(w); }) : null;
        }
        return this;
    };
    Room.prototype.fromMongoDB = function (mongo) {
        if (typeof mongo.tag !== 'undefined') {
            this.tag = mongo.tag;
        }
        if (typeof mongo.players !== 'undefined') {
            this.players = mongo.players;
        }
        if (typeof mongo.scores !== 'undefined') {
            this.scores = mongo.scores;
        }
        if (typeof mongo.colors !== 'undefined') {
            this.colors = mongo.colors;
        }
        if (typeof mongo.words !== 'undefined') {
            this.words = (mongo.words !== null) ? mongo.words.map(function (w) { return new _1.Word(w._id).fromMongoDB(w); }) : null;
        }
        return this;
    };
    Room.prototype.toGQL = function () {
        return {
            id: this._id.toHexString(),
            tag: this.tag,
            players: this.players,
            scores: this.scores,
            colors: this.colors,
            words: (this.words !== null) ? this.words.map(function (w) { return w.toGQL(); }) : null
        };
    };
    Room.prototype.toMongoDB = function () {
        return {
            _id: this._id,
            tag: this.tag,
            players: this.players,
            scores: this.scores,
            colors: this.colors,
            words: (this.words !== null) ? this.words.map(function (w) { return w.toMongoDB(); }) : null
        };
    };
    Room.gqlFields = function () {
        return "\n      id\n      tag\n      players\n      scores\n      colors\n      words {\n        " + _1.Word.gqlFields() + "\n      }\n    ";
    };
    return Room;
}());
exports["default"] = Room;
