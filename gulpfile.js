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
  fonts: {
    source: path.join(DIR_SOURCE, 'fonts'),
    destination: path.join(DIR_DESTINATION, 'assets', 'fonts'),
  },
  images: {
    source: path.join(DIR_SOURCE, 'images'),
    destination: path.join(DIR_DESTINATION, 'assets', 'images'),
  },
  scripts: {
    source: path.join(DIR_SOURCE, 'scripts'),
    destination: path.join(DIR_DESTINATION, 'assets', 'scripts'),
  },
  styles: {
    source: path.join(DIR_SOURCE, 'styles'),
    destination: path.join(DIR_DESTINATION, 'assets', 'styles'),
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

gulp.task('fonts', () => gulp.src(`${paths.fonts.source}/**.{woff,woff2}`)
  .pipe(gulp.dest(paths.fonts.destination)));

gulp.task('images', () => gulp.src(`${paths.images.source}/**.{gif,jpg,png,svg}`)
  .pipe(gulp.dest(paths.images.destination)));

gulp.task('scripts', () => rollup.rollup(OPTIONS_ROLLUP)
  .then(bundle => bundle.write(OPTIONS_ROLLUP_WRITE)));

gulp.task('styles', () => gulp.src(`${paths.styles.source}/**.css`)
  .pipe(gulp.dest(paths.styles.destination)));

gulp.task('templates', () => gulp.src(`${paths.templates.source}/**.html`)
  .pipe(gulp.dest(paths.templates.destination)));

gulp.task('build', gulp.series('clean', gulp.parallel('fonts', 'images', 'scripts', 'styles', 'templates')));
gulp.task('default', gulp.series('build'));

gulp.task('watch', gulp.series('default', () => {
  const reload = (done) => {
    browserSync.reload();
    done();
  };

  browserSync.init({
    server: './dist',
  });

  gulp.watch(`${paths.images.source}/**.js`, gulp.series('images', reload));
  gulp.watch(`${paths.scripts.source}/**.js`, gulp.series('scripts', reload));
  gulp.watch(`${paths.styles.source}/**.css`, gulp.series('styles', reload));
  gulp.watch(`${paths.templates.source}/**.html`, gulp.series('templates', reload));
}));
