var gulp = require('gulp');
var r = require('rethinkdb');

gulp.task('build_db', function(){
	// TODO: Add database migration here
});

gulp.task('default',["build_db"]);