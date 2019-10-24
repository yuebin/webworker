var gulp = require('gulp');
var webserver = require('gulp-webserver');

gulp.task('webserver', done=> {
    gulp.src('src')
        .pipe(webserver({
            livereload:true,
            directoryListing:true,
            fallback: 'index.html'
        }));
    done();
});
