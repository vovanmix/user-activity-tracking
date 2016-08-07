var jshint = require('gulp-jshint');
var gulp = require('gulp');
var yargs = require('yargs');


// var karma = require('karma').Server;


var jsHintFiles = [
    'src/**/*.js'
];


gulp.task('build', function() {
    //todo
});


gulp.task('jsHint', ['build'], function() {
    var stream = gulp.src(jsHintFiles)
        .pipe(jshint.extract('auto'))
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));

    if (yargs.argv.failTaskOnError) {
        stream = stream.pipe(jshint.reporter('fail'));
    }
    return stream;
});
