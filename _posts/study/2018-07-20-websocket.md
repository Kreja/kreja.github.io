---
layout: post
title: WebSocket
category: study
tags: js
description: 记录对 WebSocket 的学习
---



# 什么是 websocket

websocket: 

- 服务器可以主动向客户端推送信息，客户端也可以主动向服务器发送信息。

- 是一种服务端推送技术。

- HTML5 开始提供的一种在单个 TCP 连接上进行全双工通讯的协议。(全双工即双方可同时向对方发送消息) 最根本目的就是解决双向通信

- 是应用层协议。



websocket 借鉴了 socket，不同在于：

- socket: 只要两端建立连接就可以发送数据，不需要第三方转发。

- websocket: 客户端与服务端连接，客户端之间需要服务端转发或广播消息。



# ws 适用场景

- 高并发

- 高交互（因为只要一次连接，节省）

- 实时（因为全双工）



# ws 特点

1. 建立在 TCP 协议之上，服务器端的实现比较容易。

2. 与 HTTP 协议有着良好的兼容性。默认端口也是80（非加密）和443（加密）（可以给URL带上自定义端口来覆盖默认配置。），并且握手阶段采用 HTTP 协议，因此握手时不容易屏蔽，能通过各种 HTTP 代理服务器。

3. 数据格式比较轻量，性能开销小，通信高效。高性能、低延迟。

4. 可以发送文本，也可以发送二进制数据。

5. **没有同源限制**，客户端可以与任意服务器通信。

6. 协议标识符是ws（如果加密，则为wss），服务器网址就是 URL。eg. `ws://example.com:80/some/path`

<img src="/public/upload/study/2018-07-20-websocket1.png" width="200" />

客户端可以和任意域名建立WebSocket连接，只有服务器才会决定哪些客户端可以和它建立连接，常用做法是将允许连接的域名做成白名单。

WebSocket 不一定要用在 HTML 或浏览器中，支持协议就可以。



# 客户端 Api



## 数据格式

websocket 支持传输文本、二进制数据

**发送和接收的消息只支持字符串格式**



## 属性

### 实例对象的当前状态： 

```
ws.readyState
```


```
CONNECTING：值为0，表示正在连接。

OPEN：值为1，表示连接成功，可以通信了。

CLOSING：值为2，表示连接正在关闭。

CLOSED：值为3，表示连接已经关闭，或者打开连接失败。
```

### 判断发送是否结束，还有多少二进制数据没发完

```
ws.bufferedAmount

```



## 方法



### 客户端连接服务器

 `var ws = new WebSocket('ws://localhost:8080');`

### 客户端关闭

 `ws.close();`



## 事件

### 连接成功后回调

```
// 单个回调
ws.onopen = function () {
  ws.send('Hello Server!');
}

// 多个回调
ws.addEventListener('open', function (event) {
  ws.send('Hello Server!');
});

```

### 连接关闭后的回调函数

```

ws.onclose = function(event) {
  var code = event.code;
  var reason = event.reason;
  var wasClean = event.wasClean;
  // handle close event
};

ws.addEventListener("close", function(event) {
  var code = event.code;
  var reason = event.reason;
  var wasClean = event.wasClean;
  // handle close event
});
```

### 收到服务器数据后的回调函数

```
ws.onmessage = function(event) {
  var data = event.data;
  // 处理数据，服务器数据可能是文本，也可能是二进制数据（blob对象或Arraybuffer对象）❤️

  if(typeof event.data === String) {
    console.log("Received data string");
  }

  if(event.data instanceof ArrayBuffer){
    var buffer = event.data;
    console.log("Received arraybuffer");
  }
};

ws.addEventListener("message", function(event) {
  var data = event.data;
  // 处理数据
});
```

可以使用binaryType属性，显式指定收到的二进制数据类型：

```
ws.binaryType = "blob";
ws.binaryType = "arraybuffer";
```

### 向服务器发送数据

