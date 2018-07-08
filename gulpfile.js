var gulp = require('gulp');
var fs = require('fs');
var path = require('path');
var url = require('url');
var server = require('gulp-webserver');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var minCss = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var es6 = require('gulp-babel');

gulp.task('server', ['scss'], function() {
    gulp.src('src')
        .pipe(server({
            port: 8000,
            open: true,
            livereload: true,
            host: "169.254.164.0",
            middleware: function(req, res, next) {
                pathname = url.parse(req.url, true).pathname;
                if (pathname === '/favicon.ico') {
                    return;
                }
                pathname = pathname === '/' ? 'index.html' : pathname;
                res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)))
            }
        }))
})

// 开发编译
gulp.task('scss', function() {
    gulp.src('src/sass/*.scss')
        .pipe(sass()) // 转译
        .pipe(concat('all.css')) // 合并
        .pipe(gulp.dest('src/css'))
})
gulp.task('uglify', function() {
    gulp.src(['src/js/*.js', '!src/js/*.min.js'])
        .pipe(es6({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('src/js'))
})

gulp.task('watch', function() {
    gulp.watch('src/scss/*.scss', ['scss'])
})

gulp.task('dev', ['scss', 'uglify', 'server'])











// 对样式
gulp.task('buildScss', function() {
    gulp.src('./src/sass/*.scss')
        .pipe(sass())
        .pipe(concat('all.css'))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0']
        }))
        .pipe(minCss())
        .pipe(gulp.dest('build/css'))
})
gulp.task('buildjs', function() {
    gulp.src(['./src/js/*.js', './src/js/*.min.js'])
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest('build/js'))
})
gulp.task('copyhtml', function() {
    gulp.src('./src/**/*.html')
        .pipe(gulp.dest('build'))
})

// 线上环境

gulp.task('build', ['buildScss', 'buildjs', 'copyhtml'])