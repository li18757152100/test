;$(function() {
    $.fn.ablum = function(settings) {
        var run = $.type(settings) === "string";
        if (!this.length) return false;
        return this.each(function() {
            $element = $(this);
            if (!run) {
                ins = new Ablum($element, settings);
                ins.init();
            }
        });
    };

    var Ablum = function($element, settings) {
        var the = this;
        the.options = $.extend({}, the.options, settings);
        the.obj     = { elem : $element };
        the.width   = 0;
        the.len     = 0;
        the.index   = 0;
        the.timer   = null;
    };

    Ablum.prototype.options = {
        count : 5, 
        space : 8, 
        total : true,
        cback: function() {}
    };

    Ablum.prototype.init= function() {
        var the = this;
        var obj = the.obj;
        var ops = the.options;
        the.getObject();
        the.setSize();
        the.showNumber();
        the.switchPic();
        ops.cback();
    };

    Ablum.prototype.getObject = function() {
        var the = this;
        var obj = the.obj;
        var ops = the.options;
        var SRC = '';
        obj.view  = obj.elem.find('.album-view');
        obj.vWrap = obj.view.find('.album-view-wrapper');
        obj.image = obj.view.find('img');
        obj.list  = obj.elem.find('.album-list');
        obj.lView = obj.list.find('.album-viewpost');
        obj.lWrap = obj.list.find('.album-list-wrapper');
        obj.item  = obj.list.find('.album-item')
        obj.vPrev = $('<a href="javascript:;" class="album-vbtn album-prev"></a>').appendTo(obj.view);
        obj.vNext = $('<a href="javascript:;" class="album-vbtn album-next"></a>').appendTo(obj.view);
        obj.lPrev = $('<a href="javascript:;" class="album-lbtn album-prev"></a>').appendTo(obj.list);
        obj.lNext = $('<a href="javascript:;" class="album-lbtn album-next"></a>').appendTo(obj.list);
        if (ops.total == true) {
            obj.number = $('<a href="javascript:;" class="album-number"></a>').appendTo(obj.elem);
        }  
        SRC = obj.item.eq(0).find('img').attr('data-original') || obj.item.eq(0).find('img').attr('src');
        obj.item.eq(0).addClass('cur');
        obj.image.attr({src : SRC});
        the.len   = obj.item.length;
    };

    Ablum.prototype.setSize = function(n) {
        var the = this;
        var obj = the.obj;
        var ops = the.options;
        var uWidth = 0 , nWidth = 0;
        var vWidth = obj.lView.outerWidth();
        the.width = (vWidth + ops.space) / ops.count;
        uWidth = the.width * the.len -ops.space;
        nWidth = the.width - ops.space;
        nHeign = nWidth * 0.6;
        obj.list.height(nHeign);
        obj.lPrev.css({lineHeight : nHeign + 'px' });
        obj.lNext.css({lineHeight : nHeign + 'px'});
        obj.item.width(nWidth).css({marginLeft : ops.space});
        obj.item.first().css({marginLeft : 0});
        obj.lWrap.width(uWidth);
        obj.pics = obj.item.find('img');
        obj.pics.each(function() {
            var items = $(this);
            var SRCS = items.attr('data-original') ||  items.attr('src');
            $('<img>').attr({src: SRCS}).load(function() {
                $(this).appendTo('body').css({display: "none"})
                var iWidth = $(this).innerWidth();
                var iHeight = $(this).innerHeight();
                var rate = Math.floor(iWidth/iHeight);
                $(this).remove();
                if (rate >= 1) {
                    obj.image.css({width : "100%", height : "auto"});
                } else {
                    obj.image.css({width : "auto", height : "100%"});
                }
            })
        })
    };

    Ablum.prototype.showNumber = function() {
        var the = this;
        var obj = the.obj;
        var ops = the.options;
        if (ops.total == true) {
            var str = (the.index + 1) + ' / ' + the.len;
            obj.number.text(str);
        }
    };

    Ablum.prototype.switchPic = function() {
        var the = this;
        var obj = the.obj;
        var ops = the.options;
        obj.lNext.bind("click", function() {
            the.index = (the.index < the.len - 1) ? ++the.index : the.len - 1;
            the.cutover();
        });

        obj.lPrev.bind("click", function() {
            the.index = (the.index > 0) ? --the.index : 0;
            the.cutover();
        });
        obj.vNext.bind("click", function() {
            the.index = (the.index < the.len - 1) ? ++the.index : the.len - 1;
            the.cutover();
        });

        obj.vPrev.bind("click", function() {
            the.index = (the.index > 0) ? --the.index : 0;
            the.cutover();
        });
        obj.item.bind("click", function() {
            the.index = $(this).index();
            the.cutover();
        })
    };

    Ablum.prototype.cutover = function(i) {
        var the = this;
        var obj = the.obj;
        var ops = the.options;
        var SRCC = obj.pics.eq(the.index).attr('data-original') || obj.pics.eq(the.index).attr('src');
        the.showNumber();
        the.setSize(the.index);
        obj.item.eq(the.index).addClass("cur").siblings().removeClass("cur");
        obj.image.hide().attr({src : SRCC}).fadeIn(600);
        if (2 < the.index && the.index < the.len - 2) {
            obj.lView.stop().animate({ scrollLeft: the.width * (the.index - 2) }, 400);
        }
        if (the.index == 0) {
            obj.lWrap.stop().animate({'margin-left': 60}, 300, function() {
                $(this).stop().animate({'margin-left': 0}, 300)
            })
        } 
        if (the.index == the.len - 1) {
            obj.lWrap.stop().animate({'margin-right': 60}, 300, function() {
                $(this).stop().animate({'margin-right': 0}, 300)
            })
        } 
    };
})