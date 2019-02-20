const fs       = require('fs');
const request  = require('request');
const cheerio  = require('cheerio');
var progress   = require('request-progress');
const sprintf  = require('sprintf-js').sprintf;
const vsprintf = require('sprintf-js').vsprintf;

function getImageName (url) {

  let [m] = url.match(/\/.*(png|jpg|jpeg|gif)/smgi);

  let filename = m.substring(m.lastIndexOf('/') + 1);

  return filename;
}

function downloadImageParallel (url, filepath) {

  filepath = '/Users/stone/Desktop/image_download/' + filepath;

  fs.mkdir(filepath, { recursive: true }, (err) => {
    // if (err) {throw err;}
    try {
      request({
        'url'   : url,
        'method': 'GET',
        // 'proxy' : 'http://127.0.0.1:1087',
      }, function (error, response, body) {

        if (!error && response.statusCode === 200) {
          console.log('下载成功 : ' + url);
        }

      }).pipe(fs.createWriteStream(filepath + '/' + url.substring(url.lastIndexOf('/') + 1)));
    } catch (err) {
      request({
        'url'   : url,
        'method': 'GET',
        'proxy' : 'http://127.0.0.1:1087',
      }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
          console.log('下载成功 : ' + url);
        }
      }).pipe(fs.createWriteStream(filepath + '/' + url.substring(url.lastIndexOf('/') + 1)));
    }
  });
}

function downloadImage (url, filepath) {

  filepath = '/Users/stone/Desktop/image_download/' + filepath;

  return new Promise((resolve, reject) => {

    fs.mkdir(filepath, { recursive: true }, (err) => {
      // if (err) {throw err;}
      try {
        request({
          'url'   : url,
          'method': 'GET',
          // 'proxy' : 'http://127.0.0.1:1087',
        }, function (error, response, body) {

          if (!error && response.statusCode === 200) {
            resolve(response);
            console.log('下载成功 : ' + url);
          } else {
            reject(error);
          }

        }).pipe(fs.createWriteStream(filepath + '/' + url.substring(url.lastIndexOf('/') + 1)));
      } catch (err) {
        request({
          'url'   : url,
          'method': 'GET',
          'proxy' : 'http://127.0.0.1:1087',
        }, function (error, response, body) {
          if (!error && response.statusCode === 200) {
            resolve(response);
            console.log('下载成功 : ' + url);
          } else {
            reject(error);
          }
        }).pipe(fs.createWriteStream(filepath + '/' + url.substring(url.lastIndexOf('/') + 1)));
      }
    });

  });
}

function downloadZipParallel (url, filepath, filename) {
  console.log(`开始下载: ${filename}(${url})`);
  filepath = '/Users/stone/Desktop/image_download/' + filepath;
  fs.mkdir(filepath, { recursive: true }, (err) => {
    // if (err) {throw err;}
    progress(request({
      'url'   : url,
      'method': 'GET',
      'proxy' : 'http://127.0.0.1:1087',
      headers : {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36',
      },
    }), {})
      .on('progress', function (state) {
        // console.log(sprintf('%.2f%%', state.percent * 100));
      })
      .on('error', function (err) {
        console.log(err);
      })
      .on('end', function () {
        console.log(`下载完成: ${filename}(${url})`);
      })
      .pipe(fs.createWriteStream(filepath + '/' + filename));
  });
}

// ;(async () => {
//
//   let filepath = 'images';
//
//   let image = await downloadImage('https://imflock.com/comic/thumbnail/42000/d-41160/fj2zykxz54hggz0o6w8bkapfm2eu5v_w1100.jpg', filepath);
//   // let filePath = './image.jpg';
//   // fs.writeFile(filePath, image, function (err) {
//   //   if (err) {return console.error(err);}
//   //   console.log('数据写入成功！');
//   // });
// })();

exports.getImageName          = getImageName;
exports.downloadImage         = downloadImage;
exports.downloadImageParallel = downloadImageParallel;
exports.downloadZipParallel   = downloadZipParallel;
