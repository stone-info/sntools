// Promise.resolve(value)方法返回一个以给定值解析后的Promise 对象。
// 但如果这个值是个thenable（即带有then方法），返回的promise会“跟随”这个thenable的对象，
// 采用它的最终状态（指resolved/rejected/pending/settled）；如果传入的value本身就是promise对象，
// 则该对象作为Promise.resolve方法的返回值返回；否则以该值为成功状态返回promise对象。
// var promise1 = Promise.resolve(123);
//
// promise1.then(function(value) {
//   console.log(value);
//   // expected output: 123
// });

// Promise.resolve('foo')
// // 等价于
// new Promise(resolve => resolve('foo'))

// （1）参数是一个 Promise 实例
//
// 如果参数是 Promise 实例，那么Promise.resolve将不做任何修改、原封不动地返回这个实例。

// （2）参数是一个thenable对象
//
// thenable对象指的是具有then方法的对象，比如下面这个对象。

// let thenable = {
// then: function(resolve, reject) {
//  resolve(42);
//  }
// };
// Promise.resolve方法会将这个对象转为 Promise 对象，然后就立即执行thenable对象的then方法。

// （3）参数不是具有then方法的对象，或根本就不是对象
//
// 如果参数是一个原始值，或者是一个不具有then方法的对象，则Promise.resolve方法返回一个新的 Promise 对象，状态为resolved。

// const p = Promise.resolve('Hello');
// p.then(function (s){
//   console.log(s)
// });
// // Hello
// 上面代码生成一个新的 Promise 对象的实例p。由于字符串Hello不属于异步操作（判断方法是字符串对象不具有 then 方法），
// 返回 Promise 实例的状态从一生成就是resolved，所以回调函数会立即执行。Promise.resolve方法的参数，会同时传给回调函数。

// （4）不带有任何参数
//
// Promise.resolve方法允许调用时不带参数，直接返回一个resolved状态的 Promise 对象。
//
// 所以，如果希望得到一个 Promise 对象，比较方便的方法就是直接调用Promise.resolve方法。
//
// const p = Promise.resolve();
// p.then(function () {
// // ...
// });
// 上面代码的变量p就是一个 Promise 对象。
//
// 需要注意的是，立即resolve的 Promise 对象，是在本轮“事件循环”（event loop）的结束时，而不是在下一轮“事件循环”的开始时。

// setTimeout(function () {
//   console.log('three');
// }, 0);
// Promise.resolve().then(function () {
//   console.log('two');
// });
// console.log('one');
// // one
// // two
// // three
// 上面代码中，setTimeout(fn, 0)在下一轮“事件循环”开始时执行，
// Promise.resolve()在本轮“事件循环”结束时执行，console.log('one')则是立即执行，因此最先输出。

// const path  = require('path');
// const snlog = require('./log').snlog;
//
// snlog(path.resolve(__dirname, '.'), `path.resolve(__dirname,'.')`, 'snpromise.js', '72');
// snlog(path.resolve('./package.json', '.'), `path.resolve(__dirname,'.')`, 'snpromise.js', '72');
// snlog(path.join('./package.json', '.'), `path.resolve(__dirname,'.')`, 'snpromise.js', '72');
// snlog(path.join(__dirname, './log.js'), `path.resolve(__dirname,'.')`, 'snpromise.js', '72');

const snlog = require('./log').snlog;

