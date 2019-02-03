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
exports.printJson       = printJson;
exports.printProperties = printProperties;
