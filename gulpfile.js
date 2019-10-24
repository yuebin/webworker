var gulp = require('gulp');
var webserver = require('gulp-webserver');

gulp.task('test', done=> {
    gulp.src('test')
        .pipe(webserver({
            livereload:true,
            directoryListing:true,
            fallback: 'index.html'
        }));
    done();
});
