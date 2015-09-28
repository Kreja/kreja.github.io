---
layout: post
title: 异域 js 报错为 script error. 问题
category: study
tags: js 
description: 引用异域的 js，发生脚本错误，不能上报具体错误信息，只能上报 Script error. 的问题研究。
---

# 情景再现
## 起因
在监控项目中出现上报为 **Script error.** 的错误。





## 重现
### 同源 js，正确上报错误信息
http://localhost:9000/test.html: 

```
script.
    window.onerror = function(){
        $.ajax({
          url: "http://localhost:3000",
          data: arguments
        });
    };
script(src="/test/index.js")
```

"/test/index.js":

```
console.log(a);
```

http://localhost:3000 需要设置 `Access-Control-Allow-Origin`

```
res.setHeader('Access-Control-Allow-Origin', 'http://localhost:9000');
```

访问 http://localhost:9000/test.html，能正确上报错误信息：
![正确上报](/public/upload/study/ok.png)




### 异域 js，不能上报具体错误信息
但是代驾的静态资源在 cdn 上，所以尝试一下把 js 放在异域上：

http://localhost:9000/test.html: 

```
script.
    window.onerror = function(){
        $.ajax({
          url: "http://localhost:3000",
          data: arguments
        });
    };
script(src="http://localhost:8080/test/index.js")
```

"http://localhost:8080/test/index.js":

```
console.log(a);
```

http://localhost:3000 需要设置 `Access-Control-Allow-Origin`

```
res.setHeader('Access-Control-Allow-Origin', 'http://localhost:9000');
```

访问 http://localhost:9000/test.html，上报的错误信息是 **Script error.**：
![错误上报](/public/upload/study/fail.png)






# 分析
## 上报为 **Script error.** 的原因

因为同源策略导致异常信息捕获不到，跨域情况下返回的结果是 Script error.





## 为什么错误信息要遵守同源策略？

 如果你在访问一个恶意网站，页面上有一段`<script src="yourbank.com/index.html">`，当发生了脚本错误，错误信息可能会透露出你是否已经登录了（如果你已经登录了，错误信息可能是 “欢迎 Fred...” is undefined，如果你没登录，错误信息可能是“请登录...” is undefined 之类的）。如果这个恶意网站对很多银行机构进行了该行为，他们很容易就知道你是在访问哪家银行，就能做出更具有针对性的钓鱼页面。





## 解决
设置 crossorigin 属性：`script(src="http://localhost:8080/test/index.js" crossorigin)`

http://localhost:9000/test.html: 

```
script.
    window.onerror = function(){
        $.ajax({
          url: "http://localhost:3000",
          data: arguments
        });
    };
script(src="http://localhost:8080/test/index.js" crossorigin)
```

"http://localhost:8080/test/index.js":

```
console.log(a);
```

http://localhost:3000 需要设置 `Access-Control-Allow-Origin`

```
res.setHeader('Access-Control-Allow-Origin', 'http://localhost:9000');
```

http://localhost:8080 也需要设置 `Access-Control-Allow-Origin`

```
res.setHeader('Access-Control-Allow-Origin', 'http://localhost:9000');
```

访问 `http://localhost:9000/test.html`，能上报具体错误信息了：
![解决错误上报](/public/upload/study/resolve.png)




### 注意
监控的项目使用 seajs 动态加载 js，所以无法设置 crossorigin。
查阅后发现 seajs 2.2.3 和 3.0.1 已经支持 crossorigin 的配置:

* [需要修改 script 标签的属性](https://github.com/seajs/seajs/issues/1312)
* [seajs/src/util-request](https://github.com/seajs/seajs/blob/master/src/util-request.js#L33-L35)






# crossorigin 属性
在 HTML5 中，一些支持跨域的元素，如 `img`、`video`，有一个 crossorigin 的属性，为元素的数据配置跨域请求。允许的值有：

* anonymous

执行一个跨域的请求（比如，有 Origin: HTTP header）。但是没有发送证书（比如，没有 cookie，没有 X.509 证书，没有 HTTP 基本的授权认证）。

* use-credentials

一个有证书的跨域请求（比如，有 Origin: HTTP header）被发送 （比如，a cookie, a certificate, and HTTP Basic authentication is performed）。

没有指定 crossorigin，默认不使用该属性。若值是无效的值或空字符串，则会被处理成 anonymous。






# crossorigin 的兼容性
Desktop

|Feature      |Chrome|	Firefox (Gecko)|Internet Explorer|Opera        |Safari (WebKit)|
| :---------: |:----:| :--------------:|:---------------:| :----------:|:-------------:|
|Basic support|	13	 |	8.0 (8.0)      |	11			 |Not supported|	(Yes)      |
|&lt;video&gt;|	?	 |	12.0 (12.0)    |	?			 | ?           |	?          |


Mobile

|Feature      |Android|	Firefox Mobile (Gecko)|IE Mobile|Opera Mobile  |Safari Mobile  |
| :---------: |:----:| :--------------:|:---------------:| :----------:|:-------------:|
|Basic support|	?	 |	8.0 (8.0)      |	?			 |?			   |	(Yes)      |
|&lt;video&gt;|	?	 |	12.0 (12.0)    |	?			 | ?           |	?          |

所以即使设置了 crossorigin，有的浏览器还是不支持啊。。。






# 参考
* [CORS settings attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes)
* [Cryptic “Script Error.” reported in Javascript in Chrome and Firefox](http://stackoverflow.com/questions/5913978/cryptic-script-error-reported-in-javascript-in-chrome-and-firefox)
