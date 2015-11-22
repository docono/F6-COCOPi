/**
* DOCONO - Basic Website Gulpfile for Templating with scss/libsass
* @since 21.11.2015
* @author docono - raphael durrer
* @version 0.1
*/


// Requirements
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var shell = require('gulp-shell');

// Requirements Image Optimization
var imagemin = require('gulp-imagemin');

// Requirements SASS
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var sassdoc = require('sassdoc');

// Requirements HTML
var htmlmin = require('gulp-htmlmin');

// Requirements JS
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');


// Browser Sync
var pwd = './template';
var reload = browserSync.reload;

gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: pwd
        }
    });

    gulp.watch("*.html").on("change", browserSync.reload);
});

// Shell
gulp.task('COCOPi', shell.task([
  'cd site',
  'git clone https://github.com/COCOPi/cocopi-kickstart.git'
]))


// scss Task
var sassInput = './template/scss/**/*.scss';
var sassOutput = './pagekit/packages/docono/theme-light/css';

var sassOptions = {
    errLogToConsole: true,
    outputStyle: 'compressed',
    includePaths: [
        'resources/assets/bower_components/foundation/scss',
        'resources/assets/bower_components/uikit/scss'
    ]
};

var autoprefixerOptions = {
    browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
};

gulp.task('sass', function () {
    return gulp
        .src(sassInput)
        //.pipe(sourcemaps.init())
        .pipe(sass(sassOptions).on('error', sass.logError))
        //.pipe(sourcemaps.write())
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(gulp.dest(sassOutput))
        .resume();
});

// SASS Documentation Task
gulp.task('sassdoc', function () {
    var sassDocOptions = {
        dest: './public/sassdoc',
        verbose: true
    };

    return gulp.src('./resources/**/*.scss')
        .pipe(sassdoc(sassDocOptions));
});


// HTML Task
var htmlInput = './resources/*.html';
var htmlOutput = './public';
var htmlOptions = {
    collapseWhitespace: true,
    removeComments: true,
    quoteCharacter: '"'
};

gulp.task('html', function () {
    return gulp.src(htmlInput)
        .pipe(htmlmin(htmlOptions))
        .pipe(gulp.dest(htmlOutput))
});


// Image Optimization Task
var imageInput = './resources/assets/img/**/*';
var imageOutput = './public/assets/img';
gulp.task('images', function () {
    return gulp.src(imageInput)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}]
            //use: [pngquant()]
        }))
        .pipe(gulp.dest(imageOutput));
});


// JS Tasks
var inputJS = [
    './resources/assets/bower_components/jquery/dist/jquery.min.js',
    './resources/assets/bower_components/foundation/js/foundation.min.js',
    './resources/assets/js/app.js'
];
var outputJS = './pagekit/packages/docono/theme-light/js';

gulp.task('jsConcat', function () {
    gulp.src(inputJS)
        .pipe(concat('all.js'))
        .pipe(gulp.dest(outputJS));
});


//Watch task
gulp.task('watch', function () {
    gulp
        .watch(sassInput, ['sass'])
        .on('change', function (event) {
            console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        });

    gulp.watch(htmlInput, ['html']).on('change', browserSync.reload);
    gulp.watch(inputJS, ['jsConcat']);

});

// Default Task
gulp.task('default', ['sass', 'html', 'jsConcat', 'watch' /*, possible other tasks... */]);
