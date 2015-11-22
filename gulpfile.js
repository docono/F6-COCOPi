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
gulp.task('COCOPi from git', shell.task([
  'git clone https://github.com/COCOPi/cocopi-kickstart.git cocopi',
  'rm -rf ./cocopi/site/theme/css',
  'rm -rf ./cocopi/site/theme/js',
  'rm ./cocopi/site/theme/media/logo.svg',
  'git add *',
  'git commit -m "adding cocopi to git"'
]));


// scss Task
var sassInput = './template/scss/**/*.scss';
var sassOutput = './cocopi/site/theme/css';

var sassOptions = {
    errLogToConsole: true,
    outputStyle: 'compressed',
    includePaths: [
        './template/bower_components/foundation/scss'
    ]
};

var autoprefixerOptions = {
  browsers: ['last 2 versions', 'ie >= 9', 'and_chr >= 2.3']
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
        dest: './sassdoc',
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

gulp.task('HTML Optimization', function () {
    return gulp.src(htmlInput)
        .pipe(htmlmin(htmlOptions))
        .pipe(gulp.dest(htmlOutput))
});


// Image Optimization Task
var imageInput = './template/media/**/*';
var imageOutput = './site/theme/media';
gulp.task('Images Optimization', function () {
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
