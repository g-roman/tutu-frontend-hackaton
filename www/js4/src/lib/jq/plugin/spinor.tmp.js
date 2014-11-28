'use strict';
/**
 * User: Makushev Vladimir
 * Date: 01.02.14
 * Time: 10:24
 */

(function ($) {
    //Define is browser supports transition
    var useCss3 = (function () {
        var b = document.body || document.documentElement,
            s = b.style,
            p = 'transition';
        if (typeof s[p] == 'string') {
            return true;
        }

        // Tests for vendor specific prop
        var v = ['Moz', 'webkit', 'Webkit', 'Khtml', 'O', 'ms'],
            p = p.charAt(0).toUpperCase() + p.substr(1);

        for (var i = 0; i < v.length; i++) {
            if (typeof s[v[i] + p] == 'string') {
                return true;
            }
        }
        return false;
    })();

    //Once per page load key frames
    !function(){
        if (!useCss3) {
            return false;
        }

        var style = document.createElement('style'),
            kf = '@-webkit-keyframes spinor-rotate { from { -webkit-transform: rotate(0deg);} to {-webkit-transform: rotate(360deg);}}' +
                '@keyframes spinor-rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); }}';
        if (style.stylesheet) {
            style.stylesheet.cssText = kf;
        } else {
            style.appendChild(document.createTextNode(kf));
        }
        document.head.appendChild(style);

	    // @todo TR.addStyle()
    }();

    function getTemplate(opts) {
        if (useCss3) {
            return cssTemplate(opts);
        }
        return gifTemplate(opts);
    }

    function cssTemplate(opts) {
        var $spinWrapper = $('<div/>').addClass(opts.wrapperClassName).unwrap(),
            $dots = $(Array(8 + 1).join('<div></div>'));

        //Styling
        $spinWrapper.
	        css({
		        background: 'none',
		        width: opts.dotWidth,
		        height: opts.dotHeight,
		        marginTop: opts.size,
		        marginBottom: opts.size,
		        marginLeft: opts.size,
		        marginRight: opts.size,
		        animation: 'spinor-rotate ' + opts.speed + ' linear infinite'
            }).
	        css('-webkit-animation', 'spinor-rotate ' + opts.speed + ' linear infinite').
	        css(opts.css); //if user specified custom css

        //Styling dots
        $dots.css({
	        borderRadius: opts.borderRadius,
	        width: opts.dotWidth,
	        height: opts.dotHeight,
	        position: 'absolute',
	        top: 0,
	        left: 0
        });

        for (var i = 0, length = $dots.length, deg = 0, opacity = 0; i < length; i++) {
            var $dot = $($dots[i]);

            deg += 45;
            opacity += 0.1;

            $dot.
	            css('background-color', opts.color).
	            css('-webkit-transform', 'rotate(' + deg + 'deg) translate(0, ' + opts.centerDistance + ')').
                css('transform', 'rotate(' + deg + 'deg) translate(0, ' + opts.centerDistance + ')').
                css('opacity', opacity);
        }

        $spinWrapper.append($dots);
        return $spinWrapper;
    }

    function gifTemplate(opts){
        var $spinWrapper = $('<div/>').addClass(opts.wrapperClassName).unwrap();

        $spinWrapper.html($('<img src="'+opts.gif+'"/>'));
        $spinWrapper.css(opts.css);

        return $spinWrapper;
    }

    $.fn.spinor = function (options) {
        var self=this,
            opts = $.extend(true, {}, $.fn.spinor.defaults);

        if (options) {
            opts = $.extend(true, {}, opts, options);
        }

        return {
            start: function(){

                return self.each(function () {
                    var $el = $(this),
                        $renderedTemplate = getTemplate(opts);

                    $el.data('spinor.prevHtml', opts.placeholder ? $el.find(opts.placeholder).html() : $el.html());

                    if (opts.placeholder) {
                        $el.find(opts.placeholder).html($renderedTemplate);
                    } else {
                        $el.html($renderedTemplate);
                    }
                });

            },
            stop: function(){

                return self.each(function () {
                    var $el = $(this);
                    if (opts.placeholder) {
                        $el.find(opts.placeholder).html($el.data('spinor.prevHtml'));
                    }
                    else {
                        $el.html($el.data('spinor.prevHtml'))
                    }

                    $el.data($el.data('spinor.prevHtml', ''));
                });

            }
        };


    };

    $.fn.spinor.defaults = {
        wrapperClassName:'spinor-wrapper',
        gif: '/images/src/blocks/tours/loader2.gif',
        css:{
            display:'inline-block'
        },
        placeholder:'',
        speed:'0.9s',
        color:'#fff',
        size:'16px',
        dotWidth:'5px',
        dotHeight:'5px',
        borderRadius:'50%',
        centerDistance:'9px'
    };

})(jQuery||Zepto);
