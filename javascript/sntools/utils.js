var flag             = 'getComputedStyle' in window;
var passiveSupported = false;
try {
  var options = Object.defineProperty({}, 'passive', {
    get: function () {return (passiveSupported = true);},
  });
  window.addEventListener('test', null, options);
} catch (err) {}

function _handleEvent (event) {
  if (event) {event = event || window.event;}
  if (!event.target) {event.target = event.srcElement;}
  if (!event.pageX) {event.pageX = event.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);}
  if (!event.pageY) {event.pageY = event.clientY + (document.documentElement.scrollTop || document.body.scrollTop);}
  if (!event.preventDefault) {event.preventDefault = function () {event.returnValue = false;};}
  if (!event.stopPropagation) {event.stopPropagation = function () {event.cancelBubble = true;};}
  return event;
}

// dom2级 兼容性处理
function _bind (eventName, curElement, runCallback, useCapture = false) {

  let tempFn = function (event) {
    _handleEvent(event);
    runCallback.call(curElement, event);
  };

  tempFn.sn_snapshot = runCallback;

  if (!curElement['bindList' + eventName]) {curElement['bindList' + eventName] = [];}

  let bindList = curElement['bindList' + eventName];

  for (let i = 0; i < bindList.length; ++i) {
    let bindItem = bindList[i];
    if (bindItem.sn_snapshot === runCallback) {return;}
  }

  bindList.push(tempFn);

  if ('addEventListener' in document) {
    curElement.addEventListener(eventName, tempFn, passiveSupported ? useCapture : false);
  } else {
    // IE 只能在冒泡阶段
    curElement.attachEvent('on' + eventName, tempFn);
  }
}

function _unbind (eventName, curElement, callback, useCapture = false) {
  for (let i = 0; i < curElement['bindList' + eventName].length; ++i) {
    let tempFn = curElement['bindList' + eventName][i];
    if (tempFn.sn_snapshot === callback) {
      if ('removeEventListener' in document) {
        curElement.removeEventListener(eventName, tempFn, passiveSupported ? useCapture : false);
      } else {
        // IE 只能在冒泡阶段
        curElement.detachEvent('on' + eventName, tempFn);
      }
    }
  }
}

