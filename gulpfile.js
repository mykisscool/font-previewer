var gulp = require('gulp');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var rimraf = require('gulp-rimraf');
var runSequence = require('run-sequence');
var uglify = require('gulp-uglify');
var urlAdjuster = require('gulp-css-url-adjuster');

var images = [
  'bower_components/farbtastic/*.png',
  'bower_components/jqueryui/themes/cupertino/images/*'
];
var jsPaths = [
  'bower_components/jquery-ui/jquery-1.9.1.js',
  'bower_components/jquery-ui/ui/jquery.ui.core.js',
  'bower_components/jquery-ui/ui/jquery.ui.widget.js',
  'bower_components/jquery-ui/ui/jquery.ui.mouse.js',
  'bower_components/jquery-ui/ui/jquery.ui.position.js',
  'bower_components/jquery-ui/ui/jquery.ui.draggable.js',
  'bower_components/jquery-ui/ui/jquery.ui.resizable.js',
  'bower_components/jquery-ui/ui/jquery.ui.button.js',
  'bower_components/jquery-ui/ui/jquery.ui.dialog.js',
  'bower_components/jquery-ui/ui/jquery.ui.slider.js',
  'bower_components/farbtastic/farbtastic.js',
  'bower_components/Modernizr/modernizr.js'
];
var cssPaths = [
  'bower_components/farbtastic/farbtastic.css',
  'bower_components/jqueryui/themes/cupertino/jquery-ui.css',
  'bower_components/jqueryui/themes/cupertino/jquery.ui.theme.css'
];

gulp.task('copy-vendor-images', function () {
    return gulp.src(images)
      .pipe(gulp.dest('./images'));
});

gulp.task('copy-vendor-js', function () {
    return gulp.src(jsPaths)
      .pipe(gulp.dest('./build/js'));
});

gulp.task('copy-vendor-css', function () {
    return gulp.src(cssPaths)
      .pipe(gulp.dest('./build/css'));
});

gulp.task('new-css-background-urls-farbtastic', function () {
  return gulp.src('./build/css/farbtastic.css')
    .pipe(urlAdjuster({
      prepend: '../images/'
    }))
    .pipe(rimraf())
    .pipe(rename('farbtastic-new.css'))
    .pipe(gulp.dest('./build/css'));
});

gulp.task('new-css-background-urls-cupertino', function () {
  return gulp.src('./build/css/jquery.ui.theme.css')
    .pipe(urlAdjuster({
      prepend: './'
    }))
    .pipe(rimraf())
    .pipe(rename('cupertino-new.css'))
    .pipe(gulp.dest('./build/css'));
});

gulp.task('concat-vendor-js', function () {
    return gulp.src([
      './build/js/jquery-1.9.1.js',
      './build/js/jquery.ui.core.js',
      './build/js/jquery.ui.widget.js',
      './build/js/jquery.ui.mouse.js',
      './build/js/jquery.ui.position.js',
      './build/js/jquery.ui.draggable.js',
      './build/js/jquery.ui.resizable.js',
      './build/js/jquery.ui.button.js',
      './build/js/jquery.ui.dialog.js',
      './build/js/jquery.ui.slider.js',
      './build/js/farbtastic.js',
      './build/js/modernizr.js'
    ])
    .pipe(rimraf())
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('./build/js'));
});

gulp.task('concat-vendor-css', function () {
    return gulp.src([
      './build/css/farbtastic-new.css',
      './build/css/jquery-ui.css',
      './build/css/cupertino-new.css'
    ])
    .pipe(rimraf())
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('./build/css'));
});

gulp.task('minify-vendor-js', function () {
  return gulp.src('./build/js/vendor.js')
    .pipe(uglify({ preserveComments: 'license' }))
    .on('error', function (err) {
        gutil.log(gutil.colors.red('[Error]'), err.toString());
    })
    .pipe(rimraf())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./build/js'));
});

gulp.task('minify-vendor-css', function () {
    return gulp.src('./build/css/vendor.css')
      .pipe(cleanCSS({ compatibility: 'ie8' }))
      .pipe(rimraf())
      .pipe(rename({ suffix: '.min' }))
      .pipe(gulp.dest('./build/css'));
});

gulp.task('minify-font-previewer-js', function () {
    return gulp.src('./js/ui.js')
      .pipe(uglify({ preserveComments: 'license' }))
      .on('error', function (err) {
          gutil.log(gutil.colors.red('[Error]'), err.toString());
      })
      .pipe(rename({ suffix: '.min' }))
      .pipe(gulp.dest('./build/js'));
});

gulp.task('minify-font-previewer-css', function () {
    return gulp.src('./css/styles.css')
      .pipe(cleanCSS({ compatibility: 'ie8' }))
      .pipe(rename({ suffix: '.min' }))
      .pipe(gulp.dest('./build/css'));
});

gulp.task('concat-all-js', function () {
    return gulp.src([
      './build/js/vendor.min.js',
      './build/js/ui.min.js'
    ])
    .pipe(concat('font-previewer.js'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('concat-all-css', function () {
    return gulp.src([
      './build/css/vendor.min.css',
      './build/css/styles.min.css'
    ])
    .pipe(concat('font-previewer.css'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('default', function () {
    runSequence(
        [
          'copy-vendor-images',
          'copy-vendor-css',
          'copy-vendor-js'
        ],
        [
          'new-css-background-urls-farbtastic',
          'new-css-background-urls-cupertino'
        ],
        [
          'concat-vendor-js',
          'concat-vendor-css'
        ],
        [
          'minify-vendor-js',
          'minify-vendor-css'
        ],
        [
          'minify-font-previewer-css',
          'minify-font-previewer-js'
        ],
        [
          'concat-all-css',
          'concat-all-js'
        ]
    );
});

gulp.task('watch', function () {
    gulp.watch('./css/styles.css', [
      ['minify-font-previewer-css'],
      ['concat-all-css']
    ]);

    gulp.watch('./js/app.js', [
      ['minify-font-previewer-js'],
      ['concat-all-js']
    ]);
});
