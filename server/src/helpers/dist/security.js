"use strict";
exports.__esModule = true;
exports.restrictIpAddress = void 0;
var ApiError_1 = require("../core/ApiError");
var utils_1 = require("./utils");
function restrictIpAddress(req, ipAddress) {
    if (ipAddress === '*')
        return;
    var ip = utils_1.findIpAddress(req);
    if (!ip)
        throw new ApiError_1.ForbiddenError('IP Address Not Recognised');
    if (ipAddress !== ip)
        throw new ApiError_1.ForbiddenError('Permission Denied');
}
exports.restrictIpAddress = restrictIpAddress;
