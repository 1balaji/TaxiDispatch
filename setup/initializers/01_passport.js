'use strict';

var log = require('winston-wrapper')(module);
var config = require('config');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('user');

module.exports = function() {
    passport.use(new LocalStrategy({
            usernameField: 'login',
            passwordField: 'password'
        },
        function(login, password, done) {
            User.findOne({ login : login }, function(err, user) {
                if (err) { return done(err); }
                if (!user) {
                    return done(null, false, { message: 'Incorrect username.' });
                }
                if (!user.checkPassword(password)) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                return done(null, user);
            });
        }
    ));

    passport.serializeUser(function(user, done) {
        log.info('serializeUser userName:', user.login);
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            if (err) {
                done(err)
            } else {
                log.info('deserializeUser userName:', user.login);
                done(null, user);
            }
        });
    });
};