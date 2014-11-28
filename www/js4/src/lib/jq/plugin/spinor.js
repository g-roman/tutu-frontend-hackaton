'use strict';
/**
 * User: Makushev Vladimir
 * Date: 01.02.14
 * Time: 10:24
 */
define(
	[
		'vendors/spinjs/spin.min'
	],
	function (Spinner) {
		(function ($, Spinner) {
			$.fn.spinor = function (options) {
				var self = this,
					opts = $.extend(true, {}, $.fn.spinor.defaults);

				if (options) {
					opts = $.extend(true, {}, opts, options);
				}

				return {
					start: function () {
						return self.each(function () {
							var $el = $(this),
								$placeholder = opts.placeholder ? $el.find(opts.placeholder) : $el,
								spinner = new Spinner(opts),
								$spinnerElement;

							if($el.data('status')==='spinning'){
								return;
							}
							$el.data('spinor.prevHtml', $placeholder.html());
							$el.data('status', 'spinning');

							$spinnerElement = $(spinner.spin().el);
							if (opts.css) {
								$spinnerElement.css(opts.css);
							}
							$placeholder.html($spinnerElement);
						});
					},
					stop: function () {
						return self.each(function () {
							var $el = $(this),
								$placeholder = opts.placeholder ? $el.find(opts.placeholder) : $el;
							$placeholder.html($el.data('spinor.prevHtml'));
							$el.data('status', 'stopped');
						});
					}
				};
			};

			$.fn.spinor.defaults = {
				placeholder: '', //if empty - element itself
				lines: 13, // The number of lines to draw
				length: 0, // The length of each line
				width: 5, // The line thickness
				radius: 10, // The radius of the inner circle
				corners: 1, // Corner roundness (0..1)
				rotate: 0, // The rotation offset
				direction: 1, // 1: clockwise, -1: counterclockwise
				color: '#000', // #rgb or #rrggbb or array of colors
				speed: 1, // Rounds per second
				trail: 60, // Afterglow percentage
				shadow: false, // Whether to render a shadow
				hwaccel: false, // Whether to use hardware acceleration
				className: 'spinner', // The CSS class to assign to the spinner
				zIndex: 2e9, // The z-index (defaults to 2000000000)
				top: 'auto', // Top position relative to parent in px
				left: 'auto' // Left position relative to parent in px
			};

		})(jQuery || Zepto, Spinner)
	});
