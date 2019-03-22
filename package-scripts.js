const npsUtils = require('nps-utils') // not required, but handy!
const clean = [
  './src/assets/js/sw-dvx.js',
  './public/.cache',
  './public/.htaccess',
  './public/*.html',
  './public/*.ico',
  './public/*.js',
  './public/*.json',
  './public/*.map',
  './public/*.png',
  './public/*.pug',
  './public/*.txt',
  './public/*.webapp',
  './public/*.webmanifest',
  './public/*.xml',
  './public/assets/css/**/*',
  './public/assets/fonts/**/*',
  './public/assets/img/**/*',
  './public/assets/js/**/*.js',
  './public/assets/js/**/*.map',
  './public/data/**/*.json',
];
const webpackConfigFile = './node_modules/\\@devexteam/dvx-wrapper/setup/webpack.config.js';
const webpack = `webpack --progress --colors --hide-modules --config-name app-config --target web --config ${webpackConfigFile}`;
const webpackSW = `webpack --progress --colors --hide-modules --config-name service-worker-config --target webworker --config ${webpackConfigFile}`;
const nodemon = 'nodemon -e js,json --watch webpack.dvx.js --watch package.json --watch dvx.json --watch webpack.dvx.js';
module.exports = {
  scripts: {
    // "webpack:dev": "webpack -d --env.mode development --config ./webpack.config.js",
    // "webpack:build": "webpack -p --env.mode production --config ./webpack.config.js",
    serve: `${nodemon} -x webpack-dev-server -- --env.mode development --color --progress --stdin --hot --config-name app-config --config ${webpackConfigFile}`,
    app: `concurrently "npm start webpack.dev.sw" "npm start serve"`,
    webpack: {
      build: {
        prod: `${webpack} -p --env.mode production`,
        local: {
          prod: `${webpack} -p --env.mode production --env.local true`,
          debug: `${webpack} -p --env.mode production --env.local true --env.debug true`,
        },
        sw: `${webpackSW} --env.mode production`,
        app: 'npm start webpack.build.sw && npm start webpack.build.prod',
      },
      dev: {
        sw: `${webpackSW} --env.mode development --watch`,
      },
    },
    build: {
      local: 'npm start clean && npm start webpack.build.local.prod',
      prod: 'npm start clean && npm start webpack.build.prod',
    },
    server: {
      local: 'http-server ./public -a localhost -p 9010 -e -g -o -c-1',
    },
    preview: {
      local: `${nodemon} -x \"npm start webpack.build.local.prod && npm start server.local\"`,
      debug: `${nodemon} -x \"npm start webpack.build.local.debug && npm start server.local\"`,
      sw: `${webpackSW} --env.mode production --env.local true`,
      app: 'npm start preview.sw && npm start preview.local',
    },
    nodemon: `${nodemon}`,
    clean: `rimraf ${clean.join(' ')}`,
    package: {
      check: {
        updates: 'ncu'
      },
      update: 'ncu -u && npm i'
    },
    img: {
      build: 'dvx img:build --use sharp --exc opengraph',
    }
  },
};
