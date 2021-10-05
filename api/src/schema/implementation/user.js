"use strict";
exports.__esModule = true;
var mongodb_1 = require("mongodb");
var User = /** @class */ (function () {
    // class methods will not be preserved in storage
    function User(id, base) {
        this._id = undefined;
        this.name = null;
        this.color = null;
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
            else if (base.mongo) {
                this.fromMongoDB(base.mongo);
            }
        }
    }
    User.prototype.fromGQL = function (gql) {
        if (typeof gql.name !== 'undefined') {
            this.name = gql.name;
        }
        if (typeof gql.color !== 'undefined') {
            this.color = gql.color;
        }
        return this;
    };
    User.prototype.fromMongoDB = function (mongo) {
        if (typeof mongo.name !== 'undefined') {
            this.name = mongo.name;
        }
        if (typeof mongo.color !== 'undefined') {
            this.color = mongo.color;
        }
        return this;
    };
    User.prototype.toGQL = function () {
        return {
            id: (this._id) ? this._id : null,
            name: this.name,
            color: this.color
        };
    };
    User.prototype.toMongoDB = function () {
        return {
            _id: this._id,
            name: this.name,
            color: this.color
        };
    };
    User.gqlFields = function () {
        return "\n      id\n      name\n      color\n    ";
    };
    return User;
}());
exports["default"] = User;
