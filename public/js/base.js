
function handleCategory(){
    // 如果url带#，直接显示相应分类的posts
    var categoryId = window.location.hash.substring(1);
    if(categoryId){
        showCategory(categoryId);
    }

    // 点击显示相应分类的 posts
    $(".category-link").on("click", function(e){
        var categoryId = $(this)[0].hash.substring(1);
        showCategory(categoryId);
    });
}

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
    if(mq.matches){ //手机，sidebar 默认关闭
        $("#close-btn").attr("checked",true);
        $("#close-btn-right").attr("checked",true);
    }else{
        $("#close-btn").attr("checked",false);
    }  
}

/**
 * 显示评论
 */
function showComments(){
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
}

/**
 * 给文章加章节目录
 * @return {[type]} [description]
 */
function addPostCatalog(){
    var $ui = {
        catalogArea: $('.catalog-list'),
        postTitle: $('.post-title'),
        postArticle: $('.post-article')
    };

    $('<a href="#post-title" title="' + $ui.postTitle.text() + '">' + $ui.postTitle.text() + '</a>').insertBefore('.catalog-list'); // 目录前插入post标题

    // 生成目录
    $ui.postArticle.children('h1,h2,h3').each(function() {
        var classTitle = "";

        switch($(this).prop("tagName")){
            case 'H1':
                classTitle = "h1";
                break; 
            case 'H2':
                classTitle = "h2";
                break; 
            case 'H3':
                classTitle = "h3";
                break; 
            case 'H4':
                classTitle = "h4";
                break; 
            case 'H5':
                classTitle = "h5";
                break; 
            default:;
        }

        $ui.catalogArea.append('<li>'
          + '<a href="#' + $(this).attr('id') + '" class="' + classTitle + '" title="' + $(this).text() + '">' + $(this).text() + '</a>'
        + '</li>');
    });
}

/**
 * 滚动到顶部、底部
 */
function scrollTopAndBot() {
    $('.scroll .top').click(function() {
        $('html, body').animate({scrollTop:0}, 'fast');
        return false;
    });

    $('.scroll .bot').click(function() {
        $('html, body').animate({scrollTop:$(document).height()}, 'slow');
        return false;
    });
}

$(document).ready(function() {
    // 如果是手机
    if(window.matchMedia){
        var mq = window.matchMedia("(max-width: 600px)"); 
        mq.addListener(WidthChange);   
        WidthChange(mq); 
    }   
    
    handleCategory();
    showComments();
    addPostCatalog();
    scrollTopAndBot();
});