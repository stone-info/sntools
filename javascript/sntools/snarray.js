// splice() 方法用于添加或删除数组中的元素。
//
// 注意：这种方法会改变原始数组。
//
// 返回值
// 如果仅删除一个元素，则返回一个元素的数组。 如果未删除任何元素，则返回空数组。
//
// array.splice(index,howmany,item1,.....,itemX)
//
// index	必需。规定从何处添加/删除元素。
//    该参数是开始插入和（或）删除的数组元素的下标，必须是数字。
// howmany	必需。规定应该删除多少元素。必须是数字，但可以是 "0"。
//    如果未规定此参数，则删除从 index 开始到原数组结尾的所有元素。
// item1, ..., itemX	可选。要添加到数组的新元素

function sn_insert (index, obj, array) {
  return array.splice(index, 0, obj);
}

function sn_remove (index, array) {
  return array.splice(index, 1);
}

// slice() 方法可从已有的数组中返回选定的元素。
//
// slice()方法可提取字符串的某个部分，并以新的字符串返回被提取的部分。
//
// 注意： slice() 方法不会改变原始数组。
//
// array.slice(start, end)
//
// start	可选。规定从何处开始选取。如果是负数，那么它规定从数组尾部开始算起的位置。
//        也就是说，-1 指最后一个元素，-2 指倒数第二个元素，以此类推。
//
// end	  可选。规定从何处结束选取。该参数是数组片断结束处的数组下标。
//        如果没有指定该参数，那么切分的数组包含从 start 到数组结束的所有元素。
//        如果这个参数是负数，那么它规定的是从数组尾部开始算起的元素。

// var fruits = ['Banana', 'Orange', 'Lemon', 'Apple', 'Mango'];
// snlog(fruits.slice(1, 3), `fruits.slice(1,3)`, 'array_test.js', '213');
// snlog(fruits.slice(-3, -1), `fruits.slice(-1,-3)`, 'array_test.js', '220');

// to_a 类数组 转 数组
function to_a (obj) {
  return Array.prototype.slice.call(obj);
}

function to_o (arr) {

  // return Object.assign({},array)
  return { ...arr };
}

// exports.sn_insert = sn_insert;
// exports.sn_remove = sn_remove;
// exports.to_a      = to_a;

export {sn_insert, sn_remove, to_a, to_o};

//
// copyWithin() 方法用于从数组的指定位置拷贝元素到数组的另一个指定位置中。
// array.copyWithin(target, start, end)
//
// target	必需。复制到指定目标索引位置。
// start	可选。元素复制的起始位置。
// end	可选。停止复制的索引位置 (默认为 array.length)。如果为负值，表示倒数。
// let obj1 = [].copyWithin.call({ length: 5, 3: 1 }, 0, 3);
// let obj2 = Array.prototype.copyWithin.call({ length: 5, 3: 1 }, 0, 3);

// find() 方法返回通过测试（函数内判断）的数组的第一个元素的值。
//
// find() 方法为数组中的每个元素都调用一次函数执行：
//
// 当数组中的元素在测试条件时返回 true 时, find() 返回符合条件的元素，之后的值不会再调用执行函数。
// 如果没有符合条件的元素返回 undefined

// console.log('■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■');

// function main () {
//   const snlog = require('./log').snlog;
//
//   var number = [3, 10, 18, 20].find(age => age >= 18);
//   snlog(number, `number`, 'array_t.js', '72');
//
//   var index = [3, 10, 18, 20].findIndex(age => age >= 18);
//   snlog(index, `index`, 'array_t.js', '76');
//
//   var array = Array.from('hello world');
//   snlog(array, `array`, 'array_t.js', '79');
//
//   var array = [...'hello stone'];
//   snlog(array, `array`, 'array_t.js', '83');
//
//   var message = [1, 2, 3].includes(3);
//   console.log(message);
//
//   var fruits = ['Banana', 'Orange', 'Apple', 'Mango', 'Apple'];
//   snlog(fruits.indexOf('Apple', 3), `fruits.indexOf("Apple")`, 'array_test.js', '120');
//   snlog(fruits.lastIndexOf('Apple'), `fruits.lastIndexOf("Apple")`, 'array_test.js', '121');
//
//   snlog(Array.isArray(fruits), `Array.isArray(fruits)`, 'array_t.js', '90');
//
//   // every() 方法用于检测数组所有元素是否都符合指定条件（通过函数提供）。
//   //
//   // every() 方法使用指定函数检测数组中的所有元素：
//   //
//   // 如果数组中检测到有一个元素不满足，则整个表达式返回 false ，且剩余的元素不会再进行检测。
//   // 如果所有元素都满足条件，则返回 true。
//
//   snlog([32, 33, 16, 40].every(age => age >= 18), `[32, 33, 16, 40].every(age => age >= 18)`, 'array_t.js', '95');
//
//   // some() 方法用于检测数组中的元素是否满足指定条件（函数提供）。
//   //
//   // some() 方法会依次执行数组的每个元素：
//   //
//   // 如果有一个元素满足条件，则表达式返回true , 剩余的元素不会再执行检测。
//   // 如果没有满足条件的元素，则返回false。
//   snlog([32, 33, 16, 40].some(age => age >= 18), `[32, 33, 16, 40].some(age => age >= 18)`, 'array_t.js', '110');
//
// }

// main();

// console.log('■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■');
