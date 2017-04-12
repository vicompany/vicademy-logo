const fs = require('fs-extra');
const os = require('os');
const path = require('path');
const spawn = require('child_process').spawn;

const globby = require('globby');

const DIR_BUILD = path.join(__dirname, '..', 'dist');
const DIR_TMP = path.join(os.tmpdir(), 'vi-logo-build');

const copy = (src, dest) => new Promise((resolve, reject) => {
  fs.copy(src, dest, (err) => {
    if (err) reject(err);
    else resolve();
  });
});

const remove = file => new Promise((resolve, reject) => {
  fs.remove(file, (err) => {
    if (err) reject(err);
    else resolve();
  });
});

const exec = (command, ...args) => new Promise((resolve, reject) => {
  console.log(command, ...args);

  const options = {
    stdio: ['ignore', process.stdout, process.stderr],
  };

  spawn(command, options, args)
    .on('error', reject)
    .on('close', (code) => {
      if (code > 0) reject(code);
      else resolve();
    });
});

const now = new Date();
const subfiles = [
  `${__dirname}/**/*`,
  `!${__dirname}/.git`,
];

exec('node', process.env.npm_execpath, 'run', 'build')
  .then(() => remove(DIR_TMP))
  .then(() => copy(DIR_BUILD, DIR_TMP))
  .then(() => exec('git', 'checkout', 'gh-pages'))
  .then(() => globby(subfiles))
  .then(files => Promise.all(files.map(file => remove(file))))
  .then(() => copy(DIR_TMP, __dirname))
  // .then(() => exec('git', 'add', '.'))
  // .then(() => exec('git', 'commit', '-m', `Update ${now.toString()}`))
  // .then(() => exec('git', 'push'))
  // .then(() => remove(DIR_TMP))
  // .then(() => exec('git', 'checkout', 'master'))
  .catch(e => console.error(e));
