const env = process.env.NODE_ENV || 'development';

var util = require('util');
var fileName = util.format('%s.config.js', env);
var config = require('../../config/' + fileName);

config.env = env;
populateEachConfig(config);

function replaceTemplateTags (key) {
    if (!key.length) {
        return config;
    }
    if (!Array.isArray(key)) {
        return replaceTemplateTags(key.split('.'));
    }
    return key.reduce((result, i) => result && result[i], config);
}

function coerce (value) {
    if (typeof value !== 'string') {
        return value;
    }
    value = value.replace(/\$\(([^\)]+)\)/g, (_, key) => replaceTemplateTags(key));
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
}

function populateEachConfig (cfg) {
    Object.keys(cfg).forEach(key => {
        if (typeof cfg[key] === 'object' && cfg[key]) {
            return populateEachConfig(cfg[key]);
        }
        cfg[key] = coerce(cfg[key]);
    });
}

export default config;
