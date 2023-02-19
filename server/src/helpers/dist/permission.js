"use strict";
exports.__esModule = true;
var ApiError_1 = require("../core/ApiError");
exports["default"] = (function (permission) {
    return function (req, res, next) {
        var _a;
        try {
            if (!((_a = req.apiKey) === null || _a === void 0 ? void 0 : _a.permissions))
                return next(new ApiError_1.ForbiddenError('Permission Denied'));
            var exists = req.apiKey.permissions.find(function (entry) { return entry === permission; });
            if (!exists)
                return next(new ApiError_1.ForbiddenError('Permission Denied'));
            next();
        }
        catch (error) {
            next(error);
        }
    };
});
