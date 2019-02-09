export default (function () {
  var flag = 'getComputedStyle' in window;

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

  return {
    listToArray           : listToArray,
    formatJSON            : formatJSON,
    offset                : offset,
    win                   : win,
    getCss                : getCss,
    setCss                : setCss,
    setGroupCss           : setGroupCss,
    children              : children,
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
  };
})();

// overflow: hidden; /*清楚子元素的浮动对父元素的影响*/

// clear: both; /*清楚哥哥元素的浮动对弟弟元素的影响*/
