export default (element) => {

}

// 事件委托
// event.target返回触发事件的元素
// event.currentTarget返回绑定事件的元素
// 当点击哪个元素时，event.target返回的是点击的元素节点，可以用返回的节点使用一些DOM对象上的一些操作
// event.currentTarget的作用是什么呢，我觉得他和this 的作用是差不多的，始终返回的是绑定事件的元素
// 给ul添加了点击事件，点击ul里面的子元素，event.target都会返回当前点击的元素节点，
// 做一个判断，如果点击了button标签，删除这个li节点。由于添加的li都在ul节点里面，所以并不用再去添加li事件里面去写代码了

// 1、mouseover与mouseenter
//
// mouseover mouseout事件：不论鼠标指针穿过被选元素或其子元素，都会触发 mouseover mouseout事件。
//
// mouseenter mouseleave事件：只有在鼠标指针穿过被选元素时，才会触发 mouseenter mouseleave事件。

// 防止冒泡和捕获
// w3c的方法是e.stopPropagation()，IE则是使用e.cancelBubble = true

// 如果有多个相同类型事件的事件监听函数绑定到同一个元素，当该类型的事件触发时，它们会按照被添加的顺序执行。
// 如果其中某个监听函数执行了 event.stopImmediatePropagation() 方法，则当前元素剩下的监听函数将不会被执行。
// （译者注：注意区别 event.stopPropagation ）

// p.addEventListener("click", (event) => {
//   alert("我是p元素上被绑定的第二个监听函数");
//   event.stopImmediatePropagation();
//   // 执行stopImmediatePropagation方法,阻止click事件冒泡,并且阻止p元素上绑定的其他click事件的事件监听函数的执行.
// }, false);
