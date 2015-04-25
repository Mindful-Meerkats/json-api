var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var taskListing = require('gulp-task-listing');
var source = require('vinyl-source-stream'); // Used to stream bundle for further handling
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify'); 
var concat = require('gulp-concat');
 
// Add a task to render the output 
gulp.task('help', taskListing);

gulp.task('api-server', function(){
	nodemon({
		script: 'api.js', 
		ext: 'js',
		env: { 'NODE_ENV': 'development' }
	});
});	

gulp.task('admin-server', function(){
	nodemon({
		script: 'admin.js', 
		ext: 'js',
		env: { 'NODE_ENV': 'development' }
	});
});	
 
gulp.task('admin-browserify', function(){

  var bundler = browserify({
    entries: ['./admin/main.js'], 									// Only need initial file, browserify finds the deps
    transform: [reactify],      									// We want to convert JSX to normal javascript
    debug: true,               										// Gives us sourcemapping
    cache: {}, packageCache: {}, fullPaths: true 	// Requirement of watchify
 });
 var watcher  = watchify(bundler);

  return watcher
  .on('update', function(){ 											  // When any files update
    var updateStart = Date.now();
    console.log('Updating!');
    watcher.bundle() 															  // Create new bundle that uses the cache for high performance
    .pipe(source('main.js'))    
    .pipe(gulp.dest('./admin/'));
    console.log('Updated!', (Date.now() - updateStart) + 'ms');
  })
  .bundle() 																			  // Create the initial bundle when starting the task
  .pipe(source('main.js'))
  .pipe(gulp.dest('./admin/build.js'));
});

gulp.task('admin', ['admin-browserify', 'admin-server']);
gulp.task('api', ['admin-api']);

gulp.task('default', ['admin']);