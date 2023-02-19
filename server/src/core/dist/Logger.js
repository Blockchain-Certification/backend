"use strict";
exports.__esModule = true;
var winston_1 = require("winston");
var fs_1 = require("fs");
var path_1 = require("path");
var winston_daily_rotate_file_1 = require("winston-daily-rotate-file");
var config_1 = require("../config");
var dir = config_1.logDirectory;
if (!dir)
    dir = path_1["default"].resolve('logs');
// create directory if it is not present
if (!fs_1["default"].existsSync(dir)) {
    // Create the directory if it does not exist
    fs_1["default"].mkdirSync(dir);
}
var logLevel = config_1.environment === 'development' ? 'debug' : 'warn';
var dailyRotateFile = new winston_daily_rotate_file_1["default"]({
    level: logLevel,
    // @ts-ignore
    filename: dir + '/%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    handleExceptions: true,
    maxSize: '20m',
    maxFiles: '14d',
    format: winston_1.format.combine(winston_1.format.errors({ stack: true }), winston_1.format.timestamp(), winston_1.format.json())
});
exports["default"] = winston_1.createLogger({
    transports: [
        new winston_1.transports.Console({
            level: logLevel,
            format: winston_1.format.combine(winston_1.format.errors({ stack: true }), winston_1.format.prettyPrint())
        }),
        dailyRotateFile,
    ],
    exceptionHandlers: [dailyRotateFile],
    exitOnError: false
});
