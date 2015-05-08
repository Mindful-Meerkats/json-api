var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var taskListing = require('gulp-task-listing');
var shell = require('shelljs');
 
// Add a task to render the output 
gulp.task('help', taskListing);

// start and auto reloads server script
gulp.task('api-server', function(){
	nodemon({
		script: 'app.js',
		ext: 'js',
		env: { 'NODE_ENV': 'development' }
	});
});	

// dumps db and checks in
gulp.task('check-in', function(){
	if( !shell.which('git') ){
	  echo('Sorry, this task requires git, please install.');
	  exit(1);
	}
	shell.cd(__dirname + '/databases');
	shell.rm('rethinkdb_dump.tar.gz');
	shell.exec('rethinkdb dump -f rethinkdb_dump.tar.gz');
	shell.cd('..');
	if( shell.exec('git commit -am "Auto-commit"').code !== 0 ){
 	 	echo('Error: Git commit failed');
  		exit(1);
	}
});

gulp.task('api', ['api-server']);

gulp.task('default', ['api']);


