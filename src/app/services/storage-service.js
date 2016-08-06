var fs = require('fs');
var _ = require('lodash');

var removeFilesInDir = function(dirPath) {
    fs.readdir(dirPath, function(err, files) {
        if (err) {
            process.stdout.write(JSON.stringify(err));
        } else {
            if (files.length > 0) {
                _.each(files, function(file) {
                    var filePath = dirPath + file;
                    fs.stat(filePath, function(err, stats) {
                        if (err) {
                            process.stdout.write(JSON.stringify(err));
                        } else {
                            if (stats.isFile()) {
                                fs.unlink(filePath, function(err) {
                                    if (err) {
                                        process.stdout.write(
                                            JSON.stringify(err)
                                        );
                                    }
                                });
                            }
                        }
                    });
                });
            }
        }
    });
};

module.exports = {
    removeFilesInDir: removeFilesInDir
};
