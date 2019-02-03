var fs     = require('fs');
const path = require('path');

module.exports = (filename, content) => {
  fs.writeFile(path.resolve(__dirname, '../../../yyy_garbage_data/'+filename), content, function (err) {
    if (err) {return console.error(err);}
    console.log('数据写入成功！');
  });
};
