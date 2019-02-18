const mongoose = require('mongoose');
const db       = 'mongodb://localhost/puppeteer_test';
const glob     = require('glob');
const path     = require('path');

mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);

mongoose.Promise = global.Promise;

exports.initSchemas = () => {
  return new Promise((resolve, reject) => {
    glob(path.resolve(__dirname, './schema', '**/*.js'), function (err, files) {
      files.forEach(file => require(file));
      resolve();
    });
  });
};

exports.initAdmin = async () => {

  const User = mongoose.model('User');
  let user   = await User.findOne({
    username: 'stone',
  });

  if (!user) {
    const user = new User({
      username: 'stone',
      email   : 'testman00@163.com',
      password: '123',
      role    : 'admin',
    });

    await user.save();
  }
};

exports.connect = () => {

  let maxConnectTimes = 0;

  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV !== 'production') {
      mongoose.set('debug', true);
    }

    mongoose.connection.on('disconnected', () => {

      maxConnectTimes++;

      if (maxConnectTimes < 5) {
        mongoose.connect(db);
      } else {
        throw new Error('fail to connect');
      }
    });

    mongoose.connection.on('error', err => {

      console.log(err);

      maxConnectTimes++;

      if (maxConnectTimes < 5) {
        mongoose.connect(db);
      } else {
        throw new Error('fail to connect');
      }
    });

    mongoose.connection.once('open', () => {
      resolve();
      console.log('MongoDB Connected successfully!');
    });

    mongoose.connect(db);
  });
};