function demo1() {
  // console.log('■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■');
  // https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/
  //    ┌───────────────────────────┐
  // ┌─>│           timers          │ uv__run_timers(loop); [setTimeout, setInterval]等函数执行阶段
  // │  └─────────────┬─────────────┘
  // │  ┌─────────────┴─────────────┐
  // │  │     pending callbacks     │ ran_pending = uv__run_pending(loop); 执行错误的阶段[socket,stream,tcp,udp,pabe(没听懂)]
  // │  └─────────────┬─────────────┘ 执行除了 close事件的callbacks、被timers(定时器，setTimeout、setInterval等)设定的callbacks、setImmediate()设定的callbacks之外的callbacks;
  // │  ┌─────────────┴─────────────┐
  // │  │       idle, prepare       │ * 仅内部使用。
  // │  └─────────────┬─────────────┘      ┌───────────────┐ uv__io_poll(loop, timeout);
  // │  ┌─────────────┴─────────────┐      │   incoming:   │ 向系统去获取新的i/o的事件, 执行对应的i/o 的回到
  // │  │           poll            │<─────┤  connections, │ 大白话: 首先将处理到期的定时器的回调, 之后处理poll队列中的回调, 知道poll队列中的回调全部被清空, 或者达到一个处理的上限,
  // │  └─────────────┬─────────────┘      │   data, etc.  │ 如果队列不为空的时候 刚好有setImmediate 那么终止当前的poll阶段 前往check阶段 执行setImmediate的回调, 如果没有setImmediate, nodejs会去查看
  // │  ┌─────────────┴─────────────┐      └───────────────┘ 有没有定时器任务到期了, 如果有的话 前往timers阶段执行 定时器的回调
  // │  │           check           │                        * node会在适当条件下阻塞在这里。这个阶段执行几乎所有的回调，除了`close`回调，timer的回调，和`setImmediate()`的回调。
  // │  └─────────────┬─────────────┘ uv__run_check(loop); 执行setImmediate的回调, setImmediate 只能在check阶段执行
  // │  ┌─────────────┴─────────────┐
  // └──┤      close callbacks      │ 执行 on.('close',()=>{}) 这种 结束的回调
  //    └───────────────────────────┘

  // 每个阶段都会有先进先出的队列, 而且这些队列都会被自动归列到不同阶段, 当事件循环运行起来的时候 从上到下轮转,
  // 每个阶段callback 会被全部执行完毕, 或者达到一个最大的数量, 那么nodejs 会进入下一个阶段, 检查新的队列执行回调
  // 直到运行完 全部的阶段和每个阶段的全部的队列
  // process.nextTick 是在任意的两个阶段中间 只要有 process.nextTick还未被执行, 那么优先执行她的回调, 包括 promise microtask这样的回调

  // https://github.com/libuv/libuv/blob/v1.x/src/unix/core.c  341行
  // int uv_run(uv_loop_t* loop, uv_run_mode mode) {
  //   int timeout;
  //   int r;
  //   int ran_pending;
  //
  //   r = uv__loop_alive(loop);
  //   if (!r)
  //     uv__update_time(loop);
  //
  //   while (r != 0 && loop->stop_flag == 0) {
  //     uv__update_time(loop);
  //     uv__run_timers(loop);
  //     ran_pending = uv__run_pending(loop);
  //     uv__run_idle(loop);
  //     uv__run_prepare(loop);
  //
  //     timeout = 0;
  //     if ((mode == UV_RUN_ONCE && !ran_pending) || mode == UV_RUN_DEFAULT)
  //       timeout = uv_backend_timeout(loop);
  //
  //     uv__io_poll(loop, timeout);
  //     uv__run_check(loop);
  //     uv__run_closing_handles(loop);
  //
  //     if (mode == UV_RUN_ONCE) {
  //       /* UV_RUN_ONCE implies forward progress: at least one callback must have
  //        * been invoked when it returns. uv__io_poll() can return without doing
  //        * I/O (meaning: no callbacks) when its timeout expires - which means we
  //        * have pending timers that satisfy the forward progress constraint.
  //        *
  //        * UV_RUN_NOWAIT makes no guarantees about progress so it's omitted from
  //        * the check.
  //        */
  //       uv__update_time(loop);
  //       uv__run_timers(loop);
  //     }
  //
  //     r = uv__loop_alive(loop);
  //     if (mode == UV_RUN_ONCE || mode == UV_RUN_NOWAIT)
  //       break;
  //   }
  //
  //   /* The if statement lets gcc compile it to a conditional store. Avoids
  //    * dirtying a cache line.
  //    */
  //   if (loop->stop_flag != 0)
  //     loop->stop_flag = 0;
  //
  //   return r;
  // }
  // console.log('■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■');

  const path = require('path');

  const EventEmitter = require('events');
  const fs           = require('fs');

  class EE extends EventEmitter {}

  let yy = new EE();

  yy.on('event', () => {
    snlog('监听到 event事件', `监听到 event事件`, 'snpromise.js', '90');
  });

  setTimeout(function () {
    snlog('0 毫秒之后 出大事了', `出大事了`, 'snpromise.js', '85');
  }, 0);

  setTimeout(function () {
    snlog('10 毫秒之后 出大事了', `出大事了`, 'snpromise.js', '85');
  }, 10);

  setTimeout(function () {
    snlog('100 毫秒之后 出大事了', `出大事了`, 'snpromise.js', '85');
  }, 100);

  // [ poll阶段 ]
  // poll阶段是衔接整个event loop各个阶段比较重要的阶段，为了便于后续例子的理解，本文和原文的介绍顺序不一样，本文先讲这个阶段；
  //
  // 在node.js里，任何异步方法（除timer,close,setImmediate之外）完成时，都会将其callback加到poll queue里,并立即执行。
  //
  // poll 阶段有两个主要的功能：
  //
  // 处理poll队列（poll quenue）的事件(callback);
  // 执行timers的callback,当到达timers指定的时间时;
  // 如果event loop进入了 poll阶段，且代码未设定timer，将会发生下面情况：
  //
  // 如果poll queue不为空，event loop将同步的执行queue里的callback,直至queue为空，或执行的callback到达系统上限;
  // 如果poll queue为空，将会发生下面情况：
  // 如果代码已经被setImmediate()设定了callback, event loop将结束poll阶段进入check阶段，并执行check阶段的queue (check阶段的queue是 setImmediate设定的)
  // 如果代码没有设定setImmediate(callback)，event loop将阻塞在该阶段等待callbacks加入poll queue;
  // 如果event loop进入了 poll阶段，且代码设定了timer：
  //
  // 如果poll queue进入空状态时（即poll 阶段为空闲状态），event loop将检查timers,如果有1个或多个timers时间时间已经到达，event loop将按循环顺序进入 timers 阶段，并执行timer queue.
  // 以上便是整个event loop时间循环的各个阶段运行机制

  // 此处是poll阶段
  fs.readFile(path.resolve('package.json'), 'utf-8', function (err, data) {
    if (err) {console.log(err);}
    snlog(data, `data`, 'snpromise.js', '107');
  });

  fs.readFile(path.resolve('index.html'), 'utf-8', function (err, data) {
    if (err) {console.log(err);}
    snlog(data, `data`, 'snpromise.js', '190');
  });

  setImmediate(() => {
    snlog('immediate 立即回调', `immediate 立即回调`, 'snpromise.js', '110');
  });

  // 优先级最高
  process.nextTick(() => {
    snlog('process.nextTick的回调', `process.nextTick的回调`, 'snpromise.js', '114');
  });

  // 仅次于 process.nextTick 优先级
  Promise.resolve().then(() => {

    yy.emit('event');

    // 等到 promise 执行完之后, 发现 本次事件循环体里面还有 process.nextTick未被执行, 就会执行 process.nextTick
    // 等到 当前事件循环中 没有了process.nextTick 和 promise.microtask 就会进入到 timers阶段
    process.nextTick(() => {
      snlog('process.nextTick的 第2次回调', `process.nextTick的 第2次回调`, 'snpromise.js', '121');
    });
    snlog('promise的 第一次回调', `promise的 第一次回调`, 'snpromise.js', '118');
  }).then(() => {
    snlog('promise的 第二次回调', `promise的 第一次回调`, 'snpromise.js', '118');
  });
}

