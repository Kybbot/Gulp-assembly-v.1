const gulp = require('gulp');
const autoprefixer = require('autoprefixer');
const babel = require('gulp-babel');
const browserSync = require('browser-sync');
const htmlmin = require('gulp-htmlmin');
const uglify = require('gulp-uglify');

const postcss = require('gulp-postcss');
const csso = require('postcss-csso');
const pimport = require('postcss-import');

const html = () => {
	return gulp.src('src/*.html')
		.pipe(htmlmin({
			removeComments: true,
			collapseWhitespace: true,
		}))
		.pipe(gulp.dest('dist'))
		.pipe(browserSync.stream());
};
exports.html = html;

const css = () => {
	return gulp.src('src/css/index.css')
	.pipe(postcss([
		pimport,
		autoprefixer(),
		csso,
	]))
	.pipe(gulp.dest('dist/css/'))
	.pipe(browserSync.stream());
}
exports.css = css;

const js = () => {
	return gulp.src('src/js/main.js')
	.pipe(babel({
		presets: ['@babel/preset-env']
	}))
	.pipe(uglify())
	.pipe(gulp.dest('dist/js/'))
	.pipe(browserSync.stream());
}
exports.js = js;

const copy = () => {
	return gulp.src([
			'src/fonts/**/*',
			'src/img/**/*',
			'src/libs/**/*',
		], {
			base: 'src'
		})
		.pipe(gulp.dest('dist'))
		.pipe(browserSync.stream({
			once: true
		}));
};
exports.copy = copy;

const server = () => {
	browserSync.init({
		server: {
			baseDir: 'dist'
		}
	});
}
exports.server = server;

const watch = () => {
	gulp.watch('src/*.html', gulp.series(html));
	gulp.watch('src/css/**/*.css', gulp.series(css));
	gulp.watch('src/js/**/*.js', gulp.series(js));
	gulp.watch([
		'src/fonts/**/*',
		'src/img/**/*',
		'src/libs/**/*',
	], gulp.series(copy));
}
exports.watch = watch;

exports.default =  gulp.series(
	gulp.parallel(
		html,
		css,
		js,
		copy,
	),
	gulp.parallel(
		watch,
		server,
	),
);