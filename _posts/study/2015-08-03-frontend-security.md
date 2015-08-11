---
layout: post
title: 前端安全
category: study
tags: 安全 
description: xss、csrf的攻击和防御
---

> Prevention > Repair

* XSS, Cross Site Scripting
* CSRF, Cross Site Request Forgery

# XSS

## XSS 攻击条件
* 页面有输入，别人就可以注入任意 html，script 到你的页面
	
	* 跳转攻击：`<span><%- username %></span>`，有人注册名为 `</span><script>window.location = ‘http://www.example.com'</script>` 后，就进不了这个页面啦，永远都是直接跳到 example.com 了
	* 查询参数攻击：`<a href="/show?user=<%= userId %>">...</a>`，输入是：`{ userId: "42&user=666” }`，所以服务器收到 https://example.com/show?user=42&user=666 ，那么 user 666 的用户信息可能被泄露了。解决：转义，不安全的字符转成 %xx 类型的 utf-8 字节，如 &转成%26。
	* js 变量攻击：

		```html
		<script>	
			var foo = <%- someJSON %>;
		</script>
		```
		攻击者把 someJSON 写成:

		```json
		{ someJSON: JSON.stringify("</script>< script>alert('boom');//") }
		```

		就成了

		```html
		<script>
			var foo = "</script>< script>alert('boom');//";
		</script>
		```

		解决：把 `<` 转义成 `\x3C`

## 三步防御 XSS
> 关键：把不安全的转成安全的

1. 验证输入
	* 注意：	**输入不要消毒（不要转义）**，这样会改变数据
	* 缺点：要输入的值是在确定范围内的，那么是可以验证的，但很多情况是无法验证的，如名字，因为名字是多种多样，所以无法验证一切。