setImmediate(() => {snlog('[阶段3...immediate] immediate 回调1', `[阶段3...immediate] immediate 回调1`, 'snpromise.js', '243');});
setImmediate(() => {snlog('[阶段3...immediate] immediate 回调2', `[阶段3...immediate] immediate 回调2`, 'snpromise.js', '243');});
setImmediate(() => {snlog('[阶段3...immediate] immediate 回调3', `[阶段3...immediate] immediate 回调3`, 'snpromise.js', '243');});

Promise.resolve().then(() => {
  snlog('[...待切入下一个阶段] Promise 回调1', `[...待切入下一个阶段] Promise 回调1`, 'snpromise.js', '246');
  setImmediate(() => {snlog('[阶段3...immediate] immediate 回调4', `[阶段3...immediate] immediate 回调4`, 'snpromise.js', '247');});

});

var fs   = require('fs');
var path = require('path');
fs.readFile(path.resolve(__dirname, './log.js'), 'utf-8', function (err, data) {
  if (err) {console.log(err);}
  snlog('[阶段2...readFile] readFile 回调1', `[阶段2...readFile] readFile 回调1`, 'snpromise.js', '255');

  fs.readFile(path.resolve('./ccc.mp4'), 'utf-8', function (err, data) {
    if (err) {console.log(err);}
    snlog('[阶段2...readFile] readFile 回调2 大文件', `[阶段2...readFile] readFile 回调2 大文件`, 'snpromise.js', '259');
  });

  setImmediate(() => {
    snlog('[阶段3...immediate] immediate 回调4', `[阶段3...immediate] immediate 回调5`, 'snpromise.js', '264');

    Promise.resolve().then(() => {
      snlog('[...待切入下一个阶段] Promise 回调2', `[...待切入下一个阶段] Promise 回调2`, 'snpromise.js', '267');
      process.nextTick(() => {
        snlog('[...待切入下一个阶段] nextTick 回调6', `[...待切入下一个阶段] nextTick 回调6`, 'snpromise.js', '268');
      })
    });
  });
});

