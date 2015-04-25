var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

gulp.task('server', function(){
	nodemon({
		script: 'server.js', 
		ext: 'js',
		env: { 'NODE_ENV': 'development' }
  });
});

gulp.task('default',["build_db"]);