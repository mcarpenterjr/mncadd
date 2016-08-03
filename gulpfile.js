var gulp = require('gulp');
var gutil = require( 'gulp-util' );
var ftp = require( 'vinyl-ftp' );
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var del = require('del');


var paths = {
  //IMPORTANT: Use to block tasks from parsing this massive directory!
  restricted: ['./!node_modules/**/*', './!bower_components/**/*'],
  content: ['./_src/*.html'],
  styles: ['./_src/css/*.css'],
  scripts: ['./_src/js/**/*.js'],
  images: ['./_src/img/**/*'],
  fonts: ['./_src/fonts/**'],
};

/* Font Generator
* modify src and destination per use.
*/
gulp.task('fontgen', function() {
  return gulp.src("_src/assets/fonts/keepCalm/*.{ ttf, otf }")
  .pipe(fontgen({
    dest: "_src/assets/fonts/keepCalm/"
  }));
});

//  Developement Preview
gulp.task('serve', function() {
  browserSync.init([paths.content, paths.styles, paths.scripts, paths.fonts, paths.images], {
    server: './_src'
  });
});

// Deployment to Remote Server
gulp.task( 'deploy', function () {

	var conn = ftp.create( {
		host:     'mncarpenter.ninja',
		user:     'memedev@mncarpenter.ninja',
		password: '@N+C_$]^*KE@ **REMOVEME**',
		parallel: 10,
		log:      gutil.log
	} );

	var globs = [
		'_src/**',
		'_src/css/**',
		'_src/js/**',
		'_src/fonts/**',
		'_src/img/**',
		'_src/index.html'
	];

	// using base = '.' will transfer everything to /public_html correctly
	// turn off buffering in gulp.src for best performance

	return gulp.src( globs, { base: './_src', buffer: false } )
		.pipe( conn.newerOrDifferentSize('/') ) // only upload newer files
		.pipe( conn.dest('/') );

} );

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['serve']);