// 可能还没有检测到 定时器的回调函数 , 有时 变为第一个 有时 变为最后一个
setTimeout(() => {snlog('[阶段1...定时器] 定时器 回调1', `[阶段1...定时器] 定时器 回调1`, 'snpromise.js', '246');}, 2);
setTimeout(() => {
  snlog('[阶段1...定时器] 定时器 回调2', `[阶段1...定时器] 定时器 回调2`, 'snpromise.js', '248');

  process.nextTick(() => {
    snlog('[...待切入下一个阶段] nextTick 回调1', `[...待切入下一个阶段] nextTick 回调1`, 'snpromise.js', '251');
  });
}, 2);

setTimeout(() => {
  snlog('[阶段1...定时器] 定时器 回调3', `[阶段1...定时器] 定时器 回调3`, 'snpromise.js', '256');
}, 2);
setTimeout(() => {
  snlog('[阶段1...定时器] 定时器 回调4', `[阶段1...定时器] 定时器 回调4`, 'snpromise.js', '258');
}, 2);

process.nextTick(() => {snlog('[...待切入下一个阶段] nextTick 回调2', `[...待切入下一个阶段] nextTick 回调2`, 'snpromise.js', '262');});
process.nextTick(() => {
  snlog('[...待切入下一个阶段] nextTick 回调3', `[...待切入下一个阶段] nextTick 回调3`, 'snpromise.js', '264');
  process.nextTick(() => {snlog('[...待切入下一个阶段] nextTick 回调4', `[...待切入下一个阶段] nextTick 回调4`, 'snpromise.js', '268');});
});
process.nextTick(() => {snlog('[...待切入下一个阶段] nextTick 回调5', `[...待切入下一个阶段] nextTick 回调5`, 'snpromise.js', '272');});
