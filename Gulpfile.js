/**
 * Created by xubt on 4/30/16.
 */
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var ngmin = require('gulp-ngmin');
var ngAnnotate = require('gulp-ng-annotate');
var lib = require('bower-files')({
    overrides: {
        'x-editable': {
            main: './dist/bootstrap3-editable/js/bootstrap-editable.js',
            dependencies: {
                "jquery": ">=1.6"
            }
        }
    }
});

var cleanCSS = require('gulp-clean-css');


// 语法检查
gulp.task('jshint', function () {
    return gulp.src('app/js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// 合并压缩第三方类库
gulp.task('minify-bower-components', function () {
    gulp.src(lib.ext('js').files)
        .pipe(concat('lib.min.js'))
        .pipe(gulp.dest('app/static/js/'));
});

// 合并CSS
gulp.task('minify-css', function () {
    return gulp.src('app/styles/**/*.css')
        .pipe(concat('thiki-kanban.min.css'))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('app/static/css'));
});
// 合并文件之后压缩代码
gulp.task('minify', function () {
    return gulp.src([
        'app/js/*.js', 'app/js/**/*.js'])
        .pipe(ngAnnotate())
        .pipe(ngmin({dynamic: false}))
        .pipe(concat('thiki-kanban.js'))
        .pipe(gulp.dest('app/static/js'))
        .pipe(uglify())
        .pipe(rename('thiki-kanban.min.js'))
        .pipe(gulp.dest('app/static/js'));
});


// 监视文件的变化
gulp.task('watch', function () {
    gulp.watch(['app/js/*.js', 'app/js/**/*.js', 'app/style/*.css', 'Gulpfile.js'], ['jshint', 'minify', 'minify-css']);
});

// 注册缺省任务
gulp.task('default', ['jshint', 'minify-bower-components', 'minify', 'minify-css', 'watch']);
