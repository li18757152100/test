// 首页banner
;$(function() {
    if (document.getElementById('focusimg')) {
        $("#focusimg").focusimg({
            speed: 700,
            height: 596,
            effect: 'slide', //fade为淡入 slide为滚动
            duration: 3500,
            autoplay: true,
            hoverStop: true,
            hasBtnSwitch: true,
            hasIndicator: true
        });
    }
});

$(window).scroll(function() {
		var top = $(window).scrollTop();
		if (top > 110) {
			$('.float').addClass('fixed').removeClass('relative');
		}else{
			$('.float').addClass('relative').removeClass('fixed')
		}
	});
// 返回顶部
;$(function() {
    if (!document.getElementById("fixed")) return false;
    var $fixed = $(document.getElementById("fixed"));
    var $fixedItem = $fixed.find("a");
    var sHeight = $(window).scrollTop();

    if (sHeight > 300) {
        $fixedItem.last().show();
    } else {
        $fixedItem.last().hide();
    }

    $(window).scroll(function() {
        sHeight = $(window).scrollTop();
        if (sHeight > 300) {
            $fixedItem.last().slideDown(200);
        } else {
            $fixedItem.last().slideUp(200);
        }
    });

    $fixedItem.last().bind("click", function() {
        $("html, body").stop().animate({ scrollTop: 0 }, 300);
    });
})

// 视频弹窗层插件
;(function($, undefined) {
    $.fn.vLightbox = function(ops) {
        var str = '<div class="layer-bg" id="layerBg"></div><div class="layer" id="layer"><div class="layer-container"><span class="btn-close" id="videoClose"></span><video id="videoPlayer"></video></div></div>';
        var defaults = {
            isControls: true,
            isAutoplay: true
        }
        var ops = $.extend(defaults, ops);
        $('body').append(str);
        var layer = $('#layer');
        var cover = $('#layerBg');
        var close = $('#videoClose');
        var Video = document.getElementById('videoPlayer');
        ops.isControls && $(Video).attr({controls : true});
        ops.isAutoplay && $(Video).attr({autoplay : true});
        this.each(function() {
            var $this = $(this);
            $this.bind('click', function() {
                var videourl = $(this).attr("data-videourl");
                if (videourl) {
                    $(Video).attr({src : videourl});
                    cover.show();
                    layer.addClass('active');
                } else {
                    console.log('你的视频地址不正确');
                } 
            });
            cover.bind('click', function() {
                cover.hide();
                layer.removeClass('active');
                Video.pause();
            });
            close.bind('click', function() {
                cover.hide();
                layer.removeClass('active');
                Video.pause();
            });
        });
    };
})(jQuery);