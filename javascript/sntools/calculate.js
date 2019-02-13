////////////////////////////////////////////////////////////////////////////////////////////
// 1. style.width 返回的是字符串，如28px，offsetWidth返回的是数值28；
//
// 2. style.width/style.height与scrollWidth/scrollHeight是可读写的属性，
//    clientWidth/clientHeight与offsetWidth/offsetHeight是只读属性
//
// 3. style.width的值需要事先定义，否则取到的值为空。
//    而且必须要定义在html里(内联样式)，
//    如果定义在css里，style.height的值仍然为空，
//    但元素偏移有效；而offsetWidth则仍能取到。
////////////////////////////////////////////////////////////////////////////////////////////
// Element.currentStyle 是一个与 window.getComputedStyle方法功能相同的属性。这个属性实现在旧版本的IE浏览器中.
// 非标准 该特性是非标准的，请尽量不要在生产环境中使用它！
function getStyle (obj, name, pseudo = null) {

  var val  = null;
  var patt = null;

  if ('getComputedStyle' in window) {
    val = window.getComputedStyle(obj, pseudo)[name]; // 指定一个要匹配的伪元素的字符串。必须对普通元素省略（或null）。
  } else {
    if (name === 'opacity') {
      val = obj['currentStyle']['filter'];

      patt = /^alpha\(opacity=(\d+(?:\.\d+)?)\)$/i;
      val  = patt.test(val) ? patt.exec(val)[1] / 100 : 1;
    } else {
      val = obj['currentStyle'][name];
    }
  }

  patt = /^(-?\d+(\.\d+)?)(px|pt|rem|em)?$/i;

  return patt.test(val) ? parseFloat(val) : val;

  // if (obj['currentStyle']) {
  //   return obj['currentStyle'][name];
  // } else {
  //   return getComputedStyle(obj, pseudo)[name];  // 指定一个要匹配的伪元素的字符串。必须对普通元素省略（或null）。
  // }
}

function getUserAgent () {
  return window.navigator.userAgent;
}

function getBrowserType () {

  if (/MSIE (6|7|8)/.test(getUserAgent())) {return 'IE';}
  if (/Chrome/.test(getUserAgent())) {return 'Chrome';}
  return getUserAgent();
}

// 元素内容可编辑
function contentEditable (element, flag) {
  element.contentEditable = flag;
}

// 返回元素的宽度 = 包括元素高度(height)、内边距(padding)
// 不包括边框(border)和外边距(margin)
function clientHeight (element) {
  return element.clientHeight;
}

// 返回元素的宽度 = 包括元素宽度(width) + 内边距(padding)
// 不包括边框(border)和外边距(margin)
function clientWidth (element) {
  return element.clientWidth;
}

function clientLeft (element) {
  return element.clientLeft || getStyle(element, 'border-left-width');
}

function clientTop (element) {
  return element.clientTop || getStyle(element, 'border-top-width');
}

// 返回元素的高度 = 包括元素高度(height) + 内边距(padding) + 边框(border)
// 不包括外边距(margin)
function offsetHeight (element) {
  return element.offsetHeight;
}

// 返回元素的宽度 = 包括元素宽度(width) + 内边距(padding) + 边框(border)
// 不包括外边距(margin)
function offsetWidth (element) {
  return element.offsetWidth;
}

// 分两种情况判断值, 绝对定位和其他;
// 绝对定位的时候参照父元素, 其他情况参照document(body)
function offsetLeft (element) {
  return element.offsetLeft;
}

// 返回元素的上外缘距离最近采用定位父元素内壁的距离，如果父元素中没有采用定位的，
// 则是获取上外边缘距离文档内壁的距离。
// 绝对定位的盒子是参照物
function offsetTop (element) {
  return element.offsetTop;
}

// element父元素 , 限绝对定位的...
function offsetParent (element) {
  return element.offsetParent;
}

// 返回元素的宽度 = 包括元素宽度(width)、内边距(padding)和溢出尺寸，
// 不包括边框(border)和外边距(margin)，
// 无溢出的情况，与clientWidth相同
function scrollWidth (element) {
  return element.scrollWidth;
}

// 返回元素的宽度 = 包括元素高度(height)、内边距(padding)和溢出尺寸，
// 不包括边框(border)和外边距(margin)，
// 无溢出的情况，与clientHeight相同
function scrollHeight (element) {
  return element.scrollHeight;
}

// 此属性可以获取或者设置对象的最左边到对象在当前窗口显示的范围内的左边的距离，
// 也就是元素被滚动条向左拉动的距离。
// 返回值是一个整数，单位是像素。此属性是可读写的。
// 就偏移量 写这么拗口 shit
function scrollLeft (element) {
  return element.scrollLeft;
}

