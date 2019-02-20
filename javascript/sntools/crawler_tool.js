const request = require('request');
const fs      = require('fs');

function pRequest (link) {
  return new Promise((resolve, reject) => {
    request({
      'url'   : link,
      'method': 'GET',
      'proxy' : 'http://127.0.0.1:1087',
      headers : {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36',
      },
    }, function (error, response, body) {if (!error && response.statusCode === 200) {resolve(body);} else {reject(error);}});
  });
}

function findAll (pattern, str, flags = 'img') {

  if (pattern.multiline) {/* console.log('m 模式有设置!');*/} else {/* console.log('m 模式没有设置!');*/}
  if (pattern.ignoreCase) {/* console.log('i 模式有设置!');*/} else {/* console.log('i 模式没有设置!');*/}
  if (pattern.global) {/* console.log("g 模式有设置!");*/} else {/* console.log("g 模式没有设置!");*/}

  let _pattern = new RegExp(pattern, flags);

  let rList = [];

  let m;

  while ((m = _pattern.exec(str)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === _pattern.lastIndex) {_pattern.lastIndex++;}

    let items = {
      index : m.index,
      match : m[0],
      groups: [],
    };

    rList.push(items);

    for (let i = 1; i < m.length; ++i) {
      let mElement = m[i];

      items.groups.push({
        index: str.search(mElement),
        match: mElement,
      });
    }
  }
  return rList;
}

function searchAll (pattern, str, flags = 'img') {

  let _pattern = new RegExp(pattern, flags);
  let rList    = [];
  let m;
  while ((m = _pattern.exec(str)) !== null) {rList.push(m.index);}
  return rList;
}

function downloadSuccess (item, failList) {
  failList = failList.filter(x => !(x.url === item.url));
}

function downloadFail (item, failList) {
  console.log(`放入错误队列中: ${item}`);
  failList.push(item);
}

function convertToJpg (filename, filepath) {

  if (searchAll(/(gif|png)/, filename).length > 0) {
    let nFilename = filename.substring(0, filename.lastIndexOf('.')) + '.jpg';

    let writeStream = fs.createWriteStream(filepath + '/' + nFilename);

    writeStream.on('finish', () => {

      fs.unlink(filepath + '/' + filename, (err) => {
        if (err) {return console.log(err);}
        console.log(`转换成功 : ${filename} to ${nFilename}`);
      });
    });
    gm(filepath + '/' + filename).stream('jpg').pipe(writeStream);
  }
}

let makeFolder = (title) => {
  return new Promise((resolve, reject) => {
    // let filepath = title.replace(/ /img, '_').replace(/\//img, '_');
    let filepath = title.replace(/\//img, '_').trim();
    filepath     = '/Users/stone/Desktop/image_download/' + filepath;
    fs.mkdir(filepath, { recursive: true }, (err) => {
      resolve(filepath);
    });
  });
};

const toMatrix = (arr, elementCount) => {
  let r = [];
  for (let i = 0; i < arr.length; i += elementCount) {
    r.push(arr.slice(i, i + elementCount));
  }
  return r;
};

const flatten = (arr) => {
  while (arr.some(item => Array.isArray(item))) {
    arr = [].concat(...arr);
  }
  return arr;
};

exports.flatten         = flatten;
exports.toMatrix        = toMatrix;
exports.pRequest        = pRequest;
exports.findAll         = findAll;
exports.searchAll       = searchAll;
exports.downloadSuccess = downloadSuccess;
exports.downloadFail    = downloadFail;
exports.convertToJpg    = convertToJpg;
exports.makeFolder      = makeFolder;
