"use strict";

/**
 * Usage:
 * CrossDls.setItem(name, strData)
 * CrossDls.getItem(name)
 * CrossDls.removeItem(name)
 */
!function(scope) {
	var CrossDls = function(){};

	CrossDls._initSettings = function() {
		this.origin = null;
		this.path = null;
		this._iframe = null;
		this._iframeReady = false;
		this._queue = [];
		this._requests = {};
		this._id = 0;
		this._keyPefix = '';
		this._data = [];
	};

	CrossDls.init = function(storageInitiatedCallback, remoteStorageOrigin, remoteStoragePath, keyPrefix) {
		this._initSettings();
		this._keyPefix = keyPrefix;
		this.origin = remoteStorageOrigin;
		this.path = remoteStoragePath;
		this._initIframe();
		this._syncData(storageInitiatedCallback);
	};

	CrossDls.setItem = function(name, strData) {
		this._data[name] = strData;
		this._requestSetItem(name, strData, function(data){});
	};

	CrossDls.getItem = function(name) {
		return this._data[name];
	};

	CrossDls.removeItem = function(name) {
		delete this._data[name];
		this._requestRemoveItem(name, function(data){});
	};

	//private methods

	CrossDls._syncData= function(storageInitiatedCallback) {
		var self = this,
			callback = function(data){
				var values = data.values,
					i;
				self._data = [];
				for (i in values) {
					self._data[values[i].key] = values[i].value;
				}
				storageInitiatedCallback();
			};
		this._requestData(callback);
	};

	CrossDls._initIframe = function() {
		var that = this;
		if (!this._iframe) {
			if (window.postMessage && window.JSON && window.localStorage) {
				this._iframe = document.createElement("iframe");
				this._iframe.style.cssText = "position:absolute;width:1px;height:1px;left:-9999px;";
				document.body.appendChild(this._iframe);

				if (window.addEventListener) {
					this._iframe.addEventListener("load", function(){ that._iframeLoaded(); }, false);
					window.addEventListener("message", function(event){ that._handleMessage(event); }, false);
				} else if (this._iframe.attachEvent) {
					this._iframe.attachEvent("onload", function(){ that._iframeLoaded(); }, false);
					window.attachEvent("onmessage", function(event){ that._handleMessage(event); });
				}
			} else {
				throw new Error("Unsupported browser.");
			}
		}
		this._iframe.src = this.origin + this.path;
	};

	CrossDls._requestData = function(callback){
		var request = {
			actionName: 'getAllData',
			keyPrefix: this._keyPefix,
			id: ++this._id
		};
		this._request(request, callback);
	};

	CrossDls._requestSetItem = function(name, value, callback){
		var request = {
			actionName: 'setItem',
			name: name,
			value: value,
			id: ++this._id
		};
		this._request(request, callback);
	};

	CrossDls._requestRemoveItem = function(name, callback){
		var request = {
			actionName: 'removeItem',
			name: name,
			id: ++this._id
		};
		this._request(request, callback);
	};

	CrossDls._request = function(request, callback)
	{
		var data = {
				request: request,
				callback: callback
			};
		if (this._iframeReady){
			this._sendRequest(data);
		} else {
			this._queue.push(data);
		}

		if (!this._iframe){
			this.init();
		}
	};

	CrossDls._sendRequest = function(data){
		this._requests[data.request.id] = data;
		this._iframe.contentWindow.postMessage(JSON.stringify(data.request), this.origin);
	};

	CrossDls._iframeLoaded = function(){
		this._iframeReady = true;

		if (this._queue.length){
			for (var i=0; i < this._queue.length; i++){
				this._sendRequest(this._queue[i]);
			}
			this._queue = [];
		}
	};

	CrossDls._handleMessage = function(event){
		if (event.origin == this.origin){
			var data = JSON.parse(event.data);
			this._requests[data.id].callback(data);
			delete this._requests[data.id];
		}
	};

	// эмуляция Object.create для старых IE
	CrossDls.inherit = Object.create || function(proto) {
		function F() {}
		F.prototype = proto;
		return new F;
	};

	// закрываем загрузку через AMD до тех пор, пока у нас не будет нормальной его поддержки
	// Процесс загрузки
	//(typeof scope.define === 'function' && scope.define.amd)
	//	// RequireJS
	//	? define(function(){ return CrossDls } )
	//	// Vanilla.JS
	//	:
	scope.CrossDls = CrossDls;

}(window);