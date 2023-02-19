"use strict";
exports.__esModule = true;
exports["default"] = (function (execution) {
    return function (req, res, next) {
        execution(req, res, next)["catch"](next);
    };
});
