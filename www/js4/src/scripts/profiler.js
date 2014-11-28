"use strict";

var Profiler = (function(window){
	/**
	 * @type {Profiler}
	 */
	var instance,
		/**
		 * @constant
		 */
		get = function(k){
			return {
				storageKeyData:   "profiler-tutu",
				storageKeyUid:    "profiler-uid",
				storageKeyEnabled:"profiler-enable"
			}[k]
		},
		console = window.console || {
				log: function(){},
				warn: function(){},
				error: function(){},
				dir: function(){}
			};

	//Если браузер убог - возвращаем просто пустую заглушку
	// с публичными методами, чтобы ничего не сломалось
	if (_isNotValidBrowser()){
		console.log('Profiler not started');
		return {
			i: function(){},
			o: function(){},
			flush: function(){},
			runWithRandomPropability: function(){}
		};
	}

	/**
	 *
	 * @returns {*}
	 * @constructor
	 */
	function Profiler(){
		var script;

		if(instance){
			return instance;
		}

		instance = this;
		script = document.querySelector('script[data-ip]');

		this.enabled = true;

		this.trigger = {};

		this.ip = script.getAttribute('data-ip');

		this.backuri = window.location.protocol +  '//' + script.getAttribute('data-backuri') + '/put/';

		this.uid = this.getUid();

		this.data = this.restoreIncompleteData() || {};

		this.startTime = Math.round(new Date().valueOf() /1000);

		this.initEvents();
	}

	/**
	 * @type {Object|Function|Profiler}
	 */
	Profiler.fn = Profiler.prototype;


	/**
	 * Rандомное включение на часть пользователей
	 */
	Profiler.fn.runWithRandomPropability = function(prop){

		var ske = get("storageKeyEnabled"),
			data = JSON.parse(sessionStorage.getItem(ske)),
			now = new Date().getDate();

		if (prop === null){
			console.warn('runWithRandomPropability: 0. Exit without propability.');
			return;
		}

		console.log('runWithRandomPropability: ' + prop + '%');

		this.enabled = false;

		if (data === null){
			data = {
				enabled: _gpres(prop),
				date: now
			};
		}
		else {
			if(data.date != now){
				data.enabled = _gpres(prop);
				data.date = now;
			}
			else{
				this.enabled = data.enabled;
			}
		}

		sessionStorage.setItem(ske, JSON.stringify(data));
	};

	/**
	 * Начинает записывать статистику для указанного ключа
	 * @param key
	 */
	Profiler.fn.i = function (key, trigger) {
		if (!this.enabled) return;

		// Условие срабатывания профайлера на метку.
		// Задается через колбэк функцию
		if (typeof trigger == "function") {
			this.trigger[key] = trigger;
			if (trigger(this)){
				console.warn("Trigger return from key " + key + ". Key not setup");
				return;
			}
		}

		console.log("Add label " + key);

		// Сбрасываем данные, в случае если на метку уже есть значения
		// при повторном добавлении метки в расчеты
		if (this.data[key] && this.data[key].duration !== null){
			console.warn("Key " + key + " exists. Flush data");
			this.flush(true);
		}

		this.data[key] = {
			ip: this.ip,
			duration: null,
			startTime: new Date().valueOf()
		};

		return this;
	};

	/**
	 * Извлекает объект, считает его время жизни в хранилище и записывает ему эту информацию
	 * @param key
	 */
	Profiler.fn.o = function(key, trigger){
		if (!this.enabled) return;

		// Условие срабатывания профайлера на метку.
		// Задается через колбэк функцию
		if (typeof trigger == "function") {
			console.warn("Outrigger return from key " + key + "!");
			if (trigger(this)) return;
		}

		// Использовать тот же самый тригер что и на входе
		if (trigger === true && this.trigger[key]) {
			console.warn("Intrigger return from key " + key + "!");
			if (this.trigger[key](this)) return;
		}

		console.log("Call out for label " + key);

		if(this.data[key]){
			console.warn("Calculation duration for out label " + key);
			this.data[key].duration = (new Date().valueOf() - this.data[key].startTime) + '';
		}
		else {
			console.warn("Key " + key + " not init!");
		}

		return this;
	};

	/**
	 * Сброс данных на сервер
	 */
	Profiler.fn.flush = function(async){
		if (!this.enabled) return;
		this.sendData(async);
	};

	/**
	 * Чтобы не сломать BFCache
	 * используем только событие onpagehide
	 * для автоматической отправки собранной статистики
	 *
	 * @private
	 */
	Profiler.fn.initEvents = function(){
		if (!this.enabled) return;

		var event = "onunload";

		if ("onpagehide" in window){
			event = "onpagehide";
		}
		else if ("onbeforeunload" in window){
			event = "onbeforeunload";
		}

		window[event] = function(){
				this.flush();
				console.log('(!)' + event);
			}.bind(this);
	};

	/**
	 * Собирает и считает данные, которые будут отправлены на сервер
	 * @returns {{uid: (*|uid|uid|uid|uid|uid), sentTime: string, startTime: string, ip: (*|ip|ip|string), domLoaded: string, operations: }}
	 * @private
	 */
	Profiler.fn.getData = function () {
		var completedOperations = [],
			prop,
			operation;

		//Отсекаем незавершенные маркеры
		for (prop in this.data) {
			if (!this.data.hasOwnProperty(prop)){
				continue;
			}

			operation = this.data[prop];

			if (operation.duration === null){
				continue;
			}

			operation.label = prop;
			operation.startTime = Math.round(operation.startTime /1000) + '';
			completedOperations.push(operation);
		}

		return {
			uid: this.uid,
			sentTime: Math.round(new Date().valueOf()/1000) + '',
			startTime: this.startTime + '',
			ip: this.ip,
			//domLoaded: (performance.timing.domComplete - performance.timing.responseEnd) + '',
			browser: browser.name,
			browserVersion: browser.versionNumber,
			operations: completedOperations
		};
	};


	/**
	 * Сохраняет данные в sessionStorage и отправляет собранные данные на сервер
	 * @private
	 */
	Profiler.fn.sendData = function(async){

		var self = this,
			data = this.getData(),
			dataToSend,
			formData,
			xhr;

		// Не дергаем сервер по пустякам.
		if (data.operations.length < 1) return;

		dataToSend = JSON.stringify(data);

		// Перед отправкой, сохраняем в sessionStorage данные,
		// которые не были извлечены из хранилища
		this.saveIncompleteData();

		xhr = _xhrFactory();

		xhr.open('POST', this.backuri, !!async);

		// Этот метод при сборке удаляется
		// Нужен только для отладки
		xhr.onreadystatechange = function(){console.log(dataToSend)};

		if (window.FormData){
			formData = new FormData();
			formData.append('data', dataToSend);
			xhr.send(formData);
		}
		else {
			if (xhr.setRequestHeader){
				xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			}
			xhr.send("data=" + dataToSend);
		}
	};

	/**
	 *
	 * @returns {XMLHttpRequest}
	 * @private
	 */
	function _xhrFactory(){
//		if (window.XDomainRequest){
//			return new XDomainRequest();
//		}
		return new XMLHttpRequest();
	}

	/**
	 * Возвращает UID из sessionStorage, или создает его и затем возвращает
	 * @returns {*}
	 * @private
	 */
	Profiler.fn.getUid = function () {
		var usk = get("storageKeyUid"),
			uid = sessionStorage.getItem(usk);
		if (!uid) {
			sessionStorage.setItem(usk, _uid());
		}
		return sessionStorage.getItem(usk);
	};


	/**
	 * Сохраняет необработанные маркеры в sessionStorage
	 * Необработанными считаются те, у которыйх duration ещё не указан
	 */
	Profiler.fn.saveIncompleteData = function(){
		var prop;
		for(prop in this.data){
			if(this.data.hasOwnProperty(prop)){
				if(this.data[prop]['duration'] && this.data[prop]['duration'].length > 0){
					delete this.data[prop];
				}
			}
		}
		sessionStorage.setItem(get("storageKeyData"), JSON.stringify(this.data));
	};


	/**
	 * Восстанавливает данные из sessionStorage
	 * @returns {*}
	 */
	Profiler.fn.restoreIncompleteData = function(){
		return JSON.parse(sessionStorage.getItem(get("storageKeyData")))
	};

	/**
	 * Это разновидность UUID (rfc4122), имитирующая MD5
	 * Про алгоритм можно прочитать по ссылке http://ru.wikipedia.org/wiki/UUID
	 * UUID согласно RFC должен выглядеть как: 550e8400-e29b-41d4-a716-446655440000
	 * Здесь же убраны тире и размер строки сокращен до 32 символов (симуляция MD5)
	 *
	 * @private
	 *
	 * @returns {string}
	 */
	function _uid() {
		return 'xxxxyxxxxyxxxxyxxxxyxxxxyxxxxyxx'.replace(
			/[xy]/g,
			function (c) {
				var r = Math.random() * 16 | 0,
					v = c == 'x' ? r : (r & 0x3 | 0x8);
				return v.toString(16);
			}
		)
	}

	/**
	 * Проверяем валидность браузера.
	 * Пока JSProfiler работает не на всех версиях
	 *
	 * @returns {boolean}
	 * @private
	 */
	function _isNotValidBrowser(){

		// Под IE9 есть проблемы с кроссдоменными запросами
		if (browser.msie && browser.versionNumber < 10) return true;

		return  !Function.prototype.bind        ||
				!('XMLHttpRequest' in window)   ||
				!('querySelector' in document)  ||
				!('sessionStorage' in window)
	}

	/**
	 * Вернуть рандомно статус разрешения включения с вероятностью 1%
	 * @returns {boolean}
	 */
	function _gpres(i){
		i = parseInt(i) + 1;
		return (Math.random() * 100) < i
	}

	// Создаем профайлер
	return new Profiler();
})(window);