(function () {
'use strict';

var coordinate = (function (x, y) {
  return { x: x, y: y };
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 * Linear interpolate a point on a path between a and b.
 *
 * @param {Object} a - The start coordinate to lerp from.
 * @param {Object} b - The end coordinate to lerp to.
 * @param {Number} t - The progress along the path. Should be a number between 0 and 1
 */
var lerp = function lerp(a, b, t) {
  return coordinate(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
};

/**
 * Get an array of values from a date string.
 *
 * @param {String} date - The input date as dd-mm-yyyy
 * @return {Array} The values
 */
var valuesFromDate = function valuesFromDate(date) {
  var radix = 10;

  var _split = (date || '0000-00-00').split(/-/g),
      _split2 = _slicedToArray(_split, 3),
      year = _split2[0],
      month = _split2[1],
      day = _split2[2];

  return [Number.parseInt(day.substr(0, 1), radix), Number.parseInt(day.substr(1, 1), radix), Number.parseInt(month.substr(0, 1), radix), Number.parseInt(month.substr(1, 1), radix), Number.parseInt(year.substr(2, 1), radix), Number.parseInt(year.substr(3, 1), radix)];
};

/**
 * Get the generated logo SVG path.
 * @param {Array} path - A multidimensional array of points in a 2D space.
 * @param {Array} values - An array, each defining the linear "progress" per line.
 * @return {String} The SVG path.
 */
var getLogoPath = (function (path, values) {
  var padding = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  var tPadding = padding ? 0.1 : 0;
  var pathSvg = '';

  values.forEach(function (value, i) {
    var start = path[i];
    var end = path[(i + 1) % path.length];
    var t = value / 9 * (1 - tPadding * 2) + tPadding;

    var position = lerp(start, end, t);
    var operation = i === 0 ? 'M' : 'L';

    pathSvg += operation + ' ' + position.x + ' ' + position.y;
  });

  return pathSvg + ' Z';
});

var PI_TWO = Math.PI * 2;
var path = new Array(6);
var angleBase = Math.PI * -0.5;

for (var i = 0; i < path.length; i++) {
  var angleDelta = PI_TWO / path.length * i;
  var angle = angleBase + angleDelta;
  var x = Math.cos(angle);
  var y = Math.sin(angle);

  path[i] = coordinate(x, y);
}

var getNow = function getNow() {
  return Date.now() / 1000;
};
var noop = function noop() {};

var animation = function animation(duration, onUpdate) {
  var onCompleteCallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  var onComplete = onCompleteCallback;
  var animationStart = void 0;
  var animationFrame = void 0;

  var cancel = function cancel() {
    if (!animationFrame) return;
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
  };

  var update = function update() {
    var now = getNow();
    var progress = Math.min(1, (now - animationStart) / duration);

    onUpdate(progress);

    if (progress < 1) {
      animationFrame = requestAnimationFrame(update);
    } else if (onComplete) {
      cancel();
      onComplete();
    }
  };

  return {
    start: function start() {
      animationStart = getNow();
      animationFrame = requestAnimationFrame(update);
    },
    setNext: function setNext(callback) {
      onComplete = callback;
    },


    cancel: cancel
  };
};

var animationChain = function animationChain(animations) {
  var animationFirst = animations[0];

  animations.forEach(function (a, i) {
    if (i === animations.length - 1) return;

    var nextAnimation = animations[i + 1];
    a.setNext(function () {
      return nextAnimation.start();
    });
  });

  return {
    start: function start() {
      animationFirst.start();
    },
    cancel: function cancel() {
      animations.forEach(function (a) {
        a.setNext(null);
        a.cancel();
      });
    }
  };
};

var fakeAnimation = function fakeAnimation(execute, onCompleteCallback) {
  var onComplete = onCompleteCallback;

  return {
    start: function start() {
      if (onComplete) execute(onComplete);else execute(noop);
    },
    setNext: function setNext(callback) {
      onComplete = callback;
    },
    cancel: function cancel() {}
  };
};

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var animationDuration = 0.4;
var animationDurationHalf = 0.2;

var ease = function ease(n) {
  return Math.sin(n * Math.PI * 0.5);
};

var Logo = function () {
  function Logo(element) {
    var fillElement = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var imageElement = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    _classCallCheck(this, Logo);

    this.element = element;
    this.fillElement = fillElement;
    this.imageElement = imageElement;

    this.isAnimating = false;
    this.previousDate = null;
    this.previousImage = null;
  }

  _createClass(Logo, [{
    key: 'setData',
    value: function setData(date) {
      var _this = this;

      var image = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var pad = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      if (this.isAnimating) return false;

      var setImage = fakeAnimation(function (done) {
        _this.imageElement.setAttribute('xlink:href', image);
        done();
      });

      var fillShow = fakeAnimation(function (done) {
        _this.fillElement.classList.remove('is-hidden');
        done();
      });

      var fillHide = fakeAnimation(function (done) {
        _this.fillElement.classList.add('is-hidden');
        done();
      });

      var fadeIn = animation(animationDurationHalf, function (progress) {
        _this.imageElement.style.opacity = progress;
      });

      var fadeOut = animation(animationDurationHalf, function (progress) {
        _this.imageElement.style.opacity = 1 - progress;
      });

      var finishAnimation = fakeAnimation(function (done) {
        _this.isAnimating = false;
        done();
      });

      var valuesStart = valuesFromDate(this.previousDate);
      var valuesTarget = valuesFromDate(date);

      this.previousDate = date;
      this.animatePath(valuesStart, valuesTarget, pad);

      if (this.imageElement) {
        this.isAnimating = true;

        if (!this.previousImage && image) {
          animationChain([setImage, fadeIn, fillHide, finishAnimation]).start();
        } else if (this.previousImage && image) {
          animationChain([fadeOut, setImage, fadeIn, finishAnimation]).start();
        } else if (this.previousImage && !image) {
          animationChain([fillShow, fadeOut, finishAnimation]).start();
        } else {
          animationChain([fillShow, finishAnimation]).start();
        }
      }

      this.previousImage = image;
      return true;
    }
  }, {
    key: 'animatePath',
    value: function animatePath(valuesStart, valuesTarget) {
      var _this2 = this;

      var pad = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      animation(animationDuration, function (progress) {
        var values = valuesStart.map(function (valueStart, i) {
          var valueTarget = valuesTarget[i];
          var diff = valueTarget - valueStart;

          return valueStart + ease(progress) * diff;
        });

        var path$$1 = getLogoPath(path, values, pad);

        _this2.element.setAttribute('d', path$$1);
      }).start();
    }
  }]);

  return Logo;
}();

var PADDING = '0';

var formatDate = (function (date) {
  var month = (date.getMonth() + 1).toString().padStart(2, PADDING);
  var day = date.getDate().toString().padStart(2, PADDING);

  return date.getFullYear() + '-' + month + '-' + day;
});

var logo = new Logo(document.querySelector('.js-logo-path'), document.querySelector('.js-logo-fill'), document.querySelector('.js-logo-image'));

var logoBackground = new Logo(document.querySelector('.js-logo-background'));

var presetList = document.querySelector('.js-preset-list');
var presetButtons = Array.from(presetList.querySelectorAll('.js-preset-button'));
var today = formatDate(new Date());

// Update today preset
document.querySelector('.js-preset-today').dataset.date = today;
document.querySelector('.js-preset-today-display').innerHTML = today;

// Add interactivity for preset list
presetList.addEventListener('click', function (e) {
  if (e.target.tagName !== 'BUTTON') return;

  var button = e.target;
  var success = logo.setData(button.dataset.date, button.dataset.image);

  if (success) {
    presetButtons.forEach(function (b) {
      return b.classList.remove('is-active');
    });
    button.classList.add('is-active');
  }
});

// Update logos
logo.setData(presetList.querySelector('button[data-date]').dataset.date);
logoBackground.setData('0000-00-00', null, false);

// Add background toggle
Array.from(document.querySelectorAll('.js-toggle-background')).forEach(function (radio) {
  radio.addEventListener('change', function () {
    var isVisible = radio.value === 'on';

    logoBackground.element.classList.toggle('is-hidden', !isVisible);
  });
});

}());
//# sourceMappingURL=main.js.map
