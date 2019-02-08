const dateformat = require('dateformat');

// let chalk = require('chalk');

// function snlog (filename, line, obj_name, obj) {
//   console.log(chalk.bgYellow.bold(`【 ${filename}':'${line} 】-: 👇`));
//   // console.log(chalk.bgGreen(` ${obj_name} = `) + chalk.bgBlack.white.bold(`${obj}`));
//   console.log(chalk.bgGreen(` ${obj_name} = `) + `${obj}`);
//   console.log(chalk.bold('------------------------------------------------------'));
// }

function _endLine () {
  console.log('\x1b[92m------------------------------------------------------\x1b[0m');
}

function _dateTime () {
  return '@' + dateformat(new Date(), 'yyyy-MM-dd HH:mm:ss');
}

function _isEmptyObject (obj) {
  for (var key in obj) {
    return false;
  }
  return true;
};

function _keyColor (key) {
  return `\x1b[43m ${key} \x1b[0m`;
}

function _arrowColor (arrow) {

  return '\x1b[39m' + arrow + '\x1b[0m';
}

function _objectColor (obj) {
  return `\x1b[106m ${obj} \x1b[0m`;
}

function _funcColor (func) {

  return `\x1b[34m ${func} \x1b[0m`;
}

function _objNameColor (objName) {
  return `\x1b[90m${objName} : \x1b[0m`;

}

function getInnerHTML (level, key, show) {
  return `<pre style="padding-left: ${level * 20}px"><b style="color: red;background-color: yellow;font-weight: normal;">${key}</b> = ${show}</pre>`;
}

function getInnerHTMLWarn (level, key, show) {
  return `<pre style="padding-left: ${level * 20}px"><b style="color: yellow;background-color: orangered;font-weight: normal;">${key}</b> = ${show}</pre>`;
}

function hPrintProperties (obj, obj_name, container, level) {

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

function hPrintFunction (obj, obj_name, container, level) {
  container.innerHTML += `<pre style="position: relative; left: 0; top: 0;padding-left: ${level * 20}px;margin-bottom: 10px;">
<div style="position: absolute; left: 0; top: 0;width: ${level * 20}px; height: 100%;border-right: 1px dotted #000;"></div> <b style="color: darkcyan;background-color: yellow;font-weight: normal;">${obj_name}</b> = <b style="color: blue;font-weight: normal">${obj}</b></pre>`;
}

function hlog (obj, obj_name, filename, line, level = 0) {
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

function snlog (obj, obj_name, filename, line, level = 0) {
  if (level > 5) {
    console.warn('snlog level 大于 5 了');
    return;
  }

  if (Object.prototype.toString.call(obj) === '[object Array Iterator]') {
    snlog([...obj], `可迭代对象 [...${obj_name}]`, filename, line, level + 1);
    return;
  }

  switch (typeof obj) {
    case 'object': {

      if (_isEmptyObject(obj)) {
        console.log('空对象', obj);
        return;
      }

      printProperties(obj, obj_name, filename, line, level + 1);
      break;
    }
    case 'function': {
      let info    = '';
      let content = '';

      if (filename && line) {
        console.group(`\x1b[35m【${filename}:${line}】-: 🔍 ${obj_name} | type = 【${typeof obj}】\x1b[0m`, _dateTime());
      } else {
        console.group();
      }

      if (obj_name) {
        info = _objNameColor(obj_name);
      }
      content = _funcColor(obj);
      console.log(info + content);
      // _endLine();
      console.log();
      console.groupEnd();
      break;
    }
    default: {
      let info    = '';
      let content = '';
      if (filename && line) {
        console.group(`\x1b[35m【${filename}:${line}】-: 🔍 ${obj_name} | type = 【${typeof obj}】\x1b[0m`, _dateTime());
      } else {
        console.group();
      }

      if (obj_name) {
        info = _objNameColor(obj_name);
      }

      content = _objectColor(obj);
      console.log(info + content);
      console.groupEnd();
    }
  }

}

function printJson (obj, obj_name, filename, line) {

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

function printProperties (obj, obj_name, filename, line, level) {

  if (level > 3) {
    console.warn('printProperties level ' + level + ' 层了');
    // console.log(obj_name + ' = ', obj, 'log.js', '188');
    let info    = '';
    let content = '';
    if (obj_name) {info = _objNameColor(obj_name);}
    // content = _keyColor(obj_name) + _arrowColor('=>');
    console.log(info, obj);

    return;
  }

  if (filename && line) {
    // console.group(`\x1b[35m【${filename}:${line}】-: 🔍 ${obj_name} ${Object.prototype.toString.call(obj)}\x1b[0m`, _dateTime());
    if (level === 1) {
      console.group(`\x1b[35m【${filename}:${line}】-: 🔍 ${obj_name} ${Object.prototype.toString.call(obj)}\x1b[0m`, _dateTime());
    } else {
      console.group(`\x1b[35m ${obj_name} : ${Object.prototype.toString.call(obj)} \x1b[0m`);
    }
  } else {
    console.group();
  }

  if (_isEmptyObject(obj)) {
    console.log('空对象', obj);
    console.groupEnd();
    return;
  }

  for (let key in obj) {

    // if (!obj.propertyIsEnumerable(key)) {continue;}
    if (!obj.hasOwnProperty(key)) {continue;}

    let info    = '';
    let content = '';

    switch (typeof obj[key]) {

      case 'function': {
        if (obj_name) {info = _objNameColor(obj_name);}
        content = _keyColor(key) + _arrowColor('=>') + _funcColor(obj[key]);
        break;
      }
      case 'object': {

        if (_isEmptyObject(obj)) {
          console.log('空对象', obj);
          continue;
        }

        // if (obj_name) {info = _objNameColor(obj_name);}
        // content = _keyColor(key) + _arrowColor('=>') + _objectColor(obj[key]);
        // console.log(info + content);
        printProperties(obj[key], obj_name + ' 〉 ' + key, filename, line, level + 1);

        break;
      }
      case 'symbol': {
        if (obj_name) {info = _objNameColor(obj_name);}
        content = _keyColor(key) + _arrowColor('=>');
        console.log(info + content, obj[key]);
        console.log();
        // _endLine();
        continue;
        // break;
      }

      default: {
        if (obj_name) {info = _objNameColor(obj_name);}
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

// exports.snlog           = snlog;
// exports.hlog            = hlog;
// exports.printJson       = printJson;
// exports.printProperties = printProperties;

export {snlog, hlog, printProperties, printJson};
