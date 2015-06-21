---
layout: post
title: 《编写可维护的 JavaScript》笔记
category: study
tags: 读书笔记
description: 读书笔记。《编写可维护的 JavaScript》，Nicholas C.Zakas 著。
---

[《编写可维护的 JavaScript》](http://book.douban.com/subject/21792530/)

# 1. 基本的格式化
 

一致的缩进。
建议不要省略分号。

### 换行
一行代码不要太长。
代码太长要换行：应该在运算符之后换行，如逗号之后。第二行应该加两个缩进。


```
if(example && example && example && example && ... &&
        example){
    doSth();
}
```

给变量赋值时换行：第二行应与赋值运算符对齐。

```
var a = example + example + ... + example + example + example + example +
        example;
```


### 添加空行
语义不相关的代码之间。
方法之间。
局部变量和第一条语句之间。
注释之前。

### 命名
变量名：名词做前缀。
函数名：动词做前缀。can, has, is, get, set...
常量：大写字母，下划线。MAX_COUNT
尽可能短，尽量表现出数据类型。
构造函数：名词。大驼峰，GreatPerson。

```
function Person(name){
    this.name = name;
}

Person.prototype.sayName = function(){
    alert(this.name);
}

var me = new Person("Jack"); //一看大驼峰就知道前面要有 new
```

### 字符串
换行：用`\`不好，应该用`+`连接。

```
var res = 'This is a \
example.'; //不好

var res = 'This is a ' +
          'example'; //好
```

### 数字
不要省略小数点前后的 0。
最好别用八进制。

### null
可以把 null 当做**对象占位符**。
应该使用 null 的情景：

* 初始化一个变量，该变量以后要赋值为对象。

```
var example = null; //example 以后要赋值为对象
```

* 和一个**已初始化**的变量（无所谓是不是对象）比较。

```
var example = obj;
if(example !== null){
}
```

* 函数的参数期望是对象，null 作为参数传入。
* 函数的返回值期望是对象，null 作为返回值传出。

```
if(...){
    return obj;
}else{
    return null;
}
```

不应该用 null：

* 不要用 null 检测是否传入了某参数(没传入参数就相当于未初始化的参数，相当于检测未初始化的参数)

* 不要用 null 检测一个**没初始化的变量**

```
var example;
if(example!=null){ //用 null 检测未初始化的变量，不好
    doSth();
}
```

### undefined
尽量不要用 undefined。

### 对象直接量，数组直接量
创建对象直接写对象直接量。不用 new 一个实例再添加属性。数组也是，直接方括号写内容。

```
var book = {
    title: 'red and black'
};
var colors = ['red','blue'];
```

# 2. 注释

注释前加空行。
若注释加在代码后面，要与代码之间有间隔。
多行的注释不要用 `//`，应该用多行注释`/**/`

### 文档注释
应注释：方法、参数、返回值；构造函数的自定义类型，参数；对象，这个对象包含文档注释的方法。

```
/**
@method merge
@param {Object} xxx
@return {Object} xxx
**/
```

# 3. 语句和表达式

### 花括号
块语句要用花括号。
左花括号 { 放一行末尾，不要放换行开始。

### for-in 循环
作用：遍历对象属性。不仅遍历对象的实例属性，还遍历从原型继承来的属性。
不要用来遍历数组。
最好用 hasOwnProperty() 过滤出实例属性。除非想查找原型链，应该注释。

```
for（var prop in obj）{
    if(obj.hasOwnProperty(prop)){
        ...
    }
}
```

# 4. 变量、函数、运算符

### 变量
建议在最开始定义变量。
建议合并 var 语句。

### 函数声明
建议函数内部的局部函数应紧接着变量声明后声明。
不要在语句块内声明函数。

### 匿名函数

```
// 不好，容易误以为是把函数赋值给变量
var value = function(){
    ...
}();

// 好，用圆括号把函数包起来
var value = (function(){
    ...
}());
```

### 严格模式
不建议在全局作用域使用 `"use strict"`。(以免合并文件时，不适用严格模式的也要以严格模式解析)
建议：

```
function do(){
    "use strict";
    ...
}
```

```
(function(){
    "use strict";
    function doSth(){
        ...
    }
    function doSthElse(){
        ...
    }
})();
```

### 相等
建议用 `===`,`!==`

### eval()
只在别无他法时用 eval();
setTimeout(),setInterval()不要传字符串，要传函数。

### 原始包装类型
尽量避免使用。
有 3 种原始包装类型：String、Number、Boolean.
每种类型都代表了全局作用域中的一个构造函数，并分别表示各自对应的原始值的对象。
作用：让原始值有对象般的行为。

```
/* 
* 虽然 name 是字符串，是原始类型，不是对象，但仍然可以使用 toUpperCase() 之类的方法。
* 因为在该条语句时，创建了 String 类型的新实例，执行完就销毁了。
*/
var name = "Jack";
name.age = 20; // 创建新实例，执行后就销毁
console.log(name.age); //undefined，创建新实例所以是 undefined
```





# 5 UI 层的松耦合

### 松耦合
松耦合：要修改一个组件时，不需要修改其他组件。
目标：不可能达到无耦合，只求一个组件不会经常影响别的部分。
怎么达到松耦合：组件要足够的瘦身。

### JavaScript 不要直接修改样式
所有样式信息都应写在 CSS 中，用 JavaScript 操作 className 来修改样式。 
特例：可以在 JavaScript 中用 style 属性修改样式的情况：给元素定位，在 CSS 中定义默认值，再在 JS 中用 style.top、style.left...定位。

### JavaScript 中不要写 HTML 
用到 innerHTML 时，不要直接写 HTML 的字符串。
解决：

1. 从服务器加载：把模板放在服务器，需要的时候异步加载。要小心 XSS 漏洞。适合大段 HTML 标签。

2. 客户端模板：把模板文本写在注释里。。或，写在自定义 type 的 `<script>` 里

3. 模板引擎（也是客户端模板）。

注意：转义操作很重要，安全性，防止破坏 HTML 标签。


# 6 避免使用全局变量

一定要用 var 声明变量。
注意：

* 不要与内置变量重名。（如 `window.name` 就是一个内置全局变量）

* 不要用这些变量命名：[见w3cschool](http://www.w3cschool.cc/js/js-reserved.html)

### 全局变量带来的问题

1. 命名易冲突

2. 代码脆弱。函数里若用到全局变量，就是深耦合于上下文环境。任何来自函数外部的数据应以参数形式传进来。

3. 难以测试。常需要重建全局环境。


### 只创建一个全局变量

```
var MaintainableJS = {};

// 其他信息都挂载到这个对象上
MaintainableJS.author = ...
```


### 命名空间
将功能按命名空间分组。

```
var YourGlobal = {};
YourGlobal.DOM.xx = ... // 与 DOM  操作相关的方法挂载在 YourGlobal.DOM 下 // 当然，要先保证 YourGlobal.DOM 是已存在的
```

保证命名空间已存在的方法：

```
var YourGlobal = {
    namespace: function(ns){
        var parts = ns.split("."),
            object = this, // YourGlobal
            i, len;

        for(i=0, len=parts.length; i<len; i++){
            if(!object[parts[i]]){
                object[parts[i]] = {}; 
            }
            object = object[parts[i]];
        }

        return object;
    }
};

// 在使用命名空间前，先声明
YourGlobal.namespace("Book.RedAndBlack"); //若还没有命名空间 Book.RedAndBlack，就会创建一个，所以再不用担心该命名空间不存在了
```


### 模块

* YUI模块模式

```
// 创建模块
YUI.add("module-name", function(Y){
    // 模块正文
}, "version", {requires: ["dependency1", "dependency2"]});

// 使用模块
YUI.use("module-name1", "module-name2", function(Y){
    ...
});
```

* 异步模块定义（AMD）

```
define("module-name", ["dependency1", "dependency2"], function(dependency1, dependency2){ //可以省略 module-name
    // 模块正文
});
```

可以匿名，因为模块加载器可以把 JS 文件名当模块名。

### 零全局变量
用于：完全独立的脚本
不适用于：不独立于其他脚本；代码在运行时需要扩展、修改
实现：用立即执行的函数调用，把脚本放置其中
注意：不要修改 window、doc，并用 var 定义变量

```
(function(win){
    var doc = win.document;
    ...
}(window));
```


# 7 事件处理

### 应用逻辑、事件处理不要写一起
因为应用逻辑可能会在多处用到，多个事件可能触发同一个应用逻辑。
不好，事件处理、应用逻辑混在了一起：

```
function handleClick(e){
    var popup = document.getElementById("popup");
    popup.style.left = e.clientX + "px";
    popup.style.top = e.clientY + "px";
    popup.className = "reveal";
}

addListener(ele, "click", handleClick);
```

好一点，但是 event 对象被无节制分发：

```
var App = {
    handleClick: function(e){
        this.showPopup(e);
    },

    showPopup: function(e){ // event 对象被分发了过来
        // 应用逻辑
        var popup = document.getElementById("popup");
        popup.style.left = e.clientX + "px";
        popup.style.top = e.clientY + "px";
        popup.className = "reveal"; 
    }
}

addListener(ele, "click", function(e){
    App.handleClick(e);
});
```

### 不要分发事件对象
应用逻辑不应依赖 event 对象来完成功能。
最佳：事件处理程序用 event 对象处理事件，然后拿到所有需要的数据传给应用逻辑。
处理事件时，事件处理程序应是唯一接触 event 对象的函数，事件处理程序在进入应用逻辑前应对 event 对象执行操作（阻止默认事件、阻止事件冒泡...）
好：

```
var App = {
    
    // 事件处理
    handleClick: function(e){
        e.preventDefault();
        e.stopPropagation();
        
        this.showPopup(e.clientX, e.clientY);
    },
    
    // 应用逻辑
    showPopup: function(x, y){
        var popup = document.getElementById("popup");
        popup.style.left = x + "px";
        popup.style.top = y + "px";
        popup.className = "reveal"; 
    }
}

addListener(ele, "click", function(e){
    App.handleClick(e);
});
```



# 8 避免空比较

### 检测原始值
用 typeof 测原始值的类型

### 检测引用值（对象）
Object、Array、Date、Error...
不要用 typeof， 结果都是 "object"
**应用 instanceof 检测类型**，不仅检测构造器，还检测原型链
引用类型 instanceof Object 都是 true

p92??

### 检测函数
函数是引用类型，但不用 instanceof 测类型，∵ `meFunc instanceof Function` 不能跨帧使用，因为每个帧都有自己的 Function 构造函数，所以 A 帧的函数到 B 帧再用 instaceof Function 就是 false 了。
**应该用 typeof 测函数类型。**∵ typeof myFunc 结果是 "function"，可以跨帧使用，除了以下**特例**：IE8及更早浏览器中，`typeof document.getElementId` 结果是 "object"，用 typeof 检测 DOM 节点的函数都是 "object"，此时可以改用：

```
if("querySelector" in document){ // 在 IE8 及更早的浏览器中检测 DOM 方法是否存在
    img = document.querySelector("img");
}
```

### 检测数组
instanceof Array 不一定正确，因为每个帧都有自己的 Array 构造函数，所以 A 帧的数组到 B 帧再用 instaceof Array 就是 false 了。
检测数组的方法：

* 鸭式辨型法

```
function isArray(value){
    return typeof value.sort === "function"; // 因为数组是唯一包含 sort() 方法的对象
}
```

* (识别内置对象，不要用于自定义对象)

```
function isArray(value){
    return Object.prototype.toString.call(value) == "[object Array]";
}
``` 

* Array.isArray()

### 检测属性
**检测属性是否存在应该用 in。**应该判断是否存在，而不是判断属性的值。
检测属性是否在对象中：

```
var obj = {
    count: 0
}
```

不好：

```
if(obj["count"]){
    // 0，不会执行这里的代码，是错的。属性值为假值时，就会出错。
}
```

好：

```
if("count" in obj){
    // 会执行这里的代码
}
```

**检测属性是否存在于实例对象中，用 hasOwnProperty()**，实例中有这个属性才会返回 true，只有原型有这个属性就返回 false。继承自 Object 的对象都有这个方法（除了 IE8 里的 document 对象）。







# 9 将配置数据从代码中分离出来



修改源代码有风险，关键数据要从源代码中抽出来！

### 配置数据

* URL

* 需要展现给用户的字符串

* 重复的值

* 设置（如每页的配置项）

* 任何可能发生变更的值



```
pagesize = 10; // 设置

function validate(ele, value){
    if(! value){
        addClass(ele, "invalid"); // 重复的值，要修改的话，要修改多处
        alert("Invalid value!"); // 需要展现给用户的字符串
        location.href = "error/invalid.html"; // URL
    }else{
        removeClass(ele, "invalid");
    }
}
```



### 抽离配置数据

把数据从 js 中拿掉，写到 config 中， config 还可以写成单独的文件。

```
var config = {
    MSG_INVALID_VALUE: "Invalid value",
    URL_INVALID: "error/invalid.html",
    CSS_INVALID: "invalid",
    PAGESIZE: 10
};

function validate(ele, value){
    if(! value){
        addClass(ele, config.CSS_INVALID); // 重复的值，要修改的话，要修改多处
        alert(config.MSG_INVALID_VALUE); // 需要展现给用户的字符串
        location.href = config.URL_INVALID; // URL
    }else{
        removeClass(ele, config.CSS_INVALID);
    }
}
```

### 保存配置数据

配置数据最好放在单独的文件中。

步骤：

1. 建议：用 Java 属性文件存放配置数据：

```
# 面向用户的消息
MSG_INVALID_VALUE = Invalid value
```

2. 再把这个文件转成 js 可用的文件，有三种格式可选：

    * JSON

    * JSONP    

    * var config = {MSG_INVALID_VALUE: "Invalid value"};

转换工具：http://github.com/nzakas/props2js

 





# 10 抛出自定义错误



### 在 js 中抛出错误

用 `throw`，将任何类型的数据作为错误抛出，常用 `Error` 对象。

```
throw new Error("error!"); // 错误信息作为参数，抛出后将显示在控制台
```

不好：

```
throw "error!";
```

如果不用 `try-catch` 语句捕获，抛出任何值都会引发错误。



### 抛错的好处
错误信息确切，有助于调试。
建议在错误消息中包含：函数名，失败的原因。



```
function getDivs(ele){
    return ele.getElementsByTagName("div");
}
```

改成：

```
function getDivs(ele){
    if(ele && ele.getElementsByTagName){
        return ele.getElementsByTagName("div");
    }else{
        throw new Error("getDivs(): Argument must be a DOM element.");
    }
}
```


### 何时抛出错误

不要写太多的错误检测，辨识代码中哪些部分最可能导致错误，并只在这些地方抛出错误。



```
function addClass(ele, className){
    if(!ele || typeof ele.className != "string"){ // 应保留，因为 ele 很有可能不是 DOM 元素，导致出错
        throw new Error("addClass(): Fisrt argument must be a DOM element.");
    }
    if(typeof className != "string"){ // 应去掉，因为不是 string 也不至于严重错误，何况会自动转换类型
        throw new Error("addClass(): second argument must be a string.");
    }

    element.className += " " + className;
}
```



知道函数会在哪些地方调用，不太需要错误检查；不确定函数会在哪被调用，很可能需要错误检查。
工具函数，类库 往往需要错误检查，因为它通用，在很多地方被调用。
何时抛出错误的经验法则：  

* 一旦修复一个很难调试的错误，尝试增加自定义错误，再次发生就容易解决了
* 正在编写代码时，我希望一些事不会发生，如果发生就悲剧了，那么对这些事抛出错误





### try-catch
可以增加一个 `finally` 块，不论有无错误都会执行 `finally` 中的代码。
如果 try 中有个 `return` 语句，也要等 `finally` 中的代码执行完才 `return`。



### 用 try-catch 还是 throw
错误只应该在应用程序栈最深的部分抛出，类库啊之类的，用 `throw`。
处理应用程序特定逻辑的代码应该有错误处理的能力，并捕获从底层组件抛出的错误，用 `try-catch`。


### 错误类型

有 7 种错误类型：


| 错误类型 | 什么时候抛出 |
| ------------- |-------------|
| Error | 所有错误的基本类型，不会抛出该类错误 |
| EvalError | eval() 执行错误时 |
| RangeError | 数字超出边界时 |
| ReferenceError | 期望的对象不存在时 |
| SyntaxError | 给 eval() 传递的代码中有语法错误时 |
| TypeError | 不是期望的变量类型 |
| URIError | 给 encodeURI() 等跟 URI 有关的函数传递格式非法的 URI 字符串时 |


通过检查特定的错误类型，可以更可靠地处理错误：

```
try{
    ...
}catch(ex){
    if(ex instanceof TypeError){
        // 处理类型错误
    }else if(ex instanceof ReferenceError){
        // 处理 对象不存在 的错误
    } else {
        // 其他处理
    }
}
```


要抛出自己定义的错误，又继承 Error 的优秀特性：

```
function MyError(msg){
    this.msg = msg;
}
MyError.prototype = new Error();
// 抛出自己定义的错误
throw new myError("This is my error.");
// 检测自己的错误
try{
    ...
}catch(ex){
    if(ex instanceof MyError){
        // 处理自己定义的错误
    }else{
        // 其他处理
    }
}
```








# 11 不是你的对象不要动

非自己拥有的对象，不要修改：

* 原生对象（Object、Array）
* DOM 对象
* BOM 对象
* 类库的对象



对于已存在的非自己拥有的对象：

* 不覆盖方法
* 不新增方法
* 不删除方法（不再使用某方法，应标为废弃，而不是删除）  



那怎么修改非自己拥有的对象？**解决方法：继承。**但也有问题：

* 不能从 DOM、BOM 对象继承
* 继承自 Array 不能正常工作





### 继承，从别人的对象基础上获得自己想要的对象



#### 1 基于对象的继承，也叫原型继承

```
var person = {
    name: "jack",
    sayName: function(){
        alert(this.name);
    }
};
var myPerson = Object.create(person); // myPerson 继承 person
myPerson.sayName(); // "jack", myPerson 可以访问 person 的属性、方法
myPerson.sayName = function(){
    alert("rose");
};
myPerson.sayName(); // "rose", 重新定义，自动切断对 person.sayName 的访问，person 不受影响
```



Object.create() 可指定第二个参数，将属性、方法添加到新对象中：

```
var myPerson = Object.create(person,{
    name: {
        value: "Amy"
    }
});
myPerson.sayName(); // "Amy", person 不受影响
```



#### 2 基于类型的继承
通过构造函数

```
function MyError(msg){
    this.msg = msg;
}
MyError.prototype = new Error(); // 每个 MyError 实例都继承 Error 的属性、方法
```



有构造函数的情况下，基于类型的继承是最合适的。
基于类型的继承一般要两步：原型继承；构造器继承。（原型继承方法，构造器继承属性，方法就是所有实例共用的，属性是每个实例自己的）

```
function Person(name){
    this.name = name;
}
function Author(name){
    // name 是继承自 Person 的
    Person.call(this, name); // 构造器继承：调用超类的构造函数时，传入新建的 Author 对象 this，作为调用 Person 构造器的那个 this 的值。所以是用 Person 构造器在这个 Author 对象上定义了一个 name 属性 
}
Author.prototype = new Person();
```


#### 3 门面模式（包装器）

继承无法满足要求时，应创建一个门面。
无法继承 DOM 对象，要给 DOM 对象新增方法，就要创建一个门面：

```
// 创建门面
function DOMWrapper(ele){
    this.ele = ele; // 把对象传过来保存起来
}
// 给保存起来的对象添加方法
DOMWrapper.prototype.addClass = function(className){
    this.ele.className += " " + className; 
};
// 用法
var wrapper = new DOMWrapper(document.getElementById("wrap"));
wrapper.addClass("active");
```


### 阻止别人修改你的对象

以下是保证对象不经过本人同意，别人不能修改的最佳方法。
一旦一个对象被锁定就无法解锁。
强烈建议使用严格模式：若锁定了对象，别人还想改，那么非严格模式会默默失败，严格模式会提示错误。


#### 1 防止扩展，`Object.preventExtension()`，`Object.isExtensible()`

禁止给对象添加属性、方法，但可以修改、删除已存在的属性、方法

```
var person = {
    name: "Jack"
};
Object.preventExtension(person);
console.log(Object.isExtensible(person)); // false
person.age = 25; // 不会成功
```


#### 2 密封，`Object.seal()`，`Object.isSealed()`

不仅防止扩展，还禁止删除已存在的属性、方法，但可以修改

```
Object.seal(person);
console.log(Object.isExtensible(person)); // false
console.log(Object.isSealed(person)); // true
delete person.name; // 不会成功
```


#### 3 冻结，`Object.freeze()`，`Object.isFrozen()`

所有字段均只读，不能扩展、不能删除、不能修改

```
Object. freeze(person);
console.log(Object.isExtensible(person)); // false
console.log(Object.isSealed(person)); // true
console.log(Object.isFrozen(person)); // true
person.name = "rose"; // 不会成功
```








# 12 浏览器嗅探

尽可能使用特性检测，实在不行再用用户代理检测，永远别用浏览器推断。



### 用户代理检测

`navigator.userAgent`

为兼容性，检测用户代理，应该检测低版本的，这样即使新版本的浏览器发布，旧版本的浏览器还是可以正常工作

```
if(isIe8OrEarlier){ // 检测低版本的，而不是检测高版本的浏览器。因为检测高版本的浏览器，以后出了新的高版本浏览器，这段代码就需要修改了
    // 处理 IE8 及更早版本
}else{
    // 处理其他浏览器
}
```




### 特性检测
步骤：

1. 探测标准的方法
2. 探测不同浏览器的特定方法
3. 当被探测的方法均不存在时，提供一个合乎逻辑的备用方法


官方的标准方法还没推出，但一些浏览器会加前缀先推出这些方法

```
function setAnimation(callback){
    if(window.requestAnimationFrame){ // 标准
        return requestAnimationFrame(callback);
    }else if(window.mozRequestAnimationFrame){ // firefox
        return requestAnimationFrame(callback);
    }else if(window.webkitRequestAnimationFrame){ // webkit
        return requestAnimationFrame(callback);
    }else if(window.oRequestAnimationFrame){ // opera
        return requestAnimationFrame(callback);
    }else if(window.msRequestAnimationFrame){ // ie
        return requestAnimationFrame(callback);
    }else{
        return setTimeout(callback,0);
    }
}
```




### 避免特性推断
不要通过判断一个特性是否存在，来判断另一个特性是否存在

```
if(document.getElementsByTagName){

    document.getElementById(..) // 认为 document.getElementsByTagName 存在，那么 getElmentById 也存在，不对

}
```





### 避免浏览器推断

不要通过判断某个方法是否存在，来判断该浏览器是什么浏览器

不好：

```
if(document.all){
    // 认为是 IE 浏览器，就开始使用 IE 特有的一些方法
    // 但是 document.all 的存在并不能说明这是 IE 浏览器
}
```









# 13 文件和目录结构

### 最佳实践

* 一个文件只包含一个对象 &emsp; 减少多人开发的冲突
* 相关文件用目录分组 &emsp; 相关联的对象放在一个目录下
* 保持第三方代码独立 &emsp; 最好直接从 CDN 加载第三方代码
* 确定创建位置 &emsp; 编译后的一个目录，源码一个目录，不要混在一起
* 保持测试代码的完整性



目录结构基本上由服务端使用的框架决定。



### 基本结构

流行的做法：有三个目录：

* build 构建后的文件
* src 源文件
* test 测试

例：

```
- csslint
 + .git
 + .build // 不提交，因为编译就可以生成
 + demos
 + lib
 + npm
 + release // 包含最新的稳定发行版本
 + src
 + tests
```

YUI3 src 下每个子目录代表一个模块，每个模块有 4 个子目录：

* docs 文档
* js 源文件
* meta 模块元信息
* tests 测试代码

# 14 js 构建工具 Ant
介绍 Ant， 略

# 15 校验
主要讲怎么把 JSHint 整合到构建系统来分析并验证 js 代码。

构建系统：类似 grunt



就是说怎么用 ant，这章也可以略了。


# 16 文件合并和加工
合并文件要注意行尾结束符

建议把构建时间插入到文件中，便于追踪错误。



### 加工文件（部署之前对文件的最后修改）

如：

插入构建时间

自动引入许可信息（许可信息可以加载代码文件顶部）

插入版本信息


# 17 文件精简和压缩
构建——》验证——》合并——》加工——》精简——》压缩
精简与压缩的区别:

* 精简是去空格、去注释
* 压缩是用特定压缩方法
* 压缩后的文件不可读，浏览器在响应头信息中接收到 Content-Encoding: gzip 后会自动解压文件

### 文件精简
有中文的 js 文件，仅压缩是不够的，还要 Unicode 转码，保证不会 bug
压缩工具：

* YUI Compressor
* Closure Complier
* UglifyJS

### 压缩
压缩类型：

* gzip
* deflate

#### 运行时压缩
浏览器与服务端关于压缩的交涉过程：

1. 浏览器支持 HTTP 压缩，请求时会发送一个 HTTP 头指明压缩类型，如 Accept-Encoding: gzip, deflate
2. 服务端发发现头信息后就知道浏览器可以解压什么类型，服务端发送响应时也会指明压缩类型，如: Content-Encoding: gzip
3. 浏览器就知道要用 gzip 解压了。

Apache2、Nginx 都是默认压缩，所以我们不用对 js 文件做压缩。
注意：

* 有些老的浏览器不会解压。。就要留个神了。
* 一定要给服务器做配置发送头信息告知浏览器压缩类型啊

#### 构建时压缩
就是自己写完代码就压缩，而不是让服务器来压缩。


# 18 文档化
文档生成工具，自动从代码生成文档。

* JSDoc Toolkit
* YUI Doc

# 19 自动化测试

* YUI Test Selenium 引擎
浏览器测试
Selenium：能启动浏览器并执行命令的服务器，用于测试。

* Yeti
用 js 写测试并在 Node.js 上运行

* PhantomJS
是一个命令行版的 Webkit

* JsTestDriver


# 20 组装到一起
把之前的步骤组装成一个完整的解决方案。

常见构建类型：

* 开发
构建过程不应超过 15 秒。
开发版本一般只做两件事：验证代码，连接文件。

* 集成 ？？
按固定的时间表自动构建的版本。
集成版本负责寻找整个系统中的问题，构建时间稍长，必须尽可能的详尽。
尽可能多的包含校验、测试。
* 发布
部署之前构建。
加工文件，插入版权、版本号、其他元信息。

### CI 系统
* Jenkins
* BuildBot
* Cruise Control
* Gradle
