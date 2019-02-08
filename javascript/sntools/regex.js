const pattern = /world((\d)(\d)(\d))(\d{3})/img;
var str       = 'hello world456789 WORLD123456';

// 得自己写 /g 标记,
function find (pattern, str, flags = 'img') {
  let _pattern = new RegExp(pattern, flags);

  return str.match(_pattern);
}

function replace (pattern, str, newStr, flags = 'img') {
  // let _pattern = pattern.global ? pattern : new RegExp(pattern, 'g');
  let _pattern = new RegExp(pattern, flags);
  return str.replace(_pattern, newStr);
}

function split (pattern, str, limit = -1) {
  return str.split(pattern, limit);
}

// 得自己写 /g 标记
function findAll (pattern, str, flags = 'img') {

  if (pattern.multiline) {/* console.log('m 模式有设置!');*/} else {/* console.log('m 模式没有设置!');*/}
  if (pattern.ignoreCase) {/* console.log('i 模式有设置!');*/} else {/* console.log('i 模式没有设置!');*/}
  if (pattern.global) {/* console.log("g 模式有设置!");*/} else {/* console.log("g 模式没有设置!");*/}

  // lastIndex 属性用于规定下次匹配的起始位置。
  //
  // 注意： 该属性只有设置标志 g 才能使用。
  //
  // 上次匹配的结果是由方法 RegExp.exec() 和 RegExp.test() 找到的，
  // 它们都以 lastIndex 属性所指的位置作为下次检索的起始点。这样，就可以通过反复调用这两个方法来遍历一个字符串中的所有匹配文本。
  //
  // 注意：该属性是可读可写的。只要目标字符串的下一次搜索开始，
  // 就可以对它进行设置。当方法 exec() 或 test() 再也找不到可以匹配的文本时，它们会自动把 lastIndex 属性重置为 0。
  //
  // pattern.lastIndex;

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

    // snlog(_pattern.lastIndex, `_pattern.lastIndex`, 'regex.js', '45');
    // snlog(/456/.exec(str), `/456/.exec(str)`, 'regex.js', '46');

    for (let i = 1; i < m.length; ++i) {
      let mElement = m[i];

      items.groups.push({
        index: str.search(mElement),
        match: mElement,
      });
    }

    // The result can be accessed through the `m`-variable.
    // m.forEach((match, groupIndex) => {
    //   items.groups[groupIndex] = match;
    //   // console.log(`Found match, groups ${groupIndex}: ${match}`);
    // });
  }

  return rList;
}

// 如果没有找到任何匹配的子串，则返回 -1。
function findOne (pattern, str, flags = 'img') {

  let _pattern = new RegExp(pattern, flags);

  return str.search(_pattern);
}

function test (pattern, str, flags = 'img') {
  let _pattern = new RegExp(pattern, flags);
  return _pattern.test(str);
}

export {findAll, test, findOne, find, replace, split};

// var patt = new RegExp('RUNOOB', 'g');
// var res  = patt.toString();
// snlog(res, `res`, 'regex.js', '48');

// snlog(str.search(pattern), `str.search(pattern)`, 'regex.js', '52');

// var n = str.match(pattern);

