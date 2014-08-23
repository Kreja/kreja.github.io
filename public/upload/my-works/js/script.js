$(function() {
    $('.post').hover(
    function() {
        $('.post').stop().animate({opacity:0.7},200, 'easeOutQuad');
		$(this).stop().animate({opacity:1.0},400, 'easeOutQuad');
		$(this).find('.post-hover').stop().delay(150).animate({opacity:0.7},300, 'easeOutQuad');
		$(this).find('.post-photo img').stop().animate({opacity:1.0},400, 'easeOutQuad');	
		$(this).parent().parent().find('.white-behind').stop().delay(600).fadeIn(800, 'easeInOutQuad');
		$(this).parent().parent().find('.background-blur').stop().delay(600).fadeIn(800, 'easeInOutQuad');
    }, function() {
		$(this).find('.post-hover').stop().animate({opacity:0},100, 'easeOutQuad');
        $('.post').stop().animate({opacity:1.0},400, 'easeOutQuad');
		$(this).find('.post-photo img').stop().animate({opacity:0.8},400, 'easeOutQuad');
		$(this).parent().parent().find('.background-blur').stop().fadeOut(400, 'easeOutQuad');
		$(this).parent().parent().find('.white-behind').fadeOut(400, 'easeInOutQuad');
    });
});



$(function() {
    $('.credits-link').click(function(){
		$('#credits').stop().animate({height: "130px"},800, 'easeInOutQuad');
		$('#logo').stop().animate({top: "274px"},800, 'easeInOutQuad');
		$('#heading h2').stop().animate({top: "365px"},800, 'easeInOutQuad');
		$('#heading .first-para').stop().animate({top: "412px"},800, 'easeInOutQuad');
		$('#heading .second-para').stop().animate({top: "547px"},800, 'easeInOutQuad');
		$('.close-credits-surround').stop().delay(800).animate({opacity:1.0},600, 'easeOutQuad');
	});
});

$(function() {
    $('.close-credits-surround a').click(function(){
		$('.close-credits-surround').stop().animate({opacity:0},600, 'easeOutQuad');
		$('#credits').stop().delay(600).animate({height: "0px"},800, 'easeInOutQuad');
		$('#logo').stop().delay(600).animate({top: "144px"},800, 'easeInOutQuad');
		$('#heading h2').stop().delay(600).animate({top: "235px"},800, 'easeInOutQuad');
		$('#heading .first-para').stop().delay(600).animate({top: "282px"},800, 'easeInOutQuad');
		$('#heading .second-para').stop().delay(600).animate({top: "417px"},800, 'easeInOutQuad');
	});
});




$(function() {
    $('.trick').click(function(){
		$('#white-over').stop().fadeIn(800, 'easeOutQuad');
		$("#single-home-container").delay(1000).fadeIn(1000, 'easeOutQuad');
	});
});


$(document).ready(function(){
	$.ajaxSetup({cache:false});
	$(".trick").click(function(){
		var post_link = $(this).attr("rel");
		$("#single-home-container").html("<span><p>Loading...</p></span");
		$("#single-home-container").load(post_link);
	return false;
	});
});

$(document).ajaxComplete(function()
	{
		$('.all').click(function(){
		$("#single-home-container").fadeOut(800, 'easeOutQuad');
		$('#white-over').fadeOut(800, 'easeOutQuad'); });
		
		
		$(document).mouseup(function (e)
		{
			var container = $(".post-content");
		
			if (!container.is(e.target) // if the target of the click isn't the container...
				&& container.has(e.target).length === 0) // ... nor a descendant of the container
			{
				$("#single-home-container").fadeOut(800, 'easeOutQuad');
				$("#white-over").fadeOut(800, 'easeOutQuad');
			}
		});
		
		$.ajaxSetup({cache:false});
		$(".trick").click(function(){
			var post_link = $(this).attr("rel");
			$("#single-home-container").html("<span><p>Loading...</p><span>");
			$("#single-home-container").load(post_link);
		return false;
		});
		
	});


var isMobile;

if( navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPod/i) ||
    navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/BlackBerry/)
){
  isMobile = true;
}


$(document).ready(function() {

  // Global vars
  var $bannerText = $('#bannerText');
  var $logo = $('#logo');
  var $headingheader = $('#headingheader');
  var $heading = $('#heading');
  var $firstPara = $('.first-para');
  var $secondPara = $('.second-para');
  var windowScroll;

  function slidingTitle() {
    windowScroll = $(this).scrollTop();

    $bannerText.css({
      'margin-top' : -(windowScroll/5)+"px",
      'opacity' : 1-(windowScroll/350)
    });
	
    $heading.css({
      'background-position' : 'center ' + (-windowScroll/10*19)+"px"
    });

  }
  if(!isMobile) {
    $(window).scroll(function() {
        slidingTitle();
		    });
  }

});