// 此属性可以获取或者设置对象的最顶部到对象在当前窗口显示的范围内的顶边的距离，
// 也就是元素滚动条被向下拉动的距离。
// 返回值是一个整数，单位是像素。此属性是可读写的。
function scrollTop (element) {
  return element.scrollTop;
}

function createGauges () {
  let $s    = $(`<style> .gauges {position         : fixed;left             : 50%;top              : 10px;transform        : translate(-50%, 0);background-color : #008b8b;}  .gauges th {color   : #FFF;padding : 10px;width   : 100px;}  .gauges td {color   : #FFF;padding : 10px;}</style>`);
  let $body = $('body');
  $body.append($s);
  let $t = $(`<table class="gauges" border="1" style="border-collapse:collapse"><thead><tr><th></th><th>x</th><th>y</th></tr></thead><tbody align="center"><tr><td>client</td><td>0</td><td>0</td></tr><tr><td>page</td><td>0</td><td>0</td></tr><tr><td>screen</td><td>0</td><td>0</td></tr><tr><td>offset</td><td>0</td><td>0</td></tr></tbody></table>`);
  $body.append($t);
  let $sc = `<script type="text/javascript"> $('body').click(function (event) {let obj    = { clientX: event.clientX, clientY: event.clientY, pageX  : event.pageX, pageY  : event.pageY, screenX: event.screenX, screenY: event.screenY, offsetX: event.offsetX, offsetY: event.offsetY, };let $table = $('.gauges');{let $tr = $table.find('tr:nth-of-type(1)');$tr.find('td').eq(1).text(obj.clientX);$tr.find('td').eq(2).text(obj.clientY);}{let $tr = $table.find('tr:nth-of-type(2)');$tr.find('td').eq(1).text(obj.pageX);$tr.find('td').eq(2).text(obj.pageY);}{let $tr = $table.find('tr:nth-of-type(3)');$tr.find('td').eq(1).text(obj.screenX);$tr.find('td').eq(2).text(obj.screenY);}{let $tr = $table.find('tr:nth-of-type(4)');$tr.find('td').eq(1).text(obj.offsetX);$tr.find('td').eq(2).text(obj.offsetY);}});</script>`;
  $body.append($sc);
}

// function getHTMLElement () {return document.documentElement;}
//
// function getAttributeValue (attr) {
//   return document.documentElement[attr] || document.body[attr];
// }
//
// function clientScreenWidth () {
//   return document.documentElement.clientWidth || document.body.clientWidth;
// }
//
// function setScrollToTop () {
//   document.documentElement.scrollTop = 0;
//   document.body.scrollTop            = 0;
// }

function win (attr, value) {
  if (typeof value == 'undefined') {
    return document.documentElement[attr] || document.body[attr];
  }

  document.documentElement[attr] = value;
  document.body[attr]            = value;
}

// rect 是一个具有四个属性left、top、right、bottom的DOMRect对象
//译者注：DOMRect 是 TextRectangle或 ClientRect 的别称，他们是相同的。
// var rect = obj.getBoundingClientRect();

function getBoundingClientRect (element) {
  return element.getBoundingClientRect();
}

// element 到 body的边距
// offsetLeft 不给力, CSS transform的时候 计算不正确,
// 推荐使用 getBoundingClientRect
function intervalWithBody (element, val, level = 0) {

  val.left += element.clientLeft;
  val.left += element.offsetLeft;

  val.top += element.clientTop;
  val.top += element.offsetTop;

  // if (element.offsetParent && element.offsetParent.tagName.toLowerCase() !== 'body') {
  if (element.offsetParent) {
    intervalWithBody(element.offsetParent, val, level + 1);
  }
  if (level === 0) {
    val.left = val.left - element.clientLeft;
    val.top  = val.top - element.clientTop;
  }
}

export {getStyle, contentEditable, createGauges, win, getUserAgent, intervalWithBody};

export default (box) => {

  // contentEditable(box, true);

  // snlog(box.offsetHeight, `box.offsetHeight`, 'calculate.js', '38');
  // snlog(box.offsetWidth, `box.offsetWidth`, 'calculate.js', '38');
  // snlog(box.offsetLeft, `box.offsetLeft`, 'calculate.js', '38');
  // snlog(box.offsetTop, `box.offsetTop`, 'calculate.js', '38');
  // snlog(box.offsetParent, `box.offsetParent`, 'calculate.js', '38');

  // snlog(clientHeight(box), `clientHeight(box)`, 'calculate.js', '60');
  // snlog(offsetHeight(box), `offsetHeight(box)`, 'calculate.js', '60');

  // snlog(box.scrollWidth, `box.scrollWidth`, 'calculate.js', '81');
  // snlog(box.scrollHeight, `box.scrollHeight`, 'calculate.js', '82');

  snlog(getUserAgent(), `getUserAgent()`, 'calculate.js', '173');

  snlog(getBrowserType(), `getBrowserType()`, 'calculate.js', '186');

}