2. 输出消毒（转义）
	* 也叫 filtering，normalizing,escaping
	* 缺点：消毒无法消清所有的情况
	* 注意：只转义 html 实体字符是不够的！html里出现的所有变量都需要转义，包括 css, js, url...
	
		```html
		<style>
			.info{
				background: <%= bgColor %>; /* 头部样式模板渲染 */
			}
		</style>		

		<div style="border: 1px solid <%= borderWidth %>"> <!-- 内联样式，模板渲染 -->
			<a href="/welcome/<%= uri %>">welcome <%= userName %></a> <!-- 链接，模板渲染 --><!-- html 变量，模板渲染 -->
		</div>

		< script>
			var config = <%= jsObj %>; // js 变量，模板渲染
		</script>
		```
	* 做法：
		1. 转成实体编码（html实体字符），最主要：`>,<,',",&`
			* 如：`<` 转成 `&tl;` 他们的表现形式是一样的，`&tl;` 是实体字符。
			* & 要先转义，不然 `<` 转成 `&lt;` 后又会变成 `&amp;lt;`
		2. 内联 css，头部的 css
		3. a 标签里的 href 里的变量，url 地址要转义：不安全的字符转移成 `%xx` 形式的 utf8 字节，如 `&` 转义成 `%26`
		4. js 变量攻击：js 字符串中的 `<` 要转成 `\x3C`，不然即使写在字符串中也会直接被认为是一个脚本。Q&A 有解释。
	* 工具：
		* [secure-filters](https://github.com/SalesforceEng/secure-filters/blob/d21f04190a63f1cc55078e4eb96adafe864c79cf/lib/secure-filters.js#L67)
		* 现在的模板引擎一般都有过滤功能，使用的时候要注意开启过滤功能。之前使用 ejs 模板渲染，`<%- %>`起到了转义（escaping）的作用

3. 内容安全策略
	* CSP, content-security-policy	
	* 怎么设置
		* 在服务端设置，作为 http 头
		* 在网页的 `<meta>` 里设置
		
			```html
			<meta http-equiv="Content-Security-Policy" content="default-src 'self' foo.com">
			```
	* [CSP header field](http://www.w3.org/TR/CSP2/#content-security-policy-header-field)
	* 作用：规定允许的特征、来源（白名单），如可执行脚本的名单
		* 之前页面被注入脚本，就可以通过 CSP 控制内联脚本不允许执行来防御攻击

			```html
			</span><script>window.location = ‘http://www.example.com'</script> // 要允许内联的脚本，得在 csp 中设置 'unsafe-inline'
			```
	* 注意：低级浏览器不支持，所以一般 CSP 是用来做警报的，用来收集黑名单。报警设置：[Content-Security-Policy-Report-Only](http://www.w3.org/TR/CSP2/#content-security-policy-report-only-header-field)，注意：`<meta>`不支持此字段设置。
	* 工具：搜 helmet；[cspbuilder](https://cspbuilder.info/static/#/main/)
	
![xss 防御三步曲](/public/upload/study/xss 防御三部曲.jpg)

# CSRF

## CSRF 攻击
你登上了 example.com，同时又上了 evil.com， evil.com 上有

```html
< script src="https://example.com/api/inviteAdmin?email=hacker@evil.com"></script>
```

发请求的时候会自动带上 example.com 下的 cookie，所以就从 evil.com 产生了 CSRF

## CSRF 防御
> 防止 csrf 关键：确保这个行为是用户发出的。

1. 验证意图
	* 要求用户进行验证，要确保这个验证是 csrf 攻击获取不到的，确保这个验证是服务端控制的。（验证码）
	* 非常敏感的操作，建议再次输入密码，尤其是长时间保存的 session
2. 使用 token
	* 在每个表单里，放入一个**唯一**的，**安全**的，**跟 login-cookie 绑定**的 token。
		* 做法：有 csrf 的中间件的！生成 token 之后，在表单里加一个隐藏域(input type=hidden)渲染 token，提交的时候再带上这个 token 就可以了！
	* 原理：使用 token ，使得意图只能发生在这个页面。
	* 工具：[generateSalt](http://www.senchalabs.org/connect/csrf.html#generateSalt)
3. 最好用 https。
4. 遵守 REST
	* 改变应用状态的应该是：POST/PUT/PATCH/DELETE，而不是 GET


# 发现
* token 的检验可以写成前置路由，拦截非法入侵
* onetimetoken，即使这次被拦截了，可是这次的请求已经发送了，下次的token又不一样了，所以这次的 token 被拦截知道了也没用


# 优化
* 在哪里进行防御处理？可以用最少的处理覆盖最多的面？
	* 听说是在服务器端处理
	* 我觉得是最早可以处理的时候就进行处理
	* 前后端得约定好，免得重复处理了


# 参考
* [Preventing XSS and CSRF](http://stash.github.io/empirejs-2014)

# Q&A
* 为什么下面的 `<` 写成 `\x3C`

	```html
	< script>document.write('< script src="a.js">\x3C/script>')</script>
	```

	* 因为 `</script>` 出现在 html 中时，不管它只是字符串还是真的脚本结尾符，html 都认为它是脚本结尾符，所以直接写 `</script>` 会是个隐患：上面的会被 html 理解成：
	
	```html
	< script>document.write('< script src="a.js"></script>
	')</script>
	```
	
	* 解决：如果是表示字符串，就写成
		1.  `<script>alert(1)\x3C/script>`
		2. `'<'+'/script>'`
		3. `<\/script>`

* js 字符串中的 `<` 转义成 `\x3C` 并不能防止从 `innerHTML` 进行攻击。

	```html
	< script>
	    var userName = "Jeremy\x3Cscript\x3Ealert('boom')\x3C/script\x3E";
	    document.write( "<span>"+userName+"</span>");
	</script>
	```

	虽然通过 innerHTML 插入的脚本不会执行（只插入，不执行）：

	```html
	< script>
	    var userName = "Jeremy\x3Cscript\x3Ealert('boom')\x3C/script\x3E";
	    document.getElementById('test').innerHTML = userName;
	</script>
	```

	但是通过 innerHTML 加入的事件是可以触发的，这样也可以进行攻击：

	```js
	var name = "\x3Cimg src=x onerror=alert(1)\x3E";
	document.getElementById('test').innerHTML = name;
	```
	但是先对 name 进行过滤，把 `<` 转义成 `&lt;` 就不会作为元素插入了，而只是字符串。

* 理一下`<`，`&lt;`，`\x3C`

	* `<`直接写在 html 中会被认为是标签符，所以要转成 `&lt;`，就会被当成字符串处理。
	* js 字符串中直接写`'</script>'`会被 html 当成脚本，所以要写成`\x3C`。js 执行后会把`\x3C`变成`<`。
	* `\x3C`只会在 js 字符串中会被翻译成 `<`， html 认不出`\x3C`，所以从 html 输入的变量，`\x3C`只是字符串`\x3C`，但是从js输出的变量，`\x3C`就会被翻译成`<`。例：

		```html
		<input type="text" id="in">
		< script>
				console.log('\x3Cimg src=x onerror=alert(1)\x3E',document.getElementById('in').value); 
		</script>
		```

		在 input 框中输入 \x3Cimg src=x onerror=alert(1)\x3E 后，console 的结果


		```
		<img src=x onerror=alert(1)> //从js输出的变量，`\x3C`就会被翻译成`<`
		\x3Cimg src=x onerror=alert(1)\x3E //从 html 输入的变量，`\x3C`只是字符串`\x3C`
```










