const cluster         = require('cluster');
const { snlog, info } = require('./log');
const { cpus }        = require('os');
const os              = require('os');

function demo() {

  let name    = 'stone';
  let workers = [];

  const masterProcess = () => {
    let cpuList = cpus();
    // snlog(`一共有${cpuList.length}个核`, new info);

    snlog(`Master 主进程 ${process.pid} 启动`, new info);

    for (let i = 0; i < cpuList.length; ++i) {
      let cpu = cpuList[i];
      snlog(`正在 fork 子进程 ${i}`, new info);
      let worker = cluster.fork();

      workers.push(worker);

      worker.on('message', message => {
        snlog(`主进程 ${process.pid} 收到 '${JSON.stringify(message)}' 来自 ${worker.process.pid}`, new info);
      });
    }

    workers.forEach((worker, index) => {
      snlog(`主进程 ${process.pid} 发消息给 子进程 ${worker.process.pid}`, new info);
      worker.send({ msg: `来自主进程的消息 ${process.pid}` });
    }, this);

    // snlog(`主进程 能拿到 name吗? ${name}`, new info);

    // process.exit();
  };

  const childProcess = () => {

    // snlog(masterProcess, new info(`masterProcess`));

    // snlog(`能拿到 name吗? ${name}`, new info);

    snlog(`Worker 子进程 ${process.pid} 启动`, new info);

    process.on('message', message => {
      snlog(`worker 子进程 ${process.pid} 收到消息 '${JSON.stringify(message)}'`, new info);
    });

    snlog(`worker 子进程 ${process.pid} 发消息给主进程`, new info);
    process.send({ msg: `来自子进程的消息 ${process.pid}` });
    // snlog(`worker 子进程 ${process.pid} 结束`, new info);

    // process.exit();
  };

  if (cluster.isMaster) {
    masterProcess();
  } else {
    childProcess();
  }

  // snlog(process.env.OLDPWD, new info(`process.env.OLDPWD`));
  // snlog(process.env.XPC_SERVICE_NAME, new info(`process.env.XPC_SERVICE_NAME`));
}

function demo2() {

  const masterProcess = () => {
    let worker = cluster.fork();

    // snlog(worker, new info(`worker`));

    snlog(worker.process.pid, new info(`worker.process.pid`));
    snlog(process.pid, new info(`process.pid`));

    worker.on('message', message => {
      snlog(`主进程 ${process.pid} 收到 '${JSON.stringify(message)}' 来自 ${worker.process.pid}`, new info);
    });
    worker.send({ msg: `你好,子进程${worker.process.pid}, 我是主进程 ${process.pid}` });

    console.dir(worker);
    snlog(worker.__proto__, new info(`worker.__proto__`));
  };

  const childProcess = () => {
    snlog(`Worker 子进程 ${process.pid} 启动`, new info);

    process.on('message', message => {
      let ss = `worker 子进程 ${process.pid} 收到来自主进程的消息 '${JSON.stringify(message)}'`;
      snlog(`${ss}`, new info);
    });

    let s = `你好主进程, 我是子进程${process.pid}`;
    snlog(`worker 子进程 ${process.pid} 发消息给主进程, 内容: ${s}`, new info);
    process.send({ msg: `${s}` });
  };

  if (cluster.isMaster) {
    masterProcess();
  } else {
    childProcess();
  }
}

if (cluster.isMaster) {
  const worker = cluster.fork();
  // 主进程发送消息给子进程
  worker.send('hi there');
  // 主进程的 send undefined
  snlog(process.send, new info(`process.send`));
  // 在主进程的 worker 代表主进程???
  // worker.send.call(worker, 'hello world');
  // snlog(worker.send.call(this), new info(`worker.send`));
  worker.on('message', (message) => {
    snlog(message, new info(`message`));
  });
} else if (cluster.isWorker) {
  process.on('message', (msg) => {
    snlog(msg, new info(`msg`));
    process.send(msg);
  });
}

if (cluster.isMaster) {
  const worker = cluster.fork();
  worker.send('hi there');
  worker.on('message', (message) => {
    console.log(JSON.stringify(message, null, 2));
  });

} else if (cluster.isWorker) {
  process.on('message', (msg) => {
    console.log(JSON.stringify(msg, null, 2));
    process.send(msg);
  });
}

// babel xxx.js --presets @babel/preset-env

// $FilePathRelativeToProjectRoot$ --out-dir dist --source-maps --presets @babel/preset-env