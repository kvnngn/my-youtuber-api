const debug = require ('debug') ('app:home');
const path = require ('path');
const config = require (path.resolve ('./config'));

exports.home = function () {
  return function (req, res, next) {
    const text = 'Api fonctionnelle en version ' + config.version + '.';
    debug (text);
    res.send (text);
    return res;
  };
};
