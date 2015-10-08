// Load plugins
var gulp = require('gulp'),
    del = require('del'),
    lost = require('lost'),
    autoprefixer = require('autoprefixer'),
    plugins = require('gulp-load-plugins')({ camelize: true });

// Paths
var paths = {
    source: 'source/',
    assets: 'assets/',
    components: 'bower_components/'
};

gulp.task('copy-sass', function(){

    gulp.src([
        paths.components + 'compass-breakpoint/**/*.scss',
        paths.components + 'susy/sass/**/*.scss'
    ], { base: paths.components })
    .pipe(gulp.dest(paths.source + 'sass/'));

});

// Compress SCSS files
gulp.task('sass', function() {

    return gulp.src([
        paths.source + 'sass/susy/sass/_susy.scss',
        paths.source + 'sass/compass-breakpoint/stylesheets/_breakpoint.scss',
        paths.source + 'sass/_main.scss',
    ], { base: paths.source + 'sass' })
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.concat('style.scss'))
    .pipe(plugins.sass({
        outputStyle: 'expanded', // nested, expanded, compact, compressed
        sourceComments: 'normal',
        includePaths : [
            paths.source + 'sass/susy/sass',
            paths.source + 'sass/susy/sass/susy',
            paths.source + 'sass/susy/sass/susy/language',
            paths.source + 'sass/susy/sass/susy/language/susy',
            paths.source + 'sass/compass-breakpoint/stylesheets',
        ]
    }))
    .pipe(plugins.rename('style.css'))
    .pipe(plugins.sourcemaps.write(paths.assets + 'sourcemaps'))
    .pipe(gulp.dest(''));

});

// Concat Global Scripts
gulp.task('scripts', function() {

    return gulp.src([
            paths.source + 'js/main.js'
        ])
        .pipe(plugins.jshint())
        .pipe(plugins.concat('main.min.js'))
        .pipe(plugins.uglify())
        .pipe(gulp.dest(paths.assets + 'js'));

});

// Images
gulp.task('images', function() {

    gulp.src(paths.source + 'img/*' )
        .pipe(plugins.changed(paths.assets + 'img')
        .pipe(plugins.imagemin({
                optimizationLevel: 3,
                progressive: true,
                interlaced: true })
            )
        )
        .pipe(gulp.dest(paths.assets + 'img'));

});

// Clean
gulp.task('clean', function(cb) {
    return del([paths.assets], cb);
});

// Default task
// Build and  everyhing
gulp.task('default',['clean'], function() {

    gulp.start(
        'sass',
        'scripts',
        'images'
    );
});

// Watch
gulp.task('watch', function() {

    // Watch .scss files
    gulp.watch( paths.source + 'sass/**/*.scss', ['sass'] );

    // Watch .js files
    gulp.watch( paths.source + 'js/*.js', ['scripts']);

    // Watch image files
    gulp.watch( paths.source + 'img/**/*', ['images']);

});
