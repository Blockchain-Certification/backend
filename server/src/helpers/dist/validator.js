"use strict";
exports.__esModule = true;
exports.JoiAuthBearer = exports.JoiUrlEndpoint = exports.JoiObjectId = exports.ValidationSource = void 0;
var joi_1 = require("joi");
var Logger_1 = require("../core/Logger");
var ApiError_1 = require("../core/ApiError");
var mongoose_1 = require("mongoose");
var ValidationSource;
(function (ValidationSource) {
    ValidationSource["BODY"] = "body";
    ValidationSource["HEADER"] = "headers";
    ValidationSource["QUERY"] = "query";
    ValidationSource["PARAM"] = "params";
})(ValidationSource = exports.ValidationSource || (exports.ValidationSource = {}));
exports.JoiObjectId = function () {
    return joi_1["default"].string().custom(function (value, helpers) {
        if (!mongoose_1.Types.ObjectId.isValid(value))
            return helpers.error('any.invalid');
        return value;
    }, 'Object Id Validation');
};
exports.JoiUrlEndpoint = function () {
    return joi_1["default"].string().custom(function (value, helpers) {
        if (value.includes('://'))
            return helpers.error('any.invalid');
        return value;
    }, 'Url Endpoint Validation');
};
exports.JoiAuthBearer = function () {
    return joi_1["default"].string().custom(function (value, helpers) {
        if (!value.startsWith('Bearer '))
            return helpers.error('any.invalid');
        if (!value.split(' ')[1])
            return helpers.error('any.invalid');
        return value;
    }, 'Authorization Header Validation');
};
exports["default"] = (function (schema, source) {
    if (source === void 0) { source = ValidationSource.BODY; }
    return function (req, res, next) {
        try {
            var error = schema.validate(req[source]).error;
            if (!error)
                return next();
            var details = error.details;
            var message = details
                .map(function (i) { return i.message.replace(/['"]+/g, ''); })
                .join(',');
            Logger_1["default"].error(message);
            next(new ApiError_1.BadRequestError(message));
        }
        catch (error) {
            next(error);
        }
    };
});
