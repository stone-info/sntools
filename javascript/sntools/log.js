// import {isEmpty}           from './type';
// import {sprintf, vsprintf} from 'sprintf-js';

// const isEmpty = require('./type').isEmpty;
const { isEmpty } = require('./type');
// const info        = require('./sninfo');
const sprintf     = require('sprintf-js').sprintf;
const vsprintf    = require('sprintf-js').vsprintf;

const dateformat = require('dateformat');

// let chalk = require('chalk');

// function snlog (filename, line, obj_name, obj) {
//   console.log(chalk.bgYellow.bold(`【 ${filename}':'${line} 】-: 👇`));
//   // console.log(chalk.bgGreen(` ${obj_name} = `) + chalk.bgBlack.white.bold(`${obj}`));
//   console.log(chalk.bgGreen(` ${obj_name} = `) + `${obj}`);
//   console.log(chalk.bold('------------------------------------------------------'));
// }

function _endLine() {
  // console.log('\x1b[92m------------------------------------------------------\x1b[0m');

  console.log('\x1b[1m' + '-'.repeat(90) + '\x1b[0m');
}

function _dateTime() {
  // return '@' + dateformat(new Date(), 'yyyy-MM-dd HH:mm:ss');
  let date = new Date();
  return '@' + dateformat(date, 'HH:mm:ss') + ':' + sprintf('%03d', date.getMilliseconds());
}

function _isEmptyObject(obj) {
  for (var key in obj) {
    return false;
  }
  return true;
};

function _keyColor(key) {
  // return `\x1b[43m ${key} \x1b[0m`;
  if (process.env.XPC_SERVICE_NAME !== '0') {
    return `\x1b[43m ${key} \x1b[0m`;
  } else {
    // 终端
    return `\x1b[1m ${key} \x1b[0m`;
  }
}

function _arrowColor(arrow) {

  return '\x1b[39m' + arrow + '\x1b[0m';
}

function _objectColor(obj) {
  // return `\x1b[106m ${obj} \x1b[0m`;

  if (process.env.XPC_SERVICE_NAME !== '0') {
    return `\x1b[106m ${obj} \x1b[0m`;
  } else {
    // 终端
    return `\x1b[0m ${obj} \x1b[0m`;
  }
}

function _funcColor(func) {

  // return `\x1b[34m ${func} \x1b[0m`;

  if (process.env.XPC_SERVICE_NAME !== '0') {
    return `\x1b[34m ${func} \x1b[0m`;
  } else {
    // 终端
    return `\x1b[0m ${func} \x1b[0m`;
  }
}

function _objNameColor(objName) {
  return `\x1b[90m${objName} : \x1b[0m`;

}

function getInnerHTML(level, key, show) {
  return `<pre style="padding-left: ${level * 20}px"><b style="color: red;background-color: yellow;font-weight: normal;">${key}</b> = ${show}</pre>`;
}

function getInnerHTMLWarn(level, key, show) {
  return `<pre style="padding-left: ${level * 20}px"><b style="color: yellow;background-color: orangered;font-weight: normal;">${key}</b> = ${show}</pre>`;
}

function hPrintProperties(obj, obj_name, container, level) {

  if (level > 3) {
    // console.warn('printProperties level ' + level + ' 层了');
    // console.log(obj_name + ' = ', obj, 'log.js', '188');
    let show = obj;
    container.innerHTML += getInnerHTMLWarn(level, obj_name, show);

    return;
  }

  for (let key in obj) {

    if (!obj.hasOwnProperty(key)) {continue;}

    let objElement = obj[key];

    switch (typeof objElement) {

      case 'object':
        container.innerHTML += `<pre style="padding-left: ${level * 20}px">${obj_name + '〉' + key} = ${_isEmptyObject(objElement) ? '{}' : objElement}</pre>`;
        hPrintProperties(objElement, obj_name + '〉' + key, container, level + 1);
        break;
      case 'function':
        // container.innerHTML += getLevelString(level) + `${key} = ${objElement}<br>`;
        hPrintFunction(objElement, obj_name + '〉' + key, container, level);
        break;
      case 'boolean': {
        let show = objElement ? 'true' : 'false';
        container.innerHTML += getInnerHTML(level, obj_name + '〉' + key, show);
        break;
      }
      case 'symbol': {
        // let show = objElement ? 'true' : 'false';
        container.innerHTML += getInnerHTML(level, obj_name + '〉' + key, String(objElement));
        break;
      }
      default: {
        let show = objElement ? objElement : '"空字符串"';
        container.innerHTML += getInnerHTML(level, key, show);
      }
    }
  }
}

