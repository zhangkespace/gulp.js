//相关链接:http://ju.outofmemory.cn/entry/69523
              //http://www.techug.com/gulp
              //http://www.ydcss.com/
var gulp = require('gulp');//返回一个对象
//gulp对象的一些API(编程接口又叫对象的方法):

//gulp.task()创建任务
//gulp.src()输入文件流

//gulp.pipe()传输文件流   把上一个命令的输出拿来作为下一个命令的输入,形成一个组件流steamimg,把组件连接起来使用,产生巨大的功能;一个大工程系统应该是由各个小且独立的管子连接而成(gulp.js的核心思想)

//gulp.dest()输出文件流
//gulp.watch()监听

//gulp.task("任务名",[],)

gulp.task("gulp1",[],function(){
	console.log('执行gulp1')
})
gulp.task("gulp2",function(){
	console.log("执行gulp2")
})
//先执行gulp1  gulp2 再执行gulp3
gulp.task("gulp3",["gulp1","gulp2"],function(){
	console.log('执行gulp3')
	console.log('++++++++')
});

//default默认命令,当只启动gulp不加命令的时候会默认启动default命令
gulp.task("default",["gulp3"]);
//default命令,先执行gulp3  最后执行default(只输入gulp不加命令名字,则自动执行default)

gulp.task('test',function(){
  return gulp.src('text.js')
	         .pipe(gulp.dest('dest/'));
}) 
gulp.task('text',function(){
  return gulp.src(["text1.js","text2.js","text3.js","text4.js"])//全部传输到dest中
	         .pipe(gulp.dest('dest/'));
})
gulp.task('text',function(){
  return gulp.src(["text*.js"])
	            .pipe(gulp.dest("dest/"));
})

gulp.task('text',function(){
  return gulp.src(["text*.js","!text3.js"])//除了text3.js其他全部传输
	         .pipe(gulp.dest("dest/"));
})

// 先安装在服务器中安装(npm install gulp-less --save-dev)

//require()参数是 "gulp-XX" 返回一个功能函数
var less = require('gulp-less');//自动生成css
var cleanCss = require('gulp-clean-css');//压缩css

var LessAutoprefix = require('gulp-autoprefixer');//gulp-autoprefixer根据设置浏览器版本自动处理浏览器前缀
var concat = require('gulp-concat');//合并两个文件到指定的文件名
var uglify = require('gulp-uglify');//压缩js
var connect = require('gulp-connect');//建服务器 返回一个对象




gulp.task('less',function(){
	// gulp.src().pipe().pipe().....
	gulp.src(['*.less'])//多个文件要用数组[]的方式写
	  .pipe(less())//没有断行,不要加标点符号
      // .pipe(cleanCss())
      // .pipe(LessAutoprefix({
      // 	browser:['last 20 versions'],
      // 	cascade:true
      // }
      // 	))

      // .pipe(concat("app.min.css"))
	  .pipe(gulp.dest('dest/'))//注意顺序,前面处理完了,最后放进dest内
})

gulp.task('js',function(){
	return gulp.src(['app.js','*Controller.js'])
	  .pipe(concat("app.min.js"))
	  .pipe(uglify())
	  .pipe(gulp.dest('dest/'))
});

gulp.task('localhost',function(){
	connect.server({
	   root:'dest/',//静态资源目录
	   port:8012//localhost8012
	})
})

//监听
gulp.task('mywatch',function(){
	//当less文件发生改动的时候执行函数
	// gulp.watch('*.less').on('change',function(e){
	// 	console.log("less====编译"+e.path);  //当前改动的文件路径 
	// 	gulp.src(e.path)
	// 	.pipe(gulp.dest('dest/'))
	// });

//当less文件发生改动时 启动less
	gulp.watch('*less',['less']);
    gulp.watch(['app.js','*Controller.js'],['js']);
})






var rev = require('gulp-rev');//生成md5加密串 如果内容没有发生变化,再次生成的加密串不变
gulp.task('rev',function(){
	return gulp.src(['dest/app.min.css','dest/app.min.js'])
	    .pipe(rev())
	    .pipe(gulp.dest('dest/'))
	    .pipe(rev.manifest())//生成一个json文件(存放最新的加密串文件)
	    .pipe(gulp.dest('dest/'));//把这个json文件放在dest中
})

var inject = require('gulp-inject');

gulp.task('inject',function(){
	return gulp.src('indexPage.html')
	    .pipe(inject(gulp.src(['dest/app-*.min.js','dest/app-*.min.css'])))
	    .pipe(gulp.dest('dest/'))
})


var clean2 = require('gulp-clean');//删除指定的文件

gulp.task('clean2',function(){
	return gulp.src('dest/app-*.min.*')
	     .pipe(clean2());
})


var sequence = require('gulp-sequence');//让任务按照指定的顺序执行
gulp.task('build',function(cb){
	return sequence('clean2','rev','inject',cb)
})







