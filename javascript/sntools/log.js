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

function isEmptyObject (obj) {
  for (var key in obj) {
    return false;
  }
  return true;
};

function hPrintProperties (obj, obj_name, container, level) {
  for (let key in obj) {

    let objElement = obj[key];

    switch (typeof objElement) {

      case 'object':
        container.innerHTML += `<pre style="padding-left: ${level * 20}px">${key} = ${isEmptyObject(objElement) ? '{}' : objElement}</pre>`;
        hPrintProperties(objElement, key, container, level + 1);
        break;
      case 'function':
        // container.innerHTML += getLevelString(level) + `${key} = ${objElement}<br>`;
        hPrintFunction(objElement, key, container, level);
        break;
      case 'boolean':
        container.innerHTML += `<pre style="padding-left: ${level * 20}px"><b style="color: red;background-color: yellow;font-weight: normal;">${key}</b> = ${objElement ? 'true' : 'false'}</pre>`;
        break;
      default:
        container.innerHTML += `<pre style="padding-left: ${level * 20}px"><b style="color: red;background-color: yellow;font-weight: normal;">${key}</b> = ${objElement ? objElement : '"空字符串"'}</pre>`;
    }
  }
}

function hPrintFunction (obj, obj_name, container, level) {
  container.innerHTML += `<pre style="position: relative; left: 0; top: 0;padding-left: ${level * 20}px;margin-bottom: 10px;">
<div style="position: absolute; left: 0; top: 0;width: ${level * 20}px; height: 100%;border-right: 1px dotted #000;"></div> <b style="color: darkcyan;background-color: yellow;font-weight: normal;">${obj_name}</b> = <b style="color: blue;font-weight: normal">${obj}</b></pre>`;
}

function hlog (obj, obj_name, filename, line) {
  let h3       = document.createElement('h4');
  h3.innerHTML = `【${filename}:${line}】-: 🔍 <b style="color: #008B8B;">${obj_name}</b> | type = 【${typeof obj}】` + _dateTime();
  document.body.appendChild(h3);
  // -----------------------------------------------------
  let container              = document.createElement('div');
  container.style.fontFamily = 'Consolas';
  container.style.fontSize   = '12px';
  document.body.appendChild(container);
  // -----------------------------------------------------
  switch (typeof obj) {
    case 'object':
      container.innerHTML += `${obj_name} = ${isEmptyObject(obj) ? '{}' : obj}<br>`;
      hPrintProperties(obj, obj_name, container, 1);
      break;
    case 'function':
      container.innerHTML += `${obj_name} = ${obj}<br>`;
      hPrintFunction(obj, obj_name, container, 1);
      break;
    case 'boolean':
      container.innerHTML += `<pre>${obj_name} = ${obj ? 'true' : 'false'}</pre>`;
      break;
    default:
      container.innerHTML += `<pre>${obj_name} = ${obj ? obj : '"空字符串"'}<br></pre>`;
  }
}

function snlog (obj, obj_name, filename, line) {
  // console.log('\x1b[46m【 ' + filename + ':' + line + ' 】-: 👇\n\x1b[0m' + '\x1b[43m' + ` ${obj_name} = ` + '\x1b[0m' + obj);

  if (typeof obj === 'object') {return printProperties(obj, obj_name, filename, line);}

  let s  = '';
  let s1 = '';
  let s2 = '';

  if (typeof obj === 'function') {
    if (filename && line) {
      console.group(`\x1b[35m【${filename}:${line}】-: 🔍 ${obj_name} | type = 【${typeof obj}】\x1b[0m`, _dateTime());
    } else {
      console.group();
    }

    if (obj_name) {s1 = `\x1b[90m${obj_name} = \x1b[0m`;}
    s2 = `\x1b[34m${obj}\x1b[0m`;
    console.log(s + s1 + s2);
    console.log('\x1b[92m------------------------------------------------------\x1b[0m');
    console.groupEnd();
    return;
  }

  if (filename && line) {s = `\x1b[46m【 ${filename}:${line} 】-: 👇\n\x1b[0m`;}
  if (obj_name) {s1 = `\x1b[43m ${obj_name} = \x1b[0m`;}

  s2 = `\x1b[47m ${obj} \n\x1b[0m`;

  console.log(s + s1 + s2);
  _endLine();
}

function printJson (obj, obj_name, filename, line) {
  snlog(JSON.stringify(obj, null, 2), obj_name, filename, line);
}

function printProperties (obj, obj_name, filename, line) {
  if (filename && line) {
    console.group(`\x1b[35m【${filename}:${line}】-: 🔍 ${obj_name} | type = 【${typeof obj}】\x1b[0m`, _dateTime());
  } else {
    console.group();
  }
  for (let key in obj) {
    let s  = '';
    let s1 = '';
    let s2 = '';

    if (typeof obj[key] === 'function') {
      if (obj_name) {s1 = `\x1b[90m${obj_name} = \x1b[0m`;}
      s2 = `\x1b[43m ${key}\x1b[0m => \x1b[34m${obj[key]}\x1b[0m`;
    } else if (typeof obj[key] === 'object') {
      printProperties(obj[key], key, filename, line);
    } else {
      if (obj_name) {s1 = `\x1b[90m${obj_name} = \x1b[0m`;}
      s2 = `\x1b[43m ${key}\x1b[0m => \x1b[47m${obj[key]}\x1b[0m`;
    }
    console.log(s + s1 + s2);
    _endLine();
  }
  console.groupEnd();
}

// for (let i = 0; i < 100; i++) {
//   console.log(`${i} = \x1b[${i}m${'------------------------------------------------------'}\x1b[0m`);
// }

exports.snlog           = snlog;
exports.hlog            = hlog;
exports.printJson       = printJson;
exports.printProperties = printProperties;
