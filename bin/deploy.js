const fs = require('fs-extra');
const os = require('os');
const path = require('path');
const exec = require('child_process').exec;

const globby = require('globby');

const DIR_ROOT = path.join(__dirname, '..');
const DIR_BUILD = path.join(DIR_ROOT, 'dist');
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

const run = (command, ...args) => new Promise((resolve, reject) => {
  console.log(command, ...args);

  const argumentsQuoted = args.map(arg => `"${arg}"`).join(' ');
  const commandFull = `${command} ${argumentsQuoted}`;

  exec(commandFull, (err) => {
    if (err) {
      reject(err);
      return;
    }

    resolve();
  });
});

const now = new Date();
const subfiles = [
  `${DIR_ROOT}/*`,
  `!${DIR_ROOT}/.git/**`,
  `!${DIR_ROOT}/node_modules/**`,
];

run('node', process.env.npm_execpath, 'run', 'build')
  .then(() => remove(DIR_TMP))
  .then(() => copy(DIR_BUILD, DIR_TMP))
  .then(() => run('git checkout gh-pages'))
  .then(() => globby(subfiles))
  .then(files => Promise.all(files.map(file => remove(file))))
  .then(() => copy(DIR_TMP, DIR_ROOT))
  .then(() => run('git add .'))
  .then(() => run(`git commit -m "Update ${now.toString()}"`))
  .then(() => run('git push'))
  .then(() => remove(DIR_TMP))
  .then(() => run('git checkout master'))
  .catch(e => console.error(e));
