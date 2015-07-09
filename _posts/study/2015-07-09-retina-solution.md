​## 基本知识
---
* 设备像素（物理像素）
	* 显示器最小的物理显示单元。每个像素有自己的颜色、亮度。

* 屏幕密度（PPI）
	* 每英寸有多少像素（PPI）。当一个显示屏像素密度超过300ppi时，人眼就无法区分出单独的像素。PPI高于210（笔记本电脑）、260（平板电脑）、300（手机）的屏幕都称为Retina屏幕。

* css 像素（设备独立像素，dips）
	* CSS 像素主要使用在浏览器上，就是写 css 时使用的像素px。CSS 像素在所有屏幕上是一样的，与设备无关。

* 设备像素比 window.devicePixelRatio(dpr) 
	* window.devicePixelRatio = 物理像素/设备独立像素（dips）
	* 非视网膜的 dpr = 1，css 1px 对应一个物理像素，如：非视网膜屏幕的手机，dpr=320/320=1
	* 视网膜的 dpr = 2，css 1px 对应两个物理像素，如：视网膜屏幕的手机，dpr=640/320=2。1个css像素对应2*2=4个物理像素
	* 获取设备像素比 dpr：
		* js: window.devicePixelRatio
		* css: -webkit-device-pixel-ratio，-webkit-min-device-pixel-ratio，-webkit-max-device-pixel-ratio,对不同 dpr 的设备做样式适配

## 图片显示问题
---
物理像素=图片像素，才会清晰。
问题：非 retina 屏幕，用 200*400 的图片去填 100*200 的<img>，会因为下采样而导致色差，不够锐利，而且浪费像素。retina屏幕，用 100*200 的图片去填 100*200 的<img>，一个图片像素要分布到四个物理像素上，会导致模糊。
解决：不同dpr下，加载不同尺寸的图片。使用 url 后缀实现。非 retina：用css像素大小的图片，retina：图片大小为物理像素大小（ css 像素大小*dpr），所以视觉稿画布得是屏幕宽的两倍哦！

* 在Retina屏幕下实现图像显示的方法：
    * img 标签方法
    * javascript和方法
    * Media Queries 方法

问题：有张 400*600 的图，注意：假设视网膜屏幕需要图片宽度 400，则正常屏幕只需要 200。视网膜屏幕上看上去 200 宽的图，其实有 400 个像素宽。下面三个方法对于正常屏幕，图片有一半像素是浪费了。
解决：
* html
浪费像素了。
	* `<img src="example@2x.png" width="200" height="300" />`

* css media queries
只有对应的目标元素才会下载图片资源。但仅背景图。

```
    	.icon {
                background-image: url(example.png);
                background-size: 200px 300px;
                height: 300px;
                width: 200px;
    	}
    
    	@media only screen and (-Webkit-min-device-pixel-ratio: 1.5),
    	only screen and (-moz-min-device-pixel-ratio: 1.5),
    	only screen and (-o-min-device-pixel-ratio: 3/2),
    	only screen and (min-device-pixel-ratio: 1.5) {
    	      .icon {
    	          background-image: url(example@2x.png);
    	      }
    	}
```

* js
	* 先判断 window.devicePixelRatio，然后看情况是否给图片宽度减半

* 使用svg
	* 可任意伸缩
	* 但是不适合复杂图形

## image-set
* image-set 是 CSS4 中对background-image属性定义的一种新方法
* 原理：Webkit内核"safari6"和“chrome21”支持CSS4的background-image新规范草案image-set。通过Webkit内核的浏览器私有属性“-webkit”，image-set为Web前端人员提供了一种解决高分辨率图像的显示，用来解决苹果公司提出的Retian屏幕显示图片的技术问题。简而言之：这个属性用来支持Web前端人员解决不同分辨率下图片的显示，特别的（Retina屏幕）。
* 缺点： 仅支持background-image属性，而不能使用在 `<img>` 标签中。
```
#test {
    background-image: url(assets/no-image-set.png); 
    background-image: -webkit-image-set(url(test.png) 1x,url(test-hires.png) 2x);
    background-image: -moz-image-set(url(test.png) 1x,url(test-hires.png) 2x);
    background-image: -o-image-set(url(test.png) 1x,url(test-hires.png) 2x);
    background-image: image-set(url(test.png) 1x,url(test-hires.png) 2x);
}
```

## 边框问题
---

> 设计师要求的 1px 是一个物理像素。

retina 下，物理像素要 1px，那 css 像素就得是 0.5px，不然看上去会粗。
问题：有些浏览器不认识 0.5 px。
解决：
### 方法1 —— scale
不能实现圆角。
实现四条边：容器自己 after,before，父元素 after,before。

```
.scale{    
    position: relative; 
} 
.scale:after{    
    content:"";    
    position: absolute;    
    bottom:0px;    
    left:0px;    
    right:0px;    
    border-bottom:1px solid #ddd;    
    -webkit-transform:scaleY(.5);    
    -webkit-transform-origin:0 0; 
}
```

### 方法2 —— viewport 进行 scale
比较全面

```
var scale = 1/window.devicePixelRatio; 
<meta name="viewport" content="initial-scale=scale,maximum-scale=scale,minimum-scale=scale,user-scalable=no">
```

如：iphone5 下（不同屏幕是不同值哦），加入：