export default (function () {

  function listToArray (likeArray) {
    if (flag) {
      return Array.prototype.slice.call(likeArray, 0);
    }
    var array = [];
    for (let i = 0; i < likeArray.length; ++i) {
      array[array.length] = likeArray[i];
    }
    return array;
  }

  function formatJSON (jsonStr) {
    return 'JSON' in window ? JSON.stringify(jsonStr, null, 2) : eval('(' + jsonStr + ')');
  }

  function offset (curElement) {
    var totalLeft = null,
        totalTop  = null,
        par       = curElement.offsetParent;

    totalLeft += curElement.offsetLeft;
    totalTop += curElement.offsetTop;

    while (par) {
      totalLeft += par.clientLeft;
      totalTop += par.clientTop;

      totalLeft += par.offsetLeft;
      totalTop += par.offsetTop;

      par = par.offsetParent;
    }

    return { left: totalLeft, top: totalTop };
  }

  function win (attr, value) {
    if (typeof value == 'undefined') {
      return document.documentElement[attr] || document.body[attr];
    }
    document.documentElement[attr] = value;
    document.body[attr]            = value;
  }

  function getCss (obj, name, pseudo = null) {
    var val  = null;
    var patt = null;
    if (flag) {
      val = window.getComputedStyle(obj, pseudo)[name]; // 指定一个要匹配的伪元素的字符串。必须对普通元素省略（或null）。
    } else {
      if (name === 'opacity') {
        val  = obj['currentStyle']['filter'];
        patt = /^alpha\(opacity=(\d+(?:\.\d+)?)\)$/i;
        val  = patt.test(val) ? patt.exec(val)[1] / 100 : 1;
      } else {
        val = obj['currentStyle'][name];
      }
    }
    patt = /^(-?\d+(\.\d+)?)(px|pt|rem|em)?$/i;
    return patt.test(val) ? parseFloat(val) : val;
  }

  function parent (curElement) {
    return curElement.parentNode;
  }

  function children (curElement, tagName) {
    if (!flag) {
      let nodeList = curElement.childNodes;
      let array    = [];
      for (let i = 0; i < nodeList.length; ++i) {
        let nodeElement = nodeList[i];
        if (nodeElement.nodeType === 1) {
          if (typeof tagName === 'string') {
            if (nodeElement.nodeName.toLowerCase() === tagName.toLowerCase()) {
              array[array.length] = nodeElement;
            }
          } else {
            array[array.length] = nodeElement;
          }
        }
      }
      return array;
    } else {
      let ts = Array.prototype.slice.call(curElement.children);
      if (typeof tagName === 'string') {
        return ts.filter(item => item.nodeName.toLowerCase() === tagName.toLowerCase());
      } else {
        return ts;
      }
    }
  }

  function prev (curElement) {
    if (flag) {
      return curElement.previousElementSibling;
    } else {
      let pre = curElement.previousSibling;
      while (pre && pre.nodeType !== 1) {
        pre = pre.previousSibling;
      }
      return pre;
    }
  }

  function prevAll (curElement) {

    var array = [];

    let pre = this.prev(curElement);
    while (pre) {
      array.unshift(pre);
      pre = this.prev(pre);
    }

    return array;
  }

  function next (curElement) {
    if (flag) {
      return curElement.nextElementSibling;
    } else {
      let ns = curElement.nextSibling;
      while (ns && ns.nodeType !== 1) {
        ns = ns.nextSibling;
      }
      return ns;
    }
  }

  function nextAll (curElement) {
    var array = [];
    let pre   = this.next(curElement);
    while (pre) {
      array.push(pre);
      pre = this.next(pre);
    }
    return array;
  }

  function sibling (curElement) {
    let p = this.prev(curElement);
    let n = this.next(curElement);

    var array = [];

    p && array.push(p);
    n && array.push(n);

    return array;

  }

  function siblings (curElement) {

    let pa = this.prevAll(curElement);
    let na = this.nextAll(curElement);

    return pa.concat(na);
  }

  function index (curElement) {
    return this.prevAll(curElement).length;
  }

  function firstChild (curElement) {
    let chs = this.children(curElement);
    return chs.length > 0 ? chs[0] : null;
  }

  function lastChild (curElement) {
    let chs = this.children(curElement);
    return chs.length > 0 ? chs[chs.length - 1] : null;
  }

  function append (newElement, container) {
    container.appendChild(newElement);
  }

  function prepend (newElement, container) {

    let fir = this.firstChild(container);
    if (fir) {
      container.insertBefore(newElement, fir);
      return;
    }
    container.appendChild(newElement);
  }

  function createElement (name) {
    return document.createElement(name);
  }

  function insertBefore (newElement, refElement) {
    refElement.parentNode.insertBefore(newElement, refElement);
  }

  function insertAfter (newElement, refElement) {
    var n = this.next(refElement);
    if (n) {
      refElement.parentNode.insertBefore(newElement, n);
      return;
    }
    refElement.parentNode.appendChild(newElement);
  }

  function addClass (curElement, className) {

    let _cn = className.trim();
    let cns = _cn.split(/ +/g);

    for (let i = 0; i < cns.length; ++i) {
      let cn = cns[i];
      if (!this.hasClass(curElement, cn)) {
        curElement.className += ' ' + cn;
      }
    }
  }

  function removeClass (curElement, className) {

    let _cn = className.trim();
    let cns = _cn.split(/ +/g);

    for (let i = 0; i < cns.length; ++i) {
      let cn = cns[i];
      if (this.hasClass(curElement, cn)) {
        curElement.className = curElement.className
                                         .replace(new RegExp('(^| +)' + cn + '( +|$)', 'mg'), ' ')
                                         .trim();
      }
    }
  }

  function hasClass (curElement, className) {
    let cn     = className.trim();
    let regExp = new RegExp('(^| +)' + cn + '( +|$)', 'mg');
    // return curElement.className.search(regExp) !== -1;
    return regExp.test(curElement.className);
  }

  function getElementsByClassName (className, context) {

    if (flag) {
      return this.listToArray(document.getElementsByClassName(className));
    }

    var array = [];

    context = context || document;

    let _cn = className.replace(/(^ +| +$)/g, '');
    let cns = _cn.split(/ +/g);

    let nodeList = context.getElementsByTagName('*');
    console.dir(nodeList);
    for (let i = 0; i < nodeList.length; ++i) {

      let nodeListElement = nodeList[i];

      var isContain = true;

      for (let j = 0; j < cns.length; ++j) {
        let cn = cns[j];

        let regExp = new RegExp('(^| +)' + cn + '( +|$)', 'mg');

        if (!regExp.test(nodeListElement.className)) {
          isContain = false;
          break;
        }
      }

      if (isContain) {
        array.push(nodeListElement);
      }
    }

    return array;
  }

  function setGroupCss (curElement, options) {

    if (Object.prototype.toString.call(options) !== '[object Object]') {return;}

    for (let key in options) {
      if (options.hasOwnProperty(key)) {
        setCss(curElement, key, options[key]);
      }
    }
  }

  function setCss (curElement, attr, value) {

    if (attr === 'float') {
      curElement['style']['cssFloat']   = value;
      curElement['style']['styleFloat'] = value;
      return;
    }

    if (attr === 'opacity') {
      curElement['style']['opacity'] = value;
      curElement['style']['filter']  = 'alpha(opacity=' + value * 100 + ')';
      return;
    }

    var attrList = [
      'width',
      'height',
      'top',
      'bottom',
      'left',
      'right',
      'marginTop',
      'marginBottom',
      'marginLeft',
      'marginRight',
      'paddingTop',
      'paddingBottom',
      'paddingLeft',
      'paddingRight',
    ];

    // let reg = /^(width|height|top|bottom|left|right|((margin|padding)(Top|Bottom|Left|Right)?))$/;

    if (attrList.indexOf(attr) !== -1) {
      value = !isNaN(value) ? value + 'px' : value;
    }

    curElement['style'][attr] = value;

  }

  function css (curElement) {
    let argumentTwo = arguments[1];

    if (typeof argumentTwo === 'string') {

      let argumentThree = arguments[2];

      if (typeof argumentThree === 'undefined') {
        return this.getCss.apply(this, arguments);
      }
      this.setCss.apply(this, arguments);
    }

    argumentTwo = argumentTwo || 0;

    if (Object.prototype.toString.call(argumentTwo) === '[object Object]') {
      this.setGroupCss.apply(this, arguments);
    }
  }

  function randomColor (apacity = 1.0) {
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    var a = apacity;
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
  }

  // clientX, clientY , 客户端能看得见的 原点开始 , 不考虑滚动
  // event.type
  // event.target
  // event.pageX
  // event.keyCode
  // dom0级 都是冒泡
  // function on (eventName, curElement, callback, preventDefault = false, stopPropagation = false) {
  //   curElement['on' + eventName] = function (event) {
  //     event         = event || window.event;
  //     event._target = event.target || event.srcElement;
  //     event._pageX  = event.pageX || (event.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft));
  //     event._pageY  = event.pageY || (event.clientY + (document.documentElement.scrollTop || document.body.scrollTop));
  //
  //     if (preventDefault) {
  //       event.preventDefault ? event.preventDefault() : event.returnValue = false;
  //     }
  //     if (stopPropagation) {
  //       // w3c的方法是e.stopPropagation()，IE则是使用e.cancelBubble = true
  //       event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
  //     }
  //     callback(event);
  //   };
  // }

  // useCapture 默认为 false
  // useCapture  可选
  // Boolean，是指在DOM树中，注册了该listener的元素，是否会先于它下方的任何事件目标，接收到该事件。
  // 沿着DOM树向上冒泡的事件不会触发被指定为use capture（也就是设为true）的listener。
  // 当一个元素嵌套了另一个元素，两个元素都对同一个事件注册了一个处理函数时，
  // 所发生的事件冒泡和事件捕获是两种不同的事件传播方式。
  // 事件传播模式决定了元素以哪个顺序接收事件。
  // 进一步的解释可以查看 事件流 及 JavaScript Event order 文档。
  // 如果没有指定， useCapture 默认为 false 。

  // preventDefault true: 阻止默认事件
  // useCapture true: 捕获 false: 冒泡
  function addEventListener (eventName, curElement, runCallback, useCapture = false) {

    let tempFn = function (event) {
      _handleEvent(event);
      runCallback.call(curElement, event);
    };

    tempFn.sn_snapshot = runCallback;

    if (!curElement['bindList' + eventName]) {curElement['bindList' + eventName] = [];}

    let bindList = curElement['bindList' + eventName];

    for (let i = 0; i < bindList.length; ++i) {
      let bindItem = bindList[i];
      if (bindItem.sn_snapshot === runCallback) {return;}
    }

    bindList.push(tempFn);

    if ('addEventListener' in document) {
      curElement.addEventListener(eventName, tempFn, passiveSupported ? useCapture : false);
    } else {
      // IE 只能在冒泡阶段
      curElement.attachEvent('on' + eventName, tempFn);
    }
  }

  function removeEventListener (eventName, curElement, callback, useCapture = false) {

    for (let i = 0; i < curElement['bindList' + eventName].length; ++i) {
      let tempFn = curElement['bindList' + eventName][i];
      if (tempFn.sn_snapshot === callback) {
        if ('removeEventListener' in document) {
          curElement.removeEventListener(eventName, tempFn, passiveSupported ? useCapture : false);
        } else {
          // IE 只能在冒泡阶段
          curElement.detachEvent('on' + eventName, tempFn);
        }
      }
    }
  }

  function on (eventName, curElement, callback, useCapture = false) {
    if (!curElement['callbackList' + eventName]) {curElement['callbackList' + eventName] = [];}
    let callbackList = curElement['callbackList' + eventName];
    for (let i = 0; i < callbackList.length; ++i) {
      let callbackItem = callbackList[i];
      if (callbackItem === callback) {return;}
    }
    callbackList.push(callback);

    _bind(eventName, curElement, run, useCapture);
  }

  function off (eventName, curElement, callback, useCapture = false) {

    let callbackList = curElement['callbackList' + eventName];

    for (let i = 0; i < callbackList.length; ++i) {

      let callbackItem = callbackList[i];

      if (callbackItem === callback) {
        callbackList.splice(i, 1);
        break;
      }
    }
  }

  function run (event) {
    event = _handleEvent(event);

    let callbackList = event.target['callbackList' + event.type];

    for (let i = 0; i < callbackList.length; ++i) {

      let callbackItem = callbackList[i];

      callbackItem.call(event.target, event);
    }
  }

  return {
    listToArray           : listToArray,
    formatJSON            : formatJSON,
    offset                : offset,
    win                   : win,
    getCss                : getCss,
    setCss                : setCss,
    setGroupCss           : setGroupCss,
    children              : children,
    parent                : parent,
    prev                  : prev,
    prevAll               : prevAll,
    next                  : next,
    nextAll               : nextAll,
    sibling               : sibling,
    siblings              : siblings,
    index                 : index,
    firstChild            : firstChild,
    lastChild             : lastChild,
    append                : append,
    prepend               : prepend,
    insertBefore          : insertBefore,
    insertAfter           : insertAfter,
    createElement         : createElement,
    addClass              : addClass,
    removeClass           : removeClass,
    hasClass              : hasClass,
    getElementsByClassName: getElementsByClassName,
    css                   : css,
    randomColor           : randomColor,
    on                    : on,
    off                   : off,
    addEventListener      : addEventListener,
    removeEventListener   : removeEventListener,
  };
})();

// overflow: hidden; /*清楚子元素的浮动对父元素的影响*/

// clear: both; /*清楚哥哥元素的浮动对弟弟元素的影响*/
