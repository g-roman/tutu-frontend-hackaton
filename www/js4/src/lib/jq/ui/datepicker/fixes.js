"use strict";

!function (f) {
	(typeof window.define === 'function' && window.define.amd) ? define(['jqueryui'], f) : f();
}(function () {
	var datepickerFixes = {};

	datepickerFixes.fixVerticalPosition = function () {
		$.extend($.datepicker, {
			_checkOffset: function (inst, offset, isFixed) {
				var dpWidth = inst.dpDiv.outerWidth(),
					inputWidth = inst.input ? inst.input.outerWidth() : 0,
					viewWidth = document.documentElement.clientWidth + (isFixed ? 0 : $(document).scrollLeft());

				offset.left -= (this._get(inst, "isRTL") ? (dpWidth - inputWidth) : 0);
				offset.left -= (isFixed && offset.left === inst.input.offset().left) ? $(document).scrollLeft() : 0;
				offset.left -= Math.min(offset.left, (offset.left + dpWidth > viewWidth && viewWidth > dpWidth) ?
					Math.abs(offset.left + dpWidth - viewWidth) : 0);

				return offset;
			}
		});
	};

	datepickerFixes.fixPosition = function () {
		$.extend($.datepicker, {
			_checkOffset: function (inst, offset, isFixed) {
				return offset;
			}
		});
	};

	datepickerFixes.fixGoToToday = function () {
		$.extend($.datepicker, {
			_gotoToday: function (id) {
				var target = $(id),
					inst = this._getInst(target[0]),
					date;

				if (this._get(inst, 'gotoCurrent') && inst.currentDay) {
					inst.selectedDay = inst.currentDay;
					inst.drawMonth = inst.selectedMonth = inst.currentMonth;
					inst.drawYear = inst.selectedYear = inst.currentYear;
				} else {
					date = new Date();
					inst.selectedDay = date.getDate();
					inst.drawMonth = inst.selectedMonth = date.getMonth();
					inst.drawYear = inst.selectedYear = date.getFullYear();

					// !! the below two lines are new
					this._setDateDatepicker(target, date);
					this._selectDate(id, this._getDateDatepicker(target));
				}
				this._notifyChange(inst);
				this._adjustDate(target);
			}
		})
	};

	return datepickerFixes;
});