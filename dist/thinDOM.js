/**
 * thindom - Inspired by jQuery, this simple library lets you create DOM elements really fast, with significantly more expressiveness than native DOM methods.
 * @version v1.0.10
 * @link https://github.com/somecallmechief/ThinDOM
 * @license Puclic Domain, CC0 (http://creativecommons.org/about/pdm)
 */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./src/ThinDOM.coffee":[function(require,module,exports){
(function (global){
var ThinDOM, append, attr, camelCase, css, data, getPropName, html, jQuery, prepend, prop, remove, removeMethod, text, thisGlobal, _, _append, _prepend;

_ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

jQuery = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);


/*
Capture the global object in order of: global, window, this
 */

thisGlobal = (typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this));


/*
Convert a hyphened-property to camelCaseProperty
 */

camelCase = (function() {
  var defaultRegex, ret, toUpper;
  toUpper = function(match, group1) {
    if (group1) {
      return group1.toUpperCase();
    } else {
      return '';
    }
  };
  defaultRegex = /[-_]+(.)?/g;
  ret = function(str, delimiters) {
    var regex;
    if (delemiters) {
      regex = new RegExp('[' + delimiters + ']+(.)?', 'g');
    } else {
      regex = defaultRegex;
    }
    return str.replace(regex, toUpper);
  };
  return ret;
})();


/*
Convenience method for adding props to objects
 */

prop = function(obj, name, value) {
  obj[name] = value;
  return obj;
};


/*
Capture the correct remove method for use when dropping nodes
 */

removeMethod = (function() {
  var el;
  if (typeof document !== 'undefined') {
    el = document.body;
    if (el.remove) {
      return 'remove';
    } else if (el.removeNode) {
      return 'removeNode';
    } else {
      return 'valueOf';
    }
  }
})();

_append = function(el, other) {
  return el.appendChild(other);
};


/*
Append one node to another
 */

append = function(self, other) {
  if (other.THINDOM) {
    _append(self.el, other.get());
  } else if (_.isElement(other)) {
    _append(self.el, other);
  } else if (other instanceof jQuery) {
    if (other.length > 1) {
      _.forEach(other, function(i, otherEl) {
        _append(self.el, otherEl);
      });
    } else {
      _append(self.el, other[0]);
    }
  }
  return self;
};

_prepend = function(el, other) {
  el.insertBefore(other, el.firstChild);
  return el;
};


/*
Prepend one node to the first child node position of another
 */

prepend = function(self, other) {
  if (other.THINDOM) {
    _prepend(self.el, other.get());
  } else if (_.isElement(other)) {
    _prepend(self.el, other);
  } else if (other instanceof jQuery) {
    if (other.length > 1) {
      _.forEach(other, function(i, otherEl) {
        _prepend(self.el, otherEl);
      });
    } else {
      _prepend(self.el, other[0]);
    }
  }
  return self;
};


/*
Drop a node
 */

remove = function(self) {
  self.el[removeMethod]();
};

getPropName = function(key) {
  var ret;
  ret = key;
  if (_.contains(key, '-')) {
    ret = camelCase(key);
  }
  return ret;
};


/*
Add styles
 */

css = function(self, properties, value) {
  if (_.isString(properties)) {
    return self.el.style[properties] = value;
  } else if (_.isPlainObject(properties)) {
    return _.forOwn(properties, function(val, key) {
      if (val !== '') {
        self.el.style[key] = val;
      }
    });
  }
};


/*
Add data props
per: http://jsperf.com/data-dataset/9
setAttribute is fastest
 */

data = function(self, properties, value) {
  if (_.isString(properties)) {
    if (false === (properties.indexOf('data-') === 0)) {
      properties = 'data-' + properties;
    }
    return attr(self, properties, value);
  } else if (_.isPlainObject(properties)) {
    return _.forOwn(properties, function(val, key) {
      if (false === (key.indexOf('data-') === 0)) {
        key = 'data-' + key;
      }
      attr(self, key, value);
    });
  }
};


/*
Set the inner HTML (slow)
 */

html = function(self, html) {
  var val;
  val = void 0;
  if (html == null) {
    val = self.el.innerHTML;
  } else {
    self.el.innerHTML = html;
    val = self;
  }
  return val;
};


/*
Add text node (fast)
 */

text = function(self, str) {
  var t, val;
  val = void 0;
  if (!str) {
    val = self.el.innerHTML;
  } else {
    t = document.createTextNode(str);
    self.el.appendChild(t);
    val = self;
  }
  return val;
};