function hPrintFunction(obj, obj_name, container, level) {
  container.innerHTML += `<pre style="position: relative; left: 0; top: 0;padding-left: ${level * 20}px;margin-bottom: 10px;">
<div style="position: absolute; left: 0; top: 0;width: ${level * 20}px; height: 100%;border-right: 1px dotted #000;"></div> <b style="color: darkcyan;background-color: yellow;font-weight: normal;">${obj_name}</b> = <b style="color: blue;font-weight: normal">${obj}</b></pre>`;
}

function hlog(obj, obj_name, filename, line, level = 0) {
  let h3       = document.createElement('h4');
  h3.innerHTML = `【${filename}:${line}】-: 🔍 <b style="color: #008B8B;">${obj_name}</b> | type = 【${typeof obj}】` + _dateTime();
  document.body.appendChild(h3);
  // -----------------------------------------------------
  let container              = document.createElement('div');
  container.style.fontFamily = 'Consolas';
  container.style.fontSize   = '13px';
  document.body.appendChild(container);
  // -----------------------------------------------------
  switch (typeof obj) {
    case 'object':
      container.innerHTML += `${obj_name} = ${_isEmptyObject(obj) ? '{}' : obj}<br>`;
      hPrintProperties(obj, obj_name, container, level + 1);
      break;
    case 'function':
      container.innerHTML += `${obj_name} = ${obj}<br>`;
      hPrintFunction(obj, obj_name, container, level + 1);
      break;
    case 'boolean':
      container.innerHTML += `<pre>${obj_name} = ${obj ? 'true' : 'false'}</pre>`;
      break;
    default:
      container.innerHTML += `<pre>${obj_name} = ${obj ? obj : '"空字符串"'}<br></pre>`;
  }
}

// for (let i = 100; i < 300; i++) {
//   console.log(`${i} = \x1b[${i}m${'hello world'}\x1b[0m`);
// }

function info_color(filename, line) {
  // if (process.env.XPC_SERVICE_NAME.includes('jetbrains')) {
  if (process.env.XPC_SERVICE_NAME !== '0') {
    return `\x1b[102m ${filename}:${line} `;
  } else {
    // 终端
    return `\x1b[1m${filename}:${line}`;
  }
}

function obj_name_color(obj_name) {
  // if (process.env.XPC_SERVICE_NAME.includes('jetbrains')) {
  if (process.env.XPC_SERVICE_NAME !== '0') {
    return `\x1b[103m ${obj_name} = \x1b[0m`;
  } else {
    // 终端
    return `\x1b[1m${obj_name} = \x1b[0m`;
  }
}

function obj_color(obj) {
  if (process.env.XPC_SERVICE_NAME !== '0') {
    return `\x1b[7m ${obj} \x1b[0m`;
  } else {
    // 终端
    return `\x1b[1m${obj}\x1b[0m`;
  }
}

