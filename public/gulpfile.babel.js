'use strict';

import gulp from 'gulp';
import gutil from 'gulp-util';
import minifyhtml from 'gulp-minify-html';
import sass from 'gulp-sass';
import htmlmin from 'gulp-htmlmin';
import imagemin from 'gulp-imagemin';
import del from 'del';
import webpack from 'gulp-webpack';
import webpackConfig from './webpack.config.js';

// paths
const paths = {
	src : {
		js: 'src/js/*.js',
		scss: 'src/scss/*.scss',
		html: 'src/html/*.html',
		img: 'src/images/*'
	},
	dist : {
		js: 'dist/js',
		css: 'dist/css',
		html: 'dist/html',
		img: 'dist/images'
	}
}

// task
gulp.task('webpack', () => {
	return gulp.src(paths.src.js)
	.pipe(webpack(webpackConfig))
	.pipe(gulp.dest(paths.dist.js));
});

gulp.task('compile-sass', () => {
	return gulp.src(paths.src.scss)
	.pipe(sass())
	.pipe(gulp.dest(paths.dist.css));
});

gulp.task('compress-html', () => {
	return gulp.src(paths.src.html)
	.pipe(minifyhtml())
	.pipe(htmlmin({collapseWhitespace: true}))
	.pipe(gulp.dest(paths.dist.html))
});

gulp.task('compress-images', () => {
	return gulp.src(paths.src.img)
	.pipe(imagemin())
	.pipe(gulp.dest(paths.dist.img));
});

gulp.task('clean', () => {
    return del.sync(['dist/']);
});

gulp.task('watch', () => {
	gulp.watch(paths.src.js, ['webpack']);
	gulp.watch(paths.src.scss, ['compile-sass']);
	gulp.watch(paths.src.html, ['compress-html']);
	gulp.watch(paths.src.img, ['compress-images']);
});

gulp.task('default', ['clean', 'webpack', 'compile-sass', 'compress-html', 'compress-images', 'watch']);