const env = process.env.NODE_ENV || 'development';

import development from '../../config/development.config';
import production from '../../config/production.config';
import staging from '../../config/staging.config';

let configs = { development, staging, production };
let config = populateEachConfig(configs[env]);
config.env = env;

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
    return Object.keys(cfg).map(key => {
        if (typeof cfg[key] === 'object' && cfg[key]) {
            return populateEachConfig(cfg[key]);
        }
        cfg[key] = coerce(cfg[key]);
    });
}

function replaceTemplateTags (key) {
    if (!key.length) {
        return config;
    }
    if (!Array.isArray(key)) {
        return replaceTemplateTags(key.split('.'));
    }
    return key.reduce((result, i) => result && result[i], config);
}

export default config;
