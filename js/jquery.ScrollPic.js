(function($, window, document, undefined) {
	$.fn.ScrollPic = function(Objs) {
		var defaults = {
			box_w: 120,
			Interval: 4000,
			bun: true,
			btn: false,
			autoplay: true
		}
		var Objs = $.extend(defaults, Objs);
		this.each(function() {
			var that = $(this);
			var star = 0,
				pic_w = Objs.box_w,
				speed = 1,
				jqul, jqli, count, pics_w, pics_ws, picsHTML, time;
			jqul = $(that).find("ul");
			jqli = $(jqul).find("li");
			count = $(jqli).length;
			picsHTML = $(jqul).html();
			$(jqul).append(picsHTML);
			pics_w = pic_w * count * 2;
			$(jqul).css({
				"width": pics_w + "px"
			});
			if(Objs.btn == true) {
				num_html = "<div class='num'>";
				for(var t = 0; t < count; t++) {
					num_html += "<a href='javascript:void(0)'></a>"
				}
				num_html += "</div>";
				$(that).prepend(num_html);
				var jqNum = $(that).find(".num");
				$(jqNum).find("a").eq(0).addClass("current");
				$(jqNum).find("a").bind({
					click: function() {
						clearInterval(time);
						star = $(this).index() - 1;
						bric();
						time = setInterval(bric, Objs.Interval);
						return false;
					}
				});
			}

			if(typeof Objs.callback === "function") {
				var callback = Objs.callback;
				callback();
			};

			function bric() {
				star++;
				if(star > count) {
					star = 1;
					$(jqul).css({
						"left": "0px"
					}, 0);
				};
				if(star == -1) {
					star = count - 1;
					pics_ws = pics_w * 0.5;
					$(jqul).css({
						"left": -pics_ws + "px"
					}, 0);
				};
				$(jqNum).find("a").eq(star).addClass("current").siblings().removeClass("current");
				speed = star * -pic_w;
				$(jqul).stop(true, false).animate({
					left: speed + "px"
				}, 600);
			};

			function autoplay() {
				time = setInterval(bric, Objs.Interval);
			}

			if(Objs.autoplay == true) {
				autoplay();
				$(that).find(".scrollpic").bind({
					mouseenter: function() {
						clearInterval(time);
					},
					mouseleave: function() {
						if(Objs.autoplay == true) {
							autoplay();
						}
					}
				});
			};

			if(Objs.bun == true) {
				var bun_html = '<a class="bun lbun" href="javascript:void(0)"></a><a class="bun rbun" href="javascript:void(0)"></a>';
				$(that).prepend(bun_html);
				$(that).find(".lbun").bind({
					click: function() {
						bric();
						clearInterval(time);
						if(Objs.autoplay == true) {
							autoplay();
						}
						return false;
					}
				});
				$(that).find(".rbun").bind({
					click: function() {
						star = star - 2;
						bric();
						clearInterval(time);
						if(Objs.autoplay == true) {
							autoplay();
						}
						return false;
					}
				});

			};

		});
	};
})(jQuery, window, document);