var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var taskListing = require('gulp-task-listing');
 
// Add a task to render the output 
gulp.task('help', taskListing);

gulp.task('api-server', function(){
	nodemon({
		script: 'api.js',
		ext: 'js',
		env: { 'NODE_ENV': 'development' }
	});
});	

gulp.task('api', ['api-server']);

gulp.task('default', ['api']);


