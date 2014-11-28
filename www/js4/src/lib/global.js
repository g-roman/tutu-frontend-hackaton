var TR = TR || {};

function _log(msg){
	if(!window.console) return;
	console.log(msg)
	//	var a = Array.prototype.slice.call(arguments);
	//	console.log.apply(console, a);
}
function _error(msg){
	if(!window.console) return;
	console.error(msg)
}

TR.L = function(label, ph){
	if(!TR.langMarks[label]) return 'TR.L(' + label + ')';
	var s = TR.langMarks[label];
	if(ph){
		s = TR.t(s, ph, {
				open: '\\%',
				close: '\\%'
			}), s = TR.langDecline(s, ph);
	}
	return s;
};

TR.langDecline = function(s, d){
	return s.replace(/\[\?n\{(\w+)\}:(.*)\]/ig, function(){
			var val = d[arguments[1]] | 0;
			return arguments[2].split('|')[val < 1 ? 2 : (val < 2 ? 0 : (val < 5 ? 1 : 2))];
		}, s);
};

TR.U = function(lbl, po, qs){
	var url = TR.urlLabels[lbl],
		k;

	if (po) for (k in po) url = url.replace('$'+k, po[k]);

	if (qs){
		url = [url, $.param(qs)].join("?");
	}

	return url;
};

TR.loadJs = function(file, cbf){
	var script = document.createElement('script'), done = false;
	script.src = file;
	script.type = 'text/javascript';
	if(cbf && typeof cbf == 'function'){
		script.onload = script.onreadystatechange = function(){
			if(!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")){
				done = true;
				cbf();
				script.onload = script.onreadystatechange = null;
			}
		}
	}
	document.getElementsByTagName("head")[0].appendChild(script);
};

/**
 * Простейший шаблонизатор. На вход подаем строку с плейсхолдерами и данными.
 * Аналог srintf.
 * По дефолту синтаксис тегов как в шаблонизаторе lodash http://lodash.ru/#template
 * Пример:
 *
 *        TR.t('hello <%= person.name %> <%=person.surname%>', {person: {name: 'Alexander', surname: 'Majorov'}});
 *
 * @param t - шаблон
 * @param d - данные (не обязательно)
 * @param tags - зампенить дефолтные теги на свои
 * @returns {XML|string|void}
 */
TR.t = function(t, d, tags){
	tags = tags || {
		open: '<%=',
		close: '%>'
	};
	return t.replace(new RegExp(tags.open + "\\s*([\\w\\.]*)\\s*" + tags.close, "g"), function(s, k){
			var k = k.split("."), v = d[k.shift()];
			for(var i in k) v = v[k[i]];
			return (typeof v !== "undefined" && v !== null) ? v : ''
		})
};

/**
 *
 *
 * @returns {*}
 */
TR.clone = function(){
	return window._.clone.apply(window, Array.prototype.slice.apply(arguments))
};

TR.loadCss = function(file){
	if(document.createStyleSheet)
		return document.createStyleSheet(file);
	var link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = file;
	document.getElementsByTagName("head")[0].appendChild(link);
	//	var css = "@import url('" + file + "');";
	//	var link = document.createElement('link');
	//	link.rel='stylesheet';
	//	link.href='data:text/css,'+escape(styles);
	//	document.getElementsByTagName("head")[0].appendChild(link);
};

TR.addStyle = function(css){
	if(css.join) css = css.join('');
	var styleBlock = document.getElementById("j-tutu-dynamic-css");
	if(!styleBlock){
		styleBlock = document.createElement("style");
		styleBlock.type = "text/css";
		styleBlock.setAttribute('id', 'j-tutu-dynamic-css');
		document.getElementsByTagName("head")[0].appendChild(styleBlock);
		styleBlock.innerHTML = css;
	}
	else{
		styleBlock.innerHTML += css;
	}
	return styleBlock;
};


