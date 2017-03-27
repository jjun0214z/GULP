# GULP (babel, webpack, sass)

gulp.js 를 활용하여 빌드 관리하기

## gulp setting 및 설치하기

### package.json 파일 생성

걸프를 설치하려면 노드가 필요합니다. 노드가 설치가 되었다는 가정하에 터미널을 이용하여 프로젝트 폴더로 이동하여 package.json 파일을 생성 합니다. 

**$ npm init**

### Gulp 전역 설치 및 Gulp 와 디펜던시 devDependencies 로 모듈설치

package.json 파일이 생성되었다면 gulp 및 사용할 디펜던시를 설치합니다. 먼저 Gulp는 전역설치가 안되어 있다면 전역설치를 해주는 것이 좋습니다.

**$ npm install gulp -g**

도중에 graceful-fs 와 lodash 에 관한 경고가 뜨면, 최신버전으로 설치해주세요

**$ npm install -g graceful-fs lodash**

걸프를 설치 하였다면 Gulp 및 사용할 디펜던시를 설치합니다.

**$ npm install gulp-[plugin name] --save-dev**

*--save-dev 플래그를 추가하면 디펜던시들을 devDependency로만 설치하게 되는데 이 옵션을 주는 이유는 관련 디펜던시들은 프로젝트의 개발 과정까지만 필요하기 때문입니다.
Gulp 의 플러그인을 설치할때도 마찬가지로 해당 옵셥을 줍니다.*

**$ npm install gulp gulp-util --save-dev**

*gulp-util 은 gulp에서 로그를 쉽게 기록할수 있게 해줍니다.*

### Gulp 에서 ES6 문법 사용하기

**$ npm install babel-core babel-preset-es2015 --save-dev**

Gulp 에서 ES6를 사용할수 있도록 위 모듈을 설치합니다.

모듈 설치후 .babelrc 파일을 생성합니다.

{
  "presets": ["es2015"]
}

## gulpfile.babel.js 작성

### 플러그인 설치하기

사용할 아래 플러그인 설치합니다.

**npm install gulp-uglify gulp-minify-html gulp-htmlmin gulp-imagemin gulp-concat gulp-sass del --save-dev**

- gulp-uglify : js 파일 압축을 해주는 플러그인 (es6 문법을 압출할때는 오류가 생김)
- gulp-minify-html : html 파일을 minify 위한 플러그인
- gulp-htmlmin : html min 형식으로 변환해주는 플러그인
- gulp-imagemin : 이미지 파일을 압축시켜주는 플러그인
- gulp-concat : js 파일을 병합시켜주는 플러그인
- gulp-sass : sass 파일을 컴파일 하는 플럭그인
- del : del 은 Gulp 플러그인은 아니지만 gulpfile 내에서 사용 할수 있습니다. gulp 작업이 시작될때마다 dist 디렉토리에 있는 파일들을 삭제해줘야 하기때문에 이 플러그인을 사용합니다.

### gulp 주요 API

- gulp.task
- gulp.src
- gulp.dest
- gulp.watch

**gulp.task(name, [deps], func)**

*task 는 Gulp가 처리할 실행할 작업을 뜻합니다*
*name은 string 형식으로 이름을 정하며 deps는 현재 선언된 task가 실행되기전에 먼저 실행되어야 하는 task를 설정할수 있으며
선언한 task보다 먼저 실행된후 선언한 task각 실행됩니다. func는 실제 수행할 task의 내용 을 정의하는 함수*

**gulp.src(globs)**

