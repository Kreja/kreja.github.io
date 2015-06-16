/**
 * index页，控制post列表显示
 * 默认全部post
 * 点击分类，只显示该分类下的 post
 * @param  {[type]} id [要显示的分类 id，不带 #]
 */
function showCategory(id){
    // 隐藏其他的，把所有 active 去掉
    $(".active").removeClass("active");
    
    $("#"+id).addClass("active");
}

/**
 * 响应屏幕宽度变化
 * @param {[type]} mq [description]
 */
function WidthChange(mq){
    if(mq.matches){
        $("#close-btn").attr("checked",true);
    }else{
        $("#close-btn").attr("checked",false);
    }  
}

$(document).ready(function() {
    // 如果url带#，直接显示相应分类的posts
    var categoryId = window.location.hash.substring(1);
    if(categoryId){
        showCategory(categoryId);
    }

    // 如果是手机，sidebar 默认关闭
    if(window.matchMedia){
        var mq = window.matchMedia("(max-width: 600px)"); 
        mq.addListener(WidthChange);   
        WidthChange(mq); 
    }   

    // 点击显示相应分类的 posts
    $(".category-link").on("click", function(e){
        var categoryId = $(this)[0].hash.substring(1);
        showCategory(categoryId);
        // return false;
    });

    // show comments
    $('body').on('click', '.show-commend', function() {
        var disqus_shortname = $('.show-commend').attr('name');
        $.ajax({
          type: "GET",
          url: "http://" + disqus_shortname + ".disqus.com/embed.js",
          dataType: "script",
          cache: true
        });
    });
});