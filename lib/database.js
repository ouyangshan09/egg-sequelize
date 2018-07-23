'use strict';
const path = require('path');
const fs = require('fs');
require('ts-node/register');

function requireJsConfig(name) {
  const configPath = path.resolve(`./config/config.${name}.js`);
  if (!fs.existsSync(configPath)) { return {}; }

  let config = require(configPath);
  // FIXME: config init with function need send appInfo argument.
  if ((typeof config) === 'function') { config = config({}); }
  return config.sequelize || {};
}

function requireTsConfig(name) {
  const configPath = path.resolve(`./config/config.${name}.ts`);
  if (!fs.existsSync(configPath)) { return {}; }

  let config = require(configPath).default;

  if ((typeof config) === 'function') { config = config({}); }
  return config.sequelize || {};
}

function requireConfig(name) {
  const configPath = path.resolve(`./config/config.${name}.js`);
  if (fs.existsSync(configPath)) {
    return requireJsConfig(name);
  }
  return requireTsConfig(name);
}

// EGG_SERVER_ENV=prepub npm run migrate:up
// When EGG_SERVER_ENV is not local or unittest, set it production by default.
const serverEnv = process.env.EGG_SERVER_ENV || 'local';

const defaultConfig = requireConfig('default');
const localConfig = requireConfig(serverEnv);
const unittestConfig = requireConfig('unittest');
const prodConfig = requireConfig('prod');

module.exports = {
  development: Object.assign({}, defaultConfig, localConfig),
  test: Object.assign({}, defaultConfig, unittestConfig),
  production: Object.assign({}, defaultConfig, prodConfig),
};
