# c0nfig

[![npm version](http://badge.fury.io/js/c0nfig.svg)](http://badge.fury.io/js/c0nfig)
[![Dependency Status](http://david-dm.org/voronianski/c0nfig.svg)](http://david-dm.org/voronianski/c0nfig)

> Require local environment based configs as if they are in `node_modules`.

## Install

```bash
npm install c0nfig --save
```

## Usage

Create configs for every app environment just putting the env name as prefix of the file name:

```bash
app-folder/config:~$ ls -a

production.config.js
development.config.js
# etc.
```

Export some configuration data for every environment like:

```js
// development.config.js
module.exports = {
  title: 'BLITZKRIEG BOP (STAGING)',
  apiUrl: 'https://staging.example.org/api'
};
```

```js
// production.config.js
module.exports = {
  title: 'BLITZKRIEG BOP (PRODUCTION)',
  apiUrl: 'https://example.org/api'
};
```

Start your app with proper `NODE_ENV` (if not provided it will grab `development.config.js` by default), then require/import `c0nfig` in your source code and use the data:

```js
// src/app.js
const config = require('c0nfig');
const request = require('superagent');

request.get(config.apiUrl).then(res => { ... });
```

### Template tags

You are able to use template tags like `$(configProperty.childProperty)` to point to specific properties of config:

```js
module.exports = {
  title: 'BLITZKRIEG BOP!',
  http: {
    port: process.env.PORT || 8080,
    url: process.env.URL || 'http://0.0.0.0:$(http.port)'
  }
};
```

---

**MIT Licensed**
