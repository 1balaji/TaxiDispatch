'use strict';

var config = require('config');
var log = require('winston-wrapper')(module);

var express = require('express');
var bootable = require('bootable');
var bootableEnv = require('bootable-environment');

var app = bootable(express());

// Setup initializers
app.phase(bootable.initializers('setup/initializers/'));

// Setup environments
app.phase(bootableEnv('setup/environments/', app));

// Setup routes
app.phase(bootable.routes('routes/', app));

// Boot app
app.boot(function(err) {
    if (err) throw err;
    var server = require('http').createServer(app);
    server.listen(config.get('port'), function() {
        log.info('Express server listening on port ' + config.get('port'));
    });

    // Socket
    var io = require('./socket')(server);
    app.set('io', io);
});





















//app.use(function(err, req, res, next) {
//    if (typeof err == 'number') {
//        err = new HttpError(err);
//    }
//
//    if (err instanceof HttpError) {
//        res.sendHttpError(err);
//    } else {
//        if (app.get('env') == 'development') {
//            express.errorHandler()(err, req, res, next);
//        } else {
//            log.error(err);
//            err = new HttpError(500);
//            res.sendHttpError(err);
//        }
//    }
//});
