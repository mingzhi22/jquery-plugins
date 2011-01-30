$.widget("ui.dynamictree", {
	options: {
		subTreeClassName: "ui-dtree-subtree",
		folderClassName: "ui-dtree-folder",
		loadingClassName: "ui-dtree-loading",
		rootClassName: "ui-dtree-root",
		rootData: "",
		rootLabel: "主菜单",
		expandRoot: false
	},

	_create: function() {
	    var o = this.options, 
	        subTreeClass = '.' + o.subTreeClassName + ':eq(0)';
	        
		this._initSource();
		this._renderRoot();
		
		this.root.click(function(e) {
		    var target = $(e.target);
		    if(target.hasClass(o.folderClassName)) {
		        target.parent().children(subTreeClass).toggle();
		    }
		});
		
		this.element.append(this.root);
	},

	_init: function() {
	    var o = this.options;
		if(o.expandRoot) {
		    this._expand(this.root.find('.' + o.folderClassName));
        } else {
		    this._initFolder(this.root);
        }
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
				self.xhr = $.getJSON(source, { id: request.id }, function(data, status, xhr) {
					if(xhr === self.xhr) {
						response(data);
					}
					self.xhr = null;
				});
			}
			return true;
		}
		if($.isArray(source) || $.isPlainObject(source)) {
		    o.rootData = source;
		    this.load = function(request, response) {
		        response(request.child);
		    }
		    return true;
		}
	},
	
	_normalize: function(data) {
	    var child = data.child;
	    if(typeof child != "undefined") {
	        data.hasChild = ($.isArray(child) && child.length > 0);
	    }
		return data;
	},
	
	_renderRoot: function() {
		var o = this.options,
			root = this.root = $('<ul class="' + o.rootClassName + '"></ul>'),
			rootData = o.rootData;
		if(typeof rootData === 'string') {
		    this._renderItem(root, { id: rootData, name: o.rootLabel, hasChild: true });
            return true;
		}
		if($.isArray(rootData)) {
	        var len = rootData.length;
	        for(var i = 0; i < len; i++) {
		        this._renderItem(root, rootData[i]);
	        }
	        o.expandRoot = false;
			return true;
		} 
		if($.isPlainObject(rootData)) {
			this._renderItem(root, rootData);
			return true;
		}
	},

	_renderSubTree: function(parent, data) {
		var len = data.length, o = this.options, 
			root = $('<ul class="' + o.subTreeClassName + '"></ul>');
		for(var i = 0; i < len; i++) {
			this._renderItem(root, data[i]);
		}
		parent.append(root);
		return root;
	},
	
	_renderItem: function(root, data) {	
	    data = this._normalize(data);
		var li = $('<li></li>').data("item.dynamictree", data),
		    o = this.options;
		if(data.hasChild == true) {
			li.append('<a href="#" class="' + o.folderClassName + '"></a>');
		}
		li.append('<a href="#">' + data.name + '</a>');
		root.append(li); 
	},
	
	_expand: function(button) {
	    var o = this.options,
	        self = this,
	        parent = button.addClass(o.loadingClassName).parent(),
	        item = parent.data('item.dynamictree');
	        
		this.load(item, function(data) {
			var tree = self._renderSubTree(parent, data);
			self._initFolder(tree);
			button.removeClass(o.loadingClassName);
		});
	},

	_initFolder: function(root) {
		var o = this.options, self = this;
		root.find('.' + o.folderClassName).one("click", function(e) {
			e.preventDefault();
			e.stopPropagation();
			self._expand($(this));
		});
	}
});
