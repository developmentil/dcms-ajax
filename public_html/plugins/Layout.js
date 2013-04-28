define(function() {
	
	function PlugIn() {
		PlugIn.super_.apply(this, arguments);
	};
	DA.PlugIn.extend(PlugIn);
	
	PlugIn.prototype._load = function(callback) {
		DA.tabs = {
			create: function() {}
		};
		
		callback(null);
	};
	
	return PlugIn;
});