```
// 发送文本
ws.send('your message');

// 发送 Blob 对象
var file = document
  .querySelector('input[type="file"]')
  .files[0];
ws.send(file);

// 发送 ArrayBuffer 对象
var img = canvas_context.getImageData(0, 0, 400, 320);
var binary = new Uint8Array(img.data.length);
for (var i = 0; i < img.data.length; i++) {
  binary[i] = img.data[i];
}

ws.send(binary.buffer);
```

### 报错回调

```
socket.onerror = function(event) {
  // handle error event
};

socket.addEventListener("error", function(event) {
  // handle error event
});

```

# 常见问题，注意事项

使用 websocket 失败，尝试：

- 使用安全的WebSocket连接（wss）。代理软件不会对加密的连接胡乱篡改，此外你所发送的数据都是加密后的，不容易被他人窃取。
- 在WebSocket服务器前面使用TCP负载均衡器，而不要使用HTTP负载均衡器，除非某个HTTP负载均衡器大肆宣扬自己支持WebSocket。
- 不要假设浏览器支持WebSocket，虽然浏览器支持WebSocket只是时间问题。诚然，如果连接无法快速建立，则迅速优雅降级使用Comet和轮询的方式来处理。


# ws 原理

WS协议有两部分组成：握手和数据传输。

握手建立连接阶段：

client 发一个 get 请求带 Sec-WebSocket-Key，服务端加密返回 Sec-WebSocket-Accept，客户端 upgrade 到 websocket 协议

<img src="/public/upload/study/2018-07-20-websocket2.png" width="400" />

握手和数据传输示意图：

<img src="/public/upload/study/2018-07-20-websocket3.jpeg" width="400" />


## 客户端发送握手之前要做的事

客户端首先要先建立连接，一个客户端对于一个相同的目标地址（通常是域名或者IP地址，不是资源地址）同一时刻只能有一个处于CONNECTING状态（正在建立连接）的连接。

从建立连接到发送握手消息的过程：

1、 客户端检查输入的 Uri 是否合法。

2、 客户端判断，如果当前已有指向此目标地址的连接处于 CONNECTING，要等这个连接成功，或失败后才能继续建立新连接：

  - PS：如果当前连接处于代理网络环境，无法判断 IP 地址是否相同，则认为每一个Host地址为一个单独的目标地址，同时客户端应当限制同时处于 CONNECTING 状态的连接数；
  - PPS：这样可以防止一部分的 DDOS 攻击；
  - PPPS：客户端并不限制同时「已成功」状态的连接数，但是服务器或许会限制。

3、 如果客户端处于一个代理环境，它先要请求它的代理建立一个到达目标地址的 TCP 连接：

例如，如果客户端处于代理环境，它想要连接某目标地址的 80 端口，它可能要收现发送以下消息：

```
       CONNECT example.com:80 HTTP/1.1
       Host: example.com
```

如果客户端没有处于代理环境，它要先建立一个到达目标地址的直接的 TCP 连接。

如果上一步的 TCP 连接失败，则此 WebSocket 连接失败。如果协议是 wss，则在上一步建立的TCP连接之上，使用 TSL 发送握手信息。如果失败，则此 WebSocket 连接失败；如果成功，则以后的所有数据都要通过此 TSL 通道进行发送。



## 发送数据

WebSocket 中所有发送的数据使用帧的形式发送。

客户端发送的数据帧都要经过掩码处理，服务端发送的所有数据帧都不能经过掩码处理。否则对方需要发送关闭帧。

一个帧包含一个帧类型的标识码，一个负载长度，和负载。负载包括扩展内容和应用内容。



## 帧类型

帧类型是由一个4位长的叫Opcode的值表示，任何WebSocket的通信方收到一个位置的帧类型，都要以连接失败的方式断开此连接。

帧类型：

- Opcode == 0 继续：

表示此帧是一个继续帧，需要拼接在上一个收到的帧之后，来组成一个完整的消息。由于这种解析特性，非控制帧的发送和接收必须是相同的顺序。

- Opcode == 1 文本帧。

- Opcode == 2 二进制帧。

