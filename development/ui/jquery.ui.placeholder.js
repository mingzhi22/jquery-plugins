$.widget("ui.placeholder", {
    options: {
        classname: "placeholder"
    },
    
    // 向input中插入占位符
    _simulate: function() {
        var elem = this.element,
            placeholder = elem.attr("placeholder");
            
        if(elem.val() == "") {
	        elem.addClass(this.options.classname);
	        elem.val(placeholder);
        }
    },
    
    // 去掉input中的占位符
    _revert: function() {
        var elem = this.element,
            placeholder = elem.attr("placeholder");
            
        if(elem.val() == placeholder) {
	        elem.removeClass(this.options.classname);
	        elem.val("");
        }
    },
    
    _init: function() {
        if(this.supported) {
            return false;
        } else {
            var self = this;
            this._revert(); 
	        this._simulate();	        
            this.element
                .bind("focus.placeholder", function() { self._revert() })
                .bind("blur.placeholder", function() { self._simulate() })
                .closest("form")
                .bind("submit.placeholder", function() { self._revert() });
        }
    },
    
    destroy: function() {
        this._revert();
        this.element.unbind(".placeholder")
            .closest("form").unbind(".placeholder");
        $.Widget.prototype.destroy.call(this);
    },	
        
    getValue: function() {
        var elem = this.element;
        if(this.supported) {
            return elem.val();
        } else {
            return elem.attr("placeholder") == elem.val() ? '' : elem.val();
        }
    }
});

$.extend($.ui.placeholder.prototype, {
    supported: "placeholder" in document.createElement("input")
});
