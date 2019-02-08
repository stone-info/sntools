import {snlog}             from './log';
import {searchAll}         from './regex';
import {sprintf, vsprintf} from 'sprintf-js';

snlog(sprintf('%2$s %3$s a %1$s', 'cracker', 'Polly', 'wants'), `sprintf('%2$s %3$s a %1$s', 'cracker', 'Polly', 'wants')`, 'string.js', '5');
snlog(vsprintf('The first 4 letters of the english alphabet are: %s, %s, %s and %s', ['a', 'b', 'c', 'd']), `vsprintf('The first 4 letters of the english alphabet are: %s, %s, %s and %s', ['a', 'b', 'c', 'd'])`, 'string.js', '7');

// console.log('■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■');
let str = 'hello world, stone, 123, WORLD';

// 返回在指定位置的字符。
snlog(str.charAt('0'), `str.charAt('0')`, 'string.js', '6');
// 返回在指定的位置的字符的 Unicode 编码。
snlog(str.charCodeAt(0), `str.charCodeAt(0)`, 'string.js', '9');

// concat() 方法用于连接两个或多个字符串。
// 该方法没有改变原有字符串，但是会返回连接两个或多个字符串新字符串。
// string.concat(string1, string2, ..., stringX)
snlog('hello '.concat('world', ', stone'), `'hello '.concat('world', ', stone')`, 'string.js', '14');

// 将 Unicode 编码转为一个字符:
snlog(String.fromCharCode(65), `String.fromCharCode(65)`, 'string.js', '16');
snlog(String.fromCharCode(72, 69, 76, 76, 79), `String.fromCharCode(72,69,76,76,79)`, 'string.js', '17');

// indexOf() 方法可返回某个指定的字符串值在字符串中首次出现的位置。
// 如果没有找到匹配的字符串则返回 -1。
// 注意： indexOf() 方法区分大小写。
// 提示： 同样你可以查看类似方法 lastIndexOf() 。
snlog(str.indexOf('world'), `str.indexOf('world')`, 'string.js', '23');
snlog(str.search(/world/img), `str.search('world')`, 'string.js', '24');
snlog(searchAll(/world/img, str), `searchAll(/world/img,str)`, 'string.js', '25');
// includes() 方法用于判断字符串是否包含指定的子字符串。
// 如果找到匹配的字符串则返回 true，否则返回 false。
// 注意： includes() 方法区分大小写。
snlog(str.includes('world'), `str.includes('world')`, 'string.js', '27');

console.log('■'.repeat(30));

snlog(str.slice(1, 5), `str.slice(1,5)`, 'string.js', '34');
snlog(str.split(','), `str.split(',')`, 'string.js', '35');

snlog(str.startsWith('hello'), `str.startsWith('hello')`, 'string.js', '37');
// substr() 方法可在字符串中抽取从 开始 下标开始的指定数目的字符。
// 提示： substr() 的参数指定的是子串的开始位置和长度，因此它可以替代 substring() 和 slice() 来使用。
// 在 IE 4 中，参数 start 的值无效。在这个 BUG 中，start 规定的是第 0 个字符的位置。在之后的版本中，此 BUG 已被修正。
// ECMAscript 没有对该方法进行标准化，因此【反对】使用它。
// 注意： substr() 方法不会改变源字符串。
snlog(str.substr(2, 3), `str.substr(2,3)`, 'string.js', '38');
snlog(str.substring(2, 5), `str.substring(2,3)`, 'string.js', '42');
snlog(str.slice(2, 5), `str.slice(2,5)`, 'string.js', '45');

snlog(str.toLowerCase(), `str.toLowerCase()`, 'string.js', '47');
// toLocaleLowerCase() 方法根据本地主机的语言环境把字符串转换为小写。
// 本地是根据浏览器的语言设置来判断的。
// 通常，该方法与 toLowerCase() 方法返回的结果相同，只有几种语言（如土耳其语）具有地方特有的大小写映射。
// 注意: toLocaleLowerCase() 方法没有改变原始字符串。
// 提示: 使用 toLocaleUpperCase() 方法根据本地主机的语言将字符串转换为大写。
snlog(str.toLocaleLowerCase(), `str.toLocaleLowerCase()`, 'string.js', '47');

snlog(str.toUpperCase(), `str.toUpperCase()`, 'string.js', '50');
snlog(str.toLocaleUpperCase(), `str.toLocaleUpperCase()`, 'string.js', '51');
// trim() 方法用于删除字符串的头尾空格。
// trim() 方法不会改变原始字符串。
snlog(' hello world ', `' hello world '`, 'string.js', '53');

snlog('hello world'.valueOf(), `'hello world'.valueOf()`, 'string.js', '61');
snlog('hello world', `'hello world'`, 'string.js', '62');
console.log('hello world'.valueOf());
console.log('hello world');

// anchor() 方法用于创建 HTML 锚。
// 该方法返回加了 <a> 标签的字符串, 如下所示:
// <a name="anchorname">string</a>
console.log('hello world'.anchor('hello')); // <a name="hello">hello world</a>

console.log('hello world'.big()); // <big>hello world</big>
// blink() 方法用于显示闪动的字符串。
// 该方法返回加了 <blink> 标签的字符串, 如下所示:
// <blink>string</blink>
// 目前只有 Firefox 和 Opera 浏览器支持 blink() 方法. Internet Explorer, Chrome, 以及 Safari 不支持 blink() 方法。
console.log('hello world'.blink()); // <blink>hello world</blink>

console.log('hello world'.bold()); // <b>hello world</b>
console.log('hello world'.fixed()); // <tt>hello world</tt>
console.log('hello world'.fontcolor('#FFC1C1')); // <font color="#FFC1C1">hello world</font>
// 必须. size 参数必须是从 1 至 7 的数字。
console.log('hello world'.fontsize(7)); // <font size="7">hello world</font>
console.log('hello world'.italics()); // <i>hello world</i>
console.log('hello world'.link('https://www.baidu.com')); // <a href="https://www.baidu.com">hello world</a>
console.log('hello world'.small()); // <small>hello world</small>
// strike() 方法用于显示加删除线的字符串。
// 该方法返回加了 <strike> 标签的字符串, 如下所示:
// <strike>string</strike>
console.log('hello world'.strike()); // <strike>hello world</strike>
// sub() 方法用于把字符串显示为下标。
// 该方法返回加入 <sub> 标签的字符串，如下所示：
// <sub>string</sub>
console.log('hello world'.sub()); // <sub>hello world</sub>
// sup() 方法用于把字符串显示为上标。
// 该方法返回加入 the <sup> 标签的字符串, 如下:
// <sup>string</sup>
console.log('hello world'.sup()); // <sup>hello world</sup>