function snlog(obj, obj_name, filename, line, collapsed = false, level = 0) {

  if ('[object Error]' === Object.prototype.toString.call(obj_name)) {
    let obj_name_info = obj_name.stack.split('\n')[0];

    if ('Error' === obj_name_info) {obj_name_info = ' ';}

    let fileInfo                = obj_name.stack.split('\n')[1];
    let message                 = fileInfo.substring(fileInfo.lastIndexOf('/') + 1);
    let regExpMatchArray        = message.match(/.*?:\d+/img);
    let regExpMatchArrayElement = regExpMatchArray[0].split(':');
    let strings                 = obj_name_info.split('Error:');
    let obj_name_               = strings.map(item => item.trim()).filter(item => item)[0];

    snlog(obj, obj_name_, regExpMatchArrayElement[0], regExpMatchArrayElement[1], collapsed, level);

    return;
  }

  if ('[object Error]' === Object.prototype.toString.call(filename)) {
    let splitElement            = filename.stack.split('\n')[1];
    let message                 = splitElement.substring(splitElement.lastIndexOf('/') + 1);
    let regExpMatchArray        = message.match(/.*?:\d+/img);
    let regExpMatchArrayElement = regExpMatchArray[0].split(':');
    snlog(obj, obj_name, regExpMatchArrayElement[0], regExpMatchArrayElement[1], collapsed, level);
    return;
  }

  let group = collapsed ? console.groupCollapsed : console.group;

  if (level > 5) {
    // console.warn('snlog level 大于 5 了');
    // let info    = '';
    // let content = '';
    // if (filename && line) {console.log(`\x1b[102m ${filename}:${line} `);}
    // if (obj_name) {info = `\x1b[103m${obj_name} = \x1b[0m`;}
    // console.log(info);
    // console.log(obj);

    let info    = '';
    let content = '';
    if (obj_name) {info = _objNameColor(obj_name);}
    content = _keyColor(obj_name) + _arrowColor('=>') + _objectColor(obj);
    console.group(info + content);
    console.log(obj);
    console.groupEnd();

    return;
  }

  if (Object.prototype.toString.call(obj) === '[object Array Iterator]') {
    snlog([...obj], `可迭代对象 [...${obj_name}]`, filename, line, collapsed, level + 1);
    return;
  }

  // let t = Object.prototype.toString.call(obj);
  let t = typeof obj;

  switch (t) {
    case 'object': {

      let empty = isEmpty(obj);

      if (empty.empty) {return console.log(empty.message, obj);}

      printProperties(obj, obj_name, filename, line, level + 1, obj_name, collapsed);

      break;
    }

    case 'function': {
      let info    = '';
      let content = '';

      if (filename && line) {
        group(`\x1b[35m【${filename}:\x1b[0m\x1b[103m${line}\x1b[0m\x1b[35m】-: 🔍 ${obj_name} | ${Object.prototype.toString.call(obj)}\x1b[0m`, _dateTime());
      } else {
        group();
      }

      if (obj_name) {info = _objNameColor(obj_name);}

      content = _funcColor(obj);
      console.log(info + content);
      // _endLine();
      console.log();
      console.groupEnd();
      break;
    }

    case 'string' : {

      let info    = '';
      let content = '';

      if (filename && line) {console.log(info_color(filename, line));}

      if (obj_name) {info = obj_name_color(obj_name);}

      let emp = isEmpty(obj);
      content = emp.empty ? obj_color(emp.message) : obj_color(obj);

      console.log(info + content);
      _endLine();

      break;
    }

    default: {
      let info    = '';
      let content = '';
      if (filename && line) {console.log(info_color(filename, line));}

      if (obj_name) {info = obj_name_color(obj_name);}

      content = obj_color(obj);

      console.log(info + content);
      _endLine();
    }
  }

}

function printJson(obj, obj_name, filename, line) {

  let env; // true : browser false:node
  try {
    env = window;
  } catch (err) {
    env = false;
  }

  if (env) {
    console.table(obj, obj_name, filename, line);
  } else {
    snlog(JSON.stringify(obj, null, 2), obj_name, filename, line);
  }
}

