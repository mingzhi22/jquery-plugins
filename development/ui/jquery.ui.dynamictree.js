$.widget("ui.dynamictree", {
	options: {
		dynamic: true,
		subTreeClassName: "ui-dtree-subtree",
		folderClassName: "ui-dtree-folder",
		loadingClassName: "ui-dtree-loading"
	},

	_init: function() {
	},

	_create: function() {
		this_initSource();
	},

	_initSource: function() {
		var o = this.options, source = o.source;
		if($.isFunction(source)) {
			this.load = source;
			return true;
		}
		if(typeof source === "string") {
			this.load = function(request, response) {
				if(self.xhr) {
					self.xhr.abort();
				}
				self.xhr = $.getJSON(source, request, function(data, status, xhr) {
					if(xhr === self.xhr) {
						response(data);
					}
					self.xhr = null;
				});
			}
			return true;
		}
		if($.isArray(source)) {
			o.dynamic = false;
			return true;
		}
	},

	_renderTree: function(parent, data) {
		var len = data.length, o = this.options, 
			tree = $('<ul class="' + o.subTreeClassName + '"></ul>');
		for(var i = 0; i < len; i++) {
			var item = data[i];
				li = $('<li></li>').data("item.dynamictree", item);
			if(item.hasChild == "true") {
				li.append('<a href="#" class="' + o.folderClassName + '"></a>');
			}
			li.append('<a href="#">' + item.name + '</a>');
			tree.append(li);
		}
		parent.append(tree);
		return tree;
	},

	_initFolder: function(tree) {
		var o = this.options, self = this;
		tree.find(o.folderClassName).one("click", function(e) {
			e.preventDefault();
			var parent = $(this).addClass(o.loadingClassName),
				item = parent.data('item.dynamictree');
			
			self.load({ id: item.id }, function(data) {
				var tree = self._renderTree(parent, data);
				_initFolder(tree);
				parent.removeClass(o.loadingClassName);
			});
		});
	}
});
