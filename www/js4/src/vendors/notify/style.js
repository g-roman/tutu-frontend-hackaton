"use strict";

define(
	[
		'notify'
	],
	function(){
		$.notify.defaults({
			clickToHide: true,
			autoHide: true,
			autoHideDelay: 5000,
			arrowShow: true,
			arrowSize: 6,
			elementPosition: 'bottom center',
			globalPosition: 'top center',
			showAnimation: 'fadeIn',
			showDuration: 500,
			hideAnimation: 'fadeOut',
			hideDuration: 500
		});
		/**
		 * алерт с критическими ошибками
		 */
		$.notify.addStyle(
			'app_error',
			{
				html: "<div>" +
						"<div class='b-alert__standart _red'>" +
							"<div class='paragraph' data-notify-html='message'></div>" +
						"</div>" +
					"</div>"
			}
		);

		/**
		 * popup с подсказками
		 */
		$.notify.addStyle(
			'hint_popup',
			{
				html: "<div>" +
						"<div class=\"b-popup__container__standart s-active\" style=\"position:relative;\">"+
							"<div class=\"popup_arrow\"></div>"+
							"<div class=\"popup_close\"></div>"+
							"<div class='paragraph' data-notify-html='message'></div>" +
						"</div>"+
					"</div>"
			}
		);
		$.notify.addStyle(
			'element_alert',
			{
				html: "<div>" +
						"<div class=\"b-popup__container__standart _yellow s-active\">"+
							"<div class=\"popup_arrow\"></div>"+
							"<div class=\"popup_close\"></div>"+
							"<div class='paragraph' data-notify-html='message'></div>" +
						"</div>"+
					"</div>"
			}
		);
	}
);