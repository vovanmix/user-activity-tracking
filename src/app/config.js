var path = require('path');

var config = module.exports;

config.root = path.resolve(__dirname + '/../../');

switch (process.env.NODE_ENV) {
case 'testing':
    //todo: mock some modules to test them
    config.storage = config.root + '/mock-storage';
    break;
case 'production':
    config.storage = config.root + '/storage';
    break;
}