- Opcode == 3 - 7 未来使用（非控制帧）。

- Opcode == 8 关闭连接（控制帧）：

此帧可能会包含内容，以表示关闭连接的原因。通信的某一方发送此帧来关闭WebSocket连接，收到此帧的一方如果之前没有发送此帧，则需要发送一个同样的关闭帧以确认关闭。如果双方同时发送此帧，则双方都需要发送回应的关闭帧。理想情况服务端在确认WebSocket连接关闭后，关闭相应的TCP连接，而客户端需要等待服务端关闭此TCP连接，但客户端在某些情况下也可以关闭TCP连接。

- Opcode == 9 Ping：

类似于心跳，一方收到Ping，应当立即发送Pong作为响应。

- Opcode == 10 Pong：

如果通信一方并没有发送Ping，但是收到了Pong，并不要求它返回任何信息。Pong帧的内容应当和收到的Ping相同。可能会出现一方收到很多的Ping，但是只需要响应最近的那一次就可以了。

- Opcode == 11 - 15 未来使用（控制帧）。



# ws vs http

websocket 握手需要借助于http协议，所以 websocket 也离不开 http。

HTTP 协议缺陷：通信只能由客户端发起。（one-way, request/response, stateless, half-duplex protocol）

http 服务端推送解决：轮询。高延迟，效率低，浪费资源。


- 相同点

    - 都是基于 TCP 的应用层协议；

    - 都使用 Request/Response 模型进行连接的建立；

    - 在连接的建立过程中对错误的处理方式相同，在这个阶段WS可能返回和HTTP相同的返回码；

    - 都可以在网络中传输数据。



- 不同点

    - WS 使用HTTP来建立连接，但是定义了一系列新的 header 域，这些域在 HTTP 中并不会使用；

    - WS 的连接不能通过中间人来转发，它必须是一个直接连接；

    - WS 连接建立后，通信双方可在任何时刻向另一方发送数据；

    - WS 连接建立后，数据的传输使用帧来传递，不再需要Request消息；

    - WS 的数据帧有序。

<img src="/public/upload/study/2018-07-20-websocket4.png" width="300" />


# WebSocket 与 TCP

HTTP、WebSocket 等应用层协议，都是基于 TCP 协议来传输数据的，可以把这些高级协议理解成对 TCP 的封装。

既然大家都用 TCP 协议，那么连接和断开，都要遵循 TCP 协议中的三次握手和四次握手 ，只是在连接之后发送的内容不同，或者是断开的时间不同。



# 参考

- [WebSocket详解（一）：初步认识WebSocket技术](http://www.52im.net/thread-331-1-1.html)

- [WebSocket详解（二）：技术原理、代码演示和应用案例](http://www.52im.net/thread-326-1-1.html)

- [WebSocket详解（三）：深入WebSocket通信协议细节](http://www.52im.net/thread-332-1-1.html)

- [WebSocket详解（五）：刨根问底HTTP与WebSocket的关系(下篇)](http://www.52im.net/thread-1266-1-1.html)

- [WebSocket详解（六）：刨根问底WebSocket与Socket的关系](http://www.52im.net/thread-1273-1-1.html)

# 资料

- [服务端推送技术](https://en.wikipedia.org/wiki/Push_technology)

- [在线测试](https://www.websocket.org/echo.html)


前端库：

- [web-socket-js](https://github.com/gimite/web-socket-js) 前端使用，api 和 html5 规范完全一样，可以自动降级到 flash

nodejs 库：

- [Socket.IO](http://socket.io)
    - 提供了 nodejs 库和前端库，并且支持自动降级（多个级别的降级，会选择最佳的传输方式），保证兼容大多数浏览器。
- [SockJS](https://github.com/sockjs)
- [node-Websocket-server](http://github.com/miksago/node-websocket-server)

服务端实现

- [µWebSockets](https://github.com/uNetworking/uWebSockets)

- [Socket.IO](https://socket.io/)

- [WebSocket-Node](https://github.com/theturtle32/WebSocket-Node)

