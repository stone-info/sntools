// 返回带正号的 double 值，该值大于等于 0.0 且小于 1.0。 [0,1）返回值的范围
// Math.random

function random_color () {
  var r = Math.floor(Math.random() * 256);
  var g = Math.floor(Math.random() * 256);
  var b = Math.floor(Math.random() * 256);
  return 'rgb(' + r + ', ' + g + ', ' + b + ')';
}

exports.random_color = random_color;
