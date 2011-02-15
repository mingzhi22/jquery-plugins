/*
 * 作者：周明智
 * MSN：coldstars@msn.com
 * BLOG：http://www.zhoumingzhi.com
 */

$.widget("ui.dynamictree", {
	options: {
		subTreeClassName: "ui-dtree-subtree",
		folderClassName: "ui-dtree-folder",
		folderOpenedClassName: "ui-dtree-folder-opened",
		loadingClassName: "ui-dtree-loading",
		rootClassName: "ui-dtree-root",
		labelClassName: "ui-dtree-label",
		rootData: null,
		expandRoot: false
	},

	_create: function() {
		this._initSource();
		this._renderRoot();
	},

	_init: function() {
		var o = this.options, self = this;

		if(o.expandRoot) {
			var folder = this._root.find('.' + o.folderClassName);
			
			this._expandFolder(folder);
			this._bindFolder(folder);
		} else {
			this._initTree(this._root);
		}
	},

	_initSource: function() {
		var o = this.options, source = o.source;
		
		if($.isFunction(source)) {
			this._load = function(request, response) {
				if($.isArray(request.child)) {
					response(request.child);
					return;
				}
				source(request, response);
			}
			return true;
		}
		if(typeof source === "string") {
			this._load = function(request, response) {
				if($.isArray(request.child)) {
					response(request.child);
					return;
				}
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
		    this._load = function(request, response) {
		        response(request.child);
		    }
		    return true;
		}
	},
	
	_normalize: function(data) {
	    var child = data.child;
	    
	    if($.isArray(child) && child.length > 0) {
	        data.hasChild = true;
	    }
	},
	
	_renderRoot: function() {	
		var o = this.options, rootData = o.rootData, root;
		
		if($.isArray(rootData)) {
	        o.expandRoot = false;
		} else if($.isPlainObject(rootData)) {
			rootData = [rootData];
		} else {
			return false;
		}

		root = this._root = this._renderTree(rootData);
		this.element.replaceWith(root.addClass(o.rootClassName));
	},

	_renderTree: function(data) {
		var o = this.options, self = this, root = $('<ul></ul>');
	
		$.each(data, function() {
			root.append(self._renderItem(this));
		});

		return root;
	},
	
	_renderItem: function(data) {
		this._trigger("itemRendering", null, {
			data: data
		});
	    
		this._normalize(data);

		var li = $('<li></li>').data("item.dynamictree", data),
		    o = this.options, folder, label;
		
		if(data.hasChild == true) {
			folder = $('<a href="#"></a>').addClass(o.folderClassName);
			li.append(folder);
		}
		label = $('<a href="#"></a>').text(data.name).addClass(o.labelClassName);
		li.append(label);
		
		this._trigger("itemRendered", null, {
			'data': data,
			ui: {
				'item': li,
				'folder': folder,
				'label': label
			}
		});
		
		return li; 
	},
	
	_expandFolder: function(folder) {
	    var o = this.options,
	        self = this,
	        parent = folder.addClass(o.loadingClassName).parent(),
	        item = parent.data('item.dynamictree');
	        
		this._load(item, function(data) {
			var tree = self._renderTree(data).addClass(o.subTreeClassName);
			
			item.child = data;
			parent.append(tree);
			self._initTree(tree);
			folder.removeClass(o.loadingClassName).addClass(o.folderOpenedClassName);
		});
	},

	_bindFolder: function(folder) {
		var self = this, o = this.options,
			folderClass = '.' + o.folderClassName + ':eq(0)',
			subTreeClass = '.' + o.subTreeClassName + ':eq(0)';
		
		folder.click(function(e) {
			e.preventDefault();			
			$(this).toggleClass(o.folderOpenedClassName).closest('li').children(subTreeClass).toggle();
		});
	},

	_initTree: function(tree) {
		var o = this.options, self = this;
			
		tree.find('.' + o.folderClassName).one("click", function(e) {
			var folder = $(this);
			
			e.preventDefault();
			e.stopPropagation();
			self._expandFolder(folder);
			self._bindFolder(folder);
		});
	}
});