TR.qh = function (text) {
	var map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;'
	};

	if (typeof text !== 'string') {
		return text;
	}
	return text.replace(/[&<>"']/g, function(m) { return map[m]; });
};


TR.S = function (path) {
	return path;
};


TR.ucfirst = function (string) {
	var f = string.charAt(0).toUpperCase();
	return f + string.substr(1, string.length-1);
};

/**
 * Полифилл для bind()
 */
if(!Function.prototype.bind){
	Function.prototype.bind = function(self){
		if(typeof this !== "function"){
			// closest thing possible to the ECMAScript 5 internal IsCallable function
			throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
		}
		var aArgs = Array.prototype.slice.call(arguments, 1), func2bind = this, fNop = function(){}, fBound = function(){
				return func2bind.apply(this instanceof fNop && self ? this : self, aArgs.concat(Array.prototype.slice.call(arguments)));
			};
		fNop.prototype = this.prototype;
		fBound.prototype = new fNop();
		return fBound;
	}
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
 */
if(!Array.isArray){
	Array.isArray = function(vArg){
		return vArg instanceof Array
	}
}

/**
 * Объект для храннеия констант.
 * Подробнее в https://dom.tutu.ru/pages/viewpage.action?pageId=9963352
 */
window.Constant = (function(){
	var constants = {};
	return {
		define: function(name, value){
			if(!(name in constants)){
				constants[name] = value;
				return true;
			}
			if(window.console && console.error){
				console.error("Constant a already defined!");
			}
			return false;
		},
		defined: function(name){
			return name in constants;
		},
		get: function(name){
			return constants[name];
		}
	};
}());


/**
 * Позволяет делать проверку на существование элемента
 *
 *
	 if ($('j-el').exists()){
        // что-то делаем...
	}
 *
 * @returns {boolean}
 */
//$.fn.exists = function(){
//	return this.length > 0
//};

/**
 * Ввычисляет MD5 для строки
 * original by: Webtoolkit.info (http://www.webtoolkit.info/)
 * @param str
 * @returns {string}
 */
function md5(str) {
	var RotateLeft = function (lValue, iShiftBits) {
		return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
	};

	var AddUnsigned = function (lX, lY) {
		var lX4, lY4, lX8, lY8, lResult;
		lX8 = (lX & 0x80000000);
		lY8 = (lY & 0x80000000);
		lX4 = (lX & 0x40000000);
		lY4 = (lY & 0x40000000);
		lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
		if (lX4 & lY4) {
			return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
		}
		if (lX4 | lY4) {
			if (lResult & 0x40000000) {
				return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
			} else {
				return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
			}
		} else {
			return (lResult ^ lX8 ^ lY8);
		}
	};

	var F = function (x, y, z) {
		return (x & y) | ((~x) & z);
	};
	var G = function (x, y, z) {
		return (x & z) | (y & (~z));
	};
	var H = function (x, y, z) {
		return (x ^ y ^ z);
	};
	var I = function (x, y, z) {
		return (y ^ (x | (~z)));
	};

	var FF = function (a, b, c, d, x, s, ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};

	var GG = function (a, b, c, d, x, s, ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};

	var HH = function (a, b, c, d, x, s, ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};

	var II = function (a, b, c, d, x, s, ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};

	var ConvertToWordArray = function (str) {
		var lWordCount;
		var lMessageLength = str.length;
		var lNumberOfWords_temp1 = lMessageLength + 8;
		var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
		var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
		var lWordArray = Array(lNumberOfWords - 1);
		var lBytePosition = 0;
		var lByteCount = 0;
		while (lByteCount < lMessageLength) {
			lWordCount = (lByteCount - (lByteCount % 4)) / 4;
			lBytePosition = (lByteCount % 4) * 8;
			lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition));
			lByteCount++;
		}
		lWordCount = (lByteCount - (lByteCount % 4)) / 4;
		lBytePosition = (lByteCount % 4) * 8;
		lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
		lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
		lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
		return lWordArray;
	};

	var WordToHex = function (lValue) {
		var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
		for (lCount = 0; lCount <= 3; lCount++) {
			lByte = (lValue >>> (lCount * 8)) & 255;
			WordToHexValue_temp = "0" + lByte.toString(16);
			WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
		}
		return WordToHexValue;
	};

	var x = Array();
	var k, AA, BB, CC, DD, a, b, c, d;
	var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
	var S21 = 5, S22 = 9 , S23 = 14, S24 = 20;
	var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
	var S41 = 6, S42 = 10, S43 = 15, S44 = 21;

	x = ConvertToWordArray(str);
	a = 0x67452301;
	b = 0xEFCDAB89;
	c = 0x98BADCFE;
	d = 0x10325476;

	for (k = 0; k < x.length; k += 16) {
		AA = a;
		BB = b;
		CC = c;
		DD = d;
		a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
		d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
		c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
		b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
		a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
		d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
		c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
		b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
		a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
		d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
		c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
		b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
		a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
		d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
		c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
		b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
		a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
		d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
		c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
		b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
		a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
		d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
		c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
		b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
		a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
		d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
		c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
		b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
		a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
		d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
		c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
		b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
		a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
		d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
		c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
		b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
		a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
		d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
		c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
		b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
		a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
		d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
		c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
		b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
		a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
		d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
		c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
		b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
		a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
		d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
		c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
		b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
		a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
		d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
		c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
		b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
		a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
		d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
		c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
		b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
		a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
		d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
		c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
		b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
		a = AddUnsigned(a, AA);
		b = AddUnsigned(b, BB);
		c = AddUnsigned(c, CC);
		d = AddUnsigned(d, DD);
	}

	var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);

	return temp.toLowerCase();
}
