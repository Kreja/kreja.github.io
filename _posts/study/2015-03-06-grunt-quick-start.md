---
layout: post
title: Grunt 快速使用
category: study
tags: tool 
description: 看了本文，就可以用 Grunt 进行最基本的使用啦啦啦~~~
---

# Grunt 的使用
** 其实只是把别人的整理了一遍 -- **



### 安装 Grunt
通过 yoeman 安装

```bash
sudo npm install -g yo
```
```bash
sudo npm install -g grunt-cli
```


### 新建项目目录、文件



### 生成 package.json 文件
* 进入项目文件夹，`npm init`



### 安装 Grunt 和需要的插件
* `npm install grunt --save-dev`
	* 表示通过 npm 安装了 grunt 到当前项目，同时加上了 `—save-dev` 参数，表示会把刚安装的东西添加到 package.json 文件中。
* 需要安装的插件：
	* 合并文件：grunt-contrib-concat
	* 语法检查：grunt-contrib-jshint(jshint 在 contact 之后，免得两个文件分开是对的，连接起来又出错了)
	* Scss 编译：grunt-contrib-sass
	* 压缩文件：grunt-contrib-uglify
	* 监听文件变动：grunt-contrib-watch
	* 建立本地服务器：grunt-contrib-connect
* 安装插件

```bash
npm install --save-dev grunt-contrib-concat grunt-contrib-jshint grunt-contrib-sass grunt-contrib-uglify grunt-contrib-watch grunt-contrib-connect
```



### 配置 Gruntfile.js 的语法
* 所有代码要包裹在
```
module.exports = function(grunt) {
    ...
};
```
里面
* 这里与 Grunt 有关的主要有三块代码：任务配置代码、插件加载代码、任务注册代码。
* 任务配置代码
	* 调用插件配置一下要执行的任务和实现的功能

	```
	grunt.initConfig({
	    pkg: grunt.file.readJSON('package.json'),//读取 package.json 文件
	    uglify: {//配置 uglify 插件的任务
	      	options: {//配置全局 options
	        	banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
	      	},
	      	build: {//建立 build 任务
	        	src: 'src/<%= pkg.name %>.js',
	        	dest: 'build/<%= pkg.name %>.min.js'
	      	}
	    }
	});
	```

	* 是对象的格式
	* 怎么写 options 里的参数和 build 里的参数内容，要查看每个插件的用法，根据用法编写任务，看[官方文档](https://www.npmjs.com/)。

* 插件加载代码
	* 把需要用到的插件加载进来
	* `grunt.loadNpmTasks('grunt-contrib-uglify');` 
* 任务注册代码
	* 注册一个 task，里面包含刚在前面编写的任务配置代码
	* `grunt.registerTask('default', ['uglify']);`
		* 在 default 上面注册一个 Uglify 任务，default 是别名，它是默认的 task，当你在项目目录执行 grunt 时，它会执行注册到 default 上的任务。也就是说，执行 grunt 命令时，uglify 的所有代码将会执行。
	* `grunt.registerTask('command', ['task:subtask']);`
		* 要输入 grunt command 命令来执行任务，这条任务只执行 task 里的 subtask，比如上面 uglify 里有一个 build 子任务
		* command 不能命名成 task，不能同名



### 项目文件传输与协作
* package.json 记录了项目中依赖的 grunt 插件，所以不用上传插件，只需要上传这个文件即可。下载下来之后，在这个项目文件夹下面，输入命令 npm install，NPM 会自动读取 package.json 文件，将 grunt 和有关插件下载下来。
* 用 .gitignore 过滤掉这个文件夹，禁止 git 追踪。



### 参考
* [Grunt 新手一日学会](http://yujiangshui.com/grunt-basic-tutorial/)