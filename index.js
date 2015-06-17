'use strict';

var fs = require('fs');
var util = require('util');
var path = require('path');

var env = process.env.NODE_ENV || 'development';
var fileName = util.format('/%s.config.js', env);
var config = fs.readFileSync(path.join(process.cwd(), 'config', fileName));

config.env = env;

function populateEachConfig (objCallback) {
    function next (cfg) {
        Object.keys(cfg).forEach(function(key) {
            if (typeof cfg[key] === 'object' && cfg[key]) {
                return next(cfg[key]);
            }
            cfg[key] = objCallback(cfg[key]);
        });
    }

    next(config);

}

function replaceTemplateTags (key) {
    if (!key.length) {
        return config;
    }

    if (!Array.isArray(key)) {
        return replaceTemplateTags(key.split('.'));
    }

    return key.reduce(function (result, i) {
        return result && result[i];
    }, config);
}

populateEachConfig(function (value) {
    if (typeof value !== 'string') {
        return value;
    }
    value = value.replace(/\$\(([^\)]+)\)/g, function (_, key) {
        return replaceTemplateTags(key);
    });
    if (/^\d+$/.test(value)) {
        return parseInt(value, 10);
    }
    if (value === 'false') {
        return false;
    }
    if (value === 'true') {
        return true;
    }

    return value;
});

module.exports = config;
