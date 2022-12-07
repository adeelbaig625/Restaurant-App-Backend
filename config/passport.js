const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const passport = require("passport");
const User = require("../Model/User");
const Admin = require("../Model/Admin");
const config = require("../config/default");
const secretKey = config.secretKey;
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secretKey;
module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      if (jwt_payload.isAdmin) {
        console.log(jwt_payload);
        Admin.findById(jwt_payload.id).then((user) => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        });
      } else {
        User.findById(jwt_payload.id).then((user) => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        });
      }
    })
  );
};