/*
Set props on the node
 */

attr = function(self, properties, value) {
  if (_.isString(properties)) {
    self.el.setAttribute(properties, value);
  } else if (_.isObject(properties)) {
    _.forOwn(properties, function(val, key) {
      if (val !== '') {
        self.el.setAttribute(key, val);
      }
    });
  }
  return self;
};


/*
A little thin DOM wrapper with chaining
 */

ThinDOM = function(tag, attributes, el) {
  var ret;
  if (el == null) {
    el = null;
  }
  ret = {};
  ret.THINDOM = 'THINDOM';
  ret.el = el || document.createElement(tag);
  ret.add = function(name, val) {
    return prop(ret, name, val);
  };

  /*
  Append one element to another
   */
  ret.append = function(other) {
    return append(ret, other);
  };

  /*
  Prepend one element to another
   */
  ret.prepend = function(other) {
    return prepend(ret, other);
  };

  /*
  Remove the element
   */
  ret.remove = function() {
    return remove(ret);
  };

  /*
  Set the element's style attributes
   */
  ret.css = function(properties, value) {
    return css(ret, properties, value);
  };

  /*
  Set the inner HTML of the element.
   */
  ret.html = function(html_content) {
    return html(ret, html_content);
  };

  /*
  Set the inner text of the element as a Text Node
   */
  ret.text = function(str) {
    return text(ret, str);
  };

  /*
  Set attributes on the element
   */
  ret.attr = function(properties, value) {
    return attr(ret, properties, value);
  };

  /*
  Get the HTML Element
   */
  ret.get = function() {
    return ret.el;
  };
  if (attributes) {
    ret.attr(attributes);
  }
  return ret;
};

thisGlobal.ThinDOM = ThinDOM;

