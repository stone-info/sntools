// export default (function () {
//   // 判断 标准浏览器
//   var flag             = 'getComputedStyle' in window;
//   // 判断addEventListener 是否可用
//   var passiveSupported = false;
//   try {
//     var options = Object.defineProperty({}, 'passive', {
//       get: function () {return (passiveSupported = true);},
//     });
//     window.addEventListener('test', null, options);
//   } catch (err) {}
//
//   function on (eventName, curElement, callback, preventDefault = false) {
//     curElement['on' + eventName] = function (event) {
//       event         = event || window.event;
//       event._target = event.target || event.srcElement;
//       event._pageX  = event.pageX || (event.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft));
//       event._pageY  = event.pageY || (event.clientY + (document.documentElement.scrollTop || document.body.scrollTop));
//
//       if (preventDefault) {
//         event.preventDefault ? event.preventDefault() : event.returnValue = false;
//       }
//       callback(event);
//     };
//   }
//
//   return {
//     on: on,
//   };
// })();

function getInfo (jElement) {
  return {
    // position()获取相对于它最近的具有相对位置(position:relative或position:absolute)的父级元素的距离，
    // 如果找不到这样的元素，则返回相对于浏览器的距离。
    // position() 方法返回第一个匹配元素的位置（相对于它的父元素）。
    // 该方法返回一个带有两个属性（以像素为单位的 top 和 left 位置）的对象。
    // 内部元素 如果使用了 margin 踹 父元素就会 计算错误, 得到的结果不正确
    offsetLeft         : jElement.offset().left,     // offset()            方法设置或返回被选元素相对于文档的偏移坐标。
    offsetTop          : jElement.offset().top,      // offset()            方法设置或返回被选元素相对于文档的偏移坐标。
    positionLeft       : jElement.position().left,   // position()          方法返回第一个匹配元素的位置（相对于它的父元素）
    positionTop        : jElement.position().top,    // position()          方法返回第一个匹配元素的位置（相对于它的父元素）
    scrollLeft         : jElement.scrollLeft(),      // scrollLeft()        方法设置或返回被选元素的水平滚动条位置。
    scrollTop          : jElement.scrollTop(),       // scrollTop()         方法设置或返回被选元素的垂直滚动条位置。
    width              : jElement.width(),           // width() -           返回元素的宽度。
    height             : jElement.height(),          // height() -          返回元素的高度。
    innerWidth         : jElement.innerWidth(),      // innerWidth() -      返回元素的宽度（包含 padding）
    innerHeight        : jElement.innerHeight(),     // innerHeight() -     返回元素的高度（包含 padding）
    outerWidth         : jElement.outerWidth(),      // outerWidth() -      返回元素的宽度（包含 padding 和 border）
    outerHeight        : jElement.outerHeight(),     // outerHeight() -     返回元素的高度（包含 padding 和 border）
    'outerWidth(true)' : jElement.outerWidth(true),  // outerWidth(true) -  返回元素的宽度（包含 padding 和 border 和 margin）
    'outerHeight(true)': jElement.outerHeight(true), // outerHeight(true) - 返回元素的高度（包含 padding 和 border 和 margin）
  };
}

export {getInfo};

/* children([expr]) */
/******************************************/
// 查找子元素 , 不查孙子
// -----------------------------------------
// $("div").children()

/* find */
/******************************************/
// 查找所有
// -----------------------------------------
// $("p").find("span")

/* closest */
/******************************************/
// element: 要查找的父元素特性
// context: [可选]限定范围
// -----------------------------------------
// $('.item-a').closest('ul', '#one').css({
//   backgroundColor: '#FFC1C1',
// });