```
<meta name="viewport" content="width=640,initial-scale=0.5,maximum-scale=0.5, minimum-scale=0.5,user-scalable=no">
```

页面中的 border 都会缩小 0.5 倍。
问题：字体大小、页面布局也会被缩放。

> 要求： 任何手机屏幕上字体大小都要统一。

解决：
因为视觉稿画布本来就是 2 倍高宽，再 scale 0.5 就是正确的 1 了，所以视觉稿直接量即可，不用再除以 2.
对于字体，scale 了 dpr 倍要乘回来，视觉稿是两倍要除掉，所以是量得的font-size*dpr/2：

```
font-size: 16px;
[data-dpr="2"] input {
  font-size: 32px;
}
```

具体做法：
写个 mixin：

```
.px2px(@name, @px){
    @{name}: round(@px / 2) * 1px; // dpr 是 1 的时候，缩为 0.5 倍
    [data-dpr="2"] & {
        @{name}: @px * 1px; // 就是 (font-size*dpr/2)px
    }
    // for mx3
    [data-dpr="2.5"] & {
        @{name}: round(@px * 2.5 / 2) * 1px;
    }
    // for 小米note
    [data-dpr="2.75"] & {
        @{name}: round(@px * 2.75 / 2) * 1px;
    }
    [data-dpr="3"] & {
        @{name}: round(@px / 2 * 3) * 1px
    }
    // for 三星note4
    [data-dpr="4"] & {
        @{name}: @px * 2px;
    }
}
```

使用：
```
.px2px(font-size, 32);
```

### 方法3—— box-shadow
圆角、多条线都可以实现。但颜色不好调。
```
-webkit-box-shadow:0 1px 1px -1px rgba(0, 0, 0, 0.5);
```

## 多屏适配布局
---
rem 方案：根据手机的屏幕尺寸、dpr动态地改变 html 的 font-size 大小（基准值）
宽度分成 100a，1 rem = 10a，所以基准值 1rem = 宽度上的物理像素 / 10

```
基准值 = document.documentElement.clientWidth * dpr / 10，即：宽度上的物理像素/10
如 iphone5: 320px * 2 / 10 = 64px，这是 iphone5 的基准值。
```

### css 改变 html 的 font-size（基准值）
不精确，但够用
```
html{font-size: 32px;}
//iphone 6 
@media (min-device-width : 375px) {
   html{font-size: 64px;}
}
// iphone6 plus 
@media (min-device-width : 414px) {
    html{font-size: 75px;}
}
```

### js 改变 html 的 font-size
棒，解决了 border: 1px 问题、图片高清问题、屏幕适配布局问题

```
var dpr, rem, scale;
var docEl = document.documentElement;
var fontEl = document.createElement('style');
var metaEl = document.querySelector('meta[name="viewport"]');

scale = 1 / dpr;
dpr = win.devicePixelRatio || 1;
rem = docEl.clientWidth * dpr / 10;

// 设置viewport，进行缩放，达到高清效果
metaEl.setAttribute('content', 'width=' + dpr * docEl.clientWidth + ',initial-scale=' + scale + ',maximum-scale=' + scale + ', minimum-scale=' + scale + ',user-scalable=no');

// 设置data-dpr属性，留作的css hack之用
docEl.setAttribute('data-dpr', dpr);

// 动态写入样式
docEl.firstElementChild.appendChild(fontEl);
fontEl.innerHTML = 'html{font-size:' + rem + 'px!important;}';

// 给js调用的，某一dpr下rem和px之间的转换函数
window.rem2px = function(v) {
    v = parseFloat(v);
    return v * rem;
};
window.px2rem: function(v) {
    v = parseFloat(v);
    return v / rem;
};

window.dpr = dpr;
window.rem = rem;
```
### px 转成 rem 单位
有一张 iphone6 视觉稿 750 * 1334px：
rem = px / 基准值 = 10 * px/document.documentElement.clientWidth * dpr。
确定基准值后，写一个 mixin，之后就用这个 mixin 来转换 px 到 rem:

```
// 例如: .px2rem(height, 80);
.px2rem(@name, @px){
    @{name}: @px / 75 * 1rem;
}
```

注意：字体不能用 rem，要用 px，因为要求不同手机屏幕上字体大小相同。
页面 scale 了0.5, 高宽 750*300px 的 div 就写成（量了尺寸不用再除以 2 了，好棒）：

```
.px2rem(width, 750);
.px2rem(height, 300);
```

页面没有 scale 0.5，就写成(之前的项目就是这样，量了尺寸再除以2。。)：

```
.px2rem(width, 375);
.px2rem(height, 150);
```

## 工具
---
* retina.js

## 如何让网站适应 retina 屏幕
---
Retina web

## 参考
---
1. [image-set实现Retina屏幕下图片显示](http://www.w3cplus.com/css/safari-6-and-chrome-21-add-image-set-to-support-retina-images.html)
2. [走向视网膜（Retina）的Web时代](http://www.w3cplus.com/css/towards-retina-web.html)
3. [Retina Display Media Query](https://css-tricks.com/snippets/css/retina-display-media-query/)
4. [移动端高清、多屏适配方案](http://www.atatech.org/articles/36642)
5. [mobile web retina下1px解决方案升级版](http://www.atatech.org/articles/26335?rnd=1893640720#1)