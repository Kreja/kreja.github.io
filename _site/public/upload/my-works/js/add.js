window.onload = function()
{
	var oWechat = document.getElementById("wechat");
	var oWechatImg = document.getElementById("wechat-img");
	
	oWechat.onmouseover = function()
	{
		oWechatImg.style.opacity = "1.0";
	}
	oWechat.onmouseout = function()
	{
		oWechatImg.style.opacity = "0.0";
	}
};