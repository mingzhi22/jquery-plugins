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
	    var o = this.options, self = this;
	        
		this._initSource();
		this._renderRoot();
	},

	_init: function() {
		var o = this.options, self = this;

		if(o.expandRoot) {
			var folder = this.root.find('.' + o.folderClassName);
			this._expandFolder(folder);
			this._bindFolder(folder);
		} else {
			this._initFolder(this.root);
		}
	},

	_initSource: function() {
		var o = this.options, source = o.source;
		if($.isFunction(source)) {
			this._load = source;
			return true;
		}
		if(typeof source === "string") {
			this._load = function(request, response) {
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
	    if(typeof child != "undefined") {
	        data.hasChild = ($.isArray(child) && child.length > 0);
	    }
		return data;
	},
	
	_renderRoot: function() {
		if(this.element.context.nodeName == "UL") {
			this.root = this.element;
		} else {
			this.root = $('<ul></ul>');
			this.element.append(this.root);
		}
		
		var o = this.options,
			rootData = o.rootData,
			root = this.root.addClass(o.rootClassName);
		
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
		this._trigger("itemRendering", null, {
			data: data
		});
	    
		data = this._normalize(data);

		var li = $('<li></li>').data("item.dynamictree", data),
		    o = this.options,
			folder, label;
		
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
		
		root.append(li); 
	},
	
	_expandFolder: function(folder) {
	    var o = this.options,
	        self = this,
	        parent = folder.addClass(o.loadingClassName).parent(),
	        item = parent.data('item.dynamictree');
	        
		this._load(item, function(data) {
			var tree = self._renderSubTree(parent, data);
			self._initFolder(tree);
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

	_initFolder: function(root) {
		var o = this.options, self = this;
			
		root.find('.' + o.folderClassName).one("click", function(e) {
			var folder = $(this);
			
			e.preventDefault();
			e.stopPropagation();
			self._expandFolder(folder);
			self._bindFolder(folder);
		});
	}
});
