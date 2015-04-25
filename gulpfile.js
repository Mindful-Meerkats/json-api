var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var taskListing = require('gulp-task-listing');
var shell = require('shelljs');
 
// Add a task to render the output 
gulp.task('help', taskListing);

gulp.task('api-server', function(){
	nodemon({
		script: 'api.js',
		ext: 'js',
		env: { 'NODE_ENV': 'development' }
	});
});	
gulp.task('check-in', function(){
	if (!shell.which('git')) {
	  echo('Sorry, this task requires git, please install.');
	  exit(1);
	}	
	shell.cd(__dirname + '/databases');
	shell.exec('rethinkdb dump');
});

gulp.task('api', ['api-server']);

gulp.task('default', ['api']);