function printProperties(obj, obj_name, filename, line, level, key_name, collapsed) {

  let group = collapsed ? console.groupCollapsed : console.group;

  if (level > 3) {
    // console.warn('printProperties level ' + level + ' 层了');
    // let info    = '';
    // let content = '';
    // if (key_name) {info = _objNameColor(key_name);}
    // console.log(info);
    // console.log(obj);

    let info    = '';
    let content = '';
    if (key_name) {info = _objNameColor(key_name);}
    content = _keyColor(key_name) + _arrowColor('=>') + _objectColor(obj) + '| level(' + level + ')';
    console.group(info + content);
    console.log(obj);
    console.groupEnd();

    return;
  }

  if (filename && line) {
    // group(`\x1b[35m【${filename}:${line}】-: 🔍 ${obj_name} ${Object.prototype.toString.call(obj)}\x1b[0m`, _dateTime());
    if (level === 1) {

      group(`\x1b[35m【${filename}:\x1b[0m\x1b[103m${line}\x1b[0m\x1b[35m】-: 🔍 ${obj_name} ${Object.prototype.toString.call(obj)}\x1b[0m`, _dateTime());
    } else {
      group(`\x1b[35m ${obj_name} : ${Object.prototype.toString.call(obj)} \x1b[0m`);
    }
  } else {
    group();
  }

  let empty = isEmpty(obj);
  if (empty.empty) {return console.log(empty.message, obj);}

  for (let key in obj) {

    // if (!obj.propertyIsEnumerable(key)) {continue;}
    // if (!obj.hasOwnProperty(key)) {continue;}

    let info    = '';
    let content = '';

    switch (Object.prototype.toString.call(obj[key])) {

      case '[object Function]': {
        if (key_name) {info = _objNameColor(key_name);}
        content = _keyColor(key) + _arrowColor('=>') + _funcColor(obj[key]);
        break;
      }
      case '[object Object]': {

        let empty = isEmpty(obj);
        if (empty.empty) {return console.log(empty.message, obj);}

        printProperties(obj[key], obj_name + ' 〉 ' + key, filename, line, level + 1, key);

        break;
      }
      case '[object Array]': {

        let empty = isEmpty(obj);

        if (empty.empty) {return console.log(empty.message, obj);}

        printProperties(obj[key], obj_name + ' 〉 ' + key, filename, line, level + 1, key);

        break;
      }

      // case '[object MouseEvent]': {
      //
      //   if (obj_name + ' 〉 ' + key) {info = _objNameColor(obj_name + ' 〉 ' + key);}
      //   console.log(info + '' + Object.prototype.toString.call(obj[key]));
      //   console.log(obj[key]);
      //
      //   continue;
      // }

      case '[object MouseEvent]': {

        let empty = isEmpty(obj[key]);
        if (empty.empty) {return console.log(empty.message, obj[key]);}

        printProperties(obj[key], obj_name + ' 〉 ' + key, filename, line, level + 1, key);

        break;
      }

      case '[object NodeList]':
      case '[object DOMStringMap]':
      case '[object CSSStyleDeclaration]':
      case '[object Text]':
      case '[object StylePropertyMap]':
      case '[object NamedNodeMap]':
      case '[object Window]':
      case '[object HTMLCollection]':
      case '[object HTMLParagraphElement]':
      case '[object HTMLUListElement]':
      case '[object HTMLLIElement]':
      case '[object HTMLDocument]':
      case '[object HTMLDivElement]':
      case '[object HTMLHtmlElement]':
      case '[object HTMLBodyElement]': {

        // if (key_name) {info = _objNameColor(key_name);}
        // content = _keyColor(key) + _arrowColor('=>') + _objectColor(obj[key]);
        // group(info + content);
        // console.log(obj[key]);
        // console.groupEnd();
        if (key_name) {info = _objNameColor(key_name);}
        content = _keyColor(key) + _arrowColor('=>') + _objectColor(obj[key]);
        console.group(info + content);
        console.log(obj[key]);
        console.groupEnd();
        continue;
      }

      case '[object Symbol]': {
        if (key_name) {info = _objNameColor(key_name);}
        content = _keyColor(key) + _arrowColor('=>');
        console.log(info + content, obj[key]);
        console.log();
        // _endLine();
        continue;
        // break;
      }

      default: {
        if (key_name) {info = _objNameColor(key_name);}
        content = _keyColor(key) + _arrowColor('=>') + _objectColor(obj[key]);
      }
    }

    console.log(info + content);
  }
  // _endLine();
  console.groupEnd();
}

// for (let i = 0; i < 100; i++) {
//   console.log(`${i} = \x1b[${i}m${'------------------------------------------------------'}\x1b[0m`);
// }

// export {snlog, hlog, printProperties, printJson};

exports.info            = Error;
exports.snlog           = snlog;
exports.hlog            = hlog;
exports.printJson       = printJson;
exports.printProperties = printProperties;
