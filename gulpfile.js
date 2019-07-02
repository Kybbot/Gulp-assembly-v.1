const { src, dest, parallel, series, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const atoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const cleanCss = require('gulp-clean-css');
const concat = require('gulp-concat');
const notify = require('gulp-notify');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');

function css() {
	return src('build/sass/**/*.sass')
	.pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))	
	.pipe(atoprefixer(['last 15 versions']))
	.pipe(cleanCss())
	.pipe(rename({ suffix: '.min', prefix : '' }))
	.pipe(dest('build/css'))
	.pipe(browserSync.stream());
}

function js() {
	return src([
		'build/libs/jquery/jquery-3.3.1.min.js',
		'build/js/main.js',
	])
	.pipe(babel({
		presets: ['env']
	}))
	.pipe(uglify())
	.pipe(concat('scripts.min.js'))
	.pipe(dest('build/js'));
}

function reload(done) {
	browserSync.reload();
	done();
} 

function serve() {
	browserSync.init({
		server: {
			baseDir: 'build'
		}
	});
	watch('build/sass/**/*.sass', css);
	watch('build/*.html').on('change', browserSync.reload);
	watch('build/js/**/main.js', series(js, reload));
}

exports.css = css;
exports.js = js;
exports.serve = serve;
exports.default = parallel(serve, css, js);