module.exports = ThinDOM;



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},["./src/ThinDOM.coffee"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiQzpcXEdpdGh1YlxcdGhpbmRvbVxcc3JjXFxUaGluRE9NLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUEsbUpBQUE7O0FBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSLENBQUosQ0FBQTs7QUFBQSxNQUNBLEdBQVMsT0FBQSxDQUFRLFFBQVIsQ0FEVCxDQUFBOztBQUdBO0FBQUE7O0dBSEE7O0FBQUEsVUFNQSxHQUFhLENBQUksTUFBQSxDQUFBLE1BQUEsS0FBbUIsV0FBbkIsSUFBbUMsTUFBdEMsR0FBa0QsTUFBbEQsR0FBK0QsQ0FBSSxNQUFBLENBQUEsTUFBQSxLQUFtQixXQUF0QixHQUF1QyxNQUF2QyxHQUFtRCxJQUFwRCxDQUFoRSxDQU5iLENBQUE7O0FBUUE7QUFBQTs7R0FSQTs7QUFBQSxTQVdBLEdBQVksQ0FBQyxTQUFBLEdBQUE7QUFDWCxNQUFBLDBCQUFBO0FBQUEsRUFBQSxPQUFBLEdBQVUsU0FBQyxLQUFELEVBQVEsTUFBUixHQUFBO0FBQ1IsSUFBQSxJQUFHLE1BQUg7YUFBZSxNQUFNLENBQUMsV0FBUCxDQUFBLEVBQWY7S0FBQSxNQUFBO2FBQXlDLEdBQXpDO0tBRFE7RUFBQSxDQUFWLENBQUE7QUFBQSxFQUdBLFlBQUEsR0FBZSxZQUhmLENBQUE7QUFBQSxFQUlBLEdBQUEsR0FBTSxTQUFDLEdBQUQsRUFBTSxVQUFOLEdBQUE7QUFDSixRQUFBLEtBQUE7QUFBQSxJQUFBLElBQUcsVUFBSDtBQUFtQixNQUFBLEtBQUEsR0FBWSxJQUFBLE1BQUEsQ0FBTyxHQUFBLEdBQU0sVUFBTixHQUFtQixRQUExQixFQUFvQyxHQUFwQyxDQUFaLENBQW5CO0tBQUEsTUFBQTtBQUE0RSxNQUFBLEtBQUEsR0FBUSxZQUFSLENBQTVFO0tBQUE7V0FDQSxHQUFHLENBQUMsT0FBSixDQUFZLEtB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OztLQXRDQTtBQUFBLEVBeUNBLEdBQUcsQ0FBQyxJQUFKLEdBQVcsU0FBQyxHQUFELEdBQUE7V0FDVCxJQUFBLENBQUssR0FBTCxFQUFVLEdBQVYsRUFEUztFQUFBLENBekNYLENBQUE7QUE0Q0E7QUFBQTs7S0E1Q0E7QUFBQSxFQStDQSxHQUFHLENBQUMsSUFBSixHQUFXLFNBQUMsVUFBRCxFQUFhLEtBQWIsR0FBQTtXQUNULElBQUEsQ0FBSyxHQUFMLEVBQVUsVUFBVixFQUFzQixLQUF0QixFQURTO0VBQUEsQ0EvQ1gsQ0FBQTtBQWtEQTtBQUFBOztLQWxEQTtBQUFBLEVBcURBLEdBQUcsQ0FBQyxHQUFKLEdBQVUsU0FBQSxHQUFBO1dBQ1IsR0FBRyxDQUFDLEdBREk7RUFBQSxDQXJEVixDQUFBO0FBd0RBLEVBQUEsSUFBRyxVQUFIO0FBQW1CLElBQUEsR0FBRyxDQUFDLElBQUosQ0FBUyxVQUFULENBQUEsQ0FBbkI7R0F4REE7U0F5REEsSUExRFE7QUFBQSxDQXhLVixDQUFBOztBQUFBLFVBcU9VLENBQUMsT0FBWCxHQUFxQixPQXJPckIsQ0FBQTs7QUFBQSxNQXVPTSxDQUFDLE9BQVAsR0FBaUIsT0F2T2pCLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXyA9IHJlcXVpcmUgJ2xvZGFzaCdcclxualF1ZXJ5ID0gcmVxdWlyZSAnanF1ZXJ5J1xyXG5cclxuIyMjXHJcbkNhcHR1cmUgdGhlIGdsb2JhbCBvYmplY3QgaW4gb3JkZXIgb2Y6IGdsb2JhbCwgd2luZG93LCB0aGlzXHJcbiMjI1xyXG50aGlzR2xvYmFsID0gKGlmIHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsIHRoZW4gZ2xvYmFsIGVsc2UgKChpZiB0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkpXHJcblxyXG4jIyNcclxuQ29udmVydCBhIGh5cGhlbmVkLXByb3BlcnR5IHRvIGNhbWVsQ2FzZVByb3BlcnR5XHJcbiMjI1xyXG5jYW1lbENhc2UgPSAoLT5cclxuICB0b1VwcGVyID0gKG1hdGNoLCBncm91cDEpIC0+XHJcbiAgICBpZiBncm91cDEgdGhlbiBncm91cDEudG9VcHBlckNhc2UoKSBlbHNlICcnXHJcbiAgICBcclxuICBkZWZhdWx0UmVnZXggPSAvWy1fXSsoLik/L2dcclxuICByZXQgPSAoc3RyLCBkZWxpbWl0ZXJzKSAtPlxyXG4gICAgaWYgZGVsZW1pdGVycyB0aGVuIHJlZ2V4ID0gbmV3IFJlZ0V4cCAnWycgKyBkZWxpbWl0ZXJzICsgJ10rKC4pPycsICdnJyBlbHNlIHJlZ2V4ID0gZGVmYXVsdFJlZ2V4XHJcbiAgICBzdHIucmVwbGFjZSByZWdleCwgdG9VcHBlclxyXG4gIHJldFxyXG4pKClcclxuXHJcbiMjI1xyXG5Db252ZW5pZW5jZSBtZXRob2QgZm9yIGFkZGluZyBwcm9wcyB0byBvYmplY3RzXHJcbiMjI1xyXG5wcm9wID0gKG9iaiwgbmFtZSwgdmFsdWUpIC0+XHJcbiAgb2JqW25hbWVdID0gdmFsdWVcclxuICBvYmpcclxuXHJcbiMjI1xyXG5DYXB0dXJlIHRoZSBjb3JyZWN0IHJlbW92ZSBtZXRob2QgZm9yIHVzZSB3aGVuIGRyb3BwaW5nIG5vZGVzXHJcbiMjI1xyXG5yZW1vdmVNZXRob2QgPSAoLT5cclxuICBpZiB0eXBlb2YgZG9jdW1lbnQgaXNudCAndW5kZWZpbmVkJ1xyXG4gICAgZWwgPSBkb2N1bWVudC5ib2R5XHJcbiAgICBpZiBlbC5yZW1vdmVcclxuICAgICAgJ3JlbW92ZSdcclxuICAgIGVsc2UgaWYgZWwucmVtb3ZlTm9kZVxyXG4gICAgICAncmVtb3ZlTm9kZSdcclxuICAgIGVsc2VcclxuICAgICAgJ3ZhbHVlT2YnXHJcbikoKVxyXG5cclxuX2FwcGVuZCA9IChlbCwgb3RoZXIpIC0+XHJcbiAgZWwuYXBwZW5kQ2hpbGQgb3RoZXJcclxuXHJcbiMjI1xyXG5BcHBlbmQgb25lIG5vZGUgdG8gYW5vdGhlclxyXG4jIyNcclxuYXBwZW5kID0gKHNlbGYsIG90aGVyKSAtPlxyXG4gIGlmIG90aGVyLlRISU5ET01cclxuICAgIF9hcHBlbmQgc2VsZi5lbCwgb3RoZXIuZ2V0KClcclxuICBlbHNlIGlmIF8uaXNFbGVtZW50IG90aGVyIFxyXG4gICAgX2FwcGVuZCBzZWxmLmVsLCBvdGhlclxyXG4gIGVsc2UgaWYgb3RoZXIgaW5zdGFuY2VvZiBqUXVlcnlcclxuICBcdGlmIG90aGVyLmxlbmd0aCA+IDFcclxuICBcdCAgXy5mb3JFYWNoIG90aGVyLCAoaSwgb3RoZXJFbCkgLT5cclxuICBcdFx0ICBfYXBwZW5kIHNlbGYuZWwsIG90aGVyRWxcclxuICBcdFx0ICByZXR1cm5cclxuICBcdGVsc2VcclxuICBcdCAgX2FwcGVuZCBzZWxmLmVsLCBvdGhlclswXVxyXG4gIHNlbGZcclxuXHJcbl9wcmVwZW5kID0gKGVsLCBvdGhlcikgLT5cclxuICBlbC5pbnNlcnRCZWZvcmUgb3RoZXIsIGVsLmZpcnN0Q2hpbGRcclxuICBlbFxyXG4gIFxyXG4jIyNcclxuUHJlcGVuZCBvbmUgbm9kZSB0byB0aGUgZmlyc3QgY2hpbGQgbm9kZSBwb3NpdGlvbiBvZiBhbm90aGVyXHJcbiMjI1xyXG5wcmVwZW5kID0gKHNlbGYsIG90aGVyKSAtPlxyXG4gIGlmIG90aGVyLlRISU5ET01cclxuICAgIF9wcmVwZW5kIHNlbGYuZWwsIG90aGVyLmdldCgpXHJcbiAgZWxzZSBpZiBfLmlzRWxlbWVudCBvdGhlciBcclxuXHQgIF9wcmVwZW5kIHNlbGYuZWwsIG90aGVyICBcclxuICBlbHNlIGlmIG90aGVyIGluc3RhbmNlb2YgalF1ZXJ5XHJcbiAgICBpZiBvdGhlci5sZW5ndGggPiAxXHJcbiAgICAgIF8uZm9yRWFjaCBvdGhlciwgKGksIG90aGVyRWwpIC0+XHJcbiAgICAgICAgX3ByZXBlbmQgc2VsZi5lbCwgb3RoZXJFbFxyXG4gICAgICAgIHJldHVyblxyXG4gICAgZWxzZVxyXG4gICAgICBfcHJlcGVuZCBzZWxmLmVsLCBvdGhlclswXVxyXG4gIHNlbGYgIFxyXG4gIFxyXG4jIyNcclxuRHJvcCBhIG5vZGVcclxuIyMjXHJcbnJlbW92ZSA9IChzZWxmKSAtPlxyXG4gIHNlbGYuZWxbcmVtb3ZlTWV0aG9kXSgpXHJcbiAgcmV0dXJuXHJcblxyXG5nZXRQcm9wTmFtZSA9IChrZXkpIC0+XHJcbiAgcmV0ID0ga2V5XHJcbiAgaWYgXy5jb250YWlucyBrZXksICctJ1xyXG4gICAgcmV0ID0gY2FtZWxDYXNlIGtleVxyXG4gIHJldCAgXHJcblxyXG4jIyNcclxuQWRkIHN0eWxlc1xyXG4jIyNcclxuY3NzID0gKHNlbGYsIHByb3BlcnRpZXMsIHZhbHVlKSAtPlxyXG4gIGlmIF8uaXNTdHJpbmcgcHJvcGVydGllc1xyXG4gICAgc2VsZi5lbC5zdHlsZVtwcm9wZXJ0aWVzXSA9IHZhbHVlXHJcbiAgZWxzZSBpZiBfLmlzUGxhaW5PYmplY3QgcHJvcGVydGllc1xyXG4gICAgXy5mb3JPd24gcHJvcGVydGllcywgKHZhbCwga2V5KSAtPlxyXG4gICAgICBpZiB2YWwgaXNudCAnJ1xyXG4gICAgICAgIHNlbGYuZWwuc3R5bGVba2V5XSA9IHZhbFxyXG4gICAgICByZXR1cm5cclxuXHJcbiMjI1xyXG5BZGQgZGF0YSBwcm9wc1xyXG5wZXI6IGh0dHA6Ly9qc3BlcmYuY29tL2RhdGEtZGF0YXNldC85XHJcbnNldEF0dHJpYnV0ZSBpcyBmYXN0ZXN0XHJcbiMjI1xyXG5kYXRhID0gKHNlbGYsIHByb3BlcnRpZXMsIHZhbHVlKSAtPlxyXG4gIGlmIF8uaXNTdHJpbmcgcHJvcGVydGllc1xyXG4gICAgaWYgZmFsc2UgaXMgKHByb3BlcnRpZXMuaW5kZXhPZignZGF0YS0nKSBpcyAwKVxyXG4gICAgICBwcm9wZXJ0aWVzID0gJ2RhdGEtJyArIHByb3BlcnRpZXNcclxuICAgIGF0dHIgc2VsZiwgcHJvcGVydGllcywgdmFsdWVcclxuICBlbHNlIGlmIF8uaXNQbGFpbk9iamVjdCBwcm9wZXJ0aWVzXHJcbiAgICBfLmZvck93biBwcm9wZXJ0aWVzLCAodmFsLCBrZXkpIC0+XHJcbiAgICAgIGlmIGZhbHNlIGlzIChrZXkuaW5kZXhPZignZGF0YS0nKSBpcyAwKVxyXG4gICAgICAgIGtleSA9ICdkYXRhLScgKyBrZXlcclxuICAgICAgYXR0ciBzZWxmLCBrZXksIHZhbHVlXHJcbiAgICAgIHJldHVyblxyXG5cclxuIyMjXHJcblNldCB0aGUgaW5uZXIgSFRNTCAoc2xvdylcclxuIyMjXHJcbmh0bWwgPSAoc2VsZiwgaHRtbCkgLT5cclxuICB2YWwgPSB1bmRlZmluZWRcclxuICB1bmxlc3MgaHRtbD9cclxuICAgIHZhbCA9IHNlbGYuZWwuaW5uZXJIVE1MXHJcbiAgZWxzZVxyXG4gICAgc2VsZi5lbC5pbm5lckhUTUwgPSBodG1sXHJcbiAgICB2YWwgPSBzZWxmXHJcbiAgdmFsXHJcblxyXG4jIyNcclxuQWRkIHRleHQgbm9kZSAoZmFzdClcclxuIyMjXHJcbnRleHQgPSAoc2VsZiwgc3RyKSAtPlxyXG4gIHZhbCA9IHVuZGVmaW5lZFxyXG4gIHVubGVzcyBzdHJcclxuICAgIHZhbCA9IHNlbGYuZWwuaW5uZXJIVE1MXHJcbiAgZWxzZVxyXG4gICAgdCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHN0cilcclxuICAgIHNlbGYuZWwuYXBwZW5kQ2hpbGQgdFxyXG4gICAgdmFsID0gc2VsZlxyXG4gIHZhbFxyXG5cclxuIyMjXHJcblNldCBwcm9wcyBvbiB0aGUgbm9kZSBcclxuIyMjXHJcbmF0dHIgPSAoc2VsZiwgcHJvcGVydGllcywgdmFsdWUpIC0+XHJcbiAgaWYgXy5pc1N0cmluZyhwcm9wZXJ0aWVzKVxyXG4gICAgc2VsZi5lbC5zZXRBdHRyaWJ1dGUgcHJvcGVydGllcywgdmFsdWVcclxuICBlbHNlIGlmIF8uaXNPYmplY3QocHJvcGVydGllcylcclxuICAgIF8uZm9yT3duIHByb3BlcnRpZXMsICh2YWwsIGtleSkgLT5cclxuICAgICAgaWYgdmFsIGlzbnQgJydcclxuICAgICAgICBzZWxmLmVsLnNldEF0dHJpYnV0ZSBrZXksIHZhbFxyXG4gICAgICByZXR1cm5cclxuXHJcbiAgc2VsZlxyXG4gIFxyXG4jIyNcclxuQSBsaXR0bGUgdGhpbiBET00gd3JhcHBlciB3aXRoIGNoYWluaW5nXHJcbiMjI1xyXG5UaGluRE9NID0gKHRhZywgYXR0cmlidXRlcywgZWwgPSBudWxsKSAtPlxyXG4gIHJldCA9IHt9IFxyXG4gIFxyXG4gIHJldC5USElORE9NID0gJ1RISU5ET00nXHJcbiAgXHJcbiAgcmV0LmVsID0gZWwgb3IgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpXHJcbiAgcmV0LmFkZCA9IChuYW1lLCB2YWwpIC0+XHJcbiAgICBwcm9wIHJldCwgbmFtZSwgdmFsXHJcbiAgXHJcbiAgIyMjXHJcbiAgQXBwZW5kIG9uZSBlbGVtZW50IHRvIGFub3RoZXJcclxuICAjIyNcclxuICByZXQuYXBwZW5kID0gKG90aGVyKSAtPlxyXG4gICAgYXBwZW5kIHJldCwgb3RoZXJcclxuICBcclxuICAjIyNcclxuICBQcmVwZW5kIG9uZSBlbGVtZW50IHRvIGFub3RoZXJcclxuICAjIyNcclxuICByZXQucHJlcGVuZCA9IChvdGhlcikgLT5cclxuICAgIHByZXBlbmQgcmV0LCBvdGhlclxyXG4gIFxyXG4gICMjI1xyXG4gIFJlbW92ZSB0aGUgZWxlbWVudFxyXG4gICMjI1xyXG4gIHJldC5yZW1vdmUgPSAtPlxyXG4gICAgcmVtb3ZlIHJldFxyXG4gIFxyXG4gICMjI1xyXG4gIFNldCB0aGUgZWxlbWVudCdzIHN0eWxlIGF0dHJpYnV0ZXNcclxuICAjIyNcclxuICByZXQuY3NzID0gKHByb3BlcnRpZXMsIHZhbHVlKSAtPlxyXG4gICAgY3NzIHJldCwgcHJvcGVydGllcywgdmFsdWVcclxuXHJcbiAgIyMjXHJcbiAgU2V0IHRoZSBpbm5lciBIVE1MIG9mIHRoZSBlbGVtZW50LlxyXG4gICMjI1xyXG4gIHJldC5odG1sID0gKGh0bWxfY29udGVudCkgLT5cclxuICAgIGh0bWwgcmV0LCBodG1sX2NvbnRlbnRcclxuICBcclxuICAjIyNcclxuICBTZXQgdGhlIGlubmVyIHRleHQgb2YgdGhlIGVsZW1lbnQgYXMgYSBUZXh0IE5vZGVcclxuICAjIyNcclxuICByZXQudGV4dCA9IChzdHIpIC0+XHJcbiAgICB0ZXh0IHJldCwgc3RyXHJcbiAgICBcclxuICAjIyNcclxuICBTZXQgYXR0cmlidXRlcyBvbiB0aGUgZWxlbWVudFxyXG4gICMjI1xyXG4gIHJldC5hdHRyID0gKHByb3BlcnRpZXMsIHZhbHVlKSAtPlxyXG4gICAgYXR0ciByZXQsIHByb3BlcnRpZXMsIHZhbHVlXHJcbiAgXHJcbiAgIyMjXHJcbiAgR2V0IHRoZSBIVE1MIEVsZW1lbnRcclxuICAjIyNcclxuICByZXQuZ2V0ID0gLT5cclxuICAgIHJldC5lbFxyXG4gIFxyXG4gIGlmIGF0dHJpYnV0ZXMgdGhlbiByZXQuYXR0ciBhdHRyaWJ1dGVzXHJcbiAgcmV0XHJcblxyXG4jIGV4cG9ydCBUaGluRG9tIHRvIHRoZSBnbG9iYWwgb2JqZWN0ICBcclxudGhpc0dsb2JhbC5UaGluRE9NID0gVGhpbkRPTVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUaGluRE9NXHJcbiJdfQ==