*gulp.src 는 어떤 파일을 읽을지 정합니다.
globs 는 string 형태나 배열형태로 지정할수 있으며 “**/*.js” 이런식으로 여러 파일을 한꺼번에 지정 할 수 있습니다.*

**gulp.dest(path)**

*path는 디렉토리를 입력하며 빌드되는 경로를 입력합니다.*

**gulp.watch(glob, [task])**

*glop에 해당하는 파일들을 주시하고있닥가, 변동이 생겼을시 task를 실행합니다.*


### task 작성

task 작성전 먼저 설치한 디펜시브, 플러그인 등을 import 합니다.
<pre><code>
'use strict';

import gulp from 'gulp';
import gutil from 'gulp-util';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import minifyhtml from 'gulp-minify-html';
import sass from 'gulp-sass';
import htmlmin from 'gulp-htmlmin';
import imagemin from 'gulp-imagemin';
import del from 'del';

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
gulp.task('combine-js', () => {
	return gulp.src(paths.src.js)
	.pipe(uglify())
	.pipe(concat('bundle.js'))
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
	gulp.watch(paths.src.js, ['combine-js']);
	gulp.watch(paths.src.scss, ['compile-sass']);
	gulp.watch(paths.src.html, ['compress-html']);
	gulp.watch(paths.src.img, ['compress-images']);
});

gulp.task('default', ['clean', 'combine-js', 'compile-sass', 'compress-html', 'compress-images', 'watch']);
</code></pre>

## webpack bundle

클라이언트 사이드에서 단순히 ES6 문법을 사용하려면 위에서 했던 것 처럼 babel 을 사용하면 됩니다.

단, 이걸 한다고 해서 import 기능 까지 호환 되지는 않죠.

클라이언트 사이드에서도 import 기능을 사용 하려면 필요한것은 바로 Module Bundler 입니다. 

Module Bundler 는 브라우저단에서도 CommonJS 스타일을 사용 할 수 있게 해주는 도구입니다. 

### webpack.config.js 작성

먼저 webpack 관련 npm 설치합니다

**npm install webpack -g**

**npm install gulp-webpack --save-dev**

설치한후 webpack.config 파일을 작성합니다.

<pre><code>
import webpack from 'webpack';
import path from 'path';

module.exports = {
	context: __dirname,
	entry: {
		bundle: __dirname + '/src/js/main.js'
	},
	output: {
		path: __dirname + '/dist/js/',
		filename: '[name].js',
		publicPath: '/dist/'
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				query: {
					cacheDirectory: true,
					presets: ['es2015']
				}
			}
		]	
	},
	resolve: {
		extensions: ['', '.js', 'json']
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			}
		})
	],
	devtool: '#inline-source-map'
};
</code></pre>

### webpack.config 구문해석

#### context

entry 옵션을 해석하기위한 기본 디렉토리(절대 경로) 

#### entry

번들의 진입 점입니다.

문자열을 전달한 경우 : 문자열은 시작시로드되는 모듈로 해석됩니다.

배열을 전달한 경우 : 시작시 모든 모듈이로드됩니다. 마지막 하나가 내보내집니다.

<pre><code>
{
    entry: {
	page1: "./page1",
	page2: ["./entry1", "./entry2"]
    },
    output: {
	// Make sure to use [name] or [id] in output.filename
	//  when using multiple entry points
	filename: "[name].bundle.js",
	chunkFilename: "[id].bundle.js"
    }
}
</code></pre>

#### output

entry 에서 구축된 만들어진 번들파일을 저장 합니다.

#### output.path

번들 파일이 저장될 경로

#### output.filename

번들 파일이 출력될 네임을 지정합니다.

#### output.publicPath

브라우저에서 참조 될때 출력파일의 공용 url 주소를 지정합니다.

#### module

일반 모듈에 영향을주는 옵션

#### module.loaders

자동 적용된 로더의 배열입니다.

각 항목은 다음 속성을 가질 수 있습니다.

- test: 충족되어야하는 조건
- exclude: 만 족해서는 안되는 조건
- include: 가져온 파일이 로더에 의해 변환 될 경로 또는 파일의 배열
- loader: "!"로 분리 된 문자열의 문자열
- loaders: 문자열 로더의 배열

#### resolve

모듈 해석에 영향을 미치는 옵션

#### resolve.extensions

모듈명 뒤에 여기 명시된 확장자명들을 붙여보며 탐색을 수행한다. 

즉, 위의 설정 파일에서처럼 extensions: ['', '.js', '.css'] 으로 설정되어 있으면 

require('abc')를 resolve 하기 위해 abc, abc,js, abc.css를 탐색한다.

#### plugin

로더는 각 모듈을 어떻게 불러올 것인가를 담당한다고 이야기했다. 

이 때, 각 모듈이 아닌, 번들링이 끝난 뒤 최종적으로 나온 번들을 조작하고 싶은 경우엔 어떻게 해야할까? 

이 때 필요한게 플러그인 이다.

#### devtool

디버깅을 향상시키는 개발자 도구를 선택할수 있습니다.

- eval- 각 모듈은 eval및 로 실행됩니다 //@ sourceURL.
- source-map- SourceMap이 방출됩니다. 또한 output.sourceMapFilename보십시오.
- hidden-source-map- source-map번들에 동일 하지만 참조 주석을 추가하지 않습니다.
- inline-source-map - SourceMap은 JavaScript 파일에 DataUrl로 추가됩니다.
- eval-source-map- 각 모듈은 함께 실행되고 evalSourceMap은 DataUrl로 추가됩니다 eval.
- cheap-source-map- 열 매핑이없는 SourceMap입니다. 로더의 SourceMaps는 사용되지 않습니다.
- cheap-module-source-map- 열 매핑이없는 SourceMap입니다. 로더의 SourceMaps는 한 줄에 하나의 매핑으로 단순화됩니다.

### gulpfile.babel.js 수정

webpack 에서 js를 번들시키기 때문에 gulpfile.babel.js 파일에서 combine-js 는 필요 없어졌습니다.

gulp 파일에서 관련파일을 지워주세요(import, js task, watch, default)

#### gulpfile.babel.js 에서 webpack 불러오기

<pre><code>
import webpack from 'gulp-webpack';
import webpackConfig from './webpack.config.js';

gulp.task('webpack', () => {
	return gulp.src(paths.src.js)
	.pipe(webpack(webpackConfig))
	.pipe(gulp.dest(paths.dist.js));
});
</code></pre>

#### gulpfile.babel.js 에서 watch, default 수정

<pre><code>
gulp.task('watch', () => {
	gulp.watch(paths.src.js, ['webpack']);
	gulp.watch(paths.src.scss, ['compile-sass']);
	gulp.watch(paths.src.html, ['compress-html']);
	gulp.watch(paths.src.img, ['compress-images']);
});

gulp.task('default', ['clean', 'webpack', 'compile-sass', 'compress-html', 'compress-images', 'watch']);
</code></pre>