// function getUserAgent () {
//   return window.navigator.userAgent;
// }
//
// function getBrowserType () {
//
//   if (/MSIE (6|7|8)/.test(getUserAgent())) {return 'IE';}
//   if (/Chrome/.test(getUserAgent())) {return 'Chrome';}
//   return getUserAgent();
// }

import sn from './utils';

function children (curElement, tagName) {
  if (/MSIE (6|7|8)/.test(window.navigator.userAgent)) {
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

export default (element) => {

  let children1 = children(element, 'p');

  let prev    = sn.prev(element);
  let next    = sn.next(element);
  let nextAll = sn.nextAll(element);
  let prevAll = sn.prevAll(element);

  snlog(prev, `prev`, 'dom.js', '47');
  snlog(next, `next`, 'dom.js', '47');
  snlog(prevAll, `prevAll`, 'dom.js', '47');
  snlog(nextAll, `nextAll`, 'dom.js', '47');

  let htmlElement       = document.createElement('h3');
  htmlElement.innerText = 'hello world';
  sn.insertBefore(htmlElement, element);

  sn.addClass(element, 'hello2 world');
  sn.addClass(element, 'hello3');
  sn.addClass(element, 'hello4');
  sn.addClass(element, 'hello5');

  // snlog(sn.hasClass(element, 'hello2'), `sn.hasClass(element, 'hello')`, 'dom.js', '61');

  // sn.removeClass(element, 'box hello2 hello3');

  let elementsByClassName = sn.getElementsByClassName('hello2 world');

  snlog(elementsByClassName, `element`, 'dom.js', '70');

}

export {children};
