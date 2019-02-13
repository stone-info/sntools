function handleEvent (event) {
  if (event) {event = event || window.event;}
  if (!event.target) {event.target = event.srcElement;}
  if (!event.pageX) {event.pageX = event.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);}
  if (!event.pageY) {event.pageY = event.clientY + (document.documentElement.scrollTop || document.body.scrollTop);}
  if (!event.preventDefault) {event.preventDefault = function () {event.returnValue = false;};}
  if (!event.stopPropagation) {event.stopPropagation = function () {event.cancelBubble = true;};}
  return event;
}

export {handleEvent};
