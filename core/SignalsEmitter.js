define(['core/libs/signals'], function(signals) {
	
	function SignalsEmitter() {
		this._signals = {};
	};
	var proto = SignalsEmitter.prototype;

    proto.getSignal = function(event) {
		if(typeof this._signals[event] === 'undefined')
			this._signals[event] = new signals.Signal();
		
		return this._signals[event];
	};
	
	proto.addListener = function(event, listener, priority) {
		if(typeof listener === 'number') {
			var tmp = priority;
			priority = listener;
			listener = tmp;
		}
		
		var signal = this.getSignal(event)
				.add(listener, this, priority);
		
		this.emit('newListener', event, listener, priority);
		
		return signal;
	};
	
	proto.on = proto.addListener;
	proto.when = proto.addListener;
	
	proto.once = function(event, listener, priority) {
		if(typeof listener === 'number') {
			var tmp = priority;
			priority = listener;
			listener = tmp;
		}
		
		return this.getSignal(event)
				.addOnce(listener, this, priority);
	};
	
	proto.removeListener = function(event, listener) {
		this.getSignal(event)
				.remove(listener, this);
		
		this.emit('removeListener', event, listener);
		return this;
	};
	
	proto.removeAllListeners = function(event) {
		if(typeof event === 'undefined') {
			this.getSignal(event).removeAll();
			return this;
		}
		
		for(var i in this._signals) {
			this._signals[i].removeAll();
		}
		
		return this;
	};
	
	proto.emitEvent = function(event, args) {
		var signal = this.getSignal(event);
		
		signal.dispatch.apply(signal, args);
		return this;
	};
	
	proto.emit = function(event) {
		return this.emitEvent(event, Array.prototype.slice.call(arguments, 1));
	};
	
	proto.trigger = function(event) {
		var signal = this.getSignal(event),
		args = Array.prototype.slice.call(arguments, 1),
		callback = args.pop();

		dispatchAsync.call(signal, args, callback);
		return this;
	};
	
	function dispatchAsync(paramsArr, callback) {
		if (! this.active) {
			callback();
			return;
		}

		var n = this._bindings.length,
			bindings;

		if (this.memorize) {
			this._prevParams = paramsArr;
		}

		if (! n) {
			callback();
			return;
		}

		bindings = this._bindings.slice();
		this._shouldPropagate = true;

		var self = this,
		exec = function(err) {
			if(err) {
				callback(err);
				return;
			}
			
			n--;
			
			if(!bindings[n] || !self._shouldPropagate || bindings[n].execute(paramsArr) === false) {
				callback();
				return;
			}
		};
		
		paramsArr.push(exec);
		exec();
	}
	
	return SignalsEmitter;
});