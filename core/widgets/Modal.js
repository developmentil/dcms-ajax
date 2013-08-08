define(['core/nls/index', 
	'core/widgets/Container', 'core/widgets/Button'
], function(i18n, Container, Button) {
	i18n = i18n.widgets.Modal;
	
	var idSequence = 0;
	
	function Widget() {
		Widget.super_.apply(this, arguments);
		
		if(this.options.id === null)
			this.options.id = 'modal-' + (++idSequence);
	};
	Container.extend(Widget, {
		headerId: null,
		title: null,
		class: 'fade',
		content: null,
		body: null,
		close: true,
		modal: {},
		primary: {},
		primaryLabel: i18n.OK,
		primaryClick: null,
		primaryDismiss: true,
		cancel: {},
		cancelLabel: i18n.Cancel,
		cancelClick: null,
		cancelDismiss: true,
		actions: null,
		autoDestroy: true,
		onHide: null,
		onHidden: null,
		onShown: null,
		onShow: null
	});
	var proto = Widget.prototype;
	
	proto.show = function() {
		if(!this._elm) {
			console && console.warn('Modal already destroied or not created');
			return this;
		}
		
		this._elm.modal('show');
		return this;
	};
	
	proto.hide = function() {
		if(!this._elm) {
			console && console.warn('Modal already destroied or not created');
			return this;
		}
		
		this._elm.modal('hide');
		return this;
	};
	
	proto._create = function(container, parent, elm) {
		var self = this, options = this.options;
		
		if(!elm)
			elm = $('<div class="modal" tabindex="-1" role="dialog" aria-hidden="true" />');
		
		this._header = null;
		
		this._container = $('<div class="modal-body" />').appendTo(elm);
		if(options.body)
			this._container.append(options.body);
		else if(options.content)
			this._container.append($('<p />').text(options.content));
		
		this._footer = $('<div class="modal-footer" />').appendTo(elm);
		
		elm = Widget.super_.prototype._create.call(this, container, parent, elm);
		elm
		.on('hidden', function() {
			self.emit('hidden');
			
			if(options.onHidden)
				options.onHidden.apply(self, arguments);
			
			if(options.autoDestroy)
				self.destroy();
		})
		.on('hide', function() {
			self.emit('hide');
			
			if(options.onHide)
				options.onHide.apply(self, arguments);
		})
		.on('shown', function() {
			self.emit('shown');
			
			if(options.onShown)
				options.onShown.apply(self, arguments);
		})
		.on('show', function() {
			self.emit('show');
			
			if(options.onShow)
				options.onShow.apply(self, arguments);
		})
		.modal(this._getModalOptions(options));
		
		return elm;
	};
	
	proto._getModalOptions = function(options) {
		return $.extend({
			backdrop: options.close,
			keyboard: options.close
		}, options.modal);
	};
	
	proto._render = function(options) {
		Widget.super_.prototype._render.apply(this, arguments);
		
		if(options.title || options.close) {
			var headerId = options.headerId || (options.id + '-header');
			
			if(!this._header)
				this._header = $('<div class="modal-header" />').prependTo(this._elm);
			else
				this._header.empty();
				
			if(options.close) {
				this._header.append('<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>');
			}
					
			this._header.attr('id', headerId)
			.append(
				$('<h3 />').attr('aria-labelledby', headerId)
				.text(options.title)
			);
		}
		
		this._renderFooter(options);
	};
	
	proto._renderFooter = function(options) {		
		this._footer.empty();
		
		var actions = options.actions;
		if(!actions) {
			actions = [];
			
			if(options.primary) {
				actions.push($.extend({
					type: 'submit',
					class: 'btn-primary',
					label: options.primaryLabel,
					click: options.primaryClick,
					dismiss: options.primaryDismiss
				}, options.save));
			}
			
			if(options.cancel) {
				actions.push($.extend({
					label: options.cancelLabel,
					click: options.cancelClick,
					dismiss: options.cancelDismiss
				}, options.cancel));
			}
		}
		
		var self = this,
		dismiss = function() {
			self.hide();
		};
		
		// use for..in to ignore undefined items
		for(var i in actions) {(function(action) {
			if(action.dismiss !== false) {
				if(!action.click)
					action.click = dismiss;
				else {
					var oldClick = action.click;
					action.click = function() {
						oldClick.apply(this, arguments);
						dismiss();
					};
				}
			}

			self._footer
			.append(Button.create(action))
			.append(' ');
		})(actions[i]);}
	};
	
	return Widget;
});