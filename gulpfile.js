const gulp = require('gulp');

const htmlmin = require('gulp-htmlmin');

const postcss = require('gulp-postcss');
const pimport = require('postcss-import');
const autoprefixer = require('autoprefixer');
const csso = require('postcss-csso');

const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

const browserSync = require('browser-sync');
const del = require('del');

const html = () => {
	return gulp
		.src('src/*.html')
		.pipe(
			htmlmin({
				removeComments: true,
				collapseWhitespace: true,
			})
		)
		.pipe(gulp.dest('dist'))
		.pipe(browserSync.stream());
};

const css = () => {
	return gulp
		.src('src/css/index.css')
		.pipe(postcss([autoprefixer(), pimport, csso]))
		.pipe(gulp.dest('dist/css/'))
		.pipe(browserSync.stream());
};

const js = () => {
	return gulp
		.src('src/js/**/*.js')
		.pipe(
			babel({
				presets: ['@babel/preset-env'],
			})
		)
		.pipe(uglify())
		.pipe(gulp.dest('dist/js/'))
		.pipe(browserSync.stream());
};

const fonts = () => {
	return gulp
		.src('src/fonts/**/*.{woff,woff2}')
		.pipe(gulp.dest('dist/fonts/'))
		.pipe(
			browserSync.stream({
				once: true,
			})
		);
};

const imgs = () => {
	return gulp
		.src('src/img/**/*.{jpg,png,svg,gif,ico,webp}')
		.pipe(gulp.dest('dist/img/'))
		.pipe(
			browserSync.stream({
				once: true,
			})
		);
};

const server = () => {
	browserSync.init({
		server: {
			baseDir: 'dist',
		},
	});
};

const watch = () => {
	gulp.watch('src/*.html', gulp.series(html));
	gulp.watch('src/css/**/*.css', gulp.series(css));
	gulp.watch('src/js/**/*.js', gulp.series(js)).on('unlink', (path) => {
		del.sync(path.replace('src', 'dist'));
	});
	gulp
		.watch('src/fonts/**/*.{woff,woff2}', gulp.series(fonts))
		.on('unlink', (path) => {
			del.sync(path.replace('src', 'dist'));
		});
	gulp
		.watch('src/img/**/*.{jpg,png,svg,gif,ico,webp}', gulp.series(imgs))
		.on('unlink', (path) => {
			del.sync(path.replace('src', 'dist'));
		});
};

const clean = () => del('dist/**');

exports.hrml = clean;
exports.html = html;
exports.css = css;
exports.js = js;
exports.fonts = fonts;
exports.imgs = imgs;
exports.watch = watch;
exports.server = server;

exports.build = gulp.series(clean, gulp.parallel(html, css, js, fonts, imgs));

exports.default = gulp.series(
	clean,
	gulp.parallel(html, css, js, fonts, imgs),
	gulp.parallel(watch, server)
);
