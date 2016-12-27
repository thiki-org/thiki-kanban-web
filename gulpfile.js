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
var less = require('gulp-less');
var gulpSequence = require('gulp-sequence');
var clean = require('gulp-clean');


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
    return gulp.src(['kanban/**/*.js', '!kanban/static/**/*.js', '!kanban/**/util/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// 合并压缩第三方类库
gulp.task('minify-bower-components', function () {
    gulp.src(lib.ext('js').files)
        .pipe(concat('lib.min.js'))
        .pipe(gulp.dest('kanban/static/js/'))
        .pipe(ngmin())
        .pipe(ngAnnotate())
        .pipe(uglify({mangle: false}))
        .pipe(gulp.dest('kanban/static/js/'));
});

// 合并CSS
gulp.task('minify-css', function () {
    return gulp.src(['kanban/**/*.css', '!kanban/static/css/*.css'])
        .pipe(concat('thiki-kanban.min.css'))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('kanban/static/css'));
});

// 合并LESS
gulp.task('minify-less', function () {
    return gulp.src(['kanban/**/*.less', '!kanban/static/**/*.less'])
        .pipe(concat('thiki-kanban.min.less'))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('kanban/static/less'));
});

//Less转css
gulp.task('build-less-to-css', function () {
    return gulp.src('kanban/static/less/thiki-kanban.min.less')
        .pipe(concat('thiki-kanban.min.less-css.css'))
        .pipe(less())
        .pipe(gulp.dest('kanban/static/less'));
});
gulp.task('clean-static', function () {
    return gulp.src(['kanban/static/js'], {read: false})
        .pipe(clean());
});

// 合并文件之后压缩代码
gulp.task('minify-js', ['clean-static'], function () {
    return gulp.src(['kanban/*.js', 'kanban/**/*.js', '!kanban/static/**/*.js'])
        .pipe(concat('thiki-kanban.min.js'))
        .pipe(gulp.dest('kanban/static/js'))
        .pipe(ngmin())
        .pipe(ngAnnotate())
        .pipe(uglify({mangle: false}))
        .pipe(gulp.dest('kanban/static/js'));
});

gulp.task('clean-release', function () {
    return gulp.src(['release/*'], {read: false})
        .pipe(clean());
});

gulp.task('release', ['clean-release'], function () {
    gulp.src("kanban/static/js/*")
        .pipe(gulp.dest('release/js'));

    gulp.src("kanban/static/css/thiki-kanban.min.css")
        .pipe(gulp.dest('release/css'));

    gulp.src("kanban/static/img/**")
        .pipe(gulp.dest('release/img'));

    gulp.src("kanban/static/fonts/**")
        .pipe(gulp.dest('release/fonts'));

    gulp.src("kanban/component/**/*.html")
        .pipe(gulp.dest('release/component'));

    gulp.src("kanban/foundation/modal/partials/**")
        .pipe(gulp.dest('release/foundation/modal/partials'));

    gulp.src("kanban/static/index.html")
        .pipe(gulp.dest('release'));
});

// 监视文件的变化
gulp.task('watch', function () {
    gulp.watch(['kanban/*.js', 'kanban/**/*.js', 'kanban/styles/*.css', 'kanban/**/*.less', 'kanban/**/*.css', 'gulpfile.js', '!kanban/static/**/*.js', '!kanban/static/**/*.css'], ['jshint', 'minify-bower-components', 'minify-js', 'minify-less', 'build-less-to-css', 'minify-css']);
});

// 注册缺省任务
gulp.task('default', gulpSequence('jshint', 'minify-bower-components', 'minify-js', 'minify-less', 'build-less-to-css', 'minify-css', 'release'));
