var fs = require('fs');
var _ = require('lodash');

var removeFilesInDir = function(dirPath, cb) {
    fs.readdir(dirPath, function(err, files) {
        if (err) {
            process.stdout.write('err 1:' + JSON.stringify(err));
            cb();
        } else {
            if (files.length > 0) {
                _.each(files, function(file) {
                    if (file === '.gitignore'){
                        return;
                    }
                    var filePath = dirPath + '/' + file;
                    try {
                        var stats = fs.statSync(filePath);
                        if (stats.isFile()) {
                            try {
                                fs.unlinkSync(filePath);
                            } catch (err) {
                                process.stdout.write(
                                    'can`t unlink a file: ' +
                                    JSON.stringify(err)
                                );
                            }
                        }
                    } catch (err) {
                        process.stdout.write(
                            'err2: ' + JSON.stringify(err)
                        );
                    }
                });
                cb();
            } else {
                cb();
            }
        }
    });
};

module.exports = {
    removeFilesInDir: removeFilesInDir
};
