const del = require('del');
const gulp = require('gulp');
const path = require('path');
const browserSync = require('browser-sync').create();

const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');

const DIR_SOURCE = path.join(__dirname, 'src');
const DIR_DESTINATION = path.join(__dirname, 'dist');

const paths = {
  clean: [
    path.join(DIR_DESTINATION, '*'),
  ],
  scripts: {
    source: path.join(DIR_SOURCE, 'scripts'),
    destination: path.join(DIR_DESTINATION, 'assets', 'scripts'),
  },
  templates: {
    source: path.join(DIR_SOURCE, 'templates'),
    destination: DIR_DESTINATION,
  },
};

const OPTIONS_ROLLUP = {
  entry: path.join(paths.scripts.source, 'main.js'),
  plugins: [
    babel(),
    resolve(),
  ],
};

const OPTIONS_ROLLUP_WRITE = {
  format: 'iife',
  dest: path.join(paths.scripts.destination, 'main.js'),
  sourceMap: true,
};

gulp.task('clean', () => del(paths.clean));

gulp.task('scripts', () => rollup.rollup(OPTIONS_ROLLUP)
  .then(bundle => bundle.write(OPTIONS_ROLLUP_WRITE)));

gulp.task('templates', () => gulp.src(`${paths.templates.source}/**.html`)
  .pipe(gulp.dest(paths.templates.destination)));

gulp.task('build', gulp.series('clean', gulp.parallel('scripts', 'templates')));
gulp.task('default', gulp.series('build'));

gulp.task('watch', gulp.series('default', () => {
  const reload = (done) => {
    browserSync.reload();
    done();
  };

  browserSync.init({
    server: './dist',
  });

  gulp.watch(`${paths.scripts.source}/**.js`, gulp.series('scripts', reload));
  gulp.watch(`${paths.templates.source}/**.html`, gulp.series('templates', reload));
}));
