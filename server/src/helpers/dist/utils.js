"use strict";
exports.__esModule = true;
exports.addMillisToCurrentDate = exports.findIpAddress = void 0;
var moment_1 = require("moment");
var Logger_1 = require("../core/Logger");
function findIpAddress(req) {
    try {
        if (req.headers['x-forwarded-for']) {
            return req.headers['x-forwarded-for'].toString().split(',')[0];
        }
        else if (req.connection && req.connection.remoteAddress) {
            return req.connection.remoteAddress;
        }
        return req.ip;
    }
    catch (e) {
        Logger_1["default"].error(e);
        return undefined;
    }
}
exports.findIpAddress = findIpAddress;
function addMillisToCurrentDate(millis) {
    return moment_1["default"]().add(millis, 'ms').toDate();
}
exports.addMillisToCurrentDate = addMillisToCurrentDate;
