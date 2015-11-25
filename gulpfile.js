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
var imagemin = require('gulp-imagemin');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var sassdoc = require('sassdoc');
var htmlmin = require('gulp-htmlmin');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');


// Working Paths
var themePath = './cocopi/site/theme';
var templatePath = './template';
var foundationPath = templatePath + 'bower_components/foundation';
var foundationSCSSPath = foundationPath + '/scss';
var sassDocPath = './sassdoc';



// Browser Sync
var pwd = templatePath;
var reload = browserSync.reload;

gulp.task('Browser-Sync', function () {
    browserSync.init({
        server: {
            baseDir: pwd
        }
    });

    gulp.watch("*.html").on("change", browserSync.reload);
});

// Shell
gulp.task('COCOPi-from-GIT', shell.task([
  'git clone https://github.com/COCOPi/cocopi-kickstart.git cocopi',
  'rm -rf ./cocopi/site/theme/css',
  'rm -rf ./cocopi/site/theme/js',
  'rm ./cocopi/site/theme/media/logo.svg',
  'git add *',
  'git commit -m"adding cocopi to git"'
]));


// Libsass SCSS
var sassInput = templatePath + '/scss/**/*.scss';
var sassOutput = themePath + '/css';
var sassOptions = {
    errLogToConsole: true,
    outputStyle: 'compressed',
    includePaths: [
        foundationSCSSPath
    ]
};

// Autoprefix for Browsers
var autoprefixerOptions = {
  browsers: ['last 2 versions', 'ie >= 9', 'and_chr >= 2.3']
};


gulp.task('Libsass-SCSS', function () {
    return gulp
        .src(sassInput)
        //.pipe(sourcemaps.init())
        .pipe(sass(sassOptions).on('error', sass.logError))
        //.pipe(sourcemaps.write())
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(gulp.dest(sassOutput))
        .resume();
});

// SASS Documentation
gulp.task('SassDocumentation', function () {
    var sassDocOptions = {
        dest: sassDocPath,
        verbose: true
    };

    return gulp.src(templatePath + '/**/*.scss')
        .pipe(sassdoc(sassDocOptions));
});


// HTML Optimization
var htmlInput = templatePath + '/*.html';
var htmlOutput = themePath;
var htmlOptions = {
    collapseWhitespace: true,
    removeComments: true,
    quoteCharacter: '"'
};

gulp.task('HTML-Optimization', function () {
    return gulp.src(htmlInput)
        .pipe(htmlmin(htmlOptions))
        .pipe(gulp.dest(htmlOutput))
});


// Image Optimization
var imageInput = templatePath + '/media/**/*';
var imageOutput = themePath +'/media';

gulp.task('Image-Optimization', function () {
    return gulp.src(imageInput)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}]
            //use: [pngquant()]
        }))
        .pipe(gulp.dest(imageOutput));
});


// Javascript Optimization
var inputJS = [
    foundationPath + '/jquery/dist/jquery.min.js',
    foundationPath + '/js/foundation.min.js',
    templatePath + '/js/app.js'
];
var outputJS = themePath + '/js';

gulp.task('Javascript-Optimization', function () {
    gulp.src(inputJS)
        .pipe(concat('app.js'))
        .pipe(gulp.dest(outputJS));
});


// Glup Watcher
gulp.task('Gulp-Watcher', function () {
    gulp
        .watch(sassInput, ['sass'])
        .on('change', function (event) {
            console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        });

    gulp.watch(htmlInput, ['html']).on('change', browserSync.reload);
    gulp.watch(inputJS, ['jsConcat']);

});

// Gulp Default
gulp.task(
  'default',
  [
    'Libsass-SCSS',
    'HTML-Optimization',
    'Javascript-Optimization',
    'Gulp-Watcher'
     /*, possible other tasks... */
  ]
);
