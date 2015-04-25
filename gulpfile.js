var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var taskListing = require('gulp-task-listing');
 
// Add a task to render the output 
gulp.task('help', taskListing);

gulp.task('server', function(){
	nodemon({
		script: 'server.js', 
		ext: 'js',
		env: { 'NODE_ENV': 'development' }
	});
});	

gulp.task('default',["server"]);