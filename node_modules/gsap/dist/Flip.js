(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = global || self, factory(global.window = global.window || {}));
}(this, (function (exports) { 'use strict';

	/*!
	 * EasePack 3.6.0
	 * https://greensock.com
	 *
	 * @license Copyright 2008-2020, GreenSock. All rights reserved.
	 * Subject to the terms at https://greensock.com/standard-license or for
	 * Club GreenSock members, the agreement issued with that membership.
	 * @author: Jack Doyle, jack@greensock.com
	*/
	var _id = 1,
	    _toArray,
	    gsap,
	    _getMatrix,
	    _abs = Math.abs,
	    _lookup = {},
	    _emptyObj = {},
	    _callbacks = "onStart,onUpdate,onComplete,onReverseComplete,onInterrupt".split(","),
	    _removeProps = "transform,transformOrigin,width,height,position,top,left".split(","),
	    _getEl = function _getEl(target) {
	  return _toArray(target)[0] || console.warn("Element not found:", target);
	},
	    _find = function _find(context) {
	  return _toArray(_getEl(context || document.body).querySelectorAll("[data-flip-id]"));
	},
	    _toggleClass = function _toggleClass(targets, className, action) {
	  return targets.forEach(function (el) {
	    return el.classList[action](className);
	  });
	},
	    _reserved = {
	  change: 1,
	  to: 1,
	  from: 1,
	  targets: 1,
	  toggleClass: 1,
	  onComplete: 1,
	  onUpdate: 1,
	  onInterrupt: 1,
	  onStart: 1,
	  delay: 1,
	  scale: 1,
	  context: 1,
	  swap: 1,
	  absolute: 1,
	  props: 1,
	  onEnter: 1,
	  onLeave: 1,
	  custom: 1,
	  paused: 1,
	  nested: 1
	},
	    _fitReserved = {
	  scale: 1,
	  absolute: 1,
	  fitChild: 1,
	  getVars: 1
	},
	    _removeElement = function _removeElement(el) {
	  return el.parentNode && el.parentNode.removeChild(el);
	},
	    _camelToDashed = function _camelToDashed(p) {
	  return p.replace(/([A-Z])/g, "-$1").toLowerCase();
	},
	    _fixProps = function _fixProps(data) {
	  return typeof data.props === "string" && (data.props = data.props.split(" ").join("").split(","));
	},
	    _copy = function _copy(obj, exclude) {
	  var result = {},
	      p;

	  for (p in obj) {
	    exclude[p] || (result[p] = obj[p]);
	  }

	  return result;
	},
	    _finalState = function _finalState(targets, state, onlyTransforms, elementsToRemove) {
	  var i = targets.length,
	      style,
	      j,
	      props;

	  while (i--) {
	    if (!onlyTransforms) {
	      style = targets[i].style;
	      props = state[i].rp;
	      j = props.length;

	      while (j--) {
	        style.removeProperty(props[j]);
	      }

	      props = state[i].sp;

	      for (j = 0; j < props.length; j += 2) {
	        style[props[j]] = props[j + 1];
	      }
	    }

	    targets[i]._gsap.uncache = 1;
	  }

	  elementsToRemove && elementsToRemove.forEach(_removeElement);
	},
	    _mergeReserved = function _mergeReserved(data, toMerge) {
	  for (var p in toMerge) {
	    _reserved[p] && (data[p] = toMerge[p]);
	  }

	  _fixProps(data);

	  return data;
	},
	    _makeAbsolute = function _makeAbsolute(elements, state, result) {
	  for (var i = 0; i < elements.length; i++) {
	    var el = elements[i],
	        s = state[i],
	        b = void 0,
	        o = void 0,
	        style = el.style;
	    el.parentNode || s.p && s.p.appendChild(el);
	    gsap.getProperty(el, "display") === "none" && (style.display = s.d);
	    style.position = "absolute";
	    style.width = s.w + "px";
	    style.height = s.h + "px";
	    style.top || (style.top = "0px");
	    style.left || (style.left = "0px");
	    b = el.getBoundingClientRect();
	    o = {
	      x: s.l - b.left,
	      y: s.t - b.top
	    };
	    gsap.set(el, {
	      x: "+=" + o.x,
	      y: "+=" + o.y
	    });
	    result && (result[i] = o);
	  }

	  return result;
	},
	    _DEG2RAD = Math.PI / 180,
	    _setRotation = function _setRotation(cache, rotation) {
	  return (cache.rotation = rotation + "deg") && cache.renderTransform(1, cache);
	},
	    _getRotatedDimensions = function _getRotatedDimensions(before, child) {
	  return function (el, i) {
	    var getProp = gsap.getProperty(el),
	        getChildProp = child ? gsap.getProperty(child) : getProp,
	        r = getProp("rotation"),
	        changeRotation = before && r !== before[i].r,
	        angle = (changeRotation ? before[i].r : r) * _DEG2RAD,
	        cache = el._gsap,
	        result,
	        b,
	        w,
	        h;
	    changeRotation && _setRotation(cache, before[i].r);
	    b = (child || el).getBoundingClientRect();
	    result = {
	      el: el,
	      d: getProp("display"),
	      cos: angle ? _abs(Math.cos(angle)) : 1,
	      sin: angle ? _abs(Math.sin(angle)) : 0,
	      p: el.parentNode,
	      x: getProp("x"),
	      y: getProp("y"),
	      sx: cache.scaleX,
	      sy: cache.scaleY,
	      l: b.left,
	      t: b.top,
	      w: Math.ceil(parseFloat(getChildProp("width", "px"))),
	      h: parseFloat(getChildProp("height", "px")),
	      bw: b.width,
	      bh: b.height,
	      o: getProp("opacity"),
	      r: r,
	      rx: 0,
	      ry: 0,
	      origin: (getComputedStyle(el).transformOrigin || "0 0").split(" ").map(parseFloat)
	    };

	    if (child) {
	      b = _getMatrix(child);
	      w = result.w;
	      h = result.h;
	      result.w = w * _abs(b[0]) + _abs(b[2]) * h;
	      result.h = w * _abs(b[1]) + _abs(b[3]) * h;
	    }

	    changeRotation && _setRotation(cache, r);
	    return result;
	  };
	},
	    _getDimensions = _getRotatedDimensions(),
	    _updateAfterBounds = function _updateAfterBounds(before, after) {
	  var i = after.length,
	      style,
	      a,
	      bounds,
	      r,
	      cache;

	  while (i--) {
	    a = after[i];
	    style = a.el.style;
	    style.width = _getWidth(before[i], a) + "px";
	    style.height = _getHeight(before[i], a) + "px";
	    r = before[i].r;
	    cache = a.el._gsap;
	    r && _setRotation(cache, r);
	    bounds = a.el.getBoundingClientRect();
	    a.l = bounds.left;
	    a.t = bounds.top;
	    style.width = a.w + "px";
	    style.height = a.h + "px";
	    r && _setRotation(cache, a.r);
	  }
	},
	    _getNestedOffsets = function _getNestedOffsets(el, property, flipTimeline) {
	  var value = 0,
	      lookup = flipTimeline._flipProps;

	  while (el) {
	    if (el._flip === flipTimeline) {
	      value += lookup[property](el._flipI) - gsap.getProperty(el, property);
	    }

	    el = el.parentNode;
	  }

	  return value;
	},
	    _getOriginOffsetX = function _getOriginOffsetX(b, a) {
	  return (b.w * b.sx / (a.w * a.sx) * a.sx - a.sx) * a.origin[0];
	},
	    _getOriginOffsetY = function _getOriginOffsetY(b, a) {
	  return (b.h * b.sy / (a.h * a.sy) * a.sy - a.sy) * a.origin[1];
	},
	    _getX = function _getX(b, a, scale, offset, nested) {
	  return a.x + b.l - a.l + (scale ? _getOriginOffsetX(b, a) * a.cos + _getOriginOffsetY(b, a) * a.sin : 0) + offset - (nested ? _getNestedOffsets(a.p, "x", nested) : 0);
	},
	    _getY = function _getY(b, a, scale, offset, nested) {
	  return a.y + b.t - a.t + (scale ? _getOriginOffsetY(b, a) * a.cos + _getOriginOffsetX(b, a) * a.sin : 0) + offset - (nested ? _getNestedOffsets(a.p, "y", nested) : 0);
	},
	    _getScaleX = function _getScaleX(b, a) {
	  return b.sx * b.w / a.w;
	},
	    _getScaleY = function _getScaleY(b, a) {
	  return b.sy * b.h / a.h;
	},
	    _getWidth = function _getWidth(b, a) {
	  return b.w * b.sx / a.sx;
	},
	    _getHeight = function _getHeight(b, a) {
	  return b.h * b.sy / a.sy;
	},
	    _pluckTransitioning = function _pluckTransitioning(elements, transitioning, before, after, callback, tl, useBefore) {
	  if (transitioning.length) {
	    var state = useBefore ? before : after,
	        recordedStates = [],
	        i,
	        index,
	        el;

	    for (i = 0; i < transitioning.length; i++) {
	      el = transitioning[i];
	      index = elements.indexOf(el);

	      if (~index) {
	        useBefore || before[index].d === "none" && (el.style.display = after[index].d);
	        recordedStates.push(state[index]);
	        elements.splice(index, 1);
	        before.splice(index, 1);
	        after.splice(index, 1);
	      } else {
	        recordedStates.push(_getDimensions(el));
	      }
	    }

	    callback && tl.add(callback(transitioning, function () {
	      return _makeAbsolute(transitioning, recordedStates) || transitioning;
	    }), 0);
	  }
	};

	var Flip = function () {
	  function Flip(config) {
	    var self = this,
	        vars = self.vars = config || {},
	        d = self._data = _copy(vars, _emptyObj),
	        change = vars.change = d.to || d.from || d.change;

	    "id" in d && (_lookup[d.id] = self);

	    _fixProps(d);

	    self.animation = gsap.timeline({
	      paused: true
	    });
	    self.animation._flipAnims = [];
	    self.record(d.targets);
	    change && self.to(vars, !!d.from);
	  }

	  var _proto = Flip.prototype;

	  _proto.record = function record(targets) {
	    var _this = this;

	    this.targets = targets = targets ? _toArray(targets) : this.targets || _find(this.vars.context);
	    var d = this._data,
	        before = d.before = targets.map(_getDimensions),
	        props = d.props;
	    d.idLookup = {};
	    d.opacity = [];
	    d.entering = [];
	    d.after = before;
	    targets.forEach(function (el, i) {
	      var id = el.getAttribute("data-flip-id"),
	          tl = el._flip;
	      id || el.setAttribute("data-flip-id", id = "" + _id++);

	      if (tl && tl.progress() < 1 && !tl.paused()) {
	        tl.progress(1);
	        tl._flipAnims && tl._flipAnims.forEach(function (a) {
	          return a.kill();
	        });
	      }

	      el._flip = _this.animation;
	      d.idLookup[id] = before[i];
	      d.opacity[i] = before[i].o;
	      (before[i].d === "none" || !before[i].p) && d.entering.push(el);

	      if (props) {
	        var getProp = gsap.getProperty(el, null, "native"),
	            obj = before[i].props = {};
	        i = props.length;

	        while (i--) {
	          obj[props[i]] = (getProp(props[i]) + "").trim();
	        }

	        obj.zIndex && (obj.zIndex = parseFloat(obj.zIndex) || 0);
	      }
	    });
	    return this;
	  };

	  _proto.measure = function measure() {
	    var self = this,
	        d = self._data,
	        swapIn = d.swapIn = [],
	        swapOut = d.swapOut = [],
	        after = d.after = [],
	        entering = d.entering,
	        idLookup = d.idLookup,
	        before = d.before,
	        opacity = d.opacity,
	        context = d.context,
	        swap = d.swap,
	        props = d.props,
	        targets = self.targets,
	        fade = swap === "fade",
	        id,
	        el,
	        state,
	        all,
	        i,
	        removeProps,
	        style,
	        dashed,
	        saveProps,
	        getDimensions;

	    if (context || swap) {
	      all = _find(context);

	      for (i = 0; i < all.length; i++) {
	        el = all[i];
	        id = el.getAttribute("data-flip-id");
	        state = idLookup[id];

	        if (!state) {
	          entering.push(el);
	        } else if (swap !== false && state.el !== el) {
	          targets.push(el);
	          before.push(state);
	          swapIn.push(el);
	          swapOut.push(state.el);
	          el._flip = self.animation;

	          if (fade) {
	            opacity.push(0);
	            state.el.style.opacity = "0";
	          }
	        }
	      }
	    }

	    all = _removeProps;
	    props && (all = all.concat(props));
	    dashed = all.map(_camelToDashed);
	    getDimensions = _getRotatedDimensions(props && ~props.indexOf("rotation") && before);

	    for (i = 0; i < targets.length; i++) {
	      el = targets[i];
	      after[i] = getDimensions(el, i);
	      id = all.length;
	      removeProps = after[i].rp = before[i].rp = [];
	      saveProps = after[i].sp = before[i].sp = [];
	      style = el.style;

	      while (id--) {
	        style[all[id]] || style.getPropertyValue(all[id]) ? saveProps.push(all[id], style[all[id]]) : removeProps.push(dashed[id]);
	      }
	    }

	    self.measured = true;
	    return self;
	  };

	  _proto.to = function to(config, runBackwards) {
	    config = config || this.vars;

	    var self = this,
	        d = _mergeReserved(self._data, config),
	        changeResult = config.change && config.change(self),
	        targets = self.targets,
	        measured = self.measured,
	        animation = self.animation,
	        measureResult = measured || self.measure(),
	        _config = config,
	        onEnter = _config.onEnter,
	        onLeave = _config.onLeave,
	        absolute = _config.absolute,
	        nested = _config.nested,
	        custom = _config.custom,
	        delay = _config.delay,
	        paused = _config.paused,
	        toggleClass = _config.toggleClass,
	        entering = d.entering,
	        before = d.before,
	        opacity = d.opacity,
	        swapOut = d.swapOut,
	        swapIn = d.swapIn,
	        after = d.after,
	        props = d.props,
	        swap = d.swap,
	        scale = "scale" in config ? config.scale : d.scale,
	        tweenVars = d.tweenVars = _copy(config, _reserved),
	        addFunc = animation[runBackwards ? "to" : "from"],
	        remove = function remove() {
	      return swapOut.forEach(_removeElement);
	    },
	        remainingProps = tweenVars,
	        fade = swap === "fade",
	        animateRotation = props && ~props.indexOf("rotation"),
	        index,
	        i,
	        x,
	        y,
	        width,
	        height,
	        scaleX,
	        scaleY,
	        v,
	        offsets,
	        leaving,
	        p,
	        endTime;

	    props && props.forEach(function (p) {
	      return tweenVars[p] = function (i) {
	        return console.log(i, "get", before[i].props[p]) || before[i].props[p];
	      };
	    });
	    animation.clear();

	    _pluckTransitioning(targets, entering, before, after, onEnter, animation);

	    if (onLeave) {
	      leaving = [];
	      i = targets.length;

	      while (i--) {
	        (after[i].d === "none" || !after[i].p) && leaving.push(targets[i]);
	      }

	      _pluckTransitioning(targets, leaving, before, after, onLeave, animation, true);
	    }

	    absolute && (offsets = _makeAbsolute(targets, after, []));

	    if (scale) {
	      tweenVars.scaleX = scaleX = function scaleX(i) {
	        return _getScaleX(before[i], after[i]);
	      };

	      tweenVars.scaleY = scaleY = function scaleY(i) {
	        return _getScaleY(before[i], after[i]);
	      };
	    } else {
	      _updateAfterBounds(before, after);

	      tweenVars.width = width = function width(i) {
	        return _getWidth(before[i], after[i]);
	      };

	      tweenVars.height = height = function height(i) {
	        return _getHeight(before[i], after[i]);
	      };
	    }

	    tweenVars.x = x = function x(i) {
	      return _getX(before[i], after[i], scale, absolute ? offsets[i].x : 0, nested && animation);
	    };

	    tweenVars.y = y = function y(i) {
	      return _getY(before[i], after[i], scale, absolute ? offsets[i].y : 0, nested && animation);
	    };

	    if (nested) {
	      animation._flipProps = tweenVars;
	      targets.forEach(function (el, i) {
	        return el._flipI = i;
	      });
	    }

	    fade ? tweenVars.opacity = function (i) {
	      return opacity[i];
	    } : remove();

	    _callbacks.forEach(function (name) {
	      return config[name] && animation.eventCallback(name, config[name], config[name + "Params"]);
	    });

	    delay && animation.delay(delay);
	    swapOut.forEach(function (el, i) {
	      index = targets.indexOf(el);

	      if (~index) {
	        after[index] = before[index];
	        before[index] = after[targets.indexOf(swapIn[i])];
	        var _v = {
	          x: x(index),
	          y: y(index)
	        };

	        if (scale) {
	          _v.scaleX = scaleX(index);
	          _v.scaleY = scaleY(index);
	        } else {
	          _v.width = width(index);
	          _v.height = height(index);
	        }

	        animateRotation && (_v.rotation = before[index].r);
	        gsap.set(el, _v);
	        before[index] = after[index];
	      }
	    });

	    if (custom && targets.length) {
	      remainingProps = _copy(tweenVars, _reserved);

	      for (p in custom) {
	        v = _copy(custom[p], _fitReserved);
	        v[p] = tweenVars[p];
	        addFunc.call(animation, targets, v, 0);
	        delete remainingProps[p];
	      }
	    }

	    if (targets.length) {
	      toggleClass && animation.add(function () {
	        return _toggleClass(targets, toggleClass, animation._zTime < 0 ? "remove" : "add");
	      }, 0) && !paused && _toggleClass(targets, toggleClass, "add");
	      addFunc.call(animation, targets, remainingProps, 0);
	      endTime = animation.duration();
	      animation.call(function () {
	        var forward = animation.time() >= endTime;
	        forward && _finalState(targets, after, runBackwards, fade && swapOut);
	        toggleClass && _toggleClass(targets, toggleClass, forward ? "remove" : "add");
	      });
	    }

	    self.associate(changeResult);
	    return paused ? animation.pause() : animation.restart(true);
	  };

	  _proto.from = function from(vars) {
	    return this.to(vars, true);
	  };

	  _proto.associate = function associate(animation) {
	    animation && animation instanceof gsap.core.Animation && this.animation._flipAnims.push(animation);
	    return this;
	  };

	  Flip.fit = function fit(fromEl, toEl, vars) {
	    fromEl = _getEl(fromEl);

	    var v = vars ? _copy(vars, _fitReserved) : {},
	        _ref = vars || v,
	        absolute = _ref.absolute,
	        scale = _ref.scale,
	        fitChild = _ref.fitChild,
	        getVars = _ref.getVars,
	        rotate = _ref.rotate,
	        before = _getDimensions(_getEl(toEl)),
	        applyRotation = rotate !== false,
	        after = _getRotatedDimensions(applyRotation && [before], fitChild && _getEl(fitChild))(fromEl, 0),
	        offsets,
	        t;

	    scale || _updateAfterBounds([before], [after]);
	    offsets = absolute && _makeAbsolute([fromEl], [after], [])[0];
	    applyRotation && (v.rotation = before.r);

	    if (scale) {
	      v.scaleX = _getScaleX(before, after);
	      v.scaleY = _getScaleY(before, after);
	    } else {
	      v.width = _getWidth(before, after);
	      v.height = _getHeight(before, after);
	    }

	    if (fitChild) {
	      t = gsap.set(fromEl, _copy(v, _reserved));
	      offsets = _getEl(fitChild).getBoundingClientRect();
	      v.x = after.x + before.l - offsets.left;
	      v.y = after.y + before.t - offsets.top;
	      t.render(-1).kill();
	    } else {
	      v.x = _getX(before, after, scale, offsets ? offsets.x : 0);
	      v.y = _getY(before, after, scale, offsets ? offsets.y : 0);
	    }

	    getVars || "duration" in v || (v.duration = 0);
	    return getVars ? v : gsap.to(fromEl, v);
	  };

	  Flip.isFlipping = function isFlipping(target) {
	    var f = Flip.getByTarget(target);
	    return !!f && f.isActive();
	  };

	  Flip.getByTarget = function getByTarget(target) {
	    target = _getEl(target);
	    return target && target._flip;
	  };

	  Flip.getById = function getById(id) {
	    return _lookup[id];
	  };

	  Flip.register = function register(core) {
	    gsap = core;
	    _toArray = gsap.utils.toArray;
	    _getMatrix = gsap.plugins.css.core._getMatrix;

	    gsap.flip = function (vars) {
	      return new Flip(vars);
	    };
	  };

	  return Flip;
	}();
	typeof window !== "undefined" && window.gsap && window.gsap.registerPlugin(Flip);

	exports.Flip = Flip;
	exports.default = Flip;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
