;(function($, undefined) {
    $.fn.iFocus = function(settings) {
        var flag = $.type(settings) === "string";
        if (!this.length) return false;
        return this.each(function() {
            var $element = $(this);
            if (!flag) {
                ifocus = new iFocus($element, settings);
                ifocus.init();
            }
        })
    };
    
    var iFocus = function($elem, settings) {
        var the = this;
        the.options = $.extend({}, the.options, settings);
        the.obj = { elem: $elem };
        the.len = 0;
        the.width = 0;
        the.index = 0;
        the.timer = null;
    };

    iFocus.prototype.init = function() {
        var the = this;
        var obj = the.obj;
        var ops = the.options;

        the.getObject();
        the.setSize();
        the.userHandle();
        if (true === ops.autoplay) {
            the.autoPlay()
        }
        if (true === ops.hoverStop) {
            obj.elem.hover(function() {
                clearInterval(the.timer);
            }, function() {
                the.autoPlay()
            });
        }
    };

    iFocus.prototype.options = {
        speed: 900,
        height: 596,
        effect: 'fade',
        duration: 3500,
        autoplay: true,
        hoverStop: true,
        hasBtnSwitch: true,
        hasIndicator: true
    };

    iFocus.prototype.getObject = function() {
        var the = this;
        var ops = the.options;
        var obj = the.obj;
        var cls = 'iFocus-' + ops.effect;
        obj.elem.addClass(cls);
        obj.list = obj.elem.find('ul') || obj.elem.find('.iFocus-list');
        obj.item = obj.elem.find('li') || obj.elem.find('.iFocus-item');
        obj.prev = obj.elem.find('.prev');
        obj.next = obj.elem.find('.next');
        obj.indicator = obj.elem.find('.indicator');
        the.len = obj.item.length;
        if (true === ops.hasBtnSwitch && obj.prev.length == 0) { //是否显示切换按钮
            obj.prev = $('<a href="javascript:void(0);" class="btn-control prev">&lt;</a>').appendTo(obj.elem);
            obj.next = $('<a href="javascript:void(0);" class="btn-control next">&gt;</a>').appendTo(obj.elem);
        }
        if (true === ops.hasIndicator && obj.indicator.length == 0) { //是否显示切换标记
            obj.indicator = $('<div class="indicator"></div>').appendTo(obj.elem);
            for (var i = 0; i < the.len; i++) {
                $('<a href="javascript:void(0);" class="item"></a>').prependTo(obj.indicator);
            }
        }
        obj.ibun = obj.indicator && obj.indicator.children();
        obj.ibun.first().addClass('active');
    };

    iFocus.prototype.setSize = function() {
        var the = this;
        var obj = the.obj;
        var ops = the.options;
        obj.elem.height(ops.height)
        the.width = obj.elem.outerWidth();
        if(the.width == $(window).innerWidth()) {
            the.width = $(window).innerWidth();
            window.onresize = function() {
                the.width = $(window).innerWidth();
                if (the.width > 1200) {
                    obj.item.css({left : the.width});
                } else {
                    obj.item.css({left : 1200});
                }
                obj.item.eq(the.index).css({left : 0});
            }
        }
    };

    iFocus.prototype.effectFade = function(idx) {
        var the = this;
        var obj = the.obj;
        var ops = the.options
        if (obj.item.is(":animated")) return false;
        obj.item.eq(idx).css({
            display: 'none',
            zIndex: 2
        }).fadeIn(ops.spend, function() {
            obj.item.css('zIndex', 1).eq(idx).show().siblings().hide();
        });
        obj.ibun && obj.ibun.eq(idx).addClass('active').siblings().removeClass('active');
    };

    iFocus.prototype.effectPrev = function(idx) {
        var the = this;
        var obj = the.obj;
        var ops = the.options;
        var n  = (idx + 1 > the.len - 1 ? 0 : idx + 1);
        if (the.len > 1) {
            obj.item.eq(the.index).css({
                left : -the.width
            }).animate({left : 0}, ops.speed);
            obj.item.eq(n).animate({left : the.width}, ops.speed);
        }
        obj.ibun && obj.ibun.eq(idx).addClass('active').siblings().removeClass('active');
    };

    iFocus.prototype.effectNext = function(idx) {
        var the = this;
        var obj = the.obj;
        var ops = the.options;
        var p = (idx - 1 < 0 ? the.len -1 : idx - 1);
        if (obj.item.is(":animated")) return false;
        if (the.len > 1) {
            obj.item.eq(p).animate({left : -the.width}, ops.speed, function() {
                $(this).hide().css({left : the.width}).show();
            });
           obj.item.eq(idx).animate({left : 0}, ops.speed);
        }
        obj.ibun && obj.ibun.eq(idx).addClass('active').siblings().removeClass('active');
    };

    iFocus.prototype.userHandle = function() {
        var the = this;
        var obj = the.obj;
        var ops = the.options;
        obj.prev && obj.prev.bind('click', function() {
            if (!obj.item.is(":animated")) {
                the.index--;
                the.index = (the.index < 0 ? the.len - 1 : the.index);
                if (ops.effect === 'slide') {
                    the.effectPrev(the.index);
                } else if (ops.effect === 'fade') {
                    the.effectFade(the.index);
                }
            }
        });
        obj.next && obj.next.bind('click', function() {
            if (!obj.item.is(":animated")) {
                the.index++;
                the.index = (the.index > the.len - 1 ? 0 : the.index);
                if (ops.effect === 'slide') {
                    the.effectNext(the.index);
                } else if (ops.effect === 'fade') {
                    the.effectFade(the.index);
                }
            }
        });
        obj.indicator && obj.ibun.bind('click', function() {
            var indx = $(this).index();
            if (!obj.item.is(":animated")) {
                if (ops.effect === 'fade') {
                    the.index = indx;
                    the.effectFade(the.index);
                }
                if (ops.effect === 'slide') {
                    if (the.index > indx) {
                        obj.item.eq(the.index).animate({left : the.width}, ops.speed);
                        obj.item.eq(indx).css({left: -the.width}).animate({left : 0}, ops.speed);
                        obj.ibun && obj.ibun.eq(indx).addClass('active').siblings().removeClass('active');
                        the.index = indx;
                    } else if(the.index < indx) {
                        obj.item.eq(the.index).animate({left : -the.width}, ops.speed, function() {
                            $(this).hide().css({left : the.width}).show();
                        });
                        obj.item.eq(indx).animate({left : 0}, ops.speed);
                        obj.ibun && obj.ibun.eq(indx).addClass('active').siblings().removeClass('active');
                        the.index = indx;
                    }
                } 
            }
        });
    };

    iFocus.prototype.autoPlay = function() {
        var the = this;
        var obj = the.obj;
        var ops = the.options;
        the.timer = setInterval(function() {
            the.index++;
            the.index = (the.index > the.len - 1 ? 0 : the.index);
            if (ops.effect === 'slide') {
                the.effectNext(the.index);
            }
            if (ops.effect === 'fade') {
                the.effectFade(the.index);
            }
        }, ops.duration);
    };
})(jQuery);