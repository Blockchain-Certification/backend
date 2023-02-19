"use strict";
exports.__esModule = true;
exports.connection = void 0;
var mongoose_1 = require("mongoose");
var Logger_1 = require("../core/Logger");
var config_1 = require("../config");
// Build the connection string
var dbURI = "mongodb://" + config_1.db.user + ":" + encodeURIComponent(config_1.db.password) + "@" + config_1.db.host + ":" + config_1.db.port + "/" + config_1.db.name;
var options = {
    autoIndex: true,
    minPoolSize: config_1.db.minPoolSize,
    maxPoolSize: config_1.db.maxPoolSize,
    connectTimeoutMS: 60000,
    socketTimeoutMS: 45000
};
Logger_1["default"].debug(dbURI);
function setRunValidators() {
    this.setOptions({ runValidators: true });
}
mongoose_1["default"].set('strictQuery', true);
// Create the database connection
mongoose_1["default"]
    .plugin(function (schema) {
    schema.pre('findOneAndUpdate', setRunValidators);
    schema.pre('updateMany', setRunValidators);
    schema.pre('updateOne', setRunValidators);
    schema.pre('update', setRunValidators);
})
    .connect(dbURI, options)
    .then(function () {
    Logger_1["default"].info('Mongoose connection done');
})["catch"](function (e) {
    Logger_1["default"].info('Mongoose connection error');
    Logger_1["default"].error(e);
});
// CONNECTION EVENTS
// When successfully connected
mongoose_1["default"].connection.on('connected', function () {
    Logger_1["default"].debug('Mongoose default connection open to ' + dbURI);
});
// If the connection throws an error
mongoose_1["default"].connection.on('error', function (err) {
    Logger_1["default"].error('Mongoose default connection error: ' + err);
});
// When the connection is disconnected
mongoose_1["default"].connection.on('disconnected', function () {
    Logger_1["default"].info('Mongoose default connection disconnected');
});
// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function () {
    mongoose_1["default"].connection.close(function () {
        Logger_1["default"].info('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});
exports.connection = mongoose_1["default"].connection;
