"use strict";

/**
 * Простой вариант паралакс эффекта
 */
!function($){
	$.fn.parallax = function(options){
		var $this = $(this),
			offset = $this.offset(),
			cfg = $.extend(
				{
					start: 0,
					stop: offset.top + $this.height(),
					coef: 0.95
				},
				options
			),
			w = $(window);

		return this.each(function(){
			w.bind('scroll', function(){
				var windowTop = w.scrollTop();
				if((windowTop >= cfg.start) && (windowTop <= cfg.stop))
					$this.css({backgroundPosition: "0 "+ (windowTop * cfg.coef) + "px"});
			});
		});
	};
}(jQuery);